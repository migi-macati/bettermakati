export const budgetSources = {
  annualBudget2026:
    'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Annual%20Budget%20Report%202026.pdf',
  annualBudget:
    'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Annual%20Budget%202025.pdf',
  developmentFundQ1:
    'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q1%2020%20NTAU.pdf',
  developmentFundQ3:
    'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q3%2020%20NTAU.pdf',
  actuals: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2026/F14.pdf',
  developmentFund:
    'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q4%2020%20NTAU.pdf',
  procurement: 'https://notices.philgeps.gov.ph/',
  audit: 'https://www.coa.gov.ph/reports/annual-audit-reports/',
};

export const cityPopulation = 309770;

export const annualBudgetDocuments = [
  {
    year: 2026,
    href: budgetSources.annualBudget2026,
  },
  { year: 2025, href: budgetSources.annualBudget },
  {
    year: 2024,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/2024%20Annual%20Budget%20compressed%201.pdf',
  },
  {
    year: 2023,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/2023%20Annual%20Budget.pdf',
  },
  {
    year: 2022,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Annual%20Budget%202022.pdf',
  },
  {
    year: 2021,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/2021%20Budget%20Makati_FDP.pdf',
  },
  {
    year: 2020,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/2020%20Annual%20Budget%20Makati%20City.pdf',
  },
  {
    year: 2019,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/files/annual_budget_2019_lbp_form_nos._1_6_and.pdf',
  },
  {
    year: 2018,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/files/2018_annual_budget.pdf',
  },
  {
    year: 2017,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/files/full_disclosure/annual_budget_report/annual_budget_2017x.pdf',
  },
  {
    year: 2016,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/files/full_disclosure/annual_budget_report/lbp_form_3a_annual_budget2016_summary.pdf',
  },
  {
    year: 2015,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/files/full_disclosure/annual_budget_report/executive_budget_2015.pdf',
  },
  {
    year: 2014,
    href: 'https://www.makati.gov.ph/assets/uploads/staticmenu/files/full_disclosure/annual_budget_report/executive_budget_2014.pdf',
  },
];

export const actualFiscalHistory = [
  {
    year: 2019,
    receiptsM: 16744.94,
    expendituresM: 12794.62,
    href: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2020/F14.pdf',
  },
  {
    year: 2020,
    receiptsM: 12348.31,
    expendituresM: 40685.34,
    href: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2021/F14.pdf',
  },
  {
    year: 2021,
    receiptsM: 15717.81,
    expendituresM: 19268.91,
    href: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2022/F14.pdf',
  },
  {
    year: 2022,
    receiptsM: 18609.61,
    expendituresM: 19837.94,
    href: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2023/F14.pdf',
  },
  {
    year: 2023,
    receiptsM: 18496.34,
    expendituresM: 19498.01,
    href: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2024/F14.pdf',
  },
  {
    year: 2024,
    receiptsM: 20799.28,
    expendituresM: 17725.17,
    href: 'https://www.dbm.gov.ph/wp-content/uploads/BESF/BESF2025/F14.pdf',
  },
  {
    year: 2025,
    receiptsM: 24655.31,
    expendituresM: 22314.9,
    href: budgetSources.actuals,
  },
];

export const budgetSummary2026 = {
  year: 2026,
  totalBudgetM: 21000,
  personalServicesM: 6635.88,
  mooeM: 10473.626,
  capitalOutlayM: 1412.815,
  financialExpensesM: 1.09,
  specialPurposeAppropriationsM: 2476.589,
};

export const budgetCurrentEstimate2025 = {
  year: 2025,
  totalAppropriationM: 24373.87333413,
  personalServicesM: 6654.8293,
  mooeM: 13964.21753413,
  capitalOutlayM: 1380.8865,
  financialExpensesM: 1.09,
  specialPurposeAppropriationsM: 2372.85,
};

export const budgetByTypeCurrentEstimate2025 = [
  {
    label: 'Personal Services',
    amountM: budgetCurrentEstimate2025.personalServicesM,
  },
  {
    label: 'Maintenance & Other Operating Expenses',
    amountM: budgetCurrentEstimate2025.mooeM,
  },
  {
    label: 'Capital Outlay',
    amountM: budgetCurrentEstimate2025.capitalOutlayM,
  },
  {
    label: 'Special Purpose Appropriations',
    amountM: budgetCurrentEstimate2025.specialPurposeAppropriationsM,
  },
  {
    label: 'Financial Expenses',
    amountM: budgetCurrentEstimate2025.financialExpensesM,
  },
];

