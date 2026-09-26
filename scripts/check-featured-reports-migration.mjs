import { readFile } from 'node:fs/promises';

const reports = await readFile('src/data/reports.ts', 'utf8');
const article = await readFile('src/pages/ReportArticle.tsx', 'utf8');
const problems = [];

const canonicalSlugs = [
  '2026-budget-operating-expenses',
  '2025-fiscal-profile',
  '2024-barangay-population',
];

const slugs = [
  ...reports.matchAll(/slug:\s*'([^']+)'/g),
].map(match => match[1]);

for (const slug of canonicalSlugs) {
  if (!slugs.includes(slug)) {
    problems.push('Missing canonical migrated report: ' + slug);
  }
}

for (const slug of canonicalSlugs) {
  if (slugs.filter(candidate => candidate === slug).length !== 1) {
    problems.push('Migrated canonical report must appear exactly once: ' + slug);
  }
}

for (const legacySlug of ['2025-local-revenue', '2025-social-services']) {
  const aliasPattern = "'" + legacySlug + "': '2025-fiscal-profile'";
  if (!reports.includes(aliasPattern)) {
    problems.push('Missing canonical redirect alias for ' + legacySlug);
  }
}

const schemaVersionCount = (reports.match(/schemaVersion:\s*2/g) ?? []).length;
const synthesisCount = (reports.match(/synthesis:\s*/g) ?? []).length;

if (schemaVersionCount !== slugs.length || synthesisCount !== slugs.length) {
  problems.push(
    'Every published report must carry schemaVersion 2 and exactly one synthesis field.'
  );
}

for (const marker of [
  "role: 'fact'",
  "role: 'analysis'",
  "kind: 'stat'",
  "kind: 'table'",
  "kind: 'chart'",
  "sourceKind: 'canonical-internal'",
  "sourceKind: 'official-external'",
  "recordType: 'statistics-indicator'",
  "recordType: 'accountability-entry'",
  'budgetCurrentEstimate2025.totalAppropriationM',
  'barangaysUnder6000.length',
]) {
  if (!reports.includes(marker)) {
    problems.push('Missing migrated report evidence marker: ' + marker);
  }
}

for (const marker of [
  'resolveReportSlug',
  'ReportBlock',
  'EvidenceLinks',
  'Methodology & limits',
  'role="img"',
  'report.sources.map',
]) {
  if (!article.includes(marker) && !reports.includes(marker)) {
    problems.push('Missing v2 report renderer marker: ' + marker);
  }
}

if (reports.includes('paragraphs:')) {
  problems.push('Legacy report paragraph arrays remain after migration.');
}

if (
  reports.includes('Potential barangay-level demand for facilities and services') ||
  reports.includes('five barangays')
) {
  problems.push(
    'The barangay rewrite must not retain the old unsupported service-demand inference or incomplete under-6,000 list.'
  );
}

if (
  !reports.includes(
    'The public record supports a composition finding, not a conclusion about whether operating spending is excessive or efficient.'
  )
) {
  problems.push('The 2026 budget rewrite must preserve the evidence boundary.');
}

if (
  !reports.includes(
    'They do not establish that a specific tax funded a specific service'
  )
) {
  problems.push('The merged 2025 fiscal report must avoid revenue-to-program causation.');
}

if (problems.length) {
  console.error(
    'Featured Report v2 migration check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Featured Report v2 migration check passed: the 3 migrated W4-4c storylines and legacy fiscal aliases remain intact while later v2 flagship reports may be added.'
);
