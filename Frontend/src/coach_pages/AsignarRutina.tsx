import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerRutinas, asignarRutinaACliente, type Rutina } from '../api/rutinas';
import { obtenerUsuarioPorId, type Usuario } from '../api/usuarios';

export default function AsignarRutina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idCliente = Number(id);

  const [alumno, setAlumno] = useState<Usuario | null>(null);
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<number | string>('');
  const [obs, setObs] = useState('');

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const u = await obtenerUsuarioPorId(idCliente);
        setAlumno(u);
        const r = await obtenerRutinas();
        setRutinas(r);
      } catch (err) { console.error(err); }
    }
    cargarCatalogos();
  }, [idCliente]);

  const ejecutarAsignacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rutinaSeleccionada) return;

    try {
      await asignarRutinaACliente({
        id_cliente: idCliente,
        id_rutina: Number(rutinaSeleccionada),
        observaciones: obs
      });
      alert('Plan de entrenamiento asignado correctamente.');
      navigate('/coach/dashboard');
    } catch (err) {
      alert('Error en la asignación del backend.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-blue-400">Asignar Entrenamiento a {alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Cargando...'}</h2>
      <form onSubmit={ejecutarAsignacion} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-300">Seleccionar Rutina de la Base de Datos</label>
          <select required value={rutinaSeleccionada} onChange={e => setRutinaSeleccionada(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white focus:border-blue-500 outline-none">
            <option value="">-- Elige una rutina --</option>
            {rutinas.map(r => (
              <option key={r.id_rutina} value={r.id_rutina}>{r.nombre} (Coach ID: {r.id_coach || 'Admin'})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Observaciones o Notas del Coach</label>
          <textarea value={obs} onChange={e => setObs(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 mt-1 text-white h-24 focus:border-blue-500 outline-none" placeholder="Indicaciones para las próximas semanas..." />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">Vincular Plan</button>
          <button type="button" onClick={() => navigate('/coach/dashboard')} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
