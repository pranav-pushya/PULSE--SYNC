// ═══════════════════════════════════════
// GAMES PAGE — PULSE-SYNC
// Memory Match, Type Rush, CS Quiz
// ═══════════════════════════════════════

import { createNavbar } from './head-foot/navbar.js';
import { createFooter } from './head-foot/footer.js';
import { initCursorTrail } from './api/animations.js';

// ─── Page Init ───
document.addEventListener('DOMContentLoaded', () => {
  createNavbar('games');
  createFooter();
  initCursorTrail();
  initGameSelector();
  initMemoryGame();
  initTypingGame();
  initQuizGame();
});

// ═══════════════════════════════════════
// GAME SELECTOR
// ═══════════════════════════════════════
function initGameSelector() {
  const btns = document.querySelectorAll('.game-select-btn');
  const panels = document.querySelectorAll('.game-panel');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.game;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      panels.forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${target}`).classList.add('active');
    });
  });
}

// ═══════════════════════════════════════
// MEMORY MATCH GAME
// ═══════════════════════════════════════
const MEMORY_CARDS = [
  { id: 1, icon: '🔁', label: 'Loop' },
  { id: 2, icon: '📦', label: 'Array' },
  { id: 3, icon: '🌲', label: 'Tree' },
  { id: 4, icon: '🔗', label: 'Link' },
  { id: 5, icon: '⚡', label: 'API' },
  { id: 6, icon: '🔐', label: 'Hash' },
  { id: 7, icon: '🧬', label: 'DNS' },
  { id: 8, icon: '💾', label: 'Stack' },
];

function initMemoryGame() {
  let flipped = [];
  let matched = [];
  let moves = 0;
  let matchCount = 0;
  let timer = null;
  let seconds = 0;
  let gameStarted = false;

  function startTimer() {
    if (timer) clearInterval(timer);
    seconds = 0;
    timer = setInterval(() => {
      seconds++;
      document.getElementById('memory-time').textContent = seconds + 's';
    }, 1000);
  }

  function stopTimer() { if (timer) clearInterval(timer); }

  function renderBoard() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;
    const cards = [...MEMORY_CARDS, ...MEMORY_CARDS]
      .map((c, i) => ({ ...c, uid: i }))
      .sort(() => Math.random() - 0.5);
    flipped = []; matched = []; moves = 0; matchCount = 0; seconds = 0; gameStarted = false;
    stopTimer();
    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-matches').textContent = '0/8';
    document.getElementById('memory-time').textContent = '0s';

    grid.innerHTML = cards.map(card => `
      <div class="memory-card" data-uid="${card.uid}" data-id="${card.id}">
        <div class="memory-card-inner">
          <div class="memory-card-front">?</div>
          <div class="memory-card-back">
            <span class="memory-card-icon">${card.icon}</span>
            <span class="memory-card-label">${card.label}</span>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.memory-card').forEach(card => {
      card.addEventListener('click', () => handleCardClick(card));
    });
  }

  function handleCardClick(card) {
    const uid = card.dataset.uid;
    const id = card.dataset.id;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flipped.length >= 2) return;
    if (!gameStarted) { gameStarted = true; startTimer(); }

    card.classList.add('flipped');
    flipped.push({ uid, id, el: card });

    if (flipped.length === 2) {
      moves++;
      document.getElementById('memory-moves').textContent = moves;
      if (flipped[0].id === flipped[1].id) {
        matchCount++;
        document.getElementById('memory-matches').textContent = `${matchCount}/8`;
        flipped.forEach(c => c.el.classList.add('matched'));
        flipped = [];
        if (matchCount === 8) {
          stopTimer();
          setTimeout(() => showMemoryWin(moves, seconds), 500);
        }
      } else {
        setTimeout(() => { flipped.forEach(c => c.el.classList.remove('flipped')); flipped = []; }, 900);
      }
    }
  }

  function showMemoryWin(moves, time) {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = `
      <div class="memory-win">
        <div class="memory-win-icon">🎉</div>
        <h3>You Won!</h3>
        <p>Completed in <strong>${moves}</strong> moves and <strong>${time}s</strong></p>
        <button class="game-action-btn" onclick="document.getElementById('memory-restart').click()">Play Again</button>
      </div>
    `;
  }

  renderBoard();
  document.getElementById('memory-restart').addEventListener('click', renderBoard);
}

