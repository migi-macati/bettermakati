import { useMemo, useState } from 'react';
import { ExternalLink, Mail, MapPin, Phone, Search } from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import { governmentServiceOffices } from '../data/governmentServiceOffices';

const mapsUrl = (query: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);

export default function GovernmentOffices() {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<'All' | 'In Makati' | 'Serves Makati'>('All');

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return governmentServiceOffices.filter(office => {
      const scopeMatch = scope === 'All' || office.scope === scope;
      const text = [office.name, office.agency, office.address, office.barangay, office.phone, office.email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return scopeMatch && (!needle || text.includes(needle));
    });
  }, [query, scope]);

  return (
    <>
      <SEO
        title="Government Service Offices"
        description="Citizen-facing national government and GOCC service offices in Makati, plus selected regional offices that serve Makati residents."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Services</div>
        <Heading>Government offices for Makati</Heading>
        <p className="mt-2 max-w-3xl text-gray-700">
          Citizen-facing national agencies and GOCC service offices in Makati, plus selected offices outside the city that directly serve Makati.
        </p>
        <LastReviewed
          note="Office locations can change. Check the linked agency source before travelling."
          className="mt-4"
        />

        <label className="relative mt-7 block max-w-3xl">
          <span className="sr-only">Search government offices</span>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search SSS, Pag-IBIG, PhilHealth, DepEd, address..."
            className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          {(['All', 'In Makati', 'Serves Makati'] as const).map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setScope(item)}
              className={
                scope === item
                  ? 'rounded-full bg-primary-800 px-4 py-2 text-sm font-bold text-white'
                  : 'rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700'
              }
            >
              {item}
            </button>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visible.map(office => (
            <article key={office.id} id={office.id} className="scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="text-xs font-bold text-primary-700">{office.scope}</div>
              <h2 className="mt-2 text-lg font-extrabold text-gray-950">{office.name}</h2>
              <div className="mt-1 text-sm font-semibold text-gray-500">{office.agency}</div>
              <div className="mt-4 flex gap-2 text-sm leading-relaxed text-gray-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                <span>{office.address}</span>
              </div>
              {office.phone && (
                <div className="mt-2 flex gap-2 text-sm text-gray-700">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                  <span>{office.phone}</span>
                </div>
              )}
              {office.email && (
                <div className="mt-2 flex gap-2 text-sm text-gray-700">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                  <span>{office.email}</span>
                </div>
              )}
              {office.note && <p className="mt-3 text-xs leading-relaxed text-gray-500">{office.note}</p>}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a href={mapsUrl(office.mapsQuery)} target="_blank" rel="noreferrer" className="font-bold text-primary-700 underline underline-offset-2">
                  Map
                </a>
                <a href={office.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2">
                  Agency source <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
