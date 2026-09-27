import { readFile } from 'node:fs/promises';

const [routeSource, wave3Source] = await Promise.all([
  readFile('src/data/mobilityRoutes.ts', 'utf8'),
  readFile('data/wave3-civic-map-transport-reconciliation.json', 'utf8'),
]);

const wave3 = JSON.parse(wave3Source);
const problems = [];

const jeepneyFamily = wave3.familyReconciliation?.find(
  family => family.family === 'Public utility jeepney routes'
);

if (!jeepneyFamily) {
  problems.push(
    'Wave 3 source no longer contains the Public utility jeepney routes family.'
  );
}

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
  'export interface MobilityRouteCorridorRecord',
  'historical:',
  'associationLabel: string',
  'currentEvidenceSourceIds: string[]',
  "associationContinuity: 'verified' | 'unverified' | 'not-applicable'",
  'geometryArtifactId?: string',
  'validateMobilityRouteCorridors',
  'currentOrSuccessorJeepneyCorridors',
  'unresolvedJeepneyRows',
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

const canonicalRouteIds = [
  ...routeBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);

if (canonicalRouteIds.length !== 38) {
  problems.push(
    'W5-4c2 expects exactly 38 migrated jeepney route rows; found ' +
      canonicalRouteIds.length +
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

if (canonicalPublishedNumbers.includes(36)) {
  problems.push('Historical row 36 was invented during migration.');
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

for (const row of wave3Rows) {
  const id =
    'jeepney-2020-' + String(row.publishedNo).padStart(2, '0');
  const start = routeBlock.indexOf("id: '" + id + "'");

  if (start < 0) {
    problems.push('Missing migrated jeepney route row: ' + id);
    continue;
  }

  const nextIdIndex = canonicalRouteIds
    .map(nextId => routeBlock.indexOf("id: '" + nextId + "'", start + 1))
    .filter(index => index > start)
    .sort((a, b) => a - b)[0];

  const rowBlock = routeBlock.slice(
    start,
    nextIdIndex ?? routeBlock.length
  );

  const expectedMarkers = [
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
  ];

  for (const marker of expectedMarkers) {
    if (!rowBlock.includes(marker)) {
      problems.push(
        'Migrated jeepney row ' +
          row.publishedNo +
          ' does not preserve Wave 3 field: ' +
          marker
      );
    }
  }

  if (
    dispositionFor(row.currentStatus) !== 'unresolved-current-status' &&
    !row.currentEvidence.length
  ) {
    problems.push(
      'Wave 3 current/successor row unexpectedly has no current evidence: ' +
        row.publishedNo
    );
  }

  const evidenceIdCount =
    rowBlock
      .match(/currentEvidenceSourceIds: \[([^\]]*)\]/)?.[1]
      ?.match(/jeepney-current-route-ref-/g)?.length ?? 0;

  if (evidenceIdCount !== row.currentEvidence.length) {
    problems.push(
      'Migrated jeepney row ' +
        row.publishedNo +
        ' current-evidence reference count differs from Wave 3: expected ' +
        row.currentEvidence.length +
        ', found ' +
        evidenceIdCount +
        '.'
    );
  }

  for (const evidence of row.currentEvidence) {
    if (!sourceBlock.includes('url: ' + quote(evidence.url) + ',')) {
      problems.push(
        'Current route evidence URL was not migrated into canonical sources: row ' +
          row.publishedNo +
          ' -> ' +
          evidence.url
      );
    }
  }
}

for (const row of unresolvedRows) {
  const id =
    'jeepney-2020-' + String(row.publishedNo).padStart(2, '0');
  const start = routeBlock.indexOf("id: '" + id + "'");
  const rowBlock = routeBlock.slice(start, start + 2200);
  if (!rowBlock.includes('disposition: "unresolved-current-status"')) {
    problems.push(
      'Unresolved Wave 3 row was promoted as current: ' + row.publishedNo
    );
  }
}

const sourceIds = [
  ...sourceBlock.matchAll(/^    id: ['"]([^'"]+)['"],$/gm),
].map(match => match[1]);

if (sourceIds.length !== 29) {
  problems.push(
    'W5-4c2 expects 29 route source records: one official historical inventory + 28 unique current references; found ' +
      sourceIds.length +
      '.'
  );
}

if (
  !sourceBlock.includes(
    "id: 'makati-facts-figures-2020-transport'"
  ) ||
  !sourceBlock.includes("kind: 'official-primary'")
) {
  problems.push(
    'Official Makati Facts and Figures 2020 transport inventory source is missing.'
  );
}

const currentReferenceUrls = new Set(
  wave3Rows.flatMap(row =>
    row.currentEvidence.map(evidence => evidence.url)
  )
);

if (currentReferenceUrls.size !== 28) {
  problems.push(
    'Wave 3 expected 28 unique current jeepney reference URLs; found ' +
      currentReferenceUrls.size +
      '.'
  );
}

if (
  (routeBlock.match(/associationContinuity: 'unverified'/g) ?? [])
    .length !== 38
) {
  problems.push(
    'All 38 historical jeepney association labels must remain continuity-unverified.'
  );
}

if (
  (routeBlock.match(/geometryArtifactId: undefined/g) ?? []).length !== 38
) {
  problems.push(
    'All 38 migrated jeepney rows must remain geometry-less in W5-4c2.'
  );
}

for (const forbidden of ['lat:', 'lng:', 'polyline:', 'point:']) {
  if (routeBlock.includes(forbidden)) {
    problems.push(
      'W5-4c2 route migration must not invent route points/geometry: ' +
        forbidden
    );
  }
}

const unresolvedNumbers = unresolvedRows.map(row => row.publishedNo);
if (JSON.stringify(unresolvedNumbers) !== JSON.stringify([24, 29, 37])) {
  problems.push(
    'Unresolved route set changed; expected historical rows 24, 29 and 37.'
  );
}

if (problems.length) {
  console.error(
    'Canonical jeepney route migration check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Canonical jeepney route migration check passed:',
    canonicalRouteIds.length + ' historical rows preserved',
    currentOrSuccessorRows.length + ' current/successor corridors',
    unresolvedRows.length + ' unresolved rows (24, 29, 37)',
    sourceIds.length + ' canonical route sources',
    currentReferenceUrls.size + ' unique current references',
    '0 operator/association continuity claims',
    '0 route geometry artifacts / fake points',
  ].join(' ')
);
