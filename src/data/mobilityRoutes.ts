export type MobilityRouteMode =
  | 'jeepney'
  | 'bus'
  | 'uv-express'
  | 'tricycle'
  | 'rail'
  | 'ferry'
  | 'shuttle';

export type MobilityRouteDisposition =
  | 'current-corridor'
  | 'successor-corridor'
  | 'unresolved-current-status';

export type MobilityRouteReconciliationStatus =
  | 'current-corridor-association-continuity-unresolved'
  | 'current-corridor-endpoint-label-modernized-association-unresolved'
  | 'current-corridor-current-variant-mapping-unresolved'
  | 'current-successor-corridor-endpoint-modernized-association-unresolved'
  | 'current-status-unresolved-no-exact-route-found'
  | 'current-status-unresolved-possible-subsumed-corridor'
  | 'current-successor-route-modified'
  | 'current-corridor-exact-route-identity-unresolved';

export type MobilityRouteSourceKind =
  | 'official-primary'
  | 'official-secondary'
  | 'route-feed-reference'
  | 'secondary-reporting'
  | 'other';

export interface MobilityRouteSource {
  id: string;
  label: string;
  url: string;
  publisher?: string;
  publishedOrPeriod?: string;
  checkedOn: string;
  kind: MobilityRouteSourceKind;
}

export interface MobilityRouteCorridorRecord {
  id: string;
  mode: MobilityRouteMode;

  /**
   * The 2020 Makati row is preserved as historical lineage.
   * Association labels are historical labels, not claims about current operators.
   */
  historical: {
    publishedNo: number;
    from: string;
    to: string;
    associationLabel: string;
    sourceId: string;
  };

  /**
   * Normalized W5 disposition derived from the Wave 3 reconciliation.
   */
  disposition: MobilityRouteDisposition;

  /**
   * Exact Wave 3 status is retained to avoid flattening evidence nuance.
   */
  reconciliationStatus: MobilityRouteReconciliationStatus;

  /**
   * Current reference evidence. These may be route-feed or secondary references;
   * they are not silently upgraded to first-party/operator sources.
   */
  currentEvidenceSourceIds: string[];

  associationContinuity: 'verified' | 'unverified' | 'not-applicable';

  note: string;

  /**
   * Linear geometry is optional and repository-owned. W5-4c2 deliberately
   * publishes no route geometry rather than inventing a representative point.
   */
  geometryArtifactId?: string;

  reconciledOn: string;
}

export const mobilityRouteRegistryReviewedOn = '2026-09-27';

