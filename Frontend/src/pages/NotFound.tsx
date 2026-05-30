import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-white text-center py-20">
      <h1 className="text-6xl font-bold mb-4 text-cyan-400">404</h1>
      <p className="text-2xl mb-4">¡Página no encontrada!</p>
      <p className="text-slate-400 mb-8">
        Lo sentimos, la página que estás buscando no existe.
      </p>
      <Link 
        to="/" 
        className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default NotFound;