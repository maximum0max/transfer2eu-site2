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
  anketa:   'Анкета',
  notfound: 'Страница не найдена',
};

const SHELL = 'max-width:820px;margin:0 auto;padding:48px 24px;font-family:\'Inter\',system-ui;color:var(--t2-ink,#0F1216)';

const a = (href, text) => `<a href="${href}">${esc(text)}</a>`;

// React replaces all of this on hydration, so it is never seen by a human. It
// exists for crawlers that don't run JS (Yandex, Bing, the AI crawlers we
// welcome in robots.txt): without links here they'd get 69 orphan pages and no
// crawl graph at all. Every page therefore links to the section hubs, and the
// hubs link to their children.
const NAV = [
  ['/', 'Главная'],
  ['/marshruty', 'Маршруты'],
  ['/price', 'Цены'],
  ['/novosti', 'Новости'],
  ['/kontakty', 'Контакты'],
  ['/voditelyam', 'Водителям'],
];

const siteNav = (current) => '<nav><ul>'
  + NAV.filter(([p]) => p !== current).map(([p, t]) => `<li>${a(p, t)}</li>`).join('')
  + '</ul></nav>';

const routeLinks = (routes) => '<ul>'
  + routes.map((r) => `<li>${a('/' + r.slug, `Трансфер Аликанте → ${r.ru} — ${r.price}€`)}</li>`).join('')
  + '</ul>';

// City-guide block (beaches / food / photo spots + map) for routes that have a
// RouteGuide entry. Rendered into the static HTML so the unique content is
// indexable without JS.
function guideHtml(guide, city) {
  if (!guide) return '';
  const ul = (items, fmt) => '<ul>' + items.map(fmt).join('') + '</ul>';
  let out = '';
  const pic = (it) => it.img ? `<img src="${it.img}" alt="${esc(it.name)} — ${esc(city)}" width="360" loading="lazy" style="max-width:100%;height:auto;border-radius:10px;display:block;margin:6px 0"> ` : '';
  if (guide.beaches) {
    out += `<h2>Пляжи ${esc(city)} и рядом</h2>`
      + ul(guide.beaches, (b) => `<li>${pic(b)}<strong>${esc(b.name)}</strong> (${esc(b.dist)}) — ${esc(b.text)}</li>`);
  }
  if (guide.food) {
    out += `<h2>Где поесть в ${esc(city)} — рекомендации для туристов</h2>`
      + ul(guide.food, (f) => `<li>${pic(f)}<strong>${esc(f.name)}</strong> (${esc(f.type)}) — ${esc(f.text)}</li>`);
  }
  if (guide.photoSpots) {
    out += `<h2>Что посмотреть и лучшие места для фото в ${esc(city)}</h2>`
      + ul(guide.photoSpots, (s) => `<li>${pic(s)}<strong>${esc(s.name)}</strong> — ${esc(s.text)}</li>`);
  }
  return out;
}

function routeBody(r, seo, siblings, guide) {
  const mapSrc = (guide && guide.mapSrc)
    || `https://maps.google.com/maps?saddr=${encodeURIComponent('Aeropuerto de Alicante-Elche ALC')}&daddr=${encodeURIComponent(r.city + ', España')}&hl=ru&output=embed`;
  const waText = encodeURIComponent(`Здравствуйте! Хочу заказать трансфер из аэропорта Аликанте (ALC) в ${r.ru}.`);
  return `<main style="${SHELL}">`
    + `<h1>Трансфер Аликанте → ${esc(r.ru)} ${r.price}€</h1>`
    + `<p>${esc(seo.description)}</p>`
    + `<ul>`
    + `<li>Фиксированная цена: ${r.price}€ за автомобиль (седан, до 4 пассажиров)</li>`
    + `<li>Время в пути: ~${r.time} мин</li>`
    + `<li>Русскоязычный водитель, встреча с табличкой, работаем 24/7</li>`
    + `</ul>`
    + `<h2>Маршрут от аэропорта Аликанте до ${esc(r.ru)} на карте</h2>`
    + `<iframe title="Маршрут от аэропорта Аликанте (ALC) до ${esc(r.ru)}" src="${mapSrc}" width="100%" height="360" style="border:0;border-radius:12px" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`
    + `<p><a href="https://wa.me/34651011911?text=${waText}">📲 Заказать в WhatsApp</a> · <a href="https://t.me/MrOleksandr?text=${encodeURIComponent('Здравствуйте! Хочу заказать трансфер.')}">✈ Заказать в Telegram</a> · <a href="tel:+34651011911">📞 +34 651 011 911</a></p>`
    + guideHtml(guide, r.ru)
    + `<h2>Другие направления</h2>`
    + routeLinks(siblings)
    + siteNav(seo.path)
    + `</main>`;
}

