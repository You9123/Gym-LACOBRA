import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrarMedida, actualizarMedidaPorCliente, registrarHistorial } from '../api/medidas';
import { obtenerUsuarioPorId, type Usuario } from '../api/usuarios';


export default function MedidaCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idCliente = Number(id);

  const [alumno, setAlumno] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

  // Campos Básicos de Composición Corporal
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [grasa, setGrasa] = useState('');
  const [musculo, setMusculo] = useState('');

  // Perímetros Anatómicos
  const [cuello, setCuello] = useState('');
  const [cintura, setCintura] = useState('');
  const [cadera, setCadera] = useState('');
  const [pecho, setPecho] = useState('');
  const [brazo, setBrazo] = useState('');
  const [pierna, setPierna] = useState('');

  useEffect(() => {
    async function cargarAlumno() {
      try {
        const data = await obtenerUsuarioPorId(idCliente);
        setAlumno(data);
      } catch (err) {
        console.error("Error al cargar datos del alumno:", err);
      }
    }
    cargarAlumno();
  }, [idCliente]);
const guardarMedidasYHistorial = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorFormulario(null);

  if (!peso || !altura) {
    setErrorFormulario('El Peso y la Altura son campos estrictamente obligatorios.');
    return;
  }

  setLoading(true);

  try {
    // 1. Upsert en MEDIDA
    try {
      console.log('📤 Enviando a MEDIDA:', { idCliente, peso, altura, grasa, musculo });
      await registrarMedida({
        id_cliente: idCliente,
        peso_actual: peso,
        altura: altura,
        porcentaje_grasa_actual: grasa || null,
        masa_muscular_actual: musculo || null
      });
      console.log('✅ MEDIDA insertada');
    } catch (medidaErr: any) {
      console.log('⚠️ Error MEDIDA raw:', JSON.stringify(medidaErr.response?.data));
      const responseStr = JSON.stringify(medidaErr.response?.data || '');
      const esDuplicado =
        responseStr.includes('Ya existe') ||
        responseStr.includes('unique') ||
        responseStr.includes('already exists') ||
        medidaErr.response?.status === 400;

      if (esDuplicado) {
        console.log('🔄 Detectado duplicado, actualizando...');
        await actualizarMedidaPorCliente(idCliente, {
          id_cliente: idCliente,
          peso_actual: peso,
          altura: altura,
          porcentaje_grasa_actual: grasa || null,
          masa_muscular_actual: musculo || null
        });
        console.log('✅ MEDIDA actualizada');
      } else {
        throw medidaErr;
      }
    }

    // 2. Insertar perímetros en historial manualmente
    console.log('📤 Enviando a HISTORIAL...');
    await registrarHistorial({
      id_cliente: idCliente,
      peso,
      altura,
      porcentaje_grasa: grasa || null,
      masa_muscular: musculo || null,
      cuello: cuello || null,
      cintura: cintura || null,
      cadera: cadera || null,
      pecho: pecho || null,
      brazo: brazo || null,
      pierna: pierna || null,
      fecha_medicion: new Date().toISOString().split('T')[0]
    });
    console.log('✅ HISTORIAL insertado');

    alert('¡Métricas guardadas correctamente!');
    navigate('/coach/dashboard');

  } catch (err: any) {
    console.error("❌ Error general:", err);
    console.error("❌ Response data:", err.response?.data);
    console.error("❌ Message:", err.message);
    if (err.response?.data) {
      const dataBackend = err.response.data;
      const msg = dataBackend.error || dataBackend.mensaje || dataBackend.detail || JSON.stringify(dataBackend);
      setErrorFormulario(`Django/Oracle dice: ${msg}`);
    } else {
      setErrorFormulario(`Error de comunicación con el servidor: ${err.message}`);
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
            {alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Cargando Alumno...'}
          </span>
        </p>
      </div>

      {errorFormulario && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-medium">
          ⚠️ {errorFormulario}
        </div>
      )}

      <form onSubmit={guardarMedidasYHistorial} noValidate className="space-y-6">

        {/* SECCIÓN 1: COMPOSICIÓN CORPORAL */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-slate-300 border-b border-slate-800 pb-2">
            1. Composición Corporal General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-400">Peso Total (kg) *</label>
              <input
                type="number"
                step="0.01"
                value={peso}
                onChange={e => setPeso(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                placeholder="Ej: 78.50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Estatura / Altura (m) *</label>
              <input
                type="number"
                step="0.01"
                value={altura}
                onChange={e => setAltura(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                placeholder="Ej: 1.75"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Índice de Masa Grasa (%)</label>
              <input
                type="number"
                step="0.1"
                value={grasa}
                onChange={e => setGrasa(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                placeholder="Ej: 14.2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Masa Muscular Estimada (kg)</label>
              <input
                type="number"
                step="0.1"
                value={musculo}
                onChange={e => setMusculo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                placeholder="Ej: 36.8"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: PERÍMETROS */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-purple-400 border-b border-slate-800 pb-2">
            2. Perímetros Anatómicos (Historial de Progreso)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-400">Cuello (cm)</label>
              <input type="number" step="0.1" value={cuello} onChange={e => setCuello(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                placeholder="Ej: 38.5" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Cintura (cm)</label>
              <input type="number" step="0.1" value={cintura} onChange={e => setCintura(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                placeholder="Ej: 82.0" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Cadera (cm)</label>
              <input type="number" step="0.1" value={cadera} onChange={e => setCadera(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                placeholder="Ej: 96.4" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Pecho / Torso (cm)</label>
              <input type="number" step="0.1" value={pecho} onChange={e => setPecho(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                placeholder="Ej: 102.1" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Brazo / Bíceps (cm)</label>
              <input type="number" step="0.1" value={brazo} onChange={e => setBrazo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                placeholder="Ej: 35.5" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400">Pierna / Muslo (cm)</label>
              <input type="number" step="0.1" value={pierna} onChange={e => setPierna(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-purple-500 outline-none"
                placeholder="Ej: 58.2" />
            </div>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Insertando en Oracle...' : '💾 Registrar Evaluación y Guardar Historial'}
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