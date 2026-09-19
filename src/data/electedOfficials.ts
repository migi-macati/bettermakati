export interface ElectedOfficial {
  slug: string;
  name: string;
  displayName: string;
  office: string;
  district?: string;
  level: 'city' | 'congress';
  partyOn2025Ballot: string;
  electionYear: 2025;
  resultSourceUrl: string;
  resultSourceLabel: string;
  officialSourceUrl: string;
  officialSourceLabel: string;
}

const comelecCandidateList =
  'https://www.comelec.gov.ph/php-tpls-attachments/2025NLE/COC_2025NLE/CLC2025_NCR/CITY_OF_MAKATI.pdf';
const completeLocalResults =
  'https://ph.rappler.com/elections/2025/local-race/ncr-makati-city';

const commonSources = {
  resultSourceUrl: completeLocalResults,
  resultSourceLabel:
    'COMELEC Media Server results via Rappler · 100% precincts reporting',
  officialSourceUrl: comelecCandidateList,
  officialSourceLabel: 'COMELEC 2025 certified list of candidates',
};

export const electedOfficials: ElectedOfficial[] = [
  {
    slug: 'nancy-binay',
    name: 'Maria Lourdes Nancy S. Binay',
    displayName: 'Nancy Binay',
    office: 'City Mayor',
    level: 'city',
    partyOn2025Ballot: 'United Nationalist Alliance',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'romulo-kid-pena-jr',
    name: 'Romulo “Kid” V. Peña Jr.',
    displayName: 'Kid Peña',
    office: 'City Vice Mayor',
    level: 'city',
    partyOn2025Ballot: 'Nationalist People’s Coalition',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'monique-lagdameo',
    name: 'Monique Yazmin Maria Q. Lagdameo',
    displayName: 'Monique Lagdameo',
    office: 'Member, House of Representatives',
    district: 'Makati 1st Legislative District',
    level: 'congress',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'dennis-alden-almario',
    name: 'Dennis “Alden” B. Almario',
    displayName: 'Alden Almario',
    office: 'Member, House of Representatives',
    district: 'Makati 2nd Legislative District',
    level: 'congress',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },

  {
    slug: 'virgilio-virjhong-hilario-sr',
    name: 'Virgilio “VirJhong” V. Hilario Sr.',
    displayName: 'VirJhong Hilario Sr.',
    office: 'City Councilor',
    district: '1st District',
    level: 'city',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'anna-alcina-yabut',
    name: 'Anna Alcina “Alcine” M. Yabut',
    displayName: 'Alcine Yabut',
    office: 'City Councilor',
    district: '1st District',
    level: 'city',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'martin-john-pio-arenas',
    name: 'Martin John Pio Q. Arenas',
    displayName: 'Martin Arenas',
    office: 'City Councilor',
    district: '1st District',
    level: 'city',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'marie-alethea-casal-uy',
    name: 'Marie Alethea “Mayeth” S. Casal-Uy',
    displayName: 'Mayeth Casal-Uy',
    office: 'City Councilor',
    district: '1st District',
    level: 'city',
    partyOn2025Ballot: 'United Nationalist Alliance',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'ma-arlene-ortega',
    name: 'Ma. Arlene M. Ortega',
    displayName: 'Arlene Ortega',
    office: 'City Councilor',
    district: '1st District',
    level: 'city',
    partyOn2025Ballot: 'United Nationalist Alliance',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'ferdinand-eusebio',
    name: 'Ferdinand Jacinto “Ferdie Tangol” T. Eusebio',
    displayName: 'Ferdie Eusebio',
    office: 'City Councilor',
    district: '1st District',
    level: 'city',
    partyOn2025Ballot: 'United Nationalist Alliance',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'armando-idol-padilla',
    name: 'Armando “Idol” P. Padilla',
    displayName: 'Armando Padilla',
    office: 'City Councilor',
    district: '1st District',
    level: 'city',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'fernando-felix-dino-imperial',
    name: 'Fernando Felix “Dino” L. Imperial',
    displayName: 'Dino Imperial',
    office: 'City Councilor',
    district: '1st District',
    level: 'city',
    partyOn2025Ballot: 'United Nationalist Alliance',
    electionYear: 2025,
    ...commonSources,
  },

  {
    slug: 'kristina-ina-sarosa',
    name: 'Kristina “Ina” T. Sarosa',
    displayName: 'Ina Sarosa',
    office: 'City Councilor',
    district: '2nd District',
    level: 'city',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'maria-dolores-doris-arayon',
    name: 'Maria Dolores “Doc Doris” M. Arayon',
    displayName: 'Doris Arayon',
    office: 'City Councilor',
    district: '2nd District',
    level: 'city',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'heinrich-thaddeus-hein-angeles',
    name: 'Heinrich Thaddeus “Hein” M. Angeles',
    displayName: 'Hein Angeles',
    office: 'City Councilor',
    district: '2nd District',
    level: 'city',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'bernadette-badet-sese',
    name: 'Bernadette “Badet” T. Sese',
    displayName: 'Badet Sese',
    office: 'City Councilor',
    district: '2nd District',
    level: 'city',
    partyOn2025Ballot: 'United Nationalist Alliance',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'joel-bong-ariones',
    name: 'Joel “Bong” M. Ariones',
    displayName: 'Bong Ariones',
    office: 'City Councilor',
    district: '2nd District',
    level: 'city',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'levy-ramboyong',
    name: 'Levy “Teacher Levy” E. Ramboyong',
    displayName: 'Levy Ramboyong',
    office: 'City Councilor',
    district: '2nd District',
    level: 'city',
    partyOn2025Ballot: 'United Nationalist Alliance',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'nemesio-king-yabut-jr',
    name: 'Nemesio “King” S. Yabut Jr.',
    displayName: 'King Yabut Jr.',
    office: 'City Councilor',
    district: '2nd District',
    level: 'city',
    partyOn2025Ballot: 'United Nationalist Alliance',
    electionYear: 2025,
    ...commonSources,
  },
  {
    slug: 'maribel-bel-vitales',
    name: 'Maribel “Bel” F. Vitales',
    displayName: 'Bel Vitales',
    office: 'City Councilor',
    district: '2nd District',
    level: 'city',
    partyOn2025Ballot: 'Makatizens United Party',
    electionYear: 2025,
    ...commonSources,
  },
];

export const cityExecutiveOfficials = electedOfficials.filter(
  official => official.office === 'City Mayor' || official.office === 'City Vice Mayor'
);

export const congressionalOfficials = electedOfficials.filter(
  official => official.level === 'congress'
);

export const councilOfficials = electedOfficials.filter(
  official => official.office === 'City Councilor'
);

export const findOfficial = (slug?: string) =>
  electedOfficials.find(official => official.slug === slug);
