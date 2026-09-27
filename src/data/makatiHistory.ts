export type Evidence =
  'Legal record' | 'Institutional history' | 'Scholarly account';

export type HistoryEvidenceLevel =
  | 'Primary'
  | 'Near-primary'
  | 'Secondary'
  | 'Reference';

export type HistorySourceFormat =
  | 'law'
  | 'archival document'
  | 'institutional record'
  | 'historical map'
  | 'photograph'
  | 'newspaper'
  | 'scholarly work'
  | 'dataset'
  | 'website'
  | 'other';

export interface HistorySource {
  /** Optional stable key for linking interpretations and media back to a citation. */
  id?: string;
  label: string;
  url: string;
  /** Legacy display grouping retained for the current History UI. */
  kind: Evidence;
  evidenceLevel?: HistoryEvidenceLevel;
  format?: HistorySourceFormat;
  creator?: string;
  repository?: string;
  date?: string;
  /** Page, folio, section, call number, map sheet, photograph identifier, etc. */
  locator?: string;
  citationNote?: string;
  /** Public-facing credit / reuse note when a source also supplies media. */
  rights?: string;
}

export type HistoryEvidenceStatus =
  | 'established'
  | 'probable'
  | 'contested'
  | 'uncertain'
  | 'tradition';

export interface HistoryNamedReference {
  id?: string;
  label: string;
  href?: string;
}

export interface HistoryRelations {
  /** Canonical BetterMakati Civic Registry IDs. */
  placeIds?: string[];
  /** Canonical BetterBarangay slugs. */
  barangaySlugs?: string[];
  districtIds?: string[];
  heritageIds?: string[];
  people?: HistoryNamedReference[];
  institutions?: HistoryNamedReference[];
  eventIds?: string[];
}

export interface HistoryMedia {
  id: string;
  kind: 'photograph' | 'map' | 'document' | 'illustration';
  title: string;
  /** Local/public asset path only. Private research-file URLs do not belong here. */
  src?: string;
  source: HistorySource;
  date?: string;
  caption?: string;
  alt?: string;
  rights?: string;
  relatedPlaceIds?: string[];
}

export interface HistoryInterpretation {
  id: string;
  label: string;
  summary: string;
  /** IDs of HistorySource records supporting this reading. */
  sourceRefs?: string[];
}

