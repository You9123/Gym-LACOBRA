import { Link } from "react-router-dom";

const NavbarPublic = () => {
  return (
    <header className="sticky top-0 z-50">
      <nav
        className="
          bg-[#08111f]/90
          backdrop-blur-xl
          border-b border-slate-800/70
          px-8 py-3
          flex justify-between items-center
          gap-8
        "
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center cursor-pointer group">
          <img
  src="/lacobra-logo.jpeg"
  alt="GYM LACOBRA"
  className="
    h-28 w-[320px]
    rounded-2xl object-cover object-left
    shadow-[0_0_30px_rgba(34,211,238,0.18)]
    border border-cyan-500/20
    group-hover:border-cyan-400/40
    transition-all duration-300
  "
/>
        </Link>

        {/* Navegación interna de la landing */}
        <ul className="hidden md:flex items-center gap-8">
          {[
            { label: "Inicio", href: "#hero" },
            { label: "Nosotros", href: "#nosotros" },
            { label: "Sucursales", href: "#sucursales" },
            { label: "Contacto", href: "#contacto" },
          ].map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="
                  relative text-slate-300 font-medium
                  hover:text-cyan-400 transition-all duration-300
                  after:absolute after:left-0 after:-bottom-1
                  after:h-[2px] after:w-0 after:bg-cyan-400
                  after:transition-all after:duration-300
                  hover:after:w-full
                "
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/login"
            className="
              px-5 py-2 rounded-lg
              border border-cyan-500/50
              text-cyan-400 font-semibold text-sm
              hover:bg-cyan-500/10 transition-all duration-200
            "
          >
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            className="
              px-5 py-2 rounded-lg
              bg-gradient-to-r from-cyan-500 to-cyan-600
              text-black font-black text-sm
              shadow-[0_0_20px_rgba(34,211,238,0.3)]
              hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]
              hover:from-cyan-400 hover:to-cyan-500
              transition-all duration-200
            "
          >
            Registrarse
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavbarPublic;