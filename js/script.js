// Mouse/touch-following glow across the whole page
// (plus a second local glow layered above the hero's own opaque background,
// since the fixed page-wide glow would otherwise be hidden behind it)
const cursorGlow = document.querySelector('.cursor-glow');
const heroEl = document.querySelector('.hero');
const heroGlow = document.querySelector('.hero-glow');

function moveGlow(clientX, clientY) {
  if (cursorGlow) {
    cursorGlow.style.left = `${clientX}px`;
    cursorGlow.style.top = `${clientY}px`;
    cursorGlow.classList.add('visible');
  }

  if (heroEl && heroGlow) {
    const rect = heroEl.getBoundingClientRect();
    const insideHero = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    if (insideHero) {
      heroGlow.style.left = `${clientX - rect.left}px`;
      heroGlow.style.top = `${clientY - rect.top}px`;
      heroGlow.classList.add('visible');
    } else {
      heroGlow.classList.remove('visible');
    }
  }
}

function hideGlow() {
  if (cursorGlow) cursorGlow.classList.remove('visible');
  if (heroGlow) heroGlow.classList.remove('visible');
}

if (cursorGlow || heroGlow) {
  document.addEventListener('mousemove', e => moveGlow(e.clientX, e.clientY));
  document.addEventListener('mouseleave', hideGlow);

  document.addEventListener('touchstart', moveGlowToTouch, { passive: true });
  document.addEventListener('touchmove', moveGlowToTouch, { passive: true });
  document.addEventListener('touchend', hideGlow);

  function moveGlowToTouch(e) {
    const touch = e.touches[0];
    if (!touch) return;
    moveGlow(touch.clientX, touch.clientY);
  }
}

// Animated count-up stats
function animateCount(el, target, suffix, duration = 1200) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsEl = document.querySelector('.stats');

if (statsEl) {
  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const match = el.textContent.trim().match(/^(\d+)(.*)$/);
        if (!match) return;
        const target = parseInt(match[1], 10);
        const suffix = match[2];
        el.textContent = `0${suffix}`;
        animateCount(el, target, suffix);
      });
      obs.disconnect();
    });
  }, { threshold: 0.4 });

  statObserver.observe(statsEl);
}

// Mouse tilt effect on cards and buttons
const tiltSelector = '.product-card, .why-card, .testimonial-card, .btn-primary, .btn-outline, .nav-btn, .form-submit';
const TILT_STRENGTH = 8;

