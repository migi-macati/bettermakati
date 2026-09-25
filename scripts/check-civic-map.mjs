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

const requiredHealthCenterBatchB = [
  'pio-pc-health-center',
  'pio-rhu-health-center',
  'poblacion-health-center',
  'san-isidro-health-center',
  'singkamas-health-center',
  'sta-cruz-health-center',
  'tejeros-health-center',
  'san-antonio-health-center',
  'valenzuela-health-center',
];

for (const id of requiredHealthCenterBatchB) {
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

const requiredFireStationAssets = [
  'makati-central-fire-station',
  'ayala-fire-satellite',
  'bel-air-fire-substation',
  'bangkal-fire-substation',
  'guadalupe-fire-substation',
  'la-paz-fire-substation',
  'pio-del-pilar-fire-substation',
  'palanan-fire-substation',
  'poblacion-fire-substation',
  'tejeros-fire-substation',
  'valenzuela-fire-substation',
];

for (const id of requiredFireStationAssets) {
  if (!assetIds.includes(id)) {
    problems.push('Missing verified Makati fire-station Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  for (const marker of [
    "type: 'public-office'",
    'address:',
    'sourceUrl:',
    'sourceLabel:',
    'coordinateSourceUrl:',
    'coordinateSourceLabel:',
    "status: 'mapped'",
  ]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing verified fire-station metadata: ' + marker);
    }
  }
}

const blockedAmbiguousFireAssets = [
  'new-makati-central-fire-station',
  'west-rembo-fire-substation',
  'comembo-fire-substation',
];

for (const id of blockedAmbiguousFireAssets) {
  if (assetIds.includes(id)) {
    problems.push('Ambiguous/former-Makati fire station must not be mapped as a current Makati asset: ' + id);
  }
}

const requiredPoliceAssets = [
  'makati-city-police-station',
  'makati-police-substation-1',
  'makati-police-substation-2',
  'makati-police-substation-3',
  'makati-police-substation-4',
  'makati-police-substation-5',
  'makati-police-substation-6',
  'makati-police-substation-7',
];

for (const id of requiredPoliceAssets) {
  if (!assetIds.includes(id)) {
    problems.push('Missing verified Makati police-facility Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  for (const marker of [
    "type: 'public-office'",
    'address:',
    'sourceUrl:',
    'sourceLabel:',
    'coordinateSourceUrl:',
    'coordinateSourceLabel:',
    "status: 'mapped'",
  ]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing verified police-facility metadata: ' + marker);
    }
  }
}

const blockedTransferredPoliceAssets = [
  'makati-police-substation-8',
  'makati-police-substation-9',
];

for (const id of blockedTransferredPoliceAssets) {
  if (assetIds.includes(id)) {
    problems.push('Transferred former-Makati police substation must not be mapped as a current Makati asset: ' + id);
  }
}

const requiredCoreCommunityAssets = [
  'makati-social-development-center',
  'makati-youth-home',
  'makati-youth-center',
  'sm-felicidad-sy-center-for-the-elderly',
  'poblacion-public-market',
];

for (const id of requiredCoreCommunityAssets) {
  if (!assetIds.includes(id)) {
    problems.push('Missing verified Makati community/city-owned Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  for (const marker of [
    'address:',
    'sourceUrl:',
    'sourceLabel:',
    'coordinateSourceUrl:',
    'coordinateSourceLabel:',
    "status: 'mapped'",
  ]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing verified community/city-owned metadata: ' + marker);
    }
  }
}

const requiredChildCareHostAssets = [
  'bangkal-barangay-hall',
  'carmona-community-complex',
  'guadalupe-nuevo-barangay-hall',
  'san-antonio-barangay-hall',
  'valenzuela-barangay-hall',
  'south-poblacion-day-care-center',
  'north-poblacion-day-care-center',
  'pio-del-pilar-day-care-center',
];

for (const id of requiredChildCareHostAssets) {
  if (!assetIds.includes(id)) {
    problems.push('Missing child-care host Civic Map asset: ' + id);
    continue;
  }
  const start = assetBlock.indexOf("id: '" + id + "'");
  const end = assetBlock.indexOf('\n  },', start);
  const row = start >= 0 && end >= 0 ? assetBlock.slice(start, end) : '';
  for (const marker of [
    "type: 'community-center'",
    'servicesAtLocation:',
    'address:',
    'sourceUrl:',
    'sourceLabel:',
    'coordinateSourceUrl:',
    'coordinateSourceLabel:',
  ]) {
    if (!row.includes(marker)) {
      problems.push(id + ' is missing child-care host metadata: ' + marker);
    }
  }
}

const childCareServiceNames = [...assetBlock.matchAll(/servicesAtLocation:\s*\[([^\]]*)\]/g)]
  .flatMap(match => [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1]));
const duplicateChildCareServices = childCareServiceNames.filter(
  (name, index) => childCareServiceNames.indexOf(name) !== index
);
if (duplicateChildCareServices.length) {
  problems.push('Duplicate co-located Civic Map services: ' + [...new Set(duplicateChildCareServices)].join(', '));
}

const requiredCurrentChildCareServices = [
  'Bangkal Day Care Center',
  'Carmona Day Care Center',
  'Kasilawan Day Care Center',
  'Kasilawan Child Minding Center',
  'La Paz Day Care Center',
  'Olympia Day Care Center',
  'Palanan 1 Day Care Center',
  'Palanan 2 Day Care Center',
  'Pio del Pilar Day Care Center',
  'South Poblacion Day Care Center',
  'North Poblacion Day Care Center',
  'San Antonio Day Care Center',
  'San Isidro Day Care Center',
  'Tejeros Day Care Center',
  'Makati Homes Tejeros Day Care Center',
  'Sta. Cruz Day Care Center',
  'Valenzuela Day Care Center',
  'Guadalupe Nuevo 1 Day Care Center',
  'Guadalupe Nuevo 2 Day Care Center',
  'Guadalupe Viejo 1 Day Care Center',
  'Guadalupe Viejo 2 Day Care Center',
  'Pinagkaisahan Day Care Center',
];

for (const service of requiredCurrentChildCareServices) {
  if (!childCareServiceNames.includes(service)) {
    problems.push('Missing current Makati child-care service coverage: ' + service);
  }
}

if (childCareServiceNames.includes('Singkamas Day Care Center')) {
  problems.push('Singkamas Day Care Center must remain unresolved until its exact Francisco Benitez III ES host point is frozen.');
}

const blockedDuplicateChildCareAssets = [
  'kasilawan-day-care-center',
  'kasilawan-child-minding-center',
  'la-paz-day-care-center',
  'olympia-day-care-center',
  'palanan-1-day-care-center',
  'palanan-2-day-care-center',
  'san-isidro-day-care-center',
  'tejeros-day-care-center',
  'makati-homes-tejeros-day-care-center',
  'sta-cruz-day-care-center',
  'guadalupe-viejo-1-day-care-center',
  'guadalupe-viejo-2-day-care-center',
  'pinagkaisahan-day-care-center',
];

for (const id of blockedDuplicateChildCareAssets) {
  if (assetIds.includes(id)) {
    problems.push('Co-located child-care service must not be a duplicate Civic Map pin: ' + id);
  }
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
