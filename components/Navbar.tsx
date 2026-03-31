'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <span className="text-white text-lg">✈</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">
              Route <span className="text-primary-600">Less</span> Spent
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Home
            </Link>
            <Link href="/planner" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Planner
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Pricing
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Go Pro
            </Link>
            <Link href="/planner" className="btn-primary text-sm py-2 px-4">
              Plan a Trip
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
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
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/planner" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Planner
              </Link>
              <Link href="/pricing" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Pricing
              </Link>
              <div className="pt-2 flex flex-col gap-2">
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
