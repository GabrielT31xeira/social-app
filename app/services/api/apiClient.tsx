import axios from "axios";
import { getI18n } from "react-i18next";
import { clearSession, getStoredToken } from "~/features/auth/auth-storage";

const DEFAULT_API_BASE_URL = "http://localhost:84/api";

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

const apiClient = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL),
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const lang = getI18n().language;
  config.headers["Accept-Language"] = lang;
  return config;
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
    }

    return Promise.reject(error);
  },
);

export default apiClient;
