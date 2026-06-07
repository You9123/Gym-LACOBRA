import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerDashboardCliente, type MedidaCliente } from "../api/usuarios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

// ─────────────────────────────────────────────────────────────
//  Funciones auxiliares
// ─────────────────────────────────────────────────────────────
function formatFecha(str: string | null | undefined): string {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatFechaCorta(str: string | null | undefined): string {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
  });
}

// ─────────────────────────────────────────────────────────────
//  Configuración del gráfico
// ─────────────────────────────────────────────────────────────
type MetricaKey = "peso" | "porcentaje_grasa" | "masa_muscular" | "cintura";

interface MetricaConfig {
  key: MetricaKey;
  label: string;
  unidad: string;
  color: string;
}

const METRICAS: MetricaConfig[] = [
  { key: "peso", label: "Peso", unidad: "kg", color: "#818cf8" },
  { key: "porcentaje_grasa", label: "% Grasa", unidad: "%", color: "#f87171" },
  { key: "masa_muscular", label: "Masa muscular", unidad: "kg", color: "#34d399" },
  { key: "cintura", label: "Cintura", unidad: "cm", color: "#fbbf24" },
];

function CustomTooltip({ active, payload, label, metrica }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-semibold" style={{ color: metrica.color }}>
        {payload[0].value}{" "}
        <span className="text-xs font-normal text-slate-400">{metrica.unidad}</span>
      </p>
    </div>
  );
}

