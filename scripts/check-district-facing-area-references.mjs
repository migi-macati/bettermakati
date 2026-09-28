import { readFile } from 'node:fs/promises';

const [
  resolverSource,
  areaRegistrySource,
  barangaySource,
  mobilitySource,
  visitSource,
  calendarSource,
] = await Promise.all([
  readFile('src/data/districtReferences.ts', 'utf8'),
  readFile('src/data/areaOrganizationRegistry.ts', 'utf8'),
  readFile('src/data/barangays.ts', 'utf8'),
  readFile('src/pages/Mobility.tsx', 'utf8'),
  readFile('src/pages/VisitMakati.tsx', 'utf8'),
  readFile('src/pages/Calendar.tsx', 'utf8'),
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

/* Explore Makati */
for (const marker of [
  'visitorResources.map(resource =>',
  'resource.areaRefs ?? []',
  "resolveDistrictReference({ type: 'area', id: areaId })",
  'areas.map(area =>',
  'to={area.href}',
]) {
  if (!visitSource.includes(marker)) {
    problems.push('Explore Makati canonical district marker missing: ' + marker);
  }
}

if (
  visitSource.includes(
    "Ayala Land's guide to Makati CBD, Ayala Center and Circuit Makati."
  )
) {
  problems.push(
    'Explore Makati still duplicates the Make It Makati district list in prose.'
  );
}

/* Makati Calendar */
for (const marker of [
  'item.geography.areaIds ?? []',
  "resolveDistrictReference({ type: 'area', id: areaId })",
  "key: 'area:' + areaId",
  'label: area.label',
  'href: area.href',
]) {
  if (!calendarSource.includes(marker)) {
    problems.push('Makati Calendar canonical district marker missing: ' + marker);
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
    'Mobility trip labels/queries resolve from canonical districts',
    'Explore Makati resolves visitor-resource coverage from canonical area IDs',
    'Makati Calendar resolves district context from canonical area IDs',
    'no duplicate legacy district lists remain on these surfaces',
  ].join(' ')
);
