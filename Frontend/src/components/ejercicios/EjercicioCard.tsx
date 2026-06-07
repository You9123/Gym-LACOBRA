import { useState } from "react";
import type { Ejercicio } from "../../api/ejercicios";

interface Props {
  ejercicio: Ejercicio;
  onEdit: () => void;
  onDelete: () => void;
}

const EjercicioCard = ({ ejercicio, onEdit, onDelete }: Props) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  // Toma la última imagen asociada (evita duplicados viejos)
  const imagenPrincipal = ejercicio.imagenes?.length > 0
    ? ejercicio.imagenes[ejercicio.imagenes.length - 1].ruta_imagen
    : null;

  return (
    <>
      <div className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700/50">
        <div className="p-5">
          {/* GIF */}
          <div className="flex justify-center mb-4">
            <div
              className="w-28 h-28 rounded-xl overflow-hidden border border-cyan-500/30 cursor-pointer hover:border-cyan-400 transition-all"
              onClick={() => imagenPrincipal && setMostrarModal(true)}
            >
              {imagenPrincipal ? (
                <img
                  src={imagenPrincipal}
                  alt={ejercicio.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/112?text=Error";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl bg-slate-800">
                  💪
                </div>
              )}
            </div>
          </div>

          {/* Nombre y categoría */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-white">{ejercicio.nombre}</h2>
            <p className="text-sm text-cyan-400">
              {ejercicio.categoria_nombre || `Categoría ID: ${ejercicio.id_categoria}`}
            </p>
          </div>

          {/* Botón ver demostración */}
          {imagenPrincipal && (
            <button
              onClick={() => setMostrarModal(true)}
              className="w-full mb-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors"
            >
              ▶ Ver demostración
            </button>
          )}

          {/* Descripción */}
          {ejercicio.descripcion && (
            <div className="mb-3">
              <p className="text-slate-400 text-sm text-center">{ejercicio.descripcion}</p>
            </div>
          )}

          {/* Información */}
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-700/50">
            <div>
              <p className="text-xs text-slate-500">Dificultad</p>
              <p className="text-sm font-semibold text-white">
                {ejercicio.dificultad_nombre || `ID: ${ejercicio.id_dificultad}`}
              </p>
            </div>
            {ejercicio.calorias_estimadas && (
              <div>
                <p className="text-xs text-slate-500">Calorías estimadas</p>
                <p className="text-sm font-semibold text-cyan-400">
                  {ejercicio.calorias_estimadas} kcal
                </p>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onEdit}
              className="text-blue-400 hover:text-blue-300 transition-colors"
              title="Editar"
            >
              ✏️
            </button>
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && imagenPrincipal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setMostrarModal(false)}
        >
          <div
            className="bg-slate-900 rounded-xl p-4 max-w-md w-full border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-lg">{ejercicio.nombre}</h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-white text-xl hover:text-red-400"
              >
                ✕
              </button>
            </div>
            <img
              src={imagenPrincipal}
              alt={ejercicio.nombre}
              className="w-full rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-5xl bg-slate-800">💪</div>';
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EjercicioCard;