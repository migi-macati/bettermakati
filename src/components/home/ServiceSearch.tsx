import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  Search,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { searchIndex, type SearchItem } from '../../data/searchIndex';
import { serviceDirectory } from '../../data/serviceDirectory';
import { officesForAgency } from '../../data/governmentServiceOffices';
import { placeRegistryById } from '../../data/placeRegistry';
import {
  legislationRecordDisplay,
  legislationRecordHref,
  legislationRecordId,
  loadLegislationBrowserIndex,
  matchLegislationRecords,
  type BrowserLegislationIndex,
} from '../../data/legislationBrowserIndex';

type SearchScope = 'site' | 'services';

type SearchDomainId =
  | 'all'
  | 'services'
  | 'barangays'
  | 'officials'
  | 'statistics'
  | 'reports'
  | 'legislation'
  | 'public-records'
  | 'places'
  | 'heritage'
  | 'mobility'
  | 'calendar'
  | 'news';

const searchDomainOptions: Array<{ id: SearchDomainId; label: string }> = [
  { id: 'all', label: 'All types' },
  { id: 'services', label: 'Services' },
  { id: 'barangays', label: 'Barangays' },
  { id: 'officials', label: 'Officials' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'reports', label: 'Reports & insights' },
  { id: 'legislation', label: 'Legislation' },
  { id: 'public-records', label: 'Public records' },
  { id: 'places', label: 'Places & map' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'mobility', label: 'Mobility' },
  { id: 'calendar', label: 'Civic calendar' },
  { id: 'news', label: 'News' },
];

const siteTabs = [
  'All',
  'Services',
  'Visit',
  'Government',
  'Organizations',
  'Barangays',
  'Places',
  'Records',
  'Tools',
] as const;
const serviceTabs = [
  'All',
  'Business',
  'Health',
  'Education',
  'Social',
  'Property',
] as const;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const searchTermSynonyms: Record<string, string[]> = {
  brgy: ['barangay'],
  bgy: ['barangay'],
  govt: ['government'],
  gov: ['government'],
  stats: ['statistics'],
  doc: ['document', 'record'],
  docs: ['documents', 'records'],
  bid: ['bidding', 'procurement'],
  bids: ['bidding', 'procurement'],
  commute: ['mobility', 'transport'],
  transportation: ['mobility', 'transport'],
  law: ['legislation'],
  laws: ['legislation'],
  ordinance: ['legislation'],
  ordinances: ['legislation'],
  resolution: ['legislation'],
  resolutions: ['legislation'],
  hotline: ['hotlines'],
  hotlines: ['emergency'],
};

const queryVariants = (query: string) => {
  const needle = normalize(query);
  if (!needle) return [];

  const variants = new Set([needle]);
  const tokens = needle.split(' ').filter(Boolean);

  tokens.forEach((token, index) => {
    for (const synonym of searchTermSynonyms[token] ?? []) {
      const next = [...tokens];
      next[index] = synonym;
      variants.add(next.join(' '));
    }
  });

  return [...variants];
};

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
  if (word.length < 4) return false;
  const tolerance = word.length >= 8 ? 2 : 1;
  return tokens.some(
    token =>
      Math.abs(token.length - word.length) <= tolerance &&
      editDistance(word, token) <= tolerance
  );
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
  const title = normalize(item.title);
  const description = normalize(item.description);
  const keywords = normalize(item.keywords);
  const category = normalize(item.category);
  const group = normalize(item.group);
  const aliases = (item.aliases ?? []).map(normalize).filter(Boolean);
  const words = variant.split(' ').filter(Boolean);
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

  const weight = primary ? 1 : 0.72;
  let score = 0;

  // Canonical title remains strongest. Exact aliases come next, then phrase matches.
  if (title === variant) score = Math.max(score, 100 * weight);
  if (aliases.some(alias => alias === variant)) {
    score = Math.max(score, 88 * weight);
  }
  if (title.startsWith(variant)) score = Math.max(score, 72 * weight);
  if (aliases.some(alias => alias.startsWith(variant))) {
    score = Math.max(score, 62 * weight);
  }
  if (title.includes(variant)) score = Math.max(score, 54 * weight);
  if (aliases.some(alias => alias.includes(variant))) {
    score = Math.max(score, 48 * weight);
  }
  if (category === variant || group === variant) {
    score = Math.max(score, 38 * weight);
  }
  if (keywords.includes(variant)) score = Math.max(score, 30 * weight);
  if (description.includes(variant)) score = Math.max(score, 16 * weight);

  let wordScore = 0;
  let matchedWords = 0;
  for (const word of words) {
    let matched = false;
    if (titleTokens.some(token => token === word)) {
      wordScore += 11;
      matched = true;
    } else if (titleTokens.some(token => token.startsWith(word))) {
      wordScore += 9;
      matched = true;
    } else if (title.includes(word)) {
      wordScore += 7;
      matched = true;
    }

    if (aliases.some(alias => alias.includes(word))) {
      wordScore += 7;
      matched = true;
    }
    if (keywords.includes(word)) {
      wordScore += 4;
      matched = true;
    }
    if (description.includes(word)) {
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
    wordScore += title.includes(variant) || aliases.some(alias => alias.includes(variant))
      ? 14
      : 8;
  }

  return Math.max(score, wordScore * weight);
};

