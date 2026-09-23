export interface BarangayFacility {
  name: string;
  type: 'Government' | 'Health' | 'Education' | 'Safety' | 'Community' | 'Park';
  href: string;
  address?: string;
  phone?: string;
  email?: string;
  source?: string;
  sourceLabel?: string;
  note?: string;
}

export interface BarangayProfile {
  slug: string;
  name: string;
  population2024: number;
  legislativeDistrict: '1st District' | '2nd District';
  officialPageUrl?: string;
  facebookUrl?: string;
  hallAddress?: string;
  hallPhone?: string;
  hallEmail?: string;
  hallSource?: string;
  hallSourceLabel?: string;
  officials?: {
    punongBarangay?: string;
    kagawads?: string[];
    skChairperson?: string;
    secretary?: string;
    treasurer?: string;
    term?: string;
    source: string;
    sourceLabel?: string;
    secondarySource?: string;
    lastVerified?: string;
    note?: string;
    statusSource?: string;
    statusSourceLabel?: string;
  };
  heritageMarkers?: Array<{ name: string; agency: 'NHCP' | 'NCCA'; status: string; href: string; location?: string }>;
  notablePlaces?: Array<{ name: string; href: string; type: 'Institution' | 'Establishment' | 'Heritage'; source?: string }>;
  associations?: Array<{ name: string; href: string; linkLabel: string }>;
}

export const psaBarangaySource = 'https://psa.gov.ph/classification/psgc/barangays/1380300000';
export const makatiBarangayDirectory = 'https://www.makati.gov.ph/barangay';
export const commonBarangayServiceIds = [
  'barangay-clearance', 'barangay-business-clearance', 'barangay-indigency',
  'barangay-solo-parent', 'barangay-first-time-jobseeker', 'barangay-residency',
  'barangay-id', 'barangay-mediation',
];
export const makatiCitizenCharterSource = 'https://www.makati-eboss.ph/files/references/Makati%20Citizens%20Charter%202023.pdf';
export const philHealthYakapClinics2026Source = 'https://www.philhealth.gov.ph/partners/providers/facilities/accredited/YAKAP.pdf';
export const makatiBarangayBoundaryMap = 'https://www.makati.gov.ph/content/downloads/3/2521?f=Barangay+Boundary+Map';
export const makatiBarangayClusterMap = 'https://www.makati.gov.ph/content/downloads/3/2522?f=Barangay+Cluster+Map';

const mapsSearch = (query: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);

