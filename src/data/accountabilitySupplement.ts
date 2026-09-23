import type { AccountabilityEntry } from './civicTypes';

export const procurementQ22025Source =
  'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q2%20Bids.pdf';
export const procurementQ32024Source =
  'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q3%20Bid%20Results%20FDP.pdf';

const reviewed = '23 September 2026';

interface ProcurementSeed {
  id: string;
  title: string;
  period: string;
  referenceNo: string;
  approvedBudgetM: number;
  awardedAmountM: number;
  supplier: string;
  bidDate: string;
  sourceUrl: string;
  sourceLabel: string;
  location?: string;
  publicEvidence?: {
    label: string;
    url: string;
    publisher: string;
    date: string;
    detail: string;
  };
}

const procurementSeeds: ProcurementSeed[] = [
  {
    id: '2025-q2-bs25-03-oe07',
    title: 'Desktop/laptop computers and printers for various city offices',
    period: '2025 Q2',
    referenceNo: 'BS25-03-OE07',
    approvedBudgetM: 3.96998,
    awardedAmountM: 3.969845,
    supplier: 'Amellar Solutions',
    bidDate: '2025-04-02',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
  },
  {
    id: '2025-q2-bs25-03-os04a',
    title: 'Office supplies for activities/programs of various city offices — Lot 1',
    period: '2025 Q2',
    referenceNo: 'BS25-03-OS04A',
    approvedBudgetM: 1.562002,
    awardedAmountM: 1.554866,
    supplier: 'Wadsworth Commercial Corp.',
    bidDate: '2025-04-02',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
  },
  {
    id: '2025-q2-bs25-03-uniform4',
    title: 'Uniforms for NAASCU / UCPL games and other city programs',
    period: '2025 Q2',
    referenceNo: 'BS25-03-UNIFORM4',
    approvedBudgetM: 2.13075,
    awardedAmountM: 2.122375,
    supplier: 'RUNR Enterprise and Services Company',
    bidDate: '2025-04-02',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
  },
  {
    id: '2025-q2-bs25-04-aut01a',
    title: 'Fuel elements for heavy-equipment repair and maintenance — Lot 1',
    period: '2025 Q2',
    referenceNo: 'BS25-04-AUT01A',
    approvedBudgetM: 0.580892,
    awardedAmountM: 0.5762,
    supplier: 'Wadsworth Commercial Corp.',
    bidDate: '2025-05-07',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
  },
  {
    id: '2025-q2-bs25-04-0462',
    title: 'Athletic uniforms for invitational sporting events',
    period: '2025 Q2',
    referenceNo: 'BS25-04-0462',
    approvedBudgetM: 0.184,
    awardedAmountM: 0.18348,
    supplier: 'Malgonz Enterprise',
    bidDate: '2025-05-07',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
  },
  {
    id: '2025-q2-bs25-04-0439',
    title: 'Event management services for Rosas ng Sampiro Festival 2025',
    period: '2025 Q2',
    referenceNo: 'BS25-04-0439',
    approvedBudgetM: 10.86949,
    awardedAmountM: 10.86685,
    supplier: 'PLA Events Planner Inc.',
    bidDate: '2025-05-14',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
    publicEvidence: {
      label: 'Rosas ng Sampiro Festival 2025 occurrence',
      url: 'https://www.veritasph.net/tularan-ang-mahal-na-birheng-maria-paanyaya-ni-cardinal-advincula-sa-mananampalataya/',
      publisher: 'VeritasPH',
      date: '2025-06-08',
      detail:
        'Independent reporting documents the Rosas ng Sampiro Festival taking place at the Makati Coliseum. This supports event occurrence, but does not by itself prove supplier acceptance, final payment or contract close-out.',
    },
  },
  {
    id: '2025-q2-bs25-04-0438',
    title: 'Supply, delivery and installation of 1TB solid-state drives',
    period: '2025 Q2',
    referenceNo: 'BS25-04-0438',
    approvedBudgetM: 2.2,
    awardedAmountM: 2.18972,
    supplier: 'DJT Group Corp.',
    bidDate: '2025-05-14',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
  },
  {
    id: '2025-q2-bs25-04-0417',
    title: 'Workbooks on the MATATAG Curriculum for Makati public schools',
    period: '2025 Q2',
    referenceNo: 'BS25-04-0417',
    approvedBudgetM: 18.68960483,
    awardedAmountM: 18.606479,
    supplier: 'Transprint Corporation',
    bidDate: '2025-05-14',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
    location: 'Public elementary and secondary schools in Makati City',
  },
  {
    id: '2025-q2-bs25-04-0419',
    title: 'Instructional materials for Makati public elementary and secondary schools',
    period: '2025 Q2',
    referenceNo: 'BS25-04-0419',
    approvedBudgetM: 48.765199,
    awardedAmountM: 48.76272,
    supplier: 'Epigraphy Inc.',
    bidDate: '2025-05-14',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
    location: 'Public elementary and secondary schools in Makati City',
  },
  {
    id: '2025-q2-bs25-04-0420',
    title: 'English reading kits for Makati public elementary schools',
    period: '2025 Q2',
    referenceNo: 'BS25-04-0420',
    approvedBudgetM: 21.7811,
    awardedAmountM: 21.736484,
    supplier: 'Kristin Educational Exponents Publications, Inc.',
    bidDate: '2025-05-14',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
    location: 'Public elementary schools in Makati City',
  },
  {
    id: '2025-q2-bs25-04-0422',
    title: 'Rental of storage area with warehouse management services',
    period: '2025 Q2',
    referenceNo: 'BS25-04-0422',
    approvedBudgetM: 7.5565,
    awardedAmountM: 7.259,
    supplier: 'Non-Pareil International Freight and Cargo Service Inc.',
    bidDate: '2025-05-14',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
  },
  {
    id: '2025-q2-bs25-05-mme08c',
    title: 'Preventive maintenance of Ospital ng Makati medical equipment — Lot 3',
    period: '2025 Q2',
    referenceNo: 'BS25-05-MME08C',
    approvedBudgetM: 0.206,
    awardedAmountM: 0.202,
    supplier: 'Maxipharm Co., Ltd.',
    bidDate: '2025-06-16',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
    location: 'Ospital ng Makati',
  },
  {
    id: '2025-q2-bs25-05-mme08d',
    title: 'Preventive maintenance of Ospital ng Makati medical equipment — Lot 4',
    period: '2025 Q2',
    referenceNo: 'BS25-05-MME08D',
    approvedBudgetM: 0.946,
    awardedAmountM: 0.939,
    supplier: 'Maxipharm Co., Ltd.',
    bidDate: '2025-06-16',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
    location: 'Ospital ng Makati',
  },
  {
    id: '2025-q2-bs25-05-0571',
    title: 'Library of the 21st Century books and multimedia resources',
    period: '2025 Q2',
    referenceNo: 'BS25-05-0571',
    approvedBudgetM: 5.16477696,
    awardedAmountM: 5.13895307,
    supplier: 'Asia Prime Commodities Corp.',
    bidDate: '2025-06-16',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
  },
  {
    id: '2025-q2-bs25-05-oe13',
    title: 'Desktop/laptop computers and printer accessory for various city offices',
    period: '2025 Q2',
    referenceNo: 'BS25-05-OE13',
    approvedBudgetM: 3.004986,
    awardedAmountM: 3.000947,
    supplier: 'DJT Group Corp.',
    bidDate: '2025-06-16',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
  },
  {
    id: '2025-q2-bs25-05-0573',
    title: 'One-year Turnitin subscription',
    period: '2025 Q2',
    referenceNo: 'BS25-05-0573',
    approvedBudgetM: 0.992585,
    awardedAmountM: 0.992,
    supplier: 'Libtech Source Philippines, Inc.',
    bidDate: '2025-06-16',
    sourceUrl: procurementQ22025Source,
    sourceLabel: '2025 Q2 Bid Results — Goods and Services',
  },
  {
    id: '2024-q3-bs24-05-0533',
    title: 'Internet connectivity and network rehabilitation for various Makati schools',
    period: '2024 Q3',
    referenceNo: 'BS24-05-0533',
    approvedBudgetM: 291.17681562,
    awardedAmountM: 290.25014595,
    supplier: 'Beesee Global Technologies Inc. / Pinnacle Technologies Inc. (JV)',
    bidDate: '2024-07-08',
    sourceUrl: procurementQ32024Source,
    sourceLabel: '2024 Q3 Bid Results',
    location: 'Various schools in Makati City',
  },
  {
    id: '2024-q3-bs24-06-0651',
    title: 'Events management services for Pride March 2024',
    period: '2024 Q3',
    referenceNo: 'BS24-06-0651',
    approvedBudgetM: 5,
    awardedAmountM: 4.99945,
    supplier: 'PLA Events Planner Inc.',
    bidDate: '2024-07-08',
    sourceUrl: procurementQ32024Source,
    sourceLabel: '2024 Q3 Bid Results',
    publicEvidence: {
      label: 'Makati first Pride event documented',
      url: 'https://tribune.net.ph/2025/02/23/a-year-of-philippine-lgbtiq-milestones',
      publisher: 'Daily Tribune',
      date: '2024-07-27',
      detail:
        'A later report documents a city-government-led Makati Pride event, “Spread the Love, Makati!”, held in Poblacion on 27 July 2024. It is relevant execution evidence for the city Pride activity, but does not independently establish that this specific procurement contract was fully performed or accepted.',
    },
  },
  {
    id: '2024-q3-bs24-06-m18',
    title: 'Food/meals for activities and programs of various city offices',
    period: '2024 Q3',
    referenceNo: 'BS24-06-M18',
    approvedBudgetM: 1.46086,
    awardedAmountM: 1.458924,
    supplier: 'Shabat Corporation',
    bidDate: '2024-07-08',
    sourceUrl: procurementQ32024Source,
    sourceLabel: '2024 Q3 Bid Results',
  },
  {
    id: '2024-q3-bs23-11-1356n-1',
    title: 'Food/meals for Makati Family Day 2024',
    period: '2024 Q3',
    referenceNo: 'BS23-11-1356N-1',
    approvedBudgetM: 2.67225,
    awardedAmountM: 2.67225,
    supplier: 'TJ Grill Corp.',
    bidDate: '2024-07-12',
    sourceUrl: procurementQ32024Source,
    sourceLabel: '2024 Q3 Bid Results',
  },
  {
    id: '2024-q3-bs24-06-cons06',
    title: 'Materials for asphalting and emergency road repairs in Districts I and II',
    period: '2024 Q3',
    referenceNo: 'BS24-06-CONS06',
    approvedBudgetM: 18.134382,
    awardedAmountM: 18.10655,
    supplier: 'JPPM Construction and Supply',
    bidDate: '2024-07-17',
    sourceUrl: procurementQ32024Source,
    sourceLabel: '2024 Q3 Bid Results',
    location: 'Districts I and II, Makati City',
  },
];

