import { readFile } from 'node:fs/promises';

const page = await readFile('src/pages/CivicBriefs.tsx', 'utf8');
const data = await readFile('src/data/civicBriefs.ts', 'utf8');
const monitor = await readFile('src/data/cityMonitor.ts', 'utf8');
const generator = await readFile('scripts/generate-civic-brief.mjs', 'utf8');
const siteGenerator = await readFile('scripts/generate-site-files.mjs', 'utf8');
const workflow = await readFile('.github/workflows/civic-briefs.yml', 'utf8');
const archive = JSON.parse(await readFile('data/civic-briefs.json', 'utf8'));

const problems = [];

for (const cadence of ['daily', 'weekly', 'monthly']) {
  if (!data.includes(`${cadence}: {`)) {
    problems.push('Civic Brief data model lost cadence: ' + cadence);
  }
  if (!archive.briefs.some(brief => brief.cadence === cadence)) {
    problems.push('Civic Brief archive has no seeded ' + cadence + ' snapshot.');
  }
}

for (const marker of [
  'Official activity',
  'Projects & procurement',
  'Participation opportunities',
]) {
  if (!data.includes(marker)) {
    problems.push('Civic Brief section model is missing: ' + marker);
  }
}

for (const marker of [
  'Accountability-linked developments',
  'Source-review queue',
  'Permanent brief archive',
  'Share-ready text',
  'Barangay relevance',
  'No newly validated City Monitor records',
]) {
  if (!page.includes(marker)) {
    problems.push('Civic Briefs page is missing required feature: ' + marker);
  }
}

for (const marker of [
  "fetch('/civic-briefs.json'",
  "fetch('/city-monitor-source-history.json'",
  "to={'/city-monitor/' + record.id}",
  'recordsForPeriod',
  'accountabilityLinkedRecords',
  'procurementValue',
]) {
  if (!page.includes(marker)) {
    problems.push('Civic Briefs page lost data linkage: ' + marker);
  }
}

for (const marker of [
  "recordIds",
  "reviewSignals",
  "failedChecks",
  "src/data/cityMonitor.ts",
  "src/data/accountabilitySupplement.ts",
  "data/city-monitor-source-history.json",
]) {
  if (!generator.includes(marker)) {
    problems.push('Civic Brief publisher lost source-backed field: ' + marker);
  }
}

for (const cron of [
  "cron: '5 1 * * *'",
  "cron: '10 1 * * 1'",
  "cron: '15 1 1 * *'",
]) {
  if (!workflow.includes(cron)) {
    problems.push('Civic Brief cadence schedule is missing: ' + cron);
  }
}

if (!workflow.includes('node scripts/generate-civic-brief.mjs')) {
  problems.push('Civic Brief workflow no longer runs the deterministic publisher.');
}
if (!workflow.includes('npm run build')) {
  problems.push('Civic Brief workflow no longer verifies the production build.');
}
if (!siteGenerator.includes("'public/civic-briefs.json'")) {
  problems.push('Generated site files no longer publish the Civic Brief archive.');
}
if (!siteGenerator.includes("'public/civic-briefs.rss.xml'")) {
  problems.push('Generated site files no longer publish the Civic Brief RSS feed.');
}

if (!monitor.includes('barangaySlug?: string;') || !monitor.includes('barangaySlug: entry.barangaySlug')) {
  problems.push('City Monitor no longer carries explicit barangay relevance into Civic Briefs.');
}

if (!data.includes("export const civicBriefsReviewed = '24 September 2026';")) {
  problems.push('Civic Briefs review date is not current for Wave 2.2.');
}

for (const brief of archive.briefs) {
  for (const field of [
    'id',
    'cadence',
    'title',
    'periodStart',
    'periodEnd',
    'publishedAt',
    'recordIds',
    'reviewSignals',
    'failedChecks',
  ]) {
    if (!(field in brief)) {
      problems.push('Archived Civic Brief ' + (brief.id || '(unknown)') + ' is missing ' + field + '.');
    }
  }
  if (brief.periodStart > brief.periodEnd) {
    problems.push('Archived Civic Brief has an invalid period: ' + brief.id);
  }
}

const firstPublication = archive.briefs
  .map(brief => brief.publishedAt)
  .sort()[0];
if (!firstPublication?.startsWith('2026-09-24')) {
  problems.push('Civic Brief archive must begin on 24 September 2026 without fabricated backdated publications.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'Civic Briefs depth audit passed: 3 cadences; ' +
    archive.briefs.length +
    ' permanent seeded snapshots; source-change separation, City Monitor linkage, barangay relevance, scheduled publishing and RSS protected.'
);
