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

// Local mirrors of the i18n helpers (prerender is plain Node — avoids importing
// the .jsx through the SSR loader just for two tiny functions).
const localizePath = (p, lang) => (lang === 'uk' ? (p === '/' ? '/uk' : '/uk' + (p || '/')) : (p || '/'));
// Replaced with BrandData.cityName once modules load; RU name is the default.
let cityNameFn = (r) => (r && r.ru) || '';
// Localized news field access (mirrors News.data.jsx `newsField`).
const nf = (post, key, lang) => (post && lang === 'uk' && post[`${key}_uk`] != null) ? post[`${key}_uk`] : (post ? post[key] : undefined);

// Static strings for the hand-written (crawler / no-JS) HTML, per language. The
// React app replaces this body on hydration, but crawlers and the first paint
// read it, so it must be in the right language on /uk pages too.
const T = {
  ru: {
    h1: {
      home: 'Трансфер из аэропорта Аликанте (ALC)', routes: 'Маршруты трансфера из Аликанте',
      price: 'Цены на трансфер из аэропорта Аликанте', contacts: 'Контакты Transfer2EU',
      drivers: 'Водителям — присоединяйтесь к команде', news: 'Новости и гайды',
      anketa: 'Анкета', notfound: 'Страница не найдена',
    },
    nav: [['/', 'Главная'], ['/marshruty', 'Маршруты'], ['/price', 'Цены'], ['/novosti', 'Новости'], ['/kontakty', 'Контакты'], ['/voditelyam', 'Водителям']],
    fixed: (p) => `Фиксированная цена: ${p}€ за автомобиль (седан, до 4 пассажиров)`,
    time: (t) => `Время в пути: ~${t} мин`,
    driver: 'Русскоязычный водитель, встреча с табличкой, работаем 24/7',
    mapH2: (c) => `Маршрут от аэропорта Аликанте до ${c} на карте`,
    mapTitle: (c) => `Маршрут от аэропорта Аликанте (ALC) до ${c}`,
    waBtn: '📲 Заказать в WhatsApp', tgBtn: '✈ Заказать в Telegram',
    other: 'Другие направления',
    routeH1: (c, p) => `Трансфер Аликанте → ${c} ${p}€`,
    routeLink: (c, p) => `Трансфер Аликанте → ${c} — ${p}€`,
    gBeaches: (c) => `Пляжи ${c} и рядом`,
    gFood: (c) => `Где поесть в ${c} — рекомендации для туристов`,
    gPhoto: (c) => `Что посмотреть и лучшие места для фото в ${c}`,
    nAlso: 'Читайте также', nOrder: 'Заказать трансфер из аэропорта Аликанте',
    nAll: 'Все 40+ маршрутов', nPrices: 'Цены на трансфер', nContacts: 'Контакты 24/7',
    icHub: 'Междугородние трансферы', icOrder: 'Трансфер из аэропорта Аликанте',
    icLink: (from, to, p) => `Такси ${from} → ${to} — ${p}€`,
    bcHome: 'Главная', bcRoutes: 'Маршруты', bcNews: 'Новости',
    waRoute: (c) => `Здравствуйте! Хочу заказать трансфер из аэропорта Аликанте (ALC) в ${c}.`,
    hl: 'ru',
  },
  uk: {
    h1: {
      home: 'Трансфер з аеропорту Аліканте (ALC)', routes: 'Маршрути трансферу з Аліканте',
      price: 'Ціни на трансфер з аеропорту Аліканте', contacts: 'Контакти Transfer2EU',
      drivers: 'Водіям — приєднуйтесь до команди', news: 'Новини та гайди',
      anketa: 'Анкета', notfound: 'Сторінку не знайдено',
    },
    nav: [['/', 'Головна'], ['/marshruty', 'Маршрути'], ['/price', 'Ціни'], ['/novosti', 'Новини'], ['/kontakty', 'Контакти'], ['/voditelyam', 'Водіям']],
    fixed: (p) => `Фіксована ціна: ${p}€ за автомобіль (седан, до 4 пасажирів)`,
    time: (t) => `Час у дорозі: ~${t} хв`,
    driver: 'Україномовний водій, зустріч з табличкою, працюємо 24/7',
    mapH2: (c) => `Маршрут від аеропорту Аліканте до ${c} на карті`,
    mapTitle: (c) => `Маршрут від аеропорту Аліканте (ALC) до ${c}`,
    waBtn: '📲 Замовити у WhatsApp', tgBtn: '✈ Замовити у Telegram',
    other: 'Інші напрямки',
    routeH1: (c, p) => `Трансфер Аліканте → ${c} ${p}€`,
    routeLink: (c, p) => `Трансфер Аліканте → ${c} — ${p}€`,
    gBeaches: (c) => `Пляжі ${c} і поруч`,
    gFood: (c) => `Де поїсти в ${c} — рекомендації для туристів`,
    gPhoto: (c) => `Що подивитися та найкращі місця для фото в ${c}`,
    nAlso: 'Читайте також', nOrder: 'Замовити трансфер з аеропорту Аліканте',
    nAll: 'Усі 40+ маршрутів', nPrices: 'Ціни на трансфер', nContacts: 'Контакти 24/7',
    icHub: 'Міжміські трансфери', icOrder: 'Трансфер з аеропорту Аліканте',
    icLink: (from, to, p) => `Таксі ${from} → ${to} — ${p}€`,
    bcHome: 'Головна', bcRoutes: 'Маршрути', bcNews: 'Новини',
    waRoute: (c) => `Вітаю! Хочу замовити трансфер з аеропорту Аліканте (ALC) в ${c}.`,
    hl: 'uk',
  },
};
const L = (lang) => T[lang === 'uk' ? 'uk' : 'ru'];

