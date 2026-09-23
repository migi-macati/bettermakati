import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowUpRight,
  Building2,
  FileBarChart,
  HardHat,
  Landmark,
  PiggyBank,
  ReceiptText,
  Search,
  ShoppingCart,
  WalletCards,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import SectionNav from '../components/ui/SectionNav';
import CitizenSummary from '../components/ui/CitizenSummary';
import {
  DonutChart,
  FiscalTrendChart,
  HorizontalBarChart,
} from '../components/budget/BudgetCharts';
import { useBarangayScope, withBarangayScope } from '../hooks/useBarangayScope';
import {
  actualSpendingByFunction,
  actualFiscalHistory,
  annualBudgetDocuments,
  budgetByType,
  budgetByType2026,
  budgetSources,
  budgetSummary,
  budgetSummary2026,
  capitalBudgetLines2026,
  cityPopulation,
  dedicatedFunds2026,
  developmentFundProject,
  localRevenueBreakdown,
  revenueSources,
  selectedBudgetLines2026,
} from '../data/budget2025';

const peso = (millions: number) => {
  const sign = millions < 0 ? '−' : '';
  const amount = Math.abs(millions);
  if (amount >= 1000)
    return (
      sign + '₱' + (amount / 1000).toFixed(amount % 1000 === 0 ? 1 : 2) + 'B'
    );
  return sign + '₱' + amount.toFixed(amount >= 100 ? 1 : 2) + 'M';
};

