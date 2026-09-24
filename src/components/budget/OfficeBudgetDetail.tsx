import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  budgetSources,
  officeBudgetDetails2026,
  officeBudgetTotals2026,
} from '../../data/budget2025';

const pesoExact = (millions: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(millions * 1_000_000);

export default function OfficeBudgetDetail() {
  const [office, setOffice] = useState(officeBudgetDetails2026[0]?.office ?? '');

  const detail = useMemo(
    () => officeBudgetDetails2026.find(item => item.office === office),
    [office]
  );
  const publishedTotal = officeBudgetTotals2026.find(item => item.office === office);
  const detailTotalM = detail?.lines.reduce((sum, item) => sum + item.amountM, 0) ?? 0;
  const reconciles =
    Boolean(detail && publishedTotal) &&
    Math.abs(detailTotalM - (publishedTotal?.amountM ?? 0)) < 0.001;
  const groups = (['Personal Services', 'Operating', 'Capital', 'Financial Expenses'] as const)
    .map(group => ({
      group,
      amountM:
        detail?.lines
          .filter(item => item.group === group)
          .reduce((sum, item) => sum + item.amountM, 0) ?? 0,
    }))
    .filter(item => item.amountM > 0);

  return (
    <div className="mt-8 rounded-2xl border border-primary-100 bg-[#fffdf8] p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="section-eyebrow">Office drill-down</div>
          <h3 className="text-xl font-extrabold text-gray-950">
            Object-of-expenditure detail
          </h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-primary-50 px-3 py-1.5 text-primary-800">
              {officeBudgetDetails2026.length} of {officeBudgetTotals2026.length} offices with line-item detail
            </span>
            <span
              className={
                reconciles
                  ? 'rounded-full bg-success-50 px-3 py-1.5 text-success-800'
                  : 'rounded-full bg-warning-50 px-3 py-1.5 text-warning-800'
              }
            >
              {reconciles ? 'Matches published office total' : 'Check against published office total'}
            </span>
          </div>
        </div>

        <label className="text-sm font-bold text-gray-700">
          Office
          <select
            value={office}
            onChange={event => setOffice(event.target.value)}
            className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium lg:w-80"
            aria-label="Select office budget detail"
          >
            {officeBudgetDetails2026.map(item => (
              <option key={item.office} value={item.office}>
                {item.office}
              </option>
            ))}
          </select>
        </label>
      </div>

      {detail && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                Office total
              </div>
              <div className="mt-1 text-xl font-extrabold text-gray-950">
                {pesoExact(detailTotalM)}
              </div>
            </div>
            {groups.map(item => (
              <div key={item.group} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  {item.group}
                </div>
                <div className="mt-1 text-xl font-extrabold text-gray-950">
                  {pesoExact(item.amountM)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-bold">Category</th>
                  <th className="px-4 py-3 font-bold">Account code</th>
                  <th className="px-4 py-3 font-bold">Object of expenditure</th>
                  <th className="px-4 py-3 font-bold text-right">2026 proposed</th>
                  <th className="px-4 py-3 font-bold">Source</th>
                </tr>
              </thead>
              <tbody>
                {detail.lines.map(item => (
                  <tr key={item.accountCode + item.label} className="border-t">
                    <td className="px-4 py-3 text-sm text-gray-500">{item.group}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {item.accountCode}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.label}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-950">
                      {pesoExact(item.amountM)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <a
                        href={budgetSources.annualBudget2026 + '#page=' + item.page}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-primary-700 underline underline-offset-2"
                      >
                        p. {item.page} <ArrowUpRight className="inline h-3.5 w-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