const yakapHealthCenters: Record<string, BarangayFacility[]> = {
  bangkal: [{
    name: 'Bangkal Health Center',
    type: 'Health',
    href: mapsSearch('1126 Rodriguez Street, Bangkal, Makati City'),
    address: '1126 Rodriguez Street, Bangkal, Makati City',
    phone: '7001-5595',
    email: 'bangkalhealthcenter@gmail.com',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  carmona: [{
    name: 'Carmona Health Center',
    type: 'Health',
    href: mapsSearch('3002 H. Santos Street, Barangay Carmona, Makati City'),
    address: '3002 H. Santos Street, Barangay Carmona, Makati City',
    phone: '0960-246-7297',
    email: 'consultscarmona@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  'guadalupe-nuevo': [{
    name: 'Guadalupe Nuevo Health Center',
    type: 'Health',
    href: mapsSearch('La Consolacion cor. Nuestra Señora, Guadalupe Nuevo, Makati City'),
    address: 'La Consolacion cor. Nuestra Señora, Guadalupe Nuevo, Makati City',
    phone: '7001-9871',
    email: 'consultguadnuevo@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  'guadalupe-viejo': [{
    name: 'Guadalupe Viejo Health Center',
    type: 'Health',
    href: mapsSearch('Camia St. cor. Gumamela St., Guadalupe Viejo, Makati City'),
    address: 'Camia St. cor. Gumamela St., Guadalupe Viejo, Makati City',
    phone: '8672-0032',
    email: 'guadaviejo.mhd1@gmail.com',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  kasilawan: [{
    name: 'Kasilawan Health Center',
    type: 'Health',
    href: mapsSearch('2094 E. Pascua Street, Barangay Kasilawan, Makati City'),
    address: '2094 E. Pascua Street, Barangay Kasilawan, Makati City',
    phone: '7003-233',
    email: 'consultskasilawan@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  'la-paz': [{
    name: 'La Paz Health Center',
    type: 'Health',
    href: mapsSearch('815 Archimedes Street, Barangay La Paz, Makati City'),
    address: '815 Archimedes Street, Barangay La Paz, Makati City',
    phone: '0977-852-6593',
    email: 'consultslapaz@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  olympia: [{
    name: 'Olympia Health Center',
    type: 'Health',
    href: mapsSearch('8674 Fortuna Street, Barangay Olympia, Makati City'),
    address: '8674 Fortuna Street, Barangay Olympia, Makati City',
    email: 'consultsolympia@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  palanan: [{
    name: 'Palanan Health Center',
    type: 'Health',
    href: mapsSearch('4513 Casino Street, Barangay Palanan, Makati City'),
    address: '4513 Casino Street, Barangay Palanan, Makati City',
    phone: '0915-196-9359',
    email: 'ConsultsPalanan@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2027',
  }],
  pinagkaisahan: [{
    name: 'Pinagkaisahan Health Center',
    type: 'Health',
    href: mapsSearch('2886 Danlig cor. Tolentino Street, Barangay Pinagkaisahan, Makati City'),
    address: '2886 Danlig cor. Tolentino Street, Barangay Pinagkaisahan, Makati City',
    phone: '8821-8809 / 881-8128',
    email: 'consultspinagkaisahan@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  'pio-del-pilar': [
    {
      name: 'Pio PC Health Center',
      type: 'Health',
      href: mapsSearch('1st Circle Washington Street, Barangay Pio del Pilar, Makati City'),
      address: '1st Circle Washington Street, Barangay Pio del Pilar, Makati City',
      phone: '8700-12141',
      email: 'bangkalhealthcenter@gmail.com',
      source: philHealthYakapClinics2026Source,
      sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
      note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
    },
    {
      name: 'Pio RHU Health Center',
      type: 'Health',
      href: mapsSearch('1500 Apolinario cor. Arguelles St., Pio del Pilar, Makati City'),
      address: '1500 Apolinario cor. Arguelles St., Pio del Pilar, Makati City',
      email: 'consultspiorhu@makati.gov.ph',
      source: philHealthYakapClinics2026Source,
      sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
      note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
    },
  ],
  poblacion: [{
    name: 'Poblacion Health Center',
    type: 'Health',
    href: mapsSearch('A. Bonifacio Street, Barangay Poblacion, Makati City'),
    address: 'A. Bonifacio Street, Barangay Poblacion, Makati City',
    phone: '0922-657-6349 / 0969-279-9793',
    email: 'ConsultsPoblacion@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  'san-isidro': [{
    name: 'San Isidro Health Center',
    type: 'Health',
    href: mapsSearch('2701 Guatemala St., Barangay San Isidro, Makati City'),
    address: '2701 Guatemala St., Barangay San Isidro, Makati City',
    phone: '8845-0260 / 0949-340-3393',
    email: 'sanisidro.mhd1@gmail.com',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  singkamas: [{
    name: 'Singkamas Health Center',
    type: 'Health',
    href: mapsSearch('3816 F. Nazario Street, Barangay Singkamas, Makati City'),
    address: '3816 F. Nazario Street, Barangay Singkamas, Makati City',
    phone: '2700-20545',
    email: 'consultssingkamas@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  'santa-cruz': [{
    name: 'Sta. Cruz Health Center',
    type: 'Health',
    href: mapsSearch('3942 Yague St., Barangay Sta. Cruz, Makati City'),
    address: '3942 Yague St., Barangay Sta. Cruz, Makati City',
    phone: '0917-544-4191',
    email: 'ConsultsStaCruz@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
  tejeros: [{
    name: 'Tejeros Health Center',
    type: 'Health',
    href: mapsSearch('2903 H. Santos Street, Barangay Tejeros, Makati City'),
    address: '2903 H. Santos Street, Barangay Tejeros, Makati City',
    phone: '0969-179-2519 / 0908-223-4607',
    email: 'consultstejeros@makati.gov.ph',
    source: philHealthYakapClinics2026Source,
    sourceLabel: 'PhilHealth YAKAP list · May 31, 2026',
    note: 'Government YAKAP clinic · accreditation listed through Dec. 31, 2026',
  }],
};

export const barangayFacilities = (slug: string, name: string): BarangayFacility[] => {
  const barangay = barangays.find(item => item.slug === slug);
  const hall: BarangayFacility = {
    name: `${name} Barangay Hall`,
    type: 'Government',
    href: barangayMapsUrl(name),
    address: barangay?.hallAddress,
    phone: barangay?.hallPhone,
    email: barangay?.hallEmail,
    source: barangay?.hallSource || barangay?.officialPageUrl,
    sourceLabel:
      barangay?.hallSourceLabel ||
      (barangay?.hallSource?.includes('makati.gov.ph')
        ? 'Makati barangay page'
        : barangay?.hallSource
          ? 'Verified barangay contact source'
          : 'Makati barangay page'),
  };
  return [hall, ...(yakapHealthCenters[slug] ?? [])];
};

export const barangayProfilesReviewed = '23 September 2026';

const barangayRosterSource = (slug: string) =>
  'https://www.barangaydirectory.com/barangay/city-of-makati/' + slug;

const barangayOfficialData: Record<string, NonNullable<BarangayProfile['officials']>> = {
  'bangkal': {
    punongBarangay: "Virgilio M. Hilario III",
    kagawads: ["Tricia Mae C. Eusebio","Mario V. Montañes II","Roberto S. Aguinaldo","Criselle Mhae Hilario","Richard D. Saquilayan","Mark Jael B. Hildawa","Christian R. Jacinto"],
    skChairperson: "Frances Anne Driz Saquilayan",
    secretary: "Rommel D. Padua",
    treasurer: "Rizalina R. Collada",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/bangkal",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'bel-air': {
    punongBarangay: "Cynthia D. Cervantes",
    kagawads: ["Kevin Tence Dionisio","Joan O. Asuncion","Ma. Bella Retuerto Oposa","Maria Carmen Roa Guerzon","Paolo Romaldo Fuentes Pagulayan","Milagros Sembrano Alora","Roman Gonzales Leus"],
    skChairperson: "Cristina Alexandra Golez Camus",
    secretary: "Pia Redempta Trinidad Manalastas",
    treasurer: "Ma. Patricia Bautista Turcuato",
    term: '2023–2026',
    source: "https://belair.itdcsystems.com/government",
    sourceLabel: "Barangay Bel-Air website",
    secondarySource: "https://www.barangaydirectory.com/barangay/city-of-makati/bel-air",
    lastVerified: barangayProfilesReviewed,
  },
  'carmona': {
    punongBarangay: "Ricardo Perfecto B. Garcia",
    kagawads: ["Percilon N. Ilan","Andre Iñigo D. Chua","Frederick A. Perez","Gilbert D. Cruz","Leberato P. Layug","Peter John P. Santos","Jeffrey L. Sordan"],
    skChairperson: "Mikykllie M. Chua",
    secretary: "Zenaida S. Benito",
    treasurer: "Mario Reyes Ubarre Jr.",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/carmona",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'dasmarinas': {
    punongBarangay: "Wellington James S. Lim",
    kagawads: ["Victoria Regina Ledesma Gonzalez","Joshua Anton Uy Jao","Francis Xavier Santiago Apostol","Alessandro Lorenzo Floro Herbosa","Alessandro Lorenzo Estayo Cruz","Martino Anton Moya Benitez","Vincente Rafael Legaspi Rosales"],
    skChairperson: "Natalia Georgianna M. Tupaz",
    secretary: "Roanne Valerie Lim Dionisio",
    treasurer: "Mariell Leane Delos Santos Chuateco",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/dasmarinas",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
    note: "DILG reported Natalia Georgianna M. Tupaz suspended for six months under a March 23, 2026 city resolution and said she had tendered a resignation on March 8 subject to acceptance. The roster source continues to list her as SK chairperson; BetterMakati has not inferred a later status without a subsequent official record.",
    statusSource: "https://calabarzon.dilg.gov.ph/remulla-to-suspended-makati-sk-chairs-mahiya-naman-kayo/",
    statusSourceLabel: "DILG suspension report · April 27, 2026",
  },
  'forbes-park': {
    punongBarangay: "Evangeline Tankiang Manotok",
    kagawads: ["Ana Maria Vazquez Borromeo","Rosanna Mercedes Ongpin Periquet","Marie Czarina Celestene Perez De Tagle Ledesma","Nicolo Francisco Josemari Tankiang Villonco","Tanya Michelle Shih Go","Carlo Felicito Baldo Bernardino","Miguel Fong Luy"],
    skChairperson: "Ignacio Luis Gabriel Concepcion Santos",
    secretary: "Jose Pio Reyes Luz",
    treasurer: "Margarita Soriano Roque",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/forbes-park",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'guadalupe-nuevo': {
    punongBarangay: "German Ocampo Sunga",
    kagawads: ["Romeo Viray Lobo","Andrew De Leon Aguinaldo","Michael Cornejo De Jesus","Edgardo Restauro Jusi","Angelo Robert Sablad Mones","Rolando Razon Sinang Jr.","Eduardo Ordilla Causapin"],
    skChairperson: "Oona Patricia Sophia Jacob Agtutubo",
    secretary: "Joemarie Robleza Simangan",
    treasurer: "Daniel Nuqui Mandapat",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/guadalupe-nuevo",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'guadalupe-viejo': {
    punongBarangay: "Mikhail Sandino Sagayno Gatchalian",
    kagawads: ["Luis Pagulayan Almario Jr.","Ferdinand Boñag Evangelista","Andrea Blanche Silva Jacome","Shirley Guevarra Borja","Abelardo Urge Brillantes","Crisostomo Borguilla Cunanan","Genaro Silvestre Gutierrez"],
    skChairperson: "Jeayla Marteena Plastina Tavera",
    secretary: "Myrna Francisco Casabon",
    treasurer: "Myla Dela Cruz Gepitan",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/guadalupe-viejo",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'kasilawan': {
    punongBarangay: "Marc Lester G. Gabriel",
    kagawads: ["Rowel S. Agoot","Luisito G. Campos","Jermaine W. Alvarez","Arturo G. Encarnacion","Edwin M. Vittali","Eduardo F. Mercado","Evelyn Reposo Pascual"],
    skChairperson: "Jomel Mitzi Ann D. Gueta",
    secretary: "Melani M. Canlas",
    treasurer: "Mark Anthony C. Tandoc",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/kasilawan",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'la-paz': {
    punongBarangay: "Ferdinand O. Concepcion",
    kagawads: ["Evelyn C. Boyo","Tito Jorge Mergal Riva","Juan Edison N. Tolentino","Loreto C. Mapa Jr.","Maria Rebecca D. Alano","Evangeline D. Cruz","Rochelle Angelica Galisim Ampusta"],
    skChairperson: "Stephanie Kim T. Belonio",
    secretary: "Anabelle Butron Pamular",
    treasurer: "Crislin C. Dacuan",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/la-paz",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'magallanes': {
    punongBarangay: "Jose Mari Aligui Alzona",
    kagawads: ["Noemi Manikan Gomez","Alfonso Julio Amador Padilla","Antonio Lualhati Alcasid","Conrado Gutierrez Paras","Paulo Augustine Baniqued Alunan","Margarita Isabel Lim Marty","Andrea Krizzia Gonzales De Jesus"],
    skChairperson: "Cecilia Louise Pajarillo Yabut",
    secretary: "Jacinto Maria Samala Gonzalez",
    treasurer: "Ma. Cecilia Diaz De Rivera Asuncion",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/magallanes",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
    note: "DILG reported Cecilia Louise P. Yabut suspended for three months under an April 6, 2026 city resolution. The roster source continues to list her as SK chairperson; BetterMakati has not found a later official status record in the current source set.",
    statusSource: "https://calabarzon.dilg.gov.ph/remulla-to-suspended-makati-sk-chairs-mahiya-naman-kayo/",
    statusSourceLabel: "DILG suspension report · April 27, 2026",
  },
  'olympia': {
    punongBarangay: "Reynaldo A. Yulo",
    kagawads: ["Rodrigo L. Binay Jr.","Febie D. Javier","Jonathan O. Alvarez","Segundo H. Gonzalez Jr.","Susana D. Arceta","Maria Guia Marie R. David","Ryan Vasquez Medina"],
    skChairperson: "Nicole Caren V. Paggao",
    secretary: "Vera Narie S. Ferrer",
    treasurer: "Lorelie Aguilar Mamuyac",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/olympia",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'palanan': {
    punongBarangay: "John Benedict C. Corcuera",
    kagawads: ["Emmanuel N. Cayetano","Adelaida S. Arciaga","Justine Mae C. De Ocampo","Rolando C. Mole Jr.","Janica S. Acosta","Michael D. Omampo","Erwin D. Liberato"],
    skChairperson: "John Victor T. Caguioa",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/palanan",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
    note: "Council roster cross-checked against a 2026 public legal-research compilation citing the Makati City website; verify against the city page when it is updated.",
  },
  'pinagkaisahan': {
    punongBarangay: "Shyla Marie Ramos (Acting)",
    kagawads: ["Jasmine M. Magcale","Marie Antonette Francheska C. Da Roza","Fernando V. Creo","Reymond E. Briones","Gerardo H. Loreto","Editha M. Tolentino"],
    skChairperson: "Julianne T. Garcia",
    secretary: "Jun Jun Labrador Abella",
    treasurer: "Leni F. Caramat",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/pinagkaisahan",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
    note: "The Makati barangay page identifies Shyla Marie Ramos as Acting Punong Barangay. The cross-check directory still lists her among the kagawads while the punong-barangay field is being verified.",
  },
  'pio-del-pilar': {
    punongBarangay: "Hazel Ann Sanchez Lacia",
    kagawads: ["Ronnel Martin Ortega","Michelle Yu Acha","Benedict De Leon Gawat","Narcisa Clado Reynaldo","Richard Albin Sanchez Lacia","Cesar Santos Parrucho","Dennis Rodriguez Pancipane"],
    skChairperson: "Janine Nicole S. Quinto",
    secretary: "Ryan John A. Babasol",
    treasurer: "Larry U. Vicente",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/pio-del-pilar",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'poblacion': {
    punongBarangay: "Jose Mikhail Ranillo Villena",
    kagawads: ["Joanna Marie Mapalao Cruz","Jullian Kyle Gonzaga San Mateo","Mark Anthony Tan Gabutin","Alexander Gonzaga Diez","Kirsten Adrienne Pagulayan Reyes","Marcelino Estrella Crisolo","Gio Brylle Joaquin Labares"],
    skChairperson: "Phoebe Marie Pangilinan Jara",
    secretary: "Alicia Arpilleda Velasco",
    treasurer: "Serge Castro Santos",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/poblacion",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'san-antonio': {
    punongBarangay: "Restituto Eronico Cajes",
    kagawads: ["Joselito Roque Apelo","Gary Terada Teneza","John Victor Ibarra Alegre","Alfonso Mendoza Paredes","Allaysa Mascariñas Baria","Jeanet Chin Yao","Renasar Yamon Concepcion"],
    skChairperson: "John Patrick Conlu Ferrera",
    secretary: "Jerry Tongson Guanco",
    treasurer: "Rhonna Laluna Desacula",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/san-antonio",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'san-isidro': {
    punongBarangay: "Rolando D. Alvarez Jr.",
    kagawads: ["Denneth Grace Z. Cases","Judith E. Javier","Ernesto R. Basa","Erros Lloyd C. Baylon","Mike Joel G. Comiso","Karen May C. Matibag","Renato Hallera Lao"],
    skChairperson: "Jenniel Sequitin",
    secretary: "Medlyn Joy M. Ong",
    treasurer: "Marie Anthonette L. Capistrano",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/san-isidro",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'san-lorenzo': {
    punongBarangay: "Jose Emmanuel Alandy-Dy Recto",
    kagawads: ["Isabel Joaquine Espejo Po","Jocelyn Vida Hernandez","Frederick Raymund Romero Sibug","Marsha Regala Santos","Marvin John Carlo Yabut Sario","John Anthony Lontoc Fernandez","Edmond Edward Mendoza Flaminiano"],
    skChairperson: "Ysabela Rosario Montenegro Yupangco",
    secretary: "Leilani Moral Canullas",
    treasurer: "Dominador Polinag Hular",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/san-lorenzo",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'santa-cruz': {
    punongBarangay: "Kit H. Taguiang",
    kagawads: ["Enrico S. Evangelista","John Yland M. De Ocampo","Maria Katrina Paile Alicando","Elijah Salenga","Flodeliza R. Ambrosio","Liza Flor G. Castor","Nilo Jann D. Basada"],
    skChairperson: "Jerome Tristan G. Pangilinan",
    secretary: "Bayani G. Olegario",
    treasurer: "Ma. Victoria S. Abergos",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/santa-cruz",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'singkamas': {
    punongBarangay: "Sean Lastimosa Francisco",
    kagawads: ["Jiggs Angelika Dava Paras","Edna Tanooy Argones","Lawrence Aaron Neo Imperial","Orlino Pascua Benedicto","Danilo Solano Añonuevo","Carolina Lacsamana Manlullu","Erlinda Marquez De Guzman"],
    skChairperson: "Mars Raven Francisco Del Rosario",
    secretary: "Librado T. Olivares",
    treasurer: "Herodita D. Villanueva",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/singkamas",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'tejeros': {
    punongBarangay: "Wilfredo Soriano Leonardo",
    kagawads: ["Roberto Mendoza Cervantes","Teresita Hermocilla Brillante","Carlito Salanguit Añasco","Valeriano Soriano Javier","John David Ilagan Gaces","Lennie Hodrial Cosing","Jocelyn Rabe Leonardo"],
    skChairperson: "Raphael Salvador Lopez",
    secretary: "Rosalie Sancha Ireneo",
    treasurer: "Cristina Salvador Lopez",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/tejeros",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'urdaneta': {
    punongBarangay: "Leonard Yang Alandy Dy",
    kagawads: ["Mona Lisa De Guzman Camara","Lorenzo De Vera Regala","Charles Justin Alandy Dy Tiu","Patricia Bernice Reyes Go","Justin Vincent Go Tan","Fritzi Munsayac Tansengco","Theodore Martin Timbol Manapat"],
    skChairperson: "Klarisse Kaye Lim Tan",
    secretary: "Trisha Janice Vivar Paje",
    treasurer: "Victoria Del Prado Carballo",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/urdaneta",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
  'valenzuela': {
    punongBarangay: "George Anthony Valderama Peña",
    kagawads: ["Carlo Daniel Peña Daulat","Michael Alcala Infante","Rodney Tristan Cawili Cailles","Roberto Arayata Javier","Elvis Cariño Sararana","Danilo Gallano Libao Jr.","Lyall De Jesus Dela Cruz"],
    skChairperson: "Bhernadette Isanan Salen",
    secretary: "Dennis Rafael Castro Bacod",
    treasurer: "Wilfredo Garrido Bustamante",
    term: '2023–2026',
    source: "https://www.barangaydirectory.com/barangay/city-of-makati/valenzuela",
    sourceLabel: "Barangay Directory roster cross-check",
    secondarySource: "https://www.makati.gov.ph/barangay",
    lastVerified: barangayProfilesReviewed,
  },
};

const barangayContactSupplement: Record<string, Partial<BarangayProfile>> = {
  'bangkal': { hallPhone: "7751-0787", hallSource: barangayRosterSource('bangkal'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'bel-air': { hallAddress: "Hydra Street, Bel-Air Village, Makati City", hallPhone: "(02) 8895-4011 / (02) 8895-4012", hallSource: "https://belair.itdcsystems.com/", hallSourceLabel: "Barangay Bel-Air website", },
  'carmona': { hallPhone: "(02) 8650-4427", hallSource: barangayRosterSource('carmona'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'forbes-park': { hallPhone: "(02) 8887-0461", hallSource: barangayRosterSource('forbes-park'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'guadalupe-nuevo': { hallPhone: "(02) 8882-1992", hallSource: barangayRosterSource('guadalupe-nuevo'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'guadalupe-viejo': { hallPhone: "(02) 8672-0032", hallSource: barangayRosterSource('guadalupe-viejo'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'kasilawan': { hallPhone: "(02) 7505-3583", hallSource: barangayRosterSource('kasilawan'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'magallanes': { hallPhone: "(02) 8713-4820", hallSource: barangayRosterSource('magallanes'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'palanan': { hallAddress: "4513 Casino Street, Palanan, Makati City", hallPhone: "(02) 8640-2945", hallEmail: "brgypalanan2023@gmail.com", hallSource: "https://notices.philgeps.gov.ph/GEPSNONPILOT/Tender/PrintableBidNoticeAbstractUI.aspx?refid=11450082", hallSourceLabel: "PhilGEPS public record", },
  'pio-del-pilar': { hallPhone: "(02) 8660-2367", hallSource: barangayRosterSource('pio-del-pilar'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'san-antonio': { hallPhone: "(02) 8890-4366", hallSource: barangayRosterSource('san-antonio'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'san-isidro': { hallPhone: "(02) 8845-0260", hallSource: barangayRosterSource('san-isidro'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'santa-cruz': { hallPhone: "(02) 8896-8775", hallSource: barangayRosterSource('santa-cruz'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'singkamas': { hallPhone: "(02) 7254-8121", hallSource: barangayRosterSource('singkamas'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'tejeros': { hallPhone: "(02) 7092-5038", hallSource: barangayRosterSource('tejeros'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'urdaneta': { hallPhone: "(02) 8892-5431", hallSource: barangayRosterSource('urdaneta'), hallSourceLabel: 'Barangay Directory contact cross-check', },
  'valenzuela': { hallPhone: "(02) 8519-9232", hallSource: barangayRosterSource('valenzuela'), hallSourceLabel: 'Barangay Directory contact cross-check', },
};

const barangayBaseProfiles: BarangayProfile[] = [
  { slug: 'bangkal', name: 'Bangkal', population2024: 18013, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/bangkal/29', notablePlaces: [{ name: 'Don Bosco Technical Institute – Makati', href: 'https://www.donboscomakati.edu.ph/', type: 'Institution' }] },
  { slug: 'bel-air', name: 'Bel-Air', population2024: 39354, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/bel--air/30', associations: [{ name: 'Bel-Air Village Association (BAVA)', href: 'https://www.bava.ph/', linkLabel: 'Website' }, { name: 'Makati Central Estate Association (MACEA)', href: 'https://macea.com.ph/', linkLabel: 'Estate association' }] },
  { slug: 'carmona', name: 'Carmona', population2024: 3034, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/carmona/31', officials: { punongBarangay: 'Ricardo Perfecto B. Garcia', source: 'https://www.makati.gov.ph/barangay/carmona/31' }, associations: [{ name: 'Circuit Makati', href: 'https://circuitmakati.com/', linkLabel: 'Estate website' }], notablePlaces: [{ name: 'Circuit Makati', href: 'https://circuitmakati.com/', type: 'Establishment' }] },
  { slug: 'dasmarinas', name: 'Dasmariñas', population2024: 4320, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/dasmari%C3%B1as/32', officials: { punongBarangay: 'Wellington James S. Lim', source: 'https://www.makati.gov.ph/barangay/dasmari%C3%B1as/32' }, hallAddress: '1419 Kampanilla Street, Makati City', hallPhone: '(02) 8893-0215 / (02) 8893-0102 / (02) 8812-3335 / (02) 8817-2603', hallEmail: 'brgy.dasmarinas1971@gmail.com', hallSource: 'https://www.makati.gov.ph/barangay/dasmari%C3%B1as/32', associations: [{ name: 'Dasmariñas Village Association (DVA)', href: 'https://dva.org.ph/', linkLabel: 'Website' }] },
  { slug: 'forbes-park', name: 'Forbes Park', population2024: 4183, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/forbes-park/23', associations: [{ name: 'Forbes Park Association (FPA)', href: 'https://www.forbesparkassociation.com/', linkLabel: 'Website' }], notablePlaces: [{ name: 'Manila Polo Club', href: 'https://www.manilapoloclub.com/', type: 'Institution' }] },
  { slug: 'guadalupe-nuevo', name: 'Guadalupe Nuevo', population2024: 21596, legislativeDistrict: '2nd District', officialPageUrl: 'https://www.makati.gov.ph/barangay/guadalupe-nuevo/13', officials: { punongBarangay: 'German O. Sunga', source: 'https://www.makati.gov.ph/barangay/guadalupe-nuevo/13' }, hallEmail: 'barangayguadalupenuevo2023@gmail.com', hallSource: 'https://www.makati.gov.ph/barangay/guadalupe-nuevo/13', facebookUrl: 'https://www.facebook.com/barangayguadalupe.nuevo' },
  { slug: 'guadalupe-viejo', name: 'Guadalupe Viejo', population2024: 13525, legislativeDistrict: '2nd District', officialPageUrl: makatiBarangayDirectory, heritageMarkers: [{ name: 'Church and Monastery of Guadalupe', agency: 'NHCP', status: 'Level II – Historical marker', href: 'https://philhistoricsites.nhcp.gov.ph/registry_database/church-and-monastery-of-guadalupe/', location: 'Nuestra Señora de Gracia Church, 7440 Bernardino Street' }], notablePlaces: [{ name: 'Nuestra Señora de Gracia Church and Monastery', href: 'https://philhistoricsites.nhcp.gov.ph/registry_database/church-and-monastery-of-guadalupe/', type: 'Heritage' }] },
  { slug: 'kasilawan', name: 'Kasilawan', population2024: 5007, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/kasilawan/24' },
  { slug: 'la-paz', name: 'La Paz', population2024: 6682, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/la-paz/25?page=406', hallPhone: '(02) 8895-2755 / (02) 8735-5703', hallEmail: 'barangaylapaz815@gmail.com', hallSource: 'https://www.makati.gov.ph/barangay/la-paz/25?page=406', notablePlaces: [{ name: 'Makati Cinema Square', href: 'https://www.google.com/maps/search/?api=1&query=Makati+Cinema+Square', type: 'Establishment' }] },
  { slug: 'magallanes', name: 'Magallanes', population2024: 5473, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/magallanes/26', associations: [{ name: 'Magallanes Village Association (MVA)', href: 'https://www.google.com/maps/search/?api=1&query=Magallanes%20Village%20Association%20Makati', linkLabel: 'Map' }] },
  { slug: 'olympia', name: 'Olympia', population2024: 19035, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/olympia/27?page=438', officials: { punongBarangay: 'Reynaldo A. Yulo', source: 'https://www.makati.gov.ph/barangay/olympia/27?page=438' }, hallAddress: 'Fortuna Street, Makati City', hallPhone: '(02) 8897-9718 / (02) 8897-5019 / (02) 8897-9764 / (02) 8805-5096 / (02) 8551-8892 / (02) 8785-0626 / 0968-349-4634', hallEmail: 'barangayolympiamakati@gmail.com', hallSource: 'https://www.makati.gov.ph/barangay/olympia/27?page=438' },
  { slug: 'palanan', name: 'Palanan', population2024: 11934, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/palanan/28', officials: { punongBarangay: 'John Benedict C. Corcuera', source: 'https://www.makati.gov.ph/barangay/palanan/28' } },
  { slug: 'pinagkaisahan', name: 'Pinagkaisahan', population2024: 5323, legislativeDistrict: '2nd District', officialPageUrl: 'https://www.makati.gov.ph/barangay/pinagkaisahan/16?tab=239', officials: { punongBarangay: 'Shyla Marie Ramos (Acting)', source: 'https://www.makati.gov.ph/barangay/pinagkaisahan/16?tab=239' }, hallAddress: '2886 Danlig St. cor. Tolentino Streets, Makati City', hallPhone: '(02) 8881-4536 / (02) 8821-4530 / (02) 8881-4403', hallEmail: 'brgy.pinagkaisahan.makati@gmail.com', hallSource: 'https://www.makati.gov.ph/barangay/pinagkaisahan/16?tab=239' },
  { slug: 'pio-del-pilar', name: 'Pio Del Pilar', population2024: 55572, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/pio-del-pilar/33', officials: { punongBarangay: 'Hazel Ann S. Lacia', source: 'https://www.makati.gov.ph/barangay/pio-del-pilar/33' } },
  { slug: 'poblacion', name: 'Poblacion', population2024: 17088, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/poblacion/34?tab=682', officials: { punongBarangay: 'Jose Mikhail R. Villena', source: 'https://www.makati.gov.ph/barangay/poblacion/34?tab=682' }, heritageMarkers: [{ name: 'Makati', agency: 'NHCP', status: 'Level II – Historical marker', href: 'https://philhistoricsites.nhcp.gov.ph/registry_database/makati/', location: 'Old Makati City Hall Building, J.P. Rizal Avenue cor. Angono Street' }, { name: 'San Pedro Macati', agency: 'NHCP', status: 'Level II – Historical marker', href: 'https://philhistoricsites.nhcp.gov.ph/registry_database/san-pedro-macati/', location: 'Saints Peter and Paul Church' }, { name: 'Museo ng Makati', agency: 'NCCA', status: 'Important Cultural Property / registered property', href: 'https://talapamana.ncca.gov.ph/index.php/component/content/article/talapamana-metro-manila?Itemid=101&catid=12', location: 'Makati, Metro Manila' }], hallAddress: '3269 A. Mabini Street, Makati City', hallPhone: '(02) 8681-4034 / (02) 8890-7027 / (02) 8889-7027 / (02) 8867-3419', hallEmail: 'barangaypobmak@gmail.com', hallSource: 'https://www.makati.gov.ph/barangay/poblacion/34?tab=682', associations: [{ name: 'Century City', href: 'https://www.centurycitymall.com.ph/', linkLabel: 'Estate / mall website' }, { name: 'Rockwell Center', href: 'https://e-rockwell.com/', linkLabel: 'Estate website' }, { name: 'Makati Central Estate Association (MACEA)', href: 'https://macea.com.ph/', linkLabel: 'Estate association' }], notablePlaces: [{ name: 'Museo ng Makati', href: 'https://www.google.com/maps/search/?api=1&query=Museo+ng+Makati', type: 'Institution' }, { name: 'Saints Peter and Paul Parish', href: 'https://www.google.com/maps/search/?api=1&query=Saints+Peter+and+Paul+Parish+Makati', type: 'Heritage' }] },
  { slug: 'san-antonio', name: 'San Antonio', population2024: 18012, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/san-antonio/35', officials: { punongBarangay: 'Restituto E. Cajes', source: 'https://www.makati.gov.ph/barangay/san-antonio/35' }, notablePlaces: [{ name: 'San Antonio National High School', href: 'https://www.google.com/maps/search/?api=1&query=San+Antonio+National+High+School+Makati', type: 'Institution' }, { name: 'National Shrine of the Sacred Heart', href: 'https://www.google.com/maps/search/?api=1&query=National+Shrine+of+the+Sacred+Heart+Makati', type: 'Heritage' }] },
  { slug: 'san-isidro', name: 'San Isidro', population2024: 6260, legislativeDistrict: '1st District', officialPageUrl: makatiBarangayDirectory },
  { slug: 'san-lorenzo', name: 'San Lorenzo', population2024: 14793, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/san-lorenzo/37', officials: { punongBarangay: 'Jose Emmanuel A. Recto', source: 'https://www.makati.gov.ph/barangay/san-lorenzo/37' }, hallAddress: '65 Amorsolo Street, Makati City', hallPhone: '(02) 8541-1163 / (02) 8541-0658 / (02) 8423-9783 / (02) 8241-9319 / (02) 8823-9675', hallEmail: 'brgysanlorenzo.makati@gmail.com', hallSource: 'https://www.makati.gov.ph/barangay/san-lorenzo/37', associations: [{ name: 'San Lorenzo Village Association (SLVA)', href: 'https://www.myslv.ph/', linkLabel: 'Website' }, { name: 'Makati Central Estate Association (MACEA)', href: 'https://macea.com.ph/', linkLabel: 'Estate association' }] },
  { slug: 'santa-cruz', name: 'Santa Cruz', population2024: 6744, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/sta.-cruz/39?page=622', officials: { punongBarangay: 'Kit H. Taguiang', source: 'https://www.makati.gov.ph/barangay/sta.-cruz/39?page=622' } },
  { slug: 'singkamas', name: 'Singkamas', population2024: 7485, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/singkamas/38?tab=598', facebookUrl: 'https://www.facebook.com/barangaysingkamas.serbisyo' },
  { slug: 'tejeros', name: 'Tejeros', population2024: 16019, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/tejeros/7?page=92' },
  { slug: 'urdaneta', name: 'Urdaneta', population2024: 4720, legislativeDistrict: '1st District', officialPageUrl: 'https://www.makati.gov.ph/barangay/urdaneta/8', officials: { punongBarangay: 'Leonard Y. Alandy Dy', source: 'https://www.makati.gov.ph/barangay/urdaneta/8' }, associations: [{ name: 'Urdaneta Village Association (UVA)', href: 'https://www.google.com/maps/search/?api=1&query=Urdaneta%20Village%20Association%20Makati', linkLabel: 'Map' }, { name: 'Makati Central Estate Association (MACEA)', href: 'https://macea.com.ph/', linkLabel: 'Estate association' }] },
  { slug: 'valenzuela', name: 'Valenzuela', population2024: 5598, legislativeDistrict: '1st District', officialPageUrl: makatiBarangayDirectory },
];

export const barangays: BarangayProfile[] = barangayBaseProfiles.map(profile => ({
  ...(barangayContactSupplement[profile.slug] ?? {}),
  ...profile,
  officials: barangayOfficialData[profile.slug] ?? profile.officials,
}));

export const barangayCoverageSummary = {
  profiles: barangays.length,
  councilRosters: barangays.filter(
    item =>
      Boolean(item.officials?.punongBarangay) &&
      (item.officials?.kagawads?.length ?? 0) >= 6 &&
      Boolean(item.officials?.skChairperson)
  ).length,
  hallContacts: barangays.filter(
    item => Boolean(item.hallAddress || item.hallPhone || item.hallEmail)
  ).length,
  specificOfficialPages: barangays.filter(
    item => Boolean(item.officialPageUrl && item.officialPageUrl !== makatiBarangayDirectory)
  ).length,
  verifiedHealthFacilityBarangays: barangays.filter(
    item => (yakapHealthCenters[item.slug]?.length ?? 0) > 0
  ).length,
  verifiedSocialChannels: barangays.filter(item => Boolean(item.facebookUrl)).length,
  barangaysWithCommunityLinks: barangays.filter(
    item =>
      (item.notablePlaces?.length ?? 0) > 0 ||
      (item.associations?.length ?? 0) > 0 ||
      (item.heritageMarkers?.length ?? 0) > 0
  ).length,
};

export const barangayCoverageGaps = barangays.map(item => ({
  slug: item.slug,
  name: item.name,
  missing: [
    ...(!item.hallAddress ? ['hall address'] : []),
    ...(!item.hallPhone ? ['hall phone'] : []),
    ...(!item.hallEmail ? ['hall email'] : []),
    ...(item.officialPageUrl === makatiBarangayDirectory ? ['specific Makati barangay page'] : []),
    ...(!(yakapHealthCenters[item.slug]?.length) ? ['verified YAKAP health center'] : []),
    ...(!(item.facebookUrl) ? ['verified official social channel'] : []),
    ...(!(item.notablePlaces?.length || item.associations?.length || item.heritageMarkers?.length)
      ? ['verified community places / associations']
      : []),
  ],
}));

export const findBarangay = (slug?: string) => barangays.find(barangay => barangay.slug === slug);
export const barangayMapsUrl = (name: string) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Barangay ' + name + ', Makati City, Philippines');
