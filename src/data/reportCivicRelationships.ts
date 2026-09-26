import { accountabilityEntries } from './accountability';
import { cityIndicatorById } from './cityIndicators';
import {
  createCivicIntelligenceRelationshipIndex,
  civicIntelligenceRefKey,
  type CivicIntelligenceNodeResolver,
  type CivicIntelligenceReference,
  type CivicIntelligenceRelationship,
} from './civicIntelligenceRelationships';
import { integrityEntityById } from './integrityData';
import { integrityDisclosureRecords } from './integrityDisclosures';
import { integrityAuditFindings } from './integrityAuditTrails';
import { localLegislationById } from './localLegislation';
import { placeRegistryById } from './placeRegistry';
import { reports } from './reports';
import type {
  FeaturedReportV2,
  ReportCanonicalRecordRef,
  ReportContentBlock,
} from './reportTypes';

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

export const reportRecordRefToCivicRef = (
  record: ReportCanonicalRecordRef
): CivicIntelligenceReference => {
  switch (record.recordType) {
    case 'statistics-indicator':
      return { type: 'indicator', id: record.id };
    case 'legislation':
      return { type: 'legislation-record', id: record.id };
    case 'integrity-entity':
      return { type: 'integrity-entity', id: record.id };
    case 'integrity-disclosure':
      return {
        type: 'integrity-record',
        id: record.id,
        recordKind: 'disclosure',
      };
    case 'integrity-audit-finding':
      return {
        type: 'integrity-record',
        id: record.id,
        recordKind: 'audit-finding',
      };
    case 'place':
      return { type: 'place', id: record.id };
    case 'project':
      return { type: 'project', id: record.id };
    case 'accountability-entry':
      return { type: 'accountability-record', id: record.id };
  }
};

const reportRecordRelationships: CivicIntelligenceRelationship[] =
  reports.flatMap(report => {
    const uniqueRefs = [
      ...new Map(
        reportRecordRefs(report).map(record => {
          const ref = reportRecordRefToCivicRef(record);
          return [civicIntelligenceRefKey(ref), ref] as const;
        })
      ).values(),
    ];

    return uniqueRefs.map(ref => ({
      id:
        'report-' +
        report.slug +
        '-synthesizes-' +
        civicIntelligenceRefKey(ref).replaceAll(':', '-'),
      kind: 'synthesizes' as const,
      from: { type: 'report' as const, id: report.slug },
      to: ref,
      evidence: {
        basis: 'declared-analysis-input' as const,
        note:
          'The v2 report explicitly cites this canonical record in its evidence references. The report is analysis of the record, not source evidence for it.',
      },
    }));
  });

export const reportCivicRelationships: CivicIntelligenceRelationship[] = [
  ...reportRecordRelationships,
];

export const reportCivicRelationshipIndex =
  createCivicIntelligenceRelationshipIndex(reportCivicRelationships);

export const reportCivicNodeResolver: CivicIntelligenceNodeResolver =
  ref => {
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

    if (ref.type === 'indicator') {
      const indicator = cityIndicatorById.get(ref.id);
      if (!indicator) return undefined;
      return {
        ref,
        label: indicator.title,
        href: '/statistics',
        owner: 'statistics',
      };
    }

    if (ref.type === 'accountability-record') {
      const entry = accountabilityEntries.find(item => item.id === ref.id);
      if (!entry) return undefined;
      return {
        ref,
        label: entry.title,
        href:
          '/accountability?type=' +
          encodeURIComponent(entry.type) +
          '#' +
          entry.id,
        owner: 'accountability',
      };
    }

    if (ref.type === 'integrity-entity') {
      const entity = integrityEntityById.get(ref.id);
      if (!entity) return undefined;
      return {
        ref,
        label: entity.canonicalName,
        href: '/integrity#procurement',
        owner: 'integrity',
      };
    }

    if (
      ref.type === 'integrity-record' &&
      ref.recordKind === 'disclosure'
    ) {
      const disclosure = integrityDisclosureRecords.find(
        item => item.id === ref.id
      );
      if (!disclosure) return undefined;
      return {
        ref,
        label: disclosure.kind.replaceAll('-', ' '),
        href: '/integrity#disclosures',
        owner: 'integrity',
      };
    }

    if (
      ref.type === 'integrity-record' &&
      ref.recordKind === 'audit-finding'
    ) {
      const finding = integrityAuditFindings.find(item => item.id === ref.id);
      if (!finding) return undefined;
      return {
        ref,
        label: finding.title,
        href: '/integrity#audits',
        owner: 'integrity',
      };
    }

    if (ref.type === 'legislation-record') {
      const record = localLegislationById.get(ref.id);
      if (!record) return undefined;
      return {
        ref,
        label: record.reference.display + ' — ' + record.title,
        href: '/legislation?record=' + encodeURIComponent(record.id),
        owner: 'legislation',
      };
    }

    if (ref.type === 'place') {
      const place = placeRegistryById.get(ref.id);
      if (!place) return undefined;
      return {
        ref,
        label: place.name,
        href: '/civic-map/' + place.id,
        owner: 'place-registry',
      };
    }

    if (ref.type === 'project') {
      const project = accountabilityEntries.find(
        item => item.id === ref.id && item.type === 'project'
      );
      if (!project) return undefined;
      return {
        ref,
        label: project.title,
        href: '/accountability?type=project#' + project.id,
        owner: 'accountability',
      };
    }

    return undefined;
  };

for (const relationship of reportCivicRelationships) {
  if (!reportCivicNodeResolver(relationship.from)) {
    throw new Error(
      'Unresolved report civic relationship source: ' + relationship.id
    );
  }
  if (!reportCivicNodeResolver(relationship.to)) {
    throw new Error(
      'Unresolved report civic relationship target: ' + relationship.id
    );
  }
}

const resolvedForRef = (ref: CivicIntelligenceReference) =>
  reportCivicRelationshipIndex
    .forRef(ref)
    .map(view => ({
      ...view,
      node: reportCivicNodeResolver(view.related),
    }))
    .filter(item => Boolean(item.node));

export const reportRelatedRecords = (reportSlug: string) =>
  resolvedForRef({ type: 'report', id: reportSlug }).filter(
    item => item.related.type !== 'report'
  );

export const reportsForCivicRecord = (
  ref: Exclude<CivicIntelligenceReference, { type: 'report' }>
) =>
  resolvedForRef(ref).filter(item => item.related.type === 'report');

export const reportCivicRelationshipCoverage = {
  reports: reports.length,
  relationships: reportRecordRelationships.length,
  ecosystemRelationships: 0,
  ecosystemBoundary:
    'Current reports contain no BetterGov/BetterLGU evidence or comparison reference that directly deepens their synthesis, so W4-5e adds no generic ecosystem edge.',
} as const;
