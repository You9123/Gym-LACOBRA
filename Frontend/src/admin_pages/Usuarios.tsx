// pages/Usuarios.tsx
import { useState, useEffect } from 'react';
import { 
  obtenerUsuarios, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario,
  obtenerRoles,
  obtenerSexos
} from '../api/usuarios';
import UsuarioCard from '../components/usuarios/UsuarioCard';
import UsuarioForm from '../components/usuarios/UsuarioForm';
import ConfirmDelete from '../components/shared/ConfirmDelete';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Estado para el modal de confirmación
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const [usuariosData, rolesData, sexosData] = await Promise.all([
        obtenerUsuarios(),
        obtenerRoles(),
        obtenerSexos()
      ]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
      setSexos(sexosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setErrorMessage('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (usuarioData) => {
    try {
      await crearUsuario(usuarioData);
      await cargarDatosIniciales();
      setShowForm(false);
    } catch (error) {
      console.error('Error creando usuario:', error);
      setErrorMessage('Error al crear el usuario');
    }
  };

  const handleUpdate = async (id, usuarioData) => {
    try {
      await actualizarUsuario(id, usuarioData);
      await cargarDatosIniciales();
      setEditingUsuario(null);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      setErrorMessage('Error al actualizar el usuario');
    }
  };

  // Abrir modal de confirmación
  const confirmDelete = (usuario) => {
    setUsuarioToDelete(usuario);
    setShowConfirmDelete(true);
  };

  // Ejecutar eliminación
  const handleDelete = async () => {
    if (usuarioToDelete) {
      try {
        await eliminarUsuario(usuarioToDelete.id_usuario);
        await cargarDatosIniciales();
        setShowConfirmDelete(false);
        setUsuarioToDelete(null);
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        setErrorMessage('Error al eliminar el usuario');
      }
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setUsuarioToDelete(null);
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuarios del Sistema</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition-colors"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-400">Eliminar Usuario</h2>
            <ConfirmDelete
              onConfirm={handleDelete}
              onCancel={handleCancelDelete}
            />
          </div>
        </div>
      )}

      {/* Modal para crear */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">Registrar Usuario</h2>
            <UsuarioForm
              roles={roles}
              sexos={sexos}
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Modal para editar */}
      {editingUsuario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
            <UsuarioForm
              initialData={editingUsuario}
              roles={roles}
              sexos={sexos}
              onSubmit={(data) => handleUpdate(editingUsuario.id_usuario, data)}
              onCancel={() => setEditingUsuario(null)}
            />
          </div>
        </div>
      )}

      {/* Modal de error */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Error</h2>
                <p className="text-slate-400 text-sm">No se pudo completar la operación</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage("")}
              className="w-full bg-red-600 hover:bg-red-500 p-3 rounded-xl transition font-semibold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="text-center py-10 bg-slate-800/50 rounded-lg">
          <p className="text-slate-400">No hay usuarios registrados</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-cyan-400 hover:text-cyan-300"
          >
            Registrar primer usuario
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usuarios.map((usuario) => (
            <UsuarioCard
              key={usuario.id_usuario}
              usuario={usuario}
              onEdit={() => setEditingUsuario(usuario)}
              onDelete={() => confirmDelete(usuario)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Usuarios;