import { useEffect, useState } from "react";
import { obtenerReporteGrasa, type ReporteGrasa } from "../../api/reportes";
import ReporteGrasaCard from "./ReporteGrasaCard";

// ✅ Agregar la prop umbral
interface Props {
  umbral: number;
}

const ReporteGrasaList = ({ umbral }: Props) => {
  const [reportes, setReportes] = useState<ReporteGrasa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const data = await obtenerReporteGrasa(umbral);
        setReportes(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Error al cargar el reporte");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [umbral]);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reportes.map((rep) => (
        <ReporteGrasaCard key={rep.id_usuario} reporte={rep} />
      ))}
    </div>
  );
};

export default ReporteGrasaList;