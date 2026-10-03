import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MapPinned,
  Route,
  Search,
  Trees,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import CivicAreaContextMap from '../components/civic/CivicAreaContextMap';
import NearMePlaces from '../components/civic/NearMePlaces';
import { useBarangayScope, withBarangayScope } from '../hooks/useBarangayScope';
import {
  civicAssets,
  civicAssetTypeLabels,
  civicMethodologyReviewed,
  type CivicAssetType,
} from '../data/civicMap';
import {
  civicEntityKindForCategory,
  civicEntityKindLabels,
  placeRegistryById,
  placesByBarangay,
  type CivicEntityKind,
} from '../data/placeRegistry';

interface FeedItem {
  kind: 'report' | 'proposal' | 'update';
  state: 'open' | 'closed';
  meta?: {
    entityId?: string | null;
    placeId?: string | null;
    assetId?: string;
  };
}

const typeOptionsByEntityKind: Record<
  CivicEntityKind,
  Array<{ value: 'all' | CivicAssetType; label: string }>
> = {
  place: [
    { value: 'all', label: 'All places' },
    { value: 'park', label: 'Parks' },
    { value: 'heritage-site', label: 'Heritage sites' },
    { value: 'public-office', label: 'Public offices' },
    { value: 'health-center', label: 'Health centers' },
    { value: 'community-center', label: 'Community centers' },
    { value: 'public-market', label: 'Markets' },
    { value: 'transport-stop', label: 'Stops' },
    { value: 'transport-terminal', label: 'Terminals' },
  ],
  segment: [
    { value: 'all', label: 'All segments' },
    { value: 'street-segment', label: 'Street segments' },
    { value: 'sidewalk-segment', label: 'Sidewalk segments' },
    { value: 'crossing', label: 'Crossings' },
    { value: 'bike-lane', label: 'Bike lanes' },
    { value: 'bridge', label: 'Bridges' },
    { value: 'drainage', label: 'Drainage segments' },
  ],
  route: [
    { value: 'all', label: 'All routes' },
    { value: 'transport-route', label: 'Transport routes' },
  ],
};

