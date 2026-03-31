'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function SuccessPage() {
  useEffect(() => {
    // Mark user as Pro in localStorage (simplified - in production verify server-side)
    localStorage.setItem('rls_pro', 'true')
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="card shadow-xl">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Welcome to Pro!
            </h1>
            <p className="text-gray-500 mb-2">
              Your subscription is now active. You have unlimited itinerary generation.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              ✨ Pro — Unlimited itineraries
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/planner" className="btn-primary w-full">
                Start Planning →
              </Link>
              <Link href="/" className="btn-secondary w-full">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
