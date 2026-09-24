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

export const electionsReviewed = '24 September 2026';

export const electionCivicSources = {
  bskeCalendar:
    'https://www.comelec.gov.ph/php-tpls-attachments/2025BSKE/Resolutions/com_res_11191.pdf',
  registrationRules:
    'https://www.comelec.gov.ph/php-tpls-attachments/2025BSKE/Resolutions/com_res_11177.pdf',
  filingRules:
    'https://www.comelec.gov.ph/php-tpls-attachments/2025BSKE/Resolutions/com_res11196.pdf',
  termLaw:
    'https://lawphil.net/statutes/repacts/ra2025/ra_12232_2025.html',
  termRules:
    'https://www.comelec.gov.ph/php-tpls-attachments/2025BSKE/Resolutions/com_res_11207.pdf',
  precinctFinder: 'https://precinctfinder.comelec.gov.ph/voter_precinct',
  comelec: 'https://www.comelec.gov.ph/',
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
    id: 'bske-2026',
    label: '2026 Barangay & SK Elections',
    status: 'pending',
    countLabel: 'Calendar, registration, term rules & voter tools',
    included:
      'COMELEC calendar, registration rules, legal basis for the four-year term, filing rules, term-limit transition and precinct-verification tool.',
    limit:
      'COC filing opens September 28 and runs through October 5, 2026. No official Makati candidate list is available yet.',
  },
];

export const bskeMilestones = [
  {
    start: '2026-05-18',
    end: '2026-05-18',
    date: 'May 18, 2026',
    title: 'Regular local voter registration closed',
    detail:
      'The regular non-BARMM registration period for the November 2, 2026 BSKE ended on this date.',
    href: electionCivicSources.registrationRules,
  },
  {
    start: '2026-09-28',
    end: '2026-10-05',
    date: 'September 28 – October 5, 2026',
    title: 'Certificates of candidacy',
    detail:
      'COMELEC’s election calendar sets this period for filing certificates of candidacy.',
    href: electionCivicSources.bskeCalendar,
  },
  {
    start: '2026-10-22',
    end: '2026-10-31',
    date: 'October 22 – 31, 2026',
    title: 'Campaign period',
    detail:
      'COMELEC’s calendar sets this as the campaign period for barangay and SK candidates.',
    href: electionCivicSources.bskeCalendar,
  },
  {
    start: '2026-11-02',
    end: '2026-11-02',
    date: 'November 2, 2026',
    title: 'Election day',
    detail:
      'The next regular Barangay and Sangguniang Kabataan Elections are scheduled for the first Monday of November 2026.',
    href: electionCivicSources.bskeCalendar,
  },
  {
    start: '2026-12-01',
    end: '2026-12-01',
    date: 'December 1, 2026',
    title: 'New term begins',
    detail:
      'Republic Act No. 12232 provides that officials elected after the law took effect begin their term on the first day of December following the election.',
    href: electionCivicSources.termLaw,
  },
] as const;

export const bskeRuleCards = [
  {
    title: 'Four-year term',
    body:
      'Republic Act No. 12232 sets a four-year term for elected barangay and Sangguniang Kabataan officials and schedules regular BSKEs every four years starting in November 2026.',
    href: electionCivicSources.termLaw,
    sourceLabel: 'Republic Act No. 12232',
  },
  {
    title: 'Barangay term limit',
    body:
      'The law limits an elective barangay official to three consecutive terms in the same position. COMELEC’s 2026 implementing rules apply the transition rule to incumbents already serving a third consecutive term.',
    href: electionCivicSources.termRules,
    sourceLabel: 'COMELEC Resolution No. 11207',
  },
  {
    title: 'SK transition',
    body:
      'COMELEC’s implementing rules state that incumbent SK officials elected in 2023 may seek the same position in the November 2026 BSKE if they otherwise meet the qualifications and are not disqualified.',
    href: electionCivicSources.termRules,
    sourceLabel: 'COMELEC Resolution No. 11207',
  },
  {
    title: 'Candidate filing',
    body:
      'COMELEC Resolution No. 11196 contains the certificate-of-candidacy filing rules for the November 2026 BSKE.',
    href: electionCivicSources.filingRules,
    sourceLabel: 'COMELEC Resolution No. 11196',
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
  if (key < '2026-09-28') {
    return {
      label: 'Pre-filing',
      detail: 'Certificate-of-candidacy filing opens September 28, 2026.',
    };
  }
  if (key <= '2026-10-05') {
    return {
      label: 'COC filing period',
      detail: 'Certificate-of-candidacy filing runs through October 5, 2026.',
    };
  }
  if (key < '2026-10-22') {
    return {
      label: 'Post-filing / candidate verification',
      detail:
        'Use COMELEC’s official releases for candidate status before treating a filing as a final certified candidate list.',
    };
  }
  if (key <= '2026-10-31') {
    return {
      label: 'Campaign period',
      detail: 'The official campaign period runs through October 31, 2026.',
    };
  }
  if (key === '2026-11-01') {
    return {
      label: 'Election eve',
      detail: 'Election day is November 2, 2026.',
    };
  }
  if (key === '2026-11-02') {
    return {
      label: 'Election day',
      detail: 'Verify polling information and official election updates through COMELEC.',
    };
  }
  if (key < '2026-12-01') {
    return {
      label: 'Post-election',
      detail:
        'Treat canvass and proclamation records from COMELEC as controlling for final election outcomes.',
    };
  }
  return {
    label: 'New term period',
    detail:
      'Republic Act No. 12232 provides for the new term to begin on December 1 following the election.',
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
    label: 'COMELEC 2026 BSKE calendar',
    href: electionCivicSources.bskeCalendar,
    kind: 'Official election calendar',
  },
  {
    label: 'Republic Act No. 12232',
    href: electionCivicSources.termLaw,
    kind: 'Controlling statute',
  },
  {
    label: 'COMELEC Resolution No. 11207',
    href: electionCivicSources.termRules,
    kind: 'Official implementing rules',
  },
] as const;
