import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const features = [
  {
    icon: '🗺️',
    title: 'AI Day-by-Day Itineraries',
    description: 'Get a full personalized travel plan with activities, timings, and local tips — powered by Claude AI.',
  },
  {
    icon: '💰',
    title: 'Real Cost Breakdowns',
    description: 'Every itinerary includes estimated daily costs for accommodation, food, transport, and activities.',
  },
  {
    icon: '✂️',
    title: 'Money-Saving Tips',
    description: 'Discover free attractions, local food markets, budget transit options, and off-peak travel hacks.',
  },
  {
    icon: '✈️',
    title: 'Flight & Hotel Links',
    description: 'One-click search on Skyscanner and Booking.com to lock in the best deals for your dates.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Plan your trip on any device. Your itinerary looks great on phone, tablet, or desktop.',
  },
  {
    icon: '⚡',
    title: 'Instant Generation',
    description: 'Get a full multi-day itinerary in seconds, not hours of research.',
  },
]

const testimonials = [
  {
    quote: "I planned a 10-day Southeast Asia trip for under $800 using Route Less Spent. The cost breakdown was spot-on.",
    name: "Mia Chen",
    location: "Vancouver, Canada",
    avatar: "MC",
  },
  {
    quote: "As a solo backpacker, this tool is a game changer. The money-saving tips alone saved me hundreds.",
    name: "James Okonkwo",
    location: "Lagos, Nigeria",
    avatar: "JO",
  },
  {
    quote: "Finally an AI travel planner that actually understands budget travel. Not just luxury recommendations.",
    name: "Sofia Reyes",
    location: "Madrid, Spain",
    avatar: "SR",
  },
]

const destinations = [
  { name: 'Bali', emoji: '🌴', budget: '$35/day' },
  { name: 'Prague', emoji: '🏰', budget: '$55/day' },
  { name: 'Bangkok', emoji: '🛺', budget: '$30/day' },
  { name: 'Lisbon', emoji: '🌊', budget: '$65/day' },
  { name: 'Medellín', emoji: '🌺', budget: '$40/day' },
  { name: 'Tbilisi', emoji: '⛪', budget: '$35/day' },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-1.5 text-sm text-primary-300 mb-6">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse-slow" />
              AI-Powered Budget Travel Planning
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              Travel more.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-300">
                Spend less.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get a personalized day-by-day itinerary with real cost breakdowns and money-saving tips — in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/planner"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-2xl transition-all duration-200 text-lg shadow-lg shadow-primary-500/30 hover:-translate-y-0.5"
              >
                Plan My Trip Free
                <span>→</span>
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all duration-200 text-lg border border-white/20"
              >
                See Pricing
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['MC', 'JO', 'SR', 'AB'].map((initials) => (
                    <div key={initials} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white">
                      {initials[0]}
                    </div>
                  ))}
                </div>
                <span>2,400+ trips planned</span>
              </div>
              <span className="hidden sm:block">·</span>
              <div className="flex items-center gap-1">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i} className="text-yellow-400">{star}</span>
                ))}
                <span className="ml-1">4.9/5</span>
              </div>
              <span className="hidden sm:block">·</span>
              <span>Free to start — no card needed</span>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48H1440V0C1200 32 960 48 720 48C480 48 240 32 0 0V48Z" fill="#030712"/>
          </svg>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500 mb-6 uppercase tracking-wider">
            Popular Budget Destinations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {destinations.map((dest) => (
              <Link
                key={dest.name}
                href={`/planner?destination=${dest.name}`}
                className="group bg-gray-900 rounded-2xl p-4 text-center border border-gray-800 hover:border-primary-600 hover:shadow-md hover:shadow-primary-900/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-3xl mb-2">{dest.emoji}</div>
                <div className="font-semibold text-white text-sm">{dest.name}</div>
                <div className="text-primary-400 text-xs font-medium mt-0.5">{dest.budget}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Everything you need to travel smarter</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Stop spending hours on research. Let AI do the planning while you focus on packing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-primary-700 transition-all duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Plan a trip in 3 steps</h2>
            <p className="section-subtitle">From idea to full itinerary in under a minute.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Enter your trip details',
                desc: 'Tell us where you\'re going, when, your budget, and travel style.',
                icon: '📝',
              },
              {
                step: '02',
                title: 'AI builds your plan',
                desc: 'Claude AI crafts a complete day-by-day itinerary with cost estimates.',
                icon: '🤖',
              },
              {
                step: '03',
                title: 'Book & explore',
                desc: 'Use the embedded flight and hotel links to lock in your deals.',
                icon: '🎒',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Loved by budget travelers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card hover:border-gray-700 transition-all duration-200">
                <div className="flex items-center gap-1 mb-4">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} className="text-yellow-400 text-sm">{star}</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-6">🌍</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Start free. Upgrade anytime.
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Get 3 free itineraries, then go Pro for unlimited plans at just <strong className="text-white">$9.99/month</strong>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/planner"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl transition-all hover:bg-primary-50 text-lg"
            >
              Start Free — No Card Needed
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500/30 border border-white/30 text-white font-semibold rounded-2xl transition-all hover:bg-primary-500/50 text-lg"
            >
              See All Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
