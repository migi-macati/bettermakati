import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Download,
  ExternalLink,
  FileSearch,
  Landmark,
  ReceiptText,
  Search,
  ShieldCheck,
  Target,
  WalletCards,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import {
  accountabilityCoverageGaps,
  accountabilityEntries,
  accountabilityReviewed,
  accountabilityStatusLabel,
} from '../data/accountability';
import type { AccountabilityEntry } from '../data/civicTypes';

const money = (millions?: number) => {
  if (millions === undefined) return '—';
  if (Math.abs(millions) >= 1000) return '₱' + (millions / 1000).toFixed(2) + 'B';
  return '₱' + millions.toFixed(2) + 'M';
};

const typeLabel: Record<AccountabilityEntry['type'], string> = {
  project: 'Project / procurement',
  fiscal: 'Budget & spending',
  service: 'Service standard',
  audit: 'Audit',
  commitment: 'Public commitment',
};

const recordYear = (entry: AccountabilityEntry) => {
  const match = entry.period.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : 0;
};

const recordAmount = (entry: AccountabilityEntry) =>
  entry.reportedAmountM ??
  entry.plannedAmountM ??
  entry.actualAmountM ??
  entry.procurement?.awardedAmountM ??
  0;

const hasEvidenceGap = (entry: AccountabilityEntry) =>
  entry.status === 'source-gap' ||
  Boolean(entry.procurement?.stages.some(stage => stage.status === 'source-gap')) ||
  Boolean(
    entry.audit?.followUpStatus &&
      /(not yet|missing|not linked|incomplete|unresolved)/i.test(
        entry.audit.followUpStatus
      )
  ) ||
  entry.commitment?.outcomeStatus === 'source-gap';

const hasLaterEvidence = (entry: AccountabilityEntry) =>
  entry.status === 'completed' ||
  entry.completionPct !== undefined ||
  Boolean(
    entry.procurement?.stages
      .slice(1)
      .some(stage => stage.status === 'documented')
  ) ||
  Boolean(entry.audit?.managementResponse) ||
  Boolean(entry.commitment?.evidenceDate);

const firstMissingEvidence = (entry: AccountabilityEntry) => {
  const procurementGap = entry.procurement?.stages.find(
    stage => stage.status === 'source-gap'
  );
  if (procurementGap) return procurementGap.label;
  if (
    entry.audit?.followUpStatus &&
    /(not yet|missing|not linked|incomplete|unresolved)/i.test(
      entry.audit.followUpStatus
    )
  ) {
    return 'Audit follow-up / resolution';
  }
  if (entry.commitment?.outcomeStatus === 'source-gap') {
    return 'Outcome evidence';
  }
  return undefined;
};

const commitmentOutcomeLabel = (entry: AccountabilityEntry) => {
  switch (entry.commitment?.outcomeStatus) {
    case 'delivered-late':
      return 'Delivered after target';
    case 'delivered':
      return 'Later delivery evidence found';
    case 'in-progress':
      return 'In progress';
    case 'source-gap':
      return 'Outcome evidence missing';
    default:
      return undefined;
  }
};

const publicRecordSummary = (entry: AccountabilityEntry) => {
  if (entry.procurement) {
    const documented = entry.procurement.stages.filter(
      stage => stage.status === 'documented'
    ).length;
    const total = entry.procurement.stages.length;
    const missing = firstMissingEvidence(entry);
    return missing
      ? `${documented} of ${total} tracked procurement stages have public evidence. Next gap: ${missing}.`
      : `All ${total} tracked procurement stages have public evidence.`;
  }

  if (entry.audit) {
    if (entry.audit.followUpStatus) {
      return 'The audit observation is documented. The follow-up status shown below is the latest evidence BetterMakati has located.';
    }
    return 'The audit observation is documented; later follow-through is not yet structured.';
  }

  if (entry.type === 'fiscal') {
    if (
      entry.plannedAmountM !== undefined &&
      (entry.reportedAmountM !== undefined || entry.actualAmountM !== undefined)
    ) {
      return 'Budget authority and later reported actuals are both available.';
    }
    if (entry.plannedAmountM !== undefined) {
      return 'The approved amount is documented; later spending or delivery is not linked in this record.';
    }
    return 'A reported fiscal record is available from the cited public source.';
  }

  if (entry.type === 'service') {
    return 'The published service standard is documented. BetterMakati has not independently measured actual service performance.';
  }

  if (entry.commitment) {
    const label = commitmentOutcomeLabel(entry);
    return label
      ? `${label}. The promise, target and later evidence are shown together below.`
      : 'The commitment is documented and linked to later public evidence where available.';
  }

  return entry.status === 'completed'
    ? 'The cited public source reports this as complete.'
    : 'This record shows the latest public evidence BetterMakati has located.';
};

