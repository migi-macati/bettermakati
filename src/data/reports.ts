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
import {
  cityIndicatorById,
  cityIndicatorObservations,
  cityIndicatorSources,
} from './cityIndicators';
import {
  integrityAuditActions,
  integrityAuditFindings,
  integrityAuditResolutionTrails,
  integrityAuditSourceOnlyRecords,
  integrityAuditSources,
} from './integrityAuditTrails';
import type { FeaturedReportV2, ReportContentBlock, ReportSourceV2 } from './reportTypes';

const reportPublishedOn = '26 September 2026';
const reviewedOn = reportPublishedOn;

const moneyB = (millions: number) =>
  '₱' + (millions / 1000).toFixed(2).replace(/\.00$/, '') + 'B';

const moneyM = (millions: number) =>
  '₱' +
  millions.toLocaleString('en-PH', {
    minimumFractionDigits: Number.isInteger(millions) ? 0 : 2,
    maximumFractionDigits: 3,
  }) +
  'M';

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


const populationIndicator = cityIndicatorById.get('population-total');
const populationGrowthIndicator = cityIndicatorById.get('population-growth-rate');
const populationTrend = cityIndicatorObservations('population-total');
const populationGrowthTrend = cityIndicatorObservations('population-growth-rate');
const populationGrowthSource =
  cityIndicatorSources['psa-openstat-population-growth-2024'];
const currentBoundarySource =
  cityIndicatorSources['psa-psgc-makati-current'];

if (
  !populationIndicator ||
  !populationGrowthIndicator ||
  !populationGrowthSource ||
  !currentBoundarySource
) {
  throw new Error('Population flagship report requires canonical Wave 4 indicator metadata.');
}

const numericObservation = (
  value: number | string | boolean | undefined,
  label: string
) => {
  if (typeof value !== 'number') {
    throw new Error('Population flagship report requires numeric ' + label + '.');
  }
  return value;
};

const population2010 = numericObservation(populationTrend[0]?.value, '2010 population');
const population2015 = numericObservation(populationTrend[1]?.value, '2015 population');
const population2020 = numericObservation(populationTrend[2]?.value, '2020 population');
const population2024 = numericObservation(populationTrend[3]?.value, '2024 population');
const growth2010to2015 = numericObservation(
  populationGrowthTrend[0]?.value,
  '2010–2015 growth rate'
);
const growth2015to2020 = numericObservation(
  populationGrowthTrend[1]?.value,
  '2015–2020 growth rate'
);
const growth2020to2024 = numericObservation(
  populationGrowthTrend[2]?.value,
  '2020–2024 growth rate'
);
const populationAdded2020to2024 = population2024 - population2020;
const growthAccelerationPp = growth2020to2024 - growth2015to2020;


const auditSourceById = new Map(
  integrityAuditSources.map(source => [source.id, source] as const)
);

const auditRegistryToReportSourceId: Record<string, string> = {
  'coa-annual-audit-reports': '3',
  'gma-2018-development-fund-finding': '4',
  'gma-2018-development-fund-city-response': '5',
  'coa-makati-2018-audit-archive': '6',
  'makati-2018-unliquidated-cash-advances': '7',
  'makati-deped-sef-q4-2024': '8',
  'coa-makati-sef-compliance-2024': '9',
};

const auditReportSourceIds = (registryIds: string[]) => {
  const mapped = registryIds
    .map(id => auditRegistryToReportSourceId[id])
    .filter((id): id is string => Boolean(id));
  return ['1', ...new Set(mapped)] as [string, ...string[]];
};

const auditFindingsWithTrails = integrityAuditFindings.map(finding => {
  const trail = integrityAuditResolutionTrails.find(
    candidate => candidate.findingId === finding.id
  );
  if (!trail) {
    throw new Error('Records flagship requires an audit trail for ' + finding.id);
  }
  const actions = integrityAuditActions.filter(
    action => action.findingId === finding.id
  );
  return { finding, trail, actions };
});

if (
  auditFindingsWithTrails.length !== 3 ||
  !auditFindingsWithTrails.every(
    item => item.trail.resolution.status === 'unresolved'
  )
) {
  throw new Error(
    'Records flagship expects exactly three finding-level audit trails without item-specific closure.'
  );
}

const auditDirectSource = (registryId: string) => {
  const source = auditSourceById.get(registryId);
  if (!source) {
    throw new Error('Records flagship source missing: ' + registryId);
  }
  const id = auditRegistryToReportSourceId[registryId];
  if (!id) {
    throw new Error('Records flagship source mapping missing: ' + registryId);
  }
  return {
    id,
    label: source.label,
    href: source.url,
    sourceKind:
      source.sourceClass === 'secondary-reporting'
        ? ('secondary' as const)
        : ('official-external' as const),
    publisher: source.publisher,
    publishedOrPeriod: source.publishedOrPeriod,
    checkedOn: reviewedOn,
  };
};

const auditFollowUpSourceIds = (findingId: string) =>
  auditReportSourceIds(
    integrityAuditActions
      .filter(action => action.findingId === findingId)
      .flatMap(action => action.sourceIds)
  );

const auditFindingSourceIds = (findingId: string) => {
  const finding = integrityAuditFindings.find(item => item.id === findingId);
  if (!finding) {
    throw new Error('Records flagship finding missing: ' + findingId);
  }
  return auditReportSourceIds(finding.sourceIds);
};


const recordsFlagshipSources: [ReportSourceV2, ...ReportSourceV2[]] = [
  {
    id: '1',
    label: 'Integrity — audit finding trails',
    href: '/integrity#audits',
    sourceKind: 'canonical-internal',
    publisher: 'BetterMakati',
    note: 'Canonical finding, action-evidence and resolution-trail records.',
    checkedOn: reviewedOn,
  },
  {
    id: '2',
    label: 'Accountability — audit ledger',
    href: '/accountability?type=audit',
    sourceKind: 'canonical-internal',
    publisher: 'BetterMakati',
    note:
      'Underlying canonical Accountability entries from which finding-level records are derived.',
    checkedOn: reviewedOn,
  },
  ...[
    'coa-annual-audit-reports',
    'gma-2018-development-fund-finding',
    'gma-2018-development-fund-city-response',
    'coa-makati-2018-audit-archive',
    'makati-2018-unliquidated-cash-advances',
    'makati-deped-sef-q4-2024',
    'coa-makati-sef-compliance-2024',
  ].map(auditDirectSource),
];

