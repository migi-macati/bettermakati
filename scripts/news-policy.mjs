export const newsPolicyVersion = '2026-09-28.w5-8b';

export const newsSourceRegistry = [
  {
    id: 'google-news-rss',
    label: 'Google News RSS',
    url: 'https://news.google.com/',
    role: 'aggregator',
    sourceClass: 'aggregator',
    cadence: 'live',
    healthRule: 'A successful fetch must return valid RSS. Empty results are allowed and are not treated as a source failure.',
  },
  {
    id: 'makati-official-news',
    label: 'Makati News',
    url: 'https://www.makati.gov.ph/content/news',
    role: 'first-party-discovery',
    sourceClass: 'government-primary',
    cadence: 'daily',
    healthRule: 'Monitor reachability and content changes separately from the Google News feed.',
  },
];

export const newsFreshnessPolicy = {
  todayMaxAgeDays: 7,
  currentMaxAgeDays: 14,
  recentMaxAgeDays: 30,
  generalFeedMaxAgeDays: 45,
};

const GOVERNMENT_INFORMATION_HOSTS = new Set([
  'pia.gov.ph',
  'www.pia.gov.ph',
  'pna.gov.ph',
  'www.pna.gov.ph',
]);

const NEWS_MEDIA_HOSTS = [
  'abs-cbn.com',
  'news.abs-cbn.com',
  'gmanetwork.com',
  'inquirer.net',
  'philstar.com',
  'rappler.com',
  'mb.com.ph',
  'manilatimes.net',
  'businessworld.in',
  'onenews.ph',
];

const reviewSignalPattern =
  /\b(ordinance|resolution|city council|council session|budget|appropriation|procurement|public bidding|bid result|contract award|public hearing|consultation|election|voter registration|filing deadline|deadline|road closure|lane closure|traffic rerout|service suspension|service hours|class suspension|work suspension|water interruption|power interruption|zoning|tax ordinance|permit rule|fare change|route change|station closure|project award|project launch|construction start|groundbreaking|evacuation|health advisory|state of calamity)\b/i;

const safeHost = value => {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return '';
  }
};

const hostMatches = (host, expected) =>
  host === expected || host.endsWith('.' + expected);

export const classifyPublisher = ({ source = '', sourceUrl = '' } = {}) => {
  const host = safeHost(sourceUrl);
  const name = String(source).toLowerCase();

  if (GOVERNMENT_INFORMATION_HOSTS.has(host)) {
    return 'government-information';
  }

  if (host && hostMatches(host, 'gov.ph')) {
    return 'government-primary';
  }

  if (
    NEWS_MEDIA_HOSTS.some(expected => hostMatches(host, expected)) ||
    /\b(news|daily|times|bulletin|inquirer|philstar|rappler|gma|abs-cbn)\b/i.test(name)
  ) {
    return 'news-media';
  }

  if (
    host &&
    !hostMatches(host, 'google.com') &&
    !hostMatches(host, 'googleusercontent.com')
  ) {
    return 'institutional-or-other';
  }

  return 'unknown';
};

export const sourceClassLabel = sourceClass => {
  switch (sourceClass) {
    case 'government-primary':
      return 'Official government source';
    case 'government-information':
      return 'Government information service';
    case 'news-media':
      return 'News media';
    case 'institutional-or-other':
      return 'Institutional or other publisher';
    case 'aggregator':
      return 'Aggregator';
    default:
      return 'Publisher not yet classified';
  }
};

export const normalizeNewsTitle = (title, source = '') => {
  const clean = String(title || '').replace(/\s+/g, ' ').trim();
  if (!source) return clean;

  const escaped = String(source)
    .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    .trim();
  return clean.replace(new RegExp('\\s+-\\s+' + escaped + '$', 'i'), '').trim();
};

export const newsClusterKey = title =>
  String(title || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(the|a|an|and|or|of|to|in|on|at|for|from|with|by)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const classifyNewsFreshness = (pubDate, now = new Date()) => {
  const published = new Date(pubDate);
  if (Number.isNaN(published.getTime())) {
    return {
      ageDays: null,
      freshness: 'undated',
      todayEligible: false,
      generalFeedEligible: true,
    };
  }

  const ageDays = Math.max(0, (now.getTime() - published.getTime()) / 86400000);
  let freshness = 'older';

  if (ageDays <= newsFreshnessPolicy.currentMaxAgeDays) freshness = 'current';
  else if (ageDays <= newsFreshnessPolicy.recentMaxAgeDays) freshness = 'recent';

  return {
    ageDays: Number(ageDays.toFixed(2)),
    freshness,
    todayEligible: ageDays <= newsFreshnessPolicy.todayMaxAgeDays,
    generalFeedEligible: ageDays <= newsFreshnessPolicy.generalFeedMaxAgeDays,
  };
};

export const assessDomainReviewCandidate = ({
  title = '',
  description = '',
  sourceClass = 'unknown',
  pubDate = '',
  now = new Date(),
} = {}) => {
  const titleMentionsMakati = /\bmakati\b/i.test(title);
  const text = title + ' ' + description;
  const hasReviewSignal = reviewSignalPattern.test(text);
  const freshness = classifyNewsFreshness(pubDate, now);
  const reasons = [];

  if (!titleMentionsMakati || !hasReviewSignal || freshness.freshness === 'older') {
    return { reviewCandidate: false, reviewReasons: reasons };
  }

  reasons.push('headline-directly-names-makati', 'civic-change-signal');

  if (sourceClass === 'government-primary') {
    reasons.push('government-primary-source');
  }

  return {
    reviewCandidate: true,
    reviewReasons: reasons,
  };
};
