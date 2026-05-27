// Frontend/src/api/sucursales.ts
import api from './api';

// ============================================================================
// 1. INTERFACES DE TYPESCRIPT (Estructura de datos de Sucursales)
// ============================================================================

export interface Sucursal {
  id_sucursal: number;
  nombre: string;
  direccion_exacta?: string | null;
  telefono?: string | null;
  horario?: string | null;
  id_distrito?: number | null; // Llave foránea que conecta con el módulo de ubicaciones
}

// ============================================================================
// 2. PETICIONES AXIOS (Mapeadas con el prefijo /api/sucursales/)
// ============================================================================

/**
 * GET /api/sucursales/sucursales/ - Lista todas las sucursales físicas registradas
 */
export const obtenerSucursales = async (): Promise<Sucursal[]> => {
  const { data } = await api.get<Sucursal[]>('/sucursales/sucursales/');
  return data;
};

/**
 * POST /api/sucursales/sucursales/ - Registra una nueva sucursal en el sistema
 * @param payload Datos de la sucursal omitiendo el ID autogenerado
 */
export const crearSucursal = async (payload: Omit<Sucursal, 'id_sucursal'>): Promise<Sucursal> => {
  const { data } = await api.post<Sucursal>('/sucursales/sucursales/', payload);
  return data;
};

/**
 * GET /api/sucursales/sucursales/<id>/ - Obtiene la información detallada de una sucursal única
 */
export const obtenerSucursalPorId = async (id: number): Promise<Sucursal> => {
  const { data } = await api.get<Sucursal>(`/sucursales/sucursales/${id}/`);
  return data;
};

/**
 * PUT /api/sucursales/sucursales/<id>/ - Actualiza los datos o el horario de una sucursal por ID
 */
export const actualizarSucursal = async (id: number, payload: Partial<Sucursal>): Promise<Sucursal> => {
  const { data } = await api.put<Sucursal>(`/sucursales/sucursales/${id}/`, payload);
  return data;
};

/**
 * DELETE /api/sucursales/sucursales/<id>/ - Remueve una sucursal física del sistema
 */
export const eliminarSucursal = async (id: number): Promise<{ mensaje: string }> => {
  const { data } = await api.delete<{ mensaje: string }>(`/sucursales/sucursales/${id}/`);
  return data;
};