export const budgetByType2026 = [
  {
    label: 'Personal Services',
    amountM: 6635.88,
    share: 31.6,
    description: 'Salaries, benefits and personnel costs',
  },
  {
    label: 'Maintenance & Other Operating Expenses',
    amountM: 10473.626,
    share: 49.9,
    description: 'Operating programs, supplies, services and assistance',
  },
  {
    label: 'Capital Outlay',
    amountM: 1412.815,
    share: 6.7,
    description: 'Infrastructure, equipment and other capital assets',
  },
  {
    label: 'Special Purpose Appropriations',
    amountM: 2476.589,
    share: 11.8,
    description: 'Dedicated and statutory funds',
  },
  {
    label: 'Financial Expenses',
    amountM: 1.09,
    share: 0.01,
    description: 'Bank and other financial charges',
  },
];

export const dedicatedFunds2026 = [
  {
    label: '20% Development Fund',
    amountM: 676.313,
    description: '2026 proposed development-fund appropriation',
    href: budgetSources.annualBudget2026,
  },
  {
    label: 'Local Disaster Risk Reduction and Management Fund',
    amountM: 1000,
    description: '2026 proposed LDRRMF appropriation',
    href: budgetSources.annualBudget2026,
  },
  {
    label: '5% MMDA Contribution',
    amountM: 800.176,
    description: '2026 proposed statutory contribution',
    href: budgetSources.annualBudget2026,
  },
];

