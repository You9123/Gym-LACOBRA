// Frontend/src/api/ejercicios.ts
import api from './api';

// ============================================================================
// 1. INTERFACES DE TYPESCRIPT (Estructuras de Ejercicios y Catálogos)
// ============================================================================

export interface CategoriaEjercicio {
  id_categoria: number;
  nombre_categoria: string;
  descripcion?: string | null;
}

export interface DificultadEjercicio {
  id_dificultad: number;
  nombre: string;
}

export interface Imagen {
  id_imagen: number;
  ruta_imagen: string; // URL o string de la ubicación del archivo
  descripcion?: string | null;
  id_ejercicio: number;
}

export interface Ejercicio {
  id_ejercicio: number;
  nombre: string;
  descripcion?: string | null;
  calorias_estimadas?: number | null;
  id_categoria: number;
  categoria_nombre?: string;  // read_only devuelto por Django
  id_dificultad: number;
  dificultad_nombre?: string; // read_only devuelto por Django
  imagenes?: Imagen[];        // Relación anidada mapeada desde imagen_set
}

// ============================================================================
// 2. PETICIONES AXIOS (Mapeadas con el prefijo /api/ejercicios/)
// ============================================================================

// --- CATEGORÍAS ---

/**
 * GET /api/ejercicios/categorias/ - Lista todas las categorías de ejercicios
 */
export const obtenerCategoriasEjercicios = async (): Promise<CategoriaEjercicio[]> => {
  const { data } = await api.get<CategoriaEjercicio[]>('/ejercicios/categorias/');
  return data;
};

/**
 * GET /api/ejercicios/categorias/<id>/ - Obtiene el detalle de una categoría específica
 */
export const obtenerCategoriaEjercicioPorId = async (id: number): Promise<CategoriaEjercicio> => {
  const { data } = await api.get<CategoriaEjercicio>(`/ejercicios/categorias/${id}/`);
  return data;
};


// --- DIFICULTADES ---

/**
 * GET /api/ejercicios/dificultades/ - Lista los niveles de dificultad del sistema
 */
export const obtenerDificultadesEjercicios = async (): Promise<DificultadEjercicio[]> => {
  const { data } = await api.get<DificultadEjercicio[]>('/ejercicios/dificultades/');
  return data;
};

/**
 * GET /api/ejercicios/dificultades/<id>/ - Detalle de un nivel de dificultad específico
 */
export const obtenerDificultadEjercicioPorId = async (id: number): Promise<DificultadEjercicio> => {
  const { data } = await api.get<DificultadEjercicio>(`/ejercicios/dificultades/${id}/`);
  return data;
};


// --- EJERCICIOS PRINCIPALES ---

/**
 * GET /api/ejercicios/ - Lista todos los ejercicios con sus datos de categorías e imágenes anidadas
 */
export const obtenerEjercicios = async (): Promise<Ejercicio[]> => {
  const { data } = await api.get<Ejercicio[]>('/ejercicios/');
  return data;
};

/**
 * POST /api/ejercicios/ - Registra un nuevo ejercicio en Oracle
 * @param payload Datos del ejercicio omitiendo el ID e imágenes (las imágenes se manejan aparte)
 */
export const crearEjercicio = async (payload: Omit<Ejercicio, 'id_ejercicio' | 'categoria_nombre' | 'dificultad_nombre' | 'imagenes'>): Promise<Ejercicio> => {
  const { data } = await api.post<Ejercicio>('/ejercicios/', payload);
  return data;
};

/**
 * GET /api/ejercicios/<id>/ - Obtiene la ficha completa de un ejercicio por su ID
 */
export const obtenerEjercicioPorId = async (id: number): Promise<Ejercicio> => {
  const { data } = await api.get<Ejercicio>(`/ejercicios/${id}/`);
  return data;
};

/**
 * PUT /api/ejercicios/<id>/ - Modifica los parámetros de un ejercicio existente
 */
export const actualizarEjercicio = async (id: number, payload: Partial<Omit<Ejercicio, 'id_ejercicio' | 'categoria_nombre' | 'dificultad_nombre' | 'imagenes'>>): Promise<Ejercicio> => {
  const { data } = await api.put<Ejercicio>(`/ejercicios/${id}/`, payload);
  return data;
};

/**
 * DELETE /api/ejercicios/<id>/ - Elimina un ejercicio físico de la base de datos
 */
export const eliminarEjercicio = async (id: number): Promise<{ mensaje: string }> => {
  const { data } = await api.delete<{ mensaje: string }>(`/ejercicios/${id}/`);
  return data;
};


// --- IMÁGENES DE EJERCICIOS ---

/**
 * GET /api/ejercicios/<ejercicio_pk>/imagenes/ - Lista todas las imágenes asignadas a un ejercicio específico
 */
export const obtenerImagenesPorEjercicio = async (ejercicioId: number): Promise<Imagen[]> => {
  const { data } = await api.get<Imagen[]>(`/ejercicios/${ejercicioId}/imagenes/`);
  return data;
};

/**
 * POST /api/ejercicios/<ejercicio_pk>/imagenes/ - Vincula una nueva ruta de imagen a un ejercicio
 */
export const agregarImagenAEjercicio = async (ejercicioId: number, payload: Omit<Imagen, 'id_imagen' | 'id_ejercicio'>): Promise<Imagen> => {
  const { data } = await api.post<Imagen>(`/ejercicios/${ejercicioId}/imagenes/`, payload);
  return data;
};

/**
 * DELETE /api/ejercicios/imagenes/<id>/ - Remueve una imagen específica del sistema
 */
export const eliminarImagenEjercicio = async (idImagen: number): Promise<{ mensaje: string }> => {
  const { data } = await api.delete<{ mensaje: string }>(`/ejercicios/imagenes/${idImagen}/`);
  return data;
};
