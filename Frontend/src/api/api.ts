// Frontend/src/api/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0', // Prefijo /api configurado globalmente
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor de seguridad por si manejas autenticación más adelante
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
