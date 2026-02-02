import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // On mount, sync state with DOM
    const hasDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(hasDarkClass);
    setMounted(true);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const newIsDark = !isDark;
    
    // Update DOM immediately
    if (newIsDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Update state
    setIsDark(newIsDark);
    
    // Persist to localStorage
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded opacity-50 cursor-not-allowed"
        aria-label="Toggle theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors duration-200 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-100"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? (
        <>
          <span className="sr-only">Switch to light</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM10 16a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0v-1.25A.75.75 0 0110 16zM4.22 4.22a.75.75 0 011.06 0l.884.884a.75.75 0 11-1.06 1.06L4.22 5.28a.75.75 0 010-1.06zM13.834 13.834a.75.75 0 011.06 0l.884.884a.75.75 0 11-1.06 1.06l-.884-.884a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75H4a.75.75 0 010 1.5H2.75A.75.75 0 012 10zM16 10a.75.75 0 01.75-.75H18a.75.75 0 010 1.5h-1.25A.75.75 0 0116 10zM4.22 15.78a.75.75 0 010-1.06l.884-.884a.75.75 0 111.06 1.06l-.884.884a.75.75 0 01-1.06 0zM13.834 6.166a.75.75 0 010-1.06l.884-.884a.75.75 0 111.06 1.06l-.884.884a.75.75 0 01-1.06 0zM10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
          </svg>
        </>
      ) : (
        <>
          <span className="sr-only">Switch to dark</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
          </svg>
        </>
      )}
    </button>
  );
}
