const fs = require('fs');
const https = require('https');
const sharp = require('sharp');

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const borox = [
  ['borox_01.jpg', 'Filtre Kağıdı', 'https://www.blabmarket.com/idea/df/26/myassets/products/437/borox-filtre-kagidi-kalitatif-grade43-25mm-qualitative-filter-paper-price_min.webp'],
  ['borox_02.jpg', 'Vakum Filtrasyon Set', 'https://www.blabmarket.com/idea/df/26/myassets/products/430/borox-vakum-filtrasyon-seti-fiyat-vacuum-filtraion-set_min.webp'],
  ['borox_03.jpg', 'Büchner-Filtrationsset', 'https://www.blabmarket.com/idea/df/26/myassets/products/406/buhner-huni-filtrasyon-seti-500ml-nuce-erlen-fiyat-set-filtrasyon-set-cesitleri_min.jpg'],
  ['borox_04.jpg', 'Vakuumpumpen-Filtrationsset', 'https://www.blabmarket.com/idea/df/26/myassets/products/403/borox-vakum-filtrasyon-seti-yagsiz-vakum-pompasi-vacuum-filtration-set_min.jpg'],
  ['borox_05.jpg', 'Membranfilter-Set', 'https://www.blabmarket.com/idea/df/26/myassets/products/401/vakum-filtrasyon-seti-suzme-seti-pompali-laboratuvar-duzenegi-fiyat_min.jpg'],
  ['borox_06.jpg', 'Glas-Büchnertrichter', 'https://www.blabmarket.com/idea/df/26/myassets/products/264/borox-cam-buhner-hunisi-1000ml-grade3-fiyat-sinterlenmis-disk-nuce-buhner-huni-funnel-buchner-type-with-sintered-disc-price_min.jpg'],
  ['borox_07.jpg', 'Korkstopfen-Set', 'https://www.blabmarket.com/idea/df/26/myassets/products/137/borox-mantar-tipa-no-22-cork-stopper_min.jpg'],
  ['borox_08.jpg', 'Silikonstopfen-Set', 'https://www.blabmarket.com/idea/df/26/myassets/products/067/borox-silikon-hortum-no-12-5adet-fiyat-silicon-stopper-price_min.jpg'],
  ['borox_09.jpg', 'Spritzflasche (Hypochlorit)', 'https://www.blabmarket.com/idea/df/26/myassets/products/802/p43131-509-1-sodyum-hipoklorit-piseti-borox-aseton-etanol-metanol-saf-su-ipa-sodyum-hipolorit-yikama-sisesi-renkli-kapak-etiket-baskili-vented-washing-bottle-fiyat_min.jpg'],
  ['borox_10.jpg', 'Spritzflasche (IPA)', 'https://www.blabmarket.com/idea/df/26/myassets/products/801/p43131-507-1-ipa-piseti-borox-aseton-etanol-metanol-saf-su-ipa-sodyum-hipolorit-yikama-sisesi-renkli-kapak-etiket-baskili-vented-washing-bottle-fiyat_min.jpg'],
];

