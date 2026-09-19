export interface BarangayProfile {
  slug: string;
  name: string;
  population2024: number;
  legislativeDistrict: '1st District' | '2nd District';
  associations?: Array<{
    name: string;
    href: string;
    linkLabel: string;
  }>;
}

export const psaBarangaySource =
  'https://psa.gov.ph/classification/psgc/barangays/1380300000';

export const barangays: BarangayProfile[] = [
  { slug: 'bangkal', name: 'Bangkal', population2024: 18013, legislativeDistrict: '1st District' },
  {
    slug: 'bel-air',
    name: 'Bel-Air',
    population2024: 39354,
    legislativeDistrict: '1st District',
    associations: [
      { name: 'Bel-Air Village Association (BAVA)', href: 'https://www.bava.ph/', linkLabel: 'Website' },
    ],
  },
  { slug: 'carmona', name: 'Carmona', population2024: 3034, legislativeDistrict: '1st District' },
  {
    slug: 'dasmarinas',
    name: 'Dasmariñas',
    population2024: 4320,
    legislativeDistrict: '1st District',
    associations: [
      { name: 'Dasmariñas Village Association (DVA)', href: 'https://dva.org.ph/', linkLabel: 'Website' },
    ],
  },
  {
    slug: 'forbes-park',
    name: 'Forbes Park',
    population2024: 4183,
    legislativeDistrict: '1st District',
    associations: [
      { name: 'Forbes Park Association (FPA)', href: 'https://www.forbesparkassociation.com/', linkLabel: 'Website' },
    ],
  },
  { slug: 'guadalupe-nuevo', name: 'Guadalupe Nuevo', population2024: 21596, legislativeDistrict: '2nd District' },
  { slug: 'guadalupe-viejo', name: 'Guadalupe Viejo', population2024: 13525, legislativeDistrict: '2nd District' },
  { slug: 'kasilawan', name: 'Kasilawan', population2024: 5007, legislativeDistrict: '1st District' },
  { slug: 'la-paz', name: 'La Paz', population2024: 6682, legislativeDistrict: '1st District' },
  {
    slug: 'magallanes',
    name: 'Magallanes',
    population2024: 5473,
    legislativeDistrict: '1st District',
    associations: [
      {
        name: 'Magallanes Village Association (MVA)',
        href: 'https://www.google.com/maps/search/?api=1&query=Magallanes%20Village%20Association%20Makati',
        linkLabel: 'Map',
      },
    ],
  },
  { slug: 'olympia', name: 'Olympia', population2024: 19035, legislativeDistrict: '1st District' },
  { slug: 'palanan', name: 'Palanan', population2024: 11934, legislativeDistrict: '1st District' },
  { slug: 'pinagkaisahan', name: 'Pinagkaisahan', population2024: 5323, legislativeDistrict: '2nd District' },
  { slug: 'pio-del-pilar', name: 'Pio Del Pilar', population2024: 55572, legislativeDistrict: '1st District' },
  { slug: 'poblacion', name: 'Poblacion', population2024: 17088, legislativeDistrict: '1st District' },
  { slug: 'san-antonio', name: 'San Antonio', population2024: 18012, legislativeDistrict: '1st District' },
  { slug: 'san-isidro', name: 'San Isidro', population2024: 6260, legislativeDistrict: '1st District' },
  {
    slug: 'san-lorenzo',
    name: 'San Lorenzo',
    population2024: 14793,
    legislativeDistrict: '1st District',
    associations: [
      { name: 'San Lorenzo Village Association (SLVA)', href: 'https://www.myslv.ph/', linkLabel: 'Website' },
    ],
  },
  { slug: 'santa-cruz', name: 'Santa Cruz', population2024: 6744, legislativeDistrict: '1st District' },
  { slug: 'singkamas', name: 'Singkamas', population2024: 7485, legislativeDistrict: '1st District' },
  { slug: 'tejeros', name: 'Tejeros', population2024: 16019, legislativeDistrict: '1st District' },
  {
    slug: 'urdaneta',
    name: 'Urdaneta',
    population2024: 4720,
    legislativeDistrict: '1st District',
    associations: [
      {
        name: 'Urdaneta Village Association (UVA)',
        href: 'https://www.google.com/maps/search/?api=1&query=Urdaneta%20Village%20Association%20Makati',
        linkLabel: 'Map',
      },
    ],
  },
  { slug: 'valenzuela', name: 'Valenzuela', population2024: 5598, legislativeDistrict: '1st District' },
];

export const findBarangay = (slug?: string) =>
  barangays.find(barangay => barangay.slug === slug);

export const barangayMapsUrl = (name: string) =>
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Barangay ' + name + ', Makati City, Philippines');
