import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { obtenerSexos, crearUsuario } from "../api/usuarios";
import { obtenerSucursales } from "../api/sucursales";
import { obtenerDistritos, obtenerCantones } from "../api/ubicaciones";
import type { Sexo } from "../api/usuarios";
import type { Sucursal } from "../api/sucursales";
import type { Distrito, Canton } from "../api/ubicaciones";

const RegistroPage = () => {
  const navigate = useNavigate();

  // Catálogos
  const [sexos,      setSexos]      = useState<Sexo[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [distritos,  setDistritos]  = useState<Distrito[]>([]);
  const [distritosFiltrados, setDistritosFiltrados] = useState<Distrito[]>([]);
  const [loadingCat, setLoadingCat] = useState(true);
  

  // Form
  const [formData, setFormData] = useState({
    nombre:           "",
    apellido:         "",
    correo:           "",
    contrasena:       "",
    confirmar:        "",
    telefono:         "",
    fecha_nacimiento: "",
    id_sexo:          "",
    id_sucursal:      "",
    id_distrito:      "",
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const [cantones, setCantones] = useState<Canton[]>([]);

  useEffect(() => {
    Promise.all([
      obtenerSexos(),
      obtenerSucursales(),
      obtenerDistritos(),
      obtenerCantones(),
    ])
      .then(([s, suc, dis, can]) => {
        setSexos(s);
        setSucursales(suc);
        setDistritos(dis);
        setCantones(can);
      })
      .catch(() => {})
      .finally(() => setLoadingCat(false));
  }, []);

  useEffect(() => {
    if (!formData.id_sucursal) {
      setDistritosFiltrados([]);
      setFormData((f) => ({ ...f, id_distrito: "" }));
      return;
    }

    const sucursal = sucursales.find(
      (s) => s.id_sucursal === Number(formData.id_sucursal)
    );

    if (!sucursal?.id_distrito) {
      setDistritosFiltrados([]);
      setFormData((f) => ({ ...f, id_distrito: "" }));
      return;
    }

    const distritoSucursal = distritos.find(
      (d) => d.id_distrito === sucursal.id_distrito
    );

    if (!distritoSucursal) {
      setDistritosFiltrados([]);
      setFormData((f) => ({ ...f, id_distrito: "" }));
      return;
    }

    const cantonSucursal = cantones.find(
      (c) => c.id_canton === distritoSucursal.id_canton
    );

    if (!cantonSucursal) {
      setDistritosFiltrados([]);
      setFormData((f) => ({ ...f, id_distrito: "" }));
      return;
    }

    const idsCantonesProvincia = new Set(
      cantones
        .filter((c) => c.id_provincia === cantonSucursal.id_provincia)
        .map((c) => c.id_canton)
    );

    const distritosMismaProvincia = distritos.filter((d) =>
      idsCantonesProvincia.has(d.id_canton)
    );

    setDistritosFiltrados(distritosMismaProvincia);
    setFormData((f) => ({ ...f, id_distrito: "" }));
  }, [formData.id_sucursal, sucursales, distritos, cantones]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (formData.contrasena !== formData.confirmar) {
    setError("Las contraseñas no coinciden.");
    return;
  }
  if (!formData.id_sexo) {
    setError("Por favor seleccioná un sexo.");
    return;
  }

  setLoading(true);
  try {
    await crearUsuario({
      nombre:           formData.nombre,
      apellido:         formData.apellido,
      correo:           formData.correo,
      contrasena:       formData.contrasena,
      telefono:         formData.telefono || null,
      fecha_nacimiento: formData.fecha_nacimiento || null,
      id_sexo:          parseInt(formData.id_sexo),
      id_sucursal:      formData.id_sucursal ? parseInt(formData.id_sucursal) : null,
      id_distrito:      formData.id_distrito ? parseInt(formData.id_distrito) : null,
      id_rol:           3,
    });

    navigate("/login", { state: { registrado: true } });
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Error inesperado.");
  } finally {
    setLoading(false);
  }
};

  // Input className reutilizable
  const inputCls = `
    w-full bg-slate-700 rounded-lg px-4 py-2.5 text-white
    placeholder-slate-500 text-sm border border-slate-600/50
    focus:outline-none focus:ring-2 focus:ring-cyan-400/50
    focus:border-cyan-400/50 transition
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[700px] h-[500px] bg-cyan-500/6 rounded-full blur-[130px]" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="
              w-16 h-16 mx-auto mb-3 rounded-2xl
              bg-gradient-to-br from-cyan-400 to-cyan-600
              flex items-center justify-center
              text-black font-black text-2xl
              shadow-[0_0_30px_rgba(34,211,238,0.4)]
            ">
              G
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              <span className="text-cyan-400">GYM</span>LACOBRA
            </h1>
            <p className="text-slate-400 text-sm mt-1">Crear cuenta</p>
          </div>

          {loadingCat ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-cyan-400" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Nombre <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Juan"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Apellido <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    placeholder="Pérez"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Correo electrónico <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  placeholder="usuario@ejemplo.com"
                  className={inputCls}
                />
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Contraseña <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Confirmar <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmar"
                    value={formData.confirmar}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Teléfono y Fecha */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="8888-8888"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Sexo <span className="text-cyan-400">*</span>
                </label>
                <select
                  name="id_sexo"
                  value={formData.id_sexo}
                  onChange={handleChange}
                  required
                  className={inputCls}
                >
                  <option value="">Seleccioná un sexo</option>
                  {sexos.map((s) => (
                    <option key={s.id_sexo} value={s.id_sexo}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sucursal y Distrito */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Sucursal
                  </label>
                  <select
                    name="id_sucursal"
                    value={formData.id_sucursal}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="">Seleccioná una sucursal</option>
                    {sucursales.map((s) => (
                      <option key={s.id_sucursal} value={s.id_sucursal}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Distrito
                  </label>
                  <select
                    name="id_distrito"
                    value={formData.id_distrito}
                    onChange={handleChange}
                    disabled={!formData.id_sucursal || distritosFiltrados.length === 0}
                    className={inputCls}
                    >
                      <option value="">
                  {!formData.id_sucursal
                  ? "Primero elegí una sucursal"
                  : distritosFiltrados.length === 0
                   ? "Cargando distritos..."
                  : "Seleccioná un distrito"}
                </option>
              {distritosFiltrados.map((d) => (
             <option key={d.id_distrito} value={d.id_distrito}>
            {d.nombre}
          </option>
         ))}
      </select>
                </div>
              </div>

              {/* Nota de rol */}
              <p className="text-slate-500 text-xs bg-slate-700/40 border border-slate-700 rounded-lg px-4 py-2.5">
                ℹ️ Tu cuenta se creará como <span className="text-slate-300 font-semibold">Cliente</span>. Un administrador puede cambiar tu rol si es necesario.
              </p>

              {/* Submit */}
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
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>
          )}

          {/* Link a login */}
          <p className="text-center text-slate-500 text-sm mt-6">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
            >
              Iniciar sesión
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

export default RegistroPage;