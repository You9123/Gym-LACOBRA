import { Link, useNavigate } from "react-router-dom";

interface EnlaceNavegacion {
  name: string;
  path: string;
}

// 1. Catálogo de menús independientes por ID de Rol de Oracle (1=Admin, 2=Coach, 3=Cliente)
const MENUS_POR_ROL: Record<number, EnlaceNavegacion[]> = {
  1: [ // 💡 MENÚ ADMINISTRADOR ACTUALIZADO
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Usuarios", path: "/admin/usuarios" },
    { name: "Ejercicios", path: "/admin/ejercicios" },
    { name: "Medidas", path: "/admin/medidas" },
    { name: "Rutinas", path: "/admin/rutinas" },
    { name: "Reportes", path: "/admin/reportes" },
    { name: "Sucursales", path: "/admin/sucursales" }
  ],
  2: [ // Coach se mantiene igual
    { name: "Dashboard Coach", path: "/coach/dashboard" },
    { name: "Diseñar Rutina", path: "/coach/rutinas/crear" }
  ],

  3: [ // CLIENTE / ALUMNO
    { name: "Mi Progreso", path: "/cliente/dashboard" },
    { name: "Mis Rutinas", path: "/cliente/rutinas" },
    { name: "Solicitar Coach", path: "/cliente/solicitar-coach" },
    { name: "Mis Datos", path: "/cliente/datos-personales" },
  ]
};

const Navbar = () => {
  const navigate = useNavigate();

  // 2. Extraemos el estado de autenticación y rol del localStorage
  const token = localStorage.getItem("token");
  const idRol = Number(localStorage.getItem("id_rol")) || 0;

  // 3. Obtenemos la lista de enlaces correspondientes al rol logueado
  const links = MENUS_POR_ROL[idRol] || [];

  // 4. Función para limpiar la sesión y bloquear guards
  const manejarLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
              <span className="text-cyan-400">GYM</span>
              <span className="text-white">LACOBRA</span>
            </h1>
            <p className="text-slate-500 text-xs tracking-[4px] uppercase">
              Fitness Management System
            </p>
          </div>
        </Link>

        {/* LINKS DINÁMICOS Y LOGOUT */}
        <div className="flex items-center gap-10">
          <ul className="flex items-center gap-10">
            {/* Solo renderiza los enlaces si el usuario ha iniciado sesión */}
            {token && links.map((item) => (
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

          {/* Botón de control de sesión */}
          {token && (
            <button
              onClick={manejarLogout}
              className="
                ml-4
                bg-red-500/10 
                hover:bg-red-600 
                text-red-400 
                hover:text-white 
                border 
                border-red-500/20 
                text-xs 
                font-bold 
                px-4 
                py-2 
                rounded-lg 
                transition-all 
                duration-300
                shadow-[0_0_15px_rgba(239,68,68,0.05)]
                hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]
              "
            >
              Cerrar Sesión
            </button>
          )}
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
