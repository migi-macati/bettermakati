import { access, readFile } from 'node:fs/promises';

const [page, views, app, navigation, searchIndex, home, capability, explore, generateSite, postbuild, packageJson] =
  await Promise.all([
    readFile('src/pages/Calendar.tsx', 'utf8'),
    readFile('src/data/civicTimelineViews.ts', 'utf8'),
    readFile('src/App.tsx', 'utf8'),
    readFile('src/data/navigation.ts', 'utf8'),
    readFile('src/data/searchIndex.ts', 'utf8'),
    readFile('src/pages/Home.tsx', 'utf8'),
    readFile('src/components/home/CapabilityCarousel.tsx', 'utf8'),
    readFile('src/pages/VisitMakati.tsx', 'utf8'),
    readFile('scripts/generate-site-files.mjs', 'utf8'),
    readFile('scripts/postbuild-routes.mjs', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

const problems = [];

for (const marker of [
  "t('currentInfo.calendar.title')",
  "t('currentInfo.calendar.chooseView')",
  "t('currentInfo.calendar.howItWorks')",
  'nativeCivicTimelineItems',
  'civicCalendarViewItems',
  'TimelineCard',
  'primarySource',
  'visible.map',
]) {
  if (!page.includes(marker)) problems.push('Calendar page marker missing: ' + marker);
}

for (const forbidden of [
  'civic-time-candidate-queue',
  'civic-time-reviewed-discoveries',
  'eventSources',
  'Make It Makati',
  'Ayala Malls',
  'Century City Mall',
]) {
  if (page.includes(forbidden)) problems.push('Public Calendar crossed candidate/entertainment boundary: ' + forbidden);
}

for (const marker of [
  "export type CivicCalendarView = 'now-next' | 'published' | 'archive'",
  "label: 'Now & Next'",
  "label: 'Recently Published'",
  "label: 'Archive'",
  "kind === 'service-availability'",
  "{ id: 'service-available', label: 'Service available' }",
  'export const civicCalendarRecentPublicationDays = 45',
  'export const civicCalendarViewForItem',
  "item.status === 'superseded'",
  "item.temporal.semantic === 'publication-release'",
  'isCurrentOrFuture(item, now)',
  'export const civicCalendarMatchesBarangay',
  'export const civicCalendarMatchesDateRange',
  'export const civicCalendarViewItems',
  'export const civicCalendarViewCounts',
]) {
  if (!views.includes(marker)) problems.push('Calendar selector marker missing: ' + marker);
}

for (const marker of [
  "const Calendar = lazy(() => import('./pages/Calendar'))",
  '<Route path="/calendar" element={<Calendar />} />',
  '<Route path="/whats-on" element={<CompatibilityRedirect to="/calendar" />} />',
]) {
  if (!app.includes(marker)) problems.push('Calendar route marker missing: ' + marker);
}
if (app.includes("import('./pages/WhatsOn')")) problems.push('Old WhatsOn import remains.');

if (
  !navigation.includes("id: 'calendar'") ||
  !navigation.includes("labelKey: 'navigation.calendar'") ||
  !navigation.includes("href: '/calendar'")
) problems.push('Calendar navigation missing.');
if (navigation.includes("label: 'What’s On'") || navigation.includes("href: '/whats-on'")) problems.push('Old What’s On navigation remains.');

if (!searchIndex.includes("title: 'Makati Calendar'") || !searchIndex.includes("canonicalKey: 'tool:makati-calendar'")) problems.push('Canonical Calendar Search record missing.');
if (searchIndex.includes("title: 'What’s On'") || searchIndex.includes("title: 'What’s On in Makati'") || searchIndex.includes("href: '/whats-on'")) problems.push('Old What’s On Search record remains.');

if (
  !capability.includes("{ key: 'now', href: '/today', icon: SunMedium }") ||
  !capability.includes("home.capability.entries.")
) {
  problems.push('Homepage current-information entry must resolve through Today.');
}
if (home.includes("label: 'Makati Calendar'") || home.includes("href: '/calendar'")) {
  problems.push('Calendar must not return as a first-order homepage peer to Today.');
}
if (home.includes("label: 'What’s on'") || home.includes("href: '/whats-on'")) problems.push('Homepage old event framing remains.');

if (!explore.includes("label: 'Makati Calendar'") || !explore.includes("href: '/calendar'")) problems.push('Explore Calendar cross-link missing.');
if (explore.includes("label: 'What’s on'") || explore.includes('to="/whats-on"') || explore.includes('Current events')) problems.push('Explore old event framing remains.');

if (!generateSite.includes("  '/calendar',") || generateSite.includes("  '/whats-on',")) problems.push('Sitemap routes not aligned.');
if (!postbuild.includes("'/calendar': ['Makati Calendar'") || postbuild.includes("'/whats-on':")) problems.push('Postbuild metadata not aligned.');

try {
  await access('src/pages/WhatsOn.tsx');
  problems.push('Obsolete WhatsOn.tsx still exists.');
} catch {
  // Expected.
}

if ((packageJson.match(/npm run check:makati-calendar/g) ?? []).length < 2) problems.push('Calendar guard missing from build/quality.');

if (problems.length) {
  console.error('W5-7R5 Makati Calendar check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('W5-7R5 Makati Calendar check passed: civic views, canonical/source links, filters, route redirect, Today-owned homepage discovery, candidate boundary and retired What’s On surface are intact.');
