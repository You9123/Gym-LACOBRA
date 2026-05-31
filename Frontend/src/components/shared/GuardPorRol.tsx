// src/components/shared/GuardPorRol.tsx
import { Navigate } from "react-router-dom";

interface GuardProps {
  children: React.ReactNode;
  rolPermitido: number; // 👈 Recibe el número de rol dinámicamente
}

export default function GuardPorRol({ children, rolPermitido }: GuardProps) {
  const token = localStorage.getItem("token");
  const idRol = Number(localStorage.getItem("id_rol"));

  if (!token) return <Navigate to="/login" replace />;
  
  // Bloquea el paso si el rol del usuario no coincide con el requerido por la ruta
  if (idRol !== rolPermitido) return <Navigate to="/" replace />;

  return <>{children}</>;
}
