import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerRutinas, asignarRutinaACliente, type Rutina } from '../api/rutinas';
import { obtenerUsuarioPorId, type Usuario } from '../api/usuarios';

type TipoAlerta = 'exito' | 'error' | 'advertencia';

interface Alerta {
  tipo: TipoAlerta;
  mensaje: string;
}

const colorAlerta: Record<TipoAlerta, string> = {
  exito:      'bg-emerald-900 border-emerald-600 text-emerald-300',
  error:      'bg-red-900 border-red-600 text-red-300',
  advertencia:'bg-yellow-900 border-yellow-600 text-yellow-300',
};

const iconoAlerta: Record<TipoAlerta, string> = {
  exito:      '✔',
  error:      '✖',
  advertencia:'⚠',
};

export default function AsignarRutina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idCliente = Number(id);

  const [alumno, setAlumno]                     = useState<Usuario | null>(null);
  const [rutinas, setRutinas]                   = useState<Rutina[]>([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<number | string>('');
  const [obs, setObs]                           = useState('');
  const [alerta, setAlerta]                     = useState<Alerta | null>(null);
  const [guardando, setGuardando]               = useState(false);

  const mostrarAlerta = (tipo: TipoAlerta, mensaje: string) => {
    setAlerta({ tipo, mensaje });
    setTimeout(() => setAlerta(null), 4000);
  };

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const u = await obtenerUsuarioPorId(idCliente);
        setAlumno(u);
        const r = await obtenerRutinas();
        setRutinas(r);
      } catch {
        mostrarAlerta('error', 'No se pudieron cargar los datos del alumno o las rutinas.');
      }
    }
    cargarCatalogos();
  }, [idCliente]);

  const ejecutarAsignacion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rutinaSeleccionada) {
      mostrarAlerta('advertencia', 'Debes seleccionar una rutina antes de continuar.');
      return;
    }

    try {
      setGuardando(true);
      await asignarRutinaACliente({
        id_cliente: idCliente,
        id_rutina: Number(rutinaSeleccionada),
        observaciones: obs
      });
      mostrarAlerta('exito', `Plan de entrenamiento asignado correctamente a ${alumno?.nombre} ${alumno?.apellido}.`);
      setTimeout(() => navigate('/coach/dashboard'), 1800);
    } catch {
      mostrarAlerta('error', 'Ocurrió un error al asignar el plan. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">

      {/* Alerta inline */}
      {alerta && (
        <div className={`flex items-center gap-3 border rounded-lg px-4 py-3 text-sm font-medium transition-all ${colorAlerta[alerta.tipo]}`}>
          <span className="text-base">{iconoAlerta[alerta.tipo]}</span>
          <span>{alerta.mensaje}</span>
          <button onClick={() => setAlerta(null)} className="ml-auto opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-bold text-blue-400">
          Asignar Entrenamiento a{' '}
          {alumno ? `${alumno.nombre} ${alumno.apellido}` : (
            <span className="text-slate-500 animate-pulse">Cargando...</span>
          )}
        </h2>

        <form onSubmit={ejecutarAsignacion} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300">Seleccionar Rutina</label>
            <select
              required
              value={rutinaSeleccionada}
              onChange={e => setRutinaSeleccionada(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-blue-500 outline-none"
            >
              <option value="">-- Elige una rutina --</option>
              {rutinas.map(r => (
                <option key={r.id_rutina} value={r.id_rutina}>
                  {r.nombre} {r.objetivo ? `· ${r.objetivo}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Observaciones del Coach</label>
            <textarea
              value={obs}
              onChange={e => setObs(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 mt-1 text-white h-24 focus:border-blue-500 outline-none"
              placeholder="Ej: Enfocarse en técnica las primeras 2 semanas..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition"
            >
              {guardando ? 'Asignando...' : 'Vincular Plan'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/coach/dashboard')}
              className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}