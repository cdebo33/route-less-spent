import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Route Less Spent — Budget Travel Itinerary Generator',
  description: 'AI-powered travel planning that helps you explore the world without breaking the bank. Generate personalized day-by-day itineraries with cost breakdowns and money-saving tips.',
  keywords: 'budget travel, travel planner, AI itinerary, cheap travel, travel tips',
  openGraph: {
    title: 'Route Less Spent — Travel more. Spend less.',
    description: 'AI-powered budget travel itinerary generator. Plan your dream trip without breaking the bank.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-950">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
