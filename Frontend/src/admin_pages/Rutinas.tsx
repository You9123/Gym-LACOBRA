import { useState, useEffect } from 'react';
import Modal from '../components/shared/Modal';
import {
  obtenerRutinas,
  crearRutina,
  actualizarRutina,
  eliminarRutina,
  agregarEjercicioADetalle,
  actualizarEjercicioEnDetalle
} from '../api/rutinas';
import RutinaCard from '../components/rutinas/RutinaCard';
import RutinaForm from '../components/rutinas/RutinaForm';
import DetalleRutinaForm from '../components/rutinas/DetalleRutinaForm';
import DetalleRutinaList from '../components/rutinas/DetalleRutinaList';
import EditarEjercicioForm from '../components/rutinas/EditarEjercicioForm';
import ConfirmModal from '../components/shared/ConfirmModal';

const Rutinas = () => {
  // Estados
  const [rutinas, setRutinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRutina, setEditingRutina] = useState<any>(null);
  const [selectedRutina, setSelectedRutina] = useState<any>(null);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [editingEjercicio, setEditingEjercicio] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Función para cargar rutinas (definida ANTES de usarse)
  const cargarRutinas = async () => {
    try {
      setLoading(true);
      const data = await obtenerRutinas();
      setRutinas(data);
    } catch (error) {
      console.error('Error cargando rutinas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRutinas();
  }, []);

  const handleCreate = async (rutinaData: any) => {
    try {
      await crearRutina(rutinaData);
      await cargarRutinas();
      setShowForm(false);
    } catch (error) {
      console.error('Error creando rutina:', error);
    }
  };

  const handleUpdate = async (id: number, rutinaData: any) => {
    try {
      await actualizarRutina(id, rutinaData);
      await cargarRutinas();
      setEditingRutina(null);
    } catch (error) {
      console.error('Error actualizando rutina:', error);
    }
  };

  const handleAgregarEjercicio = async (detalleData: any) => {
    try {
      await agregarEjercicioADetalle(detalleData);
      setShowAddExerciseModal(false);
    } catch (error: any) {
      console.error('Error agregando ejercicio:', error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleEditarEjercicio = async (idDetalle: number, data: any) => {
    try {
      await actualizarEjercicioEnDetalle(idDetalle, data);
      setShowEditExerciseModal(false);
      setEditingEjercicio(null);
      // Recargar la lista de detalles
      if (showDetailsModal) {
        setShowDetailsModal(false);
        setTimeout(() => setShowDetailsModal(true), 100);
      }
      
      await cargarRutinas();
    } catch (error: any) {
      console.error('Error editando ejercicio:', error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      try {
        await eliminarRutina(deletingId);
        await cargarRutinas();
      } catch (error) {
        console.error('Error eliminando rutina:', error);
      } finally {
        setShowDeleteConfirm(false);
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rutinas de Entrenamiento</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva Rutina
        </button>
      </div>

      {/* Modal Crear Rutina */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Crear Nueva Rutina">
        <RutinaForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </Modal>

      {/* Modal Editar Rutina */}
      <Modal isOpen={!!editingRutina} onClose={() => setEditingRutina(null)} title="Editar Rutina">
        <RutinaForm
          initialData={editingRutina}
          onSubmit={(data: any) => handleUpdate(editingRutina.id_rutina, data)}
          onCancel={() => setEditingRutina(null)}
        />
      </Modal>

      {/* Modal Agregar Ejercicio */}
      <Modal
        isOpen={showAddExerciseModal}
        onClose={() => setShowAddExerciseModal(false)}
        title={`Agregar ejercicio a: ${selectedRutina?.nombre || ''}`}
      >
        <DetalleRutinaForm
          idRutina={selectedRutina?.id_rutina}
          onSubmit={handleAgregarEjercicio}
          onCancel={() => setShowAddExerciseModal(false)}
        />
      </Modal>

      {/* Modal Editar Ejercicio */}
      <Modal
        isOpen={showEditExerciseModal}
        onClose={() => {
          setShowEditExerciseModal(false);
          setEditingEjercicio(null);
        }}
        title="Editar Ejercicio"
      >
        <EditarEjercicioForm
          detalle={editingEjercicio}
          onSubmit={handleEditarEjercicio}
          onCancel={() => {
            setShowEditExerciseModal(false);
            setEditingEjercicio(null);
          }}
        />
      </Modal>

      {/* Modal Ver Detalles */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="w-[700px] max-h-[80vh] overflow-y-auto">
            <DetalleRutinaList
              idRutina={selectedRutina?.id_rutina}
              rutinaNombre={selectedRutina?.nombre}
              onClose={() => setShowDetailsModal(false)}
              onEditEjercicio={(detalle) => {
                setEditingEjercicio(detalle);
                setShowEditExerciseModal(true);
                setShowDetailsModal(false);
              }}
              onRefresh={cargarRutinas}
            />
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar Rutina */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Rutina"
        message="¿Estás seguro de eliminar esta rutina? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />

      {/* Lista de Rutinas */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <p className="mt-2">Cargando rutinas...</p>
        </div>
      ) : rutinas.length === 0 ? (
        <div className="text-center py-10 bg-slate-800/50 rounded-lg">
          <p className="text-slate-400">No hay rutinas registradas</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-cyan-400 hover:text-cyan-300">
            Crear la primera rutina
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rutinas.map((rutina: any) => (
            <RutinaCard
              key={rutina.id_rutina}
              rutina={rutina}
              onEdit={() => setEditingRutina(rutina)}
              onDelete={() => handleDeleteClick(rutina.id_rutina)}
              onViewDetails={() => {
                setSelectedRutina(rutina);
                setShowDetailsModal(true);
              }}
              onAddExercise={() => {
                setSelectedRutina(rutina);
                setShowAddExerciseModal(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rutinas;