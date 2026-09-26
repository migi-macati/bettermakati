export const OUTCOME_INSTRUMENTATION_VERSION = 1;

export const observationRecentWindowDays = {
  'street-public-realm': 30,
  'park-public-space': 30,
  'public-facility': 60,
  'transport-stop-terminal': 30,
  'transport-route': 30,
};

const validTime = value => {
  const time = new Date(value || '').getTime();
  return Number.isFinite(time) ? time : null;
};

const eventTime = event =>
  validTime(event?.recordedAt) ?? validTime(event?.createdAt);

const firstEvent = (events, status) =>
  events
    .filter(event => event?.status === status && eventTime(event) !== null)
    .sort((a, b) => eventTime(a) - eventTime(b))[0] ?? null;

const stageView = event => {
  if (!event) return null;
  return {
    at: event.recordedAt || event.createdAt || null,
    authority: event.authority || '',
    channel: event.channel || '',
    externalReference: event.externalReference || '',
    url: event.url || '',
  };
};

const elapsedHours = (start, end) => {
  const startTime = validTime(start);
  const endTime = validTime(end);
  if (startTime === null || endTime === null || endTime < startTime) return null;
  return Math.round(((endTime - startTime) / 3_600_000) * 1000) / 1000;
};

export const caseOutcomeInstrumentation = ({
  kind,
  createdAt,
  adminEvents = [],
  communityResolvedSignals = 0,
}) => {
  const eligibleCivicCase = kind === 'report' || kind === 'proposal';

  const reviewedEvent = firstEvent(adminEvents, 'reviewed');
  const routedEvent = firstEvent(adminEvents, 'forwarded');
  const acknowledgedEvent = firstEvent(adminEvents, 'acknowledged');
  const actionEvent = firstEvent(adminEvents, 'action-reported');
  const resolvedEvent = firstEvent(
    adminEvents,
    'community-verified-resolved'
  );

  const stages = {
    reviewed: stageView(reviewedEvent),
    routed: stageView(routedEvent),
    acknowledged: stageView(acknowledgedEvent),
    actionReported: stageView(actionEvent),
    documentedResolution: stageView(resolvedEvent),
  };

  const ordered = [
    ['reviewed', reviewedEvent],
    ['routed', routedEvent],
    ['acknowledged', acknowledgedEvent],
    ['actionReported', actionEvent],
    ['documentedResolution', resolvedEvent],
  ].filter(([, event]) => event);

  const stageOrderAnomalies = [];
  for (let index = 1; index < ordered.length; index += 1) {
    const [previousName, previousEvent] = ordered[index - 1];
    const [currentName, currentEvent] = ordered[index];
    if (eventTime(currentEvent) < eventTime(previousEvent)) {
      stageOrderAnomalies.push(currentName + '-before-' + previousName);
    }
  }

  return {
    version: OUTCOME_INSTRUMENTATION_VERSION,
    eligibleCivicCase,
    cohortCreatedAt: eligibleCivicCase ? createdAt : null,
    stages,
    durationsHours: eligibleCivicCase
      ? {
          timeToReview: elapsedHours(createdAt, stages.reviewed?.at),
          timeToRouting: elapsedHours(createdAt, stages.routed?.at),
          timeToAcknowledgement: elapsedHours(
            createdAt,
            stages.acknowledged?.at
          ),
          timeToActionEvidence: elapsedHours(
            createdAt,
            stages.actionReported?.at
          ),
          timeToDocumentedResolution: elapsedHours(
            createdAt,
            stages.documentedResolution?.at
          ),
        }
      : null,
    evidenceDiagnostics: {
      routingEvidenceComplete: Boolean(
        stages.routed?.authority && stages.routed?.channel
      ),
      acknowledgementEvidenceComplete: Boolean(
        stages.acknowledged?.authority
      ),
      stageOrderAnomalies,
    },
    communityResolutionSignalCount: Number(communityResolvedSignals) || 0,
  };
};

export const observationFreshnessInstrumentation = ({
  familyId,
  observations = [],
  asOf,
}) => {
  const asOfTime = validTime(asOf) ?? Date.now();
  const dated = observations
    .filter(observation => validTime(observation?.observedAt) !== null)
    .sort(
      (a, b) =>
        validTime(b.observedAt) - validTime(a.observedAt)
    );
  const latestObservedAt = dated[0]?.observedAt || null;
  const latestTime = validTime(latestObservedAt);
  const recentWindowDays = observationRecentWindowDays[familyId] ?? null;
  const latestObservationAgeDays =
    latestTime === null
      ? null
      : Math.max(
          0,
          Math.round(((asOfTime - latestTime) / 86_400_000) * 100) / 100
        );

  return {
    version: OUTCOME_INSTRUMENTATION_VERSION,
    metricId: 'latest-observation-age-days',
    familyId: familyId || null,
    observationCount: dated.length,
    latestObservedAt,
    latestObservationAgeDays,
    recentWindowDays,
    hasRecentObservation:
      latestObservationAgeDays !== null && recentWindowDays !== null
        ? latestObservationAgeDays <= recentWindowDays
        : null,
  };
};

export const auditCoverageMetricInputs = ({
  campaignId,
  asOf,
  startsAt,
  endsAt,
  inventoryClaim,
  targetCount,
  observedEntities,
  completeEntities,
}) => ({
  version: OUTCOME_INSTRUMENTATION_VERSION,
  campaignId,
  asOf,
  startsAt,
  endsAt,
  inventoryClaim,
  metrics: {
    'audit-observed-entity-coverage': {
      numerator: observedEntities,
      denominator: targetCount,
    },
    'audit-complete-entity-coverage': {
      numerator: completeEntities,
      denominator: targetCount,
    },
  },
});
