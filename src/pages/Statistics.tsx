import { ArrowUpRight } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import { HorizontalBarChart } from '../components/budget/BudgetCharts';
import CityComparison from '../components/statistics/CityComparison';

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

export default function Statistics() {
  return (
    <>
      <SEO
        title="Makati Statistics"
        description="Current basic Makati City statistics from the Philippine Statistics Authority."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City Information</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>Makati Statistics</Heading>
          <SharePage title="Makati Statistics | BetterMakati" />
        </div>
        <LastReviewed note="Population and GDP figures use PSA sources and stated geographic definitions." />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
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
      </Section>

      <Section className="bg-white">
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

        <div className="mt-8">
          <a
            href={populationSource}
            target="_blank"
            rel="noreferrer"
            className="brand-btn-secondary"
          >
            Open the full PSA population table
          </a>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <CityComparison />
      </Section>
    </>
  );
}
