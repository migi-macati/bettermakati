import { readFile } from 'node:fs/promises';

const searchIndex = await readFile('src/data/searchIndex.ts', 'utf8');
const serviceSearch = await readFile('src/components/home/ServiceSearch.tsx', 'utf8');

const problems = [];

const requireAll = (source, label, markers) => {
  for (const marker of markers) {
    if (!source.includes(marker)) {
      problems.push(label + ' missing: ' + marker);
    }
  }
};

requireAll(searchIndex, 'Services coverage', [
  "import { serviceDirectory } from './serviceDirectory';",
  "const serviceItems: SearchItem[] = serviceDirectory.map",
  "href: '/services',",
  "...serviceItems,",
]);

requireAll(searchIndex, 'Barangay coverage', [
  "import { barangays as barangayProfiles",
  "const barangayItems: SearchItem[] = barangayProfiles.map",
  "href: '/barangays',",
  "...barangayItems,",
]);

requireAll(searchIndex, 'Official coverage', [
  "import { electedOfficials } from './electedOfficials';",
  "const officialItems: SearchItem[] = electedOfficials.map",
  "href: `/officials/${official.slug}`,",
  "...officialItems,",
]);

requireAll(searchIndex, 'Statistics coverage', [
  "import { cityIndicators } from './cityIndicators';",
  "...cityIndicators",
  "canonicalKey: 'indicator:' + indicator.id",
]);

requireAll(searchIndex, 'Reports coverage', [
  "import { reports } from './reports';",
  "...reports.map(report => ({",
  "href: '/reports',",
  "href: '/reports/' + report.slug",
]);

requireAll(serviceSearch, 'Legislation coverage', [
  "loadLegislationBrowserIndex",
  "matchLegislationRecords",
  "canonicalKey: 'legislation-record:' + legislationRecordId(record)",
]);

requireAll(searchIndex, 'Public Records coverage', [
  "import { publicRecords } from './publicRecords';",
  "const publicRecordItems: SearchItem[] = publicRecords.map",
  "href: '/records/' + record.id",
  "...publicRecordItems,",
]);

requireAll(searchIndex, 'Place coverage', [
  "placeRegistry,",
  "const civicRegistryItems: SearchItem[] = [",
  "href: '/civic-map/' + record.id",
  "...civicRegistryItems,",
]);

requireAll(searchIndex, 'Heritage coverage', [
  "import { heritageCollections } from './heritageCollections';",
  "const heritageCollectionItems: SearchItem[] = heritageCollections.map",
  "href: '/heritage#collection-' + collection.id",
  "...heritageCollectionItems,",
]);

requireAll(searchIndex, 'Mobility coverage', [
  "import { mobilityServices } from './mobilitySystems';",
  "import { mobilityRouteCorridors } from './mobilityRoutes';",
  "const mobilitySearchItems: SearchItem[] = [",
  "...mobilitySearchItems,",
]);

requireAll(searchIndex, 'Civic timeline and Calendar coverage', [
  "import { nativeCivicTimelineItems } from './civicTimelineNative';",
  "title: 'Makati Calendar'",
  "href: '/calendar'",
  "const civicTimelineSearchItems: SearchItem[] = [",
]);

requireAll(searchIndex, 'News coverage', [
  "title: 'Makati in the News'",
  "href: '/news'",
]);

for (const retired of ["href: '/parking'", "href: '/whats-on'"]) {
  if (searchIndex.includes(retired)) {
    problems.push('Retired canonical search surface returned: ' + retired);
  }
}

if (problems.length > 0) {
  console.error('W6-2a search-index coverage failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log(
  'W6-2a search-index coverage passed: services, barangays, officials, statistics, reports, legislation, public records, places, heritage, mobility, civic timeline/calendar and news remain searchable without restoring retired surfaces.'
);
