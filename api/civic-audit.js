import { civicEntityById } from '../data/civic-entity-index.mjs';

const CAMPAIGN = {
  id: 'makati-public-park-accessibility-2026-pilot',
  targetEntityIds: [
    'magallanes-interchange-park',
    'kennely-ann-lacia-binay-park-guadalupe-nuevo',
    'guadalupe-viejo-cloverleaf-park',
    'poblacion-park',
    'valenzuela-park',
    'poblacion-linear-park',
    'plaza-cristo-rey',
    'riverside-carmona',
    'buendia-plaza',
    'freedom-park',
    'edsa-buendia-park',
    'guadalupe-nuevo-linear-park',
    'edsa-pinagkaisahan-park',
  ],
  familyId: 'park-public-space',
  questionSetId: 'park-public-space-v1',
  questionIds: [
    'entrance-access',
    'step-free-access',
    'seating',
    'toilets',
  ],
  requiredQuestionIds: [
    'entrance-access',
    'step-free-access',
    'seating',
    'toilets',
  ],
  startsAt: '2026-09-26T10:03:00+08:00',
  endsAt: '2026-10-26T23:59:59+08:00',
  minimumObservationsPerEntity: 2,
};

const headersFor = token => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'BetterMakati-civic-audit/1.0',
  };
  if (token) headers.Authorization = 'Bearer ' + token;
  return headers;
};

const repository = () =>
  process.env.BETTERMAKATI_GITHUB_REPO || 'migi-macati/bettermakati';

const apiBase = () => 'https://api.github.com/repos/' + repository();

const parseTaggedJson = (body, marker) => {
  const match = String(body || '').match(
    new RegExp('<!--\\s*' + marker + '\\s+({[\\s\\S]*?})\\s*-->')
  );
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
};

const isSubstantive = value =>
  !(typeof value === 'string' && value.startsWith('not-observed'));

const fetchObservationThreads = async token => {
  const query = encodeURIComponent(
    'repo:' + repository() + ' is:issue in:body "civic-observation-thread"'
  );
  const response = await fetch(
    'https://api.github.com/search/issues?q=' + query + '&per_page=100',
    { headers: headersFor(token) }
  );
  if (!response.ok) throw new Error('Observation thread search failed');
  const data = await response.json();
  return (data.items || []).filter(issue =>
    String(issue.title || '').startsWith('[Civic Observations]')
  );
};

const fetchComments = async (token, issueNumber) => {
  const response = await fetch(
    apiBase() + '/issues/' + issueNumber + '/comments?per_page=100',
    { headers: headersFor(token) }
  );
  if (!response.ok) throw new Error('Observation comments unavailable');
  return response.json();
};

const inCampaignWindow = observedAt => {
  const value = new Date(observedAt).getTime();
  return (
    Number.isFinite(value) &&
    value >= new Date(CAMPAIGN.startsAt).getTime() &&
    value <= new Date(CAMPAIGN.endsAt).getTime()
  );
};

