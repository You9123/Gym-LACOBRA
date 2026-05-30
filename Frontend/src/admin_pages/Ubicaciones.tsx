import { useState, useEffect } from 'react';
import { obtenerSucursales } from '../api/sucursales'; // Asumiendo que tienes este API
import UbicacionCard from '../components/ubicaciones/UbicacionCard';
import UbicacionForm from '../components/ubicaciones/UbicacionForm';

const Ubicaciones = () => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUbicacion, setEditingUbicacion] = useState(null);

  useEffect(() => {
    cargarUbicaciones();
  }, []);

  const cargarUbicaciones = async () => {
    try {
      setLoading(true);
      // Usa tu API de sucursales o ubicaciones
      const data = await obtenerSucursales();
      setUbicaciones(data);
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (ubicacionData) => {
    try {
      // Implementar según tu API
      console.log('Creando ubicación:', ubicacionData);
      await cargarUbicaciones();
      setShowForm(false);
    } catch (error) {
      console.error('Error creando ubicación:', error);
    }
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ubicaciones de Sucursales</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva Ubicación
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Registrar Ubicación</h2>
            <UbicacionForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <p className="mt-2">Cargando ubicaciones...</p>
        </div>
      ) : ubicaciones.length === 0 ? (
        <div className="text-center py-10 bg-slate-800/50 rounded-lg">
          <p className="text-slate-400">No hay ubicaciones registradas</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-cyan-400 hover:text-cyan-300"
          >
            Registrar primera ubicación
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ubicaciones.map((ubicacion) => (
            <UbicacionCard
              key={ubicacion.id}
              ubicacion={ubicacion}
              onEdit={() => setEditingUbicacion(ubicacion)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Ubicaciones;