document.querySelectorAll(tiltSelector).forEach(el => {
  const lift = getComputedStyle(el).getPropertyValue('--tilt-lift').trim() || '0px';
  let rafId = null;
  let pendingClientX = 0;
  let pendingClientY = 0;

  const applyTilt = () => {
    rafId = null;
    // Measured fresh every frame (not cached on enter) so it stays correct
    // even if the card's height changes mid-hover, e.g. via "Mehr Details".
    const rect = el.getBoundingClientRect();
    const x = (pendingClientX - rect.left) / rect.width - 0.5;
    const y = (pendingClientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) translateY(${lift}) rotateY(${x * TILT_STRENGTH}deg) rotateX(${-y * TILT_STRENGTH}deg)`;
  };

  el.addEventListener('mouseenter', () => {
    // Speed up just the transform transition for 1:1 tracking; other
    // hover transitions (box-shadow, border-color, …) keep their own timing.
    el.style.transitionDuration = '0.1s';
    el.style.transitionTimingFunction = 'linear';
  });

  el.addEventListener('mousemove', e => {
    pendingClientX = e.clientX;
    pendingClientY = e.clientY;
    if (rafId === null) rafId = requestAnimationFrame(applyTilt);
  });

  el.addEventListener('mouseleave', () => {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    el.style.transitionDuration = '';
    el.style.transitionTimingFunction = '';
    el.style.transform = '';
  });
});

// Water ripple effect on buttons
const rippleSelector = '.btn-primary, .btn-outline, .nav-btn, .form-submit, .btn-datasheet, .back-to-top, .whatsapp-btn';

document.querySelectorAll(rippleSelector).forEach(el => {
  el.addEventListener('click', e => {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Product card "more details" toggle
document.querySelectorAll('.product-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    card.classList.toggle('details-open', !expanded);
    const label = btn.querySelector('span');
    if (label && window.i18n) {
      label.textContent = window.i18n.t(expanded ? 'product.moreDetails' : 'product.lessDetails');
    }
  });
});

// Re-sync "more/less details" labels on language switch, since their text is
// set dynamically above and not via data-i18n (which would ignore the toggle state).
document.addEventListener('i18n:change', () => {
  if (!window.i18n) return;
  document.querySelectorAll('.product-toggle').forEach(btn => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const label = btn.querySelector('span');
    if (label) label.textContent = window.i18n.t(expanded ? 'product.lessDetails' : 'product.moreDetails');
  });
});

// Brand catalog table toggle
document.querySelectorAll('.catalog-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const wrap = btn.closest('.catalog-wrap');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    wrap.classList.toggle('open', !expanded);
  });
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    item.classList.toggle('open', !expanded);
  });
});

// Scroll reveal – replays in both scroll directions, staggered per group.
// Capped at 6 so large galleries (20+ items) don't leave late cards
// invisible for seconds after they scroll into view.
const revealGroups = new Map();
document.querySelectorAll('[data-reveal]').forEach(el => {
  const parent = el.parentElement;
  const index = revealGroups.get(parent) || 0;
  el.style.setProperty('--reveal-index', Math.min(index, 6));
  revealGroups.set(parent, index + 1);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Back to top button
const backToTop = document.querySelector('.back-to-top');

function toggleBackToTop() {
  if (!backToTop) return;
  backToTop.classList.toggle('visible', window.scrollY > 500);
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Navbar scrolled state
const nav = document.querySelector('nav');
const scrollProgressBar = document.querySelector('.scroll-progress-bar');
const onScroll = () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  toggleBackToTop();
  if (scrollProgressBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgressBar.style.width = `${pct}%`;
  }
};
window.addEventListener('scroll', onScroll);
onScroll();

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('nav ul');

if (navToggle && navList) {
  const closeNav = () => {
    navToggle.classList.remove('open');
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    navList.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', (e) => {
    if (!navList.classList.contains('open')) return;
    if (!e.target.closest('nav')) closeNav();
  });
}

// Active nav link based on visible section
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('nav ul a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => sectionObserver.observe(section));

// Contact form: submits via Formspree (server-side delivery to sales@madaryara.com).
// ACTIVATION: Sign up free at https://formspree.io, create a form for sales@madaryara.com,
// and replace FORMSPREE_ID below with your form ID (e.g. "xpwzgkda").
const FORMSPREE_ID = 'YOUR_FORM_ID';
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;
const FALLBACK_EMAIL = 'sales@madaryara.com';
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const submitBtn = contactForm.querySelector('.form-submit');
  const successMsg = contactForm.querySelector('.form-success');
  const requiredFields = contactForm.querySelectorAll('input[required]:not([type="checkbox"]), textarea[required]');
  const consentField = contactForm.querySelector('[name="consent"]');
  const t = key => (window.i18n ? window.i18n.t(key) : key);

  submitBtn.addEventListener('click', async e => {
    e.preventDefault();
    let valid = true;

    requiredFields.forEach(field => {
      const empty = !field.value.trim();
      field.classList.toggle('error', empty);
      if (empty) valid = false;
    });

    if (consentField) {
      consentField.classList.toggle('error', !consentField.checked);
      if (!consentField.checked) valid = false;
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = t('form.sending') || 'Sending…';

    const data = new FormData(contactForm);
    data.append('_subject', 'New message from madaryara.com');

    // If Formspree not yet activated, fall back to mailto
    if (FORMSPREE_ID === 'YOUR_FORM_ID') {
      const firstName = contactForm.querySelector('[name="firstName"]').value.trim();
      const lastName = contactForm.querySelector('[name="lastName"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const interest = (contactForm.querySelector('[name="interest"]') || {}).value || '';
      const message = contactForm.querySelector('[name="message"]').value.trim();
      const subject = encodeURIComponent(`Nachricht über die Website${interest ? ' – ' + interest : ''}`);
      const body = encodeURIComponent(`Name: ${firstName} ${lastName}\nE-Mail: ${email}\nProdukt/Interesse: ${interest}\n\n${message}`);
      setTimeout(() => { window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`; }, 200);
      submitBtn.disabled = false;
      submitBtn.textContent = t('form.submit') || 'Absenden';
      if (successMsg) successMsg.classList.add('visible');
      return;
    }

    try {
      const res = await fetch(FORMSPREE_URL, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        if (successMsg) successMsg.classList.add('visible');
        contactForm.reset();
      } else {
        const err = await res.json().catch(() => ({}));
        alert((err.errors || [{ message: 'Error sending message.' }]).map(e => e.message).join(', '));
      }
    } catch {
      alert('Network error – please try again or email us directly at ' + FALLBACK_EMAIL);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t('form.submit') || 'Absenden';
    }
  });

  if (consentField) {
    consentField.addEventListener('change', () => consentField.classList.remove('error'));
  }

  requiredFields.forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

