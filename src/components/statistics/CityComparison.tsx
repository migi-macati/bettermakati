import { useMemo, useState } from 'react';
import { ArrowUpRight, Download, Info, MapPinned } from 'lucide-react';
import {
  cityComparisonPdf,
  cityComparisonRows,
  cityComparisonSource,
} from '../../data/cityComparison';

type CityFilter = 'top10' | 'ncr' | 'outsideNcr';

const pesos = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);

const csv = [
  'City,Region,2024 GDP per person (PHP, constant 2018 prices)',
  ...cityComparisonRows.map(row =>
    [row.city, row.region, row.gdpPerPerson]
      .map(value => `"${value}"`)
      .join(',')
  ),
].join('\n');

export default function CityComparison() {
  const [filter, setFilter] = useState<CityFilter>('top10');
  const [showTable, setShowTable] = useState(false);

  const rows = useMemo(() => {
    if (filter === 'ncr')
      return cityComparisonRows.filter(row => row.region === 'NCR');
    if (filter === 'outsideNcr')
      return cityComparisonRows.filter(row => row.region !== 'NCR');
    return cityComparisonRows;
  }, [filter]);

  const max = Math.max(...rows.map(row => row.gdpPerPerson));
  const top = cityComparisonRows[0];
  const average = Math.round(
    cityComparisonRows.reduce((sum, row) => sum + row.gdpPerPerson, 0) /
      cityComparisonRows.length
  );

  return (
    <section aria-labelledby="city-comparison-title" className="mt-12">
      <div className="section-eyebrow">Philippine city benchmark</div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            id="city-comparison-title"
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-950"
          >
            How Makati compares with other cities
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
            Makati sits at the top of PSA&apos;s 2024 national comparison of
            provinces and highly urbanized cities by GDP per person. Use the
            filters to see the Metro Manila set or the city outside NCR included
            in the top ten.
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="City comparison filter"
        >
          {(
            [
              ['top10', 'Top 10 nationally'],
              ['ncr', 'Metro Manila'],
              ['outsideNcr', 'Outside NCR'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
                filter === value
                  ? 'border-primary-700 bg-primary-700 text-white'
                  : 'border-primary-200 bg-white text-primary-800 hover:border-primary-500'
              }`}
              aria-pressed={filter === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-primary-100 bg-primary-50 p-5">
          <MapPinned className="h-5 w-5 text-primary-700" aria-hidden="true" />
          <div className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            Makati
          </div>
          <div className="mt-1 text-2xl font-extrabold text-gray-950">
            {pesos(top.gdpPerPerson)}
          </div>
          <div className="mt-1 text-xs text-gray-600">per person, 2024</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
            Top 10 average
          </div>
          <div className="mt-1 text-2xl font-extrabold text-gray-950">
            {pesos(average)}
          </div>
          <div className="mt-1 text-xs text-gray-600">same PSA price basis</div>
        </div>
        <div className="rounded-2xl border border-secondary-200 bg-secondary-50 p-5">
          <Info className="h-5 w-5 text-secondary-700" aria-hidden="true" />
          <div className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-secondary-800">
            Read the measure correctly
          </div>
          <div className="mt-1 text-sm font-bold text-gray-950">
            Economic output per resident
          </div>
          <div className="mt-1 text-xs leading-relaxed text-gray-600">
            It is not household income or the city government&apos;s budget.
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-extrabold text-gray-950">
              GDP per person, 2024
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Philippine pesos at constant 2018 prices
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              onClick={() => setShowTable(value => !value)}
              className="font-bold text-primary-700 underline underline-offset-2"
              aria-expanded={showTable}
            >
              {showTable ? 'Hide table' : 'Show data table'}
            </button>
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
              download="makati-city-comparison-2024.csv"
              className="inline-flex items-center gap-1 font-bold text-primary-700"
            >
              Download CSV <Download className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div
          className="mt-6 space-y-4"
          role="list"
          aria-label="GDP per person comparison"
        >
          {rows.map((row, index) => (
            <div key={row.city} role="listitem">
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <span className="w-5 text-right text-xs text-gray-400">
                    {index + 1}
                  </span>
                  <span
                    className={
                      row.isMakati ? 'font-extrabold text-primary-800' : ''
                    }
                  >
                    {row.city}
                  </span>
                  <span className="text-xs font-normal text-gray-500">
                    {row.region}
                  </span>
                </div>
                <div className="text-sm font-extrabold text-gray-950">
                  {pesos(row.gdpPerPerson)}
                </div>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${row.isMakati ? 'bg-primary-700' : 'bg-accent-500'}`}
                  style={{
                    width: `${Math.max((row.gdpPerPerson / max) * 100, 2)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {showTable && (
          <div className="mt-7 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[520px] text-left text-sm">
              <caption className="sr-only">
                2024 GDP per person for the selected cities
              </caption>
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3 text-right">GDP per person</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.city} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-bold">{row.city}</td>
                    <td className="px-4 py-3 text-gray-600">{row.region}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {pesos(row.gdpPerPerson)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-gray-500">
          Source:{' '}
          <a
            href={cityComparisonSource}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            PSA special release
          </a>{' '}
          and its{' '}
          <a
            href={cityComparisonPdf}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            two-page statistical brief{' '}
            <ArrowUpRight className="inline h-3 w-3" />
          </a>
          . The 2024 GDP per capita uses the 2024 POPCEN population base.
        </p>
      </div>
    </section>
  );
}
