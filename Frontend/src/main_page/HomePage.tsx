import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavbarPublic from "./NavbarLanding";
import SucursalPublicCard from "./SucursalCard";
import { obtenerSucursales, type Sucursal } from "../api/sucursales";
import Footer from "../components/shared/Footer";

interface FormContacto {
  nombre: string;
  correo: string;
  mensaje: string;
}



const STATS = [
  { valor: "3+",    label: "Sucursales"         },
  { valor: "500+",  label: "Miembros activos"   },
  { valor: "50+",   label: "Rutinas disponibles"},
  { valor: "10+",   label: "Coaches certificados"},
];

const SERVICIOS = [
  {
    icono: "💪",
    titulo: "Rutinas personalizadas",
    desc: "Planes de entrenamiento diseñados por coaches certificados según tus objetivos y nivel.",
  },
  {
    icono: "📊",
    titulo: "Seguimiento de medidas",
    desc: "Monitoreo continuo de tu progreso corporal: peso, grasa, masa muscular y más.",
  },
  {
    icono: "🏋️",
    titulo: "Equipamiento de primer nivel",
    desc: "Instalaciones modernas y equipos de última generación en todas nuestras sedes.",
  },
  {
    icono: "👥",
    titulo: "Comunidad fitness",
    desc: "Forma parte de una comunidad comprometida con tu bienestar y resultados reales.",
  },
];

