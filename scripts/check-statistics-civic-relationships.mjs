import { readFile } from 'node:fs/promises';

const relationships = await readFile(
  'src/data/statisticsCivicRelationships.ts',
  'utf8'
);
const ecosystem = await readFile(
  'src/data/ecosystemResources.ts',
  'utf8'
);
const reportRelationships = await readFile(
  'src/data/reportCivicRelationships.ts',
  'utf8'
);
const statisticsPage = await readFile('src/pages/Statistics.tsx', 'utf8');
const barangayPage = await readFile('src/pages/BarangayProfile.tsx', 'utf8');
const reports = await readFile('src/data/reports.ts', 'utf8');

const problems = [];

for (const marker of [
  'populationBarangayRelationships',
  "from: { type: 'indicator', id: 'population-total' }",
  "to: { type: 'barangay', id: barangay.slug }",
  "basis: 'explicit-geography'",
  "sourceIds: ['psa-psgc-makati-current']",
  "'statistics-real-gdp-bettergov-data-research'",
  "'statistics-gdp-per-capita-bettergov-open-data'",
  "basis: 'curated-ecosystem-context'",
  'statisticsCivicRelationshipIndex',
  'statisticsCivicNodeResolver',
  'Unresolved Statistics relationship source',
  'Unresolved Statistics relationship target',
  'inferredPlaceLinks: 0',
  'inferredServiceLinks: 0',
  'inferredProjectOrAccountabilityLinks: 0',
  'betterLguIndicatorLinks: 0',
]) {
  if (!relationships.includes(marker)) {
    problems.push('Statistics relationship marker missing: ' + marker);
  }
}

for (const marker of [
  "'data-research'",
  "'open-data'",
  "'betterlgu'",
  "role: 'national-data-context'",
  "role: 'cross-lgu-discovery'",
  'Cross-LGU discovery route, not a statistical comparison source.',
]) {
  if (!ecosystem.includes(marker)) {
    problems.push('Ecosystem resource marker missing: ' + marker);
  }
}

for (const marker of [
  "import { statisticsRelatedRecords } from '../data/statisticsCivicRelationships'",
  "import { reportsForCivicRecord } from '../data/reportCivicRelationships'",
  "reportsForCivicRecord({ type: 'indicator', id: 'population-total' })",
  "type: 'indicator'",
  "id: 'population-growth-rate'",
  "statisticsRelatedRecords('real-gdp-level')",
  "statisticsRelatedRecords('gdp-per-capita')",
  'Related analysis',
  'National data context',
]) {
  if (!statisticsPage.includes(marker)) {
    problems.push('Statistics page relationship UI marker missing: ' + marker);
  }
}

if (
  !barangayPage.includes("withBarangayScope('/statistics', barangay.slug)") ||
  !statisticsPage.includes("to={'/barangays/' + barangay.slug}")
) {
  problems.push(
    'Barangay and scoped Statistics pages must retain reciprocal public navigation.'
  );
}

for (const forbidden of [
  "to: { type: 'place'",
  "to: { type: 'segment'",
  "to: { type: 'route'",
  "to: { type: 'service'",
  "to: { type: 'project'",
  "to: { type: 'accountability-record'",
]) {
  if (relationships.includes(forbidden)) {
    problems.push(
      'W4-5b must not infer record-level attribution from aggregate Statistics indicators: ' +
        forbidden
    );
  }
}

if (
  relationships.includes(
    "type: 'ecosystem-resource',\n      id: 'betterlgu'"
  )
) {
  problems.push(
    'BetterLGU must not be attached to an indicator as statistical evidence/context in W4-5b.'
  );
}

for (const reportSlug of [
  '2024-barangay-population',
  '2024-population-growth-acceleration',
]) {
  if (!reports.includes("slug: '" + reportSlug + "'")) {
    problems.push('Expected population report missing: ' + reportSlug);
  }
}

if (
  !reports.includes("recordType: 'statistics-indicator'") ||
  !reports.includes("id: 'population-total'") ||
  !reports.includes("id: 'population-growth-rate'")
) {
  problems.push(
    'Statistics-to-report edges must remain derived from typed v2 report evidence references.'
  );
}

for (const marker of [
  'reportRecordRefs',
  "case 'statistics-indicator'",
  "kind: 'synthesizes' as const",
  "basis: 'declared-analysis-input' as const",
  'reportsForCivicRecord',
]) {
  if (!reportRelationships.includes(marker)) {
    problems.push(
      'Report-owned Statistics analysis relationship marker missing: ' + marker
    );
  }
}

for (const forbidden of [
  "from './reports'",
  "from './reportTypes'",
  'reportIndicatorRelationships',
]) {
  if (relationships.includes(forbidden)) {
    problems.push(
      'Statistics must not duplicate report-owned relationship edges: ' + forbidden
    );
  }
}

if (problems.length) {
  console.error(
    'Statistics Civic Intelligence relationship check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Statistics Civic Intelligence relationship check passed: canonical 2024 population is connected to all barangays, report analysis edges are owned once by the report graph, two BetterGov continuations are curated, and no aggregate indicator is falsely attributed to a place, service, project or Accountability record.'
);
