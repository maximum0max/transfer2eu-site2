// Fetch beach + attraction photos for the batch of city guides (Benidorm,
// Calpe, Altea, Denia). Same approach as fetch-guide-photos.mjs: self-host from
// Wikimedia Commons into public/assets/guide/<key>.jpg + append to
// GuidePhotos.data.json. Restaurant cards reuse the existing cuisine images.

import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'assets', 'guide');
const CREDITS = path.join(process.cwd(), 'GuidePhotos.data.json');
const UA = 'Transfer2EU-guide-photos/1.0 (https://www.transfer2eu.com)';

const PLACES = [
  // Benidorm — beaches
  ['ben-levante', 'Playa de Levante Benidorm'],
  ['ben-poniente', 'Playa de Poniente Benidorm'],
  ['ben-malpas', 'Cala Mal Pas Benidorm'],
  ['ben-tioximo', 'Cala Tio Ximo Benidorm'],
  // Benidorm — attractions / photo
  ['ben-balcon', 'Balcón del Mediterráneo Benidorm'],
  ['ben-oldtown', 'Casco antiguo Benidorm'],
  ['ben-church', 'Iglesia San Jaime Benidorm'],
  ['ben-skyline', 'Benidorm skyline'],
  // Calpe — beaches
  ['cal-fossa', 'Playa de la Fossa Calpe'],
  ['cal-arenal', 'Playa Arenal Bol Calpe'],
  ['cal-raco', 'Cala del Racó Calpe'],
  ['cal-puerto', 'Puerto de Calpe'],
  // Calpe — attractions / photo
  ['cal-penon', 'Peñón de Ifach'],
  ['cal-salinas', 'Salinas de Calpe'],
  ['cal-oldtown', 'Casco antiguo Calpe'],
  ['cal-banos', 'Baños de la Reina Calpe'],
  // Altea — beaches
  ['alt-roda', 'Playa de la Roda Altea'],
  ['alt-olla', "Playa L'Olla Altea"],
  ['alt-cap', 'Cap Negret Altea'],
  ['alt-mascarat', 'Mascarat Altea'],
  // Altea — attractions / photo
  ['alt-church', 'Iglesia Nuestra Señora del Consuelo Altea'],
  ['alt-oldtown', 'Casco antiguo Altea'],
  ['alt-plaza', 'Plaza de la Iglesia Altea'],
  ['alt-paseo', 'Altea vista mar'],
  // Denia — beaches
  ['den-marines', 'Playa Les Marines Denia'],
  ['den-rotes', 'Les Rotes Denia'],
  ['den-marineta', 'Marineta Cassiana Denia'],
  ['den-raset', 'Platja del Raset Dénia'],
  // Denia — attractions / photo
  ['den-castillo', 'Castillo de Denia'],
  ['den-puerto', 'Puerto de Denia'],
  ['den-montgo', 'Parque Natural del Montgó'],
  ['den-covatallada', 'Cova Tallada Denia'],
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
  for (const [key, query] of PLACES) {
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
