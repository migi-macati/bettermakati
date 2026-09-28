export type NewsSourceClass =
  | 'government-primary'
  | 'government-information'
  | 'news-media'
  | 'institutional-or-other'
  | 'unknown';

export type NewsFreshness = 'current' | 'recent' | 'older' | 'undated';

export type NewsItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
  sourceClass: NewsSourceClass;
  sourceClassLabel: string;
  freshness: NewsFreshness;
  ageDays: number | null;
  todayEligible: boolean;
  clusterKey: string;
  retrievedAt: string;
  reviewCandidate: boolean;
  reviewReasons: string[];
};
