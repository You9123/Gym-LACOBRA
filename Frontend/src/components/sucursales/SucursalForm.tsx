import { useState, useEffect } from "react";
import { obtenerDistritos } from "../../api/ubicaciones";

interface SucursalFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SucursalForm = ({ initialData, onSubmit, onCancel }: SucursalFormProps) => {
  const [distritos, setDistritos] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    direccion_exacta: initialData?.direccion_exacta || '',
    telefono: initialData?.telefono || '',
    horario: initialData?.horario || '',
    id_distrito: initialData?.id_distrito || ''
  });

    const cargarDistritos = async () => {
    try {
      const data = await obtenerDistritos();
      setDistritos(data);
    } catch (error) {
      console.error('Error cargando distritos:', error);
    }
  };

  useEffect(() => {
    cargarDistritos();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const datosEnvio = {
      nombre: formData.nombre,
      direccion_exacta: formData.direccion_exacta || null,
      telefono: formData.telefono || null,
      horario: formData.horario || null,
      id_distrito: formData.id_distrito ? parseInt(formData.id_distrito) : null
    };
    
    onSubmit(datosEnvio);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nombre *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          placeholder="Ej: Sucursal Central"
          className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Dirección</label>
        <input
          type="text"
          name="direccion_exacta"
          value={formData.direccion_exacta}
          onChange={handleChange}
          placeholder="Ej: Av. Principal #123"
          className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Ej: 2222-3333"
          className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Horario</label>
        <input
          type="text"
          name="horario"
          value={formData.horario}
          onChange={handleChange}
          placeholder="Ej: Lun-Vie 6am-10pm, Sáb 8am-8pm"
          className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white"
        />
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

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg transition-colors"
        >
          {initialData ? 'Actualizar' : 'Guardar'}
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

export default SucursalForm;