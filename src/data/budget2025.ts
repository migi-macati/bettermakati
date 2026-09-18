export const budgetSources = {
  annualBudget: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Annual%20Budget%202025.pdf',
  annualBudget2024: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/2024%20Annual%20Budget%20compressed%201.pdf',
  developmentFundQ1: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q1%2020%20NTAU.pdf',
  developmentFundQ3: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q3%2020%20NTAU.pdf',
  actuals: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2026/F14.pdf',
  developmentFund: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q4%2020%20NTAU.pdf',
  procurement: 'https://notices.philgeps.gov.ph/',
  audit: 'https://www.coa.gov.ph/reports/annual-audit-reports/',
};

export const cityPopulation = 309770;

export const budgetTrend = [
  { year: 2024, amountM: 17811.49, href: budgetSources.annualBudget2024 },
  { year: 2025, amountM: 19000, href: budgetSources.annualBudget },
];

export const budgetSummary = {
  year: 2025,
  totalBudgetM: 19000,
  actualReceiptsM: 24655.31,
  actualExpendituresM: 22314.90,
  receiptsLessExpendituresM: 2340.41,
  beginningCashM: 22197.34,
  endingCashM: 21025.10,
};

export const budgetByType = [
  { label: 'Personal Services', amountM: 6494.927, share: 34.2, description: 'Salaries, benefits and personnel costs' },
  { label: 'Maintenance & Other Operating Expenses', amountM: 8986.402, share: 47.3, description: 'Operating programs, supplies, services and assistance' },
  { label: 'Capital Outlay', amountM: 1195.821, share: 6.3, description: 'Infrastructure, equipment and other capital assets' },
  { label: 'Special Purpose Appropriations', amountM: 2322.850, share: 12.2, description: 'Dedicated and statutory funds' },
];

export const revenueSources = [
  { label: 'Local sources', amountM: 23049.84, share: 93.5, description: 'Taxes, fees, charges and local non-tax revenue' },
  { label: 'External sources', amountM: 1599.21, share: 6.5, description: 'NTA and other national-government shares' },
  { label: 'Non-income receipts', amountM: 6.26, share: 0.03, description: 'Capital and other non-income receipts' },
];

export const localRevenueBreakdown = [
  { label: 'Business tax', amountM: 12143.75 },
  { label: 'Basic real property tax', amountM: 4444.31 },
  { label: 'Special Education Fund tax', amountM: 3627.15 },
  { label: 'Other local taxes', amountM: 903.03 },
  { label: 'Regulatory fees', amountM: 547.72 },
  { label: 'Receipts from economic enterprises', amountM: 408.57 },
  { label: 'Service / user charges', amountM: 356.35 },
  { label: 'Other receipts', amountM: 618.96 },
];

export const actualSpendingByFunction = [
  { label: 'Social Services', amountM: 12309.25, share: 55.2, description: 'Health, education, welfare and related services' },
  { label: 'General Services', amountM: 6650.47, share: 29.8, description: 'General government and administration' },
  { label: 'Economic Services', amountM: 1907.44, share: 8.5, description: 'Economic and development services' },
  { label: 'Capital Investment', amountM: 1438.10, share: 6.4, description: 'Property, plant and equipment / capital investment' },
  { label: 'Debt Services', amountM: 9.64, share: 0.04, description: 'Reported debt-service expenditure' },
];

export const dedicatedFunds = [
  {
    label: '20% Development Fund',
    amountM: 522.75,
    description: 'Dedicated development-fund appropriation',
    href: budgetSources.annualBudget,
  },
  {
    label: 'Local Disaster Risk Reduction and Management Fund',
    amountM: 1000,
    description: 'LDRRMF appropriation',
    href: budgetSources.annualBudget,
  },
];

export const selectedBudgetLines = [
  { group: 'Personal Services', label: 'Salaries and Wages - Regular', amountM: 2062.943 },
  { group: 'Personal Services', label: 'Salaries and Wages - Casual / Contractual', amountM: 1631.830 },
  { group: 'Personal Services', label: 'Other Personnel Benefits', amountM: 450.326 },
  { group: 'Personal Services', label: 'Retirement and Life Insurance Premiums', amountM: 437.947 },
  { group: 'Personal Services', label: 'Other Bonuses and Allowances', amountM: 334.323 },
  { group: 'Personal Services', label: 'Year End Bonus', amountM: 308.968 },
  { group: 'Operating', label: 'Other Maintenance and Operating Expenses', amountM: 1229.522 },
  { group: 'Operating', label: 'Other Professional Services', amountM: 1157.576 },
  { group: 'Operating', label: 'Drugs and Medicines', amountM: 900.109 },
  { group: 'Operating', label: 'Medical, Dental and Laboratory Supplies', amountM: 822.618 },
  { group: 'Operating', label: 'Donations', amountM: 586.833 },
  { group: 'Operating', label: 'Environment / Sanitary Services', amountM: 553.379 },
  { group: 'Operating', label: 'Electricity', amountM: 400.000 },
  { group: 'Operating', label: 'Security Services', amountM: 354.586 },
  { group: 'Capital', label: 'Road Networks', amountM: 232.013 },
  { group: 'Capital', label: 'Information and Communication Technology Equipment', amountM: 146.117 },
  { group: 'Capital', label: 'Buildings', amountM: 138.000 },
  { group: 'Capital', label: 'Office Equipment', amountM: 83.698 },
];

export const capitalBudgetLines = selectedBudgetLines.filter(item => item.group === 'Capital');


export const developmentFundProject = {
  name: 'Social Development – Purchase of medical supplies',
  location: 'Ospital ng Makati / Makati Health Department',
  start: 'January 1, 2025',
  targetCompletion: 'December 31, 2025',
  latestCompletion: 100,
  latestCostM: 619.75,
  latestCostIncurredM: 619.73851097,
  reports: [
    {
      quarter: 'Q1',
      reportedCostM: 522.75,
      completion: 98.47,
      costIncurredM: 514.73851097,
      href: budgetSources.developmentFundQ1,
    },
    {
      quarter: 'Q3',
      reportedCostM: 572.75,
      completion: 98.60,
      costIncurredM: 564.73851097,
      href: budgetSources.developmentFundQ3,
    },
    {
      quarter: 'Q4',
      reportedCostM: 619.75,
      completion: 100,
      costIncurredM: 619.73851097,
      href: budgetSources.developmentFund,
    },
  ],
};
