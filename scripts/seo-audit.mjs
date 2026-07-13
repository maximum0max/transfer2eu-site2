// Live SEO / indexability audit. Run against the deployed site:
//
//   node scripts/seo-audit.mjs                    # https://www.transfer2eu.com
//   node scripts/seo-audit.mjs http://localhost:4173
//
// It asserts the things Google Search Console actually complains about:
// wrong status codes, soft-404s, canonical mismatches, duplicate titles,
// noindex pages in the sitemap, broken structured data, dead legacy URLs.
// Exit code is non-zero if anything fails, so it can gate a deploy.

const SITE = (process.argv[2] || 'https://www.transfer2eu.com').replace(/\/$/, '');

const fails = [];
const warns = [];
const fail = (url, msg) => fails.push(`${url} — ${msg}`);
const warn = (url, msg) => warns.push(`${url} — ${msg}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The audit fires a few hundred requests; a transient connect timeout is a flaky
// audit, not a site defect, so retry before believing it.
const get = async (url, redirect = 'manual') => {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { redirect, headers: { 'user-agent': 'seo-audit' } });
      const body = res.status < 400 || res.status === 404 ? await res.text() : '';
      return { status: res.status, location: res.headers.get('location'), body };
    } catch (e) {
      lastErr = e;
      await sleep(1000 * (attempt + 1));
    }
  }
  throw new Error(`${url}: ${lastErr.message}`);
};

const tag = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };
const title = (h) => tag(h, /<title>([\s\S]*?)<\/title>/);
const desc = (h) => tag(h, /<meta name="description" content="([^"]*)"/);
const robots = (h) => tag(h, /<meta name="robots" content="([^"]*)"/);
const canonical = (h) => tag(h, /<link rel="canonical" href="([^"]*)"/);
const h1s = (h) => [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]*>/g, '').trim());
const ldBlocks = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);

async function main() {
  console.log(`Auditing ${SITE}\n`);

  // --- sitemap ---------------------------------------------------------------
  const sm = await get(`${SITE}/sitemap.xml`);
  if (sm.status !== 200) { fail('/sitemap.xml', `status ${sm.status}`); console.log(fails.join('\n')); process.exit(1); }
  const urls = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urls.length) fail('/sitemap.xml', 'no <loc> entries');
  console.log(`sitemap: ${urls.length} urls`);

  for (const u of urls) {
    if (!u.startsWith(SITE)) fail(u, `sitemap URL is on a different host than ${SITE}`);
  }

  // --- robots ----------------------------------------------------------------
  const rb = await get(`${SITE}/robots.txt`);
  if (rb.status !== 200) fail('/robots.txt', `status ${rb.status}`);
  else if (!rb.body.includes('sitemap.xml')) fail('/robots.txt', 'does not reference the sitemap');
  else {
    // Collect the Disallow rules that apply to a generic crawler ("*" group).
    // A Disallow that covers an indexable page is how a site quietly vanishes
    // from Google, and a Disallow on a noindex page is worse than useless:
    // the crawler can never read the noindex tag it is supposed to obey.
    const disallow = [];
    let inStar = false;
    for (const raw of rb.body.split('\n')) {
      const line = raw.replace(/#.*/, '').trim();
      if (!line) continue;
      const [k, ...rest] = line.split(':');
      const key = k.trim().toLowerCase();
      const val = rest.join(':').trim();
      if (key === 'user-agent') inStar = val === '*';
      else if (key === 'disallow' && inStar && val) disallow.push(val);
    }
    const blocked = (p) => disallow.some((d) => p.startsWith(d.replace(/\*$/, '')));
    for (const u of urls) {
      const p = new URL(u).pathname;
      if (blocked(p)) fail(u, `indexable page is Disallowed in robots.txt`);
    }
    if (blocked('/anketa')) fail('/anketa', 'noindex page is Disallowed — crawlers can never read the noindex tag');
    if (blocked('/sitemap.xml')) fail('/sitemap.xml', 'sitemap is Disallowed in robots.txt');
  }

  // --- every indexable page ---------------------------------------------------
  const titles = new Map();
  const descs = new Map();

  for (const url of urls) {
    const r = await get(url);
    if (r.status !== 200) { fail(url, `status ${r.status}${r.location ? ` -> ${r.location}` : ''} (sitemap URLs must return 200, not redirect)`); continue; }

    const h = r.body;
    const c = canonical(h);
    if (!c) fail(url, 'no canonical');
    else if (c !== url) fail(url, `canonical points elsewhere: ${c}`);

    const rob = robots(h) || '';
    if (rob.includes('noindex')) fail(url, 'noindex page listed in sitemap');

    const t = title(h);
    if (!t) fail(url, 'no <title>');
    else {
      if (t.length > 65) warn(url, `title ${t.length} chars (Google truncates ~60)`);
      if (titles.has(t)) fail(url, `duplicate <title> with ${titles.get(t)}`);
      else titles.set(t, url);
    }

    const d = desc(h);
    if (!d) fail(url, 'no meta description');
    else {
      if (d.length > 165) warn(url, `description ${d.length} chars (truncates ~160)`);
      if (descs.has(d)) fail(url, `duplicate meta description with ${descs.get(d)}`);
      else descs.set(d, url);
    }

    const heads = h1s(h);
    if (heads.length === 0) fail(url, 'no <h1> in the served HTML');
    if (heads.length > 1) warn(url, `${heads.length} <h1> tags`);

    const blocks = ldBlocks(h);
    if (!blocks.length) fail(url, 'no JSON-LD');
    for (const b of blocks) {
      try {
        const o = JSON.parse(b);
        const types = [].concat(o['@type'] || []);
        if (types.includes('FAQPage') && url !== `${SITE}/`) {
          fail(url, 'FAQPage markup on a page with no visible FAQ');
        }
        if (types.includes('AggregateRating') || o.aggregateRating) {
          warn(url, 'aggregateRating present — must be backed by real, verifiable reviews');
        }
      } catch (e) {
        fail(url, `invalid JSON-LD: ${e.message}`);
      }
    }
  }

  // --- assets referenced by OG tags + structured data must resolve -------------
  // Google reports "image not found" against the structured data if they 404.
  const home = await get(`${SITE}/`);
  const assets = new Set([
    tag(home.body, /<meta property="og:image" content="([^"]*)"/),
    tag(home.body, /<link rel="icon" href="([^"]*)"/),
  ].filter(Boolean));
  for (const b of ldBlocks(home.body)) {
    try {
      const o = JSON.parse(b);
      for (const v of [o.logo, o.image].flat()) if (typeof v === 'string' && /^https?:|^\//.test(v)) assets.add(v);
    } catch { /* reported elsewhere */ }
  }
  for (const a of assets) {
    const url = a.startsWith('http') ? a : SITE + a;
    const r = await fetch(url, { method: 'HEAD' });
    if (!r.ok) fail(url, `asset referenced in OG/structured data returns ${r.status}`);
  }

  // --- soft-404 / status codes ------------------------------------------------
  const ghost = await get(`${SITE}/definitely-not-a-real-page-9f3a`);
  if (ghost.status !== 404) {
    fail('/definitely-not-a-real-page-9f3a', `unknown URL returned ${ghost.status}, expected 404 (soft-404)`);
  } else if (canonical(ghost.body)) {
    fail('404 page', 'has a canonical tag; a 404 must not canonicalise to anything');
  } else if (!(robots(ghost.body) || '').includes('noindex')) {
    warn('404 page', 'not marked noindex');
  }

  const ghostNews = await get(`${SITE}/novosti/not-a-real-post-9f3a`);
  if (ghostNews.status !== 404) fail('/novosti/not-a-real-post-9f3a', `returned ${ghostNews.status}, expected 404`);

  // --- one URL per page (duplicate-content shapes) -----------------------------
  const slash = await get(`${SITE}/albir/`);
  if (![301, 308].includes(slash.status)) warn('/albir/', `trailing slash returned ${slash.status}, expected a 301/308 to /albir`);

  const apex = await get(SITE.replace('//www.', '//'));
  if (SITE.includes('www.') && ![301, 308].includes(apex.status)) {
    warn('apex domain', `redirects with ${apex.status}; should be a permanent 301/308 so Google consolidates onto www`);
  }

  // --- legacy WordPress URLs (middleware.js) ------------------------------------
  const legacy = [
    ['/zakaz-transfera/albir', [301, 308], '/albir'],
    ['/forma-dlya-voditelya', [301, 308], '/voditelyam'],
    ['/category/news', [410], null],
    ['/novosti/some-old-post.html', [410], null],
  ];
  for (const [p, want, dest] of legacy) {
    const r = await get(SITE + p);
    if (!want.includes(r.status)) fail(p, `status ${r.status}, expected ${want.join('/')}`);
    else if (dest && r.location && !r.location.endsWith(dest)) fail(p, `redirects to ${r.location}, expected ${dest}`);
  }

  // --- noindex pages must still be reachable, just not indexed ------------------
  const anketa = await get(`${SITE}/anketa`);
  if (anketa.status !== 200) fail('/anketa', `status ${anketa.status}, expected 200`);
  else if (!(robots(anketa.body) || '').includes('noindex')) fail('/anketa', 'should be noindex');
  if (urls.some((u) => u.endsWith('/anketa'))) fail('/anketa', 'noindex page must not be in the sitemap');

  // --- orphan pages ---------------------------------------------------------------
  // Crawl from "/" following only <a href> in the served HTML — i.e. what a
  // crawler that doesn't execute JavaScript sees. Anything in the sitemap that
  // this can't reach is an orphan, discoverable only via the sitemap.
  const seen = new Set([`${SITE}/`]);
  const queue = [`${SITE}/`];
  while (queue.length) {
    const p = queue.shift();
    const r = await get(p);
    if (r.status !== 200) continue;
    for (const m of r.body.matchAll(/<a href="(\/[^"#]*)"/g)) {
      const u = SITE + (m[1] === '/' ? '/' : m[1].replace(/\/$/, ''));
      if (!seen.has(u)) { seen.add(u); queue.push(u); }
    }
  }
  const orphans = urls.filter((u) => !seen.has(u));
  if (orphans.length) fail('crawl', `${orphans.length} sitemap page(s) unreachable by link without JS: ${orphans.slice(0, 5).join(', ')}`);

  // --- report -------------------------------------------------------------------
  console.log(`\nchecked ${urls.length} sitemap pages + status/redirect/legacy rules`);
  if (warns.length) {
    console.log(`\n${warns.length} warning(s):`);
    for (const w of warns) console.log('  ! ' + w);
  }
  if (fails.length) {
    console.log(`\n${fails.length} ERROR(s):`);
    for (const f of fails) console.log('  x ' + f);
    process.exit(1);
  }
  console.log('\nNo errors. Site is clean for indexing.');
}

main().catch((e) => { console.error(e); process.exit(1); });
