export type CityMonitorType =
  | 'council-session'
  | 'legislation'
  | 'executive-speech'
  | 'procurement'
  | 'project'
  | 'publication'
  | 'consultation'
  | 'official-notice';

export type CityMonitorStatus =
  | 'scheduled'
  | 'in-progress'
  | 'published'
  | 'approved'
  | 'signed'
  | 'awarded'
  | 'completed'
  | 'archived';

export interface CityMonitorSource {
  id: string;
  label: string;
  stream: CityMonitorType | 'multi';
  url: string;
  publisher: string;
  cadence: 'daily' | 'weekly' | 'event-driven';
  monitoringNote: string;
}

export interface CityMonitorRecord {
  id: string;
  type: CityMonitorType;
  title: string;
  summary: string;
  date: string;
  status: CityMonitorStatus;
  sourceLabel: string;
  sourceUrl: string;
  sourcePublisher: string;
  historical?: boolean;
  stage?: string;
  referenceNo?: string;
  amount?: number;
  people?: string[];
  relatedHref?: string;
  summaryBullets?: string[];
  documents?: Array<{
    label: string;
    url: string;
    kind: 'agenda' | 'minutes' | 'video' | 'official-text' | 'measure' | 'procurement' | 'publication' | 'other';
  }>;
  measures?: Array<{
    reference: string;
    title?: string;
    action?: string;
    url?: string;
  }>;
  transcript?: {
    kind: 'official' | 'bettermakati-automated' | 'bettermakati-reviewed';
    status: 'available' | 'planned';
    note: string;
    url?: string;
  };
  commitments?: Array<{
    text: string;
    target?: string;
    sourceNote?: string;
  }>;
}

export const cityMonitorReviewed = '19 September 2026';

export const cityMonitorSources: CityMonitorSource[] = [
  {
    id: 'makati-legislation',
    label: 'Makati resolutions & ordinances',
    stream: 'legislation',
    url: 'https://www.makati.gov.ph/content/resolutions-and-ordinances/author',
    publisher: 'City Government of Makati',
    cadence: 'daily',
    monitoringNote:
      'Watch for new or changed legislative records. BetterMakati should not infer a legislative stage that the source does not establish.',
  },
  {
    id: 'makati-mayor-speeches',
    label: 'Mayor’s Corner — Speeches',
    stream: 'executive-speech',
    url: 'https://www.makati.gov.ph/content/mayors-corner/speeches/803',
    publisher: 'City Government of Makati',
    cadence: 'daily',
    monitoringNote:
      'Watch for newly published speeches or official text. BetterMakati transcripts must be labeled separately from official transcripts.',
  },
  {
    id: 'mymakati-broadcasts',
    label: 'MyMakati official social broadcasts',
    stream: 'council-session',
    url: 'https://www.facebook.com/mymakativerified',
    publisher: 'City Government of Makati',
    cadence: 'event-driven',
    monitoringNote:
      'Historical city records identify MyMakati as a council-session streaming channel. Social-platform access can be inconsistent, so session claims still require a current official post or recording.',
  },
  {
    id: 'makati-events',
    label: 'Makati Events',
    stream: 'multi',
    url: 'https://www.makati.gov.ph/content/events',
    publisher: 'City Government of Makati',
    cadence: 'daily',
    monitoringNote:
      'Use for official event discovery, including possible hearings, public activities and announced government events.',
  },
  {
    id: 'makati-news',
    label: 'Makati News',
    stream: 'official-notice',
    url: 'https://www.makati.gov.ph/content/news',
    publisher: 'City Government of Makati',
    cadence: 'daily',
    monitoringNote:
      'Official announcements remain distinct from independent media coverage in Makati in the News.',
  },
  {
    id: 'makati-full-disclosure',
    label: 'Makati full-disclosure and procurement records',
    stream: 'procurement',
    url: 'https://www.makati.gov.ph/',
    publisher: 'City Government of Makati',
    cadence: 'daily',
    monitoringNote:
      'Use city disclosure records together with PhilGEPS for bid results, procurement documents and project-linked evidence.',
  },
  {
    id: 'philgeps',
    label: 'PhilGEPS',
    stream: 'procurement',
    url: 'https://notices.philgeps.gov.ph/',
    publisher: 'Philippine Government Electronic Procurement System',
    cadence: 'daily',
    monitoringNote:
      'Primary national procurement portal. Specific Makati notices should be linked to the corresponding City Monitor procurement record.',
  },
  {
    id: 'makati-publications',
    label: 'Makati official publications',
    stream: 'publication',
    url: 'https://www.makati.gov.ph/',
    publisher: 'City Government of Makati',
    cadence: 'weekly',
    monitoringNote:
      'Monitor the city portal for annual reports, plans, newsletters, Ulat sa Bayan and other official publications.',
  },
];

