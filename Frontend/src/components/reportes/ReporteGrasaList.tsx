import { useEffect, useState, useRef } from "react";
import { obtenerReporteGrasa, obtenerEvolucionGrasa, type ReporteGrasa, type EvolucionGrasa } from "../../api/reportes";
import ReporteGrasaCard from "./ReporteGrasaCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { exportToPDF } from "./pdfExport"; // Ajusta la ruta según tu proyecto

interface Props {
  umbral: number;
}

const ReporteGrasaList = ({ umbral }: Props) => {
  const [reportes, setReportes] = useState<ReporteGrasa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evolucion, setEvolucion] = useState<EvolucionGrasa[]>([]);
  const [cargandoEvolucion, setCargandoEvolucion] = useState(false);
  const [errorEvolucion, setErrorEvolucion] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Cargar clientes (siempre)
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setLoading(true);
        const data = await obtenerReporteGrasa(umbral);
        setReportes(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el reporte");
      } finally {
        setLoading(false);
      }
    };
    cargarClientes();
  }, [umbral]);

  // Cargar evolución (opcional, no bloquea)
  useEffect(() => {
    const cargarEvolucion = async () => {
      try {
        setCargandoEvolucion(true);
        const data = await obtenerEvolucionGrasa(umbral);
        setEvolucion(data);
        setErrorEvolucion(null);
      } catch (err) {
        console.warn("No se pudo cargar la evolución (endpoint quizás no implementado):", err);
        setErrorEvolucion("Gráfico no disponible");
      } finally {
        setCargandoEvolucion(false);
      }
    };
    cargarEvolucion();
  }, [umbral]);

  const handleExportPDF = () => {
    if (reportRef.current) {
      exportToPDF("reporte-pdf-content", `reporte_grasa_umbral_${umbral}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <p className="mt-2 text-slate-400">Cargando reporte...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (reportes.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-4xl mb-4">📭</p>
        <p>No hay clientes con grasa corporal &gt; {umbral}%</p>
        <p className="text-sm mt-2">
          Ajusta el umbral hacia abajo o registra medidas con porcentaje de grasa
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Botón de exportación */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExportPDF}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          📄 Exportar a PDF
        </button>
      </div>

      {/* Contenido que se capturará para el PDF */}
      <div id="reporte-pdf-content" ref={reportRef} className="bg-slate-900 p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-2">
          Reporte de clientes con grasa corporal &gt; {umbral}%
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Generado el {new Date().toLocaleDateString()}
        </p>

        {/* Gráfico de evolución (solo si hay datos y sin error) */}
        {!cargandoEvolucion && !errorEvolucion && evolucion.length > 0 && (
          <div className="mb-8 bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-cyan-400 mb-3">
              Evolución del promedio de grasa corporal
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucion}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" tick={{ fill: "#94a3b8" }} />
                  <YAxis tick={{ fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none" }} />
                  <Line
                    type="monotone"
                    dataKey="promedio_grasa"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Mensaje si el gráfico no está disponible */}
        {!cargandoEvolucion && errorEvolucion && (
          <div className="mb-8 text-center text-slate-500 text-sm p-4 bg-slate-800/30 rounded-lg">
            📈 Gráfico de evolución no disponible (endpoint pendiente)
          </div>
        )}

        {/* Tarjetas de clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportes.map((rep) => (
            <ReporteGrasaCard key={rep.id_usuario} reporte={rep} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReporteGrasaList;