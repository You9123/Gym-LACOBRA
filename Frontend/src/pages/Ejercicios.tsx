// pages/Ejercicios.tsx
import { useState, useEffect } from 'react';
import { 
  obtenerEjercicios, 
  crearEjercicio, 
  actualizarEjercicio, 
  eliminarEjercicio 
} from '../api/ejercicios';
import EjercicioCard from '../components/ejercicios/EjercicioCard';
import EjercicioForm from '../components/ejercicios/EjercicioForm';
import ConfirmDelete from '../components/shared/ConfirmDelete';

const Ejercicios = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEjercicio, setEditingEjercicio] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Estado para el modal de confirmación
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [ejercicioToDelete, setEjercicioToDelete] = useState(null);

  useEffect(() => {
    cargarEjercicios();
  }, []);

  const cargarEjercicios = async () => {
    try {
      setLoading(true);
      const data = await obtenerEjercicios();
      setEjercicios(data);
    } catch (error) {
      console.error('Error cargando ejercicios:', error);
      setErrorMessage('Error al cargar los ejercicios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (ejercicioData) => {
    try {
      await crearEjercicio(ejercicioData);
      await cargarEjercicios();
      setShowForm(false);
    } catch (error) {
      console.error('Error creando ejercicio:', error);
      setErrorMessage('Error al crear el ejercicio');
    }
  };

  const handleUpdate = async (id, ejercicioData) => {
    try {
      await actualizarEjercicio(id, ejercicioData);
      await cargarEjercicios();
      setEditingEjercicio(null);
    } catch (error) {
      console.error('Error actualizando ejercicio:', error);
      setErrorMessage('Error al actualizar el ejercicio');
    }
  };

  // Abrir modal de confirmación
  const confirmDelete = (ejercicio) => {
    setEjercicioToDelete(ejercicio);
    setShowConfirmDelete(true);
  };

  // Ejecutar eliminación
  const handleDelete = async () => {
    if (ejercicioToDelete) {
      try {
        await eliminarEjercicio(ejercicioToDelete.id_ejercicio);
        await cargarEjercicios();
        setShowConfirmDelete(false);
        setEjercicioToDelete(null);
      } catch (error) {
        console.error('Error eliminando ejercicio:', error);
        setErrorMessage('Error al eliminar el ejercicio');
      }
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setEjercicioToDelete(null);
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ejercicios</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition-colors"
        >
          + Nuevo Ejercicio
        </button>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-400">Eliminar Ejercicio</h2>
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
            <h2 className="text-xl font-bold mb-4">Nuevo Ejercicio</h2>
            <EjercicioForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Modal para editar */}
      {editingEjercicio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Ejercicio</h2>
            <EjercicioForm
              initialData={editingEjercicio}
              onSubmit={(data) => handleUpdate(editingEjercicio.id_ejercicio, data)}
              onCancel={() => setEditingEjercicio(null)}
            />
          </div>
        </div>
      )}

      {/* Modal de error */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Error</h2>
                <p className="text-slate-400 text-sm">No se pudo completar la operación</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage("")}
              className="w-full bg-red-600 hover:bg-red-500 p-3 rounded-xl transition font-semibold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <p className="mt-2">Cargando ejercicios...</p>
        </div>
      ) : ejercicios.length === 0 ? (
        <div className="text-center py-10 bg-slate-800/50 rounded-lg">
          <p className="text-slate-400">No hay ejercicios registrados</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-cyan-400 hover:text-cyan-300"
          >
            Crear el primer ejercicio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ejercicios.map((ejercicio) => (
            <EjercicioCard
              key={ejercicio.id_ejercicio}
              ejercicio={ejercicio}
              onEdit={() => setEditingEjercicio(ejercicio)}
              onDelete={() => confirmDelete(ejercicio)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Ejercicios;