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
import { useNavigate } from 'react-router';
import { searchIndex, type SearchItem } from '../../data/searchIndex';
import { serviceDirectory } from '../../data/serviceDirectory';
import { officesForAgency } from '../../data/governmentServiceOffices';
import { placeRegistryById } from '../../data/placeRegistry';

type SearchScope = 'site' | 'services';

const siteTabs = [
  'All',
  'Services',
  'Visit',
  'Government',
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

const scoreItem = (item: SearchItem, query: string) => {
  const needle = normalize(query);
  if (!needle) return item.featured ? 5 : 1;

  const title = normalize(item.title);
  const description = normalize(item.description);
  const keywords = normalize(item.keywords);
  const words = needle.split(' ').filter(Boolean);
  const titleTokens = title.split(' ').filter(Boolean);
  const keywordTokens = keywords.split(' ').filter(Boolean);
  const descriptionTokens = description.split(' ').filter(Boolean);
  const allTokens = [...titleTokens, ...keywordTokens, ...descriptionTokens];

  let score = 0;

  if (title === needle) score += 50;
  if (title.startsWith(needle)) score += 28;
  if (title.includes(needle)) score += 20;
  if (keywords.includes(needle)) score += 14;
  if (description.includes(needle)) score += 8;

  for (const word of words) {
    if (titleTokens.some(token => token.startsWith(word))) score += 7;
    else if (title.includes(word)) score += 5;
    if (keywords.includes(word)) score += 3;
    if (description.includes(word)) score += 1;

    if (
      !title.includes(word) &&
      !keywords.includes(word) &&
      !description.includes(word) &&
      fuzzyMatch(word, allTokens)
    ) {
      score += 4;
    }
  }

  return score;
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
  if (tab === 'Barangays') return item.group === 'Barangay';
  if (tab === 'Places')
    return item.group === 'Place' || item.group === 'Segment' || item.group === 'Route';
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
}: {
  scope?: SearchScope;
  title?: string;
  placeholder?: string;
  initialQuery?: string;
  showServicePlaces?: boolean;
}) {
  const tabs = scope === 'services' ? serviceTabs : siteTabs;
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<string>('All');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const base =
      scope === 'services'
        ? searchIndex.filter(item => item.group === 'Service')
        : searchIndex;

    return base
      .filter(item => matchesTab(item, tab, scope))
      .map(item => ({ ...item, score: scoreItem(item, query) }))
      .filter(item => !query.trim() || item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  }, [query, scope, tab]);

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

  const selectResult = (href: string) => {
    setOpen(false);
    if (href.startsWith('http://') || href.startsWith('https://')) {
      window.location.assign(href);
      return;
    }
    navigate(href);
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
      scope === 'services' ? '/services' : '/community-tools/saan-ako-lalapit'
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
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="grid h-[50px] w-[54px] shrink-0 place-items-center rounded-xl bg-primary-800 text-white shadow-md transition hover:bg-primary-900"
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
                    setActiveIndex(0);
                  }}
                  className={
                    tab === item
                      ? 'rounded-full bg-primary-800 px-4 py-1.5 text-sm font-semibold text-white shadow-sm'
                      : 'rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div
            className="max-h-[360px] overflow-y-auto"
            role="listbox"
            aria-label={heading + ' matches'}
          >
            {visibleResults.length > 0 ? (
              visibleResults.map((item, index) => (
                <button
                  key={item.href + item.title}
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
                      {item.group === 'Service' ? item.category : item.group}
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
            ) : (
              <div className="px-5 py-8 text-center">
                <div className="font-semibold text-gray-900">
                  No matching result
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Try another keyword, or tell BetterMakati what information is missing.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                  <a
                    href={'https://bettergov.ph/services?search=' + encodeURIComponent(query)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    Search BetterGov
                  </a>
                  <a
                    href="https://lgu.bettergov.ph/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    Find another LGU
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/get-involved?type=idea&tool=saan-ako-lalapit&subject=' +
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
