export type LanguageType = 'en' | 'fil';

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}
