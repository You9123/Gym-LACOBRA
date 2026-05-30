// src/components/shared/GuardCoach.tsx
import { Navigate } from "react-router-dom";

interface GuardCoachProps {
  children: React.ReactNode;
}

export default function GuardCoach({ children }: GuardCoachProps) {
  const token = localStorage.getItem("token");
  const idRol = Number(localStorage.getItem("id_rol"));

  // Si no está logueado, al Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si no es Coach (id_rol !== 2), lo mandamos a la raíz (o un panel no autorizado)
  if (idRol !== 2) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
