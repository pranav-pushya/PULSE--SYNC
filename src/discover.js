// ═══════════════════════════════════════
// DISCOVER PAGE — PULSE-SYNC
// Tech Timeline, GitHub Trending,
// Daily Knowledge, CS Career Paths
// ═══════════════════════════════════════

import { createNavbar } from './head-foot/navbar.js';
import { createFooter } from './head-foot/footer.js';
import { initScrollReveal } from './api/animations.js';

// ─── Tech Timeline Data ───
const TECH_TIMELINE = [
  { year: '1940s', title: 'First Computers', desc: 'ENIAC — the first general-purpose computer — was built in 1945. It weighed 30 tons and used 18,000 vacuum tubes. Programming meant physically rewiring the machine.', icon: '🖥️', color: '#00ff87' },
  { year: '1950s', title: 'AI is Born', desc: 'Alan Turing proposed the "Turing Test" in 1950. John McCarthy coined the term "Artificial Intelligence" in 1956 at the Dartmouth Conference — the field was officially born.', icon: '🧠', color: '#00d4aa' },
  { year: '1960s', title: 'Internet Origins', desc: 'ARPANET — the predecessor to the internet — sent its first message in 1969. It crashed after two letters: "LO" (meant to be "LOGIN"). The first network was born.', icon: '🌐', color: '#7c3aed' },
  { year: '1970s', title: 'Personal Computing', desc: 'Intel released the first microprocessor in 1971. Apple and Microsoft were both founded in the mid-70s. The PC revolution was about to begin.', icon: '💾', color: '#1d4ed8' },
  { year: '1980s', title: 'GUI & The Mac', desc: 'Apple launched the Macintosh in 1984 with a revolutionary graphical interface. Microsoft released Windows. The world shifted from command lines to clicking.', icon: '🖱️', color: '#ec4899' },
  { year: '1990s', title: 'World Wide Web', desc: 'Tim Berners-Lee invented the World Wide Web in 1991. The first website is still live at info.cern.ch. Google was founded in 1998 by two Stanford PhD students in a garage.', icon: '🕸️', color: '#fbbf24' },
  { year: '2000s', title: 'Social Media Era', desc: 'Facebook launched in 2004, YouTube in 2005, Twitter in 2006. The iPhone arrived in 2007, changing everything. Cloud computing emerged with AWS in 2006.', icon: '📱', color: '#f97316' },
  { year: '2010s', title: 'AI Renaissance', desc: 'Deep learning revolutionized AI. AlphaGo defeated the world Go champion in 2016. Transformer architecture was introduced in 2017 — the foundation of modern AI.', icon: '🤖', color: '#00ff87' },
  { year: '2020s', title: 'Generative AI', desc: 'ChatGPT launched in November 2022 and reached 100 million users in 2 months — the fastest growing app in history. AI is now in every developer\'s toolkit.', icon: '⚡', color: '#a78bfa' },
];

