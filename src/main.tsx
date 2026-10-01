import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './fonts.css';
import './index.css';
import i18n, { i18nReady } from './i18n';
import { DEFAULT_LANGUAGE, LANGUAGES } from './i18n/languages';

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

void i18nReady
  .catch(() => {
    document.documentElement.lang = LANGUAGES[DEFAULT_LANGUAGE].htmlLang;
    if (i18n.language !== DEFAULT_LANGUAGE) {
      return i18n.changeLanguage(DEFAULT_LANGUAGE).catch(() => undefined);
    }
    return undefined;
  })
  .finally(renderApp);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => {
      // The site remains fully usable without offline support.
    });
  });
}