export const selectedBudgetLines2026 = [
  { group: 'Personal Services', accountCode: '5-01-01-010', label: 'Salaries and Wages - Regular', amountM: 2108.009 },
  { group: 'Personal Services', accountCode: '5-01-01-020', label: 'Salaries and Wages - Casual / Contractual', amountM: 1740.307 },
  { group: 'Personal Services', accountCode: '5-01-02-010', label: 'Personnel Economic Relief Allowance (PERA)', amountM: 246.052 },
  { group: 'Personal Services', accountCode: '5-01-02-020', label: 'Representation Allowance (RA)', amountM: 8.754 },
  { group: 'Personal Services', accountCode: '5-01-02-030', label: 'Transportation Allowance (TA)', amountM: 7.914 },
  { group: 'Personal Services', accountCode: '5-01-02-040', label: 'Clothing / Uniform Allowance', amountM: 71.054 },
  { group: 'Personal Services', accountCode: '5-01-02-050', label: 'Subsistence Allowance', amountM: 47.556 },
  { group: 'Personal Services', accountCode: '5-01-02-060', label: 'Laundry Allowance', amountM: 4.133 },
  { group: 'Personal Services', accountCode: '5-01-02-100', label: 'Honoraria', amountM: 66.672 },
  { group: 'Personal Services', accountCode: '5-01-02-110', label: 'Hazard Pay', amountM: 250.002 },
  { group: 'Personal Services', accountCode: '5-01-02-120', label: 'Longevity Pay', amountM: 5 },
  { group: 'Personal Services', accountCode: '5-01-02-130', label: 'Overtime and Night Pay', amountM: 165.87 },
  { group: 'Personal Services', accountCode: '5-01-02-140', label: 'Year End Bonus', amountM: 321.76 },
  { group: 'Personal Services', accountCode: '5-01-02-150', label: 'Cash Gift', amountM: 51.688 },
  { group: 'Personal Services', accountCode: '5-01-02-990', label: 'Other Bonuses and Allowances', amountM: 350.571 },
  { group: 'Personal Services', accountCode: '5-01-03-010', label: 'Retirement and Life Insurance Premiums', amountM: 448.565 },
  { group: 'Personal Services', accountCode: '5-01-03-020', label: 'Pag-IBIG Contributions', amountM: 31.357 },
  { group: 'Personal Services', accountCode: '5-01-03-030', label: 'PhilHealth Contributions', amountM: 92.252 },
  { group: 'Personal Services', accountCode: '5-01-03-040', label: 'Employees Compensation Insurance Premiums', amountM: 12.407 },
  { group: 'Personal Services', accountCode: '5-01-04-030', label: 'Terminal Leave Benefits', amountM: 163.609 },
  { group: 'Personal Services', accountCode: '5-01-04-990', label: 'Other Personnel Benefits', amountM: 442.348 },

  { group: 'Operating', accountCode: '5-02-01-010', label: 'Traveling Expenses - Local', amountM: 27.98 },
  { group: 'Operating', accountCode: '5-02-01-020', label: 'Traveling Expenses - Foreign', amountM: 3.79 },
  { group: 'Operating', accountCode: '5-02-02-010', label: 'Training Expenses', amountM: 278.835 },
  { group: 'Operating', accountCode: '5-02-02-020', label: 'Scholarship Grants / Expenses', amountM: 21.535 },
  { group: 'Operating', accountCode: '5-02-03-010', label: 'Office Supplies Expenses', amountM: 115.923 },
  { group: 'Operating', accountCode: '5-02-03-020', label: 'Accountable Forms Expenses', amountM: 6.898 },
  { group: 'Operating', accountCode: '5-02-03-030', label: 'Non-Accountable Forms Expenses', amountM: 7.082 },
  { group: 'Operating', accountCode: '5-02-03-040', label: 'Animal / Zoological Supplies Expenses', amountM: 11.522 },
  { group: 'Operating', accountCode: '5-02-03-050', label: 'Food Supplies Expenses', amountM: 38.401 },
  { group: 'Operating', accountCode: '5-02-03-060', label: 'Welfare Goods Expenses', amountM: 3.305 },
  { group: 'Operating', accountCode: '5-02-03-070', label: 'Drugs and Medicines Expenses', amountM: 1350.811 },
  { group: 'Operating', accountCode: '5-02-03-080', label: 'Medical, Dental and Laboratory Supplies Expenses', amountM: 1018.02 },
  { group: 'Operating', accountCode: '5-02-03-090', label: 'Fuel, Oil and Lubricants Expenses', amountM: 100.111 },
  { group: 'Operating', accountCode: '5-02-03-100', label: 'Agricultural and Marine Supplies Expenses', amountM: 2.093 },
  { group: 'Operating', accountCode: '5-02-03-120', label: 'Military, Police and Traffic Supplies Expenses', amountM: 17.207 },
  { group: 'Operating', accountCode: '5-02-03-210', label: 'Semi-Expendable Machinery and Equipment Expenses', amountM: 17.156 },
  { group: 'Operating', accountCode: '5-02-03-220', label: 'Semi-Expendable Furniture, Fixtures and Books Expenses', amountM: 37.258 },
  { group: 'Operating', accountCode: '5-02-03-990', label: 'Other Supplies and Materials Expenses', amountM: 812.82 },
  { group: 'Operating', accountCode: '5-02-04-010', label: 'Water Expenses', amountM: 85 },
  { group: 'Operating', accountCode: '5-02-04-020', label: 'Electricity Expenses', amountM: 400 },
  { group: 'Operating', accountCode: '5-02-05-010', label: 'Postage and Courier Services', amountM: 4.252 },
  { group: 'Operating', accountCode: '5-02-05-020', label: 'Telephone Expenses', amountM: 24.425 },
  { group: 'Operating', accountCode: '5-02-05-030', label: 'Internet Subscription Expenses', amountM: 49.934 },
  { group: 'Operating', accountCode: '5-02-06-020', label: 'Prizes', amountM: 31.414 },
  { group: 'Operating', accountCode: '5-02-08-010', label: 'Demolition and Relocation Expenses', amountM: 1.163 },
  { group: 'Operating', accountCode: '5-02-10-010', label: 'Confidential Expenses', amountM: 120 },
  { group: 'Operating', accountCode: '5-02-10-030', label: 'Extraordinary and Miscellaneous Expenses', amountM: 55 },
  { group: 'Operating', accountCode: '5-02-11-030', label: 'Consultancy Services', amountM: 64.09 },
  { group: 'Operating', accountCode: '5-02-11-990', label: 'Other Professional Services', amountM: 1181.596 },
  { group: 'Operating', accountCode: '5-02-12-010', label: 'Environment / Sanitary Services', amountM: 641.092 },
  { group: 'Operating', accountCode: '5-02-12-020', label: 'Janitorial Services', amountM: 215.8 },
  { group: 'Operating', accountCode: '5-02-12-030', label: 'Security Services', amountM: 404.5 },
  { group: 'Operating', accountCode: '5-02-12-990', label: 'Other General Services', amountM: 458.539 },
  { group: 'Operating', accountCode: '5-02-13-020', label: 'Repairs and Maintenance - Land Improvements', amountM: 1.511 },
  { group: 'Operating', accountCode: '5-02-13-030', label: 'Repairs and Maintenance - Infrastructure Assets', amountM: 61.042 },
  { group: 'Operating', accountCode: '5-02-13-040', label: 'Repairs and Maintenance - Buildings and Other Structures', amountM: 57.223 },
  { group: 'Operating', accountCode: '5-02-13-050', label: 'Repairs and Maintenance - Machinery and Equipment', amountM: 74.233 },
  { group: 'Operating', accountCode: '5-02-13-060', label: 'Repairs and Maintenance - Transportation Equipment', amountM: 52 },
  { group: 'Operating', accountCode: '5-02-13-070', label: 'Repairs and Maintenance - Furniture and Fixtures', amountM: 1.495 },
  { group: 'Operating', accountCode: '5-02-13-990', label: 'Repairs and Maintenance - Other Property, Plant and Equipment', amountM: 3.05 },
  { group: 'Operating', accountCode: '5-02-16-010', label: 'Taxes, Duties and Licenses', amountM: 6.753 },
  { group: 'Operating', accountCode: '5-02-16-020', label: 'Fidelity Bond Premiums', amountM: 1 },
  { group: 'Operating', accountCode: '5-02-16-030', label: 'Insurance Expenses', amountM: 18 },
  { group: 'Operating', accountCode: '5-02-99-010', label: 'Advertising Expenses', amountM: 10 },
  { group: 'Operating', accountCode: '5-02-99-020', label: 'Printing and Publication Expenses', amountM: 44.515 },
  { group: 'Operating', accountCode: '5-02-99-050', label: 'Rent Expenses', amountM: 131.133 },
  { group: 'Operating', accountCode: '5-02-99-060', label: 'Membership Dues and Contributions to Organizations', amountM: 0.815 },
  { group: 'Operating', accountCode: '5-02-99-070', label: 'Subscription Expenses', amountM: 9.221 },
  { group: 'Operating', accountCode: '5-02-99-080', label: 'Donations', amountM: 1284.205 },
  { group: 'Operating', accountCode: '5-02-99-990', label: 'Other Maintenance and Operating Expenses', amountM: 1109.878 },
  { group: 'Operating', accountCode: '5-02-14-020', label: 'Subsidy to National Government Agencies', amountM: 0 },

  { group: 'Capital', accountCode: '1-07-02-990', label: 'Other Land Improvements', amountM: 78.75 },
  { group: 'Capital', accountCode: '1-07-03-010', label: 'Road Networks', amountM: 78.122 },
  { group: 'Capital', accountCode: '1-07-03-030', label: 'Sewer Systems', amountM: 0 },
  { group: 'Capital', accountCode: '1-07-03-050', label: 'Power Supply Systems', amountM: 129 },
  { group: 'Capital', accountCode: '1-07-03-990', label: 'Other Infrastructure Assets', amountM: 61.55 },
  { group: 'Capital', accountCode: '1-07-04-010', label: 'Buildings', amountM: 130 },
  { group: 'Capital', accountCode: '1-07-04-020', label: 'School Buildings', amountM: 116 },
  { group: 'Capital', accountCode: '1-07-04-030', label: 'Hospitals and Health Centers', amountM: 12 },
  { group: 'Capital', accountCode: '1-07-04-990', label: 'Other Structures', amountM: 55.265 },
  { group: 'Capital', accountCode: '1-07-05-010', label: 'Machinery', amountM: 6.11 },
  { group: 'Capital', accountCode: '1-07-05-020', label: 'Office Equipment', amountM: 116.307 },
  { group: 'Capital', accountCode: '1-07-05-030', label: 'Information and Communication Technology Equipment', amountM: 143.485 },
  { group: 'Capital', accountCode: '1-07-05-040', label: 'Agricultural and Forestry Equipment', amountM: 9.5 },
  { group: 'Capital', accountCode: '1-07-05-070', label: 'Communication Equipment', amountM: 2.195 },
  { group: 'Capital', accountCode: '1-07-05-080', label: 'Construction and Heavy Equipment', amountM: 15.443 },
  { group: 'Capital', accountCode: '1-07-05-090', label: 'Disaster Response and Rescue Equipment', amountM: 0 },
  { group: 'Capital', accountCode: '1-07-05-100', label: 'Military, Police and Security Equipment', amountM: 167.733 },
  { group: 'Capital', accountCode: '1-07-05-110', label: 'Medical Equipment', amountM: 117.742 },
  { group: 'Capital', accountCode: '1-07-05-130', label: 'Sports Equipment', amountM: 2.938 },
  { group: 'Capital', accountCode: '1-07-05-140', label: 'Technical and Scientific Equipment', amountM: 27.397 },
  { group: 'Capital', accountCode: '1-07-05-990', label: 'Other Machinery and Equipment', amountM: 24.18 },
  { group: 'Capital', accountCode: '1-07-06-010', label: 'Motor Vehicles', amountM: 65.95 },
  { group: 'Capital', accountCode: '1-07-07-010', label: 'Furniture and Fixtures', amountM: 8.856 },
  { group: 'Capital', accountCode: '1-07-99-990', label: 'Other Property, Plant and Equipment', amountM: 8.684 },
  { group: 'Capital', accountCode: '1-09-01-020', label: 'Computer Software', amountM: 35.608 },

  { group: 'Financial Expenses', accountCode: '5-03-01-040', label: 'Bank Charges', amountM: 0.09 },
  { group: 'Financial Expenses', accountCode: '5-03-01-990', label: 'Other Financial Charges', amountM: 1 },

  { group: 'Special Purpose', accountCode: '5-02-14-020', label: '5% MMDA Contribution', amountM: 800.176 },
  { group: 'Special Purpose', accountCode: '5-02-14-030', label: 'Financial Assistance to Barangays', amountM: 0.1 },
  { group: 'Special Purpose', label: '20% Development Fund', amountM: 676.313 },
  { group: 'Special Purpose', label: 'Local Disaster Risk Reduction and Management Fund (LDRRMF)', amountM: 1000 },
];

