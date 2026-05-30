import { useState, useEffect } from 'react';
import { obtenerDetallesPorRutina, eliminarEjercicioDeDetalle } from '../../api/rutinas';
import ConfirmModal from '../shared/ConfirmModal';

interface DetalleEjercicio {
  id_detalle_rutina: number;
  id_ejercicio: number;
  ejercicio_nombre: string;
  series: number;
  repeticiones: number;
  descanso_segundos: number;
  orden_ejercicio: number;
}

interface Props {
  idRutina: number;
  rutinaNombre: string;
  onClose: () => void;
  onEditEjercicio: (detalle: DetalleEjercicio) => void;
  onRefresh: () => void;
}

const DetalleRutinaList = ({ idRutina, rutinaNombre, onClose, onEditEjercicio, onRefresh }: Props) => {
  const [detalles, setDetalles] = useState<DetalleEjercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    idDetalle: number | null;
    ejercicioNombre: string;
  }>({
    isOpen: false,
    idDetalle: null,
    ejercicioNombre: ''
  });

  const cargarDetalles = async () => {
    try {
      setLoading(true);
      const data = await obtenerDetallesPorRutina(idRutina);
      setDetalles(data);
    } catch (error) {
      console.error('Error cargando detalles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDetalles();
  }, [idRutina]);

  

  const handleEliminarClick = (idDetalle: number, ejercicioNombre: string) => {
    setConfirmModal({
      isOpen: true,
      idDetalle,
      ejercicioNombre
    });
  };

  const handleConfirmEliminar = async () => {
    if (confirmModal.idDetalle) {
      try {
        await eliminarEjercicioDeDetalle(confirmModal.idDetalle);
        await cargarDetalles();
        onRefresh();
        setConfirmModal({ isOpen: false, idDetalle: null, ejercicioNombre: '' });
      } catch (error) {
        console.error('Error eliminando:', error);
        alert('Error al eliminar el ejercicio');
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              Ejercicios de: {rutinaNombre}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">
              ✕
            </button>
          </div>
          
          {loading ? (
            <p className="text-white text-center py-10">Cargando ejercicios...</p>
          ) : detalles.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 mb-4">No hay ejercicios agregados</p>
              <button
                onClick={onClose}
                className="bg-cyan-600 px-4 py-2 rounded"
              >
                Agregar ejercicios
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {detalles
                .sort((a, b) => a.orden_ejercicio - b.orden_ejercicio)
                .map((detalle) => (
                  <div key={detalle.id_detalle_rutina} className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-cyan-400 font-bold text-lg">
                            {detalle.orden_ejercicio}.
                          </span>
                          <h3 className="text-lg font-bold text-white">
                            {detalle.ejercicio_nombre}
                          </h3>
                        </div>
                        <p className="text-slate-300">
                          {detalle.series} series × {detalle.repeticiones} repeticiones
                        </p>
                        <p className="text-slate-400 text-sm">
                          Descanso: {detalle.descanso_segundos} segundos
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => onEditEjercicio(detalle)}
                          className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded text-white"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleEliminarClick(detalle.id_detalle_rutina, detalle.ejercicio_nombre)}
                          className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          
          <button
            onClick={onClose}
            className="mt-6 w-full bg-zinc-700 hover:bg-zinc-600 p-2 rounded text-white"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, idDetalle: null, ejercicioNombre: '' })}
        onConfirm={handleConfirmEliminar}
        title="Eliminar Ejercicio"
        message={`¿Estás seguro de eliminar "${confirmModal.ejercicioNombre}" de esta rutina?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </>
  );
};

export default DetalleRutinaList;