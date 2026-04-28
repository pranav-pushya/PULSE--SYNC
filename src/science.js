// ═══════════════════════════════════════
// SCIENCE PAGE — PULSE-SYNC
// NASA APOD, ISS Live Tracker, Space News,
// Did You Know, Asteroid Dodge Game
// ═══════════════════════════════════════

import { createNavbar } from './head-foot/navbar.js';
import { createFooter } from './head-foot/footer.js';
import { initScrollReveal, initCursorTrail } from './api/animations.js';
import { getNasaAPOD, getISSPosition } from './api/api.js';

// ─── Space facts for Did You Know ───
const SPACE_FACTS = [
  { icon: '🌙', fact: 'The Moon is moving away from Earth at 3.8 cm per year — the same rate your fingernails grow.' },
  { icon: '☀️', fact: 'Light from the Sun takes 8 minutes 20 seconds to reach Earth — but 100,000 years to travel from the core to its surface.' },
  { icon: '🪐', fact: 'Saturn\'s rings are only ~1 km thick despite being 282,000 km wide — thinner than a sheet of paper proportionally.' },
  { icon: '⭐', fact: 'There are more stars in the observable universe than grains of sand on all of Earth\'s beaches — estimated 10²⁴ stars.' },
  { icon: '🌌', fact: 'The Milky Way is on a collision course with Andromeda — but it won\'t happen for another 4.5 billion years.' },
  { icon: '🚀', fact: 'Driving to the Moon at 100 km/h would take 160 days. To the Sun — over 170 years.' },
  { icon: '💫', fact: 'A teaspoon of neutron star material would weigh about 10 million tons on Earth.' },
  { icon: '🔭', fact: 'The Hubble Space Telescope completes one orbit around Earth every 95 minutes at 27,300 km/h.' },
  { icon: '🌍', fact: 'Earth is the densest planet in the solar system — if Saturn could fit in a bathtub of water, it would float.' },
  { icon: '🛠️', fact: 'The ISS travels so fast that astronauts see 16 sunrises and sunsets every single day.' },
  { icon: '🌊', fact: 'There are more possible iterations of a game of chess than atoms in the observable universe — and yet space is incomprehensibly larger than both.' },
  { icon: '🔥', fact: 'The Sun loses about 4 million tons of mass every second through nuclear fusion — converting it to energy via E=mc².' },
  { icon: '🌙', fact: 'Astronauts on the ISS see 16 sunrises and 16 sunsets every single day as they orbit Earth every 90 minutes.' },
  { icon: '⚫', fact: 'If the Earth were compressed to the size of a marble, it would become a black hole. The compression needed is called the Schwarzschild radius.' },
  { icon: '🚀', fact: 'Voyager 1, launched in 1977, is now over 23 billion km from Earth — the farthest human-made object ever. It still sends data back.' },
  { icon: '💎', fact: 'Scientists discovered an exoplanet made largely of crystalline carbon — essentially a diamond the size of Earth. It orbits a pulsar 900 light-years away.' },
  { icon: '🌡️', fact: 'The temperature in space is -270.45°C — just 2.7 degrees above absolute zero. But in direct sunlight near Earth, it can reach 120°C.' },
];

const SPACE_NEWS_FALLBACK = [
  { title: 'NASA\'s James Webb Telescope Captures Deepest Infrared Image', url: 'https://www.nasa.gov', summary: 'Webb\'s deep field reveals thousands of galaxies including the faintest objects ever observed in space.', site: 'NASA' },
  { title: 'SpaceX Starship Completes Full Orbital Flight Test', url: 'https://www.spacex.com', summary: 'The world\'s most powerful rocket marks a milestone for deep space exploration and future Mars missions.', site: 'SpaceX' },
  { title: 'Mars Perseverance Rover Finds Organic Molecules', url: 'https://www.nasa.gov', summary: 'NASA\'s rover detects complex organic molecules, raising new questions about ancient life on the red planet.', site: 'NASA JPL' },
  { title: 'Chandrayaan-3 Successfully Lands Near Moon South Pole', url: 'https://www.isro.gov.in', summary: 'ISRO makes history as India becomes the first nation to land near the lunar south pole.', site: 'ISRO' },
  { title: 'Astronomers Discover Earth-Sized Planet in Habitable Zone', url: 'https://exoplanets.nasa.gov', summary: 'Using TESS telescope, a new Earth-sized exoplanet found orbiting within its star\'s habitable zone.', site: 'NASA Exoplanets' },
  { title: 'Black Hole Photographed for Second Time in History', url: 'https://www.nasa.gov', summary: 'Event Horizon Telescope captures new image revealing magnetic field structure around a supermassive black hole.', site: 'EHT' },
  { title: 'Astronomers Detect Mysterious Radio Signals from Deep Space', url: 'https://www.nasa.gov', summary: 'Fast Radio Bursts detected billions of light years away — scientists puzzled by their repeating pattern.', site: 'NASA' },
  { title: 'NASA Artemis Mission Prepares to Return Humans to Moon', url: 'https://www.nasa.gov/artemis', summary: 'NASA\'s Artemis program aims to land the first woman and first person of color on the lunar surface.', site: 'NASA Artemis' },
];

