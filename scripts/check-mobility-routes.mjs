import { readFile } from 'node:fs/promises';

const [
  routeSource,
  wave3Source,
  wave5GapSource,
  placeSource,
] = await Promise.all([
  readFile('src/data/mobilityRoutes.ts', 'utf8'),
  readFile('data/wave3-civic-map-transport-reconciliation.json', 'utf8'),
  readFile(
    'data/wave5-mobility-bus-uv-tricycle-reconciliation.json',
    'utf8'
  ),
  readFile('src/data/placeRegistry.ts', 'utf8'),
]);

const wave3 = JSON.parse(wave3Source);
const wave5Gap = JSON.parse(wave5GapSource);
const problems = [];

const jeepneyFamily = wave3.familyReconciliation?.find(
  family => family.family === 'Public utility jeepney routes'
);
const wave3Rows = jeepneyFamily?.rows ?? [];

if (wave3Rows.length !== 38) {
  problems.push(
    'Expected 38 reconciled Wave 3 jeepney rows; found ' +
      wave3Rows.length +
      '.'
  );
}

for (const marker of [
  'export type MobilityRouteMode',
  "'jeepney'",
  "'bus'",
  "'uv-express'",
  "'tricycle'",
  'export type MobilityRouteDisposition',
  "'current-corridor'",
  "'successor-corridor'",
  "'unresolved-current-status'",
  "'current-service'",
  'export interface MobilityHistoricalRouteRecord',
  'export interface MobilityCurrentServiceRouteRecord',
  "recordKind: 'historical-reconciliation'",
  "recordKind: 'current-service'",
  "evidenceClass: CurrentRouteEvidenceClass",
  'terminalPlaceIds: string[]',
  'geometryArtifactId?: string',
  'validateMobilityRouteCorridors',
  'currentOrSuccessorJeepneyCorridors',
  'unresolvedJeepneyRows',
  'currentBusRoutes',
  'currentUvExpressRoutes',
]) {
  if (!routeSource.includes(marker)) {
    problems.push('Mobility route schema marker missing: ' + marker);
  }
}

const sourceBlock =
  routeSource
    .split('export const mobilityRouteSources: MobilityRouteSource[] = [')[1]
    ?.split('\n];\n\nconst mobilityRouteSourceIdSet')[0] ?? '';

const routeBlock =
  routeSource
    .split(
      'export const mobilityRouteCorridors: MobilityRouteCorridorRecord[] = ['
    )[1]
    ?.split('\n];\n\nexport const validateMobilityRouteCorridors')[0] ??
  '';

const allRouteIds = [
  ...routeBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);

const historicalIds = allRouteIds.filter(id =>
  id.startsWith('jeepney-2020-')
);
const currentIds = allRouteIds.filter(
  id => !id.startsWith('jeepney-2020-')
);

if (historicalIds.length !== 38) {
  problems.push(
    'W5-4c4 must preserve exactly 38 migrated jeepney rows; found ' +
      historicalIds.length +
      '.'
  );
}

if (currentIds.length !== 29) {
  problems.push(
    'W5-4c4 expects 29 corroborated current-only bus/UV routes; found ' +
      currentIds.length +
      '.'
  );
}

if (allRouteIds.length !== 67) {
  problems.push(
    'W5-4c4 expects 67 total canonical route records; found ' +
      allRouteIds.length +
      '.'
  );
}

const expectedPublishedNumbers = [
  ...Array.from({ length: 35 }, (_, index) => index + 1),
  37,
  38,
  39,
];

const canonicalPublishedNumbers = [
  ...routeBlock.matchAll(/publishedNo: (\d+),/g),
].map(match => Number(match[1]));

if (
  JSON.stringify(canonicalPublishedNumbers) !==
  JSON.stringify(expectedPublishedNumbers)
) {
  problems.push(
    'Canonical jeepney published-number sequence must preserve 1–35 and 37–39 with no invented row 36.'
  );
}

const currentOrSuccessorRows = wave3Rows.filter(
  row => !row.currentStatus.startsWith('current-status-unresolved')
);
const unresolvedRows = wave3Rows.filter(row =>
  row.currentStatus.startsWith('current-status-unresolved')
);

if (currentOrSuccessorRows.length !== 35) {
  problems.push(
    'Wave 3 should yield 35 current/successor jeepney corridors; found ' +
      currentOrSuccessorRows.length +
      '.'
  );
}
if (unresolvedRows.length !== 3) {
  problems.push(
    'Wave 3 should yield 3 unresolved jeepney rows; found ' +
      unresolvedRows.length +
      '.'
  );
}

