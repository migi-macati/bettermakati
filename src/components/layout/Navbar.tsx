import { useEffect, useRef, useState } from 'react';
import {
  X,
  Menu,
  ChevronDown,
  ExternalLink,
  PhoneCall,
  Search,
  MapPin,
} from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import { Link, useLocation, useNavigate } from 'react-router';
import BrandMark from '../BrandMark';
import BetterBarangayContextBar from '../barangay/BetterBarangayContextBar';
import { barangays } from '../../data/barangays';
import {
  isBarangaySliceableHref,
  useBarangayScope,
  withBarangayScope,
} from '../../hooks/useBarangayScope';
import type { NavigationItem } from '../../types';

const menuId = (label: string | null) =>
  label?.toLowerCase().replace(/\s+/g, '-') ?? '';

const hrefParts = (href: string) => {
  const [pathAndSearch, targetHash = ''] = href.split('#', 2);
  const [path, targetSearch = ''] = pathAndSearch.split('?', 2);
  return {
    path,
    hash: targetHash ? '#' + targetHash : '',
    search: new URLSearchParams(targetSearch),
  };
};

const comparableSearch = (params: URLSearchParams) => {
  const copy = new URLSearchParams(params);
  copy.delete('barangay');
  return [...copy.entries()]
    .sort(([leftKey, leftValue], [rightKey, rightValue]) =>
      leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue)
    )
    .map(([key, value]) => key + '=' + value)
    .join('&');
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const { preferredBarangay, rememberBarangay } = useBarangayScope();

  const currentSearch = new URLSearchParams(search);

  const searchHref = preferredBarangay
    ? withBarangayScope('/search', preferredBarangay.slug)
    : '/search';

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
  };

  const isCurrent = (href: string) => {
    const target = hrefParts(href);
    if (target.path !== pathname) return false;
    if (
      comparableSearch(target.search) !== comparableSearch(currentSearch)
    ) {
      return false;
    }
    return !target.hash || target.hash === hash;
  };

  const isSection = (href: string) => {
    const { path } = hrefParts(href);
    return pathname === path || pathname.startsWith(path + '/');
  };

  const familyOwnsPath = (item: NavigationItem) => {
    if (isSection(item.href)) return true;
    if (item.children?.some(child => isSection(child.href))) return true;

    if (item.label === 'City' && pathname.startsWith('/officials/')) return true;
    if (item.label === 'Participate' && pathname === '/get-involved') return true;

    return false;
  };

  const currentFamily = mainNavigation.find(familyOwnsPath);

  const scopedHref = (href: string) =>
    preferredBarangay && isBarangaySliceableHref(href)
      ? withBarangayScope(href, preferredBarangay.slug)
      : href;

  const toggleMobileMenu = () => {
    if (isOpen) {
      closeMenu();
      return;
    }

    setIsOpen(true);
    setActiveMenu(currentFamily?.children ? currentFamily.label : null);
  };

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

  useEffect(() => {
    setIsOpen(false);
    setActiveMenu(null);
  }, [pathname, search, hash]);

  return (
    <>
      <div className="bg-primary-900 text-white">
        <div className="container flex min-h-11 items-center justify-between gap-4 px-5 text-xs md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-3">
            <a
              href="tel:911"
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-secondary-200 hover:text-white focus-visible:outline-secondary-300"
            >
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" /> Emergency
              911
            </a>
            <a
              href="tel:+63288701000"
              className="hidden min-h-11 items-center sm:inline-flex hover:text-secondary-200 focus-visible:outline-secondary-300"
            >
              City Hall: 8870-1000
            </a>
            <Link
              to="/hotlines"
              className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-secondary-200 focus-visible:outline-secondary-300"
            >
              All hotlines
            </Link>
          </div>
          <a
            href="https://www.makati.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-11 items-center gap-1 text-primary-100 hover:text-white sm:inline-flex focus-visible:outline-secondary-300"
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
        <div className="container px-5 md:px-6 lg:px-8">
          <div className="flex w-full items-center py-3 gap-3">
            <div onClick={closeMenu} className="shrink-0">
              <BrandMark />
            </div>

            <div className="ml-auto hidden xl:flex items-center gap-1">
              {mainNavigation.map(item => {
                const expanded = activeMenu === item.label;
                const current = familyOwnsPath(item);
                const directCurrent = isCurrent(item.href);

                return (
                  <div key={item.label} className="relative">
                    {item.children ? (
                      <div
                        className={
                          'flex items-stretch rounded-lg ' +
                          (current ? 'bg-primary-50 text-primary-800' : 'text-gray-700')
                        }
                      >
                        <Link
                          to={scopedHref(item.href)}
                          onClick={closeMenu}
                          aria-current={directCurrent ? 'page' : undefined}
                          className="inline-flex min-h-11 items-center rounded-l-lg px-2.5 text-sm font-semibold whitespace-nowrap hover:bg-primary-50"
                        >
                          {item.label}
                        </Link>
                        <button
                          id={`desktop-toggle-${menuId(item.label)}`}
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`desktop-panel-${menuId(item.label)}`}
                          aria-label={`${expanded ? 'Close' : 'Open'} ${item.label} menu`}
                          onClick={() =>
                            setActiveMenu(expanded ? null : item.label)
                          }
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-r-lg hover:bg-primary-100"
                        >
                          <ChevronDown
                            aria-hidden="true"
                            className={`h-4 w-4 transition-transform ${
                              expanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    ) : (
                      <Link
                        to={scopedHref(item.href)}
                        onClick={closeMenu}
                        aria-current={directCurrent ? 'page' : undefined}
                        className={
                          'inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-primary-50 ' +
                          (current
                            ? 'bg-primary-50 text-primary-800'
                            : 'text-gray-700')
                        }
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
                            to={scopedHref(child.href)}
                            onClick={closeMenu}
                            aria-current={isCurrent(child.href) ? 'page' : undefined}
                            className={
                              'flex min-h-11 items-center rounded-lg px-3 py-2 text-sm hover:bg-primary-50 hover:text-primary-800 ' +
                              (isCurrent(child.href)
                                ? 'bg-primary-50 font-bold text-primary-800'
                                : 'text-gray-700')
                            }
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {preferredBarangay && (
                <div className="relative ml-2 rounded-full focus-within:ring-2 focus-within:ring-primary-700 focus-within:ring-offset-2">
                  <div className="pointer-events-none inline-flex min-h-11 items-center gap-1.5 rounded-full border border-secondary-200 bg-secondary-50 px-3 text-sm font-extrabold text-primary-900">
                    <MapPin className="h-4 w-4 text-secondary-800" aria-hidden="true" />
                    Better{preferredBarangay.name.replace(/\s+/g, '')}
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                  <select
                    value={preferredBarangay.slug}
                    onChange={event => {
                      const slug = event.target.value;
                      rememberBarangay(slug);
                      navigate(slug ? '/barangays/' + slug : '/barangays');
                    }}
                    aria-label="Open or change your barangay"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  >
                    <option value="">All barangays</option>
                    {barangays.map(item => (
                      <option key={item.slug} value={item.slug}>
                        Better{item.name.replace(/\s+/g, '')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Link
                to={searchHref}
                onClick={closeMenu}
                aria-label="Search BetterMakati"
                className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 text-sm font-bold text-primary-800 hover:bg-primary-100"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                <span>Search</span>
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-1 xl:hidden">
              {preferredBarangay && (
                <Link
                  to={'/barangays/' + preferredBarangay.slug}
                  onClick={closeMenu}
                  aria-label={
                    'Open Better' + preferredBarangay.name.replace(/\s+/g, '')
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-secondary-800 hover:bg-secondary-50"
                >
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </Link>
              )}
              <Link
                to={searchHref}
                onClick={closeMenu}
                aria-label="Search BetterMakati"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-primary-800 hover:bg-primary-50"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </Link>
              <button
                id="mobile-menu-toggle"
                type="button"
                onClick={toggleMobileMenu}
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
            <label className="mb-3 block rounded-xl border border-secondary-200 bg-secondary-50 p-3">
              <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.08em] text-primary-800">
                Your barangay
              </span>
              <select
                value={preferredBarangay?.slug ?? ''}
                onChange={event => {
                  const slug = event.target.value;
                  rememberBarangay(slug);
                  closeMenu();
                  navigate(slug ? '/barangays/' + slug : '/barangays');
                }}
                className="min-h-11 w-full rounded-lg border border-secondary-200 bg-white px-3 text-sm font-bold text-primary-900"
              >
                <option value="">Choose a barangay</option>
                {barangays.map(item => (
                  <option key={item.slug} value={item.slug}>
                    Better{item.name.replace(/\s+/g, '')}
                  </option>
                ))}
              </select>
            </label>

            {mainNavigation.map(item => {
              const current = familyOwnsPath(item);
              const expanded = activeMenu === item.label;

              return (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <div
                        className={
                          'flex min-h-12 items-stretch rounded-lg ' +
                          (current ? 'bg-primary-50' : '')
                        }
                      >
                        <Link
                          to={scopedHref(item.href)}
                          onClick={closeMenu}
                          aria-current={isCurrent(item.href) ? 'page' : undefined}
                          className={
                            'flex flex-1 items-center rounded-l-lg px-3 py-3 font-semibold hover:bg-primary-50 ' +
                            (current ? 'text-primary-800' : 'text-gray-800')
                          }
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenu(expanded ? null : item.label)
                          }
                          aria-expanded={expanded}
                          aria-controls={`mobile-panel-${menuId(item.label)}`}
                          aria-label={`${expanded ? 'Close' : 'Open'} ${item.label} menu`}
                          className={
                            'flex min-w-12 items-center justify-center rounded-r-lg hover:bg-primary-100 ' +
                            (current ? 'text-primary-800' : 'text-gray-700')
                          }
                        >
                          <ChevronDown
                            aria-hidden="true"
                            className={`h-5 w-5 transition-transform ${
                              expanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <div
                        id={`mobile-panel-${menuId(item.label)}`}
                        hidden={!expanded}
                        className="ml-3 border-l-2 border-primary-200 pl-2 py-1"
                      >
                        {item.children.map(child => (
                          <Link
                            key={child.label}
                            to={scopedHref(child.href)}
                            onClick={closeMenu}
                            aria-current={isCurrent(child.href) ? 'page' : undefined}
                            className={
                              'flex min-h-11 items-center rounded-lg px-3 py-2 text-sm hover:bg-primary-50 ' +
                              (isCurrent(child.href)
                                ? 'bg-primary-50 font-bold text-primary-800'
                                : 'text-gray-700')
                            }
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={scopedHref(item.href)}
                      onClick={closeMenu}
                      aria-current={isCurrent(item.href) ? 'page' : undefined}
                      className={
                        'flex min-h-12 items-center rounded-lg px-3 py-3 font-semibold hover:bg-primary-50 ' +
                        (current
                          ? 'bg-primary-50 text-primary-800'
                          : 'text-gray-800')
                      }
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
