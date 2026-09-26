import { readFile } from 'node:fs/promises';

const home = await readFile('src/pages/Home.tsx', 'utf8');
const carousel = await readFile(
  'src/components/home/FeaturedInsightsCarousel.tsx',
  'utf8'
);
const reportsPage = await readFile('src/pages/Reports.tsx', 'utf8');
const teaser = await readFile(
  'src/components/reports/ReportTeaser.tsx',
  'utf8'
);
const reportsData = await readFile('src/data/reports.ts', 'utf8');

const problems = [];

if ((home.match(/<FeaturedInsightsCarousel \/>/g) ?? []).length !== 1) {
  problems.push(
    'Homepage must render exactly one FeaturedInsightsCarousel module.'
  );
}

for (const marker of [
  "import { publicationReports } from '../../data/reports'",
  "import ReportTeaser from '../reports/ReportTeaser'",
  'useCarousel(publicationReports.length, 7000)',
  'const report = publicationReports[carousel.index]',
  '<ReportTeaser report={report} variant="carousel" />',
  '{carousel.index + 1} of {publicationReports.length}',
  'View all',
]) {
  if (!carousel.includes(marker)) {
    problems.push('Homepage Featured Reports reuse marker missing: ' + marker);
  }
}

for (const forbidden of [
  "import { reports } from '../../data/reports'",
  'report.date',
  'report.headline',
  'report.subheadline',
  'report.slug',
]) {
  if (carousel.includes(forbidden)) {
    problems.push(
      'Homepage carousel must not duplicate canonical ordering or teaser metadata markup: ' +
        forbidden
    );
  }
}

if (
  !reportsData.includes(
    'export const publicationReports = [...reports].reverse()'
  )
) {
  problems.push(
    'Canonical publication order must be exported once from reports.ts.'
  );
}

if (
  !reportsPage.includes(
    "import ReportTeaser from '../components/reports/ReportTeaser'"
  ) ||
  !reportsPage.includes(
    "import { publicationReports } from '../data/reports'"
  )
) {
  problems.push(
    '/reports must use the same ReportTeaser and publicationReports as the homepage.'
  );
}

for (const marker of [
  'report.date',
  'report.headline',
  'report.subheadline',
  'Read more',
  "variant === 'carousel'",
  "variant === 'lead'",
]) {
  if (!teaser.includes(marker)) {
    problems.push('Shared ReportTeaser contract missing: ' + marker);
  }
}

if (problems.length) {
  console.error(
    'Homepage Featured Reports reuse check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Homepage Featured Reports reuse check passed: Home and /reports share one publication order and one ReportTeaser component, so report ordering and teaser metadata cannot drift between surfaces.'
);
