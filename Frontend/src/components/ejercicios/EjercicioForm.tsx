import { useEffect,useState } from "react";

import {
    
    obtenerCategoriasEjercicios,
    obtenerDificultadesEjercicios,

    type CategoriaEjercicio,
    type DificultadEjercicio

} from "../../api/ejercicios";

const EjercicioForm = (props:any)=>{

    const { onCancel} = props;

    const [nombre,setNombre]=useState("");

    const [descripcion,setDescripcion]=useState("");

    const [calorias,setCalorias]=useState("");

    const [categoria,setCategoria]=useState("");

    const [dificultad,setDificultad]=useState("");

    const [categorias,setCategorias]=useState<CategoriaEjercicio[]>([]);

    const [dificultades,setDificultades]=useState<DificultadEjercicio[]>([]);

    useEffect(()=>{

        const cargarCatalogos = async()=>{

            try{

                const catData =
                    await obtenerCategoriasEjercicios();

                const difData =
                    await obtenerDificultadesEjercicios();

                setCategorias(catData);

                setDificultades(difData);

            }

            catch(error){

                console.error(error);

            }

        };

        cargarCatalogos();

    },[]);

const handleSubmit = async (
    e: React.FormEvent
) => {

    e.preventDefault();

    try {

        await props.onSubmit({

            nombre,

            descripcion,

            calorias_estimadas: Number(
                calorias
            ),

            id_categoria: Number(
                categoria
            ),

            id_dificultad: Number(
                dificultad
            )

        });

    }

    catch(error){

        console.error(error);

    }

};

    return(

        <form
            onSubmit={handleSubmit}
            className="
                bg-zinc-900
                p-8
                rounded-2xl
                space-y-4
            "
        >

            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e)=>
                    setNombre(
                        e.target.value
                    )
                }
                className="
                    w-full
                    p-3
                    rounded-lg
                    bg-zinc-800
                "
            />

            <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e)=>
                    setDescripcion(
                        e.target.value
                    )
                }
                className="
                    w-full
                    p-3
                    rounded-lg
                    bg-zinc-800
                "
            />

            <input
                type="number"
                placeholder="Calorías"
                value={calorias}
                onChange={(e)=>
                    setCalorias(
                        e.target.value
                    )
                }
                className="
                    w-full
                    p-3
                    rounded-lg
                    bg-zinc-800
                "
            />

            <select
                value={categoria}
                onChange={(e)=>
                    setCategoria(
                        e.target.value
                    )
                }
                className="
                    w-full
                    p-3
                    rounded-lg
                    bg-zinc-800
                "
            >

                <option value="">

                    Categoría

                </option>

                {

                    categorias.map(cat=>(

                        <option
                            key={
                                cat.id_categoria
                            }
                            value={
                                cat.id_categoria
                            }
                        >

                            {cat.nombre_categoria}

                        </option>

                    ))

                }

            </select>

            <select
                value={dificultad}
                onChange={(e)=>
                    setDificultad(
                        e.target.value
                    )
                }
                className="
                    w-full
                    p-3
                    rounded-lg
                    bg-zinc-800
                "
            >

                <option value="">

                    Dificultad

                </option>

                {

                    dificultades.map(dif=>(

                        <option
                            key={
                                dif.id_dificultad
                            }
                            value={
                                dif.id_dificultad
                            }
                        >

                            {dif.nombre}

                        </option>

                    ))

                }

            </select>

          <div className="flex gap-3">

    <button
        type="submit"
        className="
            flex-1
            bg-cyan-600
            hover:bg-cyan-500
            text-white
            p-3
            rounded-lg
            transition
        "
    >
        Crear Ejercicio
    </button>

    <button
        type="button"
        onClick={onCancel}  
        className="
            flex-1
            bg-zinc-700
            hover:bg-zinc-600
            text-white
            px-5
            py-3
            rounded-lg
            transition
        "
    >
        Cancelar
    </button>

</div>

        </form>

    );

};

export default EjercicioForm;