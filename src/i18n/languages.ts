export type LanguageType = 'en' | 'fil';

export interface LanguageInfo {
  code: LanguageType;
  name: string;
  shortLabel: string;
  htmlLang: string;
}

export const LANGUAGES: Record<LanguageType, LanguageInfo> = {
  en: { code: 'en', name: 'English', shortLabel: 'ENG', htmlLang: 'en' },
  fil: { code: 'fil', name: 'Filipino', shortLabel: 'FIL', htmlLang: 'fil' },
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES) as LanguageType[];
export const DEFAULT_LANGUAGE: LanguageType = 'en';

export const isSupportedLanguage = (value: string): value is LanguageType =>
  SUPPORTED_LANGUAGES.includes(value as LanguageType);
