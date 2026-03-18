import axios from 'axios';
import {getI18n} from "react-i18next";

const apiClient = axios.create({
  baseURL: 'http://localhost:84/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
    const lang = getI18n().language;
    config.headers['Accept-Language'] = lang;
    return config;
});

// Interceptor para adicionar token automaticamente
apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de resposta (tratamento global de erro)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // exemplo: logout automático
        localStorage.removeItem("token");
      }

      return Promise.reject(error);
    }
);

export default apiClient;