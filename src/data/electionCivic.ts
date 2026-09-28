import { electedOfficials } from './electedOfficials';
import {
  election2025CouncilCandidateCount,
  election2025SingleSeatRaces,
  election2025Sources,
} from './election2025';
import {
  barangayMayoralResults2025,
  makatiMayoralHistory,
} from './electionHistory';

export const electionsReviewed = '28 September 2026';

export const electionCivicSources = {
  currentLawUpdate:
    'https://pia.gov.ph/news/pbbm-signs-law-fixing-the-terms-of-barangay-and-sk-officials/',
  currentLawReport:
    'https://www.pna.gov.ph/index.php/articles/1284830',
  previousBskeCalendar:
    'https://www.comelec.gov.ph/php-tpls-attachments/2025BSKE/Resolutions/com_res_11191.pdf',
  registrationRules:
    'https://www.comelec.gov.ph/php-tpls-attachments/2025BSKE/Resolutions/com_res_11177.pdf',
  previousFilingRules:
    'https://www.comelec.gov.ph/php-tpls-attachments/2025BSKE/Resolutions/com_res11196.pdf',
  previousTermLaw:
    'https://lawphil.net/statutes/repacts/ra2025/ra_12232_2025.html',
  previousTermRules:
    'https://www.comelec.gov.ph/php-tpls-attachments/2025BSKE/Resolutions/com_res_11207.pdf',
  precinctFinder: 'https://precinctfinder.comelec.gov.ph/voter_precinct',
  comelec: 'https://www.comelec.gov.ph/',
} as const;

export const currentBskeSchedule = {
  canonicalId: 'bske-schedule',
  law: 'Republic Act No. 12326',
  lawSignedOn: '2026-09-24',
  electionDate: '2028-11-13',
  electionDateBasis: 'Second Monday of November 2028',
  termYears: 5,
  title: 'Barangay & SK election schedule',
  summary:
    'Republic Act No. 12326 moved the next regular Barangay and Sangguniang Kabataan Elections to the second Monday of November 2028 and set five-year terms.',
  href: electionCivicSources.currentLawUpdate,
} as const;

export interface ElectionCoverageArea {
  id: string;
  label: string;
  status: 'structured' | 'partial' | 'pending';
  countLabel: string;
  included: string;
  limit: string;
}

const exactBarangayTotals = barangayMayoralResults2025.filter(
  result => result.exactVotesVerified
).length;

export const electionCoverageAreas: ElectionCoverageArea[] = [
  {
    id: '2025-local',
    label: '2025 city & district results',
    status: 'structured',
    countLabel:
      election2025SingleSeatRaces.length +
      ' single-seat races · ' +
      election2025CouncilCandidateCount +
      ' council candidates',
    included:
      'Mayor, vice mayor, both House districts, full candidate fields for both council districts, votes, turnout and elected status.',
    limit:
      'The displayed 2025 result table is based on COMELEC Media Server data republished by Rappler; the official COMELEC result portal remains linked as the primary election authority.',
  },
  {
    id: 'barangay-2025',
    label: '2025 mayoral result by barangay',
    status: 'partial',
    countLabel:
      barangayMayoralResults2025.length +
      ' barangay winners · ' +
      exactBarangayTotals +
      ' exact vote pairs',
    included:
      'Which mayoral candidate carried each of Makati’s current 23 barangays, plus exact totals where the accessible published source exposes them.',
    limit:
      'Exact mayoral totals are not yet matched for 21 barangays, and this layer does not yet normalize barangay-level totals for vice mayor, House or council races.',
  },
  {
    id: 'mayoral-history',
    label: 'Mayoral history',
    status: 'structured',
    countLabel: makatiMayoralHistory.length + ' regular elections',
    included:
      'Candidate vote totals for regular Makati mayoral elections from 1998 through 2025, with source-quality labels and the post-Embo boundary break stated.',
    limit:
      'Older races use academic or archival-secondary tables when a stable official digital result table is unavailable.',
  },
  {
    id: 'official-profiles',
    label: 'Current elected official profiles',
    status: 'structured',
    countLabel: electedOfficials.length + ' 2025-elected city/congressional officials',
    included:
      'Mayor, vice mayor, two House members and 16 elected city councilors connected to 2025 election-result data.',
    limit:
      'Barangay officials are maintained on BetterBarangay pages rather than duplicated in this city-election dataset.',
  },
  {
    id: 'bske-current',
    label: 'Barangay & SK election schedule',
    status: 'structured',
    countLabel: 'Current 2028 schedule · superseded 2026 schedule retained',
    included:
      'Republic Act No. 12326, the November 2028 election schedule, current voter tools, and an explicit record of the superseded 2026 calendar.',
    limit:
      'Detailed 2028 filing, campaign and other operational dates should not be inferred until COMELEC publishes the corresponding current calendar and rules.',
  },
];

