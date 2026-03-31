import type { User } from "~/features/auth/types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export interface SessionSnapshot {
  token: string | null;
  user: User | null;
}

type SessionListener = (session: SessionSnapshot) => void;

const sessionListeners = new Set<SessionListener>();

function isBrowser() {
  return typeof window !== "undefined";
}

function readStoredUser(): User | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? (JSON.parse(user) as User) : null;
  } catch {
    return null;
  }
}

function notifySessionListeners() {
  const snapshot = getStoredSession();

  sessionListeners.forEach((listener) => {
    listener(snapshot);
  });
}

export function getStoredToken() {
  if (!isBrowser()) {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredSession(): SessionSnapshot {
  return {
    token: getStoredToken(),
    user: readStoredUser(),
  };
}

export function storeSession(token: string, user: User) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifySessionListeners();
}

export function clearSession() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifySessionListeners();
}

export function updateStoredUser(user: User) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifySessionListeners();
}

export function getStoredUser(): User | null {
  return readStoredUser();
}

export function subscribeToSessionChanges(listener: SessionListener) {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}
