import { readFile } from 'node:fs/promises';
import {
  newsReviewPolicyVersion,
  primaryNewsReviewOwner,
  routeNewsForReview,
  shouldCreateNewsReviewCandidate,
} from './news-review-routing.mjs';

const [queueRaw, builder, workflow, packageJson] = await Promise.all([
  readFile('data/news-review-queue.json', 'utf8'),
  readFile('scripts/build-news-review-queue.mjs', 'utf8'),
  readFile('.github/workflows/weekly-content-refresh.yml', 'utf8'),
  readFile('package.json', 'utf8'),
]);

const queue = JSON.parse(queueRaw);
const problems = [];

if (newsReviewPolicyVersion !== '2026-09-28.w5-8d') {
  problems.push('Unexpected news review policy version: ' + newsReviewPolicyVersion);
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
  problems.push('Legislation routing does not resolve to the legislation owner.');
}

const syntheticMobility = {
  title: 'Ayala Avenue traffic advisory issued',
  description: 'The Makati road closure starts Monday.',
  freshness: 'current',
};
if (
  !shouldCreateNewsReviewCandidate(syntheticMobility) ||
  !routeNewsForReview(syntheticMobility).some(route => route.owner === 'mobility')
) {
  problems.push('Direct Makati mobility signal does not become an internal review candidate.');
}

const syntheticLifestyle = {
  title: 'New restaurant opens in Makati',
  description: 'A dining feature.',
  freshness: 'current',
};
if (shouldCreateNewsReviewCandidate(syntheticLifestyle)) {
  problems.push('Lifestyle-only Makati coverage should not enter the civic review queue.');
}

if (!queue.doctrine?.publicBoundary || !queue.doctrine?.promotion) {
  problems.push('News review queue doctrine is incomplete.');
}

for (const candidate of queue.candidates || []) {
  if (candidate.publicEligible !== false) {
    problems.push('News review candidate is incorrectly public-eligible: ' + candidate.id);
  }
  if (!candidate.primaryOwner || !Array.isArray(candidate.routes) || !candidate.routes.length) {
    problems.push('News review candidate lacks owner routing: ' + candidate.id);
  }
  if (!Array.isArray(candidate.existingMatches)) {
    problems.push('News review candidate lacks canonical deduplication state: ' + candidate.id);
  }
}

for (const marker of [
  'exactReferenceMatches',
  'exactUrlMatch',
  'existingMatches',
  'entityContextMatches',
  '0 auto-published',
  "writeFile(\n  'data/news-review-queue.json'",
  "writeFile('data/news-review-queue.md'",
]) {
  if (!builder.includes(marker)) {
    problems.push('News review queue builder marker missing: ' + marker);
  }
}

if (!workflow.includes("cron: '0 1 * * *'")) {
  problems.push('News discovery workflow is not scheduled daily at 09:00 Philippine time.');
}

for (const path of [
  'src/data/newsSnapshot.ts',
  'data/news-discovery-snapshot.json',
  'data/news-review-queue.json',
  'data/news-review-queue.md',
]) {
  if (!workflow.includes(path)) {
    problems.push('News discovery workflow does not include generated review artifact: ' + path);
  }
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
  console.error('News review queue check failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log(
  'News review queue OK:',
  newsReviewPolicyVersion,
  String(queue.summary?.total ?? 0) + ' current candidates',
  'topic routing + canonical deduplication + internal-only boundary enforced.'
);
