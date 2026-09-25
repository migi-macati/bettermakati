import { useState } from 'react';
import { Link } from 'react-router';
import {
  Bike,
  Bus,
  Car,
  ExternalLink,
  MapPin,
  Navigation,
  Plane,
  Train,
} from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import PhotoCarousel from '../components/ui/PhotoCarousel';
import { cityImages } from '../data/cityImages';
import {
  placesByCategory,
  type PlaceRegistryRecord,
} from '../data/placeRegistry';

const verifiedTransportPlaces = [
  ...placesByCategory('transport-stop'),
  ...placesByCategory('transport-terminal'),
]
  .filter(place => place.verification.status === 'verified')
  .sort((a, b) => {
    const rank = (place: PlaceRegistryRecord) => {
      if (place.tags.includes('MRT-3')) return 0;
      if (place.tags.includes('EDSA Busway')) return 1;
      if (place.tags.includes('Pasig River Ferry')) return 2;
      if (place.primaryCategory === 'transport-terminal') return 3;
      return 4;
    };

    return rank(a) - rank(b) || a.name.localeCompare(b.name);
  });

const transportPlaceKind = (place: PlaceRegistryRecord) => {
  if (place.tags.includes('MRT-3')) return 'MRT-3 station';
  if (place.tags.includes('EDSA Busway')) return 'EDSA Busway station';
  if (place.tags.includes('Pasig River Ferry')) return 'Pasig River Ferry station';
  if (place.primaryCategory === 'transport-terminal') return 'Transport terminal';
  return 'Public transport stop';
};

const primaryTransportSource = (place: PlaceRegistryRecord) =>
  place.provenance.sources.find(source => source.kind !== 'reference-map') ??
  place.provenance.sources[0];

const transitLinks = [
  {
    title: 'MRT-3',
    description: 'Makati stations: Guadalupe, Buendia, Ayala and Magallanes.',
    href: 'https://www.dotrmrt3.gov.ph/about-us',
    icon: Train,
  },
  {
    title: 'One Ayala Transport Hub',
    description: 'MRT, EDSA Busway, city buses, P2P, UV Express and jeepneys.',
    href: 'https://www.google.com/maps/search/?api=1&query=One%20Ayala%20Makati',
    icon: Bus,
  },
  {
    title: 'EDSA Busway',
    description: 'Busway stations include Guadalupe, Buendia and Ayala.',
    href: 'https://edsabus.com/route-map',
    icon: Bus,
  },
  {
    title: 'Century City E-Bus',
    description: 'Century City transport hub route map and schedule.',
    href: 'https://ccth.framer.ai/',
    icon: Bus,
  },
];

const rideApps = [
  { name: 'Grab', href: 'https://www.grab.com/ph/download/', type: 'Car & taxi' },
  { name: 'Angkas', href: 'https://www.angkas.com/consumer', type: 'Motorcycle taxi' },
  { name: 'JoyRide', href: 'https://joyride.com.ph/', type: 'Car, taxi & motorcycle' },
  { name: 'MOVE IT', href: 'https://moveit.com.ph/how-it-works/', type: 'Motorcycle taxi' },
];

const commonTrips = [
  {
    origin: 'One Ayala',
    destination: 'Poblacion Makati',
    label: 'Ayala Center → Poblacion',
    icon: Bus,
  },
  {
    origin: 'Ayala Triangle Gardens',
    destination: 'Power Plant Mall',
    label: 'CBD → Rockwell',
    icon: Navigation,
  },
  {
    origin: 'Circuit Makati',
    destination: 'One Ayala',
    label: 'Circuit → Ayala Center',
    icon: Bus,
  },
  {
    origin: 'Ayala Triangle Gardens Makati',
    destination: 'NAIA Terminal 3',
    label: 'Makati → NAIA Terminal 3',
    icon: Plane,
  },
];

const mapsDirections = (destination: string, mode: string, origin?: string) => {
  const params = new URLSearchParams({
    api: '1',
    destination:
      destination +
      (destination.toLowerCase().includes('makati')
        ? ''
        : ', Makati City, Metro Manila, Philippines'),
    travelmode: mode,
  });
  if (origin) {
    params.set(
      'origin',
      origin +
        (origin.toLowerCase().includes('makati')
          ? ''
          : ', Makati City, Metro Manila, Philippines')
    );
  }
  return 'https://www.google.com/maps/dir/?' + params.toString();
};

