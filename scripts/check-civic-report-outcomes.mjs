import { readFile } from 'node:fs/promises';

const page = await readFile('src/pages/CivicReports.tsx', 'utf8');
const classification = JSON.parse(
  await readFile(
    'data/wave3-redesigned-capability-classification.json',
    'utf8'
  )
);
const wave3 = JSON.parse(
  await readFile('data/wave3-participation-backlog.json', 'utf8')
);

const problems = [];

for (const marker of [
  "fetch('/api/civic-report'",
  "'/api/civic-audit?campaign='",
  'Cases submitted in the last 30 days',
  "['Submitted', lifecycleCounts.submitted]",
  "['Reviewed', lifecycleCounts.reviewed]",
  "['Routed', lifecycleCounts.routed]",
  "['Authority acknowledged', lifecycleCounts.acknowledged]",
  "['Action evidence', lifecycleCounts.actionEvidence]",
  "['Documented resolution', lifecycleCounts.documentedResolution]",
  'MIN_RATE_DENOMINATOR = 20',
  'cohort.length < MIN_RATE_DENOMINATOR',
  'Lifecycle percentages are withheld',
  'communityResolutionSignals',
  'Cases ready for BetterMakati review',
  'data.referralQueue',
  'Recent issue cases',
  "to={'/civic-map/' + entityId}",
  'Park audit coverage & freshness',
  'auditData.observedEntities',
  'auditData.completeEntities',
  'PARK_RECENT_WINDOW_DAYS = 30',
  'MIN_FRESHNESS_OBSERVED_ENTITIES = 5',
  'freshness?.publishAggregate',
  "'Withheld'",
  'Aggregate freshness requires at least',
  "to={civicAuditPilot.route + '/results'}",
]) {
  if (!page.includes(marker)) {
    problems.push('Civic Reports outcome marker missing: ' + marker);
  }
}

for (const legacy of [
  'Weekly operational brief',
  'New issue cases',
  'New proposals',
  'Open cases',
  'Corroborated open',
  'Monthly public-realm brief',
  'issue cases created',
  'improvement proposals',
  'Proposals with community support',
  'three community supports',
  'matureProposals',
]) {
  if (page.includes(legacy)) {
    problems.push(
      'Legacy volume/popularity-led Civic Reports content remains: ' + legacy
    );
  }
}

if (
  page.includes('documentedResolution /') ||
  page.includes('reviewed /') ||
  page.includes('routed /')
) {
  problems.push(
    'Lifecycle outcome counts must not be converted into public rates without threshold and maturity enforcement.'
  );
}

const cap12 = classification.capabilities?.find(
  capability => capability.id === 'W3R-CAP-12'
);
if (!cap12 || cap12.status !== 'complete') {
  problems.push('W3R-CAP-12 must be classified complete after W4-4h.');
}

if (classification.summary?.partial !== 0) {
  problems.push(
    'Wave 3 redesigned capability classification must have zero partial capabilities.'
  );
}

if (
  Array.isArray(wave3.wave3Closure?.knownPartial) &&
  wave3.wave3Closure.knownPartial.includes('W3R-CAP-12')
) {
  problems.push(
    'Wave 3 closure must no longer list W3R-CAP-12 as a known partial.'
  );
}

if (!wave3.wave3Closure?.knownDeferred?.includes('W3R-CAP-11')) {
  problems.push(
    'Closing Civic Reports must not erase the separate repeat-contribution deferral.'
  );
}

if (problems.length) {
  console.error(
    'Civic Reports outcome check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'Civic Reports outcome check passed: W3R-CAP-12 is complete; the page leads with exact lifecycle evidence, retains referral/recent cases, publishes frozen-scope audit coverage and suppresses lifecycle/freshness rates until W3R-10b thresholds allow them.'
);
