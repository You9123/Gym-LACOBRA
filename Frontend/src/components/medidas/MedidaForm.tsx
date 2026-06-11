import { useState, useEffect } from 'react';
import { obtenerUsuarios } from '../../api/usuarios';

interface MedidaFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const MedidaForm = ({ initialData, onSubmit, onCancel }: MedidaFormProps) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    id_cliente: initialData?.id_cliente || '',
    peso_actual: initialData?.peso_actual || '',
    altura: initialData?.altura || '',
    porcentaje_grasa_actual: initialData?.porcentaje_grasa_actual || '',
    masa_muscular_actual: initialData?.masa_muscular_actual || '',
    cuello: initialData?.cuello || '',
    cintura: initialData?.cintura || '',
    cadera: initialData?.cadera || '',
    pecho: initialData?.pecho || '',
    brazo: initialData?.brazo || '',
    pierna: initialData?.pierna || '',
  });

  // Calcular IMC automáticamente
  const [imc, setImc] = useState<number | null>(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  // Calcular IMC cuando cambian peso o altura
  useEffect(() => {
    if (formData.peso_actual && formData.altura) {
      const peso = parseFloat(formData.peso_actual);
      const altura = parseFloat(formData.altura);
      if (peso > 0 && altura > 0) {
        const imcCalculado = peso / (altura * altura);
        setImc(imcCalculado);
      } else {
        setImc(null);
      }
    } else {
      setImc(null);
    }
  }, [formData.peso_actual, formData.altura]);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await obtenerUsuarios();
      console.log('Usuarios cargados:', data); // Para depuración
      
      // Filtrar solo usuarios con rol de cliente
      // Si no hay campo rol_nombre, mostrar todos los usuarios
      let clientes = data;
      if (data.length > 0 && data[0].rol_nombre) {
        clientes = data.filter((user: any) => user.rol_nombre === 'Cliente');
      }
      
      console.log('Clientes filtrados:', clientes); // Para depuración
      setUsuarios(clientes);
      
      if (clientes.length === 0) {
        setError('No hay clientes registrados. Primero crea un usuario con rol Cliente.');
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
      setError('Error al cargar la lista de clientes');
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
    if (!formData.id_cliente) {
      alert('Por favor selecciona un cliente');
      return;
    }
    if (!formData.peso_actual) {
      alert('Por favor ingresa el peso actual');
      return;
    }
    if (!formData.altura) {
      alert('Por favor ingresa la altura');
      return;
    }

    // Preparar datos para enviar
    const datosEnvio = {
      id_cliente: parseInt(formData.id_cliente),
      peso_actual: parseFloat(formData.peso_actual),
      altura: parseFloat(formData.altura),
      porcentaje_grasa_actual: formData.porcentaje_grasa_actual ? parseFloat(formData.porcentaje_grasa_actual) : null,
      masa_muscular_actual: formData.masa_muscular_actual ? parseFloat(formData.masa_muscular_actual) : null,
      cuello: formData.cuello ? parseFloat(formData.cuello) : null,
      cintura: formData.cintura ? parseFloat(formData.cintura) : null,
      cadera: formData.cadera ? parseFloat(formData.cadera) : null,
      pecho: formData.pecho ? parseFloat(formData.pecho) : null,
      brazo: formData.brazo ? parseFloat(formData.brazo) : null,
      pierna: formData.pierna ? parseFloat(formData.pierna) : null,
    };
    
    onSubmit(datosEnvio);
  };

  // Para edición: no mostrar selector de cliente, solo los datos editables
  if (initialData) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mostrar información del cliente pero no editable */}
        <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
          <p className="text-sm text-slate-400">Cliente ID: {initialData.id_cliente}</p>
          <p className="text-xs text-slate-500">Fecha de registro: {initialData.fecha_actualizacion}</p>
        </div>

        {/* Medidas Básicas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Peso Actual (kg) *</label>
            <input
              type="number"
              step="0.1"
              name="peso_actual"
              value={formData.peso_actual}
              onChange={handleChange}
              required
              className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Altura (m) *</label>
            <input
              type="number"
              step="0.01"
              name="altura"
              value={formData.altura}
              onChange={handleChange}
              required
              className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* IMC calculado */}
        {imc && (
          <div className="p-2 bg-slate-700/50 rounded-lg text-center text-sm">
            <span className="text-slate-400">IMC: </span>
            <span className="font-bold">{imc.toFixed(1)}</span>
          </div>
        )}

        {/* Medidas Avanzadas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              % Grasa Corporal
            </label>
            <input
              type="number"
              step="0.1"
              name="porcentaje_grasa_actual"
              value={formData.porcentaje_grasa_actual}
              onChange={handleChange}
              className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Masa Muscular (kg)
            </label>
            <input
              type="number"
              step="0.1"
              name="masa_muscular_actual"
              value={formData.masa_muscular_actual}
              onChange={handleChange}
              className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg">
            Actualizar
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg">
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  // Para creación: mostrar selector de cliente
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selección de Cliente */}
      <div>
        <label className="block text-sm font-medium mb-2">Cliente *</label>
        {loading ? (
          <div className="text-center py-2 text-slate-400">Cargando clientes...</div>
        ) : error ? (
          <div className="text-center py-2 text-red-400 text-sm">{error}</div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-2 text-yellow-400 text-sm">
            No hay clientes disponibles. 
            <a href="/usuarios" className="text-cyan-400 ml-1">Crear cliente</a>
          </div>
        ) : (
          <select
            name="id_cliente"
            value={formData.id_cliente}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">Seleccione un cliente</option>
            {usuarios.map((usuario: any) => (
              <option key={usuario.id_usuario} value={usuario.id_usuario}>
                #{usuario.id_usuario} - {usuario.nombre} {usuario.apellido}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Medidas Básicas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Peso Actual (kg) *</label>
          <input
            type="number"
            step="0.1"
            name="peso_actual"
            value={formData.peso_actual}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Altura (m) *</label>
          <input
            type="number"
            step="0.01"
            name="altura"
            value={formData.altura}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
      </div>

      {/* IMC calculado */}
      {imc && (
        <div className="p-2 bg-slate-700/50 rounded-lg text-center text-sm">
          <span className="text-slate-400">IMC: </span>
          <span className="font-bold">{imc.toFixed(1)}</span>
        </div>
      )}

      {/* Medidas Avanzadas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            % Grasa Corporal
          </label>
          <input
            type="number"
            step="0.1"
            name="porcentaje_grasa_actual"
            value={formData.porcentaje_grasa_actual}
            onChange={handleChange}
            placeholder="Ej: 18.5"
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Masa Muscular (kg)
          </label>
          <input
            type="number"
            step="0.1"
            name="masa_muscular_actual"
            value={formData.masa_muscular_actual}
            onChange={handleChange}
            placeholder="Ej: 35.2"
            className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
      </div>

      {/* Medidas Corporales */}
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium mb-2">
      Cuello (cm)
    </label>
    <input
      type="number"
      step="0.1"
      name="cuello"
      value={formData.cuello}
      onChange={handleChange}
      placeholder="Ej: 38"
      className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Cintura (cm)
    </label>
    <input
      type="number"
      step="0.1"
      name="cintura"
      value={formData.cintura}
      onChange={handleChange}
      placeholder="Ej: 82"
      className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Cadera (cm)
    </label>
    <input
      type="number"
      step="0.1"
      name="cadera"
      value={formData.cadera}
      onChange={handleChange}
      placeholder="Ej: 95"
      className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Pecho (cm)
    </label>
    <input
      type="number"
      step="0.1"
      name="pecho"
      value={formData.pecho}
      onChange={handleChange}
      placeholder="Ej: 102"
      className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Brazo (cm)
    </label>
    <input
      type="number"
      step="0.1"
      name="brazo"
      value={formData.brazo}
      onChange={handleChange}
      placeholder="Ej: 36"
      className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Pierna (cm)
    </label>
    <input
      type="number"
      step="0.1"
      name="pierna"
      value={formData.pierna}
      onChange={handleChange}
      placeholder="Ej: 58"
      className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
    />
  </div>
</div>

      <div className="flex gap-3 pt-4">
        <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg">
          Guardar Medición
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default MedidaForm;