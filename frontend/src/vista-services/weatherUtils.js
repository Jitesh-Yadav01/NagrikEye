export const WeatherUtils = {
  getWeatherIcon(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return "⛈️"
    if (weatherId >= 300 && weatherId < 400) return "🌦️"
    if (weatherId >= 500 && weatherId < 600) return "🌧️"
    if (weatherId >= 600 && weatherId < 700) return "🌨️"
    if (weatherId >= 700 && weatherId < 800) return "🌫️"
    if (weatherId === 800) return "☀️"
    if (weatherId > 800) return "☁️"
    return "🌤️"
  },
  groupForecastByDay(forecastList) {
    const grouped = {}
    forecastList.forEach(function (item) {
      const date = new Date(item.dt * 1000).toDateString()
      if (!grouped[date]) {
        grouped[date] = { 
          dt: item.dt, 
          temp: { min: item.main.temp_min, max: item.main.temp_max }, 
          weather: [item.weather[0]],
          humidity: item.main.humidity || 0,
          speed: item.wind.speed || 0
        }
      } else {
        grouped[date].temp.min = Math.min(grouped[date].temp.min, item.main.temp_min)
        grouped[date].temp.max = Math.max(grouped[date].temp.max, item.main.temp_max)
        grouped[date].humidity = Math.max(grouped[date].humidity, item.main.humidity || 0)
        grouped[date].speed = Math.max(grouped[date].speed, item.wind.speed || 0)
      }
    })
    return Object.values(grouped)
  },
  checkForWeatherAlerts(currentWeather) {
    const temp = currentWeather.main.temp
    const windSpeed = currentWeather.wind.speed
    const humidity = currentWeather.main.humidity
    if (temp > 40) return "🔥 Extreme Heat Alert: Take precautions to protect crops from heat stress."
    else if (temp < 5) return "🧊 Cold Alert: Risk of frost damage to sensitive crops."
    else if (windSpeed > 10) return "💨 High Wind Alert: Secure lightweight structures and protect young plants."
    else if (humidity > 85) return "💧 High Humidity Alert: Increase ventilation and monitor for fungal diseases."
    return null
  },
  prepareWeatherSummary(weatherData) {
    const current = weatherData.current
    const forecast = weatherData.forecast
    const dailyForecasts = WeatherUtils.groupForecastByDay(forecast.list).slice(0, 5)
    return {
      current: {
        temperature: current.main.temp,
        feels_like: current.main.feels_like,
        humidity: current.main.humidity,
        windSpeed: current.wind.speed,
        description: current.weather[0].description,
        pressure: current.main.pressure
      },
      forecast: dailyForecasts.map(function (day) {
        return { date: new Date(day.dt * 1000).toISOString(), temp_max: day.temp.max, temp_min: day.temp.min, description: day.weather[0].description }
      })
    }
  }
}
