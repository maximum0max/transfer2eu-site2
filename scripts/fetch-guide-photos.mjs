// One-off fetcher for the Alicante city-guide photos. Same philosophy as
// fetch-route-photos.mjs: self-host from Wikimedia Commons (stable URLs, free
// licence) instead of hotlinking. Downloads a ~1200px JPEG per place into
// public/assets/guide/<key>.jpg and writes credits.json (author + licence).
//
// Run: node scripts/fetch-guide-photos.mjs
// Re-run safe: it overwrites files and the credits file.

import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'assets', 'guide');
const UA = 'Transfer2EU-guide-photos/1.0 (https://www.transfer2eu.com; contact via site)';

// key → Commons search query. Landmarks/beaches resolve to the real place;
// restaurant rows use representative Alicante cuisine/scene imagery.
const PLACES = [
  // Beaches
  ['postiguet', 'Playa del Postiguet Alicante'],
  ['albufereta', 'Playa Albufereta Alicante'],
  ['san-juan', 'Playa de San Juan Alicante'],
  ['cantalar', 'Cabo de las Huertas Alicante'],
  ['muchavista', 'Playa Muchavista Campello'],
  ['arenales', 'Arenales del Sol playa Elche'],
  ['carabassi', 'Carabassí playa'],
  ['santa-pola', 'Playa Santa Pola Levante'],
  ['tabarca', 'Tabarca isla playa'],
  // Food (representative cuisine / venue)
  ['nou-manolin', 'Arroz negro'],
  ['sento', 'Tapas'],
  ['darsena', 'Paella de marisco'],
  ['portal', 'Tapas bar España'],
  ['ereta', 'Alicante vistas ciudad'],
  ['mercado', 'Mercado Central de Abastos Alicante'],
  // Photo spots
  ['castillo', 'Castillo de Santa Bárbara Alicante'],
  ['explanada', 'Explanada de España Alicante'],
  ['santa-cruz', 'Barrio Santa Cruz Alicante'],
  ['puerto', 'Puerto de Alicante marina'],
  ['canalejas', 'Parque de Canalejas Alicante'],
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
    if ((ii.width || 0) < (ii.height || 0)) continue; // prefer landscape
    return { p, ii };
  }
  // fallback: first image with a thumb, even if portrait
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
  const credits = {};
  for (const [key, query] of PLACES) {
    try {
      const pages = await api(query);
      const hit = pick(pages);
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
  await fs.writeFile(path.join(process.cwd(), 'GuidePhotos.data.json'), JSON.stringify(credits, null, 2), 'utf8');
  console.log(`\nSaved ${Object.keys(credits).length}/${PLACES.length} images + credits.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
