import { readFile } from 'node:fs/promises';

const [sessions, monitor, legislation, sourceConfig] = await Promise.all([
  readFile('src/data/councilSessions.ts', 'utf8'),
  readFile('src/data/cityMonitor.ts', 'utf8'),
  readFile('src/data/localLegislation.ts', 'utf8'),
  readFile('data/city-monitor-sources.json', 'utf8'),
]);

const config = JSON.parse(sourceConfig);
const problems = [];

const expectedDates = [
  '2026-09-21',
  '2026-09-14',
  '2026-09-07',
  '2026-09-01',
  '2026-08-24',
  '2026-08-17',
  '2026-08-11',
  '2026-08-03',
  '2026-07-27',
];

for (const date of expectedDates) {
  if (!sessions.includes("'" + date + "'")) {
    problems.push('Missing normalized current council session: ' + date);
  }
  if (!monitor.includes("'council-session-' + date")) {
    // City Monitor maps session seeds dynamically rather than repeating IDs.
    if (!monitor.includes('currentCouncilSessionSeeds.map(session => ({')) {
      problems.push('City Monitor is not mapping canonical council-session seeds.');
      break;
    }
  }
}

const regularSessionCalls = (
  sessions.match(/regularSession\(/g) || []
).length;
if (regularSessionCalls !== expectedDates.length) {
  problems.push(
    'Expected ' +
      expectedDates.length +
      ' current regular-session seeds; found ' +
      regularSessionCalls +
      '.'
  );
}

for (const marker of [
  "sourceId: 'makati-council-videos'",
  "stableUrlStatus: 'pending-resolution'",
  "kind: 'bettermakati-automated'",
  "status: 'planned'",
  "sourceRecordingStatus: 'awaiting-stable-video-url'",
  'timestamped segments',
  'never official',
  'Do not attach a councilor/person identity',
  'candidate links only',
  'Do not commit raw audio/video',
]) {
  if (!sessions.includes(marker)) {
    problems.push('Transcript/session policy marker missing: ' + marker);
  }
}

if (
  !config.sources.some(
    source =>
      source.id === 'makati-council-videos' &&
      source.stream === 'council-session' &&
      source.owner === 'city-monitor'
  )
) {
  problems.push('Machine City Monitor config is missing makati-council-videos.');
}

for (const marker of [
  "id: 'makati-council-videos'",
  "coverage: 'partial'",
  'currentCouncilSessionMonitorRecords',
  "stage: 'Official session video listed'",
  'Automated transcript remains planned until the stable official video URL is preserved.',
  "id: 'council-transcript-backfill'",
]) {
  if (!monitor.includes(marker)) {
    problems.push('City Monitor council-session marker missing: ' + marker);
  }
}

const councilCoverageBlock =
  monitor.split("type: 'council-session'")[1]?.split("type: 'legislation'")[0] ??
  '';
if (councilCoverageBlock.includes("coverage: 'source-gap'")) {
  problems.push(
    'Current council-session coverage must no longer be classified as source-gap.'
  );
}

if (
  monitor.includes(
    'No reliable current source has yet been normalized for every 2026 session date'
  )
) {
  problems.push('Stale false source-gap wording remains in City Monitor.');
}

const sessionEvidenceArrays = (
  legislation.match(/sessionEvidence:\s*\[\]/g) || []
).length;
if (sessionEvidenceArrays < 20) {
  problems.push(
    'Existing 20 bounded local measures should remain without inferred session evidence until exact links are reviewed.'
  );
}

if (
  legislation.includes("cityMonitorRecordId: 'council-session-2026") ||
  legislation.includes("evidenceStatus: 'reviewed-official-video'")
) {
  problems.push(
    'W4-2e must not fabricate measure-session links from the current video listing.'
  );
}

if (problems.length) {
  console.error('Council session audit failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}

console.log(
  'Council session audit passed: 9 current official-session discoveries normalized; ' +
    'transcript backfill queued with non-official provenance; 20 bounded local measures retain 0 inferred session links.'
);
