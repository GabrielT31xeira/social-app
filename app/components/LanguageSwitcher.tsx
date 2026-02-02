import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render placeholder on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded transition-colors duration-300"
        aria-label="Toggle language"
      >
        <span className="text-sm font-semibold">🌐</span>
      </button>
    );
  }

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'pt-BR' ? 'en' : 'pt-BR';
    i18n.changeLanguage(newLanguage);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition-colors duration-300"
      aria-label="Toggle language"
    >
      <span className="text-sm font-semibold">{i18n.language === 'pt-BR' ? '🇧🇷 PT' : '🇺🇸 EN'}</span>
    </button>
  );
}
