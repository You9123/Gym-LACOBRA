import { Link } from "react-router-dom";

const Navbar = () => {

  const links = [

    { name:"Dashboard", path:"/" },

    { name:"Usuarios", path:"/usuarios" },

    { name:"Ejercicios", path:"/ejercicios" },

    { name:"Medidas", path:"/medidas" },

    { name:"Rutinas", path:"/rutinas" },

    { name:"Reportes", path:"/reportes" },

    { name:"Sucursales", path:"/sucursales" }

  ];

  return (

    <header className="sticky top-0 z-50">

      <nav className="
      bg-[#08111f]/80
      backdrop-blur-xl
      border-b border-slate-800/70
      px-10
      py-5
      flex
      justify-between
      items-center">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-4 cursor-pointer"
        >

          <div className="
          w-12
          h-12
          rounded-2xl
          bg-gradient-to-br
          from-cyan-400
          to-cyan-600
          flex
          items-center
          justify-center
          text-black
          font-black
          text-xl
          shadow-[0_0_35px_rgba(34,211,238,0.45)]">

            G

          </div>

          <div>

            <h1 className="text-3xl font-black tracking-wide">

              <span className="text-cyan-400">

                GYM

              </span>

              <span className="text-white">

                LACOBRA

              </span>

            </h1>

            <p className="text-slate-500 text-xs tracking-[4px] uppercase">

              Fitness Management System

            </p>

          </div>

        </Link>

        {/* LINKS */}

        <ul className="flex items-center gap-10">

          {links.map((item)=>(

            <li key={item.name}>

              <Link

                to={item.path}

                className="
                relative
                text-slate-300
                font-medium
                hover:text-cyan-400
                transition-all
                duration-300
                after:absolute
                after:left-0
                after:-bottom-2
                after:h-[2px]
                after:w-0
                after:bg-cyan-400
                after:transition-all
                after:duration-300
                hover:after:w-full"

              >

                {item.name}

              </Link>

            </li>

          ))}

        </ul>

      </nav>

    </header>

  );

};

export default Navbar;