// ─── Daily Tech Topics (date-based rotation) ───
const DAILY_TECH = [
  { title: 'How the Internet Works', content: 'When you type a URL, your browser sends a DNS query to find the IP address. Then a TCP connection is established via a "three-way handshake". Data travels in packets through routers worldwide, reassembled at your device. HTTP/HTTPS governs how the data is formatted and transferred.', tags: ['Networking', 'DNS', 'TCP/IP'] },
  { title: 'How GPS Works', content: 'GPS uses 24+ satellites orbiting Earth at 20,000 km altitude. Your phone receives signals from at least 4 satellites simultaneously. By calculating the time difference of each signal (traveling at light speed), it triangulates your exact position to within meters.', tags: ['Satellites', 'Physics', 'Algorithms'] },
  { title: 'How Encryption Works', content: 'Modern encryption uses mathematical problems that are easy to compute one way but nearly impossible to reverse. RSA encryption is based on the fact that multiplying two large primes is easy, but factoring the result takes longer than the age of the universe.', tags: ['Cryptography', 'Security', 'Math'] },
  { title: 'How Search Engines Work', content: 'Search engines crawl billions of web pages using bots. Pages are indexed and ranked using hundreds of signals including PageRank — a graph algorithm that measures how many quality pages link to yours. Google processes 8.5 billion searches per day.', tags: ['Algorithms', 'Graph Theory', 'Web'] },
  { title: 'How Touchscreens Work', content: 'Capacitive touchscreens have a grid of electrodes. Your finger (a conductor) disrupts the electrostatic field at a specific point. The controller chip processes these disruptions 120+ times per second to track your touch with incredible precision.', tags: ['Hardware', 'Physics', 'Sensors'] },
  { title: 'How Databases Work', content: 'Databases use B-Tree data structures for indexing — allowing lookups in O(log n) time even with billions of records. Transactions use ACID properties (Atomicity, Consistency, Isolation, Durability) to ensure data integrity even when systems crash.', tags: ['Databases', 'Data Structures', 'SQL'] },
  { title: 'How Machine Learning Works', content: 'ML models learn by adjusting millions of numerical weights through backpropagation. Each training example adjusts weights slightly using gradient descent — moving toward lower error. After billions of examples, patterns emerge that generalize to new data.', tags: ['AI/ML', 'Math', 'Neural Networks'] },
  { title: 'How Blockchain Works', content: 'Blockchain is essentially a distributed linked list where each node contains a hash of the previous block. Changing any historical record would require recomputing all subsequent hashes AND outpacing the computing power of the entire network — computationally infeasible.', tags: ['Distributed Systems', 'Cryptography', 'DSA'] },
  { title: 'How Compilers Work', content: 'Your code goes through: Lexical analysis (tokenizing) → Parsing (building AST) → Semantic analysis → Optimization → Code generation. The compiler translates your high-level code through multiple intermediate representations before producing machine code.', tags: ['Compilers', 'Theory', 'Languages'] },
  { title: 'How Operating Systems Work', content: 'The OS kernel manages hardware resources using abstraction layers. Processes think they have the entire CPU, but the scheduler switches between them thousands of times per second. Virtual memory makes each process think it has its own dedicated RAM.', tags: ['OS', 'Systems', 'Low Level'] },
  { title: 'How Wi-Fi Works', content: 'Wi-Fi uses radio waves at 2.4 GHz or 5 GHz. Data is modulated onto these waves using OFDM — splitting data across many frequencies simultaneously. WPA3 encryption ensures only authorized devices can decode the signal.', tags: ['Networking', 'Hardware', 'Physics'] },
  { title: 'How Version Control Works', content: 'Git stores snapshots of your codebase as a directed acyclic graph (DAG). Each commit is a node with a unique SHA-1 hash. Branches are just pointers to commits. Merging combines two DAG paths. Your entire project history fits in the .git folder.', tags: ['Git', 'DSA', 'Dev Tools'] },
];

// ─── CS Concepts ───
const CS_CONCEPTS = [
  { concept: 'Big O Notation', icon: '📊', explanation: 'Big O describes how an algorithm\'s performance scales with input size. O(1) is constant, O(n) is linear, O(n²) is quadratic. A poorly chosen algorithm can be the difference between 1 second and 1 year of compute time.', example: 'Binary search is O(log n) — finding an item in 1 billion records takes just 30 comparisons.' },
  { concept: 'Recursion', icon: '🔄', explanation: 'A function that calls itself with a smaller version of the problem until reaching a base case. Elegant for tree traversal, fractals, and divide-and-conquer algorithms. The call stack stores each frame until the base case returns.', example: 'Fibonacci: fib(5) → fib(4) + fib(3) → ... → base cases return and bubble up.' },
  { concept: 'Hashing', icon: '#️⃣', explanation: 'A hash function maps data of arbitrary size to fixed-size values. Hash tables achieve O(1) average lookup by computing exactly which "bucket" a key belongs in. Collisions are handled by chaining or open addressing.', example: 'Python dictionaries, JavaScript objects, and database indexes all use hashing.' },
  { concept: 'Pointers & Memory', icon: '🔗', explanation: 'A pointer stores the memory address of another value. Understanding memory allocation (stack vs heap), null pointers, and memory leaks is fundamental to systems programming and understanding why higher-level languages exist.', example: 'C: int *ptr = &x; — ptr holds the address of x, *ptr gives the value at that address.' },
  { concept: 'Concurrency', icon: '⚡', explanation: 'Multiple tasks making progress simultaneously. Threads share memory (fast but risky — race conditions). Processes are isolated (safe but slow). async/await is cooperative concurrency — perfect for I/O-bound tasks like API calls.', example: 'Node.js handles thousands of simultaneous HTTP requests with a single thread using event loop.' },
  { concept: 'Binary & Bits', icon: '01', explanation: 'All data in computers is ultimately 0s and 1s. A byte is 8 bits — 256 possible values. Bitwise operations are incredibly fast (single CPU instruction). Understanding binary is essential for networking, graphics, and low-level programming.', example: '255 in binary is 11111111. The & operator does bitwise AND: 12 & 10 = 8 (1100 & 1010 = 1000).' },
  { concept: 'REST APIs', icon: '🌐', explanation: 'REST is an architectural style for web APIs. Resources are identified by URLs. Operations use HTTP methods (GET/POST/PUT/DELETE). Stateless — each request contains all needed information. JSON is the universal data format.', example: 'GET /users/123 returns user data. POST /users creates a new user. DELETE /users/123 removes it.' },
  { concept: 'Design Patterns', icon: '🏗️', explanation: 'Reusable solutions to common programming problems. Singleton ensures one instance. Observer enables event systems. Factory abstracts object creation. Learning patterns means never solving the same architectural problem twice.', example: 'React\'s useState hook uses the Observer pattern — components re-render when state changes.' },
];

