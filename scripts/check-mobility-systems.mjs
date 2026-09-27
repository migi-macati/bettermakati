import { readFile } from 'node:fs/promises';

const [mobilitySource, placeSource, areaSource] = await Promise.all([
  readFile('src/data/mobilitySystems.ts', 'utf8'),
  readFile('src/data/placeRegistry.ts', 'utf8'),
  readFile('src/data/areaOrganizationRegistry.ts', 'utf8'),
]);

const problems = [];

for (const marker of [
  "export type MobilityServiceClass",
  "'public-mass-transit'",
  "'public-ferry'",
  "'private-estate-shuttle'",
  "export type MobilityMode",
  "export interface MobilityServiceRecord",
  "placeConnections: MobilityPlaceConnection[]",
  "relatedAreaIds?: string[]",
  "validateMobilityServices",
  "mobilityServiceById",
  "mobilityServicesForPlace",
  "mobilityServicesForArea",
]) {
  if (!mobilitySource.includes(marker)) {
    problems.push('Mobility system schema marker missing: ' + marker);
  }
}

const sourceBlock =
  mobilitySource
    .split('export const mobilitySources: MobilitySource[] = [')[1]
    ?.split('\n];\n\nconst sourceIdSet')[0] ?? '';

const serviceBlock =
  mobilitySource
    .split('export const mobilityServices: MobilityServiceRecord[] = [')[1]
    ?.split('\n];\n\nexport const validateMobilityServices')[0] ?? '';

const sourceIds = [
  ...sourceBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);

const serviceIds = [
  ...serviceBlock.matchAll(/^    id: '([^']+)',$/gm),
].map(match => match[1]);

const expectedServices = [
  'mrt3',
  'edsa-busway',
  'pasig-river-ferry',
  'century-city-shuttle',
];

if (serviceIds.length !== 4) {
  problems.push(
    'W5-4c1 expects exactly four canonical mobility services; found ' +
      serviceIds.length +
      '.'
  );
}

for (const id of expectedServices) {
  if (!serviceIds.includes(id)) {
    problems.push('Missing canonical W5-4c1 mobility service: ' + id);
  }
}

if (sourceIds.length !== 8) {
  problems.push(
    'W5-4c1 expects eight reconciled mobility source records; found ' +
      sourceIds.length +
      '.'
  );
}

const duplicateServices = serviceIds.filter(
  (id, index) => serviceIds.indexOf(id) !== index
);
if (duplicateServices.length) {
  problems.push(
    'Duplicate canonical mobility service IDs: ' +
      [...new Set(duplicateServices)].join(', ')
  );
}

const placeBlock =
  placeSource
    .split('export const civicAssets: CivicAsset[] = [')[1]
    ?.split('\n];\n\nconst geometryTypeFor')[0] ?? '';

const placeIds = new Set(
  [...placeBlock.matchAll(/^    id: '([^']+)',$/gm)].map(
    match => match[1]
  )
);

const expectedServicePlaces = {
  mrt3: [
    'mrt3-guadalupe',
    'mrt3-buendia',
    'mrt3-ayala',
    'mrt3-magallanes',
  ],
  'edsa-busway': [
    'edsa-busway-guadalupe',
    'edsa-busway-buendia',
    'edsa-busway-ayala',
  ],
  'pasig-river-ferry': [
    'pasig-ferry-guadalupe',
    'pasig-ferry-valenzuela',
  ],
  'century-city-shuttle': ['mrt3-buendia', 'one-ayala-terminal'],
};

const serviceSlice = id => {
  const start = serviceBlock.indexOf("id: '" + id + "'");
  if (start < 0) return '';
  const nextService = expectedServices
    .map(otherId => serviceBlock.indexOf("id: '" + otherId + "'", start + 1))
    .filter(index => index > start)
    .sort((a, b) => a - b)[0];
  return serviceBlock.slice(start, nextService ?? serviceBlock.length);
};

