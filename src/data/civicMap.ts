export type CivicAssetType =
  | 'street-segment'
  | 'sidewalk-segment'
  | 'crossing'
  | 'bike-lane'
  | 'park'
  | 'public-office'
  | 'health-center'
  | 'community-center'
  | 'public-market'
  | 'public-toilet'
  | 'drainage'
  | 'bridge'
  | 'heritage-site'
  | 'transport-route'
  | 'transport-stop'
  | 'transport-terminal';

export type CivicContributionKind = 'report' | 'proposal' | 'review' | 'update';

export interface CivicAsset {
  id: string;
  title: string;
  type: CivicAssetType;
  subtitle: string;
  barangay?: string;
  lat: number;
  lng: number;
  authority?: string;
  address?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  status: 'mapped' | 'pilot' | 'needs-verification';
  street?: string;
  from?: string;
  to?: string;
  side?: 'north' | 'south' | 'east' | 'west' | 'both';
  tags: string[];
}

export interface CivicCriterion {
  id: string;
  label: string;
  description: string;
}

export interface CivicIssueCategory {
  id: string;
  label: string;
  description: string;
  appliesTo?: CivicAssetType[];
  emergency?: boolean;
  urgent?: boolean;
  preferredChannel?: '911' | 'makati-action-center' | 'ltfrb' | 'dotr';
}

export interface CivicProposalCategory {
  id: string;
  label: string;
  description: string;
  geometry: 'point' | 'segment' | 'route' | 'area';
  appliesTo?: CivicAssetType[];
}

export const civicAssetTypeLabels: Record<CivicAssetType, string> = {
  'street-segment': 'Street / road segment',
  'sidewalk-segment': 'Sidewalk segment',
  crossing: 'Crossing / intersection',
  'bike-lane': 'Bike lane',
  park: 'Park / plaza',
  'public-office': 'Public office',
  'health-center': 'Health center',
  'community-center': 'Community center',
  'public-market': 'Public market',
  'public-toilet': 'Public toilet',
  drainage: 'Drainage / flood-control asset',
  bridge: 'Bridge / footbridge',
  'heritage-site': 'Heritage site / monument',
  'transport-route': 'Public transport route',
  'transport-stop': 'Public transport stop',
  'transport-terminal': 'Public transport terminal / TODA',
};

