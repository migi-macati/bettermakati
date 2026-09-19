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
  sourceUrl: string;
  sourceLabel: string;
}

export interface HeritageSite {
  name: string;
  category: 'Historic marker' | 'Museum & culture';
  address: string;
  period: string;
  summary: string;
  mapsQuery: string;
  sourceUrl: string;
  sourceLabel: string;
}

export const visitorPlaces: VisitorPlace[] = [
  {
    name: 'Ayala Museum',
    category: 'Culture',
    summary: 'Philippine history, art and archaeology in the Ayala Center.',
    mapsQuery: 'Ayala Museum Makati',
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
    name: 'Nuestra Señora de Gracia Church',
    category: 'Historic marker',
    address: '7440 Bernardino Street, Guadalupe Viejo, Makati',
    period: '1601–1629',
    summary:
      'Augustinian church and monastery with foundations laid in 1601 and construction completed in 1629.',
    mapsQuery: 'Nuestra Señora de Gracia Church Makati',
    sourceUrl:
      'https://philhistoricsites.nhcp.gov.ph/registry_database/church-and-monastery-of-guadalupe/',
    sourceLabel: 'NHCP',
  },
  {
    name: 'Sts. Peter and Paul Parish Church',
    category: 'Historic marker',
    address: '5539 D.M. Rivera Street, Poblacion, Makati',
    period: '1600s',
    summary:
      'Historic San Pedro Macati church associated with the old town of San Pedro Macati.',
    mapsQuery: 'Saints Peter and Paul Parish Church Makati',
    sourceUrl:
      'https://philhistoricsites.nhcp.gov.ph/registry_database/san-pedro-macati/',
    sourceLabel: 'NHCP',
  },
  {
    name: 'Nielson Tower',
    category: 'Historic marker',
    address: 'Ayala Triangle, Makati Avenue, Makati',
    period: '1937',
    summary:
      'Former passenger station and control center of Nielson Airport, used from 1937 to 1947.',
    mapsQuery: 'Nielson Tower Ayala Triangle Makati',
    sourceUrl:
      'https://philhistoricsites.nhcp.gov.ph/registry_database/nielson-tower/',
    sourceLabel: 'NHCP',
  },
  {
    name: 'Dambana ng Banal na Krus',
    category: 'Historic marker',
    address: '211 J.P. Rizal Avenue, Tejeros, Makati',
    period: '1882',
    summary: 'Historic Holy Cross shrine whose earlier chapel dates to 1882.',
    mapsQuery: 'Holy Cross Parish Church Tejeros Makati',
    sourceUrl:
      'https://philhistoricsites.nhcp.gov.ph/registry_database/dambana-ng-banal-na-krus/',
    sourceLabel: 'NHCP',
  },
  {
    name: 'Museo ng Makati',
    category: 'Museum & culture',
    address: '986 J.P. Rizal corner A. Mabini Streets, Poblacion, Makati',
    period: '1918',
    summary:
      'Makati cultural institution housed in a heritage structure in Poblacion.',
    mapsQuery: 'Museo ng Makati',
    sourceUrl:
      'https://www.makati.gov.ph/assets/uploads/downloads/2/45/561/pdf/Facts%20and%20FIgures%202020.pdf',
    sourceLabel: 'City of Makati',
  },
  {
    name: 'Ayala Museum',
    category: 'Museum & culture',
    address: 'Makati Avenue corner Dela Rosa Street, Ayala Center, Makati',
    period: 'Contemporary museum',
    summary: 'Museum of Philippine history, art, archaeology and culture.',
    mapsQuery: 'Ayala Museum Makati',
    sourceUrl:
      'https://www.tourism.gov.ph/destination/national-capital-region/makati/',
    sourceLabel: 'Department of Tourism',
  },
];
