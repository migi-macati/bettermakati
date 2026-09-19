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
} from 'lucide-react';
import { Link } from 'react-router';
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

export default function Accountability() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');

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
        <div className="section-eyebrow">Radical accountability</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Accountability Ledger</Heading>
            <p className="max-w-3xl text-gray-700">
              Follow what the public record says was planned, who or which office
              is responsible, what later evidence reports, and what BetterMakati
              still cannot establish.
            </p>
          </div>
          <SharePage title="Makati Accountability Ledger | BetterMakati" />
        </div>
        <LastReviewed
          date={accountabilityReviewed}
          note="No politician or office is scored or graded. The record is shown; citizens make the judgment."
        />

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
        <Heading level={2}>What can be followed now</Heading>

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
                    Responsible body
                  </div>
                  <div className="mt-1 font-bold text-gray-950">
                    {entry.responsibleBodies.join(' · ')}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    Target / period
                  </div>
                  <div className="mt-1 font-bold text-gray-950">
                    {entry.targetDate || entry.period}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    Public record
                  </div>
                  <div className="mt-1 font-bold text-gray-950">
                    {entry.completionPct !== undefined
                      ? entry.completionPct.toFixed(0) + '% reported completion'
                      : entry.status === 'reported'
                        ? 'Plan + actuals available'
                        : accountabilityStatusLabel[entry.status]}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                    Amount context
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

              <div className="mt-5 border-t border-gray-200 pt-5">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  Evidence
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
        <div className="section-eyebrow">Radical transparency includes absence</div>
        <Heading level={2}>What BetterMakati still cannot establish</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-700">
          These are gaps in BetterMakati&apos;s current public-record coverage,
          not accusations that the underlying activity did not occur.
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
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                <strong>Why this matters:</strong> {gap.whyItMatters}
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
        </div>
      </Section>
    </>
  );
}
