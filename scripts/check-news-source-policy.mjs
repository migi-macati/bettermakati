import { readFile } from 'node:fs/promises';
import {
  newsFreshnessPolicy,
  newsPolicyVersion,
  newsSourceRegistry,
} from './news-policy.mjs';

const [
  feed,
  api,
  generator,
  newsPage,
  todayPage,
  newsRelationships,
  searchIndex,
  snapshot,
] = await Promise.all([
  readFile('scripts/news-feed.mjs', 'utf8'),
  readFile('api/news.js', 'utf8'),
  readFile('scripts/update-news-snapshot.mjs', 'utf8'),
  readFile('src/pages/News.tsx', 'utf8'),
  readFile('src/pages/Today.tsx', 'utf8'),
  readFile('src/data/newsCivicRelationships.ts', 'utf8'),
  readFile('src/data/searchIndex.ts', 'utf8'),
  readFile('src/data/newsSnapshot.ts', 'utf8'),
]);

const problems = [];

if (newsPolicyVersion !== '2026-09-28.w5-8b') {
  problems.push('Unexpected news policy version: ' + newsPolicyVersion);
}

for (const [field, value] of Object.entries(newsFreshnessPolicy)) {
  if (!Number.isFinite(value) || value <= 0) {
    problems.push('Invalid news freshness rule: ' + field);
  }
}

if (
  !(
    newsFreshnessPolicy.todayMaxAgeDays <=
      newsFreshnessPolicy.currentMaxAgeDays &&
    newsFreshnessPolicy.currentMaxAgeDays <=
      newsFreshnessPolicy.recentMaxAgeDays &&
    newsFreshnessPolicy.recentMaxAgeDays <=
      newsFreshnessPolicy.generalFeedMaxAgeDays
  )
) {
  problems.push('News freshness windows are not ordered from narrowest to broadest.');
}

for (const id of ['google-news-rss', 'makati-official-news']) {
  if (!newsSourceRegistry.some(source => source.id === id)) {
    problems.push('Required news source registry entry missing: ' + id);
  }
}

for (const marker of [
  'classifyNewsFreshness',
  'classifyPublisher',
  'newsClusterKey',
  'assessDomainReviewCandidate',
  'generalFeedEligible',
  'todayEligible',
  'reviewCandidate',
  'retrievedAt',
]) {
  if (!feed.includes(marker)) {
    problems.push('News feed policy marker missing: ' + marker);
  }
}

for (const marker of ['policyVersion', 'sourceHealth', 'retrievedAt']) {
  if (!api.includes(marker)) {
    problems.push('News API metadata marker missing: ' + marker);
  }
}

if (!generator.includes("import type { NewsItem } from './newsTypes';")) {
  problems.push('Generated news snapshots do not use the shared NewsItem contract.');
}

if (!snapshot.includes("import type { NewsItem } from './newsTypes';")) {
  problems.push('Current news snapshot does not use the shared NewsItem contract.');
}

if (!newsPage.includes('item.sourceClassLabel')) {
  problems.push('News page does not expose publisher/source class.');
}

if (!todayPage.includes('.filter(isTodayNewsCandidate)')) {
  problems.push('Today does not use the shared news freshness/relevance gate.');
}

if (
  !newsRelationships.includes('export const isTodayNewsCandidate') ||
  !newsRelationships.includes('if (!item.todayEligible) return false;')
) {
  problems.push(
    'Shared Today news candidate gate does not enforce the W5-8b freshness rule.'
  );
}

if (searchIndex.includes("title: 'News & events'")) {
  problems.push('Legacy News & events search ownership is still present.');
}

if (!searchIndex.includes("title: 'Makati in the News'")) {
  problems.push('Makati in the News search result is missing.');
}

if (problems.length) {
  console.error('News source-policy check failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log(
  'News source policy OK:',
  newsPolicyVersion,
  newsSourceRegistry.length + ' registered discovery sources',
  'Today <= ' + newsFreshnessPolicy.todayMaxAgeDays + ' days',
  'general feed <= ' + newsFreshnessPolicy.generalFeedMaxAgeDays + ' days',
  'publisher classes, source health, provenance and review-candidate safeguards present.'
);
