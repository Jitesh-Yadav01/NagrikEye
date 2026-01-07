import React, { useEffect, useRef } from 'react'
import { useAppState } from '../vista-context/AppStateContext.jsx'

export default function AlertBanner() {
  const { alertMessage } = useAppState()
  const ref = useRef(null)
  
  useEffect(() => {
    if (alertMessage && ref.current) {
      const gsap = window.gsap
      if (gsap) {
        gsap.fromTo(ref.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 })
      }
    }
  }, [alertMessage])
  
  if (!alertMessage) return null
  
  return (
    <div ref={ref} className="bg-[#FBD38D] text-[#78350F] rounded-[10px] border-l-4" style={{ borderColor: '#F59E0B', padding: '1rem 15px', marginLeft: '15px', marginRight: '15px' }}>
      <div className="flex items-center">
        <i className="fas fa-exclamation-triangle mr-2"></i>
        <span className="font-bold">{alertMessage}</span>
      </div>
    </div>
  )
}
