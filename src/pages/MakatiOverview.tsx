import { ArrowRight, BarChart3, ClipboardCheck, FileText, MapPinned, Vote, WalletCards } from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import { barangays } from '../data/barangays';
import {
  actualFiscalHistory,
  annualBudgetDocuments,
  budgetByType2026,
  budgetSummary,
  budgetSummary2026,
} from '../data/budget2025';

const pesoB = (millions: number) => '₱' + (millions / 1000).toFixed(2).replace(/\.00$/, '') + 'B';
const pct = (value: number) => value.toFixed(1) + '%';

export default function MakatiOverview() {
  const population = barangays.reduce((sum, barangay) => sum + barangay.population2024, 0);
  const largestBarangay = [...barangays].sort((a, b) => b.population2024 - a.population2024)[0];
  const largestBarangayShare = (largestBarangay.population2024 / population) * 100;
  const budgetChange =
    ((budgetSummary2026.totalBudgetM - budgetSummary.totalBudgetM) /
      budgetSummary.totalBudgetM) *
    100;
  const mooeShare =
    budgetByType2026.find(item => item.label === 'Maintenance & Other Operating Expenses')
      ?.share ?? 0;
  const latestActual = actualFiscalHistory[actualFiscalHistory.length - 1];

  const findings = [
    {
      kicker: '2026 budget plan',
      value: pesoB(budgetSummary2026.totalBudgetM),
      title: `The proposed city budget is ${pct(budgetChange)} larger than the 2025 budget.`,
      detail:
        'This compares budget authority: ₱21.0B for 2026 against ₱19.0B for 2025. It should not be read as actual spending.',
      href: '/projects-budget#budget',
      citation: '[1]',
      icon: WalletCards,
    },
    {
      kicker: 'Where the plan goes',
      value: pct(mooeShare),
      title: 'Nearly half of the 2026 budget is Maintenance & Other Operating Expenses.',
      detail:
        'MOOE covers operating programs, supplies, services and assistance. BetterMakati keeps it separate from personnel, capital outlay and special-purpose appropriations.',
      href: '/projects-budget#budget',
      citation: '[1]',
      icon: BarChart3,
    },
    {
      kicker: '2024 population',
      value: population.toLocaleString('en-PH'),
      title: `Makati has ${barangays.length} barangays under the current city boundary.`,
      detail: `${largestBarangay.name} is the largest by 2024 population at ${largestBarangay.population2024.toLocaleString('en-PH')}, or about ${pct(largestBarangayShare)} of the city total.`,
      href: '/statistics',
      citation: '[2]',
      icon: MapPinned,
    },
    {
      kicker: 'Latest fiscal actuals',
      value: pesoB(latestActual.receiptsM),
      title: `Reported 2025 receipts exceeded reported expenditures by ${pesoB(budgetSummary.receiptsLessExpendituresM)}.`,
      detail: `DBM/BLGF actuals indexed by BetterMakati show ${pesoB(latestActual.receiptsM)} in receipts and ${pesoB(latestActual.expendituresM)} in expenditures for 2025. These are actual fiscal records, not the same measure as the annual budget plan.`,
      href: '/projects-budget#budget',
      citation: '[1]',
      icon: ClipboardCheck,
    },
  ];

  const evidenceAreas = [
    {
      title: 'Barangays',
      description: 'Local profiles, population context, services, contacts, public places and scoped civic tools.',
      href: '/barangays',
      citation: '[3]',
    },
    {
      title: 'Elections & voting',
      description: 'City and barangay results, historical races, turnout and voter information.',
      href: '/elections',
      citation: '[4]',
      icon: Vote,
    },
    {
      title: 'Accountability',
      description: 'Plans, projects, fiscal records, procurement, audits, commitments and visible evidence gaps.',
      href: '/accountability',
      citation: '[5]',
      icon: ClipboardCheck,
    },
    {
      title: 'Public records',
      description: 'Source documents and structured civic datasets used throughout BetterMakati.',
      href: '/records',
      citation: '[6]',
      icon: FileText,
    },
  ];

  return (
    <>
      <SEO
        title="Makati Overview"
        description="A cited synthesis of key information across BetterMakati, including city finances, population, barangays and civic records."
      />

      <Section className="bg-[#fffdf8]">
        <Link
          to="/reports"
          className="text-sm font-bold text-primary-700 underline underline-offset-2"
        >
          Reports & insights
        </Link>
        <div className="mt-5 section-eyebrow">Makati Overview · 23 September 2026</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>What the information across BetterMakati says about the city</Heading>
          <SharePage title="Makati Overview | BetterMakati" />
        </div>
        <p className="mt-4 max-w-4xl text-gray-700 leading-relaxed">
          This report is a synthesis of information already published elsewhere on
          BetterMakati. It prioritizes findings that can be traced to structured data
          or public records on the site. Internal citations lead to the relevant
          BetterMakati page first; the original public sources are available there.
        </p>
        <LastReviewed note="Updated 23 September 2026. Budget plans and fiscal actuals are deliberately kept separate." />

        <div className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            Reading rule
          </div>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
            A figure in this report is not a new BetterMakati estimate unless stated.
            Follow the citation to inspect the underlying page, definitions,
            limitations and original source before using it for a consequential
            decision.
          </p>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Key takeaways</div>
        <Heading level={2}>Four things that stand out in the current data</Heading>
        <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {findings.map(item => {
            const Icon = item.icon;
            return (
              <article key={item.kicker} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {item.kicker}
                  </div>
                  <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                </div>
                <div className="mt-4 text-3xl font-extrabold tracking-tight text-primary-800">
                  {item.value}
                </div>
                <h3 className="mt-2 text-lg font-extrabold text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.detail}</p>
                <Link
                  to={item.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                  aria-label={`Open supporting BetterMakati page ${item.citation}`}
                >
                  {item.citation} See the supporting data <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Coverage</div>
        <Heading level={2}>What this overview draws from</Heading>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
          The report is intentionally broader than the four headline findings. These
          sections provide the wider civic context and are the basis for future
          topic-specific reports.
        </p>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          {evidenceAreas.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.href}
                className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                {Icon && <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />}
                <div className={Icon ? 'mt-4' : ''}>
                  <h3 className="font-extrabold text-gray-950">
                    {item.citation} {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-2xl font-extrabold text-primary-800">
              {annualBudgetDocuments[annualBudgetDocuments.length - 1].year}–{annualBudgetDocuments[0].year}
            </div>
            <div className="mt-1 font-bold text-gray-900">annual budget documents indexed</div>
            <p className="mt-1 text-xs text-gray-500">See citation [1].</p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-2xl font-extrabold text-primary-800">
              {actualFiscalHistory[0].year}–{latestActual.year}
            </div>
            <div className="mt-1 font-bold text-gray-900">fiscal actuals currently structured</div>
            <p className="mt-1 text-xs text-gray-500">See citation [1].</p>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Citations & method</div>
        <Heading level={2}>Internal first, original source one level deeper</Heading>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-600">
          BetterMakati pages are cited first because this report is specifically a
          synthesis of the website. Each cited page carries its own links to original
          government, statistical, election, audit or other public records.
        </p>

        <ol className="mt-6 space-y-3 text-sm text-gray-700">
          <li>
            <Link to="/projects-budget" className="font-bold text-primary-700 underline underline-offset-2">
              [1] Projects & Budget
            </Link>{' '}
            — 2025–2026 budget comparison, 2026 appropriation structure and 2019–2025 fiscal actuals.
          </li>
          <li>
            <Link to="/statistics" className="font-bold text-primary-700 underline underline-offset-2">
              [2] Makati Statistics
            </Link>{' '}
            — 2024 population and comparable city indicators.
          </li>
          <li>
            <Link to="/barangays" className="font-bold text-primary-700 underline underline-offset-2">
              [3] Barangays
            </Link>{' '}
            — current 23-barangay structure and local profiles.
          </li>
          <li>
            <Link to="/elections" className="font-bold text-primary-700 underline underline-offset-2">
              [4] Elections & Voting
            </Link>{' '}
            — sourced election results, history and voter information.
          </li>
          <li>
            <Link to="/accountability" className="font-bold text-primary-700 underline underline-offset-2">
              [5] Accountability Ledger
            </Link>{' '}
            — source-linked fiscal, project, procurement, audit and commitment records.
          </li>
          <li>
            <Link to="/records" className="font-bold text-primary-700 underline underline-offset-2">
              [6] Public Records
            </Link>{' '}
            — documents and datasets used across BetterMakati.
          </li>
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/reports" className="brand-btn-secondary">
            All reports
          </Link>
          <Link to="/get-involved?type=correction#submission" className="brand-btn-primary">
            Report a correction
          </Link>
        </div>
      </Section>
    </>
  );
}
