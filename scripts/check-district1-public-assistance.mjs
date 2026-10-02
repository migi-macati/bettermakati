import { readFile } from 'node:fs/promises';

const [
  availability,
  integrationDoc,
  serviceDirectory,
  serviceGuideDetails,
  governmentOffices,
  timeline,
  timelineViews,
  calendar,
  preview,
  searchIndex,
  serviceGuide,
  services,
  nativeGuard,
  calendarGuard,
  distributionGuard,
  packageRaw,
] = await Promise.all([
  readFile('src/data/civicServiceAvailability.ts', 'utf8'),
  readFile('docs/current-district1-public-assistance-2026.md', 'utf8'),
  readFile('src/data/serviceDirectory.ts', 'utf8'),
  readFile('src/data/serviceGuideDetails.ts', 'utf8'),
  readFile('src/data/governmentServiceOffices.ts', 'utf8'),
  readFile('src/data/civicTimelineNative.ts', 'utf8'),
  readFile('src/data/civicTimelineViews.ts', 'utf8'),
  readFile('src/pages/Calendar.tsx', 'utf8'),
  readFile('src/components/civic/CivicTimelinePreview.tsx', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('src/pages/ServiceGuide.tsx', 'utf8'),
  readFile('src/pages/Services.tsx', 'utf8'),
  readFile('scripts/check-civic-timeline-native.mjs', 'utf8'),
  readFile('scripts/check-makati-calendar.mjs', 'utf8'),
  readFile('scripts/check-civic-time-distribution.mjs', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const pkg = JSON.parse(packageRaw);
const problems = [];

const need = (name, source, marker) => {
  if (!source.includes(marker)) {
    problems.push(name + ' marker missing: ' + marker);
  }
};

need('Integration documentation', integrationDoc, 'Status: complete');
need('Integration documentation', integrationDoc, '**10 dated sessions covering 11 barangays**');
need('Integration documentation', integrationDoc, 'indefinite recurring Calendar series');

for (const marker of [
  "serviceId: 'district-1-public-assistance-desk'",
  "title: 'District 1 Public Assistance Desk'",
  "url: 'https://www.facebook.com/share/p/19qKvhrw9E/'",
  "publisher: 'Congresswoman Monique Lagdameo'",
  "kind: 'first-party'",
  "operatingHours: '8:00 AM–3:00 PM'",
  "operatingNote: 'Except Saturdays, Sundays and holidays'",
  "start: '2026-09-28'",
  "end: '2026-10-09'",
]) {
  need('Canonical service availability', availability, marker);
}

const expectedSessions = [
  ["2026-09-28", "tejeros", "4174 Ponte St."],
  ["2026-09-29", "san-isidro", "1645 Dian St."],
  ["2026-09-30", "poblacion", "Sto. Niño Chapel (in front of Saint Chapel)"],
  ["2026-10-01", "palanan", "4965 Enrique St."],
  ["2026-10-02", "la-paz", "1562 Archimedes St. cor. Flordeliz St."],
  ["2026-10-05", "pio-del-pilar", "6659 Taylo St."],
  ["2026-10-06", "carmona", "1212 C. Francisco St."],
  ["2026-10-06", "kasilawan", "1212 C. Francisco St."],
  ["2026-10-07", "santa-cruz", "3156 Visita St."],
  ["2026-10-08", "bangkal", "3919-A Gen. Macabulos St."],
  ["2026-10-09", "singkamas", "Singkamas Chapel"],
];

for (const [date, barangay, venue] of expectedSessions) {
  need('Service session date', availability, "date: '" + date + "'");
  need('Service session barangay', availability, "'" + barangay + "'");
  need('Service session venue', availability, "venue: '" + venue + "'");
}

const sessionCount = (availability.match(/\n      date: '2026-/g) ?? []).length;
if (sessionCount !== 10) {
  problems.push('Expected 10 dated rotating Public Assistance Desk sessions; found ' + sessionCount + '.');
}

const requiredBarangays = [
  'tejeros',
  'san-isidro',
  'poblacion',
  'palanan',
  'la-paz',
  'pio-del-pilar',
  'carmona',
  'kasilawan',
  'santa-cruz',
  'bangkal',
  'singkamas',
];
for (const slug of requiredBarangays) {
  need('Service geography', availability, "'" + slug + "'");
}
if (new Set(requiredBarangays).size !== 11) {
  problems.push('Public Assistance Desk barangay baseline must contain 11 distinct barangays.');
}

for (const marker of [
  'Medical assistance — medicines, laboratories and mobility aid',
  'Hospital bill — unpaid bills',
  'Burial assistance',
  'Educational assistance — college level only',
  'Guarantee Letter (GL) referrals',
  'Philippine General Hospital',
  'Philippine Children’s Medical Center',
  'National Kidney & Transplant Institute',
  'National Center for Mental Health',
  'Quirino Memorial Medical Center',
  "barangaySlugs: ['valenzuela', 'olympia']",
  '9221 Pateros St., Barangay Valenzuela, Makati City',
]) {
  need('Assistance source detail', availability, marker);
}

for (const marker of [
  "id: 'district-1-public-assistance-desk'",
  'availabilityWindow:',
  'startsOn: districtOnePublicAssistanceProgram.scheduleWindow.start',
  'endsOn: districtOnePublicAssistanceProgram.scheduleWindow.end',
]) {
  need('Service directory', serviceDirectory, marker);
}
need(
  'Active-service browse expiry',
  services,
  'item.availabilityWindow.endsOn >= todayKey'
);
need('Active-service browse Manila clock', services, 'const todayKey = manilaDateKey();');

for (const marker of [
  "'district-1-public-assistance-desk':",
  'requirements: []',
  'The post does not publish a complete eligibility rule',
  'the source post does not publish a complete checklist',
]) {
  need('Service guide detail', serviceGuideDetails, marker);
}

for (const marker of [
  "id: 'makati-district-1-public-assistance'",
  "agency: 'Office of the Representative, Makati 1st District'",
  'districtOnePublicAssistanceProgram.districtOfficeNote.address',
  'districtOnePublicAssistanceProgram.source.url',
]) {
  need('District office', governmentOffices, marker);
}

for (const marker of [
  "kind: 'service-availability'",
  "actionability: 'service-available'",
  "owner: 'services'",
  "type: 'service'",
  "precision: 'datetime-range'",
  "'districtOnePublicAssistanceProgram.sessions[].date'",
  '...nativeServiceAvailabilityTimelineItems',
  'serviceAvailability: nativeServiceAvailabilityTimelineItems.length',
]) {
  need('Native Civic Timeline', timeline, marker);
}

for (const marker of [
  "kind === 'service-availability'",
  "{ id: 'service-available', label: 'Service available' }",
]) {
  need('Calendar selectors', timelineViews, marker);
}

for (const marker of [
  "'service-availability': 'Service availability'",
  "'service-available': 'Service available'",
]) {
  need('Calendar labels', calendar, marker);
}
need('Timeline preview label', preview, "'service-available': 'Service available'");

need(
  'Search canonical service identity',
  searchIndex,
  "canonicalKey: 'civic-owner:services:service:' + item.id"
);

for (const marker of [
  'temporaryAvailability.sessions.map',
  "t('servicesGovernment.guide.requestsReferralsListed')",
  "t('servicesGovernment.guide.guaranteeLetterFacilities')",
  'Valenzuela &amp; Olympia',
  'View on Makati Calendar',
  'temporaryAvailabilityStatus',
  "'Past schedule'",
  "temporaryAvailabilityStatus === 'Past schedule' ? 'archive' : 'now-next'",
]) {
  need('Service guide schedule', serviceGuide, marker);
}

for (const marker of [
  'export const nativeServiceAvailabilityTimelineItems',
  'serviceAvailabilityCount !== 10',
]) {
  need('Native timeline guard', nativeGuard, marker);
}
need('Calendar guard', calendarGuard, "kind === 'service-availability'");
need('Distribution guard', distributionGuard, 'Unverified source leads are not shown.');

const scriptName = 'check:district1-public-assistance';
const command = 'node scripts/check-district1-public-assistance.mjs';
if (pkg.scripts?.[scriptName] !== command) {
  problems.push(scriptName + ' registration is missing.');
}

for (const pipeline of ['build', 'quality']) {
  if (!pkg.scripts?.[pipeline]?.includes('npm run ' + scriptName)) {
    problems.push(scriptName + ' must remain in ' + pipeline + '.');
  }
}

if (problems.length) {
  console.error(
    'District 1 Public Assistance Desk integration failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'District 1 Public Assistance Desk integration passed: one canonical service, 10 dated sessions covering 11 barangays, source-faithful assistance/referral details, automatic current/archive behavior, Calendar/Today/BetterBarangay distribution, Search integration and direct service-guide source handoff are intact.'
);
