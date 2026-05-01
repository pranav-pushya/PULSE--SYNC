// ═══════════════════════════════════════
// GAMES PAGE — PULSE-SYNC
// Memory Match, Type Rush, CS Quiz
// ═══════════════════════════════════════

import { createNavbar } from './head-foot/navbar.js';
import { createFooter } from './head-foot/footer.js';
// No cursor trail on games page

// ─── Page Init ───
document.addEventListener('DOMContentLoaded', () => {
  createNavbar('games');
  createFooter();
  initGameSelector();
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
// ═══════════════════════════════════════
(function() {
  let digits = 4;
  let maxAttempts = 6;
  let secretCode = [];
  let currentAttempt = 0;
  let wins = 0;
  let bestAttempt = Infinity;
  let gameActive = false;

  const board = document.getElementById('cb-board');
  const inputRow = document.getElementById('cb-input-row');
  const submitBtn = document.getElementById('cb-submit');
  const newGameBtn = document.getElementById('cb-new-game');
  const resultEl = document.getElementById('cb-result');
  const resultIcon = document.getElementById('cb-result-icon');
  const resultTitle = document.getElementById('cb-result-title');
  const resultMsg = document.getElementById('cb-result-msg');
  const restartBtn = document.getElementById('cb-restart');
  const attemptsEl = document.getElementById('cb-attempts');
  const winsEl = document.getElementById('cb-wins');
  const bestEl = document.getElementById('cb-best');
  const levelBtns = document.querySelectorAll('.cb-level-btn');
  const descEl = document.querySelector('#panel-memory .game-panel-desc');

  function buildInputs() {
    inputRow.innerHTML = '';
    for (let i = 0; i < digits; i++) {
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.className = 'cb-digit-input';
      inp.id = `cb-d${i+1}`;
      inp.min = 0; inp.max = 9;
      inp.placeholder = '?';
      inp.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g,'').slice(0,1);
        const next = document.getElementById(`cb-d${i+2}`);
        if (this.value && next) next.focus();
      });
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !this.value) {
          const prev = document.getElementById(`cb-d${i}`);
          if (prev) prev.focus();
        }
        if (e.key === 'Enter') submitBtn.click();
      });
      inputRow.appendChild(inp);
    }
  }

  function generateCode() {
    secretCode = [];
    for (let i = 0; i < digits; i++) {
      secretCode.push(Math.floor(Math.random() * 10));
    }
  }

  function startGame() {
    generateCode();
    currentAttempt = 0;
    gameActive = true;
    board.innerHTML = '';
    resultEl.style.display = 'none';
    document.getElementById('cb-input-area').style.display = 'block';
    attemptsEl.textContent = maxAttempts;
    buildInputs();
    document.getElementById('cb-d1').focus();
  }

  function getGuessColors(guess, secret) {
    const result = Array(digits).fill('grey');
    const secretLeft = [...secret];
    const guessLeft = [...guess];

    // First pass: correct position
    for (let i = 0; i < digits; i++) {
      if (guess[i] === secret[i]) {
        result[i] = 'green';
        secretLeft[i] = null;
        guessLeft[i] = null;
      }
    }
    // Second pass: wrong position
    for (let i = 0; i < digits; i++) {
      if (guessLeft[i] === null) continue;
      const idx = secretLeft.indexOf(guessLeft[i]);
      if (idx !== -1) {
        result[i] = 'yellow';
        secretLeft[idx] = null;
      }
    }
    return result;
  }

  function submitGuess() {
    if (!gameActive) return;
    const inputs = inputRow.querySelectorAll('.cb-digit-input');
    const guess = [];
    let valid = true;
    inputs.forEach(inp => {
      if (inp.value === '') valid = false;
      else guess.push(parseInt(inp.value));
    });
    if (!valid) {
      inputs.forEach(inp => { if (!inp.value) inp.style.borderColor = 'rgba(239,68,68,0.8)'; });
      setTimeout(() => inputs.forEach(inp => inp.style.borderColor = ''), 600);
      return;
    }

    currentAttempt++;
    const colors = getGuessColors(guess, secretCode);

    // Render row on board
    const row = document.createElement('div');
    row.className = 'cb-row';
    guess.forEach((d, i) => {
      const cell = document.createElement('div');
      cell.className = `cb-cell ${colors[i]}`;
      cell.textContent = d;
      row.appendChild(cell);
    });
    board.appendChild(row);

    // Clear inputs
    inputs.forEach(inp => { inp.value = ''; });
    inputs[0].focus();

    const remaining = maxAttempts - currentAttempt;
    attemptsEl.textContent = remaining;

    // Win check
    if (colors.every(c => c === 'green')) {
      gameActive = false;
      wins++;
      winsEl.textContent = wins;
      if (currentAttempt < bestAttempt) {
        bestAttempt = currentAttempt;
        bestEl.textContent = currentAttempt;
      }
      showResult('🏆', 'Code Cracked!', `You got it in ${currentAttempt} attempt${currentAttempt > 1 ? 's' : ''}!`);
      return;
    }

    // Lose check
    if (currentAttempt >= maxAttempts) {
      gameActive = false;
      showResult('💀', 'Access Denied', `The code was: ${secretCode.join(' ')}`);
    }
  }

  function showResult(icon, title, msg) {
    resultIcon.textContent = icon;
    resultTitle.textContent = title;
    resultMsg.textContent = msg;
    resultEl.style.display = 'flex';
    document.getElementById('cb-input-area').style.display = 'none';
  }

  // Level selector
  levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      levelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      digits = parseInt(btn.dataset.digits);
      maxAttempts = parseInt(btn.dataset.attempts);
      if (descEl) descEl.textContent = `Crack the secret ${digits}-digit code in ${maxAttempts} attempts — like Wordle but for hackers!`;
      startGame();
    });
  });

  if (submitBtn) submitBtn.addEventListener('click', submitGuess);
  if (newGameBtn) newGameBtn.addEventListener('click', startGame);
  if (restartBtn) restartBtn.addEventListener('click', startGame);

  startGame();
})();

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

