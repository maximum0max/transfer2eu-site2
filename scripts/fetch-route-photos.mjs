// Sources one freely-licensed photo per route city from Wikimedia Commons and
// writes it to public/assets/routes/<slug>.jpg, plus a credits file recording
// the licence and author of each.
//
//   node scripts/fetch-route-photos.mjs           # only fetch what's missing
//   node scripts/fetch-route-photos.mjs --force   # refetch everything
//
// Why: the route heroes used to hotlink Unsplash. Half of those URLs had 404'd
// (a hotlink is a photo someone else can delete), and 35 of the 41 routes had
// no photo at all. Self-hosted files can't rot.
//
// Small coastal urbanizations (La Zenia, Cabo Roig, ...) have no Commons
// coverage of their own, so SEARCH maps them to the municipality they belong
// to — an honest picture of the place the passenger is actually going.

import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUT = path.join('public', 'assets', 'routes');
const FORCE = process.argv.includes('--force');
const UA = 'Transfer2EU-photo-fetch/1.0 (https://www.transfer2eu.com; transfers2eu@gmail.com)';

// Commons search terms. Small urbanizations borrow their municipality's photo.
const SEARCH = {
  'taxi-aeroport-alicante':    'Alicante',
  'gran-alacant':              'Santa Pola',
  'san-juan-playa':            'Playa de San Juan Alicante',
  'santa-pola':                'Santa Pola',
  'la-marina':                 'Guardamar del Segura',
  'los-balcones':              'Torrevieja',
  'el-campello':               'El Campello',
  'villajoyosa':               'Villajoyosa',
  'la-nucia':                  'La Nucia',
  'finestrat':                 'Finestrat',
  'taksi-alikante-benidorm':   'Benidorm',
  'taksi-iz-alikante-v-kalpe': 'Calpe',
  'albir':                     'Alfaz del Pi',
  'altea':                     'Altea',
  'playa-flamenca':            'Orihuela Costa',
  'quesada':                   'Rojales',
  'guardamar':                 'Guardamar del Segura',
  'la-zenia':                  'Orihuela Costa',
  'punta-prima':               'Torrevieja',
  'transfer-alicante-torrevieja': 'Torrevieja',
  'cabo-roig':                 'Orihuela Costa',
  'campoverde':                'Pilar de la Horadada',
  'orihuela':                  'Orihuela',
  'mil-palmeras':              'Pilar de la Horadada',
  'pilar-de-la-horadada':      'Pilar de la Horadada',
  'san-pedro':                 'San Pedro del Pinatar',
  'taxi-alicante-murcia':      'Murcia',
  'san-javier':                'San Javier Murcia',
  'los-alcazares':             'Los Alcazares',
  'cartagena':                 'Cartagena Spain',
  'taksi-alikante-la-manga':   'La Manga del Mar Menor',
  'alcoy':                     'Alcoy',
  'moraira':                   'Moraira',
  'denia':                     'Denia',
  'javea':                     'Javea',
  'oliva':                     'Oliva Valencia',
  'gandia':                    'Gandia',
  'taxi-alicante-valencia':    'Valencia Spain',
  'madrid':                    'Madrid',
  'barcelona':                 'Barcelona',
  'malaga':                    'Malaga',
};

// Filenames that are not a usable photograph of the place: symbols, diagrams,
// archive material (a 1920 engraving of Murcia is not what a passenger wants to
// see), interiors and detail shots.
const JUNK = /(map|mapa|flag|bandera|escudo|coat[_ ]of[_ ]arms|location|locator|logo|seal|blason|\.svg|diagram|chart|plan|satellite|topograph|postal|postcard|grabado|litograf|^\d{4}\.|18\d\d|19[0-5]\d|airport|aeropuerto|interior|detalle|museo|panoramio)/i;

// The first search hit is often junk (a shop front, a sports hall). Rank the
// candidates instead: reward filenames that read like a view OF the town, and
// require the town's own name to appear where we have a good term for it.
const GOOD = /(vista|view|panor|skyline|playa|beach|platja|puerto|port|marina|paseo|passeig|casco|centro|plaza|placa|castell|castillo|catedral|cathedral|ayuntamiento|iglesia|esglesia|faro|cala|bahia|coast|aerial)/i;

// Where search kept returning something that is not the town (Murcia -> a beach
// in La Unión, San Javier -> the airport apron, Alcoy -> the sea, though Alcoy
// is inland), the file is pinned by name. Reviewed by eye on a contact sheet.
const EXPLICIT = {
  'taxi-alicante-murcia': 'File:Catedral de Murcia desde la Plaza del Cardenal Belluga.jpg',
  'san-javier':           'File:Mar Menor desde el paseo marítimo de Santiago de la Ribera.jpg',
  'alcoy':                'File:Alcoi desde El Puig - panoramio.jpg',
  'cartagena':            'File:Puerto de Cartagena 2021.jpg',
  'el-campello':          'File:® S.D. EL CAMPELLO VISTAS DESDE LA ILLETA - panoramio (2).jpg',
  // Ciudad Quesada has no Commons coverage and searching for it returns Ciudad
  // Quesada in COSTA RICA. Use the landmark bridge of Rojales, its municipality.
  'quesada':              'File:Puente de Carlos III de Rojales.jpg',
  // The three Horadada urbanizations share the view of the tower they're named
  // after — the actual landmark of that stretch of coast.
  'pilar-de-la-horadada': 'File:Vista de la Torre de la Horadada desde la rampa a la playa.jpg',
  'campoverde':           'File:Vista de la Torre de la Horadada desde la rampa a la playa.jpg',
  'mil-palmeras':         'File:Vista de la Torre de la Horadada desde la rampa a la playa.jpg',
};

