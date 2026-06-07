import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerDashboardCliente,
  type DashboardCliente,
  type DatosCliente,
  type CoachCliente,
  type RutinaCliente,
  type MedidaCliente,
} from "../api/usuarios";

function calcularEdad(fechaNac: string | null | undefined): number | null {
  if (!fechaNac) return null;
  const hoy = new Date();
  const nac = new Date(fechaNac);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

function formatFecha(str: string | null | undefined): string {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("es-CR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function Avatar({ nombre, apellido, size = 48 }: { nombre: string; apellido: string; size?: number }) {
  const iniciales = `${nombre?.[0] ?? ""}${apellido?.[0] ?? ""}`.toUpperCase();
  return (
    <div 
      className="rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {iniciales}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 flex flex-col gap-1">
      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-xl font-semibold text-white">{value ?? "—"}</span>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <i className={`ti ${icon} text-slate-400 text-lg`} aria-hidden="true" />
        <h3 className="text-sm font-medium text-slate-400 m-0">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ mensaje }: { mensaje: string }) {
  return <p className="text-sm text-slate-500 italic m-0">{mensaje}</p>;
}

function FieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider m-0">{label}</p>
      <p className="text-sm text-slate-200 mt-1 m-0">{value || "—"}</p>
    </div>
  );
}

function DatosPersonalesCard({ datos }: { datos: DatosCliente }) {
  const edad = calcularEdad(datos.fecha_nacimiento);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <Avatar nombre={datos.nombre} apellido={datos.apellido} size={52} />
        <div>
          <p className="text-lg font-semibold text-white m-0">
            {datos.nombre} {datos.apellido}
          </p>
          <p className="text-sm text-slate-400 m-0">{datos.correo}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Teléfono" value={datos.telefono} />
        <FieldRow label="Fecha de nacimiento" value={formatFecha(datos.fecha_nacimiento)} />
        {edad !== null && <FieldRow label="Edad" value={`${edad} años`} />}
        <FieldRow label="Sucursal" value={datos.nombre_sucursal} />
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: CoachCliente | null }) {
  if (!coach) return <EmptyState mensaje="No tienes un coach asignado aún." />;
  return (
    <div className="flex items-center gap-3">
      <Avatar nombre={coach.nombre} apellido={coach.apellido} size={44} />
      <div className="flex-1">
        <p className="font-medium text-white m-0">{coach.nombre} {coach.apellido}</p>
        <p className="text-xs text-slate-400 m-0">{coach.correo}</p>
        {coach.telefono && <p className="text-xs text-slate-400 m-0">{coach.telefono}</p>}
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-500 m-0">Asignado</p>
        <p className="text-xs text-slate-300 m-0">{formatFecha(coach.fecha_asignacion)}</p>
      </div>
    </div>
  );
}


function RutinaCard({ rutina }: { rutina: RutinaCliente | null }) {
  if (!rutina) return <EmptyState mensaje="No tienes una rutina activa asignada." />;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <p className="font-medium text-white m-0">{rutina.nombre_rutina}</p>
        <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full px-2 py-0.5">
          Activa
        </span>
      </div>
      {rutina.objetivo && (
        <p className="text-sm text-slate-300 m-0">
          <strong>Objetivo:</strong> {rutina.objetivo}
        </p>
      )}
      {rutina.descripcion && (
        <p className="text-sm text-slate-400 m-0">{rutina.descripcion}</p>
      )}
      <p className="text-xs text-slate-500 m-0">
        Asignada: {formatFecha(rutina.fecha_asignacion)} · Creada: {formatFecha(rutina.fecha_creacion)}
      </p>
    </div>
  );
}

function MedidasCard({ medidas }: { medidas: MedidaCliente[] }) {
  if (medidas.length === 0) return <EmptyState mensaje="Sin registro de medidas aún." />;
  const ultima = medidas[0];
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-500 m-0">
        Última medición: {formatFecha(ultima.fecha_medicion)}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Peso" value={ultima.peso ? `${ultima.peso} kg` : null} />
        <MetricCard label="Altura" value={ultima.altura ? `${ultima.altura} m` : null} />
        <MetricCard label="% Grasa" value={ultima.porcentaje_grasa ? `${ultima.porcentaje_grasa}%` : null} />
        <MetricCard label="Masa muscular" value={ultima.masa_muscular ? `${ultima.masa_muscular} kg` : null} />
      </div>
    </div>
  );
}

export default function ClienteDashboard() {
  const { correo: correoParam } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardCliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const correo = correoParam ?? (() => {
    const sesion = localStorage.getItem("sesion");
    if (sesion) {
      try {
        const parsed = JSON.parse(sesion);
        return parsed.correo;
      } catch {
        return null;
      }
    }
    return null;
  })();

  useEffect(() => {
    if (!correo) {
      setError("No se encontró el correo del cliente.");
      setLoading(false);
      return;
    }

    obtenerDashboardCliente(correo)
      .then((json) => {
        if (json.medidas) {
          json.medidas.sort((a, b) => 
            new Date(b.fecha_medicion || 0).getTime() - new Date(a.fecha_medicion || 0).getTime()
          );
        }
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [correo]);

  if (loading) return (
    <div className="py-8 text-center text-slate-400">
      Cargando dashboard...
    </div>
  );

  if (error || !data) return (
    <div className="bg-red-950 border border-red-800 text-red-300 rounded-lg p-4 text-sm">
      {error ?? "Error al cargar los datos."}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-medium text-white m-0">Mi perfil</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Datos personales" icon="ti-user">
          <DatosPersonalesCard datos={data.datos} />
        </SectionCard>

        <SectionCard title="Mi coach" icon="ti-users">
          <CoachCard coach={data.coach} />
        </SectionCard>
      </div>

      {/* Si NO tiene coach, mostrar botón para solicitar */}
      {!data.coach && (
        <div className="bg-yellow-950/50 border border-yellow-800 rounded-xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center">
                <i className="ti ti-alert-circle text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-300">
                  No tienes un coach asignado
                </p>
                <p className="text-xs text-yellow-400/70">
                  Solicita un coach para recibir asesoramiento personalizado
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/cliente/solicitar-coach")}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Solicitar Coach
            </button>
          </div>
        </div>
      )}

      <SectionCard title="Rutina activa" icon="ti-list-check">
        <RutinaCard rutina={data.rutina} />
      </SectionCard>



      <SectionCard title="Medidas corporales" icon="ti-chart-line">
        <MedidasCard medidas={data.medidas} />

        {/* Botón para ver historial completo y gráfico */}
        <button
          onClick={() => navigate("/cliente/medidas")}
          className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <i className="ti ti-chart-line text-base" />
          Ver historial completo y gráfico
        </button>
    </SectionCard>

    
    </div>
  );
}