export const reports: FeaturedReportV2[] = [
  {
    schemaVersion: 2,
    slug: '2026-budget-operating-expenses',
    date: reportPublishedOn,
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
    date: reportPublishedOn,
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
    date: reportPublishedOn,
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
  {
    schemaVersion: 2,
    slug: '2024-population-growth-acceleration',
    date: reportPublishedOn,
    headline:
      'Makati’s population growth accelerated to 1.37% a year in 2020–2024',
    subheadline:
      `The PSA comparable series shows average annual growth rising from ${growth2015to2020.toFixed(
        2
      )}% in 2015–2020 to ${growth2020to2024.toFixed(
        2
      )}% in 2020–2024, with resident population reaching ${population2024.toLocaleString()}.`,
    synthesis:
      `After slowing between 2010 and 2020, Makati’s resident population growth accelerated in 2020–2024: the PSA-reported average annual rate rose by ${growthAccelerationPp.toFixed(
        2
      )} percentage points to ${growth2020to2024.toFixed(
        2
      )}%, while the city added ${populationAdded2020to2024.toLocaleString()} residents on the current 23-barangay boundary.`,
    sections: [
      {
        id: 'growth-accelerated',
        heading: 'The latest census interval reversed the earlier slowdown',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `PSA reports Makati’s average annual population growth at ${growth2010to2015.toFixed(
                2
              )}% for 2010–2015, ${growth2015to2020.toFixed(
                2
              )}% for 2015–2020 and ${growth2020to2024.toFixed(
                2
              )}% for 2020–2024. The latest interval is therefore the fastest of the three comparable intervals in the current series.`,
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-growth-rate',
                  href: '/statistics',
                },
              ],
            },
          },
          {
            kind: 'stat',
            label: 'Average annual population growth, 2020–2024',
            value: growth2020to2024.toFixed(2) + '%',
            detail:
              `Up ${growthAccelerationPp.toFixed(
                2
              )} percentage points from the 2015–2020 interval.`,
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-growth-rate',
                  href: '/statistics',
                },
              ],
            },
          },
          {
            kind: 'chart',
            chartType: 'bar',
            title: 'PSA average annual population growth',
            valueLabel: '%',
            series: [
              {
                label: 'Average annual growth',
                points: populationGrowthTrend.map(observation => ({
                  label: observation.period.label,
                  value: numericObservation(
                    observation.value,
                    observation.period.label + ' growth rate'
                  ),
                })) as [
                  { label: string; value: number },
                  ...Array<{ label: string; value: number }>,
                ],
              },
            ],
            evidence: {
              sourceIds: ['1', '2'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-growth-rate',
                  href: '/statistics',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'population-level',
        heading: 'Resident population rose by 17,027 from 2020 to 2024',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `On the same current-city series, resident population rose from ${population2010.toLocaleString()} in 2010 to ${population2015.toLocaleString()} in 2015, ${population2020.toLocaleString()} in 2020 and ${population2024.toLocaleString()} in 2024. The 2020–2024 increase was ${populationAdded2020to2024.toLocaleString()} residents.`,
            evidence: {
              sourceIds: ['1', '2', '3'],
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
            kind: 'chart',
            chartType: 'bar',
            title: 'Resident population on the current Makati boundary',
            valueLabel: 'residents',
            series: [
              {
                label: 'Resident population',
                points: populationTrend.map(observation => ({
                  label: observation.period.label,
                  value: numericObservation(
                    observation.value,
                    observation.period.label + ' population'
                  ),
                })) as [
                  { label: string; value: number },
                  ...Array<{ label: string; value: number }>,
                ],
              },
            ],
            evidence: {
              sourceIds: ['1', '2', '3'],
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
            kind: 'paragraph',
            role: 'analysis',
            text:
              'The series establishes a change in resident-population growth, not its cause. It does not by itself identify whether migration, household formation, births, deaths, housing supply or other factors explain the acceleration, and it should not be read as a measure of Makati’s daytime population.',
            evidence: {
              sourceIds: ['1', '2', '3'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-total',
                  href: '/statistics',
                },
                {
                  recordType: 'statistics-indicator',
                  id: 'population-growth-rate',
                  href: '/statistics',
                },
              ],
            },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Makati Statistics — population indicators',
        href: '/statistics',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note:
          'Canonical Wave 4 population-total and population-growth-rate indicators on the current 23-barangay boundary.',
        checkedOn: reviewedOn,
      },
      {
        id: '2',
        label: populationGrowthSource.label,
        href: populationGrowthSource.url,
        sourceKind: 'official-external',
        publisher: populationGrowthSource.publisher,
        publishedOrPeriod: '2010, 2015, 2020 and 2024 census/POPCEN series',
        checkedOn: reviewedOn,
      },
      {
        id: '3',
        label: currentBoundarySource.label,
        href: currentBoundarySource.url,
        sourceKind: 'official-external',
        publisher: currentBoundarySource.publisher,
        publishedOrPeriod: 'Current Makati geography',
        checkedOn: reviewedOn,
      },
    ],
    methodology: {
      text:
        'The report uses the PSA-published average annual growth rates rather than recomputing a simple calendar-year CAGR. All population levels use the comparable current Makati 23-barangay boundary; the canonical indicator notes that the PSA series excludes the 10 barangays transferred to Taguig.',
      evidence: {
        sourceIds: ['1', '2', '3'],
        records: [
          {
            recordType: 'statistics-indicator',
            id: 'population-total',
            href: '/statistics',
          },
          {
            recordType: 'statistics-indicator',
            id: 'population-growth-rate',
            href: '/statistics',
          },
        ],
      },
    },
  },
  {
    schemaVersion: 2,
    slug: 'audit-follow-up-closure-trails',
    date: reportPublishedOn,
    headline:
      'Three older Makati audit findings have follow-up records but no item-level closure in the indexed trail',
    subheadline:
      `BetterMakati’s finding-level audit layer contains ${auditFindingsWithTrails.length} historical findings and ${integrityAuditActions.length} later response or implementation-evidence records; none of the three trails currently establishes a finding-specific closure status.`,
    synthesis:
      'The public record indexed by BetterMakati shows later responses, controls or reporting for each of three historical audit findings, but the available follow-up does not map those later records back to the original recommendation closely enough to establish item-level closure.',
    sections: [
      {
        id: 'three-trails',
        heading: 'Later evidence exists in all three trails',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `The Integrity layer currently contains ${integrityAuditFindings.length} finding-level historical audit records. They concern 2017 Development Fund loan payments, 2018 DepEd-Makati cash advances and 2018 Special Education Fund eligibility. Across those findings, BetterMakati has indexed ${integrityAuditActions.length} later response or implementation-evidence records.`,
            evidence: {
              sourceIds: ['1', '2', '3'],
              records: auditFindingsWithTrails.flatMap(({ finding }) => [
                {
                  recordType: 'integrity-audit-finding' as const,
                  id: finding.id,
                  href: '/integrity#audits',
                },
                {
                  recordType: 'accountability-entry' as const,
                  id: finding.accountabilityEntryId,
                  href: '/accountability?type=audit',
                },
              ]),
            },
          },
          {
            kind: 'stat',
            label: 'Finding-level trails without item-specific closure in the indexed record',
            value: integrityAuditResolutionTrails.length + ' of ' + integrityAuditFindings.length,
            detail:
              '“Without item-specific closure” means the later record does not explicitly identify the original finding or recommendation with a resolved implementation status.',
            evidence: {
              sourceIds: ['1', '2', '3'],
              records: integrityAuditFindings.map(finding => ({
                recordType: 'integrity-audit-finding' as const,
                id: finding.id,
                href: '/integrity#audits',
              })),
            },
          },
          {
            kind: 'table',
            title: 'What the indexed trail shows',
            columns: [
              { key: 'period', label: 'Audit period' },
              { key: 'finding', label: 'Finding-level record' },
              { key: 'amount', label: 'Amount cited', align: 'right' },
              { key: 'laterEvidence', label: 'Later evidence' },
              { key: 'documentaryStatus', label: 'Documentary status' },
            ],
            rows: auditFindingsWithTrails.map(({ finding, actions }) => ({
              period: finding.auditPeriod,
              finding: finding.title,
              amount:
                finding.amountM === undefined
                  ? '—'
                  : moneyM(finding.amountM),
              laterEvidence:
                actions.length +
                ' record' +
                (actions.length === 1 ? '' : 's'),
              documentaryStatus: 'Item-level closure not established',
            })),
            evidence: {
              sourceIds: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
              ],
              records: integrityAuditFindings.map(finding => ({
                recordType: 'integrity-audit-finding' as const,
                id: finding.id,
                href: '/integrity#audits',
              })),
            },
          },
        ],
      },
      {
        id: 'what-follow-up-means',
        heading: 'The follow-up is real, but the continuity differs by finding',
        blocks: auditFindingsWithTrails.flatMap(({ finding, trail, actions }) => [
          {
            kind: 'paragraph' as const,
            role: 'fact' as const,
            text:
              `${finding.title}: ${finding.findingAsStated} Later evidence in the indexed trail: ${actions
                .map(action => action.statementAsStated)
                .join(' ')}`,
            evidence: {
              sourceIds: [
                ...new Set([
                  ...auditFindingSourceIds(finding.id),
                  ...auditFollowUpSourceIds(finding.id),
                ]),
              ] as [string, ...string[]],
              records: [
                {
                  recordType: 'integrity-audit-finding' as const,
                  id: finding.id,
                  href: '/integrity#audits',
                },
                {
                  recordType: 'accountability-entry' as const,
                  id: finding.accountabilityEntryId,
                  href: '/accountability?type=audit',
                },
              ],
            },
          },
          {
            kind: 'paragraph' as const,
            role: 'analysis' as const,
            text:
              `Documentary reading: ${trail.resolution.status === 'unresolved' ? trail.resolution.reason : trail.resolution.statementAsStated} This is a statement about the continuity of the indexed public record, not a conclusion that the underlying condition continued after the audit period.`,
            evidence: {
              sourceIds: auditFollowUpSourceIds(finding.id),
              records: [
                {
                  recordType: 'integrity-audit-finding' as const,
                  id: finding.id,
                  href: '/integrity#audits',
                },
              ],
            },
          },
        ]) as [ReportContentBlock, ...ReportContentBlock[]],
      },
      {
        id: 'scope',
        heading: 'What is outside this count',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              `The Integrity layer also carries ${integrityAuditSourceOnlyRecords.length} source-only audit record: ${integrityAuditSourceOnlyRecords[0]?.title ?? 'the 2024 Makati Special Education Fund compliance audit'}. It is not counted among the three findings because the currently retrievable source path does not expose the finding-level text needed to create a canonical finding record.`,
            evidence: {
              sourceIds: ['1', '2', '9'],
              records: integrityAuditSourceOnlyRecords.map(record => ({
                recordType: 'accountability-entry' as const,
                id: record.accountabilityEntryId,
                href: '/accountability?type=audit',
              })),
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'The report therefore does not claim that all Makati audit findings remain open, nor that later corrective work did not occur. It identifies a narrower records problem: the public evidence currently indexed does not provide a finding-specific chain from recommendation to an explicit implementation or closure status for these three historical records.',
            evidence: {
              sourceIds: ['1', '2', '3', '6', '7', '8', '9'],
            },
          },
        ],
      },
    ],
    sources: recordsFlagshipSources,
    methodology: {
      text:
        '“Closure” is used only when a later source explicitly maps back to the same finding or recommendation and states an implementation status. Aggregate audit implementation counts, related control activity and later reporting are retained as follow-up evidence but are not promoted to finding-specific closure without that continuity.',
      evidence: {
        sourceIds: ['1', '2', '3', '6', '7', '8', '9'],
        records: integrityAuditFindings.map(finding => ({
          recordType: 'integrity-audit-finding' as const,
          id: finding.id,
          href: '/integrity#audits',
        })),
      },
    },

  },

  {
    schemaVersion: 2,
    slug: 'embo-makati-taguig-transition',
    date: '3 October 2026',
    headline: 'The EMBO Shift: How Makati Lost 10 Barangays, and What Changed After',
    subheadline:
      'A Supreme Court boundary ruling moved 10 barangays from Makati to Taguig. The legal case ended first; the transition in schools, elections, budgets and public services unfolded afterward.',
    synthesis:
      'The EMBO transfer was one territorial judgment followed by several different administrative transitions: the city boundary is settled, while schools, electoral representation, public services, fiscal records and the possession of some public facilities changed on separate legal and operational tracks.',
    sections: [
      {
        id: 'boundary-and-scale',
        heading: 'The legal boundary changed first',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'In its 1 December 2021 decision in G.R. No. 235316, the Supreme Court reinstated with modification the trial-court ruling confirming Parcels 3 and 4 of the Fort Bonifacio Military Reservation as part of Taguig. Makati’s motion for reconsideration was denied with finality on 28 September 2022. In June 2023, the Court also denied Makati leave to file a second motion for reconsideration.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'The Philippine Statistics Authority then transferred Cembo, Comembo, East Rembo, Pembo, Pitogo, Post Proper Northside, Post Proper Southside, Rizal, South Cembo and West Rembo from Makati to Taguig in the third-quarter 2023 Philippine Standard Geographic Code update.',
            evidence: { sourceIds: ['3'] },
          },
          {
            kind: 'table',
            title: 'The 10 transferred barangays in the 2024 POPCEN',
            columns: [
              { key: 'barangay', label: 'Barangay' },
              { key: 'population', label: '2024 population', align: 'right' },
            ],
            rows: [
              { barangay: 'Cembo', population: '25,468' },
              { barangay: 'Comembo', population: '16,299' },
              { barangay: 'East Rembo', population: '26,884' },
              { barangay: 'Pembo', population: '47,030' },
              { barangay: 'Pitogo', population: '16,244' },
              { barangay: 'Post Proper Northside', population: '62,277' },
              { barangay: 'Post Proper Southside', population: '68,388' },
              { barangay: 'Rizal', population: '46,061' },
              { barangay: 'South Cembo', population: '15,458' },
              { barangay: 'West Rembo', population: '30,157' },
              { barangay: 'Total', population: '354,266' },
            ],
            evidence: { sourceIds: ['4'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'The transfer creates a statistical break. PSA counts 309,770 residents in Makati’s remaining 23 barangays in 2024. Comparing that figure directly with Makati’s old citywide 2020 total as though the geography were unchanged would misstate demographic change; current-boundary and former-boundary series must be distinguished.',
            evidence: {
              sourceIds: ['4', '5'],
              records: [
                {
                  recordType: 'statistics-indicator',
                  id: 'population-total',
                  href: '/statistics',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'schools-and-health',
        heading: 'Schools and health services moved on their own timelines',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'DepEd initially placed 14 affected public schools under direct supervision of the Office of the Secretary. Under the later Makati–Taguig–DepEd agreement implemented through DepEd Order No. 001, s. 2024, the Schools Division of Taguig City and Pateros assumed management and operation effective 1 January 2024. The agreement preserved the cities’ conflicting positions on ownership of school land, buildings, facilities and equipment for determination by the proper authorities.',
            evidence: { sourceIds: ['6'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Taguig’s current health directory lists barangay health centers in nine of the ten transferred barangays: Cembo, Comembo, East Rembo, Pembo, Pitogo, Post Proper Southside, Rizal, South Cembo and West Rembo. East Rembo also has one of Taguig’s four 24/7 Super Health Centers. The directory checked for this report does not list a Post Proper Northside barangay health center; that is a limitation of the directory, not proof that residents have no health-service access.',
            evidence: { sourceIds: ['7'] },
          },
        ],
      },
      {
        id: 'elections',
        heading: 'Electoral representation required another adjustment',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'For the 2025 elections, COMELEC Resolution No. 11069 placed Comembo, Pembo and Rizal in Taguig’s first legislative and councilor district, and Cembo, East Rembo, Pitogo, Post Proper Northside, Post Proper Southside, South Cembo and West Rembo in the second. It also provided for 12 councilor seats in each district.',
            evidence: { sourceIds: ['8'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'BetterMakati therefore keeps pre-transfer EMBO election results in Makati’s historical record but does not add post-transfer EMBO results to current Makati barangay totals.',
            evidence: { sourceIds: ['3', '8'] },
          },
        ],
      },
      {
        id: 'fiscal',
        heading: 'The fiscal effect was real, but it was not a simple transfer of money',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'DBM directed national agencies to take the final Makati–Taguig decision into account in budget matters involving the transferred barangays, and its final FY2024 National Tax Allotment process incorporated boundary changes. DBM’s 2024 city receipts table records Makati NTA receipts of ₱1.006 billion and Taguig NTA receipts of ₱3.149 billion.',
            evidence: { sourceIds: ['9', '10', '11'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Taguig’s recorded NTA receipts rose from ₱2.487 billion in 2023 to ₱3.149 billion in 2024, an increase of about ₱662 million or 26.6%. The same 2024 table records local-source receipts of ₱18.903 billion for Makati and ₱16.146 billion for Taguig.',
            evidence: { sourceIds: ['11', '12'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'Those figures should not be presented as a peso-for-peso transfer from Makati to Taguig. National allotments changed across LGUs and are only one part of each city’s finances. The defensible conclusion is that the boundary adjustment changed the allocation basis while Taguig’s recorded NTA receipts rose substantially in the first full fiscal year after the transfer.',
            evidence: { sourceIds: ['9', '10', '11', '12'] },
          },
        ],
      },
      {
        id: 'facilities',
        heading: 'Jurisdiction, operation and ownership are different questions',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'The boundary ruling settled which city the 10 barangays belong to. It did not by itself decide ownership of every school, health center, park or other facility Makati had built or operated there. In January 2024, the West Rembo Fire Station reopened under a transition arrangement that allowed Bureau of Fire Protection personnel to use it while other issues remained under discussion.',
            evidence: { sourceIds: ['1', '13'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'On 22 May 2025, Taguig RTC Branch 153 granted Taguig a writ of preliminary injunction covering health centers, covered courts, day care centers and other essential facilities. The writ allowed Taguig continued access and control while trial proceeded on the better right of possession. It was a provisional remedy, not a final judgment on ownership.',
            evidence: { sourceIds: ['14'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'The former Makati Park and Garden is now operated by Taguig as TLC People’s Park in West Rembo and is listed by the city as a public recreational facility. That establishes present administration and use, not a final judicial determination of title.',
            evidence: { sourceIds: ['15'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'As of this report’s 3 October 2026 research cutoff, no later publicly verifiable final merits decision resolving the broader facility-possession or ownership case was located. The current record therefore supports three separate statements: Taguig jurisdiction is settled; Taguig has court-backed operational control over facilities covered by the preliminary injunction; final ownership or better right of possession remains unresolved in the public record located for this report.',
            evidence: { sourceIds: ['14'] },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'SC Writes Finis to Makati City-Taguig City Land Dispute',
        href: 'https://sc.judiciary.gov.ph/sc-writes-finis-to-makati-city-taguig-city-land-dispute/',
        sourceKind: 'official-external',
        publisher: 'Supreme Court of the Philippines',
        publishedOrPeriod: '4 April 2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '2',
        label: 'SC Denies Makati’s Motion for Leave to Admit Second Motion for Reconsideration',
        href: 'https://sc.judiciary.gov.ph/sc-denies-makatis-motion-for-leave-to-admit-second-motion-for-reconsideration-in-makati-taguig-territorial-dispute/',
        sourceKind: 'official-external',
        publisher: 'Supreme Court of the Philippines',
        publishedOrPeriod: '29 June 2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '3',
        label: 'Third Quarter 2023 PSGC Updates',
        href: 'https://psa.gov.ph/content/third-quarter-2023-psgc-updates-conversion-new-city-merging-44-barangays-renaming-five',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: '24 October 2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '4',
        label: 'City of Taguig — PSGC / 2024 POPCEN',
        href: 'https://psa.gov.ph/classification/psgc/barangays/1381500000',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: '2024 POPCEN',
        checkedOn: '3 October 2026',
      },
      {
        id: '5',
        label: 'City of Makati — PSGC / 2024 POPCEN',
        href: 'https://psa.gov.ph/classification/psgc/barangays/1380300000',
        sourceKind: 'official-external',
        publisher: 'Philippine Statistics Authority',
        publishedOrPeriod: '2024 POPCEN',
        checkedOn: '3 October 2026',
      },
      {
        id: '6',
        label: 'DepEd Order No. 001, s. 2024',
        href: 'https://www.deped.gov.ph/wp-content/uploads/DO_s2024_001.pdf',
        sourceKind: 'official-external',
        publisher: 'Department of Education',
        publishedOrPeriod: '15 January 2024',
        checkedOn: '3 October 2026',
      },
      {
        id: '7',
        label: 'Taguig hospitals and health centers',
        href: 'https://www.taguig.gov.ph/health/hospitals-and-centers/',
        sourceKind: 'official-external',
        publisher: 'City Government of Taguig',
        checkedOn: '3 October 2026',
      },
      {
        id: '8',
        label: 'COMELEC 2025 NLE Resolutions — Resolution No. 11069',
        href: 'https://www.comelec.gov.ph/?r=2025NLE/Resolutions',
        sourceKind: 'official-external',
        publisher: 'Commission on Elections',
        publishedOrPeriod: '25 September 2024',
        checkedOn: '3 October 2026',
      },
      {
        id: '9',
        label: 'DBM Circular Letter No. 2023-12',
        href: 'https://www.dbm.gov.ph/index.php/dbm-issuances/circular-letters?catid=37&id=2308%3Acircular-letter-no-2023-12&view=article',
        sourceKind: 'official-external',
        publisher: 'Department of Budget and Management',
        publishedOrPeriod: '15 September 2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '10',
        label: 'Local Budget Memorandum No. 87-A — Final FY2024 NTA shares',
        href: 'https://www.dbm.gov.ph/wp-content/uploads/Issuances/2023/Local-Budget-Memorandum/LOCAL-BUDGET-MEMORANDUM-NO-87-A-DATED-DECEMBER-28-2023.pdf',
        sourceKind: 'official-external',
        publisher: 'Department of Budget and Management',
        publishedOrPeriod: '28 December 2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '11',
        label: 'BESF 2026 Table F.13 — Statement of Receipts and Expenditures by Cities, 2024',
        href: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2026/F13.pdf',
        sourceKind: 'official-external',
        publisher: 'Department of Budget and Management',
        publishedOrPeriod: '2024',
        checkedOn: '3 October 2026',
      },
      {
        id: '12',
        label: 'BESF 2025 Table F.13 — Statement of Receipts and Expenditures by Cities, 2023',
        href: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2025/F13.pdf',
        sourceKind: 'official-external',
        publisher: 'Department of Budget and Management',
        publishedOrPeriod: '2023',
        checkedOn: '3 October 2026',
      },
      {
        id: '13',
        label: 'DILG — West Rembo Fire Station transition',
        href: 'https://calabarzon.dilg.gov.ph/through-constructive-dialogues-abalos-optimistic-makati-taguig-territorial-issue-will-be-resolved-soon/',
        sourceKind: 'official-external',
        publisher: 'Department of the Interior and Local Government',
        publishedOrPeriod: '8 January 2024',
        checkedOn: '3 October 2026',
      },
      {
        id: '14',
        label: 'Court extends Taguig control over government facilities in EMBOs',
        href: 'https://www.pna.gov.ph/articles/1250718',
        sourceKind: 'secondary',
        publisher: 'Philippine News Agency',
        publishedOrPeriod: '23 May 2025',
        checkedOn: '3 October 2026',
      },
      {
        id: '15',
        label: 'Taguig parks and playgrounds — TLC People’s Park',
        href: 'https://www.taguig.gov.ph/parks-and-playgrounds/',
        sourceKind: 'official-external',
        publisher: 'City Government of Taguig',
        checkedOn: '3 October 2026',
      },
    ],
    methodology: {
      title: 'Boundary and legal-status note',
      text:
        'Population comparisons use the current official 23-barangay Makati geography and the 2024 POPCEN for the transferred barangays. Legal status is stated only to the level established by the cited judgments or interim orders. A preliminary injunction over facility access and possession is not treated as a final ruling on title.',
      evidence: { sourceIds: ['1', '3', '4', '5', '14'] },
    },
  },

  {
    schemaVersion: 2,
    slug: 'makati-political-dynasties-election-record',
    date: '5 October 2026',
    headline: 'Makati’s Political Dynasty: What the Election Record Actually Shows',
    subheadline:
      'Five members of the Binay family have won Makati’s mayoralty since 1988. The record shows both succession across terms and relatives holding local or national office at the same time—but it does not, by itself, prove why voters chose them or what caused particular policy outcomes.',
    synthesis:
      'Makati’s modern mayoral history is a documented case of family continuity: a Binay family member won every regular mayoral election in the city record from 1988 through 2025. That continuity includes direct succession, returns after term limits, simultaneous service in different offices and two recent contests between relatives. These are measurable political relationships; judgments about performance, voter motives or legal disqualification require separate evidence.',
    sections: [
      {
        id: 'definition-and-law',
        heading: '“Political dynasty” is a constitutional category still awaiting a statutory definition',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text:
              'Article II, Section 26 of the 1987 Constitution directs the State to guarantee equal access to public service and prohibit political dynasties “as may be defined by law.” On 26 August 2026, the Supreme Court held that Congress has a mandatory constitutional duty to enact that law. The Court did not itself define which relatives, offices or succession patterns are prohibited, and it declined to direct COMELEC to disqualify candidates without legislation supplying those rules.',
            evidence: { sourceIds: ['1', '2'] },
          },
          {
            kind: 'paragraph',
            role: 'context',
            text:
              'This report therefore uses “dynasty” descriptively, not as a present ground for disqualification. It records two observable patterns used in research: relatives serving in elected office during the same period, and relatives succeeding one another across election terms.',
            evidence: { sourceIds: ['2', '8'] },
          },
        ],
      },
      {
        id: 'family-and-offices',
        heading: 'Five family members have served as Makati mayor',
        blocks: [
          {
            kind: 'table',
            title: 'Documented offices in the Binay family network',
            caption:
              'Years describe the offices relevant to Makati’s political succession. They do not imply uninterrupted service where an acting mayor or legal interruption occurred.',
            columns: [
              { key: 'person', label: 'Person' },
              { key: 'relationship', label: 'Family relationship' },
              { key: 'offices', label: 'Selected elected offices' },
            ],
            rows: [
              {
                person: 'Jejomar C. Binay',
                relationship: 'Spouse of Elenita; father of Nancy, Abby and Junjun',
                offices: 'Makati mayor, 1988–1998 and 2001–2010; Vice President, 2010–2016',
              },
              {
                person: 'Elenita S. Binay',
                relationship: 'Spouse of Jejomar',
                offices: 'Makati mayor, 1998–2001',
              },
              {
                person: 'Jejomar Erwin “Junjun” S. Binay Jr.',
                relationship: 'Son of Jejomar and Elenita',
                offices: 'Makati mayor, 2010–2015; earlier city councilor',
              },
              {
                person: 'Mar-len Abigail “Abby” S. Binay-Campos',
                relationship: 'Daughter of Jejomar and Elenita; spouse of Luis Campos Jr.',
                offices: 'Makati 2nd District representative, 2007–2016; Makati mayor, 2016–2025',
              },
              {
                person: 'Maria Lourdes Nancy S. Binay',
                relationship: 'Daughter of Jejomar and Elenita',
                offices: 'Senator, 2013–2025; Makati mayor, 2025–present',
              },
              {
                person: 'Luis Campos Jr.',
                relationship: 'Spouse of Abby Binay',
                offices: 'Makati 2nd District representative, 2016–2025',
              },
            ],
            evidence: { sourceIds: ['3', '5', '6', '7', '8', '9'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'The sequence is both vertical and horizontal. Vertical continuity appears when one relative follows another across terms: Jejomar to Elenita in 1998, Elenita back to Jejomar in 2001, Jejomar to Junjun in 2010, and Abby to Nancy in 2025. Horizontal overlap appears when relatives hold different offices during the same period, including the 2007–2010 overlap of Jejomar as mayor, Abby as representative and Junjun as councilor, and later overlaps among local, House and Senate positions.',
            evidence: { sourceIds: ['3', '6', '8'] },
          },
        ],
      },
      {
        id: 'mayoral-election-record',
        heading: 'The regular mayoral election record is continuous, but not politically uniform',
        blocks: [
          {
            kind: 'stat',
            label: 'Regular mayoral elections won by a Binay family member',
            value: '10 of 10',
            detail:
              'BetterMakati’s candidate-level series covers every regular Makati mayoral election from 1998 through 2025. The city’s historical record also identifies Jejomar Binay as the winner in 1988, followed by reelections in 1992 and 1995.',
            evidence: { sourceIds: ['3', '4'] },
          },
          {
            kind: 'table',
            title: 'Makati mayoral winners, 1998–2025',
            caption:
              'The 2025 result covers Makati’s current 23-barangay geography; earlier results included the 10 barangays later transferred to Taguig.',
            columns: [
              { key: 'year', label: 'Election' },
              { key: 'winner', label: 'Winner' },
              { key: 'runnerUp', label: 'Second place' },
              { key: 'margin', label: 'Vote margin', align: 'right' },
            ],
            rows: [
              { year: '1998', winner: 'Elenita Binay', runnerUp: 'Toro Yabut', margin: '54,918' },
              { year: '2001', winner: 'Jejomar Binay', runnerUp: 'Edu Manzano', margin: '65,963' },
              { year: '2004', winner: 'Jejomar Binay', runnerUp: 'Oscar Ibay', margin: '136,137' },
              { year: '2007', winner: 'Jejomar Binay', runnerUp: 'Lito Lapid', margin: '176,353' },
              { year: '2010', winner: 'Junjun Binay', runnerUp: 'Ernesto Mercado', margin: '45,513' },
              { year: '2013', winner: 'Junjun Binay', runnerUp: 'Rene Bondal', margin: '182,957' },
              { year: '2016', winner: 'Abby Binay', runnerUp: 'Kid Peña', margin: '18,063' },
              { year: '2019', winner: 'Abby Binay', runnerUp: 'Junjun Binay', margin: '80,869' },
              { year: '2022', winner: 'Abby Binay', runnerUp: 'Joel Hernandez', margin: '322,179' },
              { year: '2025', winner: 'Nancy Binay', runnerUp: 'Luis Campos Jr.', margin: '29,234' },
            ],
            evidence: {
              sourceIds: ['4'],
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
            kind: 'paragraph',
            role: 'fact',
            text:
              'Family continuity did not eliminate competition within the family. Abby Binay defeated her brother Junjun in the 2019 mayoral election. In 2025, Nancy Binay defeated her brother-in-law Luis Campos Jr. The same family network therefore appeared on opposing sides of two recent mayoral contests.',
            evidence: { sourceIds: ['4', '9'] },
          },
        ],
      },
      {
        id: 'what-the-record-can-show',
        heading: 'What the record establishes—and what it does not',
        blocks: [
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'The evidence supports a narrow conclusion: Makati has experienced unusually durable family continuity in its mayoralty, reinforced at different times by relatives in the council, House, Senate and vice presidency. A University of the Philippines study of Metro Manila elections from 1988 to 2013 separately identified both simultaneous and inter-term Binay linkages, while cautioning that a dynasty index is a measure of family connections in office, not a finding about policy performance.',
            evidence: { sourceIds: ['8'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text:
              'Election results alone cannot establish why individual voters chose a candidate, whether family continuity caused a specific public-service outcome, or whether any candidate should be legally barred. Those questions require voter research, policy evaluation or a statutory rule that did not exist at this report’s 5 October 2026 cutoff. The report therefore does not score candidates, infer motives or treat shared family membership as proof of misconduct.',
            evidence: { sourceIds: ['2', '4', '8'] },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: '1987 Philippine Constitution — Article II, Section 26',
        href: 'https://lawphil.net/consti/cons1987.html',
        sourceKind: 'official-external',
        publisher: 'LawPhil Project / Supreme Court E-Library',
        publishedOrPeriod: '1987 Constitution',
        checkedOn: '5 October 2026',
      },
      {
        id: '2',
        label: 'Press Briefer — consolidated political-dynasty cases',
        href: 'https://sc.judiciary.gov.ph/press-briefer-september-16-2026/',
        sourceKind: 'official-external',
        publisher: 'Supreme Court of the Philippines',
        publishedOrPeriod: '16 September 2026; decision dated 26 August 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '3',
        label: 'Makati city historical profile',
        href: 'https://www.makati.gov.ph/cms/the-city/city-profile/76?content=797',
        sourceKind: 'official-external',
        publisher: 'City Government of Makati',
        checkedOn: '5 October 2026',
      },
      {
        id: '4',
        label: 'BetterMakati mayoral election history, 1998–2025',
        href: '/elections#mayoral-history',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        publishedOrPeriod: 'Regular mayoral elections, 1998–2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '5',
        label: 'Nancy Binay — current Makati elected-official record',
        href: '/officials/nancy-binay',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        publishedOrPeriod: '2025–2028 term',
        checkedOn: '5 October 2026',
      },
      {
        id: '6',
        label: 'Mar-len Abigail “Abby” Binay — 2025 candidate profile',
        href: 'https://verafiles.org/articles/mar-len-abigail-abby-binay',
        sourceKind: 'secondary',
        publisher: 'VERA Files',
        publishedOrPeriod: '10 February 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '7',
        label: 'Maria Lourdes Nancy S. Binay — Senate biography',
        href: 'https://issuances-library.senate.gov.ph/senator/binay-maria-lourdes-nancy-s',
        sourceKind: 'official-external',
        publisher: 'Senate of the Philippines',
        publishedOrPeriod: 'Senate service, 2013–2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '8',
        label: 'Measuring political dynasties in Metro Manila',
        href: 'https://pre.econ.upd.edu.ph/index.php/pre/article/download/952/853',
        sourceKind: 'secondary',
        publisher: 'The Philippine Review of Economics, University of the Philippines',
        publishedOrPeriod: 'June 2017',
        checkedOn: '5 October 2026',
      },
      {
        id: '9',
        label: 'How Philippine regions voted in 2025',
        href: 'https://pcij.org/2025/05/19/how-philippine-regions-voted-few-victories-versus-dynasties-but-reform-hopes-rise-for-2028-presidential-campaign/',
        sourceKind: 'secondary',
        publisher: 'Philippine Center for Investigative Journalism',
        publishedOrPeriod: '19 May 2025',
        checkedOn: '5 October 2026',
      },
    ],
    methodology: {
      title: 'Scope and definition',
      text:
        'The family network is limited to relationships supported by the cited biographies and profiles. Election counts use BetterMakati’s existing candidate-level mayoral series. “Dynasty” describes simultaneous or successive elected service by relatives; it is not used here as a legal disqualification, a performance rating or evidence of wrongdoing.',
      evidence: { sourceIds: ['2', '4', '6', '7', '8'] },
    },
  },

  {
    schemaVersion: 2,
    slug: 'makati-subway-from-promise-to-stalled-project',
    date: '5 October 2026',
    headline:
      'The Makati Subway: From a 10-Station Promise to a Stalled Project',
    subheadline:
      'The proposed US$3.5-billion, 10-station intra-city railway reached a joint venture, engineering contracts and limited site works. The EMBO boundary ruling then changed the route economics, the original private partner exited, and no construction restart has been publicly confirmed.',
    synthesis:
      'The Makati Subway was more than a drawing: it had a signed joint venture, a notice to proceed, contractors, land arrangements and limited works around Station 3. It is also not an active railway build today. The planned depot and two eastern stations are now in Taguig, Infradev declared the original project infeasible, and the joint venture moved into arbitration and settlement. Assets and studies may support a future project, but that is different from evidence of a funded, approved and active replacement subway.',
    sections: [
      {
        id: 'promise-and-contract',
        heading:
          'The project reached contracts and preparatory works, but not rail construction',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'In 2018, Makati selected a consortium led by IRC Properties, later renamed Philippine Infradev Holdings. The city and Infradev signed their joint venture on 30 July 2019. The proponent received a notice to proceed on 18 February 2020 for a project estimated at US$3.5 billion with a five-year completion period.',
            evidence: { sourceIds: ['1', '2'], records: [{ recordType: 'legislation', id: 'ordinance-2019-a-020', href: '/legislation?record=ordinance-2019-a-020' }] },
          },
          {
            kind: 'table',
            title: 'Documented milestones of the original project',
            columns: [
              { key: 'milestoneDate', label: 'Date' },
              { key: 'milestone', label: 'Milestone' },
              { key: 'whatItProves', label: 'What it establishes' },
            ],
            rows: [
              {
                milestoneDate: '23 Oct 2018',
                milestone: 'Notice of Award',
                whatItProves: 'Infradev-led consortium selected',
              },
              {
                milestoneDate: '30 Jul 2019',
                milestone: 'Joint venture signed',
                whatItProves: 'Binding city–private partner project',
              },
              {
                milestoneDate: '18 Feb 2020',
                milestone: 'Notice to proceed',
                whatItProves: 'Implementation stage authorized',
              },
              {
                milestoneDate: '8 Sep 2020',
                milestone: 'US$1.21B EPC contracts',
                whatItProves: 'Civil and systems contractors engaged',
              },
              {
                milestoneDate: 'By Apr 2025 filing',
                milestone: 'Station 3 early works recorded',
                whatItProves:
                  'Excavation, shoring and mat foundations; not an operating railway',
              },
              {
                milestoneDate: '2 May 2025',
                milestone: 'Infradev declared project infeasible',
                whatItProves:
                  'Original continuation path ended and arbitration began',
              },
            ],
            evidence: { sourceIds: ['2', '3'] },
          },
        ],
      },
      {
        id: 'route-and-embo',
        heading:
          'The eastern end of the route was directly affected by the EMBO transfer',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The public project description was for 10 underground stations over roughly 10–11 kilometres, running from Ayala–EDSA toward eastern Makati and the EMBO area. Reported key locations included Ayala Triangle, Makati City Hall, the University of Makati and Ospital ng Makati. The company filing places Station 3 around Gil Puyat–Dela Rosa–Urban and Station 5 along J.P. Rizal at the old City Hall.',
            evidence: {
              sourceIds: ['2', '4', '5'],
              records: [
                {
                  recordType: 'place',
                  id: 'makati-city-hall',
                  href: '/civic-map/makati-city-hall',
                },
              ],
            },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'After the Makati–Taguig boundary judgment became final, the planned depot and two station sites were in Taguig. Public reporting identified the affected stations as the University of Makati in West Rembo and Ospital ng Makati in Pembo. For an intra-city line whose economics depended on the full alignment and associated development, that was a material change in jurisdiction and project viability.',
            evidence: { sourceIds: ['3', '6', '7'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'The boundary ruling did not make a railway across Makati and Taguig technically impossible. It did mean the original Makati-only joint venture could not continue unchanged. Any cross-boundary replacement would need a new intergovernmental, contractual, route and financing arrangement.',
            evidence: { sourceIds: ['6', '7'] },
          },
        ],
      },
      {
        id: 'exit-arbitration-settlement',
        heading:
          'The original partner exited; settlement followed, not a construction restart',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'On 2 May 2025, Infradev told the Philippine Stock Exchange that its board had found continuation under the 2019 joint venture no longer economically and operationally feasible and had commenced arbitration at the Singapore International Arbitration Centre. This is the clearest primary-source break in the original implementation path.',
            evidence: { sourceIds: ['3'] },
          },
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'In January 2026, the Makati City Council authorized and ratified a new settlement framework through Resolutions 2026-008 and 2026-011. The reported exchange would transfer the project company and related assets to the city. The city archive title for Resolution 2026-011 refers to authorization under Resolution 2026-007, while Ordinance 2026-015 cross-references Resolutions 2026-008 and 2026-011; BetterMakati preserves that unresolved discrepancy rather than silently choosing one reference. On 18 February 2026, Infradev said the SIAC case remained pending and that the proceedings and negotiations were confidential; it did not publicly confirm the detailed commercial terms.',
            evidence: { sourceIds: ['8', '9'], records: [
              { recordType: 'legislation', id: 'resolution-2026-008', href: '/legislation?record=resolution-2026-008' },
              { recordType: 'legislation', id: 'resolution-2026-011', href: '/legislation?record=resolution-2026-011' },
              { recordType: 'legislation', id: 'ordinance-2026-015', href: '/legislation?record=ordinance-2026-015' },
            ] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'Three matters therefore need to be separated: settlement of the former joint venture, ownership of the company and assets, and actual revival of the railway. A settlement may preserve land, studies or the corporate vehicle, but it is not a substitute for a new feasibility case, appropriation or financing, route approval, permits, contractors and construction timetable.',
            evidence: { sourceIds: ['8', '9'] },
          },
        ],
      },
      {
        id: 'current-status',
        heading:
          'At the 5 October 2026 cutoff, the railway is stalled and no replacement build is confirmed',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: 'The PPP Center still lists the Makati City Subway System Project in its database as pre-construction, while Infradev’s 2025 disclosure says continuation of the original joint venture was no longer feasible. Those different labels do not establish that work restarted; the safer reading is that the administrative registry has not been fully reconciled with the later arbitration and settlement record.',
            evidence: { sourceIds: ['3', '10'] },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'A credible restart would require a new public record: the implementing entity and operator, the revised alignment and station list, the arrangement for Taguig jurisdiction, updated cost and financing, approvals, procurement and a construction timetable. Until those exist, the Makati Subway is best described as a stalled former PPP with retained assets and an unresolved revival path—not as operating, under active construction, or an idea proven incapable of returning.',
            evidence: { sourceIds: ['3', '8', '9', '10'] },
          },
        ],
      },
    ],
    sources: [
      {
        id: '1',
        label: 'Makati LGU and Infradev sign subway joint venture',
        href: 'https://ppp.gov.ph/in_the_news/makati-lgu-ph-infradev-holdings-ink-joint-venture-for-citys-subway-project/',
        sourceKind: 'official-external',
        publisher: 'PPP Center',
        publishedOrPeriod: '31 July 2019',
        checkedOn: '5 October 2026',
      },
      {
        id: '2',
        label: 'Philippine Infradev 2025 definitive information statement',
        href: 'https://www.infra.com.ph/wp-content/uploads/2025/08/Philippine-Infradev-Holdings-Inc.-Definitive-Information-Statement-2025.pdf',
        sourceKind: 'official-external',
        publisher: 'Philippine Infradev Holdings / PSE filing',
        publishedOrPeriod: '2025 filing; project events through April 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '3',
        label:
          'Arbitration proceedings relating to the Makati City Subway Project',
        href: 'https://edge.pse.com.ph/downloadHtml.do?file_id=1757337',
        sourceKind: 'official-external',
        publisher: 'Philippine Stock Exchange EDGE / Philippine Infradev',
        publishedOrPeriod: '2 May 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '4',
        label: 'Makati signs US$3.5-billion, 10-station subway joint venture',
        href: 'https://www.pna.gov.ph/articles/1076520',
        sourceKind: 'official-external',
        publisher: 'Philippine News Agency',
        publishedOrPeriod: '30 July 2019',
        checkedOn: '5 October 2026',
      },
      {
        id: '5',
        label: 'Original route and key-station description',
        href: 'https://www.gmanetwork.com/news/topstories/metro/944779/abby-binay-makati-in-talks-with-new-domestic-partner-for-intra-city-railway-project/story/',
        sourceKind: 'secondary',
        publisher: 'GMA Integrated News',
        publishedOrPeriod: '2 May 2025',
        checkedOn: '5 October 2026',
      },
      {
        id: '6',
        label: 'Makati–Taguig boundary decision and EMBO transition report',
        href: '/reports/embo-makati-taguig-transition',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        publishedOrPeriod:
          'Boundary and transition record through 3 October 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '7',
        label: 'The case of the Makati Intra-city Subway project',
        href: 'https://pidswebs.pids.gov.ph/CDN/document/pidsdps2443.pdf',
        sourceKind: 'secondary',
        publisher: 'Philippine Institute for Development Studies',
        publishedOrPeriod: 'December 2024 discussion paper',
        checkedOn: '5 October 2026',
      },
      {
        id: '8',
        label: 'Makati–Infradev settlement and council resolutions',
        href: 'https://www.philippine-resources.com/articles/2026/6/makati-gains-control-of-subway-project-following-infradev-settlement',
        sourceKind: 'secondary',
        publisher: 'Philippine Resources Journal',
        publishedOrPeriod: '4 June 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '9',
        label: 'Infradev declines to disclose settlement details',
        href: 'https://context.ph/2026/02/19/infradev-declines-to-disclose-subway-settlement-details/',
        sourceKind: 'secondary',
        publisher: 'Context.ph',
        publishedOrPeriod: '19 February 2026',
        checkedOn: '5 October 2026',
      },
      {
        id: '10',
        label: 'Makati City Subway System Project database record',
        href: 'https://ppp.gov.ph/project-database/?project_sector=1768&search=true',
        sourceKind: 'official-external',
        publisher: 'PPP Center',
        checkedOn: '5 October 2026',
      },
    ],
    methodology: {
      title: 'Status and uncertainty note',
      text: 'Company disclosures, government PPP records and the official boundary record take priority. Strong secondary reporting is used for station names and January 2026 settlement events whose complete official text is not accessible on the city portal. A settlement, asset transfer or database label is not treated as proof of a construction restart.',
      evidence: { sourceIds: ['2', '3', '6', '8', '9', '10'] },
    },
  },

];

export const publicationReports = [...reports].reverse();

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