// Per-slug preference: the picked file must match this, if any candidate does.
const PREFER = {
  'el-campello':            /campello/i,
  'albir':                  /albir/i,
  'quesada':                /rojales|quesada/i,
  'taxi-alicante-murcia':   /murcia/i,
  'san-javier':             /ribera|mar menor|javier/i,
  'madrid':                 /madrid/i,
  'malaga':                 /malaga|málaga/i,
  'alcoy':                  /alcoy|alcoi/i,
  'denia':                  /denia|dénia/i,
  'cartagena':              /cartagena/i,
  'guardamar':              /guardamar/i,
  'la-marina':              /guardamar|marina/i,
  'campoverde':             /horadada/i,
  'mil-palmeras':           /horadada|palmeras/i,
  'pilar-de-la-horadada':   /horadada/i,
};

const api = async (params) => {
  const url = 'https://commons.wikimedia.org/w/api.php?origin=*&format=json&' + new URLSearchParams(params);
  const r = await fetch(url, { headers: { 'user-agent': UA } });
  if (!r.ok) throw new Error(`commons ${r.status}`);
  return r.json();
};

// Returns candidate images for a search term, best first.
async function candidates(term, prefer) {
  const search = await api({
    action: 'query', generator: 'search',
    gsrsearch: `${term} filetype:bitmap`, gsrnamespace: '6', gsrlimit: '50',
    prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata',
  });
  const pages = Object.values(search?.query?.pages || {});
  const viable = pages
    .map((p) => ({ title: p.title, info: p.imageinfo?.[0], index: p.index ?? 99 }))
    .filter(({ title, info }) => {
      if (!info || JUNK.test(title)) return false;
      if (!/^image\/(jpeg|png)$/.test(info.mime)) return false;
      if (info.width < 1100) return false;
      const ratio = info.width / info.height;
      return ratio >= 1.2 && ratio <= 2.4; // landscape, hero-shaped
    });

  const scored = viable.map((c) => {
    let score = 0;
    if (prefer && prefer.test(c.title)) score += 100; // it must be OF this town
    if (GOOD.test(c.title)) score += 40;              // ...and look like a view
    score += Math.max(0, 20 - c.index);               // search rank as tiebreak
    return { ...c, score };
  });

  // If we have a name preference, never fall back to a photo of somewhere else.
  const named = prefer ? scored.filter((c) => prefer.test(c.title)) : [];
  const pool = named.length ? named : scored;
  return pool.sort((a, b) => b.score - a.score);
}

const meta = (info, key) => info.extmetadata?.[key]?.value?.replace(/<[^>]*>/g, '').trim() || '';

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  // Read the routes straight out of the data layer so this can't drift from it.
  const src = await fs.readFile('BrandData.jsx', 'utf8');
  const routes = [...src.matchAll(/\{\s*slug:\s*'([^']+)',\s*city:\s*'([^']+)',\s*ru:\s*'([^']+)'/g)]
    .map((m) => ({ slug: m[1], city: m[2], ru: m[3] }));
  if (!routes.length) throw new Error('no routes parsed from BrandData.jsx');
  // Credits live at the repo root, not in public/: the app imports them to
  // render the attribution these licences require, and Vite doesn't process
  // anything under public/.
  const creditsPath = 'RoutePhotos.data.json';
  let credits = {};
  try { credits = JSON.parse(await fs.readFile(creditsPath, 'utf8')); } catch { /* first run */ }

  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  const only = onlyArg ? new Set(onlyArg.slice(7).split(',')) : null;

  for (const r of routes) {
    if (only && !only.has(r.slug)) continue;
    const dest = path.join(OUT, `${r.slug}.jpg`);
    if (!FORCE && !only && await fs.stat(dest).then(() => true).catch(() => false)) {
      console.log(`skip   ${r.slug} (already have it)`);
      continue;
    }
    const term = SEARCH[r.slug] || r.city;
    try {
      let title = EXPLICIT[r.slug];
      if (!title) {
        const list = await candidates(term, PREFER[r.slug]);
        if (!list.length) { console.log(`MISS   ${r.slug} — no candidate for "${term}"`); continue; }
        title = list[0].title;
      }
      // Ask Commons for a 1600px-wide rendering rather than the full original.
      const thumb = await api({
        action: 'query', titles: title, prop: 'imageinfo',
        iiprop: 'url|extmetadata', iiurlwidth: '1600',
      });
      const page = Object.values(thumb.query.pages)[0];
      const ii = page.imageinfo[0];
      const bin = await fetch(ii.thumburl || ii.url, { headers: { 'user-agent': UA } });
      if (!bin.ok) { console.log(`FAIL   ${r.slug} — download ${bin.status}`); continue; }
      await fs.writeFile(dest, Buffer.from(await bin.arrayBuffer()));

      credits[r.slug] = {
        city: r.city,
        file: title.replace(/^File:/, ''),
        author: meta(ii, 'Artist') || 'Unknown',
        licence: meta(ii, 'LicenseShortName') || 'Unknown',
        licenceUrl: meta(ii, 'LicenseUrl') || '',
        source: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`,
      };
      console.log(`ok     ${r.slug.padEnd(30)} ${credits[r.slug].licence.padEnd(14)} ${title.slice(5, 60)}`);
    } catch (e) {
      console.log(`ERROR  ${r.slug} — ${e.message}`);
    }
  }

  await fs.writeFile(creditsPath, JSON.stringify(credits, null, 2));
  console.log(`\n${Object.keys(credits).length} photos, credits -> ${creditsPath}`);
}

main();
