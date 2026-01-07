import React, { useEffect, useRef } from 'react'
import { useAppState } from '../vista-context/AppStateContext.jsx'
import { CONFIG } from '../vista-services/config.js'

export default function MapView() {
  const { location, locationName, searchLocation } = useAppState()
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const containerRef = useRef(null)
  
  useEffect(() => {
    if (!window.L) return
    if (!mapRef.current && containerRef.current) {
      const m = window.L.map(containerRef.current).setView(CONFIG.MAP_DEFAULT_VIEW, CONFIG.MAP_DEFAULT_ZOOM)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(m)
      
      m.on('click', async (e) => {
        const { lat, lng } = e.latlng
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          const data = await response.json()
          const locationName = data.address?.city || data.address?.town || data.address?.country || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
          await searchLocation(locationName)
        } catch {
          // Handle error silently
        }
      })
      
      mapRef.current = m
    }
  }, [searchLocation])
  
  useEffect(() => {
    if (mapRef.current && location && window.L) {
      const m = mapRef.current
      m.setView([location.lat, location.lon], CONFIG.MAP_LOCATION_ZOOM)
      if (markerRef.current) m.removeLayer(markerRef.current)
      const marker = window.L.marker([location.lat, location.lon]).addTo(m)
      marker.bindPopup(`<b>${locationName}</b><br>Your location`).openPopup()
      markerRef.current = marker
    }
  }, [location, locationName])
  
  return <div ref={containerRef} className="w-full rounded-[10px]" style={{ height: '400px', backgroundColor: '#F5F5F2' }}></div>
}

