import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Scale,
  Search,
  WalletCards,
  Download,
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

const money = (millions?: number) => {
  if (millions === undefined) return '—';
  if (Math.abs(millions) >= 1000) return '₱' + (millions / 1000).toFixed(2) + 'B';
  return '₱' + millions.toFixed(2) + 'M';
};

const ledgerCsv = [
  'id,type,status,title,period,responsible_bodies,target_date,location,planned_amount_m,reported_amount_m,actual_amount_m,completion_pct,procurement_reference,supplier,bid_date,audit_follow_up,last_verified',
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
      entry.audit?.followUpStatus ?? '',
      entry.lastVerified,
    ]
      .map(value => '"' + String(value).replaceAll('"', '""') + '"')
      .join(',')
  ),
].join('\n');

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

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return accountabilityEntries.filter(entry => {
      const typeMatch = type === 'All' || entry.type === type;
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
      return typeMatch && (!needle || haystack.includes(needle));
    });
  }, [query, type]);

  const completed = accountabilityEntries.filter(
    entry => entry.status === 'completed'
  ).length;

  return (
    <>
      <SEO
        title="Accountability Ledger"
        description="Track sourced Makati public commitments, projects, fiscal records, responsible bodies, evidence and known information gaps."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Accountability Ledger</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Track plans & projects</Heading>
            <p className="max-w-3xl text-gray-700">
              See what was planned, who is responsible, when it is due, the money involved and the latest public evidence.
            </p>
          </div>
          <SharePage title="Makati Accountability Ledger | BetterMakati" />
        </div>
        <LastReviewed
          date={accountabilityReviewed}
          note="Records are sourced; no ratings are assigned."
        />
        <div className="mt-4">
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(ledgerCsv)}`}
            download="bettermakati-accountability-ledger.csv"
            className="brand-btn-secondary"
          >
            <Download className="h-4 w-4" /> Download ledger CSV
          </a>
        </div>

        {barangayContext && (
          <div className="mt-6 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-gray-700">
            Local context: <strong>{barangayContext.replaceAll('-', ' ')}</strong>. Citywide records remain visible until a source supports a barangay tag.
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <FileSearch className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-3xl font-extrabold text-gray-950">
              {accountabilityEntries.length}
            </div>
            <div className="text-sm text-gray-600">structured records</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <CheckCircle2 className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-3xl font-extrabold text-gray-950">
              {completed}
            </div>
            <div className="text-sm text-gray-600">reported complete</div>
          </div>
          <div className="rounded-2xl border border-secondary-200 bg-secondary-50 p-5">
            <AlertCircle className="h-5 w-5 text-secondary-800" />
            <div className="mt-3 text-3xl font-extrabold text-gray-950">
              {accountabilityCoverageGaps.length}
            </div>
            <div className="text-sm text-gray-600">published coverage gaps</div>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Trace the record</div>
        <Heading level={2}>What the public record shows</Heading>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search accountability records</span>
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search project, office, period or location"
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <select
            value={type}
            onChange={event => setType(event.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3"
            aria-label="Filter accountability record type"
          >
            <option>All</option>
            <option value="project">Projects</option>
            <option value="fiscal">Fiscal records</option>
            <option value="service">Services</option>
            <option value="audit">Audit</option>
            <option value="commitment">Commitments</option>
          </select>
        </div>

        <div className="mt-7 space-y-5">
          {visible.map(entry => (
            <article
              key={entry.id}
              id={entry.id}
              className="scroll-mt-28 rounded-2xl border border-gray-200 bg-[#fffdf8] p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.08em]">
                    <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                      {entry.type}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-gray-700">
                      {accountabilityStatusLabel[entry.status]}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-extrabold text-gray-950">
                    {entry.title}
                  </h3>
                  <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
                    {entry.summary}
                  </p>
                </div>
                <div className="shrink-0 text-sm text-gray-500">
                  {entry.period}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    Who is responsible
                  </div>
                  <div className="mt-1 font-bold text-gray-950">
                    {entry.responsibleBodies.join(' · ')}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    When
                  </div>
                  <div className="mt-1 font-bold text-gray-950">
                    {entry.targetDate || entry.period}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    What happened
                  </div>
                  <div className="mt-1 font-bold text-gray-950">
                    {entry.completionPct !== undefined
                      ? entry.completionPct.toFixed(0) + '% reported completion'
                      : entry.status === 'reported' && entry.type === 'fiscal'
                        ? 'Published fiscal record'
                        : accountabilityStatusLabel[entry.status]}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    Money
                  </div>
                  <div className="mt-1 font-bold text-gray-950">
                    {entry.reportedAmountM !== undefined
                      ? money(entry.reportedAmountM)
                      : money(entry.plannedAmountM)}
                  </div>
                </div>
              </div>

              {entry.type === 'fiscal' && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white p-4 border border-gray-200">
                    <span className="text-xs text-gray-500">Approved budget</span>
                    <div className="font-extrabold text-gray-950">
                      {money(entry.plannedAmountM)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-4 border border-gray-200">
                    <span className="text-xs text-gray-500">Reported receipts</span>
                    <div className="font-extrabold text-gray-950">
                      {money(entry.reportedAmountM)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-4 border border-gray-200">
                    <span className="text-xs text-gray-500">Reported expenditures</span>
                    <div className="font-extrabold text-gray-950">
                      {money(entry.actualAmountM)}
                    </div>
                  </div>
                </div>
              )}

              {entry.procurement && (
                <div className="mt-4 rounded-2xl border border-primary-100 bg-white p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    Procurement trace
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-xs text-gray-500">Reference</div>
                      <div className="mt-1 font-extrabold text-gray-950">
                        {entry.procurement.referenceNo}
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-xs text-gray-500">Approved budget</div>
                      <div className="mt-1 font-extrabold text-gray-950">
                        {money(entry.procurement.approvedBudgetM)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-xs text-gray-500">Winning bid</div>
                      <div className="mt-1 font-extrabold text-gray-950">
                        {money(entry.procurement.awardedAmountM)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-xs text-gray-500">Supplier / bidder</div>
                      <div className="mt-1 font-extrabold text-gray-950">
                        {entry.procurement.supplier || '—'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
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
                          {stage.status === 'documented' ? 'Documented' : 'Source gap'}
                        </div>
                        <div className="mt-1 font-extrabold text-gray-950">
                          {stage.label}
                        </div>
                        {stage.date && (
                          <div className="mt-1 text-xs text-gray-500">{stage.date}</div>
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
                <div className="mt-4 rounded-2xl border border-secondary-200 bg-white p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-secondary-800">
                    Audit follow-through
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.06em] text-gray-500">
                        Finding / observation
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
                </div>
              )}

              <div className="mt-5 border-t border-gray-200 pt-5">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  Source evidence
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {entry.sources.map(source => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2"
                    >
                      {source.label} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
                {entry.notes && (
                  <ul className="mt-3 space-y-1 text-xs leading-relaxed text-gray-500">
                    {entry.notes.map(note => <li key={note}>• {note}</li>)}
                  </ul>
                )}
              </div>

              {entry.relatedHref && (
                <Link
                  to={entry.relatedHref}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
                >
                  Open the underlying BetterMakati record
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </article>
          ))}

          {visible.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
              No indexed accountability record matches this search yet.
            </div>
          )}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Coverage</div>
        <Heading level={2}>Coverage gaps</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-700">
          Missing links in the current public-record index.
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {accountabilityCoverageGaps.map(gap => (
            <article
              key={gap.id}
              className="rounded-2xl border border-secondary-200 bg-white p-5"
            >
              <Scale className="h-5 w-5 text-secondary-800" />
              <h3 className="mt-3 font-extrabold text-gray-950">{gap.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {gap.description}
              </p>
              <div className="mt-3 text-xs text-gray-500">
                Last checked: {gap.lastChecked}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/get-involved?type=source#submission" className="brand-btn-primary">
            Share a missing public source
          </Link>
          <Link to="/records" className="brand-btn-secondary">
            <WalletCards className="h-4 w-4" /> Public records index
          </Link>
          <Link to="/integrity" className="brand-btn-secondary">
            <Scale className="h-4 w-4" /> Integrity & public interest
          </Link>
        </div>
      </Section>
    </>
  );
}
