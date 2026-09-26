import { currentMakatiPopulation2024 } from './barangays';

import { officeBudgetDetails2026Remaining } from './budgetOfficeDetails2026Remaining';

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

export const cityPopulation = currentMakatiPopulation2024;

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

export const officeBudgetTotals2026 = [
  { office: "Accounting Department", amountM: 109.213, pages: "6–7", pageStart: 6 },
  { office: "Assessment Department", amountM: 78.031, pages: "8–9", pageStart: 8 },
  { office: "Business Permits Office", amountM: 77.17, pages: "10–11", pageStart: 10 },
  { office: "Budget Department", amountM: 42.543, pages: "12–13", pageStart: 12 },
  { office: "City Administrator's Office", amountM: 645.046, pages: "14–15", pageStart: 14 },
  { office: "City Civil Registration Office", amountM: 45.87, pages: "16–17", pageStart: 16 },
  { office: "Department of Engineering and Public Works", amountM: 658.016, pages: "18–19", pageStart: 18 },
  { office: "Department of Environmental Services", amountM: 879.86, pages: "20–21", pageStart: 20 },
  { office: "Education Department", amountM: 234.563, pages: "22–23", pageStart: 22 },
  { office: "Economic Enterprise Management Office", amountM: 39.82, pages: "24–25", pageStart: 24 },
  { office: "Finance Department", amountM: 160.774, pages: "26–27", pageStart: 26 },
  { office: "General Services Department", amountM: 2887.683, pages: "28–30", pageStart: 28 },
  { office: "Human Resource Development Office", amountM: 358.3, pages: "31–32", pageStart: 31 },
  { office: "Internal Audit Services", amountM: 39.85, pages: "33–34", pageStart: 33 },
  { office: "Information and Community Relations Department", amountM: 76.59, pages: "35–36", pageStart: 35 },
  { office: "International Relations Department", amountM: 43.09, pages: "37–38", pageStart: 37 },
  { office: "Law Department", amountM: 126.79, pages: "39–40", pageStart: 39 },
  { office: "Liga ng mga Barangay", amountM: 0, pages: "42", pageStart: 42, note: "No 2026 proposed appropriation is shown on the office sheet." },
  { office: "Makati Action Center", amountM: 344.804, pages: "43–44", pageStart: 43 },
  { office: "Makati Disaster Risk Reduction and Management Office", amountM: 1219.864, pages: "45–46", pageStart: 45 },
  { office: "Museum and Cultural Affairs Office", amountM: 94.373, pages: "47–48", pageStart: 47 },
  { office: "Makati Cooperative Development Office", amountM: 21.749, pages: "49–50", pageStart: 49 },
  { office: "Makati Health Department", amountM: 2299.384, pages: "51–53", pageStart: 51 },
  { office: "Makati Social Welfare Department", amountM: 2378.367, pages: "54–55", pageStart: 54 },
  { office: "Office of the Building Official", amountM: 103.894, pages: "57", pageStart: 57 },
  { office: "Office of the Mayor", amountM: 2006.192, pages: "58–60", pageStart: 58 },
  { office: "Office of the Secretary to the Sangguniang Panlungsod", amountM: 22.646, pages: "61–62", pageStart: 61 },
  { office: "Office of the Vice Mayor", amountM: 54.448, pages: "63–64", pageStart: 63 },
  { office: "Ospital ng Makati", amountM: 3530.707, pages: "65–66", pageStart: 65 },
  { office: "Public Employment Service Office", amountM: 217.706, pages: "68–69", pageStart: 68 },
  { office: "Public Safety Department", amountM: 447.611, pages: "70–71", pageStart: 70 },
  { office: "Sangguniang Panlungsod", amountM: 110.349, pages: "72–73", pageStart: 72 },
  { office: "University of Makati", amountM: 1182.342, pages: "74–76", pageStart: 74 },
  { office: "Urban Development Department", amountM: 211.302, pages: "77–78", pageStart: 77 },
  { office: "Veterinary Services Department", amountM: 64.288, pages: "79–80", pageStart: 79 },
  { office: "Youth and Sports Development Department", amountM: 186.765, pages: "81–82", pageStart: 81 },
];

