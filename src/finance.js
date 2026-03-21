import { createNavbar } from './components/navbar.js';
import { createFooter } from './components/footer.js';
import { initScrollReveal } from './utils/animations.js';
import { getCurrencyRates, getCryptoPrices } from './utils/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ─── Initialize cursor trail on this page ───
  const { initCursorTrail } = await import('./utils/animations.js');
  initCursorTrail();

  createNavbar('finance');
  createFooter();
  initScrollReveal();
  loadCurrency();
  loadCrypto();
});

// ═══════════════════════════════════════
// CURRENCY EXCHANGE RATES
// Fetches live USD rates from open.er-api.com
// Shows INR, EUR, GBP, JPY pairs
// ═══════════════════════════════════════
async function loadCurrency() {
  const container = document.getElementById('currency-content');
  const data = await getCurrencyRates();

  if (!data) {
    container.innerHTML = '<p style="color:var(--text-muted)">Unable to load currency data</p>';
    return;
  }

  container.innerHTML = `
    <div class="currency-rate">
      <span class="currency-value">${data.INR.toFixed(2)}</span>
      <span class="currency-label">INR / 1 USD</span>
    </div>
    <div class="currency-pair">
      <span class="currency-pair-name">🇺🇸 USD → 🇮🇳 INR</span>
      <span class="currency-pair-value">₹${data.INR.toFixed(2)}</span>
    </div>
    <div class="currency-pair">
      <span class="currency-pair-name">🇺🇸 USD → 🇪🇺 EUR</span>
      <span class="currency-pair-value">€${data.EUR.toFixed(4)}</span>
    </div>
    <div class="currency-pair">
      <span class="currency-pair-name">🇺🇸 USD → 🇬🇧 GBP</span>
      <span class="currency-pair-value">£${data.GBP.toFixed(4)}</span>
    </div>
    <div class="currency-pair">
      <span class="currency-pair-name">🇺🇸 USD → 🇯🇵 JPY</span>
      <span class="currency-pair-value">¥${data.JPY.toFixed(2)}</span>
    </div>
    <p class="currency-update">Last updated: ${data.lastUpdate || 'N/A'}</p>
  `;
}

// ═══════════════════════════════════════
// CRYPTOCURRENCY PRICES
// Fetches top 6 coins from CoinGecko API
// Includes 7-day sparkline charts
// Calculates market mood from avg 24h change
// ═══════════════════════════════════════
async function loadCrypto() {
  const grid = document.getElementById('crypto-grid');
  const coins = await getCryptoPrices();

  if (!coins || coins.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1">Unable to load crypto data</p>';
    updateMood(null);
    return;
  }

  grid.innerHTML = coins
    .map((coin) => {
      const change = coin.price_change_percentage_24h;
      const changeClass = change >= 0 ? 'positive' : 'negative';
      const changeSign = change >= 0 ? '+' : '';
      const sparkline = coin.sparkline_in_7d?.price || [];

      return `
      <div class="crypto-coin">
        <div class="crypto-coin-header">
          <img class="crypto-coin-img" src="${coin.image}" alt="${coin.name}" loading="lazy" />
          <div>
            <div class="crypto-coin-name">${coin.name}</div>
            <div class="crypto-coin-symbol">${coin.symbol}</div>
          </div>
        </div>
        <div class="crypto-price">$${formatPrice(coin.current_price)}</div>
        <div class="crypto-change ${changeClass}">
          ${changeSign}${change?.toFixed(2) || '0.00'}%
        </div>
        ${sparkline.length > 0 ? renderSparkline(sparkline, change >= 0) : ''}
      </div>
    `;
    })
    .join('');

  updateMood(coins);
}

// ─── Helper: Format crypto price based on value range ───
function formatPrice(price) {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

// ─── Helper: Generate inline SVG sparkline chart ───
function renderSparkline(data, isPositive) {
  // Downsample to ~30 points
  const step = Math.max(1, Math.floor(data.length / 30));
  const points = data.filter((_, i) => i % step === 0);
  
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 160;
  const height = 40;

  const pathPoints = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  const color = isPositive ? '#10b981' : '#ef4444';

  return `
    <div class="crypto-sparkline">
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <path d="${pathPoints}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;
}

// ─── Helper: Calculate and display market sentiment ───
function updateMood(coins) {
  const emoji = document.getElementById('mood-emoji');
  const indicator = document.getElementById('mood-indicator');
  const desc = document.getElementById('mood-description');

  if (!coins) {
    emoji.textContent = '❓';
    indicator.textContent = 'Data Unavailable';
    indicator.style.color = 'var(--text-muted)';
    desc.textContent = 'Unable to calculate market sentiment';
    return;
  }

  const avgChange =
    coins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / coins.length;

  if (avgChange > 3) {
    emoji.textContent = '🚀';
    indicator.textContent = 'EXTREMELY BULLISH';
    indicator.style.color = 'var(--accent-green)';
    desc.textContent = `Markets surging with avg ${avgChange.toFixed(1)}% gains across top coins`;
  } else if (avgChange > 1) {
    emoji.textContent = '📈';
    indicator.textContent = 'BULLISH';
    indicator.style.color = 'var(--accent-green)';
    desc.textContent = `Positive momentum with avg ${avgChange.toFixed(1)}% gains`;
  } else if (avgChange > -1) {
    emoji.textContent = '😐';
    indicator.textContent = 'NEUTRAL';
    indicator.style.color = 'var(--accent-orange)';
    desc.textContent = `Markets trading sideways at avg ${avgChange.toFixed(1)}%`;
  } else if (avgChange > -3) {
    emoji.textContent = '📉';
    indicator.textContent = 'BEARISH';
    indicator.style.color = 'var(--accent-red)';
    desc.textContent = `Markets dipping with avg ${avgChange.toFixed(1)}% losses`;
  } else {
    emoji.textContent = '💀';
    indicator.textContent = 'EXTREMELY BEARISH';
    indicator.style.color = 'var(--accent-red)';
    desc.textContent = `Heavy losses at avg ${avgChange.toFixed(1)}% — HODL tight`;
  }
}
