// Unified, brand-agnostic catalog data — grouped by device category (like blabmarket.com)
// icon: svg path key (reuse existing icon shapes from the site)
const ICONS = {
  thermo: '<path d="M14 4a2 2 0 1 0-4 0v9.54a4 4 0 1 0 4 0V4z"/><line x1="12" y1="7" x2="12" y2="14"/>',
  ph: '<path d="M12 2.69 17.66 8.36a8 8 0 1 1-11.31 0z"/>',
  scope: '<circle cx="12" cy="12" r="8"/><line x1="12" y1="4" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="20"/><line x1="4" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="20" y2="12"/>',
  oven: '<rect x="4" y="3" width="16" height="18" rx="2"/><rect x="7" y="7" width="10" height="8" rx="1"/><line x1="9" y1="18" x2="9" y2="18"/><line x1="13" y1="18" x2="15" y2="18"/>',
  stirrer: '<rect x="4" y="14" width="16" height="6" rx="1"/><path d="M9 14V8a3 3 0 0 1 6 0v6"/>',
  misc: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
};

const categories = [
  {
    slug: 'mikroskope',
    label: 'Mikroskope',
    icon: 'scope',
    items: [
      { name: 'Optika B-292', brand: 'Optika', spec: 'Biologisches Labormikroskop · IOS-Optik, X-LED³', img: 'images/optika_spotlight1.jpg' },
      { name: 'Optika SZP-10e', brand: 'Optika', spec: 'CMO-Stereomikroskop · Zoom 10:1, Qualitätskontrolle', img: 'images/optika_spotlight2.jpg' },
      { name: 'Optika B-190 Serie', brand: 'Optika', spec: 'Biologisches Mikroskop · bis 1000x, Mono/Bino/Trino', img: 'images/catalog/optika_01.jpg' },
      { name: 'Optika B-150 Serie', brand: 'Optika', spec: 'Biologisches Mikroskop (Schule) · 40x–1000x', img: 'images/catalog/optika_02.jpg' },
      { name: 'Optika B-60 Serie', brand: 'Optika', spec: 'Biologisches Mikroskop (kabellos) · LED, akkubetrieben', img: 'images/catalog/optika_03.jpg' },
      { name: 'Optika ECOVISION Serie', brand: 'Optika', spec: 'Einstiegsmikroskop · Monokular, achromatisch, LED', img: 'images/catalog/optika_04.jpg' },
      { name: 'Optika B-380 Serie', brand: 'Optika', spec: 'Labormikroskop · Hell-/Dunkelfeld, Phasenkontrast', img: 'images/catalog/optika_05.jpg' },
      { name: 'Optika B-510 Serie', brand: 'Optika', spec: 'Labormikroskop (gehoben) · Trinokular, IOS-Optik', img: 'images/catalog/optika_06.jpg' },
      { name: 'Optika B-810 / B-1000 Serie', brand: 'Optika', spec: 'Forschungsmikroskop · Trinokular, 4x–100x', img: 'images/catalog/optika_07.jpg' },
      { name: 'Optika POL Serie', brand: 'Optika', spec: 'Polarisationsmikroskop · drehbarer Tisch', img: 'images/catalog/optika_08.jpg' },
      { name: 'Optika FLUO Serie', brand: 'Optika', spec: 'Fluoreszenzmikroskop · LED/HBO, FITC/GFP-Filter', img: 'images/catalog/optika_09.jpg' },
      { name: 'Optika IM-300 Serie', brand: 'Optika', spec: 'Inversmikroskop · Trinokular mit Fotoports', img: 'images/catalog/optika_10.jpg' },
      { name: 'Optika IM-5 Serie', brand: 'Optika', spec: 'Inversmikroskop · Trinokular, X-LED8', img: 'images/catalog/optika_11.jpg' },
      { name: 'Optika IM-7', brand: 'Optika', spec: 'Inversmikroskop (kompakt) · Trinokular 45°', img: 'images/catalog/optika_12.jpg' },
      { name: 'Optika MET Serie', brand: 'Optika', spec: 'Metallurgisches Mikroskop · Auflicht, X-LED³', img: 'images/catalog/optika_13.jpg' },
      { name: 'Optika SZ Serie', brand: 'Optika', spec: 'Stereomikroskop · Zoom 6,72:1 / 8,46:1', img: 'images/catalog/optika_14.jpg' },
      { name: 'Optika SLX Serie', brand: 'Optika', spec: 'Stereomikroskop · Zoom 6,43:1, 7x–45x', img: 'images/catalog/optika_15.jpg' },
      { name: 'Optika SZR-180', brand: 'Optika', spec: 'Stereomikroskop (Hochleistung) · Zoom 18:1', img: 'images/catalog/optika_16.jpg' },
      { name: 'Optika OPTIGEM-10/20', brand: 'Optika', spec: 'Gemmologie-Mikroskop · Hell-/Dunkelfeld', img: 'images/catalog/optika_17.jpg' },
      { name: 'Optika SZP-6 / 8 / 10', brand: 'Optika', spec: 'Stereomikroskop CMO (Industrie) · 80mm Arbeitsabstand', img: 'images/catalog/optika_18.jpg' },
      { name: 'Optika ST-155 / ST-156', brand: 'Optika', spec: 'Stative (SZP-Serie) · LED Durchlicht/Auflicht', img: 'images/catalog/optika_19.jpg' }
    ]
  },
  {
    slug: 'ph-ec',
    label: 'pH, Leitfähigkeit & Wasseranalyse',
    icon: 'ph',
    items: [
      { name: 'Milwaukee MW806 MAX', brand: 'Milwaukee', spec: 'Multiparameter-Handmessgerät · pH/EC/TDS', img: 'images/milwaukee_spotlight1.jpg' },
      { name: 'Milwaukee MW600 PRO', brand: 'Milwaukee', spec: 'Sauerstoffmessgerät · Gelöstsauerstoff', img: 'images/milwaukee_spotlight2.jpg' },
      { name: 'Milwaukee PH51', brand: 'Milwaukee', spec: 'Wasserdichter pH-Tester · IP65, austauschbare Sonde', img: 'images/catalog/milwaukee_01.jpg' },
      { name: 'Milwaukee MW180 MAX', brand: 'Milwaukee', spec: 'Tisch-Multiparameter · pH/ORP/EC/TDS/NaCl/Temp', img: 'images/catalog/milwaukee_03.jpg' },
      { name: 'Milwaukee MW306 MAX', brand: 'Milwaukee', spec: 'Tragbares Leitfähigkeitsmessgerät · IP67', img: 'images/catalog/milwaukee_04.jpg' },
      { name: 'Milwaukee MC510 PRO', brand: 'Milwaukee', spec: 'Redox-Controller · Digitale ORP-Prozesssteuerung', img: 'images/catalog/milwaukee_05.jpg' },
      { name: 'Milwaukee MC125 PRO', brand: 'Milwaukee', spec: 'pH/ORP-Controller · 2-in-1 digitaler Controller', img: 'images/catalog/milwaukee_06.jpg' },
      { name: 'Milwaukee MW151 MAX', brand: 'Milwaukee', spec: 'Tisch-pH/ORP-Messgerät · ±0,002 pH', img: 'images/catalog/milwaukee_07.jpg' },
      { name: 'Milwaukee MW402 PRO', brand: 'Milwaukee', spec: 'TDS-Messgerät · High-Range TDS', img: 'images/catalog/milwaukee_09.jpg' },
      { name: 'Milwaukee MW801 / MW802 PRO', brand: 'Milwaukee', spec: 'Kombi-Tester · pH/EC/TDS 3-in-1, ATC', img: 'images/catalog/milwaukee_10.jpg' },
      { name: 'Milwaukee CD97', brand: 'Milwaukee', spec: 'TDS-Pocket-Pen · Low-Range, Taschenformat', img: 'images/catalog/milwaukee_11.jpg' },
      { name: 'Milwaukee MW150', brand: 'Milwaukee', spec: 'Tisch-pH-Messgerät · 3-Punkt-Kalibrierung', img: 'images/catalog/milwaukee_12.jpg' },
      { name: 'Milwaukee MW106', brand: 'Milwaukee', spec: 'Tragbares pH-Messgerät · pH/ORP/Temp', img: 'images/catalog/milwaukee_13.jpg' },
      { name: 'Milwaukee MW804', brand: 'Milwaukee', spec: 'Pocket-Kombi-Tester · pH/EC/TDS/Temp', img: 'images/catalog/milwaukee_14.jpg' },
      { name: 'Milwaukee PH55', brand: 'Milwaukee', spec: 'Wasserdichter pH-Tester · Kompakt, ATC', img: 'images/catalog/milwaukee_15.jpg' },
      { name: 'Milwaukee MW301 PRO', brand: 'Milwaukee', spec: 'Leitfähigkeitsmessgerät · 0–1999 µS/cm', img: 'images/catalog/milwaukee_16.jpg' },
      { name: 'Milwaukee MW101', brand: 'Milwaukee', spec: 'Tragbares pH-Messgerät · Labor-Grade', img: 'images/catalog/milwaukee_17.jpg' },
      { name: 'Milwaukee EC60 PRO', brand: 'Milwaukee', spec: 'Wasserdichter EC/TDS-Tester · 3-in-1', img: 'images/catalog/milwaukee_18.jpg' },
      { name: 'Milwaukee CD611', brand: 'Milwaukee', spec: 'Leitfähigkeits-Pen · Conductivity &amp; TDS', img: 'images/catalog/milwaukee_19.jpg' },
      { name: 'Milwaukee C65 / C66', brand: 'Milwaukee', spec: 'pH-Pocket-Pen · Digitaler pH-Stift', img: 'images/catalog/milwaukee_20.jpg' },
      { name: 'Milwaukee pH600', brand: 'Milwaukee', spec: 'pH-Pocket-Pen · Wirtschaftliches Einstiegsmodell', img: 'images/catalog/milwaukee_21.jpg' },
      { name: 'Milwaukee MW102 PRO+', brand: 'Milwaukee', spec: 'Tragbares pH-Messgerät · pH/Temp 2-in-1', img: 'images/catalog/milwaukee_22.jpg' },
      { name: 'Milwaukee MW500 PRO', brand: 'Milwaukee', spec: 'ORP-Messgerät · Redoxpotential, Platin-Elektrode', img: 'images/catalog/milwaukee_23.jpg' }
    ]
  },
  {
    slug: 'refraktometer',
    label: 'Refraktometer',
    icon: 'ph',
    items: [
      { name: 'Atago PAL-3', brand: 'Atago', spec: 'Digitales Refraktometer · Brix 0,0–93,0 %', img: 'images/atago_spotlight1.jpg' },
      { name: 'Atago PAL-RI', brand: 'Atago', spec: 'Pocket-Refraktometer · Brechungsindex', img: 'images/atago_spotlight2.jpg' },
      { name: 'Atago PAL-Salt', brand: 'Atago', spec: 'Digitales Salzmessgerät · ca. 8.000 Messungen/Satz', img: 'images/catalog/atago_01.jpg' },
      { name: 'Atago PAL-39S', brand: 'Atago', spec: 'Refraktometer (Spezial) · Wasserstoffperoxid', img: 'images/catalog/atago_02.jpg' },
      { name: 'Atago Master-100H', brand: 'Atago', spec: 'Analoges Handrefraktometer · Brix 60–100 %', img: 'images/catalog/atago_03.jpg' },
      { name: 'Atago Master-53M', brand: 'Atago', spec: 'Analoges Handrefraktometer · Metallgehäuse', img: 'images/catalog/atago_04.jpg' },
      { name: 'Atago PAL-1', brand: 'Atago', spec: 'Pocket-Refraktometer · Brix 0–53 %, Einstieg', img: 'images/catalog/atago_05.jpg' },
      { name: 'Atago PAL-α', brand: 'Atago', spec: 'Pocket-Refraktometer · Brix 0–85 %', img: 'images/catalog/atago_06.jpg' },
      { name: 'Atago PAL SALT Mohr', brand: 'Atago', spec: 'Digitales Salzmessgerät · 0–10,0 %', img: 'images/catalog/atago_07.png' },
      { name: 'Atago PAL-Soil', brand: 'Atago', spec: 'Digitaler Bodenfeuchtemesser', img: 'images/catalog/atago_08.jpg' },
      { name: 'Atago PEN-PRO', brand: 'Atago', spec: 'Pen-/Tauch-Refraktometer · IP67', img: 'images/catalog/atago_09.jpg' },
      { name: 'Atago PAL-Moisture', brand: 'Atago', spec: 'Feuchte-Refraktometer · Dual-Skala', img: 'images/catalog/atago_10.jpg' },
      { name: 'Atago PAL-BX|SALT(+5)', brand: 'Atago', spec: 'Brix-Salz-Hybridmessgerät', img: 'images/catalog/atago_11.jpg' },
      { name: 'Atago PAL-80S', brand: 'Atago', spec: 'Refraktometer (Wein/Most)', img: 'images/catalog/atago_12.jpg' },
      { name: 'Atago Master-20M / 50H', brand: 'Atago', spec: 'Analoges Handrefraktometer · hitzebeständig', img: 'images/catalog/atago_13.jpg' },
      { name: 'Atago PAL-91S / 88S', brand: 'Atago', spec: 'Refraktometer (Kühlmittel)', img: 'images/catalog/atago_14.jpg' },
      { name: 'Atago PAL-37S', brand: 'Atago', spec: 'Refraktometer (Spezial) · Isopropylalkohol', img: 'images/catalog/atago_15.jpg' },
      { name: 'Atago Master-M', brand: 'Atago', spec: 'Analoges Handrefraktometer · Basismodell', img: 'images/catalog/atago_16.jpg' },
      { name: 'Atago PAL-Coffee', brand: 'Atago', spec: 'Refraktometer (Kaffee) · Brix 0,01 %', img: 'images/catalog/atago_17.jpg' },
      { name: 'Atago PAL-Dried Fruit', brand: 'Atago', spec: 'Feuchte-Refraktometer für Trockenfrüchte', img: 'images/catalog/atago_18.jpg' },
      { name: 'Atago PAL-2', brand: 'Atago', spec: 'Refraktometer (Hochkonzentration) · Brix 45–93 %', img: 'images/catalog/atago_19.jpg' },
      { name: 'Atago PAL-pH Plus', brand: 'Atago', spec: 'Digitales pH-Messgerät · Pocket-Format', img: 'images/catalog/atago_20.png' }
    ]
  },
  {
    slug: 'oefen',
    label: 'Trockenschränke, Öfen & Wasserbäder',
    icon: 'oven',
    items: [
      { name: 'Thermomac FDO Trockenschrank', brand: 'Thermomac', spec: 'Umluft-Trockenschrank · Flaggschiff, bis 300 °C', img: 'images/fdo_product.webp', link: '#produkte' },
      { name: 'Thermomac VO91 / VO52', brand: 'Thermomac', spec: 'Vakuumtrockenschrank · 91L / 52L', img: 'images/catalog/thermomac_05.jpg' },
      { name: 'Thermomac ICT210', brand: 'Thermomac', spec: 'Inkubator, 210L · Konstanttemperatur', img: 'images/catalog/thermomac_08.jpg' },
      { name: 'Thermomac SDO65 / SDO45', brand: 'Thermomac', spec: 'Trockensterilisator · 65L / 45L, bis 300 °C', img: 'images/catalog/thermomac_13.jpg' },
      { name: 'Thermomac DO65 / DO45', brand: 'Thermomac', spec: 'Labor-Trockenschrank · feste Temperatur', img: 'images/catalog/thermomac_14.jpg' },
      { name: 'Thermomac WB22 / WB6 / WB15', brand: 'Thermomac', spec: 'Digitales Wasserbad · 6–22 Liter', img: 'images/thermomac_spotlight2.jpg' }
    ]
  },
  {
    slug: 'ruehrer',
    label: 'Rührer & Heizpilze',
    icon: 'stirrer',
    items: [
      { name: 'Thermomac TM12', brand: 'Thermomac', spec: 'Heizrührer, 2L · Einstiegsmodell', img: 'images/catalog/thermomac_01.jpg' },
      { name: 'Thermomac TM19D', brand: 'Thermomac', spec: 'Digitaler Heizrührer, 5L · PID-Regler', img: 'images/catalog/thermomac_02.jpg' },
      { name: 'Thermomac TM14D', brand: 'Thermomac', spec: 'Digitaler Heizrührer, 10L · Rohrblock-Optionen', img: 'images/catalog/thermomac_03.jpg' },
      { name: 'Thermomac TM18D', brand: 'Thermomac', spec: 'Digitaler Heizrührer, 20L · Großvolumig', img: 'images/catalog/thermomac_04.jpg' },
      { name: 'Thermomac HMS002', brand: 'Thermomac', spec: 'Heizpilz mit Rührer, 2L', img: 'images/catalog/thermomac_06.jpg' },
      { name: 'Thermomac HMS650', brand: 'Thermomac', spec: 'Multi-Heizpilz, 6×500ml', img: 'images/catalog/thermomac_07.jpg' },
      { name: 'Thermomac TM-II-7C', brand: 'Thermomac', spec: 'Mechanischer Rührer, 40L', img: 'images/catalog/thermomac_11.jpg' },
      { name: 'Thermomac HM250 / HM500 / HM425x', brand: 'Thermomac', spec: 'Heizpilz (Einzel/Mehrfach) · versch. Volumina', img: 'images/catalog/thermomac_15.jpg' }
    ]
  },
  {
    slug: 'sonstige',
    label: 'Spektrometer, Thermometer & Zubehör',
    icon: 'misc',
    items: [
      { name: 'LUMISO Expert Photometer', brand: 'LUMISO', spec: 'Multiparameter-Photometer · Wasseranalyse', img: 'images/lumiso_image1.webp', link: '#produkte' },
      { name: 'Milwaukee TH310', brand: 'Milwaukee', spec: 'Digitales Stab-Thermometer · Edelstahlsonde', img: 'images/catalog/milwaukee_08.jpg' },
      { name: 'Thermomac TMP20', brand: 'Thermomac', spec: 'Schmelzpunkt-Bestimmungsgerät', img: 'images/catalog/thermomac_09.jpg' },
      { name: 'Thermomac DT206D / DT201', brand: 'Thermomac', spec: 'Dissolutionstester · 6-fach bzw. Einzelplatz', img: 'images/catalog/thermomac_10.jpg' },
      { name: 'Thermomac VP91', brand: 'Thermomac', spec: 'Vakuumpumpe, zweistufig', img: 'images/catalog/thermomac_12.jpg' },
      { name: 'Milwaukee MA852', brand: 'Milwaukee', spec: 'Ersatzsonde · pH/EC/TDS/Temp-Kombisonde', img: 'images/catalog/milwaukee_02.jpg' }
    ]
  }
];

module.exports = { categories, ICONS };
