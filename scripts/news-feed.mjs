import {
  assessDomainReviewCandidate,
  classifyNewsFreshness,
  classifyPublisher,
  newsClusterKey,
  newsPolicyVersion,
  newsSourceRegistry,
  normalizeNewsTitle,
  sourceClassLabel,
} from './news-policy.mjs';

const GOOGLE_NEWS_BASE = 'https://news.google.com/rss/search';

export const defaultNewsQuery = 'Makati OR "Makati City"';

export const googleNewsUrl = (query = defaultNewsQuery) => {
  const params = new URLSearchParams({
    q: query,
    hl: 'en-PH',
    gl: 'PH',
    ceid: 'PH:en',
  });
  return `${GOOGLE_NEWS_BASE}?${params.toString()}`;
};

const decodeXml = value =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16))
    )
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const stripMarkup = value =>
  decodeXml(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tagValue = (item, tag) => {
  const match = item.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i')
  );
  return match ? decodeXml(match[1].trim()) : '';
};

const sourceValue = item => {
  const match = item.match(
    /<source(?:\s+url="([^"]*)")?[^>]*>([\s\S]*?)<\/source>/i
  );
  return match
    ? {
        name: stripMarkup(match[2]),
        url: match[1] ? decodeXml(match[1]) : '',
      }
    : { name: '', url: '' };
};

export const parseGoogleNewsXml = (xml, limit = 30, now = new Date()) => {
  const items = [];
  const seenLinks = new Set();
  const seenClusters = new Set();
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  const retrievedAt = now.toISOString();

  for (const item of itemMatches) {
    const source = sourceValue(item);
    const title = normalizeNewsTitle(
      stripMarkup(tagValue(item, 'title')),
      source.name
    );
    const link = stripMarkup(tagValue(item, 'link'));
    const description = stripMarkup(tagValue(item, 'description'));
    const pubDate = stripMarkup(tagValue(item, 'pubDate'));
    const searchable = `${title} ${description}`.toLowerCase();

    if (!title || !link || !/\bmakati\b/i.test(searchable)) continue;

    const clusterKey = newsClusterKey(title);
    if (seenLinks.has(link) || (clusterKey && seenClusters.has(clusterKey))) {
      continue;
    }

    const freshness = classifyNewsFreshness(pubDate, now);
    if (!freshness.generalFeedEligible) continue;

    const sourceClass = classifyPublisher({
      source: source.name,
      sourceUrl: source.url,
    });
    const review = assessDomainReviewCandidate({
      title,
      description,
      sourceClass,
      pubDate,
      now,
    });

    seenLinks.add(link);
    if (clusterKey) seenClusters.add(clusterKey);

    items.push({
      title,
      link,
      description,
      pubDate,
      source: source.name,
      sourceUrl: source.url,
      sourceClass,
      sourceClassLabel: sourceClassLabel(sourceClass),
      freshness: freshness.freshness,
      ageDays: freshness.ageDays,
      todayEligible: freshness.todayEligible,
      clusterKey,
      retrievedAt,
      reviewCandidate: review.reviewCandidate,
      reviewReasons: review.reviewReasons,
    });
  }

  return items
    .sort((a, b) => {
      const aTime = Date.parse(a.pubDate);
      const bTime = Date.parse(b.pubDate);
      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    })
    .slice(0, limit);
};

export const fetchGoogleNews = async ({
  query = defaultNewsQuery,
  limit = 30,
  timeoutMs = 10000,
} = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(googleNewsUrl(query), {
      signal: controller.signal,
      headers: {
        accept: 'application/rss+xml, application/xml, text/xml',
        'user-agent': 'BetterMakati/1.0 (+https://bettermakati.org/)',
      },
    });

    if (!response.ok) {
      throw new Error(`Google News returned HTTP ${response.status}`);
    }

    const checkedAt = new Date();
    const items = parseGoogleNewsXml(await response.text(), limit, checkedAt);
    return {
      items,
      meta: {
        policyVersion: newsPolicyVersion,
        retrievedAt: checkedAt.toISOString(),
        sourceHealth: [
          {
            id: 'google-news-rss',
            status: 'ok',
            checkedAt: checkedAt.toISOString(),
            itemCount: items.length,
          },
        ],
        sourceRegistry: newsSourceRegistry,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
};