const SHELL = 'max-width:820px;margin:0 auto;padding:48px 24px;font-family:\'Inter\',system-ui;color:var(--t2-ink,#0F1216)';

const a = (href, text) => `<a href="${href}">${esc(text)}</a>`;

// React replaces all of this on hydration, so it is never seen by a human. It
// exists for crawlers that don't run JS (Yandex, Bing, the AI crawlers we
// welcome in robots.txt): without links here they'd get 69 orphan pages and no
// crawl graph at all. Every page therefore links to the section hubs, and the
// hubs link to their children.
const siteNav = (current, lang) => '<nav><ul>'
  + L(lang).nav.filter(([p]) => localizePath(p, lang) !== current)
      .map(([p, t]) => `<li>${a(localizePath(p, lang), t)}</li>`).join('')
  + '</ul></nav>';

const routeLinks = (routes, lang) => '<ul>'
  + routes.map((r) => `<li>${a(localizePath('/' + r.slug, lang), L(lang).routeLink(cityNameFn(r, lang), r.price))}</li>`).join('')
  + '</ul>';

// City-guide block (beaches / food / photo spots + map) for routes that have a
// RouteGuide entry. Rendered into the static HTML so the unique content is
// indexable without JS.
function guideHtml(guide, city, lang) {
  if (!guide) return '';
  const t = L(lang);
  const ul = (items, fmt) => '<ul>' + items.map(fmt).join('') + '</ul>';
  let out = '';
  const pic = (it) => it.img ? `<img src="${it.img}" alt="${esc(it.name)} — ${esc(city)}" width="360" height="225" loading="lazy" style="width:360px;max-width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:10px;display:block;margin:6px 0"> ` : '';
  if (guide.beaches) {
    out += `<h2>${esc(t.gBeaches(city))}</h2>`
      + ul(guide.beaches, (b) => `<li>${pic(b)}<strong>${esc(b.name)}</strong> (${esc(b.dist)}) — ${esc(b.text)}</li>`);
  }
  if (guide.food) {
    out += `<h2>${esc(t.gFood(city))}</h2>`
      + ul(guide.food, (f) => `<li>${pic(f)}<strong>${esc(f.name)}</strong> (${esc(f.type)}) — ${esc(f.text)}</li>`);
  }
  if (guide.photoSpots) {
    out += `<h2>${esc(t.gPhoto(city))}</h2>`
      + ul(guide.photoSpots, (s) => `<li>${pic(s)}<strong>${esc(s.name)}</strong> — ${esc(s.text)}</li>`);
  }
  return out;
}

