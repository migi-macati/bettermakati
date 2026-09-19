import { ArrowRight, BarChart3, FileText, PhoneCall } from 'lucide-react';
import { Link } from 'react-router';
import ServiceSearch from '../home/ServiceSearch';

export default function Hero() {
  return (
    <section className="makati-hero overflow-visible">
      <div className="container px-5 md:px-6 lg:px-8 py-14 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div className="animate-fade-in">
            <div className="section-eyebrow">BetterMakati</div>
            <h1 className="max-w-3xl text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-gray-950">
              What do you need in Makati?
            </h1>
            <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-gray-700">
              Understand Makati. Find what you need. See the source.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Services, offices, barangays, public records, places and civic tools
              in one independent city guide.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/services" className="brand-btn-primary">
                Browse services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <Link
                to="/hotlines"
                className="hero-principle hover:text-primary-800"
              >
                <PhoneCall
                  className="h-4 w-4 text-primary-700"
                  aria-hidden="true"
                />
                Hotlines
              </Link>
              <Link
                to="/projects-budget"
                className="hero-principle hover:text-primary-800"
              >
                <FileText
                  className="h-4 w-4 text-primary-700"
                  aria-hidden="true"
                />
                Budgets & projects
              </Link>
              <Link
                to="/statistics"
                className="hero-principle hover:text-primary-800"
              >
                <BarChart3
                  className="h-4 w-4 text-primary-700"
                  aria-hidden="true"
                />
                City statistics
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <ServiceSearch scope="site" />
            <div
              className="hidden rounded-2xl border border-primary-100 bg-white/70 p-4 shadow-sm sm:block"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 640 145"
                className="h-auto w-full"
                role="presentation"
              >
                <defs>
                  <linearGradient
                    id="makati-skyline"
                    x1="0"
                    x2="1"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#176238" stopOpacity="0.95" />
                    <stop offset="1" stopColor="#3b8792" stopOpacity="0.75" />
                  </linearGradient>
                </defs>
                <path d="M0 124h640v21H0z" fill="#dcefe2" />
                <path
                  d="M0 125c90-27 140 9 228-10 88-20 141-35 215-10 72 24 106 7 197 2v38H0z"
                  fill="#b9ddc4"
                  opacity="0.6"
                />
                <g fill="url(#makati-skyline)">
                  <path d="M32 125V67h40v58zM80 125V47h28v78zM116 125V77h52v48zM176 125V28h32v97zM216 125V62h62v63zM286 125V17h38v108zM333 125V56h34v69zM375 125V36h58v89zM441 125V66h29v59zM478 125V45h49v80zM535 125V23h35v102zM578 125V58h42v67z" />
                </g>
                <g fill="#dca514" opacity="0.95">
                  <circle cx="53" cy="82" r="2" />
                  <circle cx="191" cy="48" r="2" />
                  <circle cx="304" cy="38" r="2" />
                  <circle cx="404" cy="58" r="2" />
                  <circle cx="552" cy="44" r="2" />
                </g>
              </svg>
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-gray-600">
                <span className="font-semibold text-primary-800">
                  Find your way through Makati
                </span>
                <span>Services · places · records</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