export const procurementProjectEntries: AccountabilityEntry[] =
  procurementSeeds.map(seed => ({
    id: `procurement-${seed.id}`,
    title: seed.title,
    type: 'project',
    status: 'reported',
    summary:
      'The city bid-results disclosure identifies the approved budget, winning bidder and winning bid. Later contract, notice-to-proceed, implementation and completion records are not yet linked unless separately shown.',
    responsibleBodies: ['City Government of Makati'],
    period: seed.period,
    location: seed.location,
    plannedAmountM: seed.approvedBudgetM,
    reportedAmountM: seed.awardedAmountM,
    relatedHref: '/projects-budget#procurement',
    lastVerified: reviewed,
    sources: [
      {
        label: seed.sourceLabel,
        url: seed.sourceUrl,
        publisher: 'City Government of Makati',
        publishedOrPeriod: seed.period,
      },
      ...(seed.publicEvidence
        ? [
            {
              label: seed.publicEvidence.label,
              url: seed.publicEvidence.url,
              publisher: seed.publicEvidence.publisher,
              publishedOrPeriod: seed.publicEvidence.date,
            },
          ]
        : []),
    ],
    procurement: {
      referenceNo: seed.referenceNo,
      approvedBudgetM: seed.approvedBudgetM,
      awardedAmountM: seed.awardedAmountM,
      supplier: seed.supplier,
      bidDate: seed.bidDate,
      stages: [
        {
          label: 'Bid result',
          status: 'documented',
          date: seed.bidDate,
          detail: `Winning bid reported at ₱${(seed.awardedAmountM * 1_000_000).toLocaleString('en-PH', { maximumFractionDigits: 2 })}.`,
        },
        {
          label: 'Contract / notice of award',
          status: 'source-gap',
          detail:
            'Exact-reference public search through 23 September 2026 did not surface a separately indexed contract or notice-of-award document.',
        },
        {
          label: 'Notice to proceed',
          status: 'source-gap',
          detail:
            'Exact-reference public search through 23 September 2026 did not surface a separately indexed notice-to-proceed document.',
        },
        ...(seed.publicEvidence
          ? [
              {
                label: 'Public occurrence / implementation evidence',
                status: 'documented' as const,
                date: seed.publicEvidence.date,
                detail: seed.publicEvidence.detail,
              },
            ]
          : [
              {
                label: 'Implementation / completion',
                status: 'source-gap' as const,
                detail:
                  'Targeted public search through 23 September 2026 did not surface a project-specific implementation, acceptance or completion record.',
              },
            ]),
      ],
    },
  }));


