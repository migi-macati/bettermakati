import { makatiHistory } from './makatiHistory';
import { barangays as barangayProfiles } from './barangays';
import { electedOfficials } from './electedOfficials';
import { serviceDirectory } from './serviceDirectory';
import { governmentServiceOffices } from './governmentServiceOffices';
import { civicAssets, civicAssetTypeLabels } from './civicMap';

export type SearchGroup =
  | 'Service'
  | 'Visit'
  | 'Government'
  | 'Barangay'
  | 'Record'
  | 'Tool'
  | 'Contact';

export interface SearchItem {
  title: string;
  group: SearchGroup;
  category: string;
  description: string;
  href: string;
  keywords: string;
  featured?: boolean;
}

const serviceItems: SearchItem[] = serviceDirectory.map(item => ({
  title: item.title,
  group: 'Service',
  category: item.category,
  description: item.description,
  href: '/services/guide/' + item.id,
  keywords: [
    item.keywords,
    item.agency,
    item.level,
    item.type,
  ].join(' '),
  featured: item.featured,
}));

const visitItems: SearchItem[] = [
  {
    title: 'Visit Makati',
    group: 'Visit',
    category: 'Visit',
    description: 'Places to go, food, markets, parks, shopping and culture.',
    href: '/visit',
    keywords:
      'visit tourist tourism attractions places restaurant cafe market park shopping nightlife',
    featured: true,
  },
  {
    title: 'Ayala Museum',
    group: 'Visit',
    category: 'Culture',
    description: 'Philippine history, art and archaeology.',
    href: '/visit',
    keywords: 'ayala museum culture art history gallery',
  },
  {
    title: 'Poblacion dining & nightlife',
    group: 'Visit',
    category: 'Food',
    description: 'Dining, cafés, bars and nightlife in Poblacion.',
    href: '/visit',
    keywords: 'poblacion food restaurant cafe bar nightlife eat drink',
  },
  {
    title: 'Salcedo Saturday Market',
    group: 'Visit',
    category: 'Food',
    description: 'Weekend food and market destination.',
    href: '/visit',
    keywords: 'salcedo saturday market food weekend',
  },
  {
    title: 'Legazpi Sunday Market',
    group: 'Visit',
    category: 'Food',
    description: 'Sunday food and market destination.',
    href: '/visit',
    keywords: 'legazpi sunday market food weekend',
  },
  {
    title: 'Ayala Triangle Gardens',
    group: 'Visit',
    category: 'Parks',
    description: 'Urban park in the Makati CBD.',
    href: '/visit',
    keywords: 'ayala triangle gardens park walking green space',
  },
  {
    title: 'Heritage & Culture',
    group: 'Visit',
    category: 'Heritage',
    description: 'Historical markers, churches, museums and cultural sites.',
    href: '/heritage',
    keywords: 'heritage culture historical sites church museum old makati',
    featured: true,
  },
  {
    title: 'Nuestra Señora de Gracia Church',
    group: 'Visit',
    category: 'Heritage',
    description:
      'Historic Augustinian church and monastery in Guadalupe Viejo.',
    href: '/heritage',
    keywords:
      'guadalupe church nuestra senora gracia monastery heritage historical',
  },
  {
    title: 'Sts. Peter and Paul Parish Church',
    group: 'Visit',
    category: 'Heritage',
    description: 'Historic San Pedro Macati church in Poblacion.',
    href: '/heritage',
    keywords:
      'saints peter paul sampiro san pedro macati poblacion heritage church',
  },
  {
    title: 'Nielson Tower',
    group: 'Visit',
    category: 'Heritage',
    description: 'Historic airport tower at Ayala Triangle.',
    href: '/heritage',
    keywords: 'nielson tower airport ayala triangle heritage aviation history',
  },
  {
    title: 'History of Makati',
    group: 'Visit',
    category: 'History',
    description: 'Timeline from San Pedro Macati to cityhood.',
    href: '/history',
    keywords: 'history timeline san pedro macati sampiro cityhood origin name',
    featured: true,
  },
  {
    title: 'Getting around Makati',
    group: 'Visit',
    category: 'Transport',
    description: 'Public transport, route planning and ride-hailing.',
    href: '/mobility',
    keywords:
      'transport commute mrt one ayala bus jeep uv express grab angkas joyride move it',
    featured: true,
  },
  {
    title: 'Cinemas in Makati',
    group: 'Visit',
    category: 'Entertainment',
    description: 'Cinema locations and showtime links.',
    href: '/cinemas',
    keywords:
      'cinema movie theater showtimes power plant glorietta greenbelt circuit century waltermart cash carry',
  },
  {
    title: 'Parking in Makati',
    group: 'Visit',
    category: 'Transport',
    description: 'Find parking near destinations in Makati.',
    href: '/parking',
    keywords:
      'parking car park garage ayala rockwell circuit century poblacion salcedo legazpi',
  },
  {
    title: 'What’s On in Makati',
    group: 'Visit',
    category: 'Entertainment',
    description: 'Events, activities and entertainment sources.',
    href: '/whats-on',
    keywords:
      'events activities whats on show concert mall festival theatre entertainment',
    featured: true,
  },
  {
    title: 'Make It Makati',
    group: 'Visit',
    category: 'Visit',
    description:
      'Ayala Land guide to Makati CBD, Ayala Center and Circuit Makati.',
    href: '/visit#resources',
    keywords: 'make it makati ayala cbd circuit visitor guide lifestyle',
  },
];

