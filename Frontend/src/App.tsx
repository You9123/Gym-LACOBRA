import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import Usuarios from "./pages/Usuarios";
import Ejercicios from "./pages/Ejercicios";
import Medidas from "./pages/Medidas";
import Rutinas from "./pages/Rutinas";
import Reportes from "./pages/Reportes";
import Sucursales from "./pages/Sucursales";
import Ubicaciones from "./pages/Ubicaciones";

import NotFound from "./pages/NotFound";

function App() {

  return (

    <BrowserRouter>

      <div className="min-h-screen bg-slate-950 text-white flex flex-col">

        <Navbar />

        <main className="flex-1 container mx-auto p-8">

          <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route path="/login" element={<Login />} />

            <Route path="/usuarios" element={<Usuarios />} />

            <Route path="/ejercicios" element={<Ejercicios />} />

            <Route path="/medidas" element={<Medidas />} />

            <Route path="/rutinas" element={<Rutinas />} />

            <Route path="/reportes" element={<Reportes />} />

            <Route path="/sucursales" element={<Sucursales />} />

            <Route path="/ubicaciones" element={<Ubicaciones />} />

            <Route path="*" element={<NotFound />} />

          </Routes>

        </main>

        <Footer />

      </div>

    </BrowserRouter>

  );
}

export default App;