// Site-wide privacy consent banner – shown again after the consent expires
const COOKIE_CONSENT_KEY = 'madaryara-consent-accepted';
const COOKIE_CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000; // 180 days
const cookieConsent = document.getElementById('cookieConsent');
const cookieAccept = document.getElementById('cookieAccept');

if (cookieConsent && cookieAccept) {
  const acceptedAt = parseInt(localStorage.getItem(COOKIE_CONSENT_KEY), 10);
  const isStillValid = acceptedAt && (Date.now() - acceptedAt) < COOKIE_CONSENT_MAX_AGE;

  if (!isStillValid) {
    cookieConsent.hidden = false;
    requestAnimationFrame(() => {
      cookieConsent.classList.add('visible');
      document.body.classList.add('cookie-consent-active');
    });
  }

  cookieAccept.addEventListener('click', () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, String(Date.now()));
    cookieConsent.classList.remove('visible');
    document.body.classList.remove('cookie-consent-active');
    setTimeout(() => { cookieConsent.hidden = true; }, 400);
  });
}



// ── SCROLL NAV BUTTONS (horizontal-scroll rows: catalog categories + brand spotlights) ──
document.querySelectorAll('.scroll-wrap').forEach(wrap => {
  const row = wrap.querySelector('.catalog-scroll-row, .products-scroll');
  const nextBtn = wrap.querySelector('.scroll-nav-btn:not(.scroll-nav-btn--left)');
  const prevBtn = wrap.querySelector('.scroll-nav-btn--left');
  if (!row || !nextBtn) return;

  function updateVisibility() {
    const atStart = row.scrollLeft <= 4;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    nextBtn.classList.toggle('is-hidden', atEnd);
    if (prevBtn) prevBtn.classList.toggle('is-hidden', atStart);
  }

  nextBtn.addEventListener('click', () => {
    const step = row.clientWidth * 0.8;
    row.scrollBy({ left: step, behavior: 'smooth' });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const step = row.clientWidth * 0.8;
      row.scrollBy({ left: -step, behavior: 'smooth' });
    });
  }

  row.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
});

