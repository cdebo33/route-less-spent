'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { downloadItineraryText } from '@/lib/download'

const SAVED_ITINERARIES_KEY = 'rls_saved_itineraries'

export interface SavedItinerary {
  id: string
  destination: string
  origin: string
  startDate: string
  endDate: string
  travelers: string
  days: number
  content: string
  createdAt: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function renderMarkdown(text: string): string {
  const safe = escapeHtml(text)
  return safe
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


export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(SAVED_ITINERARIES_KEY) || '[]')
    setItineraries(saved)
  }, [])

  const handleDelete = (id: string) => {
    const updated = itineraries.filter((i) => i.id !== id)
    setItineraries(updated)
    localStorage.setItem(SAVED_ITINERARIES_KEY, JSON.stringify(updated))
    if (expanded === id) setExpanded(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">My Trips</h1>
          <p className="text-gray-400">Your saved itineraries, stored on this device.</p>
        </div>

        {itineraries.length === 0 ? (
          <div className="card text-center py-20">
            <div className="text-5xl mb-4">🗺️</div>
            <h2 className="text-xl font-semibold text-gray-200 mb-2">No saved trips yet</h2>
            <p className="text-gray-500 mb-6">Generate an itinerary and it will be saved here automatically.</p>
            <Link href="/planner" className="btn-primary">Plan a Trip →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {itineraries.map((itinerary) => (
              <div key={itinerary.id} className="card border border-gray-800">
                {/* Card header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-white">{itinerary.destination}</h2>
                      <span className="text-xs px-2 py-0.5 bg-primary-950 text-primary-400 border border-primary-800 rounded-full">
                        {itinerary.days} day{itinerary.days !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      From {itinerary.origin} · {itinerary.startDate} → {itinerary.endDate} · {itinerary.travelers} traveler{parseInt(itinerary.travelers) !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Saved {new Date(itinerary.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => downloadItineraryText(itinerary.destination, itinerary.startDate, itinerary.content)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Download as text file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={() => setExpanded(expanded === itinerary.id ? null : itinerary.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-400 bg-primary-950 hover:bg-primary-900 border border-primary-800 rounded-lg transition-colors"
                    >
                      {expanded === itinerary.id ? 'Collapse' : 'View'}
                    </button>
                    <button
                      onClick={() => handleDelete(itinerary.id)}
                      className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-950 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {expanded === itinerary.id && (
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <div
                      className="itinerary-content"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(itinerary.content) }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
