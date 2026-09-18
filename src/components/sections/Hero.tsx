import { ArrowRight, Database, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import ServiceSearch from '../home/ServiceSearch';

export default function Hero() {
  return (
    <section className="makati-hero overflow-hidden">
      <div className="container mx-auto px-4 py-14 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center rounded-full border border-primary-200 bg-white/70 px-3 py-1 text-xs font-semibold text-primary-800 mb-5">
              Independent. Community-built. For Makati.
            </div>
            <h1 className="max-w-3xl text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-gray-950">
              Makati public information,
              <span className="text-primary-700"> easier to find </span>
              and understand.
            </h1>
            <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-gray-700">
              BetterMakati brings selected public services, city information, barangay data and transparency sources into one independent, easy-to-use civic portal.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/services" className="brand-btn-primary">
                Browse services <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/transparency" className="brand-btn-secondary">
                View transparency sources
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              <div className="hero-principle"><ShieldCheck className="h-4 w-4" /> Independent</div>
              <div className="hero-principle"><Database className="h-4 w-4" /> Sources first</div>
              <div className="hero-principle"><HeartHandshake className="h-4 w-4" /> Public-interest</div>
            </div>
          </div>

          <ServiceSearch />
        </div>
      </div>
    </section>
  );
}
