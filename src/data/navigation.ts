import type { NavigationItem } from '../types';
import { serviceCategories as servicesData } from './yamlLoader';

interface Category {
  category: string;
  slug: string;
}

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Services',
    href: '/services',
    children: (servicesData.categories as Category[]).map(category => ({
      label: category.category,
      href: `/services/${category.slug}`,
    })),
  },
  {
    label: 'Government',
    href: '/government',
  },
];

export const footerNavigation = {
  mainSections: [
    {
      title: 'BetterMakati',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Government', href: '/government' },
      ],
    },
    {
      title: 'Project',
      links: [
        { label: 'GitHub', href: 'https://github.com/migi-macati/bettermakati' },
        { label: 'BetterGov', href: 'https://bettergov.ph' },
        { label: 'BetterLGU Directory', href: 'https://lgu.bettergov.ph' },
      ],
    },
    {
      title: 'Official sources',
      links: [
        { label: 'Gov.ph', href: 'https://www.gov.ph' },
        { label: 'Official Gazette', href: 'https://www.officialgazette.gov.ph' },
        { label: 'Open Data Philippines', href: 'https://data.gov.ph' },
      ],
    },
  ],
};
