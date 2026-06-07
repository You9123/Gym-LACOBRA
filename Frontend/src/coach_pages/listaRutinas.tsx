// ListaRutinas.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerRutinas, eliminarRutina, obtenerDetallesPorRutina, type Rutina, type DetalleRutinaConNombre } from '../api/rutinas';

export default function ListaRutinas() {
  const navigate = useNavigate();
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [cargando, setCargando] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [detalles, setDetalles] = useState<Record<number, DetalleRutinaConNombre[]>>({});
  const [cargandoDetalle, setCargandoDetalle] = useState<number | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    cargarRutinas();
  }, []);

  const cargarRutinas = async () => {
    try {
      setCargando(true);
      const data = await obtenerRutinas();
      setRutinas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const toggleExpandir = async (id: number) => {
    if (expandido === id) {
      setExpandido(null);
      return;
    }
    setExpandido(id);
    if (!detalles[id]) {
      try {
        setCargandoDetalle(id);
        const data = await obtenerDetallesPorRutina(id);
        setDetalles(prev => ({ ...prev, [id]: data }));
      } catch (err) {
        console.error(err);
      } finally {
        setCargandoDetalle(null);
      }
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      setEliminandoId(id);
      await eliminarRutina(id);
      setRutinas(prev => prev.filter(r => r.id_rutina !== id));
      setConfirmId(null);
      if (expandido === id) setExpandido(null);
    } catch (err) {
      alert('Error al eliminar la rutina.');
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400">Catálogo de Rutinas</h1>
          <p className="text-slate-400 text-sm mt-1">Gestiona las plantillas del gimnasio</p>
        </div>
        <button
          onClick={() => navigate('/coach/rutinas/crear')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg transition text-sm"
        >
          + Nueva Rutina
        </button>
      </div>

      {/* Estado de carga */}
      {cargando && (
        <div className="text-center py-16 text-slate-400">
          <div className="animate-spin text-4xl mb-3">⚙️</div>
          <p>Cargando rutinas...</p>
        </div>
      )}

      {/* Sin rutinas */}
      {!cargando && rutinas.length === 0 && (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-lg">No hay rutinas creadas aún.</p>
          <button
            onClick={() => navigate('/coach/rutinas/crear')}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-lg text-sm"
          >
            Crear primera rutina
          </button>
        </div>
      )}

      {/* Lista de rutinas */}
      <div className="space-y-3">
        {rutinas.map(rutina => (
          <div
            key={rutina.id_rutina}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
          >
            {/* Fila principal */}
            <div className="flex items-center justify-between p-4 gap-4">
              <button
                type="button"
                onClick={() => toggleExpandir(rutina.id_rutina)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 text-lg">
                    {expandido === rutina.id_rutina ? '▾' : '▸'}
                  </span>
                  <div>
                    <p className="text-white font-semibold">{rutina.nombre ?? 'Sin nombre'}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {rutina.objetivo ?? 'Sin objetivo'} •{' '}
                      {rutina.fecha_creacion
                        ? new Date(rutina.fecha_creacion).toLocaleDateString('es-CR')
                        : '—'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Botones acción */}
              <div className="flex gap-2 shrink-0">
                {confirmId === rutina.id_rutina ? (
                  // Confirmación de eliminación
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-xs font-medium">¿Eliminar?</span>
                    <button
                      type="button"
                      onClick={() => handleEliminar(rutina.id_rutina)}
                      disabled={eliminandoId === rutina.id_rutina}
                      className="bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      {eliminandoId === rutina.id_rutina ? '...' : 'Sí, eliminar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmId(rutina.id_rutina)}
                    className="bg-red-900 hover:bg-red-800 text-red-300 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                  >
                    🗑 Eliminar
                  </button>
                )}
              </div>
            </div>

            {/* Detalle expandido */}
            {expandido === rutina.id_rutina && (
              <div className="border-t border-slate-800 bg-slate-950 px-5 py-4 space-y-3">
                {rutina.descripcion && (
                  <p className="text-slate-400 text-sm italic">{rutina.descripcion}</p>
                )}

                {cargandoDetalle === rutina.id_rutina ? (
                  <p className="text-slate-500 text-sm">Cargando ejercicios...</p>
                ) : detalles[rutina.id_rutina]?.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Ejercicios</p>
                    {detalles[rutina.id_rutina].map((d, i) => (
                      <div
                        key={d.id_detalle_rutina}
                        className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-500 text-xs font-bold w-5">{i + 1}.</span>
                          <span className="text-slate-200 text-sm font-medium">{d.ejercicio_nombre}</span>
                        </div>
                        <span className="text-slate-400 text-xs">
                          {d.series}x{d.repeticiones} • {d.descanso_segundos}s descanso
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Esta rutina no tiene ejercicios registrados.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Volver */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/coach/dashboard')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-5 rounded-lg text-sm"
        >
          ← Volver al Dashboard
        </button>
      </div>
    </div>
  );
}