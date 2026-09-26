import {
  actualSpendingByFunction,
  budgetByType,
  budgetByType2026,
  budgetByTypeCurrentEstimate2025,
  budgetCurrentEstimate2025,
  budgetSources,
  budgetSummary,
  budgetSummary2026,
  localRevenueBreakdown,
  revenueSources,
} from './budget2025';
import {
  barangays,
  currentMakatiPopulation2024,
  psaBarangaySource,
} from './barangays';
import type { FeaturedReportV2 } from './reportTypes';

const reviewedOn = '26 September 2026';

const moneyB = (millions: number) =>
  '₱' + (millions / 1000).toFixed(2).replace(/\.00$/, '') + 'B';

const percent = (value: number) => value.toFixed(1) + '%';

const pctChange = (from: number, to: number) =>
  ((to - from) / from) * 100;

const adoptedMooe =
  budgetByType.find(item =>
    item.label.startsWith('Maintenance & Other Operating')
  )?.amountM ?? 0;
const proposedMooe =
  budgetByType2026.find(item =>
    item.label.startsWith('Maintenance & Other Operating')
  )?.amountM ?? 0;
const currentEstimateMooe =
  budgetByTypeCurrentEstimate2025.find(item =>
    item.label.startsWith('Maintenance & Other Operating')
  )?.amountM ?? 0;

const adoptedIncreaseM =
  budgetSummary2026.totalBudgetM - budgetSummary.totalBudgetM;
const mooeIncreaseM = proposedMooe - adoptedMooe;
const mooeShareOfIncrease =
  adoptedIncreaseM === 0 ? 0 : (mooeIncreaseM / adoptedIncreaseM) * 100;
const proposedVsCurrentEstimate = pctChange(
  budgetCurrentEstimate2025.totalAppropriationM,
  budgetSummary2026.totalBudgetM
);

const budgetComponentRows = [
  {
    component: 'Personal Services',
    adopted2025:
      budgetByType.find(item => item.label === 'Personal Services')?.amountM ??
      0,
    currentEstimate2025:
      budgetByTypeCurrentEstimate2025.find(
        item => item.label === 'Personal Services'
      )?.amountM ?? 0,
    proposed2026:
      budgetByType2026.find(item => item.label === 'Personal Services')
        ?.amountM ?? 0,
  },
  {
    component: 'Maintenance & Other Operating Expenses',
    adopted2025: adoptedMooe,
    currentEstimate2025: currentEstimateMooe,
    proposed2026: proposedMooe,
  },
  {
    component: 'Capital Outlay',
    adopted2025:
      budgetByType.find(item => item.label === 'Capital Outlay')?.amountM ?? 0,
    currentEstimate2025:
      budgetByTypeCurrentEstimate2025.find(
        item => item.label === 'Capital Outlay'
      )?.amountM ?? 0,
    proposed2026:
      budgetByType2026.find(item => item.label === 'Capital Outlay')?.amountM ??
      0,
  },
  {
    component: 'Special Purpose Appropriations',
    adopted2025:
      budgetByType.find(
        item => item.label === 'Special Purpose Appropriations'
      )?.amountM ?? 0,
    currentEstimate2025:
      budgetByTypeCurrentEstimate2025.find(
        item => item.label === 'Special Purpose Appropriations'
      )?.amountM ?? 0,
    proposed2026:
      budgetByType2026.find(
        item => item.label === 'Special Purpose Appropriations'
      )?.amountM ?? 0,
  },
];

const localReceipts = revenueSources.find(
  item => item.label === 'Local sources'
);
const externalReceipts = revenueSources.find(
  item => item.label === 'External sources'
);
const nonIncomeReceipts = revenueSources.find(
  item => item.label === 'Non-income receipts'
);
const businessTax = localRevenueBreakdown.find(
  item => item.label === 'Business tax'
);
const basicRPT = localRevenueBreakdown.find(
  item => item.label === 'Basic real property tax'
);
const sefTax = localRevenueBreakdown.find(
  item => item.label === 'Special Education Fund tax'
);
const topThreeLocalRevenueM =
  (businessTax?.amountM ?? 0) +
  (basicRPT?.amountM ?? 0) +
  (sefTax?.amountM ?? 0);
const topThreeLocalRevenueShare =
  localReceipts?.amountM
    ? (topThreeLocalRevenueM / localReceipts.amountM) * 100
    : 0;
const socialServices = actualSpendingByFunction.find(
  item => item.label === 'Social Services'
);

