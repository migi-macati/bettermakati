import { Link, useParams } from 'react-router';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  MapPin,
  Route,
  ShieldCheck,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import LastReviewed from '../components/ui/LastReviewed';
import CivicMapEmbed from '../components/civic/CivicMapEmbed';
import CivicContributionForm from '../components/civic/CivicContributionForm';
import CivicDiscussion from '../components/civic/CivicDiscussion';
import {
  civicAssets,
  civicAssetTypeLabels,
  civicMethodologyReviewed,
  criteriaForAsset,
} from '../data/civicMap';

export default function CivicAsset() {
  const { assetId } = useParams();
  const asset = civicAssets.find(item => item.id === assetId);

  if (!asset) {
    return (
      <Section className="bg-[#fffdf8]">
        <Link to="/civic-map" className="inline-flex items-center gap-1 text-sm font-bold text-primary-700">
          <ArrowLeft className="h-4 w-4" /> Back to Civic Map
        </Link>
        <Heading className="mt-5">Civic asset not found</Heading>
        <p className="mt-2 text-gray-600">
          This asset may not be mapped in the Civic Map pilot yet.
        </p>
      </Section>
    );
  }

  const criteria = criteriaForAsset(asset.type);

  return (
    <>
      <SEO
        title={asset.title + ' | Civic Map'}
        description={'Community ratings, issue reports and improvement proposals for ' + asset.title + ' in BetterMakati Civic Map.'}
      />

      <Section className="bg-[#fffdf8]">
        <Breadcrumbs
          className="mb-7"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Civic Map', href: '/civic-map' },
            { label: asset.title, href: '/civic-map/' + asset.id },
          ]}
        />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                {civicAssetTypeLabels[asset.type]}
              </span>
              <span className={asset.status === 'mapped' ? 'text-success-700' : 'text-secondary-800'}>
                {asset.status === 'mapped'
                  ? 'Mapped'
                  : asset.status === 'pilot'
                    ? 'Pilot segment'
                    : 'Needs verification'}
              </span>
            </div>
            <Heading className="mt-3">{asset.title}</Heading>
            <p className="mt-2 text-lg leading-relaxed text-gray-700">{asset.subtitle}</p>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
              {asset.barangay && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary-700" /> {asset.barangay}
                </span>
              )}
              {asset.authority && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-primary-700" /> {asset.authority}
                </span>
              )}
              {asset.from && asset.to && (
                <span className="inline-flex items-center gap-1.5">
                  <Route className="h-4 w-4 text-primary-700" /> {asset.from} ↔ {asset.to}
                </span>
              )}
            </div>
          </div>

          <Link to="/civic-map" className="brand-btn-secondary shrink-0">
            <ArrowLeft className="h-4 w-4" /> Civic Map
          </Link>
        </div>

        <LastReviewed
          date={civicMethodologyReviewed}
          note="Civic Map pilot asset. Responsibility/jurisdiction should be treated as provisional where marked for verification."
          className="mt-5"
        />

        <div className="mt-6 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm leading-relaxed text-gray-700">
          <strong>Independent community record.</strong> Ratings, reports and proposals on this page are BetterMakati community information, not official government determinations. A referral, acknowledgement or resolution is only shown when separately documented.
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <CivicMapEmbed lat={asset.lat} lng={asset.lng} title={asset.title} />

          <div>
            <div className="section-eyebrow">Assessment framework</div>
            <Heading level={2}>What people can rate here</Heading>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              The Civic Map uses a common public-realm core plus criteria tailored to this type of infrastructure or service.
            </p>

            <div className="mt-5 space-y-3">
              {criteria.map(item => (
                <div key={item.id} className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                  <div className="font-extrabold text-gray-950">{item.label}</div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-primary-100 bg-primary-50 p-4 text-xs leading-relaxed text-gray-700">
              Headline scores will only be shown after enough independent responses are available. Sample size and recency will always accompany public ratings.
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="section-eyebrow">Community contribution</div>
            <Heading level={2}>Add an observation or idea</Heading>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              BetterMakati checks for nearby duplicates before creating a separate issue case. Use confirmations and updates whenever an existing case describes the same problem.
            </p>

            <div className="mt-5 rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-error-900">
              <div className="flex gap-2">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <strong>Emergency?</strong> Fire, active crime, medical emergencies, serious collisions and immediate life-safety hazards should go to Unified 911, not the Civic Map queue.
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-600">
              <ShieldCheck className="mb-2 h-5 w-5 text-primary-700" />
              Reports start as <strong>unverified community submissions</strong>. Confirmation, BetterMakati review, official acknowledgement and community-verified resolution are separate evidence states.
            </div>
          </div>

          <CivicContributionForm asset={asset} />
        </div>
      </Section>

      <Section className="bg-white">
        <CivicDiscussion assetId={asset.id} />
      </Section>
    </>
  );
}
