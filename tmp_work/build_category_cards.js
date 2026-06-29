const fs = require('fs');

const boroxMeta = JSON.parse(fs.readFileSync('tmp_work/borox_meta.json', 'utf8'));
const kimyaMeta = JSON.parse(fs.readFileSync('tmp_work/kimyalab_meta.json', 'utf8'));

function miniCard(item, dir) {
  return `            <div class="mini-item-card" data-reveal>
              <img src="images/catalog/${dir}/${item.file}" alt="${item.label}" loading="lazy" width="160" height="160" />
              <span>${item.label}</span>
            </div>`;
}

function categoryCard({ slug, cover, icon, title, subtitle, desc, items, dir, datasheetNote }) {
  const cards = items.map(it => miniCard(it, dir)).join('\n');
  return `      <div class="product-card category-card" data-reveal>
        <div class="product-img-wrap">
          <img src="images/${cover}" alt="${title} ${subtitle}" width="568" height="568" loading="lazy" />
          <div class="product-img-overlay"></div>
          <span class="product-img-badge">Kategorie</span>
        </div>
        <div class="product-header">
          <div class="product-icon">${icon}</div>
          <div>
            <h3>${title}</h3>
            <p>${subtitle}</p>
          </div>
        </div>
        <div class="product-body">
          <p class="product-desc">${desc}</p>
          <div class="catalog-wrap" data-reveal>
            <button class="catalog-toggle" aria-expanded="false">
              <span>Alle ${title}-Artikel ansehen (${items.length})</span>
              <span class="product-toggle-icon">▾</span>
            </button>
            <div class="catalog-scroll">
              <div class="category-items-grid">
${cards}
              </div>
            </div>
          </div>
        </div>
      </div>`;
}

const flaskIcon = '<svg viewBox="0 0 24 24"><path d="M9 2h6"/><path d="M10 2v6.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8.5V2"/><path d="M7 15h10"/></svg>';
const beakerIcon = '<svg viewBox="0 0 24 24"><path d="M4 3h16"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>';

const borox = categoryCard({
  slug: 'borox',
  cover: 'category-borox.jpg',
  icon: flaskIcon,
  title: 'Borox',
  subtitle: 'Laborglas & Verbrauchsmaterial',
  desc: 'Türkischer Hersteller von Laborglas und Filtrationszubehör – Büchnertrichter, Vakuum-Filtrationssets, Filterpapier, Stopfen und Spritzflaschen für den täglichen Laborbedarf.',
  items: boroxMeta,
  dir: 'borox',
});

const kimyalab = categoryCard({
  slug: 'kimyalab',
  cover: 'category-kimyalab.jpg',
  icon: beakerIcon,
  title: 'Kimyalab',
  subtitle: 'Laborchemikalien',
  desc: 'Hochreine Laborchemikalien für Forschung, Lehre und Qualitätskontrolle – Säuren, Salze, Indikatoren und Reagenzien in verschiedenen Gebindegrößen.',
  items: kimyaMeta,
  dir: 'kimyalab',
});

fs.writeFileSync('tmp_work/category_cards.html', borox + '\n\n' + kimyalab + '\n', 'utf8');
console.log('Generated category cards. Borox items:', boroxMeta.length, 'Kimyalab items:', kimyaMeta.length);
