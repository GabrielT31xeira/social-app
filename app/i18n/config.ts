import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ptBR from "../locales/pt-br.json";
import { DEFAULT_LANGUAGE, getStoredLanguage } from "~/shared/preferences";

const resources = {
  "pt-BR": { translation: ptBR },
  en: { translation: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
