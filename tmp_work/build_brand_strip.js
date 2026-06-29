const fs = require('fs');
const { categories } = require('./catalog_data.js');

function loadJSON(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

// Flatten existing catalog_data.js items by brand
const allItems = categories.flatMap(c => c.items);
function itemsForBrand(brandName) {
  return allItems
    .filter(it => it.brand === brandName)
    .map(it => ({ img: it.img, name: it.name }));
}

const boroxMeta = loadJSON('tmp_work/borox_meta.json').map(it => ({ img: `images/catalog/borox/${it.file}`, name: it.label }));
const kimyalabMeta = loadJSON('tmp_work/kimyalab_meta.json').map(it => ({ img: `images/catalog/kimyalab/${it.file}`, name: it.label }));
const axisMeta = loadJSON('tmp_work/axis_full_meta.json').map(it => ({ img: `images/catalog/axis/${it.file}`, name: it.name }));
const biobaseMeta = loadJSON('tmp_work/biobase_full_meta.json').map(it => ({ img: `images/catalog/biobase/${it.file}`, name: it.name }));
const azMeta = loadJSON('tmp_work/az-instrument_full_meta.json').map(it => ({ img: `images/catalog/az-instrument/${it.file}`, name: it.name }));
const radwagMeta = loadJSON('tmp_work/radwag_full_meta.json').map(it => ({ img: `images/catalog/radwag/${it.file}`, name: it.name }));
const beyanlabMeta = loadJSON('tmp_work/beyanlab_full_meta.json').map(it => ({ img: `images/catalog/beyanlab/${it.file}`, name: it.name }));

const brands = [
  { slug: 'axis', label: 'Axis', logo: 'images/logo-axis.png', card: false, items: axisMeta },
  { slug: 'biobase', label: 'Biobase', logo: 'images/logo-biobase.png', card: true, items: biobaseMeta },
  { slug: 'kimyalab', label: 'Kimyalab', logo: 'images/logo-kimyalab.png', card: false, items: kimyalabMeta },
  { slug: 'az-instrument', label: 'AZ Instrument', logo: 'images/logo-az-instrument.png', card: true, items: azMeta },
  { slug: 'borox', label: 'Borox', logo: 'images/logo-borox.png', card: false, items: boroxMeta },
  { slug: 'milwaukee', label: 'Milwaukee', logo: 'images/logo-milwaukee.png', card: false, items: itemsForBrand('Milwaukee') },
  { slug: 'radwag', label: 'Radwag', logo: 'images/logo-radwag.png', card: true, items: radwagMeta },
  { slug: 'thermomac', label: 'Thermomac', logo: 'images/logo-thermomac.png', card: false, baked: true, items: itemsForBrand('Thermomac') },
  { slug: 'atago', label: 'Atago', logo: 'images/logo-atago.png', card: true, items: itemsForBrand('Atago') },
  { slug: 'optika', label: 'Optika', logo: 'images/logo-optika.png', card: false, items: itemsForBrand('Optika') },
  { slug: 'beyanlab', label: 'Beyanlab', logo: 'images/logo-beyanlab.png', card: true, items: beyanlabMeta },
];

function brandTile(b) {
  const logoClass = b.card ? 'brand-logo-card' : (b.baked ? 'brand-logo-card brand-logo-card--baked' : '');
  const logoImg = `<img class="brand-tile-logo" src="${b.logo}" alt="${b.label} Logo" loading="lazy" />`;
  const logoMarkup = logoClass ? `<span class="${logoClass}">${logoImg}</span>` : logoImg;
  return `      <div class="brand-tile" data-reveal>
        ${logoMarkup}
        <a class="btn-small" href="marke-${b.slug}.html">Alle ${b.label}-Geräte ansehen (${b.items.length}) →</a>
      </div>`;
}

const section = `  <!-- MARKEN-STREIFEN -->
  <section id="markenstreifen">
    <div data-reveal>
      <p class="section-tag">Unsere Marken</p>
      <h2 class="section-title">Marken, <span>denen wir vertrauen</span></h2>
      <p class="section-sub">
        Klicken Sie auf eine Marke, um alle verfügbaren Geräte mit Foto anzusehen.
      </p>
    </div>
    <div class="brand-strip">
${brands.map(brandTile).join('\n')}
    </div>
  </section>
`;

fs.writeFileSync('tmp_work/brand_strip_section.html', section, 'utf8');
console.log('Generated brand strip. Counts:', brands.map(b => `${b.label}:${b.items.length}`).join(', '));
