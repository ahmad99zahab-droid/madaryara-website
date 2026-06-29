// Extract embedded JPEG/PNG image streams directly from a PDF's raw bytes.
// Works without external PDF libraries by scanning for image stream markers.
const fs = require('fs');
const path = require('path');

const pdfPath = process.argv[2];
const outDir = process.argv[3];
const baseName = process.argv[4] || path.basename(pdfPath, '.pdf');

const buf = fs.readFileSync(pdfPath);

function findAll(buf, needle) {
  const indices = [];
  let idx = 0;
  while (true) {
    idx = buf.indexOf(needle, idx);
    if (idx === -1) break;
    indices.push(idx);
    idx += 1;
  }
  return indices;
}

let count = 0;
const results = [];

// --- JPEG extraction: scan for SOI (FFD8) ... EOI (FFD9) ---
const jpegStarts = findAll(buf, Buffer.from([0xff, 0xd8, 0xff]));
const usedRanges = [];
for (const start of jpegStarts) {
  // avoid overlapping with previous extraction
  if (usedRanges.some(([s, e]) => start >= s && start < e)) continue;
  const end = buf.indexOf(Buffer.from([0xff, 0xd9]), start);
  if (end === -1) continue;
  const len = end + 2 - start;
  if (len < 3000) continue; // skip tiny thumbnails/icons
  const data = buf.slice(start, end + 2);
  count++;
  const outPath = path.join(outDir, `${baseName}_jpg_${count}_${len}.jpg`);
  fs.writeFileSync(outPath, data);
  results.push(outPath);
  usedRanges.push([start, end + 2]);
}

// --- PNG extraction: scan for PNG signature ... IEND ---
const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const pngStarts = findAll(buf, pngSig);
for (const start of pngStarts) {
  const iendIdx = buf.indexOf(Buffer.from('IEND'), start);
  if (iendIdx === -1) continue;
  const end = iendIdx + 8; // IEND + 4-byte CRC
  const len = end - start;
  if (len < 3000) continue;
  const data = buf.slice(start, end);
  count++;
  const outPath = path.join(outDir, `${baseName}_png_${count}_${len}.png`);
  fs.writeFileSync(outPath, data);
  results.push(outPath);
}

console.log(`${baseName}: extracted ${results.length} image(s)`);
results.forEach(r => console.log('  ', r));
