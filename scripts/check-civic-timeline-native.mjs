import { readFile } from 'node:fs/promises';

const [
  native,
  timeline,
  legislation,
  council,
  accountabilitySupplement,
  elections,
  electionCivic,
  reports,
  reportTypes,
  cityMonitor,
  serviceAvailability,
  packageJson,
] = await Promise.all([
  readFile('src/data/civicTimelineNative.ts', 'utf8'),
  readFile('src/data/civicTimeline.ts', 'utf8'),
  readFile('src/data/localLegislation.ts', 'utf8'),
  readFile('src/data/councilSessions.ts', 'utf8'),
  readFile('src/data/accountabilitySupplement.ts', 'utf8'),
  readFile('src/data/electionHistory.ts', 'utf8'),
  readFile('src/data/electionCivic.ts', 'utf8'),
  readFile('src/data/reports.ts', 'utf8'),
  readFile('src/data/reportTypes.ts', 'utf8'),
  readFile('src/data/cityMonitor.ts', 'utf8'),
  readFile('src/data/civicServiceAvailability.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const problems = [];

for (const marker of [
  'export const nativeLegislationTimelineItems',
  'export const nativeCouncilSessionTimelineItems',
  'export const nativeDirectCityMonitorTimelineItems',
  'export const nativeProcurementTimelineItems',
  'export const nativeElectionArchiveTimelineItems',
  'export const nativeCurrentElectionTimelineItems',
  'export const nativeServiceAvailabilityTimelineItems',
  'export const nativeReportReleaseTimelineItems',
  'export const nativeCivicTimelineItems',
  'export const nativeCivicTimelineCoverage',
  'resolveNativeCivicTimelineCanonical',
  'projectCivicTimelineItem',
]) {
  if (!native.includes(marker)) {
    problems.push('Native Civic Timeline projection marker missing: ' + marker);
  }
}

for (const marker of [
  "sourceFields: ['lifecycle[].date']",
  "sourceFields: ['sessionEvidence[].sessionDate']",
  "sourceFields: ['CouncilSessionSeed.date']",
  "sourceFields: ['CityMonitorRecord.date']",
  "sourceFields: ['procurement.bidDate']",
  "sourceFields: ['HistoricalMayoralRace.electionDate']",
  "sourceFields: ['currentBskeSchedule.lawSignedOn']",
  "sourceFields: ['currentBskeSchedule.updatePublishedOn']",
  "sourceFields: ['currentBskeSchedule.electionDate']",
  "sourceFields: ['supersededBske2026Milestones[].start']",
  "sourceFields: ['FeaturedReportV2.date']",
  "'districtOnePublicAssistanceProgram.sessions[].date'",
]) {
  if (!native.includes(marker)) {
    problems.push('Native temporal-origin marker missing: ' + marker);
  }
}

for (const forbidden of [
  "sourceFields: ['checkedOn']",
  "sourceFields: ['checkedAt']",
  "sourceFields: ['reviewedOn']",
  "sourceFields: ['lastReviewed']",
  "sourceFields: ['lastVerified']",
  "sourceFields: ['reconciledOn']",
  "sourceFields: ['statusAsOf']",
  "sourceFields: ['period']",
  "sourceFields: ['asOf']",
]) {
  if (native.includes(forbidden)) {
    problems.push('Native projection uses forbidden date field: ' + forbidden);
  }
}

if (native.includes('fetch(')) {
  problems.push(
    'W5-7R3 must project existing canonical data only; new source fetching belongs to R4.'
  );
}

for (const importForbidden of [
  "from './cityIndicators'",
  "from './publicRecords'",
  "from './serviceDirectory'",
  "from './mobilityRoutes'",
  "from './mobilitySystems'",
]) {
  if (native.includes(importForbidden)) {
    problems.push(
      'R3 projected a domain whose required release/change metadata is not ready: ' +
        importForbidden
    );
  }
}

if (!native.includes("!record.id.startsWith('monitor-')")) {
  problems.push(
    'Direct City Monitor projection must exclude monitor-* procurement mirrors owned by Accountability.'
  );
}

if (
  !native.includes("record.type === 'council-session'") &&
  !native.includes("directCityMonitorKinds")
) {
  problems.push(
    'Council sessions must be projected through their dedicated canonical path, not duplicated blindly from City Monitor.'
  );
}

if (
  !reportTypes.includes(
    "This is the report's own release date, not a source"
  ) ||
  !reports.includes(
    "const reportPublishedOn = '26 September 2026';"
  ) ||
  (reports.match(/date: reportPublishedOn/g) ?? []).length !== 5
) {
  problems.push(
    'Featured report date has not been formally separated as BetterMakati report publication date.'
  );
}

const ordinanceCount = (legislation.match(/\n  ordinanceFromAnnex\(/g) ?? [])
  .length;
const resolutionCount = (
  legislation.match(/\n  resolutionFromAnnex\(/g) ?? []
).length;
const councilCount = (council.match(/\n  regularSession\(/g) ?? []).length;

const procurementBlock =
  accountabilitySupplement
    .split('const procurementSeeds: ProcurementSeed[] = [')[1]
    ?.split('];\n\nexport const procurementProjectEntries')[0] ?? '';
const procurementCount = (
  procurementBlock.match(/\n    id: '/g) ?? []
).length;

const electionBlock =
  elections
    .split('export const makatiMayoralHistory: HistoricalMayoralRace[] = [')[1]
    ?.split('\n];')[0] ?? '';
const electionCount = (electionBlock.match(/\n    year: /g) ?? []).length;
const reportCount = (reports.match(/schemaVersion: 2,/g) ?? []).length;
const serviceAvailabilityCount = (
  serviceAvailability.match(/\n      date: '2026-/g) ?? []
).length;
const supersededElectionBlock =
  electionCivic
    .split('export const supersededBske2026Milestones = [')[1]
    ?.split('] as const;')[0] ?? '';
const supersededElectionCount = (
  supersededElectionBlock.match(/\n    id: '/g) ?? []
).length;

const baseCityMonitorBlock =
  cityMonitor
    .split('const baseCityMonitorRecords: CityMonitorRecord[] = [')[1]
    ?.split('];\n\n\nconst currentCouncilSessionMonitorRecords')[0] ?? '';
const directCityMonitorCount = (
  baseCityMonitorBlock.match(/\n    type: 'procurement'/g) ?? []
).length;

if (
  ordinanceCount !== 15 ||
  resolutionCount !== 5 ||
  councilCount !== 9 ||
  procurementCount !== 21 ||
  electionCount !== 10 ||
  reportCount !== 5 ||
  supersededElectionCount !== 4 ||
  directCityMonitorCount < 2 ||
  serviceAvailabilityCount !== 10
) {
  problems.push(
    'W5-7R3 fixed source baseline shrank or changed unexpectedly; re-audit native projection counts before continuing.'
  );
}

if (!native.includes("id: 'election:bske-current:update-published'")) {
  problems.push('Current BSKE official-publication projection identity is missing.');
}
if (!native.includes("id: 'election:bske-current:next-election'")) {
  problems.push('Current BSKE election projection identity is missing.');
}
if (!native.includes("id: 'election:bske-current:ra-12326-signed'")) {
  problems.push('Current BSKE law-change projection identity is missing.');
}
if (!native.includes("status: 'superseded'")) {
  problems.push('Superseded 2026 election schedule is not preserved in the timeline.');
}

if (!native.includes("kind: 'service-availability'")) {
  problems.push('Temporary service-availability projection kind is missing.');
}
if (!native.includes("actionability: 'service-available'")) {
  problems.push('Temporary service availability must expose service-available actionability.');
}
if (!native.includes("owner: 'services'")) {
  problems.push('Temporary service availability must retain Services as canonical owner.');
}

if (!native.includes("id: 'report:' + report.slug + ':release'")) {
  problems.push('Report release projection identity is missing.');
}

if (!native.includes("id: 'accountability:' + entry.id + ':bid-result'")) {
  problems.push('Accountability procurement projection identity is missing.');
}

if (
  !timeline.includes('cannot project maintenance/observation field')
) {
  problems.push(
    'Native projections depend on the R2 maintenance/observation-field rejection invariant.'
  );
}

if ((packageJson.match(/npm run check:civic-timeline-native/g) ?? []).length < 2) {
  problems.push(
    'Native Civic Timeline guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-7R3 native Civic Timeline check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'W5-7R3 native Civic Timeline check passed:',
    ordinanceCount + resolutionCount + ' dated legislation seed records',
    councilCount + ' council sessions',
    directCityMonitorCount + ' direct City Monitor procurement records',
    procurementCount + ' Accountability procurement records',
    electionCount + ' historical mayoral election dates',
    '7 current/superseded BSKE schedule items',
    serviceAvailabilityCount + ' temporary service-availability sessions',
    reportCount + ' BetterMakati report releases',
    'no new external fetching',
    'and maintenance/observation date protections retained.',
  ].join(' ')
);
