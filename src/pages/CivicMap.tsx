import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bus,
  CircleDot,
  ExternalLink,
  MapPinned,
  MessagesSquare,
  Route,
  Search,
  ShieldCheck,
  Star,
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

interface FeedItem {
  kind: 'report' | 'proposal' | 'update' | 'reviews';
  state: 'open' | 'closed';
  meta?: { assetId?: string };
}

const typeOptions: Array<{ value: 'all' | CivicAssetType; label: string }> = [
  { value: 'all', label: 'All mapped assets' },
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

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return civicAssets.filter(asset => {
      const typeMatch = type === 'all' || asset.type === type;
      const localNames = (asset.barangay ?? '')
        .split('/')
        .map(value => value.trim().toLowerCase());
      const barangayMatch =
        !barangay || localNames.includes(barangay.name.toLowerCase());
      const text = [asset.title, asset.subtitle, asset.barangay, asset.tags.join(' ')]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return barangayMatch && typeMatch && (!needle || text.includes(needle));
    });
  }, [barangay, query, type]);

  const activeReports = feed.filter(item => item.kind === 'report' && item.state === 'open').length;
  const proposals = feed.filter(item => item.kind === 'proposal' && item.state === 'open').length;

  return (
    <>
      <SEO
        title="Civic Map"
        description="Independent BetterMakati map for rating public infrastructure, reporting non-emergency issues, suggesting improvements and following community discussion."
        keywords="Makati civic map, report pothole, sidewalk, park review, public infrastructure, citizen report, public transport, improvement proposal"
      />

      <Section className="bg-[#fffdf8]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="section-eyebrow">Civic Map · Pilot</div>
            <Heading>Help improve public places</Heading>
            <p className="mt-3 max-w-4xl text-lg leading-relaxed text-gray-700">
              Choose a mapped place to report a non-emergency problem, rate your experience or suggest an improvement. You can also check existing community reports.
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
          <a href="#places" className="brand-btn-primary">Choose a place <ArrowRight className="h-4 w-4" /></a>
          <a href="#how-it-works" className="brand-btn-secondary">How it works</a>
        </div>

        <LastReviewed
          date={civicMethodologyReviewed}
          note="Pilot methodology and seed assets. BetterMakati is independent and is not an official government reporting platform."
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

        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">{visible.length}</div>
            <div className="text-xs font-bold text-gray-600">{barangay ? 'mapped assets in scope' : 'pilot mapped assets'}</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">{feedState === 'ready' ? activeReports : '—'}</div>
            <div className="text-xs font-bold text-gray-600">open community cases</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">{feedState === 'ready' ? proposals : '—'}</div>
            <div className="text-xs font-bold text-gray-600">open improvement proposals</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">1 case</div>
            <div className="text-xs font-bold text-gray-600">per duplicate problem, not per reporter</div>
          </div>
        </div>
        {feedState !== 'ready' && <p role="status" className="mt-3 text-sm text-gray-600">
          {feedState === 'loading' ? 'Loading community counts…' : 'Community counts are unavailable. You can still browse places and open their reporting forms.'}
        </p>}
      </Section>

      <Section className="bg-[#f5f8f2]" id="places">
        <div className="section-eyebrow">Mapped assets</div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>Choose the exact place or segment</Heading>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              Long roads are split into block-level segments so reports stay local. Side-specific sidewalk data can be added when the condition differs across the street.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {barangay ? `${visible.length} mapped assets in Barangay ${barangay.name}` : `${visible.length} of ${civicAssets.length} pilot assets`}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_18rem]">
          <label className="relative block">
            <span className="sr-only">Search mapped assets</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search street, park, office or barangay"
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4"
            />
          </label>
          <label className="sr-only" htmlFor="civic-asset-type">Asset type</label>
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
                  <span className={asset.status === 'mapped' ? 'text-success-700' : 'text-secondary-800'}>
                    {asset.status === 'mapped' ? 'Mapped' : asset.status === 'pilot' ? 'Pilot segment' : 'Needs verification'}
                  </span>
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
            <p>No mapped place matches these filters.</p>
            <button type="button" onClick={() => { setQuery(''); setType('all'); }} className="brand-btn-secondary mt-3">Clear filters</button>
          </div>
        )}
        <p className="mt-6 text-sm text-gray-600">Place missing? <Link to="/get-involved?type=proposal&subject=Add%20a%20place%20to%20Civic%20Map#submission" className="font-bold text-primary-700 underline">Suggest a place to map</Link>. The directory currently covers {civicAssets.length} pilot locations.</p>
      </Section>

      <Section className="bg-white" id="how-it-works">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <CivicMapEmbed lat={14.5652} lng={121.0278} title="Makati Civic Map pilot" zoom={14} />

          <div>
            <div className="section-eyebrow">How it works</div>
            <Heading level={2}>Four kinds of civic contribution</Heading>
            <div className="mt-5 space-y-3">
              {[
                { icon: Star, title: 'Rate a place or route', text: 'Structured 1–5 assessment using criteria appropriate to the asset.' },
                { icon: Wrench, title: 'Report a problem', text: 'A broken, blocked, unsafe or malfunctioning condition becomes a consolidatable case.' },
                { icon: Trees, title: 'Suggest an improvement', text: 'More trees, a crosswalk, accessibility retrofit, route change or another specific improvement.' },
                { icon: MessagesSquare, title: 'Discuss & update', text: 'Confirm, add evidence, reply, raise trade-offs, or say that something appears resolved.' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                    <div>
                      <div className="font-extrabold text-gray-950">{item.title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
            <Route className="h-6 w-6 text-primary-700" />
            <h2 className="mt-3 text-xl font-extrabold text-gray-950">Report the right stretch of road</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Roads break at intersections and other meaningful boundaries. A case retains precise coordinates plus the permanent segment ID, and can identify the north, south, east or west sidewalk when needed.
            </p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
            <Bus className="h-6 w-6 text-primary-700" />
            <h2 className="mt-3 text-xl font-extrabold text-gray-950">Public transport coverage is expanding</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Jeepney and bus routes, individual stops, and tricycle/TODA terminals can each carry their own ratings, route corrections, fare/service reports and improvement proposals. Current route objects will only be published after their alignments and operating information are verified.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Noise reduction</div>
        <Heading level={2}>BetterMakati consolidates before it amplifies</Heading>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <CircleDot className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Duplicate-aware cases</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Similar open reports on the same asset and category are surfaced before a new case is created. People can confirm or update the existing case instead.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <ShieldCheck className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Evidence states</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              A submission starts as unverified community information. Corroboration, BetterMakati review, official acknowledgement and community-verified resolution are separate states.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <MessagesSquare className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Batch public-interest reporting</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Ordinary maintenance issues can be consolidated for a weekly digest; mature improvement proposals belong in a monthly planning brief rather than repetitive emails.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