export const civicAssets: CivicAsset[] = [
  {
    id: 'jp-rizal-makati-ave-p-burgos',
    title: 'J.P. Rizal Street — Makati Ave to P. Burgos',
    type: 'street-segment',
    subtitle: 'Pilot block-level road segment',
    barangay: 'Poblacion',
    lat: 14.56523,
    lng: 121.02946,
    authority: 'City / road authority to verify',
    status: 'pilot',
    street: 'J.P. Rizal Street',
    from: 'Makati Avenue',
    to: 'P. Burgos Street',
    side: 'both',
    tags: ['walking', 'road', 'drainage', 'public transport'],
  },
  {
    id: 'jp-rizal-p-burgos-n-garcia',
    title: 'J.P. Rizal Street — P. Burgos to N. Garcia',
    type: 'street-segment',
    subtitle: 'Pilot block-level road segment',
    barangay: 'Poblacion',
    lat: 14.56604,
    lng: 121.02758,
    authority: 'City / road authority to verify',
    status: 'pilot',
    street: 'J.P. Rizal Street',
    from: 'P. Burgos Street',
    to: 'N. Garcia Street',
    side: 'both',
    tags: ['walking', 'road', 'drainage'],
  },
  {
    id: 'ayala-paseo-rufino',
    title: 'Ayala Avenue — Paseo de Roxas to V.A. Rufino',
    type: 'street-segment',
    subtitle: 'Pilot block-level road segment',
    barangay: 'San Lorenzo / Bel-Air',
    lat: 14.55658,
    lng: 121.02204,
    authority: 'Road / estate responsibility to verify',
    status: 'pilot',
    street: 'Ayala Avenue',
    from: 'Paseo de Roxas',
    to: 'V.A. Rufino Street',
    side: 'both',
    tags: ['walking', 'road', 'business district', 'public transport'],
  },
  {
    id: 'poblacion-park',
    title: 'Makati Poblacion Park',
    type: 'park',
    subtitle: 'Public park',
    barangay: 'Poblacion',
    lat: 14.56593,
    lng: 121.03155,
    authority: 'City of Makati',
    status: 'mapped',
    tags: ['park', 'shade', 'seating', 'community'],
  },
  {
    id: 'makati-city-hall',
    title: 'Makati City Hall',
    type: 'public-office',
    subtitle: 'City government complex',
    barangay: 'Poblacion',
    lat: 14.5693,
    lng: 121.0282,
    authority: 'City of Makati',
    status: 'mapped',
    tags: ['government', 'public office', 'accessibility', 'service'],
  },
  {
    id: 'museo-ng-makati',
    title: 'Museo ng Makati',
    type: 'heritage-site',
    subtitle: 'Public heritage and cultural facility',
    barangay: 'Poblacion',
    lat: 14.56557,
    lng: 121.03103,
    authority: 'City of Makati',
    status: 'mapped',
    tags: ['heritage', 'culture', 'accessibility'],
  },
  {
    id: 'ayala-triangle-gardens',
    title: 'Ayala Triangle Gardens',
    type: 'park',
    subtitle: 'Urban green space in the Makati CBD',
    barangay: 'Bel-Air',
    lat: 14.55612,
    lng: 121.02325,
    authority: 'Ayala Land / Makati CBD estate management',
    address: 'Ayala Avenue, Makati Avenue and Paseo de Roxas, Barangay Bel-Air, Makati City',
    sourceUrl: 'https://ir.ayalaland.com.ph/wp-content/uploads/2026/04/ALI-2025-Integrated-Report.pdf',
    sourceLabel: 'Ayala Land · 2025 Integrated Report',
    status: 'mapped',
    tags: ['park', 'green space', 'walking', 'seating', 'shade', 'business district'],
  },
  {
    id: 'washington-sycip-park',
    title: 'Washington SyCip Park',
    type: 'park',
    subtitle: 'Pocket park in Legazpi Village',
    barangay: 'San Lorenzo',
    lat: 14.55382,
    lng: 121.01788,
    authority: 'Makati Commercial Estate Association / Ayala Land',
    address: 'Legazpi Street, Legazpi Village, Barangay San Lorenzo, Makati City',
    sourceUrl: 'https://ir.ayalaland.com.ph/wp-content/uploads/2026/04/ALI-2025-Integrated-Report.pdf',
    sourceLabel: 'Ayala Land · 2025 Integrated Report',
    status: 'mapped',
    tags: ['park', 'green space', 'walking', 'seating', 'shade', 'legazpi village'],
  },
  {
    id: 'legazpi-active-park',
    title: 'Legazpi Active Park',
    type: 'park',
    subtitle: 'Active recreation park in Legazpi Village',
    barangay: 'San Lorenzo',
    lat: 14.55417,
    lng: 121.01673,
    authority: 'Makati Commercial Estate Association / Ayala Land',
    address: 'Rada Street at Legazpi Street, Legazpi Village, Barangay San Lorenzo, Makati City',
    sourceUrl: 'https://ir.ayalaland.com.ph/wp-content/uploads/2026/04/ALI-2025-Integrated-Report.pdf',
    sourceLabel: 'Ayala Land · 2025 Integrated Report',
    status: 'mapped',
    tags: ['park', 'recreation', 'playground', 'walking', 'jogging', 'legazpi village'],
  },
  {
    id: 'psa-makati-crs',
    title: 'PSA Makati CRS Outlet',
    type: 'public-office',
    subtitle: 'Civil Registration Service outlet',
    barangay: 'Carmona',
    lat: 14.575209,
    lng: 121.019945,
    authority: 'Philippine Statistics Authority',
    address: '5/F Ayala Malls Circuit, Hippodromo Street, Barangay Carmona, Makati City',
    sourceUrl: 'https://psa.gov.ph/directory/census-serbilis-center-metro-manila',
    sourceLabel: 'Philippine Statistics Authority · Metro Manila CRS outlets',
    status: 'mapped',
    tags: ['government', 'civil registry', 'birth certificate', 'marriage certificate', 'death certificate', 'service'],
  },
  {
    id: 'lto-makati-district',
    title: 'LTO Makati District Office',
    type: 'public-office',
    subtitle: 'Land transportation district office',
    barangay: 'Valenzuela',
    lat: 14.57241,
    lng: 121.02497,
    authority: 'Land Transportation Office',
    address: 'Butel Building, Pililia Street, Barangay Valenzuela, Makati City',
    sourceUrl: 'https://lto.gov.ph/wp-content/uploads/2025/09/LTO-CC-2025-Internal.pdf',
    sourceLabel: 'Land Transportation Office · 2025 Citizen’s Charter directory',
    status: 'mapped',
    tags: ['government', 'drivers license', 'motor vehicle', 'transport', 'service'],
  },
  {
    id: 'sec-headquarters',
    title: 'Securities and Exchange Commission Headquarters',
    type: 'public-office',
    subtitle: 'National corporate and securities regulator',
    barangay: 'Bel-Air',
    lat: 14.55896,
    lng: 121.02619,
    authority: 'Securities and Exchange Commission',
    address: '7907 Makati Avenue, Salcedo Village, Barangay Bel-Air, Makati City',
    sourceUrl: 'https://www.sec.gov.ph/',
    sourceLabel: 'Securities and Exchange Commission',
    status: 'mapped',
    tags: ['government', 'business registration', 'corporations', 'securities', 'service'],
  },
  {
    id: 'makati-central-fire-station',
    title: 'Makati Central Fire Station',
    type: 'public-office',
    subtitle: 'Bureau of Fire Protection city fire station',
    barangay: 'San Antonio',
    lat: 14.56248,
    lng: 121.01516,
    authority: 'Bureau of Fire Protection',
    address: 'Ayala Avenue Extension corner Malugay Street, Barangay San Antonio, Makati City',
    sourceUrl: 'https://www.makati.gov.ph/content/makati-hotlines-firestations',
    sourceLabel: 'City Government of Makati · Fire Stations Hotlines',
    status: 'mapped',
    tags: ['government', 'fire safety', 'emergency services', 'public safety'],
  },
];

