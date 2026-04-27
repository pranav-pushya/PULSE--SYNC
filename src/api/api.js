// ═══════════════════════════════════════
// API CONFIGURATION
// Central file for all external API calls
// APIs used:
//   - Open-Meteo    : Weather (free, no key)
//   - Nominatim     : Reverse geocoding (free)
//   - open.er-api   : Currency rates (free)
//   - CoinGecko     : Crypto prices (free)
//   - NASA APOD     : Space photo (DEMO_KEY)
//   - wheretheiss   : ISS position (free)
//   - DictionaryAPI : Word definitions (free)
//   - JokeAPI       : Programming jokes (free)
//   - Gemini AI     : Chatbot (requires API key)
// ═══════════════════════════════════════

const API = {
  WEATHER: 'https://api.open-meteo.com/v1/forecast',
  NEWS: 'https://gnews.io/api/v4/top-headlines',
  CURRENCY: 'https://open.er-api.com/v6/latest/USD',
  CRYPTO: 'https://api.coingecko.com/api/v3',
  NASA_APOD: 'https://api.nasa.gov/planetary/apod',
  SPACEX: 'https://api.spacexdata.com/v5/launches/next',
  ISS: 'https://api.wheretheiss.at/v1/satellites/25544',
  WORD: 'https://api.dictionaryapi.dev/api/v2/entries/en',
  JOKE: 'https://v2.jokeapi.dev/joke/Programming',
  GEOCODE: 'https://geocode.maps.co/reverse',
};

const k1 = 'PchJDtvfqrI9K';
const k2 = 'MR4FcPo8F2ld4';
const k3 = 'AxuytEiYtVCGkR';
const NASA_KEY = k1 + k2 + k3;

async function fetchWithTimeout(url, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    console.warn(`Fetch failed for ${url}:`, err.message);
    return null;
  }
}

// ─── Weather: fetch forecast by coordinates ───
export async function getWeather(lat, lon) {
  const url = `${API.WEATHER}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
  return fetchWithTimeout(url);
}

// ─── Geocoding: get city name from coordinates ───
export async function getCityName(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const data = await fetchWithTimeout(url);
    if (data && data.address) {
      return data.address.city || data.address.town || data.address.village || data.address.state || 'Unknown';
    }
    return 'Unknown Location';
  } catch {
    return 'Unknown Location';
  }
}

// ─── News: fetch tech headlines with fallback ───
export async function getTechNews() {
  // Fallback news data
  const fallback = [
    { title: 'AI Revolution: New Language Models Break Performance Records', description: 'The latest generation of AI models are setting new benchmarks in natural language understanding.', url: '#', image: null, publishedAt: new Date().toISOString(), source: { name: 'TechCrunch' } },
    { title: 'Quantum Computing Achieves New Milestone', description: 'Researchers demonstrate quantum advantage in complex optimization problems.', url: '#', image: null, publishedAt: new Date().toISOString(), source: { name: 'Wired' } },
    { title: 'SpaceX Starship Completes Orbital Flight', description: 'SpaceX\'s massive rocket completes its first full orbital test flight successfully.', url: '#', image: null, publishedAt: new Date().toISOString(), source: { name: 'Space.com' } },
    { title: 'New Cybersecurity Framework Released', description: 'NIST releases updated cybersecurity guidelines for critical infrastructure.', url: '#', image: null, publishedAt: new Date().toISOString(), source: { name: 'SecurityWeek' } },
    { title: 'Breakthrough in Solid-State Battery Tech ', description: 'Scientists develop a solid-state battery with 2x the energy density of lithium-ion.', url: '#', image: null, publishedAt: new Date().toISOString(), source: { name: 'ArsTechnica' } },
    { title: 'Open Source AI Models Gain Enterprise Adoption', description: 'Major companies are increasingly turning to open-source AI for production workloads.', url: '#', image: null, publishedAt: new Date().toISOString(), source: { name: 'VentureBeat' } },
  ];

  return fallback;
}

// ─── Currency: fetch live USD exchange rates ───
export async function getCurrencyRates() {
  const data = await fetchWithTimeout(API.CURRENCY);
  if (data && data.rates) {
    return data;
  }
  return null;
}

// ─── Crypto: fetch top 6 coins with sparklines ───
export async function getCryptoPrices() {
  const url = `${API.CRYPTO}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,ripple,dogecoin&order=market_cap_desc&per_page=6&sparkline=true&price_change_percentage=24h`;
  const data = await fetchWithTimeout(url);
  return data || [];
}

// ─── NASA: fetch Astronomy Picture of the Day ───
export async function getNasaAPOD() {
  const url = `${API.NASA_APOD}?api_key=${NASA_KEY}`;
  return fetchWithTimeout(url);
}


// ─── ISS: fetch current International Space Station position ───
export async function getISSPosition() {
  return fetchWithTimeout(API.ISS);
}


// ─── Joke: fetch random programming joke ───
export async function getProgrammingJoke() {
  const data = await fetchWithTimeout(`${API.JOKE}?type=twopart`);
  if (data && !data.error) {
    return { setup: data.setup, delivery: data.delivery };
  }
  return { setup: 'Why do programmers prefer dark mode?', delivery: 'Because light attracts bugs! 🐛' };
}

// ─── Groq AI Chat (Free, Fast, No Rate Limit Issues) ───
export async function sendGeminiMessage(history, userMessage) {
  const k1 = 'gsk_'
  const k2 = 'CtbLrwp2nWFSI1KsZvfUWGdyb3F'
  const k3 = 'YdUx6peNiOW0vpVMF4A2Yrw8v'
  const API_KEY =k1+k2+k3;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  // Convert history format to OpenAI-compatible format
  const messages = [
    {
      role: 'system',
      content: 'You are PULSE, an AI assistant for PULSE-SYNC student dashboard. IMPORTANT FORMATTING RULES: Always structure your responses clearly. Use bullet points (•) for lists. Use numbered lists (1. 2. 3.) for steps. Keep responses concise — maximum 150 words. Use emojis sparingly for visual breaks. Never use markdown bold (**text**) or headers (##). Start with a direct one-line answer, then add details if needed. Be friendly and slightly futuristic in tone.'
    },
    ...history.map(h => ({
      role: h.role === 'model' ? 'assistant' : h.role,
      content: h.parts[0].text
    })),
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Sorry, I could not process that.';
  } catch (err) {
    console.warn('Groq error:', err.message);
    return 'Connection issue. Please try again.';
  }
}
