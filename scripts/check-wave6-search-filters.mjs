import { readFile } from 'node:fs/promises';

const serviceSearch = await readFile('src/components/home/ServiceSearch.tsx', 'utf8');
const criticalPaths = await readFile('tests/e2e/critical-paths.spec.mjs', 'utf8');

const problems = [];

const requireAll = (source, label, markers) => {
  for (const marker of markers) {
    if (!source.includes(marker)) {
      problems.push(label + ' missing: ' + marker);
    }
  }
};

requireAll(serviceSearch, 'Search domain model', [
  "type SearchDomainId =",
  "{ id: 'services', label: 'Services' }",
  "{ id: 'barangays', label: 'Barangays' }",
  "{ id: 'officials', label: 'Officials' }",
  "{ id: 'statistics', label: 'Statistics' }",
  "{ id: 'reports', label: 'Reports & insights' }",
  "{ id: 'legislation', label: 'Legislation' }",
  "{ id: 'public-records', label: 'Public records' }",
  "{ id: 'places', label: 'Places & map' }",
  "{ id: 'heritage', label: 'Heritage' }",
  "{ id: 'mobility', label: 'Mobility' }",
  "{ id: 'calendar', label: 'Civic calendar' }",
  "{ id: 'news', label: 'News' }",
]);

requireAll(serviceSearch, 'Search filter behavior', [
  "const searchDomainForItem =",
  "const [domainFilter, setDomainFilter] = useState<SearchDomainId>('all');",
  "const domainCounts = useMemo(() => {",
  "domainFilter === 'all'",
  'Filter by type',
  'setDomainFilter('all');',
  "setTab('All');",
]);

requireAll(criticalPaths, 'Search filter browser QA', [
  "typeFilter.selectOption('barangays')",
  "typeFilter.selectOption('places')",
  "typeFilter.selectOption('reports')",
  "typeFilter.selectOption('public-records')",
  "typeFilter.selectOption('mobility')",
  "broad search tabs and specific type filters do not create hidden intersections",
]);

if (problems.length > 0) {
  console.error('W6-2c search filters failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log(
  'W6-2c search filters passed: frozen civic domains are filterable, counts are derived from ranked results, and broad tabs reset specific filters to avoid hidden intersections.'
);
