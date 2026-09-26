import { readFile } from 'node:fs/promises';

const auditSource = await readFile(
  'src/data/integrityAuditTrails.ts',
  'utf8'
);
const accountabilitySource = await readFile(
  'src/data/accountabilitySupplement.ts',
  'utf8'
);

const problems = [];

const expectedFindingEntryIds = [
  'audit-2017-development-fund-loan-payments',
  'audit-2018-deped-cash-advances',
  'audit-2018-sef-eligibility',
];

for (const id of expectedFindingEntryIds) {
  if (!auditSource.includes("'" + id + "'")) {
    problems.push('Missing canonical audit finding entry: ' + id);
  }
}

for (const marker of [
  'export const integrityAuditFindings: AuditFindingRecord[]',
  'export const integrityAuditActions: AuditCorrectiveActionEvidence[]',
  'export const integrityAuditResolutionTrails: AuditResolutionTrail[]',
  'export const integrityAuditSourceOnlyRecords',
  "status: 'unresolved'",
  "continuityBasis: 'explicit-finding-reference'",
  "continuityBasis: 'unresolved'",
  "kind: 'management-response'",
  "kind: 'later-audit-status'",
  "kind: 'implementation-evidence'",
]) {
  if (!auditSource.includes(marker)) {
    problems.push('Missing audit-trail marker: ' + marker);
  }
}

const findingIds = [
  ...auditSource.matchAll(/id: 'finding-([^']+)'/g),
].map(match => match[1]);

if (findingIds.length !== 0) {
  problems.push(
    'Finding IDs should be derived from Accountability entry IDs, not hard-coded literals.'
  );
}

const actionIds = [
  ...auditSource.matchAll(/id: 'action-([^']+)'/g),
].map(match => match[1]);

if (actionIds.length !== 4) {
  problems.push(
    'Expected 4 explicit audit action records; found ' + actionIds.length + '.'
  );
}

const unresolvedCount = (
  auditSource.match(/status: 'unresolved'/g) ?? []
).length;

if (unresolvedCount !== 3) {
  problems.push(
    'Expected exactly 3 explicitly unresolved resolution trails; found ' +
      unresolvedCount +
      '.'
  );
}

for (const marker of [
  'does not establish that the recommendation was later implemented or closed',
  'Aggregate implementation counts are not used to infer the status of this specific 2017 recommendation.',
  'contextual follow-up rather than closure evidence',
  'do not contain an item-level implementation-status reference explicitly closing the 2018 ₱30.793M finding',
]) {
  if (!auditSource.includes(marker)) {
    problems.push('Missing non-inference audit guard: ' + marker);
  }
}

if (
  !auditSource.includes(
    "entry.notes?.[0] ??"
  ) ||
  !accountabilitySource.includes(
    "id: 'audit-2024-sef-compliance-report'"
  ) ||
  !accountabilitySource.includes(
    'Observation-level findings and recommendations therefore remain pending source retrieval.'
  )
) {
  problems.push(
    '2024 SEF compliance audit must remain source-only pending finding-level retrieval.'
  );
}

for (const forbidden of [
  "status: 'implemented-as-stated'",
  "status: 'partially-implemented-as-stated'",
  "status: 'not-acted-on-as-stated'",
  "status: 'open-as-stated'",
]) {
  if (auditSource.includes(forbidden)) {
    problems.push(
      'W4-3e must not infer a resolved status from the current audit evidence: ' +
        forbidden
    );
  }
}

if (problems.length) {
  console.error(
    'Integrity audit-trail check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Integrity audit-trail check passed: 3 finding-level records, 4 follow-up/action records, 3 explicitly unresolved trails, and 1 source-only audit record pending finding-level retrieval.'
);
