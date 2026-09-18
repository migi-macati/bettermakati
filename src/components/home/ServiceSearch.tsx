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
  Building2,
  CornerDownLeft,
  Search,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router';

type ServiceCategory =
  | 'Business'
  | 'Health'
  | 'Education'
  | 'Social'
  | 'Property';

interface ServiceItem {
  title: string;
  category: ServiceCategory;
  description: string;
  href: string;
  keywords: string;
}

const services: ServiceItem[] = [
  {
    title: 'Apply for a new business permit',
    category: 'Business',
    description: 'Requirements and application form for a new Makati business permit.',
    href: '/services/business/new-business-permit',
    keywords: 'business permit new mayor mayors licensing bplo trade company enterprise registration',
  },
  {
    title: 'Renew a business permit',
    category: 'Business',
    description: 'Renewal requirements for an existing Makati business permit.',
    href: '/services/business/renew-business-permit',
    keywords: 'business permit renewal renew mayor mayors licensing bplo tax',
  },
  {
    title: 'Makati Health Plus / Yellow Card',
    category: 'Health',
    description: 'Makati Health Plus application information and supporting documents.',
    href: '/services/health-services/makati-health-plus',
    keywords: 'yellow card health plus medical hospital patient healthcare benefit',
  },
  {
    title: 'Get emergency assistance',
    category: 'Health',
    description: 'Emergency contacts and information to prepare when reporting an incident.',
    href: '/services/health-services/emergency-assistance',
    keywords: 'emergency 911 rescue medical drrmo disaster fire police ambulance',
  },
  {
    title: 'Apply to the University of Makati',
    category: 'Education',
    description: 'University of Makati admissions and application information.',
    href: '/services/education/umak-admissions',
    keywords: 'umak university admission college school enrollment student',
  },
  {
    title: 'University of Makati scholarships and grants',
    category: 'Education',
    description: 'UMak scholarship guidelines and application information.',
    href: '/services/education/umak-scholarships',
    keywords: 'umak scholarship education grant tuition student financial assistance',
  },
  {
    title: 'Contact the Makati Action Center',
    category: 'Social',
    description: 'City concern, feedback and service-coordination contact information.',
    href: '/services/social-welfare/makati-action-center',
    keywords: 'complaint concern feedback action center help assistance mac mayor city hall',
  },
  {
    title: 'Senior citizen Blu Card services',
    category: 'Social',
    description: 'Blu Card program information for Makati senior citizens.',
    href: '/services/social-welfare/senior-citizen-blu-card',
    keywords: 'senior citizen blue blu card elderly benefits social welfare',
  },
  {
    title: 'Pay real property tax',
    category: 'Property',
    description: 'Requirements for Makati real property tax payment.',
    href: '/services/housing-land-use/real-property-tax-payment',
    keywords: 'property tax real estate rpta payment assessment treasurer land house',
  },
  {
    title: 'Secure locational clearance and building permit',
    category: 'Property',
    description: 'Locational clearance and building-permit requirements.',
    href: '/services/housing-land-use/locational-clearance-building-permit',
    keywords: 'building permit zoning locational clearance construction land development occupancy',
  },
];

const categories: Array<'All' | ServiceCategory> = [
  'All',
  'Business',
  'Health',
  'Education',
  'Social',
  'Property',
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const scoreService = (service: ServiceItem, query: string) => {
  const needle = normalize(query);
  if (!needle) return 1;

  const title = normalize(service.title);
  const description = normalize(service.description);
  const keywords = normalize(service.keywords);
  const words = needle.split(' ').filter(Boolean);

  let score = 0;

  if (title === needle) score += 40;
  if (title.startsWith(needle)) score += 24;
  if (title.includes(needle)) score += 18;
  if (keywords.includes(needle)) score += 12;
  if (description.includes(needle)) score += 8;

  for (const word of words) {
    if (title.split(' ').some(token => token.startsWith(word))) score += 6;
    else if (title.includes(word)) score += 4;

    if (keywords.includes(word)) score += 3;
    if (description.includes(word)) score += 1;
  }

  return score;
};

export default function ServiceSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | ServiceCategory>('All');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    return services
      .filter(service => category === 'All' || service.category === category)
      .map(service => ({ ...service, score: scoreService(service, query) }))
      .filter(service => !query.trim() || service.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  }, [category, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, category]);

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
    navigate(href);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (results.length > 0) {
      selectResult(results[Math.min(activeIndex, results.length - 1)].href);
      return;
    }

    navigate('/services');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(index =>
        results.length ? (index + 1) % results.length : 0,
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(index =>
        results.length
          ? (index - 1 + results.length) % results.length
          : 0,
      );
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === 'Enter' && open && results.length > 0) {
      event.preventDefault();
      selectResult(results[Math.min(activeIndex, results.length - 1)].href);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl border border-primary-100 bg-white/95 p-5 md:p-6 shadow-[0_18px_50px_rgba(18,78,46,0.12)]"
    >
      <div className="flex items-center gap-2 text-primary-900 font-bold mb-4 text-lg">
        <Search className="h-5 w-5 text-secondary-700" />
        Find a Government Service
      </div>

      <form onSubmit={submit}>
        <label htmlFor="service-search" className="sr-only">
          Search BetterMakati services
        </label>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              id="service-search"
              type="search"
              value={query}
              onFocus={() => setOpen(true)}
              onChange={event => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search services"
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="service-search-results"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-11 text-base outline-none text-gray-900 shadow-inner focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
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
            aria-label="Open selected service"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>

      {open && (
        <div
          id="service-search-results"
          role="listbox"
          className="absolute left-5 right-5 md:left-6 md:right-6 top-[118px] z-40 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_55px_rgba(26,43,32,0.22)]"
        >
          <div className="overflow-x-auto border-b border-gray-200 px-3 py-3">
            <div className="flex min-w-max gap-2">
              {categories.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={
                    category === item
                      ? 'rounded-full bg-primary-800 px-4 py-1.5 text-sm font-semibold text-white shadow-sm'
                      : 'rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {results.length > 0 ? (
              results.map((service, index) => (
                <button
                  key={service.href}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectResult(service.href)}
                  className={
                    'w-full border-b border-gray-100 px-5 py-4 text-left last:border-b-0 transition ' +
                    (index === activeIndex
                      ? 'bg-primary-50'
                      : 'bg-white hover:bg-gray-50')
                  }
                >
                  <div className="text-base font-bold text-primary-800">
                    {service.title}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {service.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {service.description}
                  </p>
                </button>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <div className="font-semibold text-gray-900">No matching service</div>
                <p className="mt-1 text-sm text-gray-500">
                  Try another keyword or category.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-500">
            <span>
              {results.length} {results.length === 1 ? 'service' : 'services'} found
            </span>
            <div className="hidden md:flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <kbd className="search-kbd"><ArrowUp className="h-3 w-3" /></kbd>
                <kbd className="search-kbd"><ArrowDown className="h-3 w-3" /></kbd>
                Navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="search-kbd"><CornerDownLeft className="h-3 w-3" /></kbd>
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
