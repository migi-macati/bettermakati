import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Home,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import SectionNav from '../components/ui/SectionNav';
import {
  barangays,
  barangayMapsUrl,
  findBarangay,
  commonBarangayServiceIds,
  makatiBarangayDirectory,
  psaBarangaySource,
} from '../data/barangays';
import {
  congressionalOfficials,
  councilOfficials,
} from '../data/electedOfficials';
import { serviceDirectory } from '../data/serviceDirectory';

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

  const cityPopulation = barangays.reduce(
    (sum, item) => sum + item.population2024,
    0
  );
  const populationShare = (barangay.population2024 / cityPopulation) * 100;
  const districtNumber = barangay.legislativeDistrict.startsWith('1st')
    ? '1st'
    : '2nd';
  const representative = congressionalOfficials.find(official =>
    official.district?.startsWith(districtNumber)
  );
  const districtCouncilors = councilOfficials.filter(
    official => official.district === barangay.legislativeDistrict
  );
  const barangayServices = serviceDirectory.filter(service => commonBarangayServiceIds.includes(service.id));

  return (
    <>
      <SEO
        title={'Barangay ' + barangay.name}
        description={
          'Profile of Barangay ' +
          barangay.name +
          ', Makati City: population, district representation, community links and public records.'
        }
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AdministrativeArea',
          name: 'Barangay ' + barangay.name,
          containedInPlace: {
            '@type': 'City',
            name: 'Makati City',
          },
        }}
      />

      <Section id="overview" className="bg-[#fffdf8]">
        <Link
          to="/barangays"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" /> Barangays
        </Link>

        <div className="mt-6 section-eyebrow">Barangay profile</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>{barangay.name}</Heading>
            <p className="max-w-2xl text-gray-600">
              Population, city representation, map and available community
              resources for Barangay {barangay.name}.
            </p>
          </div>
          <SharePage title={'Barangay ' + barangay.name + ' | BetterMakati'} />
        </div>
        <LastReviewed note="Population uses PSA 2024 POPCEN; time-sensitive contacts should be checked with official sources." />

        <SectionNav
          items={[
            { label: 'Overview', href: '#overview' },
            { label: 'Representation', href: '#representation' },
            { label: 'Services', href: '#services' },
            { label: 'Community', href: '#community' },
            { label: 'More information', href: '#more' },
          ]}
        />

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={'/today?barangay=' + barangay.slug} className="brand-btn-primary">
            Make this My Makati
          </Link>
          <Link to={'/participate?barangay=' + barangay.slug} className="brand-btn-secondary">
            Participate locally
          </Link>
          <Link to={'/accountability?barangay=' + barangay.slug} className="brand-btn-secondary">
            Local accountability
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <Users className="h-5 w-5 text-primary-700" />
            <div className="mt-3 text-2xl font-extrabold text-gray-950">
              {populationShare.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              of Makati&apos;s 2024 population
            </div>
          </div>

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

      <Section id="representation" className="bg-[#f5f8f2]">
        <div className="section-eyebrow">City representation</div>
        <Heading level={2}>Who represents this district</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
          These are Makati city and congressional offices for the district that
          contains Barangay {barangay.name}. They are separate from the
          barangay&apos;s own Punong Barangay and Sangguniang Barangay.
        </p>

        {representative && (
          <Link
            to={'/officials/' + representative.slug}
            className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                House of Representatives
              </div>
              <div className="mt-1 text-lg font-extrabold text-gray-950">
                {representative.displayName}
              </div>
              <div className="text-sm text-gray-600">{representative.district}</div>
            </div>
            <ArrowRight className="h-5 w-5 text-primary-700" />
          </Link>
        )}

        <h3 className="mt-7 font-extrabold text-lg text-gray-950">
          City councilors · {barangay.legislativeDistrict}
        </h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {districtCouncilors.map(official => (
            <Link
              key={official.slug}
              to={'/officials/' + official.slug}
              className="rounded-xl border border-primary-100 bg-white p-4 hover:border-primary-300"
            >
              <div className="text-xs font-bold text-primary-700">Councilor</div>
              <div className="mt-1 font-extrabold text-gray-950">
                {official.displayName}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-secondary-200 bg-secondary-50 p-5">
          <h3 className="font-extrabold text-gray-950">Barangay officials</h3>
          {barangay.officials?.punongBarangay && (
            <div className="mt-3 rounded-xl border border-secondary-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">Punong Barangay · city page snapshot</div>
              <div className="mt-1 text-lg font-extrabold text-gray-950">{barangay.officials.punongBarangay}</div>
            </div>
          )}
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The current Punong Barangay, seven Sangguniang Barangay members and
            SK leadership are maintained on the official Makati barangay page.
            BetterMakati links to that roster rather than copying names that may
            become stale. Check the source before relying on a name for an
            official transaction.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://www.makati.gov.ph/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
            >
              Current barangay roster <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Link
              to="/elections"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
            >
              Elections & voting <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Section>

      <Section id="services" className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Barangay services</div>
        <Heading level={2}>Common services to confirm at the hall</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
          These services are available through the city’s barangay-service directory. Requirements, fees, office hours and whether a service is offered can vary by barangay, so confirm with the hall before travelling.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {barangayServices.map(service => (
            <Link key={service.id} to={service.href} className="rounded-xl border border-primary-100 bg-white p-4 hover:border-primary-300">
              <div className="text-xs font-bold text-primary-700">{service.type}</div>
              <div className="mt-1 font-extrabold text-gray-950">{service.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-gray-600">{service.description}</div>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Local government access</div>
        <Heading level={2}>Barangay hall contact</Heading>
        {barangay.hallPhone || barangay.hallAddress || barangay.hallEmail ? (
          <div className="mt-5 rounded-2xl border border-primary-100 bg-white p-5">
            <p className="text-sm leading-relaxed text-gray-600">
              These details are transcribed from the linked official Makati barangay page. Confirm hours and service availability before travelling.
            </p>
            <div className="mt-4 grid gap-3 text-sm text-gray-700">
              {barangay.hallAddress && <div className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" /><span>{barangay.hallAddress}</span></div>}
              {barangay.hallPhone && <div className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" /><span>{barangay.hallPhone}</span></div>}
              {barangay.hallEmail && <div className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" /><a className="font-semibold text-primary-700 underline underline-offset-2" href={'mailto:' + barangay.hallEmail}>{barangay.hallEmail}</a></div>}
            </div>
            {barangay.hallSource && <a href={barangay.hallSource} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2">Official barangay page <ExternalLink className="h-3.5 w-3.5" /></a>}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-secondary-200 bg-secondary-50 p-5 text-sm leading-relaxed text-gray-700">
            A verified hall contact record has not yet been matched to this profile. The official city portal remains the authoritative source while this directory is completed.
            <a href="https://www.makati.gov.ph/" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2">Open official Makati portal <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
        )}
      </Section>

      <Section id="community" className="bg-white">
        <div className="section-eyebrow">Official channels</div>
        <Heading level={2}>Follow and verify locally</Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
          Start with the official Makati Web Portal. A direct Facebook link is shown only where a public page could be matched confidently; otherwise use the Facebook search link and confirm the page identity before relying on a post or contact detail.
        </p>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href={barangay.officialPageUrl || makatiBarangayDirectory} target="_blank" rel="noreferrer" className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5 hover:border-primary-300">
            <Landmark className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">Official Makati page</h3>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">Open city source <ExternalLink className="h-3.5 w-3.5" /></span>
          </a>
          <a href={barangay.facebookUrl || 'https://www.facebook.com/search/pages/?q=' + encodeURIComponent('Barangay ' + barangay.name + ' Makati')} target="_blank" rel="noreferrer" className="rounded-2xl border border-primary-100 bg-[#fffdf8] p-5 hover:border-primary-300">
            <Users className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">{barangay.facebookUrl ? 'Facebook page' : 'Find official Facebook page'}</h3>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">{barangay.facebookUrl ? 'Open public page' : 'Search Facebook' } <ExternalLink className="h-3.5 w-3.5" /></span>
          </a>
        </div>

        <div className="section-eyebrow">Community</div>
        <Heading level={2}>Local links</Heading>

        {barangay.notablePlaces && barangay.notablePlaces.length > 0 && (
          <>
            <h3 className="mt-6 font-extrabold text-lg text-gray-950">Prominent places and institutions</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {barangay.notablePlaces.map(place => (
                <a key={place.name} href={place.href} target="_blank" rel="noreferrer" className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 hover:border-primary-300">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">{place.type}</div>
                  <h3 className="mt-2 font-extrabold text-gray-950">{place.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">Open link <ExternalLink className="h-3.5 w-3.5" /></span>
                </a>
              ))}
            </div>
          </>
        )}

        {barangay.associations && barangay.associations.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {barangay.associations.map(association => (
              <a
                key={association.name}
                href={association.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
              >
                <Landmark className="h-5 w-5 text-primary-700" />
                <h3 className="mt-3 font-extrabold text-gray-950">
                  {association.name}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  {association.linkLabel}{' '}
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 text-sm text-gray-600">
            No village or homeowners-association link has been verified for
            this profile yet.
          </div>
        )}
      </Section>

      <Section id="more" className="bg-[#fffdf8]">
        <div className="section-eyebrow">Keep exploring</div>
        <Heading level={2}>More about {barangay.name}</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to={'/history?query=' + encodeURIComponent(barangay.name)}
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
          >
            <h3 className="font-extrabold text-gray-950">History references</h3>
            <p className="mt-1 text-sm text-gray-600">
              Search the sourced Makati timeline for this barangay.
            </p>
          </Link>
          <Link
            to="/services"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
          >
            <h3 className="font-extrabold text-gray-950">City services</h3>
            <p className="mt-1 text-sm text-gray-600">
              Find Makati services, documents and official channels.
            </p>
          </Link>
          <a
            href={psaBarangaySource}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
          >
            <h3 className="font-extrabold text-gray-950">PSA source</h3>
            <p className="mt-1 text-sm text-gray-600">
              Open the current Philippine Standard Geographic Code record.
            </p>
          </a>
        </div>
      </Section>
    </>
  );
}
