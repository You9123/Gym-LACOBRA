// Frontend/src/api/usuarios.ts
import api from './api';

// ============================================================================
// 1. INTERFACES DE TYPESCRIPT (Estructuras de datos mapeadas del backend)
// ============================================================================

export interface Sexo {
  id_sexo: number;
  nombre: string;
}

export interface Rol {
  id_rol: number;
  nombre: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena?: string; // Opcional ya que es write_only y no viaja en GETs
  telefono?: string | null;
  fecha_nacimiento?: string | null; // "YYYY-MM-DD"
  fecha_registro: string; // read_only
  id_distrito?: number | null;
  distrito_nombre?: string; // read_only expandido por Django
  id_sucursal?: number | null;
  sucursal_nombre?: string; // read_only expandido por Django
  id_sexo?: number | null;
  sexo_nombre?: string; // read_only expandido por Django
  id_rol?: number | null;
  rol_nombre?: string; // read_only expandido por Django
}

// Interfaz optimizada para listas basada en tu UsuarioListSerializer
export interface UsuarioLista {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string | null;
  fecha_registro: string;
  id_sexo?: number | null;
  sexo_nombre?: string;
  id_rol?: number | null;
  rol_nombre?: string;
}

export interface CredencialesLogin {
  correo: string;
  contrasena: string;
}

// Estructura de respuesta típica de un Login exitoso (puedes ajustarla según tu vista)
export interface RespuestaLogin {
  token?: string; 
  usuario?: UsuarioLista;
  mensaje?: string;
}

export interface ClienteCoach {
  id_cliente_coach: number;
  id_cliente: number;
  cliente_nombre: string; // read_only armado por el SerializerMethodField
  id_coach: number;
  coach_nombre: string; // read_only armado por el SerializerMethodField
  fecha_asignacion?: string | null;
}

// ============================================================================
// 2. PETICIONES AXIOS (Mapeadas uno a uno con sub-rutas de usuarios)
// ============================================================================

//  CATÁLOGOS 

/*
  GET /api/usuarios/sexos/ - Lista los tipos de sexo cargados de la base de datos
 */
export const obtenerSexos = async (): Promise<Sexo[]> => {
  const { data } = await api.get<Sexo[]>('/usuarios/sexos/');
  return data;
};

/*
  GET /api/usuarios/roles/ - Lista los roles del sistema (Admin, Coach, Cliente, etc.)
 */
export const obtenerRoles = async (): Promise<Rol[]> => {
  const { data } = await api.get<Rol[]>('/usuarios/roles/');
  return data;
};


//  CONTROL DE USUARIOS 

/*
  GET /api/usuarios/usuarios/ - Retorna la lista ligera de todos los usuarios
 */
export const obtenerUsuarios = async (): Promise<UsuarioLista[]> => {
  const { data } = await api.get<UsuarioLista[]>('/usuarios/usuarios/');
  return data;
};

/*
  POST /api/usuarios/usuarios/ - Registra un nuevo usuario en Oracle
  @param payload Objeto completo de usuario incluyendo contraseña
 */
export const crearUsuario = async (payload: Omit<Usuario, 'id_usuario' | 'fecha_registro'>): Promise<Usuario> => {
  const { data } = await api.post<Usuario>('/usuarios/usuarios/', payload);
  return data;
};

/*
  GET /api/usuarios/usuarios/<id>/ - Obtiene el perfil detallado de un usuario único
 */
export const obtenerUsuarioPorId = async (id: number): Promise<Usuario> => {
  const { data } = await api.get<Usuario>(`/usuarios/usuarios/${id}/`);
  return data;
};

/*
  PUT /api/usuarios/usuarios/<id>/ - Actualiza los datos del usuario en Oracle
 */
export const actualizarUsuario = async (id: number, payload: Partial<Usuario>): Promise<Usuario> => {
  const { data } = await api.put<Usuario>(`/usuarios/usuarios/${id}/`, payload);
  return data;
};

/*
  DELETE /api/usuarios/usuarios/<id>/ - Remueve o desactiva un usuario por ID
 */
export const eliminarUsuario = async (id: number): Promise<{ mensaje: string }> => {
  const { data } = await api.delete<{ mensaje: string }>(`/usuarios/usuarios/${id}/`);
  return data;
};


// AUTENTICACIÓN 

/*
  POST /api/usuarios/auth/login/ - Envía las credenciales para validar accesos
 */
export const iniciarSesion = async (credenciales: CredencialesLogin): Promise<RespuestaLogin> => {
  const { data } = await api.post<RespuestaLogin>('/usuarios/auth/login/', credenciales);
  return data;
};


//  RELACIÓN CLIENTE-COACH 

/*
  GET /api/usuarios/cliente-coach/ - Obtiene asignaciones de entrenadores
  Permite mandar filtros opcionales como parámetros url (?coach_id=1 o ?cliente_id=2)
 */
export const obtenerAsignacionesClienteCoach = async (filtros?: { coach_id?: number; cliente_id?: number }): Promise<ClienteCoach[]> => {
  const { data } = await api.get<ClienteCoach[]>('/usuarios/cliente-coach/', { params: filtros });
  return data;
};

/*
  POST /api/usuarios/cliente-coach/ - Vincula un cliente con su respectivo coach
 */
export const asignarClienteACoach = async (payload: Omit<ClienteCoach, 'id_cliente_coach' | 'cliente_nombre' | 'coach_nombre'>): Promise<ClienteCoach> => {
  const { data } = await api.post<ClienteCoach>('/usuarios/cliente-coach/', payload);
  return data;
};

/*
  DELETE /api/usuarios/cliente-coach/<id>/ - Elimina el vínculo entre un cliente y un coach
 */
export const eliminarAsignacionClienteCoach = async (id: number): Promise<{ mensaje: string }> => {
  const { data } = await api.delete<{ mensaje: string }>(`/usuarios/cliente-coach/${id}/`);
  return data;
};




// ── DASHBOARD CLIENTE (SP_OBTENER_*) ────────────────────────────────────────

export interface DatosCliente {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string | null;
  fecha_nacimiento?: string | null;
  id_sucursal?: number | null;
  nombre_sucursal?: string | null;
}

export interface CoachCliente {
  id_cliente_coach: number;
  fecha_asignacion?: string | null;
  id_coach: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string | null;
}

export interface RutinaCliente {
  id_asignacion: number;
  fecha_asignacion?: string | null;
  observaciones?: string | null;
  id_rutina: number;
  nombre_rutina: string;
  objetivo?: string | null;
  descripcion?: string | null;
  fecha_creacion?: string | null;
}

export interface MedidaCliente {
  id_historial: number;
  peso?: number | null;
  altura?: number | null;
  porcentaje_grasa?: number | null;
  masa_muscular?: number | null;
  cuello?: number | null;
  cintura?: number | null;
  cadera?: number | null;
  pecho?: number | null;
  brazo?: number | null;
  pierna?: number | null;
  fecha_medicion?: string | null;
}

export interface DashboardCliente {
  datos: DatosCliente;
  coach: CoachCliente | null;
  rutina: RutinaCliente | null;
  medidas: MedidaCliente[];
}

export async function obtenerDashboardCliente(correo: string): Promise<DashboardCliente> {
  const { data } = await api.get<DashboardCliente>(
    `/usuarios/usuario/cliente/dashboard/${encodeURIComponent(correo)}/`
  );

  return data;
}


export interface RespuestaLogin {
  token?: string;
  usuario?: UsuarioLista;
  mensaje?: string;
  id_usuario?: number; 
  id_rol?: number;      
}