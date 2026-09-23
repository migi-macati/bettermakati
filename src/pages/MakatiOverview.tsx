import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  MapPinned,
  ReceiptText,
  Vote,
  WalletCards,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import { barangays } from '../data/barangays';
import {
  actualFiscalHistory,
  actualSpendingByFunction,
  annualBudgetDocuments,
  budgetByType,
  budgetByType2026,
  budgetSummary,
  budgetSummary2026,
  revenueSources,
} from '../data/budget2025';

const pesoB = (millions: number) =>
  '₱' + (millions / 1000).toFixed(2).replace(/\.00$/, '') + 'B';
const pct = (value: number) => value.toFixed(1) + '%';
const change = (from: number, to: number) => ((to - from) / from) * 100;

export default function MakatiOverview() {
  const population = barangays.reduce(
    (sum, barangay) => sum + barangay.population2024,
    0
  );
  const largestBarangays = [...barangays]
    .sort((a, b) => b.population2024 - a.population2024)
    .slice(0, 3);
  const topThreePopulation = largestBarangays.reduce(
    (sum, barangay) => sum + barangay.population2024,
    0
  );
  const topThreeShare = (topThreePopulation / population) * 100;

  const mooe2025 =
    budgetByType.find(
      item => item.label === 'Maintenance & Other Operating Expenses'
    )?.amountM ?? 0;
  const mooe2026 =
    budgetByType2026.find(
      item => item.label === 'Maintenance & Other Operating Expenses'
    )?.amountM ?? 0;
  const totalBudgetIncrease =
    budgetSummary2026.totalBudgetM - budgetSummary.totalBudgetM;
  const mooeIncrease = mooe2026 - mooe2025;
  const mooeShareOfIncrease = (mooeIncrease / totalBudgetIncrease) * 100;

  const localRevenue = revenueSources.find(item => item.label === 'Local sources');
  const externalRevenue = revenueSources.find(
    item => item.label === 'External sources'
  );
  const socialServices = actualSpendingByFunction.find(
    item => item.label === 'Social Services'
  );
  const latestActual = actualFiscalHistory[actualFiscalHistory.length - 1];

  const findings = [
    {
      id: 'budget-growth',
      kicker: '2026 budget plan',
      value: pct(mooeShareOfIncrease),
      title: `Nearly three-quarters of the ₱2B increase in the 2026 budget plan comes from higher operating expenses.`,
      detail: `MOOE rises by ${pesoB(mooeIncrease)}, from ${pesoB(mooe2025)} to ${pesoB(mooe2026)}, accounting for ${pct(mooeShareOfIncrease)} of the total increase. The overall budget grows ${pct(change(budgetSummary.totalBudgetM, budgetSummary2026.totalBudgetM))}, while capital outlay grows ${pct(change(budgetByType.find(item => item.label === 'Capital Outlay')?.amountM ?? 0, budgetByType2026.find(item => item.label === 'Capital Outlay')?.amountM ?? 0))}. These are proposed appropriations, not actual spending.`,
      href: '/projects-budget#budget',
      citation: '[1]',
      icon: WalletCards,
    },
    {
      id: 'local-revenue',
      kicker: '2025 reported receipts',
      value: pct(localRevenue?.share ?? 0),
      title: 'More than nine in ten pesos of reported 2025 receipts came from local sources.',
      detail: `Local taxes, fees, charges and local non-tax revenue account for ${pesoB(localRevenue?.amountM ?? 0)} of ${pesoB(latestActual.receiptsM)} in reported receipts. External sources account for ${pesoB(externalRevenue?.amountM ?? 0)}. This describes the reported source mix, not the burden or incidence of particular taxes.`,
      href: '/projects-budget#budget',
      citation: '[1]',
      icon: ReceiptText,
    },
    {
      id: 'social-services',
      kicker: '2025 reported spending',
      value: pct(socialServices?.share ?? 0),
      title: 'More than half of reported 2025 city spending was classified as social services.',
      detail: `Social Services account for ${pesoB(socialServices?.amountM ?? 0)}, or ${pct(socialServices?.share ?? 0)} of reported expenditure by function. The category covers health, education, welfare and related services; it does not by itself measure service quality or outcomes.`,
      href: '/projects-budget#budget',
      citation: '[1]',
      icon: BarChart3,
    },
    {
      id: 'population-concentration',
      kicker: '2024 population',
      value: pct(topThreeShare),
      title: 'Three barangays account for more than a third of Makati’s population.',
      detail: `${largestBarangays.map(item => item.name).join(', ')} together have ${topThreePopulation.toLocaleString('en-PH')} residents out of ${population.toLocaleString('en-PH')}. Population therefore varies sharply across the city’s ${barangays.length} barangays; this does not imply that public resources should be allocated by population alone.`,
      href: '/statistics',
      citation: '[2][3]',
      icon: MapPinned,
    },
  ];

  const evidenceAreas = [
    {
      title: 'Projects & Budget',
      description:
        'Budget plans, fiscal actuals, revenue sources and spending by function.',
      href: '/projects-budget',
      citation: '[1]',
      icon: BarChart3,
    },
    {
      title: 'Statistics & barangays',
      description:
        'Population, barangay profiles and citywide statistical context.',
      href: '/statistics',
      citation: '[2][3]',
      icon: MapPinned,
    },
    {
      title: 'Elections & voting',
      description:
        'Sourced election results, historical races, turnout and voter information.',
      href: '/elections',
      citation: '[4]',
      icon: Vote,
    },
    {
      title: 'Accountability & records',
      description:
        'Fiscal, project, procurement, audit and commitment records with visible evidence gaps.',
      href: '/accountability',
      citation: '[5][6]',
      icon: ClipboardCheck,
    },
  ];

  return (
    <>
      <SEO
        title="Makati Overview"
        description="A cited synthesis of material patterns across BetterMakati’s current fiscal, spending, population and civic data."
      />

      <Section className="bg-[#fffdf8]">
        <Link
          to="/reports"
          className="text-sm font-bold text-primary-700 underline underline-offset-2"
        >
          Reports & insights
        </Link>
        <div className="mt-5 section-eyebrow">
          Makati Overview · 23 September 2026
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>Four signals from Makati’s latest city data</Heading>
          <SharePage title="Makati Overview | BetterMakati" />
        </div>
        <p className="mt-4 max-w-4xl text-gray-700 leading-relaxed">
          This edition focuses only on patterns for which BetterMakati currently has
          sufficiently structured, comparable evidence. It does not force a takeaway
          from every section of the site. Each finding adds a calculation or
          cross-record comparison, then links back to the relevant BetterMakati page
          and its original public sources.
        </p>
        <LastReviewed note="Published 23 September 2026. Budget plans, fiscal actuals and descriptive population data are kept analytically separate." />

        <div className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
            Publication standard
          </div>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
            An insight appears here only when it is material, adds synthesis beyond
            restating a source page, has a traceable evidence trail, and can state its
            main limitation plainly.
          </p>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Key findings</div>
        <Heading level={2}>What stands out in the current evidence</Heading>
        <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {findings.map(item => {
            const Icon = item.icon;
            return (
              <article
                id={item.id}
                key={item.id}
                className="scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {item.kicker}
                  </div>
                  <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                </div>
                <div className="mt-4 text-3xl font-extrabold tracking-tight text-primary-800">
                  {item.value}
                </div>
                <h3 className="mt-2 text-lg font-extrabold text-gray-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.detail}
                </p>
                <Link
                  to={item.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                  aria-label={`Open supporting BetterMakati page ${item.citation}`}
                >
                  {item.citation} See the supporting data{' '}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Evidence base</div>
        <Heading level={2}>What this report draws from</Heading>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
          These are source and analysis pages, not separate BetterMakati reports.
          They remain the place to inspect the full dataset, definitions and original
          records behind each finding.
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
                <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                <div className="mt-4">
                  <h3 className="font-extrabold text-gray-950">
                    {item.citation} {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-2xl font-extrabold text-primary-800">
              {annualBudgetDocuments[annualBudgetDocuments.length - 1].year}–
              {annualBudgetDocuments[0].year}
            </div>
            <div className="mt-1 font-bold text-gray-900">
              annual budget documents indexed
            </div>
            <p className="mt-1 text-xs text-gray-500">See citation [1].</p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <div className="text-2xl font-extrabold text-primary-800">
              {actualFiscalHistory[0].year}–{latestActual.year}
            </div>
            <div className="mt-1 font-bold text-gray-900">
              fiscal actuals currently structured
            </div>
            <p className="mt-1 text-xs text-gray-500">See citation [1].</p>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Citations & method</div>
        <Heading level={2}>Internal first, original source one level deeper</Heading>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-600">
          BetterMakati pages are cited first because this report is a synthesis of the
          website. Each cited page carries its own links to original government,
          statistical, election, audit or other public records.
        </p>

        <ol className="mt-6 space-y-3 text-sm text-gray-700">
          <li>
            <Link
              to="/projects-budget"
              className="font-bold text-primary-700 underline underline-offset-2"
            >
              [1] Projects & Budget
            </Link>{' '}
            — 2025–2026 budget comparison, 2026 appropriation structure,
            2025 revenue sources and spending by function, and 2019–2025 fiscal
            actuals.
          </li>
          <li>
            <Link
              to="/statistics"
              className="font-bold text-primary-700 underline underline-offset-2"
            >
              [2] Makati Statistics
            </Link>{' '}
            — 2024 population and comparable city indicators.
          </li>
          <li>
            <Link
              to="/barangays"
              className="font-bold text-primary-700 underline underline-offset-2"
            >
              [3] Barangays
            </Link>{' '}
            — current 23-barangay structure and local profiles.
          </li>
          <li>
            <Link
              to="/elections"
              className="font-bold text-primary-700 underline underline-offset-2"
            >
              [4] Elections & Voting
            </Link>{' '}
            — sourced election results, history and voter information.
          </li>
          <li>
            <Link
              to="/accountability"
              className="font-bold text-primary-700 underline underline-offset-2"
            >
              [5] Accountability Ledger
            </Link>{' '}
            — source-linked fiscal, project, procurement, audit and commitment
            records.
          </li>
          <li>
            <Link
              to="/records"
              className="font-bold text-primary-700 underline underline-offset-2"
            >
              [6] Public Records
            </Link>{' '}
            — documents and datasets used across BetterMakati.
          </li>
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/reports" className="brand-btn-secondary">
            All reports
          </Link>
          <Link
            to="/get-involved?type=correction#submission"
            className="brand-btn-primary"
          >
            Report a correction
          </Link>
        </div>
      </Section>
    </>
  );
}
