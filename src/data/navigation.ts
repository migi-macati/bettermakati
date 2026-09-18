import type { NavigationItem } from '../types';

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Community Tools',
    href: '/community-tools',
    children: [
      { label: 'Saan Ako Lalapit?', href: '/community-tools/saan-ako-lalapit' },
      { label: 'Barangay Hub', href: '/barangays' },
      { label: 'Budget & Public Records', href: '/projects-budget' },
      { label: 'Emergency Guide', href: '/hotlines' },
      { label: 'All Community Tools', href: '/community-tools' },
    ],
  },
  { label: 'Barangays', href: '/barangays' },
  {
    label: 'Projects & Budget',
    href: '/projects-budget',
    children: [
      { label: 'Budget & Disclosures', href: '/projects-budget' },
      { label: 'Transparency', href: '/transparency' },
      { label: 'Project Tracker', href: '/projects-budget#projects' },
    ],
  },
  { label: 'Services', href: '/services' },
  {
    label: 'City Information',
    href: '/government',
    children: [
      { label: 'Government & Officials', href: '/government' },
      { label: 'Makati Statistics', href: '/statistics' },
      { label: 'Legislation', href: '/legislation' },
      { label: 'News & Events', href: '/news' },
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
        { label: 'Community Tools', href: '/community-tools' },
        { label: 'Services', href: '/services' },
        { label: 'Barangays', href: '/barangays' },
        { label: 'Projects & Budget', href: '/projects-budget' },
        { label: 'City Information', href: '/government' },
        { label: 'Hotlines', href: '/hotlines' },
      ],
    },
    {
      title: 'Participate',
      links: [
        { label: 'Get Involved', href: '/get-involved' },
        { label: 'Suggest an Idea', href: '/get-involved?type=idea#submission' },
        { label: 'Share a Source', href: '/get-involved?type=source#submission' },
        { label: 'Report a Correction', href: '/get-involved?type=correction#submission' },
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
