import { readFile } from 'node:fs/promises';

const reports = await readFile('src/data/reports.ts', 'utf8');
const auditTrails = await readFile(
  'src/data/integrityAuditTrails.ts',
  'utf8'
);
const flagship = JSON.parse(
  await readFile('data/wave4-records-flagship.json', 'utf8')
);

const problems = [];

if (
  !Array.isArray(flagship.publishedReportSlugs) ||
  flagship.publishedReportSlugs.length !== 1
) {
  problems.push('W4-4e must publish exactly one records-derived report.');
}

const slug = flagship.publishedReportSlugs?.[0];
if (slug !== 'audit-follow-up-closure-trails') {
  problems.push('Unexpected records flagship slug: ' + slug);
}

if (
  (reports.match(/slug:\s*'audit-follow-up-closure-trails'/g) ?? [])
    .length !== 1
) {
  problems.push('Records flagship report must appear exactly once.');
}

for (const marker of [
  'integrityAuditFindings',
  'integrityAuditActions',
  'integrityAuditResolutionTrails',
  'integrityAuditSourceOnlyRecords',
  "recordType: 'integrity-audit-finding'",
  "recordType: 'accountability-entry'",
  'Item-level closure not established',
  'This is a statement about the continuity of the indexed public record, not a conclusion that the underlying condition continued after the audit period.',
  'The report therefore does not claim that all Makati audit findings remain open',
  'does not provide a finding-specific chain from recommendation to an explicit implementation or closure status',
  '“Closure” is used only when a later source explicitly maps back to the same finding or recommendation',
]) {
  if (!reports.includes(marker)) {
    problems.push('Records flagship marker missing: ' + marker);
  }
}

const findingIds = (
  auditTrails.match(/findingId\('audit-[^']+'/g) ?? []
).filter((value, index, values) => values.indexOf(value) === index);
const actionIds = auditTrails.match(/id: 'action-/g) ?? [];
const unresolvedTrails =
  auditTrails.match(/status: 'unresolved'/g) ?? [];

if (findingIds.length !== 3) {
  problems.push(
    'Expected 3 canonical finding-level audit records; found ' +
      findingIds.length +
      '.'
  );
}
if (actionIds.length !== 4) {
  problems.push(
    'Expected 4 canonical audit follow-up/action records; found ' +
      actionIds.length +
      '.'
  );
}
if (unresolvedTrails.length !== 3) {
  problems.push(
    'Expected 3 explicitly unresolved documentary trails; found ' +
      unresolvedTrails.length +
      '.'
  );
}

const inputs = flagship.canonicalRecordInputs ?? {};
for (const [key, expected] of Object.entries({
  findingLevelAuditRecords: 3,
  followUpActionRecords: 4,
  resolutionTrails: 3,
  sourceOnlyAuditRecords: 1,
})) {
  if (inputs[key] !== expected) {
    problems.push(
      'Records flagship metadata mismatch for ' +
        key +
        ': expected ' +
        expected +
        ', found ' +
        inputs[key]
    );
  }
}

for (const forbidden of [
  'corrupt',
  'corruption',
  'fraud',
  'guilty',
  'ongoing violation',
  'still violating',
  'proof of wrongdoing',
]) {
  if (reports.toLowerCase().includes(forbidden)) {
    problems.push(
      'Records flagship must not infer wrongdoing or continuing violation: ' +
        forbidden
    );
  }
}

if (
  !reports.includes(
    "source.sourceClass === 'secondary-reporting'"
  ) ||
  !reports.includes("'secondary' as const")
) {
  problems.push(
    'Secondary reporting used by the audit layer must remain explicitly typed as secondary.'
  );
}

if (problems.length) {
  console.error(
    'Records flagship report check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Records flagship report check passed: exactly one W4-4e report uses 3 finding-level audit trails and 4 follow-up records, preserves source class, and does not turn documentary continuity gaps into findings of wrongdoing or continuing violation.'
);
