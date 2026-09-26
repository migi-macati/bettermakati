import {
  procurementProjectEntries,
  procurementQ22025Source,
  procurementQ32024Source,
} from './accountabilitySupplement';
import type {
  IntegrityEntity,
  IntegritySource,
  ProcurementAwardRecord,
} from './integrityTypes';

const supplierEntityIdBySourceName: Record<string, string> = {
  'Amellar Solutions': 'supplier-amellar-solutions',
  'Wadsworth Commercial Corp.': 'supplier-wadsworth-commercial-corp',
  'RUNR Enterprise and Services Company':
    'supplier-runr-enterprise-and-services-company',
  'Malgonz Enterprise': 'supplier-malgonz-enterprise',
  'PLA Events Planner Inc.': 'supplier-pla-events-planner-inc',
  'DJT Group Corp.': 'supplier-djt-group-corp',
  'Transprint Corporation': 'supplier-transprint-corporation',
  'Epigraphy Inc.': 'supplier-epigraphy-inc',
  'Kristin Educational Exponents Publications, Inc.':
    'supplier-kristin-educational-exponents-publications-inc',
  'Non-Pareil International Freight and Cargo Service Inc.':
    'supplier-non-pareil-international-freight-and-cargo-service-inc',
  'Maxipharm Co., Ltd.': 'supplier-maxipharm-co-ltd',
  'Asia Prime Commodities Corp.': 'supplier-asia-prime-commodities-corp',
  'Libtech Source Philippines, Inc.':
    'supplier-libtech-source-philippines-inc',
  'Beesee Global Technologies Inc. / Pinnacle Technologies Inc. (JV)':
    'joint-venture-beesee-global-technologies-pinnacle-technologies',
  'Shabat Corporation': 'supplier-shabat-corporation',
  'TJ Grill Corp.': 'supplier-tj-grill-corp',
  'JPPM Construction and Supply': 'supplier-jppm-construction-and-supply',
};

export const integrityProcurementSources: IntegritySource[] = [
  {
    id: 'makati-procurement-2025-q2-bid-results',
    label: '2025 Q2 Bid Results — Goods and Services',
    url: procurementQ22025Source,
    publisher: 'City Government of Makati',
    publishedOrPeriod: '2025 Q2',
    sourceClass: 'city-government',
  },
  {
    id: 'makati-procurement-2024-q3-bid-results',
    label: '2024 Q3 Bid Results',
    url: procurementQ32024Source,
    publisher: 'City Government of Makati',
    publishedOrPeriod: '2024 Q3',
    sourceClass: 'city-government',
  },
];

const sourceIdByUrl = new Map(
  integrityProcurementSources.map(source => [source.url, source.id])
);

const sourceNamesByEntityId = new Map<string, string[]>();

for (const entry of procurementProjectEntries) {
  const supplierName = entry.procurement?.supplier;
  if (!supplierName) continue;

  const entityId = supplierEntityIdBySourceName[supplierName];
  if (!entityId) {
    throw new Error(
      'Missing canonical integrity entity mapping for procurement supplier: ' +
        supplierName
    );
  }

  const names = sourceNamesByEntityId.get(entityId) ?? [];
  if (!names.includes(supplierName)) names.push(supplierName);
  sourceNamesByEntityId.set(entityId, names);
}

export const integrityProcurementEntities: IntegrityEntity[] = [
  ...sourceNamesByEntityId.entries(),
].map(([id, sourceNames]) => {
  const canonicalName = sourceNames[0];
  const jointVenture =
    canonicalName ===
    'Beesee Global Technologies Inc. / Pinnacle Technologies Inc. (JV)';

  return {
    id,
    canonicalName,
    kind: jointVenture ? 'joint-venture' : 'supplier',
    sourceIds: integrityProcurementSources.map(source => source.id).filter(
      sourceId =>
        procurementProjectEntries.some(entry => {
          if (entry.procurement?.supplier !== canonicalName) return false;
          return entry.sources.some(
            source => sourceIdByUrl.get(source.url) === sourceId
          );
        })
    ),
    notes: jointVenture
      ? [
          'The procurement source names this winning supplier as a joint venture. W4-3c preserves the source-stated joint-venture identity and does not infer separate member-entity relationships.',
        ]
      : undefined,
  };
});

export const integrityEntityById = new Map(
  integrityProcurementEntities.map(entity => [entity.id, entity])
);

export const integrityProcurementAwards: ProcurementAwardRecord[] =
  procurementProjectEntries.map(entry => {
    const procurement = entry.procurement;

    if (!procurement?.supplier) {
      throw new Error(
        'Procurement entry is missing a supplier for integrity normalization: ' +
          entry.id
      );
    }

    const supplierEntityId =
      supplierEntityIdBySourceName[procurement.supplier];

    if (!supplierEntityId) {
      throw new Error(
        'No canonical supplier entity resolves for procurement entry: ' +
          entry.id
      );
    }

    const sourceIds = entry.sources
      .map(source => sourceIdByUrl.get(source.url))
      .filter((sourceId): sourceId is string => Boolean(sourceId));

    if (!sourceIds.length) {
      throw new Error(
        'No canonical procurement source resolves for procurement entry: ' +
          entry.id
      );
    }

    return {
      id: 'award-' + entry.id.replace(/^procurement-/, ''),
      accountabilityEntryId: entry.id,
      referenceNo: procurement.referenceNo,
      title: entry.title,
      procuringEntity: 'City Government of Makati',
      supplierEntityIds: [supplierEntityId],
      bidOrAwardDate: procurement.bidDate,
      approvedBudgetM: procurement.approvedBudgetM,
      awardedAmountM: procurement.awardedAmountM,
      sourceIds,
      notes: [
        'Supplier identity is normalized only from the exact winning-supplier name stated in the existing Makati procurement record.',
      ],
    };
  });

export const integrityProcurementAwardsByEntityId = new Map(
  integrityProcurementEntities.map(entity => [
    entity.id,
    integrityProcurementAwards.filter(award =>
      award.supplierEntityIds.includes(entity.id)
    ),
  ])
);
