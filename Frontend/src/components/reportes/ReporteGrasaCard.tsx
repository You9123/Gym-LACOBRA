import type { ReporteGrasa } from "../../api/reportes";

interface Props {
  reporte: ReporteGrasa;
}

const ReporteCard = ({ reporte }: Props) => {
  const porcentaje = parseFloat(reporte.porcentaje_grasa_actual);
  
  const getColor = () => {
    if (porcentaje < 15) return 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400';
    if (porcentaje < 25) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400';
    return 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400';
  };

  const getIcono = () => {
    if (porcentaje < 15) return '💪';
    if (porcentaje < 25) return '⚖️';
    return '🔥';
  };

  return (
    <div className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700/50">
      <div className="p-5">
        <div className="flex gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-2 border-cyan-500/30 flex items-center justify-center text-2xl">
            {getIcono()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {reporte.nombre} {reporte.apellido}
            </h2>
            <p className="text-xs text-slate-400">{reporte.correo}</p>
            <p className="text-xs text-cyan-400 mt-1">ID: {reporte.id_usuario}</p>
          </div>
        </div>

        <div className={`rounded-lg p-4 bg-gradient-to-r ${getColor()} border transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Grasa Corporal</p>
              <p className="text-3xl font-bold">{reporte.porcentaje_grasa_actual}%</p>
            </div>
            <div className="text-5xl opacity-80">{getIcono()}</div>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center text-xs text-slate-500">
          <span>📅 Última medición</span>
          <span>{reporte.fecha_actualizacion}</span>
        </div>
      </div>
    </div>
  );
};

export default ReporteCard;