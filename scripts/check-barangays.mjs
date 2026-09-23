import { readFile } from 'node:fs/promises';

const source = await readFile('src/data/barangays.ts', 'utf8');
const problems = [];

const profileStart = source.indexOf('const barangayBaseProfiles');
const profileEnd = source.indexOf('export const barangays', profileStart);
const profileBlock = source.slice(profileStart, profileEnd);
const profileRows = [...profileBlock.matchAll(
  /\{ slug: '([^']+)', name: '([^']+)', population2024: (\d+)/g
)].map(match => ({
  slug: match[1],
  name: match[2],
  population: Number(match[3]),
}));

const expected = [
  'bangkal', 'bel-air', 'carmona', 'dasmarinas', 'forbes-park',
  'guadalupe-nuevo', 'guadalupe-viejo', 'kasilawan', 'la-paz', 'magallanes',
  'olympia', 'palanan', 'pinagkaisahan', 'pio-del-pilar', 'poblacion',
  'san-antonio', 'san-isidro', 'san-lorenzo', 'santa-cruz', 'singkamas',
  'tejeros', 'urdaneta', 'valenzuela',
];

const profileSlugs = profileRows.map(item => item.slug);
const uniqueProfiles = new Set(profileSlugs);
if (profileRows.length !== 23 || uniqueProfiles.size !== 23) {
  problems.push(
    `BetterBarangay must contain exactly 23 unique current profiles; found ${profileRows.length} rows / ${uniqueProfiles.size} unique slugs.`
  );
}

for (const slug of expected) {
  if (!uniqueProfiles.has(slug)) problems.push('Missing current barangay profile: ' + slug);
}
for (const slug of uniqueProfiles) {
  if (!expected.includes(slug)) problems.push('Unexpected current barangay profile: ' + slug);
}

const population = profileRows.reduce((sum, item) => sum + item.population, 0);
if (population !== 309770) {
  problems.push(`Current 23-barangay 2024 POPCEN total must be 309,770; found ${population.toLocaleString('en-PH')}.`);
}

const officialsStart = source.indexOf('const barangayOfficialData');
const officialsEnd = source.indexOf('const barangayContactSupplement', officialsStart);
const officialsBlock = source.slice(officialsStart, officialsEnd);
const officialKeys = [...officialsBlock.matchAll(/^  '([^']+)': \{/gm)].map(match => match[1]);
if (officialKeys.length !== 23 || new Set(officialKeys).size !== 23) {
  problems.push(
    `BetterBarangay must contain exactly 23 unique council-roster records; found ${officialKeys.length} rows / ${new Set(officialKeys).size} unique slugs.`
  );
}

for (const slug of expected) {
  const key = `  '${slug}': {`;
  const start = officialsBlock.indexOf(key);
  if (start < 0) {
    problems.push('Missing council roster: ' + slug);
    continue;
  }
  const nextCandidates = officialKeys
    .map(other => officialsBlock.indexOf(`  '${other}': {`, start + key.length))
    .filter(index => index > start);
  const end = nextCandidates.length ? Math.min(...nextCandidates) : officialsBlock.length;
  const record = officialsBlock.slice(start, end);

  if (!/punongBarangay:\s*["']/.test(record)) problems.push(slug + ': missing Punong Barangay');
  if (!/skChairperson:\s*["']/.test(record)) problems.push(slug + ': missing SK Chairperson');
  if (!/term:\s*'2023–2026'/.test(record)) problems.push(slug + ': roster term must be explicit');
  if (!/lastVerified:\s*barangayProfilesReviewed/.test(record)) problems.push(slug + ': roster freshness marker missing');

  const kagawadMatch = record.match(/kagawads:\s*(\[[^\n]+\])/);
  if (!kagawadMatch) {
    problems.push(slug + ': missing kagawad list');
  } else {
    try {
      const kagawads = JSON.parse(kagawadMatch[1]);
      if (kagawads.length < 6 || kagawads.length > 7) {
        problems.push(`${slug}: expected 6–7 currently seated kagawads, found ${kagawads.length}`);
      }
    } catch {
      problems.push(slug + ': kagawad list is not valid JSON-style data');
    }
  }
}

if (!source.includes('barangayCoverageSummary')) {
  problems.push('BetterBarangay coverage metrics are missing.');
}
if (!source.includes('barangayCoverageGaps')) {
  problems.push('BetterBarangay coverage-gap reporting is missing.');
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  `BetterBarangay guardrails passed: 23 profiles, 23 council rosters, ${population.toLocaleString('en-PH')} residents on the current 2024 boundary.`
);
