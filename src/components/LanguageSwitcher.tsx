import { useTranslation } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
} from '../i18n/languages';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const resolved = (i18n.resolvedLanguage ?? i18n.language).split('-')[0];
  const current = isSupportedLanguage(resolved) ? resolved : DEFAULT_LANGUAGE;

  return (
    <div
      className="inline-flex min-h-11 items-center rounded-full border border-secondary-300 bg-secondary-50 p-1"
      role="group"
      aria-label={t('language.label')}
    >
      {SUPPORTED_LANGUAGES.map(code => {
        const language = LANGUAGES[code];
        const selected = current === code;

        return (
          <button
            key={code}
            type="button"
            onClick={() => void i18n.changeLanguage(code)}
            aria-pressed={selected}
            aria-label={t('language.use', { language: t(`language.${code === 'en' ? 'english' : 'filipino'}`) })}
            className={
              'inline-flex min-h-9 min-w-11 items-center justify-center rounded-full px-2.5 text-xs font-extrabold tracking-[0.08em] transition-colors ' +
              (selected
                ? 'bg-primary-800 text-white shadow-sm'
                : 'text-primary-900 hover:bg-secondary-100')
            }
          >
            {language.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
