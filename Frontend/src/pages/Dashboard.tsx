import { useState, useEffect } from 'react';
import { obtenerUsuarios } from '../api/usuarios';
import { obtenerEjercicios } from '../api/ejercicios';
import { obtenerRutinas } from '../api/rutinas';
import { obtenerSucursales } from '../api/sucursales';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalEjercicios: 0,
    totalRutinas: 0,
    totalSucursales: 0
  });
  const [loading, setLoading] = useState(true);
  const [usuariosRecientes, setUsuariosRecientes] = useState([]);

    const cargarDashboard = async () => {
    try {
      setLoading(true);
      
      // Cargar datos en paralelo
      const [usuarios, ejercicios, rutinas, sucursales] = await Promise.all([
        obtenerUsuarios(),
        obtenerEjercicios(),
        obtenerRutinas(),
        obtenerSucursales()
      ]);

      setStats({
        totalUsuarios: usuarios.length,
        totalEjercicios: ejercicios.length,
        totalRutinas: rutinas.length,
        totalSucursales: sucursales.length
      });

      // Últimos 5 usuarios registrados
      const recientes = usuarios.slice(0, 5);
      setUsuariosRecientes(recientes);

    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    cargarDashboard();
  }, []);


  const estadisticas = [
    { titulo: 'Usuarios', valor: stats.totalUsuarios, icono: '👥', color: 'from-blue-500 to-blue-600' },
    { titulo: 'Ejercicios', valor: stats.totalEjercicios, icono: '💪', color: 'from-green-500 to-green-600' },
    { titulo: 'Rutinas', valor: stats.totalRutinas, icono: '📋', color: 'from-purple-500 to-purple-600' },
    { titulo: 'Sucursales', valor: stats.totalSucursales, icono: '🏢', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <p className="mt-4">Cargando estadísticas...</p>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {estadisticas.map((item, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${item.color} rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{item.titulo}</p>
                    <p className="text-3xl font-bold mt-2">{item.valor}</p>
                  </div>
                  <div className="text-4xl">{item.icono}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Usuarios recientes */}
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">📋 Usuarios Recientes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Correo</th>
                    <th className="p-3 text-left">Rol</th>
                    <th className="p-3 text-left">Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosRecientes.map((usuario) => (
                    <tr key={usuario.id_usuario} className="border-b border-slate-700">
                      <td className="p-3">{usuario.id_usuario}</td>
                      <td className="p-3">{usuario.nombre} {usuario.apellido}</td>
                      <td className="p-3">{usuario.correo}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-cyan-500/20 rounded-full text-xs">
                          {usuario.rol_nombre || 'Cliente'}
                        </span>
                      </td>
                      <td className="p-3">{usuario.fecha_registro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;