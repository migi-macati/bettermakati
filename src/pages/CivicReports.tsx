import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { civicAuditPilot } from '../data/civicAuditPilot';

interface CivicStageEvidence {
  at?: string | null;
  authority?: string | null;
  channel?: string | null;
}

interface CivicOutcome {
  eligibleCivicCase: boolean;
  cohortCreatedAt: string | null;
  stages: {
    reviewed?: CivicStageEvidence | null;
    routed?: CivicStageEvidence | null;
    acknowledged?: CivicStageEvidence | null;
    actionReported?: CivicStageEvidence | null;
    documentedResolution?: CivicStageEvidence | null;
  };
  communityResolutionSignalCount: number;
}

interface CivicRecord {
  number: number;
  title: string;
  kind: string;
  state: string;
  url: string;
  createdAt: string;
  evidenceStatus: string;
  evidenceLabel: string;
  referralEligible: boolean;
  updatedAt: string;
  entityId?: string | null;
  entityKind?: 'place' | 'segment' | 'route' | null;
  locationMode?: 'matched-place' | 'matched-entity' | 'location-only';
  counts: {
    confirm: number;
    resolved: number;
    support: number;
    concern: number;
    updates: number;
  };
  meta: {
    entityId?: string | null;
    entityKind?: 'place' | 'segment' | 'route' | null;
    placeId?: string | null;
    locationMode?: 'matched-place' | 'matched-entity' | 'location-only';
    category?: string;
    location?: string;
    locationLabel?: string;
    preferredChannel?: string;
    severity?: string;
  };
  outcome?: CivicOutcome;
}

interface CivicReportData {
  generatedAt: string;
  referralQueue: CivicRecord[];
  records: CivicRecord[];
}

interface AuditEntityResult {
  entityId: string;
  name: string;
  observationCount: number;
  latestObservedAt: string | null;
  isComplete: boolean;
}

interface CivicAuditData {
  campaignId: string;
  status: 'collecting';
  asOf: string;
  startsAt: string;
  endsAt: string;
  targetCount: number;
  inventoryClaim: string;
  observationCount: number;
  observedEntities: number;
  completeEntities: number;
  latestObservedAt: string | null;
  entities: AuditEntityResult[];
  dataAvailable?: boolean;
}

const DAY_MS = 86_400_000;
const CASE_WINDOW_DAYS = 30;
const PARK_RECENT_WINDOW_DAYS = 30;
const MIN_RATE_DENOMINATOR = 20;
const MIN_FRESHNESS_OBSERVED_ENTITIES = 5;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Manila',
  }).format(new Date(value));

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Manila',
  }).format(new Date(value));

const wholePercent = (numerator: number, denominator: number) =>
  denominator > 0 ? Math.round((numerator / denominator) * 100) : null;

