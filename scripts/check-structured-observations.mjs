import { readFile } from 'node:fs/promises';

const schema = JSON.parse(
  await readFile('data/structured-observation-schema.json', 'utf8')
);
const registrySource = await readFile('src/data/placeRegistry.ts', 'utf8');
const placeIndexSource = await readFile('data/place-observation-index.mjs', 'utf8');
const definitionsSource = await readFile('src/data/structuredObservations.ts', 'utf8');
const formSource = await readFile(
  'src/components/civic/CivicObservationForm.tsx',
  'utf8'
);
const summarySource = await readFile(
  'src/components/civic/CivicObservationSummary.tsx',
  'utf8'
);
const placePageSource = await readFile('src/pages/CivicAsset.tsx', 'utf8');
const observationApi = await readFile('api/civic-observation.js', 'utf8');
const civicMapSource = await readFile('src/data/civicMap.ts', 'utf8');
const contributionForm = await readFile(
  'src/components/civic/CivicContributionForm.tsx',
  'utf8'
);
const civicApi = await readFile('api/civic.js', 'utf8');
const discussionSource = await readFile(
  'src/components/civic/CivicDiscussion.tsx',
  'utf8'
);

const problems = [];

const categoryMatch = registrySource.match(
  /export type PlaceCategory\s*=\s*([\s\S]*?);\n/
);
const categories = categoryMatch
  ? [...categoryMatch[1].matchAll(/'([^']+)'/g)].map(match => match[1])
  : [];

const mappedCategories = Object.values(schema.familyMapping).flatMap(
  family => family.placeCategories
);
const duplicates = mappedCategories.filter(
  (category, index) => mappedCategories.indexOf(category) !== index
);
const missing = categories.filter(category => !mappedCategories.includes(category));
const extra = mappedCategories.filter(category => !categories.includes(category));

if (categories.length !== 16) {
  problems.push('Expected 16 Place Registry categories but found ' + categories.length + '.');
}
if (duplicates.length) {
  problems.push('Observation categories mapped more than once: ' + [...new Set(duplicates)].join(', '));
}
if (missing.length) {
  problems.push('Observation schema misses Place Registry categories: ' + missing.join(', '));
}
if (extra.length) {
  problems.push('Observation schema contains unknown categories: ' + extra.join(', '));
}

const indexedPlaceIds = [
  ...placeIndexSource.matchAll(/"id":\s*"([^"]+)"/g),
].map(match => match[1]);
const registryAssetBlockStart = registrySource.indexOf(
  'export const civicAssets: CivicAsset[] = '
);
const registryAssetBlock = registrySource.slice(registryAssetBlockStart);
const registryPlaceIds = [
  ...registryAssetBlock.matchAll(/\n\s+id:\s*'([^']+)',\n\s+title:/g),
].map(match => match[1]);

if (indexedPlaceIds.length !== 88 || registryPlaceIds.length !== 88) {
  problems.push(
    'Observation canonical place index must preserve all 88 registry IDs.'
  );
}
const missingIndexIds = registryPlaceIds.filter(id => !indexedPlaceIds.includes(id));
const extraIndexIds = indexedPlaceIds.filter(id => !registryPlaceIds.includes(id));
if (missingIndexIds.length || extraIndexIds.length) {
  problems.push(
    'Observation canonical place index is out of sync with Place Registry.'
  );
}

const questionCount = Object.values(schema.questionSets).reduce(
  (total, set) => total + set.questions.length,
  0
);
if (Object.keys(schema.familyMapping).length !== 5) {
  problems.push('Structured observations must keep five place families.');
}
if (questionCount !== 41) {
  problems.push('Expected 41 structured questions but found ' + questionCount + '.');
}

for (const marker of [
  'observationFamilyForCategory',
  'observationQuestionSetForPlace',
  'observationResponseChoices',
  "'street-public-realm-v1'",
  "'park-public-space-v1'",
  "'public-facility-v1'",
  "'transport-stop-terminal-v1'",
  "'transport-route-v1'",
]) {
  if (!definitionsSource.includes(marker)) {
    problems.push('Structured observation definitions are missing: ' + marker);
  }
}

for (const marker of [
  "fetch('/api/civic-observation'",
  'Record what you directly observed. Skip anything you did not check.',
  'Record at least one condition you actually observed.',
  'Save observation',
]) {
  if (!formSource.includes(marker)) {
    problems.push('Structured observation form is missing: ' + marker);
  }
}

