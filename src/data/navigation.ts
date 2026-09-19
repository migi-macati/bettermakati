import type { NavigationItem } from '../types';

export const mainNavigation: NavigationItem[] = [
  { label: 'Services', href: '/services' },
  {
    label: 'Today',
    href: '/today',
    children: [
      { label: 'Today in Makati', href: '/today' },
      { label: 'Live Makati', href: '/live' },
      { label: 'What’s On', href: '/whats-on' },
      { label: 'Makati in the News', href: '/news' },
    ],
  },
  {
    label: 'Visit Makati',
    href: '/visit',
    children: [
      { label: 'Places to Go', href: '/visit' },
      { label: 'Getting Around', href: '/mobility' },
      { label: 'Cinemas', href: '/cinemas' },
      { label: 'Parking', href: '/parking' },
      { label: 'What’s On', href: '/whats-on' },
      { label: 'Heritage & Culture', href: '/heritage' },
      { label: 'History of Makati', href: '/history' },
    ],
  },
  {
    label: 'City',
    href: '/government',
    children: [
      { label: 'Government', href: '/government' },
      { label: 'Barangays', href: '/barangays' },
      { label: 'Elections & Voting', href: '/elections' },
      { label: 'Estates & Associations', href: '/estates' },
      { label: 'Makati Statistics', href: '/statistics' },
      { label: 'Legislation', href: '/legislation' },
      { label: 'Public Records', href: '/records' },
      { label: 'Accountability Ledger', href: '/accountability' },
    ],
  },
  {
    label: 'Accountability',
    href: '/accountability',
    children: [
      { label: 'Accountability Ledger', href: '/accountability' },
      { label: 'Projects & Budget', href: '/projects-budget' },
      { label: 'Public Records', href: '/records' },
      { label: 'Legislation', href: '/legislation' },
    ],
  },
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
    label: 'Participate',
    href: '/participate',
    children: [
      { label: 'Participation Hub', href: '/participate' },
      { label: 'Propose Something', href: '/get-involved?type=proposal#submission' },
      { label: 'Share a Public Source', href: '/get-involved?type=source#submission' },
      { label: 'Report a Correction', href: '/get-involved?type=correction#submission' },
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
        { label: 'Visit Makati', href: '/visit' },
        { label: 'Getting Around', href: '/mobility' },
        { label: 'Cinemas', href: '/cinemas' },
        { label: 'Parking', href: '/parking' },
        { label: 'What’s On', href: '/whats-on' },
        { label: 'Barangays', href: '/barangays' },
        { label: 'Elections & Voting', href: '/elections' },
        { label: 'Projects & Budget', href: '/projects-budget' },
        { label: 'Accountability Ledger', href: '/accountability' },
        { label: 'Public Records', href: '/records' },
      ],
    },
    {
      title: 'City',
      links: [
        { label: 'Government', href: '/government' },
        { label: 'Elections & Voting', href: '/elections' },
        { label: 'Estates & Associations', href: '/estates' },
        { label: 'Live Makati', href: '/live' },
        { label: 'Today in Makati', href: '/today' },
        { label: 'Community Tools', href: '/community-tools' },
        { label: 'Participate', href: '/participate' },
        { label: 'Get Involved', href: '/get-involved' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'BetterMakati',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'GitHub', href: 'https://github.com/migi-macati/bettermakati' },
        { label: 'Official Makati Portal', href: 'https://www.makati.gov.ph/' },
      ],
    },
  ],
};
