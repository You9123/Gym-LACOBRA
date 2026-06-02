import api from './api';

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
  contrasena?: string;
  telefono?: string | null;
  fecha_nacimiento?: string | null;
  fecha_registro: string;
  id_distrito?: number | null;
  distrito_nombre?: string;
  id_sucursal?: number | null;
  sucursal_nombre?: string;
  id_sexo?: number | null;
  sexo_nombre?: string;
  id_rol?: number | null;
  rol_nombre?: string;
}

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

export interface RespuestaLogin {
  token?: string;
  usuario?: UsuarioLista;
  mensaje?: string;
  id_usuario?: number;
  id_rol?: number;
}

export interface ClienteCoach {
  id_cliente_coach: number;
  id_cliente: number;
  cliente_nombre: string;
  id_coach: number;
  coach_nombre: string;
  fecha_asignacion?: string | null;
}

export const obtenerSexos = async (): Promise<Sexo[]> => {
  const { data } = await api.get<Sexo[]>('/usuarios/sexos/');
  return data;
};

export const obtenerRoles = async (): Promise<Rol[]> => {
  const { data } = await api.get<Rol[]>('/usuarios/roles/');
  return data;
};

export const obtenerUsuarios = async (): Promise<UsuarioLista[]> => {
  const { data } = await api.get<UsuarioLista[]>('/usuarios/usuarios/');
  return data;
};

export const crearUsuario = async (payload: Omit<Usuario, 'id_usuario' | 'fecha_registro'>): Promise<Usuario> => {
  const { data } = await api.post<Usuario>('/usuarios/usuarios/', payload);
  return data;
};

export const obtenerUsuarioPorId = async (id: number): Promise<Usuario> => {
  const { data } = await api.get<Usuario>(`/usuarios/usuarios/${id}/`);
  return data;
};

export const actualizarUsuario = async (id: number, payload: Partial<Usuario>): Promise<Usuario> => {
  const { data } = await api.put<Usuario>(`/usuarios/usuarios/${id}/`, payload);
  return data;
};

export const eliminarUsuario = async (id: number): Promise<{ mensaje: string }> => {
  const { data } = await api.delete<{ mensaje: string }>(`/usuarios/usuarios/${id}/`);
  return data;
};

export const iniciarSesion = async (credenciales: CredencialesLogin): Promise<RespuestaLogin> => {
  const { data } = await api.post<RespuestaLogin>('/usuarios/auth/login/', credenciales);
  return data;
};

export const obtenerAsignacionesClienteCoach = async (filtros?: { coach_id?: number; cliente_id?: number }): Promise<ClienteCoach[]> => {
  const { data } = await api.get<ClienteCoach[]>('/usuarios/cliente-coach/', { params: filtros });
  return data;
};

export const asignarClienteACoach = async (payload: Omit<ClienteCoach, 'id_cliente_coach' | 'cliente_nombre' | 'coach_nombre'>): Promise<ClienteCoach> => {
  const { data } = await api.post<ClienteCoach>('/usuarios/cliente-coach/', payload);
  return data;
};

export const eliminarAsignacionClienteCoach = async (id: number): Promise<{ mensaje: string }> => {
  const { data } = await api.delete<{ mensaje: string }>(`/usuarios/cliente-coach/${id}/`);
  return data;
};

// ── DASHBOARD CLIENTE ────────────────────────────────────────

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

export interface CoachSucursal {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string | null;
  clientes_actuales: number;
}

export interface EstadoAsignacion {
  id_cliente_coach: number;
  fecha_asignacion: string;
  id_coach: number;
  coach_nombre: string;
  coach_apellido: string;
  coach_correo: string;
  coach_telefono: string | null;
}

export const obtenerCoachesPorSucursal = async (correoCliente: string): Promise<CoachSucursal[]> => {
  const response = await api.post('/usuarios/coaches/disponibles/', { correo_cliente: correoCliente });
  return response.data;
};

export const solicitarAsignacionCoach = async (correoCliente: string, idCoach: number): Promise<{ resultado: number; mensaje: string }> => {
  const response = await api.post('/usuarios/cliente-coach/solicitar/', {
    correo_cliente: correoCliente,
    id_coach: idCoach,
  });
  return response.data;
};


export const obtenerEstadoAsignacion = async (correoCliente: string): Promise<EstadoAsignacion | null> => {
  const response = await api.get('/usuarios/cliente-coach/estado/', {
    params: { correo: correoCliente }
  });
  const data = response.data;
  if (!data || !data.id_cliente_coach) return null;
  return data as EstadoAsignacion;
};
