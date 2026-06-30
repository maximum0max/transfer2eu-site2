// Post-build prerenderer — turns the client-only SPA into one static HTML file
// per URL, each with its own <title>, meta description, canonical, Open Graph
// tags AND visible primary content in the initial HTML. That means crawlers
// that don't run JavaScript (Yandex, Bing, link-preview bots) still get a full,
// unique page; Google gets correct metadata instantly instead of after render.
//
// It also (re)generates sitemap.xml from live data, so news posts published by
// the bot are covered automatically on the next build.
//
// No headless browser: we load the app's own data + SEO modules through Vite's
// SSR loader (handles .jsx) and stitch the result into the built index.html.

import { createServer } from 'vite';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://www.transfer2eu.com';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const STATIC_H1 = {
  home:     'Трансфер из аэропорта Аликанте (ALC)',
  routes:   'Маршруты трансфера из Аликанте',
  price:    'Цены на трансфер из аэропорта Аликанте',
  contacts: 'Контакты Transfer2EU',
  drivers:  'Водителям — присоединяйтесь к команде',
  news:     'Новости и гайды',
};

const SHELL = 'max-width:820px;margin:0 auto;padding:48px 24px;font-family:\'Inter\',system-ui;color:var(--t2-ink,#0F1216)';

function routeBody(r, seo) {
  return `<main style="${SHELL}">`
    + `<h1>Трансфер Аликанте → ${esc(r.ru)} от ${r.price}€</h1>`
    + `<p>${esc(seo.description)}</p>`
    + `<ul>`
    + `<li>Фиксированная цена: ${r.price}€ за автомобиль (седан, до 4 пассажиров)</li>`
    + `<li>Время в пути: ~${r.time} мин</li>`
    + `<li>Русскоязычный водитель, встреча с табличкой, работаем 24/7</li>`
    + `</ul></main>`;
}

function newsBody(post, seo) {
  const first = Array.isArray(post.body) ? post.body.find((b) => b.type === 'p') : null;
  return `<main style="${SHELL}">`
    + `<h1>${esc(post.title)}</h1>`
    + (post.date ? `<p><em>${esc(post.date)}</em></p>` : '')
    + `<p>${esc(post.excerpt || seo.description)}</p>`
    + (first ? `<p>${esc(first.text)}</p>` : '')
    + `</main>`;
}

function staticBody(view, seo) {
  return `<main style="${SHELL}"><h1>${esc(STATIC_H1[view] || 'Transfer2EU')}</h1><p>${esc(seo.description)}</p></main>`;
}

// Rewrite the head tags that index.html ships with home-page defaults.
function applyHead(html, seo) {
  const url = SITE + (seo.path === '/' ? '/' : seo.path);
  const sub = (re, value) => { html = html.replace(re, (_m, a, b) => a + value + b); };

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
  sub(/(<meta name="description" content=")[^"]*(">)/, esc(seo.description));
  sub(/(<meta name="robots" content=")[^"]*(">)/, seo.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large');
  sub(/(<link rel="canonical" href=")[^"]*(">)/, url);
  sub(/(<link rel="alternate" hreflang="ru" href=")[^"]*(">)/, url);
  sub(/(<link rel="alternate" hreflang="x-default" href=")[^"]*(">)/, url);
  sub(/(<meta property="og:url" content=")[^"]*(">)/, url);
  sub(/(<meta property="og:title" content=")[^"]*(">)/, esc(seo.title));
  sub(/(<meta property="og:description" content=")[^"]*(">)/, esc(seo.description));
  sub(/(<meta name="twitter:title" content=")[^"]*(">)/, esc(seo.title));
  sub(/(<meta name="twitter:description" content=")[^"]*(">)/, esc(seo.description));
  return html;
}

function outFile(p) {
  return p === '/' ? 'index.html' : path.join(p.replace(/^\//, ''), 'index.html');
}

function sitemapXml(pages, lastmod) {
  const body = pages.map((pg) => {
    const loc = SITE + (pg.seo.path === '/' ? '/' : pg.seo.path);
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${pg.cf}</changefreq>`,
      `    <priority>${pg.pr}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

async function main() {
  const vite = await createServer({
    server: { middlewareMode: true, open: false, hmr: false },
    appType: 'custom',
    logLevel: 'warn',
    // We only use the SSR module loader; skip the browser dep pre-bundling scan
    // (otherwise its async esbuild pass gets cancelled on close and logs noise).
    optimizeDeps: { noDiscovery: true, include: [] },
  });

  let pages = [];
  try {
    const { getSeo } = await vite.ssrLoadModule('/seo.jsx');
    const { ALL_ROUTES } = await vite.ssrLoadModule('/BrandData.jsx');
    const { NEWS_POSTS } = await vite.ssrLoadModule('/News.data.jsx');

    const sections = [
      ['home', null, 'weekly', '1.0'],
      ['routes', null, 'weekly', '0.9'],
      ['price', null, 'weekly', '0.9'],
      ['news', null, 'weekly', '0.6'],
      ['contacts', null, 'monthly', '0.6'],
      ['drivers', null, 'monthly', '0.5'],
    ];

    for (const [view, , cf, pr] of sections) {
      const seo = getSeo(view, null, null);
      pages.push({ view, seo, cf, pr, body: staticBody(view, seo) });
    }
    for (const r of ALL_ROUTES) {
      const seo = getSeo('route', r.slug, null);
      pages.push({ view: 'route', seo, cf: 'monthly', pr: '0.7', body: routeBody(r, seo) });
    }
    for (const post of (NEWS_POSTS || [])) {
      const seo = getSeo('news-post', null, post.slug);
      pages.push({ view: 'news-post', seo, cf: 'monthly', pr: '0.5', body: newsBody(post, seo) });
    }
  } finally {
    await vite.close();
  }

  const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');

  for (const pg of pages) {
    let html = applyHead(template, pg.seo);
    html = html.replace('<div id="root"></div>', `<div id="root">${pg.body}</div>`);
    const dest = path.join(DIST, outFile(pg.seo.path));
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, html, 'utf8');
  }

  const lastmod = new Date().toISOString();
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml(pages, lastmod), 'utf8');

  console.log(`Prerendered ${pages.length} pages + sitemap.xml`);
}

// Never fail the deploy on a prerender error: the SPA build + the committed
// static sitemap.xml are a complete fallback, so exit 0 and just log.
main().catch((err) => { console.error('Prerender failed (non-fatal):', err); process.exit(0); });
