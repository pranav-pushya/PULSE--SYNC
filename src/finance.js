// ═══════════════════════════════════════
// FINANCE PAGE — PULSE-SYNC
// Handles crypto markets, currency converter,
// FAANG stocks and financial insights
// ═══════════════════════════════════════

import { createNavbar } from './head-foot/navbar.js';
import { createFooter } from './head-foot/footer.js';
import { initScrollReveal, initTiltCards } from './api/animations.js';
import { getCurrencyRates, getCryptoPrices } from './api/api.js';

// ─── Hardcoded FAANG stocks (delayed data) ───
const FAANG_DATA = [
  { symbol:'AAPL', name:'Apple Inc.', price:189.30, change:+1.24 },
  { symbol:'GOOGL', name:'Alphabet Inc.', price:175.84, change:-0.87 },
  { symbol:'META', name:'Meta Platforms', price:512.40, change:+2.31 },
  { symbol:'AMZN', name:'Amazon.com', price:201.20, change:+0.95 },
  { symbol:'MSFT', name:'Microsoft Corp.', price:415.50, change:-1.10 },
  { symbol:'NFLX', name:'Netflix Inc.', price:628.90, change:+3.45 },
];

// ─── Page Initialization ───
document.addEventListener('DOMContentLoaded', async () => {
  createNavbar('finance');
  createFooter();
  initScrollReveal();
  initTiltCards();
  initTabs();
  await loadMarkets();
  await loadCurrencyRates();
  initConverter();
  renderStocks();
});

// ═══════════════════════════════════════
// TAB NAVIGATION
// Switches between Markets, Converter, Insights
// ═══════════════════════════════════════
function initTabs() {
  const tabs = document.querySelectorAll('.finance-tab');
  const contents = document.querySelectorAll('.finance-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tab buttons
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update content panels
      contents.forEach(c => c.classList.remove('active'));
      document.getElementById(`tab-${target}`).classList.add('active');
    });
  });
}