const governmentItems: SearchItem[] = [
  {
    title: 'City leadership',
    group: 'Government',
    category: 'Government',
    description: 'Mayor and Vice Mayor.',
    href: '/government#leadership',
    keywords: 'mayor vice mayor leadership executive city hall official',
    featured: true,
  },
  {
    title: 'City Council',
    group: 'Government',
    category: 'Government',
    description: 'Sangguniang Panlungsod.',
    href: '/government#council',
    keywords: 'council councilor legislative sanggunian vice mayor ordinance',
  },
  {
    title: 'Elections & Voting',
    group: 'Government',
    category: 'Elections',
    description: 'Neutral voter information, election dates and official COMELEC sources.',
    href: '/elections',
    keywords: 'elections voting vote voter registration precinct polling place comelec barangay sk bske candidates',
    featured: true,
  },
  {
    title: 'City offices',
    group: 'Government',
    category: 'Government',
    description: 'Departments and offices of the City Government of Makati.',
    href: '/government#offices',
    keywords:
      'office department city hall government engineering health social welfare environment budget finance',
    featured: true,
  },
  {
    title: 'Makati statistics',
    group: 'Government',
    category: 'Government',
    description: 'Population and basic city figures.',
    href: '/statistics',
    keywords:
      'statistics population demographic income class data city profile',
  },
  {
    title: 'Legislation',
    group: 'Government',
    category: 'Government',
    description: 'Resolutions, ordinances and the Makati City Charter.',
    href: '/legislation',
    keywords: 'legislation ordinance resolution law charter council',
  },
  {
    title: 'News & events',
    group: 'Government',
    category: 'Government',
    description: 'Official city news and event listings.',
    href: '/news',
    keywords: 'news announcement events city government update',
  },
  {
    title: 'Estates & Associations',
    group: 'Government',
    category: 'Government',
    description:
      'MACEA, Century City, Rockwell Center and Circuit Makati estate associations.',
    href: '/estates',
    keywords:
      'macea estate association century city rockwell circuit cmea private estate',
  },
  {
    title: 'Bel-Air Village Association',
    group: 'Government',
    category: 'Government',
    description: 'Homeowners association for Bel-Air Village.',
    href: '/barangays#bel-air',
    keywords: 'bava bel air village homeowners association',
  },
  {
    title: 'Dasmariñas Village Association',
    group: 'Government',
    category: 'Government',
    description: 'Homeowners association for Dasmariñas Village.',
    href: '/barangays#dasmarinas',
    keywords: 'dva dasmarinas village homeowners association',
  },
  {
    title: 'Forbes Park Association',
    group: 'Government',
    category: 'Government',
    description: 'Homeowners association for Forbes Park.',
    href: '/barangays#forbes-park',
    keywords: 'fpa forbes park homeowners association',
  },
  {
    title: 'San Lorenzo Village Association',
    group: 'Government',
    category: 'Government',
    description: 'Homeowners association for San Lorenzo Village.',
    href: '/barangays#san-lorenzo',
    keywords: 'slva san lorenzo village homeowners association',
  },
  {
    title: 'Live Makati',
    group: 'Government',
    category: 'Government',
    description: 'Weather, air quality, advisories and utility status sources.',
    href: '/live',
    keywords:
      'live weather air quality aqi rain thunderstorm pagasa meralco outage manila water macea phivolcs advisory',
    featured: true,
  },
];