const scoreItem = (item: SearchItem, query: string) => {
  const variants = queryVariants(query);
  if (variants.length === 0) return item.featured ? 5 : 1;

  const scores = variants.map((variant, index) =>
    scoreVariant(item, variant, {
      primary: index === 0,
      allowFuzzy: index === 0,
    })
  );

  return Math.max(...scores);
};

const searchDomainForItem = (item: SearchItem): Exclude<SearchDomainId, 'all'> | null => {
  if (item.group === 'Service') return 'services';
  if (item.group === 'Barangay') return 'barangays';

  if (
    item.category === 'Elected officials' ||
    item.href.startsWith('/officials/')
  ) {
    return 'officials';
  }

  if (
    item.canonicalKey?.startsWith('indicator:') ||
    item.href === '/statistics' ||
    item.href.startsWith('/statistics#')
  ) {
    return 'statistics';
  }

  if (
    item.canonicalKey?.startsWith('report:') ||
    item.href === '/reports' ||
    item.href.startsWith('/reports/')
  ) {
    return 'reports';
  }

  if (
    item.category === 'Legislation' ||
    item.canonicalKey?.startsWith('legislation-record:') ||
    item.href === '/legislation' ||
    item.href.startsWith('/legislation#')
  ) {
    return 'legislation';
  }

  if (
    item.canonicalKey?.startsWith('public-record:') ||
    item.href === '/records' ||
    item.href.startsWith('/records/')
  ) {
    return 'public-records';
  }

  if (
    item.canonicalKey?.startsWith('mobility-') ||
    item.href === '/mobility' ||
    item.href.startsWith('/mobility#')
  ) {
    return 'mobility';
  }

  if (
    item.href === '/heritage' ||
    item.href.startsWith('/heritage#') ||
    item.canonicalKey?.startsWith('heritage-collection:')
  ) {
    return 'heritage';
  }

  if (
    item.href === '/calendar' ||
    item.href.startsWith('/calendar#') ||
    item.canonicalKey?.startsWith('civic-timeline:')
  ) {
    return 'calendar';
  }

  if (item.href === '/news' || item.href.startsWith('/news#')) {
    return 'news';
  }

  if (
    item.group === 'Place' ||
    item.group === 'Segment' ||
    item.group === 'Route' ||
    item.href === '/civic-map' ||
    item.href.startsWith('/civic-map/')
  ) {
    return 'places';
  }

  return null;
};

const matchesTab = (item: SearchItem, tab: string, scope: SearchScope) => {
  if (tab === 'All') return true;

  if (scope === 'services') {
    return item.group === 'Service' && item.category === tab;
  }

  if (tab === 'Services') return item.group === 'Service';
  if (tab === 'Visit') return item.group === 'Visit';
  if (tab === 'Government')
    return (
      item.group === 'Government' ||
      (item.group === 'Contact' && item.category === 'Government')
    );
  if (tab === 'Organizations') return item.group === 'Organization';
  if (tab === 'Barangays') return item.group === 'Barangay';
  if (tab === 'Places')
    return (
      item.group === 'Place' ||
      item.group === 'Segment' ||
      item.group === 'Route' ||
      item.group === 'Area'
    );
  if (tab === 'Records') return item.group === 'Record';
  if (tab === 'Tools')
    return (
      item.group === 'Tool' ||
      (item.group === 'Contact' && item.category === 'Tools')
    );

  return true;
};

