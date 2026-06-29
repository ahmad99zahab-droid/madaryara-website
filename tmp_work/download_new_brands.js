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

const axis = [
  ['axis_01.jpg', 'AXIS ATS 120', 'Feuchtebestimmungsgerät · 120g, 0,001g', 'https://www.blabmarket.com/idea/df/26/myassets/products/728/axis-ats-120-nem-tayin-olcum-cihazi-rutubet-olcer-1207100636288935_min.jpg'],
  ['axis_02.jpg', 'AXIS ACN 220', 'Analytische Laborwaage · 220g, 0,0001g', 'https://www.blabmarket.com/idea/df/26/myassets/products/552/1-axis-acn-220-laboratuvar-analitik-terazi-220g-0-0001g-fiyat_min.jpg'],
  ['axis_03.jpg', 'AXIS ALN 220G', 'Analytische Laborwaage · 220g, 0,0001g', 'https://www.blabmarket.com/idea/df/26/myassets/products/983/laboratuvar-analitik-terazi-axis-aln-220g-220g-x-00001g-1016351460376744-1_min.jpg'],
  ['axis_04.jpg', 'AXIS ALN 220', 'Analytische Laborwaage · 220g, 0,0001g', 'https://www.blabmarket.com/idea/df/26/myassets/products/982/laboratuvar-analitik-terazi-axis-aln-220-220g-x-00001g-1562981416913589-ekstra-1_min.jpg'],
  ['axis_05.jpg', 'AXIS BTA2100D', 'Präzisionswaage · 2100g, 0,01g', 'https://www.blabmarket.com/idea/df/26/myassets/products/981/laboratuvar-hassas-terazi-2100g-001g-axis-bta2100d-1223325256584274-1_min.jpg'],
  ['axis_06.jpg', 'AXIS BTA300D', 'Präzisionswaage · 300g, 0,001g', 'https://www.blabmarket.com/idea/df/26/myassets/products/980/axis-bta300d-hassas-terazi-300g-0-001g-tartim-terazisi_min.jpg'],
  ['axis_07.jpg', 'AXIS BTA210D', 'Präzisionswaage · 210g, 0,001g', 'https://www.blabmarket.com/idea/df/26/myassets/products/979/kuyumcu-hassas-terazi-210gr-fiyat-satis_min.jpg'],
];

const biobase = [
  ['biobase_01.jpg', 'Biobase BKQ-B50 II', 'Vertikalautoklav · 50 Liter, handradbetätigt', 'https://www.blabmarket.com/idea/df/26/myassets/products/497/50-litre-el-carkli-dikey-tip-otoklav-biobase-bkq-b50-ii-fiyat-paslanmaz-celik-sepet-sterilizasyon-led-ekran-biobase-price_min.jpg'],
];

const az = [
  ['az_01.jpg', 'AZ 830P', 'Ersatz-Leitfähigkeitssonde · für AZ86505', 'https://www.blabmarket.com/idea/df/26/myassets/products/522/az-830p-yedek-iletkenlik-probu-az86505-metre-icin-elektrot_min.jpg'],
  ['az_02.jpg', 'AZ 833PAZ', 'Ersatz-EC-Sonde · für 86021/86031/84051', 'https://www.blabmarket.com/idea/df/26/myassets/products/749/az-833paz-ec-yedek-probu-86021-86031-84051-metre-icin_min.jpg'],
  ['az_03.jpg', 'AZ 88161', 'Temperatur-Datenlogger · Dual-Sonde', 'https://www.blabmarket.com/idea/df/26/myassets/products/517/az-88161-sicaklik-kayit-cihazi-datalogger-veri-kaydedici_min.jpg'],
  ['az_04.jpg', 'AZ 8551', 'Tragbares ORP-Messgerät · digital', 'https://www.blabmarket.com/idea/df/26/myassets/products/566/az-8551-portatif-orp-olcum-cihazi-dijital-orp-metre_min.jpg'],
  ['az_05.jpg', 'AZ 7701', 'Kohlenmonoxid-Messgerät · CO-Detektor', 'https://www.blabmarket.com/idea/df/26/myassets/products/564/karbonmonoksit-olcum-cihazi-7701-co-dedektoru-olcer-metre-meter_min.jpg'],
];

