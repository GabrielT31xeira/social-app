import axios from "axios";
import type { ApiError } from "~/services/api/responses";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isValidationErrors(
  value: unknown,
): value is Record<string, string[]> | string {
  if (typeof value === "string") {
    return true;
  }

  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(
    (fieldErrors) =>
      Array.isArray(fieldErrors) &&
      fieldErrors.every((fieldError) => typeof fieldError === "string"),
  );
}

export function isApiError(value: unknown): value is ApiError {
  if (!isRecord(value)) {
    return false;
  }

  return value.success === false && typeof value.message === "string";
}

export function normalizeApiError(error: unknown, fallbackMessage: string): ApiError {
  if (axios.isAxiosError(error)) {
    const apiPayload = error.response?.data;

    if (isApiError(apiPayload)) {
      return {
        ...apiPayload,
        message: apiPayload.message || fallbackMessage,
      };
    }

    if (isRecord(apiPayload)) {
      return {
        success: false,
        message:
          typeof apiPayload.message === "string"
            ? apiPayload.message
            : error.message || fallbackMessage,
        errors: isValidationErrors(apiPayload.errors) ? apiPayload.errors : undefined,
      };
    }

    return {
      success: false,
      message: error.message || fallbackMessage,
    };
  }

  if (isApiError(error)) {
    return {
      ...error,
      message: error.message || fallbackMessage,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message || fallbackMessage,
    };
  }

  return {
    success: false,
    message: fallbackMessage,
  };
}
