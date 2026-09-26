import { readFile } from 'node:fs/promises';

const relationships = await readFile(
  'src/data/reportCivicRelationships.ts',
  'utf8'
);
const reportsSource = await readFile('src/data/reports.ts', 'utf8');
const reportArticle = await readFile('src/pages/ReportArticle.tsx', 'utf8');
const statisticsPage = await readFile('src/pages/Statistics.tsx', 'utf8');
const accountabilityPage = await readFile(
  'src/pages/Accountability.tsx',
  'utf8'
);
const integrityPage = await readFile('src/pages/Integrity.tsx', 'utf8');
const statisticsRelationships = await readFile(
  'src/data/statisticsCivicRelationships.ts',
  'utf8'
);

const problems = [];

for (const marker of [
  'reportRecordRefs',
  'reportRecordRefToCivicRef',
  "case 'statistics-indicator'",
  "case 'legislation'",
  "case 'integrity-entity'",
  "case 'integrity-disclosure'",
  "case 'integrity-audit-finding'",
  "case 'place'",
  "case 'project'",
  "case 'accountability-entry'",
  'reportRecordRelationships',
  "kind: 'synthesizes' as const",
  "from: { type: 'report' as const, id: report.slug }",
  "basis: 'declared-analysis-input' as const",
  'The report is analysis of the record, not source evidence for it.',
  'createCivicIntelligenceRelationshipIndex',
  'reportRelatedRecords',
  'reportsForCivicRecord',
  'Unresolved report civic relationship source',
  'Unresolved report civic relationship target',
  'ecosystemRelationships: 0',
]) {
  if (!relationships.includes(marker)) {
    problems.push('Report relationship marker missing: ' + marker);
  }
}

if (relationships.includes("kind: 'evidence-for'")) {
  problems.push(
    'A report must not be stored as evidence-for an underlying canonical record.'
  );
}

for (const forbidden of [
  'fuzzy',
  'similarity',
  'levenshtein',
  'titleMatch',
  'keywordMatch',
]) {
  if (relationships.toLowerCase().includes(forbidden.toLowerCase())) {
    problems.push(
      'Report relationships must come from typed evidence references, not inferred text matching: ' +
        forbidden
    );
  }
}

const slugMatches = [
  ...reportsSource.matchAll(/slug:\s*'([^']+)'/g),
];
const slugs = slugMatches.map(match => match[1]);

if (slugs.length !== 5) {
  problems.push('Expected 5 current Featured Reports; found ' + slugs.length + '.');
}

for (let index = 0; index < slugMatches.length; index += 1) {
  const start = slugMatches[index].index ?? 0;
  const end =
    index + 1 < slugMatches.length
      ? slugMatches[index + 1].index ?? reportsSource.length
      : reportsSource.indexOf('export const publicationReports');
  const block = reportsSource.slice(
    start,
    end > start ? end : reportsSource.length
  );

  if (!block.includes('records:')) {
    problems.push(
      'Featured Report has no typed canonical record reference: ' + slugs[index]
    );
  }
}

for (const marker of [
  "import { reportRelatedRecords } from '../data/reportCivicRelationships'",
  'const underlyingRecords = reportRelatedRecords(report.slug)',
  'Underlying records',
  'Records synthesized in this report',
  'underlyingRecords.map',
]) {
  if (!reportArticle.includes(marker)) {
    problems.push('Report article underlying-record marker missing: ' + marker);
  }
}

for (const marker of [
  "import { reportsForCivicRecord } from '../data/reportCivicRelationships'",
  "reportsForCivicRecord({ type: 'indicator', id: 'population-total' })",
  "id: 'population-growth-rate'",
  'Related analysis',
]) {
  if (!statisticsPage.includes(marker)) {
    problems.push('Statistics report-backlink marker missing: ' + marker);
  }
}

for (const marker of [
  "import { reportsForCivicRecord } from '../data/reportCivicRelationships'",
  "type: 'accountability-record'",
  'const analysisLinks = reportsForCivicRecord',
  'Analysis: {item.node.label}',
]) {
  if (!accountabilityPage.includes(marker)) {
    problems.push('Accountability report-backlink marker missing: ' + marker);
  }
}

for (const marker of [
  "import { reportsForCivicRecord } from '../data/reportCivicRelationships'",
  "recordKind: 'audit-finding'",
  'const analysisLinks = reportsForCivicRecord',
  'Analysis: {item.node.label}',
]) {
  if (!integrityPage.includes(marker)) {
    problems.push('Integrity report-backlink marker missing: ' + marker);
  }
}

for (const forbidden of [
  "from './reports'",
  "from './reportTypes'",
  'reportIndicatorRelationships',
]) {
  if (statisticsRelationships.includes(forbidden)) {
    problems.push(
      'Statistics must not keep a second copy of report-owned relationships: ' +
        forbidden
    );
  }
}

if (
  !reportsSource.includes("recordType: 'statistics-indicator'") ||
  !reportsSource.includes("recordType: 'accountability-entry'") ||
  !reportsSource.includes("recordType: 'integrity-audit-finding'")
) {
  problems.push(
    'Current report evidence must retain typed Statistics, Accountability and Integrity record references.'
  );
}

if (problems.length) {
  console.error(
    'Report Civic Intelligence relationship check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Report Civic Intelligence relationship check passed: all 5 current reports declare canonical records, each unique edge is stored once as report -> record synthesis, report articles expose underlying records, Statistics/Accountability/Integrity derive reverse analysis links, and no report is treated as source evidence for its inputs.'
);
