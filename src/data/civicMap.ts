import type { CivicAssetType as RegistryAssetType } from './placeRegistry';

export { civicAssets, civicAssetTypeLabels } from './placeRegistry';
export type { CivicAccessClass, CivicAsset, CivicAssetType } from './placeRegistry';

export type CivicContributionKind = 'report' | 'proposal' | 'update';

export interface CivicIssueCategory {
  id: string;
  label: string;
  description: string;
  appliesTo?: RegistryAssetType[];
  emergency?: boolean;
  urgent?: boolean;
  preferredChannel?: '911' | 'makati-action-center' | 'ltfrb' | 'dotr';
}

export interface CivicProposalCategory {
  id: string;
  label: string;
  description: string;
  geometry: 'point' | 'segment' | 'route' | 'area';
  appliesTo?: RegistryAssetType[];
}

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

export const issueCategoriesForAsset = (type: RegistryAssetType) =>
  civicIssueCategories.filter(item => !item.appliesTo || item.appliesTo.includes(type));

export const proposalCategoriesForAsset = (type: RegistryAssetType) =>
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
