// Per-page SEO. Each view gets its own <title>, meta description, canonical URL,
// Open Graph tags and hreflang alternates, applied to <head> on every
// navigation. index.html ships the home-page RU defaults; applyHead() overwrites
// them as the user navigates so crawlers that render JS (and shared links) see
// page-specific, per-language metadata.
//
// Bilingual: getSeo takes a `lang` ('ru' default, 'uk'). RU keeps its existing
// URLs; UK lives under /uk. Ukrainian metadata falls back to Russian wherever a
// translation isn't in place yet.

// NOTE: this module must stay LIGHT. It is imported by App.jsx (eagerly), so any
// static import here ships in the main bundle on every page load. The heavy data
// modules (News.data with all post bodies, RouteArticles.data with the 500 KB
// long-form articles, Intercity.data) are therefore loaded lazily via dynamic
// import() inside getSeo() — they only load when the corresponding view needs
// them, and Vite turns them into separately-cached chunks.
import { findRoute, cityName } from './BrandData.jsx';
import { pathOf } from './router.jsx';
import { localizePath, UK_ENABLED } from './i18n.jsx';

const SITE = 'https://www.transfer2eu.com';
const SUFFIX = ' · Transfer2EU';

const STATIC_SEO = {
  ru: {
    home: {
      title: 'Трансфер из аэропорта Аликанте (ALC) 25€' + SUFFIX,
      description: 'Трансфер из аэропорта Аликанте (ALC): Бенидорм 60€, Кальпе 80€, Валенсия 150€ и 40+ городов Costa Blanca. Фикс-цена, русскоязычный водитель, 24/7.',
    },
    routes: {
      title: 'Маршруты трансфера из Аликанте — 40+ направлений' + SUFFIX,
      description: 'Все направления трансфера из аэропорта Аликанте (ALC): 40+ маршрутов по Costa Blanca, Мурсии и Валенсии с фиксированной ценой за автомобиль.',
    },
    price: {
      title: 'Цены на трансфер из аэропорта Аликанте' + SUFFIX,
      description: 'Цены на трансфер из аэропорта Аликанте — фикс-цена за авто: Бенидорм 60€, Кальпе 80€, Торревьеха 60€, Мурсия 75€, Валенсия 150€ и 40+ направлений.',
    },
    contacts: {
      title: 'Контакты Transfer2EU — WhatsApp, телефон, e-mail',
      description: 'Связаться с Transfer2EU: WhatsApp и телефон +34 651 011 911, e-mail. Заказ трансфера из аэропорта Аликанте круглосуточно, русскоязычный водитель.',
    },
    drivers: {
      title: 'Водителям — присоединяйтесь к команде' + SUFFIX,
      description: 'Работа водителем в Transfer2EU: стабильные заказы трансферов по Costa Blanca, прозрачные условия и выплаты. Присоединяйтесь к команде.',
    },
    news: {
      title: 'Полезное — новости и гайды' + SUFFIX,
      description: 'Новости и гайды Transfer2EU: жизнь в Испании, маршруты Costa Blanca, советы туристам и эмигрантам.',
    },
  },
  uk: {
    home: {
      title: 'Трансфер з аеропорту Аліканте (ALC) 25€' + SUFFIX,
      description: 'Трансфер з аеропорту Аліканте (ALC): Бенідорм 60€, Кальпе 80€, Валенсія 150€ та 40+ міст Costa Blanca. Фіксована ціна, україномовний водій, 24/7.',
    },
    routes: {
      title: 'Маршрути трансферу з Аліканте — 40+ напрямків' + SUFFIX,
      description: 'Усі напрямки трансферу з аеропорту Аліканте (ALC): 40+ маршрутів по Costa Blanca, Мурсії та Валенсії з фіксованою ціною за автомобіль.',
    },
    price: {
      title: 'Ціни на трансфер з аеропорту Аліканте' + SUFFIX,
      description: 'Ціни на трансфер з аеропорту Аліканте — фіксована ціна за авто: Бенідорм 60€, Кальпе 80€, Торревʼєха 60€, Мурсія 75€, Валенсія 150€ та 40+ напрямків.',
    },
    contacts: {
      title: 'Контакти Transfer2EU — WhatsApp, телефон, e-mail',
      description: 'Звʼязатися з Transfer2EU: WhatsApp і телефон +34 651 011 911, e-mail. Замовлення трансферу з аеропорту Аліканте цілодобово, україномовний водій.',
    },
    drivers: {
      title: 'Водіям — приєднуйтесь до команди' + SUFFIX,
      description: 'Робота водієм у Transfer2EU: стабільні замовлення трансферів по Costa Blanca, прозорі умови та виплати. Приєднуйтесь до команди.',
    },
    news: {
      title: 'Корисне — новини та гайди' + SUFFIX,
      description: 'Новини та гайди Transfer2EU: життя в Іспанії, маршрути Costa Blanca, поради туристам та емігрантам.',
    },
  },
};

