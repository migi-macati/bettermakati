import React, { useState } from 'react';
import { X, Menu, ChevronDown, Search, CheckCircle2 } from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { isMeilisearchEnabled } from '../../lib/meilisearch';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { t } = useTranslation('common');

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
  };

  const toggleSubmenu = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-end items-center h-10">
          <div className="flex items-center space-x-4">
            <a
              href="https://bettergov.ph"
              className="text-xs text-gray-700 hover:text-primary-600 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              BetterGov
            </a>
            <a
              href="https://www.makati.gov.ph/"
              className="text-xs text-gray-700 hover:text-primary-600 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              Official Makati site
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <CheckCircle2 className="h-11 w-11 mr-3 text-primary-600" />
            <div>
              <div className="text-black font-bold">{t('site_name')}</div>
              <div className="text-xs text-gray-700">{t('site_description')}</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {mainNavigation.map(item => (
              <div key={item.label} className="relative group">
                <Link
                  to={item.href}
                  className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="ml-1 h-4 w-4 group-hover:text-primary-600" />
                  )}
                </Link>
                {item.children && (
                  <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {item.children.map(child => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              About
            </Link>
            {isMeilisearchEnabled && (
              <Link
                to="/search"
                className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                <Search className="h-4 w-4 mr-1" />
                Search
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-2 pt-2 pb-4 space-y-1 border-t border-gray-200 bg-white">
          {mainNavigation.map(item => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item.label)}
                    className="w-full flex justify-between items-center px-4 py-2 text-base font-medium text-gray-700"
                  >
                    {item.label}
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  {activeMenu === item.label && (
                    <div className="pl-6 py-2 space-y-1 bg-gray-50">
                      <Link
                        to={item.href}
                        onClick={closeMenu}
                        className="block px-4 py-2 text-sm font-medium text-gray-700"
                      >
                        All {item.label}
                      </Link>
                      {item.children.map(child => (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={closeMenu}
                          className="block px-4 py-2 text-sm text-gray-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  onClick={closeMenu}
                  className="block px-4 py-2 text-base font-medium text-gray-700"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link
            to="/about"
            onClick={closeMenu}
            className="block px-4 py-2 text-base font-medium text-gray-700"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