function newsBody(post, seo, related, routes) {
  const first = Array.isArray(post.body) ? post.body.find((b) => b.type === 'p') : null;
  // Onward internal links so no article is a crawl dead-end: related posts +
  // popular transfer routes + the service hubs. This is what a JS-less crawler
  // (and Google's first crawl) sees, so the links must be real <a> in the HTML.
  const relatedBlock = (related && related.length)
    ? '<h2>Читайте также</h2><ul>'
      + related.map((p) => `<li>${a('/novosti/' + p.slug, p.title)}</li>`).join('')
      + '</ul>'
    : '';
  const routesBlock = (routes && routes.length)
    ? '<h2>Заказать трансфер из аэропорта Аликанте</h2>'
      + routeLinks(routes)
      + `<p>${a('/marshruty', 'Все 40+ маршрутов')} · ${a('/price', 'Цены на трансфер')} · ${a('/kontakty', 'Контакты 24/7')}</p>`
    : '';
  const img = post.image || '/assets/og-image.jpg';
  return `<main style="${SHELL}">`
    + `<h1>${esc(post.title)}</h1>`
    + `<img src="${img}" alt="${esc(post.title)}" width="820" style="max-width:100%;height:auto;border-radius:14px;display:block;margin:8px 0 16px" loading="eager">`
    + (post.date ? `<p><em>${esc(post.date)}</em></p>` : '')
    + `<p>${esc(post.excerpt || seo.description)}</p>`
    + (first ? `<p>${esc(first.text)}</p>` : '')
    + relatedBlock
    + routesBlock
    + siteNav(seo.path)
    + `</main>`;
}

function intercityBody(r, seo, routes) {
  const blocks = (r.body || []).map((b) => {
    if (b.type === 'h2') return `<h2>${esc(b.text)}</h2>`;
    if (b.type === 'p') return `<p>${esc(b.text)}</p>`;
    if (b.type === 'ul') return '<ul>' + b.items.map((it) => `<li>${esc(it)}</li>`).join('') + '</ul>';
    return '';
  }).join('');
  return `<main style="${SHELL}">`
    + `<h1>${esc(r.h1)}</h1>`
    + `<p>${esc(r.intro)}</p>`
    + blocks
    + '<h2>Трансфер из аэропорта Аликанте</h2>'
    + routeLinks(routes)
    + `<p>${a('/marshruty', 'Все 40+ маршрутов')} · ${a('/price', 'Цены на трансфер')} · ${a('/kontakty', 'Контакты 24/7')}</p>`
    + siteNav(seo.path)
    + `</main>`;
}

// The hubs carry the full child list, so every route page and every post is
// reachable from a crawl that starts at "/" and never runs a line of JS.
function staticBody(view, seo, children) {
  return `<main style="${SHELL}">`
    + `<h1>${esc(STATIC_H1[view] || 'Transfer2EU')}</h1>`
    + `<p>${esc(seo.description)}</p>`
    + (children || '')
    + siteNav(seo.path)
    + `</main>`;
}

