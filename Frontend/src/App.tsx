import { useEffect, useState } from 'react';

// 1. Importación normal para la función ejecutable de Axios
import { obtenerUsuarios } from './api/usuarios';

// 2. Importación obligatoria con 'type' por tu regla verbatimModuleSyntax
import type { UsuarioLista } from './api/usuarios';

export default function App() {
  const [usuarios, setUsuarios] = useState<UsuarioLista[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const probarConexionUsuarios = async () => {
      try {
        console.log('📡 Solicitando listado de usuarios a Django...');
        const datos = await obtenerUsuarios();
        
        // Verificación en consola del navegador (F12)
        console.log('✅ ¡Usuarios recuperados con éxito desde Oracle!', datos);
        setUsuarios(datos);
      } catch (err: any) {
        console.error('❌ Error al consultar usuarios:', err);
        setError(err.message || 'Error al conectar con el módulo de usuarios');
      } finally {
        setCargando(false);
      }
    };

    probarConexionUsuarios();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>🧪 Prueba de Conexión: Módulo Usuarios 🧪</h1>
      <hr />
      
      {cargando && <p style={{ color: 'blue' }}>⏳ Cargando cuentas desde el servidor...</p>}
      
      {error && (
        <div style={{ color: 'red', background: '#fee', padding: '15px', borderRadius: '5px' }}>
          <h3>🚨 Error en la consulta de usuarios:</h3>
          <p>{error}</p>
        </div>
      )}

      {!cargando && !error && (
        <div>
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            👥 ¡Datos cargados! Total de usuarios en el sistema: {usuarios.length}
          </p>
          
          <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', marginTop: '20px', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f4f4f4' }}>
                <th>Nombre Completo</th>
                <th>Correo Electrónico</th>
                <th>Rol asignado</th>
                <th>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usr) => (
                <tr key={usr.id_usuario}>
                  <td>{usr.nombre} {usr.apellido}</td>
                  <td>{usr.correo}</td>
                  <td>
                    <span style={{ background: '#e0f0ff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9em' }}>
                      {usr.rol_nombre || 'Sin Rol'}
                    </span>
                  </td>
                  <td>{usr.fecha_registro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
