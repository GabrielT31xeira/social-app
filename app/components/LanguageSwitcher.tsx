import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getStoredLanguage, setStoredLanguage } from "~/shared/preferences";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        disabled
        className="rounded bg-indigo-600 px-4 py-2 font-medium text-white opacity-70"
        aria-label="Toggle language"
      >
        LANG
      </button>
    );
  }

  const currentLanguage = i18n.language === "pt-BR" ? "pt-BR" : "en";

  const toggleLanguage = () => {
    const nextLanguage = currentLanguage === "pt-BR" ? "en" : "pt-BR";
    void i18n.changeLanguage(nextLanguage);
    setStoredLanguage(nextLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="rounded bg-indigo-600 px-4 py-2 font-medium text-white transition-colors duration-300 hover:bg-indigo-700"
      aria-label="Toggle language"
    >
      {getStoredLanguage() === "pt-BR" ? "PT" : "EN"}
    </button>
  );
}
