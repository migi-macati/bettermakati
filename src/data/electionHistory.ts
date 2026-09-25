import { openHalalanMakati2022Mayor } from './openHalalanMakati';

export type ElectionSourceQuality =
  | 'official'
  | 'comelec-media'
  | 'academic'
  | 'mixed'
  | 'open-data'
  | 'archival-secondary';

export interface HistoricalCandidateResult {
  name: string;
  party: string;
  votes: number;
}

export interface HistoricalMayoralRace {
  year: number;
  electionDate: string;
  candidates: HistoricalCandidateResult[];
  winner: string;
  sourceUrl: string;
  sourceLabel: string;
  sourceQuality: ElectionSourceQuality;
  geographyNote?: string;
}

export const makatiMayoralHistory: HistoricalMayoralRace[] = [
  {
    year: 2025,
    electionDate: '2025-05-12',
    winner: 'Nancy Binay',
    candidates: [
      { name: 'Nancy Binay', party: 'UNA', votes: 114898 },
      { name: 'Luis Campos Jr.', party: 'NPC', votes: 85664 },
      { name: 'Victor Neri', party: 'Independent', votes: 2172 },
      { name: 'Orlando Stephen Solidum', party: 'Independent', votes: 1352 },
    ],
    sourceUrl: 'https://ph.rappler.com/elections/2025/local-race/ncr-makati-city',
    sourceLabel: 'COMELEC Media Server results as published by Rappler',
    sourceQuality: 'comelec-media',
    geographyNote:
      'First regular city election after the 10 Embo barangays were no longer included in Makati. Direct vote-total comparisons with earlier elections therefore use a different electorate and geography.',
  },
  {
    year: 2022,
    electionDate: '2022-05-09',
    winner: 'Abby Binay',
    candidates: openHalalanMakati2022Mayor.candidates.map(candidate => ({
      name: candidate.name,
      party: candidate.party,
      votes: candidate.votes,
    })),
    sourceUrl: openHalalanMakati2022Mayor.catalogUrl,
    sourceLabel:
      'OpenHalalan via BetterGov Open Data; underlying Makati tally from COMELEC 2022 results',
    sourceQuality: 'open-data',
    geographyNote:
      'This election still included the Embo barangays then voting as part of Makati.',
  },
  {
    year: 2019,
    electionDate: '2019-05-13',
    winner: 'Abby Binay',
    candidates: [
      { name: 'Abby Binay', party: 'UNA', votes: 179522 },
      { name: 'Junjun Binay', party: 'UNA ang Makati', votes: 98653 },
      { name: 'Ricardo Yabut', party: 'Bigkis Pinoy', votes: 23721 },
      { name: 'Renato Bondal', party: 'Independent', votes: 3565 },
      { name: 'Wilfredo Talag', party: 'Independent', votes: 1541 },
      { name: 'Carmelle Ainne Alanzalon', party: 'Independent', votes: 1101 },
    ],
    sourceUrl:
      'https://www.comelec.gov.ph/php-tpls-attachments/2019NLE/ElectionResults/2019NLE_LIst_of_Elected_CityMun_Candidates.pdf',
    sourceLabel: 'COMELEC elected-candidate list; complete candidate totals cross-checked against archival result tables',
    sourceQuality: 'mixed',
  },
  {
    year: 2016,
    electionDate: '2016-05-09',
    winner: 'Abby Binay',
    candidates: [
      { name: 'Abby Binay', party: 'UNA', votes: 160320 },
      { name: 'Kid Peña', party: 'Liberal', votes: 142257 },
      { name: 'Jimmy Jumawan', party: 'Bigkis Pinoy', votes: 1823 },
    ],
    sourceUrl: 'https://en.wikipedia.org/wiki/2016_Makati_local_elections',
    sourceLabel: '2016 Makati local-election archival result table',
    sourceQuality: 'archival-secondary',
  },
  {
    year: 2013,
    electionDate: '2013-05-13',
    winner: 'Junjun Binay',
    candidates: [
      { name: 'Junjun Binay', party: 'UNA', votes: 208748 },
      { name: 'Rene Bondal', party: 'Independent', votes: 25791 },
    ],
    sourceUrl:
      'https://elections.cids.up.edu.ph/electiondata?city=MAKATI+CITY&year=2013',
    sourceLabel: 'UP CIDS Philippine Local Government Interactive Dataset',
    sourceQuality: 'academic',
  },
  {
    year: 2010,
    electionDate: '2010-05-10',
    winner: 'Junjun Binay',
    candidates: [
      { name: 'Junjun Binay', party: 'PDP–Laban', votes: 125664 },
      { name: 'Ernesto Mercado', party: 'Nacionalista', votes: 80151 },
      { name: 'Erwin Genuino', party: 'Bigkis Pinoy', votes: 61203 },
      { name: 'Butz Aquino', party: 'Independent', votes: 5816 },
      { name: 'Eddie Tagalog', party: 'Independent', votes: 253 },
    ],
    sourceUrl:
      'https://elections.cids.up.edu.ph/electiondata?city=MAKATI+CITY&year=2010',
    sourceLabel: 'UP CIDS Philippine Local Government Interactive Dataset',
    sourceQuality: 'academic',
  },
  {
    year: 2007,
    electionDate: '2007-05-14',
    winner: 'Jejomar Binay',
    candidates: [
      { name: 'Jejomar Binay', party: 'PDP–Laban', votes: 198814 },
      { name: 'Lito Lapid', party: 'Lakas', votes: 22461 },
      { name: 'Elias Dulalia', party: 'Independent', votes: 1243 },
    ],
    sourceUrl:
      'https://www.comelec.gov.ph/php-tpls-attachments/ListElectedCandidates/2007_list_of_elected_city_municipal_candidates.pdf',
    sourceLabel: 'COMELEC 2007 List of Elected City/Municipal Candidates; archival totals cross-checked against published result tables',
    sourceQuality: 'mixed',
  },
  {
    year: 2004,
    electionDate: '2004-05-10',
    winner: 'Jejomar Binay',
    candidates: [
      { name: 'Jejomar Binay', party: 'PDP–Laban', votes: 186655 },
      { name: 'Oscar Ibay', party: 'Lakas', votes: 50518 },
      { name: 'Amado de Vera III', party: 'Independent', votes: 1197 },
      { name: 'Romeo Rempillo', party: 'Independent', votes: 665 },
    ],
    sourceUrl: 'https://en.wikipedia.org/wiki/2004_Makati_local_elections',
    sourceLabel: '2004 Makati local-election archival result table',
    sourceQuality: 'archival-secondary',
  },
  {
    year: 2001,
    electionDate: '2001-05-14',
    winner: 'Jejomar Binay',
    candidates: [
      { name: 'Jejomar Binay', party: 'PDP–Laban', votes: 137030 },
      { name: 'Edu Manzano', party: 'Lakas', votes: 71067 },
      { name: 'Reynaldo Ocampo', party: 'Independent', votes: 942 },
    ],
    sourceUrl: 'https://en.wikipedia.org/wiki/2001_Makati_local_elections',
    sourceLabel: '2001 Makati local-election archival result table',
    sourceQuality: 'archival-secondary',
  },
  {
    year: 1998,
    electionDate: '1998-05-11',
    winner: 'Elenita Binay',
    candidates: [
      { name: 'Elenita Binay', party: 'PDP–Laban', votes: 147865 },
      { name: 'Toro Yabut', party: 'Lakas', votes: 92947 },
      { name: 'Nelson Irasga', party: 'Liberal', votes: 21725 },
      { name: 'Alexander Villalon', party: 'Independent', votes: 591 },
      { name: 'Cesar Alzona', party: 'Reporma', votes: 518 },
    ],
    sourceUrl:
      'https://elections.cids.up.edu.ph/electiondata?city=MAKATI+CITY&year=1998',
    sourceLabel: 'UP CIDS Philippine Local Government Interactive Dataset',
    sourceQuality: 'academic',
  },
];

