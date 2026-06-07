interface Props{

    onConfirm:()=>void;

    onCancel:()=>void;

}

const ConfirmDelete = ({
    onConfirm,
    onCancel
}:Props)=>{

    return(

        <div
            className="
                space-y-6
            "
        >

            <p
                className="
                    text-zinc-300
                "
            >

                ¿Seguro que deseas eliminar este registro?

            </p>

            <div
                className="
                    flex
                    gap-4
                "
            >

                <button
                    onClick={onConfirm}
                    className="
                        bg-red-600
                        px-5
                        py-2
                        rounded-lg
                    "
                >

                    Eliminar

                </button>

                <button
                    onClick={onCancel}
                    className="
                        bg-zinc-700
                        px-5
                        py-2
                        rounded-lg
                    "
                >

                    Cancelar

                </button>

            </div>

        </div>

    );

};

export default ConfirmDelete;