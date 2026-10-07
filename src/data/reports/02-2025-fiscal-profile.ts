import * as shared from '../reportSharedData';
import type { FeaturedReportModule } from '../reportTypes';

const {
  reportPublishedOn,
  percent,
  localReceipts,
  socialServices,
  moneyB,
  budgetSummary,
  externalReceipts,
  nonIncomeReceipts,
  topThreeLocalRevenueM,
  topThreeLocalRevenueShare,
  revenueSources,
  actualSpendingByFunction,
  reviewedOn,
  budgetSources,
} = shared;

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: '2025-fiscal-profile',
    date: reportPublishedOn,
    headline:
      'Makati’s 2025 receipts were overwhelmingly local while social services led reported spending',
    subheadline: `Local sources supplied ${percent(
      localReceipts?.share ?? 0
    )} of reported receipts, while Social Services accounted for ${percent(
      socialServices?.share ?? 0
    )} of reported expenditure.`,
    synthesis:
      'Makati’s reported 2025 fiscal profile combined a highly local revenue base with a spending mix dominated by Social Services, while the public fiscal tables do not trace particular taxes to particular programs.',
    sections: [
      {
        id: 'revenue',
        heading: 'Most reported receipts came from local sources',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: `Makati reported ${moneyB(
              budgetSummary.actualReceiptsM
            )} in 2025 receipts. Local sources accounted for ${moneyB(
              localReceipts?.amountM ?? 0
            )}, or ${percent(
              localReceipts?.share ?? 0
            )}. External sources contributed ${moneyB(
              externalReceipts?.amountM ?? 0
            )}, while non-income receipts accounted for ${moneyB(
              nonIncomeReceipts?.amountM ?? 0
            )}.`,
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'accountability-entry',
                  id: '2025-city-fiscal-record',
                  href: '/accountability?type=fiscal',
                },
              ],
            },
          },
          {
            kind: 'stat',
            label: 'Local-source receipts',
            value: percent(localReceipts?.share ?? 0),
            detail: `${moneyB(localReceipts?.amountM ?? 0)} of ${moneyB(
              budgetSummary.actualReceiptsM
            )} in reported receipts.`,
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: `Within local revenue, Business Tax, Basic Real Property Tax and Special Education Fund Tax together produced ${moneyB(
              topThreeLocalRevenueM
            )}, or ${percent(
              topThreeLocalRevenueShare
            )} of local-source receipts.`,
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
          {
            kind: 'chart',
            chartType: 'bar',
            title: 'Share of reported 2025 receipts',
            valueLabel: '%',
            series: [
              {
                label: 'Receipt source',
                points: revenueSources.map(item => ({
                  label: item.label,
                  value: item.share,
                })) as [
                  { label: string; value: number },
                  ...Array<{ label: string; value: number }>,
                ],
              },
            ],
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
        ],
      },
      {
        id: 'spending',
        heading: 'Social Services was the largest spending function',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: `Reported 2025 expenditure totaled ${moneyB(
              budgetSummary.actualExpendituresM
            )}. Social Services accounted for ${moneyB(
              socialServices?.amountM ?? 0
            )}, or ${percent(
              socialServices?.share ?? 0
            )}, exceeding the combined ${moneyB(
              budgetSummary.actualExpendituresM - (socialServices?.amountM ?? 0)
            )} reported under all other functional categories.`,
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'accountability-entry',
                  id: '2025-city-fiscal-record',
                  href: '/accountability?type=fiscal',
                },
              ],
            },
          },
          {
            kind: 'chart',
            chartType: 'bar',
            title: 'Share of reported 2025 expenditure',
            valueLabel: '%',
            series: [
              {
                label: 'Spending function',
                points: actualSpendingByFunction.map(item => ({
                  label: item.label,
                  value: item.share,
                })) as [
                  { label: string; value: number },
                  ...Array<{ label: string; value: number }>,
                ],
              },
            ],
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'These two distributions answer different questions. The receipt table describes where city revenue was recorded as coming from; the functional expenditure table describes how spending was classified. They do not establish that a specific tax funded a specific service, nor do expenditure shares by themselves measure program outcomes.',
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Projects & Budget — 2025 fiscal actuals',
        href: '/projects-budget#budget',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note: 'Canonical 2025 receipts, local-revenue breakdown and expenditure-by-function tables.',
        checkedOn: reviewedOn,
      },
      {
        id: '2',
        label: 'DBM/BLGF 2025 Statement of Receipts and Expenditures',
        href: budgetSources.actuals,
        sourceKind: 'official-external',
        publisher: 'Department of Budget and Management / BLGF',
        publishedOrPeriod: '2025 reported year',
        checkedOn: reviewedOn,
      },
    ],
  },
  fil: null,
};

export default reportModule;
