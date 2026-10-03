import { readFile } from 'node:fs/promises';

const [
  preview,
  domainPreview,
  today,
  barangay,
  legislation,
  accountability,
  reports,
  elections,
  searchIndex,
  searchPage,
  enLocale,
  packageJson,
] = await Promise.all([
  readFile('src/components/civic/CivicTimelinePreview.tsx', 'utf8'),
  readFile('src/components/civic/CivicDomainTimelinePreview.tsx', 'utf8'),
  readFile('src/pages/Today.tsx', 'utf8'),
  readFile('src/pages/BarangayProfile.tsx', 'utf8'),
  readFile('src/pages/Legislation.tsx', 'utf8'),
  readFile('src/pages/Accountability.tsx', 'utf8'),
  readFile('src/pages/Reports.tsx', 'utf8'),
  readFile('src/pages/Elections.tsx', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('src/pages/Search.tsx', 'utf8'),
  readFile('public/locales/en/common.json', 'utf8'),
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
  'Unverified source leads are not shown.',
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
  "t('currentInfo.today.liveSources')",
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

for (const marker of [
  "from '../../data/civicTimelineNative'",
  'civicCalendarViewItems',
  'civicCalendarViewForItem',
  'On the Makati Calendar',
  'Open filtered calendar',
]) {
  if (!domainPreview.includes(marker)) {
    problems.push('Domain Civic Timeline preview marker missing: ' + marker);
  }
}

for (const forbidden of [
  'civic-time-candidate-queue',
  'civic-time-reviewed-discoveries',
  'freshness-review-queue',
]) {
  if (domainPreview.includes(forbidden)) {
    problems.push('Domain preview crossed internal candidate boundary: ' + forbidden);
  }
}

for (const [label, page, markers] of [
  ['Legislation', legislation, ['owner="legislation"', 'calendarTopic="legislation"', 'Dated legislative milestones']],
  ['Accountability', accountability, ['owner="accountability"', 'calendarTopic="projects-procurement"', 'Procurement and project dates']],
  ['Reports', reports, ['owner="reports"', 'calendarTopic="publications-data"', 'Report releases']],
  ['Elections', elections, ['owner="elections"', 'calendarTopic="elections"', 'Election dates and schedule changes']],
]) {
  for (const marker of markers) {
    if (!page.includes(marker)) {
      problems.push(label + ' domain timeline marker missing: ' + marker);
    }
  }
}

for (const marker of [
  "import { nativeCivicTimelineItems } from './civicTimelineNative'",
  'timelineCanonicalSearchKey',
  'timelineSearchDateKeywords',
  'civicTimelineSearchGroups',
  "category: 'Civic timeline'",
  'coreCanonicalKeys',
  "keywords: item.keywords + ' ' + timeline.keywords",
]) {
  if (!searchIndex.includes(marker)) {
    problems.push('Search civic-time discovery marker missing: ' + marker);
  }
}

if (
  !searchPage.includes("t('discovery.search.description')") ||
  !searchPage.includes("t('discovery.search.placeholder')") ||
  !enLocale.includes('services, barangays, civic dates') ||
  !enLocale.includes('deadline, council session')
) {
  problems.push('Search page does not advertise civic-date discovery.');
}

if ((packageJson.match(/npm run check:civic-time-distribution/g) ?? []).length < 2) {
  problems.push(
    'Civic-time distribution guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-7R6 civic-time distribution check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-7R6 civic-time distribution passed: Today, BetterBarangay, canonical owner pages and Search reuse canonical Calendar data/selectors without exposing internal candidate queues or duplicating canonical ownership.'
);
