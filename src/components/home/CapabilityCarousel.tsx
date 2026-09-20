import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeHelp,
  Building2,
  CalendarCheck,
  Landmark,
  MapPinned,
  ReceiptText,
  SearchCheck,
  Vote,
} from 'lucide-react';
import { Link } from 'react-router';

const useCases = [
  {
    title: 'Where do I get a Cedula?',
    description: 'Find the service, requirements, responsible office and official next step.',
    href: '/services/guide/community-tax-certificate',
    icon: ReceiptText,
  },
  {
    title: 'Which Makati office handles my SSS benefit?',
    description: 'Open the benefit guide, then see Makati service locations and contacts.',
    href: '/services/guide/sss-sickness-benefit',
    icon: Building2,
  },
  {
    title: 'What is the city spending on this project?',
    description: 'Follow budgets, projects, procurement, audit records and later evidence.',
    href: '/projects-budget',
    icon: Landmark,
  },
  {
    title: 'What’s happening in Makati today?',
    description: 'Check weather, advisories, events, hotlines and current official activity.',
    href: '/today',
    icon: CalendarCheck,
  },
  {
    title: 'Who represents me?',
    description: 'Look up your barangay, elected officials, districts and local government information.',
    href: '/barangays',
    icon: MapPinned,
  },
  {
    title: 'How do I vote in Makati?',
    description: 'Find registration, election dates, voter information and official COMELEC sources.',
    href: '/elections',
    icon: Vote,
  },
  {
    title: 'Where can I park, commute or go?',
    description: 'Plan a Makati visit with mobility, parking, cinemas, places and current events.',
    href: '/visit',
    icon: SearchCheck,
  },
  {
    title: 'Where did this Makati story come from?',
    description: 'Explore the sourced history timeline, heritage places and original evidence.',
    href: '/history',
    icon: BadgeHelp,
  },
];

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
};

export default function CapabilityCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const visible = useMemo(
    () => [
      useCases[index],
      useCases[(index + 1) % useCases.length],
    ],
    [index]
  );

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(
      () => setIndex(current => (current + 2) % useCases.length),
      5500
    );
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const previous = () =>
    setIndex(current => (current - 2 + useCases.length) % useCases.length);
  const next = () =>
    setIndex(current => (current + 2) % useCases.length);

  return (
    <section
      className="border-b border-gray-100 bg-white py-8"
      aria-labelledby="better-makati-can-help"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="container px-5 md:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="section-eyebrow">Try BetterMakati</div>
            <h2
              id="better-makati-can-help"
              className="text-xl font-extrabold tracking-tight text-gray-950 md:text-2xl"
            >
              What can BetterMakati help you do?
            </h2>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={previous}
              className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-primary-800 hover:border-primary-300 hover:bg-primary-50"
              aria-label="Previous examples"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-primary-800 hover:border-primary-300 hover:bg-primary-50"
              aria-label="Next examples"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {visible.map((item, position) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.href}
                className={
                  position === 1
                    ? 'hidden rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 transition hover:border-primary-300 hover:shadow-sm md:block'
                    : 'rounded-2xl border border-gray-200 bg-[#fffdf8] p-5 transition hover:border-primary-300 hover:shadow-sm'
                }
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-extrabold leading-snug text-gray-950">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                      Show me <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 sm:hidden">
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: useCases.length / 2 }).map((_, dot) => (
              <span
                key={dot}
                className={
                  index / 2 === dot
                    ? 'h-1.5 w-5 rounded-full bg-primary-700'
                    : 'h-1.5 w-1.5 rounded-full bg-gray-300'
                }
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={previous}
              className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-primary-800"
              aria-label="Previous example"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-primary-800"
              aria-label="Next example"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 hidden gap-1.5 sm:flex" aria-hidden="true">
          {Array.from({ length: useCases.length / 2 }).map((_, dot) => (
            <span
              key={dot}
              className={
                index / 2 === dot
                  ? 'h-1.5 w-5 rounded-full bg-primary-700 transition-all'
                  : 'h-1.5 w-1.5 rounded-full bg-gray-300 transition-all'
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
