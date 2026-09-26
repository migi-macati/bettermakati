import { useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  ExternalLink,
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
import CivicDiscussion from '../components/civic/CivicDiscussion';
import { useBarangayScope, withBarangayScope } from '../hooks/useBarangayScope';
import {
  civicAssets,
  civicAssetTypeLabels,
} from '../data/civicMap';
import { placeRegistryById } from '../data/placeRegistry';

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

export default function CivicAsset() {
  const { assetId } = useParams();
  const [revision, setRevision] = useState(0);
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
        <Heading className="mt-5">Place not found</Heading>
        <p className="mt-2 text-gray-600">
          This place is not in the current BetterMakati place inventory.
        </p>
      </Section>
    );
  }

  const placeSources = place.provenance.sources;
  const primarySources = placeSources.filter(source => source.kind !== 'reference-map');
  const mapSources = placeSources.filter(source => source.kind === 'reference-map');

  return (
    <>
      <SEO
        title={place.name + ' | Civic Map'}
        description={'Place information, community cases and improvement actions for ' + place.name + ' in BetterMakati.'}
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
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
                {accessLabel[place.access.class]}
              </span>
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

            {(place.servicesAtLocation?.length ?? 0) > 0 && (
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

        <nav aria-label="On this place page" className="mt-6 flex flex-wrap gap-3">
          <a href="#place-information" className="brand-btn-secondary">Place information</a>
          <a href="#community-records" className="brand-btn-secondary">Community cases</a>
          <a href="#contribute" className="brand-btn-primary">Report or suggest</a>
        </nav>
      </Section>

      <Section className="bg-[#f5f8f2]" id="place-information">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <CivicMapEmbed
            lat={place.location.point?.lat ?? asset.lat}
            lng={place.location.point?.lng ?? asset.lng}
            title={place.name}
          />

          <div>
            <div className="section-eyebrow">Place information</div>
            <Heading level={2}>Location & sources</Heading>

            <dl className="mt-5 space-y-4 text-sm">
              {place.location.address && (
                <div>
                  <dt className="font-bold text-gray-950">Address</dt>
                  <dd className="mt-1 leading-relaxed text-gray-600">{place.location.address}</dd>
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
              <div>
                <dt className="font-bold text-gray-950">Access</dt>
                <dd className="mt-1 text-gray-600">{accessLabel[place.access.class]}</dd>
              </div>
            </dl>

            {(primarySources.length > 0 || mapSources.length > 0) && (
              <div className="mt-6 border-t border-gray-200 pt-5">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  Sources
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {primarySources.map(source => (
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