const radwag = [
  ['radwag_01.jpg', 'Radwag MA 50.R', 'Feuchtebestimmungsgerät · 50g, 1mg', 'https://www.blabmarket.com/idea/df/26/myassets/products/978/nem-tayin-cihazi-radwag-ma-50r-rutubet-olcer-50-gr-1-mg-0981072787586122_min.jpg'],
  ['radwag_02.jpg', 'Radwag AS 220 R.2 Plus', 'Analytische Laborwaage · 220g, interne Kalibrierung', 'https://www.blabmarket.com/idea/df/26/myassets/products/596/radwag-as-220-r-2-plus-analitik-terazi-genis-tartim-odasi-yuksek-hassasiyet-hizli-sonuc-profesyonel-terazi-fiyat-professional-analytical-balances-big-lcd-display-standard-keyboard-internal-calibration-alibi_min.jpg'],
  ['radwag_03.jpg', 'Radwag WTC 2000', 'Präzisionswaage · 2000g, 0,01g', 'https://www.blabmarket.com/idea/df/26/myassets/products/680/radwag-wtc-2000-hassas-terazi-2000g-0-01g-terazisi-fiyat_min.jpg'],
];

const beyanlab = [
  ['beyanlab_01.jpg', 'Steril-Spritze 1cc', 'Einwegspritze · 3-teilig, 500 Stk/Pack', 'https://www.blabmarket.com/idea/df/26/myassets/products/849/1-ml-enjektor-fiyat-500-adet-fiyat_min.jpg'],
  ['beyanlab_02.jpg', 'Steril-Spritze 10cc', 'Einwegspritze · 3-teilig, 150 Stk/Pack', 'https://www.blabmarket.com/idea/df/26/myassets/products/320/injector-p36139-001_min.jpg'],
  ['beyanlab_03.jpg', 'Skalpellklinge Nr. 12', 'Steril, Edelstahl · 100 Stk/Pack', 'https://www.blabmarket.com/idea/df/26/myassets/products/142/bisturi-ucu-no-12-scalpel-blades-bisturi-bicagi-fiyat_min.jpg'],
  ['beyanlab_04.jpg', 'Falcon-Röhrchen 50ml', 'Zentrifugenröhrchen, konischer Boden · 50 Stk', 'https://www.blabmarket.com/idea/df/26/myassets/products/710/falkon-tupu-50-adet-dibi-konik-falcon-50-ml-taksimatli-mavi-kapakli-tup-polipropilen-santrifuj-tupu-sizdirmaz-kapakli-falkon-eteksiz-tup_min.webp'],
  ['beyanlab_05.jpg', 'Falcon-Röhrchen 15ml steril', 'Zentrifugenröhrchen · 1000 Stk, Großgebinde', 'https://www.blabmarket.com/idea/df/26/myassets/products/435/p11954-015-borox-falkon-tupu-steril-15ml-tek-tek-posetli-50ml-fiyat-1000-adet-toptan-koli-fiyat-steril-falkon-tupleri-centrifuge-tube_min.webp'],
  ['beyanlab_06.jpg', 'Nitril-Einweghandschuhe Blau M', 'Untersuchungshandschuhe · puderfrei', 'https://www.blabmarket.com/idea/df/26/myassets/products/169/1-pudrasiz-nitril-muayene-eldiveni-medium-beden-pudrasiz-muayene-eldiveni-non-steril-laboratuvar-eldiveni-te-kullanimlik-eldiven-fiyat-toptan-perakende-adet-fiyat-istoc-hastane_min.jpg'],
  ['beyanlab_07.jpg', 'Latex-Einweghandschuhe L gepudert', 'Untersuchungshandschuhe · gepudert', 'https://www.blabmarket.com/idea/df/26/myassets/products/164/1-pudrali-lateks-muayene-eldiveni-beden-xs-s-m-l-xl-muayene-eldiveni-non-steril-gloves-powdered-kullan-at-eldiven-fiyat-toptan-perakende-adet-fiyat-istoc_min.jpg'],
  ['beyanlab_08.jpg', 'Steril-OP-Handschuh Nr. 8.5', 'Latex, gepudert · 50 Stk/Pack', 'https://www.blabmarket.com/idea/df/26/myassets/products/479/pudrali-steril-cerrahi-eldiven-sterile-gloves-fiyat-no-6-5-fiyat_min.jpg'],
  ['beyanlab_09.jpg', 'Reagenzglas-Kappe weiß 16mm', 'Geflügelte Kunststoffkappe · 50 Stk', 'https://www.blabmarket.com/idea/df/26/myassets/products/196/deney-tup-kapagi-tipa-white-kanatli-50-adet-fiyat_min.jpg'],
  ['beyanlab_10.jpg', 'Laborschutzbrille grün', 'Verstellbarer Bügel · 12 Stk', 'https://www.blabmarket.com/idea/df/26/myassets/products/392/koruyucu-gozluk-laboratuvar-gozlugu-sap-acisi-ayarli-yesil-12-adet-toptan_min.jpeg'],
  ['beyanlab_11.jpg', 'Stuart Transport-Abstrichtupfer', 'Steril, mit Nährmedium · 500 Stk', 'https://www.blabmarket.com/idea/df/26/myassets/products/349/steril-swap-transport-besiyerli-cubuk-fiyat-500_min.jpg'],
  ['beyanlab_12.jpg', 'Urin-Probenbehälter 100ml', 'Steril, pneumatisch · 100 Stk', 'https://www.blabmarket.com/idea/df/26/myassets/products/895/idrar-numune-kabi-100-adet-toptan-fiyat-urine-sample-price_min.jpg'],
  ['beyanlab_13.jpg', 'Sterilisations-Testpapier', 'Autoklavband, Rolle 50m', 'https://www.blabmarket.com/idea/df/26/myassets/products/191/autoclave-tape-jpg-sterilzasyon-test-kagidi-rulo-50-metre-otoklav-sterilizasyonu-icin-kullanilir_min.jpg'],
  ['beyanlab_14.jpg', 'FLY-500 Präzisionswaage', '500g, 0,001g · akkubetrieben', 'https://www.blabmarket.com/idea/df/26/myassets/products/694/1-hassas-terazi-fly-300-1mg-0-001gr_min.jpg'],
  ['beyanlab_15.jpg', 'FLY-5000 Präzisionswaage', '5kg, 0,01g · akkubetrieben', 'https://www.blabmarket.com/idea/df/26/myassets/products/181/1-hassas-terazi-5-kg-kapasiteli-hassas-terazi-0-01g-hassasiyette-terazi-fiyati-harici-kalibrasyonlu-laboratuvar-terazisi-fanuslu-hassas-terazi-fly-5000-harici-kalibrasyonlu-5000g-5-kg-terazi-dijital-led-gosterge_min.jpg'],
  ['beyanlab_16.jpg', 'JZC-TSC-30 Plattformwaage', '30kg, 0,1g · große Wiegeplatte', 'https://www.blabmarket.com/idea/df/26/myassets/products/270/1-30kg-hassas-tarti-terazi-analitik-agirlik-olcer-hassas-tarti-laboratuvar-kullanimi-gida-ilac-olcumu-hassas_min.jpg'],
  ['beyanlab_17.jpg', 'Digitales Rotationsviskosimeter', 'Messbereich 10–2.000.000 mPa·s', 'https://www.blabmarket.com/idea/df/26/myassets/products/182/1-rotasyomel-viskozimetre-genis-aralik-viskozimetre-dijital-viskozimetre-fiyat-dijital-viskozimetre-satis-dijital-viskozimetre-toptan_min.jpg'],
  ['beyanlab_18.jpg', 'Hyamin-1622-Lösung', 'Spectrosol 0,004M · 1 Liter', 'https://www.blabmarket.com/idea/df/26/myassets/products/717/844465_min.jpg'],
  ['beyanlab_19.jpg', 'Silikon-Reparaturband', 'Selbstverschweißend, 25mm × 1,5m', 'https://www.blabmarket.com/idea/df/26/myassets/products/460/silikon-kaynayan-tamir-bandi-25mmx1-5mt-seffaf-bant-yapiskan-olmadigi-icin-sudan-etkilenmez-fiyat-self-fusing-silicone-tape_min.jpg'],
  ['beyanlab_20.jpg', 'O-Rotor für NDJ-8S', 'Adapter für niedrigviskose Proben', 'https://www.blabmarket.com/idea/df/26/myassets/products/389/o-rotor-ndj-8s-viskozimetre-icin-dusuk-viskoziteli-sivi-numune-adaptoru-kendi-ozel-kutusu-fiyat-viscosity-meter-low-viscosity-adapter-designed-for-low-viscosity-measurement-sample_min.jpg'],
];

async function run(list, dir) {
  fs.mkdirSync(`images/catalog/${dir}`, { recursive: true });
  const meta = [];
  for (const [file, name, spec, url] of list) {
    try {
      const buf = await download(url);
      const out = await sharp(buf).resize(400, 400, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
      fs.writeFileSync(`images/catalog/${dir}/${file}`, out);
      meta.push({ file, name, spec });
      console.log(dir, file, name, 'OK');
    } catch (e) {
      console.log(dir, file, name, 'FAILED', e.message);
    }
  }
  fs.writeFileSync(`tmp_work/${dir}_full_meta.json`, JSON.stringify(meta, null, 1));
}

(async () => {
  await run(axis, 'axis');
  await run(biobase, 'biobase');
  await run(az, 'az-instrument');
  await run(radwag, 'radwag');
  await run(beyanlab, 'beyanlab');
})();
