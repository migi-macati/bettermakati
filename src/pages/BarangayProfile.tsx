import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  HeartPulse,
  Landmark,
  Mail,
  MapPin,
  MessageSquarePlus,
  Phone,
  Search,
  Users,
  Vote,
  Wrench,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import {
  barangays,
  barangayFacilities,
  barangayProfilesReviewed,
  commonBarangayServiceIds,
  findBarangay,
  psaBarangaySource,
} from '../data/barangays';
import { serviceDirectory } from '../data/serviceDirectory';
import {
  civicAssetTypeLabels,
  placesByBarangay,
  type PlaceRegistryRecord,
} from '../data/placeRegistry';
import {
  accountabilityEntries,
  accountabilityStatusLabel,
} from '../data/accountability';
import {
  barangayResultSource2025,
  findBarangayMayoralResult2025,
} from '../data/electionHistory';
import { withBarangayScope } from '../hooks/useBarangayScope';

const compactEditionName = (name: string) => name.replace(/\s+/g, '');
const normalizePlaceName = (name: string) =>
  name.trim().toLocaleLowerCase('en-PH').replace(/\s+/g, ' ');

const primaryPlaceSource = (place: PlaceRegistryRecord) =>
  place.provenance.sources.find(source => source.kind !== 'reference-map') ??
  place.provenance.sources[0];

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
  const localPlaces = placesByBarangay(barangay.name).filter(
    place => place.verification.status === 'verified'
  );
  const facilityByName = new Map(
    facilities.map(facility => [normalizePlaceName(facility.name), facility])
  );
  const registryPlaceNames = new Set(
    localPlaces.map(place => normalizePlaceName(place.name))
  );
  const facilityFallbacks = facilities.filter(
    facility => !registryPlaceNames.has(normalizePlaceName(facility.name))
  );
  const services = serviceDirectory.filter(item =>
    commonBarangayServiceIds.includes(item.id)
  );
  const electionResult = findBarangayMayoralResult2025(barangay.slug);
  const needle = barangay.name.toLowerCase();
  const localAccountability = accountabilityEntries.filter(entry =>
    [
      entry.title,
      entry.summary,
      entry.location,
      ...entry.responsibleBodies,
      ...entry.sources.map(source => source.label),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(needle)
  );

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
      label: 'Barangay government',
      description: 'See the current council, hall contacts and official channels.',
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
    ...(barangay.notablePlaces ?? []).map(place => ({
      label: place.name,
      description: place.type,
      href: place.href,
    })),
    ...(barangay.associations ?? []).map(association => ({
      label: association.name,
      description: association.linkLabel,
      href: association.href,
    })),
  ];

  return (
    <>
      <SEO
        title={'Better' + compactEditionName(barangay.name)}
        description={
          'Local BetterMakati homepage for Barangay ' +
          barangay.name +
          ': services, current barangay officials, facilities, civic records, election context and participation.'
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
                Services, local government, civic records, public places and participation
                for Barangay {barangay.name}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={withBarangayScope('/services', barangay.slug)} className="brand-btn-primary">
                  Find a service <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to={withBarangayScope('/civic-map', barangay.slug)} className="brand-btn-secondary">
                  Open local Civic Map
                </Link>
              </div>
              <LastReviewed
                date={barangayProfilesReviewed}
                note="Population: 2024 POPCEN · Council term: 2023–2026"
                className="mt-5"
              />
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
                <Link key={item.label} to={item.href} className="home-service-card">
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

      <section id="services" className="bg-[#f5f8f2] py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Barangay services</div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
              Services in {barangay.name}
            </h2>
            <Link
              to={withBarangayScope('/services', barangay.slug)}
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
            >
              All local services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {(barangay.publishedServices?.length ?? 0) > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {barangay.publishedServices?.map(service => (
                <article
                  key={service.title}
                  className="rounded-2xl border border-primary-100 bg-white p-5"
                >
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {service.type}
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold text-gray-950">
                    {service.title}
                  </h3>
                  {service.availability && (
                    <div className="mt-2 text-sm font-semibold text-gray-800">
                      {service.availability}
                    </div>
                  )}
                  {service.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {service.summary}
                    </p>
                  )}
                  {(service.requirements?.length ?? 0) > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                      {service.requirements?.map(requirement => (
                        <li key={requirement}>• {requirement}</li>
                      ))}
                    </ul>
                  )}
                  <a
                    href={service.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    {service.sourceLabel} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </article>
              ))}
            </div>
          )}

          <div className={(barangay.publishedServices?.length ?? 0) > 0 ? 'mt-10' : 'mt-6'}>
            <h3 className="text-lg font-extrabold text-gray-950">Common transactions</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {services.map(service => (
                <Link
                  key={service.id}
                  to={withBarangayScope('/services', barangay.slug)}
                  className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300"
                >
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {service.type}
                  </div>
                  <h4 className="mt-2 font-extrabold text-gray-950">{service.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{service.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="local-government" className="bg-white py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Local government</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
            Barangay {barangay.name} government
          </h2>

          <div className="mt-7 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
              <Building2 className="h-6 w-6 text-primary-700" />
              <h3 className="mt-4 text-xl font-extrabold text-gray-950">Barangay hall</h3>
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
              {!barangay.hallAddress && !barangay.hallPhone && !barangay.hallEmail && (
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  BetterMakati has not yet verified a direct hall contact for this barangay.
                  Use the official Makati barangay page for the latest contact information.
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={barangay.officialPageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-btn-secondary"
                >
                  Makati barangay page <ExternalLink className="h-4 w-4" />
                </a>
                {barangay.websiteUrl && (
                  <a
                    href={barangay.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-btn-secondary"
                  >
                    Barangay website <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {barangay.facebookUrl && (
                  <a
                    href={barangay.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-btn-secondary"
                  >
                    Official social channel <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Users className="h-6 w-6 text-primary-700" />
                  <h3 className="mt-4 text-xl font-extrabold text-gray-950">Current barangay council</h3>
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  {barangay.officials?.term ?? 'Current term'}
                </div>
              </div>

              {barangay.officials?.punongBarangay ? (
                <>
                  <div className="mt-5 rounded-xl border border-primary-100 bg-white p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                      Punong Barangay
                    </div>
                    <div className="mt-1 text-lg font-extrabold text-gray-950">
                      {barangay.officials.punongBarangay}
                    </div>
                  </div>

                  {(barangay.officials.kagawads?.length ?? 0) > 0 && (
                    <div className="mt-5">
                      <div className="text-sm font-extrabold text-gray-900">Barangay Kagawads</div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {barangay.officials.kagawads?.map(name => (
                          <div key={name} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {barangay.officials.skChairperson && (
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">SK Chairperson</div>
                        <div className="mt-1 text-sm font-bold text-gray-900">{barangay.officials.skChairperson}</div>
                      </div>
                    )}
                    {barangay.officials.secretary && (
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">Secretary</div>
                        <div className="mt-1 text-sm font-bold text-gray-900">{barangay.officials.secretary}</div>
                      </div>
                    )}
                    {barangay.officials.treasurer && (
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">Treasurer</div>
                        <div className="mt-1 text-sm font-bold text-gray-900">{barangay.officials.treasurer}</div>
                      </div>
                    )}
                  </div>

                  {barangay.officials.note && (
                    <div className="mt-4 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-xs leading-relaxed text-gray-700">
                      <p>{barangay.officials.note}</p>
                      {barangay.officials.statusSource && (
                        <a
                          href={barangay.officials.statusSource}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2"
                        >
                          {barangay.officials.statusSourceLabel ?? 'Status source'}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3 text-sm">
                    <a
                      href={barangay.officials.source}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-primary-700 underline underline-offset-2"
                    >
                      {barangay.officials.sourceLabel ?? 'Roster source'} <ExternalLink className="inline h-3.5 w-3.5" />
                    </a>
                    {barangay.officials.secondarySource && (
                      <a
                        href={barangay.officials.secondarySource}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-primary-700 underline underline-offset-2"
                      >
                        Cross-check source <ExternalLink className="inline h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <p className="mt-5 text-sm text-gray-600">
                  A current council roster has not yet been verified.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8f2] py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Places & facilities</div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
              In {barangay.name}
            </h2>
            <Link
              to={withBarangayScope('/civic-map', barangay.slug)}
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
            >
              Open barangay map <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {localPlaces.map(place => {
              const facility = facilityByName.get(normalizePlaceName(place.name));
              const source = primaryPlaceSource(place);
              const isHealth = place.primaryCategory === 'health-center';

              return (
                <article
                  key={place.id}
                  className="rounded-2xl border border-primary-100 bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                      {civicAssetTypeLabels[place.primaryCategory]}
                    </div>
                    {isHealth ? (
                      <HeartPulse className="h-4 w-4 text-primary-700" />
                    ) : (
                      <MapPin className="h-4 w-4 text-primary-700" />
                    )}
                  </div>

                  <h3 className="mt-2 font-extrabold text-gray-950">{place.name}</h3>
                  {place.location.address && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {place.location.address}
                    </p>
                  )}

                  {(place.servicesAtLocation?.length ?? 0) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {place.servicesAtLocation?.slice(0, 3).map(service => (
                        <span
                          key={service.serviceId ?? service.label}
                          className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800"
                        >
                          {service.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {facility?.phone && (
                    <p className="mt-3 text-sm text-gray-700">{facility.phone}</p>
                  )}
                  {facility?.email && (
                    <a
                      href={'mailto:' + facility.email}
                      className="mt-2 block break-all text-sm font-semibold text-primary-700 underline underline-offset-2"
                    >
                      {facility.email}
                    </a>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={'/civic-map/' + place.id}
                      className="text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      Place details <ArrowRight className="inline h-3.5 w-3.5" />
                    </Link>
                    {source && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        Source <ExternalLink className="inline h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}

            {facilityFallbacks.map(facility => (
              <article
                key={'facility-' + facility.name}
                className="rounded-2xl border border-primary-100 bg-white p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {facility.type}
                  </div>
                  {facility.type === 'Health' ? (
                    <HeartPulse className="h-4 w-4 text-primary-700" />
                  ) : (
                    <Building2 className="h-4 w-4 text-primary-700" />
                  )}
                </div>
                <h3 className="mt-2 font-extrabold text-gray-950">{facility.name}</h3>
                {facility.address && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {facility.address}
                  </p>
                )}
                {facility.phone && <p className="mt-2 text-sm text-gray-700">{facility.phone}</p>}
                {facility.email && (
                  <a
                    href={'mailto:' + facility.email}
                    className="mt-2 block break-all text-sm font-semibold text-primary-700 underline underline-offset-2"
                  >
                    {facility.email}
                  </a>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={facility.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    Map <ExternalLink className="inline h-3.5 w-3.5" />
                  </a>
                  {facility.source && (
                    <a
                      href={facility.source}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      Source <ExternalLink className="inline h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
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
                  <p className="mt-2 text-sm leading-relaxed text-primary-100">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-white">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-2">
            <div>
              <div className="section-eyebrow">Elections</div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950">
                2025 mayoral result
              </h2>
              {electionResult && (
                <div className="mt-5 rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
                  <Vote className="h-6 w-6 text-primary-700" />
                  <p className="mt-4 text-sm leading-relaxed text-gray-700">
                    <strong>{electionResult.carriedBy}</strong> received the higher reported
                    mayoral vote total in Barangay {barangay.name} in the 2025 local election.
                  </p>
                  {electionResult.exactVotesVerified && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="text-xl font-extrabold text-gray-950">{electionResult.nancyVotes?.toLocaleString('en-PH')}</div>
                        <div className="mt-1 text-xs text-gray-600">Nancy Binay</div>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="text-xl font-extrabold text-gray-950">{electionResult.camposVotes?.toLocaleString('en-PH')}</div>
                        <div className="mt-1 text-xs text-gray-600">Luis Campos Jr.</div>
                      </div>
                    </div>
                  )}
                  {!electionResult.exactVotesVerified && (
                    <p className="mt-3 text-xs leading-relaxed text-gray-500">
                      The current source establishes which candidate carried the barangay but does not expose an exact local vote total in BetterMakati’s indexed text.
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/elections#barangay-results-2025" className="brand-btn-secondary">
                      All barangay results
                    </Link>
                    <a
                      href={barangayResultSource2025.url}
                      target="_blank"
                      rel="noreferrer"
                      className="brand-btn-secondary"
                    >
                      Result source <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="section-eyebrow">Accountability</div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950">
                Locally tagged public records
              </h2>
              {localAccountability.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {localAccountability.slice(0, 4).map(entry => (
                    <article key={entry.id} className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                          {entry.type}
                        </span>
                        <span className="text-gray-500">{accountabilityStatusLabel[entry.status]}</span>
                      </div>
                      <h3 className="mt-3 font-extrabold text-gray-950">{entry.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{entry.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          to={withBarangayScope('/accountability', barangay.slug) + '#' + entry.id}
                          className="text-sm font-bold text-primary-700 underline underline-offset-2"
                        >
                          Open record
                        </Link>
                        {entry.sources.slice(0, 2).map(source => (
                          <a
                            key={source.url}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-primary-700 underline underline-offset-2"
                          >
                            {source.label} <ExternalLink className="inline h-3.5 w-3.5" />
                          </a>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-secondary-200 bg-secondary-50 p-6">
                  <p className="text-sm leading-relaxed text-gray-700">
                    No Accountability Ledger record is currently tagged specifically to Barangay {barangay.name}.
                    Citywide records remain available, while missing barangay budgets, projects and procurement should stay visible as a coverage gap rather than be inferred.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={withBarangayScope('/accountability', barangay.slug)}
                      className="brand-btn-secondary"
                    >
                      Open Accountability
                    </Link>
                    <Link
                      to={'/get-involved?type=source&barangay=' + encodeURIComponent(barangay.slug) + '#submission'}
                      className="brand-btn-secondary"
                    >
                      Share a local public record
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {(barangay.heritageMarkers?.length ?? 0) > 0 && (
        <section className="bg-[#f5f8f2] py-14">
          <div className="container px-5 md:px-6 lg:px-8">
            <div className="section-eyebrow">Heritage</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
              Registered markers and heritage records
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {barangay.heritageMarkers?.map(marker => (
                <a
                  key={marker.name + marker.agency}
                  href={marker.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300"
                >
                  <Landmark className="h-5 w-5 text-primary-700" />
                  <div className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {marker.agency}
                  </div>
                  <h3 className="mt-1 font-extrabold text-gray-950">{marker.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{marker.status}</p>
                  {marker.location && <p className="mt-2 text-xs text-gray-500">{marker.location}</p>}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {communityLinks.length > 0 && (
        <section className="bg-white py-14">
          <div className="container px-5 md:px-6 lg:px-8">
            <div className="section-eyebrow">Around the barangay</div>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
                Institutions, places and associations
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
