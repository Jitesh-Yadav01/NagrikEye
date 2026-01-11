import React from 'react'
import { useAppState } from '../vista-context/AppStateContext.jsx'
import LocationControls from './LocationControls.jsx'
import MapView from './MapView.jsx'

export default function LocationSection() {
  const { locationName } = useAppState()
  return (
    <section className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#1a1a1a] flex items-center">
          <i className="fas fa-map-marker-alt mr-3" style={{ color: '#8ED462' }}></i>
        </h2>
        <div className="w-full lg:w-auto">
          <LocationControls />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <p className="text-lg font-bold text-[#1a1a1a] mb-4">📍 {locationName || 'Getting location...'}</p>
          <div className="space-y-3 text-sm text-[#2C2E2A]">
            <div>
              <p className="font-semibold text-[#1a1a1a] mb-1">Current Location</p>
              <p>Search or detect your city to view weather and location recommendations</p>
            </div>
            <div>
              <p className="font-semibold text-[#1a1a1a] mb-1">How to Use</p>
              <p>Click the Detect button to use your GPS location or type a city name to search</p>
            </div>
            <div>
              <p className="font-semibold text-[#1a1a1a] mb-1">Location Insights</p>
              <p>Get city-specific weather updates and social recommendations for your area</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <MapView />
        </div>
      </div>
    </section>
  )
}

