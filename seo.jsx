// Per-page SEO. Each view gets its own <title>, meta description, canonical URL
// and Open Graph tags, applied to <head> on every navigation. index.html ships
// the home-page defaults; applyHead() overwrites them as the user navigates so
// crawlers that render JS (and shared links) see page-specific metadata.

import { findRoute } from './BrandData.jsx';
import { NEWS_POSTS } from './News.data.jsx';
import { pathOf } from './router.jsx';

const SITE = 'https://www.transfer2eu.com';
const SUFFIX = ' · Transfer2EU';

const STATIC_SEO = {
  home: {
    title: 'Трансфер из аэропорта Аликанте (ALC) от 25€' + SUFFIX,
    description: 'Частный трансфер из аэропорта Аликанте (ALC) в Бенидорм 50€, Кальпе 60€, Торревьеху 60€, Валенсию 150€ и 40+ городов Costa Blanca. Фиксированная цена, русскоязычный водитель, встреча с табличкой, работаем 24/7.',
  },
  routes: {
    title: 'Маршруты трансфера из Аликанте — 40+ направлений' + SUFFIX,
    description: 'Все направления трансфера из аэропорта Аликанте (ALC): Costa Blanca, Мурсия и Валенсия — 40+ маршрутов с фиксированной ценой за автомобиль. Бенидорм, Кальпе, Торревьеха, Дения, Валенсия и другие.',
  },
  price: {
    title: 'Цены на трансфер из аэропорта Аликанте — фикс-цена' + SUFFIX,
    description: 'Актуальные цены на трансфер из аэропорта Аликанте: фиксированная стоимость за автомобиль. Бенидорм 50€, Кальпе 60€, Торревьеха 60€, Мурсия 75€, Валенсия 150€ и 40+ направлений.',
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
};

export function getSeo(view, routeSlug, postSlug) {
  if (view === 'route') {
    const r = findRoute(routeSlug);
    if (r) return {
      title: `Трансфер Аликанте → ${r.ru} от ${r.price}€` + SUFFIX,
      description: `Частный трансфер из аэропорта Аликанте (ALC) в ${r.ru} — фиксированная цена ${r.price}€ за автомобиль, ~${r.time} мин в пути. Русскоязычный водитель, встреча с табличкой, бесплатное детское кресло, оплата онлайн или наличными.`,
      path: pathOf('route', r.slug),
    };
  }
  if (view === 'news-post') {
    const post = (NEWS_POSTS || []).find((p) => p.slug === postSlug);
    if (post) return {
      title: post.title + SUFFIX,
      description: post.excerpt || 'Материал Transfer2EU — новости и гайды о жизни в Испании и трансферах по Costa Blanca.',
      path: pathOf('news-post', post.slug),
    };
  }
  const s = STATIC_SEO[view];
  if (s) return { ...s, path: pathOf(view) };

  return {
    title: 'Страница не найдена' + SUFFIX,
    description: 'Запрошенная страница не найдена. Перейдите на главную, чтобы заказать трансфер из аэропорта Аликанте.',
    path: null,
    noindex: true,
  };
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

export function applyHead(seo) {
  const url = SITE + (seo.path || window.location.pathname);
  document.title = seo.title;
  metaName('description').setAttribute('content', seo.description);
  metaName('robots').setAttribute('content', seo.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large');
  linkRel('canonical').setAttribute('href', url);
  metaProp('og:url').setAttribute('content', url);
  metaProp('og:title').setAttribute('content', seo.title);
  metaProp('og:description').setAttribute('content', seo.description);
}