export const mobilityRouteSources: MobilityRouteSource[] = [
  {
    id: 'makati-facts-figures-2020-transport',
    label: 'City Government of Makati · Facts and Figures 2020 — Transportation',
    url: 'https://www.makati.gov.ph/assets/uploads/downloads/2/45/561/pdf/Facts%20and%20FIgures%202020.pdf',
    publisher: 'City Government of Makati',
    publishedOrPeriod: '2020',
    checkedOn: mobilityRouteRegistryReviewedOn,
    kind: 'official-primary',
  },
  {
    id: "jeepney-current-route-ref-01",
    label: "Current LTFRB-labelled Ayala–Pateros via J.P. Rizal route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-JEEP-Manila-1022-9969-7638077-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-02",
    label: "Current LTFRB-labelled Ayala–Washington route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-JEEP-Manila-1022-9969-7637816-1",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-03",
    label: "Current LTFRB-labelled Ayala–Zapote route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-JEEP-Manila-1022-9969-7637785-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-04",
    label: "Current Guadalupe Public Market route feed includes Guadalupe Ibabaw–Ayala",
    url: "https://moovitapp.com/index/en/public_transit-Guadalupe_Public_Market-Manila-site_39782418-1022",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-05",
    label: "Current LTFRB-labelled Ayala–Mantrade via Pasong Tamo route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-jeep-Manila-1022-9969-7638136-1",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-06",
    label: "Current LTFRB-labelled Bel-Air–Washington route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-jeep-Manila-1022-9969-7637819-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-07",
    label: "Current LTFRB-labelled Guadalupe–Cartimar route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-JEEP-Manila-1022-9969-7637873-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-08",
    label: "Current LTFRB-labelled Guadalupe–Pateros route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-jeep-Manila-1022-9969-7638088-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-09",
    label: "Current LTFRB-labelled Guadalupe–Buting route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-JEEP-Manila-1022-9969-7637774-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-10",
    label: "Current Guadalupe FTI terminal/route feed, updated Sept. 2026",
    url: "https://moovitapp.com/index/en/public_transit-Guadalupe_Jeepney_Terminal-Manila-site_181961412-1022",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-11",
    label: "Current AFP/PNP Housing–Guadalupe route feed, updated Sept. 2026",
    url: "https://moovitapp.com/index/en/public_transit-Afp_Pnp_Housing_Phase_1-Manila-site_46069250-1022",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-12",
    label: "Current LTFRB-labelled Fort Bonifacio Gate III–Guadalupe route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-jeep-Manila-1022-9969-7638268-1",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-13",
    label: "Current LTFRB-labelled Guadalupe Market–L. Guinto via P. Gil route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-JEEP-Manila-1022-9969-7638269-1",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-14",
    label: "Current LTFRB-labelled Evangelista–Libertad route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-JEEP-Manila-1022-9969-7637910-1",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-15",
    label: "Current LTFRB-labelled Kayamanan C–PRC via P. Tamo route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-jeep-Manila-1022-9969-7638066-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-16",
    label: "Current LTFRB-labelled Libertad–PRC route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-jeep-Manila-1022-9969-7637732-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-17",
    label: "Current LTFRB-labelled Libertad–Washington route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-jeep-Manila-1022-9969-7637892-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-18",
    label: "Current route listings show Dian–Libertad / Libertad–Dian",
    url: "https://moovitapp.com/index/en/public_transit-Caong_St-Manila-site_58819355-1022",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-19",
    label: "Current route listings show Libertad–Pasay Road",
    url: "https://moovitapp.com/index/en/public_transit-A_Arnaiz_Ave_Makati_City-Manila-stop_3636460-1022",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-20",
    label: "Current route listings show Libertad–M. Reyes",
    url: "https://moovitapp.com/index/en/public_transit-Capt_M_Reyes_Makati_City_Manila-Manila-stop_3636487-1022",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-21",
    label: "Current LTFRB-labelled FTI–Kayaman C route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-JEEP-Manila-1022-9969-7637752-1",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-22",
    label: "2026 One Ayala route inventory lists Makati Loop–PRC Circuit",
    url: "https://www.spot.ph/newsfeatures/mobility/routes-at-one-ayala-2026-a5229-20260422-bsc",
    publisher: "spot.ph",
    checkedOn: '2026-09-25',
    kind: "secondary-reporting",
  },
  {
    id: "jeepney-current-route-ref-23",
    label: "Current LTFRB-labelled Del Pan–Guadalupe (Ibabaw) route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-JEEP-Manila-1022-9969-7637993-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-24",
    label: "Current LTFRB-labelled Makati P. Burgos–L. Guinto route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-jeep-Manila-1022-9969-7637999-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-25",
    label: "Current LTFRB-labelled Pateros–Market Market route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-jeep-Manila-1022-9969-7637935-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-26",
    label: "Current transit data shows jeepney service between McKinley Road/Market Market corridor",
    url: "https://fromto.travel/en/philippines/mckinley-road/market-market-mall",
    publisher: "fromto.travel",
    checkedOn: '2026-09-25',
    kind: "secondary-reporting",
  },
  {
    id: "jeepney-current-route-ref-27",
    label: "Current LTFRB-labelled Kamagong–Malugay route feed",
    url: "https://moovitapp.com/index/en/public_transit-line-JEEP-Manila-1022-9969-7637929-0",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
  {
    id: "jeepney-current-route-ref-28",
    label: "Current route listings show Dominga–Libertad",
    url: "https://moovitapp.com/index/en/public_transit-Taft_Avenue-Manila-street_2659720-1022",
    publisher: "moovitapp.com",
    checkedOn: '2026-09-25',
    kind: "route-feed-reference",
  },
];

const mobilityRouteSourceIdSet = new Set(
  mobilityRouteSources.map(source => source.id)
);

const validateUrl = (url: string, owner: string) => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error(owner + ' has an invalid URL: ' + url);
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(owner + ' has unsupported URL protocol: ' + url);
  }
};

