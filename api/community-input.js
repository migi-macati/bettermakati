const allowedPrefixes = [
  '[Proposal]',
  '[Idea]',
  '[Correction]',
  '[Source]',
];

const kindFromTitle = title =>
  allowedPrefixes.find(prefix => title.startsWith(prefix))?.slice(1, -1) || 'Community input';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(
      'https://api.github.com/repos/migi-macati/bettermakati/issues?state=all&per_page=100',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'BetterMakati-community-input/1.0',
        },
      }
    );
    if (!response.ok) throw new Error('GitHub unavailable');
    const issues = await response.json();

    const items = issues
      .filter(issue => !issue.pull_request)
      .filter(issue => allowedPrefixes.some(prefix => issue.title.startsWith(prefix)))
      .map(issue => ({
        number: issue.number,
        title: issue.title.replace(/^\[[^\]]+\]\s*/, ''),
        state: issue.state,
        url: issue.html_url,
        updatedAt: issue.updated_at,
        comments: issue.comments,
        kind: kindFromTitle(issue.title),
      }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 30);

    return res.status(200).json({ items });
  } catch {
    return res.status(503).json({ error: 'Community input feed unavailable', items: [] });
  }
}