// ═══ WHACK-A-BUG GAME ═══
(function() {
  const BUGS = ['🐛','🦟','💀','☠️','🐞','🔴'];
  const FEATURES = ['✅','⭐','🚀','💡','🟢','🔧'];
  const HOLES = 12;
  let score=0, lives=3, timeLeft=30, gameActive=false;
  let moleTimer=null, countdown=null, activeHoles={};

  const grid = document.getElementById('wam-grid');
  const overlay = document.getElementById('wam-overlay');
  const result = document.getElementById('wam-result');
  const scoreEl = document.getElementById('wam-score');
  const livesEl = document.getElementById('wam-lives');
  const timeEl = document.getElementById('wam-time');
  const startBtn = document.getElementById('wam-start');
  const restartBtn = document.getElementById('wam-restart');

  if (!grid) return;

  // Build grid
  for (let i=0; i<HOLES; i++) {
    const hole = document.createElement('div');
    hole.className = 'wam-hole';
    hole.dataset.index = i;
    hole.addEventListener('click', () => whack(i, hole));
    grid.appendChild(hole);
  }

  function updateLives() {
    livesEl.textContent = '❤️'.repeat(Math.max(0,lives)) + '🖤'.repeat(Math.max(0,3-lives));
  }

  function whack(idx, hole) {
    if (!gameActive || !activeHoles[idx]) return;
    const type = activeHoles[idx];
    hole.classList.add('hit');
    setTimeout(() => hole.classList.remove('hit'), 150);
    if (type === 'bug') {
      score += 10;
      scoreEl.textContent = score;
      hole.textContent = '💥';
      setTimeout(() => {
        if (activeHoles[idx]) {
          hole.textContent = '';
          hole.className = 'wam-hole';
          delete activeHoles[idx];
        }
      }, 180);
    } else {
      lives--;
      updateLives();
      hole.style.borderColor = 'rgba(239,68,68,0.9)';
      setTimeout(() => { hole.style.borderColor = ''; }, 400);
      if (lives <= 0) endGame();
    }
  }

  function spawnMole() {
    if (!gameActive) return;
    const holes = grid.querySelectorAll('.wam-hole');
    const empty = [...holes].filter(h => !activeHoles[h.dataset.index]);
    if (!empty.length) return;
    const hole = empty[Math.floor(Math.random()*empty.length)];
    const idx = hole.dataset.index;
    const isBug = Math.random() < 0.65;
    const emoji = isBug
      ? BUGS[Math.floor(Math.random()*BUGS.length)]
      : FEATURES[Math.floor(Math.random()*FEATURES.length)];
    activeHoles[idx] = isBug ? 'bug' : 'feature';
    hole.textContent = emoji;
    hole.classList.add(isBug ? 'bug' : 'feature');
    const stay = Math.max(400, 1000 - (30-timeLeft)*18);
    setTimeout(() => {
      if (activeHoles[idx]) {
        hole.textContent = '';
        hole.className = 'wam-hole';
        delete activeHoles[idx];
      }
    }, stay);
  }

  function startGame() {
    score=0; lives=3; timeLeft=30; gameActive=true; activeHoles={};
    scoreEl.textContent=0; updateLives(); timeEl.textContent='30s';
    overlay.style.display='none';
    result.style.display='none';
    grid.querySelectorAll('.wam-hole').forEach(h=>{h.textContent='';h.className='wam-hole';});
    moleTimer = setInterval(spawnMole, 650);
    countdown = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft+'s';
      if (timeLeft<=0) endGame();
    }, 1000);
  }

  function endGame() {
    gameActive=false;
    clearInterval(moleTimer); clearInterval(countdown);
    activeHoles={};
    grid.querySelectorAll('.wam-hole').forEach(h=>{h.textContent='';h.className='wam-hole';});
    document.getElementById('wam-result-icon').textContent = score>=100?'🏆':score>=50?'👍':'💀';
    document.getElementById('wam-result-title').textContent = score>=100?'Bug Slayer!':score>=50?'Decent Debugger':'Bugs Won';
    document.getElementById('wam-result-msg').textContent = `Score: ${score} — squashed ${Math.floor(score/10)} bugs!`;
    result.style.display='flex';
  }

  if (startBtn) startBtn.addEventListener('click', startGame);
  if (restartBtn) restartBtn.addEventListener('click', startGame);
})();

