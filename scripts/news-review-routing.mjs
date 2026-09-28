export const newsReviewPolicyVersion = '2026-09-28.w5-8d';

const routeDefinitions = [
  {
    topic: 'legislation',
    owner: 'legislation',
    priority: 100,
    pattern:
      /\b(ordinance|resolution|city council|sangguniang panlungsod|council session|first reading|second reading|third reading|enacted|vetoed)\b/i,
    action:
      'Check the canonical legislation record and official council/measure evidence before changing lifecycle or status.',
  },
  {
    topic: 'elections',
    owner: 'elections',
    priority: 95,
    pattern:
      /\b(election|elections|comelec|voter registration|register to vote|certificate of candidacy|candidacy|polling place|barangay and sk|bske|sangguniang kabataan)\b/i,
    action:
      'Verify against the current COMELEC/legal source set and the canonical Elections record before publishing an election fact or date.',
  },
  {
    topic: 'accountability-procurement',
    owner: 'accountability',
    priority: 90,
    pattern:
      /\b(procurement|public bidding|bid result|notice of award|notice to proceed|contract award|winning bid|supplier|philgeps|annual budget|appropriation|audit finding|commission on audit|coa report)\b/i,
    action:
      'Match the exact procurement, budget or audit record before adding or changing an Accountability record.',
  },
  {
    topic: 'mobility',
    owner: 'mobility',
    priority: 85,
    pattern:
      /\b(road closure|lane closure|traffic rerout|traffic advisory|route change|fare change|station closure|mrt-?3|edsa busway|jeepney|uv express|bus route|ferry|transport terminal|public transport)\b/i,
    action:
      'Verify the exact affected road, route, station or system and effective period against the Mobility owner/source before changing canonical service status.',
  },
  {
    topic: 'participation',
    owner: 'participation',
    priority: 80,
    pattern:
      /\b(public hearing|public consultation|consultation|barangay assembly|public meeting|stakeholder meeting|public comment|public participation)\b/i,
    action:
      'Verify the official participation notice, scope and dates before creating or updating a participation opportunity.',
  },
  {
    topic: 'services',
    owner: 'services',
    priority: 75,
    pattern:
      /\b(service hours|service suspension|office hours|city hall service|permit|license|clearance|health center|clinic|vaccination|medical service|social service|application deadline)\b/i,
    action:
      'Verify the service owner, affected service and effective date before changing a service guide.',
  },
  {
    topic: 'public-records-data',
    owner: 'public-records',
    priority: 70,
    pattern:
      /\b(annual report|official report|audit report|data release|statistics release|census|publication released|new report|study released)\b/i,
    action:
      'Verify item identity and the official publication/release record before cataloguing or dating the record.',
  },
  {
    topic: 'official-notice',
    owner: 'city-monitor',
    priority: 60,
    pattern:
      /\b(advisory|official notice|city government announced|makati city hall|mayor announced|suspension|state of calamity|emergency advisory)\b/i,
    action:
      'Review the item as a City Monitor discovery signal and route to a stronger canonical owner when one exists.',
  },
];

const textFor = item => String(item.title || '') + ' ' + String(item.description || '');

export const routeNewsForReview = item => {
  const text = textFor(item);
  return routeDefinitions
    .filter(route => route.pattern.test(text))
    .map(({ pattern: _pattern, ...route }) => route)
    .sort((a, b) => b.priority - a.priority || a.owner.localeCompare(b.owner));
};

export const shouldCreateNewsReviewCandidate = item => {
  const routes = routeNewsForReview(item);
  if (!routes.length) return false;
  if (item.freshness === 'older') return false;

  const searchable = textFor(item);
  return /\bmakati\b/i.test(searchable);
};

export const primaryNewsReviewOwner = item =>
  routeNewsForReview(item)[0]?.owner ?? null;
