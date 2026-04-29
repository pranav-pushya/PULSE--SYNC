import { createNavbar } from './head-foot/navbar.js';
import { createFooter } from './head-foot/footer.js';
import { initScrollReveal, initParticles, typeWriter, initTiltCards } from './api/animations.js';
import { getProgrammingJoke, getTechNews, sendGeminiMessage } from './api/api.js';

// ═══════════════════════════════════════
// PAGE INITIALIZATION
// Runs all setup functions when DOM is ready
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  createNavbar('home');
  createFooter();
  initParticles('particle-canvas');
  initScrollReveal();
  initTiltCards();
  initCardSpotlight();
  loadTypewriter();
  loadHomeNews();
  initChatbot();
  loadJoke();
  loadCSFacts();
});

// ═══════════════════════════════════════
// TYPEWRITER EFFECT
// Cycles through phrases in hero subtitle
// ═══════════════════════════════════════
async function loadTypewriter() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'weather patterns ☁️',
    'crypto markets 📈',
    'space missions 🚀',
    'global news 🌍',
    'the cosmos ✨',
  ];

  let idx = 0;
  while (true) {
    await typeWriter(el, phrases[idx], 60);
    await sleep(2500);
    // Erase
    for (let i = phrases[idx].length; i >= 0; i--) {
      el.textContent = phrases[idx].slice(0, i);
      await sleep(30);
    }
    await sleep(300);
    idx = (idx + 1) % phrases.length;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}


// ═══════════════════════════════════════
// TECH NEWS — HOMEPAGE
// Fetches and renders latest tech headlines
// Falls back to hardcoded articles if API fails
// ═══════════════════════════════════════
async function loadHomeNews() {
  const container = document.getElementById('home-news-list');
  if (!container) return;

  const articles = await getTechNews();
  container.innerHTML = articles
    .slice(0, 5)
    .map((a) => `
      <div class="news-card">
        <div class="news-source">${a.source.name}</div>
        <h4 class="news-title">${a.title}</h4>
        <p class="news-desc">${a.description || ''}</p>
      </div>
    `)
    .join('');
}

// ═══════════════════════════════════════
// DEV JOKE
// Fetches a random programming joke on page load
// ═══════════════════════════════════════
async function loadJoke() {
  const container = document.getElementById('joke-content');
  const joke = await getProgrammingJoke();
  container.innerHTML = `
    <p class="joke-setup">${joke.setup}</p>
    <p class="joke-delivery">${joke.delivery}</p>
  `;
}

// ─── CS Facts & Tricks ───
const CS_FACTS = [
  { category: 'Networks', icon: '🌐', fact: 'The first internet message ever sent was "LO" — the system crashed before "LOGIN" could be completed. That was in 1969.' },
  { category: 'AI', icon: '🤖', fact: 'GPT-4 has approximately 1.8 trillion parameters — trained on data that would take a human over 2,000 years to read.' },
  { category: 'OS', icon: '💻', fact: 'Linux powers 96.3% of the top 1 million web servers in the world — and it was started by a 21-year-old student in 1991.' },
  { category: 'Security', icon: '🔐', fact: 'The most common password in 2023 was still "123456" — used by over 4.5 million people despite being cracked in under 1 second.' },
  { category: 'Data Structures', icon: '📊', fact: 'Google uses a PageRank algorithm — essentially a graph traversal problem — to rank billions of web pages in milliseconds.' },
  { category: 'Programming', icon: '⚡', fact: 'The first computer bug was an actual bug — a moth found in a Harvard relay computer in 1947. Grace Hopper taped it in the logbook.' },
  { category: 'Web', icon: '🕸️', fact: 'The first website ever created is still live at info.cern.ch — created by Tim Berners-Lee in 1991 at CERN.' },
  { category: 'Hardware', icon: '🔧', fact: 'Modern CPUs execute over 3 billion instructions per second — yet they still follow the same fetch-decode-execute cycle from the 1940s.' },
  { category: 'Algorithms', icon: '🧮', fact: 'Dijkstra designed his shortest path algorithm in 20 minutes at a cafe in 1956 — without pen or paper — just in his head.' },
  { category: 'Database', icon: '🗄️', fact: 'SQL was designed in the 1970s and is still the most widely used database language — over 50 years later with no signs of stopping.' },
  { category: 'Cloud', icon: '☁️', fact: 'Amazon Web Services started because Amazon built their own infrastructure and realized they could rent the excess capacity to others.' },
  { category: 'Mobile', icon: '📱', fact: 'The Apollo 11 guidance computer had 4KB of RAM and 72KB of storage — your calculator watch has more computing power.' },
  { category: 'Networking', icon: '📡', fact: 'IPv4 has about 4.3 billion addresses — all of which are now exhausted. IPv6 has 340 undecillion addresses — enough for every atom on Earth.' },
  { category: 'Cryptography', icon: '🔑', fact: 'HTTPS encrypts your data using math so complex that even a supercomputer would take longer than the age of the universe to crack it.' },
  { category: 'Open Source', icon: '🐧', fact: 'The Android operating system — running on 3 billion devices — is built on the Linux kernel, which is open source and free.' },
];

