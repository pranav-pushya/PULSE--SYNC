// ─── Shared Footer ───

export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.id = 'site-footer';
  footer.innerHTML = `
    <div class="footer-glow"></div>
    <div class="footer-content">
      <div class="footer-brand">
        <h3><span class="logo-pulse">PULSE</span><span class="logo-sync">-SYNC</span></h3>
        <p>Your real-time window to the world's data.</p>
      </div>
      <div class="footer-links">
        <h4>Quick Links</h4>
        <a href="/">Home</a>
        <a href="/weather.html">Weather</a>
        <a href="/finance.html">Finance</a>
        <a href="/science.html">Science</a>
      </div>
      <div class="footer-team">
        <h4>Team PULSE</h4>
        <p>Built with 💜 by the PULSE-SYNC team</p>
        <p>Team Credits</p>
        <p class="footer-tech">Leader : Pranav Pushya</p>
        <p class="footer-tech">Designer : Shubhangi Savant</p>
        <p class="footer-tech">Structure & Linker : Atharva Bhandari</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} PULSE-SYNC. All rights reserved.</p>
    </div>
  `;
  document.body.appendChild(footer);
}
