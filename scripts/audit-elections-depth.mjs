import { readFile } from 'node:fs/promises';

const election2025 = await readFile('src/data/election2025.ts', 'utf8');
const electionHistory = await readFile('src/data/electionHistory.ts', 'utf8');
const electionCivic = await readFile('src/data/electionCivic.ts', 'utf8');
const electionsPage = await readFile('src/pages/Elections.tsx', 'utf8');
const publicRecords = await readFile('src/data/publicRecords.ts', 'utf8');
const watchlist = JSON.parse(await readFile('data/source-watchlist.json', 'utf8'));

const problems = [];

const singleSeatBlock =
  election2025.split('export const election2025SingleSeatRaces')[1]?.split(
    'export interface CouncilCandidateResult'
  )[0] ?? '';
const singleSeatKeys = [
  ...singleSeatBlock.matchAll(/\bkey:\s*'([^']+)'/g),
].map(match => match[1]);
if (singleSeatKeys.length !== 4) {
  problems.push(
    'Expected 4 structured 2025 single-seat local races; found ' +
      singleSeatKeys.length +
      '.'
  );
}

const councilBlock =
  election2025.split('export const election2025CouncilCandidates')[1]?.split(
    'export const election2025CouncilCandidateCount'
  )[0] ?? '';
const district1Block =
  councilBlock.split('district1: [')[1]?.split('] satisfies CouncilCandidateResult[]')[0] ?? '';
const district2Block =
  councilBlock.split('district2: [')[1]?.split('] satisfies CouncilCandidateResult[]')[0] ?? '';
const district1Candidates = [...district1Block.matchAll(/name:\s*'[^']+'/g)];
const district2Candidates = [...district2Block.matchAll(/name:\s*'[^']+'/g)];
const electedCouncil = [...councilBlock.matchAll(/elected:\s*true/g)];

if (district1Candidates.length !== 20) {
  problems.push(
    'Expected 20 1st District council candidates; found ' +
      district1Candidates.length +
      '.'
  );
}
if (district2Candidates.length !== 15) {
  problems.push(
    'Expected 15 2nd District council candidates; found ' +
      district2Candidates.length +
      '.'
  );
}
if (electedCouncil.length !== 16) {
  problems.push(
    'Expected 16 elected city councilors across both districts; found ' +
      electedCouncil.length +
      '.'
  );
}

const barangayBlock =
  electionHistory.split('const currentBarangays = [')[1]?.split(
    '] as const;'
  )[0] ?? '';
const barangayCount = [...barangayBlock.matchAll(/\['[^']+',\s*'[^']+'\]/g)]
  .length;
if (barangayCount !== 23) {
  problems.push(
    'Expected 23 current barangays in the 2025 mayoral layer; found ' +
      barangayCount +
      '.'
  );
}

const exactVoteMarkers = [
  ...electionHistory.matchAll(/exactVotesVerified:\s*\n?\s*slug ===/g),
];
if (exactVoteMarkers.length < 1 || !electionHistory.includes("slug === 'san-lorenzo'") || !electionHistory.includes("slug === 'guadalupe-nuevo'")) {
  problems.push(
    'The verified San Lorenzo and Guadalupe Nuevo barangay vote pairs are missing.'
  );
}

const historyBlock =
  electionHistory.split('export const makatiMayoralHistory')[1]?.split(
    'export const historicalValidVotes'
  )[0] ?? '';
const historyYears = [
  ...historyBlock.matchAll(/\byear:\s*(\d{4})/g),
].map(match => Number(match[1]));
if (
  historyYears.length !== 10 ||
  !historyYears.includes(1998) ||
  !historyYears.includes(2025)
) {
  problems.push(
    'Expected 10 regular mayoral elections covering 1998–2025; found ' +
      historyYears.length +
      '.'
  );
}

for (const marker of [
  'Republic Act No. 12232',
  'COMELEC Resolution No. 11207',
  'September 28 – October 5, 2026',
  'November 2, 2026',
  'December 1, 2026',
  "label: 'Pre-filing'",
]) {
  if (!electionCivic.includes(marker)) {
    problems.push('Election civic data is missing required marker: ' + marker);
  }
}

for (const marker of [
  'What BetterMakati currently has',
  'Full 2025 council candidate results',
  'Download the structured election data',
  'Candidate directory status',
  'Campaign materials, social-media announcements and declarations of intent are not treated as a certified candidate list',
]) {
  if (!electionsPage.includes(marker)) {
    problems.push('Elections page is missing required feature: ' + marker);
  }
}

for (const marker of [
  'election2025Csv',
  'barangay2025Csv',
  'mayoralHistoryCsv',
]) {
  if (!electionsPage.includes(marker)) {
    problems.push('Elections page lost downloadable dataset: ' + marker);
  }
}

if (!publicRecords.includes("import { electionCivicSources } from './electionCivic';")) {
  problems.push('Public Records no longer indexes 2026 election civic sources.');
}

const electionWatch = watchlist.filter(item =>
  String(item.kind || '').startsWith('election')
);
if (electionWatch.length < 9) {
  problems.push(
    'Election source-watch coverage fell below 9 sources: ' +
      electionWatch.length +
      '.'
  );
}

if (!electionCivic.includes("export const electionsReviewed = '24 September 2026';")) {
  problems.push('Elections review date is not current for Wave 1.6.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'Elections-depth audit passed: 4 single-seat races; 35 council candidates; 16 elected councilors; 23 barangays; 10 mayoral elections; ' +
    electionWatch.length +
    ' monitored election sources.'
);
