import type { CivicSource } from './civicTypes';

/**
 * Integrity records describe public evidence and its provenance.
 * Missing, inaccessible or unresearched evidence is never a finding of wrongdoing.
 */

export type IntegrityEntityKind =
  | 'supplier'
  | 'contractor'
  | 'joint-venture'
  | 'government-body'
  | 'other-organization';

export type IntegrityIdentifierKind =
  | 'philgeps-registration'
  | 'sec-registration'
  | 'official-registry-id'
  | 'procurement-vendor-id'
  | 'other-official-id';

export interface IntegrityEntityIdentifier {
  kind: IntegrityIdentifierKind;
  value: string;
  sourceIds: string[];
  note?: string;
}

export interface IntegrityEntity {
  id: string;
  canonicalName: string;
  kind: IntegrityEntityKind;
  aliases?: string[];
  identifiers?: IntegrityEntityIdentifier[];
  sourceIds: string[];
  notes?: string[];
}

export type IntegritySourceClass =
  | 'city-government'
  | 'national-government'
  | 'audit-institution'
  | 'court-or-statute'
  | 'public-registry'
  | 'public-institution'
  | 'secondary-reporting';

export interface IntegritySource extends CivicSource {
  id: string;
  sourceClass: IntegritySourceClass;
  retrievedOn?: string;
}

export type IntegrityEvidenceAvailability =
  | 'documented'
  | 'source-not-found'
  | 'source-inaccessible'
  | 'restricted'
  | 'not-researched'
  | 'not-applicable';

export interface IntegrityEvidenceCheck {
  status: IntegrityEvidenceAvailability;
  checkedOn?: string;
  sourceIds: string[];
  note: string;
}

export interface IntegrityRecordReference {
  recordType:
    | 'entity'
    | 'procurement-award'
    | 'procurement-contract'
    | 'disclosure'
    | 'audit-finding'
    | 'audit-action'
    | 'accountability-entry';
  id: string;
}

export interface ProcurementAwardRecord {
  id: string;
  accountabilityEntryId: string;
  referenceNo: string;
  title: string;
  procuringEntity: string;
  supplierEntityIds: string[];
  bidOrAwardDate?: string;
  approvedBudgetM?: number;
  awardedAmountM?: number;
  sourceIds: string[];
  notes?: string[];
}

export interface ProcurementContractRecord {
  id: string;
  awardId: string;
  supplierEntityIds: string[];
  evidence: IntegrityEvidenceCheck;
  contractReference?: string;
  signedDate?: string;
  contractAmountM?: number;
  sourceIds: string[];
  notes?: string[];
}

export type IntegrityDisclosureKind =
  | 'beneficial-ownership'
  | 'legal-ownership'
  | 'conflict-of-interest'
  | 'recusal'
  | 'related-party'
  | 'other-disclosure';

export type IntegrityDisclosureAssessment =
  | {
      status: 'source-backed';
      statementAsStated: string;
      sourceIds: [string, ...string[]];
      asOfDate?: string;
    }
  | {
      status: 'unavailable' | 'restricted' | 'not-applicable' | 'not-researched';
      note: string;
      checkedOn?: string;
      sourceIds?: string[];
    };

export interface IntegrityDisclosureRecord {
  id: string;
  kind: IntegrityDisclosureKind;
  subjectEntityId?: string;
  subjectNameAsStated?: string;
  relatedEntityId?: string;
  relatedNameAsStated?: string;
  assessment: IntegrityDisclosureAssessment;
  notes?: string[];
}

export interface AuditFindingRecord {
  id: string;
  accountabilityEntryId: string;
  auditPeriod: string;
  title: string;
  findingAsStated: string;
  recommendationAsStated?: string;
  responsibleBodies: string[];
  amountM?: number;
  sourceIds: string[];
  notes?: string[];
}

export type AuditActionKind =
  | 'management-response'
  | 'corrective-action'
  | 'implementation-evidence'
  | 'later-audit-status'
  | 'other-as-stated';

export type AuditContinuityBasis =
  | 'explicit-finding-reference'
  | 'explicit-recommendation-reference'
  | 'exact-record-reference'
  | 'unresolved';

export interface AuditCorrectiveActionEvidence {
  id: string;
  findingId: string;
  kind: AuditActionKind;
  statementAsStated: string;
  date?: string;
  continuityBasis: AuditContinuityBasis;
  sourceIds: string[];
  notes?: string[];
}

export type AuditResolutionState =
  | {
      status: 'unresolved';
      reason: string;
    }
  | {
      status:
        | 'implemented-as-stated'
        | 'partially-implemented-as-stated'
        | 'not-acted-on-as-stated'
        | 'open-as-stated'
        | 'other-as-stated';
      statementAsStated: string;
      sourceId: string;
      asOfDate?: string;
    };

export interface AuditResolutionTrail {
  findingId: string;
  actionEvidenceIds: string[];
  resolution: AuditResolutionState;
}

/**
 * Guardrail: these schemas intentionally contain no risk score, corruption score,
 * suspicion flag or guilt-by-association field. They store only sourced facts,
 * explicit source gaps and source-backed relationships.
 */
