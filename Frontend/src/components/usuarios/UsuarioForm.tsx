import { useState, useEffect } from 'react';
import { obtenerRoles, obtenerSexos } from '../../api/usuarios';
import { obtenerSucursales } from '../../api/sucursales';
import { obtenerDistritos } from '../../api/ubicaciones';

interface UsuarioFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const UsuarioForm = ({ initialData, onSubmit, onCancel }: UsuarioFormProps) => {
  const [roles, setRoles] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    apellido: initialData?.apellido || '',
    correo: initialData?.correo || '',
    contrasena: '',
    telefono: initialData?.telefono || '',
    fecha_nacimiento: initialData?.fecha_nacimiento || '',
    id_rol: initialData?.id_rol || '',
    id_sexo: initialData?.id_sexo || '',
    id_sucursal: initialData?.id_sucursal || '',
    id_distrito: initialData?.id_distrito || ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      setLoading(true);
      const [rolesData, sexosData, sucursalesData, distritosData] = await Promise.all([
        obtenerRoles(),
        obtenerSexos(),
        obtenerSucursales(),
        obtenerDistritos()
      ]);
      setRoles(rolesData);
      setSexos(sexosData);
      setSucursales(sucursalesData);
      setDistritos(distritosData);
    } catch (error) {
      console.error('Error cargando catálogos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.id_rol || !formData.id_sexo) {
      alert('Por favor selecciona Rol y Sexo');
      return;
    }

    // Preparar datos para enviar
    const datosEnvio = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      contrasena: formData.contrasena || '123456', // Contraseña por defecto
      telefono: formData.telefono || null,
      fecha_nacimiento: formData.fecha_nacimiento || null,
      id_rol: parseInt(formData.id_rol),
      id_sexo: parseInt(formData.id_sexo),
      id_sucursal: formData.id_sucursal ? parseInt(formData.id_sucursal) : null,
      id_distrito: formData.id_distrito ? parseInt(formData.id_distrito) : null
    };
    
    onSubmit(datosEnvio);
  };

  const fechaMaxima = new Date();
  fechaMaxima.setFullYear(fechaMaxima.getFullYear() - 14);

  const maxDate = fechaMaxima.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Datos personales */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Apellido *</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Correo *</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
          className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fecha Nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            max={maxDate}
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
      </div>

      {/* Selectores de catálogo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Rol *</label>
          <select
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">Seleccione un rol</option>
            {roles.map((rol) => (
              <option key={rol.id_rol} value={rol.id_rol}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sexo *</label>
          <select
            name="id_sexo"
            value={formData.id_sexo}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">Seleccione un sexo</option>
            {sexos.map((sexo) => (
              <option key={sexo.id_sexo} value={sexo.id_sexo}>
                {sexo.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ubicación y Sucursal */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Sucursal</label>
          <select
            name="id_sucursal"
            value={formData.id_sucursal}
            onChange={handleChange}
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">Seleccione una sucursal</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                {sucursal.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Distrito</label>
          <select
            name="id_distrito"
            value={formData.id_distrito}
            onChange={handleChange}
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">Seleccione un distrito</option>
            {distritos.map((distrito) => (
              <option key={distrito.id_distrito} value={distrito.id_distrito}>
                {distrito.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contraseña (solo para nuevos usuarios) */}
      {!initialData && (
        <div>
          <label className="block text-sm font-medium mb-2">Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            placeholder="Dejar en blanco para usar '123456'"
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          />
          <p className="text-xs text-slate-400 mt-1">
            Si no especificas una contraseña, se usará "123456"
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Cargando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default UsuarioForm;