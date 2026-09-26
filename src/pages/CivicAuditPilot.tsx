import { ArrowLeft, ArrowRight, CalendarDays, ClipboardCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import {
  civicAuditPilot,
  civicAuditPilotQuestionLabels,
} from '../data/civicAuditPilot';
import {
  civicAssetTypeLabels,
} from '../data/civicMap';
import { placeRegistryById, type PlaceRegistryRecord } from '../data/placeRegistry';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Manila',
  }).format(new Date(value));

export default function CivicAuditPilot() {
  const targets = civicAuditPilot.targetEntityIds
    .map(id => placeRegistryById.get(id))
    .filter((item): item is PlaceRegistryRecord => Boolean(item))
    .sort((a, b) => {
      const barangayA = a.location.barangays[0] ?? '';
      const barangayB = b.location.barangays[0] ?? '';
      return barangayA.localeCompare(barangayB) || a.name.localeCompare(b.name);
    });

  return (
    <>
      <SEO
        title="Public Park Accessibility Check | Civic Map"
        description="Record structured accessibility observations for 13 verified government/public parks in Makati."
        keywords="Makati parks accessibility, public park audit, step-free access, park seating, public toilets"
      />

      <Section className="bg-[#fffdf8]">
        <Breadcrumbs
          className="mb-7"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Civic Map', href: '/civic-map' },
            { label: 'Park accessibility check', href: civicAuditPilot.route },
          ]}
        />

        <Link
          to="/civic-map"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" /> Civic Map
        </Link>

        <div className="section-eyebrow mt-6">Civic audit pilot</div>
        <Heading>{civicAuditPilot.title}</Heading>
        <p className="mt-3 max-w-4xl text-lg leading-relaxed text-gray-700">
          Visit a listed park and record what you directly observe about entrance access,
          step-free access, seating and toilets.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">{targets.length}</div>
            <div className="mt-1 text-xs font-bold text-gray-600">public parks in the pilot</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">
              {civicAuditPilot.minimumObservationsPerEntity}
            </div>
            <div className="mt-1 text-xs font-bold text-gray-600">observations sought per park</div>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-4">
            <div className="text-2xl font-extrabold text-gray-950">
              {targets.length * civicAuditPilot.minimumObservationsPerEntity}
            </div>
            <div className="mt-1 text-xs font-bold text-gray-600">minimum observation goal</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary-700" />
            {formatDate(civicAuditPilot.startsAt)} to {formatDate(civicAuditPilot.endsAt)}
          </span>
          <span>Anonymous participation is allowed.</span>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">What to check</div>
        <Heading level={2}>Four observable conditions</Heading>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {civicAuditPilot.questionIds.map(questionId => (
            <div
              key={questionId}
              className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-4"
            >
              <ClipboardCheck className="h-5 w-5 text-primary-700" />
              <div className="mt-3 font-extrabold text-gray-950">
                {civicAuditPilotQuestionLabels[questionId]}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                Record only what you actually checked. Use “not observed” when applicable.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-eyebrow">Target parks</div>
            <Heading level={2}>Choose a park to observe</Heading>
          </div>
          <div className="text-sm text-gray-500">{targets.length} parks</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {targets.map(place => (
            <article
              key={place.id}
              className="rounded-2xl border border-primary-100 bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-800">
                  {civicAssetTypeLabels[place.primaryCategory]}
                </span>
                <span className="text-success-700">Verified</span>
              </div>

              <h3 className="mt-3 text-lg font-extrabold text-gray-950">{place.name}</h3>

              {place.location.barangays.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-primary-700" />
                  {place.location.barangays.join(' · ')}
                </div>
              )}

              <Link
                to={
                  '/civic-map/' +
                  place.id +
                  '?campaign=' +
                  civicAuditPilot.id +
                  '#observe'
                }
                className="brand-btn-primary mt-5 w-full justify-center"
              >
                Record conditions <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
