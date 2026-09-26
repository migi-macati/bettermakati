import { readFile } from 'node:fs/promises';

const text = await readFile('src/data/placeRegistry.ts', 'utf8');
const mobilityPage = await readFile('src/pages/Mobility.tsx', 'utf8');
const servicesPage = await readFile('src/pages/Services.tsx', 'utf8');
const governmentOfficesPage = await readFile('src/pages/GovernmentOffices.tsx', 'utf8');
const serviceGuidePage = await readFile('src/pages/ServiceGuide.tsx', 'utf8');
const concernFinderPage = await readFile('src/pages/ConcernFinder.tsx', 'utf8');
const civicMapPage = await readFile('src/pages/CivicMap.tsx', 'utf8');
const civicAssetPage = await readFile('src/pages/CivicAsset.tsx', 'utf8');
const civicNearbyReportPage = await readFile('src/pages/CivicNearbyReport.tsx', 'utf8');
const civicNearbyReportForm = await readFile('src/components/civic/CivicNearbyReportForm.tsx', 'utf8');
const nearMePlaces = await readFile('src/components/civic/NearMePlaces.tsx', 'utf8');
const civicApi = await readFile('api/civic.js', 'utf8');
const civicReportApi = await readFile('api/civic-report.js', 'utf8');
const civicReportsPage = await readFile('src/pages/CivicReports.tsx', 'utf8');
const appSource = await readFile('src/App.tsx', 'utf8');
const civicContributionForm = await readFile('src/components/civic/CivicContributionForm.tsx', 'utf8');
const civicDiscussion = await readFile('src/components/civic/CivicDiscussion.tsx', 'utf8');
const serviceSearchSource = await readFile('src/components/home/ServiceSearch.tsx', 'utf8');
const searchIndexSource = await readFile('src/data/searchIndex.ts', 'utf8');
const serviceDirectorySource = await readFile('src/data/serviceDirectory.ts', 'utf8');
const governmentOfficesSource = await readFile('src/data/governmentServiceOffices.ts', 'utf8');
const problems = [];

const requiredExports = [
  'placeHasBarangay',
  'placesByBarangay',
  'placesByCategory',
  'placeOffersService',
  'placesByService',
  'placesByLifecycle',
  'placeDistanceKm',
  'placesWithinDistance',
  'nearbyVerifiedPlaces',
];

for (const name of requiredExports) {
  if (!text.includes('export const ' + name) && !text.includes('export interface ' + name)) {
    problems.push('Missing Place Registry selector/export: ' + name);
  }
}

for (const marker of [
  'const legacyBarangayParts',
  'place.secondaryCategories?.some',
  'item.serviceId',
  'place.lifecycle.status === status',
  'Math.atan2',
  '.sort((a, b) => a.distanceKm - b.distanceKm',
]) {
  if (!text.includes(marker)) {
    problems.push('Place Registry selector implementation is missing expected behavior: ' + marker);
  }
}

const assetBlock = text.split('export const civicAssets')[1]?.split('const geometryTypeFor')[0] ?? '';
const assetIds = [...assetBlock.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]);
if (assetIds.length !== 88) {
  problems.push('Expected 88 migrated Civic Map assets but found ' + assetIds.length + '.');
}
const duplicateIds = assetIds.filter((id, index) => assetIds.indexOf(id) !== index);
if (duplicateIds.length) {
  problems.push('Duplicate migrated place IDs: ' + [...new Set(duplicateIds)].join(', '));
}

