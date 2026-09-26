import {
  cityIndicatorById,
  cityIndicatorObservations,
  cityIndicatorSources,
  type CityIndicatorObservation,
} from './cityIndicators';
import {
  cityComparisonPdf,
  cityComparisonRows,
  cityComparisonSource,
  type CityComparisonRow,
} from './cityComparison';

export interface StatisticsDownloadColumn {
  key: string;
  label: string;
}

export interface StatisticsProvenance {
  definition: string;
  basis: string;
  geography: string;
  period: string;
  lastReviewed: string;
  sources: Array<{
    id: string;
    label: string;
    publisher: string;
    url: string;
  }>;
  note?: string;
}

export interface StatisticsDownloadMetadata {
  id: string;
  title: string;
  filename: string;
  columns: StatisticsDownloadColumn[];
  provenance: StatisticsProvenance;
}

const csvEscape = (value: string | number | null | undefined) =>
  '"' + String(value ?? '').replaceAll('"', '""') + '"';

export const csvDataHref = (csv: string) =>
  'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);

const sourceMetadata = (sourceIds: string[]) =>
  sourceIds
    .map(id => cityIndicatorSources[id])
    .filter(Boolean)
    .map(source => ({
      id: source.id,
      label: source.label,
      publisher: source.publisher,
      url: source.url,
    }));

const populationIndicator = cityIndicatorById.get('population-total');
const populationGrowthIndicator = cityIndicatorById.get(
  'population-growth-rate'
);

if (!populationIndicator || !populationGrowthIndicator) {
  throw new Error('Population indicators required for Statistics export are missing.');
}

const populationObservations = cityIndicatorObservations('population-total');
const growthObservations = cityIndicatorObservations('population-growth-rate');

export const populationTrendDownload: StatisticsDownloadMetadata = {
  id: 'makati-population-current-boundary',
  title: 'Makati population on the current city boundary',
  filename: 'makati-population-2010-2024.csv',
  columns: [
    { key: 'censusYear', label: 'Census year' },
    { key: 'population', label: 'Population' },
    { key: 'averageAnnualGrowthPercent', label: 'Average annual growth (%)' },
    { key: 'geography', label: 'Geography' },
    { key: 'boundaryBasis', label: 'Boundary basis' },
    { key: 'sourceId', label: 'Source ID' },
  ],
  provenance: {
    definition: populationIndicator.definition.description,
    basis: populationIndicator.definition.basis,
    geography: 'Makati City — current 23-barangay boundary',
    period: '2010, 2015, 2020 and 2024 census/POPCEN observations',
    lastReviewed: populationIndicator.revision.lastReviewed,
    sources: sourceMetadata(populationIndicator.provenance.sourceIds),
    note:
      'Average annual growth is the PSA-reported rate from the preceding census/POPCEN observation.',
  },
};

export const populationTrendRows = populationObservations.map(
  (observation, index) => ({
    censusYear: observation.period.year ?? observation.period.label,
    population: observation.value,
    averageAnnualGrowthPercent:
      index === 0 ? null : growthObservations[index - 1]?.value ?? null,
    geography: observation.geography.label,
    boundaryBasis: observation.geography.boundaryBasis,
    sourceId: observation.sourceIds[0] ?? '',
  })
);

export const populationTrendCsv = [
  populationTrendDownload.columns.map(column => csvEscape(column.label)).join(','),
  ...populationTrendRows.map(row =>
    [
      row.censusYear,
      row.population,
      row.averageAnnualGrowthPercent,
      row.geography,
      row.boundaryBasis,
      row.sourceId,
    ]
      .map(csvEscape)
      .join(',')
  ),
].join('\n');

export const populationTrendDownloadHref = csvDataHref(populationTrendCsv);

export const cityComparisonDownload: StatisticsDownloadMetadata = {
  id: 'gdp-per-person-city-comparison-2024',
  title: '2024 GDP per person — top Philippine province/HUC economies',
  filename: 'makati-city-comparison-2024.csv',
  columns: [
    { key: 'rank', label: 'Rank in source table' },
    { key: 'city', label: 'City' },
    { key: 'region', label: 'Region' },
    {
      key: 'gdpPerPerson',
      label: '2024 GDP per person (PHP, constant 2018 prices)',
    },
    { key: 'sourceUrl', label: 'Source URL' },
  ],
  provenance: {
    definition:
      'Gross domestic product per person for the PSA 2024 national comparison of provinces and highly urbanized cities.',
    basis:
      'Philippine pesos at constant 2018 prices; the 2024 comparison uses the 2024 POPCEN population base.',
    geography:
      'PSA national comparison of provinces and highly urbanized cities; BetterMakati displays the top ten city/HUC entries used by the existing comparison dataset.',
    period: '2024',
    lastReviewed: '2026-09-26',
    sources: [
      {
        id: 'psa-ppa-makati-2024-release',
        label: 'PSA 2024 economic performance / per-capita GDP release',
        publisher: 'Philippine Statistics Authority',
        url: cityComparisonSource,
      },
      {
        id: 'psa-ppa-2024-statistical-brief',
        label: 'PSA two-page 2024 per-capita GDP statistical brief',
        publisher: 'Philippine Statistics Authority',
        url: cityComparisonPdf,
      },
    ],
  },
};

export const cityComparisonCsv = (
  rows: CityComparisonRow[] = cityComparisonRows
) => [
  cityComparisonDownload.columns.map(column => csvEscape(column.label)).join(','),
  ...rows.map(row =>
    [
      cityComparisonRows.indexOf(row) + 1,
      row.city,
      row.region,
      row.gdpPerPerson,
      cityComparisonSource,
    ]
      .map(csvEscape)
      .join(',')
  ),
].join('\n');

export const cityComparisonFilename = (
  scope: 'top10' | 'ncr' | 'outsideNcr'
) => {
  if (scope === 'ncr') return 'makati-city-comparison-2024-ncr.csv';
  if (scope === 'outsideNcr')
    return 'makati-city-comparison-2024-outside-ncr.csv';
  return cityComparisonDownload.filename;
};

export const sourceLabel = (source: StatisticsProvenance['sources'][number]) =>
  source.publisher + ' — ' + source.label;

export const observationSource = (observation: CityIndicatorObservation) =>
  observation.sourceIds
    .map(id => cityIndicatorSources[id])
    .filter(Boolean);
