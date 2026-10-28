import type { SearchItem } from './searchIndex';
import { queryVariants } from './searchQueryVariants';
const normalize = (value: string) => value.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const hasPhrase = (text: string, phrase: string) => (' ' + text + ' ').includes(' ' + phrase + ' ');
const searchStopWords = new Set('a an the i my me we our is are do does can could would want need get find how where what when to for of in at please help with about ako ko po ba ang ng sa mga na saan paano pwede puwede gusto kailangan makati'.split(' '));
const editDistance = (a: string, b: string) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    for (let j = 0; j <= b.length; j += 1) previous[j] = current[j];
  }

  return previous[b.length];
};

const fuzzyMatch = (word: string, tokens: string[]) => {
  if (word.length < 5) return false;
  const tolerance = word.length >= 8 ? 2 : 1;
  return tokens.some(
    token =>
      Math.abs(token.length - word.length) <= tolerance &&
      editDistance(word, token) <= tolerance
  );
};

const preparedItems = new WeakMap<SearchItem, ReturnType<typeof prepareItem>>();
const prepareItem = (item: SearchItem) => {
  const title = normalize(item.title);
  const description = normalize(item.description);
  const keywords = normalize(item.keywords);
  const category = normalize(item.category);
  const group = normalize(item.group);
  const aliases = (item.aliases ?? []).map(normalize).filter(Boolean);
  const titleTokens = title.split(' ').filter(Boolean);
  const aliasTokens = aliases.flatMap(alias => alias.split(' ').filter(Boolean));
  const keywordTokens = keywords.split(' ').filter(Boolean);
  const descriptionTokens = description.split(' ').filter(Boolean);
  const allTokens = [
    ...titleTokens,
    ...aliasTokens,
    ...keywordTokens,
    ...descriptionTokens,
  ];

  return {title, description, keywords, category, group, aliases, titleTokens, keywordTokens, descriptionTokens, allTokens};
};

const scoreVariant = (
  item: SearchItem,
  variant: string,
  {
    primary,
    allowFuzzy,
  }: {
    primary: boolean;
    allowFuzzy: boolean;
  }
) => {
  let prepared = preparedItems.get(item);
  if (!prepared) {
    prepared = prepareItem(item);
    preparedItems.set(item, prepared);
  }
  const {title, description, keywords, category, group, aliases, titleTokens, keywordTokens, descriptionTokens, allTokens} = prepared;
  const words = variant.split(' ').filter(Boolean);

  const weight = primary ? 1 : 0.72;
  let score = 0;

  // Canonical title remains strongest. Exact aliases come next, then phrase matches.
  if (title === variant) score = Math.max(score, 100 * weight);
  if (aliases.some(alias => alias === variant)) {
    score = Math.max(score, 88 * weight);
  }
  if (title.startsWith(variant + ' ')) score = Math.max(score, 72 * weight);
  if (aliases.some(alias => alias.startsWith(variant + ' '))) {
    score = Math.max(score, 62 * weight);
  }
  if (hasPhrase(title, variant)) score = Math.max(score, 54 * weight);
  if (aliases.some(alias => hasPhrase(alias, variant))) {
    score = Math.max(score, 48 * weight);
  }
  if (category === variant || group === variant) {
    score = Math.max(score, 38 * weight);
  }
  if (hasPhrase(keywords, variant)) score = Math.max(score, 30 * weight);
  if (hasPhrase(description, variant)) score = Math.max(score, 16 * weight);

  let wordScore = 0;
  let matchedWords = 0;
  for (const word of words) {
    let matched = false;
    if (titleTokens.some(token => token === word)) {
      wordScore += 11;
      matched = true;
    }

    if (aliases.some(alias => hasPhrase(alias, word))) {
      wordScore += 7;
      matched = true;
    }
    if (keywordTokens.includes(word)) {
      wordScore += 4;
      matched = true;
    }
    if (descriptionTokens.includes(word)) {
      wordScore += 1;
      matched = true;
    }

    if (
      allowFuzzy &&
      !matched &&
      fuzzyMatch(word, allTokens)
    ) {
      wordScore += 4;
      matched = true;
    }

    if (matched) matchedWords += 1;
  }

  if (words.length > 1 && matchedWords === words.length) {
    wordScore += hasPhrase(title, variant) || aliases.some(alias => hasPhrase(alias, variant))
      ? 14
      : 8;
  }

  // Every meaningful term must match; a city name or filler alone is not a result.
  if (matchedWords < words.length) return 0;
  const taskBoost = item.group === 'Service' && !/\b(history|award|recognition)\b/.test(variant) ? 35 : 0;
  const plannedPenalty = /\bplanned\b/i.test(item.description) ? 25 : 0;
  return Math.max(0, Math.max(score, wordScore * weight) + taskBoost - plannedPenalty);
};

export const scoreItem = (item: SearchItem, query: string) => {
  const variants = queryVariants(query).map(value => {
    const words = value.split(' ').filter(word => !searchStopWords.has(word));
    return words.length ? words.join(' ') : value;
  });
  if (variants.length === 0) return item.featured ? 5 : 1;

  const scores = variants.map((variant, index) =>
    scoreVariant(item, variant, {
      primary: index === 0,
      allowFuzzy: index === 0,
    })
  );

  return Math.max(...scores);
};

