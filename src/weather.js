import { createNavbar } from './components/navbar.js';
import { createFooter } from './components/footer.js';
import { initScrollReveal } from './utils/animations.js';
import { getWeather, getCityName, getTechNews } from './utils/api.js';

// Weather code to description + emoji mapping
const weatherCodes = {
  0: { desc: 'Clear Sky', icon: '☀️' },
  1: { desc: 'Mainly Clear', icon: '🌤️' },
  2: { desc: 'Partly Cloudy', icon: '⛅' },
  3: { desc: 'Overcast', icon: '☁️' },
  45: { desc: 'Foggy', icon: '🌫️' },
  48: { desc: 'Rime Fog', icon: '🌫️' },
  51: { desc: 'Light Drizzle', icon: '🌦️' },
  53: { desc: 'Moderate Drizzle', icon: '🌦️' },
  55: { desc: 'Dense Drizzle', icon: '🌧️' },
  61: { desc: 'Slight Rain', icon: '🌧️' },
  63: { desc: 'Moderate Rain', icon: '🌧️' },
  65: { desc: 'Heavy Rain', icon: '🌧️' },
  71: { desc: 'Slight Snow', icon: '🌨️' },
  73: { desc: 'Moderate Snow', icon: '❄️' },
  75: { desc: 'Heavy Snow', icon: '❄️' },
  77: { desc: 'Snow Grains', icon: '🌨️' },
  80: { desc: 'Slight Showers', icon: '🌦️' },
  81: { desc: 'Moderate Showers', icon: '🌧️' },
  82: { desc: 'Violent Showers', icon: '⛈️' },
  85: { desc: 'Snow Showers', icon: '🌨️' },
  86: { desc: 'Heavy Snow Showers', icon: '❄️' },
  95: { desc: 'Thunderstorm', icon: '⛈️' },
  96: { desc: 'Thunderstorm + Hail', icon: '⛈️' },
  99: { desc: 'Thunderstorm + Heavy Hail', icon: '⛈️' },
};

document.addEventListener('DOMContentLoaded', () => {
  createNavbar('weather');
  createFooter();
  initScrollReveal();
  loadWeather();
  loadNews();
});

// ─── Weather ───
async function loadWeather() {
  const loadingEl = document.getElementById('weather-loading');
  const dataEl = document.getElementById('weather-data');

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: false,
      });
    });

    const { latitude, longitude } = position.coords;
    const [weather, city] = await Promise.all([
      getWeather(latitude, longitude),
      getCityName(latitude, longitude),
    ]);

    if (!weather || !weather.current) throw new Error('No weather data');

    const code = weather.current.weather_code;
    const w = weatherCodes[code] || { desc: 'Unknown', icon: '🌡️' };
    const temp = Math.round(weather.current.temperature_2m);
    const humidity = weather.current.relative_humidity_2m;
    const wind = weather.current.wind_speed_10m;
    const maxTemp = weather.daily?.temperature_2m_max?.[0];
    const minTemp = weather.daily?.temperature_2m_min?.[0];

    loadingEl.style.display = 'none';
    dataEl.style.display = 'block';
    dataEl.innerHTML = `
      <div class="weather-icon-large">${w.icon}</div>
      <div class="weather-temp">${temp}°C</div>
      <p class="weather-condition">${w.desc}</p>
      <p class="weather-location">📍 ${city}</p>
      <div class="weather-details">
        <div class="weather-detail">
          <div class="weather-detail-label">Humidity</div>
          <div class="weather-detail-value">💧 ${humidity}%</div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">Wind Speed</div>
          <div class="weather-detail-value">💨 ${wind} km/h</div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">Max Temp</div>
          <div class="weather-detail-value">🔺 ${maxTemp != null ? Math.round(maxTemp) + '°C' : 'N/A'}</div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">Min Temp</div>
          <div class="weather-detail-value">🔻 ${minTemp != null ? Math.round(minTemp) + '°C' : 'N/A'}</div>
        </div>
      </div>
    `;
  } catch (err) {
    loadingEl.innerHTML = `
      <div class="weather-icon-large">📍</div>
      <p style="color:var(--text-secondary);font-size:1rem;margin-bottom:0.5rem">Location access needed</p>
      <p style="color:var(--text-muted);font-size:0.85rem">Please allow location access to view live weather data.</p>
    `;
  }
}

// ─── News ───
async function loadNews() {
  const container = document.getElementById('news-list');
  const articles = await getTechNews();

  container.innerHTML = articles
    .map(
      (a) => `
    <a href="${a.url}" target="_blank" rel="noopener" class="news-card">
      <div class="news-source">${a.source.name}</div>
      <h4 class="news-title">${a.title}</h4>
      <p class="news-desc">${a.description || ''}</p>
    </a>
  `
    )
    .join('');
}
