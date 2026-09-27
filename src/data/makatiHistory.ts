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
    'church-rebuilding',
    1849,
    '1849',
    'Rebuilding the parish church',
    community,
    'Tueller records rebuilding following the earlier church plan.',
    study,
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
    'revolution-1896',
    1896,
    '29 August 1896',
    'Makati joins the uprising',
    war,
    'Tueller includes Makati among towns that rose against Spanish rule.',
    study,
  ],
  [
    'church-hospital',
    1899,
    '1899',
    'Church used as a wartime hospital',
    war,
    'Tueller documents American military use of the church as a hospital and campground.',
    study,
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
  'Guadalupe, the Jesuit estate, Casa Hacienda and the Oficinas: verify documents, locations and ownership transitions separately.',
  'Pio del Pilar, the Matagumpay flag and 1896–1899 operations: obtain contemporary records and distinguish later commemorations.',
  'Barangay histories, workers, women, markets, schools, public health and postwar housing need broader coverage.',
  'Complete the 2022–2023 boundary finality and implementation chronology, and subsequent civic milestones, from dated official records.',
];
