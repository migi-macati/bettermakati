import * as shared from '../reportSharedData';
import type { FeaturedReportModule } from '../reportTypes';

const {
  reportPublishedOn,
  growth2015to2020,
  growth2020to2024,
  population2024,
  growthAccelerationPp,
  populationAdded2020to2024,
  growth2010to2015,
  populationGrowthTrend,
  numericObservation,
  population2010,
  population2015,
  population2020,
  populationTrend,
  reviewedOn,
  populationGrowthSource,
  currentBoundarySource,
} = shared;

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: '2024-population-growth-acceleration',
    date: reportPublishedOn,
    headline:
      'Makati’s population growth accelerated to 1.37% a year in 2020–2024',
    subheadline: `The PSA comparable series shows average annual growth rising from ${growth2015to2020.toFixed(
      2
    )}% in 2015–2020 to ${growth2020to2024.toFixed(
      2
    )}% in 2020–2024, with resident population reaching ${population2024.toLocaleString()}.`,
    synthesis: `After slowing between 2010 and 2020, Makati’s resident population growth accelerated in 2020–2024: the PSA-reported average annual rate rose by ${growthAccelerationPp.toFixed(
      2
    )} percentage points to ${growth2020to2024.toFixed(
      2
    )}%, while the city added ${populationAdded2020to2024.toLocaleString()} residents on the current 23-barangay boundary.`,
    sections: [
      {
        id: 'growth-accelerated',
        heading: 'The latest census interval reversed the earlier slowdown',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: `PSA reports Makati’s average annual population growth at ${growth2010to2015.toFixed(
              2
            )}% for 2010–2015, ${growth2015to2020.toFixed(
              2
            )}% for 2015–2020 and ${growth2020to2024.toFixed(
              2
            )}% for 2020–2024. The latest interval is therefore the fastest of the three comparable intervals in the current series.`,
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-growth-rate',
                  href: '/statistics',
                },
              ],
            },
          },
          {
            kind: 'stat',
            label: 'Average annual population growth, 2020–2024',
            value: growth2020to2024.toFixed(2) + '%',
            detail: `Up ${growthAccelerationPp.toFixed(
              2
            )} percentage points from the 2015–2020 interval.`,
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-growth-rate',
                  href: '/statistics',
                },
              ],
            },
          },
          {
            kind: 'chart',
            chartType: 'bar',
            title: 'PSA average annual population growth',
            valueLabel: '%',
            series: [
              {
                label: 'Average annual growth',
                points: populationGrowthTrend.map(observation => ({
                  label: observation.period.label,
                  value: numericObservation(
                    observation.value,
                    observation.period.label + ' growth rate'
                  ),
                })) as [
                  { label: string; value: number },
                  ...Array<{ label: string; value: number }>,
                ],
              },
            ],
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-growth-rate',
                  href: '/statistics',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'population-level',
        heading: 'Resident population rose by 17,027 from 2020 to 2024',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: `On the same current-city series, resident population rose from ${population2010.toLocaleString()} in 2010 to ${population2015.toLocaleString()} in 2015, ${population2020.toLocaleString()} in 2020 and ${population2024.toLocaleString()} in 2024. The 2020–2024 increase was ${populationAdded2020to2024.toLocaleString()} residents.`,
            evidence: {
              sourceIds: ['1', '2', '3'],
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
            kind: 'chart',
            chartType: 'bar',
            title: 'Resident population on the current Makati boundary',
            valueLabel: 'residents',
            series: [
              {
                label: 'Resident population',
                points: populationTrend.map(observation => ({
                  label: observation.period.label,
                  value: numericObservation(
                    observation.value,
                    observation.period.label + ' population'
                  ),
                })) as [
                  { label: string; value: number },
                  ...Array<{ label: string; value: number }>,
                ],
              },
            ],
            evidence: {
              sourceIds: ['1', '2', '3'],
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
            kind: 'paragraph',
            role: 'analysis',
            text: 'The series establishes a change in resident-population growth, not its cause. It does not by itself identify whether migration, household formation, births, deaths, housing supply or other factors explain the acceleration, and it should not be read as a measure of Makati’s daytime population.',
            evidence: {
              sourceIds: ['1', '2', '3'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-total',
                  href: '/statistics',
                },
                {
                  recordType: 'statistics-indicator',
                  id: 'population-growth-rate',
                  href: '/statistics',
                },
              ],
            },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Makati Statistics — population indicators',
        href: '/statistics',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note: 'Canonical Wave 4 population-total and population-growth-rate indicators on the current 23-barangay boundary.',
        checkedOn: reviewedOn,
      },
      {
        id: '2',
        label: populationGrowthSource.label,
        href: populationGrowthSource.url,
        sourceKind: 'official-external',
        publisher: populationGrowthSource.publisher,
        publishedOrPeriod: '2010, 2015, 2020 and 2024 census/POPCEN series',
        checkedOn: reviewedOn,
      },
      {
        id: '3',
        label: currentBoundarySource.label,
        href: currentBoundarySource.url,
        sourceKind: 'official-external',
        publisher: currentBoundarySource.publisher,
        publishedOrPeriod: 'Current Makati geography',
        checkedOn: reviewedOn,
      },
    ],
    methodology: {
      text: 'The report uses the PSA-published average annual growth rates rather than recomputing a simple calendar-year CAGR. All population levels use the comparable current Makati 23-barangay boundary; the canonical indicator notes that the PSA series excludes the 10 barangays transferred to Taguig.',
      evidence: {
        sourceIds: ['1', '2', '3'],
        records: [
          {
            recordType: 'statistics-indicator',
            id: 'population-total',
            href: '/statistics',
          },
          {
            recordType: 'statistics-indicator',
            id: 'population-growth-rate',
            href: '/statistics',
          },
        ],
      },
    },
  },
  fil: null,
};

export default reportModule;
