import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrarMedida } from '../api/medidas';
import { obtenerUsuarioPorId, type Usuario } from '../api/usuarios';

export default function MedidaCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idCliente = Number(id);

  const [alumno, setAlumno] = useState<Usuario | null>(null);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [grasa, setGrasa] = useState('');
  const [musculo, setMusculo] = useState('');

  useEffect(() => {
    async function cargarAlumno() {
      try {
        const data = await obtenerUsuarioPorId(idCliente);
        setAlumno(data);
      } catch (err) { console.error(err); }
    }
    cargarAlumno();
  }, [idCliente]);

  const guardarMedidas = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registrarMedida({
        id_cliente: idCliente,
        peso_actual: peso,
        altura: altura,
        porcentaje_grasa_actual: grasa || null,
        masa_muscular_actual: musculo || null
      });
      alert('Medidas corporales guardadas con éxito.');
      navigate('/coach/dashboard');
    } catch (err) {
      alert('Error guardando mediciones.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-purple-400">Antropometría para {alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Cargando...'}</h2>
      <form onSubmit={guardarMedidas} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-300">Peso Actual (kg)</label>
          <input type="number" step="0.01" required value={peso} onChange={e => setPeso(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 mt-1 text-white focus:border-purple-500 outline-none" placeholder="Ej: 75.40" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Altura (m)</label>
          <input type="number" step="0.01" required value={altura} onChange={e => setAltura(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 mt-1 text-white focus:border-purple-500 outline-none" placeholder="Ej: 1.78" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Porcentaje de Grasa (%)</label>
          <input type="number" step="0.1" value={grasa} onChange={e => setGrasa(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 mt-1 text-white focus:border-purple-500 outline-none" placeholder="Ej: 14.5" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Masa Muscular (kg)</label>
          <input type="number" step="0.1" value={musculo} onChange={e => setMusculo(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 mt-1 text-white focus:border-purple-500 outline-none" placeholder="Ej: 34.2" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition">Registrar Entrada</button>
          <button type="button" onClick={() => navigate('/coach/dashboard')} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg">Atrás</button>
        </div>
      </form>
    </div>
  );
}
