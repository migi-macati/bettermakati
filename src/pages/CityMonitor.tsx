import type { ComponentType } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  ExternalLink,
  FileText,
  Gavel,
  Landmark,
  Megaphone,
  Newspaper,
  Radio,
  ScrollText,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import {
  cityMonitorHistoricalRecordCount,
  cityMonitorRecords,
  cityMonitorReviewed,
  cityMonitorSourceCount,
  cityMonitorSources,
  cityMonitorValidatedRecordCount,
  cityMonitorTypeLabel,
  type CityMonitorType,
} from '../data/cityMonitor';

interface MonitorRun {
  checkedAt: string;
  checked?: number;
  unchanged?: number;
  changed: Array<{ id: string; label: string; url: string; stream: string }>;
  failed: Array<{ id: string; label: string; url: string; stream: string }>;
  newBaselines: Array<{ id: string; label: string; url: string; stream: string }>;
  manualReview?: Array<{ id: string; label: string; url: string; stream: string }>;
}

interface MonitorSourceState {
  id: string;
  label: string;
  url: string;
  stream: string;
  monitoringMode?: 'content-hash' | 'reachability' | 'manual-review';
  status: string;
  statusCode?: number | null;
  change: string;
}

interface MonitorState {
  checkedAt?: string | null;
  sources: MonitorSourceState[];
}

const typeIcon: Record<CityMonitorType, ComponentType<{ className?: string }>> = {
  'council-session': Gavel,
  legislation: ScrollText,
  'executive-speech': Megaphone,
  procurement: ShoppingCart,
  project: Landmark,
  publication: Newspaper,
  consultation: CalendarDays,
  'official-notice': Radio,
};

const streamOptions: Array<{ value: 'all' | CityMonitorType; label: string }> = [
  { value: 'all', label: 'All streams' },
  ...Object.entries(cityMonitorTypeLabel).map(([value, label]) => ({
    value: value as CityMonitorType,
    label,
  })),
];

