import type { NavigationItem } from '../types';

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Saan Ako Lalapit?', href: '/community-tools/saan-ako-lalapit' },
      { label: 'Government Offices', href: '/government-offices' },
    ],
  },
  {
    label: 'Today',
    href: '/today',
    children: [
      { label: 'City Monitor', href: '/city-monitor' },
      { label: 'Civic Briefs', href: '/briefs' },
      { label: 'Live Makati', href: '/live' },
      { label: 'Makati in the News', href: '/news' },
      { label: 'Makati Calendar', href: '/calendar' },
      { label: 'Hotlines', href: '/hotlines' },
    ],
  },
  {
    label: 'City',
    href: '/government',
    children: [
      { label: 'Elections & Voting', href: '/elections' },
      { label: 'Makati Statistics', href: '/statistics' },
      { label: 'Reports & Insights', href: '/reports' },
      { label: 'Legislation', href: '/legislation' },
      { label: 'History of Makati', href: '/history' },
    ],
  },
  { label: 'Barangays', href: '/barangays' },
  {
    label: 'Accountability',
    href: '/accountability',
    children: [
      { label: 'Projects & Budget', href: '/projects-budget' },
      { label: 'Procurement Tracker', href: '/accountability?type=project' },
      { label: 'Audit & Follow-through', href: '/accountability?type=audit' },
      { label: 'Public Commitments', href: '/accountability?type=commitment' },
      { label: 'Public Records', href: '/records' },
      { label: 'Integrity & Public Interest', href: '/integrity' },
    ],
  },
  {
    label: 'Participate',
    href: '/participate',
    children: [
      { label: 'Civic Map', href: '/civic-map' },
      { label: 'Civic Map Reports', href: '/civic-map/reports' },
      {
        label: 'Propose Something',
        href: '/get-involved?type=proposal#submission',
      },
      {
        label: 'Share a Public Source',
        href: '/get-involved?type=source#submission',
      },
      {
        label: 'Report a Correction',
        href: '/get-involved?type=correction#submission',
      },
    ],
  },
  {
    label: 'Explore Makati',
    href: '/visit',
    children: [
      { label: 'Areas & Districts', href: '/estates' },
      { label: 'Getting Around', href: '/mobility' },
      { label: 'Cinemas', href: '/cinemas' },
      { label: 'Heritage & Culture', href: '/heritage' },
    ],
  },
];

export const footerNavigation = {
  mainSections: [
    {
      title: 'Get things done',
      links: [
        { label: 'Services', href: '/services' },
        { label: 'Saan Ako Lalapit?', href: '/community-tools/saan-ako-lalapit' },
        { label: 'Government Offices', href: '/government-offices' },
        { label: 'Today in Makati', href: '/today' },
        { label: 'Hotlines', href: '/hotlines' },
        { label: 'Search BetterMakati', href: '/search' },
      ],
    },
    {
      title: 'Understand Makati',
      links: [
        { label: 'Government', href: '/government' },
        { label: 'Barangays', href: '/barangays' },
        { label: 'Accountability', href: '/accountability' },
        { label: 'Projects & Budget', href: '/projects-budget' },
        { label: 'Public Records', href: '/records' },
        { label: 'Reports & Insights', href: '/reports' },
      ],
    },
    {
      title: 'BetterMakati',
      links: [
        { label: 'Participate', href: '/participate' },
        { label: 'Get Involved', href: '/get-involved' },
        { label: 'Contact', href: '/contact' },
        { label: 'Community Tools', href: '/community-tools' },
        { label: 'Coverage & limitations', href: '/status' },
        { label: 'About BetterMakati', href: '/about' },
      ],
    },
  ],
  ecosystemLinks: [
    {
      label: 'Official Makati City Portal',
      href: 'https://www.makati.gov.ph/',
    },
    {
      label: 'National services — BetterGov',
      href: 'https://bettergov.ph/services',
    },
    {
      label: 'Other LGUs — BetterLGU',
      href: 'https://lgu.bettergov.ph/',
    },
  ],
};