// ─── Companies Data ───
const COMPANIES = [
  { name: 'Google', icon: '🔍', role: 'SWE, ML Engineer, DevRel', salary: '₹25-80 LPA', known: 'Search, Android, Cloud, AI', difficulty: 'Very High', color: '#4285f4' },
  { name: 'Microsoft', icon: '🪟', role: 'SWE, Cloud Engineer, PM', salary: '₹20-70 LPA', known: 'Azure, Office, GitHub, AI', difficulty: 'High', color: '#00a4ef' },
  { name: 'Amazon', icon: '📦', role: 'SDE, DevOps, Data Engineer', salary: '₹18-65 LPA', known: 'AWS, E-commerce, Logistics', difficulty: 'High', color: '#ff9900' },
  { name: 'Meta', icon: '👓', role: 'SWE, AR/VR Engineer, AI', salary: '₹22-75 LPA', known: 'Facebook, Instagram, WhatsApp', difficulty: 'Very High', color: '#0866ff' },
  { name: 'Apple', icon: '🍎', role: 'iOS Dev, SWE, ML', salary: '₹20-72 LPA', known: 'iOS, macOS, Silicon Chips', difficulty: 'Very High', color: '#555' },
  { name: 'Flipkart', icon: '🛒', role: 'SDE, Data Scientist, DevOps', salary: '₹12-45 LPA', known: 'E-commerce, Supply Chain', difficulty: 'Medium', color: '#2874f0' },
  { name: 'Infosys', icon: '💼', role: 'Associate, Consultant, Analyst', salary: '₹4-15 LPA', known: 'IT Services, Consulting', difficulty: 'Low-Medium', color: '#007cc3' },
  { name: 'Startups', icon: '🚀', role: 'Full Stack, Growth, Product', salary: '₹6-30 LPA + Equity', known: 'Fast growth, ownership', difficulty: 'Varies', color: '#00ff87' },
];

// ─── Interview Questions ───
const INTERVIEW_QS = [
  { q: 'What is the difference between a process and a thread?', category: 'OS', hint: 'Think about memory sharing and isolation.' },
  { q: 'Explain how HashMap works internally in Java/Python.', category: 'DSA', hint: 'Hash function, buckets, collision handling.' },
  { q: 'What is the CAP theorem?', category: 'Distributed Systems', hint: 'Consistency, Availability, Partition tolerance.' },
  { q: 'Reverse a linked list in-place.', category: 'DSA', hint: 'Three pointer approach: prev, curr, next.' },
  { q: 'What is SQL vs NoSQL? When to use each?', category: 'Databases', hint: 'Structure, scale, consistency requirements.' },
  { q: 'Explain REST vs GraphQL.', category: 'Web', hint: 'Over-fetching, under-fetching, flexibility.' },
  { q: 'What happens when you type a URL in the browser?', category: 'Networking', hint: 'DNS, TCP, HTTP, rendering pipeline.' },
  { q: 'What is a deadlock and how to prevent it?', category: 'OS', hint: 'Four conditions: mutual exclusion, hold and wait...' },
];

