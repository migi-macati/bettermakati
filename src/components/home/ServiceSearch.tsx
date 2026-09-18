import { FormEvent, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

const services = [
  {
    title: 'New business permit',
    href: '/services/business/new-business-permit',
    keywords: 'business permit new mayor licensing bplo',
  },
  {
    title: 'Renew a business permit',
    href: '/services/business/renew-business-permit',
    keywords: 'business permit renewal tax bplo',
  },
  {
    title: 'Makati Health Plus / Yellow Card',
    href: '/services/health-services/makati-health-plus',
    keywords: 'yellow card makati health plus medical',
  },
  {
    title: 'Emergency assistance',
    href: '/services/health-services/emergency-assistance',
    keywords: 'emergency 911 rescue medical drrmo',
  },
  {
    title: 'University of Makati admissions',
    href: '/services/education/umak-admissions',
    keywords: 'umak university admission college school',
  },
  {
    title: 'UMak scholarships and grants',
    href: '/services/education/umak-scholarships',
    keywords: 'umak scholarship education grant',
  },
  {
    title: 'Makati Action Center',
    href: '/services/social-welfare/makati-action-center',
    keywords: 'complaint concern action center help assistance',
  },
  {
    title: 'Senior citizen Blu Card',
    href: '/services/social-welfare/senior-citizen-blu-card',
    keywords: 'senior citizen blue blu card',
  },
  {
    title: 'Real property tax payment',
    href: '/services/housing-land-use/real-property-tax-payment',
    keywords: 'property tax real estate payment rpta',
  },
  {
    title: 'Locational clearance and building permit',
    href: '/services/housing-land-use/locational-clearance-building-permit',
    keywords: 'building permit zoning locational clearance construction',
  },
];

export default function ServiceSearch() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const needle = query.trim().toLowerCase();
    if (!needle) {
      navigate('/services');
      return;
    }

    const words = needle.split(/\s+/).filter(Boolean);
    const ranked = services
      .map(service => {
        const haystack = `${service.title} ${service.keywords}`.toLowerCase();
        const score = words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0);
        return { ...service, score };
      })
      .sort((a, b) => b.score - a.score);

    if (ranked[0]?.score) {
      navigate(ranked[0].href);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="rounded-2xl border border-primary-100 bg-white/95 p-5 md:p-6 shadow-[0_18px_50px_rgba(18,78,46,0.12)]">
      <div className="flex items-center gap-2 text-primary-800 font-semibold mb-3">
        <Search className="h-5 w-5" />
        Find a government service
      </div>
      <form onSubmit={submit}>
        <label htmlFor="service-search" className="sr-only">Search BetterMakati services</label>
        <div className="flex rounded-xl border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary-300 focus-within:border-primary-500">
          <input
            id="service-search"
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="e.g., business permit, Yellow Card"
            className="min-w-0 flex-1 px-4 py-3 text-sm outline-none text-gray-900"
          />
          <button
            type="submit"
            className="px-4 bg-primary-700 text-white hover:bg-primary-800 transition-colors"
            aria-label="Search services"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-500">Popular:</span>
        <Link className="brand-chip" to="/services/business/new-business-permit">Business Permit</Link>
        <Link className="brand-chip" to="/services/housing-land-use/real-property-tax-payment">Real Property Tax</Link>
        <Link className="brand-chip" to="/services/health-services/makati-health-plus">Yellow Card</Link>
      </div>
    </div>
  );
}
