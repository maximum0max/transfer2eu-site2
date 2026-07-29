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
  // La Nucia (inland)
  ['lan-ermita', 'Santuario La Nucia'],
  ['lan-captivador', 'Captivador La Nucia'],
  ['lan-casetes', 'La Nucia casco antiguo'],
  ['lan-deportiva', 'Ciutat Esportiva Camilo Cano La Nucia'],
  // La Zenia
  ['zen-cala', 'Playa Cala Bosque La Zenia'],
  ['zen-boulevard', 'Zenia Boulevard'],
  // Playa Flamenca
  ['fla-playa', 'Playa Flamenca Orihuela'],
  ['fla-cala', 'Cala Mosca Orihuela'],
  // Punta Prima
  ['pun-playa', 'Playa de Punta Prima Torrevieja'],
  ['pun-torre', 'Torre vigía Punta Prima'],
  // Cabo Roig
  ['cab-playa', 'Playa de Cabo Roig'],
  ['cab-torre', 'Torre de Cabo Roig'],
  ['cab-cala', 'Cala Capitán Orihuela'],
  // Pilar de la Horadada
  ['pil-higuericas', 'Playa Higuericas Pilar de la Horadada'],
  ['pil-torre', 'Torre de la Horadada'],
  ['pil-milpalmeras', 'Playa Mil Palmeras'],
  // Gran Alacant
  ['gra-dunas', 'Dunas del Carabassí'],
  // Murcia
  ['mur-catedral', 'Catedral de Murcia'],
  ['mur-casino', 'Real Casino de Murcia'],
  ['mur-belluga', 'Plaza Cardenal Belluga Murcia'],
  ['mur-segura', 'Puente Viejo Murcia'],
  ['mur-flores', 'Plaza de las Flores Murcia'],
  // Valencia
  ['val-ciudad', 'Ciudad de las Artes y las Ciencias'],
  ['val-catedral', 'Micalet Catedral de Valencia'],
  ['val-lonja', 'Lonja de la Seda Valencia'],
  ['val-mercado', 'Mercado Central de Valencia interior'],
  ['val-virgen', 'Plaza de la Virgen Valencia'],
  ['val-malvarrosa', 'Playa de la Malvarrosa'],
  ['val-turia', 'Jardín del Turia Valencia'],
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
