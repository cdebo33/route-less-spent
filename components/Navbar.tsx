'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '@/components/ThemeProvider'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <span className="text-white text-lg">✈</span>
            </div>
            <span className="font-bold text-white text-lg">
              Route <span className="text-primary-400">Less</span> Spent
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-400 hover:text-white font-medium transition-colors text-sm">
              Home
            </Link>
            <Link href="/planner" className="text-gray-400 hover:text-white font-medium transition-colors text-sm">
              Planner
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white font-medium transition-colors text-sm">
              Pricing
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-gray-400 hover:text-primary-400 font-medium transition-colors">
              Go Pro
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link href="/planner" className="btn-primary text-sm py-2 px-4">
              Plan a Trip
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-gray-300 hover:text-primary-400 font-medium transition-colors">
                Home
              </Link>
              <Link href="/planner" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-gray-300 hover:text-primary-400 font-medium transition-colors">
                Planner
              </Link>
              <Link href="/pricing" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-gray-300 hover:text-primary-400 font-medium transition-colors">
                Pricing
              </Link>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={toggleTheme}
                  className="px-2 py-2 text-gray-300 hover:text-primary-400 font-medium transition-colors text-left flex items-center gap-2"
                >
                  {theme === 'dark' ? (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" /></svg>Light Mode</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>Dark Mode</>
                  )}
                </button>
                <Link href="/planner" onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center">
                  Plan a Trip →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
