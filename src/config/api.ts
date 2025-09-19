import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://localhost:53735/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.config?.url, error.message);
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      // Redirecionar para login
    }
    return Promise.reject(error);
  }
);

export default api; 