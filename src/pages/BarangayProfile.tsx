import { ArrowLeft, ExternalLink, Home, MapPin, Users } from 'lucide-react';
import { Link, useParams } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import {
  barangayMapsUrl,
  findBarangay,
  psaBarangaySource,
} from '../data/barangays';

export default function BarangayProfile() {
  const { slug } = useParams();
  const barangay = findBarangay(slug);

  if (!barangay) {
    return (
      <Section className="bg-[#fffdf8]">
        <Heading>Barangay not found</Heading>
        <Link to="/barangays" className="brand-btn-secondary mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to barangays
        </Link>
      </Section>
    );
  }

  return (
    <>
      <SEO
        title={'Barangay ' + barangay.name}
        description={'Profile of Barangay ' + barangay.name + ', Makati City: population, district, community links and public records.'}
      />

      <Section className="bg-[#fffdf8]">
        <Link
          to="/barangays"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" /> Barangays
        </Link>

        <div className="mt-6 section-eyebrow">Barangay profile</div>
        <Heading>{barangay.name}</Heading>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href={psaBarangaySource}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-primary-100 bg-white p-5"
          >
            <Users className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-2xl font-extrabold text-gray-950">
              {barangay.population2024.toLocaleString('en-PH')}
            </div>
            <div className="text-sm text-gray-600">2024 population · PSA POPCEN</div>
          </a>

          <div className="rounded-2xl border border-primary-100 bg-white p-5">
            <Home className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-xl font-extrabold text-gray-950">
              {barangay.legislativeDistrict}
            </div>
            <div className="text-sm text-gray-600">Makati legislative district</div>
          </div>

          <a
            href={barangayMapsUrl(barangay.name)}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-primary-100 bg-white p-5"
          >
            <MapPin className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-xl font-extrabold text-gray-950">
              Open map
            </div>
            <div className="text-sm text-gray-600">Locate the barangay in Makati</div>
          </a>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Government & records</div>
        <Heading level={2}>Barangay information</Heading>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <h3 className="font-extrabold text-lg text-gray-950">
              Barangay officials
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              For the current Punong Barangay, Sangguniang Barangay and SK
              roster, use the official Makati and COMELEC records linked from
              this profile. BetterMakati publishes names only when they can be
              matched to an authoritative public record.
            </p>
            <a
              href="https://www.makati.gov.ph/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
            >
              Official Makati portal <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <h3 className="font-extrabold text-lg text-gray-950">
              Public data
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              The comparable population figure shown here comes from the 2024
              POPCEN. Barangay-level budgets, projects, facilities and service
              records are linked only when a specific public record is
              available.
            </p>
            <a
              href={psaBarangaySource}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
            >
              PSA barangay source <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </Section>

      {barangay.associations && barangay.associations.length > 0 && (
        <Section className="bg-white">
          <div className="section-eyebrow">Community</div>
          <Heading level={2}>Village & homeowners associations</Heading>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {barangay.associations.map(association => (
              <a
                key={association.name}
                href={association.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
              >
                <h3 className="font-extrabold text-gray-950">{association.name}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  {association.linkLabel} <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
