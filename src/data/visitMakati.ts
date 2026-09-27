export interface VisitorPlace {
  name: string;
  category:
    | 'Culture'
    | 'Food & Markets'
    | 'Parks'
    | 'Shopping & Lifestyle'
    | 'District';
  summary: string;
  mapsQuery: string;
  placeId?: string;
  sourceUrl: string;
  sourceLabel: string;
}

export interface HeritageSite {
  placeId: string;
  category: 'Historic marker' | 'Historic landscape' | 'Museum & culture';
  period: string;
  context: string;
}

export const visitorPlaces: VisitorPlace[] = [
  {
    name: 'Ayala Museum',
    category: 'Culture',
    summary: 'Philippine history, art and archaeology in the Ayala Center.',
    mapsQuery: 'Ayala Museum Makati',
    placeId: 'ayala-museum',
    sourceUrl:
      'https://www.tourism.gov.ph/destination/national-capital-region/makati/',
    sourceLabel: 'Department of Tourism',
  },
  {
    name: 'Salcedo Saturday Market',
    category: 'Food & Markets',
    summary: 'Weekend food, produce, specialty goods and local makers.',
    mapsQuery: 'Salcedo Saturday Market Makati',
    sourceUrl:
      'https://www.tourism.gov.ph/destination/national-capital-region/makati/',
    sourceLabel: 'Department of Tourism',
  },
  {
    name: 'Legazpi Sunday Market',
    category: 'Food & Markets',
    summary: 'Sunday market for food, produce and artisanal goods.',
    mapsQuery: 'Legazpi Sunday Market Makati',
    sourceUrl:
      'https://www.tourism.gov.ph/destination/national-capital-region/makati/',
    sourceLabel: 'Department of Tourism',
  },
  {
    name: 'Poblacion',
    category: 'District',
    summary: 'Dining, cafés, nightlife and the historic core of old Makati.',
    mapsQuery: 'Poblacion Makati restaurants',
    sourceUrl:
      'https://www.tourism.gov.ph/destination/national-capital-region/makati/',
    sourceLabel: 'Department of Tourism',
  },
  {
    name: 'Ayala Triangle Gardens',
    category: 'Parks',
    summary: 'Urban park and walking space in the central business district.',
    mapsQuery: 'Ayala Triangle Gardens Makati',
    placeId: 'ayala-triangle-gardens',
    sourceUrl:
      'https://www.tourism.gov.ph/destination/national-capital-region/makati/',
    sourceLabel: 'Department of Tourism',
  },
  {
    name: 'Greenbelt',
    category: 'Shopping & Lifestyle',
    summary: 'Shopping, dining, landscaped spaces and cultural destinations.',
    mapsQuery: 'Greenbelt Makati',
    sourceUrl:
      'https://www.tourism.gov.ph/destination/national-capital-region/makati/',
    sourceLabel: 'Department of Tourism',
  },
];

export const heritageSites: HeritageSite[] = [
  {
    placeId: 'nuestra-senora-de-gracia-church',
    category: 'Historic marker',
    period: '1601–1629',
    context:
      'An early Augustinian religious complex on Guadalupe’s high ground, with the NHCP marker and surviving institutional records documenting its long history.',
  },
  {
    placeId: 'sts-peter-and-paul-parish-church',
    category: 'Historic marker',
    period: '1607 foundation · later rebuilding',
    context:
      'The historic parish church of San Pedro Macati. Its history includes multiple construction and rebuilding phases, so BetterMakati keeps foundation, later fabric and the surviving church distinct.',
  },
  {
    placeId: 'nielson-tower',
    category: 'Historic marker',
    period: '1937',
    context:
      'The surviving terminal and control building of Nielson Airport, later reused after the airfield closed and Makati’s business district grew around it.',
  },
  {
    placeId: 'dambana-ng-banal-na-krus',
    category: 'Historic marker',
    period: '1882 chapel tradition',
    context:
      'The Holy Cross shrine and parish church in Tejeros, recognized by an NHCP historical marker.',
  },
  {
    placeId: 'museo-ng-makati',
    category: 'Museum & culture',
    period: '1918 Presidencia',
    context:
      'Makati’s city museum occupies the Old Presidencia of San Pedro Macati, a registered Important Cultural Property.',
  },
  {
    placeId: 'ayala-museum',
    category: 'Museum & culture',
    period: 'Contemporary museum',
    context:
      'A museum of Philippine history, art, archaeology and culture, and the present home of the Filipinas Heritage Library.',
  },
  {
    placeId: 'plaza-cristo-rey',
    category: 'Historic landscape',
    period: 'Historic Poblacion landscape',
    context:
      'A public heritage plaza beside Sts. Peter and Paul Parish Church, included in Makati’s cultural planning record as part of the historic Poblacion setting.',
  },
];