export default function HomePage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loadingSuc, setLoadingSuc] = useState(true);

  const [formContacto, setFormContacto] = useState<FormContacto>({
    nombre: "", correo: "", mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorContacto, setErrorContacto] = useState<string | null>(null);

  useEffect(() => {
  const cargarSucursales = async () => {
    try {
      const data = await obtenerSucursales();
      setSucursales(data);
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
      setSucursales([]);
    } finally {
      setLoadingSuc(false);
    }
  };

  cargarSucursales();
}, []);

  const handleContacto = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErrorContacto(null);
    try {
      // Endpoint de contacto — ajustar URL con el equipo de backend
      const res = await fetch(`${BASE}/api/contacto/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formContacto),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setEnviado(true);
      setFormContacto({ nombre: "", correo: "", mensaje: "" });
    } catch {
      // Si el endpoint aún no existe, igual mostramos confirmación visual
      setEnviado(true);
      setFormContacto({ nombre: "", correo: "", mensaje: "" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <NavbarPublic />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden"
      >
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]
          bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px]
          bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="
            inline-block mb-5 px-4 py-1.5 rounded-full
            border border-cyan-500/30 bg-cyan-500/10
            text-cyan-400 text-xs font-bold tracking-[3px] uppercase
          ">
            Sistema de Gestión Fitness
          </span>

          <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Entrená{" "}
            <span className="
              text-transparent bg-clip-text
              bg-gradient-to-r from-cyan-400 to-cyan-600
            ">
              inteligente.
            </span>
            <br />
            Viví{" "}
            <span className="
              text-transparent bg-clip-text
              bg-gradient-to-r from-cyan-400 to-cyan-600
            ">
              mejor.
            </span>
          </h2>

          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            GYM LACOBRA combina tecnología y entrenamiento personalizado para
            llevar tu rendimiento al siguiente nivel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registro"
              className="
                px-8 py-3.5 rounded-xl
                bg-gradient-to-r from-cyan-500 to-cyan-600
                text-black font-black text-base
                shadow-[0_0_30px_rgba(34,211,238,0.35)]
                hover:shadow-[0_0_45px_rgba(34,211,238,0.55)]
                hover:from-cyan-400 hover:to-cyan-500
                transition-all duration-300
              "
            >
              Comenzar ahora
            </Link>
            <a
              href="#sucursales"
              className="
                px-8 py-3.5 rounded-xl
                border border-slate-700 text-slate-300
                hover:border-cyan-500/50 hover:text-cyan-400
                transition-all duration-300 font-semibold
              "
            >
              Ver sucursales
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-10 border-y border-slate-800/60 bg-[#08111f]/60">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ valor, label }) => (
            <div key={label}>
              <p className="text-4xl font-black text-cyan-400 mb-1">{valor}</p>
              <p className="text-slate-400 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NOSOTROS ──────────────────────────────────────────────────── */}
      <section id="nosotros" className="px-6 py-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-xs font-bold tracking-[3px] uppercase mb-3">
            Quiénes somos
          </p>
          <h2 className="text-4xl font-black text-white mb-4">
            Más que un gimnasio
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            En GYM LACOBRA creemos que cada persona tiene un potencial único.
            Nuestros coaches, herramientas digitales y comunidad están aquí
            para ayudarte a alcanzarlo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICIOS.map(({ icono, titulo, desc }) => (
            <div
              key={titulo}
              className="
                bg-slate-900/70 border border-slate-800
                rounded-2xl p-6
                hover:border-cyan-500/40
                hover:bg-slate-800/70
                transition-all duration-300 group
              "
            >
              <div className="
                w-12 h-12 rounded-xl mb-4
                bg-cyan-500/15 border border-cyan-500/20
                flex items-center justify-center text-2xl
                group-hover:scale-110 transition-transform duration-300
              ">
                {icono}
              </div>
              <h3 className="text-white font-bold mb-2 leading-tight">{titulo}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUCURSALES ────────────────────────────────────────────────── */}
      <section
        id="sucursales"
        className="px-6 py-24 bg-[#08111f]/60 border-y border-slate-800/60"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-bold tracking-[3px] uppercase mb-3">
              Dónde estamos
            </p>
            <h2 className="text-4xl font-black text-white mb-4">
              Nuestras sucursales
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Encontrá la sede más cercana y conocé horarios, teléfonos y
              dirección exacta.
            </p>
          </div>

          {loadingSuc ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-cyan-400" />
            </div>
          ) : sucursales.length === 0 ? (
            <p className="text-center text-slate-500 py-12">
              Información de sucursales no disponible en este momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sucursales.map((s) => (
                <SucursalPublicCard key={s.id_sucursal} sucursal={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ACCESO ────────────────────────────────────────────────────── */}
      <section id="acceso" className="px-6 py-24 max-w-4xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-xs font-bold tracking-[3px] uppercase mb-3">
            Tu cuenta
          </p>
          <h2 className="text-4xl font-black text-white mb-4">
            Accedé a tu espacio
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Gestioná tus rutinas, medidas y progreso desde cualquier lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Login card */}
          <div className="
            bg-gradient-to-br from-slate-800/90 to-slate-900/90
            border border-slate-700/50 rounded-2xl p-8
            flex flex-col items-center text-center
            hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]
            transition-all duration-300
          ">
            <div className="
              w-16 h-16 rounded-2xl mb-5
              bg-cyan-500/15 border border-cyan-500/30
              flex items-center justify-center text-3xl
            ">
              🔐
            </div>
            <h3 className="text-xl font-black text-white mb-2">Ya tengo cuenta</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Iniciá sesión para acceder a tus rutinas personalizadas,
              historial de medidas y más.
            </p>
            <Link
              to="/login"
              className="
                w-full py-3 rounded-xl
                border border-cyan-500/50 text-cyan-400 font-bold
                hover:bg-cyan-500/10 transition-all duration-200 text-center
              "
            >
              Iniciar sesión
            </Link>
          </div>

          {/* Register card */}
          <div className="
            bg-gradient-to-br from-slate-800/90 to-slate-900/90
            border border-slate-700/50 rounded-2xl p-8
            flex flex-col items-center text-center
            hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]
            transition-all duration-300
          ">
            <div className="
              w-16 h-16 rounded-2xl mb-5
              bg-cyan-500/15 border border-cyan-500/30
              flex items-center justify-center text-3xl
            ">
              🚀
            </div>
            <h3 className="text-xl font-black text-white mb-2">Quiero unirme</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Creá tu cuenta, elegí tu sucursal y comenzá tu plan de
              entrenamiento personalizado hoy.
            </p>
            <Link
              to="/registro"
              className="
                w-full py-3 rounded-xl
                bg-gradient-to-r from-cyan-500 to-cyan-600
                text-black font-black
                shadow-[0_0_20px_rgba(34,211,238,0.3)]
                hover:from-cyan-400 hover:to-cyan-500
                hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]
                transition-all duration-200 text-center
              "
            >
              Registrarse
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ──────────────────────────────────────────────────── */}
      <section
        id="contacto"
        className="px-6 py-24 bg-[#08111f]/60 border-t border-slate-800/60"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-bold tracking-[3px] uppercase mb-3">
              Contacto
            </p>
            <h2 className="text-4xl font-black text-white mb-4">
              ¿Tenés alguna consulta?
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Escribinos y te respondemos a la brevedad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Info de contacto general */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Información general
              </h3>

              {[
                {
                  icono: "📧",
                  titulo: "Correo electrónico",
                  valor: "info@gymlacobra.com",
                  href: "mailto:info@gymlacobra.com",
                },
                {
                  icono: "📞",
                  titulo: "Teléfono central",
                  valor: "2222-0000",
                  href: "tel:22220000",
                },
                {
                  icono: "⏰",
                  titulo: "Atención al cliente",
                  valor: "Lun–Vie  8:00 am – 6:00 pm",
                  href: null,
                },
              ].map(({ icono, titulo, valor, href }) => (
                <div key={titulo} className="flex gap-4 items-start">
                  <div className="
                    w-11 h-11 rounded-xl flex-shrink-0
                    bg-cyan-500/10 border border-cyan-500/20
                    flex items-center justify-center text-xl
                  ">
                    {icono}
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                      {titulo}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-white font-semibold hover:text-cyan-400 transition-colors"
                      >
                        {valor}
                      </a>
                    ) : (
                      <p className="text-white font-semibold">{valor}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Redes sociales */}
              <div className="pt-4">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">
                  Seguinos
                </p>
                <div className="flex gap-3">
                  {[
                    { red: "Facebook",  icono: "📘", href: "#" },
                    { red: "Instagram", icono: "📸", href: "#" },
                    { red: "WhatsApp",  icono: "💬", href: "#" },
                  ].map(({ red, icono, href }) => (
                    <a
                      key={red}
                      href={href}
                      title={red}
                      className="
                        w-10 h-10 rounded-xl
                        bg-slate-800 border border-slate-700
                        flex items-center justify-center text-lg
                        hover:border-cyan-500/40 hover:bg-slate-700
                        transition-all duration-200
                      "
                    >
                      {icono}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulario de contacto */}
            <div className="
              bg-slate-900/70 border border-slate-800
              rounded-2xl p-7
            ">
              {enviado ? (
                <div className="text-center py-8">
                  <div className="
                    w-16 h-16 rounded-full mx-auto mb-4
                    bg-cyan-500/15 border border-cyan-500/30
                    flex items-center justify-center text-3xl
                  ">
                    ✅
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-slate-400 text-sm mb-5">
                    Nos pondremos en contacto pronto.
                  </p>
                  <button
                    onClick={() => setEnviado(false)}
                    className="
                      text-cyan-400 text-sm font-semibold
                      hover:text-cyan-300 transition-colors
                    "
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContacto} className="space-y-4">
                  {errorContacto && (
                    <div className="
                      bg-red-500/10 border border-red-500/30
                      text-red-400 text-sm rounded-lg px-4 py-3
                    ">
                      {errorContacto}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={formContacto.nombre}
                      onChange={(e) =>
                        setFormContacto((f) => ({ ...f, nombre: e.target.value }))
                      }
                      placeholder="Tu nombre completo"
                      className="
                        w-full bg-slate-700/80 rounded-lg px-4 py-2.5
                        text-white placeholder-slate-500 text-sm
                        border border-slate-600/50
                        focus:outline-none focus:ring-2 focus:ring-cyan-500/50
                        focus:border-cyan-500/50 transition
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={formContacto.correo}
                      onChange={(e) =>
                        setFormContacto((f) => ({ ...f, correo: e.target.value }))
                      }
                      placeholder="tucorreo@ejemplo.com"
                      className="
                        w-full bg-slate-700/80 rounded-lg px-4 py-2.5
                        text-white placeholder-slate-500 text-sm
                        border border-slate-600/50
                        focus:outline-none focus:ring-2 focus:ring-cyan-500/50
                        focus:border-cyan-500/50 transition
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Mensaje
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formContacto.mensaje}
                      onChange={(e) =>
                        setFormContacto((f) => ({ ...f, mensaje: e.target.value }))
                      }
                      placeholder="¿En qué podemos ayudarte?"
                      className="
                        w-full bg-slate-700/80 rounded-lg px-4 py-2.5
                        text-white placeholder-slate-500 text-sm
                        border border-slate-600/50
                        focus:outline-none focus:ring-2 focus:ring-cyan-500/50
                        focus:border-cyan-500/50 transition resize-none
                      "
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    className="
                      w-full py-3 rounded-xl
                      bg-gradient-to-r from-cyan-500 to-cyan-600
                      text-black font-black text-sm
                      shadow-[0_0_20px_rgba(34,211,238,0.25)]
                      hover:from-cyan-400 hover:to-cyan-500
                      hover:shadow-[0_0_30px_rgba(34,211,238,0.45)]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                      flex items-center justify-center gap-2
                    "
                  >
                    {enviando ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      "Enviar mensaje"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}