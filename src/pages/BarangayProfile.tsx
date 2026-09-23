import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  Landmark,
  Mail,
  MapPin,
  MessageSquarePlus,
  Phone,
  Search,
  Wrench,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import SEO from '../components/SEO';
import { barangays, barangayFacilities, findBarangay, psaBarangaySource } from '../data/barangays';
import { withBarangayScope } from '../hooks/useBarangayScope';

const compactEditionName = (name: string) => name.replace(/\s+/g, '');

export default function BarangayProfile() {
  const { slug } = useParams();
  const barangay = findBarangay(slug);

  if (!barangay) {
    return (
      <section className="bg-[#fffdf8] py-16">
        <div className="container px-5 md:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-950">Barangay not found</h1>
          <Link to="/barangays" className="brand-btn-secondary mt-6">
            <ArrowLeft className="h-4 w-4" /> Choose a barangay
          </Link>
        </div>
      </section>
    );
  }

  const cityPopulation = barangays.reduce((sum, item) => sum + item.population2024, 0);
  const populationShare = (barangay.population2024 / cityPopulation) * 100;
  const facilities = barangayFacilities(barangay.slug, barangay.name);

  const quickActions = [
    {
      label: 'Find a service',
      description: 'Barangay clearances, certificates and other public services.',
      href: withBarangayScope('/services', barangay.slug),
      icon: Search,
    },
    {
      label: 'Report a public-place issue',
      description: 'Open the Civic Map with this barangay selected.',
      href: withBarangayScope('/civic-map', barangay.slug),
      icon: Wrench,
    },
    {
      label: 'Participate locally',
      description: 'Find ways to raise concerns, contribute or take part.',
      href: withBarangayScope('/participate', barangay.slug),
      icon: MessageSquarePlus,
    },
    {
      label: 'Barangay hall',
      description: 'See verified local contact details and official channels.',
      href: '#local-government',
      icon: Building2,
    },
  ];

  const civicLinks = [
    {
      label: 'Projects & money',
      description: 'See city budget and project records, sliced locally where geography is available.',
      href: withBarangayScope('/projects-budget', barangay.slug),
      icon: ClipboardCheck,
    },
    {
      label: 'Accountability',
      description: 'Review public records and accountability entries connected to this barangay.',
      href: withBarangayScope('/accountability', barangay.slug),
      icon: FileCheck2,
    },
    {
      label: 'Civic Map',
      description: 'Browse mapped public places and infrastructure in this barangay.',
      href: withBarangayScope('/civic-map', barangay.slug),
      icon: MapPin,
    },
    {
      label: 'Statistics',
      description: 'Start with this barangay’s population context, then compare citywide indicators.',
      href: withBarangayScope('/statistics', barangay.slug),
      icon: BarChart3,
    },
  ];

  const communityLinks = [
    ...(barangay.notablePlaces ?? []).slice(0, 2).map(place => ({
      label: place.name,
      description: place.type,
      href: place.href,
    })),
    ...(barangay.associations ?? []).slice(0, 2).map(association => ({
      label: association.name,
      description: association.linkLabel,
      href: association.href,
    })),
  ].slice(0, 4);

  return (
    <>
      <SEO
        title={'Better' + compactEditionName(barangay.name)}
        description={
          'Local BetterMakati homepage for Barangay ' +
          barangay.name +
          ': services, projects, public places, participation and local information.'
        }
      />

      <section className="bg-[#fffdf8] py-12 md:py-16">
        <div className="container px-5 md:px-6 lg:px-8">
          <Link
            to="/barangays"
            className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" /> All barangays
          </Link>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="section-eyebrow">Barangay homepage</div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 md:text-6xl">
                <span className="text-primary-700">Better</span>
                {compactEditionName(barangay.name)}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
                Your starting point for public services, civic records, local contacts,
                public places and participation in Barangay {barangay.name}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={withBarangayScope('/services', barangay.slug)} className="brand-btn-primary">
                  Find a service <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to={withBarangayScope('/civic-map', barangay.slug)} className="brand-btn-secondary">
                  Open local Civic Map
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={psaBarangaySource}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-primary-100 bg-white p-5"
              >
                <div className="text-2xl font-extrabold text-primary-800">
                  {barangay.population2024.toLocaleString('en-PH')}
                </div>
                <div className="mt-1 text-sm font-semibold text-gray-900">Population</div>
                <div className="mt-1 text-xs text-gray-500">2024 POPCEN</div>
              </a>
              <div className="rounded-2xl border border-primary-100 bg-white p-5">
                <div className="text-2xl font-extrabold text-primary-800">
                  {populationShare.toFixed(1)}%
                </div>
                <div className="mt-1 text-sm font-semibold text-gray-900">of Makati</div>
                <div className="mt-1 text-xs text-gray-500">2024 population</div>
              </div>
              <div className="col-span-2 rounded-2xl border border-primary-100 bg-white p-5">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  Legislative district
                </div>
                <div className="mt-1 text-xl font-extrabold text-gray-950">
                  {barangay.legislativeDistrict}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Start here</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
            What do you need in {barangay.name}?
          </h2>
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="home-service-card"
                >
                  <div className="home-service-card-icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950">{item.label}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-primary-600" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-primary-900 bg-primary-900 py-12 text-white">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow !text-white/80">Civic information</div>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Follow what affects {barangay.name}.
          </h2>
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {civicLinks.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:border-secondary-500 hover:bg-white/10"
                >
                  <Icon className="h-6 w-6 text-secondary-500" />
                  <h3 className="mt-4 font-extrabold text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-100">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-white">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="local-government" className="bg-[#f5f8f2] py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="section-eyebrow">Local government</div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
                Barangay hall
              </h2>
              <div className="mt-5 rounded-2xl border border-primary-100 bg-white p-6">
                <h3 className="text-lg font-extrabold text-gray-950">
                  Barangay {barangay.name}
                </h3>
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  {barangay.hallAddress && (
                    <div className="flex gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                      <span>{barangay.hallAddress}</span>
                    </div>
                  )}
                  {barangay.hallPhone && (
                    <div className="flex gap-2">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                      <span>{barangay.hallPhone}</span>
                    </div>
                  )}
                  {barangay.hallEmail && (
                    <div className="flex gap-2">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                      <a
                        href={'mailto:' + barangay.hallEmail}
                        className="break-all font-semibold text-primary-700 underline underline-offset-2"
                      >
                        {barangay.hallEmail}
                      </a>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={barangay.officialPageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-btn-secondary"
                  >
                    Official barangay page <ExternalLink className="h-4 w-4" />
                  </a>
                  {barangay.facebookUrl && (
                    <a
                      href={barangay.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="brand-btn-secondary"
                    >
                      Facebook <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {!barangay.hallAddress && !barangay.hallPhone && !barangay.hallEmail && (
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    A verified direct hall contact has not yet been matched to this local homepage.
                    Use the official barangay page for current contact information.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Verified facilities</div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
                Useful local places
              </h2>
              <div className="mt-5 grid gap-3">
                {facilities.slice(0, 3).map(facility => (
                  <a
                    key={facility.name}
                    href={facility.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                        {facility.type}
                      </div>
                      <h3 className="mt-1 font-extrabold text-gray-950">{facility.name}</h3>
                      {facility.address && (
                        <p className="mt-1 text-sm text-gray-600">{facility.address}</p>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-primary-700" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {communityLinks.length > 0 && (
        <section className="bg-white py-14">
          <div className="container px-5 md:px-6 lg:px-8">
            <div className="section-eyebrow">Around the barangay</div>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
                Community links
              </h2>
              <Link
                to={'/history?query=' + encodeURIComponent(barangay.name)}
                className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
              >
                Search Makati history <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {communityLinks.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 hover:border-primary-300"
                >
                  <Landmark className="h-5 w-5 text-primary-700" />
                  <h3 className="mt-3 font-extrabold text-gray-950">{item.label}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
