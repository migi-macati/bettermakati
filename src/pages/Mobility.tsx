import { useState } from 'react';
import { Link } from 'react-router';
import { Bike, Bus, Car, ExternalLink, MapPin, Navigation, Train } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

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

const mapsDirections = (destination: string, mode: string) =>
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(destination + ', Makati City, Metro Manila, Philippines') +
  '&travelmode=' + mode;

export default function Mobility() {
  const [destination, setDestination] = useState('Ayala Triangle Gardens');
  const [mode, setMode] = useState('transit');

  return (
    <>
      <SEO
        title="Getting Around Makati"
        description="Public transport, route planning and ride-hailing options in Makati City."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Visit Makati</div>
        <Heading>Getting around</Heading>

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

            <div className="mt-4 flex flex-wrap gap-2">
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
            <p className="text-sm text-gray-600 mt-1">Find parking near a Makati destination.</p>
          </Link>
          <a
            href="https://www.google.com/maps/search/?api=1&query=transport%20terminal%20in%20Makati%20City"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-primary-300 transition"
          >
            <MapPin className="h-6 w-6 text-primary-700" />
            <h2 className="font-extrabold text-lg mt-4">Transport terminals</h2>
            <p className="text-sm text-gray-600 mt-1">Find terminals and loading points in Makati.</p>
          </a>
        </div>
      </Section>
    </>
  );
}
