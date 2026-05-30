import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";

import Dashboard from "./admin_pages/Dashboard";
import Login from "./admin_pages/Login";

import Usuarios from "./admin_pages/Usuarios";
import Ejercicios from "./admin_pages/Ejercicios";
import Medidas from "./admin_pages/Medidas";
import Rutinas from "./admin_pages/Rutinas";
import Reportes from "./admin_pages/Reportes";
import Sucursales from "./admin_pages/Sucursales";
import Ubicaciones from "./admin_pages/Ubicaciones";
import NotFound from "./admin_pages/NotFound";

// SEGURIDAD Y VISTAS DEL COACH (Nuevas Importaciones)
import GuardCoach from "./components/shared/GuardCoach";
import DashboardCoach from "./coach_pages/DashboardCoach";
import MedidaCliente from "./coach_pages/MedidaCliente";
import AsignarRutina from "./coach_pages/AsignarRutina";
import CrearRutina from "./coach_pages/CrearRutina";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto p-8">
          <Routes>
            {/* Rutas Administrativas / Generales */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/ejercicios" element={<Ejercicios />} />
            <Route path="/medidas" element={<Medidas />} />
            <Route path="/rutinas" element={<Rutinas />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/sucursales" element={<Sucursales />} />
            <Route path="/ubicaciones" element={<Ubicaciones />} />

            {/* Rutas del Coach Protegidas (id_rol === 2) */}
            <Route 
              path="/coach/dashboard" 
              element={
                <GuardCoach>
                  <DashboardCoach />
                </GuardCoach>
              } 
            />
            <Route 
              path="/coach/cliente/:id/medidas" 
              element={
                <GuardCoach>
                  <MedidaCliente />
                </GuardCoach>
              } 
            />
            <Route 
              path="/coach/cliente/:id/asignar" 
              element={
                <GuardCoach>
                  <AsignarRutina />
                </GuardCoach>
              } 
            />
            <Route 
              path="/coach/rutinas/crear" 
              element={
                <GuardCoach>
                  <CrearRutina />
                </GuardCoach>
              } 
            />

            {/* Captura de Rutas no Existentes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
