/* =====================================================
   USICC — global.js  v3
   No preloader. Fixed mobile hamburger + dropdowns.
   ===================================================== */

/* ── CUSTOM CURSOR (desktop only) ── */
if (window.matchMedia('(hover: hover)').matches) {
  const dot  = document.createElement('div'); dot.className = 'cur-dot';
  const ring = document.createElement('div'); ring.className = 'cur-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function tick() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a, button, .card, .chapter-card, .opp-card, .anav-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = ring.style.height = '52px'; ring.style.borderColor = 'rgba(201,150,60,0.8)'; });
    el.addEventListener('mouseleave', () => { ring.style.width = ring.style.height = '32px'; ring.style.borderColor = 'rgba(201,150,60,0.48)'; });
  });
}

/* ── PARTICLES (hero page only) ── */
(function () {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = Math.random() * 3 + 1;
    p.style.cssText = `left:${Math.random()*100}%;width:${sz}px;height:${sz}px;animation-duration:${Math.random()*14+8}s;animation-delay:${Math.random()*10}s;`;
    c.appendChild(p);
  }
})();

/* ── NAVBAR SCROLL SHADOW ── */
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
  if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

/* ── HAMBURGER ── */
(function () {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  function closeMenu() {
    btn.classList.remove('open');
    links.classList.remove('open');
    // collapse all mobile dropdowns too
    document.querySelectorAll('.has-dropdown.mob-open, .has-dropdown-sub.mob-open')
      .forEach(el => el.classList.remove('mob-open'));
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = links.classList.contains('open');
    if (isOpen) { closeMenu(); } else {
      btn.classList.add('open');
      links.classList.add('open');
    }
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (links.classList.contains('open') && !links.contains(e.target) && e.target !== btn) {
      closeMenu();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('open')) closeMenu();
  });

  // Close menu when a leaf link is tapped (not a dropdown toggle)
  links.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeMenu();
    });
  });
})();

/* ── MOBILE DROPDOWN ACCORDION ── */
(function () {
  // Main dropdown toggles (span.nav-item inside .has-dropdown)
  document.querySelectorAll('.has-dropdown > span.nav-item, .has-dropdown > a.nav-item').forEach(toggle => {
    toggle.addEventListener('click', e => {
      if (window.innerWidth > 900) return;
      e.preventDefault(); e.stopPropagation();
      const parent = toggle.closest('.has-dropdown');
      // close siblings
      parent.parentElement.querySelectorAll('.has-dropdown.mob-open').forEach(el => {
        if (el !== parent) el.classList.remove('mob-open');
      });
      parent.classList.toggle('mob-open');
    });
  });

  // Sub-dropdown toggles
  document.querySelectorAll('.has-dropdown-sub > a').forEach(toggle => {
    toggle.addEventListener('click', e => {
      if (window.innerWidth > 900) return;
      e.preventDefault(); e.stopPropagation();
      const parent = toggle.closest('.has-dropdown-sub');
      parent.classList.toggle('mob-open');
    });
  });
})();

/* ── ACTIVE NAV LINK ── */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navbar a.nav-item, #navbar .nav-item').forEach(el => {
    const href = el.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) el.classList.add('active');
  });
})();

/* ── SCROLL REVEAL ── */
function revealAll() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add('visible');
  });
}
window.addEventListener('scroll', revealAll, { passive: true });
document.addEventListener('DOMContentLoaded', () => setTimeout(revealAll, 100));

/* ── COUNTER ANIMATION ── */
function runCounters() {
  document.querySelectorAll('.stat-num[data-target]:not([data-done])').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.dataset.done = '1';
      const target = +el.dataset.target;
      let n = 0;
      const step = target / 60;
      const t = setInterval(() => {
        n = Math.min(n + step, target);
        el.textContent = Math.floor(n) + '+';
        if (n >= target) clearInterval(t);
      }, 18);
    }
  });
}
window.addEventListener('scroll', runCounters, { passive: true });
document.addEventListener('DOMContentLoaded', () => setTimeout(runCounters, 400));

/* ── BACK TO TOP ── */
document.addEventListener('DOMContentLoaded', () => {
  const bt = document.getElementById('back-top');
  if (bt) bt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

/* ── GALLERY LIGHTBOX ── */
document.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  let images = [], cur = 0;

  function open(imgs, idx) { images = imgs; cur = idx; update(); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function update() {
    lb.querySelector('.lb-img').src = images[cur].src;
    lb.querySelector('.lb-img').alt = images[cur].alt;
    lb.querySelector('.lb-caption').textContent = images[cur].alt;
  }

  document.querySelectorAll('.gallery-event').forEach(evt => {
    const wraps = [...evt.querySelectorAll('.gal-wrap')];
    const imgs  = wraps.map(w => ({ src: w.querySelector('img').src, alt: w.querySelector('img').alt }));
    wraps.forEach((w, i) => w.addEventListener('click', () => open(imgs, i)));
  });

  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lb.querySelector('.lb-prev').addEventListener('click', () => { cur = (cur - 1 + images.length) % images.length; update(); });
  lb.querySelector('.lb-next').addEventListener('click', () => { cur = (cur + 1) % images.length; update(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  { cur = (cur - 1 + images.length) % images.length; update(); }
    if (e.key === 'ArrowRight') { cur = (cur + 1) % images.length; update(); }
  });
});
