import type { NavigationItem } from '../types';

export const mainNavigation: NavigationItem[] = [
  { label: 'Services', href: '/services' },
  {
    label: 'Today',
    href: '/today',
    children: [
      { label: 'Today in Makati', href: '/today' },
      { label: 'City Monitor', href: '/city-monitor' },
      { label: 'Civic Briefs', href: '/briefs' },
      { label: 'Live Makati', href: '/live' },
      { label: 'Makati in the News', href: '/news' },
      { label: 'What’s On', href: '/whats-on' },
      { label: 'Hotlines', href: '/hotlines' },
    ],
  },
  {
    label: 'City',
    href: '/government',
    children: [
      { label: 'Government', href: '/government' },
      { label: 'Barangays', href: '/barangays' },
      { label: 'Elections & Voting', href: '/elections' },
      { label: 'Makati Statistics', href: '/statistics' },
      { label: 'Legislation', href: '/legislation' },
      { label: 'Estates & Associations', href: '/estates' },
      { label: 'History of Makati', href: '/history' },
    ],
  },
  {
    label: 'Accountability',
    href: '/accountability',
    children: [
      { label: 'Accountability Ledger', href: '/accountability' },
      { label: 'Projects & Budget', href: '/projects-budget' },
      { label: 'Project Tracker', href: '/projects-budget#projects' },
      { label: 'Procurement', href: '/projects-budget#procurement' },
      { label: 'Audit Reports', href: '/projects-budget#audit' },
      { label: 'Public Records', href: '/records' },
      { label: 'Integrity & Public Interest', href: '/integrity' },
      { label: 'Open Government Audit', href: '/open-government' },
      { label: 'BetterMakati Status', href: '/status' },
    ],
  },
  {
    label: 'Participate',
    href: '/participate',
    children: [
      { label: 'Participation Hub', href: '/participate' },
      { label: 'Civic Map', href: '/civic-map' },
      { label: 'Saan Ako Lalapit?', href: '/community-tools/saan-ako-lalapit' },
      { label: 'Community Tools', href: '/community-tools' },
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
];

export const footerNavigation = {
  mainSections: [
    {
      title: 'Use Makati',
      links: [
        { label: 'Services', href: '/services' },
        { label: 'Today in Makati', href: '/today' },
        { label: 'City Monitor', href: '/city-monitor' },
        { label: 'Civic Briefs', href: '/briefs' },
        { label: 'Live Makati', href: '/live' },
        { label: 'Visit Makati', href: '/visit' },
        { label: 'Getting Around', href: '/mobility' },
        { label: 'Hotlines', href: '/hotlines' },
      ],
    },
    {
      title: 'Understand & participate',
      links: [
        { label: 'Government', href: '/government' },
        { label: 'City Monitor', href: '/city-monitor' },
        { label: 'Civic Briefs', href: '/briefs' },
        { label: 'Barangays', href: '/barangays' },
        { label: 'Elections & Voting', href: '/elections' },
        { label: 'Accountability Ledger', href: '/accountability' },
        { label: 'Projects & Budget', href: '/projects-budget' },
        { label: 'Public Records', href: '/records' },
        { label: 'Integrity & Public Interest', href: '/integrity' },
        { label: 'Open Government', href: '/open-government' },
        { label: 'Participate', href: '/participate' },
        { label: 'Civic Map', href: '/civic-map' },
      ],
    },
    {
      title: 'BetterMakati',
      links: [
        { label: 'Community Tools', href: '/community-tools' },
        { label: 'Get Involved', href: '/get-involved' },
        { label: 'BetterMakati Status', href: '/status' },
        { label: 'About', href: '/about' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        {
          label: 'GitHub',
          href: 'https://github.com/migi-macati/bettermakati',
        },
        { label: 'Official Makati Portal', href: 'https://www.makati.gov.ph/' },
      ],
    },
  ],
};
