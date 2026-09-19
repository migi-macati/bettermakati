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
    description: 'CBD, Ayala Center and Circuit lifestyle and event updates.',
    href: 'https://makeitmakati.com/',
    icon: CalendarDays,
    type: 'District guide',
  },
  {
    title: 'Ayala Malls',
    description: 'Promos and events for Glorietta, Greenbelt and Circuit.',
    href: 'https://www.ayalamalls.com/explore/ayala-glorietta/store/AYALA-GLORIETTA-1326818',
    icon: ShoppingBag,
    type: 'Venue source',
  },
  {
    title: 'Power Plant Mall / Rockwell',
    description: 'Rockwell news, events and Proscenium updates.',
    href: 'https://e-rockwell.com/property/proscenium-theater/',
    icon: CalendarDays,
    type: 'Venue source',
  },
  {
    title: 'Century City Mall',
    description: 'Current mall news and events.',
    href: 'https://www.centurycitymall.com.ph/news-and-events/',
    icon: ShoppingBag,
    type: 'Venue source',
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
        <LastReviewed note="Event schedules change frequently; organizer and venue pages remain controlling sources." />

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
            These discovery links search the current web. BetterMakati does not
            treat a search result as verified until the event&apos;s own source
            confirms the date and venue.
          </p>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">Event sources</div>
        <Heading level={2}>Check current listings</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
          {eventSources.map(source => {
            const Icon = source.icon;
            return (
              <a
                key={source.title}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-primary-100 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-primary-700">
                  {source.type}
                </div>
                <h3 className="mt-1 font-extrabold text-lg text-gray-950">
                  {source.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 mt-4">
                  Open <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
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