const ledgerCsv = [
  'id,type,status,title,period,responsible_bodies,target_date,location,planned_amount_m,reported_amount_m,actual_amount_m,completion_pct,procurement_reference,supplier,bid_date,next_missing_evidence,commitment_outcome,audit_follow_up,last_verified',
  ...accountabilityEntries.map(entry =>
    [
      entry.id,
      entry.type,
      entry.status,
      entry.title,
      entry.period,
      entry.responsibleBodies.join(' / '),
      entry.targetDate || '',
      entry.location || '',
      entry.plannedAmountM ?? '',
      entry.reportedAmountM ?? '',
      entry.actualAmountM ?? '',
      entry.completionPct ?? '',
      entry.procurement?.referenceNo ?? '',
      entry.procurement?.supplier ?? '',
      entry.procurement?.bidDate ?? '',
      firstMissingEvidence(entry) ?? '',
      commitmentOutcomeLabel(entry) ?? '',
      entry.audit?.followUpStatus ?? '',
      entry.lastVerified,
    ]
      .map(value => '"' + String(value).replaceAll('"', '""') + '"')
      .join(',')
  ),
].join('\n');

type EvidenceFilter = 'All' | 'gaps' | 'later-evidence' | 'complete';
type SortMode = 'newest' | 'oldest' | 'amount-desc' | 'title';