function GraficoMedidas({ medidas }: { medidas: MedidaCliente[] }) {
  const [metricaActiva, setMetricaActiva] = useState<MetricaKey>("peso");

  // Ordenar cronológicamente y convertir valores a número
  const datos = [...medidas]
    .sort(
      (a, b) =>
        new Date(a.fecha_medicion || 0).getTime() -
        new Date(b.fecha_medicion || 0).getTime()
    )
    .map((m) => ({
      fecha: formatFechaCorta(m.fecha_medicion),
      fechaLarga: formatFecha(m.fecha_medicion),
      valor: m[metricaActiva] != null ? parseFloat(m[metricaActiva] as unknown as string) : null,
    }))
    .filter((d) => d.valor !== null);

  const metrica = METRICAS.find((m) => m.key === metricaActiva)!;
  const ultimo = datos[datos.length - 1];
  const delta =
    datos.length >= 2
      ? (datos[datos.length - 1].valor as number) - (datos[0].valor as number)
      : null;
  const deltaPositivo = delta !== null && delta > 0;
  const deltaNeutro = delta === 0;

  if (datos.length < 2) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        Se necesitan al menos 2 registros para mostrar el gráfico.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado del gráfico */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            Evolución — {metrica.label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-white">
              {ultimo.valor}
              <span className="text-sm font-normal text-slate-400 ml-1">{metrica.unidad}</span>
            </span>
            {delta !== null && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  deltaNeutro
                    ? "bg-slate-700 text-slate-400"
                    : deltaPositivo
                    ? "bg-red-900/60 text-red-300"
                    : "bg-emerald-900/60 text-emerald-300"
                }`}
              >
                {deltaPositivo ? "+" : ""}
                {delta.toFixed(1)} {metrica.unidad} total
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {METRICAS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetricaActiva(m.key)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                metricaActiva === m.key
                  ? "border-transparent text-slate-900 font-semibold"
                  : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300"
              }`}
              style={metricaActiva === m.key ? { backgroundColor: m.color } : {}}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datos} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="fecha"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip
              content={<CustomTooltip metrica={metrica} />}
              cursor={{ stroke: "#334155", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke={metrica.color}
              strokeWidth={2}
              dot={{ fill: metrica.color, strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: metrica.color, stroke: "#0f172a", strokeWidth: 2 }}
            />
            {ultimo && (
              <ReferenceDot
                x={ultimo.fecha}
                y={ultimo.valor}
                r={5}
                fill={metrica.color}
                stroke="#0f172a"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Rango de fechas */}
      <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-800 pt-3">
        <span>{datos[0].fechaLarga}</span>
        <span className="text-slate-700">→</span>
        <span>{ultimo.fechaLarga}</span>
      </div>
    </div>
  );
}

function MedidaCorporal({ label, valor }: { label: string; valor: number | null | undefined }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-800 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-200">
        {valor != null ? `${valor} cm` : "—"}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Componente principal
// ─────────────────────────────────────────────────────────────
export default function MedidasPage() {
  const { correo: correoParam } = useParams();
  const navigate = useNavigate();
  const [medidas, setMedidas] = useState<MedidaCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verHistorial, setVerHistorial] = useState(false);

  // Obtener correo desde parámetro o localStorage
  const correo = correoParam ?? (() => {
    const sesion = localStorage.getItem("sesion");
    if (sesion) {
      try {
        const parsed = JSON.parse(sesion);
        return parsed.correo;
      } catch {
        return null;
      }
    }
    return null;
  })();

  useEffect(() => {
    if (!correo) {
      setError("No se encontró el correo del cliente.");
      setLoading(false);
      return;
    }

    obtenerDashboardCliente(correo)
      .then((data) => {
        // Ordenar de más reciente a más antigua (para la tabla)
        const ordenadas = [...data.medidas].sort(
          (a, b) =>
            new Date(b.fecha_medicion || 0).getTime() -
            new Date(a.fecha_medicion || 0).getTime()
        );
        setMedidas(ordenadas);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [correo]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-slate-400">Cargando medidas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950 border border-red-800 text-red-300 rounded-lg p-4">
        {error}
      </div>
    );
  }

  if (medidas.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center">
        <p className="text-slate-400">No hay registros de medidas aún.</p>
      </div>
    );
  }

  const ultima = medidas[0];
  const anteriores = medidas.slice(1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Historial de medidas</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          ← Volver
        </button>
      </div>

      {/* Tarjetas resumen última medición */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase">Peso</p>
          <p className="text-xl font-semibold text-white">
            {ultima.peso != null ? `${ultima.peso} kg` : "—"}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase">Altura</p>
          <p className="text-xl font-semibold text-white">
            {ultima.altura != null ? `${ultima.altura} m` : "—"}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase">% Grasa</p>
          <p className="text-xl font-semibold text-white">
            {ultima.porcentaje_grasa != null ? `${ultima.porcentaje_grasa}%` : "—"}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase">Masa muscular</p>
          <p className="text-xl font-semibold text-white">
            {ultima.masa_muscular != null ? `${ultima.masa_muscular} kg` : "—"}
          </p>
        </div>
      </div>

      {/* Gráfico de evolución */}
      {medidas.length >= 2 && <GraficoMedidas medidas={medidas} />}

      {/* Circunferencias (solo si existen en la última medición) */}
      {(ultima.cuello || ultima.pecho || ultima.cintura || ultima.cadera || ultima.brazo || ultima.pierna) && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
            Circunferencias (última medición)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            <MedidaCorporal label="Cuello" valor={ultima.cuello} />
            <MedidaCorporal label="Pecho" valor={ultima.pecho} />
            <MedidaCorporal label="Brazo" valor={ultima.brazo} />
            <MedidaCorporal label="Cintura" valor={ultima.cintura} />
            <MedidaCorporal label="Cadera" valor={ultima.cadera} />
            <MedidaCorporal label="Pierna" valor={ultima.pierna} />
          </div>
        </div>
      )}

      {/* Historial completo (colapsable) */}
      {anteriores.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setVerHistorial(!verHistorial)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-300">
              Historial de medidas ({anteriores.length} registros anteriores)
            </span>
            <i className={`ti ${verHistorial ? "ti-chevron-up" : "ti-chevron-down"} text-slate-400`} />
          </button>

          {verHistorial && (
            <div className="border-t border-slate-800 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50">
                    <th className="text-left text-xs text-slate-500 uppercase p-3">Fecha</th>
                    <th className="text-right text-xs text-slate-500 uppercase p-3">Peso (kg)</th>
                    <th className="text-right text-xs text-slate-500 uppercase p-3">% Grasa</th>
                    <th className="text-right text-xs text-slate-500 uppercase p-3">Muscular (kg)</th>
                    <th className="text-right text-xs text-slate-500 uppercase p-3">Cintura (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {anteriores.map((m) => (
                    <tr
                      key={m.id_historial}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-3 text-slate-400">{formatFecha(m.fecha_medicion)}</td>
                      <td className="p-3 text-right text-slate-200">
                        {m.peso != null ? m.peso : "—"}
                      </td>
                      <td className="p-3 text-right text-slate-200">
                        {m.porcentaje_grasa != null ? m.porcentaje_grasa : "—"}
                      </td>
                      <td className="p-3 text-right text-slate-200">
                        {m.masa_muscular != null ? m.masa_muscular : "—"}
                      </td>
                      <td className="p-3 text-right text-slate-200">
                        {m.cintura != null ? m.cintura : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}