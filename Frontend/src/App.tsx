import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";

// Main page (públicas)
import HomePage from "./main_page/HomePage";
import LoginPage from "./main_page/LoginPage";
import RegistroPage from "./main_page/RegistroPage";

// Admin pages
import Dashboard from "./admin_pages/Dashboard";
import Usuarios from "./admin_pages/Usuarios";
import Ejercicios from "./admin_pages/Ejercicios";
import Medidas from "./admin_pages/Medidas";
import Rutinas from "./admin_pages/Rutinas";
import Reportes from "./admin_pages/Reportes";
import Sucursales from "./admin_pages/Sucursales";
import Ubicaciones from "./admin_pages/Ubicaciones";
import NotFound from "./admin_pages/NotFound";

// Cliente pages
import ClienteDashboard from "./User_pages/ClienteDashboard";
import DatosPersonalesCliente from "./User_pages/DatosPersonalesCliente";
import MedidasCliente from "./User_pages/MedidasCliente";
import RutinaCliente from "./User_pages/RutinaCliente";
import SolicitarCoachPage from "./User_pages/SolicitarCoachPage";

// SEGURIDAD Y VISTAS DEL COACH
import GuardPorRol from "./components/shared/GuardPorRol";
import DashboardCoach from "./coach_pages/DashboardCoach";
import MedidaClienteCoach from "./coach_pages/MedidaCliente";
import AsignarRutina from "./coach_pages/AsignarRutina";
import CrearRutina from "./coach_pages/CrearRutina";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Rutas públicas (sin Navbar del sistema) ── */}
        <Route path="/"          element={<HomePage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/registro"  element={<RegistroPage />} />

        {/* ── Rutas del sistema (con Navbar y Footer) ── */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-slate-950 text-white flex flex-col">
              <Navbar />
              
              <main className="flex-1 container mx-auto p-8">
                <Routes>
                  {/* Sub-rutas Administrativas Protegidas (Admin = 1) */}
                  <Route path="admin/dashboard"   element={<GuardPorRol rolPermitido={1}><Dashboard /></GuardPorRol>} />
                  <Route path="admin/usuarios"    element={<GuardPorRol rolPermitido={1}><Usuarios /></GuardPorRol>} />
                  <Route path="admin/ejercicios"  element={<GuardPorRol rolPermitido={1}><Ejercicios /></GuardPorRol>} />
                  <Route path="admin/medidas"     element={<GuardPorRol rolPermitido={1}><Medidas /></GuardPorRol>} />
                  <Route path="admin/rutinas"     element={<GuardPorRol rolPermitido={1}><Rutinas /></GuardPorRol>} />
                  <Route path="admin/reportes"    element={<GuardPorRol rolPermitido={1}><Reportes /></GuardPorRol>} />
                  <Route path="admin/sucursales"  element={<GuardPorRol rolPermitido={1}><Sucursales /></GuardPorRol>} />
                  <Route path="admin/ubicaciones" element={<GuardPorRol rolPermitido={1}><Ubicaciones /></GuardPorRol>} />

                  {/* Sub-rutas del Coach Protegidas (Coach = 2) */}
                  <Route path="coach/dashboard"        element={<GuardPorRol rolPermitido={2}><DashboardCoach /></GuardPorRol>} />
                  <Route path="coach/cliente/:id/medidas" element={<GuardPorRol rolPermitido={2}><MedidaClienteCoach /></GuardPorRol>} />
                  <Route path="coach/cliente/:id/asignar" element={<GuardPorRol rolPermitido={2}><AsignarRutina /></GuardPorRol>} />
                  <Route path="coach/rutinas/crear"       element={<GuardPorRol rolPermitido={2}><CrearRutina /></GuardPorRol>} />

                  {/* ✅ SUB-RUTAS DEL CLIENTE (Agregadas aquí) */}
                  <Route path="cliente/dashboard" element={<ClienteDashboard />} />
                  <Route path="cliente/datos-personales" element={<DatosPersonalesCliente />} />
                  <Route path="cliente/medidas" element={<MedidasCliente />} />
                  <Route path="cliente/rutinas" element={<RutinaCliente />} />
                  <Route path="cliente/solicitar-coach" element={<SolicitarCoachPage />} />

                  {/* Captura de sub-rutas no existentes dentro del sistema */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;