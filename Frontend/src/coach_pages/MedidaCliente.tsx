import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrarMedida, actualizarMedidaPorCliente, registrarHistorial } from '../api/medidas';
import { obtenerUsuarioPorId, type Usuario } from '../api/usuarios';

type TipoAlerta = 'exito' | 'error' | 'advertencia';
interface Alerta { tipo: TipoAlerta; mensaje: string; }

const colorAlerta: Record<TipoAlerta, string> = {
  exito:       'bg-emerald-900 border-emerald-600 text-emerald-300',
  error:       'bg-red-900 border-red-600 text-red-300',
  advertencia: 'bg-yellow-900 border-yellow-600 text-yellow-300',
};
const iconoAlerta: Record<TipoAlerta, string> = {
  exito: '✔', error: '✖', advertencia: '⚠',
};

export default function MedidaCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idCliente = Number(id);

  const [alumno, setAlumno]   = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta]   = useState<Alerta | null>(null);

  const [peso,    setPeso]    = useState('');
  const [altura,  setAltura]  = useState('');
  const [grasa,   setGrasa]   = useState('');
  const [musculo, setMusculo] = useState('');
  const [cuello,  setCuello]  = useState('');
  const [cintura, setCintura] = useState('');
  const [cadera,  setCadera]  = useState('');
  const [pecho,   setPecho]   = useState('');
  const [brazo,   setBrazo]   = useState('');
  const [pierna,  setPierna]  = useState('');

  const mostrarAlerta = (tipo: TipoAlerta, mensaje: string, autoCerrar = true) => {
    setAlerta({ tipo, mensaje });
    if (autoCerrar) setTimeout(() => setAlerta(null), 4500);
  };

  useEffect(() => {
    async function cargarAlumno() {
      try {
        const data = await obtenerUsuarioPorId(idCliente);
        setAlumno(data);
      } catch {
        mostrarAlerta('error', 'No se pudieron cargar los datos del alumno. Verifica la conexión.');
      }
    }
    cargarAlumno();
  }, [idCliente]);

  const guardarMedidasYHistorial = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlerta(null);

    if (!peso || !altura) {
      mostrarAlerta('advertencia', 'El peso y la altura son obligatorios para continuar.');
      return;
    }

    setLoading(true);
    try {
      // 1. Upsert en MEDIDA
      try {
        await registrarMedida({
          id_cliente: idCliente,
          peso_actual: peso,
          altura,
          porcentaje_grasa_actual: grasa || null,
          masa_muscular_actual: musculo || null
        });
      } catch (medidaErr: any) {
        const responseStr = JSON.stringify(medidaErr.response?.data || '');
        const esDuplicado =
          responseStr.includes('Ya existe') ||
          responseStr.includes('unique') ||
          responseStr.includes('already exists') ||
          medidaErr.response?.status === 400;

        if (esDuplicado) {
          await actualizarMedidaPorCliente(idCliente, {
            id_cliente: idCliente,
            peso_actual: peso,
            altura,
            porcentaje_grasa_actual: grasa || null,
            masa_muscular_actual: musculo || null
          });
        } else {
          throw medidaErr;
        }
      }

      // 2. Insertar en historial
      await registrarHistorial({
        id_cliente: idCliente,
        peso, altura,
        porcentaje_grasa: grasa || null,
        masa_muscular: musculo || null,
        cuello:  cuello  || null,
        cintura: cintura || null,
        cadera:  cadera  || null,
        pecho:   pecho   || null,
        brazo:   brazo   || null,
        pierna:  pierna  || null,
        fecha_medicion: new Date().toISOString().split('T')[0]
      });

      mostrarAlerta(
        'exito',
        `Evaluación de ${alumno?.nombre} ${alumno?.apellido} guardada correctamente.`,
        false
      );
      setTimeout(() => navigate('/coach/dashboard'), 1800);

    } catch (err: any) {
      const data = err.response?.data;
      if (data) {
        const msg = data.error || data.mensaje || data.detail;
        mostrarAlerta('error', msg
          ? `No se pudo guardar: ${msg}`
          : 'El servidor rechazó los datos. Revisa los valores ingresados.'
        );
      } else {
        mostrarAlerta('error', 'Sin respuesta del servidor. Verifica tu conexión e intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-purple-400">Evaluación Antropométrica</h1>
        <p className="text-slate-400 mt-1">
          Registrando datos físicos para:{' '}
          <span className="text-white font-semibold">
            {alumno ? `${alumno.nombre} ${alumno.apellido}` : (
              <span className="animate-pulse text-slate-500">Cargando alumno...</span>
            )}
          </span>
        </p>
      </div>

      {/* Alerta inline */}
      {alerta && (
        <div className={`flex items-center gap-3 border rounded-lg px-4 py-3 text-sm font-medium ${colorAlerta[alerta.tipo]}`}>
          <span>{iconoAlerta[alerta.tipo]}</span>
          <span>{alerta.mensaje}</span>
          <button onClick={() => setAlerta(null)} className="ml-auto opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      <form onSubmit={guardarMedidasYHistorial} noValidate className="space-y-6">

        {/* SECCIÓN 1 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-slate-300 border-b border-slate-800 pb-2">
            1. Composición Corporal General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Peso Total (kg) *',           value: peso,    set: setPeso,    placeholder: 'Ej: 78.50' },
              { label: 'Estatura / Altura (m) *',     value: altura,  set: setAltura,  placeholder: 'Ej: 1.75'  },
              { label: 'Índice de Masa Grasa (%)',     value: grasa,   set: setGrasa,   placeholder: 'Ej: 14.2'  },
              { label: 'Masa Muscular Estimada (kg)',  value: musculo, set: setMusculo, placeholder: 'Ej: 36.8'  },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="text-sm font-medium text-slate-400">{label}</label>
                <input
                  type="number" step="0.01" value={value}
                  onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 2 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-purple-400 border-b border-slate-800 pb-2">
            2. Perímetros Anatómicos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Cuello (cm)',        value: cuello,  set: setCuello,  placeholder: 'Ej: 38.5'  },
              { label: 'Cintura (cm)',       value: cintura, set: setCintura, placeholder: 'Ej: 82.0'  },
              { label: 'Cadera (cm)',        value: cadera,  set: setCadera,  placeholder: 'Ej: 96.4'  },
              { label: 'Pecho / Torso (cm)', value: pecho,   set: setPecho,   placeholder: 'Ej: 102.1' },
              { label: 'Brazo / Bíceps (cm)',value: brazo,   set: setBrazo,   placeholder: 'Ej: 35.5'  },
              { label: 'Pierna / Muslo (cm)',value: pierna,  set: setPierna,  placeholder: 'Ej: 58.2'  },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="text-sm font-medium text-slate-400">{label}</label>
                <input
                  type="number" step="0.1" value={value}
                  onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Guardando evaluación...' : '💾 Registrar Evaluación'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/coach/dashboard')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 px-6 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}