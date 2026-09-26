import { readFile } from 'node:fs/promises';

const catalog = await readFile('src/data/publicRecords.ts', 'utf8');
const catalogPage = await readFile('src/pages/PublicRecords.tsx', 'utf8');
const detailPage = await readFile('src/pages/PublicRecordDetail.tsx', 'utf8');
const app = await readFile('src/App.tsx', 'utf8');
const reportsPage = await readFile('src/pages/ReportArticle.tsx', 'utf8');
const integrityPage = await readFile('src/pages/Integrity.tsx', 'utf8');
const legislationPage = await readFile('src/pages/Legislation.tsx', 'utf8');
const depthAudit = await readFile(
  'scripts/audit-public-records-depth.mjs',
  'utf8'
);

const problems = [];

for (const marker of [
  "import {\n  cityIndicators,\n  cityIndicatorSources,\n} from './cityIndicators'",
  'integrityGraphNodes',
  'integrityRelationshipSources',
  'localLegislationRecords',
  'localLegislationSources',
  "import { reports } from './reports'",
  'export interface PublicRecordContext',
  'contexts: PublicRecordContext[]',
  'Object.values(cityIndicatorSources)',
  'Object.values(localLegislationSources)',
  'integrityRelationshipSources',
  'for (const report of reports)',
  "source.sourceKind === 'canonical-internal'",
  'const existing = map.get(input.url)',
  'existing.contexts.some',
  'export const publicRecordById',
  'export const publicRecordByUrl',
]) {
  if (!catalog.includes(marker)) {
    problems.push('Wave 4 Public Records catalog marker missing: ' + marker);
  }
}

for (const forbidden of [
  'fuzzy',
  'levenshtein',
  'similarity',
  'titleMatch',
  'keywordMatch',
]) {
  if (catalog.toLowerCase().includes(forbidden.toLowerCase())) {
    problems.push(
      'Public Records source identity must remain exact-URL based: ' + forbidden
    );
  }
}

for (const marker of [
  "const PublicRecordDetail = lazy(() => import('./pages/PublicRecordDetail'))",
  '<Route path="/records/:id" element={<PublicRecordDetail />} />',
]) {
  if (!app.includes(marker)) {
    problems.push('Public Records detail route marker missing: ' + marker);
  }
}

for (const marker of [
  "import { publicRecordById } from '../data/publicRecords'",
  "const record = id ? publicRecordById.get(id) : undefined",
  "record.format === 'PDF'",
  'src={record.url}',
  'Open original source',
  'record.contexts.map',
  'Open related record',
  'Public Records ID:',
]) {
  if (!detailPage.includes(marker)) {
    problems.push('Public Records detail/viewer marker missing: ' + marker);
  }
}

for (const marker of [
  "to={'/records/' + record.id}",
  'View record',
  'record.contexts',
  'download="bettermakati-public-records.csv"',
  "'/records/' + record.id",
]) {
  if (!catalogPage.includes(marker)) {
    problems.push('Public Records catalog navigation/export marker missing: ' + marker);
  }
}

for (const [name, page] of [
  ['ReportArticle', reportsPage],
  ['Integrity', integrityPage],
  ['Legislation', legislationPage],
]) {
  if (!page.includes("import { publicRecordByUrl } from '../data/publicRecords'")) {
    problems.push(name + ' must import the exact-URL Public Records resolver.');
  }
  if (!page.includes('publicRecordByUrl.get(')) {
    problems.push(name + ' must resolve Public Records entries by exact source URL.');
  }
  if (!page.includes('Public record')) {
    problems.push(name + ' must expose the matching Public Records entry.');
  }
}

for (const marker of [
  "'cityIndicators'",
  "'cityIndicatorSources'",
  "'localLegislationRecords'",
  "'localLegislationSources'",
  "'integrityGraphNodes'",
  "'integrityRelationshipSources'",
  "'reports'",
  "export const publicRecordsReviewed = '26 September 2026';",
  'export interface PublicRecordContext',
  'export const publicRecordById',
]) {
  if (!depthAudit.includes(marker)) {
    problems.push('Public Records depth audit is missing Wave 4 guard: ' + marker);
  }
}

if (problems.length) {
  console.error(
    'Wave 4 Public Records integration check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Wave 4 Public Records integration check passed: Statistics, Legislation, Integrity and Featured Report sources merge by exact URL into multi-context catalog entries; /records/:id provides source detail and PDF preview; record pages link back to matching catalog entries without fuzzy identity.'
);
