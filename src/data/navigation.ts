import type { NavigationItem } from '../types';

export const mainNavigation: NavigationItem[] = [
  {
    id: 'services',
    labelKey: 'navigation.services',
    href: '/services',
    children: [
      { id: 'where-to-go', labelKey: 'navigation.whereToGo', href: '/community-tools/saan-ako-lalapit' },
      { id: 'government-offices', labelKey: 'navigation.governmentOffices', href: '/government-offices' },
    ],
  },
  {
    id: 'today',
    labelKey: 'navigation.today',
    href: '/today',
    children: [
      { id: 'city-monitor', labelKey: 'navigation.cityMonitor', href: '/city-monitor' },
      { id: 'civic-briefs', labelKey: 'navigation.civicBriefs', href: '/briefs' },
      { id: 'live-makati', labelKey: 'navigation.liveMakati', href: '/live' },
      { id: 'news', labelKey: 'navigation.news', href: '/news' },
      { id: 'calendar', labelKey: 'navigation.calendar', href: '/calendar' },
      { id: 'hotlines', labelKey: 'navigation.hotlines', href: '/hotlines' },
    ],
  },
  {
    id: 'city',
    labelKey: 'navigation.city',
    href: '/government',
    children: [
      { id: 'elections', labelKey: 'navigation.elections', href: '/elections' },
      { id: 'statistics', labelKey: 'navigation.statistics', href: '/statistics' },
      { id: 'reports', labelKey: 'navigation.reports', href: '/reports' },
      { id: 'legislation', labelKey: 'navigation.legislation', href: '/legislation' },
      { id: 'history', labelKey: 'navigation.history', href: '/history' },
    ],
  },
  { id: 'barangays', labelKey: 'navigation.barangays', href: '/barangays' },
  {
    id: 'accountability',
    labelKey: 'navigation.accountability',
    href: '/accountability',
    children: [
      { id: 'projects-budget', labelKey: 'navigation.projectsBudget', href: '/projects-budget' },
      { id: 'procurement', labelKey: 'navigation.procurement', href: '/accountability?type=project' },
      { id: 'audit', labelKey: 'navigation.audit', href: '/accountability?type=audit' },
      { id: 'commitments', labelKey: 'navigation.commitments', href: '/accountability?type=commitment' },
      { id: 'records', labelKey: 'navigation.records', href: '/records' },
      { id: 'integrity', labelKey: 'navigation.integrity', href: '/integrity' },
    ],
  },
  {
    id: 'participate',
    labelKey: 'navigation.participate',
    href: '/participate',
    children: [
      { id: 'civic-map', labelKey: 'navigation.civicMap', href: '/civic-map' },
      { id: 'civic-map-reports', labelKey: 'navigation.civicMapReports', href: '/civic-map/reports' },
      { id: 'propose', labelKey: 'navigation.propose', href: '/get-involved?type=proposal#submission' },
      { id: 'share-source', labelKey: 'navigation.shareSource', href: '/get-involved?type=source#submission' },
      { id: 'correction', labelKey: 'navigation.correction', href: '/get-involved?type=correction#submission' },
    ],
  },
  {
    id: 'explore',
    labelKey: 'navigation.explore',
    href: '/visit',
    children: [
      { id: 'areas', labelKey: 'navigation.areas', href: '/estates' },
      { id: 'mobility', labelKey: 'navigation.mobility', href: '/mobility' },
      { id: 'cinemas', labelKey: 'navigation.cinemas', href: '/cinemas' },
      { id: 'heritage', labelKey: 'navigation.heritage', href: '/heritage' },
    ],
  },
];

export const footerNavigation = {
  mainSections: [
    {
      id: 'tasks',
      titleKey: 'footer.sections.tasks',
      links: [
        { id: 'services', labelKey: 'navigation.services', href: '/services' },
        { id: 'where-to-go', labelKey: 'navigation.whereToGo', href: '/community-tools/saan-ako-lalapit' },
        { id: 'government-offices', labelKey: 'navigation.governmentOffices', href: '/government-offices' },
        { id: 'today', labelKey: 'footer.links.today', href: '/today' },
        { id: 'hotlines', labelKey: 'navigation.hotlines', href: '/hotlines' },
        { id: 'search', labelKey: 'footer.links.search', href: '/search' },
      ],
    },
    {
      id: 'understand',
      titleKey: 'footer.sections.understand',
      links: [
        { id: 'government', labelKey: 'footer.links.government', href: '/government' },
        { id: 'barangays', labelKey: 'navigation.barangays', href: '/barangays' },
        { id: 'accountability', labelKey: 'navigation.accountability', href: '/accountability' },
        { id: 'projects-budget', labelKey: 'navigation.projectsBudget', href: '/projects-budget' },
        { id: 'records', labelKey: 'navigation.records', href: '/records' },
        { id: 'reports', labelKey: 'navigation.reports', href: '/reports' },
      ],
    },
    {
      id: 'bettermakati',
      titleKey: 'footer.sections.bettermakati',
      links: [
        { id: 'participate', labelKey: 'navigation.participate', href: '/participate' },
        { id: 'get-involved', labelKey: 'footer.links.getInvolved', href: '/get-involved' },
        { id: 'contact', labelKey: 'footer.links.contact', href: '/contact' },
        { id: 'community-tools', labelKey: 'footer.links.communityTools', href: '/community-tools' },
        { id: 'coverage', labelKey: 'footer.links.coverage', href: '/status' },
        { id: 'about', labelKey: 'footer.links.about', href: '/about' },
      ],
    },
  ],
  ecosystemLinks: [
    { id: 'official', labelKey: 'footer.ecosystem.official', href: 'https://www.makati.gov.ph/' },
    { id: 'bettergov', labelKey: 'footer.ecosystem.bettergov', href: 'https://bettergov.ph/services' },
    { id: 'betterlgu', labelKey: 'footer.ecosystem.betterlgu', href: 'https://lgu.bettergov.ph/' },
  ],
};