const recordItems: SearchItem[] = [
  {
    title: 'Projects & Budget',
    group: 'Record',
    category: 'Records',
    description: 'Budget, project disclosures, procurement and audit records.',
    href: '/projects-budget',
    keywords:
      'budget spending projects procurement audit public records transparency contract',
    featured: true,
  },
  {
    title: 'CY 2025 Annual Budget',
    group: 'Record',
    category: 'Records',
    description: 'City annual budget document.',
    href: '/projects-budget#budget',
    keywords: 'annual budget 2025 appropriation spending finance',
  },
  {
    title: 'Project disclosures',
    group: 'Record',
    category: 'Records',
    description: 'Development-fund programs and projects.',
    href: '/projects-budget#projects',
    keywords: 'project tracker infrastructure nta development project status',
  },
  {
    title: 'Procurement',
    group: 'Record',
    category: 'Records',
    description: 'Procurement and award notices.',
    href: '/projects-budget#procurement',
    keywords: 'procurement bidding award supplier contractor philgeps purchase',
  },
  {
    title: 'Audit reports',
    group: 'Record',
    category: 'Records',
    description: 'Commission on Audit reports.',
    href: '/projects-budget#audit',
    keywords: 'audit coa report financial compliance',
  },
];

const toolItems: SearchItem[] = [
  {
    title: 'Saan Ako Lalapit?',
    group: 'Tool',
    category: 'Tools',
    description:
      'Find the right Makati office, service or channel for your concern.',
    href: '/community-tools/saan-ako-lalapit',
    keywords:
      'where office concern help which department saan ako lalapit finder',
    featured: true,
  },
  {
    title: 'Project Tracker',
    group: 'Tool',
    category: 'Tools',
    description: 'Public-project records and development disclosures.',
    href: '/projects-budget#projects',
    keywords:
      'project tracker infrastructure public works development project status',
  },
  {
    title: 'Getting Around',
    group: 'Tool',
    category: 'Tools',
    description: 'Directions, public transport and ride-hailing links.',
    href: '/mobility',
    keywords:
      'commute transport route bus jeep terminal traffic fare mrt grab angkas joyride move it',
  },
  {
    title: 'Parking Finder',
    group: 'Tool',
    category: 'Tools',
    description: 'Find parking near destinations in Makati.',
    href: '/parking',
    keywords: 'parking finder car park garage',
  },
  {
    title: 'What’s On',
    group: 'Tool',
    category: 'Tools',
    description: 'Event and entertainment sources across Makati.',
    href: '/whats-on',
    keywords: 'events calendar whats on activities entertainment',
  },
  {
    title: 'Live Makati',
    group: 'Tool',
    category: 'Tools',
    description: 'Weather, air quality, utility status and advisories.',
    href: '/live',
    keywords: 'weather aqi pagasa meralco outage water advisory live makati',
  },
  {
    title: 'Opportunities Hub',
    group: 'Tool',
    category: 'Tools',
    description:
      'Planned jobs, scholarships, training and volunteer opportunities tool.',
    href: '/get-involved?type=idea&tool=opportunities-hub#submission',
    keywords:
      'jobs scholarship training internship volunteer opportunities employment',
  },
  {
    title: 'Waste & Collection Guide',
    group: 'Tool',
    category: 'Tools',
    description: 'Planned waste rules and collection information tool.',
    href: '/get-involved?type=idea&tool=waste-guide#submission',
    keywords: 'waste garbage trash collection recycling environment schedule',
  },
];

const civicMapItems: SearchItem[] = [
  {
    title: 'Civic Map',
    group: 'Tool',
    category: 'Participation',
    description: 'Rate public infrastructure, report non-emergency issues, suggest improvements and follow community discussion.',
    href: '/civic-map',
    keywords: 'civic map report pothole sidewalk blocked park review public infrastructure road street proposal crosswalk trees jeepney route public transport',
    featured: true,
  },
  ...civicAssets.map(asset => ({
    title: asset.title,
    group: 'Tool' as const,
    category: 'Civic Map',
    description: asset.subtitle,
    href: '/civic-map/' + asset.id,
    keywords: [
      civicAssetTypeLabels[asset.type],
      asset.barangay ?? '',
      asset.street ?? '',
      asset.from ?? '',
      asset.to ?? '',
      asset.tags.join(' '),
      'rate report review propose improve',
    ].join(' '),
  })),
];

