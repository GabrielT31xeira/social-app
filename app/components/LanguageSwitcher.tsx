import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "~/shared/components/Icons";
import { getStoredLanguage, setStoredLanguage } from "~/shared/preferences";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        disabled
        className="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 font-medium text-white opacity-70"
        aria-label={t("language.toggleAria")}
      >
        <Icon name="languages" className="h-4 w-4" />
        {t("language.loading")}
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
      className="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 font-medium text-white transition-colors duration-300 hover:bg-indigo-700"
      aria-label={t("language.toggleAria")}
      title={t("language.toggleTitle")}
    >
      <Icon name="languages" className="h-4 w-4" />
      {getStoredLanguage() === "pt-BR" ? t("language.pt") : t("language.en")}
    </button>
  );
}
