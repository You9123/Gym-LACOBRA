import { useState } from "react";

interface EditarEjercicioFormProps {
  detalle: {
    id_detalle_rutina: number;
    ejercicio_nombre: string;
    series: number;
    repeticiones: number;
    descanso_segundos: number;
    orden_ejercicio: number;
  };
  onSubmit: (idDetalle: number, data: any) => Promise<void>;
  onCancel: () => void;
}

const EditarEjercicioForm = ({ detalle, onSubmit, onCancel }: EditarEjercicioFormProps) => {
  const [series, setSeries] = useState(detalle.series.toString());
  const [repeticiones, setRepeticiones] = useState(detalle.repeticiones.toString());
  const [descanso, setDescanso] = useState(detalle.descanso_segundos.toString());
  const [orden, setOrden] = useState(detalle.orden_ejercicio.toString());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(detalle.id_detalle_rutina, {
        series: Number(series),
        repeticiones: Number(repeticiones),
        descanso_segundos: Number(descanso),
        orden_ejercicio: Number(orden)
      });
    } catch (error) {
      console.error("Error al editar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Editando: {detalle.ejercicio_nombre}
        </h2>
        <p className="text-slate-400 text-sm">
          Modifica los valores del ejercicio
        </p>
      </div>

      <div className="space-y-4">
        {/* Series */}
        <div>
          <label className="block text-cyan-400 text-sm font-bold mb-2">
            Series
          </label>
          <input
            type="number"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>

        {/* Repeticiones */}
        <div>
          <label className="block text-cyan-400 text-sm font-bold mb-2">
            Repeticiones
          </label>
          <input
            type="number"
            value={repeticiones}
            onChange={(e) => setRepeticiones(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>

        {/* Descanso */}
        <div>
          <label className="block text-cyan-400 text-sm font-bold mb-2">
            Descanso (segundos)
          </label>
          <input
            type="number"
            value={descanso}
            onChange={(e) => setDescanso(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>

        {/* Orden */}
        <div>
          <label className="block text-cyan-400 text-sm font-bold mb-2">
            Orden del ejercicio
          </label>
          <input
            type="number"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-cyan-600 hover:bg-cyan-500 p-3 rounded-lg text-white font-bold disabled:opacity-50 transition-colors"
        >
          {loading ? "Guardando..." : "💾 Guardar Cambios"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-zinc-700 hover:bg-zinc-600 p-3 rounded-lg text-white font-bold transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarEjercicioForm;