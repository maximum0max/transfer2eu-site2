// Backfill a matching photo for every news post: fetch the source article's
// og:image (the article's own hero photo), self-host it under
// public/assets/news/<slug>.<ext>, and set post.image in News.data.json.
// Re-run safe: posts that already have an image (and a file on disk) are skipped.
//
// Run: node scripts/fetch-news-photos.mjs

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const POSTS = path.join(ROOT, 'News.data.json');
const OUT = path.join(ROOT, 'public', 'assets', 'news');
const UA = 'Mozilla/5.0 (compatible; Transfer2EUNewsBot/1.0; +https://www.transfer2eu.com)';

function metaContent(html, prop) {
  const metas = html.match(/<meta\b[^>]*>/gi) || [];
  for (const m of metas) {
    if (new RegExp(`(?:property|name)\\s*=\\s*["']${prop}["']`, 'i').test(m)) {
      const c = m.match(/content\s*=\s*["']([^"']+)["']/i);
      if (c) return c[1];
    }
  }
  return null;
}

function ogImage(html, baseUrl) {
  const raw = metaContent(html, 'og:image:secure_url')
    || metaContent(html, 'og:image')
    || metaContent(html, 'twitter:image')
    || metaContent(html, 'twitter:image:src');
  if (!raw) return null;
  try { return new URL(raw.replace(/&amp;/g, '&'), baseUrl).href; } catch { return null; }
}

const extFor = (ct) => ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : ct.includes('gif') ? 'gif' : 'jpg';

async function fetchImageFor(post) {
  const r = await fetch(post.url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!r.ok) throw new Error('page HTTP ' + r.status);
  const html = await r.text();
  const imgUrl = ogImage(html, r.url);
  if (!imgUrl) throw new Error('no og:image');
  const ir = await fetch(imgUrl, { headers: { 'User-Agent': UA, Referer: r.url } });
  if (!ir.ok) throw new Error('img HTTP ' + ir.status);
  const ct = (ir.headers.get('content-type') || '').toLowerCase();
  if (!ct.startsWith('image/')) throw new Error('not an image (' + ct + ')');
  const buf = Buffer.from(await ir.arrayBuffer());
  if (buf.length < 3000) throw new Error('image too small');
  if (buf.length > 2_800_000) throw new Error('image too large (' + (buf.length / 1e6).toFixed(1) + ' MB)');
  const ext = extFor(ct);
  await fs.writeFile(path.join(OUT, post.slug + '.' + ext), buf);
  return { path: '/assets/news/' + post.slug + '.' + ext, bytes: buf.length };
}

async function main() {
  const posts = JSON.parse(await fs.readFile(POSTS, 'utf8'));
  await fs.mkdir(OUT, { recursive: true });
  let ok = 0, skip = 0, fail = 0;
  for (const p of posts) {
    if (p.image) { skip++; continue; }
    try {
      const res = await fetchImageFor(p);
      p.image = res.path;
      ok++;
      console.log(`✓ ${p.slug} — ${(res.bytes / 1024).toFixed(0)} KB`);
    } catch (e) {
      fail++;
      console.log(`✗ ${p.slug} — ${e.message}`);
    }
  }
  await fs.writeFile(POSTS, JSON.stringify(posts, null, 2) + '\n', 'utf8');
  console.log(`\nnews images: ${ok} fetched, ${skip} already had one, ${fail} failed`);
}

main().catch((e) => { console.error(e); process.exit(1); });
