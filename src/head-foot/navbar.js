// ─── Shared Navigation Bar ───

export function createNavbar(activePage = '') {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'main-navbar';
  nav.innerHTML = `
    <a href="/" class="nav-logo" id="nav-logo">
      <span class="logo-pulse" style="color: var(--aurora-green);">PULSE</span><span class="logo-sync" style="color: var(--text-secondary);">-SYNC</span>
    </a>
    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="nav-links">
      <li><a href="/" class="${activePage === 'home' ? 'active' : ''}" id="nav-home">Home</a></li>
      <li><a href="/weather.html" class="${activePage === 'weather' ? 'active' : ''}" id="nav-weather">Weather</a></li>
      <li><a href="/finance.html" class="${activePage === 'finance' ? 'active' : ''}" id="nav-finance">Finance</a></li>
      <li><a href="/science.html" class="${activePage === 'science' ? 'active' : ''}" id="nav-science">Science</a></li>
      <li><button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">☀️</button></li>
    </ul>
  `;

  document.body.prepend(nav);

  // Mobile menu toggle
  const toggle = nav.querySelector('#nav-toggle');
  const links = nav.querySelector('#nav-links');
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  // Navbar scroll effect
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
  });

  // Theme toggle logic
  const themeToggle = nav.querySelector('#theme-toggle');
  const storedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', storedTheme);
  themeToggle.textContent = storedTheme === 'light' ? '🌙' : '☀️';

  themeToggle.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    themeToggle.textContent = targetTheme === 'light' ? '🌙' : '☀️';
  });
}
