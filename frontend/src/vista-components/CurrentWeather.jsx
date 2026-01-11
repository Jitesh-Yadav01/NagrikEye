import React, { useEffect, useRef } from 'react'
import { useAppState } from '../vista-context/AppStateContext.jsx'
import { WeatherUtils } from '../vista-services/weatherUtils.js'

export default function CurrentWeather() {
  const { weatherData } = useAppState()
  const ref = useRef(null)
  
  useEffect(() => {
    if (weatherData?.current && ref.current) {
      const gsap = window.gsap
      if (gsap) {
        gsap.fromTo(ref.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 })
      }
    }
  }, [weatherData])
  
  if (!weatherData?.current) return <div className="text-center text-gray-600"><i className="fas fa-spinner fa-spin mr-2"></i>Loading...</div>
  
  const data = weatherData.current
  const temp = Math.round(data.main.temp)
  const feelsLike = Math.round(data.main.feels_like)
  const humidity = data.main.humidity
  const windSpeed = data.wind.speed
  const description = data.weather[0].description
  const minTemp = Math.round(data.main.temp_min)
  const maxTemp = Math.round(data.main.temp_max)
  const pressure = data.main.pressure
  const weatherIcon = WeatherUtils.getWeatherIcon(data.weather[0].id)
  
  return (
    <div ref={ref} className="bg-white rounded-none md:rounded-[10px] shadow-sm p-4 md:p-6">
      <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4 flex items-center">
        <i className="fas fa-cloud-sun mr-3" style={{ color: '#8ED462' }}></i>
        Current Weather
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center md:border-r md:border-[#E5E7EB] pr-4">
          <div className="text-6xl mb-4">{weatherIcon}</div>
          <div className="text-3xl font-bold text-[#1a1a1a]">{temp}°C</div>
          <p className="text-[#2C2E2A] capitalize text-sm">{description}</p>
          <div className="mt-3 text-xs text-[#2C2E2A] bg-[#F5F5F2] rounded p-2">
            <p className="font-semibold text-[#1a1a1a]">Condition</p>
            <p>{description.charAt(0).toUpperCase() + description.slice(1)}</p>
          </div>
        </div>
        <div className="text-sm space-y-2">
          <div className="bg-[#F5F5F2] rounded p-3">
            <p className="text-[#2C2E2A] text-xs mb-1">🌡️ Feels Like</p>
            <p className="font-bold text-[#1a1a1a]">{feelsLike}°C</p>
          </div>
          <div className="bg-[#F5F5F2] rounded p-3">
            <p className="text-[#2C2E2A] text-xs mb-1">💧 Humidity</p>
            <p className="font-bold text-[#1a1a1a]">{humidity}%</p>
          </div>
          <div className="bg-[#F5F5F2] rounded p-3">
            <p className="text-[#2C2E2A] text-xs mb-1">🌪️ Wind Speed</p>
            <p className="font-bold text-[#1a1a1a]">{windSpeed} km/h</p>
          </div>
        </div>
        <div className="text-sm space-y-2">
          <div className="bg-[#F5F5F2] rounded p-3">
            <p className="text-[#2C2E2A] text-xs mb-1">📉 Min Temp</p>
            <p className="font-bold text-[#1a1a1a]">{minTemp}°C</p>
          </div>
          <div className="bg-[#F5F5F2] rounded p-3">
            <p className="text-[#2C2E2A] text-xs mb-1">📈 Max Temp</p>
            <p className="font-bold text-[#1a1a1a]">{maxTemp}°C</p>
          </div>
          <div className="bg-[#F5F5F2] rounded p-3">
            <p className="text-[#2C2E2A] text-xs mb-1">🔽 Pressure</p>
            <p className="font-bold text-[#1a1a1a]">{pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  )
}
