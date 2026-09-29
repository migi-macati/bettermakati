export interface CivicEcosystemResource {
  id: string;
  ecosystem: 'bettergov' | 'betterlgu';
  name: string;
  href: string;
  role:
    | 'national-data-context'
    | 'cross-lgu-discovery'
    | 'national-service-discovery'
    | 'national-transparency-context'
    | 'national-procurement-discovery'
    | 'other';
  note: string;
  auditedOn: string;
}

export const civicEcosystemResources: CivicEcosystemResource[] = [
  {
    id: 'bettergov-home',
    ecosystem: 'bettergov',
    name: 'BetterGov',
    href: 'https://bettergov.ph/',
    role: 'other',
    note:
      'Entry point to the wider BetterGov civic-information ecosystem. It is a continuation resource, not evidence for a Makati-specific fact.',
    auditedOn: '2026-09-29',
  },
  {
    id: 'national-budget',
    ecosystem: 'bettergov',
    name: '2026 National Budget',
    href: 'https://2026-budget.bettergov.ph/',
    role: 'national-transparency-context',
    note:
      'National budget context for comparison and research. Makati local appropriations remain owned by BetterMakati records and official Makati sources.',
    auditedOn: '2026-09-29',
  },
  {
    id: 'price-guides',
    ecosystem: 'bettergov',
    name: 'Price Guides',
    href: 'https://price-guides.bettergov.ph/',
    role: 'national-data-context',
    note:
      'National price-benchmark continuation. It does not establish the reasonableness of a Makati procurement without a separately verified comparable basis.',
    auditedOn: '2026-09-29',
  },
  {
    id: 'flood-control',
    ecosystem: 'bettergov',
    name: 'Flood-control Projects',
    href: 'https://bettergov.ph/flood-control-projects',
    role: 'national-transparency-context',
    note:
      'National infrastructure context. It is not evidence that a Makati-local project is the same project unless an exact official identifier is verified.',
    auditedOn: '2026-09-29',
  },
  {
    id: 'open-congress',
    ecosystem: 'bettergov',
    name: 'National Legislative Records',
    href: 'https://open-congress-api.bettergov.ph/',
    role: 'other',
    note:
      'National legislative continuation for congressional research. It does not create a relationship to a Makati official or measure without exact record identity.',
    auditedOn: '2026-09-29',
  },
  {
    id: 'national-government',
    ecosystem: 'bettergov',
    name: 'National Government Directory',
    href: 'https://bettergov.ph/government',
    role: 'national-service-discovery',
    note:
      'National government-office discovery. Makati city offices and services remain owned by BetterMakati.',
    auditedOn: '2026-09-29',
  },
  {
    id: 'data-research',
    ecosystem: 'bettergov',
    name: 'Data Research / Visualizations',
    href: 'https://visualizations.bettergov.ph/',
    role: 'national-data-context',
    note:
      'National comparison and research context. BetterMakati remains the owner of Makati-local statistics and synthesis.',
    auditedOn: '2026-09-25',
  },
  {
    id: 'open-data',
    ecosystem: 'bettergov',
    name: 'Open Data Portal',
    href: 'https://data.bettergov.ph/',
    role: 'national-data-context',
    note:
      'Potential structured national-data continuation. Dataset/API suitability must still be checked before values are consumed into BetterMakati.',
    auditedOn: '2026-09-25',
  },
  {
    id: 'betterlgu',
    ecosystem: 'betterlgu',
    name: 'BetterLGU Directory',
    href: 'https://lgu.bettergov.ph/',
    role: 'cross-lgu-discovery',
    note:
      'Cross-LGU discovery route, not a statistical comparison source.',
    auditedOn: '2026-09-25',
  },
  {
    id: 'transparency',
    ecosystem: 'bettergov',
    name: 'Transparency Portal',
    href: 'https://transparency.bettergov.ph/',
    role: 'national-transparency-context',
    note:
      'National transparency context for procurement and public spending. It does not establish any Makati-specific Integrity fact.',
    auditedOn: '2026-09-25',
  },
  {
    id: 'philgeps',
    ecosystem: 'bettergov',
    name: 'PhilGEPS procurement browser',
    href: 'https://transparency.bettergov.ph/procurement',
    role: 'national-procurement-discovery',
    note:
      'BetterGov procurement handoff for further discovery. A BetterMakati award is not treated as a matched PhilGEPS notice unless an exact official reference is independently verified.',
    auditedOn: '2026-09-25',
  },
];

export const civicEcosystemResourceById = new Map(
  civicEcosystemResources.map(resource => [resource.id, resource] as const)
);

export const requireCivicEcosystemResource = (id: string) => {
  const resource = civicEcosystemResourceById.get(id);
  if (!resource) {
    throw new Error('Unknown civic ecosystem resource: ' + id);
  }
  return resource;
};
