const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Helper: build ordered file list from images/catalog dir, sorted numerically.
function orderedFiles(prefix) {
  const dir = path.join(__dirname, '..', 'images', 'catalog');
  return fs.readdirSync(dir)
    .filter(f => f.startsWith(prefix + '_'))
    .sort((a, b) => {
      const na = parseInt(a.match(/_(\d+)\./)[1], 10);
      const nb = parseInt(b.match(/_(\d+)\./)[1], 10);
      return na - nb;
    });
}

// row index (1-based) -> filename, explicit gaps stay unmapped (no image)
function buildMap(prefix, totalRows, gapRows = []) {
  const files = orderedFiles(prefix);
  const map = {};
  let fi = 0;
  for (let row = 1; row <= totalRows; row++) {
    if (gapRows.includes(row)) continue;
    map[row] = files[fi];
    fi++;
  }
  return map;
}

const atagoMap = buildMap('atago', 20);
const milwaukeeMap = buildMap('milwaukee', 23, [8, 23]);
const optikaMap = buildMap('optika', 19);

function injectBrand(html, anchorText, map) {
  const anchorIdx = html.indexOf(anchorText);
  if (anchorIdx === -1) throw new Error('anchor not found: ' + anchorText);
  // scope: from anchor to the next "</ul>" that closes catalog-list
  const ulEnd = html.indexOf('</ul>', anchorIdx);
  if (ulEnd === -1) throw new Error('closing </ul> not found for ' + anchorText);
  let scope = html.slice(anchorIdx, ulEnd);

  let rowCounter = 0;
  const iconRe = /<span class="catalog-row-icon">(<svg[\s\S]*?<\/svg>)<\/span>/g;
  scope = scope.replace(iconRe, (match, svg) => {
    rowCounter++;
    const file = map[rowCounter];
    if (!file) return match; // no image for this row, keep icon
    return `<span class="catalog-row-icon catalog-row-icon--photo"><img class="catalog-row-photo" src="images/catalog/${file}" alt="" loading="lazy" width="44" height="44" />${svg}</span>`;
  });

  html = html.slice(0, anchorIdx) + scope + html.slice(ulEnd);
  return html;
}

html = injectBrand(html, 'Vollständigen Atago-Katalog anzeigen', atagoMap);
html = injectBrand(html, 'Vollständigen Milwaukee-Katalog anzeigen', milwaukeeMap);
html = injectBrand(html, 'Vollständigen Optika-Katalog anzeigen', optikaMap);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done. Atago rows mapped:', Object.keys(atagoMap).length, '/ Milwaukee:', Object.keys(milwaukeeMap).length, '/ Optika:', Object.keys(optikaMap).length);
