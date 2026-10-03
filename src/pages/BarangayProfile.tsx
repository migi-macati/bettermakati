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
  Phone,
  Search,
  Users,
  Vote,
  Wrench,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import ServiceSearch from '../components/home/ServiceSearch';
import CivicTimelinePreview from '../components/civic/CivicTimelinePreview';
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
import { civicAuditPilot } from '../data/civicAuditPilot';
import { barangayPhotoSetFor } from '../data/cityImages';
import {
  civicAreaById,
  civicAreaRelationships,
  civicOrganizationById,
  type CivicAreaKind,
  type CivicOrganizationKind,
} from '../data/areaOrganizationRegistry';

const compactEditionName = (name: string) => name.replace(/\s+/g, '');
const normalizePlaceName = (name: string) =>
  name.trim().toLocaleLowerCase('en-PH').replace(/\s+/g, ' ');

const primaryPlaceSource = (place: PlaceRegistryRecord) =>
  place.provenance.sources.find(source => source.kind !== 'reference-map') ??
  place.provenance.sources[0];

export default function BarangayProfile() {
  const { t, i18n } = useTranslation();
  const numberLocale = i18n.resolvedLanguage === 'fil' ? 'fil-PH' : 'en-PH';
  const { slug } = useParams();
  const barangay = findBarangay(slug);

  if (!barangay) {
    return (
      <section className="bg-[#fffdf8] py-16">
        <div className="container px-5 md:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-950">{t('betterBarangay.profile.notFound')}</h1>
          <Link to="/barangays" className="brand-btn-secondary mt-6">
            <ArrowLeft className="h-4 w-4" /> {t('betterBarangay.profile.chooseBarangay')}
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
  const localAuditPlaces = localPlaces.filter(place =>
    (civicAuditPilot.targetEntityIds as readonly string[]).includes(place.id)
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
  const barangayPhotos = barangayPhotoSetFor(barangay.slug);
  const localAccountability = accountabilityEntries.filter(
    entry => entry.barangaySlug === barangay.slug
  );

  const sourcedAreaIds = civicAreaRelationships.flatMap(relationship =>
    relationship.kind === 'within-barangay' &&
    relationship.from.type === 'area' &&
    relationship.to.type === 'barangay' &&
    relationship.to.id === barangay.slug
      ? [relationship.from.id]
      : []
  );
  const relatedAreaIds = [
    ...new Set([
      ...sourcedAreaIds,
      ...(barangay.communityAreaIds ?? []),
    ]),
  ];
  const relatedAreas = relatedAreaIds.flatMap(areaId => {
    const area = civicAreaById.get(areaId);
    return area ? [area] : [];
  });
  const relatedOrganizations = [
    ...new Map(
      civicAreaRelationships.flatMap(relationship => {
        if (
          !['managed-by', 'developed-by', 'operated-by'].includes(
            relationship.kind
          ) ||
          relationship.from.type !== 'area' ||
          !relatedAreaIds.includes(relationship.from.id) ||
          relationship.to.type !== 'organization'
        ) {
          return [];
        }

        const organization = civicOrganizationById.get(relationship.to.id);
        return organization
          ? [[organization.id, organization] as const]
          : [];
      })
    ).values(),
  ];

  const quickActions = [
    {
      label: t('betterBarangay.profile.quick.findService.label'),
      description: t('betterBarangay.profile.quick.findService.description'),
      href: withBarangayScope('/services', barangay.slug),
      icon: Search,
    },
    {
      label: t('betterBarangay.profile.quick.explore.label'),
      description: t('betterBarangay.profile.quick.explore.description'),
      href: withBarangayScope('/civic-map', barangay.slug),
      icon: MapPin,
    },
    {
      label: t('betterBarangay.profile.quick.government.label'),
      description: t('betterBarangay.profile.quick.government.description'),
      href: '#local-government',
      icon: Building2,
    },
    {
      label: t('betterBarangay.profile.quick.projects.label'),
      description: t('betterBarangay.profile.quick.projects.description'),
      href: withBarangayScope('/projects-budget', barangay.slug),
      icon: ClipboardCheck,
    },
    {
      label: t('betterBarangay.profile.quick.report.label'),
      description: t('betterBarangay.profile.quick.report.description'),
      href: withBarangayScope('/civic-map/report', barangay.slug),
      icon: Wrench,
    },
    {
      label: t('betterBarangay.profile.quick.participate.label'),
      description: t('betterBarangay.profile.quick.participate.description'),
      href: '#participate',
      icon: Users,
    },
  ];

  const civicLinks = [
    {
      label: t('betterBarangay.profile.civic.projects.label'),
      description: t('betterBarangay.profile.civic.projects.description'),
      href: withBarangayScope('/projects-budget', barangay.slug),
      icon: ClipboardCheck,
    },
    {
      label: t('betterBarangay.profile.civic.accountability.label'),
      description: t('betterBarangay.profile.civic.accountability.description'),
      href: withBarangayScope('/accountability', barangay.slug),
      icon: FileCheck2,
    },
    {
      label: t('betterBarangay.profile.civic.map.label'),
      description: t('betterBarangay.profile.civic.map.description'),
      href: withBarangayScope('/civic-map', barangay.slug),
      icon: MapPin,
    },
    {
      label: t('betterBarangay.profile.civic.statistics.label'),
      description: t('betterBarangay.profile.civic.statistics.description'),
      href: withBarangayScope('/statistics', barangay.slug),
      icon: BarChart3,
    },
  ];

  const communityLinks = [
    ...new Map(
      [
        ...relatedAreas.map(area => ({
          label: area.name,
          description: t(`betterBarangay.profile.areaKinds.${area.kind}`),
          href: '/estates#area-' + area.id,
        })),
        ...relatedOrganizations.map(organization => ({
          label: organization.name,
          description: t(`betterBarangay.profile.organizationKinds.${organization.kind}`),
          href: '/estates#organization-' + organization.id,
        })),
        ...(barangay.notablePlaces ?? []).map(place => ({
          label: place.name,
          description: place.type,
          href: place.href,
        })),
      ].map(item => [normalizePlaceName(item.label), item] as const)
    ).values(),
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

      <section className="bm-barangay-hero border-b border-primary-900 bg-primary-800 text-white">
        <div className="container px-5 py-12 md:px-6 md:py-14 lg:px-8 lg:py-16 xl:py-20">
          <Link
            to="/barangays"
            className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary-50 transition hover:text-secondary-300"
          >
            <ArrowLeft className="h-4 w-4" /> {t('betterBarangay.directory.allBarangays')}
          </Link>

          <div className="mt-5 grid gap-8 md:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)] md:items-center md:gap-7 lg:gap-10">
            <div className="min-w-0">
              <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-secondary-300 md:text-sm">
                Better{compactEditionName(barangay.name)} · {t('betterBarangay.profile.homepage')}
              </div>
              <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
                {t('betterBarangay.profile.makeBetterPrefix')} {barangay.name}{' '}
                <span className="text-secondary-500">Better!</span>
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-primary-50 md:text-xl">
                {t('betterBarangay.profile.intro', { barangay: barangay.name })}
              </p>

              <div className="mt-7 max-w-3xl">
                <ServiceSearch
                  scope="site"
                  title={t('betterBarangay.profile.searchTitle')}
                  placeholder={t('betterBarangay.profile.searchPlaceholder')}
                  goldAction
                  barangaySlug={barangay.slug}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-50">
                <span className="font-medium text-primary-100">{t('betterBarangay.profile.startWith')}</span>
                <a href="#local-government" className="min-h-11 content-center font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300">
                  {t('betterBarangay.profile.hallContacts')}
                </a>
                <Link
                  to={withBarangayScope('/projects-budget', barangay.slug)}
                  className="min-h-11 content-center font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300"
                >
                  {t('betterBarangay.profile.localProjects')}
                </Link>
                <Link
                  to={withBarangayScope('/civic-map', barangay.slug)}
                  className="min-h-11 content-center font-semibold underline decoration-white/40 underline-offset-4 hover:text-secondary-300"
                >
                  Places
                </Link>
              </div>

              <LastReviewed
                date={barangayProfilesReviewed}
                note={t('betterBarangay.profile.reviewNote')}
                className="mt-4 rounded-xl bg-white/10 px-3 py-2 !text-primary-50 [&_strong]:!text-white [&_svg]:!text-secondary-400"
              />
            </div>

            <aside
              className="min-w-0 rounded-3xl border border-secondary-200/70 bg-[#fffdf8] p-5 text-gray-950 shadow-[0_24px_64px_rgba(0,0,0,0.2)] md:p-5 lg:p-6"
              aria-labelledby="barangay-what-brings-you-here"
            >
              <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary-700">
                {t('betterBarangay.profile.startHere')}
              </div>
              <h2
                id="barangay-what-brings-you-here"
                className="mt-1 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl"
              >
                {t('betterBarangay.profile.whatBrings')}
              </h2>

              <div className="mt-4 divide-y divide-gray-200">
                {quickActions.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="group flex min-h-[64px] items-center gap-3 py-2.5 first:pt-1 last:pb-1"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-100">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-extrabold leading-snug text-gray-950">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-gray-600">
                          {item.description}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-secondary-700 transition group-hover:translate-x-0.5 group-hover:text-secondary-600"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {barangayPhotos.length > 0 && (
        <section className="bm-barangay-section border-b border-primary-100 bg-[#fffdf8] py-8 md:py-10">
          <div className="container px-5 md:px-6 lg:px-8">
            <PhotoCarousel
              images={barangayPhotos}
              title={t('betterBarangay.profile.around', { barangay: barangay.name })}
              compact
              className="mx-auto max-w-6xl"
            />
          </div>
        </section>
      )}

      <section className="bm-barangay-section bm-barangay-band-muted border-b border-primary-100 bg-[#f5f8f2] py-10 md:py-12">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">Better{compactEditionName(barangay.name)} · {t('betterBarangay.profile.atGlance')}</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-5">
            <a
              href={psaBarangaySource}
              target="_blank"
              rel="noreferrer"
              className="stat-card hover:border-primary-300 transition"
            >
              <div className="text-2xl font-extrabold text-primary-800 md:text-3xl">
                {barangay.population2024.toLocaleString(numberLocale)}
              </div>
              <div className="mt-1 font-semibold text-gray-900">{t('betterBarangay.profile.population')}</div>
              <div className="mt-1 text-xs text-gray-500">2024 POPCEN</div>
            </a>
            <div className="stat-card">
              <div className="text-2xl font-extrabold text-primary-800 md:text-3xl">
                {populationShare.toFixed(1)}%
              </div>
              <div className="mt-1 font-semibold text-gray-900">{t('betterBarangay.profile.ofMakati')}</div>
              <div className="mt-1 text-xs text-gray-500">{t('betterBarangay.profile.population2024')}</div>
            </div>
            <div className="stat-card">
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                {t('betterBarangay.profile.legislativeDistrict')}
              </div>
              <div className="mt-2 text-xl font-extrabold text-gray-950">
                {barangay.legislativeDistrict}
              </div>
              <div className="mt-1 text-xs text-gray-500">{t('betterBarangay.profile.currentDistrict')}</div>
            </div>
          </div>
        </div>
      </section>

      <CivicTimelinePreview
        barangaySlug={barangay.slug}
        contextLabel={t('betterBarangay.profile.contextLabel', { barangay: barangay.name })}
        heading={t('betterBarangay.profile.civicDates', { barangay: barangay.name })}
        className="bg-[#fffdf8]"
      />

      <section id="services" className="bm-barangay-section bm-barangay-band-muted bg-[#f5f8f2] py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">{t('betterBarangay.profile.barangayServices')}</div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
              {t('betterBarangay.profile.servicesIn', { barangay: barangay.name })}
            </h2>
            <Link
              to={withBarangayScope('/services', barangay.slug)}
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
            >
              {t('betterBarangay.profile.allLocalServices')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {(barangay.publishedServices?.length ?? 0) > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {barangay.publishedServices?.map(service => (
                <article
                  key={service.title}
                  className="bm-barangay-card p-5"
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
            <h3 className="text-lg font-extrabold text-gray-950">{t('betterBarangay.profile.commonTransactions')}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {services.map(service => (
                <Link
                  key={service.id}
                  to={withBarangayScope('/services', barangay.slug)}
                  className="bm-barangay-card p-5"
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

      <section id="local-government" className="bm-barangay-section bg-white py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">{t('betterBarangay.profile.localGovernment')}</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
            Barangay {barangay.name} government
          </h2>

          <div className="mt-7 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
              <Building2 className="h-6 w-6 text-primary-700" />
              <h3 className="mt-4 text-xl font-extrabold text-gray-950">{t('betterBarangay.profile.barangayHall')}</h3>
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
                  {t('betterBarangay.profile.noVerifiedHallContact')}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={barangay.officialPageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-btn-secondary"
                >
                  {t('betterBarangay.profile.makatiBarangayPage')} <ExternalLink className="h-4 w-4" />
                </a>
                {barangay.websiteUrl && (
                  <a
                    href={barangay.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-btn-secondary"
                  >
                    {t('betterBarangay.profile.barangayWebsite')} <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {barangay.facebookUrl && (
                  <a
                    href={barangay.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-btn-secondary"
                  >
                    {t('betterBarangay.profile.officialSocial')} <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Users className="h-6 w-6 text-primary-700" />
                  <h3 className="mt-4 text-xl font-extrabold text-gray-950">{t('betterBarangay.profile.currentCouncil')}</h3>
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  {barangay.officials?.term ?? t('betterBarangay.profile.currentTerm')}
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
                      <div className="text-sm font-extrabold text-gray-900">{t('betterBarangay.profile.kagawads')}</div>
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
                        <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">{t('betterBarangay.profile.skChair')}</div>
                        <div className="mt-1 text-sm font-bold text-gray-900">{barangay.officials.skChairperson}</div>
                      </div>
                    )}
                    {barangay.officials.secretary && (
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">{t('betterBarangay.profile.secretary')}</div>
                        <div className="mt-1 text-sm font-bold text-gray-900">{barangay.officials.secretary}</div>
                      </div>
                    )}
                    {barangay.officials.treasurer && (
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">{t('betterBarangay.profile.treasurer')}</div>
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
                          {barangay.officials.statusSourceLabel ?? t('betterBarangay.profile.statusSource')}
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
                      {barangay.officials.sourceLabel ?? t('betterBarangay.profile.rosterSource')} <ExternalLink className="inline h-3.5 w-3.5" />
                    </a>
                    {barangay.officials.secondarySource && (
                      <a
                        href={barangay.officials.secondarySource}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-primary-700 underline underline-offset-2"
                      >
                        {t('betterBarangay.profile.crossCheckSource')} <ExternalLink className="inline h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <p className="mt-5 text-sm text-gray-600">
                  {t('betterBarangay.profile.noVerifiedCouncil')}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8f2] py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">{t('betterBarangay.profile.placesFacilities')}</div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
              {t('betterBarangay.profile.inBarangay', { barangay: barangay.name })}
            </h2>
            <Link
              to={withBarangayScope('/civic-map', barangay.slug)}
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
            >
              {t('betterBarangay.profile.openMap')} <ArrowRight className="h-4 w-4" />
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
                  className="bm-barangay-card p-5"
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
                      to={withBarangayScope('/civic-map/' + place.id, barangay.slug)}
                      className="text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      {t('betterBarangay.profile.placeDetails')} <ArrowRight className="inline h-3.5 w-3.5" />
                    </Link>
                    <Link
                      to={withBarangayScope('/civic-map/' + place.id, barangay.slug) + '#community-records'}
                      className="text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      {t('betterBarangay.profile.communityCases')}
                    </Link>
                    <Link
                      to={withBarangayScope('/civic-map/' + place.id, barangay.slug) + '#contribute'}
                      className="text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      {t('betterBarangay.profile.reportOrSuggest')}
                    </Link>
                    {(civicAuditPilot.targetEntityIds as readonly string[]).includes(place.id) && (
                      <Link
                        to={
                          withBarangayScope(
                            '/civic-map/' + place.id + '?campaign=' + civicAuditPilot.id,
                            barangay.slug
                          ) + '#observe'
                        }
                        className="text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        {t('betterBarangay.profile.accessibilityCheck')}
                      </Link>
                    )}
                    {source && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-primary-700 underline underline-offset-2"
                      >
                        {t('betterBarangay.profile.source')} <ExternalLink className="inline h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}

            {facilityFallbacks.map(facility => (
              <article
                key={'facility-' + facility.name}
                className="bm-barangay-card p-5"
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
                      {t('betterBarangay.profile.source')} <ExternalLink className="inline h-3.5 w-3.5" />
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
          <div className="section-eyebrow !text-white/80">{t('betterBarangay.profile.civicInformation')}</div>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {t('betterBarangay.profile.followAffects', { barangay: barangay.name })}
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
                    {t('betterBarangay.profile.open')} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="participate" className="bg-[#fffdf8] py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="section-eyebrow">{t('betterBarangay.profile.participateLocally')}</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
            {t('betterBarangay.profile.takeAction', { barangay: barangay.name })}
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Link
              to={withBarangayScope('/civic-map/report', barangay.slug)}
              className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <Wrench className="h-6 w-6 text-primary-700" />
              <h3 className="mt-4 font-extrabold text-gray-950">{t('betterBarangay.profile.reportProblem')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {t('betterBarangay.profile.reportDescription')}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                {t('betterBarangay.profile.startReport')} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              to={withBarangayScope('/civic-map', barangay.slug) + '#places'}
              className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <MapPin className="h-6 w-6 text-primary-700" />
              <h3 className="mt-4 font-extrabold text-gray-950">{t('betterBarangay.profile.suggestImprovement')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {t('betterBarangay.profile.improvementDescription')}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                {t('betterBarangay.profile.browsePlaces')} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            {localAuditPlaces.length > 0 ? (
              <Link
                to={civicAuditPilot.route}
                className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                <ClipboardCheck className="h-6 w-6 text-primary-700" />
                <h3 className="mt-4 font-extrabold text-gray-950">{t('betterBarangay.profile.recordAccessibility')}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {t('betterBarangay.profile.auditParks', { count: localAuditPlaces.length, barangay: barangay.name })}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  {t('betterBarangay.profile.joinAudit')} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ) : (
              <Link
                to={'/get-involved?type=source&barangay=' + encodeURIComponent(barangay.slug) + '#submission'}
                className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
              >
                <FileCheck2 className="h-6 w-6 text-primary-700" />
                <h3 className="mt-4 font-extrabold text-gray-950">{t('betterBarangay.profile.correctLocalInfo')}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {t('betterBarangay.profile.correctInfoDescription', { barangay: barangay.name })}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  {t('betterBarangay.profile.contributeInfo')} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            )}

            <a
              href="#local-government"
              className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <Building2 className="h-6 w-6 text-primary-700" />
              <h3 className="mt-4 font-extrabold text-gray-950">{t('betterBarangay.profile.contactGovernment')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {t('betterBarangay.profile.contactsDescription')}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                {t('betterBarangay.profile.barangayContacts')} <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </section>


      <section className="bg-white py-14">
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-2">
            <div>
              <div className="section-eyebrow">{t('betterBarangay.profile.elections')}</div>
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
                        <div className="text-xl font-extrabold text-gray-950">{electionResult.nancyVotes?.toLocaleString(numberLocale)}</div>
                        <div className="mt-1 text-xs text-gray-600">Nancy Binay</div>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="text-xl font-extrabold text-gray-950">{electionResult.camposVotes?.toLocaleString(numberLocale)}</div>
                        <div className="mt-1 text-xs text-gray-600">Luis Campos Jr.</div>
                      </div>
                    </div>
                  )}
                  {!electionResult.exactVotesVerified && (
                    <p className="mt-3 text-xs leading-relaxed text-gray-500">
                      {t('betterBarangay.profile.electionVoteCaveat')}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/elections#barangay-results-2025" className="brand-btn-secondary">
                      {t('betterBarangay.profile.allBarangayResults')}
                    </Link>
                    <a
                      href={barangayResultSource2025.url}
                      target="_blank"
                      rel="noreferrer"
                      className="brand-btn-secondary"
                    >
                      {t('betterBarangay.profile.resultSource')} <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="section-eyebrow">{t('betterBarangay.profile.accountability')}</div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950">
                {t('betterBarangay.profile.localRecords')}
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
                          {t('betterBarangay.profile.openRecord')}
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
                    {t('betterBarangay.profile.noLocalAccountability', { barangay: barangay.name })}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={withBarangayScope('/accountability', barangay.slug)}
                      className="brand-btn-secondary"
                    >
                      {t('betterBarangay.profile.openAccountability')}
                    </Link>
                    <Link
                      to={'/get-involved?type=source&barangay=' + encodeURIComponent(barangay.slug) + '#submission'}
                      className="brand-btn-secondary"
                    >
                      {t('betterBarangay.profile.shareLocalRecord')}
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
            <div className="section-eyebrow">{t('betterBarangay.profile.heritage')}</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
              {t('betterBarangay.profile.heritageRecords')}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {barangay.heritageMarkers?.map(marker => (
                <article
                  key={marker.name + marker.agency}
                  className="bm-barangay-card p-5"
                >
                  <Landmark className="h-5 w-5 text-primary-700" />
                  <div className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {marker.agency}
                  </div>
                  <h3 className="mt-1 font-extrabold text-gray-950">
                    {marker.placeId ? (
                      <Link
                        to={withBarangayScope('/civic-map/' + marker.placeId, barangay.slug)}
                        className="hover:text-primary-700"
                      >
                        {marker.name}
                      </Link>
                    ) : (
                      <a
                        href={marker.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary-700"
                      >
                        {marker.name}
                      </a>
                    )}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{marker.status}</p>
                  {marker.location && <p className="mt-2 text-xs text-gray-500">{marker.location}</p>}
                  <div className="mt-4 flex flex-wrap gap-3 text-xs">
                    {marker.placeId && (
                      <Link
                        to={withBarangayScope('/civic-map/' + marker.placeId, barangay.slug)}
                        className="font-bold text-primary-700"
                      >
                        {t('betterBarangay.profile.placeDetails')}
                      </Link>
                    )}
                    <a
                      href={marker.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-gray-600 underline underline-offset-2"
                    >
                      {marker.agency} {t('betterBarangay.profile.record')} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {communityLinks.length > 0 && (
        <section className="bg-white py-14">
          <div className="container px-5 md:px-6 lg:px-8">
            <div className="section-eyebrow">{t('betterBarangay.profile.aroundBarangay')}</div>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
                {t('betterBarangay.profile.placesAreasOrganizations')}
              </h2>
              <Link
                to={'/history?query=' + encodeURIComponent(barangay.name)}
                className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
              >
                {t('betterBarangay.profile.searchHistory')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {communityLinks.map(item =>
                item.href.startsWith('/') ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 hover:border-primary-300"
                  >
                    <Landmark className="h-5 w-5 text-primary-700" />
                    <h3 className="mt-3 font-extrabold text-gray-950">
                      {item.label}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 hover:border-primary-300"
                  >
                    <Landmark className="h-5 w-5 text-primary-700" />
                    <h3 className="mt-3 font-extrabold text-gray-950">
                      {item.label}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </a>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
