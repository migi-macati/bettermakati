import { readFile } from 'node:fs/promises';

const schema = await readFile('src/data/reportTypes.ts', 'utf8');
const reports = await readFile('src/data/reports.ts', 'utf8');

const problems = [];

for (const marker of [
  'export interface FeaturedReportV2',
  'schemaVersion: 2',
  'synthesis: string',
  'sections: [ReportSectionV2, ...ReportSectionV2[]]',
  'sources: [ReportSourceV2, ...ReportSourceV2[]]',
  'methodology?: ReportMethodologyNote',
  "role: 'fact'",
  "role: 'analysis' | 'context'",
  'evidence: ReportEvidenceRef',
  "kind: 'stat'",
  "kind: 'table'",
  "kind: 'chart'",
  "chartType: 'bar' | 'column' | 'line'",
  "recordType: 'statistics-indicator'",
  "recordType: 'legislation'",
  "'integrity-entity'",
  "'integrity-disclosure'",
  "'integrity-audit-finding'",
  "recordType: 'place'",
  "recordType: 'project'",
  "recordType: 'accountability-entry'",
  "sourceKind: ReportSourceKind",
  "sourceIds: [string, ...string[]]",
]) {
  if (!schema.includes(marker)) {
    problems.push('Report schema v2 marker missing: ' + marker);
  }
}

for (const marker of [
  "'canonical-internal'",
  "'official-external'",
  "'secondary'",
]) {
  if (!schema.includes(marker)) {
    problems.push('Report source-kind marker missing: ' + marker);
  }
}

if (!schema.includes('The report\'s one publishable synthesis')) {
  problems.push('Schema must document the one-synthesis editorial rule.');
}

if (
  !schema.includes(
    'Use only when a definition, comparison basis, transformation or limitation'
  )
) {
  problems.push(
    'Methodology must remain optional and limited to material interpretive needs.'
  );
}

for (const forbidden of [
  'overview: string',
  'executiveSummary',
  'multipleSyntheses',
  'completenessStatus',
  'qualityScore',
]) {
  if (schema.includes(forbidden)) {
    problems.push('Report schema contains unwanted meta field: ' + forbidden);
  }
}

const currentSlugs = [
  ...reports.matchAll(/slug:\s*'([^']+)'/g),
].map(match => match[1]);

if (!reports.includes('schemaVersion: 2')) {
  problems.push('Published Featured Reports must use schema v2 after W4-4c.');
}

if (currentSlugs.length !== 3) {
  problems.push(
    'Expected 3 canonical v2 report objects after the audited merge; found ' +
      currentSlugs.length +
      '.'
  );
}

if (reports.includes('paragraphs:')) {
  problems.push('Legacy v1 paragraph arrays must not remain after W4-4c.');
}

if (problems.length) {
  console.error(
    'Report schema v2 check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Report schema v2 check passed: the v2 contract remains intact and the 3 canonical published reports use it without legacy v1 paragraph arrays.'
);