for (const marker of [
  '<CivicObservationSummary',
  'refreshKey={observationRevision}',
  '<CivicObservationForm',
  'onSubmitted={() => setObservationRevision(value => value + 1)}',
  'Condition snapshots',
]) {
  if (!placePageSource.includes(marker)) {
    problems.push('Place observation summary/form integration is missing: ' + marker);
  }
}

for (const marker of [
  "fetch('/api/civic-observation?placeId='",
  'const SUMMARY_WINDOW_DAYS = 90',
  "if (ageDays <= 30) return { label: 'Fresh'",
  "if (ageDays <= 90) return { label: 'Recent'",
  "return { label: 'Older'",
  'observations.length',
  'Latest: {formatDate(latestObservedAt)}',
  'Last {SUMMARY_WINDOW_DAYS} days · n={summary.sampleCount}',
  'isNotObservedValue(row.answer.value)',
  'observationValueLabel(',
  'new Date(asOf).getTime() - SUMMARY_WINDOW_DAYS * DAY_MS',
]) {
  if (!summarySource.includes(marker)) {
    problems.push('Condition summary contract is missing: ' + marker);
  }
}

for (const marker of [
  "'[Place Observations] ' + payload.placeName",
  "'<!-- place-observation '",
  "'<!-- observation-thread '",
  "placeObservationById.get(payload.placeId)",
  "payload.placeName = canonicalPlace.name",
  "payload.placeCategory = canonicalPlace.category",
  "familyCategories[payload.familyId]?.has(payload.placeCategory)",
  'validQuestionSetId(payload.familyId, payload.questionSetId)',
  'sanitizeAnswers(payload.familyId, payload.placeCategory, payload.answers)',
  'questionCategoryLimits[familyId]?.[questionId]',
  "if (!thread) return res.status(200).json({ observations: [], asOf })",
  "asOf,",
]) {
  if (!observationApi.includes(marker)) {
    problems.push('Observation storage path is missing: ' + marker);
  }
}

if (summarySource.includes('Date.now()')) {
  problems.push('Condition summary must use the API asOf timestamp, not render-time Date.now().');
}

for (const forbidden of [
  'overallScore',
  'averageRating',
  'compositeIndex',
  'weightedScore',
  'starRating',
  'overall place score',
  'ranked places',
  'best place',
  'worst place',
]) {
  if (
    definitionsSource.includes(forbidden) ||
    formSource.includes(forbidden) ||
    summarySource.includes(forbidden) ||
    observationApi.includes(forbidden)
  ) {
    problems.push('Structured observation implementation contains forbidden score/ranking field: ' + forbidden);
  }
}

if (civicMapSource.includes("| 'review'")) {
  problems.push('Generic review remains a valid CivicContributionKind.');
}
for (const retired of ['criteriaForAsset', 'CivicCriterion', 'commonCriteria', 'streetCriteria']) {
  if (civicMapSource.includes(retired)) {
    problems.push('Retired generic rating criteria remain in civicMap.ts: ' + retired);
  }
}
for (const forbidden of [
  'Rate this place / service',
  'Choose at least one rating',
  'structured-review',
  "kind === 'review'",
  'scores: kind',
]) {
  if (contributionForm.includes(forbidden)) {
    problems.push('Generic rating UI still exists: ' + forbidden);
  }
  if (civicApi.includes(forbidden)) {
    problems.push('Generic rating write API still exists: ' + forbidden);
  }
}

if (!civicApi.includes("'[Civic Reviews]'")) {
  problems.push('Legacy Civic Reviews read prefix must remain available.');
}
if (!discussionSource.includes("reviews: 'Legacy reviews'")) {
  problems.push('Historical rating records must be labeled Legacy reviews.');
}

for (const forbidden of [
  'civic-admin',
  'community-verified-resolved',
  'referralEligible',
]) {
  if (observationApi.includes(forbidden)) {
    problems.push('Observation storage must stay outside civic case lifecycle: ' + forbidden);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'Structured observation integrity OK: ' +
    categories.length +
    ' place categories, ' +
    Object.keys(schema.familyMapping).length +
    ' families, ' +
    questionCount +
    ' questions, no generic rating write path.'
);
