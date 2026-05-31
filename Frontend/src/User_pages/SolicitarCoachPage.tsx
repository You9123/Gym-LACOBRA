import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SolicitarCoach from "./SolicitarCoach";

export default function SolicitarCoachPage() {
  const navigate = useNavigate();
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

  if (!correo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-400">Verificando sesión...</div>
      </div>
    );
  }

  const handleAsignacionExitosa = () => {
    // Redirigir al dashboard después de 2 segundos
    setTimeout(() => {
      navigate("/cliente/dashboard");
    }, 2000);
  };

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
      
      <SolicitarCoach 
        correo={correo} 
        onAsignacionExitosa={handleAsignacionExitosa}
      />
    </div>
  );
}