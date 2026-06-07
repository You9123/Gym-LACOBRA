import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../api/usuarios';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await iniciarSesion(formData);
      
      if (response.token) {
        // 1. Guardar el token de sesión
        localStorage.setItem('token', response.token);
        
        // 2. Extraer y guardar los datos del perfil y roles obligatorios para los guards
        if (response.usuario) {
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          localStorage.setItem('id_rol', String(response.usuario.id_rol));
          localStorage.setItem('id_usuario', String(response.usuario.id_usuario));
          
          // 3. Redirección basada en el rol del usuario (Coach = 2)
          if (response.usuario.id_rol === 2 || response.usuario.rol_nombre?.toLowerCase() === 'coach') {
            navigate('/coach/dashboard');
          } else {
            navigate('/');
          }
        } else {
          // Si el token llegó pero el objeto usuario no, redirige por defecto a la raíz
          navigate('/');
        }
      } else {
        setError(response.mensaje || 'Credenciales incorrectas');
      }
    } catch (err: any) {
      console.error('Error detallado de la API de login:', err);
      
      // Captura y muestra la respuesta exacta de Django Rest Framework si está disponible
      if (err.response?.data) {
        const dataBackend = err.response.data;
        const mensajeError = dataBackend.error || dataBackend.mensaje || dataBackend.detail;
        
        if (mensajeError) {
          setError(mensajeError);
        } else {
          // Si Django mandó un diccionario de errores de validación de campos (ej: { contrasena: ["..."] })
          const primerError = Object.values(dataBackend)[0];
          setError(Array.isArray(primerError) ? primerError[0] : 'Datos inválidos en el formulario.');
        }
      } else {
        setError('No se pudo establecer conexión con el servidor. Revisa tu red.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-800/50 border border-slate-800 rounded-lg p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
            <span className="text-black font-black text-3xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">GYM LACOBRA</h1>
          <p className="text-slate-400 mt-2 text-sm">Sistema de Gestión Integrada</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all placeholder:text-slate-500"
              placeholder="usuario@ejemplo.com"
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
              className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs font-medium tracking-wide">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/10"
          >
            {loading ? 'Validando accesos...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
