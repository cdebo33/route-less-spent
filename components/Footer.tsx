import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✈</span>
              </div>
              <span className="font-bold text-white text-base">Route Less Spent</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              AI-powered travel planning that helps you explore the world without breaking the bank.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Powered by Claude AI • Built for budget travelers
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/planner" className="hover:text-white transition-colors">Trip Planner</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Partners</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.booking.com"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="hover:text-white transition-colors"
                >
                  Booking.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.skyscanner.com"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="hover:text-white transition-colors"
                >
                  Skyscanner
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Route Less Spent. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            * Some links are affiliate links. We may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  )
}
