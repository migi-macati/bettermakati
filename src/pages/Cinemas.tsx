import { ExternalLink, Film, MapPin } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';

const cinemas = [
  {
    name: 'Power Plant Cinema',
    area: 'Rockwell Center',
    schedule: 'https://www.clickthecity.com/movies/theaters/power-plant-mall',
    official: 'https://tickets.powerplantcinema.com/',
  },
  {
    name: 'Glorietta 4 Cinemas',
    area: 'Ayala Center',
    schedule: 'https://www.clickthecity.com/movies/theaters/glorietta-4',
  },
  {
    name: 'Greenbelt 3 Cinemas',
    area: 'Ayala Center',
    schedule: 'https://www.clickthecity.com/movies/theaters/greenbelt-3',
  },
  {
    name: 'Ayala Malls Circuit Cinemas',
    area: 'Circuit Makati',
    schedule: 'https://www.clickthecity.com/movies/theaters/ayala-malls-circuit',
  },
  {
    name: 'Century City Mall Cinema',
    area: 'Century City',
    schedule: 'https://www.clickthecity.com/movies/theaters/century-city-mall',
    official: 'https://www.centurycitymall.com.ph/',
  },
  {
    name: 'Walter Mart Makati Cinemas',
    area: 'Chino Roces Avenue',
    schedule: 'https://www.clickthecity.com/movies/theaters/walter-mart-makati',
  },
  {
    name: 'Cash & Carry Cinema',
    area: 'Gil Puyat / South Superhighway',
    schedule: 'https://www.clickthecity.com/movies/theaters/cash-and-carry',
  },
];

const mapsUrl = (name: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' Makati');

export default function Cinemas() {
  return (
    <>
      <SEO
        title="Cinemas in Makati"
        description="Cinema locations and current movie schedules in Makati City."
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Visit Makati</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Heading>Cinemas</Heading>
          <SharePage title="Cinemas in Makati | BetterMakati" />
        </div>
        <LastReviewed note="Showtimes change daily; use the linked cinema or schedule source for current sessions." />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {cinemas.map(cinema => (
            <article key={cinema.name} className="rounded-2xl border border-gray-200 bg-white p-5">
              <Film className="h-6 w-6 text-primary-700" />
              <h2 className="font-extrabold text-lg text-gray-950 mt-4">{cinema.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{cinema.area}</p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <a
                  href={cinema.schedule}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-primary-700 inline-flex items-center gap-1"
                >
                  Showtimes <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={mapsUrl(cinema.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-primary-700 inline-flex items-center gap-1"
                >
                  <MapPin className="h-3.5 w-3.5" /> Map
                </a>
                {cinema.official && (
                  <a
                    href={cinema.official}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 underline underline-offset-2"
                  >
                    Official site
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
