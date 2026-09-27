import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Building2,
  ClipboardCheck,
  ExternalLink,
  Landmark,
  MapPin,
  Route,
  Trees,
  Wrench,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import CivicMapEmbed from '../components/civic/CivicMapEmbed';
import CivicContributionForm from '../components/civic/CivicContributionForm';
import CivicObservationForm from '../components/civic/CivicObservationForm';
import CivicObservationSummary from '../components/civic/CivicObservationSummary';
import CivicDiscussion from '../components/civic/CivicDiscussion';
import { useBarangayScope, withBarangayScope } from '../hooks/useBarangayScope';
import {
  civicAssets,
  civicAssetTypeLabels,
} from '../data/civicMap';
import {
  civicEntityKindLabels,
  placeRegistryById,
} from '../data/placeRegistry';
import { civicAuditPilot } from '../data/civicAuditPilot';
import {
  accountabilityEntries,
  accountabilityStatusLabel,
} from '../data/accountability';
import { makatiHistory } from '../data/makatiHistory';

const verificationLabel = {
  verified: 'Verified',
  provisional: 'Source review pending',
  'needs-verification': 'Needs verification',
} as const;

const accessLabel = {
  'government-public': 'Public',
  'public-access-private-managed': 'Public access · privately managed',
  'private-community-controlled': 'Private / community-controlled',
  'service-users-only': 'Service users only',
  restricted: 'Restricted access',
  unknown: 'Access not yet classified',
} as const;

const mediaReuseLabel = {
  'reusable-with-attribution': 'Reusable with attribution',
  'public-domain': 'Public domain',
  'link-only': 'Link only',
  'permission-required': 'Permission required',
  unknown: 'Reuse status unknown',
} as const;

