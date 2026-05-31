import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { iniciarSesion } from "../api/usuarios";

// Diccionario de enrutamiento basado en los IDs de Oracle
const DIRECCIONES_POR_ROL: Record<number, string> = {
  1: "/dashboard",        // Admin
  2: "/coach/dashboard",  // Coach
  3: "/cliente/dashboard" // Cliente (O la ruta que definas a futuro)
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await iniciarSesion(formData);

      if (response.token && response.usuario) {
        const { id_rol, id_usuario } = response.usuario;

        // Persistencia en el almacenamiento local
        localStorage.setItem("token", response.token);
        localStorage.setItem("usuario", JSON.stringify(response.usuario));
        localStorage.setItem("id_rol", String(id_rol));
        localStorage.setItem("id_usuario", String(id_usuario));

        // Redirección directa por diccionario sin condicionales if-else anidados
        const rolNumerico = Number(id_rol) || 0;
        const rutaDestino = DIRECCIONES_POR_ROL[rolNumerico] || "/";
        navigate(rutaDestino);

      } else {
        setError("Credenciales incorrectas");
      }
    } catch (err: any) {
      console.error("Error de login:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Error al iniciar sesión. Verificá tus credenciales.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Glow de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[600px] h-[400px] bg-cyan-500/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="
              w-20 h-20 mx-auto mb-4 rounded-2xl
              bg-gradient-to-br from-cyan-400 to-cyan-600
              flex items-center justify-center
              text-black font-black text-3xl
              shadow-[0_0_35px_rgba(34,211,238,0.45)]
            ">
              G
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              <span className="text-cyan-400">GYM</span>LACOBRA
            </h1>
            <p className="text-slate-400 text-sm mt-1">Sistema de Gestión</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                placeholder="usuario@ejemplo.com"
                className="
                  w-full bg-slate-700 rounded-lg px-4 py-2.5 text-white
                  placeholder-slate-500 text-sm
                  border border-slate-600/50
                  focus:outline-none focus:ring-2 focus:ring-cyan-400/50
                  focus:border-cyan-400/50 transition
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="
                  w-full bg-slate-700 rounded-lg px-4 py-2.5 text-white
                  placeholder-slate-500 text-sm
                  border border-slate-600/50
                  focus:outline-none focus:ring-2 focus:ring-cyan-400/50
                  focus:border-cyan-400/50 transition
                "
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-2.5 rounded-lg font-black text-black text-sm
                bg-gradient-to-r from-cyan-500 to-cyan-600
                hover:from-cyan-400 hover:to-cyan-500
                shadow-[0_0_20px_rgba(34,211,238,0.3)]
                hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Link a registro */}
          <p className="text-center text-slate-500 text-sm mt-6">
            ¿No tenés cuenta?{" "}
            <Link
              to="/registro"
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
            >
              Registrarse
            </Link>
          </p>
        </div>

        {/* Volver al inicio */}
        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