export interface HistoryEvent {
  id: string;
  year: number;
  date: string;
  title: string;
  topic: string;
  summary: string;
  /**
   * Primary citation retained for backward compatibility with the existing UI.
   * New research may attach additional citations through sources.
   */
  source: HistorySource;
  sources: HistorySource[];
  evidenceStatus?: HistoryEvidenceStatus;
  evidenceNote?: string;
  relations?: HistoryRelations;
  media?: HistoryMedia[];
  interpretations?: HistoryInterpretation[];
  note?: string;
}
const city: HistorySource = {
  label: 'City of Makati · Ecological Profile, History',
  url: 'https://www.makati.gov.ph/assets/uploads/downloads/2/49/241/pdf/I.%20History.pdf',
  kind: 'Institutional history',
};
const study: HistorySource = {
  label: 'James B. Tueller · World History Connected 14(3), 2017',
  url: 'https://journals.gmu.edu/whc/article/download/4017/2226?inline=1',
  kind: 'Scholarly account',
};
const library: HistorySource = {
  label: 'Filipinas Heritage Library · Institutional history',
  url: 'https://www.filipinaslibrary.org.ph/articles/history-of-the-filipinas-heritage-library/',
  kind: 'Institutional history',
};
const legal = (label: string, url: string): HistorySource => ({
  label,
  url,
  kind: 'Legal record',
});
const boundary = legal(
  'Supreme Court · G.R. 235316, 1 December 2021',
  'https://lawphil.net/judjuris/juri2021/dec2021/gr_235316_2021.html'
);
const nhcpSanPedro: HistorySource = {
  id: 'nhcp-san-pedro-macati',
  label: 'NHCP · San Pedro Macati historical marker',
  url: 'https://philhistoricsites.nhcp.gov.ph/registry_database/san-pedro-macati/',
  kind: 'Institutional history',
  evidenceLevel: 'Reference',
  format: 'institutional record',
  repository: 'National Historical Commission of the Philippines',
  date: '1937 marker',
  citationNote:
    'Retrospective historical marker; useful as an official reference but not a contemporaneous foundation record.',
};
const nhcpMakati: HistorySource = {
  id: 'nhcp-makati-marker',
  label: 'NHCP · Makati historical marker',
  url: 'https://philhistoricsites.nhcp.gov.ph/registry_database/makati/',
  kind: 'Institutional history',
  evidenceLevel: 'Reference',
  format: 'institutional record',
  repository: 'National Historical Commission of the Philippines',
  date: '1991 marker',
  citationNote:
    'Retrospective city marker; dates should be checked against surviving contemporary instruments where available.',
};
const britoStudy: HistorySource = {
  id: 'manchado-lopez-brito-2024',
  label:
    'Marta María Manchado López · “Los primeros años de la Manila española y la presencia portuguesa”',
  url: 'https://estudiosamericanos.revistas.csic.es/index.php/estudiosamericanos/article/download/1085/1096?inline=1',
  kind: 'Scholarly account',
  evidenceLevel: 'Secondary',
  format: 'scholarly work',
  creator: 'Marta María Manchado López',
  repository: 'Anuario de Estudios Americanos / CSIC',
  date: '2024',
  locator: '81(2), e28 · section on Pedro de Brito’s 1607 foundation',
  citationNote:
    'The study cites Francisco Colín (1663) for the Buenavista endowment and foundation.',
};
const colinSanPedro: HistorySource = {
  id: 'colin-san-pedro-1656',
  label: 'Francisco Colín · Jesuit missions in 1656, “House of San Pedro”',
  url: 'https://www.gutenberg.org/cache/epub/25930/pg25930-images.html',
  kind: 'Scholarly account',
  evidenceLevel: 'Near-primary',
  format: 'archival document',
  creator: 'Francisco Colín; English edition by Emma Helen Blair and James Alexander Robertson',
  repository: 'Project Gutenberg',
  date: '1656 survey; published 1663; English edition 1905',
  locator: 'The Philippine Islands, 1493–1898, vol. XXVIII · “House of San Pedro”',
  citationNote:
    'English translation of Colín’s near-contemporary Jesuit survey.',
};
const escotoVisitation: HistorySource = {
  id: 'escoto-visitation-1773',
  label:
    'Salvador P. Escoto · “The Manila Archbishop’s Visitation of Parishes, 1773–1775”',
  url: 'https://archium.ateneo.edu/phstudies/vol58/iss1/7/',
  kind: 'Scholarly account',
  evidenceLevel: 'Near-primary',
  format: 'scholarly work',
  creator: 'Salvador P. Escoto',
  repository: 'Philippine Studies / Ateneo de Manila University',
  date: '2010',
  locator: 'pp. 242–246 · San Pedro Makati, 20–22 February 1773',
  citationNote:
    'Escoto translates and summarizes the 5 April 1773 visitation record held by the Archivo General de Indias.',
};
const kelly1775: HistorySource = {
  id: 'kelly-manila-environs-1775',
  label: 'Dionisio Kelly · plan of the environs of Manila, 1775',
  url: 'https://searcharchives.bl.uk/catalog/040-002027896',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'historical map',
  creator: 'Dionisio Kelly',
  repository: 'British Library',
  date: '1775',
  locator: 'Add MS 17641 C',
  citationNote:
    'Primary cartographic evidence for the Manila environs; building-level interpretations require separate corroboration.',
};
const nhcpGuadalupe: HistorySource = {
  id: 'nhcp-guadalupe-church-monastery',
  label: 'NHCP · Church and Monastery of Guadalupe historical marker',
  url: 'https://philhistoricsites.nhcp.gov.ph/registry_database/church-and-monastery-of-guadalupe/',
  kind: 'Institutional history',
  evidenceLevel: 'Reference',
  format: 'institutional record',
  repository: 'National Historical Commission of the Philippines',
  date: '1937 marker',
  citationNote:
    'Retrospective marker; the underlying Augustinian records should be linked when a stable public edition is available.',
};
const lorenzoTemporalities: HistorySource = {
  id: 'lorenzo-garcia-jesuit-expulsion',
  label: 'Santiago Lorenzo García · La expulsión de los Jesuitas de Filipinas',
  url: 'https://public.digitaliapublishing.com/a/647/la-expulsion-de-los-jesuitas-de-filipinas',
  kind: 'Scholarly account',
  evidenceLevel: 'Secondary',
  format: 'scholarly work',
  creator: 'Santiago Lorenzo García',
  repository: 'Universidad de Alicante / Digitalia',
  date: '1999',
  citationNote:
    'Documents the administration and sale of former Jesuit temporalities, including San Pedro Macati.',
};
const galarragaArchive: HistorySource = {
  id: 'nap-galarraga-san-pedro-macati',
  label: 'National Archives of the Philippines · Erecciones de los Pueblos, SDS 14020, Exp. 25',
  url: 'https://erecciones.nationalarchives.gov.ph/searchdata.php?end_date=1899&number=014020&start_date=1731',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'archival document',
  repository: 'National Archives of the Philippines',
  date: '1785–1855 series',
  locator: 'SDS 14020 · Exp. 25',
  citationNote:
    'Catalog entry identifies Pedro de Galarraga as purchaser of Hacienda de San Pedro Macati and records his petition to rebuild its ruined church.',
};
const zunigaMacati: HistorySource = {
  id: 'zuniga-estadismo-macati',
  label: 'Joaquín Martínez de Zúñiga · Estadismo de las Islas Filipinas',
  url: 'https://books.google.com/books?id=zFJFAAAAYAAJ',
  kind: 'Scholarly account',
  evidenceLevel: 'Near-primary',
  format: 'other',
  creator: 'Joaquín Martínez de Zúñiga; W. E. Retana, editor',
  repository: 'Google Books digitization of the 1893 edition',
  date: 'early-19th-century account; published 1893',
  locator: 'vol. 1, pp. 211–212',
  citationNote:
    'Zúñiga records Villamediana’s purchase from the Crown and repairs to both the hacienda house and church; the passage does not identify the modern location of the house.',
};
const pilapil1796: HistorySource = {
  id: 'pilapil-san-pedro-blessing-1796',
  label: 'Mariano Pilapil · Oración panegírica for the blessing of San Pedro Macati church',
  url: 'https://issuu.com/filipinasheritagelibrary/docs/oracion_20panegiricaque?e=18015266/55448844',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'archival document',
  creator: 'Mariano Pilapil',
  repository: 'Filipinas Heritage Library',
  date: '29 June 1796',
  citationNote:
    'Contemporary printed sermon identifying the church as rebuilt by Pedro de Galarraga.',
};
const segui1831: HistorySource = {
  id: 'segui-visitation-1831',
  label: '1831 diocesan visitation of San Pedro Macati · transcription by Jesús Álvarez Fernández',
  url: 'https://www.agustinosvalladolid.es/estudio/investigacion/archivoagustiniano/archivofondos/archivo2012/archivo_2012_01.pdf',
  kind: 'Scholarly account',
  evidenceLevel: 'Near-primary',
  format: 'archival document',
  creator: 'Juan Bonifacio; transcription by Jesús Álvarez Fernández',
  repository: 'Archivo Agustiniano',
  date: '26 October 1831',
  locator: 'Act 6 · pp. 19–20 of the published transcription',
  citationNote:
    'Published transcription of the diocesan visitation act; it states that the casa de Hacienda served as the parish house.',
};
const aragon1814: HistorySource = {
  id: 'aragon-manila-environs-1814',
  label: 'Ildefonso de Aragón · Plano de la plaza de Manila y sus contornos',
  url: 'https://pares.cultura.gob.es/ParesBusquedas20/catalogo/description/18966',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'historical map',
  creator: 'Ildefonso de Aragón y Abollado',
  repository: 'Archivo General de Indias / PARES',
  date: '4 January 1814',
  locator: 'MP-FILIPINAS,133',
  citationNote:
    'Primary map of Manila and neighboring settlements. Unlabeled building compounds are not identified without independent evidence.',
  rights:
    'PARES states that public-domain document images in the Spanish State Archives may be reproduced and used without prior permission.',
};
const alvarezGuerra: HistorySource = {
  id: 'alvarez-guerra-viajes-tayabas',
  label: 'Juan Álvarez Guerra · Viajes por Filipinas: De Manila á Tayabas',
  url: 'https://www.gutenberg.org/cache/epub/12276/pg12276-images.html',
  kind: 'Scholarly account',
  evidenceLevel: 'Near-primary',
  format: 'other',
  creator: 'Juan Álvarez Guerra',
  repository: 'Project Gutenberg',
  date: 'observations from the 1870s; second edition 1887',
  locator: 'Chapter I',
  citationNote:
    'Travel account describing the Pasig river corridor, San Pedro Macati, Guadalupe and the Guadalupe stone trade.',
};
const roxasPurchaseStudy: HistorySource = {
  id: 'co-makati-liveable-city-2010',
  label: 'Eliseo T. Co · “Makati City as a ‘Liveable City’ — Lines in Pleasant Places”',
  url: 'https://pssc.org.ph/wp-content/pssc-archives/Aghamtao/2010/08_Makati%20City%20as%20a%20Liveable%20City-Lines%20in%20Pleasant%20Places.pdf',
  kind: 'Scholarly account',
  evidenceLevel: 'Secondary',
  format: 'scholarly work',
  creator: 'Eliseo T. Co',
  repository: 'AghamTao / Philippine Social Science Council',
  date: '2010',
  locator: 'vol. 19, pp. 50–51',
  citationNote:
    'Dates José Bonifacio Roxas’s purchase of the hacienda to 7 April 1851; the article cites earlier published histories for the ownership sequence.',
};
const roxasLandCase: HistorySource = {
  id: 'sc-roxas-tuason-1907',
  label: 'Supreme Court · Pedro P. Roxas v. Julia Tuason, G.R. No. L-3788',
  url: 'https://lawphil.net/judjuris/juri1907/dec1907/gr_l-3788_1907.html',
  kind: 'Legal record',
  evidenceLevel: 'Near-primary',
  format: 'law',
  repository: 'Supreme Court / Lawphil',
  date: '21 December 1907',
  locator: '9 Phil. 408',
  citationNote:
    'Confirms that Pedro P. Roxas inherited Hacienda de San Pedro Macati from his father José Bonifacio Roxas and records the Casa-Quinta/Casa de Ingenieros in the registered estate.',
};
const elComercio1880: HistorySource = {
  id: 'el-comercio-tremors-1880',
  label: 'El Comercio · supplement on the July 1880 earthquakes',
  url: 'https://bdh-rd.bne.es/viewer.vm?id=0000203725&page=1',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'newspaper',
  repository: 'Biblioteca Digital Hispánica · Biblioteca Nacional de España',
  date: '31 July 1880',
  citationNote:
    'Contemporary supplement reproducing reports on the July 1880 earthquakes, including damage at San Pedro Macati.',
};
const nhiPioDelPilar: HistorySource = {
  id: 'nhi-filipinos-in-history-pio-del-pilar',
  label: 'National Historical Institute · Filipinos in History, vol. II · Pio del Pilar',
  url: 'https://dfa.gov.ph/images/AMabini/C__Managepoint_sessions_Diane_Rar1423.pdf',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  creator: 'National Historical Institute',
  repository: 'Republic of the Philippines · government-hosted copy',
  date: '1990; second printing 1996',
  locator: 'pp. 102–104',
  citationNote:
    'Institutional biography recording the 28 May 1896 organization of the Magtagumpay Katipunan council in Culi-Culi and its war standard.',
};
const spanishFieldHospital1898: HistorySource = {
  id: 'aycart-lopez-campana-filipinas',
  label: 'Lorenzo Aycart y López · La campaña de Filipinas',
  url: 'https://quod.lib.umich.edu/p/philamer/aca6005.0001.001/42?page=root;rgn=full+text;size=100;view=image;q1=macati',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'historical map',
  creator: 'Lorenzo Aycart y López',
  repository: 'University of Michigan · Philippine Studies digital collection',
  date: 'campaign record published 1900/1910 edition',
  locator: 'map/table of Manila military medical installations · Casa de Pedro Roxas en San Pedro Macati',
  citationNote:
    'Military medical account identifies the Casa de Pedro Roxas in San Pedro Macati as a provisional hospital. The label alone does not settle which later Makati building corresponds to that house.',
};
const usActions1899: HistorySource = {
  id: 'us-congress-actions-philippines-1899',
  label: 'U.S. Congressional Record · chronological list of actions in the Philippine Islands',
  url: 'https://www.congress.gov/56/crecb/1901/01/11/GPO-CRECB-1901-pt1-v34-25.pdf',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'institutional record',
  repository: 'Congress.gov / U.S. Government Publishing Office',
  date: '11 January 1901',
  locator: 'chronological list of actions, February 1899 · San Pedro Macati and Guadalupe',
  citationNote:
    'Official U.S. compilation records repeated engagements at San Pedro Macati and Guadalupe in February 1899.',
};
const smithsonianKingHq: HistorySource = {
  id: 'smithsonian-king-hq-san-pedro-1899',
  label: 'Underwood & Underwood · General King’s Headquarters, San Pedro Macati',
  url: 'https://americanhistory.si.edu/collections/ac-component/sova-nmah-ac-0143-ref13495',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'photograph',
  creator: 'James Ricalton / Underwood & Underwood',
  repository: 'Archives Center · National Museum of American History, Smithsonian Institution',
  date: '1899',
  locator: 'NMAH.AC.0143_ref13495 · caption no. 24185',
  citationNote:
    'Contemporary stereograph cataloged by the Smithsonian as General King’s headquarters in San Pedro Macati.',
  rights:
    'Smithsonian record states that usage conditions apply; do not republish the image without checking the institution’s terms.',
};
const zobelPorcelain: HistorySource = {
  id: 'zobel-first-philippine-porcelain',
  label: 'Fernando Zobel de Ayala · “The First Philippine Porcelain”',
  url: 'https://archium.ateneo.edu/phstudies/vol9/iss1/2/',
  kind: 'Scholarly account',
  evidenceLevel: 'Secondary',
  format: 'scholarly work',
  creator: 'Fernando Zobel de Ayala',
  repository: 'Philippine Studies / Ateneo de Manila University',
  date: '1961',
  locator: 'vol. 9, no. 1, pp. 17–19',
  citationNote:
    'Historical account of La Porcelanica based on Ayala family and company records.',
};
const healthService1917: HistorySource = {
  id: 'philippine-health-service-1917',
  label: 'Philippine Health Service · Annual Report for 1917',
  url: 'https://archive.org/details/acw9791.1917.001.umich.edu',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'institutional record',
  creator: 'J. D. Long, Director of Health',
  repository: 'Internet Archive / University of Michigan copy',
  date: '1918',
  citationNote:
    'Contemporary government report describing the reconstruction of the Casa Quinta at San Pedro Makati for the Government Orphanage.',
};
const act2671: HistorySource = {
  id: 'act-2671-charitable-purposes',
  label: 'Philippine Legislature · Act No. 2671',
  url: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/28/33265',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Supreme Court E-Library',
  date: '10 January 1917',
  citationNote:
    'Appropriated funds for public charity, including care of orphans; contemporary reports document the Makati orphanage created under this authority.',
};
const act2815: HistorySource = {
  id: 'act-2815-dependent-children',
  label: 'Philippine Legislature · Act No. 2815',
  url: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/28/34342',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Supreme Court E-Library',
  date: '4 March 1919',
  citationNote:
    'Reorganized the Government Orphanage established under Act No. 2671 as the Bureau of Dependent Children.',
};
const fhlCasaPrincipal1910: HistorySource = {
  id: 'fhl-casa-principal-1910',
  label: 'Ayala Archives · “Casa Principal de San Pedro, Makati”',
  url: 'https://www.filipinaslibrary.org.ph/biblio/18057/',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'photograph',
  repository: 'Filipinas Heritage Library · Ayala Archives',
  date: '1910',
  locator: 'FHL bibliographic record 18057',
  rights:
    'Image publication requires compliance with Filipinas Heritage Library reproduction and rights terms.',
};
const fhlCasaHacienda1926: HistorySource = {
  id: 'fhl-casa-hacienda-1926',
  label: 'Ayala Archives · “Casa Hacienda, Makati”',
  url: 'https://www.filipinaslibrary.org.ph/biblio/18040/',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'photograph',
  repository: 'Filipinas Heritage Library · Ayala Archives',
  date: '1926',
  locator: 'FHL bibliographic record 18040',
  rights:
    'Image publication requires compliance with Filipinas Heritage Library reproduction and rights terms.',
};
const fhlOficinas1926: HistorySource = {
  id: 'fhl-oficinas-hacienda-1926',
  label: 'Ayala Archives · “Hacienda Makati office building”',
  url: 'https://www.filipinaslibrary.org.ph/biblio/18052/',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'photograph',
  repository: 'Filipinas Heritage Library · Ayala Archives',
  date: '1926',
  locator: 'FHL bibliographic record 18052 · notes identify Oficinas, Hacienda Makati',
  rights:
    'Image publication requires compliance with Filipinas Heritage Library reproduction and rights terms.',
};
const manilaVicinity1919: HistorySource = {
  id: 'loc-manila-vicinity-1919',
  label: 'Office of Department Engineer · Map of city of Manila and vicinity',
  url: 'https://www.loc.gov/item/2012586259/',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'historical map',
  repository: 'Library of Congress · Geography and Map Division',
  date: 'June 1915; corrected to March 1919',
  locator: 'G8064.M5 1919 .M3 · LCCN 2012586259',
  citationNote:
    'Primary topographic map of Manila and its metropolitan vicinity before Makati’s later large-scale urban redevelopment.',
  rights:
    'Library of Congress states this digitized Geography and Map Division item is free to use and reuse unless a rights advisory says otherwise.',
};
export const historyReviewed = '27 September 2026';
export const historyEras = [
  { label: 'Early & Spanish colonial', from: 0, to: 1895 },
  { label: 'Revolution & American period', from: 1896, to: 1934 },
  { label: 'Commonwealth & war', from: 1935, to: 1945 },
  { label: 'Postwar transformation', from: 1946, to: 1985 },
  { label: 'Cityhood & contemporary', from: 1986, to: 9999 },
];
const community = 'Community & culture',
  government = 'Government & boundaries',
  transport = 'Transport & urban change',
  war = 'War & resistance',
  health = 'Health & education';
