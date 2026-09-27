import {
  CalendarDays,
  ExternalLink,
  Film,
  Landmark,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import { resolveDistrictReference } from '../data/districtReferences';

const eventSources = [
  {
    title: 'Makati City Events',
    description: 'Official city event listings.',
    href: 'https://www.makati.gov.ph/content/events',
    icon: Landmark,
    type: 'Official city',
  },
  {
    title: 'Make It Makati',
    description: 'Lifestyle and event updates across its Makati district coverage.',
    href: 'https://makeitmakati.com/',
    icon: CalendarDays,
    type: 'District guide',
    areaIds: ['makati-cbd', 'ayala-center', 'circuit-makati'],
  },
  {
    title: 'Ayala Malls',
    description: 'Promos and events for major Makati mall venues.',
    href: 'https://www.ayalamalls.com/explore/ayala-glorietta/store/AYALA-GLORIETTA-1326818',
    icon: ShoppingBag,
    type: 'Venue source',
    areaIds: ['ayala-center', 'circuit-makati'],
  },
  {
    title: 'Power Plant Mall',
    description: 'Mall and Proscenium event updates.',
    href: 'https://e-rockwell.com/property/proscenium-theater/',
    icon: CalendarDays,
    type: 'Venue source',
    areaIds: ['rockwell-center'],
  },
  {
    title: 'Century City Mall',
    description: 'Current mall news and events.',
    href: 'https://www.centurycitymall.com.ph/news-and-events/',
    icon: ShoppingBag,
    type: 'Venue source',
    areaIds: ['century-city'],
  },
];

const searches = [
  ['Today', 'Makati events today'],
  ['This weekend', 'Makati events this weekend'],
  ['Free', 'free events in Makati'],
  ['Family', 'family events in Makati'],
  ['Arts & culture', 'arts culture events Makati'],
  ['Markets', 'markets popups events Makati'],
] as const;

const searchUrl = (query: string) =>
  'https://www.google.com/search?q=' + encodeURIComponent(query);

export default function WhatsOn() {
  return (
    <>
      <SEO
        title="What’s On in Makati"
        description="Find current events, activities, entertainment and official event sources across Makati."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Visit Makati</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>What’s on</Heading>
            <p className="max-w-3xl text-gray-600">
              Jump to current event searches, then verify dates, tickets and
              venue details with the original organizer.
            </p>
          </div>
          <SharePage title="What’s On in Makati | BetterMakati" />
        </div>
        <LastReviewed date="2026-09-20" note="Event schedules change frequently; organizer and venue pages remain controlling sources." />

        <div className="mt-7 rounded-2xl border border-primary-100 bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 font-extrabold text-gray-950">
            <Search className="h-5 w-5 text-primary-700" />
            Find something to do
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {searches.map(([label, query]) => (
              <a
                key={label}
                href={searchUrl(query)}
                target="_blank"
                rel="noreferrer"
                className="brand-chip"
              >
                {label}
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            Verify the date and venue with the organizer before going.
          </p>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Event sources</div>
        <Heading level={2}>Check current listings</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
          {eventSources.map(source => {
            const Icon = source.icon;
            const areas = (source.areaIds ?? []).map(areaId =>
              resolveDistrictReference({ type: 'area', id: areaId })
            );

            return (
              <article
                key={source.title}
                className="rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  {source.type}
                </div>
                <h3 className="mt-1 text-lg font-extrabold text-gray-950">
                  {source.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {source.description}
                </p>

                {areas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {areas.map(area => (
                      <Link
                        key={area.ref.id}
                        to={area.href}
                        className="rounded-full border border-primary-200 px-3 py-1.5 text-xs font-bold text-primary-700"
                      >
                        {area.label}
                      </Link>
                    ))}
                  </div>
                )}

                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
                >
                  Open <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-8">
          <Link to="/cinemas" className="brand-btn-secondary">
            <Film className="h-4 w-4" /> Cinema showtimes
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="rounded-2xl border border-secondary-200 bg-secondary-50 p-6 text-sm leading-relaxed text-gray-700">
          <strong className="text-gray-950">Why event links open original sources:</strong>{' '}
          event dates, tickets and venue details change quickly. BetterMakati
          prioritizes current organizer information rather than copying a dated
          schedule that could become stale.
        </div>
      </Section>
    </>
  );
}
