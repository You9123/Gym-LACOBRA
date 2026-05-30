interface SucursalPublica {
  id_sucursal: number;
  nombre: string;
  direccion_exacta?: string | null;
  telefono?: string | null;
  horario?: string | null;
}

interface Props {
  sucursal: SucursalPublica;
}

const SucursalPublicCard = ({ sucursal }: Props) => {
  return (
    <div className="
      group
      bg-gradient-to-br from-slate-800/90 to-slate-900/90
      rounded-xl overflow-hidden shadow-lg
      hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]
      hover:scale-[1.02] transition-all duration-300
      border border-slate-700/50 hover:border-cyan-500/30
    ">
      <div className="p-6">
        {/* Header */}
        <div className="flex gap-4 mb-5">
          <div className="
            w-14 h-14 rounded-full flex-shrink-0
            bg-gradient-to-br from-cyan-500/20 to-cyan-600/20
            border-2 border-cyan-500/30
            flex items-center justify-center text-2xl
          ">
            🏢
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {sucursal.nombre}
            </h3>
            <p className="text-xs text-cyan-400 font-semibold tracking-wider uppercase mt-0.5">
              Sucursal
            </p>
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <span className="text-lg flex-shrink-0">📍</span>
            <p className="text-slate-300 text-sm leading-snug">
              {sucursal.direccion_exacta || "Dirección no disponible"}
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <span className="text-lg flex-shrink-0">📞</span>
            {sucursal.telefono ? (
              <a
                href={`tel:${sucursal.telefono}`}
                className="text-white font-semibold text-sm hover:text-cyan-400 transition-colors"
              >
                {sucursal.telefono}
              </a>
            ) : (
              <p className="text-slate-500 text-sm">Sin teléfono</p>
            )}
          </div>

          {sucursal.horario && (
            <div className="flex gap-3 items-start">
              <span className="text-lg flex-shrink-0">🕐</span>
              <p className="text-slate-400 text-sm leading-snug">
                {sucursal.horario}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default SucursalPublicCard;