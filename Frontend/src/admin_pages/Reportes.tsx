import { useState } from 'react';
import { obtenerReporteGrasa } from '../api/reportes';
import ReporteGrasaList from '../components/reportes/ReporteGrasaList';

const Reportes = () => {
  const [loading, setLoading] = useState(false);
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [umbral, setUmbral] = useState(25);
  const [error, setError] = useState<string | null>(null);

  const generarReporteGrasa = async () => {
    setLoading(true);
    setError(null);
    try {
      await obtenerReporteGrasa(umbral);
      setMostrarReporte(true);
    } catch (err) {
      console.error('Error generando reporte:', err);
      setError('Error al generar el reporte. Verifica la conexión con el servidor.');
      setMostrarReporte(false);
    } finally {
      setLoading(false);
    }
  };

  const limpiarReporte = () => {
    setMostrarReporte(false);
    setError(null);
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6">Reportes del Sistema</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de controles */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Reportes Disponibles</h2>
            
            {/* Selector de umbral */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Umbral de grasa corporal (%)
              </label>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={umbral}
                onChange={(e) => setUmbral(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>10</span>
                <span>15</span>
                <span>20</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
                <span>40</span>
              </div>
              <p className="text-center text-cyan-400 font-bold mt-2">
                Mostrar clientes con &gt; {umbral}% de grasa
              </p>
            </div>
            
            <button
              onClick={generarReporteGrasa}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg transition-colors disabled:opacity-50 mb-3"
            >
              {loading ? 'Generando...' : '📊 Reporte de Grasa Corporal'}
            </button>

            {mostrarReporte && (
              <button
                onClick={limpiarReporte}
                className="w-full bg-slate-700 hover:bg-slate-600 py-2 rounded-lg transition-colors"
              >
                🗑️ Limpiar Reporte
              </button>
            )}
          </div>
        </div>

        {/* Vista del reporte */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Reporte de Grasa Corporal 
              {mostrarReporte && <span className="text-sm text-cyan-400 ml-2">(Umbral: &gt; {umbral}%)</span>}
            </h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <p className="mt-2">Generando reporte...</p>
              </div>
            )}

            {!loading && !mostrarReporte && !error && (
              <div className="text-center py-20 text-slate-400">
                <p className="text-6xl mb-4">📊</p>
                <p>Selecciona un umbral y genera el reporte</p>
              </div>
            )}

            {mostrarReporte && !loading && (
              <ReporteGrasaList umbral={umbral} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;