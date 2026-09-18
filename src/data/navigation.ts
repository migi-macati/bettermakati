import type { NavigationItem } from '../types';

export const mainNavigation: NavigationItem[] = [
  { label: 'Services', href: '/services' },
  {
    label: 'Government',
    href: '/government',
    children: [
      { label: 'Makati Statistics', href: '/statistics' },
      { label: 'Legislation', href: '/legislation' },
      { label: 'News & Events', href: '/news' },
    ],
  },
  { label: 'Barangays', href: '/barangays' },
  {
    label: 'Projects & Budget',
    href: '/projects-budget',
    children: [
      { label: 'Budget & Disclosures', href: '/projects-budget#budget' },
      { label: 'Project Tracker', href: '/projects-budget#projects' },
      { label: 'Procurement', href: '/projects-budget#procurement' },
      { label: 'Audit Reports', href: '/projects-budget#audit' },
    ],
  },
  {
    label: 'Community Tools',
    href: '/community-tools',
    children: [
      { label: 'Saan Ako Lalapit?', href: '/community-tools/saan-ako-lalapit' },
      { label: 'Project Tracker', href: '/projects-budget#projects' },
    ],
  },
  {
    label: 'Get Involved',
    href: '/get-involved',
    children: [
      { label: 'Suggest an Idea', href: '/get-involved?type=idea#submission' },
      { label: 'Share Data or a Source', href: '/get-involved?type=source#submission' },
      { label: 'Report a Correction', href: '/get-involved?type=correction#submission' },
      { label: 'Volunteer', href: '/get-involved?type=volunteer#submission' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export const footerNavigation = {
  mainSections: [
    {
      title: 'Explore',
      links: [
        { label: 'Services', href: '/services' },
        { label: 'Saan Ako Lalapit?', href: '/community-tools/saan-ako-lalapit' },
        { label: 'Government', href: '/government' },
        { label: 'Barangays', href: '/barangays' },
        { label: 'Projects & Budget', href: '/projects-budget' },
        { label: 'Community Tools', href: '/community-tools' },
      ],
    },
    {
      title: 'Participate',
      links: [
        { label: 'Get Involved', href: '/get-involved' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'BetterMakati',
      links: [
        { label: 'About', href: '/about' },
        { label: 'GitHub', href: 'https://github.com/migi-macati/bettermakati' },
        { label: 'BetterLGU Directory', href: 'https://lgu.bettergov.ph/' },
        { label: 'Official Makati Portal', href: 'https://www.makati.gov.ph/' },
      ],
    },
  ],
};