const emptyQuestionSummary = questionId => ({
  questionId,
  sampleCount: 0,
  distribution: {},
  latestObservedAt: null,
});

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=180');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const campaignId = String(req.query?.campaign || '').trim();
  if (campaignId && campaignId !== CAMPAIGN.id) {
    return res.status(404).json({ error: 'Unknown civic audit campaign.' });
  }

  const token = process.env.BETTERMAKATI_GITHUB_TOKEN;
  const targetIds = new Set(CAMPAIGN.targetEntityIds);

  try {
    const threads = await fetchObservationThreads(token);
    const relevantThreads = threads
      .map(issue => ({
        issue,
        meta: parseTaggedJson(issue.body, 'civic-observation-thread'),
      }))
      .filter(
        item =>
          item.meta?.entityId &&
          targetIds.has(item.meta.entityId) &&
          item.meta.familyId === CAMPAIGN.familyId
      );

    const commentSets = await Promise.all(
      relevantThreads.map(async item => ({
        entityId: item.meta.entityId,
        comments: await fetchComments(token, item.issue.number),
      }))
    );

    const observations = commentSets
      .flatMap(({ entityId, comments }) =>
        comments.map(comment => {
          const observation = parseTaggedJson(comment.body, 'civic-observation');
          if (!observation || observation.entityId !== entityId) return null;
          if (observation.familyId !== CAMPAIGN.familyId) return null;
          if (observation.questionSetId !== CAMPAIGN.questionSetId) return null;
          if (!inCampaignWindow(observation.observedAt)) return null;
          const answers = Array.isArray(observation.answers)
            ? observation.answers.filter(answer =>
                CAMPAIGN.questionIds.includes(answer.questionId)
              )
            : [];
          if (!answers.length) return null;
          return {
            id: comment.id,
            url: comment.html_url,
            submittedAt: comment.created_at,
            ...observation,
            answers,
          };
        })
      )
      .filter(Boolean)
      .sort((a, b) => new Date(b.observedAt) - new Date(a.observedAt));

    const entities = CAMPAIGN.targetEntityIds.map(entityId => {
      const canonical = civicEntityById.get(entityId);
      const entityObservations = observations.filter(
        observation => observation.entityId === entityId
      );
      const substantiveQuestionIds = new Set(
        entityObservations.flatMap(observation =>
          observation.answers
            .filter(answer => isSubstantive(answer.value))
            .map(answer => answer.questionId)
        )
      );
      const isComplete =
        entityObservations.length >= CAMPAIGN.minimumObservationsPerEntity &&
        CAMPAIGN.requiredQuestionIds.every(questionId =>
          substantiveQuestionIds.has(questionId)
        );

      return {
        entityId,
        name: canonical?.name || entityId,
        observationCount: entityObservations.length,
        latestObservedAt: entityObservations[0]?.observedAt || null,
        substantiveQuestionCount: substantiveQuestionIds.size,
        requiredQuestionCount: CAMPAIGN.requiredQuestionIds.length,
        isComplete,
      };
    });

    const questions = CAMPAIGN.questionIds.map(questionId => {
      const summary = emptyQuestionSummary(questionId);
      for (const observation of observations) {
        for (const answer of observation.answers) {
          if (
            answer.questionId !== questionId ||
            !isSubstantive(answer.value)
          ) {
            continue;
          }
          const key = String(answer.value);
          summary.sampleCount += 1;
          summary.distribution[key] = (summary.distribution[key] || 0) + 1;
          if (
            !summary.latestObservedAt ||
            new Date(observation.observedAt) >
              new Date(summary.latestObservedAt)
          ) {
            summary.latestObservedAt = observation.observedAt;
          }
        }
      }
      return summary;
    });

    const observedEntities = entities.filter(
      entity => entity.observationCount > 0
    ).length;
    const completeEntities = entities.filter(entity => entity.isComplete).length;
    const latestObservedAt = observations[0]?.observedAt || null;

    return res.status(200).json({
      campaignId: CAMPAIGN.id,
      status: 'collecting',
      asOf: new Date().toISOString(),
      startsAt: CAMPAIGN.startsAt,
      endsAt: CAMPAIGN.endsAt,
      targetCount: CAMPAIGN.targetEntityIds.length,
      minimumObservationsPerEntity: CAMPAIGN.minimumObservationsPerEntity,
      observationCount: observations.length,
      observedEntities,
      completeEntities,
      latestObservedAt,
      entities,
      questions,
    });
  } catch {
    return res.status(503).json({
      error: 'Civic audit observations are temporarily unavailable.',
      campaignId: CAMPAIGN.id,
      targetCount: CAMPAIGN.targetEntityIds.length,
      observationCount: 0,
      observedEntities: 0,
      completeEntities: 0,
      entities: [],
      questions: CAMPAIGN.questionIds.map(emptyQuestionSummary),
    });
  }
}
