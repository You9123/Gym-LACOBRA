import { useEffect, useState } from "react";
import {
  obtenerCategoriasEjercicios,
  obtenerDificultadesEjercicios,
  type CategoriaEjercicio,
  type DificultadEjercicio,
} from "../../api/ejercicios";

const EjercicioForm = (props: any) => {
  const { onCancel, initialData } = props;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [calorias, setCalorias] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [rutaGif, setRutaGif] = useState("");
  const [errorGif, setErrorGif] = useState("");
  const [categorias, setCategorias] = useState<CategoriaEjercicio[]>([]);
  const [dificultades, setDificultades] = useState<DificultadEjercicio[]>([]);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const catData = await obtenerCategoriasEjercicios();
        const difData = await obtenerDificultadesEjercicios();
        setCategorias(catData);
        setDificultades(difData);
      } catch (error) {
        console.error(error);
      }
    };
    cargarCatalogos();
  }, []);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setDescripcion(initialData.descripcion || "");
      setCalorias(initialData.calorias_estimadas?.toString() || "");
      setCategoria(initialData.id_categoria?.toString() || "");
      setDificultad(initialData.id_dificultad?.toString() || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación: si se ingresó algo en el campo GIF, debe terminar en .gif
    if (rutaGif.trim()) {
      const lower = rutaGif.trim().toLowerCase();
      if (!lower.endsWith(".gif")) {
        setErrorGif("La ruta del GIF debe terminar en .gif");
        return;
      }
    }
    setErrorGif("");

    await props.onSubmit({
      nombre,
      descripcion,
      calorias_estimadas: Number(calorias),
      id_categoria: Number(categoria),
      id_dificultad: Number(dificultad),
      rutaGif,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-cyan-400 mb-2">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-cyan-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-400 mb-2">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-cyan-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-400 mb-2">Calorías estimadas</label>
        <input
          type="number"
          value={calorias}
          onChange={(e) => setCalorias(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-cyan-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-400 mb-2">Categoría</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-cyan-500 outline-none"
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre_categoria}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-400 mb-2">Dificultad</label>
        <select
          value={dificultad}
          onChange={(e) => setDificultad(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-cyan-500 outline-none"
        >
          <option value="">Seleccione una dificultad</option>
          {dificultades.map((dif) => (
            <option key={dif.id_dificultad} value={dif.id_dificultad}>
              {dif.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-400 mb-2">
          Ruta del GIF demostrativo
        </label>
        <input
          type="text"
          value={rutaGif}
          onChange={(e) => {
            setRutaGif(e.target.value);
            if (errorGif) setErrorGif("");
          }}
          placeholder="Ejemplo: sentadilla.gif (debe terminar en .gif)"
          className="w-full p-3 rounded-lg bg-zinc-800"
        />
        {errorGif && <p className="text-red-400 text-sm mt-1">{errorGif}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-lg transition font-semibold"
        >
          {initialData ? "Guardar Cambios" : "Crear Ejercicio"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-5 py-3 rounded-lg transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EjercicioForm;