import Stripe from 'stripe'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  if (!process.env.STRIPE_PRICE_ID) {
    return Response.json({ error: 'Stripe price ID not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  })

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        product: 'route-less-spent-pro',
      },
    })

    return Response.json({ url: session.url })
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    return Response.json({ error: message }, { status: 500 })
  }
}
