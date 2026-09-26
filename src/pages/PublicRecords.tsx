import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Database,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  Search,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import {
  publicRecordCategories,
  publicRecordOfficialCount,
  publicRecords,
  publicRecordsReviewed,
  publicRecordSecondaryCount,
  type PublicRecordSourceClass,
} from '../data/publicRecords';
import { integrityForPublicRecord } from '../data/integrityCivicRelationships';
import {
  legislationRecordDisplay,
  legislationRecordHref,
  loadLegislationBrowserIndex,
  matchLegislationRecords,
  type BrowserLegislationIndex,
} from '../data/legislationBrowserIndex';

interface WatchedSource {
  id: string;
  label: string;
  url: string;
  kind?: string;
  cadence: 'daily' | 'weekly' | 'monthly';
  monitoringMode: 'content-hash' | 'reachability';
  owner?: 'general-source-freshness' | 'city-monitor';
  delegated?: boolean;
}

interface SourceWatchStateSource extends WatchedSource {
  status: 'ok' | 'http-error' | 'unreachable' | 'not-checked';
  statusCode?: number | null;
  change: 'reachable' | 'unchanged' | 'content-changed' | 'new-baseline' | 'check-failed' | 'not-checked';
  lastCheckedAt?: string | null;
  lastSuccessfulAt?: string | null;
  lastChangedAt?: string | null;
}

interface SourceWatchState {
  checkedAt?: string | null;
  cadence?: string | null;
  summary?: {
    checked: number;
    ok: number;
    failed: number;
    changed: number;
    newBaselines: number;
    reachabilityOnly?: number;
  };
  sources?: SourceWatchStateSource[];
}

interface FreshnessReviewItem {
  key: string;
  status: 'open' | 'resolved';
  system: 'general-source-freshness' | 'city-monitor';
  signal: 'content-changed' | 'check-failed' | 'manual-review';
  signalLabel: string;
  sourceId: string;
  label: string;
  url: string;
  affectedPages: string[];
  firstDetectedAt?: string | null;
  latestDetectedAt?: string | null;
  detections: number;
  lastCheckedAt?: string | null;
  lastSuccessfulAt?: string | null;
  action: string;
}

interface FreshnessReviewQueue {
  generatedAt?: string | null;
  summary: {
    open: number;
    contentChanged: number;
    failed: number;
    manualReview: number;
    affectedPages: number;
  };
  items: FreshnessReviewItem[];
}

const sourceClassOptions: Array<'All' | PublicRecordSourceClass> = [
  'All',
  'City government',
  'National government',
  'Court / statute',
  'Public institution',
  'Research / institutional',
  'Media / secondary',
];

const catalogCsv = [
  'id,title,category,publisher,source_class,official,format,period,url,related_bettermakati_page,used_by',
  ...publicRecords.map(record =>
    [
      record.id,
      record.title,
      record.category,
      record.publisher,
      record.sourceClass,
      record.official ? 'yes' : 'no',
      record.format,
      record.period ?? '',
      record.url,
      record.relatedHref ?? '',
      record.usedBy.join(' | '),
    ]
      .map(value => '"' + String(value).replaceAll('"', '""') + '"')
      .join(',')
  ),
].join('\n');

