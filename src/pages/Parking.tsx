import { FormEvent, useState } from 'react';
import { CarFront, ExternalLink, MapPin, ParkingCircle } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const popularAreas = [
  'Ayala Center Makati',
  'Salcedo Village Makati',
  'Legazpi Village Makati',
  'Poblacion Makati',
  'Rockwell Center Makati',
  'Circuit Makati',
  'Century City Makati',
];

const parkingUrl = (destination: string) =>
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('parking near ' + destination + ', Makati City, Metro Manila, Philippines');

export default function Parking() {
  const [destination, setDestination] = useState('Ayala Center Makati');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    window.open(parkingUrl(destination), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO
        title="Parking in Makati"
        description="Find parking near destinations in Makati City."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Visit Makati</div>
        <Heading>Find parking</Heading>

        <form onSubmit={submit} className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 max-w-3xl">
          <div className="flex items-center gap-2 font-bold text-gray-950">
            <ParkingCircle className="h-5 w-5 text-primary-700" />
            Search near a destination
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={destination}
              onChange={event => setDestination(event.target.value)}
              placeholder="e.g., Ayala Museum"
              className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
            <button type="submit" className="brand-btn-primary">
              <CarFront className="h-4 w-4" />
              <span className="hidden sm:inline">Find</span>
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {popularAreas.map(area => (
            <a
              key={area}
              href={parkingUrl(area)}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
            >
              <MapPin className="h-5 w-5 text-primary-700" />
              <h2 className="font-extrabold text-gray-950 mt-3">{area}</h2>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-4">
                Parking nearby <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
