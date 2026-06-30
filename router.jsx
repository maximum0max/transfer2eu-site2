// Tiny client-side router built on the History API — no dependency.
//
// Every view has a real URL, so each page can be linked, bookmarked, shared and
// indexed independently. App.jsx subscribes to changes; navigation is triggered
// either by the onNav/onSelectRoute/onOpenPost callbacks or by clicking any
// internal <a href="/..."> link (intercepted in App.jsx).
//
// URL scheme:
//   /                     home
//   /marshruty            routes index
//   /price                prices
//   /kontakty             contacts
//   /voditelyam           drivers
//   /novosti              news index
//   /novosti/<slug>       news post
//   /<routeSlug>          route page (41 routes from BrandData)

import { ALL_ROUTES } from './BrandData.jsx';
import { NEWS_POSTS } from './News.data.jsx';

const ROUTE_SLUGS = new Set(ALL_ROUTES.map((r) => r.slug));
const NEWS_SLUGS = new Set((NEWS_POSTS || []).map((p) => p.slug));

// view → static path (dynamic views handled in pathOf)
const STATIC_PATH = {
  home: '/',
  routes: '/marshruty',
  price: '/price',
  contacts: '/kontakty',
  drivers: '/voditelyam',
  news: '/novosti',
};

export function pathOf(view, slug) {
  if (view === 'route') return '/' + slug;
  if (view === 'news-post') return '/novosti/' + slug;
  return STATIC_PATH[view] || '/';
}

// pathname → { view, routeSlug?, postSlug? }
export function parsePath(pathname) {
  let p = pathname || '/';
  try { p = decodeURIComponent(p); } catch (_) { /* keep raw */ }
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);

  if (p === '/') return { view: 'home' };
  if (p === '/marshruty') return { view: 'routes' };
  if (p === '/price') return { view: 'price' };
  if (p === '/kontakty') return { view: 'contacts' };
  if (p === '/voditelyam') return { view: 'drivers' };
  if (p === '/novosti') return { view: 'news' };

  if (p.startsWith('/novosti/')) {
    const slug = p.slice('/novosti/'.length);
    if (NEWS_SLUGS.has(slug)) return { view: 'news-post', postSlug: slug };
    return { view: 'notfound' };
  }

  const seg = p.slice(1);
  if (!seg.includes('/') && ROUTE_SLUGS.has(seg)) return { view: 'route', routeSlug: seg };

  return { view: 'notfound' };
}

// --- subscription so App re-renders on programmatic navigation ---
const listeners = new Set();
function notify() { listeners.forEach((fn) => fn()); }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function navigatePath(path) {
  if (path !== window.location.pathname) {
    window.history.pushState({}, '', path);
  }
  window.scrollTo(0, 0);
  notify();
}

export function navigate(view, slug) {
  navigatePath(pathOf(view, slug));
}
