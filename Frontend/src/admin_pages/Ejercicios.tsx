// pages/Ejercicios.tsx
import { useState, useEffect } from 'react';

// 1. Importa solo las funciones aquí
import { 
  obtenerEjercicios, 
  crearEjercicio, 
  actualizarEjercicio, 
  eliminarEjercicio,
  agregarImagenAEjercicio,
  eliminarImagenEjercicio,
} from '../api/ejercicios';

// 2. Importa la interfaz de forma explícita como un TIPO aquí abajo
import type { Ejercicio } from '../api/ejercicios';

import EjercicioCard from '../components/ejercicios/EjercicioCard';
import EjercicioForm from '../components/ejercicios/EjercicioForm';
import ConfirmDelete from '../components/shared/ConfirmDelete';

const Ejercicios = () => {
  // Se asigna el tipo Ejercicio[] a los estados correspondientes
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingEjercicio, setEditingEjercicio] = useState<Ejercicio | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [ejercicioToDelete, setEjercicioToDelete] = useState<Ejercicio | null>(null);

  useEffect(() => {
    cargarEjercicios();
  }, []);

  const cargarEjercicios = async () => {
    try {
      setLoading(true);
      const data = await obtenerEjercicios();
      setEjercicios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando ejercicios:", error);
      setErrorMessage("Error al cargar los ejercicios");
    } finally {
      setLoading(false);
    }
  };

  // Se tipa el parámetro con 'any' para delegar la estructura flexible al Formulario
  const handleCreate = async (ejercicioData: any) => {
    try {
      const { rutaGif, ...datosEjercicio } = ejercicioData;

      // 1. Crear el ejercicio (ignoramos el ID que devuelve el backend)
      await crearEjercicio(datosEjercicio);

      // 2. Buscar el ejercicio recién creado por sus datos exactos
      const todos = await obtenerEjercicios();
      const ejercicioCreado = todos.find(
        (e) =>
          e.nombre === datosEjercicio.nombre &&
          e.descripcion === datosEjercicio.descripcion &&
          e.calorias_estimadas === datosEjercicio.calorias_estimadas &&
          e.id_categoria === datosEjercicio.id_categoria &&
          e.id_dificultad === datosEjercicio.id_dificultad
      );

      if (!ejercicioCreado) {
        throw new Error("No se encontró el ejercicio recién creado");
      }

      // 3. Si hay GIF, eliminar imágenes previas de ese ejercicio (por si acaso)
      if (rutaGif?.trim()) {
        if (ejercicioCreado.imagenes?.length) {
          for (const img of ejercicioCreado.imagenes) {
            await eliminarImagenEjercicio(img.id_imagen);
          }
        }

        // 4. Guardar la nueva imagen
        const imagenData = {
          ruta_imagen: `/ejercicios/${rutaGif}`,
          descripcion: `GIF ${datosEjercicio.nombre}`,
        };
        await agregarImagenAEjercicio(ejercicioCreado.id_ejercicio, imagenData);
      }

      await cargarEjercicios();
      setShowForm(false);
    } catch (error) {
      console.error("Error creando ejercicio:", error);
      setErrorMessage("Error al crear el ejercicio");
    }
  };

  // Se asignan los tipos explícitos a 'id' y 'ejercicioData' para evitar el implicit any
  const handleUpdate = async (id: number | string, ejercicioData: any) => {
    try {
      await actualizarEjercicio(id, ejercicioData);
      await cargarEjercicios();
      setEditingEjercicio(null);
    } catch (error) {
      console.error("Error actualizando ejercicio:", error);
      setErrorMessage("Error al actualizar el ejercicio");
    }
  };

  // Se asegura que la función reciba una estructura válida de Ejercicio
  const confirmDelete = (ejercicio: Ejercicio) => {
    setEjercicioToDelete(ejercicio);
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (ejercicioToDelete) {
      try {
        await eliminarEjercicio(ejercicioToDelete.id_ejercicio);
        await cargarEjercicios();
        setShowConfirmDelete(false);
        setEjercicioToDelete(null);
      } catch (error) {
        console.error("Error eliminando ejercicio:", error);
        setErrorMessage("Error al eliminar el ejercicio");
      }
    }
  };

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

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-400">Eliminar Ejercicio</h2>
            <ConfirmDelete onConfirm={handleDelete} onCancel={handleCancelDelete} />
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nuevo Ejercicio</h2>
            <EjercicioForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

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
          <button onClick={() => setShowForm(true)} className="mt-3 text-cyan-400 hover:text-cyan-300">
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