interface HistoryEventMeta {
  additionalSources?: HistorySource[];
  evidenceStatus?: HistoryEvidenceStatus;
  evidenceNote?: string;
  relations?: HistoryRelations;
  media?: HistoryMedia[];
  interpretations?: HistoryInterpretation[];
}

type Row = [
  string,
  number,
  string,
  string,
  string,
  string,
  HistorySource,
  string?,
  HistoryEventMeta?,
];
const rows: Row[] = [
  [
    'visita',
    1578,
    '1578–1670',
    'A visita of Santa Ana de Sapa',
    community,
    'The city profile places Makati under Santa Ana de Sapa during this period.',
    city,
    'Retrospective accounts; no contemporaneous foundation instrument has yet been added to the BetterMakati corpus.',
    {
      additionalSources: [nhcpMakati],
      evidenceStatus: 'probable',
      evidenceNote:
        'City and NHCP institutional histories agree on the 1578 visita tradition; this entry does not treat that agreement as a surviving primary foundation record.',
    },
  ],
  [
    'guadalupe-foundations',
    1601,
    '1601–1629',
    'Guadalupe church and monastery take shape',
    community,
    'The NHCP marker dates the laying of the Augustinian church and monastery foundations to 1601 and completion to 1629, establishing a second early religious center in the landscape of present-day Makati.',
    nhcpGuadalupe,
    'The dates currently rest on the 1937 historical marker; underlying Augustinian records remain a research target.',
    {
      evidenceStatus: 'probable',
      relations: {
        barangaySlugs: ['guadalupe-viejo'],
        institutions: [{ label: 'Order of Saint Augustine' }],
      },
    },
  ],
  [
    'cattle-fields',
    1606,
    'July 1606',
    'Cultivators and cattle on the Pasig',
    community,
    'Tueller discusses a complaint about Pedro de Brito’s cattle damaging cultivated fields.',
    study,
  ],
  [
    'buenavista-foundation',
    1607,
    '1607',
    'Buenavista endowed for the Jesuit novitiate',
    community,
    'Pedro de Brito and Ana de Herrera endowed the Jesuits with the Buenavista estate and funds for a church and house for novices, establishing the institutional core later known as San Pedro Macati.',
    britoStudy,
    'The year 1607 is well supported, but retrospective sources differ on the exact date of the deed; BetterMakati does not force a day-level date here.',
    {
      additionalSources: [nhcpSanPedro],
      evidenceStatus: 'established',
      evidenceNote:
        'Manchado López cites Francisco Colín’s 1663 account and gives a 1607 public foundation deed; the NHCP marker independently places the Buenavista donation in 1607.',
      relations: {
        barangaySlugs: ['poblacion'],
        people: [
          { label: 'Pedro de Brito' },
          { label: 'Ana de Herrera' },
          { label: 'Gregorio López, S.J.' },
        ],
        institutions: [{ label: 'Society of Jesus' }],
        eventIds: ['san-pedro-church'],
      },
    },
  ],
  [
    'san-pedro-church',
    1620,
    '1620',
    'San Pedro Macati church and Jesuit house',
    community,
    'The San Pedro complex was taking permanent form by 1620, with the Jesuit church associated with the adjoining novitiate and retreat house.',
    study,
    undefined,
    {
      additionalSources: [nhcpSanPedro],
      evidenceStatus: 'established',
      relations: {
        barangaySlugs: ['poblacion'],
        institutions: [{ label: 'Society of Jesus' }],
        eventIds: ['buenavista-foundation'],
      },
    },
  ],
  [
    'chirino',
    1635,
    '1635',
    'Pedro Chirino at San Pedro',
    community,
    'The historian and Jesuit missionary died at San Pedro, according to Tueller.',
    study,
  ],
  [
    'san-pedro-estate-1656',
    1656,
    '1656 · Colín survey',
    'A working estate around the House of San Pedro',
    community,
    'Francisco Colín’s survey describes two Jesuits at the House of San Pedro and sixty tributarios of Tagalog Indians working the estate, alongside religious ministry to the surrounding population.',
    colinSanPedro,
    'This is evidence about the documented estate community, not a complete census of everyone living in what is now Makati.',
    {
      evidenceStatus: 'established',
      relations: {
        barangaySlugs: ['poblacion'],
        institutions: [{ label: 'Society of Jesus' }],
        eventIds: ['buenavista-foundation', 'san-pedro-church'],
      },
    },
  ],
  [
    'uprising-1639',
    1639,
    '28 November 1639',
    'Violence reaches the novitiate',
    war,
    'A Jesuit account examined by Tueller describes fighting during the Chinese uprising.',
    study,
    'A mediated colonial account, not a neutral eyewitness consensus.',
  ],
  [
    'town-1670',
    1670,
    '1670 · NHCP marker',
    'San Pedro Makati becomes a bayan',
    government,
    'The NHCP’s Makati historical marker dates San Pedro Makati’s becoming a town to 1670.',
    nhcpMakati,
    'A contemporaneous town-creation instrument has not yet been located in the BetterMakati research corpus.',
    {
      evidenceStatus: 'probable',
      evidenceNote:
        'This milestone is retained as an official marker-based date while primary documentation is still being sought.',
    },
  ],
  [
    'british-occupation',
    1762,
    '1762',
    'Church destruction during British occupation',
    war,
    'Tueller connects the destruction of the church with the British occupation of Manila.',
    study,
  ],
  [
    'jesuit-expulsion',
    1768,
    '1768',
    'Jesuit expulsion and confiscation',
    government,
    'The expulsion of the Jesuits brought confiscation of their lands, including the local estate.',
    study,
  ],
  [
    'archbishop-visitation-1773',
    1773,
    '20–22 February 1773',
    'An archiepiscopal visitation records the hacienda town',
    community,
    'Archbishop Basilio Sancho’s visitation recorded San Pedro Makati as a former Jesuit hacienda town with 1,009 people. The earthquake-damaged church had no rectory, so the parish priest lived in a separate quarter of the hacienda house.',
    escotoVisitation,
    'The demographic categories come from an eighteenth-century ecclesiastical visitation and should not be read as a modern census.',
    {
      evidenceStatus: 'established',
      relations: {
        people: [
          { label: 'Basilio Sancho de Santa Justa y Rufina' },
          { label: 'Manuel de Guzman' },
        ],
      },
      media: [
        {
          id: 'kelly-manila-environs-1775',
          kind: 'map',
          title: 'Plan of the environs, coast and bay adjacent to Manila',
          source: kelly1775,
          date: '1775',
          caption:
            'A near-contemporary map of the Manila environs used for landscape reconstruction. Building-level identifications require separate corroboration.',
          rights:
            'Catalog metadata only in BetterMakati until a reusable digital surrogate and its terms are confirmed.',
        },
      ],
    },
  ],
  [
    'hacienda-sale-1795',
    1795,
    '1795',
    'The former Jesuit hacienda passes into private ownership',
    government,
    'The former Jesuit Hacienda de San Pedro Macati was sold from the Crown’s temporalities in 1795. Pedro de Galarraga acquired the estate and appears in the National Archives catalog as its purchaser.',
    lorenzoTemporalities,
    undefined,
    {
      additionalSources: [galarragaArchive, zunigaMacati],
      evidenceStatus: 'established',
      evidenceNote:
        'The sale is distinct from the later question of which surviving or mapped building should be identified as the estate’s principal house.',
      relations: {
        people: [{ label: 'Pedro de Galarraga' }],
        eventIds: ['san-pedro-church-rebuilt-1796'],
      },
    },
  ],
  [
    'san-pedro-church-rebuilt-1796',
    1796,
    '29 June 1796',
    'Galarraga’s rebuilt San Pedro church is blessed',
    community,
    'A contemporary printed sermon records the blessing of the San Pedro Macati church rebuilt by Pedro de Galarraga after the Jesuit expulsion.',
    pilapil1796,
    undefined,
    {
      additionalSources: [galarragaArchive, zunigaMacati],
      evidenceStatus: 'established',
      relations: {
        barangaySlugs: ['poblacion'],
        people: [
          { label: 'Pedro de Galarraga' },
          { label: 'Mariano Pilapil' },
          { label: 'Facundo Marino' },
        ],
        eventIds: ['hacienda-sale-1795'],
      },
    },
  ],
  [
    'segui-visitation-1831',
    1831,
    '26 October 1831',
    'The hacienda house serves as San Pedro Macati’s rectory',
    community,
    'The diocesan visitation recorded a masonry, tile-roofed church and stated that the casa de Hacienda served as the parish house. The same record counted 2,033 people and 625 tributes.',
    segui1831,
    'The act establishes the existence and parish use of a hacienda house but does not locate it precisely enough to identify a modern site.',
    {
      evidenceStatus: 'established',
      media: [
        {
          id: 'aragon-manila-environs-1814',
          kind: 'map',
          title: 'Plano de la plaza de Manila y sus contornos',
          source: aragon1814,
          date: '1814',
          caption:
            'The primary map records San Pedro Macati in its wider river landscape. BetterMakati does not identify unlabeled compounds on the map solely from their appearance.',
          rights:
            'Public-domain archival image; PARES permits reuse of public-domain State Archives images without prior permission.',
        },
      ],
      interpretations: [
        {
          id: 'casa-hacienda-documented-not-located',
          label: 'What the 1831 record establishes',
          summary:
            'A casa de Hacienda existed and was functioning as the parish priest’s residence in San Pedro Macati.',
          sourceRefs: ['segui-visitation-1831'],
        },
        {
          id: 'two-casas-location-unresolved',
          label: 'What remains unresolved',
          summary:
            'The 1831 wording alone cannot determine whether this house corresponds to the later Poblacion Oficinas, the Olympia structure photographed in 1910 and 1926, or another phase in the estate complex.',
          sourceRefs: ['segui-visitation-1831', 'aragon-manila-environs-1814'],
        },
      ],
    },
  ],
  [
    'church-rebuilding',
    1849,
    '1849 · later rebuilding account',
    'Further rebuilding of the San Pedro church',
    community,
    'Tueller dates another rebuilding phase to 1849. This follows the securely documented Galarraga reconstruction blessed in 1796, so the scope of the 1849 works still needs reconciliation.',
    study,
    'Do not treat 1849 as the first post-Jesuit reconstruction; a 1796 blessing of Galarraga’s rebuilt church is directly documented.',
    {
      additionalSources: [pilapil1796],
      evidenceStatus: 'uncertain',
      evidenceNote:
        'The date may refer to a later reconstruction or major repair rather than replacement of the 1796 church.',
      relations: {
        barangaySlugs: ['poblacion'],
        eventIds: ['san-pedro-church-rebuilt-1796'],
      },
    },
  ],
  [
    'roxas-purchase-1851',
    1851,
    '7 April 1851 · published account',
    'José Bonifacio Roxas acquires Hacienda de San Pedro Macati',
    government,
    'A scholarly local history dates José Bonifacio Roxas’s acquisition of the hacienda to 7 April 1851. A 1907 Supreme Court decision later confirms that Pedro P. Roxas inherited the Hacienda de San Pedro Macati from his father José Bonifacio Roxas.',
    roxasPurchaseStudy,
    'Published accounts differ on the stated purchase price; BetterMakati records the ownership transfer here without forcing a single price figure.',
    {
      additionalSources: [roxasLandCase],
      evidenceStatus: 'established',
      relations: {
        people: [
          { label: 'José Bonifacio Roxas' },
          { label: 'Pedro P. Roxas' },
        ],
        eventIds: ['hacienda-sale-1795'],
      },
    },
  ],
  [
    'pottery',
    1865,
    '1865',
    'Pottery production in the documentary record',
    community,
    'Tueller cites a transaction involving pottery ovens, evidence of local manufacturing.',
    study,
  ],
  [
    'earthquake-1880',
    1880,
    '20 July 1880',
    'The July earthquake damages San Pedro Macati',
    community,
    'A contemporary supplement to El Comercio reports major damage to the San Pedro Macati church and to the hacienda house during the night earthquake of 20 July 1880.',
    elComercio1880,
    'The report establishes damage to a casa hacienda but, by itself, does not identify that house with either of the later Olympia or Poblacion buildings.',
    {
      evidenceStatus: 'established',
      relations: {
        barangaySlugs: ['poblacion'],
        eventIds: ['segui-visitation-1831'],
      },
    },
  ],
  [
    'pasig-river-landscape-1887',
    1887,
    '1870s observations · published 1887',
    'San Pedro and Guadalupe in the Pasig River economy',
    transport,
    'Juan Álvarez Guerra’s travel account describes San Pedro Macati and Guadalupe along the Pasig and notes large deposits of quarried Guadalupe stone being transported by banca to supply Manila and its suburbs.',
    alvarezGuerra,
    'The publication date is used for sorting; the journey described in the text occurred during the 1870s.',
    {
      evidenceStatus: 'established',
      relations: {
        barangaySlugs: ['guadalupe-viejo', 'poblacion'],
      },
    },
  ],
  [
    'magtagumpay-1896',
    1896,
    '28 May 1896',
    'Magtagumpay is organized in Culi-Culi',
    war,
    'The National Historical Institute records that Pio del Pilar joined the Katipunan in May 1896 and that the Magtagumpay council was organized in Culi-Culi on 28 May. Del Pilar served as secretary under the name Pang-una and the council used its own war standard.',
    nhiPioDelPilar,
    'This is an institutional biography written decades later, not a surviving Katipunan minute book; the chapter and flag should still be traced to contemporary revolutionary records where possible.',
    {
      evidenceStatus: 'probable',
      relations: {
        barangaySlugs: ['pio-del-pilar'],
        people: [{ label: 'Pio del Pilar' }],
        institutions: [{ label: 'Katipunan · Magtagumpay council' }],
      },
    },
  ],
  [
    'roxas-provisional-hospital-1898',
    1898,
    '1898',
    'Casa de Pedro Roxas listed as a provisional military hospital',
    health,
    'A Spanish military medical account maps the “Casa de Pedro Roxas en San Pedro Macati” among the provisional hospitals supporting Manila during the 1898 campaign.',
    spanishFieldHospital1898,
    'The military label establishes the use and the historical name. BetterMakati does not use this record alone to decide whether the mapped house is the later Olympia Casa Hacienda or another Roxas estate building.',
    {
      evidenceStatus: 'established',
      relations: {
        people: [{ label: 'Pedro P. Roxas' }],
        eventIds: ['roxas-purchase-1851'],
      },
      interpretations: [
        {
          id: 'pedro-roxas-hospital-location',
          label: 'Documented use, location still to be cross-checked',
          summary:
            'The source identifies a Pedro Roxas house at San Pedro Macati as a provisional hospital; exact identification against later photographs, cadastral plans and the two-Casas evidence remains a separate question.',
          sourceRefs: ['aycart-lopez-campana-filipinas', 'sc-roxas-tuason-1907'],
        },
      ],
    },
  ],
  [
    'san-pedro-fighting-1899',
    1899,
    '14–21 February 1899',
    'Fighting repeatedly reaches San Pedro Macati and Guadalupe',
    war,
    'An official U.S. chronological list records engagements at San Pedro Macati on 14, 15, 16, 19, 20 and 21 February 1899, with additional fighting at Guadalupe during the same period.',
    usActions1899,
    'The U.S. list is a military record from one belligerent. It establishes dates and locations of engagements, not a neutral narrative of the fighting.',
    {
      additionalSources: [study, smithsonianKingHq],
      evidenceStatus: 'established',
      relations: {
        barangaySlugs: ['poblacion', 'guadalupe-viejo'],
        people: [
          { label: 'Pio del Pilar' },
          { label: 'Charles King' },
        ],
      },
      media: [
        {
          id: 'king-headquarters-san-pedro-1899',
          kind: 'photograph',
          title: 'General King’s Headquarters, San Pedro Macati',
          source: smithsonianKingHq,
          date: '1899',
          caption:
            'A contemporary Underwood & Underwood stereograph cataloged by the Smithsonian as General King’s headquarters in San Pedro Macati.',
          rights:
            'Usage conditions apply. BetterMakati should link to the Smithsonian record unless publication rights are separately cleared.',
        },
      ],
    },
  ],
  [
    'rizal-province',
    1901,
    '11 June 1901',
    'The Province of Rizal is organized',
    government,
    'Act 137 organized Rizal from the former Province of Manila outside Manila city and the district of Morong: the provincial framework for San Pedro Macati.',
    legal(
      'Philippine Commission · Act 137, §§1–2',
      'https://lawphil.net/statutes/acts/act1901/act_137_1901.html'
    ),
  ],
  [
    'la-porcelanica-1903',
    1903,
    '1903–1911',
    'La Porcelanica brings porcelain production to Makati',
    community,
    'Enrique Zobel de Ayala founded La Porcelanica in 1903, with production beginning the following year under Francisco Quintos and Japanese master potters. The short-lived factory extended Makati’s older clay, brick and pottery economy into porcelain manufacturing.',
    zobelPorcelain,
    'The exact factory location within the hacienda should be kept separate from the still-unresolved identification of the Casa Hacienda site.',
    {
      evidenceStatus: 'established',
      relations: {
        people: [
          { label: 'Enrique Zobel de Ayala' },
          { label: 'Francisco Quintos' },
        ],
        institutions: [{ label: 'La Porcelanica' }],
      },
    },
  ],
  [
    'hacienda-registration-1906',
    1906,
    '19 February 1906 application · 21 December 1907 Supreme Court decision',
    'The hacienda, its tenants and Casa Quinta enter the Torrens record',
    government,
    'Pedro P. Roxas applied to register Hacienda de San Pedro Macati under the Land Registration Act. The Supreme Court record describes about 1,761 hectares, roughly 429 tenants, and a strong-material building called the Casa-Quinta or Casa de Ingenieros occupying 8,430 square meters with its appurtenances.',
    roxasLandCase,
    'The judgment is unusually valuable because it documents the estate, tenants, municipal land uses and Casa Quinta in one legal record. It does not call the building the Poblacion Oficinas.',
    {
      evidenceStatus: 'established',
      relations: {
        people: [{ label: 'Pedro P. Roxas' }],
        eventIds: ['roxas-purchase-1851', 'roxas-provisional-hospital-1898'],
      },
      media: [
        {
          id: 'casa-principal-1910',
          kind: 'photograph',
          title: 'Casa Principal de San Pedro, Makati',
          source: fhlCasaPrincipal1910,
          date: '1910',
          caption:
            'Ayala Archives photograph labeled “Casa Principal de San Pedro, Makati.” It is strong visual evidence for the early twentieth-century estate house, but not by itself proof of continuity back to the Jesuit-period house.',
          rights:
            'Link to the FHL catalog record unless reproduction permission is confirmed.',
        },
        {
          id: 'manila-vicinity-1919',
          kind: 'map',
          title: 'Map of city of Manila and vicinity',
          source: manilaVicinity1919,
          date: '1919',
          caption:
            'The 1915 map corrected to March 1919 captures Makati before the later CBD-scale redevelopment and preserves the relationship among roads, river, open land and built-up areas.',
          rights:
            'Free to use and reuse under the Library of Congress item’s stated rights note.',
        },
      ],
      interpretations: [
        {
          id: 'casa-quinta-identity-chain',
          label: 'What the Torrens-era evidence adds',
          summary:
            'By 1906 the Roxas estate indisputably contained a substantial Casa-Quinta/Casa de Ingenieros. Later labeled photographs can be compared against this legal description, but continuity with the 1773/1831 hacienda house remains a separate historical argument.',
          sourceRefs: [
            'sc-roxas-tuason-1907',
            'fhl-casa-principal-1910',
            'fhl-casa-hacienda-1926',
          ],
        },
      ],
    },
  ],
  [
    'government-orphanage-1917',
    1917,
    'January–February 1917',
    'The Casa Quinta becomes the Government Orphanage',
    health,
    'The Philippine Health Service reconstructed a large Spanish building known as the Casa Quinta at San Pedro Makati for the Government Orphanage. The project adapted the estate building for institutional child care and linked Makati to the beginnings of national public child-welfare administration.',
    healthService1917,
    'Act No. 2671 supplied the charitable appropriation; the Health Service report provides the Makati site and reconstruction details.',
    {
      additionalSources: [act2671, fhlCasaHacienda1926],
      evidenceStatus: 'established',
      relations: {
        people: [{ label: 'José F. Fabella' }],
        institutions: [
          { label: 'Government Orphanage' },
          { label: 'Philippine Health Service' },
        ],
        eventIds: ['hacienda-registration-1906', 'bureau-dependent-children-1919'],
      },
      media: [
        {
          id: 'casa-hacienda-1926',
          kind: 'photograph',
          title: 'Casa Hacienda, Makati',
          source: fhlCasaHacienda1926,
          date: '1926',
          caption:
            'Ayala Archives photograph explicitly labeled “Casa Hacienda, Makati.” It documents the building during the orphanage-era transition.',
          rights:
            'Link to the FHL catalog record unless reproduction permission is confirmed.',
        },
      ],
    },
  ],
  [
    'bureau-dependent-children-1919',
    1919,
    '4 March 1919',
    'The Makati orphanage becomes the Bureau of Dependent Children',
    government,
    'Act No. 2815 reorganized the Government Orphanage established under Act No. 2671 as the Bureau of Dependent Children, turning the Makati institution into a formal national bureau for dependent children.',
    act2815,
    undefined,
    {
      evidenceStatus: 'established',
      relations: {
        institutions: [
          { label: 'Government Orphanage' },
          { label: 'Bureau of Dependent Children' },
        ],
        eventIds: ['government-orphanage-1917'],
      },
    },
  ],
  [
    'casa-hacienda-oficinas-1926',
    1926,
    '1926',
    'Ayala Archives preserves two different hacienda buildings',
    community,
    'Two Ayala Archives photographs dated 1926 distinguish a building labeled “Casa Hacienda, Makati” from another labeled “Hacienda Makati office building” or Oficinas. The paired records are important evidence that the two names should not be casually treated as one structure.',
    fhlCasaHacienda1926,
    'This is an evidence milestone rather than a claim that either 1926 building can yet be traced continuously to the Jesuit period.',
    {
      additionalSources: [fhlOficinas1926, fhlCasaPrincipal1910],
      evidenceStatus: 'established',
      interpretations: [
        {
          id: 'two-casas-1926-archive',
          label: 'The archive distinguishes the buildings',
          summary:
            'The 1926 catalog labels support treating Casa Hacienda and Oficinas as distinct photographic subjects. Their earlier functions, locations and continuity must still be reconstructed from maps, titles and other records.',
          sourceRefs: [
            'fhl-casa-hacienda-1926',
            'fhl-oficinas-hacienda-1926',
            'fhl-casa-principal-1910',
          ],
        },
      ],
    },
  ],
  [
    'electric-railway',
    1906,
    '30 January 1906',
    'Electric railway franchise',
    transport,
    'Act 1446 authorized Charles M. Swift’s Manila–Pasig electric railway, describing a route along San Pedro Macati road.',
    legal(
      'Philippine Commission · Act 1446, §1',
      'https://lawphil.net/statutes/acts/act1906/act_1446_1906.html'
    ),
    'An authorization date, not an opening date.',
  ],
  [
    'guadalupe-station',
    1913,
    '1913',
    'Guadalupe station in an executive order',
    transport,
    'Executive Order 6 identifies Guadalupe passenger station on the Manila–Pasig electric railway and names the municipality San Pedro Macati.',
    legal(
      'Executive Order 6, series of 1913',
      'https://lawphil.net/executive/execord/eo1913/eo_6_1913.html'
    ),
  ],
  [
    'name-makati',
    1914,
    '28 February 1914',
    'San Pedro Macati becomes Makati',
    government,
    'Act 2390 formally changed the municipality’s name to Makati, effective upon passage.',
    legal(
      'Philippine Legislature · Act 2390, §§1–2',
      'https://lawphil.net/statutes/acts/act1914/act_2390_1914.html'
    ),
    'The act uses “San Pedro Macati”, without “de”. This is the naming authority used here.',
  ],
  [
    'nielson-opening',
    1937,
    'July 1937',
    'Nielson Airport inaugurated',
    transport,
    'The airport opened on land leased from Ayala y Cia.',
    library,
  ],
  [
    'pal-flight',
    1941,
    'March 1941',
    'PAL’s first flight leaves Nielson',
    transport,
    'Philippine Air Lines’ first flight departed Nielson for Baguio.',
    library,
  ],
  [
    'military-airfield',
    1941,
    'October 1941',
    'Commercial flights halted',
    war,
    'Civilian carriers relocated to make room for the U.S. Army Air Corps.',
    library,
  ],
  [
    'nielson-attack',
    1941,
    'December 1941',
    'War reaches Nielson Airport',
    war,
    'FHL records attacks on the airport by 9 December.',
    library,
  ],
  [
    'nielson-occupation',
    1942,
    'Japanese occupation',
    'Airport facilities under Japanese control',
    war,
    'The occupying forces used the terminal and radio tower as headquarters.',
    library,
    'Placed within the occupation period; an exact takeover date is not established here.',
  ],
  [
    'nielson-restoration',
    1946,
    '1946',
    'Commercial aviation resumes',
    transport,
    'Restored airport facilities returned to commercial service after the war.',
    library,
  ],
  [
    'nielson-redevelopment',
    1948,
    '1948 · FHL account',
    'From airport to urban district',
    transport,
    'FHL dates the airport’s closure and transfer of permanent facilities to Ayala to 1948.',
    library,
    'Earlier site copy used 1947. Service relocation and final closure dates still need reconciliation.',
  ],
  [
    'municipal-building',
    1962,
    '1962',
    'A new municipal building',
    government,
    'The city profile records construction on land donated by Ayala Securities Corporation.',
    city,
  ],
  [
    'makatimed',
    1969,
    '31 May 1969',
    'Makati Medical Center opens',
    health,
    'The hospital opened to the public, following a project led by physicians Constantino Manahan, Jose Fores, and Mariano Alimurung.',
    {
      label: 'Makati Medical Center · Our History',
      url: 'https://www.makatimed.net.ph/about-us/history/',
      kind: 'Institutional history',
    },
  ],
  [
    'metropolitan-manila',
    1975,
    '7 November 1975',
    'Makati joins Metropolitan Manila',
    government,
    'Presidential Decree 824 included Makati among the municipalities under the new Metropolitan Manila Commission.',
    legal(
      'Presidential Decree 824, §2',
      'https://lawphil.net/statutes/presdecs/pd1975/pd_824_1975.html'
    ),
  ],
  [
    'confetti-protests',
    1983,
    '1980s · late Marcos period',
    'Ayala Avenue and the confetti protests',
    war,
    'Ayala Avenue and Ugarte Field became major venues of opposition protest.',
    city,
    'Period entry; not a single dated event.',
  ],
  [
    'binay-appointment',
    1986,
    '1986',
    'Post-EDSA municipal leadership',
    government,
    'Corazon Aquino appointed Jejomar Binay to head the municipal government after the February Revolution.',
    city,
  ],
  [
    'boundary-case-filed',
    1993,
    '22 November 1993',
    'Taguig files the boundary case',
    government,
    'Taguig brought its territorial case over Fort Bonifacio and the EMBO areas before the Pasig Regional Trial Court.',
    boundary,
  ],
  [
    'library-conversion',
    1994,
    'January 1994',
    'Nielson Tower’s library conversion approved',
    community,
    'Ayala approved adapting the preserved terminal for the heritage library.',
    library,
  ],
  [
    'city-charter',
    1995,
    '2 January 1995',
    'Makati’s city charter enacted',
    government,
    'Republic Act 7854 provided for conversion into a highly urbanized city, subject to ratification. Section 2 expressly preserved resolution of existing boundary disputes.',
    legal(
      'Republic Act 7854 · City Charter',
      'https://lawphil.net/statutes/repacts/ra1995/ra_7854_1995.html'
    ),
  ],
  [
    'cityhood-plebiscite',
    1995,
    '4 February 1995',
    'Residents ratify cityhood',
    government,
    'The city profile dates the successful cityhood plebiscite to 4 February.',
    city,
  ],
  [
    'fhl-opens',
    1996,
    '23 April / 23 August 1996',
    'Filipinas Heritage Library opens',
    community,
    'The library opened to readers in April and was formally inaugurated in August.',
    library,
  ],
  [
    'first-woman-mayor',
    1998,
    '1998',
    'First woman city mayor',
    government,
    'Elenita Binay was elected Makati’s first woman chief executive.',
    city,
  ],
  [
    'yellow-card-award',
    2002,
    '2002',
    'Yellow Card programme recognition',
    health,
    'The city profile records Dubai International Best Practices recognition for the Makati Health Program.',
    city,
  ],
  [
    'rtc-boundary',
    2011,
    '8 July 2011',
    'Trial court rules for Taguig',
    government,
    'The RTC confirmed Fort Bonifacio parcels 3 and 4 as Taguig territory. Later appeals followed; this was not the final appellate ruling.',
    boundary,
  ],
  [
    'library-move',
    2013,
    '2013',
    'FHL moves to Ayala Museum',
    community,
    'The museum’s sixth floor became the library’s new home.',
    library,
  ],
  [
    'abby-election',
    2016,
    '2016',
    'Abigail Binay elected mayor',
    government,
    'Abigail Binay became city mayor after serving as second-district representative.',
    city,
  ],
  [
    'sc-boundary-decision',
    2021,
    '1 December 2021',
    'Supreme Court denies Makati’s petition',
    government,
    'In G.R. 235316, the Court upheld Taguig’s claim on substantive grounds. This decision date differs from later finality and administrative implementation.',
    boundary,
  ],
];
export const makatiHistory: HistoryEvent[] = rows.map(
  ([id, year, date, title, topic, summary, source, note, meta]) => ({
    id,
    year,
    date,
    title,
    topic,
    summary,
    source,
    sources: [source, ...(meta?.additionalSources ?? [])],
    evidenceStatus: meta?.evidenceStatus ?? 'established',
    evidenceNote: meta?.evidenceNote,
    relations: meta?.relations,
    media: meta?.media,
    interpretations: meta?.interpretations,
    note,
  })
);
export const historyResearchGaps = [
  'Precolonial Makati remains under-documented: no Makati-specific archaeological evidence has yet been added to the corpus. Keep regional Namayan context and name-origin traditions separate from locally demonstrated evidence.',
  'Resolve the two-Casas problem without collapsing distinct evidence: compare the documented 1773/1831 casa de Hacienda, the 1775–1826 map sequence, the later Poblacion Oficinas, and the Olympia structure photographed in 1910/1926 against archival property records.',
  'Deepen the 1896–1899 revolutionary record from Filipino and Spanish field documents: verify the Magtagumpay council and flag against contemporary Katipunan material, reconcile Pio del Pilar’s conflicting birth-year traditions, and map the San Pedro/Guadalupe operations beyond U.S. military records.',
  'Complete the 1900–1934 social landscape beyond institutions: verify the 1918 barrio census, municipal presidencia and schools, workers and migration, local markets and industries, Santa Ana/Tejeros leisure economy, and the 1925–1926 transition from the Makati orphanage to Welfareville.',
  'Complete the 2022–2023 boundary finality and implementation chronology, and subsequent civic milestones, from dated official records.',
];
