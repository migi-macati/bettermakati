import { readFile } from 'node:fs/promises';
import { newsFreshnessPolicy, newsPolicyVersion } from './news-policy.mjs';
import {
  newsReviewPolicyVersion,
} from './news-review-routing.mjs';
import {
  newsReviewDecisionValues,
  newsReviewResolutionPolicyVersion,
  validateNewsReviewResolution,
} from './news-review-resolution-policy.mjs';

const [
  closureRaw,
  queueRaw,
  resolutionsRaw,
  newsPage,
  todayPage,
  relationships,
  clustering,
  feed,
  routing,
  builder,
  workflow,
  generator,
  app,
  searchIndex,
  packageJson,
] = await Promise.all([
  readFile('data/wave5-news-discovery-closure.json', 'utf8'),
  readFile('data/news-review-queue.json', 'utf8'),
  readFile('data/news-review-resolutions.json', 'utf8'),
  readFile('src/pages/News.tsx', 'utf8'),
  readFile('src/pages/Today.tsx', 'utf8'),
  readFile('src/data/newsCivicRelationships.ts', 'utf8'),
  readFile('scripts/news-clustering.mjs', 'utf8'),
  readFile('scripts/news-feed.mjs', 'utf8'),
  readFile('scripts/news-review-routing.mjs', 'utf8'),
  readFile('scripts/build-news-review-queue.mjs', 'utf8'),
  readFile('.github/workflows/weekly-content-refresh.yml', 'utf8'),
  readFile('scripts/generate-site-files.mjs', 'utf8'),
  readFile('src/App.tsx', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const closure = JSON.parse(closureRaw);
const queue = JSON.parse(queueRaw);
const resolutionLedger = JSON.parse(resolutionsRaw);
const problems = [];

if (
  closure.closureStatus !==
  'closed-with-editorial-review-and-deployment-verification-deferred'
) {
  problems.push('W5-8 closure status changed.');
}

if (closure.canonicalRoute !== '/news') {
  problems.push('Makati in the News is no longer the canonical news route.');
}

if (
  newsPolicyVersion !== closure.contracts?.sourcePolicyVersion ||
  newsReviewPolicyVersion !== closure.contracts?.reviewRoutingPolicyVersion ||
  newsReviewResolutionPolicyVersion !==
    closure.contracts?.resolutionPolicyVersion
) {
  problems.push('W5-8 policy versions no longer match the closure ledger.');
}

if (
  newsFreshnessPolicy.todayMaxAgeDays !==
    closure.contracts?.todayMaxAgeDays ||
  newsFreshnessPolicy.generalFeedMaxAgeDays !==
    closure.contracts?.generalFeedMaxAgeDays
) {
  problems.push('W5-8 freshness windows changed from the closure contract.');
}

if (
  newsReviewDecisionValues.length !==
  closure.contracts?.reviewDecisionCount
) {
  problems.push('W5-8 resolution-decision count changed.');
}

const topicCount = (
  routing.match(/\btopic:\s*'[^']+'/g) ?? []
).length;
if (topicCount !== closure.contracts?.reviewTopicCount) {
  problems.push(
    'W5-8 review-topic count changed: expected ' +
      closure.contracts?.reviewTopicCount +
      ', found ' +
      topicCount +
      '.'
  );
}

for (const marker of [
  'enrichment.relevanceLabel',
  'Related in BetterMakati',
  'Other coverage',
  'item.clusterSize',
  'item.sourceClassLabel',
]) {
  if (!newsPage.includes(marker)) {
    problems.push('News public-surface marker missing: ' + marker);
  }
}

for (const marker of [
  '.filter(isTodayNewsCandidate)',
  'direct-Makati relevance rules',
]) {
  if (!todayPage.includes(marker)) {
    problems.push('Today news gate marker missing: ' + marker);
  }
}

for (const marker of [
  "'direct-city'",
  "'direct-entity'",
  "'contextual'",
  "'accountability-record'",
  "'legislation-record'",
  "'city-monitor-record'",
  "'mobility-service'",
]) {
  if (!relationships.includes(marker)) {
    problems.push('News civic-relationship marker missing: ' + marker);
  }
}

for (const marker of [
  'withinHours(left.pubDate, right.pubDate, 96)',
  'stats.containment >= 0.75',
  'stats.jaccard >= 0.5',
  'relatedCoverage',
]) {
  if (!clustering.includes(marker)) {
    problems.push('Conservative story-clustering guard missing: ' + marker);
  }
}

if (!feed.includes('clusterNewsItems(items)')) {
  problems.push('Live news feed no longer applies story clustering.');
}

for (const marker of [
  'newsResolutionDisposition',
  'newsResolutionMatchesCandidate',
  'materialEvidenceKeys',
  'material-update-review',
  'suppressedResolved',
  'publicEligible: false',
]) {
  if (!builder.includes(marker)) {
    problems.push('Review/resolution workflow marker missing: ' + marker);
  }
}

for (const resolution of resolutionLedger.resolutions || []) {
  const problem = validateNewsReviewResolution(resolution);
  if (problem) {
    problems.push(
      'Invalid committed news review resolution ' +
        String(resolution.id || '(missing id)') +
        ': ' +
        problem
    );
  }
}

if (
  !queue.doctrine?.recurrence ||
  !Array.isArray(queue.suppressedResolved)
) {
  problems.push('Generated queue no longer preserves recurrence state.');
}

for (const candidate of queue.candidates || []) {
  if (candidate.publicEligible !== false) {
    problems.push(
      'Active news review candidate became public-eligible: ' + candidate.id
    );
  }
}

if (
  workflow.includes('data/news-review-resolutions.json') ||
  workflow.includes('public/news-review')
) {
  problems.push(
    'Daily automation must not generate/overwrite or publish editorial resolution state.'
  );
}

if (
  !workflow.includes("cron: '0 1 * * *'") ||
  !workflow.includes('Build internal news review queue')
) {
  problems.push('Daily 09:00 PHT news discovery workflow changed.');
}

for (const artifact of [
  'data/news-discovery-snapshot.json',
  'data/news-review-queue.json',
  'data/news-review-queue.md',
]) {
  if (!workflow.includes(artifact)) {
    problems.push('Daily review artifact missing from automation PR: ' + artifact);
  }
}

for (const forbidden of [
  'news-review-queue.json',
  'news-review-queue.md',
  'news-review-resolutions.json',
  'news-discovery-snapshot.json',
]) {
  if (generator.includes(forbidden)) {
    problems.push(
      'Internal news-review artifact is being copied to public output: ' +
        forbidden
    );
  }
}

if (
  !app.includes('<Route path="/news" element={<News />} />') ||
  app.includes('path="/news-review"') ||
  app.includes('path="/news-review-queue"')
) {
  problems.push('Public routing no longer preserves the W5-8 internal/public boundary.');
}

if (
  searchIndex.includes("title: 'News & events'") ||
  !searchIndex.includes("title: 'Makati in the News'")
) {
  problems.push('News search identity regressed.');
}

const deferredDeployment = (closure.deferred || []).find(
  item => item.id === 'deployment-live-browser-verification'
);
if (
  deferredDeployment?.status !== 'unverified' ||
  !deferredDeployment?.nonClaim?.includes(
    'production has already deployed'
  )
) {
  problems.push(
    'W5-8 deployment/browser verification is no longer explicitly deferred.'
  );
}

for (const required of [
  'semantic-story-clustering',
  'automatic-canonical-promotion',
  'commercial-and-lifestyle-routing',
  'review-queue-publication',
]) {
  if (!(closure.bounded || []).some(item => item.id === required)) {
    problems.push('W5-8 bounded capability missing: ' + required);
  }
}

for (const script of [
  'check:news-source-policy',
  'check:news-civic-relationships',
  'check:news-review-queue',
  'check:wave5-news-discovery-closure',
]) {
  const occurrences = (
    packageJson.match(
      new RegExp('npm run ' + script.replace(':', '\\:'), 'g')
    ) ?? []
  ).length;
  if (occurrences < 2) {
    problems.push(
      'W5-8 guard is not present in both build and quality: ' + script
    );
  }
}

if (
  !closure.finalStatement?.startsWith(
    'W5-8 News & Discovery is closed at repository level'
  )
) {
  problems.push('W5-8 closure final statement is missing or overstated.');
}

if (problems.length) {
  console.error(
    'Wave 5.8 News & Discovery closure failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'W5-8 News & Discovery closure passed: public discovery, direct-Makati Today gating, conservative clustering, canonical relationships, internal owner routing, append-only resolutions, recurrence suppression and deployment deferral are intact.'
);