export const publicCommitmentEntries: AccountabilityEntry[] = [
  {
    id: 'commitment-makati-life-full-operations',
    title: 'Bring Makati Life Medical Center into full operation',
    type: 'commitment',
    status: 'completed',
    summary:
      'Public reporting in 2022 said completion and full operations were targeted for the first quarter of 2024. Makati Life became fully operational on 24 April 2025.',
    responsibleBodies: ['City Government of Makati', 'Makati Life Medical Center'],
    period: '2022–2025',
    targetDate: 'Q1 2024',
    location: 'Barangay Bel-Air, Makati City',
    relatedHref: '/accountability?type=commitment',
    lastVerified: reviewed,
    sources: [
      {
        label: 'PNA report on Makati Life target for full operations',
        url: 'https://www.pna.gov.ph/articles/1173348',
        publisher: 'Philippine News Agency',
        publishedOrPeriod: '22 April 2022',
      },
      {
        label: 'PIA report confirming full operations',
        url: 'https://pia.gov.ph/news/first-for-ph-lgus-makati-launches-integrated-digital-healthcare-system/',
        publisher: 'Philippine Information Agency',
        publishedOrPeriod: '20 June 2025',
      },
    ],
    commitment: {
      commitmentText:
        'Complete Makati Life Medical Center and bring it into full operation by the first quarter of 2024.',
      announcedDate: '2022-04-22',
      target: 'Q1 2024',
      outcomeStatus: 'delivered-late',
      evidenceDate: '2025-04-24',
      outcome:
        'Later public reporting confirms the hospital became fully operational on 24 April 2025, after the originally reported Q1 2024 target.',
    },
  },
  {
    id: 'commitment-free-pet-ct-yellow-card',
    title: 'Provide free digital PET/CT scans to Yellow Card holders',
    type: 'commitment',
    status: 'reported',
    summary:
      'The city announced in May 2024 that Yellow Card holders and eligible dependents would gain free digital PET/CT access by Q3 2024. Later reporting confirms the scanner was in Makati Life and that Yellow Card holders receive Makati Life services free, but the exact start date of the PET/CT benefit remains unverified.',
    responsibleBodies: ['City Government of Makati', 'Makati Life Medical Center'],
    period: '2024–2025',
    targetDate: 'Q3 2024',
    location: 'Makati Life Medical Center',
    relatedHref: '/accountability?type=commitment',
    lastVerified: reviewed,
    sources: [
      {
        label: 'GMA report on free PET/CT commitment',
        url: 'https://www.gmanetwork.com/news/topstories/metro/905473/makati-digital-pet-ct-scan-access/story/',
        publisher: 'GMA Integrated News',
        publishedOrPeriod: '2 May 2024',
      },
      {
        label: 'Makati Life full-opening report',
        url: 'https://mb.com.ph/25/4/2025/makati-lgu-opens-life-medical-center',
        publisher: 'Manila Bulletin',
        publishedOrPeriod: '25 April 2025',
      },
    ],
    commitment: {
      commitmentText:
        'Make digital PET/CT scan services free for Yellow Card holders and eligible dependents by the third quarter of 2024.',
      announcedDate: '2024-05-02',
      target: 'Q3 2024',
      outcomeStatus: 'delivered',
      evidenceDate: '2025-04-24',
      outcome:
        'By the hospital’s full opening, public reporting said Yellow Card holders received Makati Life services and medicines free and confirmed the hospital had acquired the AI-powered PET/CT scanner. The cited later source does not establish the exact date the free PET/CT benefit first became available.',
    },
  },
  {
    id: 'commitment-renewable-energy-government-buildings',
    title: 'Transition Makati government buildings to renewable energy',
    type: 'commitment',
    status: 'in-progress',
    summary:
      'The city says its goal is to power all government buildings with renewable energy. By July 2026, 11 major facilities had switched to 100% renewable power and the city reported reaching 60.92% of its 2026 clean-energy target.',
    responsibleBodies: ['City Government of Makati'],
    period: '2026',
    relatedHref: '/accountability?type=commitment',
    lastVerified: reviewed,
    sources: [
      {
        label: 'Makati renewable-energy transition update',
        url: 'https://mb.com.ph/2026/07/02/11-makati-cityowned-facilities-switch-to-100-renewable-energy',
        publisher: 'Manila Bulletin',
        publishedOrPeriod: '2 July 2026',
      },
      {
        label: 'Renewable-energy progress report',
        url: 'https://businessmirror.com.ph/2026/07/02/makati-leads-phl-in-green-transition-11-major-facilities-now-fully-powered-by-re/',
        publisher: 'BusinessMirror',
        publishedOrPeriod: '2 July 2026',
      },
    ],
    commitment: {
      commitmentText:
        'Transition city government buildings to renewable energy.',
      announcedDate: '2026-07-02',
      outcomeStatus: 'in-progress',
      evidenceDate: '2026-07-02',
      outcome:
        'Eleven major government facilities were reported as fully powered by renewable energy, representing 60.92% of the city’s clean-energy target for 2026. The cited sources do not state a final deadline for converting every government building.',
    },
  },
];

