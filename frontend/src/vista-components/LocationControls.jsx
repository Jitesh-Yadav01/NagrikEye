import React, { useState } from 'react'
import { useAppState } from '../vista-context/AppStateContext.jsx'

export default function LocationControls() {
  const { detectLocation, searchLocation } = useAppState()
  const [query, setQuery] = useState('')
  
  return (
    <div className="flex gap-2 flex-wrap justify-end">
      <button onClick={detectLocation} className="text-white px-4 py-2 rounded-[8px] hover:shadow-lg flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer" style={{ backgroundColor: '#3B82F6' }}>
        <i className="fas fa-location"></i>
        <span>Detect</span>
      </button>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search location..." className="px-3 py-2 border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 min-w-[180px]" style={{ borderColor: '#E5E7EB' }} />
      <button onClick={() => searchLocation(query)} className="text-white px-4 py-2 rounded-[8px] hover:shadow-lg transition-all whitespace-nowrap cursor-pointer" style={{ backgroundColor: '#129710ff' }}>
        <i className="fas fa-search mr-1"></i>
        <span>Search</span>
      </button>
    </div>
  )
}
