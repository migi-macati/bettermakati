import { AlertTriangle, ArrowRight, Building2, FileBadge2, HeartPulse, Landmark, ReceiptText, Users } from 'lucide-react';
import { Link } from 'react-router';
import ServiceSearch from '../components/home/ServiceSearch';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const commonNeeds = [
  {
    title: 'I need medical or financial assistance',
    description: 'Start with Makati Social Welfare Department requirements and assessment.',
    href: '/services/guide/medical-financial-assistance',
    icon: HeartPulse,
  },
  {
    title: 'I need a PWD ID',
    description: 'Open the Makati PDAO / social welfare application guide.',
    href: '/services/guide/pwd-id',
    icon: FileBadge2,
  },
  {
    title: 'I need a senior Blu Card',
    description: 'See the city guide, requirements and current-source caveat.',
    href: '/services/guide/senior-blu-card',
    icon: Users,
  },
  {
    title: 'I need a barangay clearance',
    description: 'Start with your barangay and the clearance guide.',
    href: '/services/guide/barangay-clearance',
    icon: Building2,
  },
  {
    title: 'I need a business permit',
    description: 'Open the new-business permit checklist and official city source.',
    href: '/services/guide/new-business-permit',
    icon: Landmark,
  },
  {
    title: 'I need a civil registry document',
    description: 'Find Makati birth, marriage, death and certified-copy services.',
    href: '/services/guide/local-civil-registry-copy',
    icon: FileBadge2,
  },
  {
    title: 'I need to pay real property tax',
    description: 'See the city payment guide and source.',
    href: '/services/guide/real-property-tax',
    icon: ReceiptText,
  },
  {
    title: 'I need the city to act on a concern',
    description: 'Use the Makati Action Center route for service coordination.',
    href: '/services/guide/makati-action-center',
    icon: ArrowRight,
  },
];

export default function ConcernFinder() {
  return (
    <>
      <SEO
        title="Saan Ako Lalapit?"
        description="Describe what you need and find the Makati city, barangay or national government service that handles it."
        keywords="Makati government service finder, saan ako lalapit Makati, Makati assistance, Makati permits, Makati IDs"
      />

      <Section className="bg-[#fffdf8]">
        <div className="mx-auto max-w-4xl">
          <div className="section-eyebrow">Service finder</div>
          <Heading>Saan Ako Lalapit?</Heading>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-gray-700">
            Describe what you need. Search results go directly to a BetterMakati service guide before the official government handoff.
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-950">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <strong>Emergency or immediate danger?</strong>{' '}
              <Link to="/hotlines" className="font-bold underline underline-offset-2">
                Open emergency hotlines
              </Link>{' '}
              instead of using the service finder.
            </div>
          </div>

          <div className="mt-7">
            <ServiceSearch
              scope="services"
              title="What do you need help with?"
              placeholder="e.g., hospital bill, PWD ID, business permit, cedula"
            />
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Common needs</div>
        <Heading level={2}>Start with the task, not the office</Heading>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {commonNeeds.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className="group rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 transition hover:border-primary-300 hover:bg-primary-50"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary-800 shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-950 group-hover:text-primary-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                      Open guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <div className="section-eyebrow">Still unsure</div>
            <Heading level={2}>Makati Action Center</Heading>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Use the city’s service-coordination channel when the concern crosses offices or you cannot identify the responsible department.
            </p>
            <Link to="/services/guide/makati-action-center" className="brand-btn-primary mt-5">
              Open Action Center guide
            </Link>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <div className="section-eyebrow">Local concern</div>
            <Heading level={2}>Start with your barangay</Heading>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Barangay pages show hall contacts, common barangay transactions and local service context.
            </p>
            <Link to="/barangays" className="brand-btn-secondary mt-5">
              Choose a barangay
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
