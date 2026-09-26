import { readFile } from 'node:fs/promises';

const schema = JSON.parse(
  await readFile('data/structured-observation-schema.json', 'utf8')
);
const registrySource = await readFile('src/data/placeRegistry.ts', 'utf8');
const definitionsSource = await readFile('src/data/structuredObservations.ts', 'utf8');
const formSource = await readFile(
  'src/components/civic/CivicObservationForm.tsx',
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
  '<CivicObservationForm place={place} />',
  'Observe conditions',
  'Record current conditions',
]) {
  if (!placePageSource.includes(marker)) {
    problems.push('Place observation entry is missing: ' + marker);
  }
}

for (const marker of [
  "'[Place Observations] ' + payload.placeName",
  "'<!-- place-observation '",
  "'<!-- observation-thread '",
  "familyCategories[payload.familyId]?.has(payload.placeCategory)",
  'validQuestionSetId(payload.familyId, payload.questionSetId)',
  'sanitizeAnswers(payload.familyId, payload.placeCategory, payload.answers)',
  'questionCategoryLimits[familyId]?.[questionId]',
  "return res.status(200).json({ observations: [] })",
]) {
  if (!observationApi.includes(marker)) {
    problems.push('Observation storage path is missing: ' + marker);
  }
}

for (const forbidden of [
  'overallScore',
  'averageRating',
  'compositeIndex',
  'weightedScore',
  'starRating',
]) {
  if (
    definitionsSource.includes(forbidden) ||
    formSource.includes(forbidden) ||
    observationApi.includes(forbidden)
  ) {
    problems.push('Structured observation implementation contains forbidden score field: ' + forbidden);
  }
}

if (civicMapSource.includes("| 'review'")) {
  problems.push('Generic review remains a valid CivicContributionKind.');
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
