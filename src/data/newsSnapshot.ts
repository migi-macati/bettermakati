export type NewsItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
};

// Refreshed source-backed fallback. The live /api/news feed remains primary.
export const newsSnapshot: NewsItem[] = [
  {
    title: 'Makati City Hall adopts 4-day onsite workweek; extends service hours to 7 PM',
    link: 'https://www.makati.gov.ph/content/news/135398',
    description: 'Official Makati City announcement dated 19 September 2026. Check the notice for the covered offices, schedule and service-hour details.',
    pubDate: '2026-09-19T00:00:00+08:00',
    source: 'Makati Web Portal',
    sourceUrl: 'https://www.makati.gov.ph/content/news',
  },
];