const transportRows = assetBlock
  .split(/\n\s*\{/)
  .filter(block => /type:\s*'transport-(stop|terminal)'/.test(block));
const verifiedTransportRows = transportRows.filter(block =>
  /status:\s*'mapped'/.test(block) &&
  /sourceUrl:/.test(block) &&
  /coordinateSourceUrl:/.test(block)
);
if (verifiedTransportRows.length !== 10) {
  problems.push(
    'Expected 10 verified transport stops/terminals for Mobility reuse but found ' +
      verifiedTransportRows.length +
      '.'
  );
}

for (const marker of [
  "...placesByCategory('transport-stop')",
  "...placesByCategory('transport-terminal')",
  "place.verification.status === 'verified'",
  'id="transport-anchors"',
  "to={'/civic-map/' + place.id}",
  "place.tags.includes('MRT-3')",
  "place.tags.includes('EDSA Busway')",
  "place.tags.includes('Pasig River Ferry')",
]) {
  if (!mobilityPage.includes(marker)) {
    problems.push('Mobility Place Registry integration is missing: ' + marker);
  }
}

const governmentOfficePlaceIds = [
  ...governmentOfficesSource.matchAll(/placeId:\s*'([^']+)'/g),
].map(match => match[1]);
const expectedGovernmentOfficePlaceIds = [
  'psa-makati-crs',
  'makati-central-fire-station',
  'lto-makati-district',
  'sec-headquarters',
];

if (governmentOfficePlaceIds.length !== expectedGovernmentOfficePlaceIds.length) {
  problems.push(
    'Expected ' +
      expectedGovernmentOfficePlaceIds.length +
      ' explicit government-office place links but found ' +
      governmentOfficePlaceIds.length +
      '.'
  );
}

for (const placeId of expectedGovernmentOfficePlaceIds) {
  if (!governmentOfficePlaceIds.includes(placeId)) {
    problems.push('Missing explicit government-office place link: ' + placeId);
  }
  if (!assetIds.includes(placeId)) {
    problems.push('Government-office place link targets a missing registry place: ' + placeId);
  }
}

for (const marker of [
  "placesByBarangay(barangay.name)",
  "place.primaryCategory === 'health-center'",
  "place.primaryCategory === 'community-center'",
  "place.tags.includes('service')",
  "to={'/civic-map/' + place.id}",
  "withBarangayScope('/civic-map', barangay.slug)",
]) {
  if (!servicesPage.includes(marker)) {
    problems.push('Services Place Registry integration is missing: ' + marker);
  }
}

for (const marker of [
  'placeRegistryById.get(office.placeId)',
  "to={'/civic-map/' + place.id}",
]) {
  if (!governmentOfficesPage.includes(marker)) {
    problems.push('Government Offices Place Registry integration is missing: ' + marker);
  }
}

for (const marker of [
  'placeRegistryById.get(office.placeId)',
  "to={'/civic-map/' + place.id}",
]) {
  if (!serviceGuidePage.includes(marker)) {
    problems.push('Service Guide Place Registry integration is missing: ' + marker);
  }
}

if (governmentOfficesPage.includes('Place Registry') || serviceGuidePage.includes('Place Registry')) {
  problems.push('Service surfaces must not expose Place Registry implementation language in the UI.');
}

for (const marker of [
  'serviceId?: string',
  'serviceId: item.id',
]) {
  if (!searchIndexSource.includes(marker)) {
    problems.push('Search index service-place integration is missing: ' + marker);
  }
}

for (const marker of [
  'showServicePlaces = false',
  'officesForAgency(service.agency).find(item => item.placeId)',
  'placeRegistryById.get(office.placeId)',
  'Where to go: {servicePlaceById.get(item.serviceId)?.name}',
]) {
  if (!serviceSearchSource.includes(marker)) {
    problems.push('Saan Ako Lalapit place-result integration is missing: ' + marker);
  }
}

if (!concernFinderPage.includes('showServicePlaces')) {
  problems.push('Saan Ako Lalapit must enable service place results.');
}

const expectedConcernServicePlaceIds = [
  'bfp-fsic-business',
  'bfp-fsic-occupancy',
  'psa-birth-certificate',
  'psa-marriage-certificate',
  'psa-death-certificate',
  'psa-cenomar',
  'national-id',
  'drivers-license',
  'vehicle-registration',
  'sec-company-registration',
  'sec-company-filings',
  'sec-company-records',
];

for (const serviceId of expectedConcernServicePlaceIds) {
  if (!serviceDirectorySource.includes("id: '" + serviceId + "'")) {
    problems.push('Missing service expected to resolve to an explicit place: ' + serviceId);
  }
}

if (expectedConcernServicePlaceIds.length !== 12) {
  problems.push('Saan Ako Lalapit explicit service-place coverage must remain 12 for W3R-3d.');
}

