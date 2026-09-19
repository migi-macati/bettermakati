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

export const parseGoogleNewsXml = (xml, limit = 30) => {
  const items = [];
  const seen = new Set();
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

  for (const item of itemMatches) {
    const title = stripMarkup(tagValue(item, 'title'));
    const link = stripMarkup(tagValue(item, 'link'));
    const description = stripMarkup(tagValue(item, 'description'));
    const pubDate = stripMarkup(tagValue(item, 'pubDate'));
    const source = sourceValue(item);
    const searchable = `${title} ${description}`.toLowerCase();

    if (!title || !link || !/\bmakati\b/i.test(searchable)) continue;

    const key = link || title;
    if (seen.has(key)) continue;
    seen.add(key);

    items.push({
      title,
      link,
      description,
      pubDate,
      source: source.name,
      sourceUrl: source.url,
    });
  }

  return items
    .sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate))
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
        'user-agent': 'BetterMakati/1.0 (+https://bettermakati.vercel.app/)',
      },
    });

    if (!response.ok) {
      throw new Error(`Google News returned HTTP ${response.status}`);
    }

    return parseGoogleNewsXml(await response.text(), limit);
  } finally {
    clearTimeout(timeout);
  }
};
