import { createNavbar } from './components/navbar.js';
import { createFooter } from './components/footer.js';
import { initScrollReveal } from './utils/animations.js';
import { getNasaAPOD, getNextLaunch, getISSPosition } from './utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
  createNavbar('science');
  createFooter();
  initScrollReveal();
  loadAPOD();
  loadSpaceXLaunch();
  initISSTracker();
});

// ─── NASA Astronomy Picture of the Day ───
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

// ─── SpaceX Next Launch ───
let launchDate = null;

async function loadSpaceXLaunch() {
  const nameEl = document.getElementById('launch-name');
  const detailsEl = document.getElementById('launch-details');
  const data = await getNextLaunch();

  if (!data) {
    nameEl.textContent = 'Data Unavailable';
    detailsEl.textContent = 'Could not fetch next SpaceX launch.';
    return;
  }

  nameEl.textContent = data.name || 'Upcoming Mission';
  detailsEl.textContent = data.details || `Flight #${data.flight_number || '?'} — Waiting for mission details`;
  
  if (data.date_utc) {
    launchDate = new Date(data.date_utc);
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}

function updateCountdown() {
  if (!launchDate) return;

  const now = new Date();
  const diff = launchDate - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}

// ─── ISS Live Tracker (Leaflet Map) ───
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