const sortedBarangays = [...barangays].sort(
  (a, b) => b.population2024 - a.population2024
);
const topThreeBarangays = sortedBarangays.slice(0, 3);
const topThreePopulation = topThreeBarangays.reduce(
  (sum, barangay) => sum + barangay.population2024,
  0
);
const topThreePopulationShare =
  (topThreePopulation / currentMakatiPopulation2024) * 100;
const smallestBarangay = sortedBarangays.at(-1);
const largestBarangay = sortedBarangays[0];
const largestToSmallestRatio =
  largestBarangay && smallestBarangay
    ? largestBarangay.population2024 / smallestBarangay.population2024
    : 0;
const barangaysUnder6000 = sortedBarangays.filter(
  barangay => barangay.population2024 < 6000
);

export const reports: [
  FeaturedReportV2,
  ...FeaturedReportV2[],
] = [
  {
    schemaVersion: 2,
    slug: '2026-budget-operating-expenses',
    date: reviewedOn,
    headline:
      'Makati’s 2026 budget proposal is above the adopted 2025 plan but below the city’s later 2025 estimate',
    subheadline:
      `${moneyB(budgetSummary2026.totalBudgetM)} proposed for 2026 is ${percent(
        pctChange(budgetSummary.totalBudgetM, budgetSummary2026.totalBudgetM)
      )} above the original 2025 budget, while remaining ${percent(
        Math.abs(proposedVsCurrentEstimate)
      )} below the 2025 current-year estimate shown in the same budget cycle.`,
    synthesis:
      `The 2026 proposal grows mainly through operating expenditure when compared with the original 2025 adopted plan, but the direction reverses when it is compared with the city’s higher 2025 current-year estimate.`,
    sections: [
      {
        id: 'two-baselines',
        heading: 'Two 2025 baselines tell different stories',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `Makati’s proposed 2026 appropriation is ${moneyB(
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
            label: 'Share of the ₱2.0B adopted-plan increase attributable to MOOE',
            value: percent(mooeShareOfIncrease),
            detail:
              `MOOE rises by ${moneyB(mooeIncreaseM)} from the adopted 2025 plan to the proposed 2026 budget.`,
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
            text:
              `The phrase “budget increase” therefore needs a baseline. Relative to the original 2025 plan, MOOE explains ${percent(
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
        note:
          'Canonical comparison of the 2025 adopted plan, 2025 current-year estimate and 2026 proposal.',
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
      text:
        'The 2025 adopted budget and the 2025 current-year estimate are different fiscal baselines. Percentage changes are computed separately against each; neither series is treated as interchangeable with reported full-year actual expenditure.',
      evidence: {
        sourceIds: ['1', '2', '3'],
      },
    },
  },
  {
    schemaVersion: 2,
    slug: '2025-fiscal-profile',
    date: reviewedOn,
    headline:
      'Makati’s 2025 receipts were overwhelmingly local while social services led reported spending',
    subheadline:
      `Local sources supplied ${percent(
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
            text:
              `Makati reported ${moneyB(
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
            detail:
              `${moneyB(localReceipts?.amountM ?? 0)} of ${moneyB(
                budgetSummary.actualReceiptsM
              )} in reported receipts.`,
            evidence: {
              sourceIds: ['1', '2'],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `Within local revenue, Business Tax, Basic Real Property Tax and Special Education Fund Tax together produced ${moneyB(
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
            text:
              `Reported 2025 expenditure totaled ${moneyB(
                budgetSummary.actualExpendituresM
              )}. Social Services accounted for ${moneyB(
                socialServices?.amountM ?? 0
              )}, or ${percent(
                socialServices?.share ?? 0
              )}, exceeding the combined ${moneyB(
                budgetSummary.actualExpendituresM -
                  (socialServices?.amountM ?? 0)
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
            text:
              'These two distributions answer different questions. The receipt table describes where city revenue was recorded as coming from; the functional expenditure table describes how spending was classified. They do not establish that a specific tax funded a specific service, nor do expenditure shares by themselves measure program outcomes.',
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
        note:
          'Canonical 2025 receipts, local-revenue breakdown and expenditure-by-function tables.',
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
  {
    schemaVersion: 2,
    slug: '2024-barangay-population',
    date: reviewedOn,
    headline:
      'Makati’s largest barangay has more than eighteen times the resident population of its smallest',
    subheadline:
      `${largestBarangay?.name ?? 'Pio Del Pilar'} has ${(
        largestBarangay?.population2024 ?? 0
      ).toLocaleString()} residents, while ${smallestBarangay?.name ?? 'Carmona'} has ${(
        smallestBarangay?.population2024 ?? 0
      ).toLocaleString()}; the three largest barangays contain ${percent(
        topThreePopulationShare
      )} of the city’s 2024 population.`,
    synthesis:
      `Makati’s 23 barangays operate at sharply different resident-population scales: the largest is ${largestToSmallestRatio.toFixed(
        1
      )} times the smallest, while the top three account for ${percent(
        topThreePopulationShare
      )} of all residents on the current city boundary.`,
    sections: [
      {
        id: 'concentration',
        heading: 'A large share of residents is concentrated in three barangays',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `Makati’s 2024 resident population is ${currentMakatiPopulation2024.toLocaleString()}. ${topThreeBarangays
                .map(
                  barangay =>
                    `${barangay.name} (${barangay.population2024.toLocaleString()})`
                )
                .join(
                  ', '
                )} together contain ${topThreePopulation.toLocaleString()} residents, or ${percent(
                topThreePopulationShare
              )} of the city total.`,
            evidence: {
              sourceIds: ['1', '2', '3', '4'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-total',
                  href: '/statistics',
                },
              ],
            },
          },
          {
            kind: 'stat',
            label: 'Largest-to-smallest population ratio',
            value: largestToSmallestRatio.toFixed(1) + '×',
            detail:
              `${largestBarangay?.name} compared with ${smallestBarangay?.name} in the 2024 resident-population count.`,
            evidence: {
              sourceIds: ['2', '4'],
            },
          },
        ],
      },
      {
        id: 'scale',
        heading: 'Barangay scale varies across the full city',
        blocks: [
          {
            kind: 'chart',
            chartType: 'bar',
            title: '2024 resident population by barangay',
            valueLabel: 'residents',
            series: [
              {
                label: 'Resident population',
                points: sortedBarangays.map(barangay => ({
                  label: barangay.name,
                  value: barangay.population2024,
                })) as [
                  { label: string; value: number },
                  ...Array<{ label: string; value: number }>,
                ],
              },
            ],
            evidence: {
              sourceIds: ['2', '4'],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `${barangaysUnder6000.length} of Makati’s 23 barangays have fewer than 6,000 residents in the 2024 count: ${barangaysUnder6000
                .map(barangay => barangay.name)
                .join(', ')}.`,
            evidence: {
              sourceIds: ['2', '4'],
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'Citywide averages therefore hide substantial differences in resident scale. This report stops at population distribution: it does not infer service demand, daytime population, land-use intensity or need for facilities from resident counts alone.',
            evidence: {
              sourceIds: ['1', '2', '3', '4'],
            },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Makati Statistics — population indicator',
        href: '/statistics',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note:
          'Canonical population-total indicator for the current 23-barangay boundary.',
        checkedOn: reviewedOn,
      },
      {
        id: '2',
        label: 'Barangays — 2024 resident population',
        href: '/barangays',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note: 'Canonical 2024 population values for all 23 barangays.',
        checkedOn: reviewedOn,
      },
      {
        id: '3',
        label: 'PSA OpenStat population and annual growth series',
        href: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0211A6DAPG0.px/',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: '2010–2024 census/POPCEN series',
        checkedOn: reviewedOn,
      },
      {
        id: '4',
        label: 'City of Makati — Philippine Standard Geographic Code',
        href: psaBarangaySource,
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: 'Current Makati barangay geography and population',
        checkedOn: reviewedOn,
      },
    ],
    methodology: {
      text:
        'All population statements use the current 23-barangay Makati boundary and resident population. Counts are not proxies for daytime population, service utilization, land area or population density.',
      evidence: {
        sourceIds: ['1', '2', '3', '4'],
        records: [
          {
            recordType: 'statistics-indicator',
            id: 'population-total',
            href: '/statistics',
          },
        ],
      },
    },
  },
];

export const reportSlugAliases: Record<string, string> = {
  '2025-local-revenue': '2025-fiscal-profile',
  '2025-social-services': '2025-fiscal-profile',
};

export const resolveReportSlug = (slug?: string) =>
  slug ? reportSlugAliases[slug] ?? slug : undefined;

export const findReport = (slug?: string) => {
  const canonicalSlug = resolveReportSlug(slug);
  return reports.find(report => report.slug === canonicalSlug);
};