export default function CityMonitor() {
  const [stream, setStream] = useState<'all' | CityMonitorType>('all');
  const [query, setQuery] = useState('');
  const [runs, setRuns] = useState<MonitorRun[]>([]);
  const [sourceState, setSourceState] = useState<MonitorState>({ sources: [] });
  const [historyFailed, setHistoryFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [historyResponse, stateResponse] = await Promise.all([
          fetch('/city-monitor-source-history.json', { cache: 'no-store' }),
          fetch('/city-monitor-source-state.json', { cache: 'no-store' }),
        ]);
        const history = await historyResponse.json();
        const state = await stateResponse.json();
        if (!historyResponse.ok || !Array.isArray(history.runs)) throw new Error('history');
        setRuns(history.runs);
        if (stateResponse.ok && Array.isArray(state.sources)) {
          setSourceState(state);
        }
      } catch {
        setHistoryFailed(true);
      }
    };
    void load();
  }, []);

  const latestRun = runs[0];

  const reviewQueue = useMemo(() => {
    const byId = new Map<string, { id: string; label: string; url: string; stream: string; lastDetected: string; detections: number }>();
    for (const run of runs.slice(0, 30)) {
      for (const item of run.changed || []) {
        const existing = byId.get(item.id);
        if (existing) {
          existing.detections += 1;
        } else {
          byId.set(item.id, {
            ...item,
            lastDetected: run.checkedAt,
            detections: 1,
          });
        }
      }
    }
    return [...byId.values()].sort((a, b) => b.lastDetected.localeCompare(a.lastDetected));
  }, [runs]);

  const sourceStateById = useMemo(
    () => new Map(sourceState.sources.map(source => [source.id, source])),
    [sourceState.sources]
  );

  const visibleRecords = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return cityMonitorRecords.filter(record => {
      const streamMatch = stream === 'all' || record.type === stream;
      const text = [
        record.title,
        record.summary,
        record.referenceNo,
        cityMonitorTypeLabel[record.type],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return streamMatch && (!needle || text.includes(needle));
    });
  }, [query, stream]);

  return (
    <>
      <SEO
        title="City Monitor"
        description="A continuously monitored record of Makati government activity: council, legislation, executive speeches, procurement, projects, publications, consultations and official notices."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Official activity</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>City Monitor</Heading>
            <p className="mt-2 max-w-4xl text-gray-700 leading-relaxed">
              Council, legislation, speeches, procurement, projects, publications, consultations and notices from monitored official sources.
            </p>
          </div>
          <SharePage title="Makati City Monitor | BetterMakati" />
        </div>

        <LastReviewed
          date={cityMonitorReviewed}
          note="Source changes are reviewed before a record is added."
        />

        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">{cityMonitorValidatedRecordCount}</div>
            <div className="mt-1 text-sm text-gray-600">validated permanent records</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">{cityMonitorSourceCount}</div>
            <div className="mt-1 text-sm text-gray-600">official source channels</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">{cityMonitorHistoricalRecordCount}</div>
            <div className="mt-1 text-sm text-gray-600">historical records already indexed</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">{reviewQueue.length}</div>
            <div className="mt-1 text-sm text-gray-600">source-change items awaiting review</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/briefs" className="brand-btn-primary">
            Civic Briefs <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/records" className="brand-btn-secondary">
            Public Records
          </Link>
          <Link to="/news" className="brand-btn-secondary">
            Makati in the News
          </Link>
        </div>
      </Section>


      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Daily source watch</div>
        <Heading level={2}>Source changes</Heading>

        {historyFailed ? (
          <div className="mt-6 rounded-2xl border border-secondary-200 bg-secondary-50 p-5 text-sm text-gray-700">
            <AlertCircle className="h-5 w-5 text-secondary-800" />
            <p className="mt-2">
              Source history is unavailable. Use the official source directory below.
            </p>
          </div>
        ) : latestRun ? (
          <div className="mt-6 rounded-2xl border border-primary-100 bg-white p-6">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              Latest published monitor update · {new Date(latestRun.checkedAt).toLocaleString('en-PH')}
            </div>
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                <div className="text-2xl font-extrabold text-gray-950">{latestRun.checked ?? sourceState.sources.length}</div>
                <div className="text-sm text-gray-600">automatic checks</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                <div className="text-2xl font-extrabold text-gray-950">{latestRun.changed.length}</div>
                <div className="text-sm text-gray-600">content changes</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                <div className="text-2xl font-extrabold text-gray-950">{latestRun.failed.length}</div>
                <div className="text-sm text-gray-600">failed checks</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                <div className="text-2xl font-extrabold text-gray-950">{latestRun.manualReview?.length ?? cityMonitorSources.filter(source => source.monitoringMode === 'manual-review').length}</div>
                <div className="text-sm text-gray-600">manual-review channels</div>
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
                    <Radio className="mt-0.5 h-4 w-4 shrink-0 text-secondary-800" />
                    <span className="text-sm text-gray-700">
                      <strong>{item.label}</strong> changed. Review pending.
                    </span>
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
                    <span className="text-sm text-gray-700">
                      <strong>{item.label}</strong> could not be checked successfully.
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
            The daily monitor has not published its first source-check run yet.
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="section-eyebrow">Editorial review queue</div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-gray-950">Source changes awaiting review</h3>
            </div>
            <div className="text-sm font-bold text-primary-800">{reviewQueue.length} open source{reviewQueue.length === 1 ? '' : 's'}</div>
          </div>

          {reviewQueue.length > 0 ? (
            <div className="mt-5 space-y-3">
              {reviewQueue.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-2 rounded-xl border border-secondary-200 bg-secondary-50 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <div className="font-extrabold text-gray-950">{item.label}</div>
                    <div className="mt-1 text-xs text-gray-600">{item.stream} · detected {item.detections} time{item.detections === 1 ? '' : 's'} in the last 30 runs</div>
                  </div>
                  <div className="shrink-0 text-xs font-bold text-secondary-900">
                    Last detected {new Date(item.lastDetected).toLocaleString('en-PH')}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-gray-200 bg-[#fffdf8] p-4 text-sm text-gray-600">
              No content-change signal is currently waiting in the published review queue.
            </div>
          )}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Validated civic records</div>
        <Heading level={2}>Structured records</Heading>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
          Search permanent City Monitor records by topic or stream.
        </p>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search City Monitor</span>
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              type="search"
              placeholder="Search records"
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4"
            />
          </label>
          <select
            value={stream}
            onChange={event => setStream(event.target.value as 'all' | CityMonitorType)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3"
            aria-label="Filter City Monitor stream"
          >
            {streamOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing <strong className="text-gray-900">{visibleRecords.length}</strong> of {cityMonitorRecords.length} validated records
        </div>

        <div className="mt-6 space-y-4">
          {visibleRecords.map(record => {
            const Icon = typeIcon[record.type];
            return (
              <article key={record.id} className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                        {cityMonitorTypeLabel[record.type]} · {record.historical ? 'Historical record' : record.status}
                      </div>
                      <h3 className="mt-1 text-xl font-extrabold text-gray-950">{record.title}</h3>
                    </div>
                  </div>
                  <time className="text-sm text-gray-500" dateTime={record.date}>{record.date}</time>
                </div>
                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-700">{record.summary}</p>
                {record.referenceNo && (
                  <div className="mt-3 text-sm text-gray-600">
                    Reference: <strong>{record.referenceNo}</strong>
                  </div>
                )}
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to={'/city-monitor/' + record.id} className="brand-btn-primary">
                    Open record <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={record.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-btn-secondary"
                  >
                    Original source <ExternalLink className="h-4 w-4" />
                  </a>
                  {record.relatedHref && (
                    <Link to={record.relatedHref} className="brand-btn-secondary">
                      Related BetterMakati record
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
          {visibleRecords.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-6 text-center text-sm text-gray-600">
              No validated record matches this search or stream.
            </div>
          )}
        </div>
      </Section>


      <Section className="bg-white">
        <div className="section-eyebrow">Monitored official channels</div>
        <Heading level={2}>Source directory</Heading>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
          Official channels used by City Monitor.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/city-monitor-source-state.json" className="brand-btn-secondary">
            Source health JSON
          </a>
          <a href="/city-monitor-source-history.json" className="brand-btn-secondary">
            Check history JSON
          </a>
          <a href="/city-monitor.rss.xml" className="brand-btn-secondary">
            Source-change RSS
          </a>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityMonitorSources.map(source => {
            const state = sourceStateById.get(source.id);
            const modeLabel =
              source.monitoringMode === 'content-hash'
                ? 'content-change detection'
                : source.monitoringMode === 'reachability'
                  ? 'reachability only'
                  : 'manual review';
            return (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
              >
                <FileText className="h-5 w-5 text-primary-700" />
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">{source.cadence}</span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">{modeLabel}</span>
                  {state && (
                    <span className={
                      'rounded-full px-2.5 py-1 ' +
                      (state.status === 'ok'
                        ? 'bg-success-50 text-success-800'
                        : state.status === 'manual-review'
                          ? 'bg-secondary-50 text-secondary-900'
                          : 'bg-error-50 text-error-800')
                    }>
                      {state.status === 'ok' ? 'last check OK' : state.status === 'manual-review' ? 'manual channel' : 'check issue'}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-extrabold text-gray-950">{source.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{source.monitoringNote}</p>
                {!state && (
                  <p className="mt-2 text-xs text-gray-500">Not yet present in the latest published source-state file.</p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Open source <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      </Section>
    </>
  );
}
