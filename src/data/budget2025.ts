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
  { group: 'Personal Services', label: 'Personnel Economic Relief Allowance (PERA)', amountM: 249.288 },
  { group: 'Personal Services', label: 'Representation Allowance', amountM: 8.991 },
  { group: 'Personal Services', label: 'Transportation Allowance', amountM: 7.770 },
  { group: 'Personal Services', label: 'Clothing / Uniform Allowance', amountM: 71.337 },
  { group: 'Personal Services', label: 'Subsistence Allowance', amountM: 47.232 },
  { group: 'Personal Services', label: 'Laundry Allowance', amountM: 4.726 },
  { group: 'Personal Services', label: 'Honoraria', amountM: 96.367 },
  { group: 'Personal Services', label: 'Hazard Pay', amountM: 237.156 },
  { group: 'Personal Services', label: 'Longevity Pay', amountM: 6.000 },
  { group: 'Personal Services', label: 'Overtime and Night Pay', amountM: 204.750 },
  { group: 'Personal Services', label: 'Year End Bonus', amountM: 308.968 },
  { group: 'Personal Services', label: 'Cash Gift', amountM: 52.413 },
  { group: 'Personal Services', label: 'Other Bonuses and Allowances', amountM: 334.323 },
  { group: 'Personal Services', label: 'Retirement and Life Insurance Premiums', amountM: 437.947 },
  { group: 'Personal Services', label: 'Pag-IBIG Contributions', amountM: 25.016 },
  { group: 'Personal Services', label: 'PhilHealth Contributions', amountM: 88.847 },
  { group: 'Personal Services', label: 'Employees Compensation Insurance Premiums', amountM: 12.517 },
  { group: 'Personal Services', label: 'Terminal Leave Benefits', amountM: 156.180 },
  { group: 'Personal Services', label: 'Other Personnel Benefits', amountM: 450.326 },

  { group: 'Operating', label: 'Traveling Expenses - Local', amountM: 13.304 },
  { group: 'Operating', label: 'Traveling Expenses - Foreign', amountM: 0.547 },
  { group: 'Operating', label: 'Training Expenses', amountM: 182.213 },
  { group: 'Operating', label: 'Scholarship Grants / Expenses', amountM: 18.140 },
  { group: 'Operating', label: 'Office Supplies Expenses', amountM: 112.740 },
  { group: 'Operating', label: 'Accountable Forms Expenses', amountM: 12.429 },
  { group: 'Operating', label: 'Non-Accountable Forms Expenses', amountM: 7.276 },
  { group: 'Operating', label: 'Animal / Zoological Supplies Expenses', amountM: 13.175 },
  { group: 'Operating', label: 'Food Supplies Expenses', amountM: 28.098 },
  { group: 'Operating', label: 'Welfare Goods Expenses', amountM: 3.931 },
  { group: 'Operating', label: 'Drugs and Medicines Expenses', amountM: 900.109 },
  { group: 'Operating', label: 'Medical, Dental and Laboratory Supplies Expenses', amountM: 822.618 },
  { group: 'Operating', label: 'Fuel, Oil and Lubricants Expenses', amountM: 100.116 },
  { group: 'Operating', label: 'Agricultural and Marine Supplies Expenses', amountM: 2.009 },
  { group: 'Operating', label: 'Military, Police and Traffic Supplies Expenses', amountM: 19.038 },
  { group: 'Operating', label: 'Semi-Expendable Machinery and Equipment Expenses', amountM: 49.853 },
  { group: 'Operating', label: 'Semi-Expendable Furniture, Fixtures and Books Expenses', amountM: 16.527 },
  { group: 'Operating', label: 'Other Supplies and Materials Expenses', amountM: 819.375 },
  { group: 'Operating', label: 'Water Expenses', amountM: 70.000 },
  { group: 'Operating', label: 'Electricity Expenses', amountM: 400.000 },
  { group: 'Operating', label: 'Postage and Courier Services', amountM: 4.249 },
  { group: 'Operating', label: 'Telephone Expenses', amountM: 24.797 },
  { group: 'Operating', label: 'Internet Subscription Expenses', amountM: 50.422 },
  { group: 'Operating', label: 'Prizes', amountM: 20.004 },
  { group: 'Operating', label: 'Demolition and Relocation Expenses', amountM: 101.726 },
  { group: 'Operating', label: 'Confidential Expenses', amountM: 120.000 },
  { group: 'Operating', label: 'Extraordinary and Miscellaneous Expenses', amountM: 45.000 },
  { group: 'Operating', label: 'Consultancy Services', amountM: 50.690 },
  { group: 'Operating', label: 'Other Professional Services', amountM: 1157.576 },
  { group: 'Operating', label: 'Environment / Sanitary Services', amountM: 553.379 },
  { group: 'Operating', label: 'Janitorial Services', amountM: 170.800 },
  { group: 'Operating', label: 'Security Services', amountM: 354.586 },
  { group: 'Operating', label: 'Other General Services', amountM: 307.954 },
  { group: 'Operating', label: 'Repairs and Maintenance - Land Improvements', amountM: 3.017 },
  { group: 'Operating', label: 'Repairs and Maintenance - Infrastructure Assets', amountM: 58.565 },
  { group: 'Operating', label: 'Repairs and Maintenance - Buildings and Other Structures', amountM: 85.668 },
  { group: 'Operating', label: 'Repairs and Maintenance - Machinery and Equipment', amountM: 56.157 },
  { group: 'Operating', label: 'Repairs and Maintenance - Transportation Equipment', amountM: 44.500 },
  { group: 'Operating', label: 'Repairs and Maintenance - Furniture and Fixtures', amountM: 1.040 },
  { group: 'Operating', label: 'Repairs and Maintenance - Other Property, Plant and Equipment', amountM: 3.700 },
  { group: 'Operating', label: 'Taxes, Duties and Licenses', amountM: 23.330 },
  { group: 'Operating', label: 'Fidelity Bond Premiums', amountM: 1.000 },
  { group: 'Operating', label: 'Insurance Expenses', amountM: 63.000 },
  { group: 'Operating', label: 'Advertising Expenses', amountM: 49.025 },
  { group: 'Operating', label: 'Printing and Publication Expenses', amountM: 54.641 },
  { group: 'Operating', label: 'Rent Expenses', amountM: 100.965 },
  { group: 'Operating', label: 'Membership Dues and Contributions to Organizations', amountM: 0.641 },
  { group: 'Operating', label: 'Subscription Expenses', amountM: 9.117 },
  { group: 'Operating', label: 'Donations', amountM: 586.833 },
  { group: 'Operating', label: 'Other Maintenance and Operating Expenses', amountM: 1229.522 },
  { group: 'Operating', label: 'Subsidy to National Government Agencies', amountM: 63.000 },

  { group: 'Capital', label: 'Other Land Improvements', amountM: 10.000 },
  { group: 'Capital', label: 'Road Networks', amountM: 232.013 },
  { group: 'Capital', label: 'Power Supply Systems', amountM: 0.629 },
  { group: 'Capital', label: 'Other Infrastructure Assets', amountM: 30.000 },
  { group: 'Capital', label: 'Buildings', amountM: 138.000 },
  { group: 'Capital', label: 'Other Structures', amountM: 11.200 },
  { group: 'Capital', label: 'Office Equipment', amountM: 83.698 },
  { group: 'Capital', label: 'Information and Communication Technology Equipment', amountM: 146.117 },
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
