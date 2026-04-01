'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapLocation {
  day: number
  title: string
  location: string
  description: string
  coords: { lat: number; lng: number }
}

function createNumberedIcon(n: number) {
  return L.divIcon({
    html: `<div style="
      background:#16a34a;color:white;width:30px;height:30px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-weight:bold;font-size:13px;font-family:sans-serif;
      border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);
    ">${n}</div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  })
}

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (coords.length === 1) {
      map.setView(coords[0], 12)
    } else if (coords.length > 1) {
      map.fitBounds(coords, { padding: [48, 48] })
    }
  }, [map, coords])
  return null
}

export default function ItineraryMapInner({ locations }: { locations: MapLocation[] }) {
  const coords: [number, number][] = locations.map(l => [l.coords.lat, l.coords.lng])
  const center: [number, number] = coords.length > 0 ? coords[0] : [20, 0]

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds coords={coords} />

      {/* Route line */}
      {coords.length > 1 && (
        <Polyline
          positions={coords}
          pathOptions={{ color: '#16a34a', weight: 2.5, dashArray: '8 5', opacity: 0.9 }}
        />
      )}

      {/* Numbered markers */}
      {locations.map((loc, i) => (
        <Marker
          key={i}
          position={[loc.coords.lat, loc.coords.lng]}
          icon={createNumberedIcon(loc.day)}
        >
          <Popup>
            <div style={{ minWidth: '160px', fontFamily: 'sans-serif' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{loc.title}</div>
              <div style={{ color: '#555', fontSize: '12px', marginBottom: '2px' }}>{loc.description}</div>
              <div style={{ color: '#999', fontSize: '11px' }}>{loc.location}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