document.addEventListener('DOMContentLoaded', () => {
  createNavbar('science');
  createFooter();
  initScrollReveal();
  initCursorTrail();
  initStarField();
  initScienceTabs();
  loadAPOD();
  initISSTracker();
  loadSpaceNews();
  renderDidYouKnow();
  initAsteroidGame();
});

// ═══════════════════════════════════════
// STAR FIELD BACKGROUND
// ═══════════════════════════════════════
function initStarField() {
  const canvas = document.getElementById('science-stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';

  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });

  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 1.5 + 0.3, speed: Math.random() * 0.3 + 0.05,
    opacity: Math.random() * 0.8 + 0.2, twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinkleOffset: Math.random() * Math.PI * 2,
  }));

  let time = 0;
  function drawStars() {
    ctx.clearRect(0, 0, w, h);
    time += 0.016;
    stars.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset);
      const opacity = star.opacity * (0.6 + 0.4 * twinkle);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
      star.y += star.speed;
      if (star.y > h) { star.y = 0; star.x = Math.random() * w; }
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
}

// ═══════════════════════════════════════
// TAB NAVIGATION
// ═══════════════════════════════════════
function initScienceTabs() {
  const tabs = document.querySelectorAll('.science-tab');
  const contents = document.querySelectorAll('.science-tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      contents.forEach(c => c.classList.remove('active'));
      document.getElementById(`tab-${target}`).classList.add('active');
    });
  });
}

// ═══════════════════════════════════════
// NASA APOD
// ═══════════════════════════════════════
async function loadAPOD() {
  const mediaEl = document.getElementById('apod-media');
  const contentEl = document.getElementById('apod-content');
  const dateEl = document.getElementById('apod-date-badge');
  if (!mediaEl || !contentEl) return;

  try {
    const data = await getNasaAPOD();
    if (!data) throw new Error('No data');
    if (data.code === 429 || data.error) throw new Error('Rate limited');

    if (dateEl) dateEl.textContent = data.date;

    if (data.media_type === 'video') {
      mediaEl.innerHTML = `
        <iframe
          src="${data.url}"
          class="apod-full-video"
          allowfullscreen
          title="${data.title}"
          loading="lazy"
          style="opacity:1"
        ></iframe>`;
    } else {
      mediaEl.innerHTML = `
        <img
          src="${data.hdurl || data.url}"
          alt="${data.title}"
          class="apod-full-image"
          loading="lazy"
          style="opacity:1"
          onerror="this.src='${data.url}'"
        />`;
    }

    contentEl.innerHTML = `
      <h2 class="apod-full-title">${data.title}</h2>
      ${data.copyright ? `<span class="apod-full-credit">📸 © ${data.copyright.trim()}</span>` : '<span class="apod-full-credit">📸 NASA / Public Domain</span>'}
      <p class="apod-full-explanation">${data.explanation}</p>
    `;

  } catch (err) {
    console.warn('APOD error:', err.message);
    mediaEl.innerHTML = `
      <div style="width:100%;height:300px;display:flex;align-items:center;justify-content:center;background:rgba(124,58,237,0.05)">
        <span style="font-size:5rem">🌌</span>
      </div>`;
    contentEl.innerHTML = `
      <h2 class="apod-full-title">Astronomy Picture of the Day</h2>
      <span class="apod-full-credit" style="color:#ef4444">⚠️ NASA API rate limit reached — try again in a few minutes</span>
      <p class="apod-full-explanation">The NASA Astronomy Picture of the Day features a different image or photograph of our universe each day, along with a brief explanation written by a professional astronomer.</p>
      <button onclick="loadAPOD()" style="margin-top:1rem;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);color:#a78bfa;padding:0.5rem 1.25rem;border-radius:8px;cursor:pointer;font-family:inherit">↺ Retry</button>
    `;
  }
}

// ═══════════════════════════════════════
// ISS LIVE TRACKER
// ═══════════════════════════════════════
let issMap = null;
let issMarker = null;
let issPolyline = null;
let issPath = [];

