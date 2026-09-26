import { readFile } from 'node:fs/promises';

const page = await readFile('src/pages/Reports.tsx', 'utf8');

const problems = [];

for (const marker of [
  "import { reports } from '../data/reports'",
  'const publicationOrder = [...reports].reverse()',
  'const leadReport = publicationOrder[0]',
  'const moreReports = publicationOrder.slice(1)',
  'Featured Reports & Insights',
  '>Latest<',
  'More reports',
  'report.date',
  'report.headline',
  'report.subheadline',
  'Read more',
  '<ReportCard report={leadReport} lead />',
  'moreReports.map',
]) {
  if (!page.includes(marker)) {
    problems.push('Reports landing marker missing: ' + marker);
  }
}

for (const forbidden of [
  'Related national data',
  'visualizations.bettergov.ph',
  '2026-budget.bettergov.ph',
  'National data research',
  '2026 national budget',
  'ExternalLink',
]) {
  if (page.includes(forbidden)) {
    problems.push(
      'Reports landing must not restore the unrelated national-data detour: ' +
        forbidden
    );
  }
}

const reportImportCount = (
  page.match(/from '..\/data\/reports'/g) ?? []
).length;
if (reportImportCount !== 1) {
  problems.push(
    'Reports landing must consume the canonical reports array exactly once.'
  );
}

if (!page.includes('lead = false') || !page.includes('if (lead)')) {
  problems.push(
    'Reports landing must preserve explicit lead-story editorial hierarchy.'
  );
}

if (
  !page.includes('bg-primary-900 text-white') ||
  !page.includes('lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)]')
) {
  problems.push(
    'Lead story must retain visually distinct publication-front treatment.'
  );
}

if (
  !page.includes('grid grid-cols-1 gap-5 lg:grid-cols-2') ||
  !page.includes('group block h-full rounded-3xl')
) {
  problems.push(
    'Remaining reports must stay in a readable one-report-per-card index.'
  );
}

for (const metaCopy of [
  'overview',
  'why these reports matter',
  'our approach',
  'completeness',
  'coverage status',
]) {
  if (page.toLowerCase().includes(metaCopy)) {
    problems.push(
      'Reports landing contains public-facing meta/existence copy: ' + metaCopy
    );
  }
}

if (problems.length) {
  console.error(
    'Reports landing check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Reports landing check passed: canonical reports render once in a lead-story plus publication-index hierarchy, with headline, subheadline, date and Read more and no national-data detour or meta copy.'
);
