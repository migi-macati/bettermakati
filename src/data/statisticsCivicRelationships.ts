import { barangays } from './barangays';
import {
  cityIndicatorById,
} from './cityIndicators';
import {
  civicEcosystemResourceById,
} from './ecosystemResources';
import {
  reports,
} from './reports';
import {
  createCivicIntelligenceRelationshipIndex,
  type CivicIntelligenceNodeResolver,
  type CivicIntelligenceRelationship,
} from './civicIntelligenceRelationships';
import type {
  FeaturedReportV2,
  ReportCanonicalRecordRef,
  ReportContentBlock,
} from './reportTypes';

const statisticsHrefByIndicatorId: Record<string, string> = {
  'population-total': '/statistics#population-trend',
  'population-growth-rate': '/statistics#population-trend',
  'real-gdp-level': '/statistics#economy-work',
  'gdp-per-capita': '/statistics#economy-work',
};

const reportRecordRefs = (
  report: FeaturedReportV2
): ReportCanonicalRecordRef[] => {
  const refs: ReportCanonicalRecordRef[] = [];

  const appendBlock = (block: ReportContentBlock) => {
    const records =
      block.kind === 'paragraph'
        ? block.evidence?.records
        : block.evidence.records;
    if (records) refs.push(...records);
  };

  for (const section of report.sections) {
    for (const block of section.blocks) appendBlock(block);
  }

  if (report.methodology?.evidence?.records) {
    refs.push(...report.methodology.evidence.records);
  }

  return refs;
};

const reportIndicatorRelationships: CivicIntelligenceRelationship[] =
  reports.flatMap(report => {
    const indicatorIds = [
      ...new Set(
        reportRecordRefs(report)
          .filter(
            (
              ref
            ): ref is Extract<
              ReportCanonicalRecordRef,
              { recordType: 'statistics-indicator' }
            > => ref.recordType === 'statistics-indicator'
          )
          .map(ref => ref.id)
      ),
    ];

    return indicatorIds.map(indicatorId => {
      if (!cityIndicatorById.has(indicatorId)) {
        throw new Error(
          'Report references unknown Statistics indicator: ' +
            report.slug +
            ' -> ' +
            indicatorId
        );
      }

      return {
        id:
          'statistics-report-' +
          indicatorId +
          '-' +
          report.slug,
        kind: 'evidence-for' as const,
        from: { type: 'indicator' as const, id: indicatorId },
        to: { type: 'report' as const, id: report.slug },
        evidence: {
          basis: 'declared-analysis-input' as const,
          note:
            'The v2 report explicitly cites this canonical Statistics indicator in its evidence record references.',
        },
      };
    });
  });

const populationBarangayRelationships: CivicIntelligenceRelationship[] =
  barangays.map(barangay => ({
    id: 'statistics-population-barangay-' + barangay.slug,
    kind: 'context-for',
    from: { type: 'indicator', id: 'population-total' },
    to: { type: 'barangay', id: barangay.slug },
    evidence: {
      basis: 'explicit-geography',
      sourceIds: ['psa-psgc-makati-current'],
      note:
        'The 2024 population-total observation is reconciled to the canonical 23-barangay population records. This relationship provides barangay context only and does not attribute other citywide indicators to the barangay.',
    },
  }));

const ecosystemRelationships: CivicIntelligenceRelationship[] = [
  {
    id: 'statistics-real-gdp-bettergov-data-research',
    kind: 'comparison-context',
    from: { type: 'indicator', id: 'real-gdp-level' },
    to: {
      type: 'ecosystem-resource',
      id: 'data-research',
      ecosystem: 'bettergov',
    },
    evidence: {
      basis: 'curated-ecosystem-context',
      checkedOn: '2026-09-25',
      note:
        'The audited BetterGov ecosystem map identifies Data Research / Visualizations as a Statistics fit for national comparison context. It is not source evidence for Makati GDP values.',
    },
  },
  {
    id: 'statistics-gdp-per-capita-bettergov-open-data',
    kind: 'continuation-resource',
    from: { type: 'indicator', id: 'gdp-per-capita' },
    to: {
      type: 'ecosystem-resource',
      id: 'open-data',
      ecosystem: 'bettergov',
    },
    evidence: {
      basis: 'curated-ecosystem-context',
      checkedOn: '2026-09-25',
      note:
        'The audited BetterGov ecosystem map identifies the Open Data Portal as a Statistics-relevant structured-data continuation. No BetterGov dataset value is consumed by this relationship.',
    },
  },
];

for (const relationship of ecosystemRelationships) {
  if (
    relationship.to.type !== 'ecosystem-resource' ||
    !civicEcosystemResourceById.has(relationship.to.id)
  ) {
    throw new Error(
      'Statistics relationship references unknown ecosystem resource: ' +
        relationship.id
    );
  }
}

export const statisticsCivicRelationships: CivicIntelligenceRelationship[] = [
  ...populationBarangayRelationships,
  ...reportIndicatorRelationships,
  ...ecosystemRelationships,
];

export const statisticsCivicRelationshipIndex =
  createCivicIntelligenceRelationshipIndex(
    statisticsCivicRelationships
  );

export const statisticsCivicNodeResolver: CivicIntelligenceNodeResolver =
  ref => {
    if (ref.type === 'indicator') {
      const indicator = cityIndicatorById.get(ref.id);
      if (!indicator) return undefined;
      return {
        ref,
        label: indicator.title,
        href: statisticsHrefByIndicatorId[ref.id] ?? '/statistics',
        owner: 'statistics',
      };
    }

    if (ref.type === 'barangay') {
      const barangay = barangays.find(item => item.slug === ref.id);
      if (!barangay) return undefined;
      return {
        ref,
        label: barangay.name,
        href: '/barangays/' + barangay.slug,
        owner: 'barangays',
      };
    }

    if (ref.type === 'report') {
      const report = reports.find(item => item.slug === ref.id);
      if (!report) return undefined;
      return {
        ref,
        label: report.headline,
        href: '/reports/' + report.slug,
        owner: 'reports',
      };
    }

    if (ref.type === 'ecosystem-resource') {
      const resource = civicEcosystemResourceById.get(ref.id);
      if (!resource || resource.ecosystem !== ref.ecosystem) {
        return undefined;
      }
      return {
        ref,
        label: resource.name,
        href: resource.href,
        owner: 'ecosystem',
      };
    }

    return undefined;
  };

for (const relationship of statisticsCivicRelationships) {
  if (!statisticsCivicNodeResolver(relationship.from)) {
    throw new Error(
      'Unresolved Statistics relationship source: ' + relationship.id
    );
  }
  if (!statisticsCivicNodeResolver(relationship.to)) {
    throw new Error(
      'Unresolved Statistics relationship target: ' + relationship.id
    );
  }
}

export const statisticsRelatedRecords = (indicatorId: string) =>
  statisticsCivicRelationshipIndex
    .forRef({ type: 'indicator', id: indicatorId })
    .map(view => ({
      ...view,
      node: statisticsCivicNodeResolver(view.related),
    }))
    .filter(item => Boolean(item.node));

export const statisticsRelationshipCoverage = {
  indicatorToBarangay: populationBarangayRelationships.length,
  indicatorToReport: reportIndicatorRelationships.length,
  indicatorToEcosystem: ecosystemRelationships.length,
  inferredPlaceLinks: 0,
  inferredServiceLinks: 0,
  inferredProjectOrAccountabilityLinks: 0,
  betterLguIndicatorLinks: 0,
} as const;
