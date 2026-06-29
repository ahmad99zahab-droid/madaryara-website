const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

function findBalancedDiv(html, startIdx) {
  let depth = 0, p = startIdx, end = -1;
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
  if (end === -1) throw new Error('unbalanced div at ' + startIdx);
  return end;
}

function extractProductCards(fragment) {
  const cards = [];
  const re = /<div class="product-card"[^>]*>/g;
  let m;
  while ((m = re.exec(fragment))) {
    const start = m.index;
    const end = findBalancedDiv(fragment, start);
    cards.push(fragment.slice(start, end));
    re.lastIndex = end;
  }
  return cards;
}

const brandMarkers = [
  '<!-- ===== OPTIKA ===== -->',
  '<!-- ===== THERMOMAC ===== -->',
  '<!-- ===== MILWAUKEE ===== -->',
  '<!-- ===== ATAGO ===== -->',
];

for (let i = brandMarkers.length - 1; i >= 0; i--) {
  const marker = brandMarkers[i];
  const markerIdx = html.indexOf(marker);
  if (markerIdx === -1) throw new Error('marker not found: ' + marker);

  const featuredStart = html.indexOf('<div class="brand-featured" data-reveal>', markerIdx);
  if (featuredStart === -1) throw new Error('brand-featured not found for ' + marker);
  const featuredEnd = findBalancedDiv(html, featuredStart);

  // check if a catalog-wrap immediately follows (within next ~50 chars of whitespace)
  const gap = html.slice(featuredEnd, featuredEnd + 60);
  let totalEnd = featuredEnd;
  let cards = extractProductCards(html.slice(featuredStart, featuredEnd));

  const catalogWrapIdx = html.indexOf('<div class="catalog-wrap" data-reveal>', featuredEnd);
  // only treat as belonging to this brand if it appears before the next brand marker / reasonably close
  const nextMarkerIdx = i + 1 < brandMarkers.length ? html.indexOf(brandMarkers[i + 1]) : html.length;
  if (catalogWrapIdx !== -1 && catalogWrapIdx < nextMarkerIdx && catalogWrapIdx - featuredEnd < 40) {
    const catalogWrapEnd = findBalancedDiv(html, catalogWrapIdx);
    const moreCards = extractProductCards(html.slice(catalogWrapIdx, catalogWrapEnd));
    cards = cards.concat(moreCards);
    totalEnd = catalogWrapEnd;
  }

  const replacement = `<div class="products-grid">\n${cards.join('\n\n')}\n      </div>`;
  html = html.slice(0, featuredStart) + replacement + html.slice(totalEnd);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Reverted brand sections to side-by-side grid.');