const commonCriteria: CivicCriterion[] = [
  { id: 'accessibility', label: 'Accessibility & inclusion', description: 'Can people of different ages and abilities use it independently and safely?' },
  { id: 'safety', label: 'Safety', description: 'Does the place or service feel physically and traffic-safe?' },
  { id: 'cleanliness', label: 'Cleanliness & maintenance', description: 'Is it clean, functional and in good repair?' },
  { id: 'comfort', label: 'Comfort', description: 'Is it reasonably comfortable for its intended use?' },
];

const streetCriteria: CivicCriterion[] = [
  { id: 'walkability', label: 'Walking space & continuity', description: 'Is there a continuous, sufficiently clear pedestrian path?' },
  { id: 'surface', label: 'Surface condition', description: 'Are walking and road surfaces even, stable and usable?' },
  { id: 'crossing', label: 'Crossing quality', description: 'Are crossings legible, accessible and reasonably safe?' },
  { id: 'shade', label: 'Shade & vegetation', description: 'Is there useful shade or vegetation along the segment?' },
  { id: 'drainage', label: 'Drainage & flooding', description: 'Does the segment drain well during rain?' },
  { id: 'lighting', label: 'Lighting', description: 'Is lighting adequate after dark?' },
];

const parkCriteria: CivicCriterion[] = [
  { id: 'shade', label: 'Shade & thermal comfort', description: 'Are there enough shaded places to stay comfortably?' },
  { id: 'seating', label: 'Seating', description: 'Is there enough usable seating for different users?' },
  { id: 'vegetation', label: 'Trees & vegetation', description: 'Are planting and green areas healthy and pleasant?' },
  { id: 'activities', label: 'Uses & activities', description: 'Does the place support useful and inclusive activities?' },
  { id: 'toilets', label: 'Toilets & basic amenities', description: 'Are essential amenities available and usable?' },
  { id: 'attractiveness', label: 'Attractiveness & identity', description: 'Is the place pleasant, legible and distinctive?' },
];

const facilityCriteria: CivicCriterion[] = [
  { id: 'wayfinding', label: 'Wayfinding', description: 'Is it easy to find the entrance, counters and key spaces?' },
  { id: 'waiting', label: 'Waiting space & seating', description: 'Is there enough accessible, comfortable waiting space?' },
  { id: 'toilets', label: 'Toilets', description: 'Are toilets available, accessible and maintained?' },
  { id: 'ventilation', label: 'Ventilation & temperature', description: 'Is the public area reasonably ventilated and comfortable?' },
  { id: 'information', label: 'Service information', description: 'Are public instructions, schedules and directions easy to find?' },
];

