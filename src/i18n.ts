import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
} from './i18n/languages';

const syncDocumentLanguage = (language: string) => {
  const normalized = language.split('-')[0];
  document.documentElement.lang = isSupportedLanguage(normalized)
    ? LANGUAGES[normalized].htmlLang
    : LANGUAGES[DEFAULT_LANGUAGE].htmlLang;
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: 'common',
    ns: ['common'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })
  .then(() => syncDocumentLanguage(i18n.resolvedLanguage ?? DEFAULT_LANGUAGE));

i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
