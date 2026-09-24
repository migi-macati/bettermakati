export type LiveSourceCategory = 'weather' | 'city' | 'utilities' | 'hazards' | 'district';
export type LiveSourceAuthority = 'official-government' | 'utility-provider' | 'district-source';
export type LiveSourceCheckMode = 'city-monitor' | 'direct-link';

export interface LiveMakatiSource {
  id: string;
  title: string;
  description: string;
  href: string;
  category: LiveSourceCategory;
  authority: LiveSourceAuthority;
  checkMode: LiveSourceCheckMode;
  monitorSourceId?: string;
}

export const liveMakatiReviewed = '24 September 2026';

export const liveMakatiSources: LiveMakatiSource[] = [
  {
    id: 'pagasa-ncr',
    title: 'PAGASA NCR',
    description: 'Forecasts, thunderstorm advisories and rainfall warnings for Metro Manila.',
    href: 'https://www.pagasa.dost.gov.ph/regional-forecast/ncrprsd',
    category: 'weather',
    authority: 'official-government',
    checkMode: 'direct-link',
  },
  {
    id: 'makati-news',
    title: 'Makati City News',
    description: 'Official city announcements and notices.',
    href: 'https://www.makati.gov.ph/content/news',
    category: 'city',
    authority: 'official-government',
    checkMode: 'city-monitor',
    monitorSourceId: 'makati-news',
  },
  {
    id: 'makati-events',
    title: 'Makati City Events',
    description: 'Official city event listings and public activities.',
    href: 'https://www.makati.gov.ph/content/events',
    category: 'city',
    authority: 'official-government',
    checkMode: 'city-monitor',
    monitorSourceId: 'makati-events',
  },
  {
    id: 'macea-circulars',
    title: 'MACEA Circulars',
    description: 'CBD estate circulars, road works and member advisories.',
    href: 'https://macea.com.ph/memorandum-circular/',
    category: 'district',
    authority: 'district-source',
    checkMode: 'direct-link',
  },
  {
    id: 'meralco-outages',
    title: 'Meralco Outages',
    description: 'View, report and track power interruptions through the utility provider.',
    href: 'https://www.meralco.com.ph/residential/help-support/frequently-asked-questions/outages-and-brownouts',
    category: 'utilities',
    authority: 'utility-provider',
    checkMode: 'direct-link',
  },
  {
    id: 'manila-water',
    title: 'Manila Water',
    description: 'Service advisories, bills and water-service concerns.',
    href: 'https://my.manilawater.app/',
    category: 'utilities',
    authority: 'utility-provider',
    checkMode: 'direct-link',
  },
  {
    id: 'phivolcs-earthquakes',
    title: 'PHIVOLCS',
    description: 'Latest official earthquake information.',
    href: 'https://earthquake.phivolcs.dost.gov.ph/',
    category: 'hazards',
    authority: 'official-government',
    checkMode: 'direct-link',
  },
];

export const liveSourceAuthorityLabel: Record<LiveSourceAuthority, string> = {
  'official-government': 'Official government',
  'utility-provider': 'Utility provider',
  'district-source': 'District source',
};

export const liveSourceCategoryLabel: Record<LiveSourceCategory, string> = {
  weather: 'Weather',
  city: 'City advisories',
  utilities: 'Utilities',
  hazards: 'Hazards',
  district: 'District advisories',
};