// ═══════════════════════════════════════
// MARKETS TAB
// Fetches crypto prices and renders cards
// ═══════════════════════════════════════
async function loadMarkets() {
  const grid = document.getElementById('crypto-grid');
  if (!grid) return;

  try {
    const coins = await getCryptoPrices();
    if (!coins || coins.length === 0) throw new Error('No data');

    // ─── Calculate market mood from avg 24h change ───
    const avgChange = coins.reduce((sum, c) =>
      sum + (c.price_change_percentage_24h || 0), 0) / coins.length;
    renderMood(avgChange);

    // ─── Render crypto cards ───
    grid.innerHTML = coins.map(coin => {
      const change = coin.price_change_percentage_24h || 0;
      const isPositive = change >= 0;

      return `
        <div class="crypto-card">
          <div class="crypto-card-header">
            <img src="${coin.image}" alt="${coin.name}" class="crypto-img" loading="lazy" />
            <div class="crypto-name-group">
              <span class="crypto-name">${coin.name}</span>
              <span class="crypto-symbol">${coin.symbol.toUpperCase()}</span>
            </div>
            <span class="crypto-change ${isPositive ? 'positive' : 'negative'}">
              ${isPositive ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%
            </span>
          </div>
          <div class="crypto-price">${formatPrice(coin.current_price)}</div>
          <div class="crypto-meta">
            <span>MCap: $${formatLarge(coin.market_cap)}</span>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.warn('Crypto error:', err.message);
    grid.innerHTML = `
      <div class="error-state" style="grid-column:1/-1">
        <span>⚠️</span>
        <p>Could not load crypto data</p>
        <button onclick="location.reload()">Retry</button>
      </div>`;
  }
}

// ─── Helper: Render market mood indicator ───
function renderMood(avgChange) {
  const icon = document.getElementById('mood-icon');
  const value = document.getElementById('mood-value');
  const desc = document.getElementById('mood-desc');

  if (!icon || !value || !desc) return;

  if (avgChange > 2) {
    icon.textContent = '🚀';
    value.textContent = 'BULLISH';
    value.style.color = '#00ff87';
    desc.textContent = `Markets pumping — avg ${avgChange.toFixed(2)}% gain today`;
  } else if (avgChange > 0) {
    icon.textContent = '📈';
    value.textContent = 'SLIGHTLY BULLISH';
    value.style.color = '#00d4aa';
    desc.textContent = `Cautious optimism — avg ${avgChange.toFixed(2)}% gain today`;
  } else if (avgChange > -2) {
    icon.textContent = '😐';
    value.textContent = 'NEUTRAL';
    value.style.color = '#fbbf24';
    desc.textContent = `Markets trading sideways — avg ${avgChange.toFixed(2)}% change`;
  } else {
    icon.textContent = '🐻';
    value.textContent = 'BEARISH';
    value.style.color = '#ef4444';
    desc.textContent = `Markets down — avg ${avgChange.toFixed(2)}% loss today`;
  }
}

// ─── Helper: Format crypto price ───
function formatPrice(price) {
  if (price >= 1000) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 1) return '$' + price.toFixed(2);
  return '$' + price.toFixed(6);
}

// ─── Helper: Format large numbers ───
function formatLarge(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  return num.toLocaleString();
}

// ─── Helper: Render SVG sparkline chart ───
function renderSparkline(prices) {
  if (!prices || prices.length === 0) return '<div style="height:40px"></div>';

  const w = 200, h = 40;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  const isUp = prices[prices.length - 1] >= prices[0];
  const color = isUp ? '#00ff87' : '#ef4444';

  return `
    <svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `;
}

// ─── Render FAANG stocks ───
function renderStocks() {
  const grid = document.getElementById('stocks-grid');
  if (!grid) return;

  grid.innerHTML = FAANG_DATA.map(stock => {
    const isPositive = stock.change >= 0;
    return `
      <div class="stock-card">
        <div class="stock-info">
          <span class="stock-name">${stock.name}</span>
          <span class="stock-ticker">${stock.symbol}</span>
        </div>
        <div class="stock-price-group">
          <span class="stock-price">$${stock.price.toFixed(2)}</span>
          <span class="stock-change ${isPositive ? 'positive' : 'negative'}">
            ${isPositive ? '+' : ''}${stock.change.toFixed(2)}%
          </span>
        </div>
      </div>
    `;
  }).join('');
}

// ═══════════════════════════════════════
// CURRENCY CONVERTER TAB
// Fetches live rates and converts on demand
// ═══════════════════════════════════════
let ratesData = null;

async function loadCurrencyRates() {
  try {
    const data = await getCurrencyRates();
    if (!data) throw new Error('No rates');
    ratesData = data;
    renderQuickRates(data);
  } catch (err) {
    console.warn('Currency error:', err.message);
    document.getElementById('quick-rates-grid').innerHTML =
      '<p style="color:var(--text-muted);font-size:0.8rem">Could not load rates</p>';
  }
}

// ─── Render quick INR rates ───
function renderQuickRates(rates) {
  const grid = document.getElementById('quick-rates-grid');
  if (!grid || !rates.rates) return;

  // Show rates relative to INR (how many INR = 1 of each currency)
  const inrRate = rates.rates['INR'] || 1;
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'SGD', 'AED'];

  grid.innerHTML = currencies.map(cur => {
    const curRate = rates.rates[cur] || 1;
    // 1 unit of currency = X INR
    const inrValue = inrRate / curRate;
    return `
      <div class="quick-rate-item">
        <span class="quick-rate-cur">${cur}</span>
        <span class="quick-rate-val">₹${inrValue.toFixed(2)}</span>
      </div>
    `;
  }).join('');
}

// ─── Currency converter logic ───
function initConverter() {
  const btn = document.getElementById('converter-btn');
  const swap = document.getElementById('converter-swap');
  const amountEl = document.getElementById('converter-amount');
  const fromEl = document.getElementById('converter-from');
  const toEl = document.getElementById('converter-to');

  if (!btn) return;

  btn.addEventListener('click', convertCurrency);
  amountEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') convertCurrency(); });

  // ─── Swap currencies ───
  swap.addEventListener('click', () => {
    const temp = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = temp;
    convertCurrency();
  });
}

// ─── Perform conversion ───
function convertCurrency() {
  const amount = parseFloat(document.getElementById('converter-amount').value);
  const from = document.getElementById('converter-from').value;
  const to = document.getElementById('converter-to').value;
  const resultAmount = document.getElementById('result-amount');
  const resultRate = document.getElementById('result-rate');

  if (!ratesData || !ratesData.rates) {
    resultAmount.textContent = 'Loading rates...';
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    resultAmount.textContent = 'Enter a valid amount';
    return;
  }

  // Convert via USD base
  const fromRate = ratesData.rates[from] || 1;
  const toRate = ratesData.rates[to] || 1;
  const result = (amount / fromRate) * toRate;
  const rate = toRate / fromRate;

  resultAmount.textContent = `${amount} ${from} = ${result.toFixed(4)} ${to}`;
  resultRate.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
}
