// EDIT THIS: set this to the date you two got together, e.g. new Date('2024-02-14')
const RELATIONSHIP_START = new Date('2024-01-01');

function updateDaysTogether() {
  const el = document.getElementById('daysTogether');
  if (!el) return;
  const diffMs = Date.now() - RELATIONSHIP_START.getTime();
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  animateCount(el, days);
}

function animateCount(el, target) {
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

// Reveal polaroids on scroll
function setupGalleryReveal() {
  const items = document.querySelectorAll('.polaroid');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  items.forEach((item) => observer.observe(item));
}

// Lightweight floating petals canvas, paused if reduced motion is requested
function setupPetals() {
  const canvas = document.getElementById('petals');
  if (!canvas) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const ctx = canvas.getContext('2d');
  let petals = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createPetal() {
    return {
      x: Math.random() * width,
      y: -20 - Math.random() * height * 0.3,
      size: 6 + Math.random() * 8,
      speedY: 0.4 + Math.random() * 0.6,
      speedX: (Math.random() - 0.5) * 0.6,
      sway: Math.random() * Math.PI * 2,
      opacity: 0.35 + Math.random() * 0.4,
    };
  }

  function init() {
    resize();
    const count = window.innerWidth < 600 ? 16 : 28;
    petals = Array.from({ length: count }, createPetal);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.y += p.speedY;
      p.sway += 0.02;
      p.x += p.speedX + Math.sin(p.sway) * 0.4;

      if (p.y > height + 20) {
        Object.assign(p, createPetal(), { y: -20 });
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(217, 140, 168, ${p.opacity})`;
      ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, Math.sin(p.sway), 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  updateDaysTogether();
  setupGalleryReveal();
  setupPetals();
});