// The FAQ section is only rendered on the home view (App.jsx), so the FAQPage
// block that index.html ships with must not travel to the other pages: Google
// requires FAQ markup to match FAQ content that is actually visible on the URL.
function stripFaqLd(html) {
  return html.replace(
    /(?:<!--[^>]*?-->\s*)?<script type="application\/ld\+json">(?:(?!<\/script>)[\s\S])*?"FAQPage"(?:(?!<\/script>)[\s\S])*?<\/script>\s*/,
    '',
  );
}

const ldScript = (obj) =>
  `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>\n`;

// Rewrite the head tags that index.html ships with home-page defaults.
function applyHead(html, seo, opts = {}) {
  const url = SITE + (seo.path === '/' ? '/' : seo.path);
  const sub = (re, value) => { html = html.replace(re, (_m, a, b) => a + value + b); };

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
  sub(/(<meta name="description" content=")[^"]*(">)/, esc(seo.description));
  sub(/(<meta name="robots" content=")[^"]*(">)/, seo.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large');
  sub(/(<link rel="canonical" href=")[^"]*(">)/, url);
  sub(/(<link rel="alternate" hreflang="ru" href=")[^"]*(">)/, url);
  sub(/(<link rel="alternate" hreflang="x-default" href=")[^"]*(">)/, url);
  sub(/(<meta property="og:url" content=")[^"]*(">)/, url);
  sub(/(<meta property="og:type" content=")[^"]*(">)/, opts.ogType || 'website');
  sub(/(<meta property="og:title" content=")[^"]*(">)/, esc(seo.title));
  sub(/(<meta property="og:description" content=")[^"]*(">)/, esc(seo.description));
  sub(/(<meta name="twitter:title" content=")[^"]*(">)/, esc(seo.title));
  sub(/(<meta name="twitter:description" content=")[^"]*(">)/, esc(seo.description));
  if (opts.ogImage) {
    const imgUrl = SITE + opts.ogImage;
    sub(/(<meta property="og:image" content=")[^"]*(">)/, imgUrl);
    sub(/(<meta name="twitter:image" content=")[^"]*(">)/, imgUrl);
  }

  if (opts.view !== 'home') html = stripFaqLd(html);

  const extra = (opts.jsonLd || []).map(ldScript).join('');
  if (extra) html = html.replace('</head>', extra + '</head>');
  return html;
}

// --- per-page structured data -------------------------------------------------

const breadcrumbs = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, p], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: SITE + p,
  })),
});

// The route page's own product: one named transfer at one fixed price. This is
// what we actually want Google to attach to /<routeSlug>, rather than the home
// page's whole-catalogue TaxiService node.
function routeLd(r, seo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': SITE + seo.path + '#service',
    serviceType: 'Трансфер из аэропорта',
    name: `Трансфер Аликанте (ALC) → ${r.ru}`,
    description: seo.description,
    url: SITE + seo.path,
    provider: { '@id': SITE + '/#org' },
    areaServed: { '@type': 'City', name: r.city },
    offers: {
      '@type': 'Offer',
      price: String(r.price),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: SITE + seo.path,
    },
  };
}

// Intercity route product: origin is NOT the airport, so areaServed names the
// destination city and the Service is a plain city-to-city transfer.
function intercityLd(r, seo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': SITE + seo.path + '#service',
    serviceType: 'Междугородний трансфер',
    name: `Такси ${r.from} → ${r.to}`,
    description: seo.description,
    url: SITE + seo.path,
    provider: { '@id': SITE + '/#org' },
    areaServed: { '@type': 'City', name: r.to },
    offers: {
      '@type': 'Offer',
      price: String(r.price),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: SITE + seo.path,
    },
  };
}

const RU_MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля',
  'августа', 'сентября', 'октября', 'ноября', 'декабря'];

// The bot writes human dates ("29 июня 2026"); schema.org and sitemaps need ISO.
function isoDate(human) {
  const m = String(human || '').match(/(\d{1,2})\s+([а-яё]+)\s+(\d{4})/i);
  if (!m) return null;
  const month = RU_MONTHS.indexOf(m[2].toLowerCase());
  if (month < 0) return null;
  const d = new Date(Date.UTC(+m[3], month, +m[1]));
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function newsLd(post, seo) {
  const published = isoDate(post.date);
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': SITE + seo.path + '#article',
    headline: post.title,
    description: post.excerpt || seo.description,
    url: SITE + seo.path,
    ...(published ? { datePublished: published, dateModified: published } : {}),
    image: [SITE + (post.image || '/assets/og-image.jpg')],
    author: { '@id': SITE + '/#org' },
    publisher: { '@id': SITE + '/#org' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + seo.path },
    inLanguage: 'ru',
  };
}

function outFile(p) {
  return p === '/' ? 'index.html' : path.join(p.replace(/^\//, ''), 'index.html');
}

// Only indexable pages belong in the sitemap: submitting a noindex URL is a
// direct contradiction and Search Console reports it as an error.
function sitemapXml(pages, buildDate) {
  const body = pages.filter((pg) => !pg.seo.noindex).map((pg) => {
    const loc = SITE + (pg.seo.path === '/' ? '/' : pg.seo.path);
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${pg.lastmod || buildDate}</lastmod>`,
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
  let nfSeo = null;
  try {
    const { getSeo } = await vite.ssrLoadModule('/seo.jsx');
    const { ALL_ROUTES, POPULAR } = await vite.ssrLoadModule('/BrandData.jsx');
    const { NEWS_POSTS } = await vite.ssrLoadModule('/News.data.jsx');
    const { INTERCITY_ROUTES } = await vite.ssrLoadModule('/Intercity.data.jsx');
    const { ROUTE_GUIDES } = await vite.ssrLoadModule('/RouteGuide.data.jsx');

    const sections = [
      ['home', null, 'weekly', '1.0'],
      ['routes', null, 'weekly', '0.9'],
      ['price', null, 'weekly', '0.9'],
      ['news', null, 'weekly', '0.6'],
      ['contacts', null, 'monthly', '0.6'],
      ['drivers', null, 'monthly', '0.5'],
    ];

    const HOME = ['Главная', '/'];

    // Hub children: /marshruty lists every route, /novosti every post, and the
    // home page seeds the crawl with the routes too.
    const allRouteLinks = routeLinks(ALL_ROUTES);
    const newsLinks = '<ul>' + (NEWS_POSTS || []).map((p) => {
      const im = p.image || '/assets/og-image.jpg';
      return `<li><a href="/novosti/${p.slug}">`
        + `<img src="${im}" alt="${esc(p.title)}" width="280" loading="lazy" style="max-width:100%;height:auto;border-radius:8px;display:block;margin:6px 0">`
        + `${esc(p.title)}</a></li>`;
    }).join('') + '</ul>';
    // Intercity routes get an in-link from the /marshruty hub so they are part
    // of the crawlable graph, not just the sitemap.
    const intercityHubLinks = (INTERCITY_ROUTES || []).length
      ? '<h2>Междугородние трансферы</h2><ul>'
        + INTERCITY_ROUTES.map((r) => `<li>${a('/' + r.slug, `Такси ${r.from} → ${r.to} — ${r.price}€`)}</li>`).join('')
        + '</ul>'
      : '';
    const CHILDREN = { home: allRouteLinks, routes: allRouteLinks + intercityHubLinks, news: newsLinks };

    for (const [view, , cf, pr] of sections) {
      const seo = getSeo(view, null, null);
      const jsonLd = view === 'home' ? [] : [breadcrumbs([HOME, [STATIC_H1[view], seo.path]])];
      pages.push({ view, seo, cf, pr, jsonLd, body: staticBody(view, seo, CHILDREN[view]) });
    }
    for (const r of ALL_ROUTES) {
      const seo = getSeo('route', r.slug, null);
      const siblings = ALL_ROUTES.filter((x) => x.slug !== r.slug).slice(0, 8);
      pages.push({
        view: 'route', seo, cf: 'monthly', pr: '0.7', body: routeBody(r, seo, siblings, ROUTE_GUIDES[r.slug] || null),
        jsonLd: [
          routeLd(r, seo),
          breadcrumbs([HOME, ['Маршруты', '/marshruty'], [r.ru, seo.path]]),
        ],
      });
    }
    const popRoutes = (POPULAR || []).slice(0, 5);
    for (const r of (INTERCITY_ROUTES || [])) {
      const seo = getSeo('intercity', r.slug, null);
      pages.push({
        view: 'intercity', seo, cf: 'monthly', pr: '0.6',
        body: intercityBody(r, seo, popRoutes),
        jsonLd: [
          intercityLd(r, seo),
          breadcrumbs([HOME, ['Маршруты', '/marshruty'], [`${r.from} → ${r.to}`, seo.path]]),
        ],
      });
    }

    const allPosts = NEWS_POSTS || [];
    for (let i = 0; i < allPosts.length; i++) {
      const post = allPosts[i];
      const seo = getSeo('news-post', null, post.slug);
      // Next 3 posts, cyclically — every post links forward, so the whole news
      // set forms one connected chain no matter where a crawler enters.
      const related = [];
      for (let k = 1; related.length < 3 && k < allPosts.length; k++) {
        related.push(allPosts[(i + k) % allPosts.length]);
      }
      pages.push({
        view: 'news-post', seo, cf: 'monthly', pr: '0.5', body: newsBody(post, seo, related, popRoutes),
        ogType: 'article',
        ogImage: post.image || null,
        lastmod: isoDate(post.date),
        jsonLd: [
          newsLd(post, seo),
          breadcrumbs([HOME, ['Новости', '/novosti'], [post.title, seo.path]]),
        ],
      });
    }

    // Unlisted, noindex — prerendered so it resolves as a real file rather than
    // depending on an SPA catch-all rewrite (which is what made every unknown
    // URL return the home page with a 200).
    const anketa = getSeo('anketa', null, null);
    pages.push({ view: 'anketa', seo: anketa, cf: 'yearly', pr: '0.1', body: staticBody('anketa', anketa) });

    nfSeo = getSeo('notfound', null, null);
  } finally {
    await vite.close();
  }

  const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');

  for (const pg of pages) {
    let html = applyHead(template, pg.seo, { view: pg.view, jsonLd: pg.jsonLd, ogType: pg.ogType, ogImage: pg.ogImage });
    html = html.replace('<div id="root"></div>', `<div id="root">${pg.body}</div>`);
    const dest = path.join(DIST, outFile(pg.seo.path));
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, html, 'utf8');
  }

  // Vercel serves this for any path with no matching file, with a real 404
  // status. It still boots the SPA, so the client router renders the styled
  // not-found view over the static fallback body.
  const notFound = applyHead(
    template.replace('<div id="root"></div>', `<div id="root">${staticBody('notfound', nfSeo)}</div>`),
    { ...nfSeo, path: '/404' },
    { view: 'notfound' },
  ).replace(/<link rel="canonical"[^>]*>\s*/, '');
  await fs.writeFile(path.join(DIST, '404.html'), notFound, 'utf8');

  const buildDate = new Date().toISOString();
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml(pages, buildDate), 'utf8');

  const indexable = pages.filter((p) => !p.seo.noindex).length;
  console.log(`Prerendered ${pages.length} pages (${indexable} in sitemap) + 404.html + sitemap.xml`);
}

// A prerender failure MUST fail the build. There is no SPA catch-all rewrite
// any more (that rewrite is what made every unknown URL answer 200 with the
// home page), so these files are the only thing standing between a deploy and
// a site where every URL except / returns 404.
main().catch((err) => { console.error('Prerender failed:', err); process.exit(1); });
