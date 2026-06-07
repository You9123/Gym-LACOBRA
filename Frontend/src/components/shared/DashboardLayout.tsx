import type { ReactNode }
from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

interface Props{

    children:ReactNode;

}

const DashboardLayout = ({
    children
}:Props)=>{

    return(

        <div
            className="
                min-h-screen
                bg-zinc-950
                text-white
                flex
                flex-col
            "
        >

            <Navbar/>

            <div
                className="
                    flex
                    flex-1
                "
            >

                <aside
                    className="
                        w-64
                        bg-zinc-900
                        border-r
                        border-zinc-800
                        p-6
                    "
                >

                    <h2
                        className="
                            text-cyan-400
                            text-xl
                            font-bold
                            mb-8
                        "
                    >

                        Menú

                    </h2>

                    <ul
                        className="
                            space-y-5
                            text-zinc-300
                        "
                    >

                        <li>Usuarios</li>

                        <li>Ejercicios</li>

                        <li>Rutinas</li>

                        <li>Medidas</li>

                        <li>Sucursales</li>

                        <li>Reportes</li>

                    </ul>

                </aside>

                <main
                    className="
                        flex-1
                        p-8
                    "
                >

                    {children}

                </main>

            </div>

            <Footer/>

        </div>

    );

};

export default DashboardLayout;