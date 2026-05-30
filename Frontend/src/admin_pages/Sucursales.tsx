import { useState, useEffect } from 'react';
import { 
  obtenerSucursales, 
  crearSucursal, 
  actualizarSucursal, 
  eliminarSucursal 
} from '../api/sucursales';
import SucursalCard from '../components/sucursales/SucursalCard';
import SucursalForm from '../components/sucursales/SucursalForm';
import ConfirmDelete from '../components/shared/ConfirmDelete';

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState(null);
  
  // Estado para el modal de confirmación
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [sucursalToDelete, setSucursalToDelete] = useState(null);

  useEffect(() => {
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    try {
      setLoading(true);
      const data = await obtenerSucursales();
      setSucursales(data);
    } catch (error) {
      console.error('Error cargando sucursales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (sucursalData) => {
    try {
      await crearSucursal(sucursalData);
      await cargarSucursales();
      setShowForm(false);
    } catch (error) {
      console.error('Error creando sucursal:', error);
      alert('Error al crear la sucursal');
    }
  };

  const handleUpdate = async (id, sucursalData) => {
    try {
      await actualizarSucursal(id, sucursalData);
      await cargarSucursales();
      setEditingSucursal(null);
    } catch (error) {
      console.error('Error actualizando sucursal:', error);
      alert('Error al actualizar la sucursal');
    }
  };

  // Abrir modal de confirmación
  const confirmDelete = (sucursal) => {
    setSucursalToDelete(sucursal);
    setShowConfirmDelete(true);
  };

  // Ejecutar eliminación
  const handleDelete = async () => {
    if (sucursalToDelete) {
      try {
        await eliminarSucursal(sucursalToDelete.id_sucursal);
        await cargarSucursales();
        setShowConfirmDelete(false);
        setSucursalToDelete(null);
      } catch (error) {
        console.error('Error eliminando sucursal:', error);
        alert('Error al eliminar la sucursal');
      }
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setSucursalToDelete(null);
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sucursales</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva Sucursal
        </button>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-400">Eliminar Sucursal</h2>
            <ConfirmDelete
              onConfirm={handleDelete}
              onCancel={handleCancelDelete}
            />
          </div>
        </div>
      )}

      {/* Modal para crear */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Registrar Sucursal</h2>
            <SucursalForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Modal para editar */}
      {editingSucursal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Sucursal</h2>
            <SucursalForm
              initialData={editingSucursal}
              onSubmit={(data) => handleUpdate(editingSucursal.id_sucursal, data)}
              onCancel={() => setEditingSucursal(null)}
            />
          </div>
        </div>
      )}

      {/* Lista de sucursales */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <p className="mt-2">Cargando sucursales...</p>
        </div>
      ) : sucursales.length === 0 ? (
        <div className="text-center py-10 bg-slate-800/50 rounded-lg">
          <p className="text-slate-400">No hay sucursales registradas</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-cyan-400 hover:text-cyan-300"
          >
            Registrar primera sucursal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sucursales.map((sucursal) => (
            <SucursalCard
              key={sucursal.id_sucursal}
              sucursal={sucursal}
              onEdit={() => setEditingSucursal(sucursal)}
              onDelete={() => confirmDelete(sucursal)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sucursales;