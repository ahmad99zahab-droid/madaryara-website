const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Extract balanced <div ...>...</div> blocks of a given class, starting search from `from`.
function extractBalancedDivs(html, className, from, to) {
  const re = new RegExp(`<div class="${className}"[^>]*>`);
  const divs = [];
  let pos = from;
  while (true) {
    const m = re.exec(html.slice(pos, to));
    if (!m) break;
    const start = pos + m.index;
    let depth = 0;
    let p = start;
    let end = -1;
    while (p < html.length) {
      const nextOpen = html.indexOf('<div', p);
      const nextClose = html.indexOf('</div>', p);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        p = html.indexOf('>', nextOpen) + 1;
      } else {
        depth--;
        p = nextClose + '</div>'.length;
        if (depth === 0) { end = p; break; }
      }
    }
    if (end === -1) throw new Error('unbalanced div for class ' + className);
    divs.push({ start, end, html: html.slice(start, end) });
    pos = end;
  }
  return divs;
}

const brands = [
  { marker: '<!-- ===== OPTIKA ===== -->', name: 'Optika' },
  { marker: '<!-- ===== THERMOMAC ===== -->', name: 'Thermomac' },
  { marker: '<!-- ===== MILWAUKEE ===== -->', name: 'Milwaukee' },
  { marker: '<!-- ===== ATAGO ===== -->', name: 'Atago' },
];

// process in reverse order so earlier string offsets remain valid as we edit
for (let i = brands.length - 1; i >= 0; i--) {
  const { marker, name } = brands[i];
  const markerIdx = html.indexOf(marker);
  if (markerIdx === -1) throw new Error('marker not found: ' + marker);

  // bound the search to this brand block: from marker to next brand marker or end of marken section
  const nextMarkerIdx = i + 1 < brands.length ? html.indexOf(brands[i + 1].marker) : html.indexOf('  </section>', markerIdx);
  const blockEnd = nextMarkerIdx;

  // find the scroll-wrap start and its balanced end within this block
  const scrollWrapStart = html.indexOf('<div class="scroll-wrap">', markerIdx);
  if (scrollWrapStart === -1 || scrollWrapStart > blockEnd) throw new Error('scroll-wrap not found for ' + name);

  let depth = 0, p = scrollWrapStart, scrollWrapEnd = -1;
  while (p < html.length) {
    const nextOpen = html.indexOf('<div', p);
    const nextClose = html.indexOf('</div>', p);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      p = html.indexOf('>', nextOpen) + 1;
    } else {
      depth--;
      p = nextClose + '</div>'.length;
      if (depth === 0) { scrollWrapEnd = p; break; }
    }
  }
  if (scrollWrapEnd === -1) throw new Error('unbalanced scroll-wrap for ' + name);

  const scrollWrapHtml = html.slice(scrollWrapStart, scrollWrapEnd);
  const cards = extractBalancedDivs(scrollWrapHtml, 'product-card', 0, scrollWrapHtml.length);
  if (cards.length < 1) throw new Error('no product-card found for ' + name);

  const firstCard = cards[0].html;
  const restCards = cards.slice(1).map(c => c.html).join('\n\n');

  let replacement = `<div class="brand-featured" data-reveal>\n${firstCard}\n      </div>`;
  if (restCards) {
    replacement += `\n\n      <div class="catalog-wrap" data-reveal>\n        <button class="catalog-toggle" aria-expanded="false">\n          <span>Weitere ${name}-Geräte anzeigen</span>\n          <span class="product-toggle-icon">▾</span>\n        </button>\n        <div class="catalog-scroll">\n          <div class="brand-more-grid">\n${restCards}\n          </div>\n        </div>\n      </div>`;
  }

  html = html.slice(0, scrollWrapStart) + replacement + html.slice(scrollWrapEnd);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done.');
