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
  {
    schemaVersion: 2,
    slug: '2024-population-growth-acceleration',
    date: reviewedOn,
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
    date: reviewedOn,
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
                  : moneyB(finding.amountM),
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
              `Documentary reading: ${trail.resolution.reason} This is a statement about the continuity of the indexed public record, not a conclusion that the underlying condition continued after the audit period.`,
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
        ]),
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
    sources: [
      {
        id: '1',
        label: 'Integrity — audit finding trails',
        href: '/integrity#audits',
        sourceKind: 'canonical-internal',
        publisher: 'BetterMakati',
        note:
          'Canonical finding, action-evidence and resolution-trail records.',
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
    ] as [
      {
        id: string;
        label: string;
        href: string;
        sourceKind: 'canonical-internal';
        publisher: string;
        note: string;
        checkedOn: string;
      },
      ...Array<{
        id: string;
        label: string;
        href: string;
        sourceKind: 'canonical-internal' | 'official-external' | 'secondary';
        publisher?: string;
        publishedOrPeriod?: string;
        note?: string;
        checkedOn?: string;
      }>,
    ],
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
