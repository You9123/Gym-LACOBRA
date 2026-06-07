import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDashboardCliente, type DatosCliente } from "../api/usuarios";

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
    day: "2-digit", month: "long", year: "numeric",
  });
}

function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  const iniciales = `${nombre?.[0] ?? ""}${apellido?.[0] ?? ""}`.toUpperCase();
  return (
    <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-semibold shrink-0">
      {iniciales}
    </div>
  );
}

function Campo({ label, valor }: { label: string; valor: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-sm text-slate-200">{valor || "—"}</span>
    </div>
  );
}

export default function DatosPersonales() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState<DatosCliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [correo, setCorreo] = useState<string | null>(null);

  useEffect(() => {
    const sesion = localStorage.getItem("sesion");
    if (sesion) {
      try {
        const parsed = JSON.parse(sesion);
        setCorreo(parsed.correo);
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!correo) return;

    obtenerDashboardCliente(correo)
      .then((res) => { 
        setDatos(res.datos); 
        setLoading(false); 
      })
      .catch((err: Error) => { 
        setError(err.message); 
        setLoading(false); 
      });
  }, [correo]);

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
      Cargando datos…
    </div>
  );

  if (error || !datos) return (
    <div className="rounded-xl bg-red-950 border border-red-800 text-red-300 text-sm p-4">
      {error ?? "No se pudieron cargar los datos."}
    </div>
  );

  const edad = calcularEdad(datos.fecha_nacimiento);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Datos personales</h2>

      <div className="flex items-center gap-5 bg-slate-900 rounded-xl p-5 border border-slate-800">
        <Avatar nombre={datos.nombre} apellido={datos.apellido} />
        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold text-white">
            {datos.nombre} {datos.apellido}
          </p>
          <p className="text-sm text-slate-400">{datos.correo}</p>
          {datos.nombre_sucursal && (
            <span className="mt-1 inline-flex w-fit text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full px-3 py-0.5">
              {datos.nombre_sucursal}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-900 rounded-xl p-5 border border-slate-800">
        <Campo label="Teléfono" valor={datos.telefono} />
        <Campo label="Fecha de nacimiento" valor={formatFecha(datos.fecha_nacimiento)} />
        {edad !== null && <Campo label="Edad" valor={`${edad} años`} />}
        <Campo label="Sucursal" valor={datos.nombre_sucursal} />
      </div>
    </div>
  );
}