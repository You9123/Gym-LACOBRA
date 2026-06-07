// CrearRutina.tsx - versión completa con editar y eliminar ejercicios
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

  // Estado para controlar qué fila está en modo edición
  const [editandoIdx, setEditandoIdx] = useState<number | null>(null);
  const [editSeries, setEditSeries] = useState(0);
  const [editReps, setEditReps] = useState(0);
  const [editDescanso, setEditDescanso] = useState(0);

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

  // Activa el modo edición para una fila específica
  const iniciarEdicion = (idx: number) => {
    const item = ejerciciosAgregados[idx];
    setEditandoIdx(idx);
    setEditSeries(item.series);
    setEditReps(item.repeticiones);
    setEditDescanso(item.descanso);
  };

  // Guarda los cambios editados en la lista local (aún no en BD)
  const guardarEdicion = (idx: number) => {
    const actualizado = ejerciciosAgregados.map((item, i) =>
      i === idx
        ? { ...item, series: editSeries, repeticiones: editReps, descanso: editDescanso }
        : item
    );
    setEjerciciosAgregados(actualizado);
    setEditandoIdx(null);
  };

  // Elimina una fila de la lista local
  const eliminarFila = (idx: number) => {
    setEjerciciosAgregados(ejerciciosAgregados.filter((_, i) => i !== idx));
    if (editandoIdx === idx) setEditandoIdx(null);
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
      alert('Error guardando la rutina estructurada.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-emerald-400">Banco de Rutinas del Gimnasio</h1>
      <form onSubmit={guardarRutinaGlobal} className="space-y-6">

        {/* Datos principales */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-md font-semibold border-b border-slate-800 pb-2 text-slate-400">Datos Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre de Rutina" required value={nombre} onChange={e => setNombre(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white" />
            <input type="text" placeholder="Objetivo general" value={objetivo} onChange={e => setObjetivo(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white" />
          </div>
          <textarea placeholder="Descripción del bloque" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white h-20" />
        </div>

        {/* Añadir ejercicios */}
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

          {/* Lista de ejercicios agregados */}
          <div className="bg-slate-950 p-4 border border-slate-800 rounded-lg space-y-3">
            {ejerciciosAgregados.length === 0 && (
              <p className="text-slate-500 text-sm text-center">No hay ejercicios agregados aún.</p>
            )}

            {ejerciciosAgregados.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                {editandoIdx === idx ? (
                  // --- MODO EDICIÓN ---
                  <div className="space-y-2">
                    <p className="text-emerald-400 font-semibold text-sm">✏️ Editando: {item.nombre}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-slate-400">Series</label>
                        <input
                          type="number"
                          value={editSeries}
                          onChange={e => setEditSeries(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white text-center text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Repeticiones</label>
                        <input
                          type="number"
                          value={editReps}
                          onChange={e => setEditReps(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white text-center text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Descanso (s)</label>
                        <input
                          type="number"
                          value={editDescanso}
                          onChange={e => setEditDescanso(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white text-center text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => guardarEdicion(idx)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        ✔ Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditandoIdx(null)}
                        className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-lg"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // --- MODO VISUALIZACIÓN ---
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300 font-medium">
                      🔹 <b>{item.nombre}</b> — {item.series}x{item.repeticiones} ({item.descanso}s)
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => iniciarEdicion(idx)}
                        className="bg-slate-700 hover:bg-slate-600 text-xs text-white px-2.5 py-1 rounded-lg"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarFila(idx)}
                        className="bg-red-800 hover:bg-red-700 text-xs text-white px-2.5 py-1 rounded-lg"
                      >
                        🗑 Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
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