for (const marker of [
  "placeRegistryById.get(asset.id)?.verification.status === 'verified'",
  "placesByBarangay(barangay.name)",
  'Find a place in Makati',
  'Browse the place inventory',
  'Find a place',
  'Report something near me',
  'Suggest an improvement',
  'Help document Makati',
]) {
  if (!civicMapPage.includes(marker)) {
    problems.push('Civic Map place-first entry is missing: ' + marker);
  }
}

for (const forbidden of [
  'Rate a place or route',
  'Structured 1–5 assessment',
  'Civic Map · Pilot',
  'pilot mapped assets',
  'BetterMakati consolidates before it amplifies',
]) {
  if (civicMapPage.includes(forbidden)) {
    problems.push('Civic Map still exposes retired entry framing: ' + forbidden);
  }
}

if (!searchIndexSource.includes(
  "Browse civic places, bounded infrastructure segments and transport routes; report non-emergency problems and suggest improvements."
)) {
  problems.push('Civic Map search entry still uses the retired rating-first description.');
}

for (const marker of [
  'placeRegistryById.get(asset.id)',
  'place.provenance.sources',
  'verificationLabel[place.verification.status]',
  'Place information',
  'Community cases',
  'Report or suggest',
  "allowedKinds={['report', 'proposal', 'update']}",
]) {
  if (!civicAssetPage.includes(marker)) {
    problems.push('Civic place-detail simplification is missing: ' + marker);
  }
}

for (const forbidden of [
  'Report, rate or suggest',
  'Location & rating criteria',
  'What people can rate here',
  'Structured 1–5',
  'Headline scores',
  'Community ratings',
  'Civic Map pilot asset',
  'Independent community record',
]) {
  if (civicAssetPage.includes(forbidden)) {
    problems.push('Civic place detail still exposes retired rating/pilot framing: ' + forbidden);
  }
}

if (!civicContributionForm.includes('allowedKinds?: CivicContributionKind[]')) {
  problems.push('Civic contribution form no longer supports page-level contribution-kind limits.');
}

if (civicContributionForm.includes('Independent platform.')) {
  problems.push('Civic contribution form still repeats the retired platform explainer.');
}

if (!civicDiscussion.includes('Cases, proposals & updates')) {
  problems.push('Civic discussion still advertises reviews as a primary place-page section.');
}

for (const marker of [
  "navigator.geolocation.getCurrentPosition",
  "nearbyVerifiedPlaces(location.point",
  "initialDistanceKm: 0.25",
  "fallbackDistanceKm: 0.5",
  "limit: 5",
  "None of these — report this location",
  "Search the civic registry",
  "Choose the location manually",
  "Location selected",
]) {
  if (!civicNearbyReportPage.includes(marker)) {
    problems.push('Nearby reporting place matcher is missing: ' + marker);
  }
}

for (const marker of [
  '<CivicNearbyReportForm',
  "entity={matchState === 'confirmed-entity' ? selectedEntity : null}",
  'point={location.point}',
  "href: withBarangayScope(",
  "'/civic-map/report'",
]) {
  if (!civicNearbyReportPage.includes(marker)) {
    problems.push('Nearby report handoff is missing: ' + marker);
  }
}

for (const marker of [
  "navigator.geolocation.getCurrentPosition",
  "nearbyVerifiedPlaces(point",
  "initialDistanceKm",
  "fallbackDistanceKm",
  "linkForPlace(place.id)",
  "Location is requested only when you tap the button",
]) {
  if (!nearMePlaces.includes(marker)) {
    problems.push('Reusable Near me component is missing: ' + marker);
  }
}

for (const marker of [
  '<NearMePlaces',
  "withBarangayScope('/civic-map/' + placeId, barangay?.slug)",
]) {
  if (!civicMapPage.includes(marker)) {
    problems.push('Civic Map Near me integration is missing: ' + marker);
  }
}

