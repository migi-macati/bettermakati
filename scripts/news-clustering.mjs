const stopWords = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'of',
  'to',
  'in',
  'on',
  'at',
  'for',
  'from',
  'with',
  'by',
  'as',
  'is',
  'are',
  'was',
  'were',
  'will',
  'has',
  'have',
  'had',
  'makati',
  'city',
  'metro',
  'manila',
  'philippines',
  'philippine',
]);

const normalizeTokens = value =>
  String(value || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length >= 3 && !stopWords.has(token));

const unique = values => [...new Set(values)];

const tokenSet = title => new Set(unique(normalizeTokens(title)));

const overlapStats = (left, right) => {
  const shared = [...left].filter(token => right.has(token)).length;
  const smaller = Math.min(left.size, right.size);
  const union = new Set([...left, ...right]).size;

  return {
    shared,
    containment: smaller ? shared / smaller : 0,
    jaccard: union ? shared / union : 0,
  };
};

const withinHours = (leftDate, rightDate, hours) => {
  const left = Date.parse(leftDate);
  const right = Date.parse(rightDate);
  if (Number.isNaN(left) || Number.isNaN(right)) return false;
  return Math.abs(left - right) <= hours * 60 * 60 * 1000;
};

const clusterCompatible = (left, right) => {
  if (left.clusterKey && left.clusterKey === right.clusterKey) return true;
  if (!withinHours(left.pubDate, right.pubDate, 96)) return false;

  const leftTokens = tokenSet(left.title);
  const rightTokens = tokenSet(right.title);
  const minimum = Math.min(leftTokens.size, rightTokens.size);
  if (minimum < 3) return false;

  const stats = overlapStats(leftTokens, rightTokens);
  const requiredShared = Math.min(4, minimum);

  return (
    stats.shared >= requiredShared &&
    stats.containment >= 0.75 &&
    stats.jaccard >= 0.5
  );
};

const storyClusterId = item => {
  const tokens = unique(normalizeTokens(item.title)).slice(0, 8);
  const fallback = String(item.clusterKey || item.title || 'story')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  const parsedDate = Date.parse(item.pubDate);
  const day = Number.isNaN(parsedDate)
    ? 'undated'
    : new Date(parsedDate).toISOString().slice(0, 10);

  return (
    'story:' +
    day +
    ':' +
    (tokens.join('-') || fallback || 'unclassified')
  );
};

const relatedCoverage = item => ({
  title: item.title,
  link: item.link,
  source: item.source,
  sourceUrl: item.sourceUrl,
  pubDate: item.pubDate,
  sourceClass: item.sourceClass,
  sourceClassLabel: item.sourceClassLabel,
});

export const clusterNewsItems = items => {
  const ordered = [...items].sort((a, b) => {
    const aTime = Date.parse(a.pubDate);
    const bTime = Date.parse(b.pubDate);
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });

  const clusters = [];

  for (const item of ordered) {
    const existing = clusters.find(cluster =>
      clusterCompatible(cluster.lead, item)
    );

    if (existing) {
      existing.members.push(item);
      continue;
    }

    clusters.push({ lead: item, members: [item] });
  }

  return clusters.map(cluster => {
    const [lead, ...alternates] = cluster.members;
    return {
      ...lead,
      storyClusterId: storyClusterId(lead),
      clusterSize: cluster.members.length,
      relatedCoverage: alternates.map(relatedCoverage),
    };
  });
};