const radicalCivicItems: SearchItem[] = [
  {
    title: 'City Monitor',
    group: 'Record',
    category: 'Government activity',
    description: 'Daily-monitored official activity across council, legislation, speeches, procurement, projects, publications and consultations.',
    href: '/city-monitor',
    keywords: 'city monitor council session legislation ordinance resolution speech mayor SOCA procurement bidding award publication consultation official activity',
    featured: true,
  },
  {
    title: 'Civic Briefs',
    group: 'Tool',
    category: 'Government activity',
    description: 'Daily, weekly and monthly BetterMakati digests from City Monitor.',
    href: '/briefs',
    keywords: 'facebook updates daily brief weekly makati brief monthly state of makati city monitor digest',
    featured: true,
  },
  {
    title: 'Open Government Doctrine',
    group: 'Record',
    category: 'Open Government',
    description: 'BetterMakati methodology, implementation status and OECD-aligned self-audit.',
    href: '/open-government',
    keywords: 'open government doctrine transparency accountability participation presence integrity oecd ogp audit',
    featured: true,
  },
  {
    title: 'BetterMakati Status',
    group: 'Record',
    category: 'Open Government',
    description: 'Public self-accountability: coverage, source monitoring, community input and unmeasured performance gaps.',
    href: '/status',
    keywords: 'bettermakati status performance self audit metrics source watch coverage gaps evaluation',
    featured: true,
  },
  {
    title: 'Integrity & Public Interest',
    group: 'Record',
    category: 'Integrity',
    description: 'Public-service ethics, procurement integrity, beneficial ownership, audit evidence and coverage gaps.',
    href: '/integrity',
    keywords: 'integrity ethics procurement contractor supplier beneficial ownership audit public interest RA 6713 RA 12009',
    featured: true,
  },

  {
    title: 'Accountability Ledger',
    group: 'Record',
    category: 'Accountability',
    description: 'Track sourced public plans, responsible bodies, later evidence and known gaps.',
    href: '/accountability',
    keywords: 'accountability ledger commitment project responsible office evidence outcome target status track',
    featured: true,
  },
  {
    title: 'Public Records',
    group: 'Record',
    category: 'Records',
    description: 'Citizen-facing index of Makati public records, structured data and original sources.',
    href: '/records',
    keywords: 'public records transparency data documents source ordinance audit budget election download',
    featured: true,
  },
  {
    title: 'Participate in Makati',
    group: 'Tool',
    category: 'Participation',
    description: 'Find participation opportunities and follow BetterMakati community input.',
    href: '/participate',
    keywords: 'participate consultation public hearing assembly proposal comment community input feedback',
    featured: true,
  },
  {
    title: 'Today in Makati',
    group: 'Tool',
    category: 'Presence',
    description: 'Personalize BetterMakati by barangay and start with what matters today.',
    href: '/today',
    keywords: 'today my makati barangay local live news event weather personalized',
    featured: true,
  },
];

const contactItems: SearchItem[] = [
  {
    title: 'Hotlines & emergency contacts',
    group: 'Contact',
    category: 'Government',
    description: '911, City Hall, Makati Action Center and essential contacts.',
    href: '/hotlines',
    keywords:
      'hotline phone emergency 911 city hall drrmo action center contact',
    featured: true,
  },
  {
    title: 'Contact BetterMakati',
    group: 'Contact',
    category: 'Tools',
    description: 'Contact the project or report a correction.',
    href: '/contact',
    keywords: 'contact bettermakati correction github issue feedback',
  },
];

const barangayItems: SearchItem[] = barangayProfiles.map(barangay => ({
  title: `Barangay ${barangay.name}`,
  group: 'Barangay',
  category: 'Barangays',
  description: `Barangay profile, 2024 population and ${barangay.legislativeDistrict}.`,
  href: `/barangays/${barangay.slug}`,
  keywords: `${barangay.name} barangay hall local neighborhood population district profile`,
}));

const officeItems: SearchItem[] = governmentServiceOffices.map(office => ({
  title: office.name,
  group: 'Government',
  category: 'Government offices',
  description: office.address,
  href: '/government-offices#' + office.id,
  keywords: [
    office.agency,
    office.scope,
    office.address,
    office.barangay ?? '',
    office.phone ?? '',
    office.email ?? '',
  ].join(' '),
  featured: office.scope === 'In Makati',
}));

const officialItems: SearchItem[] = electedOfficials.map(official => ({
  title: official.displayName,
  group: 'Government',
  category: 'Elected officials',
  description: `${official.office}${official.district ? ' · ' + official.district : ''}.`,
  href: `/officials/${official.slug}`,
  keywords: `${official.name} ${official.displayName} ${official.office} ${official.district ?? ''} elected official councilor congress representative mayor vice mayor`,
}));

export const searchIndex: SearchItem[] = [
  ...makatiHistory.map(event => ({
    title: event.title,
    group: 'Record' as const,
    category: 'History',
    description: `${event.date} · ${event.summary}`,
    href: `/history#${event.id}`,
    keywords: `${event.date} ${event.topic} ${event.source.label} history timeline`,
  })),
  ...serviceItems,
  ...radicalCivicItems,
  ...civicMapItems,
  ...visitItems,
  ...governmentItems,
  ...officeItems,
  ...officialItems,
  ...recordItems,
  ...toolItems,
  ...contactItems,
  ...barangayItems,
];
