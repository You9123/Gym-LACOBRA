import type { Rutina } from "../../api/rutinas";

interface Props {
    rutina: Rutina;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewDetails?: () => void;
    onAddExercise?: () => void;  // 
}

const RutinaCard = ({
    rutina,
    onEdit,
    onDelete,
    onViewDetails,
    onAddExercise  // 
}: Props) => {
    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-white">
                    {rutina.nombre || "Rutina"}
                </h2>
                <p className="text-cyan-400">{rutina.objetivo}</p>
            </div>
            <p className="text-slate-300">{rutina.descripcion}</p>
            
            <div className="flex flex-col gap-2 pt-4">
                {/* Fila 1: Ver detalles y Agregar ejercicio */}
                <div className="flex gap-3">
                    <button
                        onClick={onViewDetails}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 p-2 rounded-lg"
                    >
                        👁️ Ver Detalles
                    </button>
                    <button
                        onClick={onAddExercise}
                        className="flex-1 bg-green-600 hover:bg-green-500 p-2 rounded-lg"
                    >
                        ➕ Agregar Ejercicio
                    </button>
                </div>
                
                {/* Fila 2: Editar y Eliminar */}
                <div className="flex gap-3">
                    <button
                        onClick={onEdit}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-500 p-2 rounded-lg"
                    >
                        ✏️ Editar Rutina
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 bg-red-600 hover:bg-red-500 p-2 rounded-lg"
                    >
                        🗑️ Eliminar Rutina
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RutinaCard;