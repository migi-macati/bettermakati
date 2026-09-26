import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ClipboardList,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';

interface CivicRecord {
  number: number;
  title: string;
  kind: string;
  state: string;
  url: string;
  evidenceStatus: string;
  evidenceLabel: string;
  referralEligible: boolean;
  updatedAt: string;
  placeId?: string | null;
  locationMode?: 'matched-place' | 'location-only';
  counts: {
    confirm: number;
    resolved: number;
    support: number;
    concern: number;
    updates: number;
  };
  meta: {
    placeId?: string | null;
    locationMode?: 'matched-place' | 'location-only';
    category?: string;
    location?: string;
    locationLabel?: string;
    preferredChannel?: string;
    severity?: string;
  };
}

interface CivicReportData {
  generatedAt: string;
  weekly: {
    newCases: number;
    newProposals: number;
    openCases: number;
    corroboratedOpen: number;
    readyForReviewOrReferral: number;
    communityResolutionSignals: number;
  };
  monthly: {
    casesCreated: number;
    proposalsCreated: number;
    matureProposals: CivicRecord[];
  };
  referralQueue: CivicRecord[];
  records: CivicRecord[];
}

export default function CivicReports() {
  const [data, setData] = useState<CivicReportData | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const recentCases =
    data?.records.filter(item => item.kind === 'report').slice(0, 12) ?? [];

  useEffect(() => {
    const load = async () => {
      setFailed(false);
      try {
        const response = await fetch('/api/civic-report', { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error('report');
        setData(result);
      } catch {
        setFailed(true);
      }
    };
    void load();
  }, [attempt]);

  return (
    <>
      <SEO
        title="Civic Map Reports"
        description="Weekly and monthly BetterMakati Civic Map summaries, corroborated issue cases, referral queue and public-realm community signals."
      />

      <Section className="bg-[#fffdf8]">
        <Link to="/civic-map" className="inline-flex items-center gap-1 text-sm font-bold text-primary-700">
          <ArrowLeft className="h-4 w-4" /> Civic Map
        </Link>
        <div className="section-eyebrow mt-6">Community reports</div>
        <Heading>Civic Map reports</Heading>
        <p className="mt-3 max-w-4xl text-lg leading-relaxed text-gray-700">
          Weekly and monthly counts of issue cases, improvement proposals, referral candidates and resolution signals.
        </p>
        <LastReviewed className="mt-5" />
      </Section>

      {failed ? (
        <Section className="bg-white">
          <div className="rounded-2xl border border-warning-200 bg-warning-50 p-5 text-warning-900">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <div className="font-extrabold">Report feed unavailable</div>
                <p className="mt-1 text-sm">We could not load the community reports. Please try again.</p>
                <button type="button" onClick={() => setAttempt(value => value + 1)} className="brand-btn-secondary mt-3">Try again</button>
              </div>
            </div>
          </div>
        </Section>
      ) : !data ? (
        <Section className="bg-white">
          <div className="text-sm text-gray-500">Loading community reports…</div>
        </Section>
      ) : (
        <>
          <Section className="bg-white">
            <div className="section-eyebrow">Weekly operational brief</div>
            <Heading level={2}>Last 7 days</Heading>
            <p className="mt-2 text-sm text-gray-600">New submissions cover the last 7 days. Open cases and review queues show the current backlog.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
              {[
                ['New issue cases', data.weekly.newCases],
                ['New proposals', data.weekly.newProposals],
                ['Open cases', data.weekly.openCases],
                ['Corroborated open', data.weekly.corroboratedOpen],
                ['Ready for review/referral', data.weekly.readyForReviewOrReferral],
                ['Resolution signals', data.weekly.communityResolutionSignals],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-4">
                  <div className="text-2xl font-extrabold text-primary-800">{value}</div>
                  <div className="mt-1 text-xs font-bold leading-snug text-gray-600">{label}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section className="bg-[#f5f8f2]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="section-eyebrow">Moderation & referral queue</div>
                <Heading level={2}>Cases ready for BetterMakati review</Heading>
              </div>
              <div className="text-sm text-gray-500">{data.referralQueue.length} case{data.referralQueue.length === 1 ? '' : 's'}</div>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
              A case enters this queue when it is marked high-priority or receives at least two independent confirmations. BetterMakati still reviews jurisdiction, evidence and destination before any referral.
            </p>

            {data.referralQueue.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
                No current case has crossed the automatic review threshold.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {data.referralQueue.map(item => (
                  <article key={item.number} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                      <span className="rounded-full bg-warning-50 px-2.5 py-1 text-warning-900">Review / referral candidate</span>
                      <span className="text-gray-500">{item.evidenceLabel}</span>
                    </div>
                    <h3 className="mt-2 font-extrabold text-gray-950">#{item.number} {item.title}</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      {item.counts.confirm} confirmations
                      {item.meta.severity ? ' · ' + item.meta.severity + ' priority' : ''}
                      {item.meta.preferredChannel ? ' · suggested channel: ' + item.meta.preferredChannel : ''}
                    </div>
                    <a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2">
                      Review public case <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </article>
                ))}
              </div>
            )}
          </Section>

          <Section className="bg-white">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="section-eyebrow">Case status</div>
                <Heading level={2}>Recent issue cases</Heading>
              </div>
              <div className="text-sm text-gray-500">{recentCases.length} shown</div>
            </div>

            {recentCases.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-[#fffdf8] p-6 text-sm text-gray-600">
                No issue cases are available.
              </div>
            ) : (
              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                {recentCases.map(item => {
                  const placeId = item.placeId ?? item.meta.placeId ?? null;
                  const locationMode =
                    item.locationMode ??
                    item.meta.locationMode ??
                    (placeId ? 'matched-place' : 'location-only');
                  const locationLabel =
                    item.meta.locationLabel || item.meta.location || 'Location not specified';

                  return (
                    <article
                      key={item.number}
                      className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                          {item.evidenceLabel}
                        </span>
                        <span className={item.state === 'open' ? 'text-success-700' : 'text-gray-500'}>
                          {item.state === 'open' ? 'Open case' : 'Closed record'}
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
                        Updated {new Date(item.updatedAt).toLocaleDateString('en-PH')}
                        {item.counts.confirm > 0 ? ' · ' + item.counts.confirm + ' confirmation' + (item.counts.confirm === 1 ? '' : 's') : ''}
                        {item.counts.resolved > 0 ? ' · ' + item.counts.resolved + ' appears-resolved signal' + (item.counts.resolved === 1 ? '' : 's') : ''}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {placeId && (
                          <Link
                            to={'/civic-map/' + placeId}
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
                          Public case <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </Section>

          <Section className="bg-white">
            <div className="section-eyebrow">Monthly public-realm brief</div>
            <Heading level={2}>Last 30 days</Heading>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
                <ClipboardList className="h-5 w-5 text-primary-700" />
                <div className="mt-3 text-3xl font-extrabold text-gray-950">{data.monthly.casesCreated}</div>
                <div className="text-sm font-bold text-gray-700">issue cases created</div>
              </div>
              <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
                <TrendingUp className="h-5 w-5 text-primary-700" />
                <div className="mt-3 text-3xl font-extrabold text-gray-950">{data.monthly.proposalsCreated}</div>
                <div className="text-sm font-bold text-gray-700">improvement proposals</div>
              </div>
            </div>

            <div className="mt-8">
              <Heading level={3}>Proposals with community support</Heading>
              {data.monthly.matureProposals.length === 0 ? (
                <p className="mt-3 text-sm text-gray-600">No open proposal has reached the pilot threshold of three community supports yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {data.monthly.matureProposals.map(item => (
                    <article key={item.number} className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                      <div className="font-extrabold text-gray-950">#{item.number} {item.title}</div>
                      <div className="mt-1 text-sm text-gray-600">{item.counts.support} supports · {item.counts.concern} concerns/trade-offs</div>
                      <a href={item.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2">
                        Open proposal <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </Section>

          <Section className="bg-primary-900 text-white">
            <div className="section-eyebrow !text-white/80">Case lifecycle</div>
            <Heading level={2} className="text-white">Recorded evidence states</Heading>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {[
                ['1', 'Community submitted'],
                ['2', 'BetterMakati reviewed'],
                ['3', 'Forwarded'],
                ['4', 'Authority acknowledged'],
                ['5', 'Action reported'],
                ['6', 'Community verified resolved'],
              ].map(([step, label]) => (
                <div key={step} className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <div className="text-lg font-extrabold text-secondary-500">{step}</div>
                  <div className="mt-1 text-sm font-bold text-white">{label}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-4xl text-sm leading-relaxed text-primary-100">
              Community corroboration and “appears resolved” responses are evidence signals, not automatic lifecycle promotions.
            </p>
          </Section>
        </>
      )}
    </>
  );
}
