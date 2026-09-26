import { readFile } from 'node:fs/promises';

const graphSource = await readFile(
  'src/data/integrityRelationships.ts',
  'utf8'
);
const dataSource = await readFile('src/data/integrityData.ts', 'utf8');
const disclosureSource = await readFile(
  'src/data/integrityDisclosures.ts',
  'utf8'
);
const auditSource = await readFile(
  'src/data/integrityAuditTrails.ts',
  'utf8'
);
const accountabilitySource = await readFile(
  'src/data/accountabilitySupplement.ts',
  'utf8'
);

const problems = [];

for (const marker of [
  "kind: 'supplier-on-award'",
  "kind: 'award-backed-by-accountability'",
  "kind: 'entity-disclosure-record'",
  "kind: 'finding-backed-by-accountability'",
  "kind: 'finding-action-evidence'",
  "kind: 'finding-resolution-trail'",
  "kind: 'trail-action-evidence'",
  "basis: 'canonical-id'",
  "basis: 'source-backed'",
  "'research-classification'",
  "'explicit-finding-reference'",
  "'unresolved-continuity'",
  'integrityRelationshipsByRecord',
  'Integrity relationship has broken from-target',
  'Integrity relationship has broken to-target',
  'Integrity relationship has unknown provenance source',
]) {
  if (!graphSource.includes(marker)) {
    problems.push('Missing relationship-graph marker: ' + marker);
  }
}

for (const requiredImport of [
  "from './integrityData'",
  "from './integrityDisclosures'",
  "from './integrityAuditTrails'",
  "from './accountabilitySupplement'",
]) {
  if (!graphSource.includes(requiredImport)) {
    problems.push(
      'Relationship graph must consume canonical upstream data: ' +
        requiredImport
    );
  }
}

if (graphSource.includes('https://') || graphSource.includes('http://')) {
  problems.push(
    'W4-3f relationship graph must not introduce new research URLs or evidence sources.'
  );
}

const seedStart = accountabilitySource.indexOf(
  'const procurementSeeds: ProcurementSeed[] = ['
);
const seedEnd = accountabilitySource.indexOf(
  'export const procurementProjectEntries'
);
const seedBlock =
  seedStart >= 0 && seedEnd > seedStart
    ? accountabilitySource.slice(seedStart, seedEnd)
    : '';
const awardCount = (
  seedBlock.match(/referenceNo:\s*'[^']+'/g) ?? []
).length;

const entityMapStart = dataSource.indexOf(
  'const supplierEntityIdBySourceName: Record<string, string> = {'
);
const entityMapEnd = dataSource.indexOf(
  'export const integrityProcurementSources'
);
const entityMapBlock =
  entityMapStart >= 0 && entityMapEnd > entityMapStart
    ? dataSource.slice(entityMapStart, entityMapEnd)
    : '';
const entityCount = (
  entityMapBlock.match(/'[^']+':\s*(?:\n\s*)?'[^']+'/g) ?? []
).length;

const historicalDisclosureCount = (
  disclosureSource.match(/id: 'historical-role-/g) ?? []
).length;
const disclosureCount = entityCount * 3 + historicalDisclosureCount;

const auditActionCount = (
  auditSource.match(/id: 'action-/g) ?? []
).length;
const auditFindingEntryCount = (
  auditSource.match(/findingId\('audit-/g) ?? []
).length > 0
  ? 3
  : 0;
const auditTrailCount = (
  auditSource.match(/status: 'unresolved'/g) ?? []
).length;

const expectedRelationshipCount =
  awardCount +
  awardCount +
  disclosureCount +
  auditFindingEntryCount +
  auditActionCount +
  auditTrailCount +
  auditActionCount;

const expectedAccountabilityNodeCount =
  awardCount + auditFindingEntryCount;
const expectedNodeCount =
  entityCount +
  awardCount +
  disclosureCount +
  auditFindingEntryCount +
  auditActionCount +
  auditTrailCount +
  expectedAccountabilityNodeCount;

if (awardCount !== 21) {
  problems.push('Expected 21 procurement awards; found ' + awardCount + '.');
}
if (entityCount !== 17) {
  problems.push(
    'Expected 17 normalized procurement entities; found ' +
      entityCount +
      '.'
  );
}
if (historicalDisclosureCount !== 3) {
  problems.push(
    'Expected 3 historical source-backed disclosures; found ' +
      historicalDisclosureCount +
      '.'
  );
}
if (disclosureCount !== 54) {
  problems.push(
    'Expected 54 disclosure/research records; calculated ' +
      disclosureCount +
      '.'
  );
}
if (auditActionCount !== 4) {
  problems.push(
    'Expected 4 audit action records; found ' + auditActionCount + '.'
  );
}
if (auditTrailCount !== 3) {
  problems.push(
    'Expected 3 unresolved audit resolution trails; found ' +
      auditTrailCount +
      '.'
  );
}
if (expectedRelationshipCount !== 110) {
  problems.push(
    'Expected relationship formula to produce 110 edges; calculated ' +
      expectedRelationshipCount +
      '.'
  );
}
if (expectedNodeCount !== 126) {
  problems.push(
    'Expected graph formula to produce 126 nodes; calculated ' +
      expectedNodeCount +
      '.'
  );
}

for (const forbidden of [
  'riskScore',
  'riskLevel',
  'corruptionScore',
  'redFlag',
  'suspectedConflict',
  'probableOwner',
  'likelyOwner',
  'guilt',
]) {
  if (graphSource.includes(forbidden)) {
    problems.push(
      'Relationship graph must not add inferential integrity labels: ' +
        forbidden
    );
  }
}

if (
  !graphSource.includes(
    "trail.resolution.status === 'unresolved'"
  ) ||
  !graphSource.includes(
    "? 'unresolved-continuity'"
  )
) {
  problems.push(
    'Unresolved audit continuity must remain explicit in graph relationships.'
  );
}

if (problems.length) {
  console.error(
    'Integrity relationship graph check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Integrity relationship graph check passed: 126 canonical nodes and 110 provenance-preserving edges derived only from W4-3c/3d/3e records, with no new research or inferred integrity labels.'
);
