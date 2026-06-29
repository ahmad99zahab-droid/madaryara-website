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

// Contact form: builds a pre-filled email so the customer only enters their data
const CONTACT_EMAIL = 'sales@madaryara.com';
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const submitBtn = contactForm.querySelector('.form-submit');
  const successMsg = contactForm.querySelector('.form-success');
  const requiredFields = contactForm.querySelectorAll('input:not([type="checkbox"]), textarea');
  const consentField = contactForm.querySelector('[name="consent"]');
  const t = key => (window.i18n ? window.i18n.t(key) : key);

  function buildMailtoLink() {
    const firstName = contactForm.querySelector('[name="firstName"]').value.trim();
    const lastName = contactForm.querySelector('[name="lastName"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    const interest = contactForm.querySelector('[name="interest"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();

    const subject = interest ? `${t('form.mail.subject')} – ${interest}` : t('form.mail.subject');
    const body = [
      t('form.mail.greeting'),
      '',
      t('form.mail.intro'),
      '',
      `${t('form.mail.nameLabel')} ${firstName} ${lastName}`,
      `${t('form.mail.emailLabel')} ${email}`,
      `${t('form.mail.interestLabel')} ${interest}`,
      '',
      t('form.mail.messageLabel'),
      message,
      '',
      t('form.mail.closing'),
      `${firstName} ${lastName}`
    ].join('\n');

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  submitBtn.addEventListener('click', e => {
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

    const mailtoLink = buildMailtoLink();

    submitBtn.disabled = true;
    submitBtn.textContent = t('form.sending');

    setTimeout(() => {
      window.location.href = mailtoLink;
      submitBtn.disabled = false;
      submitBtn.textContent = t('form.submit');
      if (successMsg) successMsg.classList.add('visible');
      requiredFields.forEach(field => {
        field.value = '';
        field.classList.remove('error');
      });
      if (consentField) {
        consentField.checked = false;
        consentField.classList.remove('error');
      }
    }, 500);
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