const transportCriteria: CivicCriterion[] = [
  { id: 'reliability', label: 'Reliability', description: 'Does the route/service operate consistently enough to plan around?' },
  { id: 'frequency', label: 'Frequency & waiting time', description: 'Are waits reasonable for the route and time of day?' },
  { id: 'coverage', label: 'Coverage & usefulness', description: 'Does the route connect useful destinations and transfers?' },
  { id: 'boarding', label: 'Boarding & alighting', description: 'Are stops and boarding points safe and practical?' },
  { id: 'information', label: 'Route & fare information', description: 'Are route, stop and fare details clear and dependable?' },
  { id: 'accessibility', label: 'Accessibility', description: 'Can seniors and people with disabilities reasonably use the service?' },
];

export const criteriaForAsset = (type: CivicAssetType): CivicCriterion[] => {
  if (['street-segment', 'sidewalk-segment', 'crossing', 'bike-lane', 'bridge', 'drainage'].includes(type)) {
    return [...commonCriteria, ...streetCriteria];
  }
  if (type === 'park') return [...commonCriteria, ...parkCriteria];
  if (['public-office', 'health-center', 'community-center', 'public-market', 'public-toilet', 'heritage-site'].includes(type)) {
    return [...commonCriteria, ...facilityCriteria];
  }
  if (['transport-route', 'transport-stop', 'transport-terminal'].includes(type)) {
    return [commonCriteria[1], commonCriteria[2], commonCriteria[3], ...transportCriteria].filter(Boolean) as CivicCriterion[];
  }
  return commonCriteria;
};

