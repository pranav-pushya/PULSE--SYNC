import { createNavbar } from './head-foot/navbar.js';
import { createFooter } from './head-foot/footer.js';
import { initScrollReveal, initParticles, typeWriter, initTiltCards, initCursorTrail } from './api/animations.js';
import { getProgrammingJoke, getTechNews, sendGeminiMessage } from './api/api.js';

// ═══════════════════════════════════════
// PAGE INITIALIZATION
// Runs all setup functions when DOM is ready
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  createNavbar('home');
  createFooter();
  // Initialize wormhole cursor effect (hero page only)
  initCursorTrail();
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
