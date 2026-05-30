import { useState, useEffect } from "react";
import { obtenerEjercicios } from "../../api/ejercicios"; 

interface Ejercicio {
  id_ejercicio: number;
  nombre: string;
}

const DetalleRutinaForm = ({ idRutina, onSubmit, onCancel }: any) => {
    const [ejercicio, setEjercicio] = useState("");
    const [series, setSeries] = useState("");
    const [repeticiones, setRepeticiones] = useState("");
    const [descanso, setDescanso] = useState("");
    const [orden, setOrden] = useState("");
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);

    
    const cargarEjercicios = async () => {
        try {
            const data = await obtenerEjercicios();
            setEjercicios(data);
        } catch (error) {
            console.error("Error cargando ejercicios:", error);
        }
    };

    useEffect(() => {
        cargarEjercicios();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await onSubmit({
                id_rutina: idRutina,
                id_ejercicio: Number(ejercicio),
                series: Number(series),
                repeticiones: Number(repeticiones),
                descanso_segundos: Number(descanso),
                orden_ejercicio: Number(orden)
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-2xl space-y-4">
            <h2 className="text-2xl font-bold text-white">
                Agregar Ejercicio a Rutina
            </h2>

            <select
                value={ejercicio}
                onChange={(e) => setEjercicio(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white"
                required
            >
                <option value="">Selecciona un ejercicio</option>
                {ejercicios.map((ej) => (
                    <option key={ej.id_ejercicio} value={ej.id_ejercicio}>
                        {ej.nombre}
                    </option>
                ))}
            </select>

            <input
                type="number"
                placeholder="Series"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white"
                required
            />

            <input
                type="number"
                placeholder="Repeticiones"
                value={repeticiones}
                onChange={(e) => setRepeticiones(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white"
                required
            />

            <input
                type="number"
                placeholder="Descanso (segundos)"
                value={descanso}
                onChange={(e) => setDescanso(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white"
                required
            />

            <input
                type="number"
                placeholder="Orden del ejercicio"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white"
                required
            />

            <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-cyan-600 p-3 rounded-lg text-white">
                    Agregar Ejercicio
                </button>
                <button type="button" onClick={onCancel} className="flex-1 bg-zinc-700 p-3 rounded-lg text-white">
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default DetalleRutinaForm;