export const openHalalanMakati2022Mayor = {
  dataset: 'OpenHalalan: Philippine National and Local Election Dataset',
  catalogUrl: 'https://data.bettergov.ph/datasets/25',
  upstreamRepository: 'https://github.com/RobertRLeung/OpenHalalan',
  upstreamCommit: 'aafa5d22b9324b37bfd06d1d4be271e00531024a',
  rawMakatiSource:
    'https://github.com/RobertRLeung/OpenHalalan/blob/aafa5d22b9324b37bfd06d1d4be271e00531024a/data/raw_data/2022/NATIONAL_CAPITAL_REGION/NCR_-_FOURTH_DISTRICT/NATIONAL_CAPITAL_REGION_NCR_-_FOURTH_DISTRICT_CITY_OF_MAKATI.csv',
  underlyingAuthority: 'Commission on Elections (COMELEC)',
  underlyingSource: 'https://2022electionresults.comelec.gov.ph/',
  license: 'ODbL v1.0',
  verifiedAt: '2026-09-25',
  geography: 'CITY OF MAKATI',
  office: 'MAYOR',
  candidates: [
    {
      name: 'Abby Binay',
      reportedName: 'BINAY, ABBY (MKTZNU)',
      party: 'Makatizens United Party',
      reportedParty: 'MKTZNU',
      votes: 338819,
      reportedPercentage: 95.31,
    },
    {
      name: 'Joel Hernandez',
      reportedName: 'HERNANDEZ, JOEL (IND)',
      party: 'Independent',
      reportedParty: 'IND',
      votes: 16640,
      reportedPercentage: 4.68,
    },
  ],
} as const;
