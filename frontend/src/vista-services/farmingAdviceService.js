import { CONFIG } from './config.js'

function buildAdvicePrompt(weatherData) {
  const current = weatherData.current
  const forecast = weatherData.forecast
  let prompt = `You are an expert agricultural advisor. Analyze the weather data and give farming advice.

CURRENT WEATHER:
- Temperature: ${current.temperature.toFixed(1)}°C (feels like ${current.feels_like.toFixed(1)}°C)
- Humidity: ${current.humidity}%
- Wind: ${current.windSpeed.toFixed(1)} m/s
- Conditions: ${current.description}

5-DAY FORECAST:
`
  forecast.forEach((day, i) => {
    prompt += `- Day ${i + 1}: Max ${day.temp_max.toFixed(0)}°C, Min ${day.temp_min.toFixed(0)}°C, ${day.description}\n`
  })
  prompt += `
Based on this data, provide practical advice for these categories. Each category should have 2-3 bullet points. Each bullet point should be a single, short sentence.

### IMMEDIATE_ACTIONS
-

### WEEKLY_PLANNING
-

### IRRIGATION_MANAGEMENT
-

### CROP_PROTECTION
-

### HARVESTING_PLANTING
-
`
  return prompt
}

function parseAdviceText(responseText) {
  const sections = { immediate: [], weekly: [], irrigation: [], protection: [], harvesting: [] }
  const sectionMap = { IMMEDIATE_ACTIONS: 'immediate', WEEKLY_PLANNING: 'weekly', IRRIGATION_MANAGEMENT: 'irrigation', CROP_PROTECTION: 'protection', HARVESTING_PLANTING: 'harvesting' }
  let currentSection = null
  const lines = responseText.split('\n')
  lines.forEach((line) => {
    const t = line.trim()
    const sectionKey = Object.keys(sectionMap).find(key => t.includes(key))
    if (sectionKey) currentSection = sectionMap[sectionKey]
    else if (currentSection && (t.startsWith('-') || t.startsWith('*'))) {
      const advice = t.substring(1).trim()
      if (advice) sections[currentSection].push(advice)
    }
  })
  Object.keys(sections).forEach((key) => { if (sections[key].length === 0) sections[key].push('Consult local agricultural experts for detailed advice.') })
  return sections
}

export async function getFarmingAdvice(weatherSummary) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`
  const prompt = buildAdvicePrompt(weatherSummary)
  const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6, topK: 40 } }) })
  if (!res.ok) throw new Error('AI API error')
  const result = await res.json()
  const adviceText = result.candidates?.[0]?.content?.parts?.[0]?.text
  if (!adviceText) throw new Error('No advice generated')
  return parseAdviceText(adviceText)
}
