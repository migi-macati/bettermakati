import { placeRegistryById } from './placeRegistry';

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
  | 'unresolved-current-status'
  | 'current-service';

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
  | 'current-secondary-terminal-roster'
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

export type CurrentRouteServiceClass =
  | 'city-bus'
  | 'p2p-bus'
  | 'uv-express';

export type CurrentRouteEvidenceClass =
  | 'official-current'
  | 'operator-current'
  | 'current-secondary-corroborated';

interface MobilityRouteRecordBase {
  id: string;
  mode: MobilityRouteMode;
  currentEvidenceSourceIds: string[];
  note: string;

  /**
   * Linear geometry is optional and repository-owned. W5-4c4 still publishes
   * no route geometry rather than inventing a representative point.
   */
  geometryArtifactId?: string;
}

export interface MobilityHistoricalRouteRecord
  extends MobilityRouteRecordBase {
  recordKind: 'historical-reconciliation';

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

  disposition:
    | 'current-corridor'
    | 'successor-corridor'
    | 'unresolved-current-status';

  reconciliationStatus: MobilityRouteReconciliationStatus;

  associationContinuity: 'verified' | 'unverified' | 'not-applicable';

  reconciledOn: string;
}

export interface MobilityCurrentServiceRouteRecord
  extends MobilityRouteRecordBase {
  recordKind: 'current-service';
  disposition: 'current-service';

  currentService: {
    routeLabel: string;
    originLabel: string;
    destinationLabel: string;
    serviceClass: CurrentRouteServiceClass;
    terminalPlaceIds: string[];
    evidenceClass: CurrentRouteEvidenceClass;
  };

  reviewedOn: string;
}