const sef2024Url =
  'https://www.depedncr.com.ph/wp-content/uploads/2025/05/SEF-MAKATI-CITY-4th-Quarter-2024.pdf';

export const specialEducationFundEntries: AccountabilityEntry[] = [
  {
    id: '2024-special-education-fund-utilization',
    title: '2024 Special Education Fund utilization',
    type: 'fiscal',
    status: 'reported',
    summary:
      'The year-end SEF utilization report records ₱4.118B in total receipts, ₱2.872B in total disbursements and a ₱1.245B year-end balance.',
    responsibleBodies: [
      'City Government of Makati',
      'DepEd Schools Division Office of Makati City',
    ],
    period: '2024',
    reportedAmountM: 4117.55428339,
    actualAmountM: 2872.11599645,
    relatedHref: '/projects-budget#budget',
    lastVerified: reviewed,
    sources: [
      {
        label: 'Makati Special Education Fund Utilization — Q4 2024',
        url: sef2024Url,
        publisher: 'City Government of Makati / DepEd NCR',
        publishedOrPeriod: 'Year ended 31 December 2024',
      },
    ],
    notes: [
      'The report shows a year-end balance of ₱1,245.438M.',
      'Major disbursement categories include supplies and materials (₱1,377.954M), general services (₱523.617M), professional services (₱410.505M) and ICT equipment (₱311.749M).',
    ],
  },
];

