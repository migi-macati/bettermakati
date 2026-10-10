import { procurementProjectEntries } from './accountabilitySupplement';
import {
  currentCouncilSessionSeeds,
  type CouncilTranscriptKind,
  type CouncilTranscriptStatus,
} from './councilSessions';

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

export type CityMonitorMonitoringMode =
  | 'content-hash'
  | 'reachability'
  | 'manual-review';

export interface CityMonitorSource {
  id: string;
  label: string;
  stream: CityMonitorType | 'multi';
  url: string;
  publisher: string;
  cadence: 'daily' | 'weekly' | 'event-driven';
  monitoringMode: CityMonitorMonitoringMode;
  monitoringNote: string;
}

export interface CityMonitorRecord {
  id: string;
  type: CityMonitorType;
  title: string;
  summary: string;
  date: string;
  /** Source-stated start of an occurrence window, with timezone when known. */
  effectiveFrom?: string;
  /** Source-stated end of an occurrence window, with timezone when known. */
  effectiveUntil?: string;
  publishedDate?: string;
  deadlineAt?: string;
  openingAt?: string;
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
  barangaySlug?: string;
  location?: string;
  /**
   * Explicit canonical Place Registry IDs only.
   *
   * Add a place only when the City Monitor source itself clearly names the
   * place/site or the record is unambiguously scoped to that canonical place.
   * Do not populate this from barangay, proximity or fuzzy name matching.
   */
  placeIds?: string[];
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
    kind: CouncilTranscriptKind;
    status: CouncilTranscriptStatus;
    note: string;
    url?: string;
    sourceVideoUrl?: string;
    generatedAt?: string;
    model?: string;
    segmentsUrl?: string;
    textUrl?: string;
    reviewedAt?: string;
  };
  commitments?: Array<{
    text: string;
    target?: string;
    sourceNote?: string;
  }>;
}

export const cityMonitorReviewed = '26 September 2026';

export const cityMonitorSources: CityMonitorSource[] = [
  {
    id: 'makati-legislation',
    label: 'Makati resolutions & ordinances',
    stream: 'legislation',
    url: 'https://www.makati.gov.ph/content/resolutions-and-ordinances/author',
    publisher: 'City Government of Makati',
    cadence: 'daily',
    monitoringMode: 'reachability',
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
    monitoringMode: 'reachability',
    monitoringNote:
      'Watch for newly published speeches or official text. BetterMakati transcripts must be labeled separately from official transcripts.',
  },
  {
    id: 'makati-council-videos',
    label: 'Makati official council-session videos',
    stream: 'council-session',
    url: 'https://www.makati.gov.ph/',
    publisher: 'City Government of Makati',
    cadence: 'event-driven',
    monitoringMode: 'reachability',
    monitoringNote:
      'The official Makati portal currently lists regular City Council session videos. A listing is enough to create a session discovery record, but BetterMakati must preserve the item-specific official recording URL before transcription or timestamp linking.',
  },
  {
    id: 'mymakati-broadcasts',
    label: 'MyMakati official social broadcasts',
    stream: 'council-session',
    url: 'https://www.facebook.com/mymakativerified',
    publisher: 'City Government of Makati',
    cadence: 'event-driven',
    monitoringMode: 'manual-review',
    monitoringNote:
      'Historical city records identify MyMakati as a council-session streaming channel. Social-platform access can be inconsistent, so session claims still require a current official post or recording.',
  },
  {
    id: 'makati-events',
    label: 'Makati Events',
    stream: 'consultation',
    url: 'https://www.makati.gov.ph/content/events',
    publisher: 'City Government of Makati',
    cadence: 'daily',
    monitoringMode: 'reachability',
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
    monitoringMode: 'reachability',
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
    monitoringMode: 'reachability',
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
    monitoringMode: 'content-hash',
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
    monitoringMode: 'reachability',
    monitoringNote:
      'Monitor the city portal for annual reports, plans, newsletters, Ulat sa Bayan and other official publications.',
  },
  {
    id: 'barangay-poblacion-facebook',
    label: 'Barangay Poblacion official notices',
    stream: 'official-notice',
    url: 'https://www.facebook.com/SampiroMacati',
    publisher: 'Barangay Poblacion, Makati City',
    cadence: 'event-driven',
    monitoringMode: 'manual-review',
    monitoringNote:
      'Review the official barangay page for source-stated service interruptions and other time-sensitive notices. Preserve occurrence windows separately from publication dates.',
  },
  {
    id: 'barangay-kasilawan-facebook',
    label: 'Barangay Kasilawan official notices',
    stream: 'official-notice',
    url: 'https://www.facebook.com/kasilaONE',
    publisher: 'Barangay Kasilawan, Makati City',
    cadence: 'event-driven',
    monitoringMode: 'manual-review',
    monitoringNote:
      'Review the official barangay page for source-stated service schedules and other time-sensitive notices. Preserve occurrence windows separately from publication dates.',
  },
];

