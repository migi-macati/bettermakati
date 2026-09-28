import { readFile, writeFile } from 'node:fs/promises';

const readJson = async (path, fallback) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
};

const discovery = await readJson('data/civic-time-discovery-sources.json', {
  version: 1,
  sources: [],
});
const reviewed = await readJson('data/civic-time-reviewed-discoveries.json', {
  version: 1,
  discoveries: [],
});
const freshness = await readJson('data/freshness-review-queue.json', {
  version: 1,
  generatedAt: null,
  items: [],
});

const discoveryByKey = new Map(
  (discovery.sources || []).map(source => [
    source.sourceSystem + ':' + source.sourceId,
    source,
  ])
);

const signalCandidates = [];
for (const item of freshness.items || []) {
  if (item.status !== 'open') continue;

  const config = discoveryByKey.get(item.system + ':' + item.sourceId);
  if (!config) continue;

  if (!(config.signalModes || []).includes(item.signal)) continue;

  signalCandidates.push({
    id:
      'signal:' +
      item.system +
      ':' +
      item.sourceId +
      ':' +
      item.signal,
    candidateType: 'source-signal',
    reviewStatus: 'source-review-needed',
    publicEligible: false,
    title: config.label + ' — ' + item.signalLabel,
    sourceSystem: item.system,
    sourceId: item.sourceId,
    sourceUrl: item.url,
    detectedAt: item.latestDetectedAt || item.firstDetectedAt || null,
    allowedKinds: config.allowedKinds || [],
    suggestedOwner: config.ownerHint,
    extractionMode: config.extractionMode,
    action:
      item.action +
      ' Then preserve an item-level date and canonical owner before creating any Civic Timeline projection.',
    note: config.note,
  });
}

const reviewedCandidates = (reviewed.discoveries || []).map(item => ({
  id: 'reviewed:' + item.id,
  candidateType: 'reviewed-discovery',
  reviewStatus: item.reviewStatus,
  publicEligible:
    item.reviewStatus === 'ready-for-projection' &&
    Boolean(item.canonicalRef),
  title: item.title,
  summary: item.summary,
  kind: item.kind,
  actionability: item.actionability,
  sourceSystem: item.sourceSystem,
  sourceId: item.sourceId,
  sourceUrl: item.source?.url,
  reviewedAt: item.reviewedAt,
  temporal: item.temporal,
  geography: item.geography,
  suggestedOwner: item.suggestedOwner,
  canonicalRef: item.canonicalRef,
  reviewerNote: item.reviewerNote,
}));

const candidates = [...reviewedCandidates, ...signalCandidates].sort(
  (a, b) =>
    String(b.reviewedAt || b.detectedAt || '').localeCompare(
      String(a.reviewedAt || a.detectedAt || '')
    ) || a.id.localeCompare(b.id)
);

const latest = [
  freshness.generatedAt,
  reviewed.reviewedOn ? reviewed.reviewedOn + 'T00:00:00+08:00' : null,
  ...reviewedCandidates.map(item => item.reviewedAt),
  ...signalCandidates.map(item => item.detectedAt),
]
  .filter(Boolean)
  .sort()
  .at(-1) || null;

const summary = {
  total: candidates.length,
  sourceReviewNeeded: candidates.filter(
    item => item.reviewStatus === 'source-review-needed'
  ).length,
  ownerGap: candidates.filter(item => item.reviewStatus === 'owner-gap').length,
  readyForProjection: candidates.filter(
    item => item.reviewStatus === 'ready-for-projection'
  ).length,
  publicEligible: candidates.filter(item => item.publicEligible).length,
};

const output = {
  version: 1,
  generatedAt: latest,
  doctrine: {
    publicBoundary:
      'This queue is internal review state. No queue item is a public Civic Timeline item.',
    promotion:
      'Only a reviewed discovery with explicit temporal evidence and a resolved canonical owner may become ready-for-projection.',
  },
  summary,
  candidates,
};

await writeFile(
  'data/civic-time-candidate-queue.json',
  JSON.stringify(output, null, 2) + '\n'
);

const lines = [
  '# BetterMakati Civic Timeline candidate queue',
  '',
  'Generated: ' + (latest || 'not yet available'),
  '',
  'This is an internal review queue. Nothing here is a public Calendar item.',
  '',
  '- Total candidates: ' + summary.total,
  '- Source review needed: ' + summary.sourceReviewNeeded,
  '- Canonical owner gap: ' + summary.ownerGap,
  '- Ready for projection: ' + summary.readyForProjection,
  '- Public eligible at queue stage: ' + summary.publicEligible,
  '',
  ...candidates.flatMap(candidate => [
    '## ' + candidate.title,
    '',
    '- Status: ' + candidate.reviewStatus,
    '- Suggested owner: ' + (candidate.suggestedOwner || 'unassigned'),
    '- Source: ' + (candidate.sourceUrl || 'not preserved'),
    ...(candidate.temporal
      ? [
          '- Candidate date: ' +
            candidate.temporal.value +
            ' (' +
            candidate.temporal.semantic +
            ')',
        ]
      : []),
    '- Public item: no',
    '- Next action: ' +
      (candidate.action ||
        candidate.reviewerNote ||
        'Complete item-level source review and canonical-owner resolution.'),
    '',
  ]),
];

await writeFile(
  'data/civic-time-candidate-queue.md',
  lines.join('\n')
);

console.log(
  'Civic Timeline candidate queue built: ' +
    summary.total +
    ' total; ' +
    summary.sourceReviewNeeded +
    ' source-review; ' +
    summary.ownerGap +
    ' owner-gap; ' +
    summary.readyForProjection +
    ' ready; 0 auto-published.'
);
