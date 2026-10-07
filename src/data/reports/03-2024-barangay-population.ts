import * as shared from '../reportSharedData';
import type { FeaturedReportModule } from '../reportTypes';

const {
  reportPublishedOn,
  largestBarangay,
  smallestBarangay,
  percent,
  topThreePopulationShare,
  largestToSmallestRatio,
  currentMakatiPopulation2024,
  topThreeBarangays,
  topThreePopulation,
  sortedBarangays,
  barangaysUnder6000,
  reviewedOn,
  psaBarangaySource,
} = shared;

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: '2024-barangay-population',
    date: reportPublishedOn,
    headline:
      'Makati’s largest barangay has more than eighteen times the resident population of its smallest',
    subheadline: `${largestBarangay?.name ?? 'Pio Del Pilar'} has ${(
      largestBarangay?.population2024 ?? 0
    ).toLocaleString()} residents, while ${smallestBarangay?.name ?? 'Carmona'} has ${(
      smallestBarangay?.population2024 ?? 0
    ).toLocaleString()}; the three largest barangays contain ${percent(
      topThreePopulationShare
    )} of the city’s 2024 population.`,
    synthesis: `Makati’s 23 barangays operate at sharply different resident-population scales: the largest is ${largestToSmallestRatio.toFixed(
      1
    )} times the smallest, while the top three account for ${percent(
      topThreePopulationShare
    )} of all residents on the current city boundary.`,
    sections: [
      {
        id: 'concentration',
        heading:
          'A large share of residents is concentrated in three barangays',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: `Makati’s 2024 resident population is ${currentMakatiPopulation2024.toLocaleString()}. ${topThreeBarangays
              .map(
                barangay =>
                  `${barangay.name} (${barangay.population2024.toLocaleString()})`
              )
              .join(
                ', '
              )} together contain ${topThreePopulation.toLocaleString()} residents, or ${percent(
              topThreePopulationShare
            )} of the city total.`,
            evidence: {
              sourceIds: ['1', '2', '3', '4'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-total',
                  href: '/statistics',
                },
              ],
            },
          },
          {
            kind: 'stat',
            label: 'Largest-to-smallest population ratio',
            value: largestToSmallestRatio.toFixed(1) + '×',
            detail: `${largestBarangay?.name} compared with ${smallestBarangay?.name} in the 2024 resident-population count.`,
            evidence: {
              sourceIds: ['2', '4'],
            },
          },
        ],
      },
      {
        id: 'scale',
        heading: 'Barangay scale varies across the full city',
        blocks: [
          {
            kind: 'chart',
            chartType: 'bar',
            title: '2024 resident population by barangay',
            valueLabel: 'residents',
            series: [
              {
                label: 'Resident population',
                points: sortedBarangays.map(barangay => ({
                  label: barangay.name,
                  value: barangay.population2024,
                })) as [
                  { label: string; value: number },
                  ...Array<{ label: string; value: number }>,
                ],
              },
            ],
            evidence: {
              sourceIds: ['2', '4'],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: `${barangaysUnder6000.length} of Makati’s 23 barangays have fewer than 6,000 residents in the 2024 count: ${barangaysUnder6000
              .map(barangay => barangay.name)
              .join(', ')}.`,
            evidence: {
              sourceIds: ['2', '4'],
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Citywide averages therefore hide substantial differences in resident scale. This report stops at population distribution: it does not infer service demand, daytime population, land-use intensity or need for facilities from resident counts alone.',
            evidence: {
              sourceIds: ['1', '2', '3', '4'],
            },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Makati Statistics — population indicator',
        href: '/statistics',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note: 'Canonical population-total indicator for the current 23-barangay boundary.',
        checkedOn: reviewedOn,
      },
      {
        id: '2',
        label: 'Barangays — 2024 resident population',
        href: '/barangays',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note: 'Canonical 2024 population values for all 23 barangays.',
        checkedOn: reviewedOn,
      },
      {
        id: '3',
        label: 'PSA OpenStat population and annual growth series',
        href: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0211A6DAPG0.px/',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: '2010–2024 census/POPCEN series',
        checkedOn: reviewedOn,
      },
      {
        id: '4',
        label: 'City of Makati — Philippine Standard Geographic Code',
        href: psaBarangaySource,
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: 'Current Makati barangay geography and population',
        checkedOn: reviewedOn,
      },
    ],
    methodology: {
      text: 'All population statements use the current 23-barangay Makati boundary and resident population. Counts are not proxies for daytime population, service utilization, land area or population density.',
      evidence: {
        sourceIds: ['1', '2', '3', '4'],
        records: [
          {
            recordType: 'statistics-indicator',
            id: 'population-total',
            href: '/statistics',
          },
        ],
      },
    },
  },
  fil: null,
};

export default reportModule;
