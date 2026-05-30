// Frontend/src/api/medidas.ts
import api from './api';

// ============================================================================
// 1. INTERFACES DE TYPESCRIPT (Estructuras de Mediciones Actuales e Historial)
// ============================================================================

export interface Medida {
  id_medida: number;           // read_only
  id_cliente: number;
  peso_actual: string;         // Los campos Decimal/Numeric llegan como string para cuidar precisión
  altura: string;              
  porcentaje_grasa_actual?: string | null;
  masa_muscular_actual?: string | null;
  fecha_actualizacion: string; // read_only ("YYYY-MM-DD")
}

export interface HistorialMedida {
  id_historial: number;        // read_only
  id_cliente: number;
  peso: string;
  altura: string;
  porcentaje_grasa?: string | null;
  masa_muscular?: string | null;
  cuello?: string | null;
  cintura?: string | null;
  cadera?: string | null;
  pecho?: string | null;
  brazo?: string | null;
  pierna?: string | null;
  fecha_medicion: string;      // "YYYY-MM-DD"
}

// Estructura de respuesta del cálculo del IMC
export interface RespuestaImc {
  imc: number;
  clasificacion: string;
}

// ============================================================================
// 2. PETICIONES AXIOS (Mapeadas con el prefijo /api/medidas/)
// ============================================================================

// ENDPOINTS DE MEDIDAS ACTUALES

/*
  GET /api/medidas/ - Lista todas las mediciones registradas en el sistema
 */
export const obtenerMedidas = async (): Promise<Medida[]> => {
  const { data } = await api.get<Medida[]>('/medidas/');
  return data;
};

/*
  POST /api/medidas/ - Registra una nueva medición para un cliente
  @param payload Datos físicos de la medición omitiendo campos automáticos
 */
export const registrarMedida = async (payload: Omit<Medida, 'id_medida' | 'fecha_actualizacion'>): Promise<Medida> => {
  const { data } = await api.post<Medida>('/medidas/', payload);
  return data;
};

/*
  GET /api/medidas/<id>/ - Obtiene el detalle de una medición actual específica
 */
export const obtenerMedidaPorId = async (id: number): Promise<Medida> => {
  const { data } = await api.get<Medida>(`/medidas/${id}/`);
  return data;
};

/*
  PUT /api/medidas/<id>/ - Modifica los valores de una medición actual por ID
 */
export const actualizarMedida = async (id: number, payload: Partial<Omit<Medida, 'id_medida' | 'fecha_actualizacion'>>): Promise<Medida> => {
  const { data } = await api.put<Medida>(`/medidas/${id}/`, payload);
  return data;
};

/*
  DELETE /api/medidas/<id>/ - Elimina un registro de medición actual por ID
 */
export const eliminarMedida = async (id: number): Promise<{ mensaje: string }> => {
  const { data } = await api.delete<{ mensaje: string }>(`/medidas/${id}/`);
  return data;
};

/*
  GET /api/medidas/cliente/<cliente_pk>/ - Obtiene la medición actual de un cliente específico
 */
export const obtenerMedidaPorCliente = async (clienteId: number): Promise<Medida> => {
  const { data } = await api.get<Medida>(`/medidas/cliente/${clienteId}/`);
  return data;
};


// --- ENDPOINTS DE HISTORIAL (Generados por Trigger) ---

/*
  GET /api/medidas/historial/cliente/<cliente_pk>/ - Obtiene la evolución histórica de un cliente
 */
export const obtenerHistorialPorCliente = async (clienteId: number): Promise<HistorialMedida[]> => {
  const { data } = await api.get<HistorialMedida[]>(`/medidas/historial/cliente/${clienteId}/`);
  return data;
};

/*
  GET /api/medidas/historial/<id>/ - Recupera un registro específico de una medición del historial
 */
export const obtenerHistorialPorId = async (id: number): Promise<HistorialMedida> => {
  const { data } = await api.get<HistorialMedida>(`/medidas/historial/${id}/`);
  return data;
};


// CÁLCULO DE IMC 

/*
  POST /api/medidas/calcular-imc/ - Ejecuta la lógica matemática o SP para devolver el IMC actual
  @param payload Parámetros requeridos para calcular (usualmente peso y altura)
 */
export const calcularImc = async (payload: { peso: number; altura: number }): Promise<RespuestaImc> => {
  const { data } = await api.post<RespuestaImc>('/medidas/calcular-imc/', payload);
  return data;
};
