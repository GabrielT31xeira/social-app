import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from '../locales/pt-br.json';
import en from '../locales/en.json';

const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
};

// Pega o idioma salvo apenas no navegador
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