// Long-form SEO article (RouteArticles.data.jsx) rendered into the static HTML.
function articleHtml(article) {
  if (!article || !Array.isArray(article.blocks)) return '';
  // Link every "WhatsApp" mention to our number (same as the WhatsApp button).
  const wa = (s) => esc(s).replace(/WhatsApp/g, '<a href="https://wa.me/34651011911">WhatsApp</a>');
  const body = article.blocks.map((b) => {
    if (b.type === 'h2') return `<h2>${esc(b.text)}</h2>`;
    if (b.type === 'h3') return `<h3>${esc(b.text)}</h3>`;
    if (b.type === 'p') return `<p>${wa(b.text)}</p>`;
    if (b.type === 'ul') return '<ul>' + b.items.map((it) => `<li>${wa(it)}</li>`).join('') + '</ul>';
    return '';
  }).join('');
  return `<h2>${esc(article.title)}</h2>` + body;
}

function routeBody(r, seo, siblings, guide, article, lang) {
  const t = L(lang);
  const city = cityNameFn(r, lang);
  const mapSrc = (guide && guide.mapSrc)
    || `https://maps.google.com/maps?saddr=${encodeURIComponent('Aeropuerto de Alicante-Elche ALC')}&daddr=${encodeURIComponent(r.city + ', España')}&hl=${t.hl}&output=embed`;
  const waText = encodeURIComponent(t.waRoute(city));
  return `<main style="${SHELL}">`
    + `<h1>${esc(t.routeH1(city, r.price))}</h1>`
    + `<p>${esc(seo.description)}</p>`
    + `<ul>`
    + `<li>${esc(t.fixed(r.price))}</li>`
    + `<li>${esc(t.time(r.time))}</li>`
    + `<li>${esc(t.driver)}</li>`
    + `</ul>`
    + `<h2>${esc(t.mapH2(city))}</h2>`
    + `<iframe title="${esc(t.mapTitle(city))}" src="${mapSrc}" width="100%" height="360" style="border:0;border-radius:12px" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`
    + `<p><a href="https://wa.me/34651011911?text=${waText}">${t.waBtn}</a> · <a href="https://t.me/Apartikibot?start=transfer">${t.tgBtn}</a> ·<a href="tel:+34651011911">📞 +34 651 011 911</a></p>`
    + guideHtml(guide, city, lang)
    + articleHtml(article)
    + `<h2>${esc(t.other)}</h2>`
    + routeLinks(siblings, lang)
    + siteNav(seo.path, lang)
    + `</main>`;
}

function newsBody(post, seo, related, routes, lang) {
  const t = L(lang);
  const title = nf(post, 'title', lang);
  const bodyArr = nf(post, 'body', lang);
  const first = Array.isArray(bodyArr) ? bodyArr.find((b) => b.type === 'p') : null;
  // Onward internal links so no article is a crawl dead-end: related posts +
  // popular transfer routes + the service hubs. This is what a JS-less crawler
  // (and Google's first crawl) sees, so the links must be real <a> in the HTML.
  const relatedBlock = (related && related.length)
    ? `<h2>${esc(t.nAlso)}</h2><ul>`
      + related.map((p) => `<li>${a(localizePath('/novosti/' + p.slug, lang), nf(p, 'title', lang))}</li>`).join('')
      + '</ul>'
    : '';
  const routesBlock = (routes && routes.length)
    ? `<h2>${esc(t.nOrder)}</h2>`
      + routeLinks(routes, lang)
      + `<p>${a(localizePath('/marshruty', lang), t.nAll)} · ${a(localizePath('/price', lang), t.nPrices)} · ${a(localizePath('/kontakty', lang), t.nContacts)}</p>`
    : '';
  const img = post.image || '/assets/og-image.jpg';
  return `<main style="${SHELL}">`
    + `<h1>${esc(title)}</h1>`
    + `<img src="${img}" alt="${esc(title)}" width="820" height="461" style="width:820px;max-width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:14px;display:block;margin:8px 0 16px" loading="eager" fetchpriority="high">`
    + (post.date ? `<p><em>${esc(post.date)}</em></p>` : '')
    + `<p>${esc(nf(post, 'excerpt', lang) || seo.description)}</p>`
    + (first ? `<p>${esc(first.text)}</p>` : '')
    + relatedBlock
    + routesBlock
    + siteNav(seo.path, lang)
    + `</main>`;
}

