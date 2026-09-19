export type Evidence =
  'Legal record' | 'Institutional history' | 'Scholarly account';
export interface HistorySource {
  label: string;
  url: string;
  kind: Evidence;
}
export interface HistoryEvent {
  id: string;
  year: number;
  date: string;
  title: string;
  topic: string;
  summary: string;
  source: HistorySource;
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
export const historyReviewed = '19 September 2026';
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
type Row = [
  string,
  number,
  string,
  string,
  string,
  string,
  HistorySource,
  string?,
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
    'Retrospective account; not a surviving foundation instrument.',
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
    'san-pedro-church',
    1620,
    '1620',
    'San Pedro Macati church',
    community,
    'Tueller dates the Jesuit church to 1620, linking its patronage to Pedro de Brito.',
    study,
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
    'Violence reaches the novitiate',
    war,
    'A Jesuit account examined by Tueller describes fighting during the Chinese uprising.',
    study,
    'A mediated colonial account, not a neutral eyewitness consensus.',
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
  ([id, year, date, title, topic, summary, source, note]) => ({
    id,
    year,
    date,
    title,
    topic,
    summary,
    source,
    note,
  })
);
export const historyResearchGaps = [
  'Precolonial settlement and archaeology: separate material evidence from origin traditions.',
  'Guadalupe, the Jesuit estate, Casa Hacienda and the Oficinas: verify documents, locations and ownership transitions separately.',
  'Pio del Pilar, the Matagumpay flag and 1896–1899 operations: obtain contemporary records and distinguish later commemorations.',
  'Barangay histories, workers, women, markets, schools, public health and postwar housing need broader coverage.',
  'Complete the 2022–2023 boundary finality and implementation chronology, and subsequent civic milestones, from dated official records.',
];
