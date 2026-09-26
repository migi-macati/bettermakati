import { readFile } from 'node:fs/promises';

const source = await readFile('src/data/integrityTypes.ts', 'utf8');
const problems = [];

for (const marker of [
  'export interface IntegrityEntity',
  "kind: IntegrityEntityKind",
  'export interface ProcurementAwardRecord',
  'export interface ProcurementContractRecord',
  'export interface IntegrityDisclosureRecord',
  'export interface AuditFindingRecord',
  'export interface AuditCorrectiveActionEvidence',
  'export interface AuditResolutionTrail',
  "'source-backed'",
  "'unavailable' | 'restricted' | 'not-applicable' | 'not-researched'",
  "'source-not-found'",
  "'source-inaccessible'",
  "'not-researched'",
  "'not-applicable'",
  "'explicit-finding-reference'",
  "'explicit-recommendation-reference'",
  "'exact-record-reference'",
  "'unresolved'",
  "'implemented-as-stated'",
  "'partially-implemented-as-stated'",
  "'not-acted-on-as-stated'",
]) {
  if (!source.includes(marker)) {
    problems.push('Missing integrity schema marker: ' + marker);
  }
}

for (const forbidden of [
  'riskScore:',
  'integrityScore:',
  'corruptionScore:',
  'riskLevel:',
  'redFlag:',
  'suspicious:',
  'wrongdoing:',
  'guiltScore:',
]) {
  if (source.includes(forbidden)) {
    problems.push('Forbidden inferential integrity field present: ' + forbidden);
  }
}

if (!source.includes("sourceIds: [string, ...string[]]")) {
  problems.push(
    'Source-backed disclosure claims must require at least one explicit source ID.'
  );
}

if (
  !source.includes("status: 'unresolved';") ||
  !source.includes('reason: string;')
) {
  problems.push(
    'Audit resolution schema must support an explicit unresolved state with a reason.'
  );
}

if (
  !source.includes("status: IntegrityEvidenceAvailability") ||
  !source.includes('checkedOn?: string;') ||
  !source.includes('sourceIds: string[];') ||
  !source.includes('note: string;')
) {
  problems.push(
    'Evidence-gap checks must preserve status, check date, checked sources and a note.'
  );
}

if (problems.length) {
  console.error('Integrity schema audit failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'Integrity schema audit passed: entity, procurement, disclosure and audit evidence types preserve provenance and explicit unresolved/source-gap states without risk scoring.'
);
