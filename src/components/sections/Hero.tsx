import { BarChart3, FileText, PhoneCall } from 'lucide-react';
import { Link } from 'react-router';
import CityPhoto from '../ui/CityPhoto';
import ServiceSearch from '../home/ServiceSearch';

export default function Hero() {
  return (
    <section className="makati-hero overflow-visible">
      <div className="container px-5 md:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-8 lg:gap-10 items-center">
          <div className="animate-fade-in min-w-0">
            <div className="section-eyebrow">BetterMakati</div>
            <h1 className="max-w-3xl text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-gray-950">
              What do you need in Makati?
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-gray-700">
              Services, places, barangays, public records, participation and city information.
            </p>

            <div className="mt-7">
              <ServiceSearch
                scope="site"
                title="Search BetterMakati"
                placeholder="Try Yellow Card, Poblacion, budget, cinema..."
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm">
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

          <CityPhoto priority />
        </div>
      </div>
    </section>
  );
}