function loadCSFacts() {
  const grid = document.getElementById('cs-facts-grid');
  if (!grid) return;

  // Pick 3 random unique facts
  const shuffled = [...CS_FACTS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  grid.innerHTML = selected.map((fact, index) => `
    <div class="cs-fact-card">
      <div class="cs-fact-header">
        <span class="cs-fact-icon">${fact.icon}</span>
        <span class="cs-fact-category">${fact.category}</span>
      </div>
      <p class="cs-fact-text">${fact.fact}</p>
    </div>
  `).join('');
}

// ═══════════════════════════════════════
// GEMINI AI CHATBOT
// Handles user input, calls Gemini API,
// maintains conversation history for context
// ═══════════════════════════════════════
function initChatbot() {
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const messagesEl = document.getElementById('chatbot-messages');
  if (!input || !sendBtn || !messagesEl) return;

  // Stores conversation history for Gemini context
  const history = [];

  // Send on button click
  sendBtn.addEventListener('click', () => handleSend());

  // Send on Enter key
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSend();
  });

  async function handleSend() {
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    // Show user message
    appendChatMessage('user', text, messagesEl);
    input.value = '';
    sendBtn.disabled = true;

    // Show typing indicator
    const typingId = showTyping(messagesEl);

    // Get Gemini response
    const reply = await sendGeminiMessage(history, text);

    // Update history for context
    history.push({ role: 'user', parts: [{ text }] });
    history.push({ role: 'model', parts: [{ text: reply }] });

    // Remove typing, show reply
    removeTyping(typingId, messagesEl);
    appendChatMessage('bot', reply, messagesEl);
    sendBtn.disabled = false;
    input.focus();
  }
}

// ─── Helper: Add message bubble to chat UI ───
function appendChatMessage(role, text, container) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `
    <span class="chat-avatar">${role === 'bot' ? '⚡' : '👤'}</span>
    <p>${text}</p>
  `;
  container.appendChild(div);
  // Auto scroll to latest message
  container.scrollTop = container.scrollHeight;
}

