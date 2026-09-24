import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Database,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  RefreshCw,
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

interface SourceWatchRun {
  checkedAt: string;
  changed: Array<{ id: string; label: string; url: string; kind?: string }>;
  failed: Array<{
    id: string;
    label: string;
    url: string;
    kind?: string;
    status?: string;
    statusCode?: number | null;
  }>;
  newBaselines: Array<{ id: string; label: string; url: string; kind?: string }>;
}

interface WatchedSource {
  id: string;
  label: string;
  url: string;
  kind?: string;
  cadence: 'daily' | 'weekly' | 'monthly';
  monitoringMode: 'content-hash' | 'reachability';
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
  const [watchRuns, setWatchRuns] = useState<SourceWatchRun[]>([]);
  const [watchedSources, setWatchedSources] = useState<WatchedSource[]>([]);
  const [watchState, setWatchState] = useState<SourceWatchState>({});
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sourceClass, setSourceClass] = useState<'All' | PublicRecordSourceClass>('All');
  const [officialOnly, setOfficialOnly] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [historyResponse, indexResponse, stateResponse] = await Promise.all([
          fetch('/source-watch-history.json', { cache: 'no-store' }),
          fetch('/source-watch-index.json', { cache: 'no-store' }),
          fetch('/source-watch-state.json', { cache: 'no-store' }),
        ]);
        const history = await historyResponse.json();
        const index = await indexResponse.json();
        const state = await stateResponse.json();
        if (historyResponse.ok && Array.isArray(history.runs)) {
          setWatchRuns(history.runs);
        }
        if (indexResponse.ok && Array.isArray(index)) {
          setWatchedSources(index);
        }
        if (stateResponse.ok && Array.isArray(state.sources)) {
          setWatchState(state);
        }
      } catch {
        setWatchRuns([]);
        setWatchedSources([]);
        setWatchState({});
      }
    };
    void load();
  }, []);

  const latestRun = watchRuns[0];
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
    const state = watchStateByUrl.get(url);
    if (!state || state.status === 'not-checked') return 'Awaiting first scheduled check';
    if (state.status !== 'ok') {
      return 'Latest check failed' + (state.statusCode ? ' (' + state.statusCode + ')' : '');
    }
    if (!state.lastCheckedAt) return 'Reachable';
    return 'Last checked ' + new Date(state.lastCheckedAt).toLocaleString('en-PH');
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

  const watchedCatalogCount = publicRecords.filter(record =>
    watchedUrls.has(record.url)
  ).length;

  return (
    <>
      <SEO
        title="Public Records"
        description="Search the source documents, datasets, public portals and evidence used across BetterMakati."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Records & data</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Public Records</Heading>
            <p className="mt-2 max-w-4xl text-gray-700 leading-relaxed">
              Search documents, datasets and public portals used across BetterMakati.
            </p>
          </div>
          <SharePage title="Makati Public Records | BetterMakati" />
        </div>

        <LastReviewed date={publicRecordsReviewed} note="For legal or transactional use, rely on the issuing public body’s original record." />

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

        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,0.8fr))_auto]">
          <label className="relative">
            <span className="sr-only">Search public records</span>
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search budget, ordinance, COA, COMELEC, Citizen’s Charter…"
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

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

        <div className="mt-5 space-y-3">
          {visibleRecords.map(record => (
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
                  <a href={record.url} target="_blank" rel="noreferrer" className="brand-btn-primary">
                    Open source <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}

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
            <div className="text-2xl font-extrabold text-gray-950">{latestRun?.changed.length ?? 0}</div>
            <div className="text-sm text-gray-600">stable-document changes awaiting review</div>
          </div>
          <div className="rounded-xl border border-error-200 bg-error-50 p-4">
            <div className="text-2xl font-extrabold text-gray-950">
              {(watchState.sources ?? []).filter(source => source.status === 'http-error' || source.status === 'unreachable').length}
            </div>
            <div className="text-sm text-gray-600">latest source-specific checks failed</div>
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
              ? 'Latest automation run: ' + new Date(watchState.checkedAt).toLocaleString('en-PH') + ' · ' + (watchState.cadence || 'all') + ' cadence.'
              : 'Automation is configured; the first scheduled freshness run has not yet been published.'}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/source-watch-state.json" download className="brand-btn-secondary">
            <Database className="h-4 w-4" /> Current source state
          </a>
          <a href="/source-watch-index.json" download className="brand-btn-secondary">
            <Database className="h-4 w-4" /> Monitored-source index
          </a>
          <a href="/source-watch-history.json" download className="brand-btn-secondary">
            <Download className="h-4 w-4" /> Check history
          </a>
        </div>

        {!latestRun ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600">
            <RefreshCw className="h-5 w-5 text-primary-700" />
            <p className="mt-3">
              No completed general source-freshness run is in the published history yet. The configured cadence and monitoring mode are already visible above.
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              Latest run · {new Date(latestRun.checkedAt).toLocaleString('en-PH')}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl font-extrabold text-gray-950">{latestRun.changed.length}</div>
                <div className="text-sm text-gray-600">content changes for review</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl font-extrabold text-gray-950">{latestRun.failed.length}</div>
                <div className="text-sm text-gray-600">checks failed</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl font-extrabold text-gray-950">{latestRun.newBaselines.length}</div>
                <div className="text-sm text-gray-600">new document baselines</div>
              </div>
            </div>

            {(latestRun.changed.length > 0 || latestRun.failed.length > 0) && (
              <div className="mt-5 space-y-3">
                {latestRun.changed.map(item => (
                  <a
                    key={'changed-' + item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4"
                  >
                    <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-secondary-800" />
                    <span className="text-sm text-gray-700"><strong>{item.label}</strong> changed and requires editorial review.</span>
                  </a>
                ))}
                {latestRun.failed.map(item => (
                  <a
                    key={'failed-' + item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 rounded-xl border border-error-200 bg-error-50 p-4"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error-700" />
                    <span className="text-sm text-gray-700"><strong>{item.label}</strong> could not be checked successfully.</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
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
