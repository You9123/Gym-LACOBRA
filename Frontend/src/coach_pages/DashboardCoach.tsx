import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuarios, type UsuarioLista } from '../api/usuarios';
import { obtenerRutinas } from '../api/rutinas';
import { obtenerMedidas } from '../api/medidas';

export default function DashboardCoach() {
  const navigate = useNavigate();
  const coachId = Number(localStorage.getItem('id_usuario')) || 1; 

  const [clientes, setClientes] = useState<UsuarioLista[]>([]);
  const [rutinasTotales, setRutinasTotales] = useState<number>(0);
  const [medidasTotales, setMedidasTotales] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const todos = await obtenerUsuarios();
        setClientes(todos.filter(u => u.id_rol === 3 || u.rol_nombre?.toLowerCase() === 'cliente'));
        
        const rutinas = await obtenerRutinas();
        setRutinasTotales(rutinas.filter(r => r.id_coach === coachId).length);

        const medidas = await obtenerMedidas();
        setMedidasTotales(medidas.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, [coachId]);

  if (loading) return <div className="text-center py-12 text-slate-400">Cargando...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel del Coach</h1>
          <p className="text-slate-400">Control de entrenamientos y antropometría.</p>
        </div>
        <button 
          onClick={() => navigate('/coach/rutinas/crear')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg transition"
        >
          🔨 Diseñar Nueva Rutina Base
        </button>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-sm text-slate-400 uppercase">Mis Alumnos</h3>
          <p className="text-4xl font-extrabold text-blue-500 mt-2">{clientes.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-sm text-slate-400 uppercase">Mis Plantillas de Rutinas</h3>
          <p className="text-4xl font-extrabold text-emerald-500 mt-2">{rutinasTotales}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-sm text-slate-400 uppercase">Mediciones del Gym</h3>
          <p className="text-4xl font-extrabold text-purple-500 mt-2">{medidasTotales}</p>
        </div>
      </div>

      {/* Tabla con Acciones Requeridas */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-sm">
              <th className="p-4">Alumno</th>
              <th className="p-4">Contacto</th>
              <th className="p-4 text-center">Acciones de Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {clientes.map((c) => (
              <tr key={c.id_usuario} className="hover:bg-slate-850/50 transition">
                <td className="p-4 font-medium text-white">{c.nombre} {c.apellido}</td>
                <td className="p-4 text-sm">{c.correo}<br/><span className="text-slate-500">{c.telefono || 'Sin tel'}</span></td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => navigate(`/coach/cliente/${c.id_usuario}/medidas`)}
                      className="bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      ⚖️ Tomar Medidas
                    </button>
                    <button 
                      onClick={() => navigate(`/coach/cliente/${c.id_usuario}/asignar`)}
                      className="bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      📋 Asignar Rutina
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
