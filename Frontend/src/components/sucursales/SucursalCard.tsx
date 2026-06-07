import type { Sucursal } from "../../api/sucursales";

interface Props {
  sucursal: Sucursal;
  onEdit: () => void;
  onDelete: () => void;
}

const SucursalCard = ({ sucursal, onEdit, onDelete }: Props) => {
  return (
    <div className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700/50">
      
      <div className="p-5">
        {/* Cabecera con ícono y nombre */}
        <div className="flex gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-2 border-cyan-500/30 flex items-center justify-center text-2xl">
            🏢
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">
              {sucursal.nombre}
            </h2>
            <p className="text-xs text-cyan-400">Sucursal</p>
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

        {/* Dirección */}
        <div className="flex gap-3 items-start mb-3">
          <span className="text-xl">📍</span>
          <p className="text-slate-300 text-sm">
            {sucursal.direccion_exacta || "Sin dirección"}
          </p>
        </div>

        {/* Teléfono */}
        <div className="flex gap-3 items-center mb-3">
          <span className="text-xl">📞</span>
          <p className="text-white font-semibold">
            {sucursal.telefono || "Sin teléfono"}
          </p>
        </div>

        {/* Horario */}
        {sucursal.horario && (
          <div className="flex gap-3 items-center">
            <span className="text-xl">🕐</span>
            <p className="text-slate-400 text-sm">
              {sucursal.horario}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SucursalCard;