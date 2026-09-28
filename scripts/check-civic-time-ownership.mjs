import { readFile } from 'node:fs/promises';

const [rawMatrix, packageJson] = await Promise.all([
  readFile('data/wave5-civic-time-ownership-matrix.json', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const matrix = JSON.parse(rawMatrix);
const problems = [];

const requiredDomains = [
  'city-monitor',
  'legislation',
  'council-sessions',
  'elections',
  'accountability-procurement-projects',
  'reports',
  'statistics',
  'public-records',
  'services',
  'barangays',
  'mobility-civic-map',
];

const domainIds = matrix.domains?.map(domain => domain.id) ?? [];
for (const id of requiredDomains) {
  if (!domainIds.includes(id)) {
    problems.push('Civic-time ownership domain missing: ' + id);
  }
}

if (new Set(domainIds).size !== domainIds.length) {
  problems.push('Civic-time ownership domain IDs must be unique.');
}

const semantics = new Map(
  (matrix.dateSemantics ?? []).map(item => [item.id, item])
);

for (const id of [
  'occurrence',
  'deadline',
  'effective-change',
  'publication-release',
  'target-milestone',
  'observation-period',
  'source-period-label',
  'verification-review',
  'status-as-of',
]) {
  if (!semantics.has(id)) {
    problems.push('Civic-time date semantic missing: ' + id);
  }
}

for (const id of [
  'observation-period',
  'source-period-label',
  'verification-review',
  'status-as-of',
]) {
  if (semantics.get(id)?.publicTimelineEligible !== false) {
    problems.push(
      'Non-occurrence temporal semantic must remain ineligible: ' + id
    );
  }
}

for (const domain of matrix.domains ?? []) {
  if (!domain.owner || !domain.files?.length || !domain.routes?.length) {
    problems.push(
      'Domain requires owner, canonical files and routes: ' + domain.id
    );
  }
  if (!Array.isArray(domain.doNotProject) || !domain.doNotProject.length) {
    problems.push('Domain requires explicit do-not-project rules: ' + domain.id);
  }
  if (
    domain.r3Eligibility === false &&
    !String(domain.readiness).includes('gap') &&
    !String(domain.readiness).includes('required')
  ) {
    problems.push(
      'R3-ineligible domain must name its readiness gap/requirement: ' +
        domain.id
    );
  }
}

const statistics = matrix.domains?.find(domain => domain.id === 'statistics');
if (
  !statistics?.doNotProject?.some(value =>
    value.includes('observation period as release date')
  )
) {
  problems.push(
    'Statistics must explicitly forbid observation-period-as-release projection.'
  );
}

const publicRecords = matrix.domains?.find(
  domain => domain.id === 'public-records'
);
if (
  !publicRecords?.doNotProject?.some(value =>
    value.includes('period as publication date')
  )
) {
  problems.push(
    'Public Records must explicitly forbid period-as-publication projection.'
  );
}

const mobility = matrix.domains?.find(
  domain => domain.id === 'mobility-civic-map'
);
for (const field of ['statusAsOf', 'reviewedOn', 'reconciledOn']) {
  if (!mobility?.doNotProject?.includes(field)) {
    problems.push('Mobility must not project verification field: ' + field);
  }
}

if ((matrix.cityMonitorSourceStreams ?? []).length !== 9) {
  problems.push('W5-7R1 expects all 9 current City Monitor source streams.');
}

for (const source of matrix.cityMonitorSourceStreams ?? []) {
  if (!source.readiness || !source.timelinePotential?.length) {
    problems.push(
      'City Monitor source stream requires readiness and timeline potential: ' +
        source.sourceId
    );
  }
}

if ((matrix.r3NativePilot ?? []).length < 5) {
  problems.push('R3 native pilot must preserve a bounded multi-domain seed set.');
}

if ((matrix.additionalSourceGaps ?? []).length < 6) {
  problems.push('R4 source-gap inventory is incomplete.');
}

if (
  !matrix.doctrine?.projectionRule?.includes(
    'Never treat review/check/as-of metadata'
  )
) {
  problems.push('Projection doctrine must protect maintenance metadata.');
}

if ((packageJson.match(/npm run check:civic-time-ownership/g) ?? []).length < 2) {
  problems.push(
    'Civic-time ownership guard is not present in both build and quality.'
  );
}

if (problems.length) {
  console.error(
    'W5-7R1 civic-time ownership check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-7R1 civic-time ownership check passed: 11 domain owners, 9 City Monitor source streams, explicit date semantics, bounded native pilot, source gaps, and do-not-project protections for observation/review/verification metadata.'
);
