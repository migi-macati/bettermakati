import { readFile } from 'node:fs/promises';
import { readReportModuleSources } from './read-report-module-sources.mjs';

const relationships = await readFile(
  'src/data/reportCivicRelationships.ts',
  'utf8'
);
const reportsSource = await readReportModuleSources();
const reportArticle = await readFile('src/pages/ReportArticle.tsx', 'utf8');
const statisticsPage = await readFile('src/pages/Statistics.tsx', 'utf8');
const accountabilityPage = await readFile(
  'src/pages/Accountability.tsx',
  'utf8'
);
const integrityPage = await readFile('src/pages/Integrity.tsx', 'utf8');
const legislationPage = await readFile('src/pages/Legislation.tsx', 'utf8');
const civicAssetPage = await readFile('src/pages/CivicAsset.tsx', 'utf8');
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

for (const marker of [
  "import { reportsForCivicRecord } from '../data/reportCivicRelationships'",
  "type: 'legislation-record'",
  '...reportsForCivicRecord',
]) {
  if (!legislationPage.includes(marker)) problems.push('Legislation report-backlink marker missing: ' + marker);
}

for (const marker of [
  "import { reportsForCivicRecord } from '../data/reportCivicRelationships'",
  "type: 'place'",
  'localizedReportCopy(report, i18n.language).headline',
  'label="Related analysis"',
]) {
  if (!civicAssetPage.includes(marker)) problems.push('Civic Map place report-backlink marker missing: ' + marker);
}

for (const marker of ["id: 'ordinance-2019-a-020'", "id: 'resolution-2026-008'", "id: 'resolution-2026-011'", "id: 'ordinance-2026-015'"]) {
  if (!reportsSource.includes(marker)) problems.push('Subway report legislation reference missing: ' + marker);
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

const slugMatches = [...reportsSource.matchAll(/slug:\s*'([^']+)'/g)];
const slugs = slugMatches.map(match => match[1]);

if (slugs.length < 5) {
  problems.push(
    'Expected at least 5 current Featured Reports; found ' + slugs.length + '.'
  );
}

for (let index = 0; index < slugMatches.length; index += 1) {
  const start = slugMatches[index].index ?? 0;
  const end =
    index + 1 < slugMatches.length
      ? (slugMatches[index + 1].index ?? reportsSource.length)
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
  'reportRelatedRecords,',
  "from '../data/reportCivicRelationships'",
  'const underlyingRecords = reportRelatedRecords(report.slug)',
  'Records',
  'Related records',
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
  "import { useTranslation } from 'react-i18next'",
  "import { findReport } from '../data/reports'",
  "import { localizedReportCopy } from '../data/reportTranslations'",
  'const economyAnalysisLinks = [',
  "'real-gdp-level'",
  "'real-gdp-growth'",
  "'gdp-national-share'",
  "'gdp-ncr-share'",
  "'industry-gva'",
  "'gdp-per-capita'",
  'localizedReportCopy(report, i18n.language).headline',
]) {
  if (!statisticsPage.includes(marker)) {
    problems.push(
      'Statistics economy-report backlink marker missing: ' + marker
    );
  }
}

for (const marker of [
  "import { reportsForCivicRecord } from '../data/reportCivicRelationships'",
  "type: 'accountability-record'",
  'const analysisLinks = reportsForCivicRecord',
  'Related analysis',
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
  'Report Civic Intelligence relationship check passed: all current reports declare canonical records, each unique edge is stored once as report -> record synthesis, report articles expose underlying records, Statistics/Accountability/Integrity derive reverse analysis links, and no report is treated as source evidence for its inputs.'
);