// ── IMAGE LIGHTBOX (click any product/device photo to view it enlarged) ──
(function () {
  const selector = '.catalog-card-img img, .mini-item-card img, .product-img-wrap img';
  const targets = document.querySelectorAll(selector);
  if (targets.length === 0) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Schließen">&times;</button><img class="lightbox-img" alt="" />';
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector('.lightbox-img');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('visible');
  }

  function closeLightbox() {
    lightbox.classList.remove('visible');
  }

  targets.forEach(img => {
    img.classList.add('is-zoomable');
    img.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.closest('.lightbox-close')) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

// ── KATALOG SEARCH (live filter across all categories) ──
(function () {
  const input = document.getElementById('catalogSearch');
  const clearBtn = document.getElementById('catalogSearchClear');
  const status = document.getElementById('catalogSearchStatus');
  const resultsGrid = document.getElementById('searchResultsGrid');
  const flagshipGrid = document.getElementById('flagshipProductsGrid');
  if (!input) return;

  const categories = document.querySelectorAll('#katalog .catalog-category');
  const allCards = Array.from(document.querySelectorAll('#katalog .catalog-card'));

  function jumpToCatalogCard(card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.remove('search-jump-highlight');
    requestAnimationFrame(() => card.classList.add('search-jump-highlight'));
    setTimeout(() => card.classList.remove('search-jump-highlight'), 1500);
  }

  function renderResults(query) {
    if (!resultsGrid || !flagshipGrid) return;

    if (!query) {
      resultsGrid.hidden = true;
      resultsGrid.innerHTML = '';
      flagshipGrid.hidden = false;
      return;
    }

    flagshipGrid.hidden = true;
    const matches = allCards.filter(card => card.textContent.toLowerCase().includes(query));

    if (matches.length === 0) {
      const t = (window.i18n && window.i18n.t) || (() => undefined);
      resultsGrid.innerHTML = `<div class="search-results-empty">${t('katalog.noSuggestions') || 'Keine Geräte gefunden.'}</div>`;
      resultsGrid.hidden = false;
      return;
    }

    resultsGrid.innerHTML = '';
    matches.forEach(originalCard => {
      const clone = originalCard.cloneNode(true);
      clone.classList.remove('search-hidden');
      clone.classList.add('is-clickable');
      clone.addEventListener('click', e => {
        if (e.target.closest('.catalog-card-footer')) return;
        jumpToCatalogCard(originalCard);
      });
      resultsGrid.appendChild(clone);
    });
    resultsGrid.hidden = false;
  }

  function runFilter() {
    const query = input.value.trim().toLowerCase();
    clearBtn.hidden = query.length === 0;
    renderResults(query);

    if (!query) {
      categories.forEach(cat => {
        cat.classList.remove('search-hidden');
        cat.querySelectorAll('.catalog-card').forEach(card => card.classList.remove('search-hidden'));
      });
      status.hidden = true;
      return;
    }

    let totalMatches = 0;
    categories.forEach(cat => {
      let matchesInCategory = 0;
      cat.querySelectorAll('.catalog-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(query);
        card.classList.toggle('search-hidden', !matches);
        if (matches) matchesInCategory++;
      });
      cat.classList.toggle('search-hidden', matchesInCategory === 0);
      totalMatches += matchesInCategory;
    });

    status.hidden = false;
    const t = (window.i18n && window.i18n.t) || (() => undefined);
    const q = input.value.trim();
    if (totalMatches === 0) {
      status.textContent = (t('katalog.statusNone') || 'Keine Geräte gefunden für „{q}“.').replace('{q}', q);
    } else {
      const tpl = totalMatches === 1
        ? (t('katalog.statusOne') || '{n} Gerät gefunden für „{q}“.')
        : (t('katalog.statusMany') || '{n} Geräte gefunden für „{q}“.');
      status.textContent = tpl.replace('{n}', totalMatches).replace('{q}', q);
    }
  }

  input.addEventListener('input', runFilter);
  document.addEventListener('i18n:change', () => {
    if (!status.hidden) runFilter();
  });
  clearBtn.addEventListener('click', () => {
    input.value = '';
    runFilter();
    input.focus();
  });
})();

// ── VISUAL ENHANCEMENTS ──────────────────────────────────────────────────────

// ── 1. PARTICLE CANVAS (hero background network) ──
(function () {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function init() {
    resize();
    const count = Math.floor((W * H) / 14000);
    pts = Array.from({ length: count }, () => ({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
      r: rand(1.5, 3)
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#6366f1';

    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.7;
      ctx.fill();
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = accentColor;
          ctx.globalAlpha = (1 - d / 110) * 0.35;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  init();
  draw();
})();

// ── 2. TYPEWRITER EFFECT (hero) ──
(function () {
  const el = document.getElementById('hero-typewriter');
  if (!el) return;

  const wordsByLang = {
    de: ['Mikroskope', 'pH-Messgeräte', 'Trockenschränke', 'Refraktometer', 'Präzisionswaagen', 'Sauerstoffmessgeräte'],
    en: ['Microscopes', 'pH Meters', 'Drying Ovens', 'Refractometers', 'Lab Balances', 'DO Meters'],
    ar: ['ميكروسكوبات', 'أجهزة pH', 'أفران تجفيف', 'مقاييس انكسار', 'موازين دقيقة', 'أجهزة أكسجين']
  };

  function getWords() {
    const lang = window.currentLang || 'en';
    return wordsByLang[lang] || wordsByLang['en'];
  }

  let wi = 0, ci = 0, deleting = false, timer;

  function type() {
    const words = getWords();
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ++ci);

    if (!deleting && ci === word.length) {
      timer = setTimeout(() => { deleting = true; type(); }, 1800);
    } else if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
      timer = setTimeout(type, 300);
    } else {
      timer = setTimeout(type, deleting ? 45 : 90);
    }
  }

  document.addEventListener('i18n:change', () => {
    clearTimeout(timer);
    ci = 0; deleting = false;
    wi = (wi + 1) % getWords().length;
    type();
  });

  setTimeout(type, 800);
})();

// ── 3. ENHANCED STATS COUNTER (spring easing + number formatting) ──
(function () {
  const statsEl = document.querySelector('.stats');
  if (!statsEl || statsEl.dataset.enhancedRan) return;
  statsEl.dataset.enhancedRan = '1';

  function easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 4;
    return t === 0 ? 0 : t === 1 ? 1
      : Math.pow(2, -9 * t) * Math.sin((t * 9 - 0.75) * c4) + 1;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const match = el.textContent.trim().match(/^(\d+)(.*)/);
        if (!match) return;
        const target = parseInt(match[1]);
        const suffix = match[2];
        const duration = 1800;
        const start = performance.now();
        function step(now) {
          const t = Math.min((now - start) / duration, 1);
          const val = Math.round(easeOutElastic(t) * target);
          el.textContent = (val > 999 ? val.toLocaleString() : val) + suffix;
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
      observer.disconnect();
    });
  }, { threshold: 0.4 });

  observer.observe(statsEl);
})();

