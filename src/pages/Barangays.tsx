import { ArrowRight, Search, Users } from 'lucide-react';
import { Link } from 'react-router';
import { useMemo, useState } from 'react';
import LastReviewed from '../components/ui/LastReviewed';
import SEO from '../components/SEO';
import {
  barangays,
  barangayProfilesReviewed,
} from '../data/barangays';

export default function Barangays() {
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('All');

  const districts = useMemo(
    () => ['All', ...Array.from(new Set(barangays.map(item => item.legislativeDistrict)))],
    []
  );

  const visibleBarangays = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return barangays.filter(barangay => {
      if (district !== 'All' && barangay.legislativeDistrict !== district) {
        return false;
      }

      const searchable = [
        barangay.name,
        barangay.legislativeDistrict,
        barangay.officials?.punongBarangay,
        barangay.officials?.skChairperson,
        ...(barangay.officials?.kagawads ?? []),
        ...(barangay.notablePlaces?.map(item => item.name) ?? []),
        ...(barangay.associations?.map(item => item.name) ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return !needle || searchable.includes(needle);
    });
  }, [district, query]);

  return (
    <>
      <SEO
        title="Barangays"
        description="Choose one of Makati City's 23 barangays to open its BetterMakati local homepage with current officials, services, facilities, records and local civic context."
      />

      <section className="border-b border-primary-900 bg-primary-800 text-white">
        <div className="container px-5 py-12 md:px-6 md:py-16 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-400 md:text-sm">
              BetterBarangay
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Find your barangay.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-primary-50 md:text-xl">
              Local services, officials, facilities, projects, records and places for
              each of Makati&apos;s 23 barangays.
            </p>

            <label className="relative mt-7 block max-w-2xl">
              <span className="sr-only">Search barangays, officials or local places</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search barangay, official or local place"
                className="w-full rounded-xl border border-white/30 bg-white py-3.5 pl-12 pr-4 text-base text-gray-950 shadow-sm outline-none placeholder:text-gray-500 focus:border-secondary-400 focus:ring-2 focus:ring-secondary-300/40"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter barangays by district">
              {districts.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDistrict(item)}
                  className={
                    district === item
                      ? 'min-h-11 rounded-full bg-secondary-500 px-4 py-2 text-sm font-bold text-primary-900'
                      : 'min-h-11 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/15'
                  }
                >
                  {item === 'All' ? 'All barangays' : item}
                </button>
              ))}
            </div>

            <LastReviewed
              date={barangayProfilesReviewed}
              note="Population: 2024 POPCEN · Council rosters: 2023–2026 term"
              className="mt-5 !text-primary-50 [&_strong]:!text-white [&_svg]:!text-secondary-400"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf8] py-10 md:py-12">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="section-eyebrow">
                {district === 'All' ? 'All barangays' : district}
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">
                {visibleBarangays.length}{' '}
                {visibleBarangays.length === 1 ? 'barangay' : 'barangays'}
              </h2>
            </div>
            {(query || district !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setDistrict('All');
                }}
                className="min-h-11 text-sm font-bold text-primary-700 hover:text-primary-900"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleBarangays.map(barangay => (
              <Link
                key={barangay.slug}
                to={'/barangays/' + barangay.slug}
                className="group flex min-h-36 items-start justify-between gap-4 rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-400 hover:shadow-sm"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {barangay.legislativeDistrict}
                  </div>
                  <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-950">
                    {barangay.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {barangay.population2024.toLocaleString('en-PH')} residents · 2024 POPCEN
                  </p>
                  {barangay.officials?.punongBarangay && (
                    <div className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-gray-700">
                      <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
                      <span>
                        <span className="font-semibold">Punong Barangay:</span>{' '}
                        {barangay.officials.punongBarangay}
                      </span>
                    </div>
                  )}
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-primary-700 transition group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>

          {visibleBarangays.length === 0 && (
            <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
              No barangay, official or indexed local place matches that search.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