export const cityMonitorRecords: CityMonitorRecord[] = [
  {
    id: '2020-council-legislative-activity',
    type: 'council-session',
    title: '2020 City Council legislative activity',
    summary:
      'The City Government’s 2020 Annual Report records 56 regular sessions and 56 committee hearings, with 287 ordinances and 50 resolutions enacted during the year. Sessions were held by videoconference under pandemic protocols and streamed through MyMakati Facebook.',
    date: '2020-12-31',
    status: 'archived',
    historical: true,
    sourceLabel: 'Makati City Annual Report 2020',
    sourceUrl:
      'https://www.makati.gov.ph/assets/uploads/downloads/2/55/601/pdf/Annual%20Report%202020.pdf',
    sourcePublisher: 'City Government of Makati',
    relatedHref: '/legislation',
  },
  {
    id: '2024-q3-bid-results-ulat-sa-bayan',
    type: 'procurement',
    title: 'Printing and publication services for Ulat sa Bayan 2024',
    summary:
      'A Q3 bid-results disclosure lists an approved budget for contract of ₱1.5 million and a winning bid of ₱1,498,750 for printing and publication services for Ulat sa Bayan 2024.',
    date: '2024-09-23',
    status: 'awarded',
    historical: true,
    referenceNo: 'BS24-07-0793',
    amount: 1498750,
    sourceLabel: 'Q3 Bid Results — Full Disclosure Policy',
    sourceUrl:
      'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q3%20Bid%20Results%20FDP.pdf',
    sourcePublisher: 'City Government of Makati',
    relatedHref: '/projects-budget#procurement',
  },
];

export const cityMonitorCoverageGaps = [
  {
    id: 'current-council-calendar',
    title: 'No complete current City Council session calendar is indexed yet',
    description:
      'BetterMakati has not located a reliable current machine-readable source for all regular and special session dates, agendas, attendance, votes and minutes. Makati’s official records establish that the council holds regular sessions and historically streamed sessions, but BetterMakati will not assume a 2026 recurrence pattern without a current source.',
  },
  {
    id: 'measure-lifecycle',
    title: 'Legislative lifecycle coverage is still incomplete',
    description:
      'The official archive is useful for enacted measures, but filing, committee referral, readings, voting and mayoral-action timestamps are not yet consistently available as one structured chain.',
  },
  {
    id: 'speech-video-index',
    title: 'Speech transcripts require a stable source recording or official text',
    description:
      'BetterMakati will transcribe only when the official text or recording can be preserved and cited. Automated text must never be presented as an official transcript.',
  },
  {
    id: 'publication-index',
    title: 'Official publication discovery is not yet a complete catalog',
    description:
      'Annual reports, plans, newsletters and Ulat sa Bayan records are distributed across the city portal and disclosure files rather than one normalized publication feed.',
  },
];

export const cityMonitorTypeLabel: Record<CityMonitorType, string> = {
  'council-session': 'City Council',
  legislation: 'Legislation',
  'executive-speech': 'Mayor & Executive',
  procurement: 'Procurement',
  project: 'Projects',
  publication: 'Publications',
  consultation: 'Consultations',
  'official-notice': 'Official notices',
};

export const legislativeLifecycle = [
  'Filed / introduced',
  'Referred / calendared',
  'Committee consideration',
  'Reading / deliberation',
  'Approved by council',
  'Transmitted for mayoral action',
  'Signed / vetoed / otherwise acted upon',
  'Effective / implemented',
];

export const procurementLifecycle = [
  'Planned / APP',
  'Invitation / posting',
  'Pre-bid',
  'Bid opening',
  'Evaluation / post-qualification',
  'Notice of award',
  'Contract',
  'Notice to proceed',
  'Implementation',
  'Completion / audit',
];

export const speechWorkflow = [
  'Official source located',
  'Official text/video preserved',
  'Transcript labeled by provenance',
  'Factual summary prepared',
  'Figures and commitments extracted',
  'Commitments linked to Accountability Ledger',
];
