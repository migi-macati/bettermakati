export type LanguageType = 'en' | 'fil';

export interface NavigationItem {
  id: string;
  labelKey: string;
  href: string;
  children?: NavigationItem[];
}
