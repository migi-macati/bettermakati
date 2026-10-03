import { readFile } from 'node:fs/promises';

const [
  registrySource,
  visitDataSource,
  collectionsSource,
  heritagePageSource,
  heritageMapSource,
  civicAssetPageSource,
  historySource,
  barangaySource,
  visitPageSource,
  appSource,
] = await Promise.all([
  readFile('src/data/placeRegistry.ts', 'utf8'),
  readFile('src/data/visitMakati.ts', 'utf8'),
  readFile('src/data/heritageCollections.ts', 'utf8'),
  readFile('src/pages/Heritage.tsx', 'utf8'),
  readFile('src/components/heritage/HeritageMap.tsx', 'utf8'),
  readFile('src/pages/CivicAsset.tsx', 'utf8'),
  readFile('src/data/makatiHistory.ts', 'utf8'),
  readFile('src/data/barangays.ts', 'utf8'),
  readFile('src/pages/VisitMakati.tsx', 'utf8'),
  readFile('src/App.tsx', 'utf8'),
]);

const problems = [];
const warnings = [];

const coreHeritageIds = [
  'nuestra-senora-de-gracia-church',
  'sts-peter-and-paul-parish-church',
  'nielson-tower',
  'dambana-ng-banal-na-krus',
  'museo-ng-makati',
  'ayala-museum',
  'plaza-cristo-rey',
];

const reusableMediaIds = coreHeritageIds.filter(
  id => id !== 'plaza-cristo-rey'
);

const normalize = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('en-PH')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const single = (row, property) =>
  row.match(new RegExp('\\b' + property + ":\\s*'([^']+)'"))?.[1] ?? null;

const registryBlock =
  registrySource
    .split('export const civicAssets: CivicAsset[] = [')[1]
    ?.split('const geometryTypeFor')[0] ?? '';

const assetRows = [
  ...registryBlock.matchAll(/\n  \{\n([\s\S]*?)\n  \},?/g),
].map(match => match[1]);

const assets = assetRows.map(row => {
  const aliasesMatch = row.match(/\baliases:\s*\[([^\]]*)\]/);
  const aliases = aliasesMatch
    ? [...aliasesMatch[1].matchAll(/'([^']+)'/g)].map(match => match[1])
    : [];

  return {
    row,
    id: single(row, 'id'),
    title: single(row, 'title'),
    barangay: single(row, 'barangay'),
    sourceUrl: single(row, 'sourceUrl'),
    sourceLabel: single(row, 'sourceLabel'),
    coordinateSourceUrl: single(row, 'coordinateSourceUrl'),
    coordinateSourceLabel: single(row, 'coordinateSourceLabel'),
    aliases,
  };
});

const assetById = new Map(assets.map(asset => [asset.id, asset]));

