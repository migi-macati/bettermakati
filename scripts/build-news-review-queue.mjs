import { readFile, writeFile } from 'node:fs/promises';
import {
  primaryNewsReviewOwner,
  routeNewsForReview,
  shouldCreateNewsReviewCandidate,
} from './news-review-routing.mjs';
import {
  newsCandidateMaterialEvidenceKeys,
  newsReviewResolutionPolicyVersion,
  newsResolutionDisposition,
  newsResolutionMatchesCandidate,
  validateNewsReviewResolution,
} from './news-review-resolution-policy.mjs';

const readJson = async (path, fallback) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
};

const readText = async path => {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return '';
    throw error;
  }
};

const snapshot = await readJson('data/news-discovery-snapshot.json', {
  version: 1,
  generatedAt: null,
  items: [],
});

const resolutionLedger = await readJson('data/news-review-resolutions.json', {
  version: 1,
  resolutions: [],
});

for (const resolution of resolutionLedger.resolutions || []) {
  const problem = validateNewsReviewResolution(resolution);
  if (problem) {
    throw new Error(
      'Invalid news review resolution ' +
        String(resolution?.id || '(missing id)') +
        ': ' +
        problem
    );
  }
}

const resolutions = resolutionLedger.resolutions || [];

const [
  accountabilityText,
  cityMonitorText,
  legislationText,
  electionText,
  publicRecordsText,
  mobilityText,
  serviceText,
] = await Promise.all([
  readText('src/data/accountabilitySupplement.ts'),
  readText('src/data/cityMonitor.ts'),
  readText('src/data/localLegislation.ts'),
  readText('src/data/electionCivic.ts'),
  readText('src/data/publicRecords.ts'),
  readText('src/data/mobilitySystems.ts'),
  readText('src/data/serviceDirectory.ts'),
]);

const normalize = value =>
  String(value || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const containsPhrase = (text, phrase) => {
  const haystack = ' ' + normalize(text) + ' ';
  const needle = normalize(phrase);
  return Boolean(needle) && haystack.includes(' ' + needle + ' ');
};

const nearestIdBefore = (content, index, maxDistance = 2600) => {
  const start = Math.max(0, index - maxDistance);
  const slice = content.slice(start, index);
  const matches = [...slice.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)];
  return matches.at(-1)?.[1] ?? null;
};

const extractFieldWithNearestId = (
  content,
  field,
  maxDistance = 1800
) => {
  const pairs = [];
  const pattern = new RegExp(
    "\\b" + field + ":\\s*['\"]([^'\"]+)['\"]",
    'g'
  );
  let match;

  while ((match = pattern.exec(content))) {
    const id = nearestIdBefore(content, match.index, maxDistance);
    if (!id) continue;
    pairs.push({ id, value: match[1] });
  }

  return pairs;
};

const procurementRefs = extractFieldWithNearestId(
  accountabilityText,
  'referenceNo',
  1600
).map(pair => ({
  ...pair,
  owner: 'accountability',
  recordType: 'accountability-record',
  href: '/accountability#procurement-' + pair.id,
}));

const legislationRefs = extractFieldWithNearestId(
  legislationText,
  'officialNumber',
  2200
).map(pair => ({
  ...pair,
  owner: 'legislation',
  recordType: 'legislation-record',
  href: '/legislation?record=' + encodeURIComponent(pair.id),
}));

const cityMonitorRefs = extractFieldWithNearestId(
  cityMonitorText,
  'referenceNo',
  2200
).map(pair => ({
  ...pair,
  owner: 'city-monitor',
  recordType: 'city-monitor-record',
  href: '/city-monitor/' + pair.id,
}));

const raRefs = [
  ...new Set(
    [...electionText.matchAll(/Republic Act No\.\s*(\d+)/gi)].map(
      match => 'Republic Act No. ' + match[1]
    )
  ),
].map(value => ({
  id: 'elections-current-law',
  value,
  owner: 'elections',
  recordType: 'election-record',
  href: '/elections',
}));

const exactUrlMatch = (content, url, owner, recordType, hrefFor) => {
  if (!url) return [];
  const index = content.indexOf(url);
  if (index < 0) return [];

  const id = nearestIdBefore(content, index);
  return [
    {
      owner,
      recordType,
      id: id || 'source-url-match',
      href: hrefFor(id),
      basis: 'exact-source-url',
      matchedText: url,
    },
  ];
};

const exactReferenceMatches = item => {
  const text = String(item.title || '') + ' ' + String(item.description || '');
  const matches = [];

  for (const record of [
    ...procurementRefs,
    ...legislationRefs,
    ...cityMonitorRefs,
    ...raRefs,
  ]) {
    if (!containsPhrase(text, record.value)) continue;
    matches.push({
      owner: record.owner,
      recordType: record.recordType,
      id: record.id,
      href: record.href,
      basis: 'exact-reference',
      matchedText: record.value,
    });
  }

  matches.push(
    ...exactUrlMatch(
      cityMonitorText,
      item.link,
      'city-monitor',
      'city-monitor-record',
      id => (id ? '/city-monitor/' + id : '/city-monitor')
    ),
    ...exactUrlMatch(
      publicRecordsText,
      item.link,
      'public-records',
      'public-record',
      id => (id ? '/records/' + id : '/records')
    )
  );

  return [
    ...new Map(
      matches.map(match => [
        [match.owner, match.recordType, match.id, match.basis].join(':'),
        match,
      ])
    ).values(),
  ];
};

