// ═══════════════════════════════════════
// ANIMATION UTILITIES
// All canvas and DOM animation functions
// Used across all pages
// ═══════════════════════════════════════

// ─── Scroll reveal: animate elements into view on scroll ───
export function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// ─── Particles: render floating particle background ───
export function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 60);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener('resize', () => {
    resize();
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 60);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  });
}

// ─── Counter: animate number from 0 to target ───
export function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(eased * target);
    element.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else element.textContent = target.toLocaleString();
  }

  requestAnimationFrame(step);
}

// ─── Typewriter: type and erase text in a loop ───
export function typeWriter(element, text, speed = 50) {
  return new Promise((resolve) => {
    let i = 0;
    element.textContent = '';
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}

// ─── Tilt: 3D card tilt effect on mouse move ───
export function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// ─── Wormhole Black Hole Cursor Effect ───
export function initCursorTrail() {
  const canvas = document.getElementById('cursor-trail');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: width / 2, y: height / 2 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const PARTICLE_COUNT = 200;
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.angle = Math.random() * Math.PI * 2;
      this.spiralRadius = Math.random() * 60 + 20;
      this.spiralSpeed = (Math.random() * 0.04 + 0.02) * (Math.random() > 0.5 ? 1 : -1);
      this.pullStrength = 0;
    }
    update() {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 280) {
        this.pullStrength = Math.min(this.pullStrength + 0.04, 1);
        this.angle += this.spiralSpeed * (1 + this.pullStrength * 4);
        const targetRadius = this.spiralRadius * (1 - this.pullStrength * 0.95);
        this.x += (mouse.x + Math.cos(this.angle) * targetRadius - this.x) * (0.10 + this.pullStrength * 0.18);
        this.y += (mouse.y + Math.sin(this.angle) * targetRadius - this.y) * (0.10 + this.pullStrength * 0.18);
        this.size = Math.max(0.2, this.size * (1 - this.pullStrength * 0.03));
        this.opacity = Math.max(0, this.opacity - this.pullStrength * 0.025);
        if (this.opacity <= 0 || targetRadius < 2) this.reset();
      } else {
        this.pullStrength = Math.max(0, this.pullStrength - 0.02);
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
    }
    draw() {
      const r = Math.floor(this.pullStrength * 180);
      const g = Math.floor(240 * (1 - this.pullStrength * 0.6));
      const b = 255;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}
