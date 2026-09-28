import {
  defaultNewsQuery,
  fetchGoogleNews,
  googleNewsUrl,
} from '../scripts/news-feed.mjs';
import { newsPolicyVersion } from '../scripts/news-policy.mjs';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const result = await fetchGoogleNews({
      query: defaultNewsQuery,
      limit: 30,
    });

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader(
      'Cache-Control',
      'public, s-maxage=900, stale-while-revalidate=3600'
    );
    response.status(200).json({
      source: 'Google News RSS',
      sourceUrl: googleNewsUrl(defaultNewsQuery),
      query: defaultNewsQuery,
      updatedAt: result.meta.retrievedAt,
      meta: result.meta,
      items: result.items,
    });
  } catch (error) {
    const checkedAt = new Date().toISOString();
    response.status(502).json({
      error: 'The Google News feed is temporarily unavailable.',
      detail: error instanceof Error ? error.message : 'Unknown feed error',
      meta: {
        policyVersion: newsPolicyVersion,
        retrievedAt: checkedAt,
        sourceHealth: [
          {
            id: 'google-news-rss',
            status: 'failed',
            checkedAt,
            itemCount: 0,
          },
        ],
      },
    });
  }
}
