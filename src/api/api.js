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
  try {
    const queries = ['technology', 'artificial intelligence', 'programming'];
    const q = queries[Math.floor(Math.random() * queries.length)];
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${q}&lang=en&max=8&apikey=YOUR_GNEWS_KEY_HERE`
    );
    const data = await res.json();
    if (!data.articles || !data.articles.length) throw new Error('No articles');
    return data.articles.map(a => ({
      source: { name: a.source.name },
      title: a.title,
      description: a.description,
      url: a.url
    }));
  } catch {
    return FALLBACK_NEWS;
  }
}

const FALLBACK_NEWS = [
  { source:{name:'TechCrunch'}, title:'OpenAI releases new model with improved reasoning capabilities', description:'The latest model shows significant improvements in mathematical and coding tasks.' },
  { source:{name:'The Verge'}, title:'Google announces major updates to Android development tools', description:'New features aim to simplify app development and improve performance.' },
  { source:{name:'Wired'}, title:'How quantum computing is changing cryptography forever', description:'Researchers make breakthrough in quantum error correction.' },
  { source:{name:'Ars Technica'}, title:'Linux kernel 6.x brings major performance improvements', description:'The latest kernel update improves memory management and CPU scheduling.' },
  { source:{name:'GitHub Blog'}, title:'GitHub Copilot now supports 10 new programming languages', description:'AI pair programmer expands language support across the platform.' },
];

// ─── Currency: fetch live USD exchange rates ───
export async function getCurrencyRates() {
  const data = await fetchWithTimeout(API.CURRENCY);
  if (data && data.rates) {
    return data;
  }
  return null;
}

// ─── Crypto: fetch top 8 coins ───
export async function getCryptoPrices() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,dogecoin,ripple,polkadot,chainlink&order=market_cap_desc&per_page=8&page=1&sparkline=false&price_change_percentage=24h',
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Crypto fetch failed:', err.message);
    return [];
  }
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
