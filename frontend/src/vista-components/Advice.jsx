import React, { useEffect, useRef } from 'react'
import { useAppState } from '../vista-context/AppStateContext.jsx'

export default function Advice() {
  const { weatherData, adviceSections, adviceLoading, generateAdvice } = useAppState()
  const listRef = useRef(null)
  
  useEffect(() => { 
    if (weatherData && !adviceSections && !adviceLoading) generateAdvice() 
  }, [weatherData, adviceSections, adviceLoading, generateAdvice])
  
  useEffect(() => { 
    if (adviceSections && listRef.current) {
      const gsap = window.gsap
      if (gsap) {
        gsap.fromTo(listRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }) 
      }
    }
  }, [adviceSections])
  
  if (adviceLoading) return (
    <div className="text-center py-8 text-gray-600">
      <i className="fas fa-spinner fa-spin mr-2"></i>
      <span>Analyzing weather data...</span>
    </div>
  )
  
  if (!adviceSections) return null
  
  const sections = [
    { title: 'Immediate Actions', emoji: '⚡', items: adviceSections.immediate },
    { title: 'This Week', emoji: '�', items: adviceSections.weekly },
    { title: 'Irrigation', emoji: '💧', items: adviceSections.irrigation },
    { title: 'Crop Protection', emoji: '🛡️', items: adviceSections.protection },
    { title: 'Harvest & Planting', emoji: '�', items: adviceSections.harvesting }
  ]
  
  return (
    <div ref={listRef} className="bg-white rounded-[10px] shadow-sm p-6" style={{ marginLeft: '15px', marginRight: '15px' }}>
      <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4 flex items-center">
        <i className="fas fa-brain mr-3" style={{ color: '#8ED462' }}></i>
        AI Recommendations
      </h2>
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-[10px] p-4" style={{ backgroundColor: '#F5F5F2', borderLeft: '4px solid #8ED462' }}>
            <h3 className="text-lg font-bold text-[#1a1a1a] mb-3">{section.emoji} {section.title}</h3>
            <ul>
              {(section.items || []).map((item, i) => (
                <li key={i} className="flex items-start mb-2 text-sm text-[#2C2E2A]">
                  <span style={{ color: '#8ED462' }} className="mr-2 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