// Google truncates the snippet around 160 chars and the title around 60, so the
// generated ones stay inside that budget.
const withSuffix = (t) => (t.length + SUFFIX.length <= 60 ? t + SUFFIX : t);

const clampDesc = (s, max = 160) => {
  s = String(s || '').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > 100 ? cut.lastIndexOf(' ') : cut.length).trim() + '…';
};

// News headlines from the bot can run 100+ chars, which Google truncates mid-
// word. Trim to the ~60-char title budget at a word boundary so the front-loaded
// keyword survives. A post may override with its own seoTitle (per language).
const clampTitle = (s, max = 60) => {
  s = String(s || '').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const sp = cut.lastIndexOf(' ');
  return (sp > 40 ? cut.slice(0, sp) : cut).trim() + '…';
};

// hreflang alternates for a language-agnostic base path (ru path == agnostic).
// Only emitted once the Ukrainian site is live (UK_ENABLED); noindex pages and
// the notfound view pass basePath=null and get none.
function alternatesFor(basePath) {
  if (!UK_ENABLED || !basePath) return null;
  return {
    ru: SITE + basePath,
    uk: SITE + localizePath(basePath, 'uk'),
    xdefault: SITE + basePath,
  };
}

export async function getSeo(view, routeSlug, postSlug, lang = 'ru') {
  const L = lang === 'uk' ? 'uk' : 'ru';
  const uk = L === 'uk';

  if (view === 'route') {
    const r = findRoute(routeSlug);
    if (r) {
      const base = pathOf('route', r.slug, 'ru');
      // Lazy: RouteArticles.data carries 500 KB of long-form SEO articles. It is
      // only fetched when the user actually opens a route page (RoutePage imports
      // the same module, so this is never a separate extra network request).
      const { getRouteMeta } = await import('./RouteArticles.data.jsx');
      const ov = getRouteMeta(r.slug, L) || {};
      const city = cityName(r, L);
      const dflt = uk
        ? {
            title: `Трансфер Аліканте → ${city} ${r.price}€`,
            description: `Трансфер з аеропорту Аліканте (ALC) в ${city} — фікс-ціна ${r.price}€ за авто, ~${r.time} хв у дорозі. Україномовний водій, зустріч з табличкою, 24/7.`,
          }
        : {
            title: `Трансфер Аликанте → ${r.ru} ${r.price}€`,
            description: `Трансфер из аэропорта Аликанте (ALC) в ${r.ru} — фикс-цена ${r.price}€ за авто, ~${r.time} мин в пути. Русскоязычный водитель, встреча с табличкой, 24/7.`,
          };
      return {
        lang: L,
        title: withSuffix(ov.title || dflt.title),
        description: clampDesc(ov.description || dflt.description),
        path: localizePath(base, L),
        alternates: alternatesFor(base),
      };
    }
  }

  if (view === 'intercity') {
    // Lazy: Intercity.data is only needed for intercity views.
    const { findIntercity } = await import('./Intercity.data.jsx');
    const r = findIntercity(routeSlug);
    if (r) {
      const base = pathOf('intercity', r.slug, 'ru');
      return {
        lang: L,
        title: withSuffix((uk && r.title_uk) || `Такси ${r.from} → ${r.to} ${r.price}€`),
        description: (uk && r.description_uk) || r.description,
        path: localizePath(base, L),
        alternates: alternatesFor(base),
      };
    }
  }

  if (view === 'news-post') {
    // Lazy: News.data carries all post bodies (~365 KB) — only loaded when a
    // news page is actually visited. NewsList/NewsPost share this chunk.
    const { NEWS_POSTS, newsField } = await import('./News.data.jsx');
    const post = (NEWS_POSTS || []).find((p) => p.slug === postSlug);
    if (post) {
      const base = pathOf('news-post', post.slug, 'ru');
      const seoTitle = newsField(post, 'seoTitle', L);
      const title = newsField(post, 'title', L);
      const excerpt = newsField(post, 'excerpt', L);
      const fallbackDesc = uk
        ? 'Матеріал Transfer2EU — новини та гайди про життя в Іспанії та трансфери по Costa Blanca.'
        : 'Материал Transfer2EU — новости и гайды о жизни в Испании и трансферах по Costa Blanca.';
      return {
        lang: L,
        title: withSuffix(seoTitle || clampTitle(title)),
        description: clampDesc(excerpt || fallbackDesc),
        path: localizePath(base, L),
        alternates: alternatesFor(base),
        published: isoDate(post.date),
      };
    }
  }

  // Unlisted embedded-form page — keep it out of search indexes.
  if (view === 'anketa') return {
    lang: L,
    title: (uk ? 'Анкета' : 'Анкета') + SUFFIX,
    description: uk ? 'Форма для заповнення.' : 'Форма для заполнения.',
    path: localizePath('/anketa', L),
    noindex: true,
  };

  const s = (STATIC_SEO[L] && STATIC_SEO[L][view]) || (STATIC_SEO.ru[view]);
  if (s) {
    const base = pathOf(view, null, 'ru');
    return { lang: L, ...s, path: localizePath(base, L), alternates: alternatesFor(base) };
  }

  return {
    lang: L,
    title: (uk ? 'Сторінку не знайдено' : 'Страница не найдена') + SUFFIX,
    description: uk
      ? 'Запитану сторінку не знайдено. Перейдіть на головну, щоб замовити трансфер з аеропорту Аліканте.'
      : 'Запрошенная страница не найдена. Перейдите на главную, чтобы заказать трансфер из аэропорта Аликанте.',
    path: null,
    noindex: true,
  };
}

