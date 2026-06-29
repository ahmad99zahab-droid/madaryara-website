// ── WARENKORB & BESTELLUNG ──
// Lokaler Warenkorb (localStorage), seitenübergreifend. Es findet KEINE Online-Zahlung
// statt: die Bestellung wird als vorausgefüllte E-Mail an den Vertrieb übermittelt,
// Zahlung läuft separat per Vorkasse/Rechnung. Für echte Kartenzahlung müsste hier
// später ein Stripe-Checkout-Aufruf gegen einen eigenen Server-Endpunkt ergänzt werden.
(function () {
  const CART_KEY = 'madaryara-cart';
  const ORDER_EMAIL = 'sales@madaryara.com';

  const t = (key, fallback) => {
    const val = window.i18n ? window.i18n.t(key) : undefined;
    return val !== undefined ? val : fallback;
  };

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  let cart = loadCart();

  function fmt(n) {
    return Math.round(n).toLocaleString('tr-TR') + ' TL';
  }

  function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function cartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    saveCart(cart);
    renderAll();
  }

  function setQty(name, qty) {
    const item = cart.find(i => i.name === name);
    if (!item) return;
    if (qty <= 0) {
      cart = cart.filter(i => i.name !== name);
    } else {
      item.qty = qty;
    }
    saveCart(cart);
    renderAll();
  }

  function removeItem(name) {
    cart = cart.filter(i => i.name !== name);
    saveCart(cart);
    renderAll();
  }

  // ── DOM refs (present on every page via the shared cart markup) ──
  const fab = document.getElementById('cartFab');
  const fabBadge = document.getElementById('cartFabBadge');
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  const drawerClose = document.getElementById('cartDrawerClose');
  const drawerBody = document.getElementById('cartDrawerBody');
  const drawerTotal = document.getElementById('cartDrawerTotal');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutClose = document.getElementById('checkoutClose');
  const checkoutSummary = document.getElementById('checkoutSummary');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutSuccess = document.getElementById('checkoutSuccess');

  if (!fab) return; // cart markup not present on this page

  function renderBadge() {
    const count = cartCount();
    if (fabBadge) {
      fabBadge.textContent = String(count);
      fabBadge.hidden = count === 0;
    }
  }

  function renderDrawer() {
    if (!drawerBody) return;

    if (cart.length === 0) {
      drawerBody.innerHTML = `<p class="cart-empty">${t('cart.empty', 'Ihr Warenkorb ist leer.')}</p>`;
      if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
      drawerBody.innerHTML = cart.map(item => `
        <div class="cart-line" data-name="${escapeHtml(item.name)}">
          <div class="cart-line-info">
            <span class="cart-line-name">${escapeHtml(item.name)}</span>
            <span class="cart-line-price">${fmt(item.price)}</span>
          </div>
          <div class="cart-line-controls">
            <button class="cart-qty-btn cart-qty-minus" type="button" aria-label="-">−</button>
            <input class="cart-qty-input" type="number" min="1" value="${item.qty}" />
            <button class="cart-qty-btn cart-qty-plus" type="button" aria-label="+">+</button>
            <button class="cart-line-remove" type="button" aria-label="${t('cart.remove', 'Entfernen')}">&times;</button>
          </div>
        </div>
      `).join('');
      if (checkoutBtn) checkoutBtn.disabled = false;
    }

    if (drawerTotal) drawerTotal.textContent = fmt(cartTotal());
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderAll() {
    renderBadge();
    renderDrawer();
  }

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('visible'));
    document.body.classList.add('cart-drawer-open');
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
    document.body.classList.remove('cart-drawer-open');
    setTimeout(() => { if (!overlay.classList.contains('visible')) overlay.hidden = true; }, 300);
  }

  fab.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  if (drawerBody) {
    drawerBody.addEventListener('click', e => {
      const line = e.target.closest('.cart-line');
      if (!line) return;
      const name = line.dataset.name;
      const item = cart.find(i => i.name === name);
      if (!item) return;

      if (e.target.closest('.cart-qty-plus')) setQty(name, item.qty + 1);
      else if (e.target.closest('.cart-qty-minus')) setQty(name, item.qty - 1);
      else if (e.target.closest('.cart-line-remove')) removeItem(name);
    });

    drawerBody.addEventListener('change', e => {
      const input = e.target.closest('.cart-qty-input');
      if (!input) return;
      const line = input.closest('.cart-line');
      const qty = Math.max(1, parseInt(input.value, 10) || 1);
      setQty(line.dataset.name, qty);
    });
  }

  // ── Add-to-cart buttons across the page ──
  document.querySelectorAll('.btn-cart-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.product;
      const price = parseFloat(btn.dataset.price);
      if (!name || Number.isNaN(price)) return;
      addToCart(name, price);

      btn.classList.add('added');
      setTimeout(() => btn.classList.remove('added'), 900);
    });
  });

  // ── Checkout modal ──
  function openCheckout() {
    if (!checkoutOverlay) return;
    if (cart.length === 0) return;

    checkoutSummary.innerHTML = `
      <table class="checkout-table">
        <tbody>
          ${cart.map(item => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td class="checkout-table-qty">${item.qty} ×</td>
              <td class="checkout-table-price">${fmt(item.price * item.qty)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">${t('cart.total', 'Gesamt')}</td>
            <td class="checkout-table-price">${fmt(cartTotal())}</td>
          </tr>
        </tfoot>
      </table>
    `;

    closeDrawer();
    checkoutOverlay.hidden = false;
    requestAnimationFrame(() => checkoutOverlay.classList.add('visible'));
    document.body.classList.add('cart-drawer-open');
  }

  function closeCheckout() {
    if (!checkoutOverlay) return;
    checkoutOverlay.classList.remove('visible');
    document.body.classList.remove('cart-drawer-open');
    setTimeout(() => { checkoutOverlay.hidden = true; }, 300);
  }

  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener('click', e => {
      if (e.target === checkoutOverlay) closeCheckout();
    });
  }

  function buildOrderMailto(data) {
    const lines = cart.map(item => `  ${item.qty} × ${item.name} — ${fmt(item.price * item.qty)}`);
    const subject = `${t('checkout.mail.subject', 'Neue Bestellung')} – ${data.firstName} ${data.lastName}`;
    const body = [
      t('checkout.mail.greeting', 'Hallo Team Madar Yara Co.,'),
      '',
      t('checkout.mail.intro', 'ich möchte folgende Geräte bestellen:'),
      '',
      ...lines,
      '',
      `${t('cart.total', 'Gesamt')}: ${fmt(cartTotal())}`,
      '',
      `${t('form.mail.nameLabel', 'Name:')} ${data.firstName} ${data.lastName}`,
      `${t('form.mail.emailLabel', 'E-Mail:')} ${data.email}`,
      data.phone ? `${t('checkout.phone', 'Telefon')}: ${data.phone}` : '',
      data.company ? `${t('checkout.company', 'Firma')}: ${data.company}` : '',
      `${t('checkout.address', 'Lieferadresse')}: ${data.address}`,
      `${t('checkout.paymentMethod', 'Zahlungsart')}: ${data.paymentMethod}`,
      data.note ? `\n${t('form.message', 'Anmerkungen')}: ${data.note}` : '',
      '',
      t('form.mail.closing', 'Mit freundlichen Grüßen'),
      `${data.firstName} ${data.lastName}`
    ].filter(Boolean).join('\n');

    return `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  if (checkoutForm) {
    const submitBtn = checkoutForm.querySelector('.form-submit');
    const requiredFields = checkoutForm.querySelectorAll('input[required]:not([type="checkbox"]), textarea[required]');
    const consentField = checkoutForm.querySelector('[name="consent"]');

    checkoutForm.addEventListener('submit', e => {
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

      if (!valid || cart.length === 0) return;

      const data = {
        firstName: checkoutForm.firstName.value.trim(),
        lastName: checkoutForm.lastName.value.trim(),
        email: checkoutForm.email.value.trim(),
        phone: checkoutForm.phone.value.trim(),
        company: checkoutForm.company.value.trim(),
        address: checkoutForm.address.value.trim(),
        paymentMethod: checkoutForm.paymentMethod.options[checkoutForm.paymentMethod.selectedIndex].text,
        note: checkoutForm.note.value.trim()
      };

      const mailtoLink = buildOrderMailto(data);

      submitBtn.disabled = true;
      submitBtn.textContent = t('form.sending', 'Wird vorbereitet …');

      setTimeout(() => {
        window.location.href = mailtoLink;
        submitBtn.disabled = false;
        submitBtn.textContent = t('checkout.submit', 'Bestellung absenden →');
        if (checkoutSuccess) checkoutSuccess.classList.add('visible');

        cart = [];
        saveCart(cart);
        renderAll();
        checkoutForm.reset();
      }, 500);
    });

    if (consentField) {
      consentField.addEventListener('change', () => consentField.classList.remove('error'));
    }
    requiredFields.forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (checkoutOverlay && !checkoutOverlay.hidden) closeCheckout();
    else if (drawer && drawer.classList.contains('open')) closeDrawer();
  });

  document.addEventListener('i18n:change', renderAll);

  renderAll();
})();
