import { ArrowRight, Search, Users } from 'lucide-react';
import { Link } from 'react-router';
import { useMemo, useState } from 'react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SEO from '../components/SEO';
import {
  barangays,
  barangayProfilesReviewed,
} from '../data/barangays';

const compactEditionName = (name: string) => name.replace(/\s+/g, '');

export default function Barangays() {
  const [query, setQuery] = useState('');

  const visibleBarangays = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return barangays.filter(barangay => {
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
  }, [query]);

  return (
    <>
      <SEO
        title="Barangays"
        description="Choose one of Makati City's 23 barangays to open its BetterMakati local homepage with current officials, services, facilities, records and local civic context."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Barangay gateway</div>
        <Heading>Choose a barangay</Heading>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-gray-700">
          Each BetterBarangay page brings together local services, the current barangay
          council, public facilities, election context and locally tagged civic records.
        </p>
        <LastReviewed
          date={barangayProfilesReviewed}
          note="Population uses the 2024 POPCEN. Council rosters are for the 2023–2026 term."
          className="mt-4"
        />

        <label className="relative mt-7 block max-w-xl">
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
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-base outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </label>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleBarangays.map(barangay => (
            <Link
              key={barangay.slug}
              to={'/barangays/' + barangay.slug}
              className="group flex min-h-36 items-start justify-between gap-4 rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  {barangay.legislativeDistrict}
                </div>
                <h2 className="mt-1 text-xl font-extrabold text-gray-950">
                  Better{compactEditionName(barangay.name)}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {barangay.population2024.toLocaleString('en-PH')} residents · 2024 POPCEN
                </p>
                {barangay.officials?.punongBarangay && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-gray-700">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
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
      </Section>
    </>
  );
}