export const capitalBudgetLines2026 = selectedBudgetLines2026.filter(
  item => item.group === 'Capital'
);

export const budgetSummary = {
  year: 2025,
  totalBudgetM: 19000,
  actualReceiptsM: 24655.31,
  actualExpendituresM: 22314.9,
  receiptsLessExpendituresM: 2340.41,
  beginningCashM: 22197.34,
  endingCashM: 21025.1,
};

export const budgetByType = [
  {
    label: 'Personal Services',
    amountM: 6494.927,
    share: 34.2,
    description: 'Salaries, benefits and personnel costs',
  },
  {
    label: 'Maintenance & Other Operating Expenses',
    amountM: 8986.402,
    share: 47.3,
    description: 'Operating programs, supplies, services and assistance',
  },
  {
    label: 'Capital Outlay',
    amountM: 1195.821,
    share: 6.3,
    description: 'Infrastructure, equipment and other capital assets',
  },
  {
    label: 'Special Purpose Appropriations',
    amountM: 2322.85,
    share: 12.2,
    description: 'Dedicated and statutory funds',
  },
];

export const revenueSources = [
  {
    label: 'Local sources',
    amountM: 23049.84,
    share: 93.5,
    description: 'Taxes, fees, charges and local non-tax revenue',
  },
  {
    label: 'External sources',
    amountM: 1599.21,
    share: 6.5,
    description: 'NTA and other national-government shares',
  },
  {
    label: 'Non-income receipts',
    amountM: 6.26,
    share: 0.03,
    description: 'Capital and other non-income receipts',
  },
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
  {
    label: 'Social Services',
    amountM: 12309.25,
    share: 55.2,
    description: 'Health, education, welfare and related services',
  },
  {
    label: 'General Services',
    amountM: 6650.47,
    share: 29.8,
    description: 'General government and administration',
  },
  {
    label: 'Economic Services',
    amountM: 1907.44,
    share: 8.5,
    description: 'Economic and development services',
  },
  {
    label: 'Capital Investment',
    amountM: 1438.1,
    share: 6.4,
    description: 'Property, plant and equipment / capital investment',
  },
  {
    label: 'Debt Services',
    amountM: 9.64,
    share: 0.04,
    description: 'Reported debt-service expenditure',
  },
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
  {
    group: 'Personal Services',
    label: 'Salaries and Wages - Regular',
    amountM: 2062.943,
  },
  {
    group: 'Personal Services',
    label: 'Salaries and Wages - Casual / Contractual',
    amountM: 1631.83,
  },
  {
    group: 'Personal Services',
    label: 'Personnel Economic Relief Allowance (PERA)',
    amountM: 249.288,
  },
  {
    group: 'Personal Services',
    label: 'Representation Allowance',
    amountM: 8.991,
  },
  {
    group: 'Personal Services',
    label: 'Transportation Allowance',
    amountM: 7.77,
  },
  {
    group: 'Personal Services',
    label: 'Clothing / Uniform Allowance',
    amountM: 71.337,
  },
  {
    group: 'Personal Services',
    label: 'Subsistence Allowance',
    amountM: 47.232,
  },
  { group: 'Personal Services', label: 'Laundry Allowance', amountM: 4.726 },
  { group: 'Personal Services', label: 'Honoraria', amountM: 96.367 },
  { group: 'Personal Services', label: 'Hazard Pay', amountM: 237.156 },
  { group: 'Personal Services', label: 'Longevity Pay', amountM: 6.0 },
  {
    group: 'Personal Services',
    label: 'Overtime and Night Pay',
    amountM: 204.75,
  },
  { group: 'Personal Services', label: 'Year End Bonus', amountM: 308.968 },
  { group: 'Personal Services', label: 'Cash Gift', amountM: 52.413 },
  {
    group: 'Personal Services',
    label: 'Other Bonuses and Allowances',
    amountM: 334.323,
  },
  {
    group: 'Personal Services',
    label: 'Retirement and Life Insurance Premiums',
    amountM: 437.947,
  },
  {
    group: 'Personal Services',
    label: 'Pag-IBIG Contributions',
    amountM: 25.016,
  },
  {
    group: 'Personal Services',
    label: 'PhilHealth Contributions',
    amountM: 88.847,
  },
  {
    group: 'Personal Services',
    label: 'Employees Compensation Insurance Premiums',
    amountM: 12.517,
  },
  {
    group: 'Personal Services',
    label: 'Terminal Leave Benefits',
    amountM: 156.18,
  },
  {
    group: 'Personal Services',
    label: 'Other Personnel Benefits',
    amountM: 450.326,
  },

  { group: 'Operating', label: 'Traveling Expenses - Local', amountM: 13.304 },
  { group: 'Operating', label: 'Traveling Expenses - Foreign', amountM: 0.547 },
  { group: 'Operating', label: 'Training Expenses', amountM: 182.213 },
  {
    group: 'Operating',
    label: 'Scholarship Grants / Expenses',
    amountM: 18.14,
  },
  { group: 'Operating', label: 'Office Supplies Expenses', amountM: 112.74 },
  { group: 'Operating', label: 'Accountable Forms Expenses', amountM: 12.429 },
  {
    group: 'Operating',
    label: 'Non-Accountable Forms Expenses',
    amountM: 7.276,
  },
  {
    group: 'Operating',
    label: 'Animal / Zoological Supplies Expenses',
    amountM: 13.175,
  },
  { group: 'Operating', label: 'Food Supplies Expenses', amountM: 28.098 },
  { group: 'Operating', label: 'Welfare Goods Expenses', amountM: 3.931 },
  {
    group: 'Operating',
    label: 'Drugs and Medicines Expenses',
    amountM: 900.109,
  },
  {
    group: 'Operating',
    label: 'Medical, Dental and Laboratory Supplies Expenses',
    amountM: 822.618,
  },
  {
    group: 'Operating',
    label: 'Fuel, Oil and Lubricants Expenses',
    amountM: 100.116,
  },
  {
    group: 'Operating',
    label: 'Agricultural and Marine Supplies Expenses',
    amountM: 2.009,
  },
  {
    group: 'Operating',
    label: 'Military, Police and Traffic Supplies Expenses',
    amountM: 19.038,
  },
  {
    group: 'Operating',
    label: 'Semi-Expendable Machinery and Equipment Expenses',
    amountM: 49.853,
  },
  {
    group: 'Operating',
    label: 'Semi-Expendable Furniture, Fixtures and Books Expenses',
    amountM: 16.527,
  },
  {
    group: 'Operating',
    label: 'Other Supplies and Materials Expenses',
    amountM: 819.375,
  },
  { group: 'Operating', label: 'Water Expenses', amountM: 70.0 },
  { group: 'Operating', label: 'Electricity Expenses', amountM: 400.0 },
  { group: 'Operating', label: 'Postage and Courier Services', amountM: 4.249 },
  { group: 'Operating', label: 'Telephone Expenses', amountM: 24.797 },
  {
    group: 'Operating',
    label: 'Internet Subscription Expenses',
    amountM: 50.422,
  },
  { group: 'Operating', label: 'Prizes', amountM: 20.004 },
  {
    group: 'Operating',
    label: 'Demolition and Relocation Expenses',
    amountM: 101.726,
  },
  { group: 'Operating', label: 'Confidential Expenses', amountM: 120.0 },
  {
    group: 'Operating',
    label: 'Extraordinary and Miscellaneous Expenses',
    amountM: 45.0,
  },
  { group: 'Operating', label: 'Consultancy Services', amountM: 50.69 },
  {
    group: 'Operating',
    label: 'Other Professional Services',
    amountM: 1157.576,
  },
  {
    group: 'Operating',
    label: 'Environment / Sanitary Services',
    amountM: 553.379,
  },
  { group: 'Operating', label: 'Janitorial Services', amountM: 170.8 },
  { group: 'Operating', label: 'Security Services', amountM: 354.586 },
  { group: 'Operating', label: 'Other General Services', amountM: 307.954 },
  {
    group: 'Operating',
    label: 'Repairs and Maintenance - Land Improvements',
    amountM: 3.017,
  },
  {
    group: 'Operating',
    label: 'Repairs and Maintenance - Infrastructure Assets',
    amountM: 58.565,
  },
  {
    group: 'Operating',
    label: 'Repairs and Maintenance - Buildings and Other Structures',
    amountM: 85.668,
  },
  {
    group: 'Operating',
    label: 'Repairs and Maintenance - Machinery and Equipment',
    amountM: 56.157,
  },
  {
    group: 'Operating',
    label: 'Repairs and Maintenance - Transportation Equipment',
    amountM: 44.5,
  },
  {
    group: 'Operating',
    label: 'Repairs and Maintenance - Furniture and Fixtures',
    amountM: 1.04,
  },
  {
    group: 'Operating',
    label: 'Repairs and Maintenance - Other Property, Plant and Equipment',
    amountM: 3.7,
  },
  { group: 'Operating', label: 'Taxes, Duties and Licenses', amountM: 23.33 },
  { group: 'Operating', label: 'Fidelity Bond Premiums', amountM: 1.0 },
  { group: 'Operating', label: 'Insurance Expenses', amountM: 63.0 },
  { group: 'Operating', label: 'Advertising Expenses', amountM: 49.025 },
  {
    group: 'Operating',
    label: 'Printing and Publication Expenses',
    amountM: 54.641,
  },
  { group: 'Operating', label: 'Rent Expenses', amountM: 100.965 },
  {
    group: 'Operating',
    label: 'Membership Dues and Contributions to Organizations',
    amountM: 0.641,
  },
  { group: 'Operating', label: 'Subscription Expenses', amountM: 9.117 },
  { group: 'Operating', label: 'Donations', amountM: 586.833 },
  {
    group: 'Operating',
    label: 'Other Maintenance and Operating Expenses',
    amountM: 1229.522,
  },
  {
    group: 'Operating',
    label: 'Subsidy to National Government Agencies',
    amountM: 63.0,
  },

  { group: 'Capital', label: 'Other Land Improvements', amountM: 10.0 },
  { group: 'Capital', label: 'Road Networks', amountM: 232.013 },
  { group: 'Capital', label: 'Power Supply Systems', amountM: 0.629 },
  { group: 'Capital', label: 'Other Infrastructure Assets', amountM: 30.0 },
  { group: 'Capital', label: 'Buildings', amountM: 138.0 },
  { group: 'Capital', label: 'Other Structures', amountM: 11.2 },
  { group: 'Capital', label: 'Office Equipment', amountM: 83.698 },
  {
    group: 'Capital',
    label: 'Information and Communication Technology Equipment',
    amountM: 146.117,
  },
];

export const capitalBudgetLines = selectedBudgetLines.filter(
  item => item.group === 'Capital'
);

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
      completion: 98.6,
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
