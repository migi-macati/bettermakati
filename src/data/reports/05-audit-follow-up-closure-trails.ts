import * as shared from '../reportSharedData';
import type { FeaturedReportModule, ReportContentBlock } from '../reportTypes';

const {
  integrityAuditActions,
  integrityAuditFindings,
  integrityAuditResolutionTrails,
  integrityAuditSourceOnlyRecords,
  reportPublishedOn,
  moneyM,
  auditFindingsWithTrails,
  auditFollowUpSourceIds,
  auditFindingSourceIds,
  recordsFlagshipSources,
} = shared;

const reportModule: FeaturedReportModule = {
  report: {
    schemaVersion: 2,
    slug: 'audit-follow-up-closure-trails',
    date: reportPublishedOn,
    headline:
      'Three older Makati audit findings have follow-up records but no item-level closure in the indexed trail',
    subheadline: `BetterMakati’s finding-level audit layer contains ${auditFindingsWithTrails.length} historical findings and ${integrityAuditActions.length} later response or implementation-evidence records; none of the three trails currently establishes a finding-specific closure status.`,
    synthesis:
      'The public record indexed by BetterMakati shows later responses, controls or reporting for each of three historical audit findings, but the available follow-up does not map those later records back to the original recommendation closely enough to establish item-level closure.',
    sections: [
      {
        id: 'three-trails',
        heading: 'Later evidence exists in all three trails',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: `The Integrity layer currently contains ${integrityAuditFindings.length} finding-level historical audit records. They concern 2017 Development Fund loan payments, 2018 DepEd-Makati cash advances and 2018 Special Education Fund eligibility. Across those findings, BetterMakati has indexed ${integrityAuditActions.length} later response or implementation-evidence records.`,
            evidence: {
              sourceIds: ['1', '2', '3'],
              records: auditFindingsWithTrails.flatMap(({ finding }) => [
                {
                  recordType: 'integrity-audit-finding' as const,
                  id: finding.id,
                  href: '/integrity#audits',
                },
                {
                  recordType: 'accountability-entry' as const,
                  id: finding.accountabilityEntryId,
                  href: '/accountability?type=audit',
                },
              ]),
            },
          },
          {
            kind: 'stat',
            label:
              'Finding-level trails without item-specific closure in the indexed record',
            value:
              integrityAuditResolutionTrails.length +
              ' of ' +
              integrityAuditFindings.length,
            detail:
              '“Without item-specific closure” means the later record does not explicitly identify the original finding or recommendation with a resolved implementation status.',
            evidence: {
              sourceIds: ['1', '2', '3'],
              records: integrityAuditFindings.map(finding => ({
                recordType: 'integrity-audit-finding' as const,
                id: finding.id,
                href: '/integrity#audits',
              })),
            },
          },
          {
            kind: 'table',
            title: 'What the indexed trail shows',
            columns: [
              { key: 'period', label: 'Audit period' },
              { key: 'finding', label: 'Finding-level record' },
              { key: 'amount', label: 'Amount cited', align: 'right' },
              { key: 'laterEvidence', label: 'Later evidence' },
              { key: 'documentaryStatus', label: 'Documentary status' },
            ],
            rows: auditFindingsWithTrails.map(({ finding, actions }) => ({
              period: finding.auditPeriod,
              finding: finding.title,
              amount:
                finding.amountM === undefined ? '—' : moneyM(finding.amountM),
              laterEvidence:
                actions.length + ' record' + (actions.length === 1 ? '' : 's'),
              documentaryStatus: 'Item-level closure not established',
            })),
            evidence: {
              sourceIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
              records: integrityAuditFindings.map(finding => ({
                recordType: 'integrity-audit-finding' as const,
                id: finding.id,
                href: '/integrity#audits',
              })),
            },
          },
        ],
      },
      {
        id: 'what-follow-up-means',
        heading: 'The follow-up is real, but the continuity differs by finding',
        blocks: auditFindingsWithTrails.flatMap(
          ({ finding, trail, actions }) => [
            {
              kind: 'paragraph' as const,
              role: 'fact' as const,
              text: `${finding.title}: ${finding.findingAsStated} Later evidence in the indexed trail: ${actions
                .map(action => action.statementAsStated)
                .join(' ')}`,
              evidence: {
                sourceIds: [
                  ...new Set([
                    ...auditFindingSourceIds(finding.id),
                    ...auditFollowUpSourceIds(finding.id),
                  ]),
                ] as [string, ...string[]],
                records: [
                  {
                    recordType: 'integrity-audit-finding' as const,
                    id: finding.id,
                    href: '/integrity#audits',
                  },
                  {
                    recordType: 'accountability-entry' as const,
                    id: finding.accountabilityEntryId,
                    href: '/accountability?type=audit',
                  },
                ],
              },
            },
            {
              kind: 'paragraph' as const,
              role: 'analysis' as const,
              text: `Documentary reading: ${trail.resolution.status === 'unresolved' ? trail.resolution.reason : trail.resolution.statementAsStated} This is a statement about the continuity of the indexed public record, not a conclusion that the underlying condition continued after the audit period.`,
              evidence: {
                sourceIds: auditFollowUpSourceIds(finding.id),
                records: [
                  {
                    recordType: 'integrity-audit-finding' as const,
                    id: finding.id,
                    href: '/integrity#audits',
                  },
                ],
              },
            },
          ]
        ) as [ReportContentBlock, ...ReportContentBlock[]],
      },
      {
        id: 'scope',
        heading: 'What is outside this count',
        blocks: [
          {
            kind: 'paragraph',
            role: 'fact',
            text: `The Integrity layer also carries ${integrityAuditSourceOnlyRecords.length} source-only audit record: ${integrityAuditSourceOnlyRecords[0]?.title ?? 'the 2024 Makati Special Education Fund compliance audit'}. It is not counted among the three findings because the currently retrievable source path does not expose the finding-level text needed to create a canonical finding record.`,
            evidence: {
              sourceIds: ['1', '2', '9'],
              records: integrityAuditSourceOnlyRecords.map(record => ({
                recordType: 'accountability-entry' as const,
                id: record.accountabilityEntryId,
                href: '/accountability?type=audit',
              })),
            },
          },
          {
            kind: 'paragraph',
            role: 'analysis',
            text: 'The report therefore does not claim that all Makati audit findings remain open, nor that later corrective work did not occur. It identifies a narrower records problem: the public evidence currently indexed does not provide a finding-specific chain from recommendation to an explicit implementation or closure status for these three historical records.',
            evidence: {
              sourceIds: ['1', '2', '3', '6', '7', '8', '9'],
            },
          },
        ],
      },
    ],
    sources: recordsFlagshipSources,
    methodology: {
      text: '“Closure” is used only when a later source explicitly maps back to the same finding or recommendation and states an implementation status. Aggregate audit implementation counts, related control activity and later reporting are retained as follow-up evidence but are not promoted to finding-specific closure without that continuity.',
      evidence: {
        sourceIds: ['1', '2', '3', '6', '7', '8', '9'],
        records: integrityAuditFindings.map(finding => ({
          recordType: 'integrity-audit-finding' as const,
          id: finding.id,
          href: '/integrity#audits',
        })),
      },
    },
  },
  fil: null,
};

export default reportModule;
