import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router';
import { footerNavigation } from '../../data/navigation';
import BrandMark from '../BrandMark';
import {
  isBarangaySliceableHref,
  useBarangayScope,
  withBarangayScope,
} from '../../hooks/useBarangayScope';


const Footer: React.FC = () => {
  const { preferredBarangay } = useBarangayScope();
  const scopedHref = (href: string) => {
    if (href === '/search' && preferredBarangay) {
      return withBarangayScope(href, preferredBarangay.slug);
    }

    return preferredBarangay && isBarangaySliceableHref(href)
      ? withBarangayScope(href, preferredBarangay.slug)
      : href;
  };

  return (
    <footer className="bm-site-footer text-white">
      <div className="bm-site-footer-rule" aria-hidden="true" />
      <div className="container px-5 md:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-10">
          <div>
            <div className="mb-4">
              <BrandMark compact inverse />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-primary-100">
              Independent civic information, public records and participation
              tools for understanding and using Makati.
            </p>

            <div className="mt-5 flex flex-col items-start gap-2 text-sm font-semibold">
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center text-primary-100 hover:text-white focus-visible:outline-secondary-300"
              >
                Contact BetterMakati
              </Link>
              <a
                href="mailto:hello@bettermakati.org"
                className="inline-flex min-h-11 items-center text-primary-100 hover:text-white focus-visible:outline-secondary-300"
              >
                hello@bettermakati.org
              </a>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <a
                  href="https://www.facebook.com/bettermakati"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center text-primary-100 hover:text-white focus-visible:outline-secondary-300"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/bettermakati/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center text-primary-100 hover:text-white focus-visible:outline-secondary-300"
                >
                  Instagram
                </a>
              </div>
              <a
                href="https://github.com/migi-macati/bettermakati"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-primary-100 hover:text-white focus-visible:outline-secondary-300"
              >
                <Github className="h-4 w-4" aria-hidden="true" /> Open-source on
                GitHub
              </a>
            </div>
          </div>

          {footerNavigation.mainSections.map(section => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-white/80">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={scopedHref(link.href)}
                      className="inline-flex min-h-11 items-center text-sm text-primary-100 transition-colors hover:text-white focus-visible:outline-secondary-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bm-site-footer-ecosystem mt-10 border-t border-white/10 pt-6">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/80">
            Official & broader ecosystem
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {footerNavigation.ecosystemLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 text-sm text-primary-100 transition-colors hover:text-white focus-visible:outline-secondary-300"
              >
                {link.label}
                <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-primary-200">
            BetterMakati is independent and is not the official City Government
            of Makati website.
          </p>
        </div>

        <div className="bm-site-footer-legal mt-6 border-t border-white/10 pt-6 text-xs text-primary-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>
              © 2026 BetterMakati. Independent civic information platform for
              Makati.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/about#identity"
                className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-secondary-300"
              >
                Our identity
              </Link>
              <Link to="/privacy" className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-secondary-300">
                Privacy
              </Link>
              <Link to="/terms" className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-secondary-300">
                Terms
              </Link>
              <Link to="/status" className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-secondary-300">
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