export const bskeMilestones = [
  {
    id: 'ra-12326-signed',
    start: currentBskeSchedule.lawSignedOn,
    end: currentBskeSchedule.lawSignedOn,
    date: 'September 24, 2026',
    title: 'Republic Act No. 12326 signed',
    detail:
      'The law reset the next regular BSKE to the second Monday of November 2028 and fixed barangay and SK terms at five years.',
    href: electionCivicSources.currentLawUpdate,
  },
  {
    id: 'next-regular-bske',
    start: currentBskeSchedule.electionDate,
    end: currentBskeSchedule.electionDate,
    date: 'November 13, 2028',
    title: 'Next regular Barangay & SK Elections',
    detail:
      'November 13, 2028 is the second Monday of November 2028, the schedule stated by Republic Act No. 12326.',
    href: electionCivicSources.currentLawUpdate,
  },
] as const;

export const supersededBske2026Milestones = [
  {
    id: 'coc-filing',
    start: '2026-09-28',
    end: '2026-10-05',
    date: 'September 28 – October 5, 2026',
    title: 'Certificate-of-candidacy filing',
    detail:
      'This filing window appeared in the prior 2026 COMELEC calendar. It is no longer operative after Republic Act No. 12326 moved the regular BSKE to 2028.',
    href: electionCivicSources.previousBskeCalendar,
  },
  {
    id: 'campaign-period',
    start: '2026-10-22',
    end: '2026-10-31',
    date: 'October 22 – 31, 2026',
    title: 'Campaign period',
    detail:
      'This campaign window belonged to the superseded 2026 election schedule.',
    href: electionCivicSources.previousBskeCalendar,
  },
  {
    id: 'election-day',
    start: '2026-11-02',
    end: '2026-11-02',
    date: 'November 2, 2026',
    title: 'Election day',
    detail:
      'This former election date was superseded when Republic Act No. 12326 moved the next regular BSKE to November 2028.',
    href: electionCivicSources.previousBskeCalendar,
  },
  {
    id: 'term-start',
    start: '2026-12-01',
    end: '2026-12-01',
    date: 'December 1, 2026',
    title: 'New term begins',
    detail:
      'This former transition date was tied to the superseded 2026 schedule under the previous law.',
    href: electionCivicSources.previousTermLaw,
  },
] as const;

export const bskeRuleCards = [
  {
    title: 'Five-year term',
    body:
      'Republic Act No. 12326 fixes the term of elected barangay and Sangguniang Kabataan officials at five years.',
    href: electionCivicSources.currentLawUpdate,
    sourceLabel: 'Republic Act No. 12326 update',
  },
  {
    title: 'Next regular election',
    body:
      'The law schedules the next regular Barangay and SK Elections for the second Monday of November 2028, then every five years thereafter.',
    href: electionCivicSources.currentLawUpdate,
    sourceLabel: 'Republic Act No. 12326 update',
  },
  {
    title: '2026 schedule superseded',
    body:
      'The November 2, 2026 BSKE and its associated filing and campaign schedule no longer govern the next regular election.',
    href: electionCivicSources.currentLawReport,
    sourceLabel: 'Current postponement report',
  },
  {
    title: 'Transition rule',
    body:
      'The new law treats the two-year extension of incumbent elective barangay officials as one completed term for the transition rule described in the law.',
    href: electionCivicSources.currentLawUpdate,
    sourceLabel: 'Republic Act No. 12326 update',
  },
] as const;

const manilaDateKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type: string) =>
    parts.find(item => item.type === type)?.value ?? '';
  return part('year') + '-' + part('month') + '-' + part('day');
};

export const getBskePhase = (date = new Date()) => {
  const key = manilaDateKey(date);
  if (key < currentBskeSchedule.electionDate) {
    return {
      label: '2028 election cycle',
      detail:
        'Republic Act No. 12326 moved the next regular BSKE to November 13, 2028. Check COMELEC for the eventual 2028 filing, campaign and precinct calendar.',
    };
  }
  if (key === currentBskeSchedule.electionDate) {
    return {
      label: 'Election day',
      detail:
        'Use COMELEC for current polling information, precinct assignments and official election updates.',
    };
  }
  return {
    label: 'Post-election',
    detail:
      'Use COMELEC canvass and proclamation records for official results and transition information.',
  };
};

export const electionDataSources = [
  {
    label: 'COMELEC 2025 results portal',
    href: election2025Sources.officialResults,
    kind: 'Official election authority',
  },
  {
    label: 'Makati 2025 result table',
    href: election2025Sources.localResults,
    kind: 'COMELEC Media Server via Rappler',
  },
  {
    label: 'COMELEC certified 2025 candidate list',
    href: election2025Sources.candidateList,
    kind: 'Official candidate record',
  },
  {
    label: 'Republic Act No. 12326 — current BSKE schedule update',
    href: electionCivicSources.currentLawUpdate,
    kind: 'Official government communication',
  },
  {
    label: 'COMELEC 2026 BSKE calendar — superseded',
    href: electionCivicSources.previousBskeCalendar,
    kind: 'Superseded official election calendar',
  },
  {
    label: 'Republic Act No. 12232 — previous schedule',
    href: electionCivicSources.previousTermLaw,
    kind: 'Previous statutory schedule',
  },
  {
    label: 'COMELEC',
    href: electionCivicSources.comelec,
    kind: 'Official election authority',
  },
] as const;
