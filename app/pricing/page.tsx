'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const freeFeatures = [
  '3 itineraries per lifetime',
  'Day-by-day travel plans',
  'Cost breakdowns',
  'Money-saving tips',
  'Booking.com & Skyscanner links',
  'All destination types',
]

const proFeatures = [
  'Unlimited itineraries',
  'Day-by-day travel plans',
  'Detailed cost breakdowns',
  'Money-saving tips & hacks',
  'Booking.com & Skyscanner links',
  'All destination types',
  'Priority AI generation',
  'Longer trip durations (30+ days)',
  'Cancel anytime',
]

const faqs = [
  {
    q: 'Can I cancel my Pro subscription anytime?',
    a: 'Yes, absolutely. You can cancel your Pro subscription at any time from your account settings. You\'ll keep Pro access until the end of your billing period.',
  },
  {
    q: 'What does "unlimited itineraries" mean?',
    a: 'With Pro, you can generate as many travel itineraries as you want — no monthly caps, no restrictions. Plan multiple trips, re-generate to explore different options, or plan for different dates.',
  },
  {
    q: 'Is the free tier really free? No credit card needed?',
    a: 'Yes! The free tier gives you 3 itineraries with no credit card required. Your usage is tracked in your browser.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) via Stripe — a secure, industry-standard payment processor.',
  },
  {
    q: 'How does the AI generate my itinerary?',
    a: 'We use Claude AI (by Anthropic) to generate personalized itineraries based on your destination, budget, travel dates, accommodation style, and trip vibe. The AI has knowledge of local attractions, typical costs, transport options, and insider tips.',
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleUpgrade = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create checkout session')
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gray-950 border-b border-gray-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Simple, honest pricing
            </h1>
            <p className="text-xl text-gray-400">
              Start free. Upgrade when you need unlimited itineraries.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

              {/* Free Tier */}
              <div className="card border-2 border-gray-700 hover:border-gray-600 transition-colors">
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 bg-gray-800 text-gray-400 text-xs font-semibold rounded-full mb-3">
                    FREE
                  </div>
                  <h2 className="text-2xl font-bold text-white">Explorer</h2>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$0</span>
                    <span className="text-gray-500">/ forever</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Perfect for trying the tool or planning an occasional trip.
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {freeFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/planner" className="btn-secondary w-full text-center block">
                  Start Free →
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="relative card border-2 border-primary-500 bg-gradient-to-b from-primary-950 to-gray-900">
                {/* Popular badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    ✨ MOST POPULAR
                  </div>
                </div>

                <div className="mb-6 pt-2">
                  <div className="inline-flex items-center px-3 py-1 bg-primary-900 text-primary-300 text-xs font-semibold rounded-full mb-3">
                    PRO
                  </div>
                  <h2 className="text-2xl font-bold text-white">Wanderer</h2>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$9.99</span>
                    <span className="text-gray-400">/ month</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    For frequent travelers and trip planners who need unlimited access.
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {proFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-gray-300 ${i === 0 ? 'font-semibold text-primary-300' : ''}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {error && (
                  <div className="mb-4 p-3 bg-red-950 border border-red-800 rounded-xl text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                    loading
                      ? 'bg-primary-400 text-white cursor-wait'
                      : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/25 hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>Upgrade to Pro → $9.99/mo</>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 mt-3">
                  Secure checkout via Stripe · Cancel anytime
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔒</span>
                <span>Secured by Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">↩️</span>
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span>Powered by Claude AI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌍</span>
                <span>2,400+ trips planned</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature comparison */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              What&apos;s included?
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 font-semibold text-gray-400 w-1/2">Feature</th>
                    <th className="text-center py-3 font-semibold text-gray-400">Free</th>
                    <th className="text-center py-3 font-semibold text-primary-400">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    ['Itinerary generations', '3 total', 'Unlimited'],
                    ['Day-by-day planning', '✓', '✓'],
                    ['Cost breakdowns', '✓', '✓'],
                    ['Money-saving tips', '✓', '✓'],
                    ['Hotel booking links', '✓', '✓'],
                    ['Flight search links', '✓', '✓'],
                    ['Trip length', 'Up to 14 days', '30+ days'],
                    ['AI generation speed', 'Standard', 'Priority'],
                    ['New features first', '–', '✓'],
                  ].map(([feature, free, pro]) => (
                    <tr key={feature} className="hover:bg-gray-800">
                      <td className="py-3 text-gray-300 font-medium">{feature}</td>
                      <td className="py-3 text-center text-gray-500">{free}</td>
                      <td className="py-3 text-center">
                        <span className={pro === '–' ? 'text-gray-700' : 'text-primary-400 font-semibold'}>
                          {pro}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-950">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently asked questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="font-medium text-gray-100 text-sm pr-4">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-primary-600 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-black mb-3">Ready to travel smarter?</h2>
            <p className="text-primary-100 mb-8">
              Start free, no credit card required.
            </p>
            <Link href="/planner" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl hover:bg-primary-50 transition-colors text-lg">
              Plan My Trip Free →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
