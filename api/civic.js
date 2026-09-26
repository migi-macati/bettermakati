const WINDOW_MS = 60_000;
const DAY_MS = 86_400_000;
const MAX_PER_MINUTE = 8;
const MAX_PER_DAY = 40;

const minuteBuckets = globalThis.__betterMakatiCivicMinuteBuckets || new Map();
const dayBuckets = globalThis.__betterMakatiCivicDayBuckets || new Map();
globalThis.__betterMakatiCivicMinuteBuckets = minuteBuckets;
globalThis.__betterMakatiCivicDayBuckets = dayBuckets;

const prefixes = ['[Civic Report]', '[Civic Proposal]', '[Civic Update]'];

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

const clean = (value, max = 3000) =>
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
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.toString();
  } catch {
    return '';
  }
};

const parseNumber = value => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const roundCoordinate = value =>
  value === null || value === undefined
    ? null
    : Math.round(Number(value) * 10000) / 10000;

const isCivicIssue = issue =>
  issue &&
  !issue.pull_request &&
  prefixes.some(prefix => String(issue.title || '').startsWith(prefix));

const parseMeta = body => {
  const match = String(body || '').match(/<!--\s*civic-meta\s+({[\s\S]*?})\s*-->/);
  if (!match) return {};
  try {
    return JSON.parse(match[1]);
  } catch {
    return {};
  }
};

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

const officialLifecycleStatus = adminEvents => {
  const order = [
    'community-verified-resolved',
    'action-reported',
    'acknowledged',
    'forwarded',
    'reviewed',
  ];
  return order.find(status => adminEvents.some(event => event.status === status)) || null;
};

const lifecycleLabel = status =>
  ({
    'community-verified-resolved': 'Community verified resolved',
    'action-reported': 'Action reported',
    acknowledged: 'Authority acknowledged',
    forwarded: 'Forwarded by BetterMakati',
    reviewed: 'BetterMakati reviewed',
    'community-corroborated': 'Community corroborated',
    unverified: 'Unverified community submission',
  })[status] || 'Unverified community submission';

const distanceMeters = (aLat, aLng, bLat, bLng) => {
  if ([aLat, aLng, bLat, bLng].some(value => value === null || value === undefined)) {
    return null;
  }
  const toRad = degrees => (degrees * Math.PI) / 180;
  const earth = 6371000;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.asin(Math.sqrt(h));
};

const headersFor = token => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'BetterMakati-civic-map/1.0',
  };
  if (token) headers.Authorization = 'Bearer ' + token;
  return headers;
};

const repository = () =>
  process.env.BETTERMAKATI_GITHUB_REPO || 'migi-macati/bettermakati';

const apiBase = () => 'https://api.github.com/repos/' + repository();

const fetchIssues = async token => {
  const response = await fetch(apiBase() + '/issues?state=all&per_page=100', {
    headers: headersFor(token),
  });
  if (!response.ok) throw new Error('GitHub issues unavailable');
  return response.json();
};

const fetchIssue = async (number, token) => {
  const response = await fetch(apiBase() + '/issues/' + number, {
    headers: headersFor(token),
  });
  if (!response.ok) throw new Error('Issue unavailable');
  const issue = await response.json();
  if (!isCivicIssue(issue)) throw new Error('Not a Civic Map case');
  return issue;
};

const issueView = issue => ({
  number: issue.number,
  title: String(issue.title || '').replace(/^\[Civic [^\]]+\]\s*/, ''),
  kind: String(issue.title || '').startsWith('[Civic Report]')
    ? 'report'
    : String(issue.title || '').startsWith('[Civic Proposal]')
      ? 'proposal'
      : 'update',
  state: issue.state,
  url: issue.html_url,
  createdAt: issue.created_at,
  updatedAt: issue.updated_at,
  comments: issue.comments || 0,
  meta: parseMeta(issue.body),
});

const fallbackUrl = ({ kind, subject, body }) => {
  const label =
    kind === 'proposal'
      ? 'Civic Proposal'
      : kind === 'update'
        ? 'Civic Update'
        : 'Civic Report';
  const params = new URLSearchParams({
    title: '[' + label + '] ' + (subject || 'Civic Map submission'),
    body,
  });
  return (
    'https://github.com/' +
    repository() +
    '/issues/new?' +
    params.toString()
  );
};

const emergencyCategories = new Set([
  'fire',
  'crime-in-progress',
  'medical-emergency',
  'serious-collision',
  'electrical-danger',
  'structural-danger',
  'flood-danger',
]);

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

