import React, { useState } from 'react';
import { X, Menu, ChevronDown, ExternalLink, PhoneCall } from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import { Link } from 'react-router';
import BrandMark from '../BrandMark';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
  };

  const toggleSubmenu = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  return (
    <>
      <div className="bg-primary-900 text-white">
        <div className="container mx-auto px-4 min-h-9 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap py-2">
            <a href="tel:911" className="inline-flex items-center gap-1.5 font-semibold text-secondary-200 hover:text-white">
              <PhoneCall className="h-3.5 w-3.5" /> Emergency 911
            </a>
            <span className="text-primary-200">•</span>
            <a href="tel:+63288701000" className="hover:text-secondary-200">City Hall: 8870-1000</a>
            <span className="text-primary-200">•</span>
            <Link to="/hotlines" className="text-white underline underline-offset-2 hover:text-secondary-200">More hotlines</Link>
          </div>
          <a
            href="https://www.makati.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-primary-100 hover:text-white"
          >
            Official Makati site <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <nav className="bg-[#fffdf8]/95 backdrop-blur-md border-b border-[#eadfca] sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3.5">
            <BrandMark />

            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {mainNavigation.map(item => (
                <div key={item.label} className="relative group">
                  <Link
                    to={item.href}
                    className="flex items-center text-[15px] text-gray-700 hover:text-primary-700 font-semibold transition-colors"
                  >
                    {item.label}
                    {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
                  </Link>
                  {item.children && (
                    <div className="absolute left-0 mt-3 w-64 rounded-xl shadow-xl bg-white border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 overflow-hidden">
                      <div className="py-2">
                        {item.children.map(child => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-primary-50"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'} border-t border-[#eadfca] bg-[#fffdf8]`}>
          <div className="container mx-auto px-2 py-3 space-y-1">
            {mainNavigation.map(item => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item.label)}
                      className="w-full flex justify-between items-center px-4 py-2.5 text-base font-semibold text-gray-700"
                    >
                      {item.label}
                      <ChevronDown className={`h-5 w-5 transition-transform ${activeMenu === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {activeMenu === item.label && (
                      <div className="ml-3 border-l border-primary-200 pl-3 py-1">
                        <Link
                          to={item.href}
                          onClick={closeMenu}
                          className="block px-3 py-2 text-sm font-semibold text-primary-800"
                        >
                          All {item.label}
                        </Link>
                        {item.children.map(child => (
                          <Link
                            key={child.label}
                            to={child.href}
                            onClick={closeMenu}
                            className="block px-3 py-2 text-sm text-gray-700"
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
                    className="block px-4 py-2.5 text-base font-semibold text-gray-700"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link to="/hotlines" onClick={closeMenu} className="block px-4 py-2.5 text-sm font-semibold text-primary-800">
              Hotlines
            </Link>
            <Link to="/about" onClick={closeMenu} className="block px-4 py-2.5 text-sm text-gray-600">
              About BetterMakati
            </Link>
            <a
              href="https://www.makati.gov.ph/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-4 py-2.5 text-sm text-primary-700"
            >
              Official Makati site <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