export type MobilityRouteCorridorRecord =
  | MobilityHistoricalRouteRecord
  | MobilityCurrentServiceRouteRecord;

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
  {
    id: 'one-ayala-routes-spot-2026',
    label: 'SPOT.ph · One Ayala routes, 2026 edition',
    url: 'https://www.spot.ph/newsfeatures/mobility/routes-at-one-ayala-2026-a5229-20260422-bsc',
    publisher: 'SPOT.ph',
    publishedOrPeriod: '2026-04-22',
    checkedOn: mobilityRouteRegistryReviewedOn,
    kind: 'current-secondary-terminal-roster',
  },
  {
    id: 'one-ayala-routes-windowseat-2026',
    label: 'WindowSeat.ph · One Ayala Terminal Guide 2026',
    url: 'https://www.windowseat.ph/one-ayala-terminal-guide-2026-routes-stops-and-schedules-you-need-to-know/',
    publisher: 'WindowSeat.ph',
    publishedOrPeriod: '2026-05-05',
    checkedOn: mobilityRouteRegistryReviewedOn,
    kind: 'current-secondary-terminal-roster',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
    recordKind: 'historical-reconciliation',
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
  {
    id: 'city-bus-one-ayala-sta-rosa-balibago',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Sta. Rosa / Balibago",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Sta. Rosa / Balibago",
      serviceClass: 'city-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'city-bus-one-ayala-bi-an',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Biñan",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Biñan",
      serviceClass: 'city-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'city-bus-one-ayala-pacita',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Pacita",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Pacita",
      serviceClass: 'city-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'city-bus-one-ayala-alabang',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Alabang",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Alabang",
      serviceClass: 'city-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'city-bus-one-ayala-sucat',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Sucat",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Sucat",
      serviceClass: 'city-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'city-bus-one-ayala-bicutan',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Bicutan",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Bicutan",
      serviceClass: 'city-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'city-bus-one-ayala-fti',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "FTI",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "FTI",
      serviceClass: 'city-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'p2p-one-ayala-calamba',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Calamba",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Calamba",
      serviceClass: 'p2p-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'p2p-one-ayala-fairview',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Fairview",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Fairview",
      serviceClass: 'p2p-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'p2p-one-ayala-sta-rosa-nuvali',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Sta. Rosa / Nuvali",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Sta. Rosa / Nuvali",
      serviceClass: 'p2p-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'p2p-one-ayala-antipolo',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Antipolo",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Antipolo",
      serviceClass: 'p2p-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'p2p-one-ayala-katipunan',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Katipunan",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Katipunan",
      serviceClass: 'p2p-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'p2p-one-ayala-imus',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Imus",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Imus",
      serviceClass: 'p2p-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'p2p-one-ayala-noveleta',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Noveleta",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Noveleta",
      serviceClass: 'p2p-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'p2p-one-ayala-las-pi-as',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Las Piñas",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Las Piñas",
      serviceClass: 'p2p-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'p2p-one-ayala-bacoor',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Bacoor",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Bacoor",
      serviceClass: 'p2p-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'p2p-one-ayala-cainta',
    mode: 'bus',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Cainta",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Cainta",
      serviceClass: 'p2p-bus',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-suki-market-mayon',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Suki Market–Mayon",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Suki Market–Mayon",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-fti-palar-arca-south',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "FTI–Palar Arca South",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "FTI–Palar Arca South",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-antipolo',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Antipolo",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Antipolo",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-pacita-bi-an',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Pacita–Biñan",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Pacita–Biñan",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-sucat-evacom-para-aque',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Sucat Evacom–Parañaque",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Sucat Evacom–Parañaque",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-bf-el-grande-para-aque',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "BF El Grande–Parañaque",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "BF El Grande–Parañaque",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-bf-resort-las-pi-as',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "BF Resort–Las Piñas",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "BF Resort–Las Piñas",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-molino-via-skyway-mcx',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Molino via Skyway MCX",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Molino via Skyway MCX",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-molino-via-coastal-road-ligas',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Molino via Coastal Road–Ligas",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Molino via Coastal Road–Ligas",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-imus-via-coastal-road',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Imus via Coastal Road",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Imus via Coastal Road",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-russia-moonwalk',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Russia–Moonwalk",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Russia–Moonwalk",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
  },
  {
    id: 'uv-one-ayala-bicutan',
    mode: 'uv-express',
    recordKind: 'current-service',
    disposition: 'current-service',
    currentService: {
      routeLabel: "Bicutan",
      originLabel: 'One Ayala Terminal',
      destinationLabel: "Bicutan",
      serviceClass: 'uv-express',
      terminalPlaceIds: ['one-ayala-terminal'],
      evidenceClass: 'current-secondary-corroborated',
    },
    currentEvidenceSourceIds: [
      'one-ayala-routes-spot-2026',
      'one-ayala-routes-windowseat-2026',
    ],
    note:
      'Current One Ayala route identity is corroborated by two independent 2026 terminal guides. Operator, schedule, fare, gate and intermediate-stop details are not canonicalized here.',
    geometryArtifactId: undefined,
    reviewedOn: mobilityRouteRegistryReviewedOn,
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

    if (route.geometryArtifactId) {
      throw new Error(
        'W5-4c4 must not publish route geometry before the geometry workstream: ' +
          route.id
      );
    }

    if (route.recordKind === 'historical-reconciliation') {
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
          'Historical jeepney association continuity remains unverified: ' +
            route.id
        );
      }

      continue;
    }

    if (route.disposition !== 'current-service') {
      throw new Error(
        'Current-service mobility route has incompatible disposition: ' +
          route.id
      );
    }

    const service = route.currentService;

    if (
      service.serviceClass === 'uv-express' &&
      route.mode !== 'uv-express'
    ) {
      throw new Error(
        'UV Express route has incompatible mode: ' + route.id
      );
    }

    if (
      (service.serviceClass === 'city-bus' ||
        service.serviceClass === 'p2p-bus') &&
      route.mode !== 'bus'
    ) {
      throw new Error('Bus route has incompatible mode: ' + route.id);
    }

    if (!service.terminalPlaceIds.length) {
      throw new Error(
        'Current mobility route must reference at least one canonical terminal Place: ' +
          route.id
      );
    }

    for (const placeId of service.terminalPlaceIds) {
      if (!placeRegistryById.has(placeId)) {
        throw new Error(
          'Current mobility route ' +
            route.id +
            ' references missing terminal Place: ' +
            placeId
        );
      }
    }

    if (service.evidenceClass === 'current-secondary-corroborated') {
      if (route.currentEvidenceSourceIds.length < 2) {
        throw new Error(
          'Corroborated secondary current route needs at least two independent sources: ' +
            route.id
        );
      }

      const secondaryRosterSources = route.currentEvidenceSourceIds.filter(
        sourceId =>
          mobilityRouteSources.find(source => source.id === sourceId)?.kind ===
          'current-secondary-terminal-roster'
      );

      if (secondaryRosterSources.length < 2) {
        throw new Error(
          'Corroborated secondary current route needs two current terminal-roster sources: ' +
            route.id
        );
      }
    }
  }

  return true;
};

validateMobilityRouteCorridors(mobilityRouteCorridors);

export const mobilityRouteById = new Map(
  mobilityRouteCorridors.map(route => [route.id, route])
);

export const historicalJeepneyRouteRows =
  mobilityRouteCorridors.filter(
    route => route.recordKind === 'historical-reconciliation'
  );

export const currentOrSuccessorJeepneyCorridors =
  historicalJeepneyRouteRows.filter(
    route => route.disposition !== 'unresolved-current-status'
  );

export const unresolvedJeepneyRows =
  historicalJeepneyRouteRows.filter(
    route => route.disposition === 'unresolved-current-status'
  );

export const currentMobilityServiceRoutes =
  mobilityRouteCorridors.filter(
    route => route.recordKind === 'current-service'
  );

export const currentBusRoutes =
  currentMobilityServiceRoutes.filter(route => route.mode === 'bus');

export const currentUvExpressRoutes =
  currentMobilityServiceRoutes.filter(
    route => route.mode === 'uv-express'
  );
