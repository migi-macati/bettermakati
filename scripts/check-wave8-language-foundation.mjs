import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const languages = read('src/i18n/languages.ts');
const i18n = read('src/i18n.ts');
const switcher = read('src/components/LanguageSwitcher.tsx');
const navbar = read('src/components/layout/Navbar.tsx');
const policy = read('docs/w8-1-language-foundation.md');

const fail = message => {
  console.error('Wave 8 language foundation check failed: ' + message);
  process.exit(1);
};

if (!languages.includes("export type LanguageType = 'en' | 'fil'")) {
  fail('supported language type must be exactly en and fil');
}

for (const staleCode of ['ceb', 'ilo', 'hil', 'war', 'pam', 'bcl', 'pag', 'mag', 'tsg', 'mdh']) {
  if (languages.includes("'" + staleCode + "'")) fail('unsupported language code remains: ' + staleCode);
}

if (!i18n.includes('supportedLngs: SUPPORTED_LANGUAGES')) fail('i18next supported languages are not constrained');
if (!i18n.includes("order: ['localStorage', 'navigator', 'htmlTag']")) fail('language preference detection/persistence contract changed');
if (!i18n.includes("caches: ['localStorage']")) fail('language choice must persist across visits');
if (!i18n.includes("lookupLocalStorage: 'i18nextLng'")) fail('persistent language storage key changed');
if (!i18n.includes('document.documentElement.lang')) fail('document language is not synchronized');
if (!switcher.includes('aria-pressed={selected}')) fail('language switcher must expose selected state');
if (!switcher.includes('{language.shortLabel}')) fail('language switcher must use ENG/FIL short labels');
if ((navbar.match(/<LanguageSwitcher \/>/g) ?? []).length < 3) fail('language switcher is not available across desktop and mobile shell states');
if (!policy.includes('exactly two interface languages')) fail('ENG/FIL product scope is not documented');
if (!policy.includes('budget') || !policy.includes('jeep') || !policy.includes('record')) fail('Filipino editorial policy examples are missing');

for (const locale of ['public/locales/en/common.json', 'public/locales/fil/common.json']) {
  if (!fs.existsSync(locale)) fail('missing locale: ' + locale);
  JSON.parse(read(locale));
}

console.log('Wave 8 language foundation check passed: ENG/FIL only.');
