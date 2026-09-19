import { barangays } from './barangays';

export const election2025Sources = {
  officialResults: 'https://2025electionresults.comelec.gov.ph/',
  localResults:
    'https://ph.rappler.com/elections/2025/local-race/ncr-makati-city',
  candidateList:
    'https://www.comelec.gov.ph/php-tpls-attachments/2025NLE/COC_2025NLE/CLC2025_NCR/CITY_OF_MAKATI.pdf',
  population:
    'https://psa.gov.ph/classification/psgc/barangays/1380300000',
};

const population2024 = {
  city: barangays.reduce((sum, barangay) => sum + barangay.population2024, 0),
  district1: barangays
    .filter(barangay => barangay.legislativeDistrict === '1st District')
    .reduce((sum, barangay) => sum + barangay.population2024, 0),
  district2: barangays
    .filter(barangay => barangay.legislativeDistrict === '2nd District')
    .reduce((sum, barangay) => sum + barangay.population2024, 0),
};

export const election2025Electorate = {
  city: {
    label: 'Makati City',
    registeredVoters: 270240,
    ballotsCast: 210052,
    turnout: 77.73,
    population2024: population2024.city,
  },
  district1: {
    label: 'Makati 1st District',
    registeredVoters: 216152,
    ballotsCast: 170882,
    turnout: 79.06,
    population2024: population2024.district1,
  },
  district2: {
    label: 'Makati 2nd District',
    registeredVoters: 54088,
    ballotsCast: 39170,
    turnout: 72.42,
    population2024: population2024.district2,
  },
} as const;

type JurisdictionKey = keyof typeof election2025Electorate;

export interface CandidateResult {
  name: string;
  party: string;
  votes: number;
  elected?: boolean;
}

export interface SingleSeatRace {
  key: string;
  label: string;
  jurisdiction: JurisdictionKey;
  validVotes: number;
  candidates: CandidateResult[];
}

export const election2025SingleSeatRaces: SingleSeatRace[] = [
  {
    key: 'mayor',
    label: 'Mayor',
    jurisdiction: 'city',
    validVotes: 204086,
    candidates: [
      { name: 'Nancy Binay', party: 'UNA', votes: 114898, elected: true },
      { name: 'Luis Campos Jr.', party: 'NPC', votes: 85664 },
      { name: 'Victor Neri', party: 'Independent', votes: 2172 },
      { name: 'Orlando Stephen Solidum', party: 'Independent', votes: 1352 },
    ],
  },
  {
    key: 'vice-mayor',
    label: 'Vice Mayor',
    jurisdiction: 'city',
    validVotes: 201061,
    candidates: [
      { name: 'Kid Peña', party: 'NPC', votes: 146771, elected: true },
      { name: 'Monsour del Rosario', party: 'UNA', votes: 54290 },
    ],
  },
  {
    key: 'representative-1',
    label: 'Representative · 1st District',
    jurisdiction: 'district1',
    validVotes: 145137,
    candidates: [
      {
        name: 'Monique Lagdameo',
        party: 'Makatizens United Party',
        votes: 130355,
        elected: true,
      },
      { name: 'Angelo Base', party: 'Independent', votes: 8324 },
      { name: 'Minnie Antonio', party: 'Independent', votes: 6458 },
    ],
  },
  {
    key: 'representative-2',
    label: 'Representative · 2nd District',
    jurisdiction: 'district2',
    validVotes: 35935,
    candidates: [
      {
        name: 'Alden Almario',
        party: 'Makatizens United Party',
        votes: 19834,
        elected: true,
      },
      { name: 'Vincent Sese', party: 'UNA', votes: 16101 },
    ],
  },
];

interface CouncilWinnerInput {
  officialSlug: string;
  name: string;
  party: string;
  votes: number;
  rank: number;
  jurisdiction: 'district1' | 'district2';
}

