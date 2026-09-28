export const newsReviewResolutionPolicyVersion = '2026-09-28.w5-8e';

export const newsReviewDecisionValues = [
  'update-existing',
  'create-canonical-record',
  'context-only',
  'duplicate',
  'stale',
  'insufficient-evidence',
  'out-of-scope',
];

const terminalDecisions = new Set(['stale', 'out-of-scope']);

const uniqueSorted = values =>
  [...new Set((values || []).filter(Boolean).map(String))].sort();

export const newsCandidateCoverageUrls = candidate =>
  uniqueSorted([
    candidate.sourceUrl,
    ...(candidate.coverageSources || []).map(source => source.url),
  ]);

export const newsCandidateMaterialEvidenceKeys = candidate => {
  const keys = [];

  for (const match of candidate.existingMatches || []) {
    keys.push(
      'canonical:' +
        match.owner +
        ':' +
        match.recordType +
        ':' +
        match.id
    );
  }

  const sources = [
    {
      url: candidate.sourceUrl,
      sourceClass: candidate.sourceClass,
    },
    ...(candidate.coverageSources || []),
  ];

  for (const source of sources) {
    if (
      source.url &&
      ['government-primary', 'government-information'].includes(
        source.sourceClass
      )
    ) {
      keys.push('official-source:' + source.url);
    }
  }

  for (const route of candidate.routes || []) {
    keys.push('route:' + route.owner + ':' + route.topic);
  }

  return uniqueSorted(keys);
};

export const validateNewsReviewResolution = resolution => {
  if (!resolution || typeof resolution !== 'object') {
    return 'Resolution must be an object.';
  }

  if (!resolution.id || !String(resolution.id).trim()) {
    return 'Resolution id is required.';
  }

  if (!newsReviewDecisionValues.includes(resolution.decision)) {
    return 'Unsupported resolution decision: ' + resolution.decision;
  }

  if (!resolution.resolvedAt || Number.isNaN(Date.parse(resolution.resolvedAt))) {
    return 'Resolution resolvedAt must be a valid timestamp.';
  }

  const matchKeys = resolution.match || {};
  const hasMatchKey =
    Boolean(matchKeys.candidateId) ||
    Boolean(matchKeys.storyClusterId) ||
    (Array.isArray(matchKeys.sourceUrls) && matchKeys.sourceUrls.length > 0);

  if (!hasMatchKey) {
    return 'Resolution must preserve a candidate, story-cluster or source-URL match key.';
  }

  if (
    ['update-existing', 'create-canonical-record', 'duplicate'].includes(
      resolution.decision
    ) &&
    !resolution.canonicalRef
  ) {
    return (
      'Resolution decision ' +
      resolution.decision +
      ' requires canonicalRef.'
    );
  }

  if (
    !Array.isArray(resolution.materialEvidenceKeysAtResolution)
  ) {
    return 'Resolution must preserve materialEvidenceKeysAtResolution.';
  }

  return null;
};

export const newsResolutionMatchesCandidate = (resolution, candidate) => {
  if (!resolution?.match) return false;

  if (
    resolution.match.candidateId &&
    resolution.match.candidateId === candidate.id
  ) {
    return true;
  }

  if (
    resolution.match.storyClusterId &&
    resolution.match.storyClusterId === candidate.storyClusterId
  ) {
    return true;
  }

  const resolvedUrls = new Set(resolution.match.sourceUrls || []);
  return newsCandidateCoverageUrls(candidate).some(url => resolvedUrls.has(url));
};

export const materiallyNewEvidenceKeys = (resolution, candidate) => {
  const previous = new Set(
    resolution?.materialEvidenceKeysAtResolution || []
  );
  return newsCandidateMaterialEvidenceKeys(candidate).filter(
    key => !previous.has(key)
  );
};

export const newsResolutionDisposition = (resolution, candidate) => {
  if (!resolution || !newsResolutionMatchesCandidate(resolution, candidate)) {
    return {
      suppress: false,
      resurfaced: false,
      newMaterialEvidenceKeys: [],
    };
  }

  if (terminalDecisions.has(resolution.decision)) {
    return {
      suppress: true,
      resurfaced: false,
      newMaterialEvidenceKeys: [],
    };
  }

  const newMaterialEvidenceKeys = materiallyNewEvidenceKeys(
    resolution,
    candidate
  );

  return {
    suppress: newMaterialEvidenceKeys.length === 0,
    resurfaced: newMaterialEvidenceKeys.length > 0,
    newMaterialEvidenceKeys,
  };
};
