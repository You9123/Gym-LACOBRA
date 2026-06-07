import { useState } from "react";

const RutinaForm = (props:any) => {

    const [nombre,setNombre] =
        useState("");

    const [objetivo,setObjetivo] =
        useState("");

    const [descripcion,setDescripcion] =
        useState("");

    const [coach,setCoach] =
        useState("");

    const handleSubmit = async(
        e:React.FormEvent
    ) => {

        e.preventDefault();

        try {

            await props.onSubmit({

                nombre,

                objetivo,

                descripcion,

                id_coach:Number(coach)

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
                placeholder="Nombre de la rutina"
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

            <input
                type="text"
                placeholder="Objetivo"
                value={objetivo}
                onChange={(e)=>
                    setObjetivo(
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
                placeholder="ID Coach"
                value={coach}
                onChange={(e)=>
                    setCoach(
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

            <div className="flex gap-3">

                <button
                    type="submit"
                    className="
                        flex-1
                        bg-purple-600
                        p-3
                        rounded-lg
                    "
                >

                    Crear Rutina

                </button>

                <button
                    type="button"
                    onClick={props.onCancel}
                    className="
                        flex-1
                        bg-zinc-700
                        p-3
                        rounded-lg
                    "
                >

                    Cancelar

                </button>

            </div>

        </form>

    );

};

export default RutinaForm;