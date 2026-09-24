import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  Clock3,
  Copy,
  ExternalLink,
  MapPin,
  Newspaper,
  Radio,
  Rss,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import { barangays } from '../data/barangays';
import {
  accountabilityLinkedRecords,
  briefArchiveHref,
  briefLiveHref,
  briefPeriodLabel,
  civicBriefCadence,
  civicBriefSections,
  civicBriefStreamCounts,
  civicBriefsReviewed,
  currentManilaDateKey,
  procurementValue,
  recordsForPeriod,
  recordsForSection,
  rollingBriefPeriod,
  type CivicBriefArchiveEntry,
  type CivicBriefCadence,
  type CivicBriefReviewSignal,
} from '../data/civicBriefs';
import {
  cityMonitorRecords,
  cityMonitorTypeLabel,
  type CityMonitorRecord,
} from '../data/cityMonitor';

interface MonitorRun {
  checkedAt: string;
  changed: Array<{ id: string; label: string; url: string; stream: string }>;
  failed: Array<{ id: string; label: string; url: string; stream: string }>;
}

interface BriefArchive {
  version: number;
  briefs: CivicBriefArchiveEntry[];
}

const validCadence = (value: string | null): value is CivicBriefCadence =>
  value === 'daily' || value === 'weekly' || value === 'monthly';

const peso = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    notation: value >= 1_000_000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1_000_000 ? 2 : 0,
  }).format(value);

const recordBarangay = (record: CityMonitorRecord) =>
  record.barangaySlug
    ? barangays.find(item => item.slug === record.barangaySlug)
    : undefined;