// ═══ MEMORY MATCH GAME ═══
(function() {
  const PAIRS = [
    {emoji:'🔁', label:'Loop'},
    {emoji:'📦', label:'Array'},
    {emoji:'🌲', label:'Tree'},
    {emoji:'🔗', label:'LinkedList'},
    {emoji:'📚', label:'Stack'},
    {emoji:'🚶', label:'Queue'},
    {emoji:'🗝️', label:'HashMap'},
    {emoji:'🔀', label:'Sort'},
  ];

  let cards=[], flipped=[], matched=0, moves=0, timeLeft=60, timer=null, canFlip=true;

  const grid = document.getElementById('mm-grid');
  const overlay = document.getElementById('mm-overlay');
  const result = document.getElementById('mm-result');
  const movesEl = document.getElementById('mm-moves');
  const pairsEl = document.getElementById('mm-pairs');
  const timeEl = document.getElementById('mm-time');
  const startBtn = document.getElementById('mm-start');
  const restartBtn = document.getElementById('mm-restart');

  if (!grid) return;

  function shuffle(arr) {
    return [...arr].sort(() => Math.random()-0.5);
  }

  function buildGrid() {
    grid.innerHTML = '';
    cards = [];
    flipped = [];
    matched = 0; moves = 0;
    movesEl.textContent = 0;
    pairsEl.textContent = '0/8';
    const deck = shuffle([...PAIRS, ...PAIRS]);
    deck.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'mm-card';
      card.dataset.label = item.label;
      card.innerHTML = `
        <div class="mm-front">?</div>
        <div class="mm-back">${item.emoji}<br>${item.label}</div>
      `;
      card.addEventListener('click', () => flipCard(card));
      grid.appendChild(card);
      cards.push(card);
    });
  }

  function flipCard(card) {
    if (!canFlip) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flipped.length >= 2) return;
    card.classList.add('flipped');
    flipped.push(card);
    if (flipped.length === 2) {
      moves++;
      movesEl.textContent = moves;
      canFlip = false;
      setTimeout(checkMatch, 700);
    }
  }

  function checkMatch() {
    const [a, b] = flipped;
    if (a.dataset.label === b.dataset.label) {
      a.classList.add('matched');
      b.classList.add('matched');
      matched++;
      pairsEl.textContent = `${matched}/8`;
      if (matched === 8) endGame(true);
    } else {
      a.classList.remove('flipped');
      b.classList.remove('flipped');
    }
    flipped = [];
    canFlip = true;
  }

  function startGame() {
    buildGrid();
    timeLeft = 60;
    timeEl.textContent = '60s';
    overlay.style.display = 'none';
    result.style.display = 'none';
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft+'s';
      if (timeLeft <= 0) endGame(false);
    }, 1000);
  }

  function endGame(won) {
    clearInterval(timer);
    document.getElementById('mm-result-icon').textContent = won ? '🏆' : '⏰';
    document.getElementById('mm-result-title').textContent = won ? 'Memory Master!' : 'Time\'s Up!';
    document.getElementById('mm-result-msg').textContent = won
      ? `Completed in ${moves} moves!`
      : `You matched ${matched}/8 pairs in ${moves} moves.`;
    result.style.display = 'flex';
  }

  if (startBtn) startBtn.addEventListener('click', startGame);
  if (restartBtn) restartBtn.addEventListener('click', startGame);
})();
