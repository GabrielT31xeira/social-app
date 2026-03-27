import type { User } from "~/features/auth/types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function storeSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? (JSON.parse(user) as User) : null;
  } catch {
    return null;
  }
}

