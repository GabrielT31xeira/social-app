export const DEFAULT_LANGUAGE = "pt-BR";
export const DEFAULT_THEME = "dark";
export type ThemePreference = "dark" | "light";

const LANGUAGE_KEY = "language";
const THEME_KEY = "theme";

export function getStoredLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE;
}

export function setStoredLanguage(language: string) {
  localStorage.setItem(LANGUAGE_KEY, language);
}

export function getStoredTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const theme = localStorage.getItem(THEME_KEY);
  return theme === "light" ? "light" : DEFAULT_THEME;
}

export function setStoredTheme(theme: ThemePreference) {
  localStorage.setItem(THEME_KEY, theme);
}

export function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }

  root.classList.remove("dark");
}
