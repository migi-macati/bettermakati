import { readFile } from 'node:fs/promises';

const catalog = await readFile('src/data/publicRecords.ts', 'utf8');
const page = await readFile('src/pages/PublicRecords.tsx', 'utf8');
const generator = await readFile('scripts/generate-site-files.mjs', 'utf8');
const watchlist = JSON.parse(await readFile('data/source-watchlist.json', 'utf8'));
const budget = await readFile('src/data/budget2025.ts', 'utf8');
const services = await readFile('src/data/serviceDirectory.ts', 'utf8');
const serviceDetails = await readFile('src/data/serviceGuideDetails.ts', 'utf8');

const problems = [];

for (const source of [
  'accountabilityEntries',
  'annualBudgetDocuments',
  'actualFiscalHistory',
  'cityMonitorSources',
  'election2025Sources',
  'makatiMayoralHistory',
  'makatiHistory',
  'barangays',
  'serviceDirectory',
  'serviceGuideDetails',
]) {
  if (!catalog.includes(source)) {
    problems.push('Public Records catalog lost source integration: ' + source);
  }
}

const categories = [
  'Budget & fiscal',
  'Procurement & projects',
  'Audit',
  'Elections',
  'Legislation & law',
  'Statistics',
  'Services & directories',
  'Barangays & maps',
  'History & legal records',
  'Official notices & monitoring',
  'Commitments & outcomes',
];

for (const category of categories) {
  if (!catalog.includes("'" + category + "'")) {
    problems.push('Public Records coverage is missing category: ' + category);
  }
}

const budgetDocumentCount = [
  ...budget.matchAll(/\byear:\s*(20\d{2})[\s\S]{0,180}?href:/g),
].filter(match => Number(match[1]) >= 2014 && Number(match[1]) <= 2026).length;
if (budgetDocumentCount < 13) {
  problems.push(
    'Annual-budget archive fell below the 2014–2026 baseline: ' +
      budgetDocumentCount
  );
}

const fiscalYears = [
  ...budget.matchAll(/year:\s*(20(?:19|20|21|22|23|24|25)),\s*receiptsM:/g),
];
if (fiscalYears.length < 7) {
  problems.push(
    'Reported fiscal-history coverage fell below seven years: ' + fiscalYears.length
  );
}

const serviceCount = [...services.matchAll(/\bid:\s*'([^']+)'/g)].length;
if (serviceCount < 151) {
  problems.push('Service-source coverage fell below 151 indexed services.');
}

const structuredServiceCount = (
  serviceDetails.split('export const serviceGuideDetails')[1] ?? ''
).match(/^\s{2}(?:'[^']+'|[A-Za-z][A-Za-z0-9_-]*):\s*\{/gm)?.length ?? 0;
if (structuredServiceCount < 48) {
  problems.push(
    'Structured service source coverage fell below 48 guides: ' +
      structuredServiceCount
  );
}

if (watchlist.length < 92) {
  problems.push(
    'Published source-watch baseline fell below 92 sources: ' + watchlist.length
  );
}

for (const marker of [
  'Search the public record catalog',
  'Official only',
  'Download catalog CSV',
  'source-watch-index.json',
  'source-watch-history.json',
  'unique source URLs indexed',
]) {
  if (!page.includes(marker)) {
    problems.push('Public Records page is missing required feature: ' + marker);
  }
}

if (!generator.includes("writeFile('public/source-watch-index.json'")) {
  problems.push('Generated site files no longer publish the source-watch index.');
}

if (!catalog.includes("export const publicRecordsReviewed = '24 September 2026';")) {
  problems.push('Public Records review date is not current for Wave 1.5.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'Public-records depth audit passed: ' +
    categories.length +
    ' coverage areas; ' +
    budgetDocumentCount +
    ' annual budget documents; ' +
    fiscalYears.length +
    ' fiscal years; ' +
    serviceCount +
    ' service-source records; ' +
    structuredServiceCount +
    ' structured service guides; ' +
    watchlist.length +
    ' watched sources.'
);
