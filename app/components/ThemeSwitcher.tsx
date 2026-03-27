import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, setStoredTheme } from "~/shared/preferences";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = getStoredTheme();
    applyTheme(savedTheme);
    setIsDark(savedTheme === "dark");
    setMounted(true);
  }, []);

  const toggle = () => {
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
    setIsDark(nextTheme === "dark");
  };

  if (!mounted) {
    return (
      <button
        disabled
        className="cursor-not-allowed rounded bg-gray-800 px-3 py-2 text-white opacity-50"
        aria-label="Toggle theme"
      >
        Theme
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="rounded bg-gray-800 px-3 py-2 text-white transition-colors duration-200 hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-100"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
