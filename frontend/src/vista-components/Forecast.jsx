import React, { useEffect, useMemo, useRef } from 'react'
import { useAppState } from '../vista-context/AppStateContext.jsx'
import { WeatherUtils } from '../vista-services/weatherUtils.js'

export default function Forecast() {
  const { weatherData } = useAppState()
  const cardsRef = useRef([])
  
  const daily = useMemo(() => {
    if (!weatherData?.forecast) return []
    return WeatherUtils.groupForecastByDay(weatherData.forecast.list).slice(0, 7)
  }, [weatherData])
  
  useEffect(() => {
    if (daily.length > 0 && cardsRef.current.length > 0) {
      const gsap = window.gsap
      if (gsap) {
        gsap.fromTo(cardsRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 })
      }
    }
  }, [daily])
  
  if (daily.length === 0) return <div className="text-center text-gray-600"><i className="fas fa-spinner fa-spin mr-2"></i>Loading...</div>
  
  return (
    <div className="bg-white rounded-none md:rounded-[10px] shadow-sm p-4 md:p-6 mb-12">
      <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4 flex items-center">
        <i className="fas fa-calendar-week mr-3" style={{ color: '#8ED462' }}></i>
        7-Day Forecast
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {daily.map((day, index) => {
          const date = new Date(day.dt * 1000)
          const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' })
          const weatherIcon = WeatherUtils.getWeatherIcon(day.weather[0].id)
          const maxTemp = Math.round(day.temp.max)
          const minTemp = Math.round(day.temp.min)
          const weather = day.weather[0]
          const humidity = Math.round(day.humidity || 0)
          const windSpeed = Math.round(day.speed || 0)
          return (
            <div key={index} ref={el => cardsRef.current[index] = el} className="bg-white border border-[#E5E7EB] rounded-[10px] p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="font-bold text-[#1a1a1a] mb-2">{dayName}</div>
              <div className="text-3xl mb-2">{weatherIcon}</div>
              <div className="text-xs text-[#2C2E2A] mb-2 capitalize">{weather.main}</div>
              <div className="text-lg font-bold text-[#1a1a1a] mb-1">{maxTemp}°</div>
              <div className="text-xs text-[#2C2E2A] mb-3">{minTemp}°</div>
              <div className="border-t border-[#E5E7EB] pt-2 mt-2">
                <div className="text-xs text-[#2C2E2A] mb-1">💧 {humidity}%</div>
                <div className="text-xs text-[#2C2E2A]">🌪️ {windSpeed} km/h</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
