import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import ServiceSearch from '../home/ServiceSearch';

export default function Hero() {
  return (
    <section className="makati-hero overflow-visible">
      <div className="container mx-auto px-4 py-14 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div className="animate-fade-in">
            <div className="section-eyebrow">BetterMakati</div>
            <h1 className="max-w-3xl text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-gray-950">
              What do you need in Makati?
            </h1>
            <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-gray-700">
              Find public services, government information, barangays and public records.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/services" className="brand-btn-primary">
                Browse services <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/government" className="brand-btn-secondary">
                Explore government
              </Link>
            </div>
          </div>

          <ServiceSearch />
        </div>
      </div>
    </section>
  );
}
