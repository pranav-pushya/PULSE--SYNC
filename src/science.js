import { createNavbar } from './head-foot/navbar.js';
import { createFooter } from './head-foot/footer.js';
import { initScrollReveal } from './api/animations.js';
import { getNasaAPOD, getISSPosition } from './api/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ─── Initialize cursor trail on this page ───
  const { initCursorTrail } = await import('./utils/animations.js');
  initCursorTrail();

  createNavbar('science');
  createFooter();
  initScrollReveal();
  loadAPOD();
  initISSTracker();
});

// ═══════════════════════════════════════
// NASA ASTRONOMY PICTURE OF THE DAY
// Uses NASA DEMO_KEY (free, 30 req/hour limit)
// Handles both image and video media types
// ═══════════════════════════════════════
async function loadAPOD() {
  const imageWrapper = document.getElementById('apod-image-wrapper');
  const contentEl = document.getElementById('apod-content');
  const data = await getNasaAPOD();

  if (!data) {
    imageWrapper.innerHTML = '<div style="height:300px;display:flex;align-items:center;justify-content:center;color:var(--text-muted)">Unable to load NASA APOD</div>';
    contentEl.innerHTML = '';
    return;
  }

  if (data.media_type === 'video') {
    imageWrapper.innerHTML = `<iframe src="${data.url}" style="width:100%;height:400px;border:none" allowfullscreen title="${data.title}"></iframe>`;
  } else {
    imageWrapper.innerHTML = `<img class="apod-image" src="${data.url}" alt="${data.title}" loading="lazy" />`;
  }

  contentEl.innerHTML = `
    <h3 class="apod-title">${data.title}</h3>
    <p class="apod-date">📅 ${data.date}</p>
    <p class="apod-explanation">${data.explanation}</p>
  `;
}


// ═══════════════════════════════════════
// ISS LIVE TRACKER
// Fetches ISS position every 5 seconds
// Renders on Leaflet.js map with flight path
// ═══════════════════════════════════════
let issMap = null;
let issMarker = null;
let issPath = [];

async function initISSTracker() {
  // Initialize map
  issMap = L.map('iss-map', {
    center: [0, 0],
    zoom: 2,
    zoomControl: false,
    attributionControl: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
  }).addTo(issMap);

  // Custom ISS icon
  const issIcon = L.divIcon({
    html: '<div style="font-size:1.8rem;filter:drop-shadow(0 0 8px rgba(0,240,255,0.6))">🛰️</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    className: '',
  });

  issMarker = L.marker([0, 0], { icon: issIcon }).addTo(issMap);

  // Initial fetch
  await updateISS();

  // Update every 5 seconds
  setInterval(updateISS, 5000);
}

// ─── Helper: Fetch latest ISS coordinates and update map ───
async function updateISS() {
  const data = await getISSPosition();
  if (!data || !data.latitude || !data.longitude) return;

  const lat = parseFloat(data.latitude);
  const lon = parseFloat(data.longitude);

  document.getElementById('iss-lat').textContent = lat.toFixed(4) + '°';
  document.getElementById('iss-lon').textContent = lon.toFixed(4) + '°';

  issMarker.setLatLng([lat, lon]);
  issMap.setView([lat, lon], issMap.getZoom(), { animate: true });

  // Draw flight path
  issPath.push([lat, lon]);
  if (issPath.length > 50) issPath.shift();
  
  // Remove old path
  issMap.eachLayer((layer) => {
    if (layer instanceof L.Polyline) issMap.removeLayer(layer);
  });

  if (issPath.length > 1) {
    L.polyline(issPath, {
      color: '#00f0ff',
      weight: 2,
      opacity: 0.5,
      dashArray: '5, 10',
    }).addTo(issMap);
  }
}
