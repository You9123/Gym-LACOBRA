import type { ReactNode }
from "react";

interface ModalProps{

    isOpen:boolean;

    onClose:()=>void;

    title:string;

    children:ReactNode;

}

const Modal = ({
    isOpen,
    onClose,
    title,
    children
}:ModalProps)=>{

    if(!isOpen)
        return null;

    return(

        <div
            className="
                fixed
                inset-0
                bg-black/60
                flex
                justify-center
                items-center
                z-50
            "
        >

            <div
                className="
                    bg-zinc-900
                    rounded-2xl
                    p-6
                    w-[600px]
                    border
                    border-zinc-700
                "
            >

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-6
                    "
                >

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-white
                        "
                    >

                        {title}

                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            text-red-400
                            text-xl
                        "
                    >

                        ✕

                    </button>

                </div>

                {children}

            </div>

        </div>

    );

};

export default Modal;