// ─── Trending Topics ───
const TRENDING_TOPICS = [
  { topic: 'Large Language Models', icon: '🤖', desc: 'GPT-4, Claude, Gemini — transformer-based models trained on massive text datasets. Prompt engineering is now a valuable skill.', hotness: 99 },
  { topic: 'Rust Programming', icon: '⚙️', desc: 'Memory-safe systems programming without garbage collection. Voted most loved language 8 years straight on Stack Overflow.', hotness: 87 },
  { topic: 'WebAssembly', icon: '🌐', desc: 'Run C/C++/Rust in the browser at near-native speed. Enables high-performance web apps — gaming, video editing, AI inference.', hotness: 78 },
  { topic: 'Edge Computing', icon: '📡', desc: 'Processing data closer to where it\'s generated — reducing latency. Cloudflare Workers, Vercel Edge Functions are leading this shift.', hotness: 82 },
  { topic: 'Kubernetes & DevOps', icon: '🐳', desc: 'Container orchestration has become a core skill. Every major company runs on K8s. DevOps engineers are among the highest paid in tech.', hotness: 91 },
  { topic: 'Quantum Computing', icon: '⚛️', desc: 'IBM and Google are racing toward quantum advantage. While not mainstream yet, quantum algorithms will revolutionize cryptography and optimization.', hotness: 73 },
];

// ─── Page Init ───
document.addEventListener('DOMContentLoaded', () => {
  createNavbar('discover');
  createFooter();
  initScrollReveal();
  initDiscoverTabs();
  renderTimeline();
  loadGitHubTrending();
  renderDailyKnowledge();
  renderCareers();
});

// ═══════════════════════════════════════
// TAB NAVIGATION
// ═══════════════════════════════════════
function initDiscoverTabs() {
  const tabs = document.querySelectorAll('#discover-tabs .finance-tab');
  const contents = document.querySelectorAll('.finance-tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      contents.forEach(c => c.classList.remove('active'));
      document.getElementById(`tab-${target}`).classList.add('active');
    });
  });
}

