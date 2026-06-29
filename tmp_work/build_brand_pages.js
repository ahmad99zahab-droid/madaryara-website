const fs = require('fs');
const path = require('path');
const { categories } = require('./catalog_data.js');

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

const allItems = categories.flatMap(c => c.items);
function itemsForBrand(brandName) {
  return allItems.filter(it => it.brand === brandName).map(it => ({ img: it.img, name: it.name }));
}

const boroxMeta = loadJSON('tmp_work/borox_meta.json').map(it => ({ img: `images/catalog/borox/${it.file}`, name: it.label }));
const kimyalabMeta = loadJSON('tmp_work/kimyalab_meta.json').map(it => ({ img: `images/catalog/kimyalab/${it.file}`, name: it.label }));
const axisMeta = loadJSON('tmp_work/axis_full_meta.json').map(it => ({ img: `images/catalog/axis/${it.file}`, name: it.name }));
const biobaseMeta = loadJSON('tmp_work/biobase_full_meta.json').map(it => ({ img: `images/catalog/biobase/${it.file}`, name: it.name }));
const azMeta = loadJSON('tmp_work/az-instrument_full_meta.json').map(it => ({ img: `images/catalog/az-instrument/${it.file}`, name: it.name }));
const radwagMeta = loadJSON('tmp_work/radwag_full_meta.json').map(it => ({ img: `images/catalog/radwag/${it.file}`, name: it.name }));
const beyanlabMeta = loadJSON('tmp_work/beyanlab_full_meta.json').map(it => ({ img: `images/catalog/beyanlab/${it.file}`, name: it.name }));

const brands = [
  { slug: 'axis', label: 'Axis', logo: 'images/logo-axis.png', card: false, items: axisMeta, sub: 'Präzisions- und Analysewaagen, Feuchtebestimmungsgeräte' },
  { slug: 'biobase', label: 'Biobase', logo: 'images/logo-biobase.png', card: true, items: biobaseMeta, sub: 'Sterilisation und Autoklaven' },
  { slug: 'kimyalab', label: 'Kimyalab', logo: 'images/logo-kimyalab.png', card: false, items: kimyalabMeta, sub: 'Laborchemikalien' },
  { slug: 'az-instrument', label: 'AZ Instrument', logo: 'images/logo-az-instrument.png', card: true, items: azMeta, sub: 'Tragbare Mess- und Prüfgeräte' },
  { slug: 'borox', label: 'Borox', logo: 'images/logo-borox.png', card: false, items: boroxMeta, sub: 'Laborglas & Verbrauchsmaterial' },
  { slug: 'milwaukee', label: 'Milwaukee Instruments', logo: 'images/logo-milwaukee.png', card: false, items: itemsForBrand('Milwaukee'), sub: 'pH-, Leitfähigkeits- und Sauerstoffmessgeräte' },
  { slug: 'radwag', label: 'Radwag', logo: 'images/logo-radwag.png', card: true, items: radwagMeta, sub: 'Analytische und Präzisionswaagen' },
  { slug: 'thermomac', label: 'Thermomac', logo: 'images/logo-thermomac.png', card: false, baked: true, items: itemsForBrand('Thermomac'), sub: 'Trockenschränke, Rührer, Wasserbäder & Inkubatoren' },
  { slug: 'atago', label: 'Atago', logo: 'images/logo-atago.png', card: true, items: itemsForBrand('Atago'), sub: 'Hochpräzise Refraktometer' },
  { slug: 'optika', label: 'Optika', logo: 'images/logo-optika.png', card: false, items: itemsForBrand('Optika'), sub: 'Mikroskope für Labor, Bildung und Industrie' },
  { slug: 'beyanlab', label: 'Beyanlab', logo: 'images/logo-beyanlab.png', card: true, items: beyanlabMeta, sub: 'Laborverbrauchsmaterial, Schutzausrüstung & Waagen' },
];

function miniCard(item) {
  return `        <div class="mini-item-card" data-reveal>
          <img src="${item.img}" alt="${item.name}" loading="lazy" width="160" height="160" />
          <span>${item.name}</span>
        </div>`;
}

