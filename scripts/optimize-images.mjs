// Optimizes every self-hosted photo the site ships (guide, news, routes).
//
//   node scripts/optimize-images.mjs
//
// The images were fetched at full resolution (Wikimedia etc.) and the original
// ~65 MB weight is the single biggest payload on the site. This script:
//
//   • guide/  — displayed in ~700 px cards → resize to ≤900 px, quality 72
//   • news/   — displayed up to ~820 px → resize to ≤1200 px, quality 75; the
//               large PNG photos are converted to JPEG (photos compress far
//               better as JPEG) and the references in News.data.json updated
//   • routes/ — the hero photo is the LCP element → keep ≤1400 px, quality 76
//
// All JPEGs are re-encoded progressive, with EXIF/IPTC/XMP metadata stripped
// (no personal data leaks, smaller files). Output is written in place, keeping
// filenames/extensions so every <img src> and prerendered reference stays valid.
// Idempotent: safe to re-run any time.
//
// PNG → JPEG is applied ONLY to the three known news photos (they carry no
// transparency). A transparency check guards it: any image with an alpha
// channel is flattened onto white first, and images that don't shrink keep
// their original format.

import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = (p) => path.join(ROOT, 'public', 'assets', p);

const SETTINGS = {
  guide:  { dir: A('guide'),  maxW: 900,  quality: 72, convertPng: false },
  news:   { dir: A('news'),   maxW: 1200, quality: 75, convertPng: true  },
  routes: { dir: A('routes'), maxW: 1400, quality: 76, convertPng: false },
};

// slug → current PNG filename (photo posts; converted to JPEG below)
const NEWS_PNG = {
  'heat-alert-spain': 'heat-alert-spain.png',
  'spanish-village-for-sale': 'spanish-village-for-sale.png',
  'train-delay-almeria-madrid': 'train-delay-almeria-madrid.png',
};

let totalBefore = 0, totalAfter = 0;
const renamed = {};   // oldImagePath -> newImagePath (for News.data.json)

async function optimizeFile(filePath, cfg) {
  const isPng = filePath.endsWith('.png');
  const targetIsJpeg = cfg.convertPng && isPng;
  const outPath = targetIsJpeg ? filePath.replace(/\.png$/, '.jpg') : filePath;

  let meta;
  try {
    meta = await sharp(filePath).metadata();
  } catch (err) {
    console.warn('  ! skip (unreadable):', path.basename(filePath), err.message);
    return;
  }

  const before = (await fs.stat(filePath)).size;
  totalBefore += before;

  let pipeline = sharp(filePath).rotate().resize({
    width: cfg.maxW,
    withoutEnlargement: true,
    fit: 'inside',
  });

  // Flatten any alpha onto white so JPEG output has no black-garbage areas.
  if (meta.hasAlpha) pipeline = pipeline.flatten({ background: '#ffffff' });

  const opts = {
    quality: cfg.quality,
    mozjpeg: true,
    progressive: true,
  };
  const data = await pipeline.jpeg(opts).toBuffer();
  const after = data.length;

  // Atomic write on Windows: sharp may still hold a handle on the source path,
  // so we write to a temp file in the same directory, then rename over it.
  // Rename also protects against a crash leaving a half-written image.
  const writeAtomic = async (target, bytes) => {
    const tmp = target + '.tmp-' + process.pid;
    await fs.writeFile(tmp, bytes);
    await fs.rename(tmp, target);
  };

  // Don't replace a file with a *larger* one (already optimized / tiny source).
  if (after >= before) {
    if (targetIsJpeg) {
      // Still prefer the (possibly smaller) JPEG only if it actually wins; a PNG
      // that doesn't shrink keeps its format.
      if (after < before * 0.9) {
        await writeAtomic(outPath, data);
        await fs.unlink(filePath);
        renamed[filePath.replace(/\\/g, '/')] = outPath.replace(/\\/g, '/');
        totalAfter += after;
        console.log(`  ↳ ${path.basename(filePath)} → ${path.basename(outPath)}  ${fmt(before)} → ${fmt(after)}`);
      } else {
        totalAfter += before;
        console.log(`  · ${path.basename(filePath)}  kept (PNG smaller than JPEG)`);
      }
    } else {
      totalAfter += before;
      console.log(`  · ${path.basename(filePath)}  kept (already optimal)`);
    }
    return;
  }

  await writeAtomic(outPath, data);
  if (targetIsJpeg) await fs.unlink(filePath);
  totalAfter += after;
  const delta = `${fmt(before)} → ${fmt(after)} (${Math.round((1 - after / before) * 100)}%)`;
  console.log(`  ${targetIsJpeg ? '↳' : '·'} ${path.basename(filePath)}  ${delta}`);
  if (targetIsJpeg) renamed[filePath.replace(/\\/g, '/')] = outPath.replace(/\\/g, '/');
}

function fmt(n) {
  return n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${(n / 1024).toFixed(0)} KB`;
}

async function main() {
  for (const [name, cfg] of Object.entries(SETTINGS)) {
    const files = (await fs.readdir(cfg.dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
    console.log(`\n[${name}] ${files.length} files`);
    for (const f of files.sort()) await optimizeFile(path.join(cfg.dir, f), cfg);
  }

  // Point News.data.json at the converted JPEGs.
  if (Object.keys(renamed).length) {
    const newsPath = path.join(ROOT, 'News.data.json');
    const posts = JSON.parse(await fs.readFile(newsPath, 'utf8'));
    let changed = 0;
    for (const p of posts) {
      const cur = (p.image || '').replace(/^\/assets\/news\//, '');
      const hit = Object.entries(NEWS_PNG).find(([, file]) => file === cur);
      if (hit) {
        const jpg = cur.replace(/\.png$/, '.jpg');
        p.image = '/assets/news/' + jpg;
        changed++;
        console.log(`\n[news] image reference updated: ${cur} → ${jpg} (post: ${p.slug})`);
      }
    }
    if (changed) {
      await fs.writeFile(newsPath, JSON.stringify(posts, null, 2) + '\n', 'utf8');
      console.log(`News.data.json updated (${changed} reference(s)).`);
    }
  }

  console.log(`\nTotal: ${fmt(totalBefore)} → ${fmt(totalAfter)}  (${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`);
}

main().catch((err) => { console.error('Optimization failed:', err); process.exit(1); });
