import { readFile } from 'node:fs/promises';

const text = await readFile('src/data/civicMap.ts', 'utf8');
const problems = [];

const assetBlock = text.split('export const civicAssets')[1]?.split('const commonCriteria')[0] ?? '';
const assetIds = [...assetBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);
const duplicateAssets = assetIds.filter((id, index) => assetIds.indexOf(id) !== index);
if (duplicateAssets.length) {
  problems.push('Duplicate Civic Map asset IDs: ' + [...new Set(duplicateAssets)].join(', '));
}

const requiredHealthCenterBatchA = [
  'bangkal-health-center',
  'carmona-health-center',
  'guadalupe-nuevo-health-center',
  'guadalupe-viejo-health-center',
  'kasilawan-health-center',
  'la-paz-health-center',
  'olympia-health-center',
  'palanan-health-center',
  'pinagkaisahan-health-center',
];

for (const id of requiredHealthCenterBatchA) {
  if (!assetIds.includes(id)) {
    problems.push('Missing verified Makati health-center Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  for (const marker of [
    "type: 'health-center'",
    'address:',
    'sourceUrl:',
    'sourceLabel:',
    'coordinateSourceUrl:',
    'coordinateSourceLabel:',
    "status: 'mapped'",
  ]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing verified health-center metadata: ' + marker);
    }
  }
}

if (assetIds.includes('palanan-24-7-health-center')) {
  problems.push('Palanan 24/7 is a service designation at Palanan Health Center and must not be a duplicate asset.');
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

const requiredPublicParkAssets = [
  'magallanes-interchange-park',
  'kennely-ann-lacia-binay-park-guadalupe-nuevo',
  'guadalupe-viejo-cloverleaf-park',
  'poblacion-park',
  'valenzuela-park',
  'poblacion-linear-park',
  'plaza-cristo-rey',
  'riverside-carmona',
  'buendia-plaza',
  'freedom-park',
  'edsa-buendia-park',
  'guadalupe-nuevo-linear-park',
  'edsa-pinagkaisahan-park',
];

for (const id of requiredPublicParkAssets) {
  if (!assetIds.includes(id)) {
    problems.push('Missing verified current public-park Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  for (const marker of [
    "type: 'park'",
    "accessClass: 'government-public'",
    'address:',
    'sourceUrl:',
    'sourceLabel:',
    'coordinateSourceUrl:',
    'coordinateSourceLabel:',
    "status: 'mapped'",
  ]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing verified public-park metadata: ' + marker);
    }
  }
}

const unresolvedPublicParkAssets = [
  'post-office-pocket-park',
  'makati-city-hall-park',
  'playground-park-poblacion',
  'makati-des-linear-park',
];

const mergedHistoricalPublicParkAliases = [
  'gil-puyat-slex',
  'pinagkaisahan-underpass-park',
  'kalayaan-avenue-park-pinagkaisahan',
];

const formerMakatiPublicParkAssets = [
  'makati-park-and-garden',
  'cembo-linear-park',
  'east-rembo-park',
];

for (const id of unresolvedPublicParkAssets) {
  if (assetIds.includes(id)) {
    problems.push('Unresolved historical park must not be mapped as a distinct current asset: ' + id);
  }
}

for (const id of mergedHistoricalPublicParkAliases) {
  if (assetIds.includes(id)) {
    problems.push('Historical park alias/lineage must not be mapped as a duplicate current asset: ' + id);
  }
}

for (const id of formerMakatiPublicParkAssets) {
  if (assetIds.includes(id)) {
    problems.push('Former-Makati public park must not be mapped as a current Makati asset: ' + id);
  }
}

const requiredPrivatePublicAccessParkAssets = [
  'ayala-triangle-gardens',
  'washington-sycip-park',
  'legazpi-active-park',
  'greenbelt-park',
  'jaime-velasquez-park',
  'palm-promenade-park',
  'glorietta-4-park',
];

for (const id of requiredPrivatePublicAccessParkAssets) {
  if (!assetIds.includes(id)) {
    problems.push('Missing verified private/public-access park Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  for (const marker of [
    "type: 'park'",
    "accessClass: 'public-access-private-managed'",
    'address:',
    'sourceUrl:',
    'sourceLabel:',
    'coordinateSourceUrl:',
    'coordinateSourceLabel:',
    "status: 'mapped'",
  ]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing private/public-access park metadata: ' + marker);
    }
  }
}

const privateParkAssetsNotForCurrentCivicMap = [
  'dela-rosa-gardens',
  'ayala-edsa-park',
  'senior-citizen-park',
  'bel-air-park-near-barangay-hall',
  'forbes-park-and-pavillion',
  'mahogany-park',
  'park-at-san-lorenzo-assumption',
  'bel-air-park-hercules',
  'san-felipe-park',
  'urdaneta-park',
  'track-30th-bgc',
  'bonifacio-high-street-7th',
  'bonifacio-high-street-8th',
  'bonifacio-high-street-9th',
  'bonifacio-high-street-11th',
  'de-jesus-oval-park',
  'terra-28th-park',
];

for (const id of privateParkAssetsNotForCurrentCivicMap) {
  if (assetIds.includes(id)) {
    problems.push('Private/future/former-Makati park must not be in the current public-access Civic Map layer: ' + id);
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

const requiredBuswayAssets = [
  'edsa-busway-guadalupe',
  'edsa-busway-buendia',
  'edsa-busway-ayala',
];

for (const id of requiredBuswayAssets) {
  if (!assetIds.includes(id)) {
    problems.push('Missing verified EDSA Busway Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  for (const marker of [
    "type: 'transport-stop'",
    'address:',
    'sourceUrl:',
    'sourceLabel:',
    'coordinateSourceUrl:',
    'coordinateSourceLabel:',
    "status: 'mapped'",
  ]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing verified Busway metadata: ' + marker);
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

if (assetIds.length < 21) problems.push('Civic Map needs at least twenty-one mapped/pilot assets after the EDSA Busway expansion.');
if (issueIds.length < 20) problems.push('Civic Map issue taxonomy appears unexpectedly small.');
if (proposalIds.length < 10) problems.push('Civic Map proposal taxonomy appears unexpectedly small.');

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  `Civic Map integrity passed: ${assetIds.length} assets, ${issueIds.length} issue categories, ${proposalIds.length} proposal categories, ${emergencyRows.length} emergency categories routed to 911.`
);