export const civicIssueCategories: CivicIssueCategory[] = [
  { id: 'fire', label: 'Fire / smoke / explosion', description: 'Active fire or immediate fire danger.', emergency: true, preferredChannel: '911' },
  { id: 'crime-in-progress', label: 'Crime or violence in progress', description: 'Immediate threat, violence or crime happening now.', emergency: true, preferredChannel: '911' },
  { id: 'medical-emergency', label: 'Medical emergency', description: 'Someone needs urgent medical attention.', emergency: true, preferredChannel: '911' },
  { id: 'serious-collision', label: 'Serious collision / person injured', description: 'Crash with possible injury or immediate danger.', emergency: true, preferredChannel: '911' },
  { id: 'electrical-danger', label: 'Live electrical hazard', description: 'Exposed live wire or immediate electrocution/fire danger.', emergency: true, preferredChannel: '911' },
  { id: 'structural-danger', label: 'Possible collapse / immediate structural danger', description: 'A structure appears at risk of collapse or causing immediate harm.', emergency: true, preferredChannel: '911' },
  { id: 'flood-danger', label: 'Flooding with people in immediate danger', description: 'Rapid/deep flooding posing immediate danger.', emergency: true, preferredChannel: '911' },

  { id: 'open-manhole', label: 'Open manhole / dangerous hole', description: 'Uncovered opening or severe trip/fall hazard.', urgent: true, preferredChannel: 'makati-action-center' },
  { id: 'traffic-signal', label: 'Traffic signal not working', description: 'Traffic or pedestrian signal failure.', urgent: true, preferredChannel: 'makati-action-center' },
  { id: 'dangerous-tree', label: 'Dangerous tree / branch', description: 'Tree or branch appears likely to fall.', urgent: true, preferredChannel: 'makati-action-center' },

  { id: 'sidewalk-blocked', label: 'Sidewalk blocked', description: 'A pedestrian path is obstructed or unusable.', appliesTo: ['street-segment', 'sidewalk-segment'] },
  { id: 'vehicle-obstruction', label: 'Vehicle obstruction / possible illegal parking', description: 'A vehicle blocks a sidewalk, crossing, bike lane or public access.', appliesTo: ['street-segment', 'sidewalk-segment', 'crossing', 'bike-lane', 'transport-stop', 'transport-terminal'] },
  { id: 'graffiti', label: 'Graffiti / vandalism', description: 'Graffiti or physical vandalism affecting public infrastructure.' },
  { id: 'litter', label: 'Litter / overflowing waste', description: 'Garbage accumulation or overflowing public bin.' },
  { id: 'pothole', label: 'Pothole / damaged road surface', description: 'Road surface damage affecting safety or comfort.', appliesTo: ['street-segment'] },
  { id: 'broken-sidewalk', label: 'Broken / uneven sidewalk', description: 'Cracked, lifted, loose or slippery pedestrian surface.', appliesTo: ['street-segment', 'sidewalk-segment'] },
  { id: 'curb-ramp', label: 'Missing / blocked / poor curb ramp', description: 'Accessibility problem at a curb or crossing.', appliesTo: ['street-segment', 'sidewalk-segment', 'crossing'] },
  { id: 'crossing-problem', label: 'Crossing problem', description: 'Missing, faded, blocked or unsafe pedestrian crossing.', appliesTo: ['street-segment', 'crossing'] },
  { id: 'streetlight', label: 'Streetlight / public lighting problem', description: 'Light is out, flickering, damaged or inadequate.' },
  { id: 'flooding', label: 'Flooding / standing water', description: 'Non-emergency flooding, puddling or recurring water accumulation.' },
  { id: 'drainage-blocked', label: 'Blocked / damaged drainage', description: 'Drain, grate or canal appears clogged or damaged.' },
  { id: 'construction-obstruction', label: 'Construction obstruction / unsafe works', description: 'Works block access or create an avoidable safety problem.' },
  { id: 'damaged-equipment', label: 'Broken public equipment / furniture', description: 'Bench, playground equipment, railing, sign or public fixture is damaged.' },
  { id: 'toilet-problem', label: 'Public toilet problem', description: 'Cleanliness, water, lock, accessibility or fixture issue.' },
  { id: 'accessibility-barrier', label: 'Accessibility barrier', description: 'Infrastructure prevents or seriously limits use by people with disabilities.' },

  { id: 'route-info-wrong', label: 'Route / stop information is wrong', description: 'Published route, stop or fare information appears incorrect.', appliesTo: ['transport-route', 'transport-stop', 'transport-terminal'], preferredChannel: 'ltfrb' },
  { id: 'route-deviation', label: 'Unexpected route deviation', description: 'Vehicle did not follow the expected authorized route.', appliesTo: ['transport-route'], preferredChannel: 'ltfrb' },
  { id: 'long-wait', label: 'Very long / unreliable wait', description: 'Service is repeatedly much less frequent than expected.', appliesTo: ['transport-route', 'transport-stop', 'transport-terminal'] },
  { id: 'overcharging', label: 'Possible overcharging / fare issue', description: 'Fare charged appears inconsistent with the applicable fare information.', appliesTo: ['transport-route', 'transport-terminal'], preferredChannel: 'ltfrb' },
  { id: 'refusal', label: 'Refusal to convey / service refusal', description: 'Passenger service was refused in a reportable circumstance.', appliesTo: ['transport-route', 'transport-terminal'], preferredChannel: 'ltfrb' },
  { id: 'unsafe-driving', label: 'Unsafe driving behavior', description: 'Speeding, aggressive maneuvers or unsafe loading behavior.', appliesTo: ['transport-route'], preferredChannel: 'ltfrb' },
  { id: 'overcrowding', label: 'Overcrowding / unsafe boarding', description: 'Crowding or boarding conditions create a recurring safety/comfort problem.', appliesTo: ['transport-route', 'transport-stop', 'transport-terminal'] },
  { id: 'terminal-obstruction', label: 'Terminal / queue obstructs public space', description: 'Waiting vehicles or queues obstruct sidewalks, crossings or traffic.', appliesTo: ['transport-stop', 'transport-terminal'] },
];

