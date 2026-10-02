import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Mail, MapPin, Phone, Search } from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import { governmentServiceOffices } from '../data/governmentServiceOffices';
import { placeRegistryById } from '../data/placeRegistry';

const mapsUrl = (query: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);

export default function GovernmentOffices() {
  const { t } = useTranslation();
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
        title={t('servicesGovernment.offices.seoTitle')}
        description={t('servicesGovernment.offices.seoDescription')}
      />
      <Section className="bm-service-discovery bg-[#fffdf8]">
        <div className="section-eyebrow">{t('servicesGovernment.services')}</div>
        <Heading>{t('servicesGovernment.offices.title')}</Heading>
        <p className="mt-2 max-w-3xl text-gray-700">
          {t('servicesGovernment.offices.intro')}
        </p>
        <LastReviewed date="2026-09-20"
          note={t('servicesGovernment.offices.reviewNote')}
          className="mt-4"
        />

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
          <Link to="/services" className="inline-flex min-h-11 items-center text-primary-700 underline underline-offset-2">
            {t('servicesGovernment.offices.startService')}
          </Link>
          <Link
            to="/community-tools/saan-ako-lalapit"
            className="inline-flex min-h-11 items-center text-primary-700 underline underline-offset-2"
          >
            {t('servicesGovernment.offices.unsure')}
          </Link>
        </div>

        <label className="relative mt-7 block max-w-3xl">
          <span className="sr-only">{t('servicesGovernment.offices.searchLabel')}</span>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={t('servicesGovernment.offices.searchPlaceholder')}
            className="bm-service-search min-h-11 w-full rounded-2xl py-3.5 pl-12 pr-4"
          />
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          {(['All', 'In Makati', 'Serves Makati'] as const).map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setScope(item)}
              aria-pressed={scope === item}
              className={
                scope === item
                  ? 'min-h-11 rounded-full bg-primary-800 px-4 py-2 text-sm font-bold text-white'
                  : 'min-h-11 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700'
              }
            >
              {t(`servicesGovernment.offices.scope.${item === 'All' ? 'all' : item === 'In Makati' ? 'inMakati' : 'servesMakati'}`)}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600" role="status" aria-live="polite" aria-atomic="true">
          {t('servicesGovernment.offices.shown', { count: visible.length })}
        </p>
      </Section>

      <Section className="bg-white">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visible.map(office => {
            const place = office.placeId ? placeRegistryById.get(office.placeId) : undefined;

            return (
            <article key={office.id} id={office.id} className="bm-service-card scroll-mt-28 p-5">
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
                <a href={mapsUrl(office.mapsQuery)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-bold text-primary-700 underline underline-offset-2">
                  {t('servicesGovernment.offices.map')}
                </a>
                <a href={office.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 font-bold text-primary-700 underline underline-offset-2">
                  {t('servicesGovernment.offices.agencySource')} <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {place && (
                  <Link
                    to={'/civic-map/' + place.id}
                    className="inline-flex min-h-11 items-center font-bold text-primary-700 underline underline-offset-2"
                  >
                    {t('servicesGovernment.offices.placeDetails')}
                  </Link>
                )}
              </div>
            </article>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-[#fffdf8] p-6 text-center">
            <div className="font-extrabold text-gray-950">{t('servicesGovernment.offices.noMatches')}</div>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
              {t('servicesGovernment.offices.noMatchesHelp')}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setScope('All');
                }}
                className="brand-btn-secondary"
              >
                {t('servicesGovernment.offices.clear')}
              </button>
              <Link to="/services" className="brand-btn-primary">
                {t('servicesGovernment.offices.findService')}
              </Link>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
