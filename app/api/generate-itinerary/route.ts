import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    if (!rateLimit(ip, 5, 60_000)) {
      return Response.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    const body = await request.json()
    const { origin, destination, startDate, endDate, budget, travelers, accommodation, vibe, days } = body

    if (!origin || !destination || !startDate || !endDate || !budget) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Input length limits
    if (
      String(origin).length > 100 ||
      String(destination).length > 100 ||
      String(budget).length > 10 ||
      String(travelers).length > 2
    ) {
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return Response.json({ error: 'Invalid date format' }, { status: 400 })
    }

    // Validate budget is a positive number
    const budgetNum = parseFloat(budget)
    if (isNaN(budgetNum) || budgetNum <= 0 || budgetNum > 1_000_000) {
      return Response.json({ error: 'Invalid budget' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const accommodationLabels: Record<string, string> = {
      hostel: 'hostels/dorms (budget-friendly, ~$10-25/night)',
      budget_hotel: 'budget hotels (private room, ~$25-60/night)',
      airbnb: 'Airbnb/apartments (~$40-80/night)',
      guesthouse: 'guesthouses/B&Bs (~$20-50/night)',
      mid_range: 'mid-range hotels (3-star, ~$60-120/night)',
    }

    const vibeLabels: Record<string, string> = {
      adventure: 'adventure and outdoor activities',
      cultural: 'cultural exploration, history, and local life',
      foodie: 'food tourism, street food, and culinary experiences',
      beach: 'beach relaxation and coastal activities',
      city_break: 'urban exploration, cafes, nightlife, and city sights',
      off_beaten_path: 'off-the-beaten-path and lesser-known experiences',
    }

    const totalDays = parseInt(days) || 7
    const budgetNum = parseFloat(budget)
    const travelersNum = parseInt(travelers) || 1
    const perPersonBudget = budgetNum / travelersNum

    const prompt = `Create a detailed ${totalDays}-day budget travel itinerary for ${travelersNum} traveler(s) from ${origin} to ${destination}.

**Trip Details:**
- Travel dates: ${startDate} to ${endDate} (${totalDays} days)
- Total budget: $${budgetNum} USD ($${perPersonBudget.toFixed(0)} per person)
- Travelers: ${travelersNum}
- Accommodation style: ${accommodationLabels[accommodation] || accommodation}
- Trip vibe: ${vibeLabels[vibe] || vibe}

**Please structure your response as follows:**

# ${destination} Budget Itinerary: ${totalDays} Days for ${travelersNum} Person(s)

## Trip Overview
- Quick destination intro (2-3 sentences)
- Best time to visit & current season notes
- Estimated total budget breakdown (accommodation, food, transport, activities)
- Currency and payment tips

## Budget Summary
Create a clear table or list showing:
- Accommodation total: $X
- Food total: $X
- Local transport total: $X
- Activities/entrance fees: $X
- Miscellaneous/buffer: $X
- **TOTAL: $X** (should be within or under the $${budgetNum} budget)

## Day-by-Day Itinerary

For EACH day (Day 1 through Day ${totalDays}), provide:

### Day [N]: [Catchy Day Title]

**Morning:** [Activity/place with brief description]
**Afternoon:** [Activity/place with brief description]
**Evening:** [Activity/place + dinner recommendation]

**Today's Budget:**
- Accommodation: $X
- Meals: $X
- Transport: $X
- Activities: $X
- Day Total: $X

**Local Tip:** [One practical tip for this day]

---

## 💡 Top Money-Saving Tips for ${destination}

List 8-10 specific, actionable money-saving tips including:
- Free attractions and activities
- Best budget food options (specific dishes/markets)
- Cheapest transport methods
- When to buy tickets in advance
- Neighborhoods to stay in vs avoid (cost)
- Happy hours, free entry days
- Local apps or websites for deals

## 🚌 Getting Around on a Budget
- Airport/train arrival: cheapest options with estimated costs
- Local transport options and day pass prices
- Walking/cycling tips

## 🍜 Budget Eats Guide
- 5 must-try local dishes with average prices
- Best street food areas
- Supermarket tips for self-catering

## ✅ Pre-Trip Checklist
- Visa requirements
- Currency to bring
- Apps to download
- What to book in advance vs on arrival

Keep all prices realistic and accurate for current ${destination} costs. Be specific with place names, neighborhoods, and practical details. Make this genuinely useful for a budget traveler.`

    // Use streaming for the response
    const stream = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      stream: true,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Return a streaming response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: unknown) {
    console.error('Itinerary generation error:', error)
    return Response.json({ error: 'Failed to generate itinerary. Please try again.' }, { status: 500 })
  }
}
