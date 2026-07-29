// Fetch beach + attraction photos for the batch of city guides (Benidorm,
// Calpe, Altea, Denia). Same approach as fetch-guide-photos.mjs: self-host from
// Wikimedia Commons into public/assets/guide/<key>.jpg + append to
// GuidePhotos.data.json. Restaurant cards reuse the existing cuisine images.

import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'assets', 'guide');
const CREDITS = path.join(process.cwd(), 'GuidePhotos.data.json');
const UA = 'Transfer2EU-guide-photos/1.0 (https://www.transfer2eu.com)';

const RETRY = [
  ['vil-casas', 'Casas de colores La Vila Joiosa'],
  ['vil-puerto', 'Puerto La Vila Joiosa'],
  ['vil-oldtown', 'Vila Joiosa fachadas'],
  ['jav-oldtown', 'Xàbia centro histórico'],
  ['mor-portet', 'El Portet Moraira'],
  ['gua-viveros', 'Playa de los Viveros Guardamar'],
  ['gua-dunas', 'Dunas de Guardamar'],
  ['sap-granplaya', 'Playa de Levante Santa Pola'],
];

const PLACES = [
  // Jávea
  ['jav-arenal', 'Playa del Arenal Jávea'],
  ['jav-granadella', 'Cala Granadella Jávea'],
  ['jav-portitxol', 'Cala Portitxol Jávea'],
  ['jav-cabonao', 'Cabo de la Nao Jávea'],
  ['jav-faro', 'Faro Cabo San Antonio Jávea'],
  ['jav-oldtown', 'Casco antiguo Jávea'],
  ['jav-church', 'Iglesia San Bartolomé Jávea'],
  // Torrevieja
  ['tor-cura', 'Playa del Cura Torrevieja'],
  ['tor-locos', 'Playa de los Locos Torrevieja'],
  ['tor-lamata', 'Playa La Mata Torrevieja'],
  ['tor-laguna', 'Laguna rosa Torrevieja'],
  ['tor-puerto', 'Puerto de Torrevieja'],
  ['tor-eras', 'Eras de la Sal Torrevieja'],
  ['tor-paseo', 'Paseo Juan Aparicio Torrevieja'],
  // Villajoyosa
  ['vil-centro', 'Playa Centro Villajoyosa'],
  ['vil-paradis', 'Playa El Paradís Villajoyosa'],
  ['vil-casas', 'Casas de colores Villajoyosa'],
  ['vil-oldtown', 'Villajoyosa fachadas colores'],
  ['vil-iglesia', 'Iglesia de la Asunción Villajoyosa'],
  ['vil-puerto', 'Puerto de Villajoyosa'],
  // El Campello
  ['cam-carrermar', 'Playa Carrer la Mar Campello'],
  ['cam-illeta', 'Illeta dels Banyets Campello'],
  ['cam-torre', 'Torre de la Illeta Campello'],
  ['cam-puerto', 'Puerto de El Campello'],
  // Albir
  ['alb-playa', 'Playa del Albir'],
  ['alb-faro', 'Faro del Albir'],
  ['alb-serra', 'Serra Gelada Albir'],
  ['alb-villa', 'Villa Romana Albir'],
  // Moraira
  ['mor-ampolla', 'Playa Ampolla Moraira'],
  ['mor-portet', 'Cala del Portet Moraira'],
  ['mor-castillo', 'Castillo de Moraira'],
  ['mor-capdor', "Torre del Cap d'Or Moraira"],
  ['mor-puerto', 'Puerto de Moraira'],
  // Guardamar del Segura
  ['gua-centro', 'Playa Guardamar del Segura'],
  ['gua-viveros', 'Playa Viveros Guardamar'],
  ['gua-dunas', 'Dunas Guardamar del Segura'],
  ['gua-castillo', 'Castillo Guardamar del Segura'],
  // Santa Pola
  ['sap-granplaya', 'Gran Playa Santa Pola'],
  ['sap-tamarit', 'Playa Tamarit Santa Pola'],
  ['sap-castillo', 'Castillo de Santa Pola'],
  ['sap-salinas', 'Salinas de Santa Pola'],
  ['sap-faro', 'Faro de Santa Pola'],
];

const stripHtml = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const badTitle = (t) => /\.svg|logo|icon|\bmap\b|mapa|pl[àa]nol|plano|coat of arms|escudo|diagram|locator|aerial|aérea/i.test(t);

async function api(query) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json'
    + '&generator=search&gsrnamespace=6&gsrlimit=12'
    + '&gsrsearch=' + encodeURIComponent(query)
    + '&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1200';
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error('API ' + r.status);
  const j = await r.json();
  const pages = j.query && j.query.pages ? Object.values(j.query.pages) : [];
  pages.sort((a, b) => (a.index || 0) - (b.index || 0));
  return pages;
}

function pick(pages) {
  for (const p of pages) {
    const ii = p.imageinfo && p.imageinfo[0];
    if (!ii) continue;
    if (!/^image\/(jpeg|png)$/.test(ii.mime || '')) continue;
    if (badTitle(p.title || '')) continue;
    if ((ii.width || 0) < 800) continue;
    if ((ii.width || 0) < (ii.height || 0)) continue;
    return { p, ii };
  }
  for (const p of pages) {
    const ii = p.imageinfo && p.imageinfo[0];
    if (ii && ii.thumburl && /^image\/(jpeg|png)$/.test(ii.mime || '') && !badTitle(p.title || '')) return { p, ii };
  }
  return null;
}

async function download(url, dest) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error('DL ' + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.writeFile(dest, buf);
  return buf.length;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  let credits = {};
  try { credits = JSON.parse(await fs.readFile(CREDITS, 'utf8')); } catch { /* start fresh */ }
  for (const [key, query] of [...PLACES, ...RETRY]) {
    try {
      const hit = pick(await api(query));
      if (!hit) { console.log(`✗ ${key}: no image for "${query}"`); continue; }
      const { p, ii } = hit;
      const bytes = await download(ii.thumburl, path.join(OUT, key + '.jpg'));
      const meta = ii.extmetadata || {};
      credits[key] = {
        title: (p.title || '').replace(/^File:/, ''),
        author: stripHtml(meta.Artist && meta.Artist.value) || 'Wikimedia Commons',
        license: stripHtml(meta.LicenseShortName && meta.LicenseShortName.value) || '',
        source: ii.descriptionurl || '',
      };
      console.log(`✓ ${key}: ${(bytes / 1024).toFixed(0)} KB — ${credits[key].title}`);
    } catch (e) {
      console.log(`✗ ${key}: ${e.message}`);
    }
  }
  await fs.writeFile(CREDITS, JSON.stringify(credits, null, 2) + '\n', 'utf8');
  console.log('\nDone. credits updated.');
}

main().catch((e) => { console.error(e); process.exit(1); });
