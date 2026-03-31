import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function CancelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="card shadow-xl">
            <div className="text-5xl mb-4">😢</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Checkout cancelled
            </h1>
            <p className="text-gray-500 mb-6">
              No worries — you can upgrade anytime. Your free itineraries are still available.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/pricing" className="btn-primary w-full">
                View Pricing Again
              </Link>
              <Link href="/planner" className="btn-secondary w-full">
                Keep Using Free
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