export default function CivicMap() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [entityKind, setEntityKind] = useState<CivicEntityKind>('place');
  const [type, setType] = useState<'all' | CivicAssetType>('all');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [feedState, setFeedState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const { barangay } = useBarangayScope();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/civic', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.items)) throw new Error('Feed unavailable');
        setFeed(data.items);
        setFeedState('ready');
      } catch {
        setFeedState('failed');
      }
    };
    void load();
  }, []);

  const browsableAssetIds = useMemo(
    () =>
      new Set(
        civicAssets
          .filter(asset => {
            const record = placeRegistryById.get(asset.id);
            if (!record) return false;
            if (record.entityKind === 'place') {
              return record.verification.status === 'verified';
            }
            return record.verification.status !== 'needs-verification';
          })
          .map(asset => asset.id)
      ),
    []
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const localIds = barangay
      ? new Set(
          placesByBarangay(barangay.name)
            .filter(record =>
              record.entityKind === 'place'
                ? record.verification.status === 'verified'
                : record.verification.status !== 'needs-verification'
            )
            .map(record => record.id)
        )
      : null;

    return civicAssets.filter(asset => {
      if (!browsableAssetIds.has(asset.id)) return false;
      if (localIds && !localIds.has(asset.id)) return false;
      if (civicEntityKindForCategory(asset.type) !== entityKind) return false;

      const typeMatch = type === 'all' || asset.type === type;
      const text = [
        asset.title,
        asset.subtitle,
        asset.barangay,
        (asset.aliases ?? []).join(' '),
        (asset.servicesAtLocation ?? []).join(' '),
        asset.tags.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return typeMatch && (!needle || text.includes(needle));
    });
  }, [barangay, query, type, entityKind, browsableAssetIds]);

  const browsableCount = browsableAssetIds.size;
  const typeOptions = typeOptionsByEntityKind[entityKind];

  const activeReports = feed.filter(item => item.kind === 'report' && item.state === 'open').length;
  const proposals = feed.filter(item => item.kind === 'proposal' && item.state === 'open').length;

  return (
    <>
      <SEO
        title={t('corePages.civicMap.seoTitle')}
        description={t('corePages.civicMap.seoDescription')}
        keywords="Makati civic map, public places, health center, public office, park, transport stop, report pothole, sidewalk, citizen report, improvement proposal"
      />

      <section className="border-b border-primary-900 bg-primary-800 text-white">
        <div className="container px-5 py-12 md:px-6 md:py-16 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-200 md:text-sm">
              {t('corePages.civicMap.eyebrow')}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              {t('corePages.civicMap.title')}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-primary-50 md:text-xl">
              {t('corePages.civicMap.intro')}
            </p>

            <label className="relative mt-7 block max-w-3xl">
              <span className="sr-only">{t('corePages.civicMap.search')}</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={t('corePages.civicMap.placeholder')}
                className="w-full rounded-xl border border-white/30 bg-white py-3.5 pl-12 pr-4 text-base text-gray-950 shadow-sm outline-none placeholder:text-gray-500 focus:border-secondary-400 focus:ring-2 focus:ring-secondary-300/40"
              />
            </label>

            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={t('corePages.civicMap.recordType')}>
              {(['place', 'segment', 'route'] as CivicEntityKind[]).map(kind => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => {
                    setEntityKind(kind);
                    setType('all');
                  }}
                  className={
                    entityKind === kind
                      ? 'min-h-11 rounded-full bg-secondary-500 px-4 py-2 text-sm font-bold text-primary-900'
                      : 'min-h-11 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-white/60 hover:bg-white/15'
                  }
                  aria-pressed={entityKind === kind}
                >
                  {kind === 'place' ? t('corePages.civicMap.places') : kind === 'segment' ? t('corePages.civicMap.segments') : t('corePages.civicMap.routes')}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={withBarangayScope('/civic-map/report', barangay?.slug)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary-800 transition hover:bg-primary-50"
              >
                {t('corePages.civicMap.report')} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#places"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/60 px-4 py-2.5 text-sm font-bold text-white transition hover:border-secondary-400 hover:text-secondary-300"
              >
                {t('corePages.civicMap.browse')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-[#fffdf8]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <LastReviewed
            date={civicMethodologyReviewed}
            note={t('corePages.civicMap.review')}
            className="mt-0"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/civic-map/reports" className="brand-btn-secondary">
              {barangay ? t('corePages.civicMap.citywide') : t('corePages.civicMap.reports')}
            </Link>
            <SharePage title={t('corePages.civicMap.share')} />
          </div>
        </div>

        <NearMePlaces
          className="mt-5"
          title={t('corePages.civicMap.nearTitle')}
          description={t('corePages.civicMap.nearDescription')}
          linkForPlace={placeId =>
            withBarangayScope('/civic-map/' + placeId, barangay?.slug)
          }
        />

        <Link
          to="/civic-map/audits/park-accessibility-2026"
          className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-primary-200 bg-primary-50 p-5 transition hover:border-primary-300"
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              Civic audit pilot
            </div>
            <div className="mt-1 font-extrabold text-gray-950">
              Public park accessibility check
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Record entrance access, step-free access, seating and toilets across 13 public parks.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-primary-700" />
        </Link>

        <div className="mt-5 rounded-2xl border border-primary-100 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            National infrastructure
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold">
            <a
              href="https://bisto.ph/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
            >
              Bisto.ph infrastructure reports <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://bettergov.ph/flood-control-projects"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
            >
              Flood-control project browser <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border-2 border-error-200 bg-error-50 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-error-700" />
            <div>
              <h2 className="font-extrabold text-error-950">{t('corePages.civicMap.emergency')}</h2>
              <p className="mt-1 text-sm leading-relaxed text-error-900">
                {t('corePages.civicMap.emergencyText')}
              </p>
              <a href="tel:911" className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-error-700 px-4 py-2 font-extrabold text-white">
                {t('corePages.civicMap.call')}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">{barangay ? visible.length : browsableCount}</div>
            <div className="text-xs font-bold text-gray-600">{barangay ? 'records in scope' : 'browsable civic records'}</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">{feedState === 'ready' ? activeReports : '—'}</div>
            <div className="text-xs font-bold text-gray-600">open community cases</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">{feedState === 'ready' ? proposals : '—'}</div>
            <div className="text-xs font-bold text-gray-600">open improvement proposals</div>
          </div>
        </div>
        {feedState !== 'ready' && <p role="status" className="mt-3 text-sm text-gray-600">
          {feedState === 'loading' ? t('corePages.civicMap.loading') : t('corePages.civicMap.unavailable')}
        </p>}
      </Section>

      <Section className="bg-[#f5f8f2]" id="places">
        <div className="section-eyebrow">{t('corePages.civicMap.registry')}</div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>Browse {civicEntityKindLabels[entityKind].toLowerCase()} records</Heading>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              {entityKind === 'place'
                ? 'Destination-like sites such as parks, facilities, offices, stops and terminals.'
                : entityKind === 'segment'
                  ? 'Bounded infrastructure records such as street, sidewalk, crossing and drainage segments.'
                  : 'Network or service routes, kept separate from physical destinations.'}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {barangay ? `${visible.length} in Barangay ${barangay.name}` : `${visible.length} ${t('corePages.civicMap.shown')}`}
          </div>
        </div>

        <div className="mt-5 max-w-sm">
          <label className="sr-only" htmlFor="civic-asset-type">{t('corePages.civicMap.subtype')}</label>
          <select
            id="civic-asset-type"
            value={type}
            onChange={event => setType(event.target.value as 'all' | CivicAssetType)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3"
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map(asset => {
            const records = feed.filter(item =>
              item.meta?.entityId === asset.id ||
              item.meta?.placeId === asset.id ||
              item.meta?.assetId === asset.id
            );
            return (
              <Link
                key={asset.id}
                to={withBarangayScope('/civic-map/' + asset.id, barangay?.slug)}
                className={
                  entityKind === 'place'
                    ? 'rounded-2xl border border-primary-100 border-t-4 border-t-secondary-400 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm'
                    : entityKind === 'segment'
                      ? 'rounded-xl border border-primary-200 bg-primary-50/60 p-5 transition hover:border-primary-400 hover:bg-primary-50'
                      : 'rounded-2xl border border-dashed border-secondary-300 bg-[#fffdf8] p-5 transition hover:border-secondary-500 hover:shadow-sm'
                }
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                    {civicAssetTypeLabels[asset.type]}
                  </span>
                  <span className={
                    placeRegistryById.get(asset.id)?.verification.status === 'verified'
                      ? 'text-success-700'
                      : 'text-secondary-800'
                  }>
                    {placeRegistryById.get(asset.id)?.verification.status === 'verified'
                      ? t('corePages.civicMap.verified')
                      : entityKind === 'segment'
                        ? t('corePages.civicMap.draft')
                        : t('corePages.civicMap.provisional')}
                  </span>
                  {entityKind === 'place' && asset.accessClass === 'public-access-private-managed' && (
                    <span className="rounded-full bg-secondary-50 px-2.5 py-1 text-secondary-900">
                      Public access · privately managed
                    </span>
                  )}
                </div>
                <div className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-gray-500">
                  {entityKind === 'place'
                    ? t('corePages.civicMap.destination')
                    : entityKind === 'segment'
                      ? t('corePages.civicMap.bounded')
                      : t('corePages.civicMap.network')}
                </div>
                <h3 className="mt-3 text-lg font-extrabold text-gray-950">{asset.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{asset.subtitle}</p>
                {asset.from && asset.to && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-600">
                    <Route className="h-4 w-4 text-primary-700" />
                    {asset.from} ↔ {asset.to}
                  </div>
                )}
                {asset.barangay && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <MapPinned className="h-4 w-4" /> {asset.barangay}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                  <span className="text-gray-500">{feedState === 'ready' ? `${records.length} community record${records.length === 1 ? '' : 's'}` : 'Records loading or unavailable'}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-primary-700">
                    {t('corePages.civicMap.open')} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            <p>No {entityKind} record matches these filters.</p>
            <button type="button" onClick={() => { setQuery(''); setType('all'); }} className="brand-btn-secondary mt-3">{t('corePages.civicMap.clear')}</button>
          </div>
        )}
        <p className="mt-6 text-sm text-gray-600">{t('corePages.civicMap.missing')} <Link to="/get-involved?type=proposal&subject=Add%20a%20civic%20record%20to%20Civic%20Map#submission" className="font-bold text-primary-700 underline">{t('corePages.civicMap.document')}</Link>.</p>
      </Section>

      <Section className="bg-white" id="what-you-can-do">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <CivicAreaContextMap />

          <div>
            <div className="section-eyebrow">{t('corePages.civicMap.fromRegistry')}</div>
            <Heading level={2}>{t('corePages.civicMap.canDo')}</Heading>
            <div className="mt-5 space-y-3">
              <a
                href="#places"
                className="flex gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 transition hover:border-primary-300"
              >
                <Search className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="font-extrabold text-gray-950">{t('corePages.civicMap.find')}</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {t('corePages.civicMap.findText')}
                  </p>
                </div>
              </a>

              <Link
                to={withBarangayScope('/civic-map/report', barangay?.slug)}
                className="flex gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 transition hover:border-primary-300"
              >
                <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="font-extrabold text-gray-950">{t('corePages.civicMap.reportNear')}</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {t('corePages.civicMap.reportNearText')}
                  </p>
                </div>
              </Link>

              <a
                href="#places"
                className="flex gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 transition hover:border-primary-300"
              >
                <Trees className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="font-extrabold text-gray-950">{t('corePages.civicMap.suggest')}</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {t('corePages.civicMap.suggestText')}
                  </p>
                </div>
              </a>

              <Link
                to="/get-involved?type=proposal&subject=Add%20a%20place%20to%20Civic%20Map#submission"
                className="flex gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 transition hover:border-primary-300"
              >
                <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="font-extrabold text-gray-950">{t('corePages.civicMap.help')}</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {t('corePages.civicMap.helpText')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Section>

    </>
  );
}