export default function CivicBriefs() {
  const [params, setParams] = useSearchParams();
  const [archive, setArchive] = useState<CivicBriefArchiveEntry[]>([]);
  const [runs, setRuns] = useState<MonitorRun[]>([]);
  const [archiveFailed, setArchiveFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const briefId = params.get('brief') ?? '';
  const periodParam = params.get('period');
  const cadence: CivicBriefCadence = validCadence(periodParam)
    ? periodParam
    : 'weekly';
  const barangaySlug = params.get('barangay') ?? '';
  const selectedBarangay = barangays.find(item => item.slug === barangaySlug);

  useEffect(() => {
    const load = async () => {
      try {
        const [archiveResponse, historyResponse] = await Promise.all([
          fetch('/civic-briefs.json', { cache: 'no-store' }),
          fetch('/city-monitor-source-history.json', { cache: 'no-store' }),
        ]);
        const archiveData = (await archiveResponse.json()) as BriefArchive;
        const historyData = await historyResponse.json();

        if (!archiveResponse.ok || !Array.isArray(archiveData.briefs)) {
          throw new Error('archive');
        }
        setArchive(archiveData.briefs);

        if (historyResponse.ok && Array.isArray(historyData.runs)) {
          setRuns(historyData.runs);
        }
      } catch {
        setArchiveFailed(true);
      }
    };
    void load();
  }, []);

  const selectedBrief = useMemo(
    () => archive.find(brief => brief.id === briefId),
    [archive, briefId]
  );

  const effectiveCadence = selectedBrief?.cadence ?? cadence;
  const livePeriod = rollingBriefPeriod(effectiveCadence);
  const periodStart = selectedBrief?.periodStart ?? livePeriod.start;
  const periodEnd = selectedBrief?.periodEnd ?? livePeriod.end;

  const records = useMemo(() => {
    if (selectedBrief) {
      const idSet = new Set(selectedBrief.recordIds);
      return cityMonitorRecords
        .filter(record => idSet.has(record.id))
        .filter(
          record =>
            !barangaySlug ||
            !record.barangaySlug ||
            record.barangaySlug === barangaySlug
        )
        .sort((a, b) => b.date.localeCompare(a.date));
    }
    return recordsForPeriod(
      cityMonitorRecords,
      periodStart,
      periodEnd,
      barangaySlug
    );
  }, [barangaySlug, periodEnd, periodStart, selectedBrief]);

  const liveSignals = useMemo(() => {
    const relevantRuns = runs.filter(run => {
      const key = currentManilaDateKey(new Date(run.checkedAt));
      return key >= periodStart && key <= periodEnd;
    });
    const mapSignal = (
      item: { id: string; label: string; url: string; stream: string },
      checkedAt: string
    ): CivicBriefReviewSignal => ({ ...item, checkedAt });

    return {
      changed: relevantRuns.flatMap(run =>
        run.changed.map(item => mapSignal(item, run.checkedAt))
      ),
      failed: relevantRuns.flatMap(run =>
        run.failed.map(item => mapSignal(item, run.checkedAt))
      ),
    };
  }, [periodEnd, periodStart, runs]);

  const reviewSignals = selectedBrief?.reviewSignals ?? liveSignals.changed;
  const failedChecks = selectedBrief?.failedChecks ?? liveSignals.failed;

  const displayedRecords =
    effectiveCadence === 'daily'
      ? records.slice(0, 10)
      : effectiveCadence === 'weekly'
        ? records.slice(0, 20)
        : records.slice(0, 12);

  const accountabilityRecords = accountabilityLinkedRecords(records);
  const streamCounts = civicBriefStreamCounts(records);
  const procurementTotal = procurementValue(records);
  const barangayTaggedCount = records.filter(record => record.barangaySlug).length;
  const periodLabel = briefPeriodLabel(periodStart, periodEnd);
  const briefMeta = civicBriefCadence[effectiveCadence];

  const setLiveCadence = (next: CivicBriefCadence) => {
    const nextParams = new URLSearchParams(params);
    nextParams.delete('brief');
    nextParams.set('period', next);
    setParams(nextParams, { replace: true });
  };

  const setBarangay = (slug: string) => {
    const nextParams = new URLSearchParams(params);
    if (slug) nextParams.set('barangay', slug);
    else nextParams.delete('barangay');
    setParams(nextParams, { replace: true });
  };

  const copyBriefText = async () => {
    const lines = [
      briefMeta.label + ' — ' + periodLabel,
      records.length
        ? records.length + ' validated City Monitor record' + (records.length === 1 ? '' : 's')
        : 'No new validated City Monitor records in this period.',
      ...displayedRecords.slice(0, 5).map(record => '• ' + record.title),
      reviewSignals.length
        ? reviewSignals.length + ' source-change signal' + (reviewSignals.length === 1 ? '' : 's') + ' awaiting review.'
        : '',
      typeof window !== 'undefined' ? window.location.href : '',
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <SEO
        title={briefMeta.label}
        description="Daily, weekly and monthly BetterMakati civic briefs generated from validated City Monitor records, with source-change signals kept separate until reviewed."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Follow Makati</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Civic Briefs</Heading>
            <p className="mt-2 max-w-3xl text-gray-700">
              Short, source-backed updates from City Monitor. Raw source changes stay outside the brief until they are verified.
            </p>
          </div>
          <SharePage title={briefMeta.label + ' | BetterMakati'} />
        </div>

        <LastReviewed
          date={civicBriefsReviewed}
          note="The website is the permanent source record; social posts should point back to the corresponding brief or City Monitor record."
        />

        <div className="mt-7 flex flex-wrap gap-2">
          {(Object.keys(civicBriefCadence) as CivicBriefCadence[]).map(value => (
            <button
              key={value}
              type="button"
              onClick={() => setLiveCadence(value)}
              aria-pressed={!selectedBrief && cadence === value}
              className={
                'rounded-full border px-4 py-2 text-sm font-bold ' +
                (!selectedBrief && cadence === value
                  ? 'border-primary-700 bg-primary-700 text-white'
                  : 'border-gray-300 bg-white text-gray-700')
              }
            >
              {civicBriefCadence[value].shortLabel}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              {selectedBrief ? 'Published brief' : 'Current view'}
            </div>
            <h2 className="mt-1 text-2xl font-extrabold text-gray-950">{briefMeta.label}</h2>
            <p className="mt-1 font-semibold text-gray-700">{periodLabel}</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
              {briefMeta.description}
            </p>
            {selectedBrief && (
              <p className="mt-3 text-xs text-gray-500">
                Published {new Date(selectedBrief.publishedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="flex items-center gap-2 font-extrabold text-gray-950">
              <MapPin className="h-5 w-5 text-primary-700" />
              Barangay relevance
            </div>
            <select
              value={barangaySlug}
              onChange={event => setBarangay(event.target.value)}
              className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
              aria-label="Filter Civic Brief by barangay relevance"
            >
              <option value="">Citywide view</option>
              {barangays.map(barangay => (
                <option key={barangay.slug} value={barangay.slug}>{barangay.name}</option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              {selectedBarangay
                ? 'Shows citywide records plus records explicitly tagged to Barangay ' + selectedBarangay.name + '.'
                : 'Local tags appear only when a validated record has a documented barangay connection.'}
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">At a glance</div>
        <Heading level={2}>{briefMeta.label}</Heading>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold text-gray-950">{records.length}</div>
            <div className="text-sm text-gray-600">validated records</div>
          </div>
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold text-gray-950">{accountabilityRecords.length}</div>
            <div className="text-sm text-gray-600">accountability-linked</div>
          </div>
          <div className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
            <div className="text-2xl font-extrabold text-gray-950">{barangayTaggedCount}</div>
            <div className="text-sm text-gray-600">barangay-tagged</div>
          </div>
          <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-4">
            <div className="text-2xl font-extrabold text-gray-950">{reviewSignals.length}</div>
            <div className="text-sm text-gray-600">source changes awaiting review</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-2xl font-extrabold text-gray-950">{failedChecks.length}</div>
            <div className="text-sm text-gray-600">failed source checks</div>
          </div>
        </div>

        {effectiveCadence === 'monthly' && (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
              <WalletCards className="h-5 w-5 text-primary-700" />
              <div className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                Procurement represented in validated records
              </div>
              <div className="mt-1 text-3xl font-extrabold text-gray-950">
                {peso(procurementTotal)}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Sum of reported winning-bid amounts among procurement records in this brief period. It is not total city spending or proof of payment.
              </p>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
              <BarChart3 className="h-5 w-5 text-primary-700" />
              <div className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                Validated activity by stream
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-sm">
                {Object.entries(streamCounts).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between gap-3">
                    <span className="text-gray-600">{cityMonitorTypeLabel[type as keyof typeof cityMonitorTypeLabel]}</span>
                    <strong className="text-gray-950">{count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Validated activity</div>
        <Heading level={2}>What changed in the civic record</Heading>

        {records.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
            <ShieldCheck className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">No newly validated City Monitor records</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              BetterMakati does not fill a quiet period with unverified announcements. Source-change signals, if any, remain in the review queue below.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {civicBriefSections.map(section => {
              const sectionRecords = recordsForSection(displayedRecords, section);
              if (sectionRecords.length === 0) return null;
              return (
                <div key={section.id}>
                  <h3 className="text-xl font-extrabold text-gray-950">{section.label}</h3>
                  <p className="mt-1 text-sm text-gray-600">{section.description}</p>
                  <div className="mt-4 space-y-3">
                    {sectionRecords.map(record => {
                      const barangay = recordBarangay(record);
                      return (
                        <article key={record.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex flex-wrap gap-2 text-xs font-bold">
                                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                                  {cityMonitorTypeLabel[record.type]}
                                </span>
                                {barangay && (
                                  <span className="rounded-full bg-secondary-50 px-2.5 py-1 text-secondary-900">
                                    Better{barangay.name}
                                  </span>
                                )}
                              </div>
                              <h4 className="mt-2 text-lg font-extrabold text-gray-950">{record.title}</h4>
                              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">{record.summary}</p>
                            </div>
                            <time className="shrink-0 text-xs font-semibold text-gray-500" dateTime={record.date}>
                              {record.date}
                            </time>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <Link to={'/city-monitor/' + record.id} className="brand-btn-primary">
                              Permanent record <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a
                              href={record.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="brand-btn-secondary"
                            >
                              Original source <ExternalLink className="h-4 w-4" />
                            </a>
                            {barangay && (
                              <Link to={'/barangays/' + barangay.slug} className="brand-btn-secondary">
                                Better{barangay.name}
                              </Link>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {records.length > displayedRecords.length && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
            This brief keeps the reading list short. <Link to="/city-monitor" className="font-bold text-primary-700 underline underline-offset-2">Open City Monitor</Link> for all {records.length} validated records in the period.
          </div>
        )}
      </Section>

      {accountabilityRecords.length > 0 && (
        <Section className="bg-white">
          <div className="section-eyebrow">Follow-through</div>
          <Heading level={2}>Accountability-linked developments</Heading>
          <div className="mt-6 space-y-3">
            {accountabilityRecords.slice(0, 10).map(record => (
              <div key={record.id} className="rounded-xl border border-primary-100 bg-[#fffdf8] p-4">
                <div className="font-extrabold text-gray-950">{record.title}</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link to={'/city-monitor/' + record.id} className="text-sm font-bold text-primary-700 underline underline-offset-2">
                    City Monitor record
                  </Link>
                  {record.relatedHref && (
                    <Link to={record.relatedHref} className="text-sm font-bold text-primary-700 underline underline-offset-2">
                      Accountability follow-through
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section className="bg-white">
        <div className="section-eyebrow">Not yet validated</div>
        <Heading level={2}>Source-review queue</Heading>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
          These are monitoring signals, not city actions. They stay separate from the brief until a source-backed City Monitor record is created.
        </p>

        {reviewSignals.length === 0 && failedChecks.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600">
            No published source-change or failed-check signal falls inside this period.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {reviewSignals.slice(0, 20).map((signal, index) => (
              <a
                key={signal.id + '-' + signal.checkedAt + '-' + index}
                href={signal.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-secondary-200 bg-secondary-50 p-4"
              >
                <Radio className="h-4 w-4 text-secondary-800" />
                <div className="mt-2 font-bold text-gray-950">{signal.label}</div>
                <div className="mt-1 text-xs text-gray-600">
                  {signal.stream} · detected {new Date(signal.checkedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}
                </div>
              </a>
            ))}
            {failedChecks.slice(0, 20).map((signal, index) => (
              <a
                key={'failed-' + signal.id + '-' + signal.checkedAt + '-' + index}
                href={signal.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-error-200 bg-error-50 p-4"
              >
                <Radio className="h-4 w-4 text-error-700" />
                <div className="mt-2 font-bold text-gray-950">{signal.label}</div>
                <div className="mt-1 text-xs text-gray-600">Source check failed · {signal.stream}</div>
              </a>
            ))}
          </div>
        )}
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Archive</div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>Permanent brief archive</Heading>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              Daily, weekly and monthly snapshots stay linkable after publication.
            </p>
          </div>
          <a href="/civic-briefs.rss.xml" className="brand-btn-secondary">
            <Rss className="h-4 w-4" /> Civic Briefs RSS
          </a>
        </div>

        {archiveFailed ? (
          <div className="mt-6 rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-gray-700">
            The published brief archive is unavailable.
          </div>
        ) : archive.length === 0 ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
            The scheduled archive has not published a brief yet.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {archive.slice(0, 18).map(brief => (
              <Link
                key={brief.id}
                to={briefArchiveHref(brief.id) + (barangaySlug ? '&barangay=' + encodeURIComponent(barangaySlug) : '')}
                className={
                  'rounded-2xl border bg-white p-5 transition ' +
                  (brief.id === selectedBrief?.id
                    ? 'border-primary-500 ring-2 ring-primary-100'
                    : 'border-gray-200 hover:border-primary-300')
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                      {civicBriefCadence[brief.cadence].shortLabel}
                    </div>
                    <h3 className="mt-1 font-extrabold text-gray-950">{brief.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {briefPeriodLabel(brief.periodStart, brief.periodEnd)}
                    </p>
                  </div>
                  <Clock3 className="h-4 w-4 shrink-0 text-gray-400" />
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-gray-600">
                  <span>{brief.recordIds.length} validated</span>
                  <span>{brief.reviewSignals.length} review signals</span>
                  <span>{brief.failedChecks.length} failed checks</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <Link to={briefLiveHref('daily', barangaySlug)} className="brand-btn-secondary">Current daily view</Link>
          <Link to={briefLiveHref('weekly', barangaySlug)} className="brand-btn-secondary">Current weekly view</Link>
          <Link to={briefLiveHref('monthly', barangaySlug)} className="brand-btn-secondary">Current monthly view</Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Distribution</div>
        <Heading level={2}>Share the brief</Heading>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
            <Copy className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Share-ready text</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Copies the brief title, period, validated-record count, up to five headlines, review-signal count and the current permalink.
            </p>
            <button type="button" onClick={copyBriefText} className="brand-btn-primary mt-4">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy brief text'}
            </button>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
            <Bell className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Follow BetterMakati</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              The website remains the source of truth. Facebook and the RSS feed can distribute links back to permanent briefs and records.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/bettermakati"
                target="_blank"
                rel="noreferrer"
                className="brand-btn-primary"
              >
                Facebook <ExternalLink className="h-4 w-4" />
              </a>
              <a href="/civic-briefs.rss.xml" className="brand-btn-secondary">
                <Rss className="h-4 w-4" /> RSS
              </a>
              <Link to="/news" className="brand-btn-secondary">
                <Newspaper className="h-4 w-4" /> Makati in the News
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
