import type { ApiError } from "~/services/api/responses";

export function getFirstApiError(error: ApiError, fallback: string) {
  if (error.errors && typeof error.errors === "object") {
    return Object.values(error.errors).flat()[0] || error.message || fallback;
  }

  return error.message || fallback;
}

export function getAllApiErrors(error: ApiError) {
  if (error.errors && typeof error.errors === "object") {
    return Object.values(error.errors).flat().filter(Boolean);
  }

  return error.message ? [error.message] : [];
}