export default function Mobility() {
  const [destination, setDestination] = useState('Ayala Triangle Gardens');
  const [mode, setMode] = useState('transit');

  return (
    <>
      <SEO
        title="Getting Around Makati"
        description="Public transport, common trips, route planning and ride-hailing options in Makati City."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Visit Makati</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Getting around</Heading>
            <p className="max-w-3xl text-gray-600">
              Plan a trip, find major transport anchors and jump to current
              operator or mapping information.
            </p>
          </div>
          <SharePage title="Getting Around Makati | BetterMakati" />
        </div>
        <LastReviewed note="Schedules and routes can change; confirm current service with the linked operator or map." />
        <PhotoCarousel
          images={[cityImages.jeepney]}
          title="Street-level Makati"
          compact
          className="mt-7"
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2 font-bold text-gray-950">
              <Navigation className="h-5 w-5 text-primary-700" />
              Plan a trip
            </div>

            <label className="form-field mt-5">
              <span>Destination in Makati</span>
              <input
                value={destination}
                onChange={event => setDestination(event.target.value)}
                placeholder="e.g., Power Plant Mall"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Travel mode">
              {[
                ['transit', 'Public transport'],
                ['walking', 'Walk'],
                ['bicycling', 'Bike'],
                ['driving', 'Drive'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={mode === value}
                  className={mode === value ? 'brand-chip !bg-primary-800 !text-white' : 'brand-chip'}
                >
                  {label}
                </button>
              ))}
            </div>

            <a
              href={mapsDirections(destination, mode)}
              target="_blank"
              rel="noreferrer"
              className="brand-btn-primary mt-5"
            >
              Get directions <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {transitLinks.map(item => {
              const Icon = item.icon;
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
                >
                  <Icon className="h-6 w-6 text-primary-700" />
                  <h2 className="font-extrabold text-lg text-gray-950 mt-4">{item.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </a>
              );
            })}
          </div>
        </div>
      </Section>

      <Section id="transport-anchors" className="bg-white">
        <div className="section-eyebrow">Transport anchors</div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Heading level={2}>Stations and terminals in Makati</Heading>
            <p className="max-w-3xl text-sm text-gray-600">
              Verified MRT-3, EDSA Busway, Pasig River Ferry and intermodal locations.
            </p>
          </div>
          <Link
            to="/civic-map"
            className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
          >
            Open Civic Map <MapPin className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {verifiedTransportPlaces.map(place => {
            const source = primaryTransportSource(place);
            const Icon = place.tags.includes('rail') ? Train : Bus;

            return (
              <article
                key={place.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                    {transportPlaceKind(place)}
                  </div>
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>
                <h3 className="mt-3 text-lg font-extrabold text-gray-950">{place.name}</h3>
                {place.summary && (
                  <p className="mt-1 text-sm text-gray-600">{place.summary}</p>
                )}
                {place.location.address && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {place.location.address}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={'/civic-map/' + place.id}
                    className="text-sm font-bold text-primary-700 underline underline-offset-2"
                  >
                    Place details
                  </Link>
                  {source && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 underline underline-offset-2"
                    >
                      Source <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">Common trips</div>
        <Heading level={2}>Start with a frequent destination pair</Heading>
        <p className="max-w-3xl text-sm text-gray-600">
          These links open live directions rather than prescribing a fixed route,
          so current traffic and available modes can be considered.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {commonTrips.map(trip => {
            const Icon = trip.icon;
            return (
              <a
                key={trip.label}
                href={mapsDirections(trip.destination, 'transit', trip.origin)}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300"
              >
                <Icon className="h-5 w-5 text-primary-700" />
                <h3 className="mt-3 font-extrabold text-gray-950">{trip.label}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Live directions <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Ride-hailing</div>
        <Heading level={2}>Book a ride</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
          {rideApps.map(app => (
            <a
              key={app.name}
              href={app.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
            >
              <Car className="h-5 w-5 text-primary-700" />
              <h3 className="font-extrabold text-gray-950 mt-3">{app.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{app.type}</p>
            </a>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://www.google.com/maps/search/?api=1&query=bike%20parking%20in%20Makati%20City"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 transition"
          >
            <Bike className="h-6 w-6 text-primary-700" />
            <h2 className="font-extrabold text-lg mt-4">Cycling</h2>
            <p className="text-sm text-gray-600 mt-1">Find bike parking and cycling destinations.</p>
          </a>
          <Link
            to="/parking"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 transition"
          >
            <Car className="h-6 w-6 text-primary-700" />
            <h2 className="font-extrabold text-lg mt-4">Parking</h2>
            <p className="text-sm text-gray-600 mt-1">Search parking near a Makati destination.</p>
          </Link>
          <a
            href="#transport-anchors"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 transition"
          >
            <MapPin className="h-6 w-6 text-primary-700" />
            <h2 className="font-extrabold text-lg mt-4">Transport terminals</h2>
            <p className="text-sm text-gray-600 mt-1">Browse verified stations and terminals already indexed by BetterMakati.</p>
          </a>
        </div>
      </Section>
    </>
  );
}
