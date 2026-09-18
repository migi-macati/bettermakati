import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, Search, Waypoints } from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const routes = [
  {
    title: 'Emergency assistance',
    destination: '911 / Hotlines',
    href: '/hotlines',
    keywords: 'emergency accident fire police ambulance rescue disaster flood medical urgent 911',
  },
  {
    title: 'Business permits',
    destination: 'Business Permits & Licensing',
    href: '/services/business',
    keywords: 'business permit mayor permit renewal company registration store shop bplo',
  },
  {
    title: 'Makati Health Plus / Yellow Card',
    destination: 'Health services',
    href: '/services/health-services/makati-health-plus',
    keywords: 'yellow card health hospital medical health plus patient benefit',
  },
  {
    title: 'University of Makati',
    destination: 'Admissions & scholarships',
    href: '/services/education',
    keywords: 'school college university umak admission scholarship tuition education student',
  },
  {
    title: 'Senior citizen services',
    destination: 'Blu Card',
    href: '/services/social-welfare/senior-citizen-blu-card',
    keywords: 'senior citizen elderly blu blue card benefit social welfare',
  },
  {
    title: 'Citizen concerns & complaints',
    destination: 'Makati Action Center',
    href: '/services/social-welfare/makati-action-center',
    keywords: 'complaint concern feedback report help action center mac city hall',
  },
  {
    title: 'Real property tax',
    destination: 'Real Property Tax Division',
    href: '/services/housing-land-use/real-property-tax-payment',
    keywords: 'property tax land house real estate rpt assessment payment',
  },
  {
    title: 'Building permit & locational clearance',
    destination: 'Building / land-use services',
    href: '/services/housing-land-use/locational-clearance-building-permit',
    keywords: 'building construction zoning locational clearance permit renovation land use',
  },
  {
    title: 'Barangay information',
    destination: 'Barangay Hub',
    href: '/barangays',
    keywords: 'barangay hall local neighborhood district population',
  },
  {
    title: 'Budget, procurement & public records',
    destination: 'Transparency',
    href: '/transparency',
    keywords: 'budget procurement ordinance resolution audit project contract transparency records',
  },
];

const score = (keywords: string, title: string, query: string) => {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const haystack = `${title} ${keywords}`.toLowerCase();
  return words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0);
};

export default function ConcernFinder() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return routes;
    return routes
      .map(route => ({ ...route, score: score(route.keywords, route.title, query) }))
      .filter(route => route.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Saan Ako Lalapit?"
        description="Find the Makati office, service or channel for your concern."
      />
      <Section className="bg-[#fffdf8]">
        <div className="max-w-4xl mx-auto">
          <div className="section-eyebrow">Community Tool</div>
          <Heading>Saan Ako Lalapit?</Heading>

          <form onSubmit={submit} className="mt-6">
            <label htmlFor="concern-search" className="sr-only">Describe your concern</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Waypoints className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-700" />
                <input
                  id="concern-search"
                  value={query}
                  onChange={event => {
                    setQuery(event.target.value);
                    setSubmitted(true);
                  }}
                  placeholder="e.g., pay property tax, complaint, scholarship"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <button type="submit" className="brand-btn-primary px-5" aria-label="Find office or service">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="mt-8 space-y-3">
            {(submitted || !query.trim()) && results.map(result => (
              <Link
                key={result.href}
                to={result.href}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-gray-950">{result.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{result.destination}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary-700 shrink-0" />
              </Link>
            ))}

            {submitted && results.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="font-bold text-gray-950">No match found</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Try a simpler keyword or send the concern to the Makati Action Center.
                </p>
                <Link to="/services/social-welfare/makati-action-center" className="brand-btn-secondary mt-4">
                  Makati Action Center <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
