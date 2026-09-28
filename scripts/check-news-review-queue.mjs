import { readFile } from 'node:fs/promises';
import {
  newsReviewPolicyVersion,
  primaryNewsReviewOwner,
  routeNewsForReview,
  shouldCreateNewsReviewCandidate,
} from './news-review-routing.mjs';
import {
  newsCandidateMaterialEvidenceKeys,
  newsReviewDecisionValues,
  newsReviewResolutionPolicyVersion,
  newsResolutionDisposition,
  validateNewsReviewResolution,
} from './news-review-resolution-policy.mjs';

const [
  queueRaw,
  resolutionsRaw,
  builder,
  workflow,
  packageJson,
] = await Promise.all([
  readFile('data/news-review-queue.json', 'utf8'),
  readFile('data/news-review-resolutions.json', 'utf8'),
  readFile('scripts/build-news-review-queue.mjs', 'utf8'),
  readFile('.github/workflows/weekly-content-refresh.yml', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const queue = JSON.parse(queueRaw);
const resolutionLedger = JSON.parse(resolutionsRaw);
const problems = [];

if (newsReviewPolicyVersion !== '2026-09-28.w5-8d') {
  problems.push(
    'Unexpected news review policy version: ' + newsReviewPolicyVersion
  );
}

if (newsReviewResolutionPolicyVersion !== '2026-09-28.w5-8e') {
  problems.push(
    'Unexpected news resolution policy version: ' +
      newsReviewResolutionPolicyVersion
  );
}

const expectedDecisions = [
  'update-existing',
  'create-canonical-record',
  'context-only',
  'duplicate',
  'stale',
  'insufficient-evidence',
  'out-of-scope',
];

if (
  JSON.stringify(newsReviewDecisionValues) !==
  JSON.stringify(expectedDecisions)
) {
  problems.push('News review resolution decision set changed.');
}

const syntheticLegislation = {
  title: 'Makati City Council approves ordinance on service rules',
  description: '',
  freshness: 'current',
};
const legislationRoutes = routeNewsForReview(syntheticLegislation);
if (
  primaryNewsReviewOwner(syntheticLegislation) !== 'legislation' ||
  !legislationRoutes.some(route => route.owner === 'legislation')
) {
  problems.push(
    'Legislation routing does not resolve to the legislation owner.'
  );
}

const syntheticMobility = {
  title: 'Ayala Avenue traffic advisory issued',
  description: 'The Makati road closure starts Monday.',
  freshness: 'current',
};
if (
  !shouldCreateNewsReviewCandidate(syntheticMobility) ||
  !routeNewsForReview(syntheticMobility).some(
    route => route.owner === 'mobility'
  )
) {
  problems.push(
    'Direct Makati mobility signal does not become an internal review candidate.'
  );
}

const syntheticLifestyle = {
  title: 'New restaurant opens in Makati',
  description: 'A dining feature.',
  freshness: 'current',
};
if (shouldCreateNewsReviewCandidate(syntheticLifestyle)) {
  problems.push(
    'Lifestyle-only Makati coverage should not enter the civic review queue.'
  );
}

if (
  queue.version !== 2 ||
  queue.resolutionPolicyVersion !== newsReviewResolutionPolicyVersion
) {
  problems.push('News review queue is not on the W5-8e resolution contract.');
}

for (const marker of [
  'publicBoundary',
  'promotion',
  'deduplication',
  'routing',
  'recurrence',
]) {
  if (!queue.doctrine?.[marker]) {
    problems.push('News review queue doctrine missing: ' + marker);
  }
}

if (!Array.isArray(queue.suppressedResolved)) {
  problems.push('News review queue lacks suppressed-resolution audit state.');
}

for (const candidate of queue.candidates || []) {
  if (candidate.publicEligible !== false) {
    problems.push(
      'News review candidate is incorrectly public-eligible: ' + candidate.id
    );
  }
  if (
    !candidate.primaryOwner ||
    !Array.isArray(candidate.routes) ||
    !candidate.routes.length
  ) {
    problems.push(
      'News review candidate lacks owner routing: ' + candidate.id
    );
  }
  if (!Array.isArray(candidate.existingMatches)) {
    problems.push(
      'News review candidate lacks canonical deduplication state: ' +
        candidate.id
    );
  }
  if (!Array.isArray(candidate.materialEvidenceKeys)) {
    problems.push(
      'News review candidate lacks material-evidence fingerprint: ' +
        candidate.id
    );
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

const syntheticCandidate = {
  id: 'news-review:synthetic',
  storyClusterId: 'story:synthetic',
  sourceUrl: 'https://example.com/report',
  sourceClass: 'news-media',
  coverageSources: [
    {
      url: 'https://example.com/report',
      sourceClass: 'news-media',
    },
  ],
  existingMatches: [],
  routes: [
    {
      owner: 'services',
      topic: 'services',
    },
  ],
};

const resolvedKeys = newsCandidateMaterialEvidenceKeys(syntheticCandidate);
const syntheticResolution = {
  id: 'resolution:synthetic',
  decision: 'insufficient-evidence',
  resolvedAt: '2026-09-28T15:00:00+08:00',
  match: {
    candidateId: syntheticCandidate.id,
    storyClusterId: syntheticCandidate.storyClusterId,
    sourceUrls: [syntheticCandidate.sourceUrl],
  },
  materialEvidenceKeysAtResolution: resolvedKeys,
};

if (validateNewsReviewResolution(syntheticResolution)) {
  problems.push('Valid synthetic news resolution failed validation.');
}

const sameDisposition = newsResolutionDisposition(
  syntheticResolution,
  syntheticCandidate
);
if (!sameDisposition.suppress || sameDisposition.resurfaced) {
  problems.push(
    'Resolved story is not suppressed when no material evidence changed.'
  );
}

const updatedCandidate = {
  ...syntheticCandidate,
  coverageSources: [
    ...syntheticCandidate.coverageSources,
    {
      url: 'https://www.makati.gov.ph/content/news/new-official-evidence',
      sourceClass: 'government-primary',
    },
  ],
};
const updatedDisposition = newsResolutionDisposition(
  syntheticResolution,
  updatedCandidate
);
if (
  updatedDisposition.suppress ||
  !updatedDisposition.resurfaced ||
  !updatedDisposition.newMaterialEvidenceKeys.some(key =>
    key.startsWith('official-source:')
  )
) {
  problems.push(
    'Resolved story does not resurface when materially new official evidence appears.'
  );
}

const terminalResolution = {
  ...syntheticResolution,
  id: 'resolution:terminal',
  decision: 'out-of-scope',
};
const terminalDisposition = newsResolutionDisposition(
  terminalResolution,
  updatedCandidate
);
if (!terminalDisposition.suppress || terminalDisposition.resurfaced) {
  problems.push(
    'Out-of-scope resolution must remain terminal for the matched story.'
  );
}

const invalidCanonicalResolution = {
  ...syntheticResolution,
  id: 'resolution:missing-canonical-ref',
  decision: 'update-existing',
};
if (!validateNewsReviewResolution(invalidCanonicalResolution)) {
  problems.push(
    'update-existing resolution without canonicalRef incorrectly passed validation.'
  );
}

for (const marker of [
  'exactReferenceMatches',
  'exactUrlMatch',
  'existingMatches',
  'entityContextMatches',
  'newsResolutionDisposition',
  'newsResolutionMatchesCandidate',
  'materialEvidenceKeys',
  'suppressedResolved',
  'material-update-review',
  '0 auto-published',
  "writeFile(\n  'data/news-review-queue.json'",
  "writeFile('data/news-review-queue.md'",
]) {
  if (!builder.includes(marker)) {
    problems.push('News review queue builder marker missing: ' + marker);
  }
}

if (!workflow.includes("cron: '0 1 * * *'")) {
  problems.push(
    'News discovery workflow is not scheduled daily at 09:00 Philippine time.'
  );
}

for (const path of [
  'src/data/newsSnapshot.ts',
  'data/news-discovery-snapshot.json',
  'data/news-review-queue.json',
  'data/news-review-queue.md',
]) {
  if (!workflow.includes(path)) {
    problems.push(
      'News discovery workflow does not include generated review artifact: ' +
        path
    );
  }
}

if (workflow.includes('data/news-review-resolutions.json')) {
  problems.push(
    'Append-only news review resolutions must not be generated or overwritten by the daily workflow.'
  );
}

for (const script of [
  'build:news-review-queue',
  'check:news-review-queue',
]) {
  if (!packageJson.includes('"' + script + '"')) {
    problems.push('Package script missing: ' + script);
  }
}

if (problems.length) {
  console.error(
    'News review queue check failed:\n- ' + problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  'News review queue OK:',
  newsReviewPolicyVersion,
  newsReviewResolutionPolicyVersion,
  String(queue.summary?.total ?? 0) + ' active candidates',
  String(queue.summary?.suppressedResolved ?? 0) + ' resolved suppressed',
  'routing + deduplication + recurrence suppression + material-evidence resurfacing enforced.'
);
