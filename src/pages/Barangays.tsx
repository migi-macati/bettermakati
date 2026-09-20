import {
  ArrowDownUp,
  ArrowRight,
  ExternalLink,
  Home as HomeIcon,
  Search,
} from 'lucide-react';
import { Link } from 'react-router';
import { useMemo, useState } from 'react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import { barangays, psaBarangaySource } from '../data/barangays';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { barangayImageSet } from '../data/cityImages';

export default function Barangays() {
  const [query, setQuery] = useState('');
  const [largestFirst, setLargestFirst] = useState(false);

  const visibleBarangays = useMemo(() => {
    const filtered = barangays.filter(barangay =>
      barangay.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    return largestFirst
      ? [...filtered].sort((a, b) => b.population2024 - a.population2024)
      : filtered;
  }, [largestFirst, query]);

  const associations = barangays.flatMap(barangay =>
    (barangay.associations ?? []).map(association => ({
      ...association,
      barangay: barangay.name,
    }))
  );

  return (
    <>
      <SEO
        title="Barangays"
        description="The 23 barangays of Makati City with individual profiles and 2024 POPCEN population."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">City</div>
        <Heading>Barangays</Heading>
        <Text className="mt-3 max-w-3xl text-gray-600">
          Makati has{' '}
          <a
            className="font-bold text-primary-700 underline underline-offset-2"
            href={psaBarangaySource}
            target="_blank"
            rel="noreferrer"
          >
            23 barangays
          </a>
          . Open a profile for population, district, map and available community
          links.
        </Text>

        <PhotoCarousel
          images={barangayImageSet}
          title="Neighborhood Makati"
          compact
          className="mt-7"
        />

        <div className="my-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-semibold">Barangay</th>
                <th className="p-3 font-semibold">District</th>
                <th className="p-3 font-semibold text-right">2024 population</th>
                <th className="p-3 font-semibold text-right">
                  <span className="sr-only">Profile</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleBarangays.map(barangay => (
                <tr key={barangay.slug} className="border-t">
                  <td className="p-3 font-bold text-gray-950">
                    <Link
                      to={'/barangays/' + barangay.slug}
                      className="hover:text-primary-700"
                    >
                      {barangay.name}
                    </Link>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {barangay.legislativeDistrict}
                  </td>
                  <td className="p-3 text-right">
                    {barangay.population2024.toLocaleString('en-PH')}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={'/barangays/' + barangay.slug}
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
                    >
                      Profile <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
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
            href={psaBarangaySource}
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

        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {associations.map(association => (
            <article
              key={association.name}
              className="rounded-2xl border border-primary-100 bg-white p-5"
            >
              <HomeIcon className="h-5 w-5 text-primary-700" />
              <h3 className="mt-3 font-extrabold text-gray-950">
                {association.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Barangay {association.barangay}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={association.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
                >
                  {association.linkLabel}{' '}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <Link
                  to={
                    '/barangays/' +
                    barangays.find(b => b.name === association.barangay)?.slug
                  }
                  className="inline-flex items-center gap-1 text-sm font-bold text-gray-600"
                >
                  Barangay profile <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
