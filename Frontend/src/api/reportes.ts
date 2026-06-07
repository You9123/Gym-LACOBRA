// Frontend/src/api/reportes.ts
import api from './api';

export interface ReporteGrasa {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  porcentaje_grasa_actual: string;
  fecha_actualizacion: string;
}

// Agregar el parámetro umbral
export const obtenerReporteGrasa = async (umbral: number = 25): Promise<ReporteGrasa[]> => {
  const { data } = await api.get<ReporteGrasa[]>('/reportes/grasa/', {
    params: { umbral }
  });
  return data;
};

export interface EvolucionGrasa {
  fecha: string;
  promedio_grasa: number;
}

export const obtenerEvolucionGrasa = async (umbral: number = 25): Promise<EvolucionGrasa[]> => {
  const { data } = await api.get('/reportes/grasa/evolucion/', { params: { umbral } });
  return data;
};