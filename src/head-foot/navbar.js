// ─── Shared Navigation Bar ───

export function createNavbar(activePage = '') {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'navbar';
  nav.setAttribute('aria-label', 'main navigation');
  nav.innerHTML = `
    <a href="/index.html" class="nav-logo">
      <span class="logo-pulse">PULSE</span><span class="logo-sync">-SYNC</span>
    </a>
    <div class="nav-links" id="nav-links">
      <a href="/index.html" class="${activePage === 'home' ? 'active' : ''}" aria-current="${activePage === 'home' ? 'page' : 'false'}"><i class="ph ph-house-simple"></i> Home</a>
      <a href="/finance.html" class="${activePage === 'finance' ? 'active' : ''}" aria-current="${activePage === 'finance' ? 'page' : 'false'}"><i class="ph ph-chart-line-up"></i> Finance</a>
      <a href="/science.html" class="${activePage === 'science' ? 'active' : ''}" aria-current="${activePage === 'science' ? 'page' : 'false'}"><i class="ph ph-planet"></i> Space</a>
      <a href="/discover.html" class="${activePage === 'discover' ? 'active' : ''}" aria-current="${activePage === 'discover' ? 'page' : 'false'}"><i class="ph ph-compass"></i> Discover</a>
      <a href="/games.html" class="${activePage === 'games' ? 'active' : ''}" aria-current="${activePage === 'games' ? 'page' : 'false'}"><i class="ph ph-game-controller"></i> Games</a>
      ${activePage === 'home' ? `<button class="nav-weather-btn" id="weather-open-btn" style="
        background:rgba(16,185,129,0.12);
        border:1px solid rgba(16,185,129,0.3);
        color:#6ee7b7;
        padding:6px 16px;
        border-radius:8px;
        font-size:13px;
        font-weight:500;
        cursor:pointer;
        font-family:inherit;
        display:flex;
        align-items:center;
        gap:6px;
        transition:all 0.2s;
      ">🌤️ Weather</button>` : ''}
      <button class="theme-toggle" id="theme-toggle" aria-label="Toggle light/dark mode">
        <span id="theme-icon">☀️</span>
      </button>
    </div>
    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  `;

  document.body.prepend(nav);

  // Mobile menu toggle
  const toggle = nav.querySelector('#nav-toggle');
  const links = nav.querySelector('#nav-links');
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  // Navbar scroll effect
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
  });

  // // ─── Light/Dark Toggle ───
  // const themeToggle = document.getElementById('theme-toggle');
  // const themeIcon = document.getElementById('theme-icon');
  // const savedTheme = localStorage.getItem('theme') || 'dark';

  // // Apply saved theme on load
  // document.documentElement.setAttribute('data-theme', savedTheme);
  // themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  // themeToggle.addEventListener('click', () => {
  //   const current = document.documentElement.getAttribute('data-theme');
  //   const next = current === 'dark' ? 'light' : 'dark';
  //   document.documentElement.setAttribute('data-theme', next);
  //   localStorage.setItem('theme', next);
  //   themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
  // });

  // ─── Inject weather popup into every page ───
  const weatherPopupHTML = `
    <div class="weather-popup-overlay" id="weather-overlay"></div>
    <div class="weather-popup" id="weather-popup" aria-label="Weather popup" role="dialog">
      <div class="weather-popup-header">
        <span class="weather-popup-title">🌤️ Live Weather</span>
        <button class="weather-popup-close" id="weather-close" aria-label="Close weather">✕</button>
      </div>
      <div class="weather-popup-content" id="weather-popup-content">
        <div class="weather-popup-loading">
          <div class="loading-skeleton loading-block" style="height:3rem;width:60%;margin:0 auto 0.5rem"></div>
          <p style="color:var(--text-muted);font-size:0.8rem;margin-top:0.75rem;text-align:center">Detecting location...</p>
        </div>
      </div>
      <div class="weather-popup-time" id="weather-popup-time"></div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', weatherPopupHTML);

  // ─── Weather popup logic ───
  const weatherToggle = document.getElementById('weather-toggle');
  const weatherPopup = document.getElementById('weather-popup');
  const weatherOverlay = document.getElementById('weather-overlay');
  const weatherClose = document.getElementById('weather-close');
  const weatherContent = document.getElementById('weather-popup-content');
  const weatherTimeEl = document.getElementById('weather-popup-time');

  let weatherLoaded = false;

  function updateWeatherTime() {
    if (weatherTimeEl) {
      weatherTimeEl.textContent = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    }
  }
  setInterval(updateWeatherTime, 1000);
  updateWeatherTime();

  function closeWeatherPopup() {
    weatherPopup.classList.remove('active');
    weatherOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (weatherToggle) {
    weatherToggle.addEventListener('click', () => {
      weatherPopup.classList.add('active');
      weatherOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (!weatherLoaded) {
        loadNavbarWeather();
        weatherLoaded = true;
      }
    });
  }

  if (weatherClose) weatherClose.addEventListener('click', closeWeatherPopup);
  if (weatherOverlay) weatherOverlay.addEventListener('click', closeWeatherPopup);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeWeatherPopup(); });

  async function loadNavbarWeather() {
    if (!weatherContent) return;
    if (!navigator.geolocation) {
      weatherContent.innerHTML = '<div class="error-state"><span>📍</span><p>Geolocation not supported</p></div>';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const [wRes, cRes] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`),
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          ]);
          const wData = await wRes.json();
          const cData = await cRes.json();
          const temp = Math.round(wData.current.temperature_2m);
          const humidity = wData.current.relative_humidity_2m;
          const wind = Math.round(wData.current.wind_speed_10m);
          const code = wData.current.weather_code;
          const city = cData.address?.city || cData.address?.town || cData.address?.village || 'Your Location';
          const conditions = {
            0: { desc: 'Clear Sky', icon: '☀️' },
            1: { desc: 'Mainly Clear', icon: '🌤️' },
            2: { desc: 'Partly Cloudy', icon: '⛅' },
            3: { desc: 'Overcast', icon: '☁️' },
            61: { desc: 'Rainy', icon: '🌧️' },
            71: { desc: 'Snowy', icon: '❄️' },
            95: { desc: 'Thunderstorm', icon: '⛈️' },
          };
          const condition = conditions[code] || { desc: 'Unknown', icon: '🌡️' };
          weatherContent.innerHTML = `
            <div class="weather-popup-main">
              <div class="weather-popup-icon">${condition.icon}</div>
              <div class="weather-popup-temp">${temp}°C</div>
              <div class="weather-popup-city">${city}</div>
              <div class="weather-popup-desc">${condition.desc}</div>
            </div>
            <div class="weather-popup-details">
              <div class="weather-popup-detail">
                <span class="detail-icon">💧</span>
                <span class="detail-value">${humidity}%</span>
                <span class="detail-label">Humidity</span>
              </div>
              <div class="weather-popup-detail">
                <span class="detail-icon">💨</span>
                <span class="detail-value">${wind} km/h</span>
                <span class="detail-label">Wind</span>
              </div>
            </div>
          `;
        } catch {
          weatherContent.innerHTML = '<div class="error-state"><span>⚠️</span><p>Could not load weather</p></div>';
        }
      },
      () => {
        weatherContent.innerHTML = '<div class="error-state"><span>📍</span><p>Location access denied</p></div>';
      }
    );
  }
}

// ─── Save and restore scroll position per page ───
const pageKey = 'scroll_' + window.location.pathname;

// Restore scroll position
const savedScroll = sessionStorage.getItem(pageKey);
if (savedScroll) {
  setTimeout(() => {
    window.scrollTo(0, parseInt(savedScroll));
  }, 100);
}

// Save scroll position on all link clicks
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', () => {
    sessionStorage.setItem(pageKey, window.scrollY);
  });
});

// Also save on page hide
window.addEventListener('pagehide', () => {
  sessionStorage.setItem(pageKey, window.scrollY);
});