// ═══════════════════════════════════════
// TYPING SPEED GAME
// ═══════════════════════════════════════
const CODE_SNIPPETS = [
  `const fetchData = async (url) => {\n  const res = await fetch(url);\n  const data = await res.json();\n  return data;\n};`,
  `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
  `const bubbleSort = (arr) => {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n};`,
  `class Stack {\n  constructor() { this.items = []; }\n  push(item) { this.items.push(item); }\n  pop() { return this.items.pop(); }\n  peek() { return this.items[this.items.length - 1]; }\n  isEmpty() { return this.items.length === 0; }\n}`,
  `const debounce = (fn, delay) => {\n  let timeout;\n  return (...args) => {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn(...args), delay);\n  };\n};`,
];

function initTypingGame() {
  let currentSnippet = '';
  let startTime = null;
  let timer = null;
  let timeLeft = 60;
  let totalChars = 0;
  let correctChars = 0;
  let gameActive = false;

  const display = document.getElementById('typing-display');
  const input = document.getElementById('typing-input');

  function loadSnippet() {
    currentSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    startTime = null; timeLeft = 60; totalChars = 0; correctChars = 0; gameActive = true;
    document.getElementById('typing-wpm').textContent = '0';
    document.getElementById('typing-acc').textContent = '100%';
    document.getElementById('typing-time').textContent = '60s';
    if (timer) clearInterval(timer);
    renderTypingDisplay('');
    input.value = ''; input.focus(); input.disabled = false;
  }

  function renderTypingDisplay(typed) {
    const chars = currentSnippet.split('');
    display.innerHTML = chars.map((char, i) => {
      const typedChar = typed[i];
      let cls = 'char-pending';
      if (typedChar !== undefined) cls = typedChar === char ? 'char-correct' : 'char-wrong';
      if (i === typed.length) cls += ' char-cursor';
      const displayChar = char === '\n' ? '↵\n' : char === ' ' ? '&nbsp;' : char;
      return `<span class="${cls}">${displayChar}</span>`;
    }).join('');
  }

  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      document.getElementById('typing-time').textContent = timeLeft + 's';
      if (timeLeft <= 0) { clearInterval(timer); gameActive = false; input.disabled = true; showTypingResult(); }
    }, 1000);
  }

  function showTypingResult() {
    const elapsed = (60 - timeLeft) || 60;
    const wpm = Math.round((correctChars / 5) / (elapsed / 60));
    const acc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    display.innerHTML = `
      <div class="typing-result">
        <div class="typing-result-icon">⌨️</div>
        <h3>Time's Up!</h3>
        <div class="typing-result-stats">
          <div><span>${wpm}</span><small>WPM</small></div>
          <div><span>${acc}%</span><small>Accuracy</small></div>
          <div><span>${correctChars}</span><small>Chars</small></div>
        </div>
        ${wpm > 60 ? '<p class="typing-praise">🔥 Blazing fast! You type like a pro developer.</p>' :
          wpm > 40 ? '<p class="typing-praise">👍 Good speed! Keep practicing.</p>' :
          '<p class="typing-praise">💪 Keep going — speed comes with practice!</p>'}
      </div>
    `;
  }

  input.addEventListener('input', () => {
    if (!gameActive) return;
    const typed = input.value;
    if (!startTime && typed.length > 0) { startTime = Date.now(); startTimer(); }
    totalChars = typed.length;
    correctChars = typed.split('').filter((c, i) => c === currentSnippet[i]).length;
    if (startTime) {
      const elapsed = (Date.now() - startTime) / 60000;
      const wpm = Math.round((correctChars / 5) / elapsed) || 0;
      const acc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
      document.getElementById('typing-wpm').textContent = wpm;
      document.getElementById('typing-acc').textContent = acc + '%';
    }
    renderTypingDisplay(typed);
    if (typed === currentSnippet) { clearInterval(timer); gameActive = false; input.disabled = true; setTimeout(showTypingResult, 300); }
  });

  loadSnippet();
  document.getElementById('typing-restart').addEventListener('click', loadSnippet);
}

// ═══════════════════════════════════════
// CS QUIZ GAME
// ═══════════════════════════════════════
const QUIZ_QUESTIONS = [
  { q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Text Machine Language', 'HyperText Machine Logic', 'Home Tool Markup Language'], answer: 0, category: 'Web Basics' },
  { q: 'Which data structure uses LIFO (Last In First Out)?', options: ['Queue', 'Stack', 'Array', 'Linked List'], answer: 1, category: 'Data Structures' },
  { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], answer: 2, category: 'Algorithms' },
  { q: 'Which HTTP method is used to retrieve data?', options: ['POST', 'PUT', 'DELETE', 'GET'], answer: 3, category: 'Web/APIs' },
  { q: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Syntax'], answer: 1, category: 'Web Basics' },
  { q: 'In Python, what is used to define a function?', options: ['function', 'func', 'def', 'define'], answer: 2, category: 'Programming' },
  { q: 'Which of these is NOT a JavaScript data type?', options: ['String', 'Boolean', 'Integer', 'Symbol'], answer: 2, category: 'JavaScript' },
  { q: 'What does SQL stand for?', options: ['Simple Query Language', 'Structured Query Language', 'Sequential Query Logic', 'System Query Language'], answer: 1, category: 'Databases' },
  { q: 'What is 1 byte equal to?', options: ['4 bits', '16 bits', '8 bits', '2 bits'], answer: 2, category: 'Computer Science' },
  { q: 'Which sorting algorithm has the best average time complexity?', options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'], answer: 1, category: 'Algorithms' },
  { q: 'What does API stand for?', options: ['Application Programming Interface', 'App Process Integration', 'Automated Program Input', 'Application Protocol Index'], answer: 0, category: 'Concepts' },
  { q: 'Which company developed JavaScript?', options: ['Microsoft', 'Google', 'Netscape', 'Apple'], answer: 2, category: 'History' },
  { q: 'What is the output of 2 ** 10 in Python?', options: ['20', '512', '1024', '100'], answer: 2, category: 'Programming' },
  { q: 'Which data structure is used for BFS traversal?', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1, category: 'Algorithms' },
  { q: 'What does OS stand for?', options: ['Open Source', 'Operating System', 'Output Stream', 'Object Storage'], answer: 1, category: 'Systems' },
];

function initQuizGame() {
  let questions = [];
  let currentQ = 0;
  let score = 0;
  let streak = 0;
  let answered = false;

  function shuffleQuestions() {
    questions = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    currentQ = 0; score = 0; streak = 0; answered = false;
  }

  function renderQuestion() {
    const q = questions[currentQ];
    answered = false;
    document.getElementById('quiz-category').textContent = q.category;
    document.getElementById('quiz-question').textContent = q.q;
    document.getElementById('quiz-progress').textContent = `${currentQ + 1}/10`;
    document.getElementById('quiz-score').textContent = score;
    document.getElementById('quiz-streak').textContent = `🔥 ${streak}`;
    const optionsEl = document.getElementById('quiz-options');
    optionsEl.innerHTML = q.options.map((opt, i) => `<button class="quiz-option" data-index="${i}">${opt}</button>`).join('');
    optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
    });
    document.getElementById('quiz-question-card').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
  }

  function handleAnswer(selected) {
    if (answered) return;
    answered = true;
    const q = questions[currentQ];
    const isCorrect = selected === q.answer;
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add('quiz-correct');
      else if (i === selected && !isCorrect) btn.classList.add('quiz-wrong');
    });
    if (isCorrect) { score += 10 + (streak * 2); streak++; } else { streak = 0; }
    document.getElementById('quiz-score').textContent = score;
    document.getElementById('quiz-streak').textContent = `🔥 ${streak}`;
    setTimeout(() => { currentQ++; if (currentQ < 10) renderQuestion(); else showQuizResult(); }, 1200);
  }

  function showQuizResult() {
    document.getElementById('quiz-question-card').style.display = 'none';
    const resultEl = document.getElementById('quiz-result');
    resultEl.style.display = 'flex';
    let icon, title, msg;
    if (score >= 100) { icon = '🏆'; title = 'Outstanding!'; msg = 'You\'re a CS genius. Perfect quiz material!'; }
    else if (score >= 70) { icon = '🥇'; title = 'Excellent!'; msg = 'Great knowledge! You know your CS fundamentals.'; }
    else if (score >= 50) { icon = '👍'; title = 'Good Job!'; msg = 'Solid performance. Keep learning and you\'ll ace it!'; }
    else { icon = '💪'; title = 'Keep Going!'; msg = 'Every expert was once a beginner. Try again!'; }
    document.getElementById('quiz-result-icon').textContent = icon;
    document.getElementById('quiz-result-title').textContent = title;
    document.getElementById('quiz-result-score').textContent = `Score: ${score} / 120`;
    document.getElementById('quiz-result-msg').textContent = msg;
  }

  shuffleQuestions();
  renderQuestion();
  document.getElementById('quiz-restart-btn').addEventListener('click', () => { shuffleQuestions(); renderQuestion(); });
}
