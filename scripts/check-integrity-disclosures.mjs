import { readFile } from 'node:fs/promises';

const entitySource = await readFile('src/data/integrityData.ts', 'utf8');
const disclosureSource = await readFile(
  'src/data/integrityDisclosures.ts',
  'utf8'
);

const problems = [];

const mappingStart = entitySource.indexOf(
  'const supplierEntityIdBySourceName: Record<string, string> = {'
);
const mappingEnd = entitySource.indexOf(
  'export const integrityProcurementSources'
);
const mappingBlock =
  mappingStart >= 0 && mappingEnd > mappingStart
    ? entitySource.slice(mappingStart, mappingEnd)
    : '';

const entityMappings = [
  ...mappingBlock.matchAll(/'([^']+)':\s*(?:\n\s*)?'([^']+)'/g),
].map(match => ({ name: match[1], id: match[2] }));

if (entityMappings.length !== 17) {
  problems.push(
    'Expected 17 normalized procurement entities; found ' +
      entityMappings.length +
      '.'
  );
}

for (const marker of [
  "id: 'bo-research-' + entity.id",
  "kind: 'beneficial-ownership'",
  "id: 'conflict-research-' + entity.id",
  "kind: 'conflict-of-interest'",
  "id: 'recusal-research-' + entity.id",
  "kind: 'recusal'",
  "status: 'unavailable'",
  "checkedOn: integrityDisclosureReviewed",
  'This is a retrieval status only and is not evidence of non-filing, concealment or absence of beneficial owners.',
  'No inference is made from the absence of a retrievable record.',
]) {
  if (!disclosureSource.includes(marker)) {
    problems.push('Missing disclosure research marker: ' + marker);
  }
}

for (const marker of [
  "id: 'gppb-ra12009-irr-2025'",
  "id: 'gppb-resolution-11-2025'",
  "id: 'psdbm-bo-registry-2026'",
  "id: 'sec-harbor-2026'",
  "id: 'makati-q3-2017-bid-results'",
]) {
  if (!disclosureSource.includes(marker)) {
    problems.push('Missing authoritative disclosure source: ' + marker);
  }
}

const historicalIds = [
  'historical-role-runr-rodel-paz-2017',
  'historical-role-tj-grill-adelbert-ramas-2017',
  'historical-role-jppm-benjamin-murie-2017',
];

for (const id of historicalIds) {
  if (!disclosureSource.includes("id: '" + id + "'")) {
    problems.push('Missing historical source-backed role disclosure: ' + id);
  }
}

for (const marker of [
  "subjectEntityId: 'supplier-runr-enterprise-and-services-company'",
  "relatedNameAsStated: 'Rodel Paz'",
  'Managing Partner',
  "subjectEntityId: 'supplier-tj-grill-corp'",
  "relatedNameAsStated: 'Adelbert Ramas'",
  "subjectEntityId: 'supplier-jppm-construction-and-supply'",
  "relatedNameAsStated: 'Benjamin Murie'",
  "status: 'source-backed'",
  "sourceIds: ['makati-q3-2017-bid-results']",
]) {
  if (!disclosureSource.includes(marker)) {
    problems.push('Missing historical disclosure evidence marker: ' + marker);
  }
}

for (const marker of [
  'It is not treated as current beneficial ownership',
  'It is not treated as a current beneficial-ownership declaration.',
  'BetterMakati does not infer that the 2017 owner label establishes current ownership or beneficial ownership in 2026.',
]) {
  if (!disclosureSource.includes(marker)) {
    problems.push('Missing historical-role non-inference guard: ' + marker);
  }
}

for (const forbidden of [
  'riskScore',
  'riskLevel',
  'corruptionScore',
  'redFlag',
  'suspectedConflict',
  'probableOwner',
  'likelyOwner',
]) {
  if (disclosureSource.includes(forbidden)) {
    problems.push(
      'Disclosure research must not contain inferential integrity fields: ' +
        forbidden
    );
  }
}

if (
  !disclosureSource.includes(
    'integrityProcurementEntities.flatMap('
  ) ||
  !disclosureSource.includes(
    '(entity): IntegrityDisclosureRecord[] => ['
  )
) {
  problems.push(
    'Entity-level disclosure research must be generated from the normalized procurement entity registry.'
  );
}

if (problems.length) {
  console.error(
    'Integrity disclosure research audit failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Integrity disclosure research audit passed: all 17 normalized procurement entities receive explicit BO/conflict/recusal retrieval classifications, with 3 historical role statements preserved only as source-stated evidence.'
);