const baseCityMonitorRecords: CityMonitorRecord[] = [
  {
    id: '2026-10-08-poblacion-dm-rivera-power-interruption',
    type: 'official-notice',
    title: 'Power interruption on D.M. Rivera Street',
    summary:
      'Barangay Poblacion announced a scheduled power interruption affecting D.M. Rivera Street on 8 October 2026 from 9:00 AM to 2:00 PM.',
    date: '2026-10-08',
    effectiveFrom: '2026-10-08T09:00:00+08:00',
    effectiveUntil: '2026-10-08T14:00:00+08:00',
    status: 'published',
    stage: 'Scheduled service interruption',
    sourceLabel: 'Sampiro Macati — Barangay Poblacion official notice',
    sourceUrl:
      'https://www.facebook.com/SampiroMacati/posts/122263841642157355',
    sourcePublisher: 'Barangay Poblacion, Makati City',
    barangaySlug: 'poblacion',
    location: 'D.M. Rivera Street, Barangay Poblacion',
    summaryBullets: [
      'Occurrence window: 8 October 2026, 9:00 AM–2:00 PM.',
      'The source names D.M. Rivera Street; BetterMakati does not infer a wider affected area.',
      'The Facebook post exposes a relative age label, not an exact publication timestamp, so no publishedDate is recorded.',
    ],
    documents: [
      {
        label: 'Official Barangay Poblacion notice',
        url: 'https://www.facebook.com/SampiroMacati/posts/122263841642157355',
        kind: 'official-text',
      },
    ],
  },
  {
    id: '2026-10-08-kasilawan-rpt-payment',
    type: 'official-notice',
    title: 'Fourth-quarter real property tax payment at Kasilawan Barangay Hall',
    summary:
      'Barangay Kasilawan announced a one-day real property tax payment schedule for the fourth quarter at Kasilawan Barangay Hall on 8 October 2026 from 9:00 AM to 4:00 PM.',
    date: '2026-10-08',
    effectiveFrom: '2026-10-08T09:00:00+08:00',
    effectiveUntil: '2026-10-08T16:00:00+08:00',
    status: 'published',
    stage: 'Barangay tax collection schedule',
    sourceLabel: 'KasilaONE — Barangay Kasilawan official notice',
    sourceUrl:
      'https://www.facebook.com/kasilaONE/posts/122117512083454651',
    sourcePublisher: 'Barangay Kasilawan, Makati City',
    barangaySlug: 'kasilawan',
    location: 'Barangay Hall Kasilawan',
    summaryBullets: [
      'Service window: 8 October 2026, 9:00 AM–4:00 PM.',
      'The source identifies the venue as Kasilawan Barangay Hall.',
      'BetterMakati does not infer that this one-day service schedule changes the underlying city tax deadline.',
      'The Facebook post exposes a relative age label, not an exact publication timestamp, so no publishedDate is recorded.',
    ],
    documents: [
      {
        label: 'Official Barangay Kasilawan notice',
        url: 'https://www.facebook.com/kasilaONE/posts/122117512083454651',
        kind: 'official-text',
      },
    ],
  },
  {
    id: '2026-philgeps-makati-traffic-master-plan-13266370',
    type: 'procurement',
    title:
      'Consulting Services for the Makati Traffic and Transportation Master Plan 2026–2040',
    summary:
      'PhilGEPS Invitation to Bid reference 13266370 lists a ₱50,000,000 approved budget for consulting services for the Makati Traffic and Transportation Master Plan 2026–2040 under solicitation BS26-07-0674. The notice was published 1 October 2026; the updated PhilGEPS closing date is 15 October 2026 at 8:30 AM, with short-listing opening scheduled for 9:00 AM that day. The notice still retains an earlier 8 October opening date in its original description.',
    date: '2026-10-01',
    publishedDate: '2026-10-01',
    deadlineAt: '2026-10-15T08:30:00+08:00',
    openingAt: '2026-10-15T09:00:00+08:00',
    status: 'published',
    stage: 'Published procurement notice',
    referenceNo: 'BS26-07-0674 / PhilGEPS 13266370',
    amount: 50000000,
    sourceLabel: 'PhilGEPS Bid Notice Abstract — Reference 13266370',
    sourceUrl:
      'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/SplashBidNoticeAbstractUI.aspx?highlight=true&menuIndex=3&refID=13266370',
    sourcePublisher: 'Philippine Government Electronic Procurement System',
    relatedHref: '/projects-budget#procurement',
    summaryBullets: [
      'Approved budget for contract: ₱50,000,000.00.',
      'Date published: 1 October 2026.',
      'Updated short-listing submission deadline: 15 October 2026, 8:30 AM (PhilGEPS closing date, updated 7 October).',
      'The updated remarks schedule the opening of short-listing documents for 15 October 2026, 9:00 AM; older text on the same notice still says 8 October.',
      'The notice identifies a 2026–2040 planning horizon but displays “0 Day/s” for contract duration; BetterMakati does not infer a delivery schedule.',
      'The notice does not establish the short-listing result, contract award or start of planning work. Dates reflect the updated notice; check the issuing BAC for any subsequent amendments.',
    ],
    documents: [
      {
        label: 'PhilGEPS Bid Notice Abstract — Reference 13266370',
        url: 'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/SplashBidNoticeAbstractUI.aspx?highlight=true&menuIndex=3&refID=13266370',
        kind: 'procurement',
      },
    ],
  },
  {
    id: '2026-philgeps-makati-teachers-kits-13224300',
    type: 'procurement',
    title: 'Supply and delivery of teachers’ kits',
    summary:
      'PhilGEPS Invitation to Bid 13224300 for teachers’ kits (tote bags, jackets, walking shoes and gift certificates) shows status Awarded as of its 8 October 2026 update. The approved budget is ₱12,075,000, which is not a verified contract award amount; the available notice does not identify the winning supplier or award date.',
    date: '2026-09-03',
    publishedDate: '2026-09-03',
    deadlineAt: '2026-09-22T09:30:00+08:00',
    openingAt: '2026-09-22T10:00:00+08:00',
    status: 'awarded',
    stage: 'PhilGEPS notice status: Awarded (updated 8 October 2026)',
    referenceNo: 'BS26-08-0786 / PhilGEPS 13224300',
    amount: 12075000,
    sourceLabel: 'PhilGEPS Bid Notice Abstract — Reference 13224300',
    sourceUrl:
      'https://notices.philgeps.gov.ph/GEPS/Tender/PrintableBidNoticeAbstractUI.aspx?refid=13224300',
    sourcePublisher: 'Philippine Government Electronic Procurement System',
    relatedHref: '/projects-budget#procurement',
    summaryBullets: [
      'Approved budget for contract: ₱12,075,000.00 (not the award amount).',
      'Published: 3 September 2026; PhilGEPS status Awarded, last updated 8 October 2026.',
      'Bids closed on 22 September 2026 at 9:30 AM; opening was scheduled for 10:00 AM.',
      'The notice does not establish the supplier, award value, award date, delivery or completion.',
    ],
    documents: [
      {
        label: 'PhilGEPS Bid Notice Abstract — Reference 13224300',
        url: 'https://notices.philgeps.gov.ph/GEPS/Tender/PrintableBidNoticeAbstractUI.aspx?refid=13224300',
        kind: 'procurement',
      },
    ],
  },
  {
    id: '2026-philgeps-makati-creative-software-13203651',
    type: 'procurement',
    title: 'Three-year licensed creative editing and design software subscriptions',
    summary:
      'PhilGEPS Invitation to Bid 13203651 for licensed creative editing and multi-media design software subscriptions for three years shows status Awarded as of its 8 October 2026 update. The approved budget is ₱1,912,798, not a verified award amount; the available notice does not name the successful supplier or contract award date.',
    date: '2026-08-20',
    publishedDate: '2026-08-20',
    deadlineAt: '2026-09-08T09:00:00+08:00',
    openingAt: '2026-09-08T09:30:00+08:00',
    status: 'awarded',
    stage: 'PhilGEPS notice status: Awarded (updated 8 October 2026)',
    referenceNo: 'BS26-08-0693 / PhilGEPS 13203651',
    amount: 1912798,
    sourceLabel: 'PhilGEPS Bid Notice Abstract — Reference 13203651',
    sourceUrl:
      'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/PrintableBidNoticeAbstractUI.aspx?refid=13203651',
    sourcePublisher: 'Philippine Government Electronic Procurement System',
    relatedHref: '/projects-budget#procurement',
    summaryBullets: [
      'Approved budget for contract: ₱1,912,798.00 (not the award amount).',
      'Published: 20 August 2026; PhilGEPS status Awarded, last updated 8 October 2026.',
      'Bids closed on 8 September 2026 at 9:00 AM; opening was scheduled for 9:30 AM.',
      'The notice does not establish the supplier, award value, award date, delivery or completion.',
    ],
    documents: [
      {
        label: 'PhilGEPS Bid Notice Abstract — Reference 13203651',
        url: 'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/PrintableBidNoticeAbstractUI.aspx?refid=13203651',
        kind: 'procurement',
      },
    ],
  },
  {
    id: '2026-philgeps-ospital-ng-makati-soil-investigation-13268269',
    type: 'procurement',
    title: 'Proposed soil investigation and exploration in Ospital ng Makati',
    summary:
      'PhilGEPS Request for Quotation reference 13268269 lists a ₱245,000 approved budget for proposed soil investigation and exploration in Ospital ng Makati under solicitation BS26-07-0677. The notice was published 2 October 2026; quotations were due 8 October 2026 at 9:30 AM, with opening scheduled for 11:00 AM.',
    date: '2026-10-02',
    publishedDate: '2026-10-02',
    deadlineAt: '2026-10-08T09:30:00+08:00',
    openingAt: '2026-10-08T11:00:00+08:00',
    status: 'published',
    stage: 'Published procurement notice',
    referenceNo: 'BS26-07-0677 / PhilGEPS 13268269',
    amount: 245000,
    sourceLabel: 'PhilGEPS Bid Notice Abstract — Reference 13268269',
    sourceUrl:
      'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/SplashBidNoticeAbstractUI.aspx?highlight=true&menuIndex=3&refID=13268269',
    sourcePublisher: 'Philippine Government Electronic Procurement System',
    relatedHref: '/projects-budget#procurement',
    location: 'Ospital ng Makati',
    summaryBullets: [
      'Approved budget for contract: ₱245,000.00.',
      'Date published: 2 October 2026.',
      'Quotation submission deadline: 8 October 2026, 9:30 AM.',
      'Opening was scheduled for 8 October 2026, 11:00 AM.',
      'The notice does not establish a quotation result, award, notice to proceed or investigation findings.',
    ],
    documents: [
      {
        label: 'PhilGEPS Bid Notice Abstract — Reference 13268269',
        url: 'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/SplashBidNoticeAbstractUI.aspx?highlight=true&menuIndex=3&refID=13268269',
        kind: 'procurement',
      },
    ],
  },
  {
    id: '2026-philgeps-eboss-queue-maintenance-13268347',
    type: 'procurement',
    title: 'Online integrated queuing system maintenance for two months',
    summary:
      'PhilGEPS Request for Quotation reference 13268347 lists a ₱833,333.34 approved budget for two months of maintenance for the online integrated queuing system (eBOSS) under solicitation BS26-09-0881. The notice was published 2 October 2026; quotations were due 8 October 2026 at 9:30 AM, with opening scheduled for 11:00 AM.',
    date: '2026-10-02',
    publishedDate: '2026-10-02',
    deadlineAt: '2026-10-08T09:30:00+08:00',
    openingAt: '2026-10-08T11:00:00+08:00',
    status: 'published',
    stage: 'Published procurement notice',
    referenceNo: 'BS26-09-0881 / PhilGEPS 13268347',
    amount: 833333.34,
    sourceLabel: 'PhilGEPS Bid Notice Abstract — Reference 13268347',
    sourceUrl:
      'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/SplashBidNoticeAbstractUI.aspx?Result=3&menuIndex=3&refID=13268347',
    sourcePublisher: 'Philippine Government Electronic Procurement System',
    relatedHref: '/projects-budget#procurement',
    summaryBullets: [
      'Approved budget for contract: ₱833,333.34.',
      'Date published: 2 October 2026.',
      'Quotation submission deadline: 8 October 2026, 9:30 AM.',
      'Opening was scheduled for 8 October 2026, 11:00 AM.',
      'The two-month service scope is source-stated; the notice displays “0 Day/s” for delivery period, so BetterMakati does not infer a separate delivery duration.',
      'The notice does not establish a quotation result, award or completed maintenance period.',
    ],
    documents: [
      {
        label: 'PhilGEPS Bid Notice Abstract — Reference 13268347',
        url: 'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/SplashBidNoticeAbstractUI.aspx?Result=3&menuIndex=3&refID=13268347',
        kind: 'procurement',
      },
    ],
  },
  {
    id: '2026-philgeps-passenger-utility-vans-13256997',
    type: 'procurement',
    title: 'Supply and Delivery of Brand-New Passenger Utility Vans',
    summary:
      'PhilGEPS Invitation to Bid reference 13256997 lists a ₱8,331,000 approved budget for contract under solicitation BS26-06-0627-1. The notice was published 24 September 2026; bid submission closes 13 October 2026 at 9:30 AM and bid opening is scheduled for 10:00 AM the same day.',
    date: '2026-09-24',
    publishedDate: '2026-09-24',
    deadlineAt: '2026-10-13T09:30:00+08:00',
    openingAt: '2026-10-13T10:00:00+08:00',
    status: 'published',
    stage: 'Bid submission deadline',
    referenceNo: 'BS26-06-0627-1 / PhilGEPS 13256997',
    amount: 8331000,
    sourceLabel: 'PhilGEPS Bid Notice Abstract — Reference 13256997',
    sourceUrl:
      'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/SplashBidNoticeAbstractUI.aspx?highlight=true&menuIndex=3&refID=13256997',
    sourcePublisher: 'Philippine Government Electronic Procurement System',
    relatedHref: '/projects-budget#procurement',
    summaryBullets: [
      'Approved budget for contract: ₱8,331,000.00.',
      'Date published: 24 September 2026.',
      'Pre-bid conference: 1 October 2026, 10:00 AM, Executive Lounge, 22nd Floor, Makati City Hall Building I.',
      'Bid submission deadline: 13 October 2026, 9:30 AM.',
      'Bid opening: 13 October 2026, 10:00 AM.',
      'PhilGEPS displays “0 Day/s” for delivery period; BetterMakati does not treat that portal value as a meaningful delivery commitment.',
    ],
    documents: [
      {
        label: 'PhilGEPS Bid Notice Abstract — Reference 13256997',
        url: 'https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/SplashBidNoticeAbstractUI.aspx?highlight=true&menuIndex=3&refID=13256997',
        kind: 'procurement',
      },
    ],
  },
  {
    id: '2026-q2-makati-city-hall-building-ii-hvac',
    type: 'procurement',
    title:
      'HVAC dust cleaning and decontamination at Makati City Hall Building II',
    summary:
      'The Q2 2026 city bid-results disclosure records an award for HVAC system dust cleaning and decontamination services at Makati City Hall Building II.',
    date: '2026-05-19',
    status: 'awarded',
    stage: 'Bid result disclosed',
    referenceNo: 'BS26-04-0403',
    amount: 10306303.35,
    sourceLabel: 'Q2 2026 Bid Results — Goods and Services',
    sourceUrl:
      'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q2%20Bids.pdf',
    sourcePublisher: 'City Government of Makati',
    location: 'Makati City Hall Building II',
    placeIds: ['makati-city-hall'],
    summaryBullets: [
      'Approved budget for contract: ₱10,810,561.25.',
      'Winning bid: ₱10,306,303.35.',
      'Linked to the Makati City Hall civic record because the source explicitly names Makati City Hall Building II; the relationship is to the City Hall complex, not inferred from proximity.',
    ],
    documents: [
      {
        label: 'Q2 2026 Bid Results — Goods and Services',
        url: 'https://www.makati.gov.ph/assets/uploads/staticmenu/docs/online_forms/pdf/Q2%20Bids.pdf',
        kind: 'procurement',
      },
    ],
  },
  {
    id: '2020-council-legislative-activity',
    type: 'council-session',
    title: '2020 City Council legislative activity',
    summary:
      'The City Government’s 2020 Annual Report records 56 regular sessions and 56 committee hearings, with 287 resolutions and 50 ordinances passed/approved during the year. Sessions were held by videoconference under pandemic protocols and streamed through MyMakati Facebook.',
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


const currentCouncilSessionMonitorRecords: CityMonitorRecord[] =
  currentCouncilSessionSeeds.map(session => ({
    id: session.id,
    type: 'council-session',
    title: session.titleAsPublished,
    summary:
      'The official Makati web portal lists this regular City Council session video. BetterMakati has normalized the session identity/date and queued the recording for transcript backfill after the item-specific official video URL is preserved.',
    date: session.date,
    status: 'published',
    stage: 'Official session video listed',
    sourceLabel: 'Makati Latest Videos',
    sourceUrl: session.discoveryUrl,
    sourcePublisher: 'City Government of Makati',
    relatedHref: '/legislation',
    summaryBullets: [
      'Session date is taken from the official published session title.',
      'No measure action, vote, attendance or mayoral action is inferred from the existence of the recording.',
      'Automated transcript remains planned until the stable official video URL is preserved.',
    ],
    transcript: {
      kind: session.transcript.kind,
      status: session.transcript.status,
      note: session.transcript.note,
      sourceVideoUrl: session.recording.url,
      generatedAt: session.transcript.generatedAt,
      model: session.transcript.model,
      segmentsUrl: session.transcript.segmentsUrl,
      textUrl: session.transcript.textUrl,
      reviewedAt: session.transcript.reviewedAt,
    },
  }));

const procurementMonitorRecords: CityMonitorRecord[] =
  procurementProjectEntries.map(entry => {
    const procurement = entry.procurement!;
    const source = entry.sources[0];
    return {
      id: 'monitor-' + entry.id,
      type: 'procurement',
      title: entry.title,
      summary:
        'The city bid-results disclosure reports ' +
        (procurement.supplier || 'a winning bidder') +
        ' at ₱' +
        ((procurement.awardedAmountM || 0) * 1_000_000).toLocaleString('en-PH', {
          maximumFractionDigits: 2,
        }) +
        ' against an approved budget for contract of ₱' +
        ((procurement.approvedBudgetM || 0) * 1_000_000).toLocaleString('en-PH', {
          maximumFractionDigits: 2,
        }) +
        '. Later contract, notice-to-proceed, implementation and completion stages require separate evidence.',
      date: procurement.bidDate || entry.period,
      status: 'awarded',
      historical: true,
      stage: 'Bid result disclosed',
      referenceNo: procurement.referenceNo,
      amount:
        procurement.awardedAmountM === undefined
          ? undefined
          : procurement.awardedAmountM * 1_000_000,
      sourceLabel: source?.label || 'City procurement record',
      sourceUrl: source?.url || '',
      sourcePublisher: source?.publisher || 'City Government of Makati',
      relatedHref: '/accountability?type=project#' + entry.id,
      barangaySlug: entry.barangaySlug,
      location: entry.location,
      summaryBullets: [
        procurement.approvedBudgetM !== undefined
          ? 'Approved budget for contract: ₱' +
            (procurement.approvedBudgetM * 1_000_000).toLocaleString('en-PH', {
              maximumFractionDigits: 2,
            })
          : 'Approved budget for contract not stated in the structured record.',
        procurement.awardedAmountM !== undefined
          ? 'Winning bid: ₱' +
            (procurement.awardedAmountM * 1_000_000).toLocaleString('en-PH', {
              maximumFractionDigits: 2,
            })
          : 'Winning bid amount not stated in the structured record.',
        procurement.supplier
          ? 'Reported winning bidder: ' + procurement.supplier
          : 'Winning bidder not stated in the structured record.',
      ],
      documents: source
        ? [
            {
              label: source.label,
              url: source.url,
              kind: 'procurement' as const,
            },
          ]
        : undefined,
    };
  });

export const cityMonitorRecords: CityMonitorRecord[] = [
  ...baseCityMonitorRecords,
  ...currentCouncilSessionMonitorRecords,
  ...procurementMonitorRecords,
].sort((a, b) => b.date.localeCompare(a.date));

export interface CityMonitorCoverageArea {
  type: CityMonitorType;
  label: string;
  sourceCount: number;
  recordCount: number;
  coverage: 'active-source' | 'partial' | 'source-gap';
  included: string;
  limit: string;
}

const coverageSeed: Array<
  Omit<CityMonitorCoverageArea, 'sourceCount' | 'recordCount'>
> = [
  {
    type: 'council-session',
    label: 'City Council sessions',
    coverage: 'partial',
    included:
      'Current regular-session videos listed on the official Makati portal are normalized as session records, alongside historical MyMakati streaming evidence.',
    limit:
      'The current official video listing does not by itself establish a complete calendar of all regular/special sessions, agendas, attendance, votes or minutes; item-specific video URLs still need preservation before transcription.',
  },
  {
    type: 'legislation',
    label: 'Legislation',
    coverage: 'partial',
    included:
      'The official Makati resolutions-and-ordinances archive is monitored as the enacted-measure source.',
    limit:
      'Filing, referral, readings, committee action, voting and mayoral-action timestamps are not yet exposed as one complete structured lifecycle.',
  },
  {
    type: 'executive-speech',
    label: 'Mayor & executive',
    coverage: 'partial',
    included:
      'The official Mayor’s Corner speech channel is monitored for newly published speeches and official text.',
    limit:
      'The city page is dynamically rendered, so reachability can be checked automatically but substantive additions still require source review.',
  },
  {
    type: 'procurement',
    label: 'Procurement',
    coverage: 'active-source',
    included:
      'PhilGEPS and city bid-result disclosures, including structured award records already linked to Projects & Budget and Accountability.',
    limit:
      'Contracts, notices to proceed, implementation and completion evidence remain incomplete for many awards.',
  },
  {
    type: 'project',
    label: 'Projects',
    coverage: 'partial',
    included:
      'Project follow-through is linked from procurement and Accountability records when later public evidence exists.',
    limit:
      'There is no single current official project-status feed covering all city capital and service-delivery projects.',
  },
  {
    type: 'publication',
    label: 'Publications',
    coverage: 'partial',
    included:
      'Annual reports, plans, Ulat sa Bayan and other official publication channels are monitored for discovery.',
    limit:
      'The city portal does not expose one normalized publication feed with stable item metadata.',
  },
  {
    type: 'consultation',
    label: 'Consultations & hearings',
    coverage: 'partial',
    included:
      'The official Makati Events channel is monitored for public events and possible participation opportunities.',
    limit:
      'A complete hearing/consultation calendar with agenda, submissions and resulting action is not yet available as a structured source.',
  },
  {
    type: 'official-notice',
    label: 'Official notices',
    coverage: 'partial',
    included:
      'The official Makati News channel and reviewed official barangay notice pages are monitored separately from independent news coverage.',
    limit:
      'City and barangay notice channels require source review, and social-platform age labels may not expose an exact publication timestamp. BetterMakati records source-stated occurrence windows without inventing publication dates.',
  },
];

export const cityMonitorCoverageAreas: CityMonitorCoverageArea[] =
  coverageSeed.map(area => ({
    ...area,
    sourceCount: cityMonitorSources.filter(
      source => source.stream === area.type || source.stream === 'multi'
    ).length,
    recordCount: cityMonitorRecords.filter(record => record.type === area.type).length,
  }));

export const cityMonitorSourceCount = cityMonitorSources.length;
export const cityMonitorValidatedRecordCount = cityMonitorRecords.length;
export const cityMonitorHistoricalRecordCount = cityMonitorRecords.filter(
  record => record.historical
).length;

export const cityMonitorCoverageGaps = [
  {
    id: 'current-council-calendar',
    title: 'Current session videos are indexed; the complete legislative calendar is not',
    description:
      'The official Makati portal currently lists regular City Council session videos and BetterMakati normalizes the identifiable sessions. Completeness still requires reconciliation against all regular/special sessions plus agendas, attendance, votes and minutes; no recurrence pattern is assumed.',
  },
  {
    id: 'council-transcript-backfill',
    title: 'Council-session transcript backfill is queued',
    description:
      'Identifiable official session recordings enter the BetterMakati automated-transcript queue only after an item-specific official video URL is preserved. Generated transcripts remain non-official until reviewed and cannot establish a legislative action without source review.',
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