const extractNamedRecords = content => {
  const records = [];
  const idRegex = /\bid:\s*['"]([^'"]+)['"]/g;
  let match;

  while ((match = idRegex.exec(content))) {
    const slice = content.slice(match.index, match.index + 1600);
    const name = slice.match(/\bname:\s*['"]([^'"]+)['"]/);
    const title = slice.match(/\btitle:\s*['"]([^'"]+)['"]/);
    const label = name?.[1] || title?.[1];
    if (!label) continue;
    records.push({ id: match[1], label });
  }

  return records;
};

const mobilityNames = extractNamedRecords(mobilityText);
const serviceNames = extractNamedRecords(serviceText);

const entityContextMatches = item => {
  const text = String(item.title || '') + ' ' + String(item.description || '');
  const matches = [];

  for (const record of mobilityNames) {
    if (!containsPhrase(text, record.label)) continue;
    matches.push({
      owner: 'mobility',
      recordType: 'mobility-service',
      id: record.id,
      label: record.label,
      href: '/mobility#system-' + record.id,
      basis: 'explicit-name',
    });
  }

  for (const record of serviceNames) {
    if (!containsPhrase(text, record.label)) continue;
    matches.push({
      owner: 'services',
      recordType: 'service',
      id: record.id,
      label: record.label,
      href: '/services/guide/' + record.id,
      basis: 'explicit-name',
    });
  }

  return [
    ...new Map(
      matches.map(match => [
        [match.owner, match.recordType, match.id].join(':'),
        match,
      ])
    ).values(),
  ];
};

const rawCandidates = (snapshot.items || [])
  .filter(shouldCreateNewsReviewCandidate)
  .map(item => {
    const routes = routeNewsForReview(item);
    const existingMatches = exactReferenceMatches(item);
    const contextMatches = entityContextMatches(item);
    const primaryOwner = primaryNewsReviewOwner(item);
    const id =
      'news-review:' +
      String(
        item.storyClusterId ||
          item.clusterKey ||
          normalize(item.title).replace(/\s+/g, '-')
      );

    const matchedOwners = new Set(existingMatches.map(match => match.owner));
    const reviewStatus = existingMatches.length
      ? 'canonical-match-found'
      : 'owner-review-needed';

    const candidate = {
      id,
      reviewStatus,
      publicEligible: false,
      storyClusterId: item.storyClusterId || null,
      clusterKey: item.clusterKey || null,
      title: item.title,
      description: item.description,
      publisher: item.source,
      sourceClass: item.sourceClass,
      sourceUrl: item.link,
      coverageSources: [
        {
          url: item.link,
          publisher: item.source,
          sourceClass: item.sourceClass,
          publishedAt: item.pubDate,
        },
        ...(item.relatedCoverage || []).map(source => ({
          url: source.link,
          publisher: source.source,
          sourceClass: source.sourceClass,
          publishedAt: source.pubDate,
        })),
      ],
      publishedAt: item.pubDate,
      retrievedAt: item.retrievedAt || snapshot.generatedAt || null,
      freshness: item.freshness,
      clusterSize: item.clusterSize || 1,
      primaryOwner,
      suggestedOwners: [...new Set(routes.map(route => route.owner))],
      routes: routes.map(route => ({
        topic: route.topic,
        owner: route.owner,
        action: route.action,
        existingCanonicalMatch: matchedOwners.has(route.owner),
      })),
      existingMatches,
      entityContext: contextMatches,
      nextAction: existingMatches.length
        ? 'Open the matched canonical record first. Update it only if the news item leads to stronger item-level evidence; do not create a duplicate record from the headline.'
        : 'Review the original article, locate the strongest owner-specific primary/official evidence, then update or create a canonical record only if that evidence satisfies the destination domain.',
      note:
        'This is an internal discovery/review candidate. News reporting is not itself a canonical BetterMakati record.',
    };

    return {
      ...candidate,
      materialEvidenceKeys: newsCandidateMaterialEvidenceKeys(candidate),
    };
  });

const activeCandidates = [];
const suppressedResolved = [];