export const civicProposalCategories: CivicProposalCategory[] = [
  { id: 'more-trees', label: 'More trees / shade', description: 'Add street trees, planting or another durable shade intervention.', geometry: 'segment', appliesTo: ['street-segment', 'sidewalk-segment', 'park', 'transport-stop'] },
  { id: 'wider-sidewalk', label: 'Wider / clearer sidewalk', description: 'Increase usable pedestrian width or remove recurring pinch points.', geometry: 'segment', appliesTo: ['street-segment', 'sidewalk-segment'] },
  { id: 'new-crosswalk', label: 'Add / relocate a crosswalk', description: 'Create a safer pedestrian crossing at a specific location.', geometry: 'point', appliesTo: ['street-segment', 'crossing'] },
  { id: 'curb-ramp-upgrade', label: 'Add / improve curb ramps', description: 'Improve step-free access at a corner or crossing.', geometry: 'point', appliesTo: ['street-segment', 'sidewalk-segment', 'crossing'] },
  { id: 'better-lighting', label: 'Add / improve public lighting', description: 'Improve illumination of a street, park, stop or public facility.', geometry: 'point' },
  { id: 'traffic-calming', label: 'Traffic calming / safer speeds', description: 'Raised crossing, speed table, narrowed turning radius or another safety measure.', geometry: 'segment', appliesTo: ['street-segment', 'crossing'] },
  { id: 'bike-infrastructure', label: 'Add / improve bike infrastructure', description: 'Bike lane, protection, connection or parking.', geometry: 'segment', appliesTo: ['street-segment', 'bike-lane'] },
  { id: 'seating', label: 'Add seating', description: 'Add accessible public seating or resting places.', geometry: 'point' },
  { id: 'public-toilet', label: 'Add / improve a public toilet', description: 'Provide or improve accessible public toilets.', geometry: 'point' },
  { id: 'drainage-improvement', label: 'Drainage / flood improvement', description: 'Improve drainage, flood storage or water management.', geometry: 'segment' },
  { id: 'park-improvement', label: 'Park / public-space improvement', description: 'Improve amenities, planting, access or activities.', geometry: 'area', appliesTo: ['park'] },
  { id: 'new-stop', label: 'Add a public transport stop', description: 'Create a stop or loading point at a more useful location.', geometry: 'point', appliesTo: ['transport-route', 'transport-stop'] },
  { id: 'relocate-stop', label: 'Relocate a stop / terminal', description: 'Move a stop or terminal to improve safety, access or operations.', geometry: 'point', appliesTo: ['transport-stop', 'transport-terminal'] },
  { id: 'new-route', label: 'New public transport route', description: 'Propose a new jeepney, bus or other public transport connection.', geometry: 'route', appliesTo: ['transport-route'] },
  { id: 'route-extension', label: 'Extend an existing route', description: 'Extend a route to a new destination or interchange.', geometry: 'route', appliesTo: ['transport-route'] },
  { id: 'route-revision', label: 'Revise an existing route', description: 'Change alignment, stops or terminus to improve usefulness or operations.', geometry: 'route', appliesTo: ['transport-route'] },
  { id: 'accessibility-upgrade', label: 'Accessibility upgrade', description: 'Improve step-free access, tactile cues, accessible toilets or other inclusive design.', geometry: 'point' },
];

export const issueCategoriesForAsset = (type: CivicAssetType) =>
  civicIssueCategories.filter(item => !item.appliesTo || item.appliesTo.includes(type));

export const proposalCategoriesForAsset = (type: CivicAssetType) =>
  civicProposalCategories.filter(item => !item.appliesTo || item.appliesTo.includes(type));

export const civicOfficialChannels = {
  '911': {
    label: 'Unified 911',
    description: 'National emergency hotline for police, fire, medical and rescue emergencies.',
    href: 'tel:911',
    source: 'https://ncr.dilg.gov.ph/dilg-leads-nationwide-campaign-for-unified-911-emergency-hotline/',
  },
  'makati-action-center': {
    label: 'Makati Action Center',
    description: 'City feedback and complaint coordination. BetterMakati is not this official channel.',
    href: 'tel:+63288701000',
    secondary: 'mailto:makatiactioncenter@gmail.com',
    source: 'https://www.makati.gov.ph/assets/uploads/downloads/2/481/pdf/Makati%20Action%20Center.pdf',
  },
  ltfrb: {
    label: 'LTFRB',
    description: 'Public transport regulatory complaints and concerns.',
    href: 'tel:1342',
    secondary: 'mailto:ncr@ltfrb.gov.ph',
    source: 'https://ptops-ncr.ltfrb.gov.ph/en',
  },
  dotr: {
    label: 'DOTr Action Center',
    description: 'National transport concerns and referrals.',
    href: 'tel:7890',
    source: 'https://dotr.gov.ph/',
  },
} as const;

export const civicMethodologyReviewed = '2026-09-25';
