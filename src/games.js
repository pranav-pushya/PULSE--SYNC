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
  initCodeBreaker();
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
// CODE BREAKER GAME
// Crack the 4-digit secret code in 6 tries
// Green = right digit right place
// Yellow = right digit wrong place
// Grey = digit not in code
// ═══════════════════════════════════════
function initCodeBreaker() {
  let secretCode = [];
  let attempts = 0;
  let maxAttempts = 6;
  let wins = 0;
  let bestAttempt = null;
  let gameOver = false;

  // ─── Generate random 4-digit code ───
  function generateCode() {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
  }

  // ─── Initialize board with empty rows ───
  function initBoard() {
    const board = document.getElementById('cb-board');
    if (!board) return;
    board.innerHTML = Array.from({ length: maxAttempts }, (_, i) => `
      <div class="cb-row" id="cb-row-${i}">
        <div class="cb-cells">
          <div class="cb-cell" id="cb-cell-${i}-0">?</div>
          <div class="cb-cell" id="cb-cell-${i}-1">?</div>
          <div class="cb-cell" id="cb-cell-${i}-2">?</div>
          <div class="cb-cell" id="cb-cell-${i}-3">?</div>
        </div>
        <div class="cb-feedback" id="cb-feedback-${i}">
          <span class="cb-dot grey"></span>
          <span class="cb-dot grey"></span>
          <span class="cb-dot grey"></span>
          <span class="cb-dot grey"></span>
        </div>
      </div>
    `).join('');
  }

  // ─── Check guess against secret code ───
  function checkGuess(guess) {
    const result = Array(4).fill('grey');
    const codeCopy = [...secretCode];
    const guessCopy = [...guess];

    // First pass — find exact matches (green)
    for (let i = 0; i < 4; i++) {
      if (guess[i] === secretCode[i]) {
        result[i] = 'green';
        codeCopy[i] = null;
        guessCopy[i] = null;
      }
    }

    // Second pass — find wrong position matches (yellow)
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === null) continue;
      const idx = codeCopy.indexOf(guessCopy[i]);
      if (idx !== -1) {
        result[i] = 'yellow';
        codeCopy[idx] = null;
      }
    }

    return result;
  }

  // ─── Render a completed row ───
  function renderRow(rowIdx, guess, result) {
    guess.forEach((digit, i) => {
      const cell = document.getElementById(`cb-cell-${rowIdx}-${i}`);
      if (cell) {
        cell.textContent = digit;
        cell.classList.add(result[i]);
      }
    });

    const feedback = document.getElementById(`cb-feedback-${rowIdx}`);
    if (feedback) {
      feedback.innerHTML = result.map(r =>
        `<span class="cb-dot ${r}"></span>`
      ).join('');
    }
  }

  // ─── Handle guess submission ───
  function submitGuess() {
    if (gameOver) return;

    const inputs = ['cb-d1', 'cb-d2', 'cb-d3', 'cb-d4'];
    const guess = inputs.map(id => {
      const val = document.getElementById(id)?.value;
      return val !== '' && val !== null ? parseInt(val) : null;
    });

    // Validate — all 4 digits must be filled
    if (guess.some(d => d === null || isNaN(d) || d < 0 || d > 9)) {
      inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.add('cb-input-error');
          setTimeout(() => el.classList.remove('cb-input-error'), 500);
        }
      });
      return;
    }

    const result = checkGuess(guess);
    renderRow(attempts, guess, result);
    attempts++;

    document.getElementById('cb-attempts').textContent = maxAttempts - attempts;

    // Clear inputs and focus first
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('cb-d1')?.focus();

    // Check win
    if (result.every(r => r === 'green')) {
      wins++;
      if (!bestAttempt || attempts < bestAttempt) bestAttempt = attempts;
      document.getElementById('cb-wins').textContent = wins;
      document.getElementById('cb-best').textContent = bestAttempt + ' tries';
      showResult(true);
      return;
    }

    // Check loss
    if (attempts >= maxAttempts) {
      showResult(false);
    }
  }

  // ─── Show win/loss result ───
  function showResult(won) {
    gameOver = true;
    document.getElementById('cb-input-area').style.display = 'none';
    document.getElementById('cb-action-row').style.display = 'none';

    const resultEl = document.getElementById('cb-result');
    resultEl.style.display = 'flex';

    if (won) {
      document.getElementById('cb-result-icon').textContent = attempts <= 2 ? '🏆' : attempts <= 4 ? '🎉' : '😅';
      document.getElementById('cb-result-title').textContent = attempts <= 2 ? 'Genius!' : attempts <= 4 ? 'Cracked It!' : 'Phew!';
      document.getElementById('cb-result-msg').textContent = `You cracked the code ${secretCode.join('')} in ${attempts} attempt${attempts > 1 ? 's' : ''}!`;
    } else {
      document.getElementById('cb-result-icon').textContent = '💀';
      document.getElementById('cb-result-title').textContent = 'Code Not Cracked!';
      document.getElementById('cb-result-msg').textContent = `The secret code was ${secretCode.join('')}. Better luck next time!`;
    }
  }

  // ─── Start new game ───
  function newGame() {
    secretCode = generateCode();
    attempts = 0;
    gameOver = false;

    document.getElementById('cb-attempts').textContent = maxAttempts;
    document.getElementById('cb-result').style.display = 'none';
    document.getElementById('cb-input-area').style.display = 'flex';
    document.getElementById('cb-action-row').style.display = 'flex';

    initBoard();

    // Focus first input
    document.getElementById('cb-d1')?.focus();

    // Auto-advance inputs
    ['cb-d1', 'cb-d2', 'cb-d3', 'cb-d4'].forEach((id, idx, arr) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        if (el.value.length >= 1 && idx < arr.length - 1) {
          document.getElementById(arr[idx + 1])?.focus();
        }
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitGuess();
        if (e.key === 'Backspace' && el.value === '' && idx > 0) {
          document.getElementById(arr[idx - 1])?.focus();
        }
      });
    });
  }

  newGame();

  document.getElementById('cb-submit')?.addEventListener('click', submitGuess);
  document.getElementById('cb-new-game')?.addEventListener('click', newGame);
  document.getElementById('cb-restart')?.addEventListener('click', () => {
    newGame();
    document.getElementById('cb-result').style.display = 'none';
    document.getElementById('cb-input-area').style.display = 'flex';
    document.getElementById('cb-action-row').style.display = 'flex';
  });
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
  `function fibonacci(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}`,
  `const memoize = (fn) => {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n};`,
  `async function retry(fn, times = 3) {\n  for (let i = 0; i < times; i++) {\n    try {\n      return await fn();\n    } catch (err) {\n      if (i === times - 1) throw err;\n      await new Promise(r => setTimeout(r, 1000 * (i + 1)));\n    }\n  }\n}`,
  `const flatten = (arr, depth = 1) => {\n  return arr.reduce((flat, item) => {\n    return flat.concat(\n      Array.isArray(item) && depth > 1\n        ? flatten(item, depth - 1)\n        : item\n    );\n  }, []);\n};`,
  `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
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
  { q: 'What does OOP stand for?', options: ['Object Oriented Programming', 'Open Output Protocol', 'Ordered Operation Process', 'Object Output Pipeline'], answer: 0, category: 'Programming' },
  { q: 'Which of these is a version control system?', options: ['Docker', 'Git', 'Linux', 'Apache'], answer: 1, category: 'Dev Tools' },
  { q: 'What is the default port for HTTP?', options: ['443', '8080', '80', '21'], answer: 2, category: 'Networking' },
  { q: 'In JavaScript, what does "===" mean?', options: ['Assignment', 'Loose equality', 'Strict equality', 'Not equal'], answer: 2, category: 'JavaScript' },
  { q: 'Which data structure is used for DFS traversal?', options: ['Queue', 'Heap', 'Stack', 'Array'], answer: 2, category: 'Algorithms' },
  { q: 'What is the full form of RAM?', options: ['Read Access Memory', 'Random Access Memory', 'Rapid Access Module', 'Read Anywhere Memory'], answer: 1, category: 'Hardware' },
  { q: 'Which language is primarily used for iOS development?', options: ['Kotlin', 'Swift', 'Dart', 'Ruby'], answer: 1, category: 'Mobile Dev' },
  { q: 'What does CPU stand for?', options: ['Central Program Unit', 'Computer Processing Unit', 'Central Processing Unit', 'Core Processing Utility'], answer: 2, category: 'Hardware' },
  { q: 'What is the time complexity of inserting in a Hash Table?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 3, category: 'DSA' },
  { q: 'Which protocol is used for secure web browsing?', options: ['FTP', 'HTTP', 'HTTPS', 'SMTP'], answer: 2, category: 'Networking' },
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
