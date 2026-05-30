import { useState, useEffect } from "react";
import {
  obtenerDashboardCliente,
  type DashboardCliente,
  type DatosCliente,
  type CoachCliente,
  type RutinaCliente,
  type MedidaCliente,
} from "../api/usuarios";

// ─── UTILS ──────────────────────────────────────────────────────────────────

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

// ─── SUB-COMPONENTES ─────────────────────────────────────────────────────────

function Avatar({ nombre, apellido, size = 48 }: { nombre: string; apellido: string; size?: number }) {
  const iniciales = `${nombre?.[0] ?? ""}${apellido?.[0] ?? ""}`.toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "var(--color-background-info)",
      color: "var(--color-text-info)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 500, fontSize: size * 0.35, flexShrink: 0,
    }}>
      {iniciales}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={{
      background: "var(--color-background-secondary)",
      borderRadius: "var(--border-radius-md)",
      padding: "1rem", display: "flex", flexDirection: "column", gap: 4,
    }}>
      <span style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </span>
      <span style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      padding: "1.25rem",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <i className={`ti ${icon}`} style={{ fontSize: 18, color: "var(--color-text-secondary)" }} aria-hidden="true" />
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-secondary)" }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ mensaje }: { mensaje: string }) {
  return (
    <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-tertiary)", fontStyle: "italic" }}>
      {mensaje}
    </p>
  );
}

function FieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </p>
      <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-primary)" }}>
        {value || "—"}
      </p>
    </div>
  );
}

// ─── TARJETA: DATOS PERSONALES ───────────────────────────────────────────────

function DatosPersonales({ datos }: { datos: DatosCliente }) {
  const edad = calcularEdad(datos.fecha_nacimiento);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Avatar nombre={datos.nombre} apellido={datos.apellido} size={52} />
        <div>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>
            {datos.nombre} {datos.apellido}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
            {datos.correo}
          </p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <FieldRow label="Teléfono" value={datos.telefono} />
        <FieldRow label="Fecha de nacimiento" value={formatFecha(datos.fecha_nacimiento)} />
        {edad !== null && <FieldRow label="Edad" value={`${edad} años`} />}
        <FieldRow label="Sucursal" value={datos.nombre_sucursal} />
      </div>
    </div>
  );
}

// ─── TARJETA: COACH ──────────────────────────────────────────────────────────

function CoachCard({ coach }: { coach: CoachCliente | null }) {
  if (!coach) return <EmptyState mensaje="No tienes un coach asignado aún." />;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar nombre={coach.nombre} apellido={coach.apellido} size={44} />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>
          {coach.nombre} {coach.apellido}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>
          {coach.correo}
        </p>
        {coach.telefono && (
          <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>
            {coach.telefono}
          </p>
        )}
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-tertiary)" }}>Asignado</p>
        <p style={{ margin: 0, fontSize: 12 }}>{formatFecha(coach.fecha_asignacion)}</p>
      </div>
    </div>
  );
}

// ─── TARJETA: RUTINA ─────────────────────────────────────────────────────────

function RutinaCard({ rutina }: { rutina: RutinaCliente | null }) {
  if (!rutina) return <EmptyState mensaje="No tienes una rutina activa asignada." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>{rutina.nombre_rutina}</p>
        <span style={{
          fontSize: 11, padding: "2px 8px",
          background: "var(--color-background-success)",
          color: "var(--color-text-success)",
          borderRadius: "var(--border-radius-md)",
        }}>
          Activa
        </span>
      </div>
      {rutina.objetivo && (
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
          <strong>Objetivo:</strong> {rutina.objetivo}
        </p>
      )}
      {rutina.descripcion && (
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
          {rutina.descripcion}
        </p>
      )}
      <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-tertiary)" }}>
        Asignada: {formatFecha(rutina.fecha_asignacion)} · Creada: {formatFecha(rutina.fecha_creacion)}
      </p>
    </div>
  );
}

// ─── TARJETA: HISTORIAL DE MEDIDAS ───────────────────────────────────────────

