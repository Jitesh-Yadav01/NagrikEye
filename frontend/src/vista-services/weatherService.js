import { CONFIG } from './config.js'

export async function getWeatherData(lat, lon) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric`
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric`
  const [cRes, fRes] = await Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
  const [current, forecast] = await Promise.all([cRes.json(), fRes.json()])
  return { current, forecast }
}