for (const [serviceId, expectedPlaces] of Object.entries(
  expectedServicePlaces
)) {
  const block = serviceSlice(serviceId);
  for (const placeId of expectedPlaces) {
    if (!placeIds.has(placeId)) {
      problems.push(
        'Mobility system expects missing canonical Place: ' +
          serviceId +
          ' -> ' +
          placeId
      );
    }
    if (!block.includes("placeId: '" + placeId + "'")) {
      problems.push(
        'Mobility system is missing expected Place connection: ' +
          serviceId +
          ' -> ' +
          placeId
      );
    }
  }
}

const mrtBlock = serviceSlice('mrt3');
const buswayBlock = serviceSlice('edsa-busway');
const ferryBlock = serviceSlice('pasig-river-ferry');
const centuryBlock = serviceSlice('century-city-shuttle');

for (const [label, block] of [
  ['MRT-3', mrtBlock],
  ['EDSA Busway', buswayBlock],
]) {
  if (
    !block.includes("serviceClass: 'public-mass-transit'") ||
    !block.includes("governance: 'public'") ||
    !block.includes("status: 'operating'")
  ) {
    problems.push(label + ' public operating classification is incomplete.');
  }
}

if (
  !ferryBlock.includes("serviceClass: 'public-ferry'") ||
  !ferryBlock.includes("governance: 'public'") ||
  !ferryBlock.includes("status: 'operating'")
) {
  problems.push('Pasig River Ferry public operating classification is incomplete.');
}

for (const marker of [
  "serviceClass: 'private-estate-shuttle'",
  "governance: 'private'",
  "status: 'operating'",
  "relatedAreaIds: ['century-city']",
  "placeId: 'mrt3-buendia'",
  "placeId: 'one-ayala-terminal'",
  'Fares, departure times and exact stop sequence are deliberately left at the live service portal.',
  'Century City Mall is described by the first-party source as the main terminal but is not duplicated here because it is not yet a canonical BetterMakati Place.',
]) {
  if (!centuryBlock.includes(marker)) {
    problems.push('Century City Shuttle safeguard missing: ' + marker);
  }
}

const areaBlock =
  areaSource
    .split('export const civicAreas: CivicAreaRecord[] = [')[1]
    ?.split('\n];\n\nexport const civicOrganizations')[0] ?? '';

if (!areaBlock.includes("id: 'century-city'")) {
  problems.push(
    'Century City Shuttle related Area must resolve to canonical century-city.'
  );
}

for (const forbidden of [
  "id: 'one-ayala'",
  "id: 'grab'",
  "id: 'angkas'",
  "id: 'joyride'",
  "id: 'move-it'",
]) {
  if (serviceBlock.includes(forbidden)) {
    problems.push(
      'W5-4c1 incorrectly canonicalized a Place/app as a mobility service: ' +
        forbidden
    );
  }
}

for (const forbidden of [
  'lat:',
  'lng:',
  'geometryRef:',
  'routeGeometry',
  'polyline',
]) {
  if (serviceBlock.includes(forbidden)) {
    problems.push(
      'W5-4c1 mobility services must not invent route geometry or representative points: ' +
        forbidden
    );
  }
}

if (mobilitySource.includes('edsabus.com')) {
  problems.push(
    'Third-party edsabus.com must not be the canonical EDSA Busway authority in the mobility registry.'
  );
}

for (const marker of [
  'Use the live official source instead of freezing first/last-train times',
  'Systemwide station counts and daily schedules remain live/volatile',
  'Fares, departure times and exact stop sequence are deliberately left at the live service portal.',
]) {
  if (!mobilitySource.includes(marker)) {
    problems.push('Mobility volatility guard missing: ' + marker);
  }
}

if (problems.length) {
  console.error(
    'Canonical mobility system/service check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'Canonical mobility system/service check passed:',
    serviceIds.length + ' services',
    sourceIds.length + ' reconciled sources',
    'MRT-3 4 canonical Makati stations',
    'EDSA Busway 3 canonical Makati stations',
    'Pasig River Ferry 2 canonical Makati stations',
    'Century City Shuttle private-estate classification + 2 canonical service connections',
    'One Ayala remains a Place',
    'ride-hailing remains external-resource scope',
    'no route geometry or fake route points',
  ].join(' ')
);