const quote = value => JSON.stringify(value);

const dispositionFor = status => {
  if (status.startsWith('current-status-unresolved')) {
    return 'unresolved-current-status';
  }
  if (status.startsWith('current-successor')) {
    return 'successor-corridor';
  }
  return 'current-corridor';
};

const nextRecordSlice = (id, ids) => {
  const start = routeBlock.indexOf("id: '" + id + "'");
  if (start < 0) return '';
  const nextIndex = ids
    .map(nextId => routeBlock.indexOf("id: '" + nextId + "'", start + 1))
    .filter(index => index > start)
    .sort((a, b) => a - b)[0];
  return routeBlock.slice(start, nextIndex ?? routeBlock.length);
};

/* Preserve the Wave 3 jeepney migration exactly. */
for (const row of wave3Rows) {
  const id =
    'jeepney-2020-' + String(row.publishedNo).padStart(2, '0');
  const rowBlock = nextRecordSlice(id, allRouteIds);

  if (!rowBlock) {
    problems.push('Missing migrated jeepney route row: ' + id);
    continue;
  }

  for (const marker of [
    "recordKind: 'historical-reconciliation'",
    'publishedNo: ' + row.publishedNo + ',',
    'from: ' + quote(row.from) + ',',
    'to: ' + quote(row.to) + ',',
    'associationLabel: ' + quote(row.association) + ',',
    'disposition: ' + quote(dispositionFor(row.currentStatus)) + ',',
    'reconciliationStatus: ' + quote(row.currentStatus) + ',',
    "associationContinuity: 'unverified'",
    'note: ' + quote(row.reconciliationNotes) + ',',
    'geometryArtifactId: undefined',
    "reconciledOn: '2026-09-25'",
  ]) {
    if (!rowBlock.includes(marker)) {
      problems.push(
        'Migrated jeepney row ' +
          row.publishedNo +
          ' does not preserve Wave 3 field: ' +
          marker
      );
    }
  }

  const evidenceIdCount =
    rowBlock
      .match(/currentEvidenceSourceIds: \[([^\]]*)\]/)?.[1]
      ?.match(/jeepney-current-route-ref-/g)?.length ?? 0;

  if (evidenceIdCount !== row.currentEvidence.length) {
    problems.push(
      'Migrated jeepney row ' +
        row.publishedNo +
        ' current-evidence count changed: expected ' +
        row.currentEvidence.length +
        ', found ' +
        evidenceIdCount +
        '.'
    );
  }
}

if (
  (routeBlock.match(/associationContinuity: 'unverified'/g) ?? [])
    .length !== 38
) {
  problems.push(
    'All 38 historical jeepney association labels must remain continuity-unverified.'
  );
}

const unresolvedNumbers = unresolvedRows.map(row => row.publishedNo);
if (JSON.stringify(unresolvedNumbers) !== JSON.stringify([24, 29, 37])) {
  problems.push(
    'Unresolved jeepney set changed; expected rows 24, 29 and 37.'
  );
}

/* W5-4c4 source policy: two independent current 2026 terminal rosters. */
for (const marker of [
  "id: 'one-ayala-routes-spot-2026'",
  "id: 'one-ayala-routes-windowseat-2026'",
  "kind: 'current-secondary-terminal-roster'",
]) {
  if (!sourceBlock.includes(marker)) {
    problems.push('Current-route source-policy marker missing: ' + marker);
  }
}

const slugify = value =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const expectedCurrentRoutes = [
  ...wave5Gap.bus.cityBusRoutes
    .filter(route => !route.startsWith('EDSA Carousel'))
    .map(route => ({
      id: 'city-bus-one-ayala-' + slugify(route),
      mode: 'bus',
      serviceClass: 'city-bus',
      routeLabel: route,
    })),
  ...wave5Gap.bus.p2pRoutes.map(route => ({
    id: 'p2p-one-ayala-' + slugify(route),
    mode: 'bus',
    serviceClass: 'p2p-bus',
    routeLabel: route,
  })),
  ...wave5Gap.uvExpress.routes.map(route => ({
    id: 'uv-one-ayala-' + slugify(route),
    mode: 'uv-express',
    serviceClass: 'uv-express',
    routeLabel: route,
  })),
];

if (expectedCurrentRoutes.length !== 29) {
  problems.push(
    'Evidence-gap source should yield 29 promotable current routes after keeping EDSA Carousel at system level; found ' +
      expectedCurrentRoutes.length +
      '.'
  );
}

