const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;
const rateBuckets = globalThis.__betterMakatiFeedbackRateBuckets || new Map();
globalThis.__betterMakatiFeedbackRateBuckets = rateBuckets;

const ip = req =>
  String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .split(',')[0]
    .trim();

const isAllowed = req => {
  const key = ip(req);
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.startedAt >= WINDOW_MS) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= MAX_REQUESTS;
};

const clean = (value, max = 5000) =>
  String(value || '').replace(/\u0000/g, '').trim().slice(0, max);

const normalizeText = value =>
  clean(value, 8000)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const normalizeUrl = value => {
  const raw = clean(value, 1000);
  if (!raw) return '';
  try {
    const url = new URL(raw);
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return raw.replace(/\/$/, '');
  }
};

const metadataValue = (body, label) => {
  const prefix = '**' + label + ':**';
  return String(body || '')
    .split('\n')
    .find(line => line.startsWith(prefix))
    ?.slice(prefix.length)
    .trim() || '';
};

const submissionDetails = body => {
  const lines = String(body || '').split('\n');
  const firstContentIndex = lines.findIndex(
    (line, index) =>
      index > 0 &&
      line.trim() &&
      !line.startsWith('_Submitted through the BetterMakati website._') &&
      !line.startsWith('**Community tool:**') &&
      !line.startsWith('**Barangay / area:**') &&
      !line.startsWith('**Source / URL:**')
  );
  return firstContentIndex >= 0 ? lines.slice(firstContentIndex).join('\n').trim() : '';
};

const strongDuplicate = (issue, payload, label) => {
  if (!issue || issue.pull_request || issue.state !== 'open') return false;

  const expectedTitle = '[' + label + '] ' + payload.subject;
  if (normalizeText(issue.title) !== normalizeText(expectedTitle)) return false;

  const issueBody = String(issue.body || '');
  if (
    payload.tool &&
    normalizeText(metadataValue(issueBody, 'Community tool')) !== normalizeText(payload.tool)
  ) {
    return false;
  }
  if (
    payload.barangay &&
    normalizeText(metadataValue(issueBody, 'Barangay / area')) !== normalizeText(payload.barangay)
  ) {
    return false;
  }

  const incomingSource = normalizeUrl(payload.sourceUrl);
  if (incomingSource) {
    return normalizeUrl(metadataValue(issueBody, 'Source / URL')) === incomingSource;
  }

  return normalizeText(submissionDetails(issueBody)) === normalizeText(payload.details);
};

const githubFallback = ({ type, subject, details, sourceUrl, barangay, tool }) => {
  const label =
    type === 'proposal'
      ? 'Proposal'
      : type === 'source'
      ? 'Source'
      : type === 'correction'
        ? 'Correction'
        : type === 'volunteer'
          ? 'Volunteer'
          : type === 'contact'
            ? 'Contact'
            : 'Idea';
  const body = [
    '_Submitted through the BetterMakati website._',
    '',
    tool ? '**Community tool:** ' + tool : '',
    barangay ? '**Barangay / area:** ' + barangay : '',
    sourceUrl ? '**Source / URL:** ' + sourceUrl : '',
    '',
    details,
  ].filter(Boolean).join('\n');
  const params = new URLSearchParams({
    title: '[' + label + '] ' + (subject || 'BetterMakati submission'),
    body,
  });
  return 'https://github.com/migi-macati/bettermakati/issues/new?' + params.toString();
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAllowed(req)) {
    return res.status(429).json({ error: 'Too many submissions. Please try again shortly.' });
  }

  const payload = {
    type: clean(req.body?.type, 40),
    tool: clean(req.body?.tool, 120),
    subject: clean(req.body?.subject, 180),
    details: clean(req.body?.details, 8000),
    sourceUrl: clean(req.body?.sourceUrl, 1000),
    barangay: clean(req.body?.barangay, 120),
    website: clean(req.body?.website, 200),
  };

  if (payload.website) return res.status(204).end();
  if (!payload.subject || !payload.details) {
    return res.status(400).json({ error: 'Subject and details are required.' });
  }

  const fallbackUrl = githubFallback(payload);
  const token = process.env.BETTERMAKATI_GITHUB_TOKEN;
  const repository = process.env.BETTERMAKATI_GITHUB_REPO || 'migi-macati/bettermakati';

  if (!token) {
    return res.status(503).json({
      error: 'Native submission storage is not configured yet.',
      fallbackUrl,
    });
  }

  const label =
    payload.type === 'proposal'
      ? 'Proposal'
      : payload.type === 'source'
      ? 'Source'
      : payload.type === 'correction'
        ? 'Correction'
        : payload.type === 'volunteer'
          ? 'Volunteer'
          : payload.type === 'contact'
            ? 'Contact'
            : 'Idea';
  const body = [
    '_Submitted through the BetterMakati website._',
    '',
    payload.tool ? '**Community tool:** ' + payload.tool : '',
    payload.barangay ? '**Barangay / area:** ' + payload.barangay : '',
    payload.sourceUrl ? '**Source / URL:** ' + payload.sourceUrl : '',
    '',
    payload.details,
  ].filter(Boolean).join('\n');

  try {
    const issuesResponse = await fetch(
      'https://api.github.com/repos/' + repository + '/issues?state=open&per_page=100',
      {
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'BetterMakati-feedback/1.0',
        },
      }
    );

    if (issuesResponse.ok) {
      const issues = await issuesResponse.json();
      const duplicate = Array.isArray(issues)
        ? issues.find(issue => strongDuplicate(issue, payload, label))
        : null;

      if (duplicate) {
        return res.status(200).json({
          ok: true,
          duplicate: true,
          reference: duplicate.number,
          url: duplicate.html_url,
        });
      }
    }

    const response = await fetch('https://api.github.com/repos/' + repository + '/issues', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'BetterMakati-feedback/1.0',
      },
      body: JSON.stringify({
        title: '[' + label + '] ' + payload.subject,
        body,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(502).json({
        error: 'The submission could not be saved.',
        fallbackUrl,
      });
    }
    return res.status(201).json({
      ok: true,
      reference: data.number,
      url: data.html_url,
    });
  } catch {
    return res.status(502).json({
      error: 'The submission service is temporarily unavailable.',
      fallbackUrl,
    });
  }
}
