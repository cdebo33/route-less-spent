import Stripe from 'stripe'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  })

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return Response.json({ error: 'No signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    // In development, skip signature verification
    console.warn('STRIPE_WEBHOOK_SECRET not set — skipping signature verification (dev only)')
    return Response.json({ received: true })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    console.error('Webhook error:', message)
    return Response.json({ error: message }, { status: 400 })
  }

  // Handle subscription events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('New subscription:', session.id, session.customer)
      // In a real app: save customer ID to your database, mark user as Pro
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription cancelled:', subscription.id, subscription.customer)
      // In a real app: mark user as no longer Pro in your database
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('Payment failed:', invoice.id, invoice.customer)
      // In a real app: notify the user their payment failed
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return Response.json({ received: true })
}
