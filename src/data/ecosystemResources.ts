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
