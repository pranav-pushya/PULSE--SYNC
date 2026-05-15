export function createFooter() {
  const footerHTML = `
<footer class="footer">
  <div class="footer-glow"></div>
  <div class="footer-content">

    <!-- Brand -->
    <div class="footer-brand">
      <div class="footer-logo">
        <span class="logo-pulse">PULSE</span><span class="logo-sync">-SYNC</span>
      </div>
      <p class="footer-tagline">The only tab you need between lectures.</p>
      <p class="footer-about">Built for CS students who want to stay informed, curious, and connected — without switching between 10 tabs.</p>
      <div class="footer-social">
        <a href="https://github.com/pranav-pushya/PULSE--SYNC" target="_blank" rel="noopener" class="footer-social-link" aria-label="GitHub Repository">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
        <button class="footer-social-link footer-feedback-btn" id="footer-feedback-btn">
          <i class="ph ph-chat-circle-text" style="font-size:18px;"></i>  
          Feedback
        </button>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="footer-col">
      <h4 class="footer-col-title">Explore</h4>
      <ul class="footer-links">
        <li><a href="/index.html">Home</a></li>
        <li><a href="/finance.html">Finance</a></li>
        <li><a href="/science.html">Science</a></li>
        <li><a href="/discover.html">Discover</a></li>
        <li><a href="/games.html">Games</a></li>
      </ul>
    </div>

    <!-- Team -->
    <div class="footer-col">
      <h4 class="footer-col-title">Team Pulse-Sync</h4>
      <div class="footer-team">

        <div class="footer-member">
          <div class="footer-member-info">
            <span class="footer-member-name">Pranav Pushya</span>
            <span class="footer-member-role">Leader & Developer</span>
          </div>
          <div class="footer-member-links">
            <a href="https://github.com/pranav-pushya" target="_blank" rel="noopener" aria-label="Pranav GitHub">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/pranav-pushya-31a23a386/" target="_blank" rel="noopener" aria-label="Pranav LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>

        <div class="footer-member">
          <div class="footer-member-info">
            <span class="footer-member-name">Shubhangi Savant</span>
            <span class="footer-member-role">Designer</span>
          </div>
          <div class="footer-member-links">
            <a href="https://github.com/shubhangi23457" target="_blank" rel="noopener" aria-label="Shubhangi GitHub">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/shubhangi-savant-07864a404" target="_blank" rel="noopener" aria-label="Shubhangi LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>

        
      </div>
    </div>

  </div>

  <div class="footer-bottom">
    <p>© 2026 PULSE-SYNC. Built with ⚡ for curious minds.</p>
    <p class="footer-bottom-sub">Chitkara University · CSE-AI · Group 2G3</p>
  </div>
</footer>
  `;
document.body.insertAdjacentHTML('beforeend', footerHTML);

  // ── Feedback button BOM logic ──
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('footer-feedback-btn');
  if (btn) {
    btn.onclick = function() {
      window.open('/feedback.html', '_blank');
    };
  }
});
}
