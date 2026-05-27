// Frontend/src/api/rutinas.ts
import api from './api';

// ============================================================================
// 1. INTERFACES DE TYPESCRIPT (Modelos de datos del Serializer)
// ============================================================================

export interface Rutina {
  id_rutina: number;
  nombre?: string | null;
  objetivo?: string | null;
  fecha_creacion?: string | null; // Django lo envía como string "YYYY-MM-DD"
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

export interface AsignacionRutina {
  id_asignacion: number;
  id_cliente?: number | null;
  id_rutina?: number | null;
  fecha_asignacion?: string | null;
  observaciones?: string | null;
}

// Interfaces de respuesta genéricas para tus procedimientos almacenados
export interface RespuestaMensaje {
  mensaje: string;
}

export interface RespuestaError {
  error: string;
}

// ============================================================================
// 2. PETICIONES AXIOS (Mapeadas uno a uno con tus URLconf)
// ============================================================================

// --- ENDPOINTS DE RUTINAS PRINCIPALES ---

/**
 * GET /api/rutinas/ - Lista todas las cabeceras de rutinas
 */
export const obtenerRutinas = async (): Promise<Rutina[]> => {
  const { data } = await api.get<Rutina[]>('/rutinas/rutinas/');
  return data;
};

/**
 * POST /api/rutinas/ - Crea una rutina nueva ejecutando el SP en Django
 * @param payload Datos de la rutina y su primer ejercicio requeridos por tu SP
 */
export const crearRutina = async (payload: Omit<DetalleRutina, 'id_detalle_rutina'>): Promise<RespuestaMensaje> => {
  const { data } = await api.post<RespuestaMensaje>('/rutinas/rutinas/', payload);
  return data;
};

/**
 * GET /api/rutinas/<id>/ - Obtiene una rutina específica por su ID
 */
export const obtenerRutinaPorId = async (id: number): Promise<Rutina> => {
  const { data } = await api.get<Rutina>(`/rutinas/rutinas/${id}/`);
  return data;
};

/**
 * PUT /api/rutinas/<id>/ - Modifica una rutina por ID vía procedimiento almacenado
 */
export const actualizarRutina = async (id: number, payload: Partial<Omit<DetalleRutina, 'id_detalle_rutina'>>): Promise<RespuestaMensaje> => {
  const { data } = await api.put<RespuestaMensaje>(`/rutinas/rutinas/${id}/`, payload);
  return data;
};

/**
 * DELETE /api/rutinas/<id>/ - Elimina una rutina por ID vía procedimiento almacenado
 */
export const eliminarRutina = async (id: number): Promise<RespuestaMensaje> => {
  const { data } = await api.delete<RespuestaMensaje>(`/rutinas/rutinas/${id}/`);
  return data;
};


// --- ENDPOINTS DE DETALLE DE RUTINA (Ejercicios individuales dentro de la rutina) ---

/**
 * POST /api/rutinas/detalle/ - Agrega un ejercicio al detalle de una rutina
 */
export const agregarEjercicioADetalle = async (payload: Omit<DetalleRutina, 'id_detalle_rutina'>): Promise<DetalleRutina> => {
  const { data } = await api.post<DetalleRutina>('/rutinas/rutinas/detalle/', payload);
  return data;
};

/**
 * PUT /api/rutinas/detalle/<id>/ - Actualiza series/reps de un ejercicio del detalle
 */
export const actualizarEjercicioEnDetalle = async (idDetalle: number, payload: Partial<DetalleRutina>): Promise<DetalleRutina> => {
  const { data } = await api.put<DetalleRutina>(`/rutinas/rutinas/detalle/${idDetalle}/`, payload);
  return data;
};

/**
 * DELETE /api/rutinas/detalle/<id>/ - Remueve un ejercicio del detalle de una rutina
 */
export const eliminarEjercicioDeDetalle = async (idDetalle: number): Promise<RespuestaMensaje> => {
  const { data } = await api.delete<RespuestaMensaje>(`/rutinas/rutinas/detalle/${idDetalle}/`);
  return data;
};


// --- ENDPOINTS DE ASIGNACIÓN ---

/**
 * GET /api/rutinas/asignar/ - Lista todas las asignaciones de rutinas a clientes
 */
export const obtenerAsignacionesRutinas = async (): Promise<AsignacionRutina[]> => {
  const { data } = await api.get<AsignacionRutina[]>('/rutinas/rutinas/asignar/');
  return data;
};

/**
 * POST /api/rutinas/asignar/ - Asigna una rutina a un cliente específico
 */
export const asignarRutinaACliente = async (payload: Omit<AsignacionRutina, 'id_asignacion'>): Promise<AsignacionRutina> => {
  const { data } = await api.post<AsignacionRutina>('/rutinas/rutinas/asignar/', payload);
  return data;
};

