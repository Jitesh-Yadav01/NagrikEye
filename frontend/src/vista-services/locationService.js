import { CONFIG } from './config.js'

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation unsupported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  })
}

export async function reverseGeocode(lat, lon) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${CONFIG.OPENWEATHER_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (Array.isArray(data) && data.length > 0) {
    const l = data[0]
    return `${l.name}, ${l.state || ''} ${l.country}`.replace(/,\s*,/, ',')
  }
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
}

export async function search(query) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${CONFIG.OPENWEATHER_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) throw new Error('Location not found')
  const l = data[0]
  return { lat: l.lat, lon: l.lon, name: `${l.name}, ${l.country}` }
}
