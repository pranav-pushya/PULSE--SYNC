import { createNavbar } from './components/navbar.js';
import { createFooter } from './components/footer.js';
import { initScrollReveal, initParticles, typeWriter, initTiltCards, initCursorTrail } from './utils/animations.js';
import { getProgrammingJoke, getTechNews, sendGeminiMessage } from './utils/api.js';

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
  loadTypewriter();
  loadHomeNews();
  initChatbot();
  loadJoke();
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
      <a href="${a.url}" target="_blank" rel="noopener" class="news-card">
        <div class="news-source">${a.source.name}</div>
        <h4 class="news-title">${a.title}</h4>
        <p class="news-desc">${a.description || ''}</p>
      </a>
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
