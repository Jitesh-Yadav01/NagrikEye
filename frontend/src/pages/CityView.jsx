import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CityView = () => {
  const container = useRef();
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError("");
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;
      
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);
      
      if (!weatherRes.ok) throw new Error("City not found");
      
      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();
      
      setWeather(weatherData);
      setForecast(forecastData);
      setLocationInfo({
        name: weatherData.name,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon
      });
      
      const rating = Math.floor(Math.random() * 5) + 1;
      setSocietyRating(rating);
    } catch (e) {
      setError(e.message);
      setWeather(null);
      setForecast(null);
      setSocietyRating(null);
      setLocationInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async () => {
    if (!city.trim()) return;
    await fetchWeather(city);
  };

  useGSAP(() => {
    if (weather) {
      gsap.from('.weather-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  }, [weather]);

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunder')) return '⛈️';
    return '🌤️';
  };

  return (
    <div ref={container} className="w-full font-sans relative">
      <Navbar />
      
      <section
        className="w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center"
        style={{
          background: 'radial-gradient(circle at 50% 40%, #a6e676 0%, #8ed462 100%)',
          backgroundColor: '#8ed462'
        }}
      >
        <h1 className="text-[#2c2e2a] font-medium leading-[0.9] tracking-[-0.04em] mb-6 text-[clamp(60px,10vw,150px)]">
          <div className="overflow-hidden">
            <div>City View</div>
          </div>
        </h1>

        <div className="overflow-hidden mb-12">
          <p className="text-[#2c2e2a] text-[17px] font-medium tracking-wide">
            Discover Weather & Social Insights for Cities
          </p>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-stone-200 p-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
              placeholder="Enter city name (e.g., Pune, Mumbai)"
              className="flex-1 bg-transparent border-b border-black/20 pb-4 text-xl outline-none placeholder:text-black/30"
            />
            <button
              onClick={handleCitySearch}
              disabled={loading}
              className="bg-[#339966] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#2d8557] transition-all disabled:opacity-50 hover:scale-105"
            >
              {loading ? "Loading..." : "Explore City"}
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
              ❌ {error}
            </div>
          )}
        </div>
      </section>

      {locationInfo && (
        <section className="w-full bg-[#F5F5F2] py-24 px-4">
          <div className="max-w-325 mx-auto">
            <div className="weather-card bg-white rounded-[30px] shadow-sm border border-stone-200 p-8 mb-8">
              <div className="text-[32px] lg:text-[48px] font-medium text-[#2c2e2a] mb-2">
                📍 {locationInfo.name}
              </div>
              <div className="text-[18px] text-gray-600">
                🌍 Coordinates: {locationInfo.lat.toFixed(4)}, {locationInfo.lon.toFixed(4)}
              </div>
            </div>

            {weather && (
              <div className="weather-card bg-white rounded-[30px] shadow-sm border border-stone-200 p-8 lg:p-12 mb-8">
                <h2 className="text-[32px] lg:text-[48px] font-medium text-[#2c2e2a] mb-8">
                  Current Weather
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex items-center gap-6">
                    <span className="text-8xl">{getWeatherIcon(weather.weather[0].description)}</span>
                    <div>
                      <div className="text-6xl font-bold text-[#2c2e2a]">{Math.round(weather.main.temp)}°C</div>
                      <div className="text-2xl text-gray-600 capitalize mt-2">{weather.weather[0].description}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#F5F1E4] rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">Feels Like</div>
                      <div className="text-3xl font-semibold text-[#2c2e2a]">{Math.round(weather.main.feels_like)}°C</div>
                    </div>
                    <div className="bg-[#F5F1E4] rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">Humidity</div>
                      <div className="text-3xl font-semibold text-[#2c2e2a]">{weather.main.humidity}%</div>
                    </div>
                    <div className="bg-[#F5F1E4] rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">Wind Speed</div>
                      <div className="text-3xl font-semibold text-[#2c2e2a]">{weather.wind.speed} m/s</div>
                    </div>
                    <div className="bg-[#F5F1E4] rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">Pressure</div>
                      <div className="text-3xl font-semibold text-[#2c2e2a]">{weather.main.pressure} hPa</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {forecast && (
              <div className="weather-card bg-white rounded-[30px] shadow-sm border border-stone-200 p-8 lg:p-12 mb-8">
                <h2 className="text-[32px] lg:text-[48px] font-medium text-[#2c2e2a] mb-8">
                  5-Day Forecast
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {forecast.list.filter((_, idx) => idx % 8 === 0).slice(0, 5).map((item, idx) => (
                    <div key={idx} className="bg-[#F5F1E4] rounded-2xl p-6 text-center hover:shadow-md transition-all hover:scale-105">
                      <div className="text-sm text-gray-600 mb-3 font-bold uppercase tracking-wide">
                        {new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-5xl mb-3">{getWeatherIcon(item.weather[0].description)}</div>
                      <div className="text-2xl font-semibold text-[#2c2e2a] mb-1">{Math.round(item.main.temp)}°C</div>
                      <div className="text-xs text-gray-600 capitalize">{item.weather[0].description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {societyRating !== null && (
              <div className="weather-card bg-white rounded-[30px] shadow-sm border border-stone-200 p-8 lg:p-12">
                <h2 className="text-[32px] lg:text-[48px] font-medium text-[#2c2e2a] mb-8">
                  Social Conditions
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                  <div className="text-7xl text-[#339966]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="inline-block transform hover:scale-125 transition-transform">
                        {i < societyRating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-[#2c2e2a]">{societyRating}/5</div>
                    <div className="text-xl text-gray-600 mt-2">Community Rating</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#F5F1E4] rounded-2xl p-8 hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-600 uppercase tracking-wide mb-3">Safety Index</div>
                    <div className="text-3xl font-semibold text-[#339966]">
                      {societyRating > 3 ? 'High' : societyRating > 2 ? 'Medium' : 'Low'}
                    </div>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#339966] rounded-full transition-all"
                        style={{ width: `${(societyRating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-[#F5F1E4] rounded-2xl p-8 hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-600 uppercase tracking-wide mb-3">Infrastructure</div>
                    <div className="text-3xl font-semibold text-[#339966]">
                      {societyRating > 3 ? 'Good' : societyRating > 2 ? 'Fair' : 'Poor'}
                    </div>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#339966] rounded-full transition-all"
                        style={{ width: `${(societyRating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-[#F5F1E4] rounded-2xl p-8 hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-600 uppercase tracking-wide mb-3">Cleanliness</div>
                    <div className="text-3xl font-semibold text-[#339966]">
                      {societyRating > 3 ? 'Excellent' : societyRating > 2 ? 'Good' : 'Needs Improvement'}
                    </div>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#339966] rounded-full transition-all"
                        style={{ width: `${(societyRating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default CityView;