const pesoExact = (millions: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(millions * 1_000_000);

const pesoMillions = (millions: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(millions) + 'M';

const pct = (value: number) => (value < 0.1 ? '<0.1%' : value.toFixed(1) + '%');

const budgetPlanComparison = [
  {
    label: 'Total budget',
    amount2025M: budgetSummary.totalBudgetM,
    amount2026M: budgetSummary2026.totalBudgetM,
  },
  ...budgetByType2026
    .filter(item => item.label !== 'Financial Expenses')
    .map(item => ({
      label: item.label,
      amount2025M:
        budgetByType.find(previous => previous.label === item.label)?.amountM ?? 0,
      amount2026M: item.amountM,
    })),
];

const percentChange = (from: number, to: number) =>
  from === 0 ? null : ((to - from) / from) * 100;

function ShareBar({ share }: { share: number }) {
  return (
    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-primary-700"
        style={{ width: Math.max(share, 0.6) + '%' }}
      />
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />
      <div className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-gray-950">
        {value}
      </div>
      <div className="mt-1 font-bold text-gray-800">{label}</div>
      {detail && <div className="mt-1 text-xs text-gray-500">{detail}</div>}
    </div>
  );
}

export default function ProjectsBudget() {
  const { barangay } = useBarangayScope();
  const [lineFilter, setLineFilter] = useState('All');
  const [lineQuery, setLineQuery] = useState('');

  const visibleLines = useMemo(() => {
    const q = lineQuery.trim().toLowerCase();
    return selectedBudgetLines2026.filter(item => {
      const groupMatch = lineFilter === 'All' || item.group === lineFilter;
      const queryMatch = !q || item.label.toLowerCase().includes(q);
      return groupMatch && queryMatch;
    });
  }, [lineFilter, lineQuery]);

  const perResident = Math.round(
    (budgetSummary2026.totalBudgetM * 1_000_000) / cityPopulation
  );

  return (
    <>
      <SEO
        title="Projects & Budget"
        description="Makati City budget, revenue, spending, development funds and public financial records."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'Makati city finance and project records',
          description:
            'Budget plans, actual receipts, expenditures, project and public financial records for Makati City.',
          spatialCoverage: 'Makati City, Philippines',
          temporalCoverage: '2014/2026',
        }}
      />

      <Section id="budget" className="bg-[#fffdf8]">
        <div className="section-eyebrow">
          2026 budget plan · actuals through 2025
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>Where Makati’s money comes from and goes</Heading>
          <SharePage title="Makati Projects & Budget | BetterMakati" />
        </div>
        <LastReviewed note="Budget plans and actuals remain separated; each dataset links to its public source." />

        {barangay && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to={withBarangayScope('/accountability', barangay.slug)}
              className="rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300"
            >
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                Local evidence
              </div>
              <div className="mt-1 font-extrabold text-gray-950">
                Accountability records mentioning {barangay.name}
              </div>
            </Link>
            <Link
              to={withBarangayScope('/civic-map', barangay.slug)}
              className="rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300"
            >
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                Place-based view
              </div>
              <div className="mt-1 font-extrabold text-gray-950">
                Infrastructure and reports in {barangay.name}
              </div>
            </Link>
          </div>
        )}

        <SectionNav items={[
          { label: 'Overview', href: '#budget' },
          { label: 'Projects', href: '#projects' },
          { label: 'Procurement', href: '#procurement' },
          { label: 'Audit', href: '#audit' },
        ]} />
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link
          to="/accountability#2025-medical-supplies-development-fund"
          className="mt-5 flex flex-col gap-3 rounded-2xl border border-primary-200 bg-primary-50 p-5 transition hover:border-primary-400 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              Project follow-through
            </div>
            <div className="mt-1 font-extrabold text-gray-950">
              Plan → responsibility → evidence
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Open linked plans, responsible bodies, progress and later evidence.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary-700">
            Open ledger <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
        <Link
          to="/city-monitor"
          className="flex flex-col gap-3 rounded-2xl border border-primary-200 bg-white p-5 transition hover:border-primary-400 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
              Procurement
            </div>
            <div className="mt-1 font-extrabold text-gray-950">
              Follow posting → bidding → award → contract → implementation
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Track postings, bids, awards, contracts and implementation.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary-700">
            City Monitor <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric
            label="2026 proposed city budget"
            value={peso(budgetSummary2026.totalBudgetM)}
            detail={
              'About ' +
              pesoExact(perResident / 1_000_000) +
              ' per resident using the 2024 population'
            }
            icon={WalletCards}
          />
          <Metric
            label="2025 actual receipts"
            value={peso(budgetSummary.actualReceiptsM)}
            detail="DBM / BLGF actual annual data"
            icon={ReceiptText}
          />
          <Metric
            label="2025 actual expenditures"
            value={peso(budgetSummary.actualExpendituresM)}
            detail="DBM / BLGF actual annual data"
            icon={FileBarChart}
          />
          <Metric
            label="2025 ending cash balance"
            value={peso(budgetSummary.endingCashM)}
            detail="After reported payables and continuing appropriations"
            icon={PiggyBank}
          />
        </div>

        <CitizenSummary
          className="mt-6"
          eyebrow="2026 budget in brief"
          title="Operating and capital spending grow faster than the total budget"
          summary="Makati’s 2026 proposed budget is ₱21.0B, compared with the ₱19.0B 2025 budget plan currently structured in BetterMakati. All major spending groups increase in peso terms, but they do not grow at the same pace."
          points={[
            {
              label: 'Overall',
              text: (
                <>
                  The total plan increases by <strong>₱2.0B (+10.5%)</strong>.
                </>
              ),
            },
            {
              label: 'Operating costs',
              text: (
                <>
                  MOOE rises by about <strong>₱1.49B (+16.5%)</strong>, accounting for roughly three-fourths of the net increase in the total plan.
                </>
              ),
            },
            {
              label: 'Capital',
              text: (
                <>
                  Capital outlay increases by about <strong>₱217.0M (+18.1%)</strong>, faster than the overall budget, but remains about <strong>6.7%</strong> of the 2026 plan.
                </>
              ),
            },
            {
              label: 'Personnel',
              text: (
                <>
                  Personal Services increases by about <strong>₱141.0M (+2.2%)</strong>. Its share of the budget falls from about <strong>34.2%</strong> to <strong>31.6%</strong>.
                </>
              ),
            },
          ]}
          note="This compares budget plans, not actual spending. The 2026 report labels the budget-year figures as proposed; 2025 actual receipts and expenditures are shown separately below."
          actions={
            <a
              href={budgetSources.annualBudget2026}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-primary-700 underline underline-offset-2"
            >
              2026 source <ArrowUpRight className="inline h-3.5 w-3.5" />
            </a>
          }
        />

        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-bold">Budget component</th>
                <th className="px-4 py-3 font-bold text-right">2025 plan</th>
                <th className="px-4 py-3 font-bold text-right">2026 proposed</th>
                <th className="px-4 py-3 font-bold text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {budgetPlanComparison.map(item => {
                const change = percentChange(item.amount2025M, item.amount2026M);
                return (
                  <tr key={item.label} className="border-t">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {item.label}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {peso(item.amount2025M)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-950">
                      {peso(item.amount2026M)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {change === null ? '—' : (change >= 0 ? '+' : '') + change.toFixed(1) + '%'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <a
            href={budgetSources.annualBudget2026}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            2026 Annual Budget Report <ArrowUpRight className="inline h-3.5 w-3.5" />
          </a>
          <a
            href={budgetSources.actuals}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            2025 DBM / BLGF actuals{' '}
            <ArrowUpRight className="inline h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-8">
          <FiscalTrendChart
            title="Actual receipts and reported expenditures, 2019–2025"
            items={actualFiscalHistory}
            formatValue={peso}
          />

          <div className="mt-5 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-bold">Year</th>
                  <th className="px-4 py-3 font-bold text-right">
                    Actual receipts
                  </th>
                  <th className="px-4 py-3 font-bold text-right">
                    Reported expenditures
                  </th>
                  <th className="px-4 py-3 font-bold text-right">
                    Receipts less expenditures
                  </th>
                </tr>
              </thead>
              <tbody>
                {actualFiscalHistory.map(item => (
                  <tr key={item.year} className="border-t">
                    <td className="px-4 py-3">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-primary-700 underline underline-offset-2"
                      >
                        {item.year}{' '}
                        <ArrowUpRight className="inline h-3.5 w-3.5" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {pesoMillions(item.receiptsM)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {pesoMillions(item.expendituresM)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {pesoMillions(item.receiptsM - item.expendituresM)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-500">
            Values are reported by DBM/BLGF in millions of pesos. “Receipts less
            expenditures” is a direct arithmetic comparison, not an accounting
            surplus or deficit. The unusually high 2020 expenditure is retained
            as published in the source table.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
          <div className="section-eyebrow">Official documents</div>
          <h2 className="text-xl font-extrabold text-gray-950">
            Annual budget archive, 2014–2026
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Open the city’s original annual-budget PDF for each year.
          </p>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {annualBudgetDocuments.map(document => (
              <a
                key={document.year}
                href={document.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-extrabold text-gray-950 hover:border-primary-300 hover:bg-primary-50 transition"
              >
                {document.year}{' '}
                <ArrowUpRight className="inline h-3.5 w-3.5 text-primary-700" />
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Budget Plan</div>
        <Heading level={2}>How the ₱21.0B 2026 budget is allocated</Heading>
        <p className="mt-2 text-xs text-gray-500">
          Source:{' '}
          <a
            href={budgetSources.annualBudget2026}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            2026 Annual Budget Report <ArrowUpRight className="inline h-3 w-3" />
          </a>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5 mt-7">
          <DonutChart
            title="Budget composition"
            center="₱21.0B"
            items={budgetByType2026.map(item => ({
              label: item.label,
              value: item.amountM,
              share: item.share,
            }))}
          />

          <div className="grid grid-cols-1 gap-4">
            {budgetByType2026.map(item => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-gray-950">
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-primary-800">
                      {peso(item.amountM)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {pct(item.share)}
                    </div>
                  </div>
                </div>
                <ShareBar share={item.share} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Actual 2025 Revenue</div>
        <Heading level={2}>Where city receipts came from</Heading>
        <p className="mt-2 text-xs text-gray-500">
          Source:{' '}
          <a
            href={budgetSources.actuals}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            DBM / BLGF actuals <ArrowUpRight className="inline h-3 w-3" />
          </a>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5 mt-7">
          <DonutChart
            title="Revenue mix"
            center={peso(budgetSummary.actualReceiptsM)}
            items={revenueSources.map(item => ({
              label: item.label,
              value: item.amountM,
              share: item.share,
            }))}
          />

          <HorizontalBarChart
            title="Largest local revenue sources"
            items={localRevenueBreakdown
              .slice(0, 6)
              .map(item => ({ label: item.label, value: item.amountM }))}
            formatValue={peso}
          />
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[620px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-bold">Local revenue source</th>
                <th className="px-4 py-3 font-bold text-right">2025 actual</th>
              </tr>
            </thead>
            <tbody>
              {localRevenueBreakdown.map(item => (
                <tr key={item.label} className="border-t">
                  <td className="px-4 py-3 text-gray-800">{item.label}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-950">
                    {peso(item.amountM)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Actual 2025 Spending</div>
        <Heading level={2}>Where reported expenditures went</Heading>
        <p className="mt-2 text-xs text-gray-500">
          Source:{' '}
          <a
            href={budgetSources.actuals}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            DBM / BLGF actuals <ArrowUpRight className="inline h-3 w-3" />
          </a>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-5 mt-7">
          <HorizontalBarChart
            title="Actual spending by function"
            items={actualSpendingByFunction.map(item => ({
              label: item.label,
              value: item.amountM,
            }))}
            formatValue={peso}
          />

          <div className="grid grid-cols-1 gap-4">
            {actualSpendingByFunction.map(item => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-gray-950">
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-primary-800">
                      {peso(item.amountM)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {pct(item.share)}
                    </div>
                  </div>
                </div>
                <ShareBar share={item.share} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-secondary-100 bg-[#fff8e6] p-5 md:p-6">
          <div className="text-sm text-gray-600">
            Receipts less expenditures
          </div>
          <div className="text-3xl font-extrabold text-gray-950 mt-1">
            {peso(budgetSummary.receiptsLessExpendituresM)}
          </div>
        </div>
      </Section>

      <Section id="projects" className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Projects & Dedicated Funds</div>
        <Heading level={2}>Development and capital spending</Heading>
        <p className="mt-2 text-xs text-gray-500">
          Dedicated fund cards use the current 2026 budget report.
          Capital-outlay lines are from the{' '}
          <a
            href={budgetSources.annualBudget2026}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            2026 Annual Budget Report <ArrowUpRight className="inline h-3 w-3" />
          </a>
          .
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
          {dedicatedFunds2026.map(item => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-primary-100 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
            >
              <HardHat className="h-6 w-6 text-primary-700" />
              <div className="text-2xl font-extrabold text-gray-950 mt-4">
                {peso(item.amountM)}
              </div>
              <h3 className="font-bold text-gray-950 mt-1">{item.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-4">
                Open disclosure <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-primary-100 bg-white p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                20% Development Fund project
              </div>
              <h3 className="font-extrabold text-xl text-gray-950 mt-2">
                {developmentFundProject.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {developmentFundProject.location}
              </p>
            </div>
            <div className="lg:text-right">
              <div className="text-2xl font-extrabold text-primary-800">
                {developmentFundProject.latestCompletion}%
              </div>
              <div className="text-xs text-gray-500">
                Q4 reported completion
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-xs text-gray-500">
                Q4 reported total cost
              </div>
              <div className="font-extrabold text-gray-950 mt-1">
                {peso(developmentFundProject.latestCostM)}
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-xs text-gray-500">Cost incurred to date</div>
              <div className="font-extrabold text-gray-950 mt-1">
                {peso(developmentFundProject.latestCostIncurredM)}
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-xs text-gray-500">Started</div>
              <div className="font-bold text-gray-950 mt-1">
                {developmentFundProject.start}
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-xs text-gray-500">Target completion</div>
              <div className="font-bold text-gray-950 mt-1">
                {developmentFundProject.targetCompletion}
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-bold">Report</th>
                  <th className="px-4 py-3 font-bold text-right">
                    Reported total cost
                  </th>
                  <th className="px-4 py-3 font-bold text-right">Completion</th>
                  <th className="px-4 py-3 font-bold text-right">
                    Cost incurred
                  </th>
                </tr>
              </thead>
              <tbody>
                {developmentFundProject.reports.map(report => (
                  <tr key={report.quarter} className="border-t">
                    <td className="px-4 py-3">
                      <a
                        href={report.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-primary-700 underline underline-offset-2"
                      >
                        {report.quarter}{' '}
                        <ArrowUpRight className="inline h-3.5 w-3.5" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {peso(report.reportedCostM)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {report.completion.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      {peso(report.costIncurredM)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary-700" />
            <h3 className="font-extrabold text-lg text-gray-950">
              2026 capital-outlay lines
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {capitalBudgetLines2026.map(item => (
              <div key={item.label} className="rounded-xl bg-gray-50 p-4">
                <div className="text-xl font-extrabold text-primary-800">
                  {peso(item.amountM)}
                </div>
                <div className="text-sm font-semibold text-gray-800 mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Budget Explorer</div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <Heading level={2}>Budget line items</Heading>
            <p className="text-gray-600">
              Major citywide line items extracted from the 2026 Annual Budget Report.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={lineQuery}
                onChange={event => setLineQuery(event.target.value)}
                placeholder="Search line items"
                className="rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-500"
              />
            </div>
            <select
              value={lineFilter}
              onChange={event => setLineFilter(event.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm"
            >
              <option>All</option>
              <option>Personal Services</option>
              <option>Operating</option>
              <option>Capital</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[680px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Budget line</th>
                <th className="px-4 py-3 font-bold text-right">2025 amount</th>
              </tr>
            </thead>
            <tbody>
              {visibleLines.map(item => (
                <tr key={item.group + item.label} className="border-t">
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {item.group}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.label}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-950">
                    {pesoExact(item.amountM)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a
          href={budgetSources.annualBudget2026}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
        >
          Open the original 82-page 2026 Annual Budget Report{' '}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </Section>

      <Section id="procurement" className="bg-[#fffdf8]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Link
            to="/accountability?type=project"
            className="rounded-2xl border border-primary-200 bg-primary-50 p-6 hover:border-primary-400 hover:shadow-sm transition"
          >
            <WalletCards className="h-6 w-6 text-primary-700" />
            <h2 className="font-extrabold text-lg text-gray-950 mt-4">
              Structured procurement records
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Follow approved budget, winning bidder, bid amount and the next missing contract or implementation stage.
            </p>
          </Link>

          <a
            href={budgetSources.procurement}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
          >
            <ShoppingCart className="h-6 w-6 text-primary-700" />
            <h2 className="font-extrabold text-lg text-gray-950 mt-4">
              PhilGEPS
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Search the national procurement portal for bid and award notices.
            </p>
          </a>

          <Link
            id="audit"
            to="/accountability?type=audit"
            className="rounded-2xl border border-secondary-200 bg-secondary-50 p-6 hover:border-secondary-400 hover:shadow-sm transition"
          >
            <Landmark className="h-6 w-6 text-secondary-800" />
            <h2 className="font-extrabold text-lg text-gray-950 mt-4">
              Audit findings & follow-through
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Read structured COA observations, recommendations, management responses and unresolved follow-up gaps.
            </p>
          </Link>

          <a
            href={budgetSources.audit}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 hover:shadow-sm transition"
          >
            <Landmark className="h-6 w-6 text-primary-700" />
            <h2 className="font-extrabold text-lg text-gray-950 mt-4">
              COA reports
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Open the Commission on Audit annual-audit source collection.
            </p>
          </a>
        </div>
      </Section>
    </>
  );
}