const councilWinnerInputs: CouncilWinnerInput[] = [
  {
    officialSlug: 'virgilio-virjhong-hilario-sr',
    name: 'Virjhong Hilario Sr.',
    party: 'Makatizens United Party',
    votes: 96429,
    rank: 1,
    jurisdiction: 'district1',
  },
  {
    officialSlug: 'anna-alcina-yabut',
    name: 'Alcine Yabut',
    party: 'Makatizens United Party',
    votes: 85688,
    rank: 2,
    jurisdiction: 'district1',
  },
  {
    officialSlug: 'martin-john-pio-arenas',
    name: 'Martin Arenas',
    party: 'Makatizens United Party',
    votes: 73694,
    rank: 3,
    jurisdiction: 'district1',
  },
  {
    officialSlug: 'marie-alethea-casal-uy',
    name: 'Mayeth Casal-Uy',
    party: 'United Nationalist Alliance',
    votes: 71820,
    rank: 4,
    jurisdiction: 'district1',
  },
  {
    officialSlug: 'ma-arlene-ortega',
    name: 'Arlene Ortega',
    party: 'United Nationalist Alliance',
    votes: 68815,
    rank: 5,
    jurisdiction: 'district1',
  },
  {
    officialSlug: 'ferdinand-eusebio',
    name: 'Ferdie Eusebio',
    party: 'United Nationalist Alliance',
    votes: 66729,
    rank: 6,
    jurisdiction: 'district1',
  },
  {
    officialSlug: 'armando-idol-padilla',
    name: 'Armando Padilla',
    party: 'Makatizens United Party',
    votes: 64531,
    rank: 7,
    jurisdiction: 'district1',
  },
  {
    officialSlug: 'fernando-felix-dino-imperial',
    name: 'Dino Imperial',
    party: 'United Nationalist Alliance',
    votes: 64326,
    rank: 8,
    jurisdiction: 'district1',
  },
  {
    officialSlug: 'kristina-ina-sarosa',
    name: 'Ina Sarosa',
    party: 'Makatizens United Party',
    votes: 21787,
    rank: 1,
    jurisdiction: 'district2',
  },
  {
    officialSlug: 'maria-dolores-doris-arayon',
    name: 'Doris Arayon',
    party: 'Makatizens United Party',
    votes: 19632,
    rank: 2,
    jurisdiction: 'district2',
  },
  {
    officialSlug: 'heinrich-thaddeus-hein-angeles',
    name: 'Hein Angeles',
    party: 'Makatizens United Party',
    votes: 18367,
    rank: 3,
    jurisdiction: 'district2',
  },
  {
    officialSlug: 'bernadette-badet-sese',
    name: 'Badet Sese',
    party: 'United Nationalist Alliance',
    votes: 18295,
    rank: 4,
    jurisdiction: 'district2',
  },
  {
    officialSlug: 'joel-bong-ariones',
    name: 'Bong Ariones',
    party: 'Makatizens United Party',
    votes: 17386,
    rank: 5,
    jurisdiction: 'district2',
  },
  {
    officialSlug: 'levy-ramboyong',
    name: 'Levy Ramboyong',
    party: 'United Nationalist Alliance',
    votes: 17123,
    rank: 6,
    jurisdiction: 'district2',
  },
  {
    officialSlug: 'nemesio-king-yabut-jr',
    name: 'King Yabut Jr.',
    party: 'United Nationalist Alliance',
    votes: 16619,
    rank: 7,
    jurisdiction: 'district2',
  },
  {
    officialSlug: 'maribel-bel-vitales',
    name: 'Bel Vitales',
    party: 'Makatizens United Party',
    votes: 15874,
    rank: 8,
    jurisdiction: 'district2',
  },
];

export const percent = (numerator: number, denominator: number) =>
  denominator === 0 ? 0 : (numerator / denominator) * 100;

export const election2025CouncilWinners = councilWinnerInputs.map(item => {
  const electorate = election2025Electorate[item.jurisdiction];
  return {
    ...item,
    voterShare: percent(item.votes, electorate.ballotsCast),
    populationShare: percent(item.votes, electorate.population2024),
  };
});

const singleSeatOfficialMap = [
  {
    officialSlug: 'nancy-binay',
    raceKey: 'mayor',
  },
  {
    officialSlug: 'romulo-kid-pena-jr',
    raceKey: 'vice-mayor',
  },
  {
    officialSlug: 'monique-lagdameo',
    raceKey: 'representative-1',
  },
  {
    officialSlug: 'dennis-alden-almario',
    raceKey: 'representative-2',
  },
] as const;

export interface OfficialElectionResult {
  officialSlug: string;
  raceLabel: string;
  jurisdictionLabel: string;
  votes: number;
  rank: number;
  seatsAvailable: number;
  validVoteShare?: number;
  voterShare: number;
  populationShare: number;
  registeredVoters: number;
  ballotsCast: number;
  turnout: number;
  population2024: number;
}

const singleSeatOfficialResults: OfficialElectionResult[] =
  singleSeatOfficialMap.map(item => {
    const race = election2025SingleSeatRaces.find(
      candidateRace => candidateRace.key === item.raceKey
    )!;
    const winner = race.candidates.find(candidate => candidate.elected)!;
    const electorate = election2025Electorate[race.jurisdiction];

    return {
      officialSlug: item.officialSlug,
      raceLabel: race.label,
      jurisdictionLabel: electorate.label,
      votes: winner.votes,
      rank: 1,
      seatsAvailable: 1,
      validVoteShare: percent(winner.votes, race.validVotes),
      voterShare: percent(winner.votes, electorate.ballotsCast),
      populationShare: percent(winner.votes, electorate.population2024),
      registeredVoters: electorate.registeredVoters,
      ballotsCast: electorate.ballotsCast,
      turnout: electorate.turnout,
      population2024: electorate.population2024,
    };
  });

const councilOfficialResults: OfficialElectionResult[] =
  election2025CouncilWinners.map(item => {
    const electorate = election2025Electorate[item.jurisdiction];
    return {
      officialSlug: item.officialSlug,
      raceLabel:
        item.jurisdiction === 'district1'
          ? 'City Councilor · 1st District'
          : 'City Councilor · 2nd District',
      jurisdictionLabel: electorate.label,
      votes: item.votes,
      rank: item.rank,
      seatsAvailable: 8,
      voterShare: item.voterShare,
      populationShare: item.populationShare,
      registeredVoters: electorate.registeredVoters,
      ballotsCast: electorate.ballotsCast,
      turnout: electorate.turnout,
      population2024: electorate.population2024,
    };
  });

export const election2025OfficialResults: OfficialElectionResult[] = [
  ...singleSeatOfficialResults,
  ...councilOfficialResults,
];

export const findElection2025OfficialResult = (officialSlug?: string) =>
  election2025OfficialResults.find(result => result.officialSlug === officialSlug);
