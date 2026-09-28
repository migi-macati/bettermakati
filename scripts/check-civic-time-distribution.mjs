import { readFile } from 'node:fs/promises';

const [preview, today, barangay, packageJson] = await Promise.all([
  readFile('src/components/civic/CivicTimelinePreview.tsx', 'utf8'),
  readFile('src/pages/Today.tsx', 'utf8'),
  readFile('src/pages/BarangayProfile.tsx', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  "from '../../data/civicTimelineNative'",
  'civicCalendarMatchesBarangay',
  "civicCalendarViewItems(relevant, 'now-next', now)",
  "civicCalendarViewItems(relevant, 'published', now)",
  'Open full calendar',
  'Now &amp; Next',
  'Recently Published',
  'Raw source-change signals and unresolved review',
]) {
  if (!preview.includes(marker)) {
    problems.push('Civic Timeline preview marker missing: ' + marker);
  }
}

for (const forbidden of [
  'civic-time-candidate-queue',
  'civic-time-reviewed-discoveries',
  'freshness-review-queue',
]) {
  if (preview.includes(forbidden)) {
    problems.push('Preview crossed internal candidate boundary: ' + forbidden);
  }
}

for (const marker of [
  "import CivicTimelinePreview from '../components/civic/CivicTimelinePreview'",
  '<CivicTimelinePreview',
  'barangaySlug={barangaySlug || undefined}',
  "heading={",
  "'What’s next in Makati'",
  'Advisories & useful links',
]) {
  if (!today.includes(marker)) {
    problems.push('Today Civic Timeline distribution marker missing: ' + marker);
  }
}

if (
  today.includes('/whats-on') ||
  today.includes('What’s on') ||
  today.includes('events and emergency links')
) {
  problems.push('Today still contains retired What’s On/event framing.');
}

for (const marker of [
  "import CivicTimelinePreview from '../components/civic/CivicTimelinePreview'",
  '<CivicTimelinePreview',
  'barangaySlug={barangay.slug}',
  "heading={'Civic dates for ' + barangay.name}",
]) {
  if (!barangay.includes(marker)) {
    problems.push('BetterBarangay Civic Timeline marker missing: ' + marker);
  }
}

if ((packageJson.match(/npm run check:civic-time-distribution/g) ?? []).length < 2) {
  problems.push(
    'Civic-time distribution guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-7R6a civic-time distribution check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-7R6a civic-time distribution passed: Today and BetterBarangay reuse canonical Calendar selectors, preserve barangay + citywide scope, remove retired What’s On framing, and exclude internal candidate queues.'
);