for (const id of coreHeritageIds) {
  const asset = assetById.get(id);
  if (!asset) {
    problems.push('Missing canonical heritage place: ' + id);
    continue;
  }

  if (!/\bheritage:\s*\{/.test(asset.row)) {
    problems.push('Missing structured heritage metadata: ' + id);
  }
  if (!asset.barangay) {
    problems.push('Missing barangay assignment: ' + id);
  }
  if (
    !asset.sourceUrl ||
    !asset.sourceLabel ||
    !asset.coordinateSourceUrl ||
    !asset.coordinateSourceLabel
  ) {
    problems.push('Incomplete identity/coordinate provenance: ' + id);
  }
}

const barangayProfiles = [
  ...barangaySource.matchAll(
    /\{\s*slug:\s*'([^']+)',\s*name:\s*'([^']+)'/g
  ),
].map(match => ({ slug: match[1], name: match[2] }));
const barangayNames = new Set(barangayProfiles.map(item => item.name));

for (const id of coreHeritageIds) {
  const barangay = assetById.get(id)?.barangay;
  if (barangay && !barangayNames.has(barangay)) {
    problems.push(
      'Heritage place barangay does not resolve to BetterBarangay: ' +
        id +
        ' -> ' +
        barangay
    );
  }
}

/* No second canonical identity hiding behind a title or alias. */
for (const id of coreHeritageIds) {
  const target = assetById.get(id);
  if (!target) continue;

  const targetNames = new Set(
    [target.title, ...target.aliases].filter(Boolean).map(normalize)
  );

  for (const candidate of assets) {
    if (!candidate.id || candidate.id === id) continue;
    const candidateNames = [candidate.title, ...candidate.aliases]
      .filter(Boolean)
      .map(normalize);

    const collision = candidateNames.find(name => targetNames.has(name));
    if (collision) {
      problems.push(
        'Possible duplicate heritage identity: ' +
          id +
          ' conflicts with ' +
          candidate.id +
          ' on "' +
          collision +
          '"'
      );
    }
  }
}

/* Unresolved historical-house research must not silently become a canonical place. */
for (const unresolvedId of [
  'casa-hacienda-san-pedro-macati',
  'hacienda-makati-oficinas',
  'casa-quinta-casa-de-ingenieros',
  'nielson-airport-historical-site',
]) {
  if (assetById.has(unresolvedId)) {
    problems.push(
      'Research-only historical place was promoted without reconciliation: ' +
        unresolvedId
    );
  }
}

/* Heritage presentation remains presentation-only. */
const heritagePresentationBlock =
  visitDataSource.split('export const heritageSites: HeritageSite[] = [')[1]
    ?.split('\n];')[0] ?? '';
const heritagePresentationRows = [
  ...heritagePresentationBlock.matchAll(/\n  \{\n([\s\S]*?)\n  \},?/g),
].map(match => match[1]);
const presentationIds = heritagePresentationRows
  .map(row => single(row, 'placeId'))
  .filter(Boolean);

if (presentationIds.length !== coreHeritageIds.length) {
  problems.push(
    'Expected ' +
      coreHeritageIds.length +
      ' heritage presentation records, found ' +
      presentationIds.length
  );
}

for (const id of coreHeritageIds) {
  if (!presentationIds.includes(id)) {
    problems.push('Core heritage place missing from Heritage page data: ' + id);
  }
}

for (const row of heritagePresentationRows) {
  const id = single(row, 'placeId') ?? 'unknown';
  for (const forbidden of [
    'name',
    'address',
    'mapsQuery',
    'sourceUrl',
    'sourceLabel',
  ]) {
    if (new RegExp('\\b' + forbidden + ':').test(row)) {
      problems.push(
        'Heritage presentation duplicates canonical field ' +
          forbidden +
          ': ' +
          id
      );
    }
  }
}

/* Canonical visitor cards must also derive identity/location from Place Registry. */
const visitorBlock =
  visitDataSource.split('export const visitorPlaces: VisitorPlace[] = [')[1]
    ?.split('\n];')[0] ?? '';
const visitorRows = [
  ...visitorBlock.matchAll(/\n  \{\n([\s\S]*?)\n  \},?/g),
].map(match => match[1]);

for (const row of visitorRows) {
  const placeId = single(row, 'placeId');
  if (!placeId) continue;
  if (!assetById.has(placeId)) {
    problems.push('Visitor card points to missing canonical place: ' + placeId);
  }
  for (const duplicateField of ['name', 'mapsQuery']) {
    if (new RegExp('\\b' + duplicateField + ':').test(row)) {
      problems.push(
        'Canonical visitor card duplicates ' +
          duplicateField +
          ': ' +
          placeId
      );
    }
  }
}

for (const marker of [
  'const visitorRefView',
  'const place = placeRegistryById.get(ref.id)',
  'label: place.name',
  'place.location.point.lat',
  'place.location.point.lng',
]) {
  if (!visitPageSource.includes(marker)) {
    problems.push('Explore Makati canonical-place derivation missing: ' + marker);
  }
}

/* Every core heritage place should participate in the historical graph. */
const historyPlaceIds = [
  ...historySource.matchAll(/placeIds:\s*\[([\s\S]*?)\]/g),
].flatMap(match =>
  [...match[1].matchAll(/'([^']+)'/g)].map(idMatch => idMatch[1])
);

for (const id of coreHeritageIds) {
  if (!historyPlaceIds.includes(id)) {
    problems.push('Core heritage place has no History relationship: ' + id);
  }
}

/* Collections and routes must remain Place-ID-only. */
const collectionBlock =
  collectionsSource
    .split('export const heritageCollections: HeritageCollection[] = [')[1]
    ?.split('\n];')[0] ?? '';
const collectionRows = [
  ...collectionBlock.matchAll(/\n  \{\n([\s\S]*?)\n  \},?/g),
].map(match => match[1]);

if (collectionRows.length !== 6) {
  problems.push('Expected 6 heritage routes/collections, found ' + collectionRows.length);
}

const collectionIds = [];
const collectionPlaceIds = [];
for (const row of collectionRows) {
  const id = single(row, 'id');
  if (id) collectionIds.push(id);
  const match = row.match(/placeIds:\s*\[([\s\S]*?)\]/);
  const placeIds = match
    ? [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1])
    : [];

  collectionPlaceIds.push(...placeIds);

  for (const placeId of placeIds) {
    if (!assetById.has(placeId)) {
      problems.push(
        'Heritage route/collection points to missing place: ' +
          id +
          ' -> ' +
          placeId
      );
    }
  }
}

if (new Set(collectionIds).size !== collectionIds.length) {
  problems.push('Duplicate heritage collection IDs detected.');
}
for (const id of coreHeritageIds) {
  if (!collectionPlaceIds.includes(id)) {
    problems.push('Core heritage place is absent from all collections: ' + id);
  }
}
if (/\b(?:lat|lng):\s*14\./.test(collectionsSource)) {
  problems.push('Heritage collections contain duplicated map coordinates.');
}

/* Media and source integrity. External uptime is intentionally not inferred here. */
for (const id of reusableMediaIds) {
  const asset = assetById.get(id);
  if (!asset || !/\bmedia:\s*\[/.test(asset.row)) {
    problems.push('Reusable heritage image missing: ' + id);
    continue;
  }
  for (const field of [
    'src:',
    'alt:',
    'sourceUrl:',
    'credit:',
    'license:',
    'licenseUrl:',
    "reuseStatus: 'reusable-with-attribution'",
  ]) {
    if (!asset.row.includes(field)) {
      problems.push('Incomplete heritage media provenance on ' + id + ': ' + field);
    }
  }
}

const plaza = assetById.get('plaza-cristo-rey');
if (plaza && /\bmedia:\s*\[/.test(plaza.row)) {
  warnings.push(
    'Plaza Cristo Rey now has media; confirm the previously unresolved reusable-image review before treating it as closed.'
  );
}

for (const id of coreHeritageIds) {
  const row = assetById.get(id)?.row ?? '';
  const urls = [
    ...row.matchAll(
      /\b(?:url|sourceUrl|coordinateSourceUrl|licenseUrl):\s*'([^']+)'/g
    ),
  ].map(match => match[1]);

  for (const url of urls) {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        problems.push('Unsupported heritage URL protocol on ' + id + ': ' + url);
      }
    } catch {
      problems.push('Invalid heritage URL on ' + id + ': ' + url);
    }
  }
}

