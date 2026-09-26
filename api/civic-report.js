const prefixes = ['[Civic Report]', '[Civic Proposal]', '[Civic Update]'];

const parseJsonComment = (body, marker) => {
  const match = String(body || '').match(new RegExp('<!--\\s*' + marker + '\\s+({[\\s\\S]*?})\\s*-->'));
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
};
const parseMeta = body => parseJsonComment(body, 'civic-meta') || {};
const isCivicIssue = issue =>
  issue && !issue.pull_request && prefixes.some(prefix => String(issue.title || '').startsWith(prefix));

const headersFor = token => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'BetterMakati-civic-report/1.0',
  };
  if (token) headers.Authorization = 'Bearer ' + token;
  return headers;
};
const repository = () => process.env.BETTERMAKATI_GITHUB_REPO || 'migi-macati/bettermakati';
const apiBase = () => 'https://api.github.com/repos/' + repository();

const kindOf = issue =>
  String(issue.title || '').startsWith('[Civic Report]') ? 'report' :
  String(issue.title || '').startsWith('[Civic Proposal]') ? 'proposal' :
  'update';

const publicTitle = issue => String(issue.title || '').replace(/^\[Civic [^\]]+\]\s*/, '');

const officialStatus = adminEvents => {
  const order = [
    'community-verified-resolved',
    'action-reported',
    'acknowledged',
    'forwarded',
    'reviewed',
  ];
  for (const status of order) if (adminEvents.some(event => event.status === status)) return status;
  return null;
};

const statusLabel = status => ({
  'community-verified-resolved': 'Community verified resolved',
  'action-reported': 'Action reported',
  acknowledged: 'Authority acknowledged',
  forwarded: 'Forwarded by BetterMakati',
  reviewed: 'BetterMakati reviewed',
}[status] || 'Unverified community submission');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
  const token = process.env.BETTERMAKATI_GITHUB_TOKEN;

  try {
    const issuesResponse = await fetch(apiBase() + '/issues?state=all&per_page=100', {
      headers: headersFor(token),
    });
    if (!issuesResponse.ok) throw new Error('issues');
    const issues = (await issuesResponse.json()).filter(isCivicIssue);

    const now = Date.now();
    const weekAgo = now - 7 * 86400000;
    const monthAgo = now - 30 * 86400000;
    const records = [];

    for (const issue of issues) {
      const commentsResponse = await fetch(apiBase() + '/issues/' + issue.number + '/comments?per_page=100', {
        headers: headersFor(token),
      });
      const comments = commentsResponse.ok ? await commentsResponse.json() : [];
      const community = comments
        .map(comment => ({ comment, meta: parseJsonComment(comment.body, 'civic-comment') }))
        .filter(item => item.meta);
      const adminEvents = comments
        .filter(comment =>
          ['OWNER', 'MEMBER', 'COLLABORATOR'].includes(comment.author_association)
        )
        .map(comment => parseJsonComment(comment.body, 'civic-admin'))
        .filter(Boolean);

      const counts = {
        confirm: community.filter(item => item.meta.commentType === 'confirm').length,
        resolved: community.filter(item => item.meta.commentType === 'resolved').length,
        support: community.filter(item => item.meta.commentType === 'support').length,
        concern: community.filter(item => item.meta.commentType === 'concern').length,
        updates: community.filter(item => item.meta.commentType === 'update').length,
        replies: community.filter(item => item.meta.commentType === 'reply').length,
      };

      const adminStatus = officialStatus(adminEvents);
      const corroborated = counts.confirm >= 2;
      const meta = parseMeta(issue.body);
      const evidenceStatus = adminStatus || (corroborated ? 'community-corroborated' : 'unverified');
      const evidenceLabel = adminStatus
        ? statusLabel(adminStatus)
        : corroborated
          ? 'Community corroborated'
          : 'Unverified community submission';

      const blocksReferral = adminEvents.some(event =>
        ['forwarded', 'acknowledged', 'action-reported', 'community-verified-resolved'].includes(
          event.status
        )
      );
      const referralEligible =
        kindOf(issue) === 'report' &&
        issue.state === 'open' &&
        !blocksReferral &&
        (meta.severity === 'high' || corroborated);

      const entityId = meta.entityId || meta.placeId || meta.assetId || null;
      const entityKind = meta.entityKind || (meta.placeId ? 'place' : null);
      const locationMode =
        meta.locationMode ||
        (entityId ? (meta.placeId ? 'matched-place' : 'matched-entity') : 'location-only');

      records.push({
        number: issue.number,
        title: publicTitle(issue),
        kind: kindOf(issue),
        state: issue.state,
        url: issue.html_url,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        meta: {
          ...meta,
          entityId,
          entityKind,
          locationMode,
          locationLabel: meta.locationLabel || meta.location || '',
        },
        entityId,
        entityKind,
        locationMode,
        counts,
        evidenceStatus,
        evidenceLabel,
        referralEligible,
        adminEvents,
      });
    }

    const reports = records.filter(item => item.kind === 'report');
    const proposals = records.filter(item => item.kind === 'proposal');
    const weekly = {
      periodDays: 7,
      newCases: reports.filter(item => new Date(item.createdAt).getTime() >= weekAgo).length,
      newProposals: proposals.filter(item => new Date(item.createdAt).getTime() >= weekAgo).length,
      openCases: reports.filter(item => item.state === 'open').length,
      corroboratedOpen: reports.filter(item => item.state === 'open' && item.evidenceStatus === 'community-corroborated').length,
      readyForReviewOrReferral: records.filter(item => item.referralEligible).length,
      communityResolutionSignals: reports.filter(item => item.counts.resolved > 0).length,
    };
    const monthly = {
      periodDays: 30,
      casesCreated: reports.filter(item => new Date(item.createdAt).getTime() >= monthAgo).length,
      proposalsCreated: proposals.filter(item => new Date(item.createdAt).getTime() >= monthAgo).length,
      matureProposals: proposals
        .filter(item => item.state === 'open' && item.counts.support >= 3)
        .sort((a,b) => b.counts.support - a.counts.support)
        .slice(0,10),
    };

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      weekly,
      monthly,
      referralQueue: records.filter(item => item.referralEligible),
      records: records.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    });
  } catch {
    return res.status(503).json({ error: 'Civic Map report data is unavailable.' });
  }
}
