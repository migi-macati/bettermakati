import { readFile } from 'node:fs/promises';
import { readReportModuleSources } from './read-report-module-sources.mjs';

const home = await readFile('src/pages/Home.tsx', 'utf8');
const reportsPage = await readFile('src/pages/Reports.tsx', 'utf8');
const teaser = await readFile(
  'src/components/reports/ReportTeaser.tsx',
  'utf8'
);
const reportsData = await readReportModuleSources();

const problems = [];

for (const marker of ["../data/reports/06-embo-makati-taguig-transition", 'embo.report.slug', 'story.headline', 'story.subheadline', 'embo.fil', 'to="/reports"']) {
  if (!home.includes(marker)) problems.push('Homepage must link a bilingual canonical report: ' + marker);
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
  !reportsPage.includes("import { publicationReports } from '../data/reports'")
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
    'Homepage Featured Reports reuse check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log('Homepage links the bilingual canonical lead and the reports directory.');
