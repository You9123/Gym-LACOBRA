import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerCoachesPorSucursal,
  solicitarAsignacionCoach,
  obtenerEstadoAsignacion,
  type CoachSucursal,
  type EstadoAsignacion,
} from "../api/usuarios";

export default function SolicitarCoachPage() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<CoachSucursal[]>([]);
  const [estadoAsignacion, setEstadoAsignacion] = useState<EstadoAsignacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [solicitando, setSolicitando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sinConexion, setSinConexion] = useState(false);

  // 1. Obtener correo del localStorage
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

  // 2. Cargar coaches y estado de asignación cuando tengamos el correo
  useEffect(() => {
    if (!correo) return;

    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      setSinConexion(false);
      try {
        const estado = await obtenerEstadoAsignacion(correo);
        console.log("Estado asignación:", estado);
        setEstadoAsignacion(estado);

        if (!estado) {
          const coachesDisponibles = await obtenerCoachesPorSucursal(correo);
          console.log("Coaches disponibles:", coachesDisponibles);
          setCoaches(coachesDisponibles);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        // Si falla la conexión, mostrar error de red, no "no hay coaches"
        setSinConexion(true);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [correo]);

  const handleSolicitarCoach = async (idCoach: number, nombreCoach: string) => {
    if (!window.confirm(`¿Deseas solicitar a ${nombreCoach} como tu coach?`)) {
      return;
    }

    setSolicitando(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await solicitarAsignacionCoach(correo!, idCoach);

      if (response.resultado === 1) {
        setSuccess(response.mensaje);
        const nuevoEstado = await obtenerEstadoAsignacion(correo!);
        setEstadoAsignacion(nuevoEstado);
        if (!nuevoEstado) {
          const coachesDisponibles = await obtenerCoachesPorSucursal(correo!);
          setCoaches(coachesDisponibles);
        }
        setTimeout(() => {
          navigate("/cliente/dashboard");
        }, 2000);
      } else {
        setError(response.mensaje);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al solicitar coach");
    } finally {
      setSolicitando(false);
    }
  };

  if (!correo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-400">Verificando sesión...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-400">Cargando información...</div>
      </div>
    );
  }

  // ✅ Error de conexión real — backend apagado o caído
  if (sinConexion) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("/cliente/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <i className="ti ti-arrow-left" />
            <span>Volver al Dashboard</span>
          </button>
        </div>
        <div className="bg-slate-900 rounded-xl border border-red-800 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-950 flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-wifi-off text-2xl text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Error de conexión</h3>
          <p className="text-sm text-slate-400 mb-4">
            No se pudo conectar al servidor. Verifica que el backend esté activo.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Ya tiene coach asignado
  if (estadoAsignacion) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("/cliente/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <i className="ti ti-arrow-left" />
            <span>Volver al Dashboard</span>
          </button>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
              <i className="ti ti-user-check text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Coach Asignado</h3>
              <p className="text-sm text-slate-400">Ya tienes un coach asignado</p>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {estadoAsignacion.coach_nombre?.[0]}
                  {estadoAsignacion.coach_apellido?.[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">
                  {estadoAsignacion.coach_nombre} {estadoAsignacion.coach_apellido}
                </p>
                <p className="text-sm text-slate-400">{estadoAsignacion.coach_correo}</p>
                {estadoAsignacion.coach_telefono && (
                  <p className="text-sm text-slate-400">Tel: {estadoAsignacion.coach_telefono}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Asignado el:{" "}
              {new Date(estadoAsignacion.fecha_asignacion).toLocaleDateString("es-CR")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No hay coaches disponibles
  if (coaches.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("/cliente/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <i className="ti ti-arrow-left" />
            <span>Volver al Dashboard</span>
          </button>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-users-off text-2xl text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No hay coaches disponibles</h3>
          <p className="text-sm text-slate-400">
            Actualmente no hay coaches disponibles en tu sucursal. Por favor, contacta al administrador.
          </p>
        </div>
      </div>
    );
  }

  // Mostrar lista de coaches disponibles
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/cliente/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <i className="ti ti-arrow-left" />
          <span>Volver al Dashboard</span>
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
            <i className="ti ti-users text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Selecciona tu Coach</h3>
            <p className="text-sm text-slate-400">Elige uno de los coaches disponibles en tu sucursal</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950 border border-red-800 text-red-300 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coaches.map((coach) => (
            <div
              key={coach.id_usuario}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {coach.nombre?.[0]}
                      {coach.apellido?.[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      {coach.nombre} {coach.apellido}
                    </h4>
                    <p className="text-xs text-slate-400">{coach.correo}</p>
                    {coach.telefono && (
                      <p className="text-xs text-slate-400">Tel: {coach.telefono}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Clientes actuales: {coach.clientes_actuales}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSolicitarCoach(coach.id_usuario, `${coach.nombre} ${coach.apellido}`)}
                  disabled={solicitando}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {solicitando ? "Solicitando..." : "Solicitar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}