export const mobilityRouteCorridors: MobilityRouteCorridorRecord[] = [
  {
    id: 'jeepney-2020-01',
    mode: 'jeepney',
    historical: {
      publishedNo: 1,
      from: "Ayala",
      to: "Pateros",
      associationLabel: "ACPTSA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-01"],
    associationContinuity: 'unverified',
    note: "Ayala–Pateros remains current; ACPTSA itself is not independently verified as the current operator/cooperative.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-02',
    mode: 'jeepney',
    historical: {
      publishedNo: 2,
      from: "Ayala",
      to: "Pateros",
      associationLabel: "PABALADJOAI",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-01"],
    associationContinuity: 'unverified',
    note: "Same current corridor as row 1; PABALADJOAI continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-03',
    mode: 'jeepney',
    historical: {
      publishedNo: 3,
      from: "Ayala",
      to: "Washington",
      associationLabel: "AJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-02"],
    associationContinuity: 'unverified',
    note: "Ayala–Washington remains current; AJODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-04',
    mode: 'jeepney',
    historical: {
      publishedNo: 4,
      from: "Ayala",
      to: "Zapote",
      associationLabel: "AZADA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-03"],
    associationContinuity: 'unverified',
    note: "Ayala–Zapote remains current; AZADA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-05',
    mode: 'jeepney',
    historical: {
      publishedNo: 5,
      from: "Ayala",
      to: "Guadalupe Ibabaw",
      associationLabel: "GIAMADA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-04"],
    associationContinuity: 'unverified',
    note: "Current route feed identifies Guadalupe Ibabaw–Ayala; GIAMADA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-06',
    mode: 'jeepney',
    historical: {
      publishedNo: 6,
      from: "Ayala",
      to: "Mantrade",
      associationLabel: "AMODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-05"],
    associationContinuity: 'unverified',
    note: "Ayala–Mantrade via Pasong Tamo remains current; AMODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-07',
    mode: 'jeepney',
    historical: {
      publishedNo: 7,
      from: "Bel-Air",
      to: "Washington",
      associationLabel: "BEWODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-06"],
    associationContinuity: 'unverified',
    note: "Bel-Air–Washington remains current; BEWODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-08',
    mode: 'jeepney',
    historical: {
      publishedNo: 8,
      from: "Guadalupe",
      to: "Cartimar",
      associationLabel: "GUAPODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-07"],
    associationContinuity: 'unverified',
    note: "Guadalupe–Cartimar remains current; GUAPODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-09',
    mode: 'jeepney',
    historical: {
      publishedNo: 9,
      from: "Guadalupe",
      to: "Pateros",
      associationLabel: "GUACEMPAJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-08"],
    associationContinuity: 'unverified',
    note: "Guadalupe–Pateros remains current; GUACEMPAJODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-10',
    mode: 'jeepney',
    historical: {
      publishedNo: 10,
      from: "Guadalupe",
      to: "Pateros",
      associationLabel: "JOPREXJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-08"],
    associationContinuity: 'unverified',
    note: "Guadalupe–Pateros remains current; JOPREXJODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-11',
    mode: 'jeepney',
    historical: {
      publishedNo: 11,
      from: "Guadalupe",
      to: "Pateros",
      associationLabel: "HIPADA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-08"],
    associationContinuity: 'unverified',
    note: "Guadalupe–Pateros remains current; HIPADA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-12',
    mode: 'jeepney',
    historical: {
      publishedNo: 12,
      from: "Guadalupe",
      to: "Pateros",
      associationLabel: "HIPAJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-08"],
    associationContinuity: 'unverified',
    note: "Guadalupe–Pateros remains current; HIPAJODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-13',
    mode: 'jeepney',
    historical: {
      publishedNo: 13,
      from: "Guadalupe",
      to: "Buting",
      associationLabel: "GUADAKABUDOA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-09"],
    associationContinuity: 'unverified',
    note: "Guadalupe–Buting remains current; GUADAKABUDOA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-14',
    mode: 'jeepney',
    historical: {
      publishedNo: 14,
      from: "Guadalupe",
      to: "FTI",
      associationLabel: "GUAWBUJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-10"],
    associationContinuity: 'unverified',
    note: "Guadalupe–FTI remains current; GUAWBUJODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-15',
    mode: 'jeepney',
    historical: {
      publishedNo: 15,
      from: "Guadalupe",
      to: "FTI",
      associationLabel: "GUAFTIODAI-O",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-10"],
    associationContinuity: 'unverified',
    note: "Guadalupe–FTI remains current; GUAFTIODAI-O continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-16',
    mode: 'jeepney',
    historical: {
      publishedNo: 16,
      from: "Guadalupe",
      to: "FTI",
      associationLabel: "GUAFTIODAI-TRIANGLE",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-10"],
    associationContinuity: 'unverified',
    note: "Guadalupe–FTI remains current; GUAFTIODAI-TRIANGLE continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-17',
    mode: 'jeepney',
    historical: {
      publishedNo: 17,
      from: "Guadalupe",
      to: "Housing",
      associationLabel: "TEPVJODAI",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-endpoint-label-modernized-association-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-11"],
    associationContinuity: 'unverified',
    note: "The current route is explicitly AFP/PNP Housing (Taguig)–Guadalupe; the 2020 shorthand 'Housing' is treated as corridor lineage, not exact unchanged naming.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-18',
    mode: 'jeepney',
    historical: {
      publishedNo: 18,
      from: "Guadalupe",
      to: "Fort Bonifacio Gate 3",
      associationLabel: "TUBOJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-12"],
    associationContinuity: 'unverified',
    note: "Fort Bonifacio Gate III–Guadalupe remains current; TUBOJODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-19',
    mode: 'jeepney',
    historical: {
      publishedNo: 19,
      from: "Guadalupe",
      to: "L. Guinto",
      associationLabel: "GLMATJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-current-variant-mapping-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-13"],
    associationContinuity: 'unverified',
    note: "Guadalupe Market–L. Guinto remains current, but the old GLMATJODA association cannot be tied with confidence to the current via-P. Gil versus other variant.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-20',
    mode: 'jeepney',
    historical: {
      publishedNo: 20,
      from: "Guadalupe",
      to: "L. Guinto",
      associationLabel: "LABGUADJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-current-variant-mapping-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-13"],
    associationContinuity: 'unverified',
    note: "Guadalupe Market–L. Guinto remains current, but LABGUADJODA cannot be tied with confidence to a specific current variant.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-21',
    mode: 'jeepney',
    historical: {
      publishedNo: 21,
      from: "Evangelista",
      to: "Libertad",
      associationLabel: "SODJEBELELODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-14"],
    associationContinuity: 'unverified',
    note: "Evangelista–Libertad remains current; SODJEBELELODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-22',
    mode: 'jeepney',
    historical: {
      publishedNo: 22,
      from: "PRC",
      to: "Mantrade",
      associationLabel: "JODA PRC-KAYAMANAN C",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "successor-corridor",
    reconciliationStatus: "current-successor-corridor-endpoint-modernized-association-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-15"],
    associationContinuity: 'unverified',
    note: "The old PRC–Mantrade row aligns with the current Kayamanan C–PRC via P. Tamo corridor; endpoint naming/extent has modernized, so this is not treated as an unchanged one-to-one route.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-23',
    mode: 'jeepney',
    historical: {
      publishedNo: 23,
      from: "PRC",
      to: "Libertad",
      associationLabel: "PTBT-TODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-16"],
    associationContinuity: 'unverified',
    note: "Libertad–PRC remains current; PTBT-TODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-24',
    mode: 'jeepney',
    historical: {
      publishedNo: 24,
      from: "Washington",
      to: "Mantrade",
      associationLabel: "WAKCODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "unresolved-current-status",
    reconciliationStatus: "current-status-unresolved-no-exact-route-found",
    currentEvidenceSourceIds: [],
    associationContinuity: 'unverified',
    note: "No current exact Washington–Mantrade route was found in the reviewed 2026 route feeds. Washington–Libertad and Mantrade-related services exist separately, but that is not proof the historical through-route survives.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-25',
    mode: 'jeepney',
    historical: {
      publishedNo: 25,
      from: "Washington",
      to: "Libertad",
      associationLabel: "PADJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-17"],
    associationContinuity: 'unverified',
    note: "Washington–Libertad remains current; PADJODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-26',
    mode: 'jeepney',
    historical: {
      publishedNo: 26,
      from: "Dian",
      to: "Libertad",
      associationLabel: "PADODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-18"],
    associationContinuity: 'unverified',
    note: "Dian–Libertad remains current; PADODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-27',
    mode: 'jeepney',
    historical: {
      publishedNo: 27,
      from: "Pasay Road",
      to: "Libertad",
      associationLabel: "PRODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-19"],
    associationContinuity: 'unverified',
    note: "Pasay Road–Libertad remains current; PRODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-28',
    mode: 'jeepney',
    historical: {
      publishedNo: 28,
      from: "M. Reyes",
      to: "Libertad",
      associationLabel: "PASMAKODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-20"],
    associationContinuity: 'unverified',
    note: "M. Reyes–Libertad remains current; PASMAKODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-29',
    mode: 'jeepney',
    historical: {
      publishedNo: 29,
      from: "Mantrade",
      to: "Pasong Tamo Ext.",
      associationLabel: "PTEODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "unresolved-current-status",
    reconciliationStatus: "current-status-unresolved-possible-subsumed-corridor",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-15"],
    associationContinuity: 'unverified',
    note: "Current Chino Roces/Pasong Tamo services cover the corridor, but no exact Mantrade–Pasong Tamo Extension route was found. Do not equate a shared corridor with survival of the historical PTEODA route.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-30',
    mode: 'jeepney',
    historical: {
      publishedNo: 30,
      from: "FTI",
      to: "Kayaman C",
      associationLabel: "WEBTRANS",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-21"],
    associationContinuity: 'unverified',
    note: "FTI–Kayamanan C remains current; WEBTRANS continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-31',
    mode: 'jeepney',
    historical: {
      publishedNo: 31,
      from: "Ayala",
      to: "Makati Avenue-JP RIZAL",
      associationLabel: "MAKATI LOOP",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "successor-corridor",
    reconciliationStatus: "current-successor-route-modified",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-22"],
    associationContinuity: 'unverified',
    note: "Makati Loop remains current in 2026 as Makati Loop–PRC Circuit from One Ayala, using Makati Avenue/Buendia–J.P. Rizal–Circuit/Puregold–Landmark. Treat as a modified successor, not unchanged 2020 geometry.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-32',
    mode: 'jeepney',
    historical: {
      publishedNo: 32,
      from: "Delpan",
      to: "Guadalupe Ibabaw",
      associationLabel: "GIMDJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-23"],
    associationContinuity: 'unverified',
    note: "Del Pan–Guadalupe (Ibabaw) remains current; GIMDJODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-33',
    mode: 'jeepney',
    historical: {
      publishedNo: 33,
      from: "Burgos",
      to: "L. Guinto",
      associationLabel: "MALBODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-24"],
    associationContinuity: 'unverified',
    note: "Makati P. Burgos–L. Guinto remains current; MALBODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-34',
    mode: 'jeepney',
    historical: {
      publishedNo: 34,
      from: "Pateros",
      to: "Market-Market",
      associationLabel: "PMMODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-25"],
    associationContinuity: 'unverified',
    note: "Pateros–Market Market remains current; PMMODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-35',
    mode: 'jeepney',
    historical: {
      publishedNo: 35,
      from: "McKinley",
      to: "Market-Market",
      associationLabel: "EMMJODAI",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-exact-route-identity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-26"],
    associationContinuity: 'unverified',
    note: "Current jeepney service connects the McKinley Road/Market Market corridor, but the exact 2020 EMMJODAI McKinley–Market Market route identity/operator could not be frozen one-to-one.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-37',
    mode: 'jeepney',
    historical: {
      publishedNo: 37,
      from: "Kalayaan",
      to: "PICC",
      associationLabel: "MAPAJODA (Aircon Jeep)",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "unresolved-current-status",
    reconciliationStatus: "current-status-unresolved-no-exact-route-found",
    currentEvidenceSourceIds: [],
    associationContinuity: 'unverified',
    note: "No current exact Kalayaan–PICC route was found in the reviewed current route feeds. Do not mark obsolete without stronger LTFRB/terminal evidence.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-38',
    mode: 'jeepney',
    historical: {
      publishedNo: 38,
      from: "Kamagong",
      to: "Malugay",
      associationLabel: "KAMAJODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-27"],
    associationContinuity: 'unverified',
    note: "Kamagong–Malugay remains current; KAMAJODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
  {
    id: 'jeepney-2020-39',
    mode: 'jeepney',
    historical: {
      publishedNo: 39,
      from: "Dominga",
      to: "Libertad",
      associationLabel: "DILODA",
      sourceId: 'makati-facts-figures-2020-transport',
    },
    disposition: "current-corridor",
    reconciliationStatus: "current-corridor-association-continuity-unresolved",
    currentEvidenceSourceIds: ["jeepney-current-route-ref-28"],
    associationContinuity: 'unverified',
    note: "Dominga–Libertad remains current; DILODA continuity is not independently verified.",
    geometryArtifactId: undefined,
    reconciledOn: '2026-09-25',
  },
];

export const validateMobilityRouteCorridors = (
  routes: readonly MobilityRouteCorridorRecord[]
) => {
  const ids = new Set<string>();
  const publishedNumbers = new Set<number>();

  for (const source of mobilityRouteSources) {
    if (!source.id.trim() || !source.label.trim()) {
      throw new Error('Mobility route source ID and label must not be empty.');
    }
    validateUrl(source.url, 'Mobility route source ' + source.id);
  }

  for (const route of routes) {
    if (!route.id.trim()) {
      throw new Error('Mobility route ID must not be empty.');
    }
    if (ids.has(route.id)) {
      throw new Error('Duplicate mobility route ID: ' + route.id);
    }
    ids.add(route.id);

    if (publishedNumbers.has(route.historical.publishedNo)) {
      throw new Error(
        'Duplicate historical jeepney row number: ' +
          route.historical.publishedNo
      );
    }
    publishedNumbers.add(route.historical.publishedNo);

    if (!mobilityRouteSourceIdSet.has(route.historical.sourceId)) {
      throw new Error(
        'Mobility route ' +
          route.id +
          ' references missing historical source: ' +
          route.historical.sourceId
      );
    }

    for (const sourceId of route.currentEvidenceSourceIds) {
      if (!mobilityRouteSourceIdSet.has(sourceId)) {
        throw new Error(
          'Mobility route ' +
            route.id +
            ' references missing current evidence source: ' +
            sourceId
        );
      }
    }

    if (
      route.disposition !== 'unresolved-current-status' &&
      !route.currentEvidenceSourceIds.length
    ) {
      throw new Error(
        'Current/successor mobility route must retain current evidence: ' +
          route.id
      );
    }

    if (
      route.disposition === 'unresolved-current-status' &&
      !route.reconciliationStatus.startsWith('current-status-unresolved')
    ) {
      throw new Error(
        'Unresolved mobility route has incompatible reconciliation status: ' +
          route.id
      );
    }

    if (
      route.associationContinuity === 'verified' &&
      route.mode === 'jeepney'
    ) {
      throw new Error(
        'W5-4c2 must not claim verified continuity for a 2020 jeepney association: ' +
          route.id
      );
    }

    if (route.geometryArtifactId) {
      throw new Error(
        'W5-4c2 must not publish route geometry before the geometry workstream: ' +
          route.id
      );
    }
  }

  return true;
};

validateMobilityRouteCorridors(mobilityRouteCorridors);

export const mobilityRouteById = new Map(
  mobilityRouteCorridors.map(route => [route.id, route])
);

export const currentOrSuccessorJeepneyCorridors =
  mobilityRouteCorridors.filter(
    route => route.disposition !== 'unresolved-current-status'
  );

export const unresolvedJeepneyRows = mobilityRouteCorridors.filter(
  route => route.disposition === 'unresolved-current-status'
);
