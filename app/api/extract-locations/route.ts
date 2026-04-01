import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function geocode(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
    const res = await fetch(url, { headers: { 'User-Agent': 'route-less-spent/1.0' } })
    const data = await res.json()
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
  } catch {}
  return null
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'API key not configured' }, { status: 500 })
  }

  const { itinerary } = await request.json()

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Extract the primary location visited each day from this travel itinerary. Return ONLY a valid JSON array, no other text.

Format: [{"day": 1, "title": "Day 1: Title", "location": "Specific Area, City, Country", "description": "Main activity in 8 words or less"}]

Rules:
- Include city and country in every location for accurate geocoding
- If a day has multiple locations, pick the first/main one
- Keep descriptions short

Itinerary:
${itinerary.slice(0, 5000)}`
      }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return Response.json({ locations: [] })

    const extracted: { day: number; title: string; location: string; description: string }[] = JSON.parse(match[0])

    // Geocode — deduplicate to avoid redundant requests
    const geocache = new Map<string, { lat: number; lng: number } | null>()
    for (const item of extracted) {
      if (!geocache.has(item.location)) {
        geocache.set(item.location, await geocode(item.location))
        await new Promise(r => setTimeout(r, 1100)) // Nominatim rate limit: 1 req/sec
      }
    }

    const locations = extracted
      .map(item => ({ ...item, coords: geocache.get(item.location) }))
      .filter(item => item.coords != null)

    return Response.json({ locations })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to extract locations'
    return Response.json({ error: message }, { status: 500 })
  }
}