const coaArchive2018 =
  'https://www.coa.gov.ph/reports/annual-audit-reports/aar-local-government-units/#167-671-cities-1613444677';
const coaAnnualReports =
  'https://www.coa.gov.ph/reports/annual-audit-reports/';
const coaCompliance2024 =
  'https://www.coa.gov.ph/wpfd_file/makati-city-compliance-audit-report-2024/';

export const auditFindingEntries: AccountabilityEntry[] = [
  {
    id: 'audit-2017-development-fund-loan-payments',
    title: 'COA observation on development-fund use for loan and interest payments',
    type: 'audit',
    status: 'reported',
    summary:
      'A 2018 report on the COA annual audit said ₱391.491M of development-fund resources had been used for interest expense and loan payments connected with infrastructure projects, which COA questioned under the applicable development-fund rules.',
    responsibleBodies: ['Commission on Audit', 'City Government of Makati'],
    period: '2017 audit / reported 2018',
    reportedAmountM: 391.491,
    relatedHref: '/integrity',
    lastVerified: reviewed,
    sources: [
      {
        label: 'COA annual audit reports',
        url: coaAnnualReports,
        publisher: 'Commission on Audit',
      },
      {
        label: 'GMA News report quoting the COA finding and city response',
        url: 'https://www.gmanetwork.com/news/topstories/metro/665703/coa-questions-why-makati-city-used-dev-t-funds-to-repay-loans/story/',
        publisher: 'GMA News',
        publishedOrPeriod: '31 August 2018',
      },
    ],
    audit: {
      finding:
        'COA questioned the use of ₱391.491M from the development fund for interest expense and loan payments tied to projects that it said were not covered by the governing DILG/DBM rules.',
      recommendation:
        'COA recommended that management ensure the 20% Development Fund is used for its intended purposes.',
      managementResponse:
        'The city said the projects were classified as development projects and stated that it would prepare a supplemental budget to return the development-fund amounts used for loan payments.',
      followUpStatus:
        'Later resolution of this specific recommendation has not yet been linked in BetterMakati.',
    },
  },
  {
    id: 'audit-2018-deped-cash-advances',
    title: '2018 COA observation on DepEd-Makati cash advances',
    type: 'audit',
    status: 'reported',
    summary:
      'The 2018 Makati audit executive summary reported ₱4.9M in cash advances granted to a DepEd-Makati official for special-purpose/time-bound activities and cited non-compliance with COA cash-advance rules.',
    responsibleBodies: [
      'Commission on Audit',
      'City Government of Makati',
      'DepEd Makati',
    ],
    period: '2018',
    reportedAmountM: 4.9,
    relatedHref: '/integrity',
    lastVerified: reviewed,
    sources: [
      {
        label: 'COA 2018 local-government annual audit archive — Makati City',
        url: coaArchive2018,
        publisher: 'Commission on Audit',
        publishedOrPeriod: '2018',
      },
    ],
    audit: {
      finding:
        'The audit executive summary reported that ₱4.9M in cash advances had been granted to a DepEd-Makati official for special-purpose/time-bound activities contrary to the cited COA cash-advance rules.',
      recommendation:
        'COA recommended discontinuing the practice and limiting such advances to designated Special Disbursing Officers in accordance with COA Circular No. 97-002.',
      followUpStatus:
        'A later implementation-status record for this specific recommendation has not yet been linked.',
    },
  },
  {
    id: 'audit-2018-sef-eligibility',
    title: '2018 COA observation on Special Education Fund expenditures',
    type: 'audit',
    status: 'reported',
    summary:
      'The 2018 Makati audit executive summary reported ₱30.793M of Local School Board expenditures charged to the Special Education Fund that were not among the uses explicitly authorized by the cited laws and joint circular.',
    responsibleBodies: [
      'Commission on Audit',
      'City Government of Makati',
      'Local School Board',
    ],
    period: '2018',
    reportedAmountM: 30.793,
    relatedHref: '/integrity',
    lastVerified: reviewed,
    sources: [
      {
        label: 'COA 2018 local-government annual audit archive — Makati City',
        url: coaArchive2018,
        publisher: 'Commission on Audit',
        publishedOrPeriod: '2018',
      },
    ],
    audit: {
      finding:
        'COA reported ₱30.793M in Local School Board expenditures charged against the SEF that were not among the uses explicitly authorized under Section 272 of the Local Government Code and the cited DepEd-DBM-DILG joint circular.',
      recommendation:
        'COA recommended that management require the Local School Board to re-evaluate the budget against the authorized uses of the SEF.',
      followUpStatus:
        'A later implementation-status record for this specific recommendation has not yet been linked.',
    },
  },
  {
    id: 'audit-2024-sef-compliance-report',
    title: '2024 compliance audit on Makati Special Education Fund',
    type: 'audit',
    status: 'reported',
    summary:
      'COA published a management letter on its compliance audit of monitoring, transparency and accountability in Makati’s allocation and utilization of the Special Education Fund for calendar year 2024.',
    responsibleBodies: ['Commission on Audit', 'City Government of Makati'],
    period: '2024',
    relatedHref: '/integrity',
    lastVerified: reviewed,
    sources: [
      {
        label: 'Makati City Compliance Audit Report 2024',
        url: coaCompliance2024,
        publisher: 'Commission on Audit',
        publishedOrPeriod: '2024 audit; published 2025',
      },
    ],
    notes: [
      'The official COA landing page confirms the 2024 SEF compliance-management letter. Targeted public search on 23 September 2026 did not expose the report text or a directly retrievable PDF in the searchable index, so BetterMakati does not paraphrase observation-level findings that it cannot verify from the report itself.',
    ],
  },
];
