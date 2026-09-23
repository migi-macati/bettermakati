import {
  ArrowRight,
  BarChart3,
  MapPinned,
  ReceiptText,
  WalletCards,
} from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SharePage from '../components/ui/SharePage';
import { barangays } from '../data/barangays';
import {
  actualFiscalHistory,
  actualSpendingByFunction,
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
      title:
        'Nearly three-quarters of the ₱2B increase in the 2026 budget plan comes from higher operating expenses.',
      detail: `MOOE rises by ${pesoB(mooeIncrease)}, from ${pesoB(mooe2025)} to ${pesoB(mooe2026)}, accounting for ${pct(mooeShareOfIncrease)} of the total increase. The overall budget grows ${pct(change(budgetSummary.totalBudgetM, budgetSummary2026.totalBudgetM))}, while capital outlay grows ${pct(change(budgetByType.find(item => item.label === 'Capital Outlay')?.amountM ?? 0, budgetByType2026.find(item => item.label === 'Capital Outlay')?.amountM ?? 0))}. These are proposed appropriations, not actual spending.`,
      href: '/projects-budget#budget',
      citation: '[1]',
      icon: WalletCards,
    },
    {
      id: 'local-revenue',
      kicker: '2025 reported receipts',
      value: pct(localRevenue?.share ?? 0),
      title:
        'More than nine in ten pesos of reported 2025 receipts came from local sources.',
      detail: `Local taxes, fees, charges and local non-tax revenue account for ${pesoB(localRevenue?.amountM ?? 0)} of ${pesoB(latestActual.receiptsM)} in reported receipts. External sources account for ${pesoB(externalRevenue?.amountM ?? 0)}.`,
      href: '/projects-budget#budget',
      citation: '[1]',
      icon: ReceiptText,
    },
    {
      id: 'social-services',
      kicker: '2025 reported spending',
      value: pct(socialServices?.share ?? 0),
      title:
        'More than half of reported 2025 city spending was classified as social services.',
      detail: `Social Services account for ${pesoB(socialServices?.amountM ?? 0)}, or ${pct(socialServices?.share ?? 0)} of reported expenditure by function, covering health, education, welfare and related services.`,
      href: '/projects-budget#budget',
      citation: '[1]',
      icon: BarChart3,
    },
    {
      id: 'population-concentration',
      kicker: '2024 population',
      value: pct(topThreeShare),
      title:
        'Three barangays account for more than a third of Makati’s population.',
      detail: `${largestBarangays.map(item => item.name).join(', ')} together have ${topThreePopulation.toLocaleString('en-PH')} residents out of ${population.toLocaleString('en-PH')} across ${barangays.length} barangays.`,
      href: '/statistics',
      citation: '[2][3]',
      icon: MapPinned,
    },
  ];

  return (
    <>
      <SEO
        title="Makati Overview"
        description="A cited overview of Makati’s current fiscal, spending and barangay data."
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
          A cited overview of the city’s current fiscal, spending and barangay data.
        </p>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Key findings</div>
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
                <h2 className="mt-2 text-lg font-extrabold text-gray-950">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.detail}
                </p>
                <Link
                  to={item.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                  aria-label={`Open supporting BetterMakati page ${item.citation}`}
                >
                  {item.citation} See supporting data{' '}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Sources</div>
        <ol className="mt-5 space-y-3 text-sm text-gray-700">
          <li>
            <Link
              to="/projects-budget"
              className="font-bold text-primary-700 underline underline-offset-2"
            >
              [1] Projects & Budget
            </Link>{' '}
            — 2025–2026 budget comparison, revenue sources, spending by function and fiscal actuals.
          </li>
          <li>
            <Link
              to="/statistics"
              className="font-bold text-primary-700 underline underline-offset-2"
            >
              [2] Makati Statistics
            </Link>{' '}
            — 2024 population and city indicators.
          </li>
          <li>
            <Link
              to="/barangays"
              className="font-bold text-primary-700 underline underline-offset-2"
            >
              [3] Barangays
            </Link>{' '}
            — 23 barangay profiles and 2024 population data.
          </li>
        </ol>
      </Section>
    </>
  );
}
