// components/ejercicios/EjercicioCard.tsx
import type { Ejercicio } from "../../api/ejercicios";

interface Props {
  ejercicio: Ejercicio;
  onEdit: () => void;
  onDelete: () => void;
}

const EjercicioCard = ({ ejercicio, onEdit, onDelete }: Props) => {
  return (
    <div className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700/50">
      
      <div className="p-5">
        {/* Cabecera con ícono y nombre */}
        <div className="flex gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-2 border-cyan-500/30 flex items-center justify-center text-2xl">
            💪
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">
              {ejercicio.nombre}
            </h2>
            <p className="text-xs text-cyan-400">
              {ejercicio.categoria_nombre || `Categoría ID: ${ejercicio.id_categoria}`}
            </p>
          </div>
          {/* Botones de acción */}
          <div className="flex gap-2">
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

        {/* Descripción */}
        {ejercicio.descripcion && (
          <div className="mb-3">
            <p className="text-slate-400 text-sm line-clamp-2">
              {ejercicio.descripcion}
            </p>
          </div>
        )}

        {/* Información adicional */}
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
      </div>
    </div>
  );
};

export default EjercicioCard;