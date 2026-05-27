// Frontend/src/api/ubicaciones.ts
import api from './api';

// ============================================================================
// 1. INTERFACES DE TYPESCRIPT (Estructuras de datos territoriales)
// ============================================================================

export interface Provincia {
  id_provincia: number;
  nombre: string;
}

export interface Canton {
  id_canton: number;
  nombre: string;
  id_provincia: number;
  provincia_nombre?: string; // read_only expandido por Django
}

export interface Distrito {
  id_distrito: number;
  nombre: string;
  id_canton: number;
  canton_nombre?: string;    // read_only expandido por Django
  provincia_nombre?: string; // read_only expandido jerárquicamente por Django
}

// ============================================================================
// 2. PETICIONES AXIOS (Mapeadas con el prefijo /api/ubicaciones/)
// ============================================================================

// --- PROVINCIAS ---

/**
 * GET /api/ubicaciones/provincias/ - Obtiene la lista de todas las provincias
 */
export const obtenerProvincias = async (): Promise<Provincia[]> => {
  const { data } = await api.get<Provincia[]>('/ubicaciones/provincias/');
  return data;
};

/**
 * GET /api/ubicaciones/provincias/<id>/ - Obtiene el detalle de una provincia específica
 */
export const obtenerProvinciaPorId = async (id: number): Promise<Provincia> => {
  const { data } = await api.get<Provincia>(`/ubicaciones/provincias/${id}/`);
  return data;
};


// --- CANTONES ---

/**
 * GET /api/ubicaciones/cantones/ - Obtiene la lista de cantones
 * @param filtros Opcional: filtro query (?provincia_id=X) para traer solo cantones de esa provincia
 */
export const obtenerCantones = async (filtros?: { provincia_id?: number }): Promise<Canton[]> => {
  const { data } = await api.get<Canton[]>('/ubicaciones/cantones/', { params: filtros });
  return data;
};

/**
 * GET /api/ubicaciones/cantones/<id>/ - Obtiene el detalle de un cantón específico
 */
export const obtenerCantonPorId = async (id: number): Promise<Canton> => {
  const { data } = await api.get<Canton>(`/ubicaciones/cantones/${id}/`);
  return data;
};


// --- DISTRITOS ---

/**
 * GET /api/ubicaciones/distritos/ - Obtiene la lista de distritos
 * @param filtros Opcional: filtro query (?canton_id=X) para traer solo distritos de ese cantón
 */
export const obtenerDistritos = async (filtros?: { canton_id?: number }): Promise<Distrito[]> => {
  const { data } = await api.get<Distrito[]>('/ubicaciones/distritos/', { params: filtros });
  return data;
};

/**
 * GET /api/ubicaciones/distritos/<id>/ - Obtiene el detalle de un distrito específico
 */
export const obtenerDistritoPorId = async (id: number): Promise<Distrito> => {
  const { data } = await api.get<Distrito>(`/ubicaciones/distritos/${id}/`);
  return data;
};
