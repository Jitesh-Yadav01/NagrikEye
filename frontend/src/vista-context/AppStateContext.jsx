import React, { createContext, useContext, useMemo, useState } from 'react'
import * as Location from '../vista-services/locationService.js'
import * as Weather from '../vista-services/weatherService.js'
import * as Advice from '../vista-services/farmingAdviceService.js'
import { WeatherUtils } from '../vista-services/weatherUtils.js'

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [location, setLocation] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)
  const [adviceSections, setAdviceSections] = useState(null)
  const [adviceLoading, setAdviceLoading] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const detectLocation = async () => {
    const pos = await Location.getCurrentLocation()
    const name = await Location.reverseGeocode(pos.lat, pos.lon)
    setLocation(pos)
    setLocationName(name)
    const data = await Weather.getWeatherData(pos.lat, pos.lon)
    setWeatherData(data)
    const alert = WeatherUtils.checkForWeatherAlerts(data.current)
    setAlertMessage(alert)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchLocation = async (query) => {
    if (!query) return
    const res = await Location.search(query)
    setLocation({ lat: res.lat, lon: res.lon })
    setLocationName(res.name)
    const data = await Weather.getWeatherData(res.lat, res.lon)
    setWeatherData(data)
    const alert = WeatherUtils.checkForWeatherAlerts(data.current)
    setAlertMessage(alert)
  }
// eslint-disable-next-line react-hooks/exhaustive-deps

  const refreshWeather = async () => {
    if (!location) await detectLocation()
    if (location) {
      const data = await Weather.getWeatherData(location.lat, location.lon)
      setWeatherData(data)
      const alert = WeatherUtils.checkForWeatherAlerts(data.current)
      setAlertMessage(alert)
    }
  }
// eslint-disable-next-line react-hooks/exhaustive-deps

  const generateAdvice = async () => {
    if (!weatherData) return
    setAdviceLoading(true)
    const summary = WeatherUtils.prepareWeatherSummary(weatherData)
    try {
      const advice = await Advice.getFarmingAdvice(summary)
      setAdviceSections(advice)
    } finally {
      setAdviceLoading(false)
    }
  }

  const value = useMemo(() => ({
    location,
    locationName,
    weatherData,
    alertMessage,
    adviceSections,
    adviceLoading,
    detectLocation,
    searchLocation,
    refreshWeather,
    generateAdvice
  }), [location, locationName, weatherData, alertMessage, adviceSections, adviceLoading, detectLocation, searchLocation, refreshWeather, generateAdvice])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState() {
  return useContext(AppStateContext)
}