for (const expected of expectedCurrentRoutes) {
  const rowBlock = nextRecordSlice(expected.id, allRouteIds);

  if (!rowBlock) {
    problems.push('Missing corroborated current route: ' + expected.id);
    continue;
  }

  for (const marker of [
    "mode: '" + expected.mode + "'",
    "recordKind: 'current-service'",
    "disposition: 'current-service'",
    'routeLabel: ' + quote(expected.routeLabel) + ',',
    "originLabel: 'One Ayala Terminal'",
    'destinationLabel: ' + quote(expected.routeLabel) + ',',
    "serviceClass: '" + expected.serviceClass + "'",
    "terminalPlaceIds: ['one-ayala-terminal']",
    "evidenceClass: 'current-secondary-corroborated'",
    "'one-ayala-routes-spot-2026'",
    "'one-ayala-routes-windowseat-2026'",
    'geometryArtifactId: undefined',
  ]) {
    if (!rowBlock.includes(marker)) {
      problems.push(
        'Current route ' + expected.id + ' missing marker: ' + marker
      );
    }
  }

  if (/operator(Name)?:/i.test(rowBlock)) {
    problems.push(
      'Current route must not infer an operator from secondary roster evidence: ' +
        expected.id
    );
  }
}

const currentCityBusCount = expectedCurrentRoutes.filter(
  route => route.serviceClass === 'city-bus'
).length;
const currentP2PCount = expectedCurrentRoutes.filter(
  route => route.serviceClass === 'p2p-bus'
).length;
const currentUvCount = expectedCurrentRoutes.filter(
  route => route.serviceClass === 'uv-express'
).length;

if (currentCityBusCount !== 7 || currentP2PCount !== 10 || currentUvCount !== 12) {
  problems.push(
    'Promoted current-route class counts must be 7 city bus, 10 P2P and 12 UV.'
  );
}

if (routeBlock.includes("routeLabel: 'EDSA Carousel (Southbound)'")) {
  problems.push(
    'EDSA Carousel must remain represented by its canonical mobility system until system↔route membership is modeled.'
  );
}

if (routeBlock.includes("mode: 'tricycle'")) {
  problems.push(
    'W5-4c4 must not canonicalize tricycle/TODA routes without an MFRB/MATRIFED roster.'
  );
}

const placeBlock =
  placeSource
    .split('export const civicAssets: CivicAsset[] = [')[1]
    ?.split('\n];\n\nconst geometryTypeFor')[0] ?? '';

if (!placeBlock.includes("id: 'one-ayala-terminal'")) {
  problems.push(
    'Current One Ayala route records require canonical one-ayala-terminal Place.'
  );
}

const sourceIds = [
  ...sourceBlock.matchAll(/^    id: ['"]([^'"]+)['"],$/gm),
].map(match => match[1]);

if (sourceIds.length !== 31) {
  problems.push(
    'W5-4c4 expects 31 route sources: 29 prior sources + two corroborating One Ayala rosters; found ' +
      sourceIds.length +
      '.'
  );
}

if (
  (routeBlock.match(/geometryArtifactId: undefined/g) ?? []).length !==
  67
) {
  problems.push(
    'All 67 route records must remain geometry-less until route-geometry work.'
  );
}

for (const forbidden of ['lat:', 'lng:', 'polyline:', 'point:']) {
  if (routeBlock.includes(forbidden)) {
    problems.push(
      'Canonical routes must not invent point/polyline geometry: ' +
        forbidden
    );
  }
}

for (const marker of [
  'current-secondary-corroborated',
  'needs at least two independent sources',
  'two current terminal-roster sources',
]) {
  if (!routeSource.includes(marker)) {
    problems.push('Current-route runtime evidence guard missing: ' + marker);
  }
}

if (problems.length) {
  console.error(
    'Canonical mobility route check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Canonical mobility route check passed:',
    historicalIds.length + ' historical jeepney rows',
    currentOrSuccessorRows.length + ' current/successor jeepney corridors',
    unresolvedRows.length + ' unresolved jeepney rows',
    currentIds.length + ' corroborated current-only bus/UV routes',
    currentCityBusCount + ' city-bus routes',
    currentP2PCount + ' P2P routes',
    currentUvCount + ' UV Express routes',
    sourceIds.length + ' route sources',
    'EDSA Carousel kept at canonical system level',
    '0 tricycle/TODA promotions',
    '0 route geometry artifacts / fake points',
  ].join(' ')
);
