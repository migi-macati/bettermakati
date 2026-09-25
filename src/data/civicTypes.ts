export interface CivicSource {
  label: string;
  url: string;
  publisher: string;
  publishedOrPeriod?: string;
  note?: string;
}


export interface AccountabilityStage {
  label: string;
  status: 'documented' | 'source-gap';
  date?: string;
  detail?: string;
}

export interface ProcurementTrace {
  referenceNo: string;
  approvedBudgetM?: number;
  awardedAmountM?: number;
  supplier?: string;
  bidDate?: string;
  evidenceCheckedOn?: string;
  stages: AccountabilityStage[];
}

export interface AuditTrace {
  finding: string;
  recommendation?: string;
  managementResponse?: string;
  followUpStatus?: string;
}


export type CommitmentOutcomeStatus =
  | 'in-progress'
  | 'delivered'
  | 'delivered-late'
  | 'source-gap';

export interface CommitmentTrace {
  commitmentText: string;
  announcedDate?: string;
  target?: string;
  outcomeStatus: CommitmentOutcomeStatus;
  evidenceDate?: string;
  outcome: string;
}

export type AccountabilityStatus =
  | 'planned'
  | 'in-progress'
  | 'completed'
  | 'reported'
  | 'source-gap';

export interface AccountabilityEntry {
  id: string;
  title: string;
  type: 'project' | 'fiscal' | 'service' | 'audit' | 'commitment';
  status: AccountabilityStatus;
  summary: string;
  responsibleBodies: string[];
  period: string;
  targetDate?: string;
  location?: string;
  barangaySlug?: string;
  plannedAmountM?: number;
  reportedAmountM?: number;
  actualAmountM?: number;
  completionPct?: number;
  relatedHref?: string;
  lastVerified: string;
  sources: CivicSource[];
  notes?: string[];
  procurement?: ProcurementTrace;
  audit?: AuditTrace;
  commitment?: CommitmentTrace;
}

export interface CoverageGap {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  checkedSources?: CivicSource[];
  lastChecked: string;
}

export type ParticipationStatus = 'open' | 'closed' | 'source-gap';

export interface ParticipationOpportunity {
  id: string;
  title: string;
  status: ParticipationStatus;
  kind:
    | 'consultation'
    | 'assembly'
    | 'hearing'
    | 'community-proposal'
    | 'other';
  scope: string;
  summary: string;
  dates?: string;
  decisionOwner?: string;
  outcome?: string;
  source: CivicSource;
}
