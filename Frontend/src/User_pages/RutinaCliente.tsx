import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDashboardCliente, type RutinaCliente } from "../api/usuarios";
import { obtenerDetallesPorRutina, type DetalleRutinaConNombre } from "../api/rutinas";

function formatFecha(str: string | null | undefined): string {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("es-CR", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function BadgeActiva() {
  return (
    <span className="inline-flex items-center text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full px-3 py-0.5">
      Activa
    </span>
  );
}

function FilaEjercicio({ detalle, index }: { detalle: DetalleRutinaConNombre; index: number }) {
  return (
    <tr className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/40 transition-colors">
      <td className="p-3 text-slate-500 text-sm w-8">{index + 1}</td>
      <td className="p-3 text-slate-200 text-sm font-medium">{detalle.ejercicio_nombre}</td>
      <td className="p-3 text-right text-slate-400 text-sm">
        {detalle.series != null ? `${detalle.series} series` : "—"}
      </td>
      <td className="p-3 text-right text-slate-400 text-sm">
        {detalle.repeticiones != null ? `${detalle.repeticiones} reps` : "—"}
      </td>
      <td className="p-3 text-right text-slate-400 text-sm">
        {detalle.descanso_segundos != null ? `${detalle.descanso_segundos}s` : "—"}
      </td>
    </tr>
  );
}

export default function RutinaCliente() {
  const navigate = useNavigate();
  const [rutina, setRutina] = useState<RutinaCliente | null>(null);
  const [detalles, setDetalles] = useState<DetalleRutinaConNombre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [correo, setCorreo] = useState<string | null>(null);

  useEffect(() => {
    const sesion = localStorage.getItem("sesion");
    if (sesion) {
      try {
        const parsed = JSON.parse(sesion);
        setCorreo(parsed.correo);
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!correo) return;

    obtenerDashboardCliente(correo)
      .then(async (res) => {
        setRutina(res.rutina);
        if (res.rutina) {
          const ejercicios = await obtenerDetallesPorRutina(res.rutina.id_rutina);
          setDetalles(ejercicios);
        }
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [correo]);

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
      Cargando rutina…
    </div>
  );

  if (error) return (
    <div className="rounded-xl bg-red-950 border border-red-800 text-red-300 text-sm p-4">
      {error}
    </div>
  );

  if (!rutina) return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-white">Rutina activa</h2>
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 text-center text-slate-500 text-sm">
        No tienes una rutina asignada aún.
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Rutina activa</h2>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xl font-semibold text-white">{rutina.nombre_rutina}</p>
          <BadgeActiva />
        </div>

        {rutina.objetivo && (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Objetivo</span>
            <span className="text-sm text-slate-300">{rutina.objetivo}</span>
          </div>
        )}

        {rutina.descripcion && (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Descripción</span>
            <span className="text-sm text-slate-400">{rutina.descripcion}</span>
          </div>
        )}

        {rutina.observaciones && (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Observaciones del coach</span>
            <span className="text-sm text-slate-400 italic">"{rutina.observaciones}"</span>
          </div>
        )}

        <div className="flex gap-6 pt-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Asignada</span>
            <span className="text-xs text-slate-400">{formatFecha(rutina.fecha_asignacion)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Creada</span>
            <span className="text-xs text-slate-400">{formatFecha(rutina.fecha_creacion)}</span>
          </div>
        </div>
      </div>

      {detalles.length > 0 ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Ejercicios ({detalles.length})
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-3 text-left text-xs text-slate-600 w-8">#</th>
                <th className="p-3 text-left text-xs text-slate-500 uppercase tracking-wider">Ejercicio</th>
                <th className="p-3 text-right text-xs text-slate-500 uppercase tracking-wider">Series</th>
                <th className="p-3 text-right text-xs text-slate-500 uppercase tracking-wider">Reps</th>
                <th className="p-3 text-right text-xs text-slate-500 uppercase tracking-wider">Descanso</th>
              </tr>
            </thead>
            <tbody>
              {detalles
                .sort((a, b) => (a.orden_ejercicio ?? 0) - (b.orden_ejercicio ?? 0))
                .map((d, i) => (
                  <FilaEjercicio key={d.id_detalle_rutina} detalle={d} index={i} />
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 text-center text-slate-500 text-sm">
          Esta rutina no tiene ejercicios cargados aún.
        </div>
      )}
    </div>
  );
}