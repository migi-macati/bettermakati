import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowUpRight,
  Building2,
  FileBarChart,
  HardHat,
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
  budgetByTypeCurrentEstimate2025,
  budgetCurrentEstimate2025,
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
import {
  auditFindingEntries,
  procurementProjectEntries,
  specialEducationFundEntries,
} from '../data/accountabilitySupplement';

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
    adopted2025M: budgetSummary.totalBudgetM,
    estimate2025M: budgetCurrentEstimate2025.totalAppropriationM,
    proposed2026M: budgetSummary2026.totalBudgetM,
  },
  ...budgetByType2026
    .filter(item => item.label !== 'Financial Expenses')
    .map(item => ({
      label: item.label,
      adopted2025M:
        budgetByType.find(previous => previous.label === item.label)?.amountM ?? 0,
      estimate2025M:
        budgetByTypeCurrentEstimate2025.find(previous => previous.label === item.label)
          ?.amountM ?? 0,
      proposed2026M: item.amountM,
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
  const [procurementQuery, setProcurementQuery] = useState('');
  const [procurementPeriod, setProcurementPeriod] = useState('All');

  const visibleLines = useMemo(() => {
    const q = lineQuery.trim().toLowerCase();
    return selectedBudgetLines2026.filter(item => {
      const groupMatch = lineFilter === 'All' || item.group === lineFilter;
      const queryMatch =
        !q ||
        item.label.toLowerCase().includes(q) ||
        item.accountCode?.toLowerCase().includes(q);
      return groupMatch && queryMatch;
    });
  }, [lineFilter, lineQuery]);

  const visibleProcurement = useMemo(() => {
    const q = procurementQuery.trim().toLowerCase();
    return procurementProjectEntries
      .filter(item => procurementPeriod === 'All' || item.period === procurementPeriod)
      .filter(item => {
        if (!q) return true;
        return [
          item.title,
          item.procurement?.referenceNo,
          item.procurement?.supplier,
          item.location,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => (b.procurement?.bidDate || '').localeCompare(a.procurement?.bidDate || ''));
  }, [procurementPeriod, procurementQuery]);

  const procurementPeriods = [...new Set(procurementProjectEntries.map(item => item.period))];
  const procurementApprovedM = procurementProjectEntries.reduce(
    (sum, item) => sum + (item.procurement?.approvedBudgetM || 0),
    0
  );
  const procurementAwardedM = procurementProjectEntries.reduce(
    (sum, item) => sum + (item.procurement?.awardedAmountM || 0),
    0
  );
  const budgetLineTotalM = selectedBudgetLines2026.reduce(
    (sum, item) => sum + item.amountM,
    0
  );
  const budgetLineReconciles =
    Math.abs(budgetLineTotalM - budgetSummary2026.totalBudgetM) < 0.001;
  const sefRecord = specialEducationFundEntries[0];

  const perResident = Math.round(
    (budgetSummary2026.totalBudgetM * 1_000_000) / cityPopulation
  );

  return (
    <>
      <SEO
        title="Projects & Budget"
        description="Makati City budget plans, reported revenue and spending, development funds, procurement records and audit follow-through."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'Makati city finance and project records',
          description:
            'Budget plans, reported receipts and expenditures, project, procurement and public financial records for Makati City.',
          spatialCoverage: 'Makati City, Philippines',
          temporalCoverage: '2014/2026',
        }}
      />

      <Section id="budget" className="bg-[#fffdf8]">
        <div className="section-eyebrow">
          2026 proposed budget · 2025 city estimate · DBM/BLGF 2025 statement
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>Where Makati’s money comes from and goes</Heading>
          <SharePage title="Makati Projects & Budget | BetterMakati" />
        </div>
        <LastReviewed
          date="2026-09-24"
          note="Adopted plans, the city’s current-year estimate, and DBM/BLGF receipts and expenditures are shown as separate datasets."
        />

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
          className="flex flex-col gap-3 rounded-2xl border border-primary-200 bg-primary-50 p-5 transition hover:border-primary-400 sm:flex-row sm:items-center sm:justify-between"
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

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
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
            label="2025 adopted budget plan"
            value={peso(budgetSummary.totalBudgetM)}
            detail="Original 2025 annual-budget plan"
            icon={FileBarChart}
          />
          <Metric
            label="2025 current-year estimate"
            value={peso(budgetCurrentEstimate2025.totalAppropriationM)}
            detail="Current Year (Estimate) in the 2026 city budget report"
            icon={FileBarChart}
          />
          <Metric
            label="2025 reported receipts"
            value={peso(budgetSummary.actualReceiptsM)}
            detail="DBM / BLGF Statement of Receipts and Expenditures"
            icon={ReceiptText}
          />
          <Metric
            label="2025 reported expenditures"
            value={peso(budgetSummary.actualExpendituresM)}
            detail="DBM / BLGF Statement of Receipts and Expenditures"
            icon={ReceiptText}
          />
          <Metric
            label="2025 ending cash balance"
            value={peso(budgetSummary.endingCashM)}
            detail="DBM / BLGF reported balance"
            icon={PiggyBank}
          />
        </div>

        <CitizenSummary
          className="mt-6"
          eyebrow="2026 budget in brief"
          title="The 2026 proposal is above the 2025 adopted plan, but below the city’s latest 2025 estimate"
          summary="Makati’s 2026 proposed appropriation is ₱21.0B. That is ₱2.0B (+10.5%) above the ₱19.0B adopted 2025 plan, while it is ₱3.37B (-13.8%) below the ₱24.37B Current Year (Estimate) shown in the same 2026 Annual Budget Report."
          points={[
            {
              label: 'Operating',
              text: (
                <>
                  MOOE is <strong>₱10.47B</strong>: up <strong>16.5%</strong> from the 2025 adopted plan, but down about <strong>25.0%</strong> from the city’s 2025 current-year estimate.
                </>
              ),
            },
            {
              label: 'Capital',
              text: (
                <>
                  Capital outlay is <strong>₱1.41B</strong>: up <strong>18.1%</strong> from the 2025 adopted plan and about <strong>2.3%</strong> above the 2025 current-year estimate.
                </>
              ),
            },
            {
              label: 'Personnel',
              text: (
                <>
                  Personal Services is <strong>₱6.64B</strong>: up <strong>2.2%</strong> from the adopted plan and about <strong>0.3%</strong> below the current-year estimate.
                </>
              ),
            },
            {
              label: 'Dedicated funds',
              text: (
                <>
                  Special Purpose Appropriations total <strong>₱2.48B</strong>, including the 20% Development Fund, LDRRMF, MMDA contribution and financial assistance to barangays.
                </>
              ),
            },
          ]}
          note="The three columns answer different questions. The 2025 adopted plan is the original budget authority; the city’s 2025 current-year estimate is the later estimate printed in the 2026 budget report; the DBM/BLGF 2025 statement below reports receipts and expenditures on a separate fiscal table."
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
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-bold">Budget component</th>
                <th className="px-4 py-3 font-bold text-right">2025 adopted</th>
                <th className="px-4 py-3 font-bold text-right">2025 current estimate</th>
                <th className="px-4 py-3 font-bold text-right">2026 proposed</th>
                <th className="px-4 py-3 font-bold text-right">vs adopted</th>
                <th className="px-4 py-3 font-bold text-right">vs estimate</th>
              </tr>
            </thead>
            <tbody>
              {budgetPlanComparison.map(item => {
                const adoptedChange = percentChange(item.adopted2025M, item.proposed2026M);
                const estimateChange = percentChange(item.estimate2025M, item.proposed2026M);
                return (
                  <tr key={item.label} className="border-t">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {item.label}
                    </td>
                    <td className="px-4 py-3 text-right">{peso(item.adopted2025M)}</td>
                    <td className="px-4 py-3 text-right">{peso(item.estimate2025M)}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-950">
                      {peso(item.proposed2026M)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {adoptedChange === null
                        ? '—'
                        : (adoptedChange >= 0 ? '+' : '') + adoptedChange.toFixed(1) + '%'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {estimateChange === null
                        ? '—'
                        : (estimateChange >= 0 ? '+' : '') + estimateChange.toFixed(1) + '%'}
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
            2025 DBM / BLGF statement{' '}
            <ArrowUpRight className="inline h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-8">
          <FiscalTrendChart
            title="DBM / BLGF receipts and reported expenditures, 2019–2025"
            items={actualFiscalHistory}
            formatValue={peso}
          />

          <div className="mt-5 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-bold">Year</th>
                  <th className="px-4 py-3 font-bold text-right">
                    Receipts
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
            surplus or deficit. BetterMakati preserves the values as published and
            does not relabel the DBM/BLGF series as audited city financial statements.
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
        <div className="section-eyebrow">DBM / BLGF 2025 Revenue</div>
        <Heading level={2}>Where city receipts came from</Heading>
        <p className="mt-2 text-xs text-gray-500">
          Source:{' '}
          <a
            href={budgetSources.actuals}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            DBM / BLGF statement <ArrowUpRight className="inline h-3 w-3" />
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
                <th className="px-4 py-3 font-bold text-right">2025 reported</th>
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
        <div className="section-eyebrow">DBM / BLGF 2025 Spending</div>
        <Heading level={2}>Where reported expenditures went</Heading>
        <p className="mt-2 text-xs text-gray-500">
          Source:{' '}
          <a
            href={budgetSources.actuals}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary-700 underline underline-offset-2"
          >
            DBM / BLGF statement <ArrowUpRight className="inline h-3 w-3" />
          </a>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-5 mt-7">
          <HorizontalBarChart
            title="Reported spending by function"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-7">
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
                2025 20% Development Fund project follow-through
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

        {sefRecord && (
          <div className="mt-8 rounded-2xl border border-secondary-100 bg-[#fff8e6] p-6">
            <div className="section-eyebrow">Special Education Fund</div>
            <h3 className="mt-1 text-xl font-extrabold text-gray-950">{sefRecord.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{sefRecord.summary}</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-4">
                <div className="text-xs text-gray-500">Reported receipts</div>
                <div className="mt-1 text-xl font-extrabold text-gray-950">{peso(sefRecord.reportedAmountM || 0)}</div>
              </div>
              <div className="rounded-xl bg-white p-4">
                <div className="text-xs text-gray-500">Reported disbursements</div>
                <div className="mt-1 text-xl font-extrabold text-gray-950">{peso(sefRecord.actualAmountM || 0)}</div>
              </div>
              <div className="rounded-xl bg-white p-4">
                <div className="text-xs text-gray-500">Reported year-end balance</div>
                <div className="mt-1 text-xl font-extrabold text-gray-950">
                  {peso((sefRecord.reportedAmountM || 0) - (sefRecord.actualAmountM || 0))}
                </div>
              </div>
            </div>
            <a
              href={sefRecord.sources[0]?.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
            >
              Open SEF utilization source <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary-700" />
            <h3 className="font-extrabold text-lg text-gray-950">
              2026 capital-outlay lines
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {capitalBudgetLines2026.filter(item => item.amountM > 0).map(item => (
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>All citywide summary budget lines</Heading>
            <p className="mt-1 max-w-3xl text-gray-600">
              {selectedBudgetLines2026.length} object-of-expenditure lines from the five-page citywide summary of the 2026 Annual Budget Report. Department-level sheets remain in the original 82-page report.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-primary-50 px-3 py-1.5 text-primary-800">
                {selectedBudgetLines2026.length} lines indexed
              </span>
              <span className={budgetLineReconciles
                ? 'rounded-full bg-success-50 px-3 py-1.5 text-success-800'
                : 'rounded-full bg-warning-50 px-3 py-1.5 text-warning-800'
              }>
                {budgetLineReconciles
                  ? 'Line items reconcile to ₱21.0B'
                  : 'Line-item total needs reconciliation'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={lineQuery}
                onChange={event => setLineQuery(event.target.value)}
                placeholder="Search line or account code"
                className="rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-500"
              />
            </div>
            <select
              value={lineFilter}
              onChange={event => setLineFilter(event.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm"
              aria-label="Filter budget line category"
            >
              <option>All</option>
              <option>Personal Services</option>
              <option>Operating</option>
              <option>Capital</option>
              <option>Financial Expenses</option>
              <option>Special Purpose</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing {visibleLines.length} of {selectedBudgetLines2026.length} lines
        </div>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Account code</th>
                <th className="px-4 py-3 font-bold">Budget line</th>
                <th className="px-4 py-3 font-bold text-right">2026 proposed</th>
              </tr>
            </thead>
            <tbody>
              {visibleLines.map(item => (
                <tr key={item.group + item.label} className="border-t">
                  <td className="px-4 py-3 text-sm text-gray-500">{item.group}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.accountCode || '—'}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.label}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-950">
                    {item.amountM === 0 ? '—' : pesoExact(item.amountM)}
                  </td>
                </tr>
              ))}
              {visibleLines.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-600">
                    No budget line matches this search.
                  </td>
                </tr>
              )}
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
        <div className="section-eyebrow">Structured procurement</div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>Bid results BetterMakati can follow</Heading>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
              These records come from published city bid-result disclosures already structured in BetterMakati. An award record is not the same as a completed contract, delivered project or final payment.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/accountability?type=project" className="brand-btn-primary">
              Open full project ledger
            </Link>
            <a
              href={budgetSources.procurement}
              target="_blank"
              rel="noreferrer"
              className="brand-btn-secondary"
            >
              Search PhilGEPS <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric
            label="Structured bid-result records"
            value={procurementProjectEntries.length.toLocaleString('en-PH')}
            detail="Currently ingested into BetterMakati"
            icon={ShoppingCart}
          />
          <Metric
            label="Approved budgets represented"
            value={peso(procurementApprovedM)}
            detail="Sum of ABCs in the structured records"
            icon={WalletCards}
          />
          <Metric
            label="Winning bids represented"
            value={peso(procurementAwardedM)}
            detail="Sum of reported winning bid amounts"
            icon={ReceiptText}
          />
          <Metric
            label="ABC less winning bids"
            value={peso(procurementApprovedM - procurementAwardedM)}
            detail="Arithmetic difference only; not claimed as realized savings"
            icon={PiggyBank}
          />
        </div>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={procurementQuery}
              onChange={event => setProcurementQuery(event.target.value)}
              placeholder="Search project, supplier or reference"
              className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={procurementPeriod}
            onChange={event => setProcurementPeriod(event.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm"
            aria-label="Filter procurement period"
          >
            <option>All</option>
            {procurementPeriods.map(period => (
              <option key={period}>{period}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing {visibleProcurement.length} of {procurementProjectEntries.length} structured records
        </div>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[1120px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-bold">Period</th>
                <th className="px-4 py-3 font-bold">Reference</th>
                <th className="px-4 py-3 font-bold">Procurement</th>
                <th className="px-4 py-3 font-bold text-right">ABC</th>
                <th className="px-4 py-3 font-bold text-right">Winning bid</th>
                <th className="px-4 py-3 font-bold">Supplier</th>
                <th className="px-4 py-3 font-bold">Evidence trail</th>
              </tr>
            </thead>
            <tbody>
              {visibleProcurement.map(item => {
                const documented =
                  item.procurement?.stages.filter(stage => stage.status === 'documented').length || 0;
                const gaps =
                  item.procurement?.stages.filter(stage => stage.status === 'source-gap').length || 0;
                return (
                  <tr key={item.id} className="border-t align-top">
                    <td className="px-4 py-4 text-sm text-gray-600">{item.period}</td>
                    <td className="px-4 py-4 font-mono text-xs text-gray-600">
                      {item.procurement?.referenceNo || '—'}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={'/accountability?type=project#' + item.id}
                        className="font-bold text-primary-800 hover:underline"
                      >
                        {item.title}
                      </Link>
                      {item.location && (
                        <div className="mt-1 text-xs text-gray-500">{item.location}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">
                      {item.procurement?.approvedBudgetM !== undefined
                        ? peso(item.procurement.approvedBudgetM)
                        : '—'}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">
                      {item.procurement?.awardedAmountM !== undefined
                        ? peso(item.procurement.awardedAmountM)
                        : '—'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {item.procurement?.supplier || '—'}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600">
                      <span className="font-bold text-success-800">{documented} documented</span>
                      {' · '}
                      <span className={gaps ? 'font-bold text-warning-800' : 'text-gray-500'}>
                        {gaps} source gap{gaps === 1 ? '' : 's'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {visibleProcurement.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-600">
                    No structured procurement record matches this search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          Coverage is not a complete procurement registry. BetterMakati publishes the later contract, notice-to-proceed, implementation or completion stage only when a source has been linked to the same procurement record.
        </p>
      </Section>

      <Section id="audit" className="bg-white">
        <div className="section-eyebrow">Audit & follow-through</div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading level={2}>Structured COA findings</Heading>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
              BetterMakati separates the audit finding, recommendation, management response and later follow-up where the cited records support each field.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/accountability?type=audit" className="brand-btn-primary">
              Open audit ledger
            </Link>
            <a
              href={budgetSources.audit}
              target="_blank"
              rel="noreferrer"
              className="brand-btn-secondary"
            >
              COA reports <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-7 space-y-4">
          {auditFindingEntries.map(item => (
            <article key={item.id} className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {item.period}
                  </div>
                  <h3 className="mt-1 text-lg font-extrabold text-gray-950">{item.title}</h3>
                  <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
                    {item.summary}
                  </p>
                </div>
                {item.reportedAmountM !== undefined && (
                  <div className="shrink-0 rounded-xl bg-white px-4 py-3 text-right">
                    <div className="text-xs text-gray-500">Amount cited</div>
                    <div className="mt-1 text-xl font-extrabold text-gray-950">
                      {peso(item.reportedAmountM)}
                    </div>
                  </div>
                )}
              </div>

              {item.audit && (
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                      COA finding
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.audit.finding}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                      Recommendation
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">
                      {item.audit.recommendation || 'No recommendation has been structured from the linked public source.'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                      Management response
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">
                      {item.audit.managementResponse || 'No management response has been linked in BetterMakati.'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                      Follow-up
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">
                      {item.audit.followUpStatus || 'A later resolution record has not yet been linked.'}
                    </p>
                  </div>
                </div>
              )}

              {item.notes?.length ? (
                <ul className="mt-4 space-y-1 text-xs leading-relaxed text-gray-500">
                  {item.notes.map(note => <li key={note}>{note}</li>)}
                </ul>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                {item.sources.map(source => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary-700 underline underline-offset-2"
                  >
                    {source.label} <ArrowUpRight className="inline h-3 w-3" />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
