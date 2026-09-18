import { CalendarDays, ExternalLink, Film, Landmark, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';

const eventSources = [
  {
    title: 'Makati City Events',
    description: 'Official city event listings.',
    href: 'https://www.makati.gov.ph/content/events',
    icon: Landmark,
  },
  {
    title: 'Make It Makati',
    description: 'CBD, Ayala Center and Circuit lifestyle and event updates.',
    href: 'https://makeitmakati.com/',
    icon: CalendarDays,
  },
  {
    title: 'Ayala Malls',
    description: 'Promos and events for Glorietta, Greenbelt and Circuit.',
    href: 'https://www.ayalamalls.com/explore/ayala-glorietta/store/AYALA-GLORIETTA-1326818',
    icon: ShoppingBag,
  },
  {
    title: 'Power Plant Mall / Rockwell',
    description: 'Rockwell news, events and Proscenium updates.',
    href: 'https://e-rockwell.com/property/proscenium-theater/',
    icon: CalendarDays,
  },
  {
    title: 'Century City Mall',
    description: 'Current mall news and events.',
    href: 'https://www.centurycitymall.com.ph/news-and-events/',
    icon: ShoppingBag,
  },
];

export default function WhatsOn() {
  return (
    <>
      <SEO
        title="What’s On in Makati"
        description="Event, entertainment and activity sources for Makati City."
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">Visit Makati</div>
        <Heading>What’s on</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {eventSources.map(source => {
            const Icon = source.icon;
            return (
              <a
                key={source.title}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition"
              >
                <Icon className="h-6 w-6 text-primary-700" />
                <h2 className="font-extrabold text-lg text-gray-950 mt-4">{source.title}</h2>
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
    </>
  );
}
