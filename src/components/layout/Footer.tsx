import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { footerNavigation } from '../../data/navigation';
import { Link } from 'react-router';
import BrandMark from '../BrandMark';

const isExternal = (href: string) => href.startsWith('http');

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="h-1.5 bg-secondary-500" />
      <div className="container px-5 md:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9">
          <div>
            <div className="mb-4">
              <BrandMark compact inverse />
            </div>
            <p className="max-w-xs text-primary-100 text-sm leading-relaxed">
              Civic information, public records and participation tools for understanding and using Makati.
            </p>
            <div className="mt-4 flex flex-col items-start gap-2 text-sm font-semibold">
              <a
                href="mailto:hello@bettermakati.org"
                className="text-primary-100 hover:text-white"
              >
                hello@bettermakati.org
              </a>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <a
                  href="https://www.facebook.com/bettermakati"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-100 hover:text-white"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/bettermakati/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-100 hover:text-white"
                >
                  Instagram
                </a>
              </div>
              <a
                href="https://github.com/migi-macati/bettermakati"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-primary-100 hover:text-white"
              >
                <Github className="h-4 w-4" /> Open-source on GitHub
              </a>
            </div>
          </div>

          {footerNavigation.mainSections.map(section => (
            <div key={section.title}>
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white/80 mb-4">
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
            <p>© 2026 BetterMakati. Independent civic information platform for Makati.</p>
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
