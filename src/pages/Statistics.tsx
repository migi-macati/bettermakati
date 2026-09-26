import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Database,
  Download,
  GraduationCap,
  HeartPulse,
  Landmark,
  MapPinned,
  Trees,
  Users,
  Waypoints,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SectionNav from '../components/ui/SectionNav';
import SharePage from '../components/ui/SharePage';
import { HorizontalBarChart } from '../components/budget/BudgetCharts';
import CityComparison from '../components/statistics/CityComparison';
import { useBarangayScope } from '../hooks/useBarangayScope';
import {
  barangays,
  currentMakatiPopulation2024,
  psaBarangaySource,
} from '../data/barangays';
import {
  barangayPopulationContext2024,
  cityIndicatorById,
  cityIndicatorObservations,
  cityIndicatorSources,
  latestCityIndicatorObservation,
  type CityIndicatorObservation,
} from '../data/cityIndicators';
import { statisticsRelatedRecords } from '../data/statisticsCivicRelationships';

const people = (value: number) =>
  new Intl.NumberFormat('en-PH').format(value);

const pesos = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);

const compactPesos = (value: number) => {
  if (value >= 1_000_000) return '₱' + (value / 1_000_000).toFixed(2) + 'M';
  if (value >= 1_000) return '₱' + (value / 1_000).toFixed(1) + 'K';
  return pesos(value);
};

const numberValue = (observation: CityIndicatorObservation | null) =>
  typeof observation?.value === 'number' ? observation.value : null;

const indicatorSource = (indicatorId: string) => {
  const indicator = cityIndicatorById.get(indicatorId);
  const sourceId = indicator?.provenance.sourceIds[0];
  return sourceId ? cityIndicatorSources[sourceId] : undefined;
};

const indicatorPeriod = (indicatorId: string) =>
  latestCityIndicatorObservation(indicatorId)?.period.label ?? '';

const ordinal = (value: number) => {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return value + 'th';
  const mod10 = value % 10;
  if (mod10 === 1) return value + 'st';
  if (mod10 === 2) return value + 'nd';
  if (mod10 === 3) return value + 'rd';
  return value + 'th';
};

