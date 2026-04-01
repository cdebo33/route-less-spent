import dynamic from 'next/dynamic'
import type { MapLocation } from './ItineraryMapInner'

const ItineraryMapInner = dynamic(() => import('./ItineraryMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 text-sm">
      Loading map...
    </div>
  ),
})

export default function ItineraryMap({ locations }: { locations: MapLocation[] }) {
  return <ItineraryMapInner locations={locations} />
}
