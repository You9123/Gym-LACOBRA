import { useState, useEffect } from "react";
import { obtenerDashboardCliente, type MedidaCliente } from "../api/usuarios";

interface Props {
  correo: string; // Cambiado de clienteId a correo
}

function formatFecha(str: string | null | undefined): string {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("es-CR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function MetricaTarjeta({ label, valor, unidad }: { label: string; valor: number | null | undefined; unidad: string }) {
  return (
    <div className="flex flex-col gap-1 bg-slate-800 rounded-xl p-4 border border-slate-700">
      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-semibold text-white">
        {valor != null ? `${valor}` : "—"}
      </span>
      {valor != null && (
        <span className="text-xs text-slate-400">{unidad}</span>
      )}
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

export default function MedidasCliente({ correo }: Props) {
  const [medidas, setMedidas] = useState<MedidaCliente[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [verHistorial, setVerHistorial] = useState(false);

  useEffect(() => {
    obtenerDashboardCliente(correo)
      .then((res) => { 
        // Asegurarse de que las medidas vengan ordenadas por fecha descendente
        const medidasOrdenadas = [...res.medidas].sort((a, b) => 
          new Date(b.fecha_medicion || 0).getTime() - new Date(a.fecha_medicion || 0).getTime()
        );
        setMedidas(medidasOrdenadas); 
        setLoading(false); 
      })
      .catch((err: Error) => { setError(err.message); setLoading(false); });
  }, [correo]);

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
      Cargando medidas…
    </div>
  );

  if (error) return (
    <div className="rounded-xl bg-red-950 border border-red-800 text-red-300 text-sm p-4">
      {error}
    </div>
  );

  if (medidas.length === 0) return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-white">Medidas corporales</h2>
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 text-center text-slate-500 text-sm">
        Sin registros de medidas aún.
      </div>
    </div>
  );

  const ultima = medidas[0];
  const anteriores = medidas.slice(1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Medidas corporales</h2>
        <span className="text-xs text-slate-500">
          Última medición: {formatFecha(ultima.fecha_medicion)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricaTarjeta label="Peso" valor={ultima.peso} unidad="kg" />
        <MetricaTarjeta label="Altura" valor={ultima.altura} unidad="m" />
        <MetricaTarjeta label="% Grasa" valor={ultima.porcentaje_grasa} unidad="%" />
        <MetricaTarjeta label="Masa muscular" valor={ultima.masa_muscular} unidad="kg" />
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Circunferencias</p>
        <MedidaCorporal label="Cuello" valor={ultima.cuello} />
        <MedidaCorporal label="Pecho" valor={ultima.pecho} />
        <MedidaCorporal label="Brazo" valor={ultima.brazo} />
        <MedidaCorporal label="Cintura" valor={ultima.cintura} />
        <MedidaCorporal label="Cadera" valor={ultima.cadera} />
        <MedidaCorporal label="Pierna" valor={ultima.pierna} />
      </div>

      {anteriores.length > 0 && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setVerHistorial(!verHistorial)}
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors w-fit"
          >
            <span>{verHistorial ? "▲" : "▼"}</span>
            {verHistorial ? "Ocultar historial" : `Ver historial (${anteriores.length} registros anteriores)`}
          </button>

          {verHistorial && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-xs text-slate-500 uppercase tracking-wider p-3">Fecha</th>
                    <th className="text-right text-xs text-slate-500 uppercase tracking-wider p-3">Peso</th>
                    <th className="text-right text-xs text-slate-500 uppercase tracking-wider p-3">% Grasa</th>
                    <th className="text-right text-xs text-slate-500 uppercase tracking-wider p-3">Muscular</th>
                    <th className="text-right text-xs text-slate-500 uppercase tracking-wider p-3">Cintura</th>
                  </table>
                </thead>
                <tbody>
                  {anteriores.map((m) => (
                    <tr key={m.id_historial} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-slate-400">{formatFecha(m.fecha_medicion)}</td>
                      <td className="p-3 text-right text-slate-300">{m.peso != null ? `${m.peso} kg` : "—"}</td>
                      <td className="p-3 text-right text-slate-300">{m.porcentaje_grasa != null ? `${m.porcentaje_grasa}%` : "—"}</td>
                      <td className="p-3 text-right text-slate-300">{m.masa_muscular != null ? `${m.masa_muscular} kg` : "—"}</td>
                      <td className="p-3 text-right text-slate-300">{m.cintura != null ? `${m.cintura} cm` : "—"}</td>
                    </table>
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