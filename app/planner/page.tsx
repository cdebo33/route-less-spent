'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const FREE_LIMIT = 3
const STORAGE_KEY = 'rls_itinerary_count'
const SAVED_ITINERARIES_KEY = 'rls_saved_itineraries'

function getItineraryCount(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)
}

function incrementItineraryCount(): number {
  const count = getItineraryCount() + 1
  localStorage.setItem(STORAGE_KEY, count.toString())
  return count
}

function saveItinerary(params: {
  destination: string
  origin: string
  startDate: string
  endDate: string
  travelers: string
  days: number
  content: string
}) {
  const saved = JSON.parse(localStorage.getItem(SAVED_ITINERARIES_KEY) || '[]')
  const newEntry = {
    id: Date.now().toString(),
    ...params,
    createdAt: new Date().toISOString(),
  }
  saved.unshift(newEntry)
  localStorage.setItem(SAVED_ITINERARIES_KEY, JSON.stringify(saved.slice(0, 20)))
}

function downloadAsText(destination: string, startDate: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${destination.replace(/\s+/g, '-')}-itinerary-${startDate}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const accommodationStyles = [
  { value: 'hostel', label: '🛏 Hostel / Dorm', desc: 'Budget-friendly, social vibe' },
  { value: 'budget_hotel', label: '🏨 Budget Hotel', desc: 'Private room, basic amenities' },
  { value: 'airbnb', label: '🏠 Airbnb / Apartment', desc: 'Home comforts, local feel' },
  { value: 'guesthouse', label: '🌿 Guesthouse / B&B', desc: 'Local charm, often breakfast included' },
  { value: 'mid_range', label: '⭐ Mid-range Hotel', desc: '3-star comfort and value' },
]

const tripVibes = [
  { value: 'adventure', label: '🧗 Adventure', desc: 'Hiking, outdoor activities' },
  { value: 'cultural', label: '🏛 Cultural', desc: 'Museums, history, local life' },
  { value: 'foodie', label: '🍜 Foodie', desc: 'Street food, markets, restaurants' },
  { value: 'beach', label: '🏖 Beach & Relax', desc: 'Sun, sand, slow pace' },
  { value: 'city_break', label: '🏙 City Break', desc: 'Cafes, nightlife, urban exploration' },
  { value: 'off_beaten_path', label: '🗺 Off the Beaten Path', desc: 'Unique, lesser-known spots' },
]

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul]|<\/[hul]|<p|<\/p)(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
}