function page(b) {
  const logoClass = b.card ? 'brand-logo-card' : (b.baked ? 'brand-logo-card brand-logo-card--baked' : '');
  const logoImg = `<img class="brand-page-logo" src="${b.logo}" alt="${b.label} Logo" loading="lazy" />`;
  const logoMarkup = logoClass ? `<span class="${logoClass}">${logoImg}</span>` : logoImg;
  const cards = b.items.map(miniCard).join('\n');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${b.label} – Alle Geräte | Madar Yara Co.</title>
  <meta name="robots" content="noindex" />
  <meta name="theme-color" content="#14163a" />
  <link rel="icon" type="image/png" href="images/favicon.png" />
  <link rel="apple-touch-icon" href="images/apple-touch-icon.png" />
  <link rel="stylesheet" href="css/style.min.css" />
</head>
<body>
  <div class="bg-water" aria-hidden="true"></div>

  <main class="brand-page">
    <a class="back-link" href="index.html#markenstreifen">← Zurück zur Startseite</a>

    <div class="brand-page-head">
      ${logoMarkup}
      <div>
        <h1>${b.label}</h1>
        <p>${b.sub} · ${b.items.length} Geräte</p>
      </div>
    </div>

    <div class="category-items-grid brand-page-grid">
${cards}
    </div>

    <a class="btn-primary brand-page-cta" href="index.html#kontakt">Anfrage senden</a>
  </main>

  <footer>
    <div class="footer-logo"><span class="logo-mark" aria-hidden="true"></span>Madar Yara Co.</div>
    <div class="footer-links">
      <a href="index.html">Startseite</a>
      <a href="zertifikate.html">Zertifikate</a>
      <a href="zahlung-versand.html">Zahlung &amp; Versand</a>
      <a href="agb.html">AGB</a>
      <a href="impressum.html">Impressum</a>
      <a href="datenschutz.html">Datenschutz</a>
    </div>
    <p>© 2026 Madar Yara Co. Alle Rechte vorbehalten.</p>
  </footer>

  <div class="cookie-consent" id="cookieConsent" role="dialog" aria-live="polite" aria-label="Datenschutzhinweis" hidden>
    <p>
      Wir nutzen auf dieser Website nur die für den Betrieb notwendigen Funktionen. Mit Klick auf „Akzeptieren“ stimmen Sie unserer <a href="datenschutz.html">Datenschutzerklärung</a> zu.
    </p>
    <button class="cookie-consent-btn" id="cookieAccept">Akzeptieren</button>
  </div>

  <script src="js/theme.min.js"></script>
  <script src="js/script.min.js"></script>
  <script>
    (function () {
      var KEY = 'madaryara-consent-accepted';
      var MAX_AGE = 180 * 24 * 60 * 60 * 1000;
      var banner = document.getElementById('cookieConsent');
      var btn = document.getElementById('cookieAccept');
      if (!banner || !btn) return;
      var acceptedAt = parseInt(localStorage.getItem(KEY), 10);
      var isStillValid = acceptedAt && (Date.now() - acceptedAt) < MAX_AGE;
      if (!isStillValid) {
        banner.hidden = false;
        requestAnimationFrame(function () { banner.classList.add('visible'); });
      }
      btn.addEventListener('click', function () {
        localStorage.setItem(KEY, String(Date.now()));
        banner.classList.remove('visible');
        setTimeout(function () { banner.hidden = true; }, 400);
      });
    })();
  </script>
</body>
</html>
`;
}

for (const b of brands) {
  fs.writeFileSync(`marke-${b.slug}.html`, page(b), 'utf8');
  console.log('Wrote', `marke-${b.slug}.html`, '-', b.items.length, 'items');
}

fs.writeFileSync('tmp_work/brands_master.json', JSON.stringify(brands.map(b => ({ slug: b.slug, label: b.label, logo: b.logo, card: b.card, baked: b.baked, count: b.items.length })), null, 1));
