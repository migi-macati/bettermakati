import {
  ArrowDownUp,
  ExternalLink,
  Home as HomeIcon,
  Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';

const psaUrl = 'https://psa.gov.ph/classification/psgc/barangays/1380300000';

const barangays: ReadonlyArray<readonly [string, number]> = [
  ['Bangkal', 18013],
  ['Bel-Air', 39354],
  ['Carmona', 3034],
  ['Dasmariñas', 4320],
  ['Forbes Park', 4183],
  ['Guadalupe Nuevo', 21596],
  ['Guadalupe Viejo', 13525],
  ['Kasilawan', 5007],
  ['La Paz', 6682],
  ['Magallanes', 5473],
  ['Olympia', 19035],
  ['Palanan', 11934],
  ['Pinagkaisahan', 5323],
  ['Pio Del Pilar', 55572],
  ['Poblacion', 17088],
  ['San Antonio', 18012],
  ['San Isidro', 6260],
  ['San Lorenzo', 14793],
  ['Santa Cruz', 6744],
  ['Singkamas', 7485],
  ['Tejeros', 16019],
  ['Urdaneta', 4720],
  ['Valenzuela', 5598],
];

const associations = [
  {
    name: 'Bel-Air Village Association (BAVA)',
    barangay: 'Bel-Air',
    href: 'https://www.bava.ph/',
    linkLabel: 'Website',
  },
  {
    name: 'Dasmariñas Village Association (DVA)',
    barangay: 'Dasmariñas',
    href: 'https://dva.org.ph/',
    linkLabel: 'Website',
  },
  {
    name: 'Forbes Park Association (FPA)',
    barangay: 'Forbes Park',
    href: 'https://www.forbesparkassociation.com/',
    linkLabel: 'Website',
  },
  {
    name: 'Magallanes Village Association (MVA)',
    barangay: 'Magallanes',
    href: 'https://www.google.com/maps/search/?api=1&query=Magallanes%20Village%20Association%20Makati',
    linkLabel: 'Map',
  },
  {
    name: 'San Lorenzo Village Association (SLVA)',
    barangay: 'San Lorenzo',
    href: 'https://www.myslv.ph/',
    linkLabel: 'Website',
  },
  {
    name: 'Urdaneta Village Association (UVA)',
    barangay: 'Urdaneta',
    href: 'https://www.google.com/maps/search/?api=1&query=Urdaneta%20Village%20Association%20Makati',
    linkLabel: 'Map',
  },
];

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function Barangays() {
  const [query, setQuery] = useState('');
  const [largestFirst, setLargestFirst] = useState(false);
  const visibleBarangays = useMemo(() => {
    const filtered = barangays.filter(([name]) =>
      name.toLowerCase().includes(query.trim().toLowerCase())
    );
    return largestFirst ? [...filtered].sort((a, b) => b[1] - a[1]) : filtered;
  }, [largestFirst, query]);

  return (
    <>
      <SEO
        title="Barangays"
        description="The 23 barangays of Makati City with 2024 POPCEN population."
      />
      <Section className="bg-[#fffdf8]">
        <Heading>Barangays</Heading>
        <Text className="text-gray-600 mb-4">
          Makati has{' '}
          <a
            className="text-primary-700 underline underline-offset-2"
            href={psaUrl}
            target="_blank"
            rel="noreferrer"
          >
            23 barangays
          </a>
          . Population figures are from the{' '}
          <a
            className="text-primary-700 underline underline-offset-2"
            href={psaUrl}
            target="_blank"
            rel="noreferrer"
          >
            2024 Census of Population
          </a>
          .
        </Text>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block max-w-sm flex-1">
            <span className="sr-only">Search barangays</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search barangay"
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <button
            type="button"
            onClick={() => setLargestFirst(value => !value)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-primary-200 bg-white px-3 py-2.5 text-sm font-bold text-primary-800 hover:border-primary-500 sm:self-auto"
            aria-pressed={largestFirst}
          >
            <ArrowDownUp className="h-4 w-4" aria-hidden="true" />
            {largestFirst ? 'Largest first' : 'Alphabetical'}
          </button>
        </div>

        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-semibold">Barangay</th>
                <th className="p-3 font-semibold text-right">
                  2024 population
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleBarangays.map(([name, population]) => (
                <tr
                  id={slug(name)}
                  key={name}
                  className="border-t scroll-mt-28"
                >
                  <td className="p-3">{name}</td>
                  <td className="p-3 text-right">
                    {population.toLocaleString('en-PH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Showing {visibleBarangays.length} of {barangays.length} barangays.
          Population source:{' '}
          <a
            className="font-bold text-primary-700 underline underline-offset-2"
            href={psaUrl}
            target="_blank"
            rel="noreferrer"
          >
            PSA 2024 POPCEN
          </a>
          .
        </p>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Residential communities</div>
        <Heading level={2}>Village & homeowners associations</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
          {associations.map(association => (
            <article
              key={association.name}
              className="rounded-2xl border border-primary-100 bg-white p-5"
            >
              <HomeIcon className="h-5 w-5 text-primary-700" />
              <h3 className="font-extrabold text-gray-950 mt-3">
                {association.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Barangay {association.barangay}
              </p>
              <a
                href={association.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
              >
                {association.linkLabel} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