const contributionBody = payload => {
  const meta = {
    version: payload.locationMode ? 2 : 1,
    kind: payload.kind,
    placeId: payload.placeId || payload.assetId || null,
    locationMode: payload.locationMode || (payload.assetId ? 'matched-place' : 'location-only'),
    assetId: payload.assetId || '',
    assetType: payload.assetType || '',
    category: payload.category,
    location: payload.location,
    locationLabel: payload.locationLabel || payload.location || '',
    lat: payload.lat,
    lng: payload.lng,
    side: payload.side || '',
    segmentFrom: payload.segmentFrom || '',
    segmentTo: payload.segmentTo || '',
    severity: payload.severity || '',
    preferredChannel: payload.preferredChannel || '',
    createdVia: 'bettermakati-civic-map',
  };
  return [
    '_Submitted through BetterMakati Civic Map. This is a BetterMakati community record, not an official government case unless a separate referral is recorded._',
    '',
    '<!-- civic-meta ' + JSON.stringify(meta) + ' -->',
    '',
    '**Type:** ' + payload.kind,
    payload.assetTitle ? '**Place:** ' + payload.assetTitle : '',
    payload.location ? '**Location:** ' + payload.location : '',
    payload.category ? '**Category:** ' + payload.category : '',
    payload.side ? '**Side / direction:** ' + payload.side : '',
    payload.severity ? '**Severity:** ' + payload.severity : '',
    payload.alias ? '**Public name:** ' + payload.alias : '**Public name:** Anonymous contributor',
    payload.evidenceUrl ? '**Evidence:** ' + payload.evidenceUrl : '',
    '',
    '### Details',
    '',
    payload.details,
    '',
    '### Status',
    '',
    'Unverified community submission. Duplicate reports should be consolidated into this case through confirmations and updates. BetterMakati does not guarantee government action.',
  ]
    .filter(Boolean)
    .join('\n');
};