export default function CivicAsset() {
  const { assetId } = useParams();
  const [searchParams] = useSearchParams();
  const [revision, setRevision] = useState(0);
  const [observationRevision, setObservationRevision] = useState(0);
  const { barangaySlug, isExplicitScope } = useBarangayScope();
  const mapHref = withBarangayScope(
    '/civic-map',
    isExplicitScope ? barangaySlug : undefined
  );
  const asset = civicAssets.find(item => item.id === assetId);
  const place = asset ? placeRegistryById.get(asset.id) : undefined;

  if (!asset || !place) {
    return (
      <Section className="bg-[#fffdf8]">
        <Link to={mapHref} className="inline-flex items-center gap-1 text-sm font-bold text-primary-700">
          <ArrowLeft className="h-4 w-4" /> Back to Civic Map
        </Link>
        <Heading className="mt-5">Civic record not found</Heading>
        <p className="mt-2 text-gray-600">
          This record is not in the current BetterMakati civic registry.
        </p>
      </Section>
    );
  }

  const entityKind = place.entityKind;
  const entityLabel = civicEntityKindLabels[entityKind];
  const informationLabel =
    entityKind === 'place'
      ? 'Place information'
      : entityKind === 'segment'
        ? 'Segment information'
        : 'Route information';
  const locationHeading =
    entityKind === 'place'
      ? 'Location & sources'
      : entityKind === 'segment'
        ? 'Boundary & sources'
        : 'Route & sources';

  const isParkAccessibilityPilot =
    searchParams.get('campaign') === civicAuditPilot.id &&
    (civicAuditPilot.targetEntityIds as readonly string[]).includes(place.id);

  const placeSources = place.provenance.sources;
  const primarySources = placeSources.filter(source => source.kind !== 'reference-map');
  const mapSources = placeSources.filter(source => source.kind === 'reference-map');
  const heritageDesignations = place.heritage?.designations ?? [];
  const heritageFacts = place.heritage?.facts ?? [];
  const heritageSourceIds = new Set([
    ...heritageDesignations.flatMap(designation => designation.sourceIds),
    ...heritageFacts.flatMap(fact => fact.sourceIds),
  ]);
  const heritageSources = placeSources.filter(source =>
    heritageSourceIds.has(source.id)
  );
  const generalPrimarySources = primarySources.filter(
    source => !heritageSourceIds.has(source.id)
  );
  const relatedAccountability = place.relationships
    .filter(relationship => relationship.targetType === 'accountability-record')
    .flatMap(relationship => {
      const entry = accountabilityEntries.find(
        item => item.id === relationship.targetId
      );
      return entry ? [{ relationship, entry }] : [];
    });
  const relatedHistoryEvents = makatiHistory.filter(event =>
    event.relations?.placeIds?.includes(place.id)
  );
  const primaryMedia = place.media?.[0];

  return (
    <>
      <SEO
        title={place.name + ' | Civic Map'}
        description={entityLabel + ' information, community cases and improvement actions for ' + place.name + ' in BetterMakati.'}
      />

      <Section className="bg-[#fffdf8]">
        <Breadcrumbs
          className="mb-7"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Civic Map', href: mapHref },
            { label: place.name, href: '/civic-map/' + place.id },
          ]}
        />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                {civicAssetTypeLabels[place.primaryCategory]}
              </span>
              <span
                className={
                  place.verification.status === 'verified'
                    ? 'text-success-700'
                    : 'text-secondary-800'
                }
              >
                {verificationLabel[place.verification.status]}
              </span>
              {entityKind === 'place' && (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
                  {accessLabel[place.access.class]}
                </span>
              )}
            </div>

            <Heading className="mt-3">{place.name}</Heading>
            {place.summary && (
              <p className="mt-2 text-lg leading-relaxed text-gray-700">{place.summary}</p>
            )}

            {(place.aliases?.length ?? 0) > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                Also listed as: {place.aliases?.map(alias => alias.name).join(' · ')}
              </p>
            )}

            {entityKind === 'place' && (place.servicesAtLocation?.length ?? 0) > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {place.servicesAtLocation?.map(service => (
                  <span
                    key={service.serviceId ?? service.label}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary-800"
                  >
                    {service.label}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
              {place.location.barangays.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary-700" />
                  {place.location.barangays.join(' · ')}
                </span>
              )}
              {place.management.responsibilityText && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-primary-700" />
                  {place.management.responsibilityText}
                </span>
              )}
              {place.location.geometry?.from && place.location.geometry?.to && (
                <span className="inline-flex items-center gap-1.5">
                  <Route className="h-4 w-4 text-primary-700" />
                  {place.location.geometry.from} ↔ {place.location.geometry.to}
                </span>
              )}
            </div>
          </div>

          <Link to={mapHref} className="brand-btn-secondary shrink-0">
            <ArrowLeft className="h-4 w-4" /> Civic Map
          </Link>
        </div>

        <nav aria-label={'On this ' + entityKind + ' page'} className="mt-6 flex flex-wrap gap-3">
          <a href="#place-information" className="brand-btn-secondary">{informationLabel}</a>
          {(heritageDesignations.length > 0 || heritageFacts.length > 0) && (
            <a href="#heritage-record" className="brand-btn-secondary">Heritage record</a>
          )}
          <a href="#observe" className="brand-btn-secondary">Observe conditions</a>
          <a href="#community-records" className="brand-btn-secondary">Community cases</a>
          <a href="#contribute" className="brand-btn-primary">Report or suggest</a>
        </nav>
      </Section>

      <Section className="bg-[#f5f8f2]" id="place-information">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          {entityKind === 'place' ? (
            <div className="space-y-4">
              {primaryMedia && (
                <figure className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <img
                    src={primaryMedia.src}
                    alt={primaryMedia.alt}
                    width={1400}
                    height={933}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="aspect-[16/9] w-full object-cover"
                    style={{ objectPosition: primaryMedia.objectPosition ?? '50% 50%' }}
                  />
                  <figcaption className="space-y-2 px-4 py-3">
                    <div>
                      <div className="font-extrabold text-gray-950">
                        {primaryMedia.title}
                      </div>
                      {primaryMedia.caption && (
                        <p className="mt-1 text-sm leading-relaxed text-gray-600">
                          {primaryMedia.caption}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                      {primaryMedia.date && <span>{primaryMedia.date}</span>}
                      <a
                        href={primaryMedia.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-primary-700 underline underline-offset-2"
                      >
                        {primaryMedia.credit}
                      </a>
                      <a
                        href={primaryMedia.licenseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        {primaryMedia.license}
                      </a>
                      <span>{mediaReuseLabel[primaryMedia.reuseStatus]}</span>
                    </div>
                  </figcaption>
                </figure>
              )}

              <CivicMapEmbed
                lat={place.location.point?.lat ?? asset.lat}
                lng={place.location.point?.lng ?? asset.lng}
                title={place.name}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-primary-100 bg-white p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                <Route className="h-4 w-4" />
                {entityKind === 'segment' ? 'Bounded infrastructure segment' : 'Transport network / service route'}
              </div>
              <div className="mt-4 text-xl font-extrabold text-gray-950">{place.name}</div>
              {entityKind === 'segment' && place.location.geometry?.street && (
                <div className="mt-3 text-sm text-gray-700">{place.location.geometry.street}</div>
              )}
              {entityKind === 'segment' && place.location.geometry?.from && place.location.geometry?.to && (
                <div className="mt-2 rounded-xl bg-[#fffdf8] p-4 text-sm font-bold text-gray-800">
                  {place.location.geometry.from} ↔ {place.location.geometry.to}
                </div>
              )}
              {place.location.point && (
                <div className="mt-4 text-xs text-gray-500">
                  Representative map point: {place.location.point.lat.toFixed(5)}, {place.location.point.lng.toFixed(5)}
                </div>
              )}
            </div>
          )}

          <div>
            <div className="section-eyebrow">{informationLabel}</div>
            <Heading level={2}>{locationHeading}</Heading>

            <dl className="mt-5 space-y-4 text-sm">
              {entityKind === 'place' && place.location.address && (
                <div>
                  <dt className="font-bold text-gray-950">Address</dt>
                  <dd className="mt-1 leading-relaxed text-gray-600">{place.location.address}</dd>
                </div>
              )}
              {entityKind === 'segment' && place.location.geometry?.street && (
                <div>
                  <dt className="font-bold text-gray-950">Street / corridor</dt>
                  <dd className="mt-1 leading-relaxed text-gray-600">{place.location.geometry.street}</dd>
                </div>
              )}
              {entityKind === 'segment' && place.location.geometry?.from && place.location.geometry?.to && (
                <div>
                  <dt className="font-bold text-gray-950">Segment boundary</dt>
                  <dd className="mt-1 leading-relaxed text-gray-600">
                    {place.location.geometry.from} ↔ {place.location.geometry.to}
                  </dd>
                </div>
              )}
              {entityKind === 'route' && (
                <div>
                  <dt className="font-bold text-gray-950">Record form</dt>
                  <dd className="mt-1 text-gray-600">Transport network / service route</dd>
                </div>
              )}
              {place.location.barangays.length > 0 && (
                <div>
                  <dt className="font-bold text-gray-950">Barangay</dt>
                  <dd className="mt-1 text-gray-600">{place.location.barangays.join(' · ')}</dd>
                </div>
              )}
              {place.management.responsibilityText && (
                <div>
                  <dt className="font-bold text-gray-950">Responsible / managing body</dt>
                  <dd className="mt-1 leading-relaxed text-gray-600">
                    {place.management.responsibilityText}
                  </dd>
                </div>
              )}
              {entityKind === 'place' && (
                <div>
                  <dt className="font-bold text-gray-950">Access</dt>
                  <dd className="mt-1 text-gray-600">{accessLabel[place.access.class]}</dd>
                </div>
              )}
            </dl>

            {(heritageDesignations.length > 0 || heritageFacts.length > 0) && (
              <div
                id="heritage-record"
                className="mt-6 scroll-mt-24 rounded-2xl border border-secondary-200 bg-[#fff8e6] p-5"
              >
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-secondary-800" />
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-secondary-800">
                    Heritage record
                  </div>
                </div>

                {heritageDesignations.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-extrabold text-gray-950">
                      Official designations
                    </div>
                    <div className="mt-3 grid gap-3">
                      {heritageDesignations.map((designation, index) => (
                        <div
                          key={
                            designation.authority +
                            designation.classification +
                            index
                          }
                          className="rounded-xl border border-secondary-200 bg-white p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-secondary-50 px-2.5 py-1 text-xs font-bold text-secondary-900">
                              {designation.classification}
                            </span>
                            {designation.dateOrYear && (
                              <span className="text-xs font-semibold text-gray-500">
                                {designation.dateOrYear}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-sm font-bold text-gray-900">
                            {designation.authority}
                          </div>
                          {designation.officialName &&
                            designation.officialName !== place.name && (
                              <div className="mt-1 text-sm leading-relaxed text-gray-600">
                                Official name: {designation.officialName}
                              </div>
                            )}
                          {designation.note && (
                            <p className="mt-2 text-xs leading-relaxed text-gray-500">
                              {designation.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {heritageFacts.length > 0 && (
                  <div className="mt-5">
                    <div className="text-sm font-extrabold text-gray-950">
                      Key historical phases
                    </div>
                    <dl className="mt-3 space-y-3">
                      {heritageFacts.map((fact, index) => (
                        <div
                          key={fact.label + index}
                          className="border-l-2 border-secondary-300 pl-4"
                        >
                          <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            {fact.dateOrPeriod && (
                              <span className="text-xs font-bold text-secondary-900">
                                {fact.dateOrPeriod}
                              </span>
                            )}
                            <span className="text-sm font-extrabold text-gray-950">
                              {fact.label}
                            </span>
                          </dt>
                          <dd className="mt-1 text-sm leading-relaxed text-gray-700">
                            {fact.value}
                          </dd>
                          {fact.note && (
                            <dd className="mt-1 text-xs leading-relaxed text-gray-500">
                              {fact.note}
                            </dd>
                          )}
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {heritageSources.length > 0 && (
                  <div className="mt-5 border-t border-secondary-200 pt-4">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-secondary-800">
                      Heritage sources
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                      {heritageSources.map(source => (
                        <a
                          key={source.id}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 underline underline-offset-2"
                        >
                          {source.label}{' '}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {(generalPrimarySources.length > 0 || mapSources.length > 0) && (
              <div className="mt-6 border-t border-gray-200 pt-5">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  Sources
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {generalPrimarySources.map(source => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      {source.label} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                  {mapSources.map(source => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-gray-600 underline underline-offset-2"
                    >
                      {source.label} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {relatedHistoryEvents.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-5">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  Related history
                </div>
                <div className="mt-3 space-y-3">
                  {relatedHistoryEvents.map(event => (
                    <Link
                      key={event.id}
                      to={'/history#' + event.id}
                      className="block rounded-xl border border-primary-100 bg-white p-4 hover:border-primary-300"
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                        <div>
                          <div className="text-xs font-bold text-primary-700">
                            {event.date}
                          </div>
                          <div className="mt-1 font-extrabold text-gray-950">
                            {event.title}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedAccountability.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-5">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  Related public records
                </div>
                <div className="mt-3 space-y-3">
                  {relatedAccountability.map(({ relationship, entry }) => (
                    <Link
                      key={entry.id}
                      to={'/accountability#' + entry.id}
                      className="block rounded-xl border border-primary-100 bg-white p-4 hover:border-primary-300"
                    >
                      <div className="font-extrabold text-gray-950">
                        {entry.title}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-gray-500">
                        {entry.period} · {accountabilityStatusLabel[entry.status]}
                      </div>
                      {relationship.note && (
                        <p className="mt-2 text-xs leading-relaxed text-gray-600">
                          {relationship.note}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section className="bg-white" id="observe">
        <div className="section-eyebrow">Observed conditions</div>
        <Heading level={2}>
          {entityKind === 'place'
            ? 'Condition snapshots'
            : entityKind === 'segment'
              ? 'Segment condition snapshots'
              : 'Route trip snapshots'}
        </Heading>

        <div className="mt-6">
          <CivicObservationSummary
            entity={place}
            refreshKey={observationRevision}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <div className="flex gap-3 rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
              <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
              <p className="text-sm leading-relaxed text-gray-600">
                Choose only what you checked. Skip the rest.
              </p>
            </div>
            <a
              href="#contribute"
              className="mt-4 inline-flex text-sm font-bold text-primary-700 underline underline-offset-2"
            >
              Report a problem instead
            </a>
          </div>

          <div>
            {isParkAccessibilityPilot && (
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                Civic audit pilot · Park accessibility
              </div>
            )}
            <CivicObservationForm
              entity={place}
              questionIds={
                isParkAccessibilityPilot ? civicAuditPilot.questionIds : undefined
              }
              onSubmitted={() => setObservationRevision(value => value + 1)}
            />
          </div>
        </div>
      </Section>

      <Section className="bg-white" id="community-records">
        <CivicDiscussion key={asset.id + revision} assetId={asset.id} />
      </Section>

      <Section className="bg-[#fffdf8]" id="contribute">
        <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <div className="section-eyebrow">Take action</div>
            <Heading level={2}>Report or suggest something here</Heading>
            <div className="mt-5 space-y-3">
              <div className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4">
                <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="font-extrabold text-gray-950">Report a problem</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Broken, blocked, unsafe or not working.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4">
                <Trees className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <div>
                  <div className="font-extrabold text-gray-950">Suggest an improvement</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Propose a specific physical or service change.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-error-900">
              <div className="flex gap-2">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <strong>Emergency?</strong> Call <a href="tel:911" className="font-bold underline">911</a>.
                </div>
              </div>
            </div>
          </div>

          <CivicContributionForm
            key={asset.id}
            asset={asset}
            allowedKinds={['report', 'proposal', 'update']}
            onSubmitted={() => setRevision(value => value + 1)}
          />
        </div>
      </Section>
    </>
  );
}