function intercityBody(r, seo, routes, lang) {
  const t = L(lang);
  const bodyBlocks = (lang === 'uk' && r.body_uk) || r.body || [];
  const blocks = bodyBlocks.map((b) => {
    if (b.type === 'h2') return `<h2>${esc(b.text)}</h2>`;
    if (b.type === 'p') return `<p>${esc(b.text)}</p>`;
    if (b.type === 'ul') return '<ul>' + b.items.map((it) => `<li>${esc(it)}</li>`).join('') + '</ul>';
    return '';
  }).join('');
  return `<main style="${SHELL}">`
    + `<h1>${esc((lang === 'uk' && r.h1_uk) || r.h1)}</h1>`
    + `<p>${esc((lang === 'uk' && r.intro_uk) || r.intro)}</p>`
    + blocks
    + `<h2>${esc(t.icOrder)}</h2>`
    + routeLinks(routes, lang)
    + `<p>${a(localizePath('/marshruty', lang), t.nAll)} · ${a(localizePath('/price', lang), t.nPrices)} · ${a(localizePath('/kontakty', lang), t.nContacts)}</p>`
    + siteNav(seo.path, lang)
    + `</main>`;
}

// The hubs carry the full child list, so every route page and every post is
// reachable from a crawl that starts at "/" and never runs a line of JS.
function staticBody(view, seo, children, lang) {
  return `<main style="${SHELL}">`
    + `<h1>${esc(L(lang).h1[view] || 'Transfer2EU')}</h1>`
    + `<p>${esc(seo.description)}</p>`
    + (children || '')
    + siteNav(seo.path, lang)
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
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${seo.lang || 'ru'}">`);
  sub(/(<meta property="og:locale" content=")[^"]*(">)/, seo.lang === 'uk' ? 'uk_UA' : 'ru_RU');
  // hreflang: ru/uk/x-default point at their real URLs once the UK site is live
  // (seo.alternates set); otherwise keep the single-language self-reference.
  const alt = seo.alternates;
  const hreflangBlock = alt
    ? `<link rel="alternate" hreflang="ru" href="${alt.ru}">\n`
      + `<link rel="alternate" hreflang="uk" href="${alt.uk}">\n`
      + `<link rel="alternate" hreflang="x-default" href="${alt.xdefault}">`
    : `<link rel="alternate" hreflang="ru" href="${url}">\n`
      + `<link rel="alternate" hreflang="x-default" href="${url}">`;
  html = html.replace(
    /<link rel="alternate" hreflang="ru"[^>]*>\s*<link rel="alternate" hreflang="x-default"[^>]*>/,
    hreflangBlock,
  );
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
function routeLd(r, seo, lang) {
  const city = cityNameFn(r, lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': SITE + seo.path + '#service',
    serviceType: lang === 'uk' ? 'Трансфер з аеропорту' : 'Трансфер из аэропорта',
    name: lang === 'uk' ? `Трансфер Аліканте (ALC) → ${city}` : `Трансфер Аликанте (ALC) → ${r.ru}`,
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

// FAQPage mirrored from the route article's own visible H3 sections + the text
// underneath each. SeoArticle/articleHtml render these blocks verbatim on the
// page, so the markup faithfully matches on-page content (Google's rule for FAQ
// markup). Classic FAQ rich results are now limited to a few site types, but the
// structured Q&A still feeds answer engines (ChatGPT/Perplexity) and Google's
// page understanding. Home keeps its own hand-written FAQPage; route pages get
// this one built from their article.
function faqLd(article, seo) {
  if (!article || !Array.isArray(article.blocks)) return null;
  const qa = [];
  let cur = null;
  for (const b of article.blocks) {
    if (b.type === 'h3') {
      if (cur && cur.a) qa.push(cur);
      cur = { q: b.text, a: '' };
    } else if (cur) {
      const t = b.type === 'p' ? (b.text || '')
        : b.type === 'ul' ? (b.items || []).join('. ')
        : '';
      if (t) cur.a += (cur.a ? ' ' : '') + t;
    }
  }
  if (cur && cur.a) qa.push(cur);
  if (qa.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': SITE + seo.path + '#faq',
    mainEntity: qa.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

// Intercity route product: origin is NOT the airport, so areaServed names the
// destination city and the Service is a plain city-to-city transfer.
function intercityLd(r, seo, lang) {
  const from = (lang === 'uk' && r.from_uk) || r.from;
  const to = (lang === 'uk' && r.to_uk) || r.to;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': SITE + seo.path + '#service',
    serviceType: lang === 'uk' ? 'Міжміський трансфер' : 'Междугородний трансфер',
    name: `${lang === 'uk' ? 'Таксі' : 'Такси'} ${from} → ${to}`,
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

function newsLd(post, seo, lang) {
  const published = isoDate(post.date);
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': SITE + seo.path + '#article',
    headline: nf(post, 'title', lang),
    description: nf(post, 'excerpt', lang) || seo.description,
    url: SITE + seo.path,
    ...(published ? { datePublished: published, dateModified: published } : {}),
    image: [SITE + (post.image || '/assets/og-image.jpg')],
    author: { '@id': SITE + '/#org' },
    publisher: { '@id': SITE + '/#org' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + seo.path },
    inLanguage: lang === 'uk' ? 'uk' : 'ru',
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
    // Each language version of a page declares all its alternates (Google reads
    // the hreflang cluster from the sitemap as well as from the <head>).
    const alt = pg.seo.alternates;
    const altLinks = alt ? [
      `    <xhtml:link rel="alternate" hreflang="ru" href="${alt.ru}"/>`,
      `    <xhtml:link rel="alternate" hreflang="uk" href="${alt.uk}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${alt.xdefault}"/>`,
    ] : [];
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      ...altLinks,
      `    <lastmod>${pg.lastmod || buildDate}</lastmod>`,
      `    <changefreq>${pg.cf}</changefreq>`,
      `    <priority>${pg.pr}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');
  const ns = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${ns}>\n${body}\n</urlset>\n`;
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
    const { ROUTE_GUIDES, getRouteGuide } = await vite.ssrLoadModule('/RouteGuide.data.jsx');
    const { ROUTE_ARTICLES, getRouteArticle } = await vite.ssrLoadModule('/RouteArticles.data.jsx');
    const { cityName } = await vite.ssrLoadModule('/BrandData.jsx');
    const { UK_ENABLED } = await vite.ssrLoadModule('/i18n.jsx');
    cityNameFn = cityName;                       // wire up localized city names
    const LANGS = UK_ENABLED ? ['ru', 'uk'] : ['ru'];

    // Price data for the Telegram price bot (imported by api/telegram.js). A JS
    // module (not JSON) so Vercel's ESM function bundler always inlines it.
    // Regenerated on every build so the bot always quotes current prices.
    const botRoutes = ALL_ROUTES.map((r) => ({ slug: r.slug, ru: r.ru, city: r.city, price: r.price, time: r.time }));
    await fs.writeFile(
      path.join(ROOT, 'api', 'routes.data.js'),
      '// Auto-generated by scripts/prerender.mjs — do not edit.\nexport default ' + JSON.stringify(botRoutes) + ';\n',
      'utf8',
    );

    const sections = [
      ['home', null, 'weekly', '1.0'],
      ['routes', null, 'weekly', '0.9'],
      ['price', null, 'weekly', '0.9'],
      ['news', null, 'weekly', '0.6'],
      ['contacts', null, 'monthly', '0.6'],
      ['drivers', null, 'monthly', '0.5'],
    ];
    const allPosts = NEWS_POSTS || [];
    const popRoutes = (POPULAR || []).slice(0, 5);

    // Build every page once per language. RU keeps its bare URLs; UK lives under
    // /uk (getSeo returns the localized path, so outFile writes to the right dir).
    for (const lang of LANGS) {
      const t = L(lang);
      const HOME = [t.bcHome, localizePath('/', lang)];

      // Hub children: /marshruty lists every route, /novosti every post, and the
      // home page seeds the crawl with the routes too.
      const allRouteLinks = routeLinks(ALL_ROUTES, lang);
      const newsLinks = '<ul>' + allPosts.map((p) => {
        const im = p.image || '/assets/og-image.jpg';
        const title = nf(p, 'title', lang);
        return `<li><a href="${localizePath('/novosti/' + p.slug, lang)}">`
          + `<img src="${im}" alt="${esc(title)}" width="280" height="158" loading="lazy" style="width:280px;max-width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px;display:block;margin:6px 0">`
          + `${esc(title)}</a></li>`;
      }).join('') + '</ul>';
      const intercityHubLinks = (INTERCITY_ROUTES || []).length
        ? `<h2>${esc(t.icHub)}</h2><ul>`
          + INTERCITY_ROUTES.map((r) => `<li>${a(localizePath('/' + r.slug, lang), t.icLink((lang === 'uk' && r.from_uk) || r.from, (lang === 'uk' && r.to_uk) || r.to, r.price))}</li>`).join('')
          + '</ul>'
        : '';
      const CHILDREN = { home: allRouteLinks, routes: allRouteLinks + intercityHubLinks, news: newsLinks };

      for (const [view, , cf, pr] of sections) {
        const seo = getSeo(view, null, null, lang);
        const jsonLd = view === 'home' ? [] : [breadcrumbs([HOME, [t.h1[view], seo.path]])];
        pages.push({ view, seo, cf, pr, jsonLd, body: staticBody(view, seo, CHILDREN[view], lang) });
      }
      for (const r of ALL_ROUTES) {
        const seo = getSeo('route', r.slug, null, lang);
        const siblings = ALL_ROUTES.filter((x) => x.slug !== r.slug).slice(0, 8);
        // Guides aren't translated yet, so only attach them on RU pages (avoids
        // Russian guide text leaking onto a /uk page); the article is localized.
        const guide = getRouteGuide(r.slug, lang);
        const article = getRouteArticle(r.slug, lang);
        pages.push({
          view: 'route', seo, cf: 'monthly', pr: '0.7', body: routeBody(r, seo, siblings, guide, article, lang),
          jsonLd: [
            routeLd(r, seo, lang),
            breadcrumbs([HOME, [t.bcRoutes, localizePath('/marshruty', lang)], [cityNameFn(r, lang), seo.path]]),
            ...[faqLd(article, seo)].filter(Boolean),
          ],
        });
      }
      for (const r of (INTERCITY_ROUTES || [])) {
        const seo = getSeo('intercity', r.slug, null, lang);
        pages.push({
          view: 'intercity', seo, cf: 'monthly', pr: '0.6',
          body: intercityBody(r, seo, popRoutes, lang),
          jsonLd: [
            intercityLd(r, seo, lang),
            breadcrumbs([HOME, [t.bcRoutes, localizePath('/marshruty', lang)], [`${(lang === 'uk' && r.from_uk) || r.from} → ${(lang === 'uk' && r.to_uk) || r.to}`, seo.path]]),
          ],
        });
      }
      for (let i = 0; i < allPosts.length; i++) {
        const post = allPosts[i];
        const seo = getSeo('news-post', null, post.slug, lang);
        // Next 3 posts, cyclically — every post links forward, so the whole news
        // set forms one connected chain no matter where a crawler enters.
        const related = [];
        for (let k = 1; related.length < 3 && k < allPosts.length; k++) {
          related.push(allPosts[(i + k) % allPosts.length]);
        }
        pages.push({
          view: 'news-post', seo, cf: 'monthly', pr: '0.5', body: newsBody(post, seo, related, popRoutes, lang),
          ogType: 'article',
          ogImage: post.image || null,
          lastmod: isoDate(post.date),
          jsonLd: [
            newsLd(post, seo, lang),
            breadcrumbs([HOME, [t.bcNews, localizePath('/novosti', lang)], [nf(post, 'title', lang), seo.path]]),
          ],
        });
      }
    }

    // Unlisted, noindex form page — RU only (embedded external form, no /uk twin).
    const anketa = getSeo('anketa', null, null, 'ru');
    pages.push({ view: 'anketa', seo: anketa, cf: 'yearly', pr: '0.1', body: staticBody('anketa', anketa, 'ru') });

    nfSeo = getSeo('notfound', null, null, 'ru');
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
    template.replace('<div id="root"></div>', `<div id="root">${staticBody('notfound', nfSeo, 'ru')}</div>`),
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
