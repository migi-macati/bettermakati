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
  problems.push('Expected 20 1st District council candidates; found ' + district1Candidates.length + '.');
}
if (district2Candidates.length !== 15) {
  problems.push('Expected 15 2nd District council candidates; found ' + district2Candidates.length + '.');
}
if (electedCouncil.length !== 16) {
  problems.push('Expected 16 elected city councilors; found ' + electedCouncil.length + '.');
}

const barangayBlock =
  electionHistory.split('const currentBarangays = [')[1]?.split('] as const;')[0] ?? '';
const barangayCount = [...barangayBlock.matchAll(/\['[^']+',\s*'[^']+'\]/g)].length;
if (barangayCount !== 23) problems.push('Expected 23 current barangays; found ' + barangayCount + '.');

const historyBlock =
  electionHistory.split('export const makatiMayoralHistory')[1]?.split(
    'export const historicalValidVotes'
  )[0] ?? '';
const historyYears = [...historyBlock.matchAll(/\byear:\s*(\d{4})/g)].map(match => Number(match[1]));
if (historyYears.length !== 10 || !historyYears.includes(1998) || !historyYears.includes(2025)) {
  problems.push('Expected 10 regular mayoral elections covering 1998–2025.');
}

for (const marker of [
  'Republic Act No. 12326',
  "electionDate: '2028-11-13'",
  'Second Monday of November 2028',
  "title: 'Five-year term'",
  "title: '2026 schedule superseded'",
  "label: '2028 election cycle'",
  'supersededBske2026Milestones',
]) {
  if (!electionCivic.includes(marker)) {
    problems.push('Current election civic data is missing marker: ' + marker);
  }
}

for (const stale of [
  "label: 'COC filing period'",
  "Election day: November 2, 2026",
  'Official Makati candidate list pending COMELEC publication.',
]) {
  if (electionCivic.includes(stale) || electionsPage.includes(stale)) {
    problems.push('Stale operative 2026 election text remains: ' + stale);
  }
}

for (const marker of [
  'Full 2025 council candidate results',
  'Download the structured election data',
  'Candidate directory status',
  '2028 Barangay & SK Elections',
  'Election day: November 13, 2028',
  'Superseded 2026 schedule',
  'No operative 2026 COC filing period remains.',
]) {
  if (!electionsPage.includes(marker)) {
    problems.push('Elections page is missing current feature: ' + marker);
  }
}

for (const marker of ['election2025Csv', 'barangay2025Csv', 'mayoralHistoryCsv']) {
  if (!electionsPage.includes(marker)) {
    problems.push('Elections page lost downloadable dataset: ' + marker);
  }
}

if (!publicRecords.includes("import { electionCivicSources } from './electionCivic';")) {
  problems.push('Public Records no longer indexes election civic sources.');
}
if (!publicRecords.includes('Republic Act No. 12326 — current BSKE schedule update')) {
  problems.push('Public Records is missing the current BSKE law-update source.');
}
if (!publicRecords.includes('COMELEC 2026 BSKE calendar — superseded')) {
  problems.push('Public Records lost the superseded schedule source.');
}

const electionWatch = watchlist.filter(item =>
  String(item.kind || '').startsWith('election')
);
for (const id of [
  'pia-ra-12326-bske-current-schedule',
  'pna-ra-12326-bske-postponement',
]) {
  if (!electionWatch.some(item => item.id === id)) {
    problems.push('Current RA 12326 source-watch entry missing: ' + id);
  }
}
const comelecHome = electionWatch.find(item => item.id === 'comelec-home');
if (!comelecHome?.affectedPages?.includes('/calendar')) {
  problems.push('COMELEC announcement monitoring does not feed the Calendar.');
}
if (electionWatch.length < 9) {
  problems.push('Election source-watch coverage fell below 9 sources: ' + electionWatch.length + '.');
}

if (!electionCivic.includes("export const electionsReviewed = '28 September 2026';")) {
  problems.push('Elections review date is not current after the RA 12326 reconciliation.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'Elections-depth audit passed: historical results retained, RA 12326/November 2028 schedule reconciled, superseded 2026 dates labeled, and current source coverage preserved.'
);
