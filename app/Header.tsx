'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
            DA
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            DealAnalytic
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-4 sm:gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Contact
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            Start Free Trial
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition py-2"
          >
            Dashboard
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition py-2"
          >
            Contact
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            Start Free Trial
          </Link>
        </div>
      )}
    </header>
  );
}