for (const candidate of rawCandidates) {
  const matchingResolutions = resolutions
    .filter(resolution =>
      newsResolutionMatchesCandidate(resolution, candidate)
    )
    .sort((a, b) =>
      String(b.resolvedAt || '').localeCompare(String(a.resolvedAt || ''))
    );

  const latestResolution = matchingResolutions[0];
  const disposition = newsResolutionDisposition(
    latestResolution,
    candidate
  );

  if (disposition.suppress) {
    suppressedResolved.push({
      candidateId: candidate.id,
      storyClusterId: candidate.storyClusterId,
      title: candidate.title,
      resolutionId: latestResolution.id,
      decision: latestResolution.decision,
      resolvedAt: latestResolution.resolvedAt,
    });
    continue;
  }

  if (disposition.resurfaced) {
    activeCandidates.push({
      ...candidate,
      reviewStatus: 'material-update-review',
      priorResolution: {
        id: latestResolution.id,
        decision: latestResolution.decision,
        resolvedAt: latestResolution.resolvedAt,
        canonicalRef: latestResolution.canonicalRef || null,
      },
      newMaterialEvidenceKeys: disposition.newMaterialEvidenceKeys,
      nextAction:
        'This story was resolved before, but materially new official/canonical evidence is now present. Review only the new evidence and update the canonical owner if warranted.',
    });
    continue;
  }

  activeCandidates.push(candidate);
}

const candidates = activeCandidates.sort(
  (a, b) =>
    String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')) ||
    a.id.localeCompare(b.id)
);

const summary = {
  total: candidates.length,
  ownerReviewNeeded: candidates.filter(
    item => item.reviewStatus === 'owner-review-needed'
  ).length,
  canonicalMatchFound: candidates.filter(
    item => item.reviewStatus === 'canonical-match-found'
  ).length,
  materialUpdateReview: candidates.filter(
    item => item.reviewStatus === 'material-update-review'
  ).length,
  suppressedResolved: suppressedResolved.length,
  resolutionCount: resolutions.length,
  byOwner: Object.fromEntries(
    [...new Set(candidates.flatMap(item => item.suggestedOwners))]
      .sort()
      .map(owner => [
        owner,
        candidates.filter(item => item.suggestedOwners.includes(owner)).length,
      ])
  ),
};

const output = {
  version: 2,
  generatedAt: snapshot.generatedAt || null,
  sourceSnapshotVersion: snapshot.version || 1,
  resolutionPolicyVersion: newsReviewResolutionPolicyVersion,
  doctrine: {
    publicBoundary:
      'This queue is internal review state. No queue item is public civic data.',
    promotion:
      'A news item may discover a change. Promotion requires owner-specific primary/official evidence and the destination domain evidence rules.',
    deduplication:
      'Exact canonical references and exact source URLs are checked before review. A matched record should be updated rather than duplicated.',
    routing:
      'Topic routing suggests canonical owners. It does not decide that a reported claim is true or that a canonical record must change.',
    recurrence:
      'Resolved stories stay out of the active queue unless materially new official/canonical evidence appears. Resolution history lives in the append-only resolution ledger.',
  },
  summary,
  candidates,
  suppressedResolved,
};

await writeFile(
  'data/news-review-queue.json',
  JSON.stringify(output, null, 2) + '\n'
);

const lines = [
  '# BetterMakati news review queue',
  '',
  'Generated: ' + (output.generatedAt || 'not yet available'),
  '',
  'Internal review only. Headlines are discovery signals, not canonical civic records.',
  '',
  '- Active candidates: ' + summary.total,
  '- Owner review needed: ' + summary.ownerReviewNeeded,
  '- Canonical match found: ' + summary.canonicalMatchFound,
  '- Material-update review: ' + summary.materialUpdateReview,
  '- Resolved stories suppressed: ' + summary.suppressedResolved,
  '- Resolution history entries: ' + summary.resolutionCount,
  '',
  ...candidates.flatMap(candidate => [
    '## ' + candidate.title,
    '',
    '- Status: ' + candidate.reviewStatus,
    '- Published: ' + candidate.publishedAt,
    '- Publisher: ' + candidate.publisher,
    '- Primary owner: ' + (candidate.primaryOwner || 'unassigned'),
    '- Suggested owners: ' + candidate.suggestedOwners.join(', '),
    '- Existing canonical matches: ' +
      (candidate.existingMatches.length
        ? candidate.existingMatches
            .map(match => match.owner + ':' + match.id)
            .join(', ')
        : 'none'),
    ...(candidate.priorResolution
      ? [
          '- Prior resolution: ' +
            candidate.priorResolution.decision +
            ' (' +
            candidate.priorResolution.id +
            ')',
          '- New material evidence: ' +
            candidate.newMaterialEvidenceKeys.join(', '),
        ]
      : []),
    '- Source: ' + candidate.sourceUrl,
    '- Public item: no',
    '- Next action: ' + candidate.nextAction,
    '',
  ]),
];

await writeFile('data/news-review-queue.md', lines.join('\n') + '\n');

console.log(
  'News review queue built: ' +
    summary.total +
    ' active; ' +
    summary.ownerReviewNeeded +
    ' owner-review; ' +
    summary.canonicalMatchFound +
    ' canonical-match; ' +
    summary.materialUpdateReview +
    ' material-update; ' +
    summary.suppressedResolved +
    ' resolved suppressed; 0 auto-published.'
);