export const historicalValidVotes = (race: HistoricalMayoralRace) =>
  race.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

export const historicalCandidateShare = (
  candidate: HistoricalCandidateResult,
  race: HistoricalMayoralRace
) => {
  const total = historicalValidVotes(race);
  return total === 0 ? 0 : (candidate.votes / total) * 100;
};

export interface BarangayMayoralResult2025 {
  slug: string;
  barangay: string;
  carriedBy: 'Nancy Binay' | 'Luis Campos Jr.';
  nancyVotes?: number;
  camposVotes?: number;
  exactVotesVerified: boolean;
}

const camposBarangays = new Set([
  'carmona',
  'pinagkaisahan',
  'singkamas',
  'valenzuela',
]);

const currentBarangays = [
  ['bangkal', 'Bangkal'],
  ['bel-air', 'Bel-Air'],
  ['carmona', 'Carmona'],
  ['dasmarinas', 'Dasmariñas'],
  ['forbes-park', 'Forbes Park'],
  ['guadalupe-nuevo', 'Guadalupe Nuevo'],
  ['guadalupe-viejo', 'Guadalupe Viejo'],
  ['kasilawan', 'Kasilawan'],
  ['la-paz', 'La Paz'],
  ['magallanes', 'Magallanes'],
  ['olympia', 'Olympia'],
  ['palanan', 'Palanan'],
  ['pinagkaisahan', 'Pinagkaisahan'],
  ['pio-del-pilar', 'Pio Del Pilar'],
  ['poblacion', 'Poblacion'],
  ['san-antonio', 'San Antonio'],
  ['san-isidro', 'San Isidro'],
  ['san-lorenzo', 'San Lorenzo'],
  ['santa-cruz', 'Santa Cruz'],
  ['singkamas', 'Singkamas'],
  ['tejeros', 'Tejeros'],
  ['urdaneta', 'Urdaneta'],
  ['valenzuela', 'Valenzuela'],
] as const;

export const barangayMayoralResults2025: BarangayMayoralResult2025[] =
  currentBarangays.map(([slug, barangay]) => ({
    slug,
    barangay,
    carriedBy: camposBarangays.has(slug) ? 'Luis Campos Jr.' : 'Nancy Binay',
    exactVotesVerified:
      slug === 'san-lorenzo' || slug === 'guadalupe-nuevo',
    ...(slug === 'san-lorenzo'
      ? { nancyVotes: 3294, camposVotes: 2521 }
      : {}),
    ...(slug === 'guadalupe-nuevo'
      ? { nancyVotes: 10260, camposVotes: 10083 }
      : {}),
  }));

export const barangayResultSource2025 = {
  label: 'Rappler report on 2025 Makati mayoral results by barangay',
  url:
    'https://ph.headtopics.com/news/nancy-binay-vs-luis-campos-here-s-how-each-makati-barangay-69102209',
  note:
    'Published reporting says Nancy Binay carried 19 of the 23 current Makati barangays, while Luis Campos carried Carmona, Pinagkaisahan, Singkamas and Valenzuela. Exact vote totals are displayed only for barangays where the accessible published text exposes them.',
};

export const findBarangayMayoralResult2025 = (slug?: string) =>
  barangayMayoralResults2025.find(result => result.slug === slug);
