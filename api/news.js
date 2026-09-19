import {
  defaultNewsQuery,
  fetchGoogleNews,
  googleNewsUrl,
} from '../scripts/news-feed.mjs';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const items = await fetchGoogleNews({ query: defaultNewsQuery, limit: 30 });
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader(
      'Cache-Control',
      'public, s-maxage=900, stale-while-revalidate=3600'
    );
    response.status(200).json({
      source: 'Google News RSS',
      sourceUrl: googleNewsUrl(defaultNewsQuery),
      query: defaultNewsQuery,
      updatedAt: new Date().toISOString(),
      items,
    });
  } catch (error) {
    response.status(502).json({
      error: 'The Google News feed is temporarily unavailable.',
      detail: error instanceof Error ? error.message : 'Unknown feed error',
    });
  }
}
