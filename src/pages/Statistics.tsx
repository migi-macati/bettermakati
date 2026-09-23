import { ArrowUpRight, Database, Download } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SectionNav from '../components/ui/SectionNav';
import SharePage from '../components/ui/SharePage';
import CitizenSummary from '../components/ui/CitizenSummary';
import { HorizontalBarChart } from '../components/budget/BudgetCharts';
import CityComparison from '../components/statistics/CityComparison';
import BarangayScopeBar from '../components/barangay/BarangayScopeBar';
import { useBarangayScope } from '../hooks/useBarangayScope';
import { barangays } from '../data/barangays';

const psaUrl = 'https://psa.gov.ph/classification/psgc/barangays/1380300000';
const populationSource =
  'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0211A6DAPG0.px/';
const economySource =
  'https://psa.gov.ph/content/2024-economic-performance-provinces-and-highly-urbanized-cities-philippines-capita-gross';

const stats = [
  {
    value: '309,770',
    label: 'Population',
    note: '2024 POPCEN',
    href: populationSource,
  },
  { value: '23', label: 'Barangays', note: 'PSGC', href: psaUrl },
  { value: '1st', label: 'Income class', note: 'PSGC', href: psaUrl },
  {
    value: '₱3.89M',
    label: 'GDP per person',
    note: '2024, constant 2018 prices',
    href: economySource,
  },
];

const populationTrend = [
  { year: 2010, population: 263683, annualGrowth: null },
  { year: 2015, population: 280150, annualGrowth: 1.16 },
  { year: 2020, population: 292743, annualGrowth: 0.93 },
  { year: 2024, population: 309770, annualGrowth: 1.37 },
];

const people = (value: number) => new Intl.NumberFormat('en-PH').format(value);

const population2010 = populationTrend[0].population;
const population2024 = populationTrend[populationTrend.length - 1].population;
const populationGrowthSince2010 =
  ((population2024 - population2010) / population2010) * 100;

const populationCsv = [
  'Census year,Population,Annual growth percent',
  ...populationTrend.map(item =>
    [item.year, item.population, item.annualGrowth ?? ''].join(',')
  ),
].join('\n');

