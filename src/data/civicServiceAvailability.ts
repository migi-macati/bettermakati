export interface TemporaryServiceSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  barangaySlugs: string[];
  barangayLabel: string;
  venue: string;
}

export const districtOnePublicAssistanceProgram = {
  serviceId: 'district-1-public-assistance-desk',
  title: 'District 1 Public Assistance Desk',
  agency: 'Office of the Representative, Makati 1st District',
  description:
    'Temporary neighborhood public-assistance desks receiving and referring medical, hospital-bill, burial, college-level educational and Guarantee Letter requests to the agencies concerned.',
  category: 'Social services',
  level: 'National' as const,
  type: 'Assistance' as const,
  scheduleWindow: {
    start: '2026-09-28',
    end: '2026-10-09',
  },
  operatingHours: '8:00 AM–3:00 PM',
  operatingNote: 'Except Saturdays, Sundays and holidays',
  source: {
    id: 'district-1-public-assistance-facebook-2026-09',
    label: 'District One Public Assistance Desk schedule, September 28–October 9, 2026',
    url: 'https://www.facebook.com/share/p/19qKvhrw9E/',
    publisher: 'Congresswoman Monique Lagdameo',
    kind: 'first-party' as const,
    checkedOn: '2026-09-29',
  },
  assistanceCategories: [
    'Medical assistance — medicines, laboratories and mobility aid',
    'Hospital bill — unpaid bills',
    'Burial assistance',
    'Educational assistance — college level only',
    'Guarantee Letter (GL) referrals',
  ],
  guaranteeLetterFacilities: [
    'Philippine General Hospital',
    'Philippine Children’s Medical Center',
    'Philippine Heart Center',
    'National Kidney & Transplant Institute',
    'Philippine Orthopedic Center',
    'Lung Center of the Philippines',
    'East Avenue Medical Center',
    'Jose Reyes Medical Center',
    'National Center for Mental Health',
    'National Children’s Hospital',
    'Quirino Memorial Medical Center',
  ],
  districtOfficeNote: {
    barangaySlugs: ['valenzuela', 'olympia'],
    text:
      'The post says residents of Barangays Valenzuela and Olympia may submit their documents every Wednesday at the District Office at 9221 Pateros St., Barangay Valenzuela, Makati City.',
    address: '9221 Pateros St., Barangay Valenzuela, Makati City',
  },
  sessions: [
    {
      id: '2026-09-28-tejeros',
      date: '2026-09-28',
      startTime: '08:00',
      endTime: '15:00',
      barangaySlugs: ['tejeros'],
      barangayLabel: 'Tejeros',
      venue: '4174 Ponte St.',
    },
    {
      id: '2026-09-29-san-isidro',
      date: '2026-09-29',
      startTime: '08:00',
      endTime: '15:00',
      barangaySlugs: ['san-isidro'],
      barangayLabel: 'San Isidro',
      venue: '1645 Dian St.',
    },
    {
      id: '2026-09-30-poblacion',
      date: '2026-09-30',
      startTime: '08:00',
      endTime: '15:00',
      barangaySlugs: ['poblacion'],
      barangayLabel: 'Poblacion',
      venue: 'Sto. Niño Chapel (in front of Saint Chapel)',
    },
    {
      id: '2026-10-01-palanan',
      date: '2026-10-01',
      startTime: '08:00',
      endTime: '15:00',
      barangaySlugs: ['palanan'],
      barangayLabel: 'Palanan',
      venue: '4965 Enrique St.',
    },
    {
      id: '2026-10-02-la-paz',
      date: '2026-10-02',
      startTime: '08:00',
      endTime: '15:00',
      barangaySlugs: ['la-paz'],
      barangayLabel: 'La Paz',
      venue: '1562 Archimedes St. cor. Flordeliz St.',
    },
    {
      id: '2026-10-05-pio-del-pilar',
      date: '2026-10-05',
      startTime: '08:00',
      endTime: '15:00',
      barangaySlugs: ['pio-del-pilar'],
      barangayLabel: 'Pio del Pilar',
      venue: '6659 Taylo St.',
    },
    {
      id: '2026-10-06-carmona-kasilawan',
      date: '2026-10-06',
      startTime: '08:00',
      endTime: '15:00',
      barangaySlugs: ['carmona', 'kasilawan'],
      barangayLabel: 'Carmona & Kasilawan',
      venue: '1212 C. Francisco St.',
    },
    {
      id: '2026-10-07-santa-cruz',
      date: '2026-10-07',
      startTime: '08:00',
      endTime: '15:00',
      barangaySlugs: ['santa-cruz'],
      barangayLabel: 'Santa Cruz',
      venue: '3156 Visita St.',
    },
    {
      id: '2026-10-08-bangkal',
      date: '2026-10-08',
      startTime: '08:00',
      endTime: '15:00',
      barangaySlugs: ['bangkal'],
      barangayLabel: 'Bangkal',
      venue: '3919-A Gen. Macabulos St.',
    },
    {
      id: '2026-10-09-singkamas',
      date: '2026-10-09',
      startTime: '08:00',
      endTime: '15:00',
      barangaySlugs: ['singkamas'],
      barangayLabel: 'Singkamas',
      venue: 'Singkamas Chapel',
    },
  ] satisfies TemporaryServiceSession[],
} as const;

export const districtOnePublicAssistanceServiceHref =
  '/services/guide/' + districtOnePublicAssistanceProgram.serviceId;