// The news bot writes human dates ("29 июня 2026"); OG/schema need ISO. Tiny
// mirror of the same helper in scripts/prerender.mjs.
const RU_MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля',
  'августа', 'сентября', 'октября', 'ноября', 'декабря'];
function isoDate(human) {
  const m = String(human || '').match(/(\d{1,2})\s+([а-яё]+)\s+(\d{4})/i);
  if (!m) return null;
  const month = RU_MONTHS.indexOf(m[2].toLowerCase());
  if (month < 0) return null;
  const d = new Date(Date.UTC(+m[3], month, +m[1]));
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

// --- DOM helpers: reuse the tag if it already exists in index.html, else create ---
function ensure(selector, make) {
  let el = document.head.querySelector(selector);
  if (!el) { el = make(); document.head.appendChild(el); }
  return el;
}
function metaName(name) {
  return ensure(`meta[name="${name}"]`, () => {
    const m = document.createElement('meta'); m.setAttribute('name', name); return m;
  });
}
function metaProp(prop) {
  return ensure(`meta[property="${prop}"]`, () => {
    const m = document.createElement('meta'); m.setAttribute('property', prop); return m;
  });
}
function linkRel(rel) {
  return ensure(`link[rel="${rel}"]`, () => {
    const l = document.createElement('link'); l.setAttribute('rel', rel); return l;
  });
}
// hreflang alternates are keyed by hreflang value, not just rel="alternate".
function linkAlternate(hreflang) {
  return ensure(`link[rel="alternate"][hreflang="${hreflang}"]`, () => {
    const l = document.createElement('link');
    l.setAttribute('rel', 'alternate'); l.setAttribute('hreflang', hreflang); return l;
  });
}

export function applyHead(seo) {
  const url = SITE + (seo.path || window.location.pathname);
  document.title = seo.title;
  if (seo.lang) document.documentElement.setAttribute('lang', seo.lang);
  metaName('description').setAttribute('content', seo.description);
  metaName('robots').setAttribute('content', seo.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large');
  linkRel('canonical').setAttribute('href', url);
  metaProp('og:url').setAttribute('content', url);
  metaProp('og:title').setAttribute('content', seo.title);
  metaProp('og:description').setAttribute('content', seo.description);
  metaProp('og:locale').setAttribute('content', seo.lang === 'uk' ? 'uk_UA' : 'ru_RU');

  // News articles carry publish timestamps (Open Graph "article" type).
  if (seo.published) {
    metaProp('article:published_time').setAttribute('content', seo.published);
    metaProp('article:modified_time').setAttribute('content', seo.published);
  }

  // hreflang: point ru/uk/x-default at their URLs when the UK site is live,
  // otherwise keep the single ru self-reference index.html ships with.
  if (seo.alternates) {
    linkAlternate('ru').setAttribute('href', seo.alternates.ru);
    linkAlternate('uk').setAttribute('href', seo.alternates.uk);
    linkAlternate('x-default').setAttribute('href', seo.alternates.xdefault);
  } else {
    linkAlternate('ru').setAttribute('href', url);
    linkAlternate('x-default').setAttribute('href', url);
  }
}
