import type { Distrito }
from "../../api/ubicaciones";

interface Props{
    onEdit?: ()=>void;
    onDelete?: ()=>void;
    [key:string]: any;

    distrito?:Distrito;
    ubicacion?: any;

}

const UbicacionCard = ({
    onEdit,
    onDelete,

    distrito,
    ubicacion
}:Props)=>{

    distrito = distrito || ubicacion;

    return(

        <div className="
        bg-slate-900/70
        border border-slate-800
        rounded-2xl
        p-5
        shadow-lg
        hover:border-cyan-500/40
        transition-all">

            <div className="
            flex gap-4 mb-5">

                <div className="
                w-16
                h-16
                rounded-full
                bg-cyan-500/15
                border border-cyan-500/30
                flex
                justify-center
                items-center
                text-3xl">

                    🌎

                </div>

                <div>

                    <h2 className="
                    text-xl
                    font-bold">

                        {distrito.nombre}

                    </h2>

                    <p className="
                    text-cyan-400
                    text-sm">

                        Distrito

                    </p>

                </div>

            </div>

            <div className="space-y-4">

                <div className="
                flex gap-4 items-center">

                    <span className="text-2xl">

                        🏙️

                    </span>

                    <p className="text-slate-300">

                        {
                            distrito.canton_nombre
                        }

                    </p>

                </div>

                <div className="
                flex gap-4 items-center">

                    <span className="text-2xl">

                        📍

                    </span>

                    <p className="text-white">

                        {
                            distrito
                            .provincia_nombre
                        }

                    </p>

                </div>

            </div>

        </div>

    );

};

export default UbicacionCard;