/* Cross-page journey and accessibility/responsive safeguards. */
for (const route of [
  '<Route path="/heritage" element={<Heritage />} />',
  '<Route path="/history" element={<History />} />',
  '<Route path="/civic-map/:assetId" element={<CivicAsset />} />',
  'path="/barangays/:slug"',
]) {
  if (!appSource.includes(route)) {
    problems.push('Required heritage journey route missing from App: ' + route);
  }
}

for (const marker of [
  'role="group"',
  "aria-label={t('corePages.heritage.mapView')}",
  'aria-pressed={mapSelection ===',
  'grid grid-cols-1 gap-5 md:grid-cols-2',
  'xl:grid-cols-[0.68fr_1.32fr]',
  "id={'collection-' + collection.id}",
  "id={'collection-' + route.id}",
]) {
  if (!heritagePageSource.includes(marker)) {
    problems.push('Heritage page QA marker missing: ' + marker);
  }
}

for (const marker of [
  "aria-label={'Open ' + place.name}",
  "title={title}",
  'className="relative aspect-[16/9] min-h-[320px]',
  "to={'/civic-map/' + place.id}",
]) {
  if (!heritageMapSource.includes(marker)) {
    problems.push('Heritage map accessibility/responsive marker missing: ' + marker);
  }
}

for (const marker of [
  'alt={primaryMedia.alt}',
  "to={'/barangays/' + barangay.slug}",
  "to={'/heritage#collection-' + collection.id}",
  "to={'/history?collection=' + collection.id}",
]) {
  if (!civicAssetPageSource.includes(marker)) {
    problems.push('Canonical Place heritage journey marker missing: ' + marker);
  }
}

if (problems.length) {
  console.error(
    'W5-2 Heritage closure audit failed:\n- ' + problems.join('\n- ')
  );
  if (warnings.length) {
    console.error('Warnings:\n- ' + warnings.join('\n- '));
  }
  process.exit(1);
}

console.log(
  [
    'W5-2 Heritage closure audit passed:',
    coreHeritageIds.length + '/7 canonical heritage places',
    presentationIds.length + ' presentation records',
    collectionRows.length + ' route/collection records',
    reusableMediaIds.length + ' provenance-complete reusable images',
    coreHeritageIds.length + '/7 places linked to History',
    coreHeritageIds.length + '/7 places linked to BetterBarangay by canonical barangay',
    'no unresolved research-only places promoted',
    'no duplicate canonical visitor identity fields',
    'responsive/accessibility guards present',
  ].join(' ')
);

if (warnings.length) {
  console.warn('Heritage closure warnings:\n- ' + warnings.join('\n- '));
}