function initISSTracker() {
  issMap = L.map('iss-map', { center: [20, 0], zoom: 2, zoomControl: true, scrollWheelZoom: false, attributionControl: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { className: 'science-map-tiles' }).addTo(issMap);
  const issIcon = L.divIcon({ html: '<div class="iss-marker-icon">🛰️</div>', className: '', iconSize: [36, 36], iconAnchor: [18, 18] });
  issMarker = L.marker([20, 0], { icon: issIcon }).addTo(issMap);
  issPolyline = L.polyline([], { color: '#a78bfa', weight: 2, opacity: 0.6, dashArray: '6,4' }).addTo(issMap);
  updateISS();
  setInterval(updateISS, 5000);
}

async function updateISS() {
  try {
    const data = await getISSPosition();
    if (!data) return;
    const lat = parseFloat(data.latitude);
    const lon = parseFloat(data.longitude);
    const latEl = document.getElementById('iss-lat');
    const lonEl = document.getElementById('iss-lon');
    if (latEl) latEl.textContent = lat.toFixed(4) + '°';
    if (lonEl) lonEl.textContent = lon.toFixed(4) + '°';
    issMarker.setLatLng([lat, lon]);
    issPath.push([lat, lon]);
    if (issPath.length > 30) issPath.shift();
    issPolyline.setLatLngs(issPath);
    issMap.panTo([lat, lon], { animate: true, duration: 1 });
  } catch (err) {
    console.warn('ISS error:', err.message);
  }
}

// ═══════════════════════════════════════
// SPACE NEWS
// ═══════════════════════════════════════
async function loadSpaceNews() {
  const container = document.getElementById('space-news-list');
  if (!container) return;
  try {
    const res = await fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=6&ordering=-published_at');
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    const articles = data.results || [];
    if (articles.length === 0) throw new Error('Empty');
    container.innerHTML = articles.map(a => `
      <a href="${a.url}" target="_blank" rel="noopener" class="space-news-item">
        ${a.image_url ? `<img src="${a.image_url}" alt="" class="space-news-thumb" loading="lazy" />` : '<div class="space-news-no-img">🌌</div>'}
        <div class="space-news-text">
          <span class="space-news-src">${a.news_site}</span>
          <h4 class="space-news-ttl">${a.title}</h4>
        </div>
      </a>
    `).join('');
  } catch {
    container.innerHTML = SPACE_NEWS_FALLBACK.map(a => `
      <a href="${a.url}" target="_blank" rel="noopener" class="space-news-item">
        <div class="space-news-no-img">🌌</div>
        <div class="space-news-text">
          <span class="space-news-src">${a.site}</span>
          <h4 class="space-news-ttl">${a.title}</h4>
        </div>
      </a>
    `).join('');
  }
}

// ═══════════════════════════════════════
// DID YOU KNOW
// ═══════════════════════════════════════
function renderDidYouKnow() {
  const container = document.getElementById('did-you-know-list');
  if (!container) return;
  const selected = [...SPACE_FACTS].sort(() => Math.random() - 0.5).slice(0, 5);
  container.innerHTML = selected.map(f => `
    <div class="dyk-item"><span class="dyk-item-icon">${f.icon}</span><p class="dyk-item-text">${f.fact}</p></div>
  `).join('');
}

// ═══════════════════════════════════════
// ASTEROID DODGE GAME
// ═══════════════════════════════════════
function initAsteroidGame() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('game-start-btn');
  const restartBtn = document.getElementById('game-restart-btn');
  const overlay = document.getElementById('game-overlay');
  const gameOverOverlay = document.getElementById('game-over-overlay');

  let gameRunning = false, animId = null, score = 0, level = 1, highScore = 0, frameCount = 0;

  function resizeCanvas() {
    const container = canvas.parentElement;
    const w = container.clientWidth;
    canvas.width = w;
    canvas.height = Math.min(480, Math.max(350, window.innerHeight * 0.55));
    canvas.style.width = '100%';
    canvas.style.height = canvas.height + 'px';
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const ship = { x: 0, y: 0, w: 36, h: 36, speed: 5 };
  const keys = {};
  document.addEventListener('keydown', e => { keys[e.key] = true; });
  document.addEventListener('keyup', e => { keys[e.key] = false; });

  let touchX = null, touchY = null;
  canvas.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    if (touchX === null) return;
    ship.x = Math.max(ship.w/2, Math.min(canvas.width-ship.w/2, ship.x + e.touches[0].clientX - touchX));
    ship.y = Math.max(ship.h/2, Math.min(canvas.height-ship.h/2, ship.y + e.touches[0].clientY - touchY));
    touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { touchX = null; touchY = null; });

  let asteroids = [];
  function spawnAsteroid() {
    const size = Math.random() * 25 + 15;
    const side = Math.floor(Math.random() * 4);
    const spd = (1.5 + level * 0.4) * (Math.random() * 0.5 + 0.75);
    let x, y, vx, vy;
    if (side === 0) { x = Math.random()*canvas.width; y = -size; vx = (Math.random()-0.5)*spd; vy = spd; }
    else if (side === 1) { x = canvas.width+size; y = Math.random()*canvas.height; vx = -spd; vy = (Math.random()-0.5)*spd; }
    else if (side === 2) { x = Math.random()*canvas.width; y = canvas.height+size; vx = (Math.random()-0.5)*spd; vy = -spd; }
    else { x = -size; y = Math.random()*canvas.height; vx = spd; vy = (Math.random()-0.5)*spd; }
    asteroids.push({ x, y, vx, vy, size, angle: 0, spin: (Math.random()-0.5)*0.05 });
  }

  const gameStars = Array.from({ length: 80 }, () => ({
    x: Math.random()*800, y: Math.random()*500, r: Math.random()*1.2+0.3, opacity: Math.random()*0.6+0.2, speed: Math.random()*0.5+0.1,
  }));

  function drawShip(x, y) {
    ctx.save(); ctx.translate(x, y);
    const glow = ctx.createRadialGradient(0, 8, 0, 0, 8, 20);
    glow.addColorStop(0, 'rgba(0,255,135,0.3)'); glow.addColorStop(1, 'rgba(0,255,135,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 8, 20, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0,-18); ctx.lineTo(12,14); ctx.lineTo(6,8); ctx.lineTo(-6,8); ctx.lineTo(-12,14); ctx.closePath();
    ctx.fillStyle = '#00ff87'; ctx.fill(); ctx.strokeStyle = 'rgba(0,255,135,0.8)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,-4,4,7,0,0,Math.PI*2); ctx.fillStyle = 'rgba(0,212,170,0.8)'; ctx.fill();
    ctx.restore();
  }

  function drawAsteroid(a) {
    ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.angle);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const ang = (i/8)*Math.PI*2, r = a.size*(0.8+Math.sin(i*2.3)*0.2);
      if (i===0) ctx.moveTo(Math.cos(ang)*r, Math.sin(ang)*r);
      else ctx.lineTo(Math.cos(ang)*r, Math.sin(ang)*r);
    }
    ctx.closePath(); ctx.fillStyle = 'rgba(139,92,246,0.3)'; ctx.fill();
    ctx.strokeStyle = 'rgba(167,139,250,0.8)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
  }

  function checkCollision() {
    return asteroids.some(a => { const dx=a.x-ship.x, dy=a.y-ship.y; return Math.sqrt(dx*dx+dy*dy) < a.size+ship.w/2-10; });
  }

  function updateHUD() {
    document.getElementById('game-score').textContent = score;
    document.getElementById('game-level').textContent = level;
    document.getElementById('game-highscore').textContent = highScore;
  }

  function gameLoop() {
    frameCount++;
    ctx.fillStyle = '#020818'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    gameStars.forEach(s => {
      s.y += s.speed; if (s.y > canvas.height) { s.y = 0; s.x = Math.random()*canvas.width; }
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fillStyle = `rgba(255,255,255,${s.opacity})`; ctx.fill();
    });
    if (keys['ArrowUp']||keys['w']||keys['W']) ship.y = Math.max(ship.h/2, ship.y-ship.speed);
    if (keys['ArrowDown']||keys['s']||keys['S']) ship.y = Math.min(canvas.height-ship.h/2, ship.y+ship.speed);
    if (keys['ArrowLeft']||keys['a']||keys['A']) ship.x = Math.max(ship.w/2, ship.x-ship.speed);
    if (keys['ArrowRight']||keys['d']||keys['D']) ship.x = Math.min(canvas.width-ship.w/2, ship.x+ship.speed);
    const spawnRate = Math.max(25, 60-level*5);
    if (frameCount % spawnRate === 0) spawnAsteroid();
    asteroids = asteroids.filter(a => {
      a.x += a.vx; a.y += a.vy; a.angle += a.spin; drawAsteroid(a);
      return a.x > -100 && a.x < canvas.width+100 && a.y > -100 && a.y < canvas.height+100;
    });
    drawShip(ship.x, ship.y);
    score++; level = Math.floor(score/300)+1; updateHUD();
    if (checkCollision()) { gameOver(); return; }
    animId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    resizeCanvas();
    ship.x = canvas.width / 2;
    ship.y = canvas.height / 2;
    ship.x = canvas.width/2; ship.y = canvas.height/2;
    asteroids = []; score = 0; level = 1; frameCount = 0; gameRunning = true;
    overlay.style.display = 'none'; gameOverOverlay.style.display = 'none';
    updateHUD(); gameLoop();
  }

  function gameOver() {
    gameRunning = false; cancelAnimationFrame(animId);
    if (score > highScore) highScore = score;
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-level').textContent = level;
    document.getElementById('game-highscore').textContent = highScore;
    gameOverOverlay.style.display = 'flex';
  }

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);
}
