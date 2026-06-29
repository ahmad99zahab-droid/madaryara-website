const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

async function run() {
  const css = fs.readFileSync('css/style.css', 'utf8');
  const cssOut = new CleanCSS({}).minify(css);
  fs.writeFileSync('css/style.min.css', cssOut.styles);
  console.log('CSS:', css.length, '->', cssOut.styles.length, 'bytes');

  const jsFiles = ['theme.js', 'i18n.js', 'script.js', 'cart.js'];
  for (const file of jsFiles) {
    const code = fs.readFileSync(path.join('js', file), 'utf8');
    const result = await minify(code, { compress: true, mangle: true });
    const outPath = path.join('js', file.replace('.js', '.min.js'));
    fs.writeFileSync(outPath, result.code);
    console.log(file, ':', code.length, '->', result.code.length, 'bytes');
  }
}

run();