const kimya = [
  ['kimyalab_01.jpg', 'Zitronensäure-Monohydrat', 'https://www.blabmarket.com/idea/df/26/myassets/products/956/sitrik-asit-monohidrat-1kg-fiyat-nedir-citric-acid-monohydrate-price_min.jpg'],
  ['kimyalab_02.jpg', 'Natriumnitrit', 'https://www.blabmarket.com/idea/df/26/myassets/products/535/sodyum-nitrit-1kg-fiyat-nedir-kullanim-alanlari-nano3-sodium-nitrite-price_min.jpg'],
  ['kimyalab_03.jpg', 'Stearinsäure', 'https://www.blabmarket.com/idea/df/26/myassets/products/715/stearik-asit-500g-fiyat-stearic-acid_min.jpg'],
  ['kimyalab_04.jpg', 'Zinkoxid', 'https://www.blabmarket.com/idea/df/26/myassets/products/738/cinko-oksit-1kg-fiyat-nedir-kullanim-alanlari-nelerdir-zinc-nedir-zinc-oxide-prices_min.jpg'],
  ['kimyalab_05.jpg', 'Natriummetabisulfit', 'https://www.blabmarket.com/idea/df/26/myassets/products/837/sodyum-metabisulfit-1kg-fiyat-sodium-metabisulfite-price_min.jpg'],
  ['kimyalab_06.jpg', 'Zinksulfat-Heptahydrat', 'https://www.blabmarket.com/idea/df/26/myassets/products/917/cinko-sulfat-heptahidrat-1kg-fiyat-zinc-sulfate-heptahydrate-price_min.jpg'],
  ['kimyalab_07.jpg', 'Lactose-Monohydrat', 'https://www.blabmarket.com/idea/df/26/myassets/products/916/laktoz-monohidrat-1kg-fiyat-lactose-monohydrate-price_min.jpg'],
  ['kimyalab_08.jpg', 'Bariumchlorid', 'https://www.blabmarket.com/idea/df/26/myassets/products/918/baryum-klorur-1kg-fiyat-nedir-barium-chloride-dihydrate-price_min.jpg'],
  ['kimyalab_09.jpg', 'Zinkchlorid', 'https://www.blabmarket.com/idea/df/26/myassets/products/919/cinko-klorur-1kg-fiyat-zncl2-zinc-chloride-price_min.jpg'],
  ['kimyalab_10.jpg', 'Aluminiumsulfat', 'https://www.blabmarket.com/idea/df/26/myassets/products/920/aluminyum-sulfat-1kg-fiyat-aluminium-sulfafe-anhydrous-price_min.jpg'],
  ['kimyalab_11.jpg', 'Eisen(II)-sulfat-Heptahydrat', 'https://www.blabmarket.com/idea/df/26/myassets/products/730/demir-2-sulfat-1kg-fiyat-iron-ii-sulfate-heptayhdrate-usp-price_min.jpg'],
  ['kimyalab_12.jpg', 'Aktivkohle-Pulver', 'https://www.blabmarket.com/idea/df/26/myassets/products/743/aktif-karbon-toz-1kg-fiyat-activated-charcoal-powder-price_min.jpg'],
  ['kimyalab_13.jpg', 'Natriumchlorid', 'https://www.blabmarket.com/idea/df/26/myassets/products/007/sodyum-klorur-1kg-fiyat-nacl-nedir-sodium-chloride-prices_min.jpg'],
  ['kimyalab_14.jpg', 'Natriumhydrogencarbonat', 'https://www.blabmarket.com/idea/df/26/myassets/products/601/sodyum-hidrojen-karbonat-1kg-fiyat-nedir-kullanim-alanlari-nelerdir-sodium-hydrogen-carbonate-price_min.jpg'],
  ['kimyalab_15.jpg', 'Calciumcarbonat', 'https://www.blabmarket.com/idea/df/26/myassets/products/602/kalsiyum-karbonat-1kg-fiyat-caco3-calcium-carbonate-price_min.jpg'],
  ['kimyalab_16.jpg', 'Natriumhydroxid', 'https://www.blabmarket.com/idea/df/26/myassets/products/003/sodyum-hidroksit-1kg-fiyat-sodium-hydroxide-price_min.jpg'],
  ['kimyalab_17.jpg', 'Kaliumsulfat', 'https://www.blabmarket.com/idea/df/26/myassets/products/002/potasyum-sulfat-1kg-fiyat-potassium-sulfate-price_min.jpg'],
  ['kimyalab_18.jpg', 'Kaliumhydroxid', 'https://www.blabmarket.com/idea/df/26/myassets/products/991/potasyum-hidroksit-1kg-fiyat-potassium-hydroxide-price_min.jpg'],
  ['kimyalab_19.jpg', 'Kaliumcarbonat (Granulat)', 'https://www.blabmarket.com/idea/df/26/myassets/products/999/potasyum-karbonat-1kg-fiyat-potassium-carbonate-granule-price_min.jpg'],
  ['kimyalab_20.jpg', 'Calciumchlorid', 'https://www.blabmarket.com/idea/df/26/myassets/products/499/kalsiyum-klorur-1kg-fiyat-calcium-chloride-price_min.jpg'],
  ['kimyalab_21.jpg', 'Magnesiumsulfat-Heptahydrat', 'https://www.blabmarket.com/idea/df/26/myassets/products/498/magnezyum-sulfat-1kg-fiyat-nedir-kullanim-alanlari-neelrdir-magnesium-sulfate-heptahydrate-price_min.jpg'],
  ['kimyalab_22.jpg', 'Koffein, wasserfrei', 'https://www.blabmarket.com/idea/df/26/myassets/products/528/kafein-100gr-fiyat-toz-kafein-nedir-caffeine-anhydrous-price_min.jpg'],
  ['kimyalab_23.jpg', 'Salicylsäure', 'https://www.blabmarket.com/idea/df/26/myassets/products/312/salisilik-asit-250g-hdpe-fiyat-salicylic-acid-price_min.jpg'],
  ['kimyalab_24.jpg', 'Natriumperborat-Tetrahydrat', 'https://www.blabmarket.com/idea/df/26/myassets/products/291/sodyum-perborat-250g-fiyat-nedir-kullanim-alanlari-sodium-perborate-tetrahydrate-price_min.jpg'],
  ['kimyalab_25.jpg', 'EDTA-4Na', 'https://www.blabmarket.com/idea/df/26/myassets/products/230/edta-4na-500g-fiyat-edta-cesitleri-kullanim-alanlari-toptan-satis-fiyat_min.jpg'],
];

async function run(list, dir) {
  const meta = [];
  for (const [file, label, url] of list) {
    try {
      const buf = await download(url);
      const out = await sharp(buf).resize(400, 400, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
      fs.writeFileSync(`images/catalog/${dir}/${file}`, out);
      meta.push({ file, label });
      console.log(dir, file, label, 'OK', out.length);
    } catch (e) {
      console.log(dir, file, label, 'FAILED', e.message);
    }
  }
  fs.writeFileSync(`tmp_work/${dir}_meta.json`, JSON.stringify(meta, null, 1));
}

(async () => {
  await run(borox, 'borox');
  await run(kimya, 'kimyalab');
})();
