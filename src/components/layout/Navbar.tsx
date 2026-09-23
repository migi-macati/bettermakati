import { useEffect, useRef, useState } from 'react';
import {
  X,
  Menu,
  ChevronDown,
  ExternalLink,
  PhoneCall,
  Search,
} from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import { Link, useLocation } from 'react-router';
import BrandMark from '../BrandMark';
import BetterBarangayContextBar from '../barangay/BetterBarangayContextBar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const { pathname, hash } = useLocation();
  const menuId = (label: string | null) =>
    label?.toLowerCase().replace(/\s+/g, '-') ?? '';
  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
  };
  const isCurrent = (href: string) =>
    href === pathname + hash || (!hash && href === pathname);
  const isSection = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveMenu(null);
      }
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);

  return (
    <>
      <div className="bg-primary-900 text-white">
        <div className="container px-4 min-h-9 flex items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
            <a
              href="tel:911"
              className="inline-flex items-center gap-1.5 font-semibold text-secondary-200 hover:text-white"
            >
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" /> Emergency
              911
            </a>
            <a
              href="tel:+63288701000"
              className="hidden sm:inline hover:text-secondary-200"
            >
              City Hall: 8870-1000
            </a>
            <Link
              to="/hotlines"
              className="underline underline-offset-2 hover:text-secondary-200"
            >
              All hotlines
            </Link>
          </div>
          <a
            href="https://www.makati.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-primary-100 hover:text-white"
          >
            Official Makati site{' '}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
      <nav
        ref={nav}
        aria-label="Main navigation"
        className="bg-[#fffdf8]/95 backdrop-blur-md border-b border-[#eadfca] sticky top-0 z-50"
        onKeyDown={event => {
          if (event.key === 'Escape') {
            const control = isOpen
              ? 'mobile-menu-toggle'
              : `desktop-toggle-${menuId(activeMenu)}`;
            closeMenu();
            document.getElementById(control)?.focus();
          }
        }}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
        }}
      >
        <div className="container px-4">
          <div className="flex justify-between items-center py-3 gap-3">
            <div onClick={closeMenu}>
              <BrandMark />
            </div>
            <div className="hidden xl:flex items-center gap-1">
              {mainNavigation.map(item => {
                const expanded = activeMenu === item.label;
                const current =
                  isSection(item.href) ||
                  item.children?.some(child =>
                    isSection(child.href.split('#')[0].split('?')[0])
                  );
                return (
                  <div key={item.label} className="relative">
                    {item.children ? (
                      <button
                        id={`desktop-toggle-${menuId(item.label)}`}
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`desktop-panel-${menuId(item.label)}`}
                        onClick={() =>
                          setActiveMenu(expanded ? null : item.label)
                        }
                        className={`inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-semibold whitespace-nowrap hover:bg-primary-50 ${current ? 'text-primary-800 bg-primary-50' : 'text-gray-700'}`}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={closeMenu}
                        aria-current={isCurrent(item.href) ? 'page' : undefined}
                        className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-gray-700 hover:bg-primary-50"
                      >
                        {item.label}
                      </Link>
                    )}
                    {item.children && (
                      <div
                        id={`desktop-panel-${menuId(item.label)}`}
                        hidden={!expanded}
                        className="absolute right-0 top-full mt-2 w-72 max-h-[70dvh] overflow-y-auto rounded-2xl shadow-xl bg-white border border-gray-200 p-2"
                      >
                        {item.children.map(child => (
                          <Link
                            key={child.label}
                            to={child.href}
                            onClick={closeMenu}
                            aria-current={
                              isCurrent(child.href) ? 'page' : undefined
                            }
                            className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link
                to="/search"
                onClick={closeMenu}
                aria-label="Search BetterMakati"
                className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-800 hover:bg-primary-100"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
            <div className="flex items-center gap-1 xl:hidden">
              <Link
                to="/search"
                onClick={closeMenu}
                aria-label="Search BetterMakati"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-primary-800 hover:bg-primary-50"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </Link>
              <button
                id="mobile-menu-toggle"
                type="button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setActiveMenu(null);
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 hover:bg-primary-50"
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
              >
                {isOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        <BetterBarangayContextBar />
        <div
          id="mobile-navigation"
          hidden={!isOpen}
          className="xl:hidden border-t border-[#eadfca] bg-[#fffdf8]"
        >
          <div className="container px-3 py-3 space-y-1 max-h-[70dvh] overflow-y-auto overscroll-contain">
            {mainNavigation.map(item => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === item.label ? null : item.label
                        )
                      }
                      aria-expanded={activeMenu === item.label}
                      aria-controls={`mobile-panel-${menuId(item.label)}`}
                      className="w-full min-h-12 flex justify-between items-center rounded-lg px-3 py-3 font-semibold text-gray-800 hover:bg-primary-50"
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-5 w-5 transition-transform ${activeMenu === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      id={`mobile-panel-${menuId(item.label)}`}
                      hidden={activeMenu !== item.label}
                      className="ml-3 border-l-2 border-primary-200 pl-2 py-1"
                    >
                      {item.children.map(child => (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={closeMenu}
                          aria-current={
                            isCurrent(child.href) ? 'page' : undefined
                          }
                          className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-primary-50"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    onClick={closeMenu}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    className="flex min-h-12 items-center rounded-lg px-3 py-3 font-semibold text-gray-800 hover:bg-primary-50"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
