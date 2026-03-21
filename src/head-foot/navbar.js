// ─── Shared Navigation Bar ───

export function createNavbar(activePage = '') {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'main-navbar';
  nav.innerHTML = `
    <a href="/" class="nav-logo" id="nav-logo">
      <span class="logo-pulse">PULSE</span><span class="logo-sync">-SYNC</span>
    </a>
    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="nav-links">
      <li><a href="/" class="${activePage === 'home' ? 'active' : ''}" id="nav-home">Home</a></li>
      <li><a href="/weather.html" class="${activePage === 'weather' ? 'active' : ''}" id="nav-weather">Weather</a></li>
      <li><a href="/finance.html" class="${activePage === 'finance' ? 'active' : ''}" id="nav-finance">Finance</a></li>
      <li><a href="/science.html" class="${activePage === 'science' ? 'active' : ''}" id="nav-science">Science</a></li>
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
}
