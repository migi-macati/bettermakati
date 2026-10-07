import type {
  FeaturedReportModule,
  ReportContentBlock,
  ReportEvidenceRef,
} from './reportTypes';

const evidenceFor = (
  block: ReportContentBlock
): ReportEvidenceRef | undefined => {
  if (block.kind !== 'paragraph' || block.role === 'fact')
    return block.evidence;
  return block.evidence?.sourceIds?.length
    ? { sourceIds: block.evidence.sourceIds as [string, ...string[]] }
    : undefined;
};

export const validateFeaturedReportModules = (
  modules: FeaturedReportModule[]
) => {
  const slugs = new Set<string>();

  for (const module of modules) {
    const { report, fil } = module;
    if (
      !report?.slug ||
      !report.headline ||
      !report.subheadline ||
      !report.synthesis
    ) {
      throw new Error(
        'Featured Report module is missing required English fields.'
      );
    }
    if (slugs.has(report.slug)) {
      throw new Error('Duplicate Featured Report slug: ' + report.slug);
    }
    slugs.add(report.slug);

    if (!Array.isArray(report.sections) || report.sections.length === 0) {
      throw new Error('Featured Report has no sections: ' + report.slug);
    }
    if (!Array.isArray(report.sources) || report.sources.length === 0) {
      throw new Error('Featured Report has no sources: ' + report.slug);
    }

    const sourceIds = new Set(report.sources.map(source => source.id));
    if (sourceIds.size !== report.sources.length) {
      throw new Error(
        'Featured Report has duplicate source IDs: ' + report.slug
      );
    }
    const assertEvidence = (sourceIdsToCheck: string[] | undefined) => {
      for (const sourceId of sourceIdsToCheck ?? []) {
        if (!sourceIds.has(sourceId)) {
          throw new Error(
            `Featured Report ${report.slug} references missing source ${sourceId}.`
          );
        }
      }
    };

    for (const section of report.sections) {
      for (const block of section.blocks) {
        assertEvidence(evidenceFor(block)?.sourceIds);
      }
    }
    assertEvidence(report.methodology?.evidence?.sourceIds);

    if (fil) {
      if (
        !fil.headline ||
        !fil.subheadline ||
        !fil.synthesis ||
        !fil.sections.length
      ) {
        throw new Error(
          'Featured Report has incomplete Filipino fields: ' + report.slug
        );
      }
      for (const section of fil.sections) {
        for (const block of section.blocks) {
          assertEvidence(evidenceFor(block)?.sourceIds);
        }
      }
      assertEvidence(fil.methodology?.evidence?.sourceIds);
    }
  }
};
