// Frontend/src/api/reportes.ts
import api from './api';

// ============================================================================
// 1. INTERFACES DE TYPESCRIPT (Estructuras de datos analíticos)
// ============================================================================

export interface ReporteGrasa {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  porcentaje_grasa_actual: string; // Los campos de tipo Decimal/Numeric llegan como string para mantener precisión exacta
  fecha_actualizacion: string;     // Formato de fecha "YYYY-MM-DD"
}

// ============================================================================
// 2. PETICIONES AXIOS (Mapeadas con el prefijo /api/reportes/)
// ============================================================================

/**
 * GET /api/reportes/grasa/ - Obtiene el reporte analítico generado por el SP_REPORTE_GRASA
 */
export const obtenerReporteGrasa = async (): Promise<ReporteGrasa[]> => {
  const { data } = await api.get<ReporteGrasa[]>('/reportes/grasa/');
  return data;
};