// ═══════════════════════════════════════
// TECH TIMELINE
// ═══════════════════════════════════════
function renderTimeline() {
  const container = document.getElementById('timeline-items');
  if (!container) return;
  container.innerHTML = TECH_TIMELINE.map((item, i) => `
    <div class="timeline-item ${i % 2 === 0 ? 'left' : 'right'}">
      <div class="timeline-dot" style="background:${item.color};box-shadow:0 0 12px ${item.color}"></div>
      <div class="timeline-card" style="border-color:${item.color}22">
        <div class="timeline-card-header">
          <span class="timeline-icon">${item.icon}</span>
          <span class="timeline-year" style="color:${item.color}">${item.year}</span>
        </div>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-desc">${item.desc}</p>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════
// GITHUB TRENDING
// ═══════════════════════════════════════
const GITHUB_FALLBACK = [
  { name: 'microsoft/vscode', desc: 'Visual Studio Code — the most popular code editor, built with TypeScript and Electron.', lang: 'TypeScript', stars: '158k', color: '#3178c6' },
  { name: 'torvalds/linux', desc: 'The Linux kernel — the foundation of most servers, Android phones, and supercomputers.', lang: 'C', stars: '172k', color: '#f1502f' },
  { name: 'openai/openai-python', desc: 'Official Python library for the OpenAI API — used by millions of AI applications.', lang: 'Python', stars: '22k', color: '#3572a5' },
  { name: 'vercel/next.js', desc: 'The React framework for production — used by companies like TikTok, Twitch, and GitHub.', lang: 'JavaScript', stars: '120k', color: '#f7df1e' },
  { name: 'facebook/react', desc: 'A JavaScript library for building user interfaces — powers Facebook, Instagram, and thousands of apps.', lang: 'JavaScript', stars: '224k', color: '#f7df1e' },
  { name: 'rust-lang/rust', desc: 'A language empowering everyone to build reliable and efficient software. Memory safe, blazingly fast.', lang: 'Rust', stars: '95k', color: '#dea584' },
];

async function loadGitHubTrending() {
  const grid = document.getElementById('github-grid');
  if (!grid) return;
  try {
    const res = await fetch('https://api.github-trending.com/repositories?since=daily', { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    renderGitHubRepos(data.slice(0, 6), grid);
  } catch {
    renderGitHubFallback(grid);
  }
}

function renderGitHubFallback(grid) {
  grid.innerHTML = GITHUB_FALLBACK.map(repo => `
    <div class="github-card">
      <div class="github-card-header">
        <span class="github-icon">🐙</span>
        <span class="github-repo-name">${repo.name}</span>
      </div>
      <p class="github-desc">${repo.desc}</p>
      <div class="github-meta">
        <span class="github-lang" style="background:${repo.color}22;color:${repo.color};border-color:${repo.color}44">${repo.lang}</span>
        <span class="github-stars">⭐ ${repo.stars}</span>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════
// DAILY KNOWLEDGE
// ═══════════════════════════════════════
function renderDailyKnowledge() {
  const dateEl = document.getElementById('today-date');
  const techEl = document.getElementById('daily-tech-content');
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const topic = DAILY_TECH[dayOfYear % DAILY_TECH.length];
  if (dateEl) dateEl.textContent = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  if (techEl) {
    techEl.innerHTML = `
      <h3 class="daily-tech-title">${topic.title}</h3>
      <p class="daily-tech-content">${topic.content}</p>
      <div class="daily-tech-tags">${topic.tags.map(t => `<span class="daily-tag">${t}</span>`).join('')}</div>
    `;
  }
  renderRandomConcept();
  const refreshBtn = document.getElementById('refresh-concept');
  if (refreshBtn) refreshBtn.addEventListener('click', renderRandomConcept);
}

function renderRandomConcept() {
  const el = document.getElementById('cs-concept-content');
  if (!el) return;
  const concept = CS_CONCEPTS[Math.floor(Math.random() * CS_CONCEPTS.length)];
  el.innerHTML = `
    <div class="concept-header">
      <span class="concept-icon">${concept.icon}</span>
      <h3 class="concept-name">${concept.concept}</h3>
    </div>
    <p class="concept-explanation">${concept.explanation}</p>
    <div class="concept-example">
      <span class="concept-example-label">Example</span>
      <p>${concept.example}</p>
    </div>
  `;
}

// ═══════════════════════════════════════
// CS CAREERS
// ═══════════════════════════════════════
function renderCareers() {
  renderCompanies();
  renderInterviewQs();
  renderTrends();
}

function renderCompanies() {
  const grid = document.getElementById('companies-grid');
  if (!grid) return;
  grid.innerHTML = COMPANIES.map(c => `
    <div class="company-card">
      <div class="company-header">
        <span class="company-icon">${c.icon}</span>
        <div>
          <h3 class="company-name">${c.name}</h3>
          <span class="company-difficulty difficulty-${c.difficulty.toLowerCase().replace(' ', '-')}">${c.difficulty}</span>
        </div>
      </div>
      <p class="company-role"><strong>Roles:</strong> ${c.role}</p>
      <p class="company-known"><strong>Known for:</strong> ${c.known}</p>
      <div class="company-salary" style="color:${c.color}">${c.salary}</div>
    </div>
  `).join('');
}

function renderInterviewQs() {
  const grid = document.getElementById('interview-grid');
  if (!grid) return;
  grid.innerHTML = INTERVIEW_QS.map((q, i) => `
    <div class="interview-card">
      <div class="interview-num">Q${i + 1}</div>
      <div class="interview-content">
        <span class="interview-category">${q.category}</span>
        <p class="interview-q">${q.q}</p>
        <details class="interview-hint">
          <summary>Hint 💡</summary>
          <p>${q.hint}</p>
        </details>
      </div>
    </div>
  `).join('');
}

function renderTrends() {
  const grid = document.getElementById('trends-grid');
  if (!grid) return;
  grid.innerHTML = TRENDING_TOPICS.map(t => `
    <div class="trend-card">
      <div class="trend-header">
        <span class="trend-icon">${t.icon}</span>
        <h3 class="trend-name">${t.topic}</h3>
        <div class="trend-heat">
          <div class="trend-bar" style="width:${t.hotness}%;background:${t.hotness > 90 ? '#00ff87' : t.hotness > 80 ? '#fbbf24' : '#7c3aed'}"></div>
        </div>
      </div>
      <p class="trend-desc">${t.desc}</p>
      <span class="trend-score" style="color:${t.hotness > 90 ? '#00ff87' : t.hotness > 80 ? '#fbbf24' : '#7c3aed'}">${t.hotness}% trending</span>
    </div>
  `).join('');
}
