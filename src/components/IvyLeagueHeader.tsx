'use client';

import Image from "next/image";
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  isScrolled?: boolean;
}

export default function IvyLeagueHeader({ isScrolled = false }: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const countriesMenu = [
    'USA',
    'UK',
    'Germany',
    'Italy',
    'France',
    'Canada',
    'Australia'
  ];

  const handleMouseEnter = (dropdown: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-0">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Gateway Global Logo"
              width={200}
              height={67}
              className="object-contain w-36 h-auto sm:w-44 lg:w-52"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 transition-colors text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 transition-colors text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 lg:hidden z-40">
              <nav className="flex flex-col py-4 px-4 space-y-2">
                <a href="/" className="text-gray-700 font-medium py-2 px-4 hover:bg-gray-50 rounded">Home</a>
                <a href="#" className="text-gray-700 font-medium py-2 px-4 hover:bg-gray-50 rounded">About Us</a>

                {/* Experience Centres Mobile Dropdown */}
                <div>
                  <button
                    className="w-full text-left text-gray-700 font-medium py-2 px-4 hover:bg-gray-50 rounded flex items-center justify-between"
                    onClick={() => setActiveDropdown(activeDropdown === 'experienceCentres' ? null : 'experienceCentres')}
                  >
                    Experience Centres
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f46c44' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'experienceCentres' && (
                    <div className="pl-4 mt-2 space-y-1">
                      <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 rounded">Delhi</a>
                      <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 rounded">Mumbai</a>
                    </div>
                  )}
                </div>

                {/* Destinations Mobile Dropdown */}
                <div>
                  <button
                    className="w-full text-left text-gray-700 font-medium py-2 px-4 hover:bg-gray-50 rounded flex items-center justify-between"
                    onClick={() => setActiveDropdown(activeDropdown === 'destinations' ? null : 'destinations')}
                  >
                    Destinations
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f46c44' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'destinations' && (
                    <div className="pl-4 mt-2 space-y-1">
                      {countriesMenu.map((item, index) => (
                        <a
                          key={index}
                          href="#"
                          className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-500 rounded"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Test Prep Mobile Dropdown */}
                <div>
                  <button
                    className="w-full text-left text-gray-700 font-medium py-2 px-4 hover:bg-gray-50 rounded flex items-center justify-between"
                    onClick={() => setActiveDropdown(activeDropdown === 'testPrep' ? null : 'testPrep')}
                  >
                    Test Prep
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f46c44' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'testPrep' && (
                    <div className="pl-4 mt-2 space-y-1">
                      <a href="#" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-500 rounded">IELTS</a>
                      <a href="#" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-500 rounded">GRE</a>
                    </div>
                  )}
                </div>

                {/* Fly Finance Mobile Dropdown */}
                <div>
                  <button
                    className="w-full text-left text-gray-700 font-medium py-2 px-4 hover:bg-gray-50 rounded flex items-center justify-between"
                    onClick={() => setActiveDropdown(activeDropdown === 'flyFinance' ? null : 'flyFinance')}
                  >
                    Fly Finance
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f46c44' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'flyFinance' && (
                    <div className="pl-4 mt-2 space-y-1">
                      <a href="#" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-500 rounded">Loans</a>
                      <a href="#" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-500 rounded">Scholarships</a>
                    </div>
                  )}
                </div>

                {/* Fly Homes Mobile Dropdown */}
                <div>
                  <button
                    className="w-full text-left text-gray-700 font-medium py-2 px-4 hover:bg-gray-50 rounded flex items-center justify-between"
                    onClick={() => setActiveDropdown(activeDropdown === 'flyHomes' ? null : 'flyHomes')}
                  >
                    Fly Homes
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#f46c44' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'flyHomes' && (
                    <div className="pl-4 mt-2 space-y-1">
                      <a href="#" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-500 rounded">Accommodation</a>
                      <a href="#" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-500 rounded">Utilities</a>
                    </div>
                  )}
                </div>

                <a href="#" className="text-gray-700 font-medium py-2 px-4 hover:bg-gray-50 rounded">Community</a>
              </nav>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-4 xl:space-x-6 items-center text-sm relative">
            <a href="#" className="font-medium flex items-center transition-colors text-gray-700 hover:text-orange-500">
              About Us
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="#f46c44"
                viewBox="0 0 24 24"
                style={{ color: '#f46c44' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>

            {/* Experience Centres Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('experienceCentres')}
              onMouseLeave={handleMouseLeave}
            >
              <a href="#" className="font-medium flex items-center transition-colors text-gray-700 hover:text-orange-500">
                Experience Centres
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="#f46c44"
                  viewBox="0 0 24 24"
                  style={{ color: '#f46c44' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              {activeDropdown === 'experienceCentres' && (
                <div
                  className="absolute top-full left-0 pt-2 w-48 z-50"
                  onMouseEnter={() => handleMouseEnter('experienceCentres')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-white shadow-lg rounded-lg py-2 border border-gray-200">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">Delhi</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">Mumbai</a>
                  </div>
                </div>
              )}
            </div>

            {/* Destinations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('destinations')}
              onMouseLeave={handleMouseLeave}
            >
              <a href="#" className="font-medium flex items-center transition-colors text-gray-700 hover:text-orange-500">
                Destinations
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="#f46c44"
                  viewBox="0 0 24 24"
                  style={{ color: '#f46c44' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              {activeDropdown === 'destinations' && (
                <div
                  className="absolute top-full left-0 pt-2 w-48 z-50"
                  onMouseEnter={() => handleMouseEnter('destinations')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-white shadow-lg rounded-lg py-2 border border-gray-200">
                    {countriesMenu.map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Test Prep Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('testPrep')}
              onMouseLeave={handleMouseLeave}
            >
              <a href="#" className="font-medium flex items-center transition-colors text-gray-700 hover:text-orange-500">
                Test Prep
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="#f46c44"
                  viewBox="0 0 24 24"
                  style={{ color: '#f46c44' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              {activeDropdown === 'testPrep' && (
                <div
                  className="absolute top-full left-0 pt-2 w-48 z-50"
                  onMouseEnter={() => handleMouseEnter('testPrep')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-white shadow-lg rounded-lg py-2 border border-gray-200">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">IELTS</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">GRE</a>
                  </div>
                </div>
              )}
            </div>

            {/* Fly Finance Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('flyFinance')}
              onMouseLeave={handleMouseLeave}
            >
              <a href="#" className="font-medium flex items-center transition-colors text-gray-700 hover:text-orange-500">
                Fly Finance
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="#f46c44"
                  viewBox="0 0 24 24"
                  style={{ color: '#f46c44' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              {activeDropdown === 'flyFinance' && (
                <div
                  className="absolute top-full left-0 pt-2 w-48 z-50"
                  onMouseEnter={() => handleMouseEnter('flyFinance')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-white shadow-lg rounded-lg py-2 border border-gray-200">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">Loans</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">Scholarships</a>
                  </div>
                </div>
              )}
            </div>

            {/* Fly Homes Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('flyHomes')}
              onMouseLeave={handleMouseLeave}
            >
              <a href="#" className="font-medium flex items-center transition-colors text-gray-700 hover:text-orange-500">
                Fly Homes
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="#f46c44"
                  viewBox="0 0 24 24"
                  style={{ color: '#f46c44' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              {activeDropdown === 'flyHomes' && (
                <div
                  className="absolute top-full left-0 pt-2 w-48 z-50"
                  onMouseEnter={() => handleMouseEnter('flyHomes')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-white shadow-lg rounded-lg py-2 border border-gray-200">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">Accommodation</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">Utilities</a>
                  </div>
                </div>
              )}
            </div>

            <a href="#" className="font-medium flex items-center transition-colors text-gray-700 hover:text-orange-500">
              Community
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="#f46c44"
                viewBox="0 0 24 24"
                style={{ color: '#f46c44' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