export default function ServiceSearch({
  scope = 'site',
  title,
  placeholder,
  initialQuery = '',
  showServicePlaces = false,
  goldAction = false,
  barangaySlug = '',
}: {
  scope?: SearchScope;
  title?: string;
  placeholder?: string;
  initialQuery?: string;
  showServicePlaces?: boolean;
  goldAction?: boolean;
  barangaySlug?: string;
}) {
  const tabs = scope === 'services' ? serviceTabs : siteTabs;
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<string>('All');
  const [domainFilter, setDomainFilter] = useState<SearchDomainId>('all');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [legislationIndex, setLegislationIndex] =
    useState<BrowserLegislationIndex | null>(null);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldSearchLegislation =
    scope === 'site' &&
    query.trim().length >= 3 &&
    (tab === 'All' || tab === 'Records');

  useEffect(() => {
    if (!shouldSearchLegislation || legislationIndex) return;

    let cancelled = false;
    loadLegislationBrowserIndex()
      .then(index => {
        if (!cancelled) setLegislationIndex(index);
      })
      .catch(() => {
        // Static site search remains available if the archive index cannot load.
      });

    return () => {
      cancelled = true;
    };
  }, [legislationIndex, shouldSearchLegislation]);

  const legislationItems = useMemo<SearchItem[]>(() => {
    if (!shouldSearchLegislation || !legislationIndex) return [];

    return matchLegislationRecords(legislationIndex, query, { limit: 12 }).visible.map(
      record => ({
        title: legislationRecordDisplay(record),
        group: 'Record' as const,
        category: 'Legislation',
        description: record[4],
        href: legislationRecordHref(record),
        canonicalKey: 'legislation-record:' + legislationRecordId(record),
        keywords: [
          'legislation',
          record[1],
          record[2],
          record[3] ?? '',
          record[4],
        ].join(' '),
      })
    );
  }, [legislationIndex, query, shouldSearchLegislation]);

  const allRankedResults = useMemo(() => {
    const base =
      scope === 'services'
        ? searchIndex.filter(item => item.group === 'Service')
        : [...searchIndex, ...legislationItems];

    const seen = new Set<string>();
    const canonical = base.filter(item => {
      const key =
        item.canonicalKey ??
        [item.group, item.href, normalize(item.title)].join(':');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return canonical
      .map(item => ({ ...item, score: scoreItem(item, query) }))
      .filter(item => !query.trim() || item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  }, [legislationItems, query, scope]);

  const rankedResults = useMemo(
    () => allRankedResults.filter(item => matchesTab(item, tab, scope)),
    [allRankedResults, scope, tab]
  );

  const domainCounts = useMemo(() => {
    const counts = new Map<SearchDomainId, number>();
    counts.set('all', rankedResults.length);

    for (const item of rankedResults) {
      const domain = searchDomainForItem(item);
      if (!domain) continue;
      counts.set(domain, (counts.get(domain) ?? 0) + 1);
    }

    return counts;
  }, [rankedResults]);

  const results = useMemo(
    () =>
      domainFilter === 'all'
        ? rankedResults
        : rankedResults.filter(item => searchDomainForItem(item) === domainFilter),
    [domainFilter, rankedResults]
  );

  const servicePlaceById = useMemo(() => {
    if (!showServicePlaces) return new Map<string, { name: string; address: string; placeId: string }>();

    const resolved = new Map<string, { name: string; address: string; placeId: string }>();
    for (const service of serviceDirectory) {
      const office = officesForAgency(service.agency).find(item => item.placeId);
      if (!office?.placeId) continue;

      const place = placeRegistryById.get(office.placeId);
      if (!place) continue;

      resolved.set(service.id, {
        name: office.name,
        address: office.address,
        placeId: place.id,
      });
    }
    return resolved;
  }, [showServicePlaces]);

  const visibleResults = useMemo(() => {
    if (!query.trim()) {
      const featured = results.filter(item => item.featured);
      return (featured.length ? featured : results).slice(
        0,
        scope === 'site' ? 8 : 12
      );
    }
    return results.slice(0, 12);
  }, [query, results, scope]);

  const hasBroaderMatches = visibleResults.length === 0 && allRankedResults.length > 0;
  const activeFilterLabel =
    domainFilter !== 'all'
      ? searchDomainOptions.find(option => option.id === domainFilter)?.label ?? 'this type'
      : tab !== 'All'
        ? tab
        : scope === 'services'
          ? 'this service category'
          : 'this view';

  const showAllMatches = () => {
    setTab('All');
    setDomainFilter('all');
    setActiveIndex(0);
    setOpen(true);
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  const scopedInternalHref = (href: string) => {
    if (!barangaySlug || href.startsWith('http://') || href.startsWith('https://')) {
      return href;
    }

    const [pathAndQuery, hash] = href.split('#', 2);
    const separator = pathAndQuery.includes('?') ? '&' : '?';
    const scoped = pathAndQuery + separator + 'barangay=' + encodeURIComponent(barangaySlug);
    return hash ? scoped + '#' + hash : scoped;
  };

  const selectResult = (href: string) => {
    setOpen(false);
    if (href.startsWith('http://') || href.startsWith('https://')) {
      window.location.assign(href);
      return;
    }
    navigate(scopedInternalHref(href));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (visibleResults.length > 0) {
      selectResult(
        visibleResults[Math.min(activeIndex, visibleResults.length - 1)].href
      );
      return;
    }
    navigate(
      scopedInternalHref(
        scope === 'services' ? '/services' : '/community-tools/saan-ako-lalapit'
      )
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(index =>
        visibleResults.length ? (index + 1) % visibleResults.length : 0
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(index =>
        visibleResults.length
          ? (index - 1 + visibleResults.length) % visibleResults.length
          : 0
      );
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === 'Enter' && open && visibleResults.length > 0) {
      event.preventDefault();
      selectResult(
        visibleResults[Math.min(activeIndex, visibleResults.length - 1)].href
      );
    }
  };

  const heading =
    title ||
    (scope === 'services'
      ? 'Find a Government Service'
      : 'Find a service or information');
  const inputPlaceholder =
    placeholder ||
    (scope === 'services'
      ? 'Search services'
      : 'e.g., Yellow Card, Poblacion, restaurants, budget');

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl border border-primary-100 bg-white/95 p-5 md:p-6 shadow-[0_18px_50px_rgba(18,78,46,0.12)]"
    >
      <div className="flex items-center gap-2 text-gray-950 font-bold mb-4 text-lg">
        <Search className="h-5 w-5 text-secondary-700" />
        {heading}
      </div>

      <form onSubmit={submit}>
        <label
          htmlFor={scope === 'services' ? 'service-search' : 'site-search'}
          className="sr-only"
        >
          {heading}
        </label>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              id={scope === 'services' ? 'service-search' : 'site-search'}
              type="search"
              value={query}
              onFocus={() => setOpen(true)}
              onChange={event => {
                setQuery(event.target.value);
                setActiveIndex(0);
                setOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={inputPlaceholder}
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={`search-results-${scope}`}
              aria-activedescendant={
                open && visibleResults[activeIndex]
                  ? `search-result-${scope}-${activeIndex}`
                  : undefined
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-11 text-base outline-none text-gray-900 shadow-inner focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveIndex(0);
                  setOpen(true);
                }}
                className="absolute right-0 top-1/2 grid min-h-11 min-w-11 -translate-y-1/2 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className={
              'grid h-[50px] w-[54px] shrink-0 place-items-center rounded-xl shadow-md transition ' +
              (goldAction
                ? 'border border-secondary-400 bg-secondary-500 text-primary-900 hover:bg-secondary-300'
                : 'bg-primary-800 text-white hover:bg-primary-900')
            }
            aria-label="Open selected result"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>

      {open && (
        <div
          id={`search-results-${scope}`}
          aria-label={heading + ' results'}
          className="absolute left-5 right-5 md:left-6 md:right-6 top-[118px] z-40 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_55px_rgba(26,43,32,0.22)]"
        >
          <div className="overflow-x-auto border-b border-gray-200 px-3 py-3">
            <div className="flex min-w-max gap-2">
              {tabs.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setTab(item);
                    setDomainFilter('all');
                    setActiveIndex(0);
                  }}
                  className={
                    tab === item
                      ? 'inline-flex min-h-11 items-center rounded-full bg-primary-800 px-4 py-1.5 text-sm font-semibold text-white shadow-sm'
                      : 'inline-flex min-h-11 items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {scope === 'site' && (
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
              <label
                htmlFor="site-search-domain"
                className="text-xs font-bold uppercase tracking-wide text-gray-600"
              >
                Filter by type
              </label>
              <select
                id="site-search-domain"
                value={domainFilter}
                onChange={event => {
                  setDomainFilter(event.target.value as SearchDomainId);
                  setTab('All');
                  setActiveIndex(0);
                }}
                className="min-h-11 max-w-[68%] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                {searchDomainOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                    {domainCounts.has(option.id)
                      ? ' (' + (domainCounts.get(option.id) ?? 0) + ')'
                      : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div
            className="max-h-[360px] overflow-y-auto"
            role="listbox"
            aria-label={heading + ' matches'}
          >
            {visibleResults.length > 0 ? (
              visibleResults.map((item, index) => (
                <button
                  key={item.canonicalKey ?? item.href + item.title}
                  type="button"
                  role="option"
                  id={`search-result-${scope}-${index}`}
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectResult(item.href)}
                  className={
                    'w-full border-b border-gray-100 px-5 py-4 text-left last:border-b-0 transition ' +
                    (index === activeIndex
                      ? 'bg-primary-50'
                      : 'bg-white hover:bg-gray-50')
                  }
                >
                  <div className="text-base font-bold text-primary-800">
                    {item.title}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1">
                      {item.group === 'Service' || item.group === 'Record'
                        ? item.category
                        : item.group}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {item.description}
                  </p>
                  {showServicePlaces && item.serviceId && servicePlaceById.has(item.serviceId) && (
                    <div className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-sm text-gray-700">
                      <div className="font-bold text-gray-900">
                        Where to go: {servicePlaceById.get(item.serviceId)?.name}
                      </div>
                      <div className="mt-0.5 text-xs leading-relaxed text-gray-500">
                        {servicePlaceById.get(item.serviceId)?.address}
                      </div>
                    </div>
                  )}
                </button>
              ))
            ) : hasBroaderMatches ? (
              <div className="px-5 py-8 text-center">
                <div className="font-semibold text-gray-900">
                  No {activeFilterLabel} matches
                </div>
                <p className="mx-auto mt-1 max-w-xl text-sm leading-relaxed text-gray-600">
                  {query.trim()
                    ? 'BetterMakati has ' +
                      allRankedResults.length +
                      ' matching ' +
                      (allRankedResults.length === 1 ? 'result' : 'results') +
                      ' for “' +
                      query.trim() +
                      '” outside this filter.'
                    : 'There are BetterMakati results outside this filter.'}
                </p>
                <button
                  type="button"
                  onClick={showAllMatches}
                  className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary-800 px-4 py-2 text-sm font-bold text-white hover:bg-primary-900"
                >
                  Show all {allRankedResults.length} matching{' '}
                  {allRankedResults.length === 1 ? 'result' : 'results'}
                </button>
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <div className="font-semibold text-gray-900">
                  {query.trim()
                    ? 'No BetterMakati match for “' + query.trim() + '”'
                    : 'No matching result'}
                </div>
                <p className="mx-auto mt-1 max-w-xl text-sm leading-relaxed text-gray-600">
                  Try a broader keyword, or continue in the part of BetterMakati most likely to help.
                </p>

                {scope === 'site' && (
                  <>
                    <div className="mt-5 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Browse BetterMakati
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                      <Link
                        to="/services"
                        className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Services
                      </Link>
                      <Link
                        to="/barangays"
                        className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Barangays
                      </Link>
                      <Link
                        to="/records"
                        className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Public records
                      </Link>
                      <Link
                        to="/reports"
                        className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Reports & insights
                      </Link>
                      <Link
                        to="/civic-map"
                        className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Places & map
                      </Link>
                    </div>
                  </>
                )}

                <div className="mt-5 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Outside BetterMakati
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                  <a
                    href={'https://bettergov.ph/services?search=' + encodeURIComponent(query)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    Search national services on BetterGov
                  </a>
                  <a
                    href="https://lgu.bettergov.ph/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    Find another LGU on BetterLGU
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/get-involved?type=idea&tool=search&subject=' +
                          encodeURIComponent('Missing search result: ' + query) +
                          '#submission'
                      )
                    }
                    className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    Report a missing result
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-500">
            <span>
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </span>
            <div className="hidden md:flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <kbd className="search-kbd">
                  <ArrowUp className="h-3 w-3" />
                </kbd>
                <kbd className="search-kbd">
                  <ArrowDown className="h-3 w-3" />
                </kbd>
                Navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="search-kbd">
                  <CornerDownLeft className="h-3 w-3" />
                </kbd>
                Select
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="search-kbd">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