export default function Statistics() {
  const { barangay } = useBarangayScope();
  const cityPopulation = barangays.reduce((sum, item) => sum + item.population2024, 0);
  const barangayPopulationShare = barangay
    ? (barangay.population2024 / cityPopulation) * 100
    : null;

  return (
    <>
      <SEO
        title="Makati Statistics"
        description="Current basic Makati City statistics from the Philippine Statistics Authority."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'BetterMakati city statistics',
          description:
            'Population and economic indicators for Makati City with source links and comparable definitions.',
          spatialCoverage: 'Makati City, Philippines',
          temporalCoverage: '2010/2024',
        }}
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City Information</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>Makati Statistics</Heading>
          <SharePage title="Makati Statistics | BetterMakati" />
        </div>
        <LastReviewed note="Population and GDP figures use PSA sources and stated geographic definitions." />

        <BarangayScopeBar note="Barangay population is shown from the 2024 POPCEN. Citywide economic and historical series remain visible where no comparable barangay series is available." />

        {barangay && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="stat-card">
              <div className="text-2xl md:text-3xl font-extrabold text-primary-800">
                {barangay.population2024.toLocaleString('en-PH')}
              </div>
              <div className="mt-1 font-semibold text-gray-900">Barangay population</div>
              <div className="mt-1 text-xs text-gray-500">2024 POPCEN</div>
            </div>
            <div className="stat-card">
              <div className="text-2xl md:text-3xl font-extrabold text-primary-800">
                {barangayPopulationShare?.toFixed(1)}%
              </div>
              <div className="mt-1 font-semibold text-gray-900">Share of Makati population</div>
              <div className="mt-1 text-xs text-gray-500">Current 23-barangay boundary</div>
            </div>
            <div className="stat-card">
              <div className="text-xl md:text-2xl font-extrabold text-primary-800">
                {barangay.legislativeDistrict}
              </div>
              <div className="mt-1 font-semibold text-gray-900">Legislative district</div>
              <div className="mt-1 text-xs text-gray-500">Makati City</div>
            </div>
          </div>
        )}

        <SectionNav
          items={[
            { label: 'At a glance', href: '#statistics-summary' },
            { label: 'Population trend', href: '#population-trend' },
            { label: 'Compare cities', href: '#city-comparison-title' },
            { label: 'Data downloads', href: '#statistics-data' },
          ]}
        />
        <div
          id="statistics-summary"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        >
          {stats.map(stat => (
            <a
              key={stat.label}
              href={stat.href}
              target="_blank"
              rel="noreferrer"
              className="stat-card hover:border-primary-300 transition"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-primary-800">
                {stat.value}
              </div>
              <div className="font-semibold text-gray-900 mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.note}</div>
            </a>
          ))}
        </div>

        <CitizenSummary
          className="mt-6"
          eyebrow="What the numbers show"
          title="Makati’s comparable population has grown, but boundary changes matter"
          summary="Using PSA figures restated to Makati’s current 23-barangay boundary, the city’s population increased from 263,683 in 2010 to 309,770 in 2024."
          points={[
            {
              label: 'Long-term change',
              text: (
                <>
                  That is an increase of <strong>{people(population2024 - population2010)} people</strong>, or about <strong>{populationGrowthSince2010.toFixed(1)}%</strong>, over 14 years.
                </>
              ),
            },
            {
              label: 'Recent pace',
              text: (
                <>
                  PSA’s average annual growth rate rises from <strong>0.93%</strong> for 2015–2020 to <strong>1.37%</strong> for 2020–2024.
                </>
              ),
            },
            {
              label: 'Boundary caution',
              text: (
                <>
                  Older Makati totals that still include the 10 barangays transferred to Taguig are <strong>not directly comparable</strong> with this 23-barangay series.
                </>
              ),
            },
            {
              label: 'Economic indicator',
              text: (
                <>
                  The <strong>₱3.89M GDP per person</strong> figure measures economic output per resident. It is not household income, salary or personal wealth.
                </>
              ),
            },
          ]}
          note="BetterMakati keeps definitions beside the figures so trends are compared on the same geography and basis."
        />
      </Section>

      <Section id="population-trend" className="bg-white">
        <div className="section-eyebrow">Population trend</div>
        <Heading level={2}>Comparable population, 2010–2024</Heading>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
          This PSA series restates earlier census counts using Makati’s current
          23-barangay boundary, excluding the 10 barangays transferred to
          Taguig. That makes the four years comparable.{' '}
          <a
            href={populationSource}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            PSA OpenSTAT <ArrowUpRight className="inline h-3.5 w-3.5" />
          </a>
        </p>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-5 items-start">
          <HorizontalBarChart
            title="Population on current city boundaries"
            items={populationTrend.map(item => ({
              label: String(item.year),
              value: item.population,
            }))}
            formatValue={people}
          />

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full min-w-[420px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-bold">Census year</th>
                  <th className="px-4 py-3 font-bold text-right">Population</th>
                  <th className="px-4 py-3 font-bold text-right">
                    Annual growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {populationTrend.map(item => (
                  <tr key={item.year} className="border-t">
                    <td className="px-4 py-3 font-bold">{item.year}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {people(item.population)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {item.annualGrowth === null
                        ? '—'
                        : item.annualGrowth.toFixed(2) + '%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-3 text-xs leading-relaxed text-gray-500">
              Annual growth is PSA’s average annual population growth rate from
              the preceding census year shown.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={populationSource}
            target="_blank"
            rel="noreferrer"
            className="brand-btn-secondary"
          >
            Open the full PSA population table
          </a>
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(populationCsv)}`}
            download="makati-population-2010-2024.csv"
            className="brand-btn-secondary"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <CityComparison />
      </Section>

      <Section className="bg-white">
        <div id="statistics-data" className="section-eyebrow">
          BetterMakati data
        </div>
        <Heading level={2}>Explore related city datasets</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Population', '/barangays', 'Barangay counts and profiles'],
            [
              'City finance',
              '/projects-budget',
              'Budgets, actuals and projects',
            ],
            ['Elections', '/elections', 'Turnout and 2025 local results'],
            [
              'Historical data',
              '/history',
              'Sourced chronology and downloadable records',
            ],
          ].map(([title, href, description]) => (
            <a
              key={title}
              href={href}
              className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
            >
              <Database className="h-5 w-5 text-primary-700" />
              <h3 className="mt-3 font-extrabold text-gray-950">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
