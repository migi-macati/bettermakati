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
const paresBritoEncomienda: HistorySource = {
  id: 'pares-brito-encomienda-nayon-calilaya',
  label:
    'PARES · Pedro de Brito v. fiscal over the encomiendas of Nayon and Calilaya',
  url: 'https://pares.cultura.gob.es/ParesBusquedas20/catalogo/description/85968',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'archival document',
  creator: 'Consejo de Indias',
  repository: 'Archivo General de Indias / PARES',
  date: '1597–1607',
  locator: 'ES.41091.AGI/23//ESCRIBANIA,403A',
  citationNote:
    'The archival catalog documents Brito as an encomendero in litigation over Nayon and Calilaya. It does not identify the Buenavista agricultural estate in Makati as either of those encomiendas.',
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
const colinBuenavista: HistorySource = {
  id: 'colin-labor-evangelica-buenavista',
  label: 'Francisco Colín · Labor evangélica · foundation of San Pedro',
  url: 'https://archive.org/details/laborevangelica00chirgoog/page/124/mode/2up?view=theater',
  kind: 'Scholarly account',
  evidenceLevel: 'Near-primary',
  format: 'archival document',
  creator: 'Francisco Colín, drawing on Pedro Chirino; annotated edition by Pablo Pastells',
  repository: 'Internet Archive',
  date: '1663 text; annotated edition 1900–1902',
  locator: 'Part I · chapter IX · foundation of the House of Probation of San Pedro',
  citationNote:
    'Records the 19 October 1607 foundation deed, describes Buenavista as a “montecillo, o altozano,” pairs it with the nearby Guadalupe hill, and preserves a Jesuit report of what local naturales said about the hills’ medicinal abundance before Spanish rule.',
};
const jesuitRelation1639: HistorySource = {
  id: 'jesuit-relation-san-pedro-1639',
  label: 'Jesuit relation on the 1639 Sangley uprising · San Pedro Macati',
  url: 'https://archive.org/details/woodstockletters6611unse/page/120/mode/2up?q=macati',
  kind: 'Scholarly account',
  evidenceLevel: 'Near-primary',
  format: 'archival document',
  creator: 'Anonymous Jesuit relation, 1639–1640; reproduced in Woodstock Letters',
  repository: 'Internet Archive / Woodstock Letters',
  date: '1639–1640 relation; reproduced 1937',
  locator: 'Account of the attack on the San Pedro novitiate',
  citationNote:
    'The reproduced contemporary relation says that more than one hundred people from the “pueblo de los naturales” took refuge at San Pedro. The phrase proves a native settlement was being called a pueblo in the account, but does not by itself establish formal municipal erection.',
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
const augustinianGuadalupeProfile: HistorySource = {
  id: 'osa-guadalupe-historical-profile-2024',
  label:
    'Augustinian Province · “A Historical Profile of the Monasterio de Guadalupe”',
  url: 'https://augustiniansphilippines.net/wp-content/uploads/2024/08/Cor-Inquietum-Newsletter-2024-No.-1-Website-Format.pdf',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  creator: 'Ric Anthony A. Reyes, OSA',
  repository: 'Augustinian Province of Santo Niño de Cebu – Philippines',
  date: '2024',
  locator: 'Cor Inquietum, Issue 1, pp. 34–35 · citing Libro del Gobierno, fol. 124',
  citationNote:
    'Cites the 7 March 1601 provincial council record receiving Nuestra Señora de Gracia en los Montes as a religious house and discusses the elevated Guadalupe site above the Pasig.',
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
const fhlNielsonHistory: HistorySource = {
  id: 'fhl-nielson-history',
  label: 'Filipinas Heritage Library · History of the Filipinas Heritage Library / Nielson Airport',
  url: 'https://www.filipinaslibrary.org.ph/articles/history-of-the-filipinas-heritage-library/',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  repository: 'Filipinas Heritage Library',
  citationNote:
    'Institutional history covering the construction, wartime military use, Japanese occupation, liberation, restoration and closure of Nielson Airport.',
};
const fhlMiningAviation: HistorySource = {
  id: 'fhl-mining-aviation',
  label: 'Filipinas Heritage Library · “Mining and Aviation”',
  url: 'https://www.filipinaslibrary.org.ph/articles/mining-and-aviation/',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  repository: 'Filipinas Heritage Library',
  citationNote:
    'Dates Nielson Airport’s inauguration to 17 July 1937 and summarizes its prewar aviation role.',
};
const greaterManila1942: HistorySource = {
  id: 'eo-400-greater-manila-1942',
  label: 'Executive Order No. 400 · Creating the City of Greater Manila',
  url: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/5/84503',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Supreme Court E-Library',
  date: '1 January 1942',
  citationNote:
    'Expressly included the municipality of Makati in the City of Greater Manila.',
};
const restoreMakati1945: HistorySource = {
  id: 'eo-58-restore-makati-1945',
  label: 'Executive Order No. 58 · Reducing the territory of Greater Manila',
  url: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/5/76937',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Supreme Court E-Library',
  date: '26 July 1945; effective 1 August 1945',
  citationNote:
    'Removed Makati from Greater Manila and restored it as a municipality of Rizal, while temporarily retaining Greater Manila police jurisdiction.',
};
const manilaSouth1945: HistorySource = {
  id: 'ams-manila-south-1945',
  label: 'U.S. Army Map Service · Manila South, Philippines',
  url: 'https://maps.lib.utexas.edu/maps/ams/philippines_city_plans/',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'historical map',
  creator: 'U.S. Army Map Service',
  repository: 'Perry-Castañeda Library Map Collection · University of Texas at Austin',
  date: '1945',
  locator: 'Manila South · scale 1:12,500 · Series S901',
  citationNote:
    'Wartime city plan showing the built and transport landscape south of the Pasig River, including Makati.',
  rights:
    'U.S. federal government map; public-domain status is also identified in the linked derivative catalog records.',
};
const ayalaHistory: HistorySource = {
  id: 'ayala-corporation-history',
  label: 'Ayala Corporation · History',
  url: 'https://ayala.com/about-ayala/history/',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  repository: 'Ayala Corporation',
  citationNote:
    'Corporate institutional history identifying the postwar Makati master plan and development of the business, commercial and residential district.',
};
const forbesParkDeed: HistorySource = {
  id: 'sc-forbes-park-deed-1949',
  label: 'Supreme Court · RMFPU Holdings, Inc. v. Forbes Park Association, Inc.',
  url: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/1/67788',
  kind: 'Legal record',
  evidenceLevel: 'Near-primary',
  format: 'law',
  repository: 'Supreme Court E-Library',
  date: '2021 decision reproducing title restrictions effective 1 January 1949',
  citationNote:
    'Reproduces the deed restrictions annotated on Forbes Park titles, including their effectivity from 1 January 1949 and Ayala Securities Corporation as seller.',
};
const ayalaTimeline2008: HistorySource = {
  id: 'ayala-2008-history-timeline',
  label: 'Ayala Corporation · 2008 Annual Report history timeline',
  url: 'https://ayala.com/app/uploads/2023/05/AC-2008-AR.pdf',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  repository: 'Ayala Corporation',
  date: '2008',
  citationNote:
    'Corporate timeline dates Ayala Securities to 1948, the Makati master plan and Forbes Park opening to 1949, and Makati Commercial Center development to 1960.',
};
const barrioCharter1959: HistorySource = {
  id: 'ra-2370-barrio-charter',
  label: 'Republic Act No. 2370 · Barrio Charter Act',
  url: 'https://lawphil.net/statutes/repacts/ra1959/ra_2370_1959.html',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Lawphil',
  date: '20 June 1959; effective 1 January 1960',
  citationNote:
    'Made barrios quasi-municipal corporations, provided for elected barrio councils, and permitted creation of new barrios meeting the statutory requirements.',
};
const spanishCensus1887: HistorySource = {
  id: 'us-gazetteer-san-pedro-macati-1887-census',
  label:
    'U.S. Bureau of Insular Affairs · Pronouncing Gazetteer and Geographical Dictionary of the Philippine Islands',
  url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/A_pronouncing_gazetteer_and_geographical_dictionary_of_the_Philippine_islands_.._%28IA_pronouncinggazet00unit%29.pdf',
  kind: 'Institutional history',
  evidenceLevel: 'Near-primary',
  format: 'dataset',
  creator: 'United States Bureau of Insular Affairs',
  repository: 'U.S. Government Printing Office',
  date: '1902',
  locator: 'Pueblos table, p. 61',
  citationNote:
    'The official compilation reproduces the 1887 Spanish census count for San Pedro Macati as 3,625 and gives a later 1898–1899 estimate of 3,921.',
};
const psaPopulation: HistorySource = {
  id: 'psa-ncr-rset-2016-population',
  label: 'Philippine Statistics Authority · NCR Regional Social and Economic Trends 2016',
  url: 'https://rssoncr.psa.gov.ph/system/files/publication/RSET-NCR%202016.pdf',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'dataset',
  repository: 'Philippine Statistics Authority · NCR',
  date: '2016 compilation',
  locator: 'Table 1.1 · censal years 1948–2015',
  citationNote:
    'Official census series reports Makati at 41,335 people in 1948, 114,540 in 1960 and 264,918 in 1970.',
};
const makatiPoblacionHistory: HistorySource = {
  id: 'makati-poblacion-history',
  label: 'City Government of Makati · Barangay Poblacion history',
  url: 'https://www.makati.gov.ph/barangay/poblacion/34page?tab=1',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  repository: 'City Government of Makati',
  citationNote:
    'City history notes the 1961 order to build a new municipal building at the present site on donated Ayala land.',
};
const makatiMedHistory: HistorySource = {
  id: 'makati-med-history',
  label: 'Makati Medical Center · Our History',
  url: 'https://www.makatimed.net.ph/about-us/history/',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  repository: 'Makati Medical Center',
  date: 'institutional history',
  citationNote:
    'Dates the hospital’s public opening to 31 May 1969 and places its planning within Makati’s rapid residential and commercial growth.',
};
const martialLaw1081: HistorySource = {
  id: 'proc-1081-martial-law',
  label: 'Proclamation No. 1081 · Proclaiming a State of Martial Law',
  url: 'https://lawphil.net/executive/proc/proc1972/proc_1081_1972.html',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Lawphil',
  date: '21 September 1972',
  citationNote:
    'Primary text of the proclamation. Its recitals are the Marcos administration’s stated justifications and should be attributed as such rather than presented as independent findings.',
};
const pd824MetroManila: HistorySource = {
  id: 'pd-824-metropolitan-manila',
  label: 'Presidential Decree No. 824 · Creating Metropolitan Manila',
  url: 'https://lawphil.net/statutes/presdecs/pd1975/pd_824_1975.html',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Lawphil',
  date: '7 November 1975',
  citationNote:
    'Created Metropolitan Manila and the Metropolitan Manila Commission and expressly included Makati.',
};
const mbcFounding: HistorySource = {
  id: 'mbc-founding-1981',
  label: 'Makati Business Club · “Creating the Forum for Constructive Ideas”',
  url: 'https://mbc.com.ph/2016/08/23/creating-the-forum-for-constructive-ideas/',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  creator: 'Cesar A. Buenaventura',
  repository: 'Makati Business Club',
  date: 'speech delivered 29 January 1997',
  locator: 'MBC launched 29 October 1981 at Nielson Tower',
  citationNote:
    'Retrospective account by an MBC founder/trustee describing the club’s formation, early public-policy agenda and 1983 media dialogue.',
};
const wpConfetti1983: HistorySource = {
  id: 'washington-post-makati-protest-1983',
  label: 'The Washington Post · “Thousands in Manila Hold Anti-Marcos Protest”',
  url: 'https://www.washingtonpost.com/archive/politics/1983/09/17/thousands-in-manila-hold-anti-marcos-protest/24016ee8-2a6f-471d-8d13-af5850512dc7/',
  kind: 'Scholarly account',
  evidenceLevel: 'Primary',
  format: 'newspaper',
  repository: 'The Washington Post',
  date: '17 September 1983',
  locator: 'Report on 16 September 1983 Makati protest',
  citationNote:
    'Contemporary news report describing the office-worker walkout, yellow confetti and estimated crowd on Ayala Avenue.',
};
const nhcpAquino1983Archive: HistorySource = {
  id: 'nhcp-national-memory-aquino-1983',
  label: 'NHCP National Memory Project · Ninoy Aquino 1983 periodical collection',
  url: 'https://memory.nhcp.gov.ph/collections/?ptermid=3706',
  kind: 'Institutional history',
  evidenceLevel: 'Primary',
  format: 'institutional record',
  repository: 'National Historical Commission of the Philippines',
  date: '1983 periodicals',
  citationNote:
    'Archival collection includes Mr. & Ms. issues from September 1983 and WHO’s “From Makati to Mendiola: A Cry of Protest.”',
};
const ugarte1986: HistorySource = {
  id: 'inquirer-ugarte-tent-city-1986',
  label: 'Philippine Daily Inquirer · “The nonviolent revolution”',
  url: 'https://opinion.inquirer.net/92997/the-nonviolent-revolution',
  kind: 'Scholarly account',
  evidenceLevel: 'Secondary',
  format: 'newspaper',
  repository: 'Philippine Daily Inquirer',
  date: '2016 retrospective',
  citationNote:
    'Retrospective account of nonviolent organizing that describes the Ugarte Field tent city during the February 1986 snap-election period.',
};
const makatiPostEdsa: HistorySource = {
  id: 'makati-city-history-post-edsa',
  label: 'City Government of Makati · city historical profile',
  url: 'https://www.makati.gov.ph/assets/uploads/downloads/901/845/pdf/90109032018164725.pdf',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  repository: 'City Government of Makati',
  citationNote:
    'Official city historical profile records Jejomar Binay’s appointment after the February 1986 Revolution.',
};
const binayAppointment1986: HistorySource = {
  id: 'philstar-binay-appointment-1986',
  label: 'The Philippine Star · retrospective on Jejomar Binay’s appointment',
  url: 'https://www.philstar.com/lifestyle/health-and-family/2015/10/13/1510440/candidate-number-1-jejomar-binay-philippine-presidentiables-2016-series-part-1-3/amp/',
  kind: 'Scholarly account',
  evidenceLevel: 'Secondary',
  format: 'newspaper',
  repository: 'The Philippine Star',
  date: '2015 retrospective',
  locator: 'Dates appointment to 27 February 1986',
};
const localElections1988: HistorySource = {
  id: 'ra-6637-local-elections-1988',
  label: 'Republic Act No. 6637 · 18 January 1988 local elections',
  url: 'https://lawphil.net/statutes/repacts/ra1987/ra_6637_1987.html',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Lawphil',
  date: '21 November 1987',
  citationNote:
    'Set the nationwide local elections for 18 January 1988, including municipal officials in Metropolitan Manila.',
};
const makatiHistoryProfile: HistorySource = {
  id: 'makati-official-history-profile',
  label: 'City Government of Makati · historical profile',
  url: 'https://www.makati.gov.ph/assets/uploads/downloads/901/845/pdf/90109032018164725.pdf',
  kind: 'Institutional history',
  evidenceLevel: 'Secondary',
  format: 'institutional record',
  repository: 'City Government of Makati',
  citationNote:
    'Official historical profile records Binay’s January 1988 election, 1992 re-election, and the 1995 cityhood plebiscite.',
};
const makatiCityCharter: HistorySource = {
  id: 'ra-7854-makati-city-charter',
  label: 'Republic Act No. 7854 · Charter of the City of Makati',
  url: 'https://lawphil.net/statutes/repacts/ra1995/ra_7854_1995.html',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Lawphil',
  date: '2 January 1995',
  citationNote:
    'Converted Makati into a highly urbanized city subject to plebiscite ratification and expressly preserved pending boundary disputes.',
};
const taguigMakati2016: HistorySource = {
  id: 'sc-taguig-makati-2016',
  label: 'Supreme Court · City of Taguig v. City of Makati, G.R. No. 208393',
  url: 'https://lawphil.net/judjuris/juri2016/jun2016/gr_208393_2016.html',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Supreme Court / Lawphil',
  date: '15 June 2016',
  citationNote:
    'Held that Makati had engaged in willful and deliberate forum shopping in pursuing simultaneous remedies in the territorial dispute.',
};
const taguigMakati2021: HistorySource = {
  id: 'sc-makati-taguig-2021',
  label: 'Supreme Court · Municipality of Makati v. Municipality of Taguig, G.R. No. 235316',
  url: 'https://lawphil.net/judjuris/juri2021/dec2021/gr_235316_2021.html',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'law',
  repository: 'Supreme Court / Lawphil',
  date: '1 December 2021',
  citationNote:
    'Contains the procedural history from the 1993 filing through the 2017 Court of Appeals resolutions and resolves the territorial dispute on the merits.',
};
const scFinality2022: HistorySource = {
  id: 'sc-makati-taguig-finality-2022',
  label: 'Supreme Court · resolution denying reconsideration with finality in G.R. No. 235316',
  url: 'https://sc.judiciary.gov.ph/sc-writes-finis-to-makati-city-taguig-city-land-dispute/',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'institutional record',
  repository: 'Supreme Court of the Philippines',
  date: '28 September 2022; public notice 4 April 2023',
  citationNote:
    'Supreme Court public information notice states that the Special Third Division denied Makati’s omnibus motion for reconsideration with finality.',
};
const scTransition2023: HistorySource = {
  id: 'sc-jurisdiction-transition-2023',
  label: 'Supreme Court · guidelines on jurisdiction transfer for the Taguig areas',
  url: 'https://sc.judiciary.gov.ph/sc-issues-guidelines-on-transfer-and-assumption-of-jurisdiction-over-areas-in-taguig-city/',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'institutional record',
  repository: 'Supreme Court of the Philippines',
  date: '14 November 2023',
  citationNote:
    'Set court and prosecution transition rules for cases and offenses in the areas declared part of Taguig, including an operational cutoff on 1 January 2024.',
};
const comelecEmbo2024: HistorySource = {
  id: 'comelec-embo-districts-2024',
  label: 'COMELEC Resolution No. 11069 · Taguig legislative and councilor districts',
  url: 'https://www.comelec.gov.ph/php-tpls-attachments/2025NLE/Resolutions/com_res_11069.pdf',
  kind: 'Legal record',
  evidenceLevel: 'Primary',
  format: 'institutional record',
  repository: 'Commission on Elections',
  date: '2024',
  citationNote:
    'Assigned the ten EMBO barangays to Taguig’s first and second legislative/councilor districts for subsequent elections.',
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
    '1578 · later marker tradition',
    'San Pedro Makati described as a visita of Santa Ana de Sapa',
    community,
    'The City of Makati history and the 1991 NHCP marker describe San Pedro Makati as a visita of Santa Ana de Sapa in 1578.',
    city,
    'These are retrospective accounts; no contemporaneous 1578 foundation or visitation instrument has yet been added to the BetterMakati corpus.',
    {
      additionalSources: [nhcpMakati, colinSanPedro],
      evidenceStatus: 'probable',
      evidenceNote:
        'This entry records the 1578 tradition only. It does not extend visita status continuously to 1670: by 1656 Francisco Colín described San Pedro as a Jesuit residence and novitiate with an estate workforce and ministry to nearby people.',
      relations: {
        eventIds: ['san-pedro-estate-1656', 'town-1670'],
      },
    },
  ],
  [
    'guadalupe-foundations',
    1601,
    '1601–1629',
    'Guadalupe church and monastery take shape on the high ground',
    community,
    'An Augustinian historical profile citing the order’s Libro del Gobierno records the reception on 7 March 1601 of a religious house dedicated to Nuestra Señora de Gracia en los Montes. Colín’s seventeenth-century Labor evangélica independently describes the Augustinian convent and Guadalupe church as standing on another hill very near the Buenavista hill of San Pedro.',
    nhcpGuadalupe,
    'The 1601 institutional act is supported through a modern Augustinian profile citing the order’s governance book; the NHCP marker supplies the 1629 completion date. Colín is the stronger early source for the paired high-ground landscape itself.',
    {
      additionalSources: [augustinianGuadalupeProfile, colinBuenavista],
      evidenceStatus: 'probable',
      evidenceNote:
        'Colín describes the San Pedro house as founded on a “montecillo” and the Guadalupe convent and church on another nearby hill. This directly supports a seventeenth-century landscape of paired elevated sites above the Pasig.',
      relations: {
        barangaySlugs: ['guadalupe-viejo'],
        institutions: [{ label: 'Order of Saint Augustine' }],
      },
    },
  ],
  [
    'cattle-fields',
    1606,
    'June–July 1606',
    'Brito’s cattle ranch sits beside older cultivated settlements',
    community,
    'A 1606 dispute concerned cattle from Pedro de Brito’s estancia damaging Indigenous cultivated fields. The annotated Labor evangélica records the ranch near the pueblos of Capaynamayan and Santa Ana and cites a 30 June 1606 fiscal letter seeking stronger separation of cattle ranches from settlements and sementeras.',
    study,
    'This evidence locates Brito’s agricultural estate in relation to existing native settlements; it does not show that those settlements formed part of a Makati encomienda held by Brito.',
    {
      additionalSources: [colinBuenavista],
      evidenceStatus: 'established',
      relations: {
        people: [{ label: 'Pedro de Brito' }],
        eventIds: ['buenavista-foundation'],
      },
    },
  ],
  [
    'buenavista-foundation',
    1607,
    '19 October 1607',
    'Buenavista endowed for the Jesuit novitiate',
    community,
    'Pedro de Brito and Ana de Herrera endowed the Jesuits with an agricultural estate called Buenavista and enlarged the endowment to 14,000 pesos. The public foundation deed of 19 October 1607 obliged the Jesuit provincial Gregorio López to establish a church and house for novices on the donated lands.',
    colinBuenavista,
    'Brito was also an encomendero, but the surviving evidence presently in the BetterMakati corpus should not collapse his Buenavista landholding and his encomienda rights into the same legal institution.',
    {
      additionalSources: [britoStudy, nhcpSanPedro, nhcpMakati, paresBritoEncomienda],
      evidenceStatus: 'established',
      evidenceNote:
        'Labor evangélica gives the public foundation deed as 19 October 1607 and describes Buenavista as an estancia and tierras de labor on a “montecillo, o altozano.” PARES separately documents Brito’s encomienda litigation over Nayon and Calilaya. The later NHCP Makati marker calls Makati an encomienda granted to Brito in 1608, but a primary Makati encomienda grant has not yet been located.',
      relations: {
        barangaySlugs: ['poblacion'],
        people: [
          { label: 'Pedro de Brito' },
          { label: 'Ana de Herrera' },
          { label: 'Gregorio López, S.J.' },
        ],
        institutions: [{ label: 'Society of Jesus' }],
        eventIds: ['san-pedro-church', 'san-pedro-estate-1656'],
      },
      interpretations: [
        {
          id: 'brito-estate-versus-encomienda',
          label: 'Estate and encomienda are not interchangeable',
          summary:
            'The documented 1607 Buenavista donation was an agricultural landholding endowed to the Jesuits. Brito’s status as an encomendero is independently documented for Nayon and Calilaya. Until a primary Makati encomienda grant is located, BetterMakati treats the NHCP marker’s 1608 encomienda statement as a separate retrospective claim rather than proof that Buenavista itself was the encomienda.',
          sourceRefs: [
            'colin-labor-evangelica-buenavista',
            'manchado-lopez-brito-2024',
            'pares-brito-encomienda-nayon-calilaya',
            'nhcp-makati-marker',
          ],
        },
        {
          id: 'early-makati-hills-native-memory',
          label: 'What Colín records about the hills and local memory',
          summary:
            'Colín describes Buenavista as a small hill or rise and the nearby Guadalupe complex as standing on another hill. He adds that local naturales said the medicinal abundance of these hills also existed in the “time of the Moros” before the Spaniards arrived. This is a seventeenth-century Jesuit record of Indigenous oral memory, not a direct Indigenous-authored account.',
          sourceRefs: ['colin-labor-evangelica-buenavista'],
        },
      ],
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
    'uprising-1639',
    1639,
    '28 November 1639',
    'The 1639 uprising reaches San Pedro and its native settlement',
    war,
    'A Jesuit relation from the 1639 Sangley uprising says the rebels reached the San Pedro novitiate and that more than one hundred people from the “pueblo de los naturales” gathered there and resisted before the house was burned.',
    jesuitRelation1639,
    'The relation is a colonial Jesuit account of violent conflict and must be read critically. Its phrase “pueblo de los naturales” is nevertheless important evidence for the existence and terminology of a native settlement at San Pedro by 1639.',
    {
      additionalSources: [study],
      evidenceStatus: 'established',
      relations: {
        barangaySlugs: ['poblacion'],
        institutions: [{ label: 'Society of Jesus' }],
        eventIds: ['town-1670', 'san-pedro-estate-1656'],
      },
    },
  ],
  [
    'san-pedro-estate-1656',
    1656,
    '1656 · Colín survey',
    'San Pedro is documented as estate, residence and native ministry',
    community,
    'Francisco Colín’s near-contemporary survey describes two Jesuits at the House of San Pedro, sixty tributarios of Tagalog Indians working the estate, and religious ministry to people in the surrounding lands and settlements.',
    colinSanPedro,
    'This is evidence about the documented estate community, not a complete census of everyone living in what is now Makati. Colín’s institutional language also does not by itself determine San Pedro’s civil status as a pueblo or bayan.',
    {
      evidenceStatus: 'established',
      relations: {
        barangaySlugs: ['poblacion'],
        institutions: [{ label: 'Society of Jesus' }],
        eventIds: ['buenavista-foundation', 'san-pedro-church', 'town-1670'],
      },
    },
  ],
  [
    'town-1670',
    1670,
    '1670 · NHCP marker',
    'San Pedro Makati is retrospectively dated as becoming a bayan',
    government,
    'The NHCP’s 1991 Makati historical marker states “naging bayan, 1670,” making 1670 the official retrospective date presently available for San Pedro Makati’s town status.',
    nhcpMakati,
    'A contemporaneous 1670 town-creation or erection instrument has not yet been located in the BetterMakati research corpus.',
    {
      additionalSources: [jesuitRelation1639, colinSanPedro],
      evidenceStatus: 'probable',
      evidenceNote:
        'Do not read “bayan,” “pueblo” and “visita” as interchangeable categories. A 1639 Jesuit relation already refers to a “pueblo de los naturales” at San Pedro, while the 1656 survey describes a Jesuit residence, estate workforce and native ministry. Neither text is a civil erection instrument, so the legal basis and exact meaning of the marker’s 1670 “naging bayan” date remain open.',
      relations: {
        eventIds: ['visita', 'uprising-1639', 'san-pedro-estate-1656'],
      },
      interpretations: [
        {
          id: 'bayan-versus-visita-1670',
          label: 'Civil and ecclesiastical labels answer different questions',
          summary:
            'The NHCP marker supplies a retrospective civil milestone in 1670. The 1578 “visita” tradition describes an ecclesiastical relationship, while a 1639 relation already uses “pueblo de los naturales” for a San Pedro native settlement. Without the original erection record, the timeline should not manufacture a precise institutional handoff among these labels.',
          sourceRefs: [
            'nhcp-makati-marker',
            'jesuit-relation-san-pedro-1639',
            'colin-san-pedro-1656',
          ],
        },
      ],
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
    'spanish-census-1887',
    1887,
    '1887 Spanish census · published in a 1902 U.S. compilation',
    'Spanish census counts 3,625 people in San Pedro Macati',
    community,
    'The U.S. Bureau of Insular Affairs’ 1902 official gazetteer reproduces the 1887 Spanish census population of San Pedro Macati as 3,625. The same table gives a later 1898–1899 estimate of 3,921.',
    spanishCensus1887,
    'The 1887 figure is reported through an official 1902 U.S. government compilation rather than the original Spanish census register. It should therefore be cited as a reproduced historical census count.',
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['archbishop-visitation-1773', 'segui-visitation-1831'],
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
    'nielson-opening',
    1937,
    '17 July 1937',
    'Nielson Airport opens in Makati',
    transport,
    'Nielson Airport was inaugurated on 17 July 1937 on 42 hectares leased from Ayala y Cia., giving Manila a major civil airport at the edge of Makati’s then-sparsely built hacienda landscape.',
    fhlMiningAviation,
    undefined,
    {
      additionalSources: [fhlNielsonHistory],
      evidenceStatus: 'established',
      relations: {
        institutions: [
          { label: 'Nielson Airport' },
          { label: 'Ayala y Cia.' },
        ],
        people: [
          { label: 'Laurie Reuben Nielson' },
          { label: 'Enrique Zobel de Ayala' },
        ],
      },
    },
  ],
  [
    'pal-flight',
    1941,
    '15 March 1941',
    'PAL’s first flight leaves Nielson',
    transport,
    'Two days after the company was renamed Philippine Air Lines, its inaugural flight departed Nielson Airport for Baguio on 15 March 1941.',
    {
      id: 'fhl-pal-before-war',
      label: 'Filipinas Heritage Library · “Philippine Air Lines: Before the War”',
      url: 'https://www.filipinaslibrary.org.ph/articles/philippine-air-lines-before-the-war/',
      kind: 'Institutional history',
      evidenceLevel: 'Secondary',
      format: 'institutional record',
      repository: 'Filipinas Heritage Library',
    },
    undefined,
    {
      evidenceStatus: 'established',
      relations: {
        institutions: [
          { label: 'Philippine Air Lines' },
          { label: 'Nielson Airport' },
        ],
      },
    },
  ],
  [
    'military-airfield',
    1941,
    'October 1941',
    'Nielson shifts from civil airport to military headquarters',
    war,
    'Commercial flights were halted in October 1941 as private carriers were ordered to relocate and the Far East Air Force headquarters was established at Nielson Airport.',
    fhlNielsonHistory,
    undefined,
    {
      evidenceStatus: 'established',
      relations: {
        institutions: [
          { label: 'Far East Air Force' },
          { label: 'Nielson Airport' },
        ],
        eventIds: ['nielson-opening', 'nielson-attack'],
      },
    },
  ],
  [
    'nielson-attack',
    1941,
    '8–9 December 1941',
    'Japanese attacks reach Nielson Airport',
    war,
    'After the Japanese attack on the Philippines began on 8 December, Nielson’s Far East Air Force headquarters received warnings from northern Luzon. By 9 December the airport itself was under attack.',
    fhlNielsonHistory,
    'The entry describes the opening phase of the Pacific War in the Philippines; it does not imply that Makati’s civilian experience was limited to the airfield.',
    {
      evidenceStatus: 'established',
      relations: {
        institutions: [
          { label: 'Far East Air Force' },
          { label: 'Nielson Airport' },
        ],
        eventIds: ['military-airfield', 'nielson-occupation'],
      },
    },
  ],
  [
    'greater-manila-1942',
    1942,
    '1 January 1942',
    'Makati is incorporated into the City of Greater Manila',
    government,
    'Executive Order No. 400 incorporated Makati, together with Manila, Quezon City and several neighboring municipalities, into the wartime City of Greater Manila. Makati’s mayor became an assistant mayor with jurisdiction limited to the former municipal boundaries.',
    greaterManila1942,
    'This was a legal-administrative reorganization during the emergency at the opening of the Japanese occupation, not the same institution as the post-1975 Metropolitan Manila government.',
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['makati-restored-1945'],
      },
    },
  ],
  [
    'nielson-occupation',
    1942,
    '1942–1945',
    'Japanese forces use Nielson as a headquarters',
    war,
    'After U.S. forces withdrew, Japanese occupation forces sequestered Nielson Airport and used its radio tower and passenger terminal as headquarters until Allied forces recovered the airport during the liberation of Manila.',
    fhlNielsonHistory,
    'The source establishes the military reuse of the airport but does not provide a complete chronology of wartime activity elsewhere in Makati.',
    {
      evidenceStatus: 'established',
      relations: {
        institutions: [{ label: 'Nielson Airport' }],
        eventIds: ['nielson-attack'],
      },
    },
  ],
  [
    'makati-restored-1945',
    1945,
    '1 August 1945',
    'Makati is restored as a municipality of Rizal',
    government,
    'Executive Order No. 58 removed Makati from Greater Manila and restored it to its prewar status as a municipality of Rizal effective 1 August 1945. Greater Manila’s police jurisdiction temporarily continued over the restored municipalities.',
    restoreMakati1945,
    undefined,
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['greater-manila-1942'],
      },
      media: [
        {
          id: 'manila-south-1945',
          kind: 'map',
          title: 'Manila South, Philippines',
          source: manilaSouth1945,
          date: '1945',
          caption:
            'U.S. Army Map Service city plan showing Makati and the wider southern Manila landscape at the end of the war.',
          rights:
            'Public-domain U.S. federal government map; use the high-resolution institutional scan when publishing.',
        },
      ],
    },
  ],
  [
    'nielson-restoration',
    1946,
    '14 February 1946',
    'Commercial aviation resumes at Nielson',
    transport,
    'After wartime damage was repaired, Philippine Air Lines resumed commercial service from Nielson Airport on 14 February 1946.',
    {
      id: 'fhl-commercial-air-travel',
      label: 'Filipinas Heritage Library · “Commercial Air Travel in the Philippines: The Early Years”',
      url: 'https://www.filipinaslibrary.org.ph/articles/commercial-air-travel-in-the-philippines-the-early-years/',
      kind: 'Institutional history',
      evidenceLevel: 'Secondary',
      format: 'institutional record',
      repository: 'Filipinas Heritage Library',
    },
    undefined,
    {
      additionalSources: [fhlNielsonHistory],
      evidenceStatus: 'established',
      relations: {
        institutions: [
          { label: 'Philippine Air Lines' },
          { label: 'Nielson Airport' },
        ],
      },
    },
  ],
  [
    'nielson-redevelopment',
    1948,
    '1948',
    'Nielson closes and its airfield becomes development land',
    transport,
    'Nielson Airport ceased Makati operations in 1948 and its permanent facilities reverted to Ayala. The former runways were subsequently absorbed into the street framework of the emerging commercial and business district.',
    fhlNielsonHistory,
    'The closure marks a land-use transition rather than an overnight conversion; redevelopment unfolded over the following decades.',
    {
      additionalSources: [ayalaHistory, ayalaTimeline2008],
      evidenceStatus: 'established',
      relations: {
        institutions: [
          { label: 'Nielson Airport' },
          { label: 'Ayala y Cia.' },
        ],
        eventIds: ['makati-master-plan-1949', 'makati-commercial-center-1960'],
      },
    },
  ],
  [
    'makati-master-plan-1949',
    1949,
    '1949',
    'Ayala’s postwar Makati master plan moves into implementation',
    transport,
    'Ayala’s postwar plan reorganized large parts of the former hacienda and airfield into residential, business and commercial districts. Forbes Park opened as the first major high-end residential village in this new development pattern.',
    ayalaTimeline2008,
    undefined,
    {
      additionalSources: [ayalaHistory, forbesParkDeed],
      evidenceStatus: 'established',
      relations: {
        institutions: [
          { label: 'Ayala Securities Corporation' },
          { label: 'Forbes Park Association' },
        ],
        people: [{ label: 'Joseph R. McMicking' }],
        eventIds: ['nielson-redevelopment', 'makati-commercial-center-1960'],
      },
    },
  ],

  [
    'barrio-charter-1960',
    1960,
    '1 January 1960',
    'The Barrio Charter changes local community government',
    government,
    'Republic Act No. 2370 took effect nationwide on 1 January 1960, giving barrios quasi-municipal corporate status, elected councils and a legal path for creating new barrios. These rules formed part of the governance framework through which fast-growing Makati communities were reorganized during the postwar population boom.',
    barrioCharter1959,
    'BetterMakati does not use this national law by itself to assign a 1960 creation date to every present-day Makati barangay; individual barangay origins require their own local resolutions and records.',
    {
      evidenceStatus: 'established',
    },
  ],
  [
    'makati-commercial-center-1960',
    1960,
    '1960',
    'Development of the Makati Commercial Center begins',
    transport,
    'Ayala’s institutional timeline dates development of the Makati Commercial Center to 1960, advancing the commercial phase of the postwar master plan around Ayala and Makati avenues.',
    ayalaTimeline2008,
    undefined,
    {
      evidenceStatus: 'established',
      relations: {
        institutions: [{ label: 'Ayala y Cia.' }],
        eventIds: ['makati-master-plan-1949'],
      },
    },
  ],
  [
    'population-boom-1960',
    1960,
    '1960 census',
    'Makati’s population passes 100,000',
    community,
    'Official census series records Makati growing from 41,335 people in 1948 to 114,540 in 1960. By 1970 the population had reached 264,918, showing the scale of migration and urbanization accompanying residential, industrial and commercial expansion.',
    psaPopulation,
    'Population counts describe the municipality as defined at each census date; they should not be treated as directly comparable to later post-boundary-change Makati without noting territorial changes.',
    {
      evidenceStatus: 'established',
    },
  ],
  [
    'municipal-building',
    1962,
    '1962',
    'A new municipal building anchors civic government',
    government,
    'Mayor Maximo Estrella ordered construction of a new municipal building at Makati’s present civic-center site in 1961; city histories record the new building as completed in 1962 on land donated by the Ayala interests.',
    makatiPoblacionHistory,
    undefined,
    {
      additionalSources: [city],
      evidenceStatus: 'probable',
      evidenceNote:
        'The official barangay history gives the 1961 construction order while the city profile dates the building to 1962; BetterMakati preserves both stages rather than forcing a single construction date.',
    },
  ],
  [
    'makatimed',
    1969,
    '31 May 1969',
    'Makati Medical Center opens',
    health,
    'Makati Medical Center opened to the public on 31 May 1969 after a project led by Constantino Manahan, Jose Fores and Mariano Alimurung. Its institutional history explicitly links the hospital’s creation to the rapid rise of Makati as a residential and commercial center.',
    makatiMedHistory,
    undefined,
    {
      evidenceStatus: 'established',
      relations: {
        people: [
          { label: 'Constantino P. Manahan' },
          { label: 'Jose Y. Fores' },
          { label: 'Mariano M. Alimurung' },
        ],
        institutions: [{ label: 'Makati Medical Center' }],
        eventIds: ['makati-commercial-center-1960', 'population-boom-1960'],
      },
    },
  ],
  [
    'martial-law-1972',
    1972,
    '21–23 September 1972',
    'Martial Law changes the national political framework',
    government,
    'Proclamation No. 1081, dated 21 September 1972, placed the entire Philippines under Martial Law. Among the incidents cited by the Marcos administration in the proclamation’s recitals was a 14 September bombing at the San Miguel building in Makati.',
    martialLaw1081,
    'The proclamation’s allegations and stated reasons are presented as the government’s own claims. This entry records the legal change and its Makati reference, not an independent validation of those claims.',
    {
      evidenceStatus: 'established',
      relations: {
        people: [{ label: 'Ferdinand E. Marcos' }],
      },
    },
  ],
  [
    'metropolitan-manila',
    1975,
    '7 November 1975',
    'Makati joins Metropolitan Manila',
    government,
    'Presidential Decree 824 included Makati among the municipalities under the new Metropolitan Manila Commission.',
    pd824MetroManila,
    undefined,
    {
      evidenceStatus: 'established',
    },
  ],
  [
    'makati-business-club-1981',
    1981,
    '29 October 1981',
    'Makati Business Club launches at Nielson Tower',
    community,
    'The Makati Business Club was launched at Nielson Tower as a business-sector forum on national economic and public-policy issues. Its founders later described governance, media control, crony capitalism and democratic institutions as part of the club’s early agenda.',
    mbcFounding,
    'This entry describes the organization’s documented institutional role and self-described agenda; it does not treat the business community as politically uniform.',
    {
      evidenceStatus: 'established',
      relations: {
        people: [
          { label: 'Enrique Zobel' },
          { label: 'Cesar A. Buenaventura' },
          { label: 'Jaime Ongpin' },
        ],
        institutions: [{ label: 'Makati Business Club' }],
      },
    },
  ],

  [
    'confetti-protests',
    1983,
    '16 September 1983',
    'Office workers fill Ayala Avenue in a yellow-confetti protest',
    war,
    'Thousands of office workers left buildings in Makati’s financial district and joined an Ayala Avenue protest after the assassination of former senator Benigno Aquino Jr. A contemporary Washington Post report described more than 8,000 participants and yellow confetti falling from high-rise offices.',
    wpConfetti1983,
    'The protest was one episode in a much larger national opposition movement after Aquino’s assassination. Contemporary and later sources differ in crowd estimates and in how they characterize the movement’s leadership.',
    {
      additionalSources: [nhcpAquino1983Archive, mbcFounding],
      evidenceStatus: 'established',
      relations: {
        people: [
          { label: 'Benigno S. Aquino Jr.' },
          { label: 'Ferdinand E. Marcos' },
        ],
        institutions: [{ label: 'Makati Business Club' }],
      },
      interpretations: [
        {
          id: 'confetti-protests-social-base',
          label: 'What made the Makati protests distinctive',
          summary:
            'The Ayala demonstrations visibly brought office workers, professionals and parts of the business community into street protest, while remaining only one component of a broader opposition movement that included labor, students, religious groups and other sectors.',
          sourceRefs: [
            'washington-post-makati-protest-1983',
            'nhcp-national-memory-aquino-1983',
          ],
        },
      ],
    },
  ],
  [
    'ugarte-field-1986',
    1986,
    'February 1986',
    'Ugarte Field becomes a civic gathering place during the snap-election crisis',
    war,
    'During the February 1986 snap-election period, a tent city was established at Ugarte Field near Ayala Avenue as a place for collective reflection, prayer and nonviolent civic action.',
    ugarte1986,
    'This is a retrospective account of one Makati site within a nationwide political crisis; BetterMakati should add contemporaneous photographs, flyers or press coverage when located.',
    {
      evidenceStatus: 'probable',
    },
  ],
  [
    'binay-appointment',
    1986,
    '27 February 1986 · retrospective date',
    'Jejomar Binay is appointed officer-in-charge of Makati',
    government,
    'After the February 1986 change of government and the death of Mayor Nemesio Yabut on 25 February, President Corazon Aquino appointed Jejomar Binay officer-in-charge of the Makati municipal government. Later accounts date the appointment to 27 February.',
    makatiPostEdsa,
    'The city’s official historical profile confirms the post-Revolution appointment but does not provide the exact day; the 27 February date comes from later press accounts.',
    {
      additionalSources: [binayAppointment1986],
      evidenceStatus: 'probable',
      relations: {
        people: [
          { label: 'Corazon C. Aquino' },
          { label: 'Jejomar C. Binay' },
          { label: 'Nemesio I. Yabut' },
        ],
      },
    },
  ],  [
    'makati-local-election-1988',
    1988,
    '18 January 1988',
    'Makati returns to elected municipal government',
    government,
    'The nationwide local elections of 18 January 1988 restored elected local executives and councils after the post-EDSA transition. Makati’s official historical profile records Jejomar Binay as elected municipal mayor in that election.',
    localElections1988,
    'The statute establishes the election date; the Makati historical profile supplies the local result.',
    {
      additionalSources: [makatiHistoryProfile],
      evidenceStatus: 'established',
      relations: {
        people: [{ label: 'Jejomar C. Binay' }],
        eventIds: ['binay-appointment'],
      },
    },
  ],

  [
    'boundary-case-filed',
    1993,
    '22 November 1993',
    'Taguig files the Fort Bonifacio territorial case',
    government,
    'Taguig filed Civil Case No. 63896 before the Regional Trial Court of Pasig, seeking judicial confirmation of its territorial boundaries and challenging parts of Presidential Proclamations 2475 and 518 affecting Fort Bonifacio and the EMBO areas.',
    taguigMakati2021,
    undefined,
    {
      evidenceStatus: 'established',
      relations: {
        institutions: [
          { label: 'City of Makati' },
          { label: 'City of Taguig' },
        ],
        eventIds: ['rtc-boundary', 'ca-boundary-2013', 'sc-forum-shopping-2016', 'ca-boundary-dismissal-2017', 'sc-boundary-decision', 'sc-boundary-finality-2022'],
      },
    },
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
    'Makati’s city charter is enacted',
    government,
    'Republic Act No. 7854 provided for Makati’s conversion into a highly urbanized city, subject to plebiscite ratification. The charter expressly preserved pending boundary disputes for resolution by the appropriate forum.',
    makatiCityCharter,
    undefined,
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['cityhood-plebiscite', 'boundary-case-filed'],
      },
    },
  ],
  [
    'cityhood-plebiscite',
    1995,
    '4 February 1995',
    'Makati voters ratify cityhood',
    government,
    'Makati’s official historical profile records the cityhood plebiscite on 4 February 1995 as approving the conversion authorized by Republic Act No. 7854.',
    makatiHistoryProfile,
    undefined,
    {
      additionalSources: [makatiCityCharter],
      evidenceStatus: 'established',
      relations: {
        eventIds: ['city-charter'],
      },
    },
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
    'Pasig RTC rules for Taguig',
    government,
    'The Pasig Regional Trial Court ruled that Fort Bonifacio Military Reservation Parcels 3 and 4 were part of Taguig and invalidated parts of Presidential Proclamations 2475 and 518 insofar as they altered territorial boundaries without a plebiscite.',
    taguigMakati2021,
    'This was a trial-court ruling and was followed by multiple appellate proceedings.',
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['boundary-case-filed', 'ca-boundary-2013'],
      },
    },
  ],
  [
    'ca-boundary-2013',
    2013,
    '30 July 2013',
    'Court of Appeals reverses the RTC and rules for Makati',
    government,
    'The Court of Appeals reversed the 2011 RTC decision, dismissed Taguig’s complaint, and declared the disputed EMBO and Inner Fort areas within Makati’s territorial jurisdiction. Taguig sought reconsideration.',
    taguigMakati2021,
    'This appellate decision did not end the dispute and was later displaced by subsequent rulings on procedure and merits.',
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['rtc-boundary', 'sc-forum-shopping-2016', 'ca-boundary-dismissal-2017'],
      },
    },
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
    'sc-forum-shopping-2016',
    2016,
    '15 June 2016',
    'Supreme Court rules that Makati engaged in forum shopping',
    government,
    'In G.R. No. 208393, the Supreme Court held that Makati had willfully and deliberately pursued simultaneous remedies in the territorial dispute and imposed contempt fines on the lawyers who filed the annulment petition.',
    taguigMakati2016,
    'This ruling addressed litigation procedure and sanctions; it did not itself decide the territorial merits.',
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['ca-boundary-2013', 'ca-boundary-dismissal-2017'],
      },
    },
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
    'ca-boundary-dismissal-2017',
    2017,
    '8 March / 3 October 2017',
    'Court of Appeals dismisses Makati’s territorial appeal with prejudice',
    government,
    'Following the Supreme Court’s forum-shopping ruling, the Court of Appeals granted Taguig’s motion to dismiss Makati’s appeal with prejudice on 8 March 2017 and denied Makati’s motion for reconsideration on 3 October 2017.',
    taguigMakati2021,
    undefined,
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['sc-forum-shopping-2016', 'sc-boundary-decision'],
      },
    },
  ],

  [
    'sc-boundary-decision',
    2021,
    '1 December 2021',
    'Supreme Court resolves the territorial merits for Taguig',
    government,
    'In G.R. No. 235316, the Supreme Court denied Makati’s petition and resolved the long-running territorial dispute over Fort Bonifacio Parcels 3 and 4 in Taguig’s favor on the merits.',
    taguigMakati2021,
    'This decision preceded the later denial of reconsideration with finality and the administrative transition of services and jurisdiction.',
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['ca-boundary-dismissal-2017', 'sc-boundary-finality-2022'],
      },
    },
  ],
  [
    'sc-boundary-finality-2022',
    2022,
    '28 September 2022',
    'Supreme Court denies Makati’s reconsideration with finality',
    government,
    'The Supreme Court’s Special Third Division denied with finality Makati’s omnibus motion for reconsideration of the 1 December 2021 decision and also denied referral of the case to the Court En Banc.',
    scFinality2022,
    'The Supreme Court publicly announced the final denial on 4 April 2023; the resolution itself is dated 28 September 2022.',
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['sc-boundary-decision', 'boundary-transition-2023'],
      },
    },
  ],
  [
    'boundary-transition-2023',
    2023,
    '2023–1 January 2024 transition',
    'Courts and public agencies begin implementing the new territorial jurisdiction',
    government,
    'After the territorial judgment became final, agencies began shifting jurisdiction and services for the ten EMBO barangays and other affected areas to Taguig. Supreme Court guidelines dated 14 November 2023 set a 1 January 2024 cutoff for newly filed criminal complaints and preserved pending Makati court cases already filed before that date.',
    scTransition2023,
    'Service and administrative transfers occurred through multiple agencies and did not all happen on a single day.',
    {
      evidenceStatus: 'established',
      relations: {
        institutions: [
          { label: 'City of Makati' },
          { label: 'City of Taguig' },
          { label: 'Supreme Court of the Philippines' },
        ],
        eventIds: ['sc-boundary-finality-2022', 'embo-electoral-districts-2024'],
      },
    },
  ],
  [
    'embo-electoral-districts-2024',
    2024,
    '2024 COMELEC resolution',
    'COMELEC places the ten EMBO barangays in Taguig electoral districts',
    government,
    'COMELEC Resolution No. 11069 incorporated the ten EMBO barangays into Taguig’s first and second legislative and councilor districts for subsequent elections.',
    comelecEmbo2024,
    'This is an electoral-administration consequence of the territorial transfer, distinct from the 2021 judicial decision itself.',
    {
      evidenceStatus: 'established',
      relations: {
        eventIds: ['boundary-transition-2023'],
      },
    },
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
  'Locate the original civil record behind the NHCP marker’s “naging bayan, 1670” date. A 1639 Jesuit relation already speaks of a “pueblo de los naturales” at San Pedro, while the 1656 Jesuit survey documents a residence, estate workforce and native ministry. Keep those descriptions distinct from the 1578 visita tradition and the formal 1670 bayan claim until an erection instrument or equivalent contemporary record establishes the legal sequence.',
  'Resolve the two-Casas problem without collapsing distinct evidence: compare the documented 1773/1831 casa de Hacienda, the 1775–1826 map sequence, the later Poblacion Oficinas, and the Olympia structure photographed in 1910/1926 against archival property records.',
  'Deepen the 1896–1899 revolutionary record from Filipino and Spanish field documents: verify the Magtagumpay council and flag against contemporary Katipunan material, reconcile Pio del Pilar’s conflicting birth-year traditions, and map the San Pedro/Guadalupe operations beyond U.S. military records.',
  'Complete the 1900–1934 social landscape beyond institutions: verify the 1918 barrio census, municipal presidencia and schools, workers and migration, local markets and industries, Santa Ana/Tejeros leisure economy, and the 1925–1926 transition from the Makati orphanage to Welfareville.',
  'Deepen Makati’s 1935–1945 civilian and neighborhood history: wartime population movements, resistance and collaboration records, bombing and structural damage, food and public-health conditions, Fort McKinley/Guadalupe military geography, and liberation at street level need sources beyond the Nielson and administrative record.',
  'Deepen the 1946–1972 transformation below the master-plan level: industrial workers and factories, informal and military-linked settlements, individual village and barrio creation records, schools and churches, housing and land tenure, and the lived contrast between “old” and “new” Makati need neighborhood-level primary sources.',
  'Deepen the 1972–1986 political history with Makati-specific primary sources: local government records under Mayor Nemesio Yabut, contemporaneous photos and leaflets from Ayala/Ugarte protests, business and labor participation, police responses, and records of how national Martial Law policies were implemented in Makati.',
  'Continue contemporary Makati history beyond the boundary case with source-led civic milestones rather than officeholder lists: major service reforms, infrastructure, heritage actions, disasters and recovery, public-health shocks, and changes in the city’s economic and residential geography need their own evidence-based batches.',
];