export default function Accountability() {
  const [params] = useSearchParams();
  const barangayContext = params.get('barangay');
  const requestedType = params.get('type');
  const initialType = ['project', 'fiscal', 'service', 'audit', 'commitment'].includes(
    requestedType || ''
  )
    ? requestedType || 'All'
    : 'All';

  const [query, setQuery] = useState('');
  const [type, setType] = useState(initialType);
  const [year, setYear] = useState('All');
  const [evidence, setEvidence] = useState<EvidenceFilter>('All');
  const [sort, setSort] = useState<SortMode>('newest');

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          accountabilityEntries
            .map(recordYear)
            .filter(Boolean)
        )
      ).sort((a, b) => b - a),
    []
  );

  const stats = useMemo(() => {
    const projects = accountabilityEntries.filter(entry => entry.type === 'project');
    const procurements = accountabilityEntries.filter(entry => entry.procurement);
    const audits = accountabilityEntries.filter(entry => entry.audit);
    const services = accountabilityEntries.filter(entry => entry.type === 'service');
    const commitments = accountabilityEntries.filter(
      entry => entry.type === 'commitment'
    );
    const missingEvidence = accountabilityEntries.filter(hasEvidenceGap);
    const laterEvidence = procurements.filter(hasLaterEvidence);
    const completed = accountabilityEntries.filter(
      entry => entry.status === 'completed'
    );

    return {
      projects: projects.length,
      procurements: procurements.length,
      audits: audits.length,
      services: services.length,
      commitments: commitments.length,
      missingEvidence: missingEvidence.length,
      laterEvidence: laterEvidence.length,
      completed: completed.length,
    };
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return accountabilityEntries
      .filter(entry => {
        const typeMatch = type === 'All' || entry.type === type;
        const yearMatch = year === 'All' || String(recordYear(entry)) === year;
        const evidenceMatch =
          evidence === 'All' ||
          (evidence === 'gaps' && hasEvidenceGap(entry)) ||
          (evidence === 'later-evidence' && hasLaterEvidence(entry)) ||
          (evidence === 'complete' && entry.status === 'completed');

        const haystack = [
          entry.title,
          entry.summary,
          entry.period,
          entry.location,
          ...entry.responsibleBodies,
          entry.procurement?.referenceNo,
          entry.procurement?.supplier,
          entry.audit?.finding,
          entry.audit?.recommendation,
          entry.audit?.managementResponse,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return (
          typeMatch &&
          yearMatch &&
          evidenceMatch &&
          (!needle || haystack.includes(needle))
        );
      })
      .sort((a, b) => {
        if (sort === 'oldest') return recordYear(a) - recordYear(b);
        if (sort === 'amount-desc') return recordAmount(b) - recordAmount(a);
        if (sort === 'title') return a.title.localeCompare(b.title);
        return recordYear(b) - recordYear(a);
      });
  }, [query, type, year, evidence, sort]);

  const chooseQuestion = (nextType: AccountabilityEntry['type']) => {
    setType(nextType);
    setEvidence('All');
    window.setTimeout(
      () =>
        document
          .getElementById('ledger-records')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      0
    );
  };

  const clearFilters = () => {
    setQuery('');
    setType('All');
    setYear('All');
    setEvidence('All');
    setSort('newest');
  };

  return (
    <>
      <SEO
        title="Accountability Ledger"
        description="Follow Makati public money, projects, audit findings, service standards and public commitments from source to follow-through."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Accountability Ledger</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Follow public money, projects and promises</Heading>
            <p className="mt-2 max-w-3xl text-gray-700 leading-relaxed">
              Start with a question. BetterMakati connects public records over time so you can see what was planned, what evidence came later, and what is still missing.
            </p>
          </div>
          <SharePage title="Makati Accountability Ledger | BetterMakati" />
        </div>

        <LastReviewed
          date={accountabilityReviewed}
          note="A missing source means BetterMakati has not located public evidence for that step. It is not a finding of wrongdoing or non-performance."
        />

        {barangayContext && (
          <div className="mt-6 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm leading-relaxed text-gray-700">
            <strong>Barangay {barangayContext.replaceAll('-', ' ')}</strong> is selected. Barangay-specific accountability records are still incomplete, so citywide records remain visible.
            <Link
              to={`/get-involved?type=source&barangay=${encodeURIComponent(
                barangayContext
              )}#submission`}
              className="ml-1 font-bold text-primary-700 underline underline-offset-2"
            >
              Share a local public record.
            </Link>
          </div>
        )}

        <div className="mt-8">
          <div className="text-sm font-extrabold text-gray-950">
            What do you want to understand?
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => chooseQuestion('fiscal')}
              className="rounded-2xl border border-primary-100 bg-white p-5 text-left transition hover:border-primary-300 hover:shadow-sm"
            >
              <ReceiptText className="h-5 w-5 text-primary-700" />
              <div className="mt-3 font-extrabold text-gray-950">
                Where is public money going?
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                Budgets, major appropriations, dedicated funds and reported actuals.
              </p>
            </button>

            <button
              type="button"
              onClick={() => chooseQuestion('project')}
              className="rounded-2xl border border-primary-100 bg-white p-5 text-left transition hover:border-primary-300 hover:shadow-sm"
            >
              <ClipboardList className="h-5 w-5 text-primary-700" />
              <div className="mt-3 font-extrabold text-gray-950">
                What happened to a project or purchase?
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                Follow awards toward contracts, implementation and completion evidence.
              </p>
            </button>

            <button
              type="button"
              onClick={() => chooseQuestion('audit')}
              className="rounded-2xl border border-secondary-200 bg-white p-5 text-left transition hover:border-secondary-400 hover:shadow-sm"
            >
              <Landmark className="h-5 w-5 text-secondary-800" />
              <div className="mt-3 font-extrabold text-gray-950">
                What did COA flag?
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                Read the observation, recommendation, response and known follow-up.
              </p>
            </button>

            <button
              type="button"
              onClick={() => chooseQuestion('service')}
              className="rounded-2xl border border-primary-100 bg-white p-5 text-left transition hover:border-primary-300 hover:shadow-sm"
            >
              <ShieldCheck className="h-5 w-5 text-primary-700" />
              <div className="mt-3 font-extrabold text-gray-950">
                What service standard was published?
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                See what the city says a transaction should take or require.
              </p>
            </button>

            <button
              type="button"
              onClick={() => chooseQuestion('commitment')}
              className="rounded-2xl border border-primary-100 bg-white p-5 text-left transition hover:border-primary-300 hover:shadow-sm"
            >
              <Target className="h-5 w-5 text-primary-700" />
              <div className="mt-3 font-extrabold text-gray-950">
                What did the city promise?
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                Compare a sourced promise or target with later delivery evidence.
              </p>
            </button>
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
          <div className="flex items-start gap-3">
            <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
            <div>
              <div className="font-extrabold text-gray-950">
                How to read this ledger
              </div>
              <p className="mt-1 max-w-4xl text-sm leading-relaxed text-gray-600">
                The goal is a chain: <strong>plan → budget → bid/award → contract/NTP → delivery → audit/outcome</strong>. A record stops where the public evidence stops. “Source gap” means the next document or proof has not been found yet.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">
              {stats.projects}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              projects / procurements tracked
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEvidence('gaps');
              setType('All');
              document
                .getElementById('ledger-records')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-2xl border border-secondary-200 bg-secondary-50 p-5 text-left transition hover:border-secondary-400"
          >
            <div className="text-3xl font-extrabold text-gray-950">
              {stats.missingEvidence}
            </div>
            <div className="mt-1 text-sm text-gray-700">
              records with a follow-up evidence gap
            </div>
          </button>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">
              {stats.audits}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              structured audit observations
            </div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-gray-950">
              {stats.commitments}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              public commitments currently indexed
            </div>
          </div>
        </div>

        {stats.commitments === 0 && (
          <div className="mt-4 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm leading-relaxed text-gray-700">
            <strong>Known coverage gap:</strong> public promises and measurable targets are not yet systematically indexed. BetterMakati will only add a commitment when an official source clearly states who committed to what and, where available, by when.
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(ledgerCsv)}`}
            download="bettermakati-accountability-ledger.csv"
            className="brand-btn-secondary"
          >
            <Download className="h-4 w-4" /> Download data
          </a>
          <Link
            to="/get-involved?type=source#submission"
            className="brand-btn-primary"
          >
            Share missing evidence
          </Link>
        </div>
      </Section>

      <Section id="ledger-records" className="scroll-mt-24 bg-white">
        <div className="section-eyebrow">Explore the evidence</div>
        <Heading level={2}>Find a record</Heading>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
          Search in plain language. You can also filter for records where the next public document is still missing.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,0.7fr))]">
          <label className="relative">
            <span className="sr-only">Search accountability records</span>
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search project, supplier, office, reference number…"
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <select
            value={type}
            onChange={event => setType(event.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
            aria-label="Filter by record type"
          >
            <option value="All">All topics</option>
            <option value="project">Projects / procurement</option>
            <option value="fiscal">Budget & spending</option>
            <option value="service">Service standards</option>
            <option value="audit">Audit</option>
            <option value="commitment">Public commitments</option>
          </select>

          <select
            value={year}
            onChange={event => setYear(event.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
            aria-label="Filter by year"
          >
            <option value="All">All years</option>
            {years.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={evidence}
            onChange={event =>
              setEvidence(event.target.value as EvidenceFilter)
            }
            className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
            aria-label="Filter by evidence status"
          >
            <option value="All">All evidence states</option>
            <option value="gaps">Missing next evidence</option>
            <option value="later-evidence">Has later evidence</option>
            <option value="complete">Reported complete</option>
          </select>

          <select
            value={sort}
            onChange={event => setSort(event.target.value as SortMode)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm"
            aria-label="Sort accountability records"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amount-desc">Largest amount first</option>
            <option value="title">A–Z</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            <strong className="text-gray-950">{visible.length}</strong> matching records
          </div>
          {(query || type !== 'All' || year !== 'All' || evidence !== 'All') && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-bold text-primary-700 underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {visible.map(entry => {
            const missing = firstMissingEvidence(entry);
            const documentedStages =
              entry.procurement?.stages.filter(
                stage => stage.status === 'documented'
              ).length ?? 0;
            const totalStages = entry.procurement?.stages.length ?? 0;

            return (
              <article
                key={entry.id}
                id={entry.id}
                className="scroll-mt-28 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 md:p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.07em]">
                      <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                        {typeLabel[entry.type]}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-gray-700">
                        {accountabilityStatusLabel[entry.status]}
                      </span>
                      {missing && (
                        <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-secondary-900">
                          Next evidence missing
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-extrabold leading-snug text-gray-950 md:text-xl">
                      {entry.title}
                    </h3>
                    <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
                      {entry.summary}
                    </p>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-gray-500">
                    {entry.period}
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-primary-100 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.07em] text-primary-700">
                    What the public can say from the evidence
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-700">
                    {publicRecordSummary(entry)}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs text-gray-500">Responsible body</div>
                    <div className="mt-1 text-sm font-extrabold text-gray-950">
                      {entry.responsibleBodies.join(' · ')}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs text-gray-500">Date / period</div>
                    <div className="mt-1 text-sm font-extrabold text-gray-950">
                      {entry.targetDate || entry.period}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs text-gray-500">Amount shown</div>
                    <div className="mt-1 text-sm font-extrabold text-gray-950">
                      {entry.reportedAmountM !== undefined
                        ? money(entry.reportedAmountM)
                        : entry.plannedAmountM !== undefined
                          ? money(entry.plannedAmountM)
                          : entry.actualAmountM !== undefined
                            ? money(entry.actualAmountM)
                            : 'Not stated'}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs text-gray-500">
                      {missing ? 'Next missing evidence' : 'Latest status'}
                    </div>
                    <div className="mt-1 text-sm font-extrabold text-gray-950">
                      {missing ||
                        (entry.completionPct !== undefined
                          ? entry.completionPct.toFixed(0) +
                            '% reported completion'
                          : accountabilityStatusLabel[entry.status])}
                    </div>
                  </div>
                </div>

                {entry.procurement && (
                  <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.07em] text-gray-500">
                          Procurement trail
                        </div>
                        <div className="mt-1 text-sm font-extrabold text-gray-950">
                          {documentedStages} of {totalStages} tracked stages documented
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {entry.procurement.referenceNo}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Procurement evidence progress">
                      {entry.procurement.stages.map(stage => (
                        <div
                          key={stage.label}
                          title={stage.label}
                          className={
                            'h-2 rounded-full ' +
                            (stage.status === 'documented'
                              ? 'bg-primary-600'
                              : 'bg-secondary-200')
                          }
                        />
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="text-sm text-gray-700">
                        <span className="text-gray-500">Winning bidder:</span>{' '}
                        <strong>{entry.procurement.supplier || 'Not stated'}</strong>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="text-gray-500">Winning bid:</span>{' '}
                        <strong>{money(entry.procurement.awardedAmountM)}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {entry.commitment && (
                  <div className="mt-4 rounded-xl border border-primary-100 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs font-bold uppercase tracking-[0.07em] text-primary-700">
                        Commitment follow-through
                      </div>
                      <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-800">
                        {commitmentOutcomeLabel(entry)}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="rounded-xl bg-gray-50 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.06em] text-gray-500">
                          Promise
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          {entry.commitment.commitmentText}
                        </p>
                        {entry.commitment.announcedDate && (
                          <div className="mt-2 text-xs text-gray-500">
                            Announced {entry.commitment.announcedDate}
                          </div>
                        )}
                      </div>
                      <div className="rounded-xl bg-gray-50 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.06em] text-gray-500">
                          Target
                        </div>
                        <div className="mt-2 text-sm font-extrabold text-gray-950">
                          {entry.commitment.target || 'No deadline stated in source'}
                        </div>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.06em] text-gray-500">
                          Latest evidence
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          {entry.commitment.outcome}
                        </p>
                        {entry.commitment.evidenceDate && (
                          <div className="mt-2 text-xs text-gray-500">
                            Evidence date {entry.commitment.evidenceDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <details className="mt-4 rounded-xl border border-gray-200 bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-bold text-gray-950">
                    <span>See details, evidence trail and sources</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                  </summary>

                  <div className="border-t border-gray-200 p-4">
                    {entry.type === 'fiscal' && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-gray-50 p-4">
                          <span className="text-xs text-gray-500">Approved budget</span>
                          <div className="font-extrabold text-gray-950">
                            {money(entry.plannedAmountM)}
                          </div>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4">
                          <span className="text-xs text-gray-500">Reported receipts</span>
                          <div className="font-extrabold text-gray-950">
                            {money(entry.reportedAmountM)}
                          </div>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4">
                          <span className="text-xs text-gray-500">Reported expenditures</span>
                          <div className="font-extrabold text-gray-950">
                            {money(entry.actualAmountM)}
                          </div>
                        </div>
                      </div>
                    )}

                    {entry.procurement && (
                      <div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                          {entry.procurement.stages.map(stage => (
                            <div
                              key={stage.label}
                              className={
                                'rounded-xl border p-4 ' +
                                (stage.status === 'documented'
                                  ? 'border-primary-100 bg-primary-50'
                                  : 'border-secondary-200 bg-secondary-50')
                              }
                            >
                              <div className="text-xs font-bold uppercase tracking-[0.06em] text-gray-500">
                                {stage.status === 'documented'
                                  ? 'Documented'
                                  : 'Source gap'}
                              </div>
                              <div className="mt-1 font-extrabold text-gray-950">
                                {stage.label}
                              </div>
                              {stage.date && (
                                <div className="mt-1 text-xs text-gray-500">
                                  {stage.date}
                                </div>
                              )}
                              {stage.detail && (
                                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                                  {stage.detail}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.audit && (
                      <div className="space-y-3">
                        <div className="rounded-xl bg-gray-50 p-4">
                          <div className="text-xs font-bold uppercase tracking-[0.06em] text-gray-500">
                            COA finding / observation
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-gray-700">
                            {entry.audit.finding}
                          </p>
                        </div>

                        {entry.audit.recommendation && (
                          <div className="rounded-xl bg-gray-50 p-4">
                            <div className="text-xs font-bold uppercase tracking-[0.06em] text-gray-500">
                              COA recommendation
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-gray-700">
                              {entry.audit.recommendation}
                            </p>
                          </div>
                        )}

                        {entry.audit.managementResponse && (
                          <div className="rounded-xl bg-gray-50 p-4">
                            <div className="text-xs font-bold uppercase tracking-[0.06em] text-gray-500">
                              Management response
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-gray-700">
                              {entry.audit.managementResponse}
                            </p>
                          </div>
                        )}

                        {entry.audit.followUpStatus && (
                          <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-4">
                            <div className="text-xs font-bold uppercase tracking-[0.06em] text-secondary-800">
                              Follow-up status
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-gray-700">
                              {entry.audit.followUpStatus}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-5 border-t border-gray-200 pt-5">
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                        Source evidence
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        {entry.sources.map(source => (
                          <a
                            key={source.url + source.label}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2"
                          >
                            {source.label}{' '}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ))}
                      </div>

                      {entry.notes && (
                        <ul className="mt-3 space-y-1 text-xs leading-relaxed text-gray-500">
                          {entry.notes.map(note => (
                            <li key={note}>• {note}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {entry.relatedHref && (
                        <Link
                          to={entry.relatedHref}
                          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
                        >
                          Related BetterMakati page
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        to={`/get-involved?type=source&record=${encodeURIComponent(
                          entry.id
                        )}&title=${encodeURIComponent(entry.title)}#submission`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Have a missing document? Share it
                      </Link>
                    </div>
                  </div>
                </details>
              </article>
            );
          })}

          {visible.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <FileSearch className="mx-auto h-6 w-6 text-gray-400" />
              <div className="mt-3 font-extrabold text-gray-950">
                No matching record yet
              </div>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
                Try removing a filter. If you know of a public record that should be here, send the source and BetterMakati can review it.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="brand-btn-secondary"
                >
                  Clear filters
                </button>
                <Link
                  to="/get-involved?type=source#submission"
                  className="brand-btn-primary"
                >
                  Share a public source
                </Link>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Help improve the public record</div>
        <Heading level={2}>Where evidence is still incomplete</Heading>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">
          These are gaps in BetterMakati’s public-record coverage, not findings against the city, an office, supplier or official.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {accountabilityCoverageGaps.map(gap => (
            <article
              key={gap.id}
              className="rounded-2xl border border-secondary-200 bg-white p-5"
            >
              <AlertCircle className="h-5 w-5 text-secondary-800" />
              <h3 className="mt-3 font-extrabold text-gray-950">{gap.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {gap.description}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                <strong>Why it matters:</strong> {gap.whyItMatters}
              </p>
              <div className="mt-3 text-xs text-gray-500">
                Last checked: {gap.lastChecked}
              </div>
              <Link
                to={`/get-involved?type=source&gap=${encodeURIComponent(
                  gap.id
                )}#submission`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
              >
                Share evidence for this gap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-primary-100 bg-white p-6">
          <WalletCards className="h-5 w-5 text-primary-700" />
          <h3 className="mt-3 text-lg font-extrabold text-gray-950">
            Want the original records instead?
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
            The ledger is the citizen-facing explanation and follow-through layer. The Public Records index is where you can browse the underlying source collections.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/records" className="brand-btn-secondary">
              Public Records
            </Link>
            <Link to="/projects-budget" className="brand-btn-secondary">
              Projects & Budget
            </Link>
            <Link to="/integrity" className="brand-btn-secondary">
              Integrity & Audit
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