export type OfficeBudgetDetailGroup2026 = 'Personal Services' | 'Operating' | 'Capital' | 'Financial Expenses' | 'Special Purpose';

export interface OfficeBudgetLine2026 {
  group: OfficeBudgetDetailGroup2026;
  accountCode: string;
  label: string;
  amountM: number;
  page: number;
}

export const officeBudgetDetails2026: Array<{
  office: string;
  pages: string;
  lines: OfficeBudgetLine2026[];
}> = [
  {
    "office": "Accounting Department",
    "pages": "6–7",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 17.741,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 39.324,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 3.348,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.114,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.114,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.854,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 12,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 5.089,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.7,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 5.219,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 6.822,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.339,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 1.411,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.17,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 3.206,
        "page": 6
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 7.279,
        "page": 6
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.08,
        "page": 6
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 3.772,
        "page": 6
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-030",
        "label": "Non-Accountable Forms Expenses",
        "amountM": 0.336,
        "page": 6
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.06,
        "page": 6
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-220",
        "label": "Semi-Expendable Furniture, Fixtures and Books Expenses",
        "amountM": 0.209,
        "page": 6
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 0.116,
        "page": 7
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 0.1,
        "page": 7
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 0.1,
        "page": 7
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 0.71,
        "page": 7
      }
    ]
  },
  {
    "office": "Assessment Department",
    "pages": "8–9",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 41.388,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 4.256,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 2.424,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.318,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.318,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.721,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 0.1,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 3.861,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.52,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 3.896,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 5.286,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.243,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 1.089,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.122,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 4.485,
        "page": 8
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 3.378,
        "page": 8
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.1,
        "page": 8
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 1.702,
        "page": 8
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 0.031,
        "page": 8
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-030",
        "label": "Non-Accountable Forms Expenses",
        "amountM": 0.036,
        "page": 8
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.245,
        "page": 8
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-220",
        "label": "Semi-Expendable Furniture, Fixtures and Books Expenses",
        "amountM": 0.03,
        "page": 9
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 0.012,
        "page": 9
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 0.1,
        "page": 9
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 1.9,
        "page": 9
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-030",
        "label": "Information and Communication Technology Equipment",
        "amountM": 1.47,
        "page": 9
      }
    ]
  },
  {
    "office": "Business Permits Office",
    "pages": "10–11",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 33.866,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 4.295,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 2.472,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.102,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.102,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.721,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 2.4,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 2.979,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.515,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 3.31,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 4.164,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.248,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 0.868,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.124,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 3.133,
        "page": 10
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 3.167,
        "page": 10
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.3,
        "page": 10
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 0.63,
        "page": 10
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-020",
        "label": "Accountable Forms Expenses",
        "amountM": 1.43,
        "page": 10
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-030",
        "label": "Non-Accountable Forms Expenses",
        "amountM": 3.463,
        "page": 10
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.005,
        "page": 10
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-220",
        "label": "Semi-Expendable Furniture, Fixtures and Books Expenses",
        "amountM": 0.411,
        "page": 11
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 0.775,
        "page": 11
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-010",
        "label": "Postage and Courier Services",
        "amountM": 0.1,
        "page": 11
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 0.4,
        "page": 11
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 0.05,
        "page": 11
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 4.85,
        "page": 11
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-030",
        "label": "Information and Communication Technology Equipment",
        "amountM": 2.29,
        "page": 11
      }
    ]
  },
  {
    "office": "Budget Department",
    "pages": "12–13",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 11.527,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 8.975,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 1.152,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.114,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.336,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 1.3,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 1.737,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.255,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 1.85,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 2.427,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.123,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 0.496,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.062,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 0.711,
        "page": 12
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 2.477,
        "page": 12
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 2.744,
        "page": 12
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 0.03,
        "page": 12
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 0.049,
        "page": 12
      },
      {
        "group": "Operating",
        "accountCode": "5-02-11-990",
        "label": "Other Professional Services",
        "amountM": 6,
        "page": 12
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 0.025,
        "page": 12
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 0.133,
        "page": 13
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 0.02,
        "page": 13
      }
    ]
  },
  {
    "office": "City Administrator's Office",
    "pages": "14–15",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 5.381,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 21.658,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 2.28,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.114,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.114,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.665,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 0.5,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 2.298,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.475,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 2.593,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 3.216,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.228,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 0.662,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.114,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 0.806,
        "page": 14
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 3.894,
        "page": 14
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.05,
        "page": 14
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 131.699,
        "page": 14
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 2.666,
        "page": 14
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.447,
        "page": 14
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 9.862,
        "page": 14
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-010",
        "label": "Postage and Courier Services",
        "amountM": 0.002,
        "page": 15
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-020",
        "label": "Telephone Expenses",
        "amountM": 0.7,
        "page": 15
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-030",
        "label": "Internet Subscription Expenses",
        "amountM": 0.5,
        "page": 15
      },
      {
        "group": "Operating",
        "accountCode": "5-02-11-990",
        "label": "Other Professional Services",
        "amountM": 74.69,
        "page": 15
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 0.44,
        "page": 15
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-070",
        "label": "Repairs and Maintenance - Furniture and Fixtures",
        "amountM": 0.02,
        "page": 15
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 1,
        "page": 15
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-070",
        "label": "Subscription Expenses",
        "amountM": 0.021,
        "page": 15
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-080",
        "label": "Donations",
        "amountM": 5,
        "page": 15
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 189.208,
        "page": 15
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-020",
        "label": "Office Equipment",
        "amountM": 11.05,
        "page": 15
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-030",
        "label": "Information and Communication Technology Equipment",
        "amountM": 4.86,
        "page": 15
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-070",
        "label": "Communication Equipment",
        "amountM": 0.05,
        "page": 15
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-100",
        "label": "Military, Police and Security Equipment",
        "amountM": 167.733,
        "page": 15
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-990",
        "label": "Other Machinery and Equipment",
        "amountM": 0.05,
        "page": 15
      }
    ]
  },
{
    "office": "City Civil Registration Office",
    "pages": "16–17",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 18.812,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 5.942,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 1.656,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.102,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.102,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.483,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 2,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 2.039,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.345,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 2.266,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 2.85,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.166,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 0.594,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.083,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 1.15,
        "page": 16
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 2.666,
        "page": 16
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.01,
        "page": 16
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 0.836,
        "page": 16
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 0.01,
        "page": 16
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-020",
        "label": "Accountable Forms Expenses",
        "amountM": 0.003,
        "page": 16
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 0.051,
        "page": 16
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-010",
        "label": "Postage and Courier Services",
        "amountM": 0.105,
        "page": 17
      },
      {
        "group": "Operating",
        "accountCode": "5-02-11-990",
        "label": "Other Professional Services",
        "amountM": 3.5,
        "page": 17
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 0.02,
        "page": 17
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-070",
        "label": "Repairs and Maintenance - Furniture and Fixtures",
        "amountM": 0.02,
        "page": 17
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 0.05,
        "page": 17
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 0.009,
        "page": 17
      }
    ]
  },
  {
    "office": "Department of Engineering and Public Works",
    "pages": "18–19",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 91.315,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 66.636,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 13.404,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.318,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.318,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 3.682,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 10,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 13.472,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 2.85,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 14.78,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 18.21,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 1.341,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 3.785,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.671,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 5.739,
        "page": 18
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 21.332,
        "page": 18
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 8.754,
        "page": 18
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 1.284,
        "page": 18
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 1.045,
        "page": 18
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-220",
        "label": "Semi-Expendable Furniture, Fixtures and Books Expenses",
        "amountM": 1.26,
        "page": 18
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 30.902,
        "page": 18
      },
      {
        "group": "Operating",
        "accountCode": "5-02-08-010",
        "label": "Demolition and Relocation Expenses",
        "amountM": 0.296,
        "page": 18
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-030",
        "label": "Repairs and Maintenance - Infrastructure Assets",
        "amountM": 56.71,
        "page": 19
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 14.787,
        "page": 19
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 14.461,
        "page": 19
      },
      {
        "group": "Capital",
        "accountCode": "1-07-02-990",
        "label": "Other Land Improvements",
        "amountM": 78.75,
        "page": 19
      },
      {
        "group": "Capital",
        "accountCode": "1-07-03-010",
        "label": "Road Networks",
        "amountM": 78.122,
        "page": 19
      },
      {
        "group": "Capital",
        "accountCode": "1-07-03-990",
        "label": "Other Infrastructure Assets",
        "amountM": 61.55,
        "page": 19
      },
      {
        "group": "Capital",
        "accountCode": "1-07-04-010",
        "label": "Buildings",
        "amountM": 25,
        "page": 19
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-020",
        "label": "Office Equipment",
        "amountM": 0.093,
        "page": 19
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-080",
        "label": "Construction and Heavy Equipment",
        "amountM": 1.06,
        "page": 19
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-090",
        "label": "Disaster Response and Rescue Equipment",
        "amountM": 0.139,
        "page": 19
      },
      {
        "group": "Capital",
        "accountCode": "1-07-06-010",
        "label": "Motor Vehicles",
        "amountM": 15.95,
        "page": 19
      }
    ]
  },
  {
    "office": "Department of Environmental Services",
    "pages": "20–21",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 169.028,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 29.97,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 18.744,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.216,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.216,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 5.467,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 6,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 16.65,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 3.905,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 19.023,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 23.319,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 1.875,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 4.85,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.938,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 7.992,
        "page": 20
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 28.439,
        "page": 20
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.05,
        "page": 20
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 0.771,
        "page": 20
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-090",
        "label": "Fuel, Oil and Lubricants Expenses",
        "amountM": 0.097,
        "page": 20
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-100",
        "label": "Agricultural and Marine Supplies Expenses",
        "amountM": 2.093,
        "page": 20
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.406,
        "page": 21
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 6.672,
        "page": 21
      },
      {
        "group": "Operating",
        "accountCode": "5-02-06-020",
        "label": "Prizes",
        "amountM": 4.375,
        "page": 21
      },
      {
        "group": "Operating",
        "accountCode": "5-02-11-030",
        "label": "Consultancy Services",
        "amountM": 8,
        "page": 21
      },
      {
        "group": "Operating",
        "accountCode": "5-02-12-010",
        "label": "Environment/Sanitary Services",
        "amountM": 489.916,
        "page": 21
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-020",
        "label": "Repairs and Maintenance - Land Improvements",
        "amountM": 1.511,
        "page": 21
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-030",
        "label": "Repairs and Maintenance - Infrastructure Assets",
        "amountM": 4.332,
        "page": 21
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 3.23,
        "page": 21
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 0.009,
        "page": 21
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-050",
        "label": "Rent Expenses",
        "amountM": 0.065,
        "page": 21
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 2.568,
        "page": 21
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-020",
        "label": "Office Equipment",
        "amountM": 0.205,
        "page": 21
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-030",
        "label": "Information and Communication Technology Equipment",
        "amountM": 0.224,
        "page": 21
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-040",
        "label": "Agricultural and Forestry Equipment",
        "amountM": 9.5,
        "page": 21
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-080",
        "label": "Construction and Heavy Equipment",
        "amountM": 9,
        "page": 21
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-990",
        "label": "Other Machinery and Equipment",
        "amountM": 0.15,
        "page": 21
      },
      {
        "group": "Capital",
        "accountCode": "1-07-99-990",
        "label": "Other Property, Plant and Equipment",
        "amountM": 0.054,
        "page": 21
      }
    ]
  },
  {
    "office": "Education Department",
    "pages": "22–23",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 27.187,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 0.445,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 2.1,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.216,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.216,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.616,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-050",
        "label": "Subsistence Allowance",
        "amountM": 0.126,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-060",
        "label": "Laundry Allowance",
        "amountM": 0.013,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-110",
        "label": "Hazard Pay",
        "amountM": 0.874,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 2.375,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.44,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 2.787,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 3.322,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.212,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 0.682,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.106,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 1.194,
        "page": 22
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 3.452,
        "page": 22
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 4.088,
        "page": 22
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-020",
        "label": "Scholarship Grants/Expenses",
        "amountM": 6.86,
        "page": 22
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.724,
        "page": 22
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-220",
        "label": "Semi-Expendable Furniture, Fixtures and Books Expenses",
        "amountM": 1.365,
        "page": 23
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 44.855,
        "page": 23
      },
      {
        "group": "Operating",
        "accountCode": "5-02-06-020",
        "label": "Prizes",
        "amountM": 0.33,
        "page": 23
      },
      {
        "group": "Operating",
        "accountCode": "5-02-11-990",
        "label": "Other Professional Services",
        "amountM": 110.796,
        "page": 23
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 2.014,
        "page": 23
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-050",
        "label": "Rent Expenses",
        "amountM": 8.25,
        "page": 23
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-070",
        "label": "Subscription Expenses",
        "amountM": 1.3,
        "page": 23
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 6.972,
        "page": 23
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-070",
        "label": "Communication Equipment",
        "amountM": 0.24,
        "page": 23
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-140",
        "label": "Technical and Scientific Equipment",
        "amountM": 0.406,
        "page": 23
      }
    ]
  },
  {
    "office": "Economic Enterprise Management Office",
    "pages": "24–25",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 17.749,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 1.475,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 1.26,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.102,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.102,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.364,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 1.672,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.285,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 1.758,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 2.258,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.128,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 0.47,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.064,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 0.437,
        "page": 24
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 1.771,
        "page": 24
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.005,
        "page": 24
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 0.105,
        "page": 24
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.042,
        "page": 24
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 0.723,
        "page": 24
      },
      {
        "group": "Operating",
        "accountCode": "5-02-06-020",
        "label": "Prizes",
        "amountM": 0.15,
        "page": 25
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-040",
        "label": "Repairs and Maintenance - Buildings and Other Structures",
        "amountM": 6.594,
        "page": 25
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 0.167,
        "page": 25
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 0.639,
        "page": 25
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-010",
        "label": "Machinery",
        "amountM": 1.5,
        "page": 25
      }
    ]
  },
{
    "office": "Finance Department",
    "pages": "26–27",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 53.697,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 16.874,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 4.404,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.216,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.216,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 1.288,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-100",
        "label": "Honoraria",
        "amountM": 1,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 10,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 5.653,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.92,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 6.218,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 7.876,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.441,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 1.632,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.221,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 3.918,
        "page": 26
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 7.754,
        "page": 26
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 2.75,
        "page": 26
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 0.57,
        "page": 26
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-020",
        "label": "Accountable Forms Expenses",
        "amountM": 5.465,
        "page": 26
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-030",
        "label": "Non-Accountable Forms Expenses",
        "amountM": 0.695,
        "page": 26
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.313,
        "page": 26
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-220",
        "label": "Semi-Expendable Furniture, Fixtures and Books Expenses",
        "amountM": 1.349,
        "page": 26
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 1.997,
        "page": 27
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-010",
        "label": "Postage and Courier Services",
        "amountM": 4,
        "page": 27
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 0.1,
        "page": 27
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-070",
        "label": "Repairs and Maintenance - Furniture and Fixtures",
        "amountM": 0.05,
        "page": 27
      },
      {
        "group": "Operating",
        "accountCode": "5-02-16-020",
        "label": "Fidelity Bond Premiums",
        "amountM": 1,
        "page": 27
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 3.532,
        "page": 27
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 5.075,
        "page": 27
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-020",
        "label": "Office Equipment",
        "amountM": 2.5,
        "page": 27
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-030",
        "label": "Information and Communication Technology Equipment",
        "amountM": 7.71,
        "page": 27
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-070",
        "label": "Communication Equipment",
        "amountM": 0.05,
        "page": 27
      },
      {
        "group": "Capital",
        "accountCode": "1-07-07-010",
        "label": "Furniture and Fixtures",
        "amountM": 0.2,
        "page": 27
      },
      {
        "group": "Operating",
        "accountCode": "5-03-01-040",
        "label": "Bank Charges",
        "amountM": 0.09,
        "page": 27
      },
      {
        "group": "Operating",
        "accountCode": "5-03-01-990",
        "label": "Other Financial Charges",
        "amountM": 1,
        "page": 27
      }
    ]
  },
  {
    "office": "General Services Department",
    "pages": "28–30",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 91.35,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 36.186,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 11.868,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.216,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.216,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 3.451,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 0.5,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 10.528,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 2.495,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 12.556,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 14.624,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 1.194,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 3.039,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.597,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 6.965,
        "page": 28
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 16.4,
        "page": 28
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 4.734,
        "page": 28
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 108.92,
        "page": 28
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-090",
        "label": "Fuel, Oil and Lubricants Expenses",
        "amountM": 100.014,
        "page": 28
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 1.284,
        "page": 28
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-220",
        "label": "Semi-Expendable Furniture, Fixtures and Books Expenses",
        "amountM": 7.326,
        "page": 28
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 35.954,
        "page": 28
      },
      {
        "group": "Operating",
        "accountCode": "5-02-04-010",
        "label": "Water Expenses",
        "amountM": 85,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-04-020",
        "label": "Electricity Expenses",
        "amountM": 400,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-12-010",
        "label": "Environment/Sanitary Services",
        "amountM": 130.59,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-12-020",
        "label": "Janitorial Services",
        "amountM": 215.8,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-12-030",
        "label": "Security Services",
        "amountM": 404.5,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-12-990",
        "label": "Other General Services",
        "amountM": 445.874,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-040",
        "label": "Repairs and Maintenance - Buildings and Other Structures",
        "amountM": 40.575,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 22.792,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-060",
        "label": "Repairs and Maintenance - Transportation Equipment",
        "amountM": 52,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-070",
        "label": "Repairs and Maintenance - Furniture and Fixtures",
        "amountM": 1.1,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-16-010",
        "label": "Taxes, Duties and Licenses",
        "amountM": 3.898,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-16-030",
        "label": "Insurance Expenses",
        "amountM": 18,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 1.976,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-050",
        "label": "Rent Expenses",
        "amountM": 66.71,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-060",
        "label": "Membership Dues and Contributions to Organizations",
        "amountM": 0.018,
        "page": 29
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 0.15,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-03-050",
        "label": "Power Supply Systems",
        "amountM": 129,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-04-010",
        "label": "Buildings",
        "amountM": 105,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-04-020",
        "label": "School Buildings",
        "amountM": 116,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-04-030",
        "label": "Hospitals and Health Centers",
        "amountM": 12,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-04-990",
        "label": "Other Structures",
        "amountM": 0.265,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-010",
        "label": "Machinery",
        "amountM": 2.96,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-020",
        "label": "Office Equipment",
        "amountM": 98.204,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-030",
        "label": "Information and Communication Technology Equipment",
        "amountM": 25,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-080",
        "label": "Construction and Heavy Equipment",
        "amountM": 6.304,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-990",
        "label": "Other Machinery and Equipment",
        "amountM": 23.7,
        "page": 29
      },
      {
        "group": "Capital",
        "accountCode": "1-07-07-010",
        "label": "Furniture and Fixtures",
        "amountM": 2.74,
        "page": 30
      },
      {
        "group": "Capital",
        "accountCode": "1-07-99-990",
        "label": "Other Property, Plant and Equipment",
        "amountM": 7.11,
        "page": 30
      }
    ]
  },
  {
    "office": "Human Resource Development Office",
    "pages": "31–32",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 22.443,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 21.921,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 3.072,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.102,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.102,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.861,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-120",
        "label": "Longevity Pay",
        "amountM": 5,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 2.5,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 3.693,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.64,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 4.103,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 5.162,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.308,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 1.076,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.154,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 1.765,
        "page": 31
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 5.455,
        "page": 31
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.054,
        "page": 31
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 21.986,
        "page": 31
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 0.044,
        "page": 31
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.045,
        "page": 31
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 236.148,
        "page": 32
      },
      {
        "group": "Operating",
        "accountCode": "5-02-06-020",
        "label": "Prizes",
        "amountM": 3.21,
        "page": 32
      },
      {
        "group": "Operating",
        "accountCode": "5-02-11-990",
        "label": "Other Professional Services",
        "amountM": 12.26,
        "page": 32
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 0.046,
        "page": 32
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-050",
        "label": "Rent Expenses",
        "amountM": 3.3,
        "page": 32
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-060",
        "label": "Membership Dues and Contributions to Organizations",
        "amountM": 0.05,
        "page": 32
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 0.05,
        "page": 32
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-030",
        "label": "Information and Communication Technology Equipment",
        "amountM": 2.75,
        "page": 32
      }
    ]
  },
  {
    "office": "Internal Audit Services",
    "pages": "33–34",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 21.893,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 3.29,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 1.14,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.114,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.114,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.336,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 0.1,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 2.026,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.24,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 2.062,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 2.828,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.116,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 0.581,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.058,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 1.034,
        "page": 33
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 2.768,
        "page": 33
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.05,
        "page": 33
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 0.93,
        "page": 33
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 0.015,
        "page": 33
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 0.1,
        "page": 33
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 0.055,
        "page": 34
      }
    ]
  },
  {
    "office": "Information and Community Relations Department",
    "pages": "35–36",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 16.424,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 8.084,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 1.272,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.216,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.216,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.371,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 0.5,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 1.935,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.265,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 1.973,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 2.702,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.128,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 0.555,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.064,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 0.674,
        "page": 35
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 2.332,
        "page": 35
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.025,
        "page": 35
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 0.619,
        "page": 35
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 0.006,
        "page": 35
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.092,
        "page": 35
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-220",
        "label": "Semi-Expendable Furniture, Fixtures and Books Expenses",
        "amountM": 0.415,
        "page": 35
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 1.622,
        "page": 36
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-030",
        "label": "Internet Subscription Expenses",
        "amountM": 0.1,
        "page": 36
      },
      {
        "group": "Operating",
        "accountCode": "5-02-11-990",
        "label": "Other Professional Services",
        "amountM": 0.65,
        "page": 36
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-010",
        "label": "Advertising Expenses",
        "amountM": 10,
        "page": 36
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 22.6,
        "page": 36
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-070",
        "label": "Subscription Expenses",
        "amountM": 0.7,
        "page": 36
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 0.73,
        "page": 36
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-020",
        "label": "Office Equipment",
        "amountM": 1.02,
        "page": 36
      },
      {
        "group": "Capital",
        "accountCode": "1-07-07-010",
        "label": "Furniture and Fixtures",
        "amountM": 0.3,
        "page": 36
      }
    ]
  },
{
    "office": "International Relations Department",
    "pages": "37–38",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 13.182,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 4.863,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 0.936,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.216,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.216,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.252,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 0.05,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 1.388,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.19,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 1.437,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 2.024,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.084,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 0.414,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.042,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 0.249,
        "page": 37
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 1.966,
        "page": 37
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.03,
        "page": 37
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-020",
        "label": "Traveling Expenses - Foreign",
        "amountM": 0.18,
        "page": 37
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 0.563,
        "page": 37
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.055,
        "page": 37
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 1.926,
        "page": 37
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-020",
        "label": "Telephone Expenses",
        "amountM": 0.03,
        "page": 37
      },
      {
        "group": "Operating",
        "accountCode": "5-02-11-990",
        "label": "Other Professional Services",
        "amountM": 10.7,
        "page": 38
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-060",
        "label": "Membership Dues and Contributions to Organizations",
        "amountM": 0.02,
        "page": 38
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 2.005,
        "page": 38
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-030",
        "label": "Information and Communication Technology Equipment",
        "amountM": 0.072,
        "page": 38
      }
    ]
  },
  {
    "office": "Law Department",
    "pages": "39–40",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 20.232,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 16.872,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 2.292,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.216,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.216,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 0.665,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-100",
        "label": "Honoraria",
        "amountM": 0.672,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 0.35,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 2.997,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 0.475,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 3.371,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 4.155,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.226,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 0.857,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.113,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 1.159,
        "page": 39
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 4.463,
        "page": 39
      },
      {
        "group": "Operating",
        "accountCode": "5-02-02-010",
        "label": "Training Expenses",
        "amountM": 2.423,
        "page": 39
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 0.008,
        "page": 39
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.021,
        "page": 40
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-010",
        "label": "Postage and Courier Services",
        "amountM": 0.02,
        "page": 40
      },
      {
        "group": "Operating",
        "accountCode": "5-02-11-990",
        "label": "Other Professional Services",
        "amountM": 43.647,
        "page": 40
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 0.15,
        "page": 40
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 21.19,
        "page": 40
      }
    ]
  },
  {
    "office": "Liga ng mga Barangay",
    "pages": "42",
    "lines": []
  },
  {
    "office": "Makati Action Center",
    "pages": "43–44",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 67.762,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 128.149,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 19.416,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 5.663,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 12,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 15.913,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 4.045,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 20.408,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 22.299,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 1.942,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 4.646,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.971,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 10.988,
        "page": 43
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 28.468,
        "page": 43
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.012,
        "page": 43
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-080",
        "label": "Medical, Dental and Laboratory Supplies Expenses",
        "amountM": 0.099,
        "page": 43
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-210",
        "label": "Semi-Expendable Machinery and Equipment Expenses",
        "amountM": 0.18,
        "page": 43
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 0.921,
        "page": 43
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-020",
        "label": "Telephone Expenses",
        "amountM": 0.05,
        "page": 44
      },
      {
        "group": "Operating",
        "accountCode": "5-02-13-050",
        "label": "Repairs and Maintenance - Machinery and Equipment",
        "amountM": 0.17,
        "page": 44
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-020",
        "label": "Printing and Publication Expenses",
        "amountM": 0.034,
        "page": 44
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 0.568,
        "page": 44
      },
      {
        "group": "Capital",
        "accountCode": "1-07-05-030",
        "label": "Information and Communication Technology Equipment",
        "amountM": 0.1,
        "page": 44
      }
    ]
  },
  {
    "office": "Makati Disaster Risk Reduction and Management Office",
    "pages": "45–46",
    "lines": [
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-010",
        "label": "Salaries and Wages - Regular",
        "amountM": 90.993,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-01-020",
        "label": "Salaries and Wages - Casual/Contractual",
        "amountM": 47.752,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-010",
        "label": "Personnel Economic Relief Allowance (PERA)",
        "amountM": 8.124,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-020",
        "label": "Representation Allowance (RA)",
        "amountM": 0.102,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-030",
        "label": "Transportation Allowance (TA)",
        "amountM": 0.102,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-040",
        "label": "Clothing/Uniform Allowance",
        "amountM": 2.268,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-130",
        "label": "Overtime and Night Pay",
        "amountM": 5,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-140",
        "label": "Year End Bonus",
        "amountM": 10.719,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-150",
        "label": "Cash Gift",
        "amountM": 1.765,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-02-990",
        "label": "Other Bonuses and Allowances",
        "amountM": 11.046,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-010",
        "label": "Retirement and Life Insurance Contributions",
        "amountM": 14.622,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-020",
        "label": "Pag-IBIG Contributions",
        "amountM": 0.782,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-030",
        "label": "PhilHealth Contributions",
        "amountM": 3.016,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-03-040",
        "label": "Employees Compensation Insurance Premiums",
        "amountM": 0.391,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-030",
        "label": "Terminal Leave Benefits",
        "amountM": 3.699,
        "page": 45
      },
      {
        "group": "Personal Services",
        "accountCode": "5-01-04-990",
        "label": "Other Personnel Benefits",
        "amountM": 14.25,
        "page": 45
      },
      {
        "group": "Operating",
        "accountCode": "5-02-01-010",
        "label": "Traveling Expenses - Local",
        "amountM": 0.01,
        "page": 45
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-010",
        "label": "Office Supplies Expenses",
        "amountM": 0.049,
        "page": 45
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-220",
        "label": "Semi-Expendable Furniture, Fixtures and Books Expenses",
        "amountM": 0.33,
        "page": 45
      },
      {
        "group": "Operating",
        "accountCode": "5-02-03-990",
        "label": "Other Supplies and Materials Expenses",
        "amountM": 0.495,
        "page": 45
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-020",
        "label": "Telephone Expenses",
        "amountM": 0.005,
        "page": 45
      },
      {
        "group": "Operating",
        "accountCode": "5-02-05-030",
        "label": "Internet Subscription Expenses",
        "amountM": 0.65,
        "page": 46
      },
      {
        "group": "Operating",
        "accountCode": "5-02-12-990",
        "label": "Other General Services",
        "amountM": 0.005,
        "page": 46
      },
      {
        "group": "Operating",
        "accountCode": "5-02-99-990",
        "label": "Other Maintenance and Operating Expenses",
        "amountM": 3.689,
        "page": 46
      },
      {
        "group": "Special Purpose",
        "accountCode": "—",
        "label": "30% Quick Response Fund (QRF)",
        "amountM": 300,
        "page": 46
      },
      {
        "group": "Special Purpose",
        "accountCode": "—",
        "label": "70% Disaster Preparedness & Mitigation Fund",
        "amountM": 700,
        "page": 46
      }
    ]
  },
  ...officeBudgetDetails2026Remaining
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