export default function PublicRecords() {
  const [watchedSources, setWatchedSources] = useState<WatchedSource[]>([]);
  const [watchState, setWatchState] = useState<SourceWatchState>({});
  const [reviewQueue, setReviewQueue] = useState<FreshnessReviewQueue>({
    summary: { open: 0, contentChanged: 0, failed: 0, manualReview: 0, affectedPages: 0 },
    items: [],
  });
  const [reviewQueueFailed, setReviewQueueFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sourceClass, setSourceClass] = useState<'All' | PublicRecordSourceClass>('All');
  const [officialOnly, setOfficialOnly] = useState(false);
  const [legislationIndex, setLegislationIndex] =
    useState<BrowserLegislationIndex | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [indexResponse, stateResponse] = await Promise.all([
          fetch('/source-watch-index.json', { cache: 'no-store' }),
          fetch('/source-watch-state.json', { cache: 'no-store' }),
        ]);
        const index = await indexResponse.json();
        const state = await stateResponse.json();
        if (indexResponse.ok && Array.isArray(index)) {
          setWatchedSources(index);
        }
        if (stateResponse.ok && Array.isArray(state.sources)) {
          setWatchState(state);
        }
      } catch {
        setWatchedSources([]);
        setWatchState({});
      }

      try {
        const response = await fetch('/freshness-review-queue.json', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.items) || !data.summary) {
          throw new Error('review queue');
        }
        setReviewQueue(data);
      } catch {
        setReviewQueueFailed(true);
      }
    };
    void load();
  }, []);

  const openReviewItems = reviewQueue.items.filter(item => item.status === 'open');
  const watchedSourceByUrl = useMemo(
    () => new Map(watchedSources.map(source => [source.url, source])),
    [watchedSources]
  );
  const watchStateByUrl = useMemo(
    () => new Map((watchState.sources ?? []).map(source => [source.url, source])),
    [watchState.sources]
  );
  const watchedUrls = useMemo(
    () => new Set(watchedSourceByUrl.keys()),
    [watchedSourceByUrl]
  );

  const watchStatusLabel = (url: string) => {
    const watched = watchedSourceByUrl.get(url);
    if (watched?.owner === 'city-monitor') return 'Monitored by City Monitor';
    const state = watchStateByUrl.get(url);
    if (!state || state.status === 'not-checked') return 'Awaiting first scheduled check';
    if (state.status !== 'ok') {
      return 'Latest check failed' + (state.statusCode ? ' (' + state.statusCode + ')' : '');
    }
    if (!state.lastCheckedAt) return 'Reachable';
    return 'Last published check ' + new Date(state.lastCheckedAt).toLocaleString('en-PH');
  };

  const visibleRecords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return publicRecords.filter(record => {
      const categoryMatch = category === 'All' || record.category === category;
      const classMatch = sourceClass === 'All' || record.sourceClass === sourceClass;
      const officialMatch = !officialOnly || record.official;
      const queryMatch =
        !needle ||
        [
          record.title,
          record.publisher,
          record.category,
          record.sourceClass,
          record.period,
          record.description,
          ...record.usedBy,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(needle);
      return categoryMatch && classMatch && officialMatch && queryMatch;
    });
  }, [category, officialOnly, query, sourceClass]);

  const shouldSearchLegislation =
    query.trim().length >= 3 &&
    (category === 'All' || category === 'Legislation & law') &&
    (sourceClass === 'All' || sourceClass === 'City government');

  useEffect(() => {
    if (!shouldSearchLegislation || legislationIndex) return;

    let cancelled = false;
    loadLegislationBrowserIndex()
      .then(index => {
        if (!cancelled) setLegislationIndex(index);
      })
      .catch(() => {
        // Source catalog remains usable if the legislation entity index cannot load.
      });

    return () => {
      cancelled = true;
    };
  }, [legislationIndex, shouldSearchLegislation]);

  const legislationResultSet = useMemo(() => {
    if (!shouldSearchLegislation || !legislationIndex) {
      return { total: 0, visible: [] };
    }
    return matchLegislationRecords(legislationIndex, query, { limit: 8 });
  }, [legislationIndex, query, shouldSearchLegislation]);

  const watchedCatalogCount = publicRecords.filter(record =>
    watchedUrls.has(record.url)
  ).length;

  return (
    <>
      <SEO
        title="Public Records"
        description="Search the source documents, datasets, public portals and evidence used across BetterMakati."
      />

      <section className="border-b border-primary-900 bg-primary-800 text-white">
        <div className="container px-5 py-12 md:px-6 md:py-16 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-400 md:text-sm">
              Records &amp; data
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Find the source.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-primary-50 md:text-xl">
              Search the documents, datasets and public portals used across BetterMakati.
            </p>

            <label className="relative mt-7 block max-w-3xl">
              <span className="sr-only">Search public records</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search budget, ordinance, COA, COMELEC, Citizen’s Charter…"
                className="w-full rounded-xl border border-white/30 bg-white py-3.5 pl-12 pr-4 text-base text-gray-950 shadow-sm outline-none placeholder:text-gray-500 focus:border-secondary-400 focus:ring-2 focus:ring-secondary-300/40"
              />
            </label>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-50">
              <span className="font-medium text-primary-100">Start with:</span>
              <button type="button" onClick={() => setQuery('budget')} className="min-h-11 font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300">
                Budget
              </button>
              <button type="button" onClick={() => setQuery('ordinance')} className="min-h-11 font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300">
                Ordinances
              </button>
              <button type="button" onClick={() => setQuery('procurement')} className="min-h-11 font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300">
                Procurement
              </button>
              <button type="button" onClick={() => setQuery('election')} className="min-h-11 font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300">
                Election records
              </button>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-[#fffdf8]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <LastReviewed
            date={publicRecordsReviewed}
            note="For legal or transactional use, rely on the issuing public body’s original record."
            className="mt-0"
          />
          <SharePage title="Makati Public Records | BetterMakati" />
        </div>

        <div className="mt-5 rounded-2xl border border-primary-100 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            National record tools
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold">
            <a
              href="https://transparency.bettergov.ph/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
            >
              Transparency Portal <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://transparency.bettergov.ph/procurement"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
            >
              PhilGEPS Browser <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://saln.bettergov.ph/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
            >
              SALN Tracker <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://juris.ph/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary-700 underline underline-offset-2"
            >
              Juris <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">{publicRecords.length}</div>
            <div className="mt-1 text-sm text-gray-600">unique source URLs indexed</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">{publicRecordOfficialCount}</div>
            <div className="mt-1 text-sm text-gray-600">official / public-body sources</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">{publicRecordSecondaryCount}</div>
            <div className="mt-1 text-sm text-gray-600">contextual / secondary sources</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">{watchedSources.length || '—'}</div>
            <div className="mt-1 text-sm text-gray-600">sources in the published watchlist</div>
          </div>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Evidence index</div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>Search the public record catalog</Heading>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
              Search by document, publisher, topic, period or the BetterMakati page that uses the source.
            </p>
          </div>
          <a
            href={'data:text/csv;charset=utf-8,' + encodeURIComponent(catalogCsv)}
            download="bettermakati-public-records.csv"
            className="brand-btn-secondary"
          >
            <Download className="h-4 w-4" /> Download catalog CSV
          </a>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[repeat(2,minmax(0,1fr))_auto]">
          <select
            value={category}
            onChange={event => setCategory(event.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
            aria-label="Filter records by category"
          >
            <option value="All">All record areas</option>
            {publicRecordCategories.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={sourceClass}
            onChange={event =>
              setSourceClass(event.target.value as 'All' | PublicRecordSourceClass)
            }
            className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
            aria-label="Filter records by source class"
          >
            {sourceClassOptions.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={officialOnly}
              onChange={event => setOfficialOnly(event.target.checked)}
            />
            Official only
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-gray-600">
            <strong className="text-gray-950">{visibleRecords.length}</strong> matching sources
            {watchedSources.length > 0 && (
              <>
                {' '}· <strong className="text-gray-950">{watchedCatalogCount}</strong> catalog sources currently in the published watchlist
              </>
            )}
          </div>
          {(query || category !== 'All' || sourceClass !== 'All' || officialOnly) && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('All');
                setSourceClass('All');
                setOfficialOnly(false);
              }}
              className="font-bold text-primary-700 underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>

        {legislationResultSet.visible.length > 0 && (
          <div className="mt-5 rounded-2xl border border-primary-200 bg-white p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  Legislation records
                </div>
                <h3 className="mt-1 text-lg font-extrabold text-gray-950">
                  {legislationResultSet.total.toLocaleString()} matching local measures
                </h3>
              </div>
              <Link to="/legislation" className="text-sm font-bold text-primary-700 underline underline-offset-2">
                Search all legislation
              </Link>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {legislationResultSet.visible.map(record => (
                <Link
                  key={legislationRecordHref(record)}
                  to={legislationRecordHref(record)}
                  className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4 hover:border-primary-300"
                >
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    {record[1]} · {record[2]}{record[3] ? ' · ' + record[3] : ''}
                  </div>
                  <div className="mt-2 font-extrabold text-primary-800">
                    {legislationRecordDisplay(record)}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-700">
                    {record[4]}
                  </p>
                </Link>
              ))}
            </div>

            {legislationResultSet.total > legislationResultSet.visible.length && (
              <p className="mt-4 text-xs text-gray-500">
                Showing the first {legislationResultSet.visible.length} matches. Open Legislation for the full result set.
              </p>
            )}
          </div>
        )}

        <div className="mt-5 space-y-3">
          {visibleRecords.map(record => {
            const integrityLinks = integrityForPublicRecord(record.id);
            return (
            <article key={record.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">{record.category}</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">{record.sourceClass}</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">{record.format}</span>
                    {watchedUrls.has(record.url) && (
                      <span className="rounded-full bg-success-50 px-2.5 py-1 text-success-800">
                        Monitored · {watchedSourceByUrl.get(record.url)?.cadence}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-extrabold leading-snug text-gray-950">{record.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-gray-600">
                    {record.publisher}{record.period ? ' · ' + record.period : ''}
                  </p>
                  <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">{record.description}</p>

                  {record.usedBy.length > 0 && (
                    <div className="mt-3 text-xs text-gray-500">Used by BetterMakati: {record.usedBy.join(' · ')}</div>
                  )}
                  {watchedUrls.has(record.url) && (
                    <div className="mt-2 text-xs leading-relaxed text-gray-500">
                      Freshness: {watchStatusLabel(record.url)} ·{' '}
                      {watchedSourceByUrl.get(record.url)?.monitoringMode === 'content-hash'
                        ? 'stable-document content check'
                        : 'reachability check only'}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {record.relatedHref && (
                    <Link to={record.relatedHref} className="brand-btn-secondary">See context</Link>
                  )}
                  {integrityLinks.length > 0 && (
                    <Link
                      to={integrityLinks[0]?.node?.href ?? '/integrity'}
                      className="brand-btn-secondary"
                    >
                      Integrity evidence
                    </Link>
                  )}
                  <a href={record.url} target="_blank" rel="noreferrer" className="brand-btn-primary">
                    Open source <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
            );
          })}

          {visibleRecords.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <FileSearch className="mx-auto h-6 w-6 text-gray-400" />
              <div className="mt-3 font-extrabold text-gray-950">No matching source</div>
              <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
                Remove a filter or share a public source that should be indexed.
              </p>
              <Link to="/get-involved?type=source#submission" className="brand-btn-primary mt-4">
                Share a public source
              </Link>
            </div>
          )}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Freshness</div>
        <Heading level={2}>Source freshness monitor</Heading>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
          BetterMakati checks public sources on daily, weekly or monthly cadences. Stable documents can be content-hashed; dynamic portals are normally checked only for reachability so changing page shells are not mistaken for substantive updates.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold text-gray-950">{watchedSources.length || '—'}</div>
            <div className="text-sm text-gray-600">sources configured</div>
          </div>
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold text-gray-950">
              {(watchState.sources ?? []).filter(source => source.status === 'ok').length || '—'}
            </div>
            <div className="text-sm text-gray-600">latest source-specific checks successful</div>
          </div>
          <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-4">
            <div className="text-2xl font-extrabold text-gray-950">{reviewQueue.summary.contentChanged}</div>
            <div className="text-sm text-gray-600">content changes awaiting review</div>
          </div>
          <div className="rounded-xl border border-error-200 bg-error-50 p-4">
            <div className="text-2xl font-extrabold text-gray-950">
              {reviewQueue.summary.failed}
            </div>
            <div className="text-sm text-gray-600">failed checks awaiting review</div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
          <div className="grid gap-4 md:grid-cols-3">
            {(['daily', 'weekly', 'monthly'] as const).map(cadence => (
              <div key={cadence}>
                <div className="text-2xl font-extrabold text-gray-950">
                  {watchedSources.filter(source => source.cadence === cadence).length}
                </div>
                <div className="text-sm font-bold capitalize text-gray-800">{cadence}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {cadence === 'daily'
                    ? 'Fast-moving civic, procurement and election sources.'
                    : cadence === 'weekly'
                      ? 'Service, mobility, participation and reference sources.'
                      : 'Fiscal, statistical, audit and foundational sources.'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-primary-100 pt-4 text-xs leading-relaxed text-gray-600">
            {watchState.checkedAt
              ? 'Latest published check: ' + new Date(watchState.checkedAt).toLocaleString('en-PH') + ' · ' + (watchState.cadence || 'all') + ' cadence.'
              : 'Automation is configured; the first publishable freshness state has not yet been released.'}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/source-watch-state.json" download className="brand-btn-secondary">
            <Database className="h-4 w-4" /> Current source state
          </a>
          <a href="/source-watch-index.json" download className="brand-btn-secondary">
            <Database className="h-4 w-4" /> Monitored-source index
          </a>
          <a href="/freshness-history.json" download className="brand-btn-secondary">
            <Download className="h-4 w-4" /> Freshness history
          </a>
          <a href="/page-freshness-state.json" download className="brand-btn-secondary">
            <Database className="h-4 w-4" /> Page freshness
          </a>
        </div>

        <div id="freshness-review-queue" className="mt-6 rounded-2xl border border-primary-100 bg-[#fffdf8] p-6 scroll-mt-24">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">Editorial review</div>
              <h3 className="mt-1 text-xl font-extrabold text-gray-950">Freshness review queue</h3>
            </div>
            <div className="text-sm font-bold text-primary-800">
              {reviewQueue.summary.open} open item{reviewQueue.summary.open === 1 ? '' : 's'} · {reviewQueue.summary.affectedPages} affected page{reviewQueue.summary.affectedPages === 1 ? '' : 's'}
            </div>
          </div>

          {reviewQueue.generatedAt && (
            <div className="mt-2 text-xs text-gray-500">
              Published source state {new Date(reviewQueue.generatedAt).toLocaleString('en-PH')}
            </div>
          )}

          {reviewQueueFailed ? (
            <div className="mt-5 rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-error-900">
              The published freshness review queue is unavailable.
            </div>
          ) : openReviewItems.length > 0 ? (
            <div className="mt-5 space-y-4">
              {openReviewItems.map(item => (
                <article key={item.key} className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2 text-xs font-bold">
                        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">{item.signalLabel}</span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
                          {item.system === 'city-monitor' ? 'City Monitor' : 'Source freshness'}
                        </span>
                      </div>
                      <h4 className="mt-3 text-lg font-extrabold text-gray-950">{item.label}</h4>
                    </div>
                    <a href={item.url} target="_blank" rel="noreferrer" className="brand-btn-secondary">
                      Open source <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.affectedPages.map(page => (
                      <Link key={page} to={page} className="rounded-full bg-[#f5f8f2] px-3 py-1.5 text-xs font-bold text-primary-800">
                        {page}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
                    <div>
                      Last successful check: <strong className="text-gray-800">{item.lastSuccessfulAt ? new Date(item.lastSuccessfulAt).toLocaleString('en-PH') : 'None recorded'}</strong>
                    </div>
                    <div>
                      Last checked: <strong className="text-gray-800">{item.lastCheckedAt ? new Date(item.lastCheckedAt).toLocaleString('en-PH') : 'None recorded'}</strong>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-[#fffdf8] p-3 text-sm leading-relaxed text-gray-700">
                    <strong>Action:</strong> {item.action}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
              No open freshness review item.
            </div>
          )}

          <div className="mt-5">
            <a href="/freshness-review-queue.json" download className="brand-btn-secondary">
              <Download className="h-4 w-4" /> Download review queue
            </a>
          </div>
        </div>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="grid gap-4 lg:grid-cols-3">
          <Link to="/projects-budget" className="rounded-2xl border border-primary-100 bg-white p-6">
            <FileText className="h-5 w-5 text-primary-700" />
            <h2 className="mt-3 text-lg font-extrabold text-gray-950">Projects & Budget</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Read the fiscal story, searchable 2026 budget lines, procurement and audit follow-through.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Open <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link to="/accountability" className="rounded-2xl border border-primary-100 bg-white p-6">
            <SearchCheck className="h-5 w-5 text-primary-700" />
            <h2 className="mt-3 text-lg font-extrabold text-gray-950">Accountability Ledger</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Connect a source to the later evidence, missing document or reported outcome.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Open <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link to="/integrity" className="rounded-2xl border border-primary-100 bg-white p-6">
            <ShieldCheck className="h-5 w-5 text-primary-700" />
            <h2 className="mt-3 text-lg font-extrabold text-gray-950">Integrity & Audit</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Review ethics, procurement-integrity and COA evidence with the remaining gaps stated.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              Open <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-primary-100 bg-white p-6">
          <h2 className="text-xl font-extrabold text-gray-950">Missing record or wrong source?</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
            Send the source itself, or report a correction to an indexed title, publisher, period or BetterMakati linkage.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/get-involved?type=source#submission" className="brand-btn-primary">Share a source</Link>
            <Link to="/get-involved?type=correction#submission" className="brand-btn-secondary">Report a correction</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
