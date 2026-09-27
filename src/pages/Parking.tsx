import { FormEvent, useState } from 'react';
import { CarFront, ExternalLink, MapPin, ParkingCircle } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SharePage from '../components/ui/SharePage';
import {
  resolveDistrictReference,
  type DistrictReference,
} from '../data/districtReferences';

const popularAreas: DistrictReference[] = [
  { type: 'area', id: 'ayala-center' },
  { type: 'area', id: 'salcedo-village' },
  { type: 'area', id: 'legazpi-village' },
  { type: 'barangay', id: 'poblacion' },
  { type: 'area', id: 'rockwell-center' },
  { type: 'area', id: 'circuit-makati' },
  { type: 'area', id: 'century-city' },
];

const popularAreaRecords = popularAreas.map(resolveDistrictReference);

const parkingUrl = (destination: string) =>
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('parking near ' + destination + ', Makati City, Metro Manila, Philippines');

export default function Parking() {
  const [destination, setDestination] = useState(
    popularAreaRecords[0].mapQuery
  );

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>Search parking nearby</Heading>
            <p className="max-w-3xl text-gray-600">Search current map listings near a Makati destination. Rates, access and operating hours remain with each parking facility.</p>
          </div>
          <SharePage title="Parking in Makati | BetterMakati" />
        </div>

        <form onSubmit={submit} className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 max-w-3xl">
          <div className="flex items-center gap-2 font-bold text-gray-950">
            <ParkingCircle className="h-5 w-5 text-primary-700" />
            Search map listings near a destination
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
          {popularAreaRecords.map(area => (
            <article
              key={area.ref.type + ':' + area.ref.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
            >
              <MapPin className="h-5 w-5 text-primary-700" />
              <h2 className="mt-3 font-extrabold text-gray-950">
                {area.label}
              </h2>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                <a
                  href={parkingUrl(area.mapQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-bold text-primary-700"
                >
                  Parking nearby <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={area.href}
                  className="text-sm font-bold text-gray-600 underline underline-offset-2"
                >
                  Area details
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
