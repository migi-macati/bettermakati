export type ReportCanonicalRecordRef =
  | {
      recordType: 'statistics-indicator';
      id: string;
      href: string;
    }
  | {
      recordType: 'legislation';
      id: string;
      href: string;
    }
  | {
      recordType:
        | 'integrity-entity'
        | 'integrity-disclosure'
        | 'integrity-audit-finding';
      id: string;
      href: string;
    }
  | {
      recordType: 'place';
      id: string;
      href: string;
    }
  | {
      recordType: 'project';
      id: string;
      href: string;
    }
  | {
      recordType: 'accountability-entry';
      id: string;
      href: string;
    };

export type ReportSourceKind =
  | 'canonical-internal'
  | 'official-external'
  | 'secondary';

export interface ReportSourceV2 {
  id: string;
  label: string;
  href: string;
  sourceKind: ReportSourceKind;
  publisher?: string;
  publishedOrPeriod?: string;
  note?: string;
  checkedOn?: string;
}

export interface ReportEvidenceRef {
  sourceIds: [string, ...string[]];
  records?: ReportCanonicalRecordRef[];
}

export interface ReportAnalysisEvidenceRef {
  sourceIds?: string[];
  records?: ReportCanonicalRecordRef[];
}

export type ReportParagraphBlock =
  | {
      kind: 'paragraph';
      role: 'fact';
      text: string;
      evidence: ReportEvidenceRef;
    }
  | {
      kind: 'paragraph';
      role: 'analysis' | 'context';
      text: string;
      evidence?: ReportAnalysisEvidenceRef;
    };

export interface ReportStatBlock {
  kind: 'stat';
  label: string;
  value: string;
  detail?: string;
  evidence: ReportEvidenceRef;
}

export interface ReportTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
}

export type ReportTableCell = string | number | null;

export interface ReportTableBlock {
  kind: 'table';
  title?: string;
  caption?: string;
  columns: [ReportTableColumn, ...ReportTableColumn[]];
  rows: Array<Record<string, ReportTableCell>>;
  evidence: ReportEvidenceRef;
}

export interface ReportChartPoint {
  label: string;
  value: number;
}

export interface ReportChartSeries {
  label: string;
  points: [ReportChartPoint, ...ReportChartPoint[]];
}

export interface ReportChartBlock {
  kind: 'chart';
  chartType: 'bar' | 'column' | 'line';
  title?: string;
  caption?: string;
  valueLabel?: string;
  series: [ReportChartSeries, ...ReportChartSeries[]];
  evidence: ReportEvidenceRef;
}

export type ReportContentBlock =
  | ReportParagraphBlock
  | ReportStatBlock
  | ReportTableBlock
  | ReportChartBlock;

export interface ReportSectionV2 {
  id: string;
  heading?: string;
  blocks: [ReportContentBlock, ...ReportContentBlock[]];
}

export interface ReportMethodologyNote {
  title?: string;
  text: string;
  evidence?: ReportAnalysisEvidenceRef;
}

export interface FeaturedReportV2 {
  schemaVersion: 2;
  slug: string;
  date: string;
  headline: string;
  subheadline: string;

  /**
   * The report's one publishable synthesis. This is the conclusion the article
   * is organized to establish, not a list of observations or an overview.
   */
  synthesis: string;

  sections: [ReportSectionV2, ...ReportSectionV2[]];
  sources: [ReportSourceV2, ...ReportSourceV2[]];

  /**
   * Optional because most reports should not carry generic methodology copy.
   * Use only when a definition, comparison basis, transformation or limitation
   * materially affects how the evidence should be interpreted.
   */
  methodology?: ReportMethodologyNote;
}

export const reportCanonicalRecordTypes = [
  'statistics-indicator',
  'legislation',
  'integrity-entity',
  'integrity-disclosure',
  'integrity-audit-finding',
  'place',
  'project',
  'accountability-entry',
] as const;

export const reportContentBlockKinds = [
  'paragraph',
  'stat',
  'table',
  'chart',
] as const;
