const allowedStatuses = new Set([
  'reviewed',
  'forwarded',
  'acknowledged',
  'action-reported',
  'community-verified-resolved',
]);

const clean = (value, max = 1000) => String(value || '').trim().slice(0, max);
const repository = () => process.env.BETTERMAKATI_GITHUB_REPO || 'migi-macati/bettermakati';
const apiBase = () => 'https://api.github.com/repos/' + repository();
const headersFor = token => ({
  Accept: 'application/vnd.github+json',
  Authorization: 'Bearer ' + token,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'BetterMakati-civic-admin/1.0',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const configuredAdmin = process.env.BETTERMAKATI_CIVIC_ADMIN_TOKEN;
  const githubToken = process.env.BETTERMAKATI_GITHUB_TOKEN;
  const suppliedAdmin = req.headers['x-bettermakati-admin-token'];

  if (!configuredAdmin || !githubToken || suppliedAdmin !== configuredAdmin) {
    return res.status(403).json({ error: 'Civic moderation authorization required.' });
  }

  const issueNumber = Number(req.body?.issueNumber);
  const status = clean(req.body?.status, 60);
  const authority = clean(req.body?.authority, 160);
  const channel = clean(req.body?.channel, 160);
  const externalReference = clean(req.body?.externalReference, 160);
  const note = clean(req.body?.note, 1500);

  if (!Number.isInteger(issueNumber) || !allowedStatuses.has(status)) {
    return res.status(400).json({ error: 'Valid case number and lifecycle status are required.' });
  }

  const issueResponse = await fetch(apiBase() + '/issues/' + issueNumber, {
    headers: headersFor(githubToken),
  });
  if (!issueResponse.ok) return res.status(404).json({ error: 'Civic case not found.' });
  const issue = await issueResponse.json();
  if (!/^\[Civic /.test(String(issue.title || ''))) {
    return res.status(400).json({ error: 'Target is not a Civic Map record.' });
  }

  const meta = {
    version: 1,
    status,
    authority,
    channel,
    externalReference,
    recordedAt: new Date().toISOString(),
  };
  const label = {
    reviewed: 'BetterMakati reviewed',
    forwarded: 'Forwarded by BetterMakati',
    acknowledged: 'Authority acknowledged',
    'action-reported': 'Action reported',
    'community-verified-resolved': 'Community verified resolved',
  }[status];

  const body = [
    '<!-- civic-admin ' + JSON.stringify(meta) + ' -->',
    '**' + label + '**',
    authority ? '**Authority / responsible body:** ' + authority : '',
    channel ? '**Channel:** ' + channel : '',
    externalReference ? '**External reference:** ' + externalReference : '',
    note ? '' : '',
    note,
  ].filter(Boolean).join('\n\n');

  const commentResponse = await fetch(apiBase() + '/issues/' + issueNumber + '/comments', {
    method: 'POST',
    headers: { ...headersFor(githubToken), 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  const comment = await commentResponse.json();
  if (!commentResponse.ok) return res.status(502).json({ error: comment?.message || 'Could not record lifecycle event.' });

  if (status === 'community-verified-resolved' && issue.state === 'open') {
    await fetch(apiBase() + '/issues/' + issueNumber, {
      method: 'PATCH',
      headers: { ...headersFor(githubToken), 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: 'closed' }),
    });
  }

  return res.status(201).json({ ok: true, status, url: comment.html_url });
}