function PlannerContent() {
  const searchParams = useSearchParams()
  const prefilledDest = searchParams.get('destination') || ''

  const [form, setForm] = useState({
    origin: '',
    destination: prefilledDest,
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '1',
    accommodation: 'hostel',
    vibe: 'cultural',
  })

  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState('')
  const [error, setError] = useState('')
  const [usageCount, setUsageCount] = useState(0)
  const [isPro, setIsPro] = useState(false)
  const itineraryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUsageCount(getItineraryCount())
    // Check if user has pro status (simplified — in prod, verify server-side)
    setIsPro(localStorage.getItem('rls_pro') === 'true')
  }, [])

  const isAtLimit = !isPro && usageCount >= FREE_LIMIT

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    if (!form.origin || !form.destination || !form.startDate || !form.endDate || !form.budget) {
      setError('Please fill in all required fields.')
      return
    }

    const start = new Date(form.startDate)
    const end = new Date(form.endDate)
    if (end <= start) {
      setError('End date must be after start date.')
      return
    }

    if (isAtLimit) {
      setError('You\'ve used all 3 free itineraries. Upgrade to Pro for unlimited plans.')
      return
    }

    setError('')
    setLoading(true)
    setItinerary('')

    try {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, days }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate itinerary')
      }

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setItinerary(fullText)
      }

      // Save itinerary to localStorage
      saveItinerary({
        destination: form.destination,
        origin: form.origin,
        startDate: form.startDate,
        endDate: form.endDate,
        travelers: form.travelers,
        days,
        content: fullText,
      })

      // Count usage after successful generation
      const newCount = incrementItineraryCount()
      setUsageCount(newCount)

      // Scroll to result
      setTimeout(() => {
        itineraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const nights = form.startDate && form.endDate
    ? Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Build affiliate links
  const bookingLink = form.destination
    ? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(form.destination)}&checkin=${form.startDate}&checkout=${form.endDate}&group_adults=${form.travelers}&aid=304142`
    : 'https://www.booking.com'

  const skyscannerLink = form.origin && form.destination
    ? `https://www.skyscanner.com/transport/flights/${encodeURIComponent(form.origin.replace(/\s+/g, '-').toLowerCase())}/${encodeURIComponent(form.destination.replace(/\s+/g, '-').toLowerCase())}/${form.startDate.replace(/-/g, '')}/${form.endDate.replace(/-/g, '')}/?adults=${form.travelers}`
    : 'https://www.skyscanner.com'

  const remainingFree = Math.max(0, FREE_LIMIT - usageCount)

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Plan Your Budget Trip ✈️
          </h1>
          <p className="text-gray-400">
            Fill in your details and get a complete AI-generated itinerary with cost breakdowns.
          </p>

          {/* Usage indicator */}
          {!isPro && (
            <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-medium ${
              remainingFree === 0
                ? 'bg-red-950 text-red-400 border border-red-800'
                : remainingFree === 1
                ? 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                : 'bg-primary-950 text-primary-400 border border-primary-800'
            }`}>
              {remainingFree === 0 ? (
                <>⚠️ Free limit reached — <Link href="/pricing" className="underline font-bold">Upgrade to Pro</Link></>
              ) : (
                <>{remainingFree === 3 ? '🎉 ' : '⏳ '}{remainingFree} free {remainingFree === 1 ? 'itinerary' : 'itineraries'} remaining</>
              )}
            </div>
          )}
          {isPro && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-medium bg-primary-950 text-primary-400 border border-primary-800">
              ✨ Pro — Unlimited itineraries
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card space-y-5 sticky top-24">
              <h2 className="font-bold text-white text-lg border-b border-gray-700 pb-3">
                Trip Details
              </h2>

              {/* Origin & Destination */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">From <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="New York"
                    value={form.origin}
                    onChange={(e) => handleChange('origin', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">To <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Bali"
                    value={form.destination}
                    onChange={(e) => handleChange('destination', e.target.value)}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Start Date <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    className="input-field"
                    value={form.startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">End Date <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    className="input-field"
                    value={form.endDate}
                    min={form.startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              {nights > 0 && (
                <p className="text-xs text-primary-600 font-medium -mt-2">
                  📅 {nights} night{nights !== 1 ? 's' : ''} / {nights + 1} days
                </p>
              )}

              {/* Budget */}
              <div>
                <label className="label">
                  Total Budget (USD) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    className="input-field pl-7"
                    placeholder="1500"
                    min="0"
                    value={form.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                  />
                </div>
                {form.budget && nights > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    ≈ ${Math.round(parseInt(form.budget) / (nights || 1))}/day per person
                  </p>
                )}
              </div>

              {/* Travelers */}
              <div>
                <label className="label">Number of Travelers</label>
                <select
                  className="input-field"
                  value={form.travelers}
                  onChange={(e) => handleChange('travelers', e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n.toString()}>
                      {n} {n === 1 ? 'traveler' : 'travelers'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Accommodation */}
              <div>
                <label className="label">Accommodation Style</label>
                <div className="grid grid-cols-1 gap-2">
                  {accommodationStyles.map((style) => (
                    <label
                      key={style.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        form.accommodation === style.value
                          ? 'border-primary-500 bg-primary-950'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="accommodation"
                        value={style.value}
                        checked={form.accommodation === style.value}
                        onChange={() => handleChange('accommodation', style.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-gray-100 flex-1">{style.label}</span>
                      <span className="text-xs text-gray-500 hidden sm:block">{style.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Trip Vibe */}
              <div>
                <label className="label">Trip Vibe</label>
                <div className="grid grid-cols-2 gap-2">
                  {tripVibes.map((vibe) => (
                    <label
                      key={vibe.value}
                      className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        form.vibe === vibe.value
                          ? 'border-primary-500 bg-primary-950'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="vibe"
                        value={vibe.value}
                        checked={form.vibe === vibe.value}
                        onChange={() => handleChange('vibe', vibe.value)}
                        className="sr-only"
                      />
                      <span className="text-base mb-0.5">{vibe.label.split(' ')[0]}</span>
                      <span className="text-xs font-medium text-gray-300">{vibe.label.split(' ').slice(1).join(' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-950 border border-red-800 rounded-xl p-3 text-sm text-red-400">
                  {error}
                  {isAtLimit && (
                    <div className="mt-2">
                      <Link href="/pricing" className="font-bold underline">
                        Upgrade to Pro →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || isAtLimit}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                  isAtLimit
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : loading
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
                    Generating...
                  </>
                ) : isAtLimit ? (
                  '🔒 Upgrade to Generate More'
                ) : (
                  <>✨ Generate Itinerary</>
                )}
              </button>

              {!isPro && !isAtLimit && (
                <p className="text-xs text-center text-gray-500">
                  {remainingFree === 1 ? 'Last free itinerary!' : `${remainingFree} free left`}
                  {' · '}
                  <Link href="/pricing" className="text-primary-600 hover:underline">
                    Go Pro for unlimited
                  </Link>
                </p>
              )}
            </div>
          </div>

          {/* Result Area */}
          <div className="lg:col-span-3" ref={itineraryRef}>
            {!itinerary && !loading && (
              <div className="card flex flex-col items-center justify-center text-center py-20 min-h-[400px]">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">Your itinerary will appear here</h3>
                <p className="text-gray-500 max-w-sm">
                  Fill in your trip details and click "Generate Itinerary" to get a personalized day-by-day plan.
                </p>
              </div>
            )}

            {loading && !itinerary && (
              <div className="card flex flex-col items-center justify-center text-center py-20 min-h-[400px]">
                <div className="text-5xl mb-4 animate-bounce">✈️</div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                  Building your itinerary...
                </h3>
                <p className="text-gray-500">
                  Claude AI is researching {form.destination} and crafting your plan
                </p>
                <div className="mt-6 flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {itinerary && (
              <div className="space-y-4 animate-fade-in">
                {/* Booking links */}
                <div className="card bg-gradient-to-r from-blue-950 to-indigo-950 border-blue-900">
                  <h3 className="font-bold text-gray-100 mb-3 text-sm uppercase tracking-wide">
                    🔗 Book Your Trip
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={bookingLink}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
                    >
                      <span>🏨</span>
                      Search Hotels on Booking.com
                      <span className="text-xs opacity-75">↗</span>
                    </a>
                    <a
                      href={skyscannerLink}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors"
                    >
                      <span>✈️</span>
                      Compare Flights on Skyscanner
                      <span className="text-xs opacity-75">↗</span>
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">* Affiliate links. We may earn a small commission at no cost to you.</p>
                </div>

                {/* Itinerary content */}
                <div className="card">
                  {!loading && (
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                      <span className="text-sm text-gray-400">✅ Itinerary saved to My Trips</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadAsText(form.destination, form.startDate, itinerary)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                        <Link href="/itineraries" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-400 bg-primary-950 hover:bg-primary-900 border border-primary-800 rounded-lg transition-colors">
                          My Trips →
                        </Link>
                      </div>
                    </div>
                  )}
                  <div
                    className="itinerary-content"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(itinerary) + (loading ? '<span class="cursor-blink"></span>' : '')
                    }}
                  />
                  {loading && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-primary-600">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                      Generating...
                    </div>
                  )}
                </div>

                {/* Upgrade prompt after generation */}
                {!isPro && remainingFree <= 1 && (
                  <div className="card bg-gradient-to-br from-primary-950 to-emerald-950 border-primary-800 text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <h3 className="font-bold text-white mb-1">
                      {remainingFree === 0 ? "You've used all free itineraries!" : "Last free itinerary used!"}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Upgrade to Pro for unlimited itineraries at just $9.99/month.
                    </p>
                    <Link href="/pricing" className="btn-primary">
                      Upgrade to Pro →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PlannerContent />
    </Suspense>
  )
}
