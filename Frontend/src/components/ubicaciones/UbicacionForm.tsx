import {
    useEffect,
    useState
}
from "react";

import {

    obtenerProvincias,
    obtenerCantones,
    obtenerDistritos,

    type Provincia,
    type Canton,
    type Distrito

}
from "../../api/ubicaciones";

const UbicacionForm = (props:any)=>{

    const [provincias,setProvincias]=
        useState<Provincia[]>([]);

    const [cantones,setCantones]=
        useState<Canton[]>([]);

    const [distritos,setDistritos]=
        useState<Distrito[]>([]);

    useEffect(()=>{

        obtenerProvincias()
        .then(
            setProvincias
        );

    },[]);

    return(

        <div
            className="
                bg-zinc-900
                p-8
                rounded-2xl
                space-y-4
            "
        >

            <select
                className="
                    w-full
                    p-3
                    rounded-lg
                    bg-zinc-800
                "
            >

                <option>

                    Provincia

                </option>

                {

                    provincias.map(p=>(

                        <option
                            key={
                                p.id_provincia
                            }
                        >

                            {p.nombre}

                        </option>

                    ))

                }

            </select>

        </div>

    );

};

export default UbicacionForm;