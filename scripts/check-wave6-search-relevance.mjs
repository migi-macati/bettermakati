import { readFile } from 'node:fs/promises';

const searchIndex = await readFile('src/data/searchIndex.ts', 'utf8');
const serviceSearch = await readFile('src/components/home/ServiceSearch.tsx', 'utf8');
const criticalPaths = await readFile('tests/e2e/critical-paths.spec.mjs', 'utf8');

const problems = [];

const requireAll = (source, label, markers) => {
  for (const marker of markers) {
    if (!source.includes(marker)) {
      problems.push(label + ' missing: ' + marker);
    }
  }
};

requireAll(searchIndex, 'First-class aliases', [
  'aliases?: string[];',
  "aliases: ['city hall', 'makati city hall', 'government offices']",
  "aliases: ['stats', 'city stats', 'makati data']",
  "aliases: ['bids', 'bidding', 'bid awards', 'contracts']",
  "aliases: ['commute', 'transport', 'public transport', 'jeep routes', 'bus routes']",
  "aliases: ['laws', 'city laws', 'ordinances', 'resolutions']",
  "'Brgy ' + barangay.name",
]);

requireAll(serviceSearch, 'Search synonym normalization', [
  'const searchTermSynonyms: Record<string, string[]> = {',
  "brgy: ['barangay']",
  "govt: ['government']",
  "stats: ['statistics']",
  "bids: ['bidding', 'procurement']",
  "commute: ['mobility', 'transport']",
  "laws: ['legislation']",
  'const queryVariants = (query: string) => {',
]);

requireAll(serviceSearch, 'Ranking order', [
  'if (title === variant) score = Math.max(score, 100 * weight);',
  'score = Math.max(score, 88 * weight);',
  'if (keywords.includes(variant)) score = Math.max(score, 30 * weight);',
  'allowFuzzy: index === 0',
  'return Math.max(...scores);',
]);

requireAll(criticalPaths, 'User-facing relevance QA', [
  "['brgy poblacion', 'Barangay Poblacion']",
  "['city hall', 'City offices']",
  "['city stats', 'Makati statistics']",
  "['bids', 'Procurement']",
  "['commute', 'Getting around Makati']",
  "['laws', 'Legislation']",
  "['historical sites', 'Heritage & Culture']",
  "await search.fill('Public Records');",
  "await search.fill('Barangays');",
]);

if (problems.length > 0) {
  console.error('W6-2b search relevance failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log(
  'W6-2b search relevance passed: first-class aliases, civic synonym normalization, canonical-first ranking and representative browser cases are guarded.'
);
