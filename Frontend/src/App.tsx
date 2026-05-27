import { useEffect, useState } from 'react';

// 1. Importación normal para funciones de JavaScript/TypeScript ejecutable
import { obtenerEjercicios } from './api/ejercicios';

// 2. Importación usando "type" obligatoria por la regla verbatimModuleSyntax
import type { Ejercicio } from './api/ejercicios';

export default function App() {
  // Ahora puedes usar el tipo Ejercicio normalmente aquí
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const probarConexion = async () => {
      try {
        console.log('📡 Iniciando petición de Axios hacia Django...');
        const datos = await obtenerEjercicios();
        
        console.log('✅ ¡Conexión exitosa con Oracle! Datos recibidos:', datos);
        setEjercicios(datos);
      } catch (err: any) {
        console.error('❌ Error en la petición de Axios:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setCargando(false);
      }
    };

    probarConexion();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>🧪 Prueba de Conexión API Frontend 🧪</h1>
      <hr />
      
      {cargando && <p style={{ color: 'orange' }}>⏳ Cargando datos desde Django...</p>}
      
      {error && (
        <div style={{ color: 'red', background: '#fee', padding: '15px', borderRadius: '5px' }}>
          <h3>🚨 Hubo un error de conexión:</h3>
          <p>{error}</p>
        </div>
      )}

      {!cargando && !error && (
        <div>
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            🎉 ¡Conexión establecida! Total de ejercicios en Oracle: {ejercicios.length}
          </p>
          <ul>
            {ejercicios.map((ej) => (
              <li key={ej.id_ejercicio}>
                <strong>{ej.nombre}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
