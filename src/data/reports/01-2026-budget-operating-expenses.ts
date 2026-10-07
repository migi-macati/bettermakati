import * as shared from '../reportSharedData';
import type { FeaturedReportModule } from '../reportTypes';

const {
  reportPublishedOn,
  moneyB,
  budgetSummary2026,
  percent,
  pctChange,
  budgetSummary,
  proposedVsCurrentEstimate,
  adoptedIncreaseM,
  budgetCurrentEstimate2025,
  mooeShareOfIncrease,
  mooeIncreaseM,
  budgetComponentRows,
  currentEstimateMooe,
  proposedMooe,
  reviewedOn,
  budgetSources,
} = shared;

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: '2026-budget-operating-expenses',
    date: reportPublishedOn,
    headline:
      'Makati’s 2026 budget proposal is above the adopted 2025 plan but below the city’s later 2025 estimate',
    subheadline: `${moneyB(budgetSummary2026.totalBudgetM)} proposed for 2026 is ${percent(
      pctChange(budgetSummary.totalBudgetM, budgetSummary2026.totalBudgetM)
    )} above the original 2025 budget, while remaining ${percent(
      Math.abs(proposedVsCurrentEstimate)
    )} below the 2025 current-year estimate shown in the same budget cycle.`,
    synthesis: `The 2026 proposal grows mainly through operating expenditure when compared with the original 2025 adopted plan, but the direction reverses when it is compared with the city’s higher 2025 current-year estimate.`,
    sections: [
      {
        id: 'two-baselines',
        heading: 'Two 2025 baselines tell different stories',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: `Makati’s proposed 2026 appropriation is ${moneyB(
              budgetSummary2026.totalBudgetM
            )}. Against the original ${moneyB(
              budgetSummary.totalBudgetM
            )} adopted 2025 plan, that is an increase of ${moneyB(
              adoptedIncreaseM
            )}, or ${percent(
              pctChange(
                budgetSummary.totalBudgetM,
                budgetSummary2026.totalBudgetM
              )
            )}. The 2026 Annual Budget Report also shows a later 2025 current-year estimate of ${moneyB(
              budgetCurrentEstimate2025.totalAppropriationM
            )}; against that estimate, the 2026 proposal is ${moneyB(
              budgetCurrentEstimate2025.totalAppropriationM -
                budgetSummary2026.totalBudgetM
            )} lower.`,
            evidence: {
              sourceIds: ['1', '2', '3'],
              records: [
                {
                  recordType: 'accountability-entry',
                  id: '2025-city-fiscal-record',
                  href: '/accountability?type=fiscal',
                },
                {
                  recordType: 'accountability-entry',
                  id: '2026-city-fiscal-record',
                  href: '/accountability?type=fiscal',
                },
              ],
            },
          },
          {
            kind: 'table',
            title: 'Budget totals',
            columns: [
              { key: 'basis', label: 'Basis' },
              { key: 'amount', label: 'Amount', align: 'right' },
            ],
            rows: [
              {
                basis: '2025 adopted plan',
                amount: moneyB(budgetSummary.totalBudgetM),
              },
              {
                basis: '2025 current-year estimate',
                amount: moneyB(budgetCurrentEstimate2025.totalAppropriationM),
              },
              {
                basis: '2026 proposed appropriation',
                amount: moneyB(budgetSummary2026.totalBudgetM),
              },
            ],
            evidence: {
              sourceIds: ['1', '2', '3'],
            },
          },
        ],
      },
      {
        id: 'composition',
        heading: 'Most of the adopted-plan increase is MOOE',
        blocks: [
          {
            kind: 'stat',
            label:
              'Share of the ₱2.0B adopted-plan increase attributable to MOOE',
            value: percent(mooeShareOfIncrease),
            detail: `MOOE rises by ${moneyB(mooeIncreaseM)} from the adopted 2025 plan to the proposed 2026 budget.`,
            evidence: {
              sourceIds: ['1', '2', '3'],
            },
          },
          {
            kind: 'table',
            title: 'Major appropriation components',
            caption: 'Amounts in billions of pesos.',
            columns: [
              { key: 'component', label: 'Component' },
              { key: 'adopted2025', label: '2025 adopted', align: 'right' },
              {
                key: 'currentEstimate2025',
                label: '2025 current estimate',
                align: 'right',
              },
              { key: 'proposed2026', label: '2026 proposed', align: 'right' },
            ],
            rows: budgetComponentRows.map(row => ({
              component: row.component,
              adopted2025: moneyB(row.adopted2025),
              currentEstimate2025: moneyB(row.currentEstimate2025),
              proposed2026: moneyB(row.proposed2026),
            })),
            evidence: {
              sourceIds: ['1', '2', '3'],
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: `The phrase “budget increase” therefore needs a baseline. Relative to the original 2025 plan, MOOE explains ${percent(
              mooeShareOfIncrease
            )} of the increase. Relative to the later 2025 estimate, however, proposed 2026 MOOE is ${percent(
              Math.abs(pctChange(currentEstimateMooe, proposedMooe))
            )} lower. The public record supports a composition finding, not a conclusion about whether operating spending is excessive or efficient.`,
            evidence: {
              sourceIds: ['1', '2', '3'],
            },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Projects & Budget — Makati budget comparison',
        href: '/projects-budget#budget',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note: 'Canonical comparison of the 2025 adopted plan, 2025 current-year estimate and 2026 proposal.',
        checkedOn: reviewedOn,
      },
      {
        id: '2',
        label: 'CY 2025 Annual Budget',
        href: budgetSources.annualBudget,
        sourceKind: 'official-external',
        publisher: 'City Government of Makati',
        publishedOrPeriod: '2025',
        checkedOn: reviewedOn,
      },
      {
        id: '3',
        label: '2026 Annual Budget Report',
        href: budgetSources.annualBudget2026,
        sourceKind: 'official-external',
        publisher: 'City Government of Makati',
        publishedOrPeriod: '2026 budget cycle',
        checkedOn: reviewedOn,
      },
    ],
    methodology: {
      text: 'The 2025 adopted budget and the 2025 current-year estimate are different fiscal baselines. Percentage changes are computed separately against each; neither series is treated as interchangeable with reported full-year actual expenditure.',
      evidence: {
        sourceIds: ['1', '2', '3'],
      },
    },
  },
  fil: null,
};

export default reportModule;
