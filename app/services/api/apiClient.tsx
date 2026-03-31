import axios, { type InternalAxiosRequestConfig } from "axios";
import { getI18n } from "react-i18next";
import { clearSession, getStoredToken } from "~/features/auth/auth-storage";

const DEFAULT_API_BASE_URL = "http://localhost:84/api";
const DEFAULT_CSRF_COOKIE_NAME = "XSRF-TOKEN";
const DEFAULT_CSRF_HEADER_NAME = "X-XSRF-TOKEN";
const DEFAULT_CSRF_BOOTSTRAP_PATH = "/sanctum/csrf-cookie";
const CSRF_ERROR_MESSAGE = "CSRF token mismatch.";
const MUTATING_METHODS = new Set(["post", "put", "patch", "delete"]);

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retriedAfterCsrf?: boolean;
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function isLaravelCsrfEnabled() {
  return import.meta.env.VITE_LARAVEL_CSRF_ENABLED !== "false";
}

function getApiBaseUrl() {
  return normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL);
}

function getCsrfBootstrapUrl() {
  const configuredUrl = import.meta.env.VITE_LARAVEL_CSRF_URL;
  const apiBaseUrl = new URL(getApiBaseUrl(), window.location.origin);

  if (configuredUrl) {
    return new URL(configuredUrl, apiBaseUrl.origin).toString();
  }

  return new URL(DEFAULT_CSRF_BOOTSTRAP_PATH, apiBaseUrl.origin).toString();
}

function readCookie(name: string) {
  if (!isBrowser()) {
    return null;
  }

  const encodedName = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(encodedName));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(encodedName.length));
}

function getCsrfToken() {
  return readCookie(DEFAULT_CSRF_COOKIE_NAME);
}

function shouldAttachCsrfToken(config: RetryableRequestConfig) {
  if (!isBrowser() || !isLaravelCsrfEnabled()) {
    return false;
  }

  const method = config.method?.toLowerCase() ?? "get";
  return MUTATING_METHODS.has(method);
}

function attachCsrfToken<T extends RetryableRequestConfig>(config: T): T {
  if (!shouldAttachCsrfToken(config)) {
    return config;
  }

  const csrfToken = getCsrfToken();

  if (!csrfToken) {
    return config;
  }

  config.headers ??= {};
  config.headers[DEFAULT_CSRF_HEADER_NAME] = csrfToken;
  return config;
}

let csrfBootstrapPromise: Promise<void> | null = null;

async function ensureLaravelCsrfCookie(forceRefresh = false) {
  if (!isBrowser() || !isLaravelCsrfEnabled()) {
    return;
  }

  if (!forceRefresh && getCsrfToken()) {
    return;
  }

  if (csrfBootstrapPromise && !forceRefresh) {
    return csrfBootstrapPromise;
  }

  const bootstrapPromise = axios
    .get(getCsrfBootstrapUrl(), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then(() => undefined)
    .finally(() => {
      if (csrfBootstrapPromise === bootstrapPromise) {
        csrfBootstrapPromise = null;
      }
    });

  csrfBootstrapPromise = bootstrapPromise;
  return bootstrapPromise;
}

function isCsrfMismatchError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  if (error.response?.status === 419) {
    return true;
  }

  const message = error.response?.data?.message;
  return typeof message === "string" && message.includes(CSRF_ERROR_MESSAGE);
}

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
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

    return attachCsrfToken(config);
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestConfig = error.config as RetryableRequestConfig | undefined;

    if (
      requestConfig &&
      !requestConfig._retriedAfterCsrf &&
      isCsrfMismatchError(error) &&
      shouldAttachCsrfToken(requestConfig)
    ) {
      requestConfig._retriedAfterCsrf = true;
      await ensureLaravelCsrfCookie(true);
      attachCsrfToken(requestConfig);
      return apiClient.request(requestConfig);
    }

    if (error.response?.status === 401) {
      clearSession();
    }

    return Promise.reject(error);
  },
);

export default apiClient;
