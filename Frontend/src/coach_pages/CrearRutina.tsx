import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerEjercicios, type Ejercicio } from '../api/ejercicios';
import { crearRutina, agregarEjercicioADetalle } from '../api/rutinas';

interface EjercicioFila {
  id_ejercicio: number;
  nombre: string;
  series: number;
  repeticiones: number;
  descanso: number;
}

export default function CrearRutina() {
  const navigate = useNavigate();
  const coachId = Number(localStorage.getItem('id_usuario')) || 1;

  const [catalogo, setCatalogo] = useState<Ejercicio[]>([]);
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  const [ejerciciosAgregados, setEjerciciosAgregados] = useState<EjercicioFila[]>([]);
  const [ejerId, setEjerId] = useState<number | string>('');
  const [series, setSeries] = useState(4);
  const [reps, setReps] = useState(12);
  const [descanso, setDescanso] = useState(60);

  useEffect(() => {
    async function cargarEjercicios() {
      try {
        const data = await obtenerEjercicios();
        setCatalogo(data);
      } catch (err) { console.error(err); }
    }
    cargarEjercicios();
  }, []);

  const agregarFila = () => {
    if (!ejerId) return;
    const encontrado = catalogo.find(e => e.id_ejercicio === Number(ejerId));
    if (!encontrado) return;

    setEjerciciosAgregados([...ejerciciosAgregados, {
      id_ejercicio: encontrado.id_ejercicio,
      nombre: encontrado.nombre,
      series,
      repeticiones: reps,
      descanso
    }]);
    setEjerId('');
  };

  const guardarRutinaGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ejerciciosAgregados.length === 0) return alert('Añade al menos un ejercicio físico.');

    try {
      const nueva = await crearRutina({ nombre, objetivo, descripcion, id_coach: coachId });
      
      for (let i = 0; i < ejerciciosAgregados.length; i++) {
        const item = ejerciciosAgregados[i];
        await agregarEjercicioADetalle({
          id_rutina: nueva.id_rutina,
          id_ejercicio: item.id_ejercicio,
          series: item.series,
          repeticiones: item.repeticiones,
          descanso_segundos: item.descanso,
          orden_ejercicio: i + 1
        });
      }
      alert('Plantilla de rutina guardada en el catálogo general.');
      navigate('/coach/dashboard');
    } catch (err) {
      alert('Error guardando la rutina estruturada.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-emerald-400">Banco de Rutinas del Gimnasio</h1>
      <form onSubmit={guardarRutinaGlobal} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-md font-semibold border-b border-slate-800 pb-2 text-slate-400">Datos Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre de Rutina" required value={nombre} onChange={e => setNombre(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white" />
            <input type="text" placeholder="Objetivo general" value={objetivo} onChange={e => setObjetivo(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white" />
          </div>
          <textarea placeholder="Descripción del bloque" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white h-20" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-md font-semibold border-b border-slate-800 pb-2 text-slate-400">Añadir Ejercicios hechos por Admin</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div className="sm:col-span-2">
              <select value={ejerId} onChange={e => setEjerId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white">
                <option value="">-- Ejercicio --</option>
                {catalogo.map(e => <option key={e.id_ejercicio} value={e.id_ejercicio}>{e.nombre}</option>)}
              </select>
            </div>
            <input type="number" placeholder="Series" value={series} onChange={e => setSeries(Number(e.target.value))} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-center" />
            <input type="number" placeholder="Reps" value={reps} onChange={e => setReps(Number(e.target.value))} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-center" />
            <button type="button" onClick={agregarFila} className="bg-emerald-600 hover:bg-emerald-700 p-2 rounded-lg font-bold">＋</button>
          </div>

          <div className="bg-slate-950 p-4 border border-slate-800 rounded-lg space-y-2">
            {ejerciciosAgregados.map((item, idx) => (
              <p key={idx} className="text-sm text-slate-300 font-medium">🔹 <b>{item.nombre}</b> — {item.series}x{item.repeticiones} ({item.descanso}s)</p>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg transition">Compilar Plantilla Base</button>
          <button type="button" onClick={() => navigate('/coach/dashboard')} className="bg-slate-800 text-slate-300 py-2.5 px-6 rounded-lg">Volver</button>
        </div>
      </form>
    </div>
  );
}
