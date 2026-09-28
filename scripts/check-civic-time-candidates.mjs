import { readFile } from 'node:fs/promises';

const [
  discoveryRaw,
  reviewedRaw,
  queueRaw,
  builder,
  packageJson,
  sourceWorkflow,
  cityWorkflow,
] = await Promise.all([
  readFile('data/civic-time-discovery-sources.json', 'utf8'),
  readFile('data/civic-time-reviewed-discoveries.json', 'utf8'),
  readFile('data/civic-time-candidate-queue.json', 'utf8'),
  readFile('scripts/build-civic-time-candidate-queue.mjs', 'utf8'),
  readFile('package.json', 'utf8'),
  readFile('.github/workflows/source-freshness.yml', 'utf8'),
  readFile('.github/workflows/daily-city-monitor.yml', 'utf8'),
]);

const discovery = JSON.parse(discoveryRaw);
const reviewed = JSON.parse(reviewedRaw);
const queue = JSON.parse(queueRaw);
const problems = [];

const sourceIds = new Set();
for (const source of discovery.sources || []) {
  const key = source.sourceSystem + ':' + source.sourceId;
  if (sourceIds.has(key)) {
    problems.push('Duplicate Civic Timeline discovery source: ' + key);
  }
  sourceIds.add(key);

  if (!source.allowedKinds?.length || !source.signalModes?.length) {
    problems.push(
      'Discovery source requires allowedKinds and signalModes: ' + source.id
    );
  }

  if (
    source.sourceSystem !== 'city-monitor' &&
    source.sourceSystem !== 'general-source-freshness'
  ) {
    problems.push('Unsupported discovery source system: ' + source.id);
  }
}

for (const required of [
  'city-monitor:makati-events',
  'city-monitor:makati-news',
  'city-monitor:mymakati-broadcasts',
  'city-monitor:philgeps',
  'general-source-freshness:resilient-makati-consultations',
  'general-source-freshness:macea-circulars',
  'general-source-freshness:comelec-2026-bske-calendar',
  'general-source-freshness:comelec-2026-bske-registration',
  'general-source-freshness:psa-population',
  'general-source-freshness:coa-audit',
  'general-source-freshness:makati-action-center',
]) {
  if (!sourceIds.has(required)) {
    problems.push('Required R4 discovery source missing: ' + required);
  }
}

for (const doctrineMarker of [
  'never creates a public Civic Timeline item',
  'item-level evidence',
  'Reachability-only sources are discovery surfaces',
  'stronger canonical owner',
]) {
  if (
    !Object.values(discovery.doctrine || {}).some(value =>
      String(value).includes(doctrineMarker)
    )
  ) {
    problems.push('R4 discovery doctrine missing: ' + doctrineMarker);
  }
}

for (const item of reviewed.discoveries || []) {
  if (
    ![
      'source-review-needed',
      'owner-gap',
      'ready-for-projection',
      'rejected',
    ].includes(item.reviewStatus)
  ) {
    problems.push('Unsupported reviewed discovery status: ' + item.id);
  }

  if (!item.temporal?.semantic || !item.temporal?.value) {
    problems.push('Reviewed discovery requires explicit temporal evidence: ' + item.id);
  }

  if (item.reviewStatus === 'ready-for-projection' && !item.canonicalRef) {
    problems.push(
      'Ready reviewed discovery lacks canonicalRef: ' + item.id
    );
  }
}

const electionDay = (reviewed.discoveries || []).find(
  item => item.id === 'comelec-2026-bske-election-day'
);
if (
  !electionDay ||
  electionDay.temporal?.value !== '2026-11-02' ||
  electionDay.reviewStatus !== 'owner-gap' ||
  electionDay.canonicalRef !== null ||
  !electionDay.supportingSources?.some(source =>
    source.url.includes('2026BSKE/Resolutions')
  )
) {
  problems.push(
    'COMELEC 2026 BSKE reviewed discovery must remain an owner-gap candidate with amendment context.'
  );
}

if (
  queue.doctrine?.publicBoundary !==
  'This queue is internal review state. No queue item is a public Civic Timeline item.'
) {
  problems.push('Candidate queue lost the internal/public boundary.');
}

if (queue.summary?.publicEligible !== 0) {
  problems.push('R4 candidate queue must not auto-publish any item.');
}

if (
  !builder.includes("item.status !== 'open'") ||
  !builder.includes("config.signalModes || []") ||
  !builder.includes("reviewStatus === 'ready-for-projection'") ||
  !builder.includes('Boolean(item.canonicalRef)') ||
  !builder.includes('0 auto-published')
) {
  problems.push(
    'Candidate builder lost source-signal/review/canonical-owner promotion guards.'
  );
}

for (const workflow of [
  ['Source freshness', sourceWorkflow],
  ['City Monitor', cityWorkflow],
]) {
  const [label, source] = workflow;
  for (const marker of [
    'data/civic-time-candidate-queue.json',
    'data/civic-time-candidate-queue.md',
  ]) {
    if (!source.includes(marker)) {
      problems.push(label + ' workflow does not publish ' + marker);
    }
  }
}

if (
  !packageJson.includes(
    'node scripts/build-freshness-review-queue.mjs && node scripts/build-civic-time-candidate-queue.mjs'
  )
) {
  problems.push(
    'Freshness build does not rebuild the Civic Timeline candidate queue.'
  );
}

if (
  (packageJson.match(/npm run check:civic-time-candidates/g) ?? []).length < 2
) {
  problems.push(
    'Civic-time candidate guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-7R4 civic-time candidate pipeline failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-7R4 civic-time candidate pipeline passed: configured discovery sources, internal review queue, item-level temporal evidence, canonical-owner gate, COMELEC owner-gap seed, workflow publication, and zero auto-published candidates.'
);
