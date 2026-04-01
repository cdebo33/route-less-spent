import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

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
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!rateLimit(ip, 10, 60_000)) {
    return Response.json({ error: 'Too many requests.' }, { status: 429 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const { itinerary } = await request.json()

  if (!itinerary || typeof itinerary !== 'string' || itinerary.length > 50_000) {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Read this entire travel itinerary and extract only the distinct cities or areas visited, in the order they are visited. Only create a new entry when the traveler moves to a genuinely different city or region — do not create a new entry for every single day if they stay in the same place.

Return ONLY a valid JSON array, no other text.

Format: [{"days": "1-5", "city": "City, Country", "description": "Brief description in 8 words or less"}]

Rules:
- Cover the ENTIRE itinerary from day 1 to the last day — do not stop early
- Group consecutive days in the same city/area into one entry with a day range (e.g. "days": "1-5")
- If only one day in a city use a single number (e.g. "days": "6")
- Include country in every city name for accurate geocoding
- Only add a new entry when the traveler actually travels to a different place

Full itinerary:
${itinerary}`
      }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return Response.json({ locations: [] })

    const extracted: { days: string; city: string; description: string }[] = JSON.parse(match[0])

    // Geocode each unique city
    const geocache = new Map<string, { lat: number; lng: number } | null>()
    for (const item of extracted) {
      if (!geocache.has(item.city)) {
        geocache.set(item.city, await geocode(item.city))
        await new Promise(r => setTimeout(r, 1100)) // Nominatim rate limit: 1 req/sec
      }
    }

    const locations = extracted
      .map((item, i) => ({
        day: i + 1,
        days: item.days,
        title: item.city,
        location: item.city,
        description: item.description,
        coords: geocache.get(item.city),
      }))
      .filter(item => item.coords != null)

    return Response.json({ locations })
  } catch (error) {
    console.error('Extract locations error:', error)
    return Response.json({ error: 'Failed to extract locations' }, { status: 500 })
  }
}
