// Frontend/src/api/rutinas.ts
import api from './api';

// ============================================================================
// 1. INTERFACES DE TYPESCRIPT (Modelos de datos del Serializer)
// ============================================================================

export interface Rutina {
  id_rutina: number;
  nombre?: string | null;
  objetivo?: string | null;
  fecha_creacion?: string | null;
  descripcion?: string | null;
  id_coach?: number | null;
}

export interface DetalleRutina {
  id_detalle_rutina: number;
  id_rutina?: number | null;
  id_ejercicio?: number | null;
  series?: number | null;
  repeticiones?: number | null;
  descanso_segundos?: number | null;
  orden_ejercicio?: number | null;
}

export interface DetalleRutinaConNombre extends DetalleRutina {
  ejercicio_nombre: string;  
}

export interface AsignacionRutina {
  id_asignacion: number;
  id_cliente?: number | null;
  id_rutina?: number | null;
  fecha_asignacion?: string | null;
  observaciones?: string | null;
}

export interface RespuestaMensaje {
  mensaje: string;
}

export interface RespuestaError {
  error: string;
}

// ============================================================================
// 2. PETICIONES AXIOS
// ============================================================================

// ENDPOINTS DE RUTINAS PRINCIPALES

export const obtenerRutinas = async (): Promise<Rutina[]> => {
  const { data } = await api.get<Rutina[]>('/rutinas/rutinas/');
  return data;
};

export const crearRutina = async (
  payload: Omit<Rutina, 'id_rutina' | 'fecha_creacion'>
): Promise<Rutina> => {
  const { data } = await api.post<Rutina>('/rutinas/rutinas/', payload);
  return data;
};

export const obtenerRutinaPorId = async (id: number): Promise<Rutina> => {
  const { data } = await api.get<Rutina>(`/rutinas/rutinas/${id}/`);
  return data;
};

export const actualizarRutina = async (id: number, payload: Partial<Omit<DetalleRutina, 'id_detalle_rutina'>>): Promise<RespuestaMensaje> => {
  const { data } = await api.put<RespuestaMensaje>(`/rutinas/rutinas/${id}/`, payload);
  return data;
};

export const eliminarRutina = async (id: number): Promise<RespuestaMensaje> => {
  const { data } = await api.delete<RespuestaMensaje>(`/rutinas/rutinas/${id}/`);
  return data;
};

// ENDPOINTS DE DETALLE DE RUTINA

export const agregarEjercicioADetalle = async (payload: Omit<DetalleRutina, 'id_detalle_rutina'>): Promise<DetalleRutina> => {
  const { data } = await api.post<DetalleRutina>('/rutinas/rutinas/detalle/', payload);
  return data;
};

export const actualizarEjercicioEnDetalle = async (idDetalle: number, payload: Partial<DetalleRutina>): Promise<DetalleRutina> => {
  const { data } = await api.put<DetalleRutina>(`/rutinas/rutinas/detalle/${idDetalle}/`, payload);
  return data;
};

export const eliminarEjercicioDeDetalle = async (idDetalle: number): Promise<RespuestaMensaje> => {
  const { data } = await api.delete<RespuestaMensaje>(`/rutinas/rutinas/detalle/${idDetalle}/`);
  return data;
};

//  NUEVO ENDPOINT: Obtener detalles por rutina 

/*
GET /api/rutinas/rutinas/detalle-por-rutina/?id_rutina=<id>
Obtiene todos los ejercicios de una rutina específica
 */
export const obtenerDetallesPorRutina = async (idRutina: number): Promise<DetalleRutinaConNombre[]> => {
  const { data } = await api.get<DetalleRutinaConNombre[]>(`/rutinas/rutinas/detalle-por-rutina/?id_rutina=${idRutina}`);
  return data;
};

// ENDPOINTS DE ASIGNACIÓN

export const obtenerAsignacionesRutinas = async (): Promise<AsignacionRutina[]> => {
  const { data } = await api.get<AsignacionRutina[]>('/rutinas/rutinas/asignar/');
  return data;
};

export const asignarRutinaACliente = async (payload: Omit<AsignacionRutina, 'id_asignacion'>): Promise<AsignacionRutina> => {
  const { data } = await api.post<AsignacionRutina>('/rutinas/rutinas/asignar/', payload);
  return data;
};