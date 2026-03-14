// ─── API Configuration & Helpers ───

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

const NASA_KEY = 'DEMO_KEY';

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

// ─── Weather ───
export async function getWeather(lat, lon) {
  const url = `${API.WEATHER}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
  return fetchWithTimeout(url);
}

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

// ─── News ───
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

  // Try fetching from a free RSS-to-JSON proxy
  try {
    const url = 'https://newsdata.io/api/1/latest?apikey=pub_843aborealfakekeyplaceholder&q=technology&language=en';
    const data = await fetchWithTimeout(url, 5000);
    if (data && data.results && data.results.length > 0) {
      return data.results.slice(0, 6).map(a => ({
        title: a.title,
        description: a.description || '',
        url: a.link || '#',
        image: a.image_url,
        publishedAt: a.pubDate,
        source: { name: a.source_name || 'News' },
      }));
    }
  } catch { /* fallback */ }

  return fallback;
}

// ─── Currency ───
export async function getCurrencyRates() {
  const data = await fetchWithTimeout(API.CURRENCY);
  if (data && data.rates) {
    return {
      INR: data.rates.INR,
      EUR: data.rates.EUR,
      GBP: data.rates.GBP,
      JPY: data.rates.JPY,
      lastUpdate: data.time_last_update_utc,
    };
  }
  return null;
}

// ─── Crypto ───
export async function getCryptoPrices() {
  const url = `${API.CRYPTO}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,ripple,dogecoin&order=market_cap_desc&per_page=6&sparkline=true&price_change_percentage=24h`;
  const data = await fetchWithTimeout(url);
  return data || [];
}

// ─── NASA ───
export async function getNasaAPOD() {
  const url = `${API.NASA_APOD}?api_key=${NASA_KEY}`;
  return fetchWithTimeout(url);
}

// ─── SpaceX ───
export async function getNextLaunch() {
  return fetchWithTimeout(API.SPACEX);
}

// ─── ISS ───
export async function getISSPosition() {
  return fetchWithTimeout(API.ISS);
}

// ─── Word of the Day ───
export async function getWordOfTheDay() {
  const words = ['ephemeral', 'serendipity', 'ubiquitous', 'eloquent', 'resilient', 'pragmatic', 'paradigm', 'synergy', 'catalyst', 'ethereal', 'luminous', 'zenith', 'cascade', 'nexus', 'quantum'];
  const dayIndex = new Date().getDate() % words.length;
  const word = words[dayIndex];
  const data = await fetchWithTimeout(`${API.WORD}/${word}`);
  if (data && data[0]) {
    return {
      word: data[0].word,
      phonetic: data[0].phonetic || '',
      meaning: data[0].meanings?.[0]?.definitions?.[0]?.definition || 'No definition available.',
      partOfSpeech: data[0].meanings?.[0]?.partOfSpeech || '',
    };
  }
  return { word, phonetic: '', meaning: 'Could not load definition.', partOfSpeech: '' };
}

// ─── Joke ───
export async function getProgrammingJoke() {
  const data = await fetchWithTimeout(`${API.JOKE}?type=twopart`);
  if (data && !data.error) {
    return { setup: data.setup, delivery: data.delivery };
  }
  return { setup: 'Why do programmers prefer dark mode?', delivery: 'Because light attracts bugs! 🐛' };
}
