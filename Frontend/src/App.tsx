import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main page (pública)
import HomePage from "./main_page/HomePage";
import LoginPage from "./main_page/LoginPage";
import RegistroPage from "./main_page/RegistroPage";

// Admin pages (con su propio layout)
import Dashboard from "./admin_pages/Dashboard";
import Usuarios from "./admin_pages/Usuarios";
import Ejercicios from "./admin_pages/Ejercicios";
import Medidas from "./admin_pages/Medidas";
import Rutinas from "./admin_pages/Rutinas";
import Reportes from "./admin_pages/Reportes";
import Sucursales from "./admin_pages/Sucursales";
import Ubicaciones from "./admin_pages/Ubicaciones";
import NotFound from "./admin_pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Rutas públicas (sin Navbar del sistema) ── */}
        <Route path="/"          element={<HomePage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/registro"  element={<RegistroPage />} />

        {/* ── Rutas del sistema (con Navbar y Footer) ── */}
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/usuarios"     element={<Usuarios />} />
        <Route path="/ejercicios"   element={<Ejercicios />} />
        <Route path="/medidas"      element={<Medidas />} />
        <Route path="/rutinas"      element={<Rutinas />} />
        <Route path="/reportes"     element={<Reportes />} />
        <Route path="/sucursales"   element={<Sucursales />} />
        <Route path="/ubicaciones"  element={<Ubicaciones />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;