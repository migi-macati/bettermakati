export type NewsItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
};

// Filled by the weekly content workflow. The live /api/news feed is the primary source.
export const newsSnapshot: NewsItem[] = [];
