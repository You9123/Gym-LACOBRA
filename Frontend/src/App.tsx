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

// SEGURIDAD Y VISTAS DEL COACH (Nuevas Importaciones)
import GuardPorRol from "./components/shared/GuardPorRol";
import DashboardCoach from "./coach_pages/DashboardCoach";
import MedidaCliente from "./coach_pages/MedidaCliente";
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
                  {/* Sub-rutas Administrativas */}
                  <Route path="dashboard"    element={<Dashboard />} />
                  <Route path="usuarios"     element={<Usuarios />} />
                  <Route path="ejercicios"   element={<Ejercicios />} />
                  <Route path="medidas"      element={<Medidas />} />
                  <Route path="rutinas"      element={<Rutinas />} />
                  <Route path="reportes"     element={<Reportes />} />
                  <Route path="sucursales"   element={<Sucursales />} />
                  <Route path="ubicaciones"  element={<Ubicaciones />} />

                  {/* Sub-rutas del Coach Protegidas pasando el ID de rol dinámico (Coach = 2) */}
                  <Route 
                    path="coach/dashboard" 
                    element={
                      <GuardPorRol rolPermitido={2}>
                        <DashboardCoach />
                      </GuardPorRol>
                    } 
                  />
                  <Route 
                    path="coach/cliente/:id/medidas" 
                    element={
                      <GuardPorRol rolPermitido={2}>
                        <MedidaCliente />
                      </GuardPorRol>
                    } 
                  />
                  <Route 
                    path="coach/cliente/:id/asignar" 
                    element={
                      <GuardPorRol rolPermitido={2}>
                        <AsignarRutina />
                      </GuardPorRol>
                    } 
                  />
                  <Route 
                    path="coach/rutinas/crear" 
                    element={
                      <GuardPorRol rolPermitido={2}>
                        <CrearRutina />
                      </GuardPorRol>
                    } 
                  />

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
