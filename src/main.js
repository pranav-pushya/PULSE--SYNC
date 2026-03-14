import { createNavbar } from './components/navbar.js';
import { createFooter } from './components/footer.js';
import { initScrollReveal, initParticles, typeWriter, initTiltCards } from './utils/animations.js';
import { getWordOfTheDay, getProgrammingJoke } from './utils/api.js';

// ─── Initialize Page ───
document.addEventListener('DOMContentLoaded', () => {
  createNavbar('home');
  createFooter();
  initParticles('particle-canvas');
  initScrollReveal();
  initTiltCards();
  loadTypewriter();
  loadWordOfDay();
  loadJoke();
});

// ─── Typewriter Hero Text ───
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

// ─── Word of the Day ───
async function loadWordOfDay() {
  const container = document.getElementById('word-content');
  const data = await getWordOfTheDay();
  container.innerHTML = `
    <div class="word-display">${data.word}</div>
    ${data.phonetic ? `<div class="word-phonetic">${data.phonetic}</div>` : ''}
    ${data.partOfSpeech ? `<div class="word-pos">${data.partOfSpeech}</div>` : ''}
    <p class="word-meaning">${data.meaning}</p>
  `;
}

// ─── Programming Joke ───
async function loadJoke() {
  const container = document.getElementById('joke-content');
  const joke = await getProgrammingJoke();
  container.innerHTML = `
    <p class="joke-setup">${joke.setup}</p>
    <p class="joke-delivery">${joke.delivery}</p>
  `;
}