export default function CivicReports() {
  const [data, setData] = useState<CivicReportData | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [auditData, setAuditData] = useState<CivicAuditData | null>(null);
  const [auditFailed, setAuditFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setFailed(false);
    setAuditFailed(false);

    void fetch('/api/civic-report', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async response => {
        const result = (await response.json()) as CivicReportData;
        if (!response.ok) throw new Error('civic-report');
        setData(result);
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setFailed(true);
      });

    void fetch(
      '/api/civic-audit?campaign=' + encodeURIComponent(civicAuditPilot.id),
      {
        cache: 'no-store',
        signal: controller.signal,
      }
    )
      .then(async response => {
        const result = (await response.json()) as CivicAuditData;
        if (!response.ok) throw new Error('civic-audit');
        setAuditData(result);
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setAuditFailed(true);
      });

    return () => controller.abort();
  }, [attempt]);

  const asOfTime = data ? new Date(data.generatedAt).getTime() : 0;
  const caseWindowStart = asOfTime - CASE_WINDOW_DAYS * DAY_MS;

  const cohort = useMemo(
    () =>
      data?.records.filter(record => {
        const createdAt = new Date(record.createdAt).getTime();
        return (
          record.outcome?.eligibleCivicCase === true &&
          Number.isFinite(createdAt) &&
          createdAt >= caseWindowStart &&
          createdAt <= asOfTime
        );
      }) ?? [],
    [asOfTime, caseWindowStart, data]
  );

  const lifecycleCounts = useMemo(
    () => ({
      submitted: cohort.length,
      reviewed: cohort.filter(record => record.outcome?.stages.reviewed).length,
      routed: cohort.filter(record => record.outcome?.stages.routed).length,
      acknowledged: cohort.filter(record => record.outcome?.stages.acknowledged)
        .length,
      actionEvidence: cohort.filter(
        record => record.outcome?.stages.actionReported
      ).length,
      documentedResolution: cohort.filter(
        record => record.outcome?.stages.documentedResolution
      ).length,
      communityResolutionSignals: cohort.filter(
        record => (record.outcome?.communityResolutionSignalCount ?? 0) > 0
      ).length,
    }),
    [cohort]
  );

  const recentCases =
    data?.records.filter(item => item.kind === 'report').slice(0, 12) ?? [];

  const observedCoverage = auditData
    ? wholePercent(auditData.observedEntities, auditData.targetCount)
    : null;
  const completeCoverage = auditData
    ? wholePercent(auditData.completeEntities, auditData.targetCount)
    : null;

  const freshness = useMemo(() => {
    if (!auditData) return null;

    const auditAsOf = new Date(auditData.asOf).getTime();
    const recentCutoff = auditAsOf - PARK_RECENT_WINDOW_DAYS * DAY_MS;
    const recentlyObserved = auditData.entities.filter(entity => {
      if (!entity.latestObservedAt) return false;
      const observedAt = new Date(entity.latestObservedAt).getTime();
      return (
        Number.isFinite(observedAt) &&
        observedAt >= recentCutoff &&
        observedAt <= auditAsOf
      );
    }).length;

    const publishAggregate =
      auditData.targetCount >= 10 &&
      auditData.observedEntities >= MIN_FRESHNESS_OBSERVED_ENTITIES;

    return {
      recentlyObserved,
      publishAggregate,
      percent: publishAggregate
        ? wholePercent(recentlyObserved, auditData.targetCount)
        : null,
    };
  }, [auditData]);

  return (
    <>
      <SEO
        title="Civic case outcomes"
        description="Documented civic-case progression, referral review, structured-observation freshness and civic-audit coverage for BetterMakati public-realm participation."
      />

      <Section className="bg-[#fffdf8]">
        <Link
          to="/civic-map"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Civic Map
        </Link>
        <div className="section-eyebrow mt-6">Community evidence</div>
        <Heading>Civic case outcomes</Heading>
        <p className="mt-3 max-w-4xl text-lg leading-relaxed text-gray-700">
          Documented case progression, review queues and public-realm
          observation coverage.
        </p>
        {data?.generatedAt && (
          <p className="mt-4 text-sm text-gray-500">
            Case data updated {formatDateTime(data.generatedAt)}
          </p>
        )}
      </Section>

      {failed ? (
        <Section className="bg-white">
          <div className="rounded-2xl border border-warning-200 bg-warning-50 p-5 text-warning-900">
            <div className="flex gap-3">
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <div className="font-extrabold">Case data unavailable</div>
                <p className="mt-1 text-sm">
                  The public civic-case feed could not be loaded.
                </p>
                <button
                  type="button"
                  onClick={() => setAttempt(value => value + 1)}
                  className="brand-btn-secondary mt-3"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </Section>
      ) : !data ? (
        <Section className="bg-white">
          <div className="text-sm text-gray-500">
            Loading civic case outcomes…
          </div>
        </Section>
      ) : (
        <>
          <Section className="bg-white">
            <div className="section-eyebrow">Case progression</div>
            <Heading level={2}>Cases submitted in the last 30 days</Heading>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
              Exact source-backed lifecycle counts for cases created in this
              30-day cohort. Later lifecycle events stay attached to the case
              that generated them.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {[
                ['Submitted', lifecycleCounts.submitted],
                ['Reviewed', lifecycleCounts.reviewed],
                ['Routed', lifecycleCounts.routed],
                ['Authority acknowledged', lifecycleCounts.acknowledged],
                ['Action evidence', lifecycleCounts.actionEvidence],
                ['Documented resolution', lifecycleCounts.documentedResolution],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-4"
                >
                  <div className="text-2xl font-extrabold text-primary-800">
                    {value}
                  </div>
                  <div className="mt-1 text-xs font-bold leading-snug text-gray-600">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-primary-100 bg-primary-50 p-5">
                <div className="text-xs font-black uppercase tracking-[0.08em] text-primary-700">
                  Public rate threshold
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {cohort.length < MIN_RATE_DENOMINATOR
                    ? `This cohort has ${cohort.length} eligible case${cohort.length === 1 ? '' : 's'}. Lifecycle percentages are withheld until a cohort has at least ${MIN_RATE_DENOMINATOR} cases and the relevant maturity period has elapsed.`
                    : 'This live cohort meets the volume threshold, but lifecycle rates remain withheld until each stage-specific maturity period has elapsed.'}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="text-xs font-black uppercase tracking-[0.08em] text-gray-500">
                  Separate community signal
                </div>
                <div className="mt-2 text-2xl font-black text-gray-950">
                  {lifecycleCounts.communityResolutionSignals}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  cases in this cohort have an ordinary community
                  “appears resolved” signal. These are not counted as documented
                  resolution unless the lifecycle record is separately promoted.
                </p>
              </div>
            </div>
          </Section>

          <Section className="bg-[#f5f8f2]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="section-eyebrow">Review & referral</div>
                <Heading level={2}>Cases ready for BetterMakati review</Heading>
              </div>
              <div className="text-sm text-gray-500">
                {data.referralQueue.length} case
                {data.referralQueue.length === 1 ? '' : 's'}
              </div>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              A report enters this queue when it is high priority or has at
              least two independent confirmations. Referral still requires
              human review of jurisdiction, evidence and destination.
            </p>

            {data.referralQueue.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
                No current case has crossed the review threshold.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {data.referralQueue.map(item => (
                  <article
                    key={item.number}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                      <span className="rounded-full bg-warning-50 px-2.5 py-1 text-warning-900">
                        Review / referral candidate
                      </span>
                      <span className="text-gray-500">
                        {item.evidenceLabel}
                      </span>
                    </div>
                    <h3 className="mt-2 font-extrabold text-gray-950">
                      #{item.number} {item.title}
                    </h3>
                    <div className="mt-2 text-sm text-gray-600">
                      {item.counts.confirm} confirmation
                      {item.counts.confirm === 1 ? '' : 's'}
                      {item.meta.severity
                        ? ' · ' + item.meta.severity + ' priority'
                        : ''}
                      {item.meta.preferredChannel
                        ? ' · suggested channel: ' +
                          item.meta.preferredChannel
                        : ''}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      Review public case
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            )}
          </Section>

          <Section className="bg-white">
            <div className="section-eyebrow">Structured observations</div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Heading level={2}>Park audit coverage & freshness</Heading>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
                  The live {civicAuditPilot.title} covers the{' '}
                  {civicAuditPilot.targetEntityIds.length} verified current
                  government/public parks frozen into this campaign.
                </p>
              </div>
              <Link
                to={civicAuditPilot.route + '/results'}
                className="brand-btn-secondary"
              >
                Live audit output
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {auditFailed ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600">
                Live observation coverage is temporarily unavailable.
              </div>
            ) : !auditData ? (
              <div className="mt-6 text-sm text-gray-500">
                Loading observation coverage…
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
                    <FileCheck2 className="h-5 w-5 text-primary-700" aria-hidden="true" />
                    <div className="mt-3 text-2xl font-black text-gray-950">
                      {auditData.observedEntities}/{auditData.targetCount}
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-700">
                      parks with observations
                    </div>
                    {observedCoverage !== null && (
                      <div className="mt-1 text-xs text-gray-500">
                        {observedCoverage}% of the frozen 13-park scope
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
                    <CheckCircle2 className="h-5 w-5 text-primary-700" aria-hidden="true" />
                    <div className="mt-3 text-2xl font-black text-gray-950">
                      {auditData.completeEntities}/{auditData.targetCount}
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-700">
                      parks meeting the completion rule
                    </div>
                    {completeCoverage !== null && (
                      <div className="mt-1 text-xs text-gray-500">
                        {completeCoverage}% of the frozen target set
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
                    <Clock3 className="h-5 w-5 text-primary-700" aria-hidden="true" />
                    <div className="mt-3 text-lg font-black text-gray-950">
                      {auditData.latestObservedAt
                        ? formatDate(auditData.latestObservedAt)
                        : 'None yet'}
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-700">
                      latest campaign observation
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {auditData.observationCount} observation
                      {auditData.observationCount === 1 ? '' : 's'}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
                    <ShieldCheck className="h-5 w-5 text-primary-700" aria-hidden="true" />
                    <div className="mt-3 text-lg font-black text-gray-950">
                      {freshness?.publishAggregate
                        ? `${freshness.recentlyObserved}/${auditData.targetCount}`
                        : 'Withheld'}
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-700">
                      recent-observation coverage
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-gray-500">
                      {freshness?.publishAggregate
                        ? `${freshness.percent}% have an observation within the ${PARK_RECENT_WINDOW_DAYS}-day park freshness window.`
                        : `Aggregate freshness requires at least ${MIN_FRESHNESS_OBSERVED_ENTITIES} parks with observations. ${auditData.observedEntities}/${auditData.targetCount} currently have any campaign observation.`}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                  <span>
                    Campaign: {formatDate(auditData.startsAt)} to{' '}
                    {formatDate(auditData.endsAt)}
                  </span>
                  <span>As of {formatDateTime(auditData.asOf)}</span>
                  <span>
                    Inventory: 13 verified current government/public parks
                  </span>
                </div>
              </>
            )}
          </Section>

          <Section className="bg-white">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="section-eyebrow">Case record</div>
                <Heading level={2}>Recent issue cases</Heading>
              </div>
              <div className="text-sm text-gray-500">
                {recentCases.length} shown
              </div>
            </div>

            {recentCases.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-[#fffdf8] p-6 text-sm text-gray-600">
                No issue cases are available.
              </div>
            ) : (
              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                {recentCases.map(item => {
                  const entityId =
                    item.entityId ??
                    item.meta.entityId ??
                    item.meta.placeId ??
                    null;
                  const locationMode =
                    item.locationMode ??
                    item.meta.locationMode ??
                    (entityId ? 'matched-entity' : 'location-only');
                  const locationLabel =
                    item.meta.locationLabel ||
                    item.meta.location ||
                    'Location not specified';

                  return (
                    <article
                      key={item.number}
                      className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                          {item.evidenceLabel}
                        </span>
                        <span
                          className={
                            item.state === 'open'
                              ? 'text-success-700'
                              : 'text-gray-500'
                          }
                        >
                          {item.state === 'open'
                            ? 'Open case'
                            : 'Closed record'}
                        </span>
                        {locationMode === 'location-only' && (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                            Location only
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 font-extrabold text-gray-950">
                        #{item.number} {item.title}
                      </h3>
                      <div className="mt-2 text-sm text-gray-600">
                        {locationLabel}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Updated {formatDate(item.updatedAt)}
                        {item.counts.confirm > 0
                          ? ' · ' +
                            item.counts.confirm +
                            ' confirmation' +
                            (item.counts.confirm === 1 ? '' : 's')
                          : ''}
                        {item.counts.resolved > 0
                          ? ' · ' +
                            item.counts.resolved +
                            ' appears-resolved signal' +
                            (item.counts.resolved === 1 ? '' : 's')
                          : ''}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {entityId && (
                          <Link
                            to={'/civic-map/' + entityId}
                            className="text-sm font-bold text-primary-700 underline underline-offset-2"
                          >
                            Place details
                          </Link>
                        )}
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                        >
                          Public case
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </Section>

          <Section className="bg-primary-900 text-white">
            <div className="section-eyebrow !text-white/80">Case lifecycle</div>
            <Heading level={2} className="text-white">
              Recorded evidence states
            </Heading>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {[
                ['1', 'Community submitted'],
                ['2', 'BetterMakati reviewed'],
                ['3', 'Forwarded'],
                ['4', 'Authority acknowledged'],
                ['5', 'Action reported'],
                ['6', 'Community verified resolved'],
              ].map(([step, label]) => (
                <div
                  key={step}
                  className="rounded-xl border border-white/15 bg-white/5 p-4"
                >
                  <div className="text-lg font-extrabold text-secondary-500">
                    {step}
                  </div>
                  <div className="mt-1 text-sm font-bold text-white">
                    {label}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-4xl text-sm leading-relaxed text-primary-100">
              A referral attempt, authority acknowledgement, action evidence and
              documented resolution remain separate evidence states.
            </p>
          </Section>
        </>
      )}
    </>
  );
}