// ── DETAILS MODAL ────────────────────────────────────────────────────────────
(function () {
  const overlay  = document.getElementById('detailsOverlay');
  const closeBtn = document.getElementById('detailsClose');
  const img      = document.getElementById('detailsImg');
  const nameEl   = document.getElementById('detailsName');
  const brandEl  = document.getElementById('detailsBrand');
  const descEl   = document.getElementById('detailsDesc');
  if (!overlay) return;

  function open(card) {
    const isCatalog = card.classList.contains('catalog-card');

    // Support both mini-item-card and catalog-card structures
    const cardImg  = isCatalog ? card.querySelector('.catalog-card-img img') : card.querySelector('img');
    const nameText = isCatalog ? (card.querySelector('h3') || {}).textContent : (card.querySelector('span') || {}).textContent;
    const descP    = isCatalog ? card.querySelector('.catalog-card-content p') : card.querySelector('p');
    const badge    = isCatalog ? card.querySelector('.catalog-card-badge') : null;

    img.src  = cardImg ? cardImg.src : '';
    img.alt  = cardImg ? cardImg.alt : '';
    nameEl.textContent = nameText || '';

    // Brand: from badge span on catalog cards, or first word of data-product on mini cards
    if (badge) {
      brandEl.textContent = badge.textContent.trim();
    } else {
      const product = card.dataset.product || '';
      brandEl.textContent = product.split(' ')[0];
    }

    descEl.textContent = descP ? descP.textContent : '';

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('visible'));
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.hidden = true; }, 320);
  }

  // Delegate click on Details buttons
  document.addEventListener('click', e => {
    if (e.target.closest('.btn-details-card')) {
      open(e.target.closest('.mini-item-card') || e.target.closest('.catalog-card'));
    }
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) close(); });
})();

// ── PRODUCT PRE-SELECTION FOR CONTACT FORM ───────────────────────────────────
(function () {
  const STORAGE_KEY = 'madaryara-inquiry-product';

  // ── A) Intercept "Contact us" clicks on device cards ──
  document.addEventListener('click', function (e) {
    const contactBtn = e.target.closest('.btn-contact-card, .details-cta');
    if (!contactBtn) return;

    // Find the product name from the nearest card context
    let productName = '';

    // From mini-item-card (brand pages)
    const miniCard = contactBtn.closest('.mini-item-card');
    if (miniCard) {
      const nameSpan = miniCard.querySelector('span');
      productName = nameSpan ? nameSpan.textContent.trim() : (miniCard.dataset.product || '');
    }

    // From catalog-card (homepage)
    const catalogCard = contactBtn.closest('.catalog-card');
    if (catalogCard) {
      const h3 = catalogCard.querySelector('h3');
      productName = h3 ? h3.textContent.trim() : '';
    }

    // From details modal (details-cta button)
    if (!productName) {
      const nameEl = document.getElementById('detailsName');
      if (nameEl && nameEl.textContent.trim()) {
        productName = nameEl.textContent.trim();
      }
    }

    if (productName) {
      sessionStorage.setItem(STORAGE_KEY, productName);
    }
    // Let the link navigate normally (#kontakt or index.html#kontakt)
  });

  // ── B) On page load, check for stored product and fill the single product field ──
  const group    = document.getElementById('formProductGroup');
  const input    = document.getElementById('formProductInput');
  const clearBtn = document.getElementById('formProductClear');
  const hint     = document.getElementById('formProductHint');

  function setAutoFilled(name) {
    if (!input || !group) return;
    input.value = name;
    group.classList.add('is-auto-filled');
    if (clearBtn) clearBtn.hidden = false;
    if (hint) hint.hidden = false;
  }

  function clearAutoFilled() {
    if (!input || !group) return;
    input.value = '';
    group.classList.remove('is-auto-filled');
    if (clearBtn) clearBtn.hidden = true;
    if (hint) hint.hidden = true;
    sessionStorage.removeItem(STORAGE_KEY);
  }

  function applyStoredProduct() {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored || !input) return;
    setAutoFilled(stored);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  if (input) {
    applyStoredProduct();
    document.addEventListener('i18n:change', applyStoredProduct);

    // Remove green state when user manually edits
    input.addEventListener('input', function () {
      if (group.classList.contains('is-auto-filled')) {
        group.classList.remove('is-auto-filled');
        if (clearBtn) clearBtn.hidden = true;
        if (hint) hint.hidden = true;
      }
    });
  }

  // When navigating via hash (#kontakt) from a device CTA on the same page
  window.addEventListener('hashchange', function () {
    if (window.location.hash === '#kontakt') setTimeout(applyStoredProduct, 150);
  });

  // × button clears the field
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAutoFilled);
  }
})();
