import { useEffect, useMemo, useState } from 'react';
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
import CivicMapEmbed from '../components/civic/CivicMapEmbed';
import { useBarangayScope, withBarangayScope } from '../hooks/useBarangayScope';
import {
  civicAssets,
  civicAssetTypeLabels,
  civicMethodologyReviewed,
  type CivicAssetType,
} from '../data/civicMap';
import { placeRegistryById, placesByBarangay } from '../data/placeRegistry';

interface FeedItem {
  kind: 'report' | 'proposal' | 'update';
  state: 'open' | 'closed';
  meta?: { assetId?: string };
}

const typeOptions: Array<{ value: 'all' | CivicAssetType; label: string }> = [
  { value: 'all', label: 'All places & segments' },
  { value: 'street-segment', label: 'Street segments' },
  { value: 'park', label: 'Parks' },
  { value: 'heritage-site', label: 'Heritage sites' },
  { value: 'public-office', label: 'Public offices' },
  { value: 'health-center', label: 'Health centers' },
  { value: 'transport-route', label: 'Transport routes' },
  { value: 'transport-stop', label: 'Stops / terminals' },
];

export default function CivicMap() {
  const [query, setQuery] = useState('');
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

  const verifiedAssetIds = useMemo(
    () =>
      new Set(
        civicAssets
          .filter(asset => placeRegistryById.get(asset.id)?.verification.status === 'verified')
          .map(asset => asset.id)
      ),
    []
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const localIds = barangay
      ? new Set(
          placesByBarangay(barangay.name)
            .filter(place => place.verification.status === 'verified')
            .map(place => place.id)
        )
      : null;

    return civicAssets.filter(asset => {
      if (!verifiedAssetIds.has(asset.id)) return false;
      if (localIds && !localIds.has(asset.id)) return false;

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
  }, [barangay, query, type, verifiedAssetIds]);

  const verifiedAssetCount = verifiedAssetIds.size;

  const activeReports = feed.filter(item => item.kind === 'report' && item.state === 'open').length;
  const proposals = feed.filter(item => item.kind === 'proposal' && item.state === 'open').length;

  return (
    <>
      <SEO
        title="Civic Map"
        description="Browse sourced public places, facilities, streets and transport locations in Makati, then open a place to report a problem or suggest an improvement."
        keywords="Makati civic map, public places, health center, public office, park, transport stop, report pothole, sidewalk, citizen report, improvement proposal"
      />

      <Section className="bg-[#fffdf8]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="section-eyebrow">Civic Map</div>
            <Heading>Find a place in Makati</Heading>
            <p className="mt-3 max-w-4xl text-lg leading-relaxed text-gray-700">
              Browse sourced public places, facilities, streets and transport locations. Open a place to check its details, see community cases, report a problem or suggest an improvement.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/civic-map/reports" className="brand-btn-secondary">
              {barangay ? 'Citywide reports' : 'Weekly & monthly reports'}
            </Link>
            <SharePage title="BetterMakati Civic Map" />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to={withBarangayScope('/civic-map/report', barangay?.slug)}
            className="brand-btn-primary"
          >
            Report something near me <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#places" className="brand-btn-secondary">Browse places</a>
        </div>

        <LastReviewed
          date={civicMethodologyReviewed}
          note="Place inventory and source review."
          className="mt-5"
        />

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
              <h2 className="font-extrabold text-error-950">Emergencies do not belong in the Civic Map queue</h2>
              <p className="mt-1 text-sm leading-relaxed text-error-900">
                Fire, crime or violence in progress, medical emergencies, serious collisions, immediate electrical or structural danger, and flooding that puts people in immediate danger should go directly to Unified 911.
              </p>
              <a href="tel:911" className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-error-700 px-4 py-2 font-extrabold text-white">
                Call 911
              </a>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">{barangay ? visible.length : verifiedAssetCount}</div>
            <div className="text-xs font-bold text-gray-600">{barangay ? 'verified places in scope' : 'verified places & segments'}</div>
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
          {feedState === 'loading' ? 'Loading community counts…' : 'Community counts are unavailable. You can still browse places and open their reporting forms.'}
        </p>}
      </Section>

      <Section className="bg-[#f5f8f2]" id="places">
        <div className="section-eyebrow">Places</div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>Browse the place inventory</Heading>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              Search by place, facility, street, transport location or barangay.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {barangay ? `${visible.length} verified places in Barangay ${barangay.name}` : `${visible.length} of ${verifiedAssetCount} verified places`}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_18rem]">
          <label className="relative block">
            <span className="sr-only">Search places</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search street, park, office or barangay"
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4"
            />
          </label>
          <label className="sr-only" htmlFor="civic-asset-type">Place type</label>
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
            const records = feed.filter(item => item.meta?.assetId === asset.id);
            return (
              <Link
                key={asset.id}
                to={withBarangayScope('/civic-map/' + asset.id, barangay?.slug)}
                className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                    {civicAssetTypeLabels[asset.type]}
                  </span>
                  <span className="text-success-700">Verified</span>
                  {asset.accessClass === 'public-access-private-managed' && (
                    <span className="rounded-full bg-secondary-50 px-2.5 py-1 text-secondary-900">
                      Public access · privately managed
                    </span>
                  )}
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
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            <p>No verified place matches these filters.</p>
            <button type="button" onClick={() => { setQuery(''); setType('all'); }} className="brand-btn-secondary mt-3">Clear filters</button>
          </div>
        )}
        <p className="mt-6 text-sm text-gray-600">Place missing? <Link to="/get-involved?type=proposal&subject=Add%20a%20place%20to%20Civic%20Map#submission" className="font-bold text-primary-700 underline">Help document it</Link>.</p>
      </Section>

      <Section className="bg-white" id="what-you-can-do">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <CivicMapEmbed lat={14.5652} lng={121.0278} title="Makati Civic Map" zoom={14} />

          <div>
            <div className="section-eyebrow">From a place</div>
            <Heading level={2}>What you can do</Heading>
            <div className="mt-5 space-y-3">
              <a
                href="#places"
                className="flex gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 transition hover:border-primary-300"
              >
                <Search className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="font-extrabold text-gray-950">Find a place</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Look up a park, public facility, street segment or transport location.
                  </p>
                </div>
              </a>

              <Link
                to={withBarangayScope('/civic-map/report', barangay?.slug)}
                className="flex gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 transition hover:border-primary-300"
              >
                <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="font-extrabold text-gray-950">Report something near me</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Use your location or search for the affected place, then report the problem.
                  </p>
                </div>
              </Link>

              <a
                href="#places"
                className="flex gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 transition hover:border-primary-300"
              >
                <Trees className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="font-extrabold text-gray-950">Suggest an improvement</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Choose the place first, then propose a specific change.
                  </p>
                </div>
              </a>

              <Link
                to="/get-involved?type=proposal&subject=Add%20a%20place%20to%20Civic%20Map#submission"
                className="flex gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 transition hover:border-primary-300"
              >
                <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="font-extrabold text-gray-950">Help document Makati</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Send a missing place, correction or source that should be added to the inventory.
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
