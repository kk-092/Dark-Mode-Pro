/* ═══════════════════════════════════════════════
   Dark Mode Pro — Landing Page Script
═══════════════════════════════════════════════ */

'use strict';

// ─── Sticky Navbar ───────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ─── Hamburger Menu ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ─── Scroll Reveal Animations ────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ─── Animated Counters ───────────────────────────
function formatNumber(n, target) {
  if (target >= 100000) return (n / 1000).toFixed(0) + 'K+';
  if (target >= 10000)  return (n / 1000).toFixed(0) + 'K+';
  if (target === 99)    return n + '%';
  return n + '+';
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = formatNumber(current, target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

// ─── Screenshot Slider ───────────────────────────
const sliderTrack = document.getElementById('sliderTrack');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

const slides = sliderTrack.querySelectorAll('.slide');
let currentSlide = 0;
let autoplayInterval;

// Create dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot-btn' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function updateDots() {
  dotsContainer.querySelectorAll('.dot-btn').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateDots();
}

prevBtn.addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  resetAutoplay();
});

nextBtn.addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  resetAutoplay();
});

// Touch / swipe support
let touchStartX = 0;
let touchEndX   = 0;

sliderTrack.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

sliderTrack.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    resetAutoplay();
  }
});

// Autoplay
function startAutoplay() {
  autoplayInterval = setInterval(() => goToSlide(currentSlide + 1), 4000);
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

startAutoplay();

// Pause on hover
const sliderSection = document.querySelector('.screenshots-slider');
sliderSection.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
sliderSection.addEventListener('mouseleave', startAutoplay);

// ─── Smooth Active Nav Highlighting ──────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--primary)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

// ─── Lazy-load images with fade ──────────────────
const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
lazyImgs.forEach(img => {
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.5s ease';
  img.addEventListener('load', () => {
    img.style.opacity = '1';
  });
  if (img.complete) img.style.opacity = '1';
});

// ─── Keyboard slider navigation ──────────────────
document.addEventListener('keydown', e => {
  const sliderVisible = sliderSection.getBoundingClientRect().top < window.innerHeight
    && sliderSection.getBoundingClientRect().bottom > 0;
  if (!sliderVisible) return;
  if (e.key === 'ArrowLeft')  { goToSlide(currentSlide - 1); resetAutoplay(); }
  if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); resetAutoplay(); }
});

// ─── CTA Button ripple effect ─────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top: ${e.clientY - rect.top - size/2}px;
      transform: scale(0);
      animation: ripple 0.6s ease-out forwards;
      pointer-events: none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Add ripple keyframe dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

console.log('🌙 Dark Mode Pro landing page loaded.');
