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
  { label: 'Government', href: '/government' },
  { label: 'Barangays', href: '/barangays' },
  { label: 'Transparency', href: '/transparency' },
  { label: 'Hotlines', href: '/hotlines' },
];

export const footerNavigation = {
  mainSections: [
    {
      title: 'Explore',
      links: [
        { label: 'Services', href: '/services' },
        { label: 'Government', href: '/government' },
        { label: 'Barangays', href: '/barangays' },
        { label: 'Transparency', href: '/transparency' },
        { label: 'Hotlines', href: '/hotlines' },
      ],
    },
    {
      title: 'BetterMakati',
      links: [
        { label: 'About & Sources', href: '/about' },
        { label: 'GitHub', href: 'https://github.com/migi-macati/bettermakati' },
        { label: 'Report a correction', href: 'https://github.com/migi-macati/bettermakati/issues' },
      ],
    },
    {
      title: 'Official sources',
      links: [
        { label: 'Makati City Web Portal', href: 'https://www.makati.gov.ph/' },
        { label: 'Gov.ph', href: 'https://www.gov.ph/' },
        { label: 'PSA PSGC', href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000' },
        { label: 'BetterLGU Directory', href: 'https://lgu.bettergov.ph/' },
      ],
    },
  ],
};
