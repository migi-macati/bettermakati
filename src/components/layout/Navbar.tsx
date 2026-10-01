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
import LanguageSwitcher from '../LanguageSwitcher';
import BetterBarangayContextBar from '../barangay/BetterBarangayContextBar';
import { barangays } from '../../data/barangays';
import {
  isBarangaySliceableHref,
  useBarangayScope,
  withBarangayScope,
} from '../../hooks/useBarangayScope';
import type { NavigationItem } from '../../types';
import { useTranslation } from 'react-i18next';

const menuId = (id: string | null) => id ?? '';

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
  const { t } = useTranslation();
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

    if (item.id === 'city' && pathname.startsWith('/officials/')) return true;
    if (item.id === 'participate' && pathname === '/get-involved') return true;

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
    setActiveMenu(currentFamily?.children ? currentFamily.id : null);
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
      <div className="bm-utility-bar text-white">
        <div className="container flex min-h-11 items-center justify-between gap-4 px-5 text-xs md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-3">
            <a
              href="tel:911"
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-secondary-200 hover:text-white focus-visible:outline-secondary-300"
            >
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" /> {t('navbar.emergency911')}
            </a>
            <a
              href="tel:+63288701000"
              className="hidden min-h-11 items-center sm:inline-flex hover:text-secondary-200 focus-visible:outline-secondary-300"
            >
              {t('navbar.cityHallPhone')}
            </a>
            <Link
              to="/hotlines"
              className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-secondary-200 focus-visible:outline-secondary-300"
            >
              {t('navbar.allHotlines')}
            </Link>
          </div>
          <a
            href="https://www.makati.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-11 items-center gap-1 text-primary-100 hover:text-white sm:inline-flex focus-visible:outline-secondary-300"
          >
            {t('navbar.officialMakatiSite')}{' '}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
      <nav
        ref={nav}
        aria-label={t('navbar.mainNavigation')}
        className="bm-shell-nav sticky top-0 z-50"
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
            <div className="shrink-0">
              <BrandMark />
            </div>

            <div className="ml-auto hidden 2xl:flex items-center gap-1">
              {mainNavigation.map(item => {
                const expanded = activeMenu === item.id;
                const current = familyOwnsPath(item);
                const directCurrent = isCurrent(item.href);

                return (
                  <div key={item.id} className="relative">
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
                          {t(item.labelKey)}
                        </Link>
                        <button
                          id={`desktop-toggle-${menuId(item.id)}`}
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`desktop-panel-${menuId(item.id)}`}
                          aria-label={t(expanded ? 'shell.closeMenu' : 'shell.openMenu', { label: t(item.labelKey) })}
                          onClick={() =>
                            setActiveMenu(expanded ? null : item.id)
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
                        {t(item.labelKey)}
                      </Link>
                    )}

                    {item.children && (
                      <div
                        id={`desktop-panel-${menuId(item.id)}`}
                        hidden={!expanded}
                        className="bm-shell-panel absolute right-0 top-full mt-2 w-72 max-h-[70dvh] overflow-y-auto p-2"
                      >
                        {item.children.map(child => (
                          <Link
                            key={child.id}
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
                            {t(child.labelKey)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {preferredBarangay && (
                <div className="relative ml-2 hidden rounded-full focus-within:ring-2 focus-within:ring-primary-700 focus-within:ring-offset-2 2xl:block">
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
                    aria-label={t('navbar.changeBarangay')}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  >
                    <option value="">{t('navbar.allBarangays')}</option>
                    {barangays.map(item => (
                      <option key={item.slug} value={item.slug}>
                        Better{item.name.replace(/\s+/g, '')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <LanguageSwitcher />

              <Link
                to={searchHref}
                onClick={closeMenu}
                aria-label={t('navbar.searchBetterMakati')}
                className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-secondary-300 bg-secondary-100 px-3.5 text-sm font-bold text-primary-900 shadow-sm hover:bg-secondary-200"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                <span>{t('navbar.search')}</span>
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-1 2xl:hidden">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              {preferredBarangay && (
                <Link
                  to={'/barangays/' + preferredBarangay.slug}
                  onClick={closeMenu}
                  aria-label={
                    'Open Better' + preferredBarangay.name.replace(/\s+/g, '')
                  }
                  className="hidden h-11 w-11 items-center justify-center rounded-lg border border-secondary-200 bg-secondary-50 text-secondary-800 hover:bg-secondary-100 sm:flex"
                >
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </Link>
              )}
              <Link
                to={searchHref}
                onClick={closeMenu}
                aria-label={t('navbar.searchBetterMakati')}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-secondary-200 bg-secondary-50 text-primary-900 hover:bg-secondary-100"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </Link>
              <button
                id="mobile-menu-toggle"
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-primary-50"
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                aria-label={t(isOpen ? 'navbar.closeMainMenu' : 'navbar.openMainMenu')}
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
          className="bm-shell-mobile-menu 2xl:hidden border-t"
        >
          <div className="container px-3 py-3 space-y-1 max-h-[70dvh] overflow-y-auto overscroll-contain">
            <div className="flex sm:hidden items-center justify-between gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-3">
              <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary-800">{t('language.label')}</span>
              <LanguageSwitcher />
            </div>
            <label className="mb-3 block rounded-xl border border-secondary-200 bg-secondary-50 p-3">
              <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.08em] text-primary-800">
                {t('navbar.yourBarangay')}
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
                <option value="">{t('navbar.chooseBarangay')}</option>
                {barangays.map(item => (
                  <option key={item.slug} value={item.slug}>
                    Better{item.name.replace(/\s+/g, '')}
                  </option>
                ))}
              </select>
            </label>

            {mainNavigation.map(item => {
              const current = familyOwnsPath(item);
              const expanded = activeMenu === item.id;

              return (
                <div key={item.id}>
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
                          {t(item.labelKey)}
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenu(expanded ? null : item.id)
                          }
                          aria-expanded={expanded}
                          aria-controls={`mobile-panel-${menuId(item.id)}`}
                          aria-label={t(expanded ? 'shell.closeMenu' : 'shell.openMenu', { label: t(item.labelKey) })}
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
                        id={`mobile-panel-${menuId(item.id)}`}
                        hidden={!expanded}
                        className="ml-3 border-l-2 border-primary-200 pl-2 py-1"
                      >
                        {item.children.map(child => (
                          <Link
                            key={child.id}
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
                            {t(child.labelKey)}
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
                      {t(item.labelKey)}
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
