import { readFile } from 'node:fs/promises';

const text = await readFile('src/data/civicMap.ts', 'utf8');
const problems = [];

const assetBlock = text.split('export const civicAssets')[1]?.split('const commonCriteria')[0] ?? '';
const assetIds = [...assetBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);
const duplicateAssets = assetIds.filter((id, index) => assetIds.indexOf(id) !== index);
if (duplicateAssets.length) {
  problems.push('Duplicate Civic Map asset IDs: ' + [...new Set(duplicateAssets)].join(', '));
}

const requiredGovernmentServiceAssets = [
  'psa-makati-crs',
  'lto-makati-district',
  'sec-headquarters',
  'makati-central-fire-station',
];

for (const id of requiredGovernmentServiceAssets) {
  if (!assetIds.includes(id)) {
    problems.push('Missing verified government-service Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  for (const marker of ['address:', 'sourceUrl:', 'sourceLabel:', "status: 'mapped'"]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing verified facility metadata: ' + marker);
    }
  }
}

const requiredParkAssets = [
  'ayala-triangle-gardens',
  'washington-sycip-park',
  'legazpi-active-park',
];

for (const id of requiredParkAssets) {
  if (!assetIds.includes(id)) {
    problems.push('Missing verified park Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  for (const marker of ["type: 'park'", 'address:', 'sourceUrl:', 'sourceLabel:', "status: 'mapped'"]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing verified park metadata: ' + marker);
    }
  }
}

const requiredTransportAssets = [
  'mrt3-guadalupe',
  'mrt3-buendia',
  'mrt3-ayala',
  'mrt3-magallanes',
  'one-ayala-terminal',
];

for (const id of requiredTransportAssets) {
  if (!assetIds.includes(id)) {
    problems.push('Missing verified transport Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  const expectedType = id === 'one-ayala-terminal'
    ? "type: 'transport-terminal'"
    : "type: 'transport-stop'";
  for (const marker of [
    expectedType,
    'address:',
    'sourceUrl:',
    'sourceLabel:',
    'coordinateSourceUrl:',
    'coordinateSourceLabel:',
    "status: 'mapped'",
  ]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing verified transport metadata: ' + marker);
    }
  }
}

const coordinates = [...assetBlock.matchAll(/lat:\s*([0-9.]+),\s*\n\s*lng:\s*([0-9.]+)/g)].map(match => ({
  lat: Number(match[1]),
  lng: Number(match[2]),
}));
if (coordinates.length !== assetIds.length) {
  problems.push(`Expected coordinates for ${assetIds.length} assets but found ${coordinates.length}.`);
}
for (const { lat, lng } of coordinates) {
  if (lat < 14.4 || lat > 14.7 || lng < 120.9 || lng > 121.2) {
    problems.push(`Civic Map coordinate appears outside the Makati/Metro Manila pilot area: ${lat}, ${lng}`);
  }
}

const issueBlock = text.split('export const civicIssueCategories')[1]?.split('export const civicProposalCategories')[0] ?? '';
const issueIds = [...issueBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);
const duplicateIssues = issueIds.filter((id, index) => issueIds.indexOf(id) !== index);
if (duplicateIssues.length) {
  problems.push('Duplicate Civic Map issue category IDs: ' + [...new Set(duplicateIssues)].join(', '));
}

const emergencyRows = issueBlock
  .split(/\n\s*\{/)
  .filter(block => /emergency:\s*true/.test(block));
for (const row of emergencyRows) {
  if (!/preferredChannel:\s*'911'/.test(row)) {
    const id = row.match(/id:\s*'([^']+)'/)?.[1] ?? 'unknown';
    problems.push('Emergency category must route to Unified 911: ' + id);
  }
}

const proposalBlock = text.split('export const civicProposalCategories')[1]?.split('export const issueCategoriesForAsset')[0] ?? '';
const proposalIds = [...proposalBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);
const duplicateProposals = proposalIds.filter((id, index) => proposalIds.indexOf(id) !== index);
if (duplicateProposals.length) {
  problems.push('Duplicate Civic Map proposal category IDs: ' + [...new Set(duplicateProposals)].join(', '));
}

if (assetIds.length < 18) problems.push('Civic Map needs at least eighteen mapped/pilot assets after the first transport expansion.');
if (issueIds.length < 20) problems.push('Civic Map issue taxonomy appears unexpectedly small.');
if (proposalIds.length < 10) problems.push('Civic Map proposal taxonomy appears unexpectedly small.');

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  `Civic Map integrity passed: ${assetIds.length} assets, ${issueIds.length} issue categories, ${proposalIds.length} proposal categories, ${emergencyRows.length} emergency categories routed to 911.`
);
