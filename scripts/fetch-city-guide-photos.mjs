// Fetch beach + attraction photos for the batch of city guides (Benidorm,
// Calpe, Altea, Denia). Same approach as fetch-guide-photos.mjs: self-host from
// Wikimedia Commons into public/assets/guide/<key>.jpg + append to
// GuidePhotos.data.json. Restaurant cards reuse the existing cuisine images.

import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'assets', 'guide');
const CREDITS = path.join(process.cwd(), 'GuidePhotos.data.json');
const UA = 'Transfer2EU-guide-photos/1.0 (https://www.transfer2eu.com)';

const RETRY = [];

const PLACES = [
  // Orihuela (city + costa)
  ['ori-zenia', 'Playa de La Zenia Orihuela'],
  ['ori-campoamor', 'Playa de Campoamor Orihuela'],
  ['ori-catedral', 'Catedral de Orihuela'],
  ['ori-santodomingo', 'Colegio de Santo Domingo Orihuela'],
  ['ori-palmeral', 'Palmeral de Orihuela'],
  // Cartagena
  ['car-cortina', 'Cala Cortina Cartagena'],
  ['car-calblanque', 'Calblanque'],
  ['car-teatro', 'Teatro Romano de Cartagena'],
  ['car-puerto', 'Puerto de Cartagena'],
  ['car-castillo', 'Castillo de la Concepción Cartagena'],
  ['car-modernista', 'Palacio de Aguirre Cartagena'],
  // San Pedro del Pinatar
  ['spp-villananitos', 'Playa Villananitos San Pedro del Pinatar'],
  ['spp-puntica', 'Playa La Puntica Lo Pagán'],
  ['spp-salinas', 'Salinas de San Pedro del Pinatar'],
  ['spp-molino', 'Molino de Quintín San Pedro del Pinatar'],
  // Finestrat
  ['fin-cala', 'Cala de Finestrat'],
  ['fin-puigcampana', 'Puig Campana'],
  ['fin-village', 'Finestrat pueblo'],
  ['fin-plaza', 'Finestrat iglesia'],
  // La Manga del Mar Menor
  ['man-marmenor', 'La Manga del Mar Menor playa'],
  ['man-mediterraneo', 'La Manga Mediterráneo'],
  ['man-cabopalos', 'Faro de Cabo de Palos'],
  // Los Alcázares
  ['lal-playa', 'Playa Los Alcázares Mar Menor'],
  ['lal-torre', 'Torre del Rame Los Alcázares'],
  // Gandía
  ['gan-playa', 'Playa de Gandía'],
  ['gan-palacio', 'Palacio Ducal de Gandía'],
  ['gan-colegiata', 'Colegiata de Gandía'],
  // Alcoy (inland — no beach)
  ['alc-modernista', 'Círculo Industrial Alcoy'],
  ['alc-puente', 'Puente de San Jorge Alcoy'],
  ['alc-oldtown', 'Alcoy centro histórico'],
  ['alc-fontroja', 'Font Roja Alcoy'],
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