export default function Statistics() {
  const { barangay } = useBarangayScope();

  const populationTrend = cityIndicatorObservations('population-total').map(
    observation => ({
      year: Number(observation.period.year ?? observation.period.label),
      population: Number(observation.value),
    })
  );
  const growthTrend = cityIndicatorObservations('population-growth-rate');

  const population2010 = populationTrend[0]?.population ?? 0;
  const population2024 =
    populationTrend.at(-1)?.population ?? currentMakatiPopulation2024;
  const populationGrowthSince2010 =
    population2010 > 0
      ? ((population2024 - population2010) / population2010) * 100
      : 0;

  const barangayPopulationContext = barangay
    ? barangayPopulationContext2024(barangay.slug)
    : null;
  const barangayPopulationShare =
    barangayPopulationContext?.shareOfCity ?? null;

  const gdpPerPerson = numberValue(
    latestCityIndicatorObservation('gdp-per-capita')
  );
  const nationalGdpShare = numberValue(
    latestCityIndicatorObservation('gdp-national-share')
  );
  const laborForceParticipation = numberValue(
    latestCityIndicatorObservation('resident-labor-force-participation-rate')
  );
  const employmentRate = numberValue(
    latestCityIndicatorObservation('resident-employment-rate')
  );
  const unemploymentRate = numberValue(
    latestCityIndicatorObservation('resident-unemployment-rate')
  );
  const underemploymentRate = numberValue(
    latestCityIndicatorObservation('resident-underemployment-rate')
  );

  const parks = numberValue(
    latestCityIndicatorObservation('public-parks-administrative-count')
  );
  const schools = numberValue(
    latestCityIndicatorObservation('public-schools-current')
  );
  const yakapProviders = numberValue(
    latestCityIndicatorObservation('yakap-gamot-providers-makati')
  );
  const drainage = numberValue(
    latestCityIndicatorObservation('improved-drainage-length')
  );
  const concretedRoads = numberValue(
    latestCityIndicatorObservation('road-surface-length-concreted')
  );
  const asphaltRoads = numberValue(
    latestCityIndicatorObservation('road-surface-length-asphalt')
  );

  const populationAnalysisLinks = [
    ...statisticsRelatedRecords('population-total'),
    ...statisticsRelatedRecords('population-growth-rate'),
  ]
    .filter(item => item.node?.owner === 'reports')
    .filter(
      (item, index, items) =>
        items.findIndex(candidate => candidate.node?.href === item.node?.href) ===
        index
    );

  const economyContextLinks = [
    ...statisticsRelatedRecords('real-gdp-level'),
    ...statisticsRelatedRecords('gdp-per-capita'),
  ]
    .filter(item => item.node?.owner === 'ecosystem')
    .filter(
      (item, index, items) =>
        items.findIndex(candidate => candidate.node?.href === item.node?.href) ===
        index
    );

  const heroStats = [
    {
      value: people(population2024),
      label: 'people',
      note: '2024 POPCEN · current 23-barangay boundary',
      href: indicatorSource('population-total')?.url,
      sourceLabel: 'Philippine Statistics Authority',
    },
    {
      value: String(barangays.length),
      label: 'barangays',
      note: 'Current Makati geography',
      href: psaBarangaySource,
      sourceLabel: 'PSA PSGC',
    },
    {
      value: gdpPerPerson === null ? '—' : compactPesos(gdpPerPerson),
      label: 'GDP per person',
      note: '2024 · constant 2018 prices',
      href: indicatorSource('gdp-per-capita')?.url,
      sourceLabel: 'Philippine Statistics Authority',
    },
    {
      value:
        nationalGdpShare === null
          ? '—'
          : nationalGdpShare.toFixed(1) + '%',
      label: 'of Philippine GDP',
      note: '2025 PSA estimate',
      href: indicatorSource('gdp-national-share')?.url,
      sourceLabel: 'Philippine Statistics Authority',
    },
  ];

  const systems = [
    {
      label: 'Public parks',
      value: parks === null ? '—' : people(parks),
      note: indicatorPeriod('public-parks-administrative-count') + ' city inventory',
      icon: Trees,
      indicatorId: 'public-parks-administrative-count',
    },
    {
      label: 'Public schools',
      value: schools === null ? '—' : people(schools),
      note: 'DepEd dashboard · ' + indicatorPeriod('public-schools-current'),
      icon: GraduationCap,
      indicatorId: 'public-schools-current',
    },
    {
      label: 'YAKAP/GAMOT providers',
      value: yakapProviders === null ? '—' : people(yakapProviders),
      note: 'PhilHealth list · ' + indicatorPeriod('yakap-gamot-providers-makati'),
      icon: HeartPulse,
      indicatorId: 'yakap-gamot-providers-makati',
    },
    {
      label: 'Improved drainage',
      value: drainage === null ? '—' : drainage.toFixed(3) + ' km',
      note: indicatorPeriod('improved-drainage-length') + ' city inventory',
      icon: Waypoints,
      indicatorId: 'improved-drainage-length',
    },
  ];

  const deeperTables = [
    {
      title: 'Households',
      description:
        'Household population, household count and average household size.',
      indicatorId: 'household-population',
      icon: Users,
    },
    {
      title: 'Economy by industry',
      description:
        'Real GDP, industry GVA, growth and Makati’s economic structure.',
      indicatorId: 'real-gdp-level',
      icon: Building2,
    },
    {
      title: 'Population density',
      description:
        'Comparable 2015, 2020 and 2024 density on the current boundary.',
      indicatorId: 'population-density',
      icon: MapPinned,
    },
    {
      title: 'Land use',
      description:
        'Official 2022 existing-land-use distribution on the 23-barangay city.',
      indicatorId: 'existing-land-use-distribution',
      icon: Landmark,
    },
  ];

  return (
    <>
      <SEO
        title={barangay ? barangay.name + ' Statistics' : 'Makati Statistics'}
        description={
          barangay
            ? 'Population context for Barangay ' +
              barangay.name +
              ' with comparable citywide Makati indicators and official sources.'
            : 'Population, economy, public services and infrastructure indicators for Makati, using official sources and comparable geographic definitions.'
        }
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'BetterMakati city statistics',
          description:
            'Population, economic, service and infrastructure indicators for Makati City with source links and comparable definitions.',
          spatialCoverage: 'Makati City, Philippines',
          temporalCoverage: '2010/2026',
        }}
      />

      <section className="border-b border-primary-900 bg-primary-800 text-white">
        <div className="container px-5 py-12 md:px-6 md:py-16 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-400 md:text-sm">
                Makati in numbers
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                See how Makati is changing.
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-primary-50 md:text-xl">
                Population, economy, public services and infrastructure — on
                the same city boundary whenever the source allows it.
              </p>
            </div>
            <SharePage title="Makati Statistics | BetterMakati" />
          </div>

          <div
            id="statistics-summary"
            className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4"
          >
            {heroStats.map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 md:p-5"
              >
                <div className="text-2xl font-extrabold text-white md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 font-bold text-white">{stat.label}</div>
                <div className="mt-1 text-xs leading-relaxed text-primary-100">
                  {stat.note}
                </div>
                {stat.href && (
                  <a
                    href={stat.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-bold text-secondary-300 underline underline-offset-2"
                  >
                    {stat.sourceLabel}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            ))}
          </div>

          <LastReviewed
            date="2026-09-26"
            note="Dates on each indicator show the observation or source snapshot."
            className="mt-5 !text-primary-50 [&_strong]:!text-white [&_svg]:!text-secondary-400"
          />
        </div>
      </section>

      <Section className="bg-[#fffdf8]">
        {barangay && barangayPopulationContext && (
          <div
            id="barangay-statistics"
            className="mb-8 rounded-2xl border border-primary-200 bg-white p-5 md:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="section-eyebrow">Better{barangay.name}</div>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">
                  {barangay.name} in the city
                </h2>
              </div>
              <a
                href={psaBarangaySource}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
              >
                PSA barangay source
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-50 p-4">
                <div className="text-2xl font-extrabold text-primary-800 md:text-3xl">
                  {people(barangay.population2024)}
                </div>
                <div className="mt-1 font-bold text-gray-950">residents</div>
                <div className="mt-1 text-xs text-gray-500">2024 POPCEN</div>
              </div>
              <div className="rounded-xl bg-primary-50 p-4">
                <div className="text-2xl font-extrabold text-primary-800 md:text-3xl">
                  {barangayPopulationShare?.toFixed(1)}%
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  of Makati population
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  current 23-barangay boundary
                </div>
              </div>
              <div className="rounded-xl bg-primary-50 p-4">
                <div className="text-2xl font-extrabold text-primary-800 md:text-3xl">
                  {ordinal(barangayPopulationContext.rankByPopulation)}
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  by population
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  of {barangayPopulationContext.totalBarangays} barangays
                </div>
              </div>
              <div className="rounded-xl bg-primary-50 p-4">
                <div className="text-xl font-extrabold text-primary-800 md:text-2xl">
                  {barangay.legislativeDistrict}
                </div>
                <div className="mt-1 font-bold text-gray-950">
                  legislative district
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  canonical barangay profile
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4 text-sm text-gray-700">
                <strong>City median:</strong>{' '}
                {people(barangayPopulationContext.medianPopulation)} residents.
                Barangay-level data shown here is the source-backed 2024
                population. Economy, labor and city-system measures below stay
                citywide unless an official barangay value is available.
              </div>
              <Link
                to={'/barangays/' + barangay.slug}
                className="brand-btn-secondary justify-center"
              >
                Open barangay profile
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        <SectionNav
          items={[
            ...(barangay
              ? [{ label: 'Barangay snapshot', href: '#barangay-statistics' }]
              : []),
            { label: 'Population', href: '#population-trend' },
            { label: 'Economy & work', href: '#economy-work' },
            { label: 'City systems', href: '#city-systems' },
            { label: 'Compare cities', href: '#city-comparison-title' },
            { label: 'More data', href: '#statistics-data' },
          ]}
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-primary-100 bg-white p-6 md:p-7">
            <div className="section-eyebrow">
              {barangay ? 'Citywide context' : 'What changed'}
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">
              Makati added {people(population2024 - population2010)} people
              from 2010 to 2024.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
              That is about {populationGrowthSince2010.toFixed(1)}% growth on
              PSA’s comparable current-boundary series. Average annual growth
              was {Number(growthTrend.at(-1)?.value ?? 0).toFixed(2)}% in
              2020–2024, up from{' '}
              {Number(growthTrend.at(-2)?.value ?? 0).toFixed(2)}% in
              2015–2020.
            </p>
            <a
              href={indicatorSource('population-total')?.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
            >
              Open PSA population table
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="rounded-2xl border border-secondary-200 bg-secondary-50 p-6">
            <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-secondary-900">
              Read the boundary
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-800">
              The comparable population series excludes the 10 barangays
              transferred to Taguig. Older totals that include them describe a
              different Makati geography.
            </p>
          </div>
        </div>
      </Section>

      <Section id="population-trend" className="bg-white">
        <div className="section-eyebrow">Population</div>
        <Heading level={2}>A comparable 14-year population trend</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
          Four census/POPCEN observations on Makati’s current 23-barangay
          boundary.
        </p>

        <div className="mt-7 grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_0.9fr]">
          <HorizontalBarChart
            title="Population on the current city boundary"
            items={populationTrend.map(item => ({
              label: String(item.year),
              value: item.population,
            }))}
            formatValue={people}
          />

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full min-w-[420px] text-left">
              <caption className="sr-only">
                Makati population and average annual population growth
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-bold">Census year</th>
                  <th className="px-4 py-3 text-right font-bold">
                    Population
                  </th>
                  <th className="px-4 py-3 text-right font-bold">
                    Annual growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {populationTrend.map((item, index) => (
                  <tr key={item.year} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-bold">{item.year}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {people(item.population)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {index === 0
                        ? '—'
                        : Number(growthTrend[index - 1]?.value ?? 0).toFixed(
                            2
                          ) + '%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-3 text-xs leading-relaxed text-gray-500">
              Annual growth is PSA’s average annual rate from the preceding
              census/POPCEN observation.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={indicatorSource('population-total')?.url}
            target="_blank"
            rel="noreferrer"
            className="brand-btn-secondary"
          >
            Open source table
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={populationTrendDownloadHref}
            download={populationTrendDownload.filename}
            className="brand-btn-secondary"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600">
          <strong className="text-gray-800">Definition:</strong>{' '}
          {populationTrendDownload.provenance.definition}{' '}
          <span aria-hidden="true">·</span>{' '}
          <strong className="text-gray-800">Geography:</strong>{' '}
          {populationTrendDownload.provenance.geography}{' '}
          <span aria-hidden="true">·</span>{' '}
          <strong className="text-gray-800">Reviewed:</strong>{' '}
          {populationTrendDownload.provenance.lastReviewed}
        </div>

        {populationAnalysisLinks.length > 0 && (
          <div className="mt-5 rounded-2xl border border-primary-100 bg-primary-50 p-5">
            <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary-700">
              Related analysis
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {populationAnalysisLinks.map(item =>
                item.node ? (
                  <Link
                    key={item.node.href}
                    to={item.node.href}
                    className="inline-flex min-h-11 items-center gap-1 rounded-full border border-primary-200 bg-white px-4 text-sm font-bold text-primary-800 hover:border-primary-400"
                  >
                    {item.node.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null
              )}
            </div>
          </div>
        )}
      </Section>

      <Section id="economy-work" className="border-y border-primary-100 bg-[#f5f8f2]">
        <div className="section-eyebrow">Economy & work</div>
        <Heading level={2}>Output is large. Labor indicators describe residents.</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
          GDP measures production within Makati. Labor-force indicators below
          describe Makati residents, not the number of jobs physically located
          in Makati establishments.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-primary-200 bg-white p-5">
            <BarChart3 className="h-5 w-5 text-primary-700" aria-hidden="true" />
            <div className="mt-3 text-2xl font-extrabold text-gray-950 md:text-3xl">
              {gdpPerPerson === null ? '—' : compactPesos(gdpPerPerson)}
            </div>
            <div className="mt-1 font-bold text-gray-950">GDP per person</div>
            <div className="mt-1 text-xs text-gray-500">2024 · PSA</div>
          </div>
          <div className="rounded-2xl border border-primary-200 bg-white p-5">
            <Landmark className="h-5 w-5 text-primary-700" aria-hidden="true" />
            <div className="mt-3 text-2xl font-extrabold text-gray-950 md:text-3xl">
              {nationalGdpShare === null
                ? '—'
                : nationalGdpShare.toFixed(1) + '%'}
            </div>
            <div className="mt-1 font-bold text-gray-950">
              of Philippine GDP
            </div>
            <div className="mt-1 text-xs text-gray-500">2025 · PSA PPA</div>
          </div>
          <div className="rounded-2xl border border-primary-200 bg-white p-5">
            <Users className="h-5 w-5 text-primary-700" aria-hidden="true" />
            <div className="mt-3 text-2xl font-extrabold text-gray-950 md:text-3xl">
              {laborForceParticipation === null
                ? '—'
                : laborForceParticipation.toFixed(1) + '%'}
            </div>
            <div className="mt-1 font-bold text-gray-950">
              labor-force participation
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Makati residents · 2025
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-2xl font-extrabold text-gray-950 md:text-3xl">
              {employmentRate === null ? '—' : employmentRate.toFixed(1) + '%'}
            </div>
            <div className="mt-1 font-bold text-gray-950">employment rate</div>
            <div className="mt-1 text-xs text-gray-500">
              resident labor force · 2025
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-2xl font-extrabold text-gray-950 md:text-3xl">
              {unemploymentRate === null
                ? '—'
                : unemploymentRate.toFixed(1) + '%'}
            </div>
            <div className="mt-1 font-bold text-gray-950">
              unemployment rate
            </div>
            <div className="mt-1 text-xs text-gray-500">
              resident labor force · 2025
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-2xl font-extrabold text-gray-950 md:text-3xl">
              {underemploymentRate === null
                ? '—'
                : underemploymentRate.toFixed(1) + '%'}
            </div>
            <div className="mt-1 font-bold text-gray-950">
              underemployment rate
            </div>
            <div className="mt-1 text-xs text-gray-500">
              employed residents · 2025
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={indicatorSource('gdp-per-capita')?.url}
            target="_blank"
            rel="noreferrer"
            className="brand-btn-secondary"
          >
            PSA economic data <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={indicatorSource('resident-employment-rate')?.url}
            target="_blank"
            rel="noreferrer"
            className="brand-btn-secondary"
          >
            PSA labor-force data <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {economyContextLinks.length > 0 && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-gray-500">
              National data context
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {economyContextLinks.map(item =>
                item.node ? (
                  <a
                    key={item.node.href}
                    href={item.node.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 rounded-full border border-gray-200 px-4 text-sm font-bold text-primary-800 hover:border-primary-400"
                  >
                    {item.node.label}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null
              )}
            </div>
          </div>
        )}
      </Section>

      <Section id="city-systems" className="bg-[#fffdf8]">
        <div className="section-eyebrow">City systems</div>
        <Heading level={2}>A dated snapshot of the city people use.</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
          Each count keeps its own observation date. A 2023 park or drainage
          inventory is not relabeled as a 2026 count.
        </p>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {systems.map(item => {
            const Icon = item.icon;
            const source = indicatorSource(item.indicatorId);
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-primary-100 bg-white p-5"
              >
                <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                <div className="mt-3 text-2xl font-extrabold text-gray-950 md:text-3xl">
                  {item.value}
                </div>
                <div className="mt-1 font-bold text-gray-950">{item.label}</div>
                <div className="mt-1 text-xs leading-relaxed text-gray-500">
                  {item.note}
                </div>
                {source && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-bold text-primary-700 underline underline-offset-2"
                  >
                    Source <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-xl font-extrabold text-gray-950">
              {concretedRoads === null ? '—' : concretedRoads.toFixed(3) + ' km'}
            </div>
            <div className="mt-1 text-sm font-bold text-gray-900">
              concreted roads
            </div>
            <div className="mt-1 text-xs text-gray-500">2023 city inventory</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-xl font-extrabold text-gray-950">
              {asphaltRoads === null ? '—' : asphaltRoads.toFixed(3) + ' km'}
            </div>
            <div className="mt-1 text-sm font-bold text-gray-900">
              asphalt roads
            </div>
            <div className="mt-1 text-xs text-gray-500">2023 city inventory</div>
          </div>
          <div className="rounded-2xl border border-secondary-200 bg-secondary-50 p-5">
            <div className="text-sm font-extrabold text-secondary-900">
              Parks: two scopes
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-800">
              The city’s 2023 administrative count is 15 public parks. The
              accessibility audit currently uses 13 verified park targets.
            </p>
            <Link
              to="/civic-map/audits/park-accessibility-2026/results"
              className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700"
            >
              Open park audit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <CityComparison />
      </Section>

      <Section id="statistics-data" className="bg-white">
        <div className="section-eyebrow">Go deeper</div>
        <Heading level={2}>Open the detailed official tables.</Heading>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {deeperTables.map(item => {
            const Icon = item.icon;
            const source = indicatorSource(item.indicatorId);
            return (
              <a
                key={item.title}
                href={source?.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                <h3 className="mt-3 font-extrabold text-gray-950">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700">
                  Open source <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            );
          })}
        </div>

        <div className="mt-10">
          <div className="section-eyebrow">Across BetterMakati</div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['Barangays', '/barangays', 'Population and local profiles'],
              [
                'Projects & money',
                '/projects-budget',
                'Budgets, actuals and projects',
              ],
              ['City activity', '/city-monitor', 'Current civic records'],
              ['Reports & insights', '/reports', 'Analysis built from city records'],
            ].map(([title, href, description]) => (
              <Link
                key={title}
                to={href}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary-300"
              >
                <Database className="h-5 w-5 text-primary-700" aria-hidden="true" />
                <h3 className="mt-3 font-extrabold text-gray-950">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{description}</p>
                <span className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-700">
                  Open <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <section className="border-t border-primary-900 bg-primary-900 py-12 text-white">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-400">
                National context
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                Compare Makati with the rest of the country.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary-100 md:text-base">
                Continue to BetterGov for national datasets, visualizations and
                price benchmarks.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://data.bettergov.ph/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary-900"
              >
                Open national data <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="https://visualizations.bettergov.ph/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-white/30 px-4 py-2 text-sm font-bold text-white"
              >
                Visualizations <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="https://price-guides.bettergov.ph/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-white/30 px-4 py-2 text-sm font-bold text-white"
              >
                Price guides <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
