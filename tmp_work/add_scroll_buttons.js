const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Remove the old inline text scroll hints in brand sections
const hintRe = /\n\s*<span class="brand-scroll-hint">.*?<\/span>/g;
const hintCount = (html.match(hintRe) || []).length;
html = html.replace(hintRe, '');
console.log('Removed brand-scroll-hint spans:', hintCount);

// 2. Wrap each balanced <div class="products-scroll">...</div> with a scroll-wrap + nav button
function wrapBalancedDiv(html, openTagStr, wrapperClass) {
  let idx = html.indexOf(openTagStr);
  let count = 0;
  while (idx !== -1) {
    let pos = idx;
    let depth = 0;
    let end = -1;
    while (pos < html.length) {
      const nextOpen = html.indexOf('<div', pos);
      const nextClose = html.indexOf('</div>', pos);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = html.indexOf('>', nextOpen) + 1;
      } else {
        depth--;
        pos = nextClose + '</div>'.length;
        if (depth === 0) { end = pos; break; }
      }
    }
    if (end === -1) throw new Error('unbalanced div for ' + openTagStr);
    const inner = html.slice(idx, end);
    const replacement = `<div class="${wrapperClass}">\n      ${inner}\n      <button class="scroll-nav-btn" type="button" aria-label="Weitere Geräte anzeigen">\n        <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>\n      </button>\n    </div>`;
    html = html.slice(0, idx) + replacement + html.slice(end);
    count++;
    idx = html.indexOf(openTagStr, idx + replacement.length);
  }
  console.log('Wrapped', count, 'occurrences of', openTagStr);
  return html;
}

html = wrapBalancedDiv(html, '<div class="products-scroll">', 'scroll-wrap');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done. New length:', html.length);
