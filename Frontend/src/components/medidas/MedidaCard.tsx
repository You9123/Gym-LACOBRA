interface MedidaCardProps {
  medida: {
    id_medida?: number;
    ID_MEDIDA?: number;
    peso_actual?: string | number;
    PESO_ACTUAL?: string | number;
    altura?: string | number;
    ALTURA?: string | number;
    porcentaje_grasa_actual?: string | number | null;
    PORCENTAJE_GRASA_ACTUAL?: string | number | null;
    masa_muscular_actual?: string | number | null;
    MASA_MUSCULAR_ACTUAL?: string | number | null;
    fecha_actualizacion?: string;
    FECHA_ACTUALIZACION?: string;
    id_cliente?: number;
    ID_CLIENTE?: number;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const MedidaCard = ({ medida, onEdit, onDelete }: MedidaCardProps) => {
  // Obtener valores
  const peso = parseFloat(medida.peso_actual || medida.PESO_ACTUAL || 0);
  let altura = parseFloat(medida.altura || medida.ALTURA || 0);
  
  // Convertir altura de cm a metros si es necesario
  if (altura > 3) {
    altura = altura / 100;
  }
  
  // Calcular IMC
  let imc = 0;
  let imcValido = false;
  if (peso > 0 && altura > 0) {
    imc = peso / (altura * altura);
    imcValido = true;
  }
  
  // Determinar clasificación del IMC
  const getClasificacionIMC = (imc: number): string => {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidad I';
    if (imc < 40) return 'Obesidad II';
    return 'Obesidad III';
  };
  
  const getIMCColor = (imc: number): string => {
    if (imc < 18.5) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (imc < 25) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (imc < 30) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };
  
  const clasificacion = imcValido ? getClasificacionIMC(imc) : '';
  const imcColor = imcValido ? getIMCColor(imc) : '';
  
  const fecha = medida.fecha_actualizacion || medida.FECHA_ACTUALIZACION;
  const clienteId = medida.id_cliente || medida.ID_CLIENTE;
  const porcentajeGrasa = medida.porcentaje_grasa_actual || medida.PORCENTAJE_GRASA_ACTUAL;
  const masaMuscular = medida.masa_muscular_actual || medida.MASA_MUSCULAR_ACTUAL;

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700/50">
      
      {/* Badge decorativo superior */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full" />
      
      {/* Cabecera con ID y fecha */}
      <div className="flex justify-between items-start p-4 pb-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <span className="text-black font-bold text-sm">M</span>
          </div>
          <div>
            <p className="text-xs text-slate-400">Cliente ID</p>
            <p className="font-semibold text-white">#{clienteId || '?'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Fecha registro</p>
          <p className="text-xs text-slate-300 font-mono">{fecha || '—'}</p>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="p-4">
        {/* Métricas principales */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {peso > 0 ? `${peso}` : '—'}
              <span className="text-sm text-slate-400 ml-1">kg</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Peso Actual</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {altura > 0 ? `${altura.toFixed(2)}` : '—'}
              <span className="text-sm text-slate-400 ml-1">m</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Altura</p>
          </div>
        </div>
        
        {/* IMC con clasificación */}
        {imcValido && (
          <div className={`rounded-lg p-3 mb-4 border ${imcColor} transition-all duration-300`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs opacity-80">Índice de Masa Corporal</p>
                <p className="text-2xl font-bold">{imc.toFixed(1)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Clasificación</p>
                <p className="font-semibold">{clasificacion}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Medidas adicionales */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <p className="text-lg font-semibold text-cyan-400">
              {porcentajeGrasa || '—'}
              <span className="text-xs text-slate-400 ml-1">%</span>
            </p>
            <p className="text-xs text-slate-400">Grasa Corporal</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <p className="text-lg font-semibold text-cyan-400">
              {masaMuscular || '—'}
              <span className="text-xs text-slate-400 ml-1">kg</span>
            </p>
            <p className="text-xs text-slate-400">Masa Muscular</p>
          </div>
        </div>
      </div>
      
      {/* Acciones */}
      <div className="flex border-t border-slate-700/50">
        <button
          onClick={onEdit}
          className="flex-1 py-2 text-center text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 transition-colors rounded-bl-xl"
        >
          ✏️ Editar
        </button>
        <button
          onClick={onDelete}
          className="flex-1 py-2 text-center text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-colors rounded-br-xl"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default MedidaCard;