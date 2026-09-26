import { placeObservationById } from '../data/place-observation-index.mjs';

const WINDOW_MS = 60_000;
const DAY_MS = 86_400_000;
const MAX_PER_MINUTE = 8;
const MAX_PER_DAY = 40;

const minuteBuckets =
  globalThis.__betterMakatiObservationMinuteBuckets || new Map();
const dayBuckets =
  globalThis.__betterMakatiObservationDayBuckets || new Map();
globalThis.__betterMakatiObservationMinuteBuckets = minuteBuckets;
globalThis.__betterMakatiObservationDayBuckets = dayBuckets;

const ip = req =>
  String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .split(',')[0]
    .trim();

const allowedByBucket = (bucketMap, key, windowMs, max) => {
  const now = Date.now();
  const bucket = bucketMap.get(key);
  if (!bucket || now - bucket.startedAt >= windowMs) {
    bucketMap.set(key, { startedAt: now, count: 1 });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= max;
};

const isAllowed = req => {
  const key = ip(req);
  return (
    allowedByBucket(minuteBuckets, key, WINDOW_MS, MAX_PER_MINUTE) &&
    allowedByBucket(dayBuckets, key, DAY_MS, MAX_PER_DAY)
  );
};

const clean = (value, max = 2000) =>
  String(value || '')
    .replace(/\u0000/g, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .trim()
    .slice(0, max);

const cleanUrl = value => {
  const text = clean(value, 1000);
  if (!text) return '';
  try {
    const parsed = new URL(text);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : '';
  } catch {
    return '';
  }
};

const headersFor = token => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'BetterMakati-place-observations/1.0',
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

const familyCategories = {
  'street-public-realm': new Set([
    'street-segment',
    'sidewalk-segment',
    'crossing',
    'bike-lane',
    'bridge',
    'drainage',
  ]),
  'park-public-space': new Set(['park']),
  'public-facility': new Set([
    'public-office',
    'health-center',
    'community-center',
    'public-market',
    'public-toilet',
    'heritage-site',
  ]),
  'transport-stop-terminal': new Set(['transport-stop', 'transport-terminal']),
  'transport-route': new Set(['transport-route']),
};

const questionTypes = {
  'street-public-realm': {
    'pedestrian-path': 'accessContinuity',
    surface: 'condition',
    'crossing-access': 'accessContinuity',
    'step-free-access': 'stepFreeAccess',
    lighting: 'lighting',
    shade: 'shade',
    cleanliness: 'cleanliness',
    drainage: 'drainage',
    obstruction: 'yesNoObserved',
  },
  'park-public-space': {
    'entrance-access': 'availability',
    'step-free-access': 'stepFreeAccess',
    seating: 'availability',
    shade: 'shade',
    cleanliness: 'cleanliness',
    lighting: 'lighting',
    toilets: 'availability',
    equipment: 'condition',
  },
  'public-facility': {
    'entrance-open': 'availability',
    'step-free-access': 'stepFreeAccess',
    wayfinding: 'information',
    'service-information': 'information',
    'waiting-seating': 'availability',
    toilets: 'availability',
    cleanliness: 'cleanliness',
    crowding: 'crowding',
  },
  'transport-stop-terminal': {
    'boarding-area': 'accessContinuity',
    'step-free-access': 'stepFreeAccess',
    'route-information': 'information',
    'fare-information': 'information',
    shelter: 'availability',
    seating: 'availability',
    lighting: 'lighting',
    crowding: 'crowding',
    'observed-wait-minutes': 'waitMinutes',
  },
  'transport-route': {
    'service-ran': 'yesNoObserved',
    'observed-wait-minutes': 'waitMinutes',
    'route-information': 'information',
    'fare-information': 'information',
    boarding: 'accessContinuity',
    crowding: 'crowding',
    'step-free-access': 'stepFreeAccess',
  },
};

const questionCategoryLimits = {
  'street-public-realm': {
    'pedestrian-path': new Set(['street-segment', 'sidewalk-segment', 'bridge']),
    surface: new Set(['street-segment', 'sidewalk-segment', 'crossing', 'bike-lane', 'bridge']),
    'crossing-access': new Set(['street-segment', 'crossing']),
    'step-free-access': new Set(['street-segment', 'sidewalk-segment', 'crossing', 'bridge']),
    shade: new Set(['street-segment', 'sidewalk-segment', 'crossing', 'bike-lane']),
    drainage: new Set(['street-segment', 'sidewalk-segment', 'crossing', 'drainage', 'bridge']),
  },
};

const choiceValues = {
  availability: new Set([
    'present-and-usable',
    'present-but-not-usable',
    'not-present',
    'not-observed',
  ]),
  accessContinuity: new Set([
    'continuous',
    'partly-interrupted',
    'blocked-or-not-usable',
    'not-observed',
  ]),
  condition: new Set([
    'usable',
    'usable-with-visible-issues',
    'not-usable',
    'not-observed',
  ]),
  cleanliness: new Set([
    'clear',
    'minor-litter-or-dirt',
    'significant-litter-or-dirt',
    'not-observed',
  ]),
  lighting: new Set([
    'adequate-at-observed-time',
    'patchy-at-observed-time',
    'inadequate-at-observed-time',
    'not-observed-after-dark',
  ]),
  shade: new Set(['substantial', 'partial', 'little-or-none', 'not-observed']),
  crowding: new Set(['low', 'moderate', 'high', 'not-observed']),
  information: new Set([
    'present-and-clear',
    'present-but-incomplete-or-unclear',
    'not-found',
    'not-observed',
  ]),
  stepFreeAccess: new Set([
    'continuous-step-free-route',
    'partial-step-free-route',
    'no-usable-step-free-route',
    'not-observed',
  ]),
  drainage: new Set([
    'no-standing-water-observed',
    'minor-standing-water',
    'significant-standing-water-or-flooding',
    'not-observed-during-or-after-rain',
  ]),
  yesNoObserved: new Set(['yes', 'no', 'not-observed']),
};

const allowedTimeContexts = new Set([
  'early-morning',
  'morning',
  'midday',
  'afternoon',
  'evening',
  'late-night',
  'unknown',
]);

const allowedWeatherContexts = new Set([
  'dry',
  'raining',
  'recent-rain',
  'unknown',
  'not-relevant',
]);

const validQuestionSetId = (familyId, questionSetId) =>
  questionSetId ===
  ({
    'street-public-realm': 'street-public-realm-v1',
    'park-public-space': 'park-public-space-v1',
    'public-facility': 'public-facility-v1',
    'transport-stop-terminal': 'transport-stop-terminal-v1',
    'transport-route': 'transport-route-v1',
  })[familyId];

const sanitizeAnswers = (familyId, placeCategory, answers) => {
  if (!Array.isArray(answers) || answers.length === 0 || answers.length > 20) {
    return null;
  }

  const definitions = questionTypes[familyId];
  if (!definitions) return null;

  const seen = new Set();
  const cleaned = [];
  for (const raw of answers) {
    const questionId = clean(raw?.questionId, 80);
    const responseType = definitions[questionId];
    if (!responseType || seen.has(questionId)) return null;
    const categoryLimit = questionCategoryLimits[familyId]?.[questionId];
    if (categoryLimit && !categoryLimit.has(placeCategory)) return null;
    seen.add(questionId);

    let value;
    if (responseType === 'waitMinutes') {
      const number = Number(raw?.value);
      if (!Number.isInteger(number) || number < 0 || number > 240) return null;
      value = number;
    } else {
      value = clean(raw?.value, 80);
      if (!choiceValues[responseType]?.has(value)) return null;
    }

    cleaned.push({
      questionId,
      value,
      ...(clean(raw?.note, 500) ? { note: clean(raw.note, 500) } : {}),
    });
  }
  return cleaned;
};

const findObservationThread = async (placeId, token) => {
  const query = encodeURIComponent(
    'repo:' +
      repository() +
      ' is:issue in:body "observation-thread" "' +
      placeId +
      '"'
  );
  const response = await fetch(
    'https://api.github.com/search/issues?q=' + query + '&per_page=10',
    { headers: headersFor(token) }
  );
  if (!response.ok) throw new Error('Observation thread search failed');
  const data = await response.json();
  return (data.items || []).find(issue => {
    if (!String(issue.title || '').startsWith('[Place Observations]')) return false;
    return parseTaggedJson(issue.body, 'observation-thread')?.placeId === placeId;
  });
};

const createIssue = async (token, title, body) => {
  const response = await fetch(apiBase() + '/issues', {
    method: 'POST',
    headers: {
      ...headersFor(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Issue create failed');
  return data;
};

const createComment = async (token, issueNumber, body) => {
  const response = await fetch(apiBase() + '/issues/' + issueNumber + '/comments', {
    method: 'POST',
    headers: {
      ...headersFor(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || 'Comment create failed');
  return data;
};

const fetchComments = async (token, issueNumber) => {
  const response = await fetch(
    apiBase() + '/issues/' + issueNumber + '/comments?per_page=100',
    { headers: headersFor(token) }
  );
  if (!response.ok) throw new Error('Observation comments unavailable');
  return response.json();
};

const observationThreadBody = payload => [
  '<!-- observation-thread ' +
    JSON.stringify({
      version: 1,
      placeId: payload.placeId,
      placeCategory: payload.placeCategory,
      familyId: payload.familyId,
      createdVia: 'bettermakati-structured-observations',
    }) +
    ' -->',
  '',
  '**Place:** ' + payload.placeName,
  '**Place ID:** ' + payload.placeId,
  '**Observation family:** ' + payload.familyId,
  '',
  'Structured condition observations for this place. These records are separate from Civic Map problem cases and do not change canonical place facts.',
].join('\n');

const observationCommentBody = payload => [
  '<!-- place-observation ' +
    JSON.stringify({
      schemaVersion: 1,
      placeId: payload.placeId,
      familyId: payload.familyId,
      questionSetId: payload.questionSetId,
      observedAt: payload.observedAt,
      timeContext: payload.timeContext,
      weatherContext: payload.weatherContext,
      answers: payload.answers,
      overallNote: payload.overallNote || '',
      evidenceUrl: payload.evidenceUrl || '',
      publicAlias: payload.alias || '',
    }) +
    ' -->',
  '**Structured observation** · ' + (payload.alias || 'Anonymous contributor'),
  '',
  '**Observed:** ' + payload.observedAt,
  '**Time context:** ' + payload.timeContext,
  '**Weather context:** ' + payload.weatherContext,
  '',
  ...payload.answers.map(
    answer => '- ' + answer.questionId + ': ' + String(answer.value)
  ),
  payload.overallNote ? '' : null,
  payload.overallNote ? '### Context' : null,
  payload.overallNote || null,
  payload.evidenceUrl ? '' : null,
  payload.evidenceUrl ? '**Evidence:** ' + payload.evidenceUrl : null,
]
  .filter(value => value !== null && value !== '')
  .join('\n');

const fallbackUrl = payload => {
  const body = [
    observationThreadBody(payload),
    '',
    observationCommentBody(payload),
  ].join('\n');
  const params = new URLSearchParams({
    title: '[Place Observation] ' + payload.placeName,
    body,
  });
  return (
    'https://github.com/' +
    repository() +
    '/issues/new?' +
    params.toString()
  );
};

export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    req.method === 'GET' ? 's-maxage=60, stale-while-revalidate=180' : 'no-store'
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const token = process.env.BETTERMAKATI_GITHUB_TOKEN;

  if (req.method === 'GET') {
    const placeId = clean(req.query?.placeId, 120);
    if (!placeId) {
      return res.status(400).json({ error: 'placeId is required.' });
    }
    try {
      const asOf = new Date().toISOString();
      const thread = await findObservationThread(placeId, token);
      if (!thread) return res.status(200).json({ observations: [], asOf });
      const comments = await fetchComments(token, thread.number);
      const observations = comments
        .map(comment => {
          const observation = parseTaggedJson(comment.body, 'place-observation');
          if (!observation || observation.placeId !== placeId) return null;
          return {
            ...observation,
            submittedAt: comment.created_at,
            url: comment.html_url,
            id: comment.id,
          };
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.observedAt) - new Date(a.observedAt));
      return res.status(200).json({
        placeId,
        threadUrl: thread.html_url,
        asOf,
        observations,
      });
    } catch {
      return res.status(503).json({
        error: 'Place observations are temporarily unavailable.',
        observations: [],
      });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAllowed(req)) {
    return res.status(429).json({
      error: 'Too many observation submissions. Please try again later.',
    });
  }

  const website = clean(req.body?.website, 200);
  if (website) return res.status(204).end();

  const payload = {
    placeId: clean(req.body?.placeId, 120),
    placeName: clean(req.body?.placeName, 180),
    placeCategory: clean(req.body?.placeCategory, 60),
    familyId: clean(req.body?.familyId, 60),
    questionSetId: clean(req.body?.questionSetId, 80),
    observedAt: clean(req.body?.observedAt, 60),
    timeContext: clean(req.body?.timeContext, 40) || 'unknown',
    weatherContext: clean(req.body?.weatherContext, 40) || 'unknown',
    answers: req.body?.answers,
    overallNote: clean(req.body?.overallNote, 1000),
    alias: clean(req.body?.alias, 80),
    evidenceUrl: cleanUrl(req.body?.evidenceUrl),
  };

  if (!payload.placeId) {
    return res.status(400).json({ error: 'Choose a canonical place first.' });
  }
  const canonicalPlace = placeObservationById.get(payload.placeId);
  if (!canonicalPlace) {
    return res.status(400).json({ error: 'Unknown canonical place.' });
  }
  payload.placeName = canonicalPlace.name;
  payload.placeCategory = canonicalPlace.category;

  if (!familyCategories[payload.familyId]?.has(payload.placeCategory)) {
    return res.status(400).json({
      error: 'Observation family does not match this place category.',
    });
  }
  if (!validQuestionSetId(payload.familyId, payload.questionSetId)) {
    return res.status(400).json({ error: 'Invalid observation question set.' });
  }
  if (!allowedTimeContexts.has(payload.timeContext)) {
    return res.status(400).json({ error: 'Invalid time context.' });
  }
  if (!allowedWeatherContexts.has(payload.weatherContext)) {
    return res.status(400).json({ error: 'Invalid weather context.' });
  }

  const observedAt = new Date(payload.observedAt);
  if (
    Number.isNaN(observedAt.getTime()) ||
    observedAt.getTime() > Date.now() + 5 * 60_000
  ) {
    return res.status(400).json({ error: 'Enter a valid observation time.' });
  }
  payload.observedAt = observedAt.toISOString();

  const answers = sanitizeAnswers(payload.familyId, payload.placeCategory, payload.answers);
  if (!answers?.length) {
    return res.status(400).json({
      error: 'Record at least one valid observed condition.',
    });
  }
  payload.answers = answers;

  if (!token) {
    return res.status(503).json({
      error: 'Native observation storage is not configured.',
      fallbackUrl: fallbackUrl(payload),
    });
  }

  try {
    let thread = await findObservationThread(payload.placeId, token);
    if (!thread) {
      thread = await createIssue(
        token,
        '[Place Observations] ' + payload.placeName,
        observationThreadBody(payload)
      );
    }

    const comment = await createComment(
      token,
      thread.number,
      observationCommentBody(payload)
    );
    return res.status(201).json({
      ok: true,
      threadUrl: thread.html_url,
      commentUrl: comment.html_url,
      submittedAt: comment.created_at,
    });
  } catch {
    return res.status(502).json({
      error: 'The observation could not be saved.',
      fallbackUrl: fallbackUrl(payload),
    });
  }
}
