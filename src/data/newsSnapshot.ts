import type { NewsItem } from './newsTypes';

// Refreshed source-backed fallback. The live /api/news feed remains primary.
export const newsSnapshot: NewsItem[] = [
  {
    title: 'Makati City Hall adopts 4-day onsite workweek; extends service hours to 7 PM',
    link: 'https://www.makati.gov.ph/content/news/135398',
    description: 'Official Makati City announcement dated 19 September 2026. Check the notice for the covered offices, schedule and service-hour details.',
    pubDate: '2026-09-19T00:00:00+08:00',
    source: 'Makati Web Portal',
    sourceUrl: 'https://www.makati.gov.ph/content/news',
    sourceClass: 'government-primary',
    sourceClassLabel: 'Official government source',
    freshness: 'current',
    ageDays: 9.55,
    todayEligible: false,
    clusterKey: 'makati city hall adopts 4 day onsite workweek extends service hours 7 pm',
    retrievedAt: '2026-09-28T13:07:00+08:00',
    reviewCandidate: true,
    reviewReasons: [
      'headline-directly-names-makati',
      'civic-change-signal',
      'government-primary-source',
    ],
  },
];
