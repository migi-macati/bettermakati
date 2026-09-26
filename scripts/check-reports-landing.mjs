import { readFile } from 'node:fs/promises';

const page = await readFile('src/pages/Reports.tsx', 'utf8');
const teaser = await readFile(
  'src/components/reports/ReportTeaser.tsx',
  'utf8'
);

const problems = [];

for (const marker of [
  "import ReportTeaser from '../components/reports/ReportTeaser'",
  "import { publicationReports } from '../data/reports'",
  'const leadReport = publicationReports[0]',
  'const moreReports = publicationReports.slice(1)',
  'Featured Reports & Insights',
  '>Latest<',
  'More reports',
  '<ReportTeaser report={leadReport} variant="lead" />',
  'moreReports.map',
  'variant="card"',
]) {
  if (!page.includes(marker)) {
    problems.push('Reports landing marker missing: ' + marker);
  }
}

for (const marker of [
  'report.date',
  'report.headline',
  'report.subheadline',
  'Read more',
  "variant === 'lead'",
  "variant === 'carousel'",
]) {
  if (!teaser.includes(marker)) {
    problems.push('Shared report teaser marker missing: ' + marker);
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

for (const duplicateMarkup of [
  'report.date',
  'report.headline',
  'report.subheadline',
  'function ReportCard',
]) {
  if (page.includes(duplicateMarkup)) {
    problems.push(
      'Reports landing must render report metadata through the shared ReportTeaser only: ' +
        duplicateMarkup
    );
  }
}

if (
  !teaser.includes('bg-primary-900 text-white') ||
  !teaser.includes(
    'lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)]'
  )
) {
  problems.push(
    'Shared lead teaser must retain visually distinct publication-front treatment.'
  );
}

if (
  !page.includes('grid grid-cols-1 gap-5 lg:grid-cols-2') ||
  !teaser.includes('group block h-full rounded-3xl')
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
  'Reports landing check passed: the page uses the shared publication order and ReportTeaser for lead and index stories, with no national-data detour or duplicated report metadata markup.'
);