function MedidasCard({ medidas }: { medidas: MedidaCliente[] }) {
  if (medidas.length === 0)
    return <EmptyState mensaje="Sin registro de medidas aún." />;

  const ultima = medidas[0];
  const medidasCorporales: [string, number | null | undefined][] = [
    ["Cuello",  ultima.cuello],
    ["Cintura", ultima.cintura],
    ["Cadera",  ultima.cadera],
    ["Pecho",   ultima.pecho],
    ["Brazo",   ultima.brazo],
    ["Pierna",  ultima.pierna],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-tertiary)" }}>
        Última medición: {formatFecha(ultima.fecha_medicion)}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8 }}>
        <MetricCard label="Peso"         value={ultima.peso            ? `${ultima.peso} kg`            : null} />
        <MetricCard label="Altura"        value={ultima.altura          ? `${ultima.altura} m`           : null} />
        <MetricCard label="% Grasa"       value={ultima.porcentaje_grasa ? `${ultima.porcentaje_grasa}%` : null} />
        <MetricCard label="Masa muscular" value={ultima.masa_muscular   ? `${ultima.masa_muscular} kg`   : null} />
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
        gap: 8, borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 12,
      }}>
        {medidasCorporales.map(([label, val]) => (
          <div key={label}>
            <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-tertiary)" }}>{label}</p>
            <p style={{ margin: 0, fontSize: 13 }}>{val ? `${val} cm` : "—"}</p>
          </div>
        ))}
      </div>

      {medidas.length > 1 && (
        <details style={{ marginTop: 4 }}>
          <summary style={{ fontSize: 12, color: "var(--color-text-secondary)", cursor: "pointer" }}>
            Ver historial ({medidas.length} registros)
          </summary>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {medidas.slice(1).map((m) => (
              <div key={m.id_historial} style={{
                display: "flex", gap: 12, fontSize: 12,
                padding: "6px 0", borderBottom: "0.5px solid var(--color-border-tertiary)",
                color: "var(--color-text-secondary)",
              }}>
                <span style={{ minWidth: 90 }}>{formatFecha(m.fecha_medicion)}</span>
                <span>Peso: {m.peso ?? "—"} kg</span>
                <span>Grasa: {m.porcentaje_grasa ?? "—"}%</span>
                <span>Muscular: {m.masa_muscular ?? "—"} kg</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

// ─── DASHBOARD PRINCIPAL ─────────────────────────────────────────────────────

interface Props {
  correo?: string;
}

export default function ClienteDashboard({ correo: correoProp }: Props) {
  const [data, setData]       = useState<DashboardCliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // Obtener correo del localStorage si no se pasó como prop
  const correo = correoProp ?? (() => {
    const sesion = localStorage.getItem("sesion");
    if (sesion) {
      try {
        const parsed = JSON.parse(sesion);
        return parsed.correo; // Asumiendo que guardas el correo en la sesión
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
        // Asegurar que las medidas vengan ordenadas
        if (json.medidas) {
          json.medidas.sort((a, b) => 
            new Date(b.fecha_medicion || 0).getTime() - new Date(a.fecha_medicion || 0).getTime()
          );
        }
        setData(json); 
        setLoading(false); 
      })
      .catch((err: Error) => { setError(err.message); setLoading(false); });
  }, [correo]);

  if (loading) return (
    <div style={{ padding: "2rem", color: "var(--color-text-secondary)", fontSize: 14 }}>
      Cargando dashboard…
    </div>
  );

  if (error || !data) return (
    <div style={{
      padding: "1rem", borderRadius: "var(--border-radius-md)",
      background: "var(--color-background-danger)", color: "var(--color-text-danger)", fontSize: 13,
    }}>
      {error ?? "Error al cargar los datos."}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "1.5rem" }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>Mi perfil</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <SectionCard title="Datos personales" icon="ti-user">
          <DatosPersonales datos={data.datos} />
        </SectionCard>

        <SectionCard title="Mi coach" icon="ti-users">
          <CoachCard coach={data.coach} />
        </SectionCard>
      </div>

      <SectionCard title="Rutina activa" icon="ti-list-check">
        <RutinaCard rutina={data.rutina} />
      </SectionCard>

      <SectionCard title="Medidas corporales" icon="ti-chart-line">
        <MedidasCard medidas={data.medidas} />
      </SectionCard>
    </div>
  );
}