const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Remove every <div class="catalog-wrap" ...> ... </div> block (balanced) within the marken section.
function removeBalancedDiv(html, openTagStr) {
  let idx = html.indexOf(openTagStr);
  while (idx !== -1) {
    let depth = 0;
    let i = idx;
    let end = -1;
    const divOpenRe = /<div\b[^>]*>/g;
    const divCloseStr = '</div>';
    // walk forward char by char tracking div open/close
    let pos = idx;
    while (pos < html.length) {
      const nextOpen = html.indexOf('<div', pos);
      const nextClose = html.indexOf(divCloseStr, pos);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = html.indexOf('>', nextOpen) + 1;
      } else {
        depth--;
        pos = nextClose + divCloseStr.length;
        if (depth === 0) { end = pos; break; }
      }
    }
    if (end === -1) throw new Error('unbalanced div for ' + openTagStr);
    html = html.slice(0, idx) + html.slice(end);
    idx = html.indexOf(openTagStr);
  }
  return html;
}

const before = html.length;
html = removeBalancedDiv(html, '<div class="catalog-wrap" data-reveal>');
console.log('Removed catalog-wrap blocks, chars removed:', before - html.length);

// Convert products-grid -> products-scroll (horizontal scroll container)
const gridCount = (html.match(/class="products-grid"/g) || []).length;
html = html.replace(/class="products-grid"/g, 'class="products-scroll"');
console.log('Converted products-grid -> products-scroll:', gridCount, 'occurrences');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done. New length:', html.length);
