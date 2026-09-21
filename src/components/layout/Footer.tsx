import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { footerNavigation } from '../../data/navigation';
import { Link } from 'react-router';
import BrandMark from '../BrandMark';

const isExternal = (href: string) => href.startsWith('http');

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="h-1.5 bg-gradient-to-r from-secondary-500 via-primary-500 to-accent-500" />
      <div className="container px-5 md:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9">
          <div>
            <div className="inline-block rounded-xl bg-white px-3 py-2 mb-4">
              <BrandMark compact />
            </div>
            <p className="text-primary-100 text-sm leading-relaxed">
              Independent, community-built civic information and participation for Makati.
            </p>
            <a
              href="https://github.com/migi-macati/bettermakati"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-secondary-200 hover:text-white"
            >
              <Github className="h-4 w-4" /> Open-source on GitHub
            </a>
          </div>

          {footerNavigation.mainSections.map(section => (
            <div key={section.title}>
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-secondary-200 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map(link => (
                  <li key={link.label}>
                    {isExternal(link.href) ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-9 items-center gap-1 text-primary-100 hover:text-white text-sm transition-colors"
                      >
                        {link.label}{' '}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="inline-flex min-h-9 items-center text-primary-100 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-xs text-primary-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>© 2026 BetterMakati. Independent BetterLGU civic platform.</p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/about#identity"
                className="underline underline-offset-4"
              >
                Our identity
              </Link>
              <Link to="/privacy" className="underline underline-offset-4">
                Privacy
              </Link>
              <Link to="/status" className="underline underline-offset-4">
                Coverage &amp; limitations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