// ─── Helper: Show typing indicator while waiting for API ───
function showTyping(container) {
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = id;
  div.innerHTML = `<span class="chat-avatar">⚡</span><p class="typing-dots">...</p>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

// ─── Helper: Remove typing indicator after response arrives ───
function removeTyping(id, container) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ─── Spotlight effect on flip cards ───
function initCardSpotlight() {
  const cards = document.querySelectorAll('.flip-card-front');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

// ═══════════════════════════════════════
// WEATHER MODAL — HOME PAGE ONLY
// Draggable popup with Open-Meteo API
// ═══════════════════════════════════════

function getWeatherEmoji(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}

function getWeatherDesc(code) {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mostly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 49) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Rain Showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

async function fetchWeatherCoords(lat, lon, city, country) {
  const body = document.getElementById('weather-body');
  if (!body) return;
  body.innerHTML = `<p style="color:rgba(255,255,255,0.35);font-size:13px;">Loading weather data...</p>`;
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
    );
    const data = await res.json();
    const c = data.current;
    const emoji = getWeatherEmoji(c.weather_code);
    const desc = getWeatherDesc(c.weather_code);
    body.innerHTML = `
      <div style="text-align:center;width:100%;">
        <div style="font-size:17px;font-weight:700;color:#fff;margin-bottom:2px;">${city}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.38);margin-bottom:14px;">${country}</div>
        <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:10px;">
          <span style="font-size:48px;line-height:1;">${emoji}</span>
          <span style="font-size:52px;font-weight:800;line-height:1;background:linear-gradient(135deg,#a78bfa,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${Math.round(c.temperature_2m)}°C</span>
        </div>
        <div style="font-size:14px;color:rgba(255,255,255,0.55);margin-bottom:18px;">${desc}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:10px 6px;">
            <div style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;">Feels Like</div>
            <div style="font-size:15px;font-weight:700;color:#a78bfa;">${Math.round(c.apparent_temperature)}°C</div>
          </div>
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:10px 6px;">
            <div style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;">Humidity</div>
            <div style="font-size:15px;font-weight:700;color:#a78bfa;">${c.relative_humidity_2m}%</div>
          </div>
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:10px 6px;">
            <div style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;">Wind</div>
            <div style="font-size:15px;font-weight:700;color:#a78bfa;">${Math.round(c.wind_speed_10m)} km/h</div>
          </div>
        </div>
      </div>
    `;
  } catch {
    body.innerHTML = `<p style="color:#f87171;font-size:13px;">⚠️ Failed to load weather. Try searching a city.</p>`;
  }
}

async function weatherSearchCity() {
  const input = document.getElementById('weather-city-input');
  const city = input ? input.value.trim() : '';
  if (!city) return;
  const body = document.getElementById('weather-body');
  if (body) body.innerHTML = `<p style="color:rgba(255,255,255,0.35);font-size:13px;">Searching "${city}"...</p>`;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (!data.length) {
      const b = document.getElementById('weather-body');
      if (b) b.innerHTML = `<p style="color:#f87171;font-size:13px;">City not found. Try a different name.</p>`;
      return;
    }
    const p = data[0];
    const cityName = p.display_name.split(',')[0].trim();
    const countryName = p.display_name.split(',').slice(-1)[0].trim();
    await fetchWeatherCoords(parseFloat(p.lat), parseFloat(p.lon), cityName, countryName);
  } catch {
    const b = document.getElementById('weather-body');
    if (b) b.innerHTML = `<p style="color:#f87171;font-size:13px;">⚠️ Search failed. Check your connection.</p>`;
  }
}

function initWeatherModal() {
  const modal = document.getElementById('weather-modal');
  if (!modal) return; // Only runs on home page where modal exists

  const closeBtn = document.getElementById('weather-close-btn');
  const searchBtn = document.getElementById('weather-search-btn');
  const cityInput = document.getElementById('weather-city-input');
  const dragHandle = document.getElementById('weather-drag-handle');

  // ── OPEN function (used by both navbar btn and hero btn) ──
  async function openModal() {
    modal.style.display = 'block';
    const body = document.getElementById('weather-body');
    if (body) body.innerHTML = `<p style="color:rgba(255,255,255,0.35);font-size:13px;">📍 Detecting your location...</p>`;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const r = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const d = await r.json();
            const city = d.address.city || d.address.town || d.address.village || d.address.county || 'Your Location';
            const country = d.address.country || '';
            await fetchWeatherCoords(pos.coords.latitude, pos.coords.longitude, city, country);
          } catch {
            await fetchWeatherCoords(pos.coords.latitude, pos.coords.longitude, 'Your Location', '');
          }
        },
        async () => {
          // Geolocation denied — fallback to New Delhi
          await fetchWeatherCoords(28.6139, 77.2090, 'New Delhi', 'India');
        },
        { timeout: 6000 }
      );
    } else {
      await fetchWeatherCoords(28.6139, 77.2090, 'New Delhi', 'India');
    }
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  // ── Attach open to NAVBAR weather button ──
  // navbar.js injects it into DOM, so use event delegation
  document.addEventListener('click', (e) => {
    if (e.target.closest('#weather-open-btn')) {
      openModal();
    }
  });

  // ── Attach open to HERO weather button ──
  const heroBtn = document.getElementById('weather-hero-btn');
  if (heroBtn) heroBtn.addEventListener('click', openModal);

  // ── Close button ──
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // ── Search ──
  if (searchBtn) searchBtn.addEventListener('click', weatherSearchCity);
  if (cityInput) {
    cityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') weatherSearchCity();
    });
  }

  // ── ESC to close ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ── DRAGGABLE LOGIC ──
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function startDrag(clientX, clientY) {
    isDragging = true;
    dragHandle.style.cursor = 'grabbing';

    // Reset transform, lock position with current rect
    const rect = modal.getBoundingClientRect();
    modal.style.transform = 'none';
    modal.style.left = rect.left + 'px';
    modal.style.top = rect.top + 'px';

    // Offset = where inside the modal the user clicked
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
  }

  function doDrag(clientX, clientY) {
    if (!isDragging) return;

    let newX = clientX - offsetX;
    let newY = clientY - offsetY;

    // Clamp within viewport
    const modalW = modal.offsetWidth;
    const modalH = modal.offsetHeight;
    newX = Math.max(0, Math.min(window.innerWidth - modalW, newX));
    newY = Math.max(0, Math.min(window.innerHeight - modalH, newY));

    modal.style.left = newX + 'px';
    modal.style.top = newY + 'px';
  }

  function stopDrag() {
    isDragging = false;
    if (dragHandle) dragHandle.style.cursor = 'grab';
  }

  // Mouse events
  if (dragHandle) {
    dragHandle.addEventListener('mousedown', (e) => {
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    });
  }

  document.addEventListener('mousemove', (e) => doDrag(e.clientX, e.clientY));
  document.addEventListener('mouseup', stopDrag);

  // Touch events
  if (dragHandle) {
    dragHandle.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY);
      e.preventDefault();
    }, { passive: false });
  }

  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    doDrag(t.clientX, t.clientY);
  }, { passive: false });

  document.addEventListener('touchend', stopDrag);
}

// Run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initWeatherModal();
});




