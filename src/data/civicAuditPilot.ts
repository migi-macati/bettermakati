export const civicAuditPilot = {
  id: 'makati-public-park-accessibility-2026-pilot',
  title: 'Makati Public Park Accessibility Check',
  themeId: 'park-accessibility',
  route: '/civic-map/audits/park-accessibility-2026',
  startsAt: '2026-09-26T10:03:00+08:00',
  endsAt: '2026-10-26T23:59:59+08:00',
  minimumObservationsPerEntity: 2,
  coverageTargetPercent: 100,
  targetEntityIds: [
    'magallanes-interchange-park',
    'kennely-ann-lacia-binay-park-guadalupe-nuevo',
    'guadalupe-viejo-cloverleaf-park',
    'poblacion-park',
    'valenzuela-park',
    'poblacion-linear-park',
    'plaza-cristo-rey',
    'riverside-carmona',
    'buendia-plaza',
    'freedom-park',
    'edsa-buendia-park',
    'guadalupe-nuevo-linear-park',
    'edsa-pinagkaisahan-park',
  ],
  questionIds: [
    'entrance-access',
    'step-free-access',
    'seating',
    'toilets',
  ],
} as const;

export const civicAuditPilotQuestionLabels: Record<
  (typeof civicAuditPilot.questionIds)[number],
  string
> = {
  'entrance-access': 'Entrance access',
  'step-free-access': 'Step-free access',
  seating: 'Seating',
  toilets: 'Toilets',
};