for (const marker of [
  "fetch('/api/civic'",
  "method: 'POST'",
  "locationMode",
  "entityId: place?.id ?? ''",
  "entityKind: place?.entityKind ?? ''",
  "assetId: place?.id ?? ''",
  "lat: roundCoordinate(point.lat)",
  "lng: roundCoordinate(point.lng)",
  "Confirm this issue",
  "Continue on GitHub",
]) {
  if (!civicNearbyReportForm.includes(marker)) {
    problems.push('Nearby civic report form is missing: ' + marker);
  }
}

for (const marker of [
  "locationMode: clean(req.body?.locationMode, 30)",
  "entityId: clean(req.body?.entityId, 120)",
  "entityKind: clean(req.body?.entityKind, 20)",
  "civicEntityById.get(payload.entityId)",
  "payload.entityKind = canonicalEntity.entityKind",
  "payload.assetType = canonicalEntity.category",
  "const locationOnly = payload.locationMode === 'location-only'",
  "locationOnly && kind !== 'report'",
  "payload.entityId = ''",
  "payload.assetId = ''",
  "payload.entityId = payload.entityId || payload.assetId",
  "meta.entityId || meta.placeId || meta.assetId",
  "distance !== null && distance <= 75",
  "roundCoordinate(parseNumber(req.body?.lat))",
  "roundCoordinate(parseNumber(req.body?.lng))",
]) {
  if (!civicApi.includes(marker)) {
    problems.push('Civic API nearby-report support is missing: ' + marker);
  }
}

if (!appSource.includes('path="/civic-map/report" element={<CivicNearbyReport />}')) {
  problems.push('Nearby reporting route is missing.');
}

if (!civicMapPage.includes("withBarangayScope('/civic-map/report', barangay?.slug)")) {
  problems.push('Civic Map must expose nearby reporting while preserving barangay scope.');
}

for (const marker of [
  "['OWNER', 'MEMBER', 'COLLABORATOR'].includes(comment.author_association)",
  "parseTaggedJson(comment.body, 'civic-admin')",
  "officialLifecycleStatus(adminEvents)",
  "lifecycleLabel(evidenceStatus)",
  "confirmationCount >= 2 ? 'community-corroborated' : 'unverified'",
]) {
  if (!civicApi.includes(marker)) {
    problems.push('Civic case-detail lifecycle support is missing: ' + marker);
  }
}

for (const marker of [
  "item.meta?.entityId === assetId",
  "item.meta?.placeId === assetId",
  "item.meta?.assetId === assetId",
  "setLifecycle(data.lifecycle ?? null)",
  "Case lifecycle",
  "Step {lifecycleStep(lifecycle.status)} of 6",
  "'action-reported': 5",
  "'community-verified-resolved': 6",
]) {
  if (!civicDiscussion.includes(marker)) {
    problems.push('Civic place discussion lifecycle display is missing: ' + marker);
  }
}

for (const marker of [
  "['OWNER', 'MEMBER', 'COLLABORATOR'].includes(comment.author_association)",
  "meta.entityId || meta.placeId || meta.assetId || null",
  "meta.entityKind || (meta.placeId ? 'place' : null)",
  "'matched-entity'",
  "['forwarded', 'acknowledged', 'action-reported', 'community-verified-resolved']",
  "evidenceStatus",
  "adminEvents",
]) {
  if (!civicReportApi.includes(marker)) {
    problems.push('Citywide civic lifecycle normalization is missing: ' + marker);
  }
}

for (const marker of [
  'Recent issue cases',
  "item.entityId ??",
  "item.meta.entityId ??",
  "item.locationMode ??",
  "to={'/civic-map/' + entityId}",
  'Record details',
  'Location only',
  'Authority acknowledged',
  'Action reported',
  'Community verified resolved',
  'Community corroboration and “appears resolved” responses are evidence signals',
]) {
  if (!civicReportsPage.includes(marker)) {
    problems.push('Civic report lifecycle/relationship UI is missing: ' + marker);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(
  'Place Registry selectors passed static integrity checks: ' +
  requiredExports.length + ' selector exports, ' + assetIds.length + ' preserved place IDs, ' + verifiedTransportRows.length + ' verified Mobility transport anchors, and ' + governmentOfficePlaceIds.length + ' explicit government-office place links, and ' + expectedConcernServicePlaceIds.length + ' service results with exact where-to-go coverage.'
);