const ordinaryCommentBody = payload => {
  const meta = {
    version: 1,
    kind: 'comment',
    commentType: payload.commentType || 'reply',
    parentCommentId: payload.parentCommentId || null,
  };
  const label =
    payload.commentType === 'confirm'
      ? 'I can confirm this issue'
      : payload.commentType === 'resolved'
        ? 'Appears resolved'
        : payload.commentType === 'support'
          ? 'Support'
          : payload.commentType === 'concern'
            ? 'Concern / trade-off'
            : payload.commentType === 'update'
              ? 'Update'
              : 'Reply';
  return [
    '<!-- civic-comment ' + JSON.stringify(meta) + ' -->',
    '**' + label + '** · ' + (payload.alias || 'Anonymous contributor'),
    payload.parentCommentId ? '_Reply to comment #' + payload.parentCommentId + '_' : '',
    '',
    payload.details || '',
  ]
    .filter(Boolean)
    .join('\n');
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', req.method === 'GET' ? 's-maxage=60, stale-while-revalidate=180' : 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const token = process.env.BETTERMAKATI_GITHUB_TOKEN;

  if (req.method === 'GET') {
    try {
      const issueNumber = parseNumber(req.query?.issue);
      if (issueNumber) {
        const issue = await fetchIssue(issueNumber, token);
        const commentsResponse = await fetch(apiBase() + '/issues/' + issueNumber + '/comments?per_page=100', {
          headers: headersFor(token),
        });
        const comments = commentsResponse.ok ? await commentsResponse.json() : [];
        const adminEvents = comments
          .filter(comment =>
            ['OWNER', 'MEMBER', 'COLLABORATOR'].includes(comment.author_association)
          )
          .map(comment => ({
            comment,
            meta: parseTaggedJson(comment.body, 'civic-admin'),
          }))
          .filter(item => item.meta)
          .map(item => ({
            ...item.meta,
            createdAt: item.comment.created_at,
            url: item.comment.html_url,
          }));
        const communityComments = comments
          .map(comment => parseTaggedJson(comment.body, 'civic-comment'))
          .filter(Boolean);
        const confirmationCount = communityComments.filter(
          item => item.commentType === 'confirm'
        ).length;
        const adminStatus = officialLifecycleStatus(adminEvents);
        const evidenceStatus =
          adminStatus || (confirmationCount >= 2 ? 'community-corroborated' : 'unverified');

        return res.status(200).json({
          item: issueView(issue),
          lifecycle: {
            status: evidenceStatus,
            label: lifecycleLabel(evidenceStatus),
            officialStatus: adminStatus,
            confirmationCount,
            adminEvents,
          },
          comments: comments.map(comment => ({
            id: comment.id,
            body: comment.body,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,
            url: comment.html_url,
          })),
        });
      }

      const issues = await fetchIssues(token);
      const items = issues
        .filter(isCivicIssue)
        .map(issueView)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return res.status(200).json({ items });
    } catch {
      return res.status(503).json({ error: 'Civic Map feed unavailable', items: [] });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAllowed(req)) {
    return res.status(429).json({ error: 'Too many submissions. Please try again later.' });
  }

  const action = clean(req.body?.action, 30) || 'create';
  const website = clean(req.body?.website, 200);
  if (website) return res.status(204).end();

  if (action === 'comment') {
    const issueNumber = parseNumber(req.body?.issueNumber);
    const details = clean(req.body?.details, 2500);
    const payload = {
      commentType: clean(req.body?.commentType, 30),
      alias: clean(req.body?.alias, 80),
      parentCommentId: parseNumber(req.body?.parentCommentId),
      details,
    };
    if (!issueNumber || (!details && !['confirm', 'resolved', 'support'].includes(payload.commentType))) {
      return res.status(400).json({ error: 'A civic case and comment are required.' });
    }
    try {
      const issue = await fetchIssue(issueNumber, token);
      if (!token) return res.status(503).json({ error: 'Native civic comments are not configured.', fallbackUrl: issue.html_url });
      const comment = await createComment(token, issueNumber, ordinaryCommentBody(payload));
      return res.status(201).json({ ok: true, url: comment.html_url, id: comment.id });
    } catch {
      return res.status(502).json({ error: 'The civic comment could not be saved.' });
    }
  }

  const kind = clean(req.body?.kind, 20);
  const payload = {
    kind,
    placeId: clean(req.body?.placeId, 120),
    locationMode: clean(req.body?.locationMode, 30),
    assetId: clean(req.body?.assetId, 120),
    assetTitle: clean(req.body?.assetTitle, 180),
    assetType: clean(req.body?.assetType, 60),
    category: clean(req.body?.category, 80),
    subject: clean(req.body?.subject, 180),
    details: clean(req.body?.details, 3000),
    location: clean(req.body?.location, 240),
    locationLabel: clean(req.body?.locationLabel, 240),
    lat: roundCoordinate(parseNumber(req.body?.lat)),
    lng: roundCoordinate(parseNumber(req.body?.lng)),
    side: clean(req.body?.side, 40),
    segmentFrom: clean(req.body?.segmentFrom, 120),
    segmentTo: clean(req.body?.segmentTo, 120),
    severity: clean(req.body?.severity, 30),
    preferredChannel: clean(req.body?.preferredChannel, 40),
    alias: clean(req.body?.alias, 80),
    evidenceUrl: cleanUrl(req.body?.evidenceUrl),
    forceNew: Boolean(req.body?.forceNew),
  };

  if (!['report', 'proposal', 'update'].includes(kind)) {
    return res.status(400).json({ error: 'Invalid Civic Map contribution type.' });
  }
  const locationOnly = payload.locationMode === 'location-only';
  if (locationOnly && kind !== 'report') {
    return res.status(400).json({
      error: 'Location-only submissions are supported for problem reports only.',
    });
  }
  if (locationOnly) {
    if (!payload.locationLabel || payload.lat === null || payload.lng === null) {
      return res.status(400).json({
        error: 'Describe the location and provide a map point before submitting.',
      });
    }
    payload.placeId = '';
    payload.assetId = '';
    payload.assetTitle = '';
    payload.assetType = '';
  } else if (!payload.assetId || !payload.assetTitle) {
    return res.status(400).json({ error: 'Choose a mapped place or segment first.' });
  } else {
    payload.placeId = payload.assetId;
  }

  if (kind === 'report' && emergencyCategories.has(payload.category)) {
    return res.status(400).json({
      error: 'This may be an emergency. BetterMakati is not an emergency service.',
      emergency: true,
      call: 'tel:911',
    });
  }

  if (!payload.category || !payload.details) {
    return res.status(400).json({ error: 'Choose a category and describe what you observed or propose.' });
  }

  let issues = [];
  try {
    issues = await fetchIssues(token);
  } catch {
    issues = [];
  }

  if (!payload.forceNew && ['report', 'proposal'].includes(kind)) {
    const duplicates = issues
      .filter(isCivicIssue)
      .filter(issue => issue.state === 'open')
      .map(issue => ({ issue, meta: parseMeta(issue.body) }))
      .filter(({ meta }) => meta.kind === kind && meta.category === payload.category)
      .filter(({ meta }) =>
        locationOnly ? true : meta.assetId === payload.assetId
      )
      .filter(({ meta }) => {
        const distance = distanceMeters(payload.lat, payload.lng, Number(meta.lat), Number(meta.lng));
        return distance !== null && distance <= 75;
      })
      .slice(0, 5)
      .map(({ issue, meta }) => ({
        ...issueView(issue),
        distanceMeters: distanceMeters(
          payload.lat,
          payload.lng,
          Number(meta.lat),
          Number(meta.lng)
        ),
      }));

    if (duplicates.length) {
      return res.status(409).json({
        error: 'A similar open Civic Map case already exists nearby.',
        duplicates,
      });
    }
  }

  const body = contributionBody(payload);
  const titlePrefix =
    kind === 'proposal'
      ? '[Civic Proposal] '
      : kind === 'update'
        ? '[Civic Update] '
        : '[Civic Report] ';
  const subject = payload.subject || payload.category.replaceAll('-', ' ');

  if (!token) {
    return res.status(503).json({
      error: 'Native Civic Map storage is not configured yet.',
      fallbackUrl: fallbackUrl({ kind, subject, body }),
    });
  }

  try {
    const issue = await createIssue(token, titlePrefix + subject, body);
    return res.status(201).json({
      ok: true,
      reference: issue.number,
      url: issue.html_url,
      status: 'unverified',
      forwarded: false,
    });
  } catch {
    return res.status(502).json({
      error: 'The Civic Map submission could not be saved.',
      fallbackUrl: fallbackUrl({ kind, subject, body }),
    });
  }
}
