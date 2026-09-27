import { readFile } from 'node:fs/promises';

const [
  resolverSource,
  areaRegistrySource,
  barangaySource,
  parkingSource,
  mobilitySource,
  visitSource,
  whatsOnSource,
] = await Promise.all([
  readFile('src/data/districtReferences.ts', 'utf8'),
  readFile('src/data/areaOrganizationRegistry.ts', 'utf8'),
  readFile('src/data/barangays.ts', 'utf8'),
  readFile('src/pages/Parking.tsx', 'utf8'),
  readFile('src/pages/Mobility.tsx', 'utf8'),
  readFile('src/pages/VisitMakati.tsx', 'utf8'),
  readFile('src/pages/WhatsOn.tsx', 'utf8'),
]);

const problems = [];

for (const marker of [
  "type: 'area'",
  "type: 'barangay'",
  'civicAreaById.get(ref.id)',
  'findBarangay(ref.id)',
  "href: '/estates#area-' + area.id",
  "href: '/barangays/' + barangay.slug",
  'mapQuery:',
  'resolveDistrictReferences',
]) {
  if (!resolverSource.includes(marker)) {
    problems.push('District reference resolver marker missing: ' + marker);
  }
}

const areaBlock =
  areaRegistrySource
    .split('export const civicAreas: CivicAreaRecord[] = [')[1]
    ?.split('\n];\n\nexport const civicOrganizations')[0] ?? '';
const areaIds = new Set(
  [...areaBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1])
);
const barangaySlugs = new Set(
  [...barangaySource.matchAll(/\bslug:\s*'([^']+)'/g)].map(
    match => match[1]
  )
);

const expectedAreaIds = [
  'makati-cbd',
  'ayala-center',
  'salcedo-village',
  'legazpi-village',
  'rockwell-center',
  'circuit-makati',
  'century-city',
];

for (const areaId of expectedAreaIds) {
  if (!areaIds.has(areaId)) {
    problems.push('District-facing feature expects missing area: ' + areaId);
  }
}

if (!barangaySlugs.has('poblacion')) {
  problems.push('District-facing Poblacion reference must reuse Barangay Poblacion.');
}

/* Parking */
for (const marker of [
  "const popularAreas: DistrictReference[]",
  "{ type: 'area', id: 'ayala-center' }",
  "{ type: 'area', id: 'salcedo-village' }",
  "{ type: 'area', id: 'legazpi-village' }",
  "{ type: 'barangay', id: 'poblacion' }",
  "{ type: 'area', id: 'rockwell-center' }",
  "{ type: 'area', id: 'circuit-makati' }",
  "{ type: 'area', id: 'century-city' }",
  'popularAreas.map(resolveDistrictReference)',
  'parkingUrl(area.mapQuery)',
  'href={area.href}',
]) {
  if (!parkingSource.includes(marker)) {
    problems.push('Parking canonical district marker missing: ' + marker);
  }
}

for (const legacy of [
  "'Ayala Center Makati'",
  "'Salcedo Village Makati'",
  "'Legazpi Village Makati'",
  "'Poblacion Makati'",
  "'Rockwell Center Makati'",
  "'Century City Makati'",
]) {
  if (parkingSource.includes(legacy)) {
    problems.push('Parking still stores a duplicated district string: ' + legacy);
  }
}

/* Mobility */
for (const marker of [
  "id: 'ayala-center'",
  "id: 'poblacion'",
  "id: 'makati-cbd'",
  "id: 'rockwell-center'",
  "id: 'circuit-makati'",
  'resolveTripEndpoint',
  "title: centuryCity.label + ' E-Bus'",
  'trip.destination.mapQuery',
  'trip.origin.mapQuery',
]) {
  if (!mobilitySource.includes(marker)) {
    problems.push('Mobility canonical district marker missing: ' + marker);
  }
}

for (const legacy of [
  "label: 'Ayala Center → Poblacion'",
  "label: 'CBD → Rockwell'",
  "label: 'Circuit → Ayala Center'",
  "origin: 'Circuit Makati'",
  "destination: 'Poblacion Makati'",
]) {
  if (mobilitySource.includes(legacy)) {
    problems.push('Mobility still stores a duplicated district trip string: ' + legacy);
  }
}

/* Visit Makati */
for (const marker of [
  'const makeItMakatiAreas = resolveDistrictReferences([',
  "id: 'makati-cbd'",
  "id: 'ayala-center'",
  "id: 'circuit-makati'",
  'makeItMakatiAreas.map(area =>',
  'to={area.href}',
]) {
  if (!visitSource.includes(marker)) {
    problems.push('Visit Makati canonical district marker missing: ' + marker);
  }
}

if (
  visitSource.includes(
    "Ayala Land's guide to Makati CBD, Ayala Center and Circuit Makati."
  )
) {
  problems.push(
    'Visit Makati still duplicates the Make It Makati district list in prose.'
  );
}

/* What's On */
for (const marker of [
  "areaIds: ['makati-cbd', 'ayala-center', 'circuit-makati']",
  "areaIds: ['ayala-center', 'circuit-makati']",
  "areaIds: ['rockwell-center']",
  "areaIds: ['century-city']",
  "resolveDistrictReference({ type: 'area', id: areaId })",
  'to={area.href}',
]) {
  if (!whatsOnSource.includes(marker)) {
    problems.push("What's On canonical district marker missing: " + marker);
  }
}

for (const legacy of [
  "'CBD, Ayala Center and Circuit lifestyle and event updates.'",
  "'Power Plant Mall / Rockwell'",
  "'Rockwell news, events and Proscenium updates.'",
]) {
  if (whatsOnSource.includes(legacy)) {
    problems.push("What's On still stores duplicated district prose: " + legacy);
  }
}

if (problems.length) {
  console.error(
    'District-facing canonical area reference check failed:\n- ' +
      problems.join('\n- ')
  );
  process.exit(1);
}

console.log(
  [
    'District-facing canonical area reference check passed:',
    'Parking uses 6 canonical areas + Barangay Poblacion',
    'Mobility trip labels/queries resolve from canonical districts',
    'Visit Makati resolves Make It Makati coverage from area IDs',
    "What's On resolves district context from area IDs",
    'no duplicate legacy district lists remain on these surfaces',
  ].join(' ')
);
