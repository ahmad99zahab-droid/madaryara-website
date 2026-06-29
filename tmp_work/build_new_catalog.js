const fs = require('fs');
const path = require('path');
const { categories } = require('./catalog_data.js');

function cardHtml(item, categorySlug) {
  return `        <div class="catalog-card" data-category="${categorySlug}" data-reveal>
          <div class="catalog-card-img">
            <img src="${item.img}" alt="${item.name}" loading="lazy" width="280" height="180" />
          </div>
          <div class="catalog-card-content">
            <span class="catalog-card-badge">${item.brand}</span>
            <h3>${item.name}</h3>
            <p>${item.spec}</p>
          </div>
          <div class="catalog-card-footer">
            <a href="${item.link || '#kontakt'}" class="btn-small">${item.link ? 'Details ansehen' : 'Anfrage senden'}</a>
          </div>
        </div>`;
}

function categoryRowHtml(c) {
  const cards = c.items.map(it => cardHtml(it, c.slug)).join('\n');
  return `    <!-- ${c.label.toUpperCase()} -->
    <div class="catalog-category" data-reveal>
      <div class="catalog-category-head">
        <h3>${c.label}</h3>
        <span class="catalog-category-count">${c.items.length} Modelle</span>
      </div>
      <div class="scroll-wrap">
        <div class="catalog-scroll-row">
${cards}
        </div>
        <button class="scroll-nav-btn" type="button" aria-label="Weitere Geräte anzeigen">
          <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>
        </button>
      </div>
    </div>`;
}

const totalItems = categories.reduce((n, c) => n + c.items.length, 0);

const section = `  <!-- KATALOG -->
  <section id="katalog">
    <div data-reveal>
      <p class="section-tag">Gesamter Katalog</p>
      <h2 class="section-title">Alle Labor-Geräte <span>auf einen Blick</span></h2>
      <p class="section-sub">
        Über ${totalItems} Mess- und Laborgeräte führender Marken – sortiert nach Gerätetyp, nicht nach Hersteller.
        Alle Produkte sind zertifiziert und auf Anfrage sofort lieferbar. Jede Kategorie lässt sich seitwärts durchscrollen.
      </p>
    </div>

${categories.map(categoryRowHtml).join('\n\n')}

  </section>
`;

fs.writeFileSync(path.join(__dirname, 'new_katalog_section.html'), section, 'utf8');
console.log('Generated. Total items:', totalItems, 'Categories:', categories.length);
