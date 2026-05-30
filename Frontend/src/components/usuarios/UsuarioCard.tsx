// components/usuarios/UsuarioCard.tsx
import type { UsuarioLista } from "../../api/usuarios";

interface Props {
  usuario: UsuarioLista;
  onEdit: () => void;
  onDelete: () => void;
}

const UsuarioCard = ({ usuario, onEdit, onDelete }: Props) => {
  return (
    <div className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700/50">
      
      <div className="p-5">
        {/* Cabecera con avatar y nombre */}
        <div className="flex gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-2 border-cyan-500/30 flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">
              {usuario.nombre} {usuario.apellido}
            </h2>
            <p className="text-xs text-cyan-400">
              {usuario.rol_nombre || `Rol ID: ${usuario.id_rol}`}
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

        {/* Información de contacto */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">📧</span>
            <span className="text-slate-300 truncate">{usuario.correo}</span>
          </div>
          {usuario.telefono && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">📞</span>
              <span className="text-slate-300">{usuario.telefono}</span>
            </div>
          )}
        </div>

        {/* Fecha de registro */}
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">📅 Registro</span>
            <span className="text-slate-400">{usuario.fecha_registro}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioCard;