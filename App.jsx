import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Hero from './Hero.jsx'
import PopularRoutes from './PopularRoutes.jsx'
import WhyUs from './WhyUs.jsx'
import HowItWorks from './HowItWorks.jsx'
import Testimonial from './Testimonial.jsx'
import FAQ from './FAQ.jsx'
import CTABanner from './CTABanner.jsx'
import Reveal from './Reveal.jsx'
// Route-level code splitting: each view component (and its heavy data — route
// articles, city guides, the full news dataset) becomes its own lazy chunk,
// loaded only when the visitor actually opens that page. The home page stays
// eager so first paint needs a fraction of the JS it used to.
const RoutesPage = lazy(() => import('./Routes.jsx'))
const PricesPage = lazy(() => import('./Prices.jsx'))
const ContactsPage = lazy(() => import('./Contacts.jsx'))
const DriversPage = lazy(() => import('./Drivers.jsx'))
const RoutePage = lazy(() => import('./RoutePage.jsx'))
const IntercityRoute = lazy(() => import('./IntercityRoute.jsx'))
const NewsList = lazy(() => import('./NewsList.jsx'))
const NewsPost = lazy(() => import('./NewsPost.jsx'))
const Anketa = lazy(() => import('./Anketa.jsx'))
import { parsePath, navigate, navigatePath, subscribe } from './router.jsx'
import { getSeo, applyHead } from './seo.jsx'
import { LangContext, useLang, localizePath, splitLang, switchLangPath, saveLang } from './i18n.jsx'

export default function App() {
  // Current location is derived from the URL, not from a click handler. This is
  // what gives every view its own address (bookmarkable, shareable, indexable).
  const [route, setRoute] = useState(() => parsePath(window.location.pathname));

  useEffect(() => {
    const sync = () => setRoute(parsePath(window.location.pathname));
    const unsub = subscribe(sync);          // programmatic navigate()
    window.addEventListener('popstate', sync); // browser back/forward
    return () => { unsub(); window.removeEventListener('popstate', sync); };
  }, []);

  const { view } = route;
  const lang = route.lang || 'ru';
  const routeSlug = route.routeSlug || null;
  const postSlug = route.postSlug || null;

  // Per-page <head>: title, description, canonical, Open Graph, hreflang.
  // getSeo is async (it may dynamically import page data); a token guards
  // against a slow import resolving after the user has navigated elsewhere.
  const seoTick = useRef(0);
  useEffect(() => {
    const tick = ++seoTick.current;
    getSeo(view, routeSlug, postSlug, lang).then((seo) => {
      if (seoTick.current === tick) applyHead(seo);
    }).catch(() => { /* keep previous head on failure */ });
  }, [view, routeSlug, postSlug, lang]);

  // Same callback signatures the components already use — navigation now keeps
  // the active language (RU stays on bare URLs, UK stays under /uk).
  const onNav = (v) => navigate(v, null, lang);
  const onSelectRoute = (slug) => navigate('route', slug, lang);
  const onOpenPost = (slug) => navigate('news-post', slug, lang);

  // Manual language switch: remember the choice and jump to the same page in the
  // other language.
  const onSwitchLang = (target) => {
    saveLang(target);
    navigatePath(switchLangPath(window.location.pathname, target));
  };

  // Intercept clicks on internal <a href="/..."> so they navigate via the router
  // (no full reload) while remaining real, crawlable links in the HTML.
  const onRootClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href[0] !== '/') return;        // only same-site absolute paths
    if (a.target === '_blank') return;
    e.preventDefault();
    // Keep the visitor in the current language for internal links that were
    // built without a language prefix. A link that opts out (the switcher, or a
    // deliberate cross-language link) carries data-lang and is left untouched.
    let dest = href;
    if (lang === 'uk' && !a.hasAttribute('data-lang') && splitLang(href).lang === 'ru') {
      dest = localizePath(href, 'uk');
    }
    navigatePath(dest);
  };

  // Lightweight placeholder while a lazy view chunk downloads — reserves
  // vertical space (no layout jump) so the header/footer stay put.
  const Fallback = () => (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <span style={{ width: 34, height: 34, borderRadius: '50%', border: '3px solid var(--t2-line-2)', borderTopColor: 'var(--t2-red)', animation: 't2Spin .8s linear infinite' }} />
    </div>
  );

  // Unlisted form page: render only the embedded form — no header/footer/chrome.
  if (view === 'anketa') return <Suspense fallback={<Fallback />}><Anketa /></Suspense>;

  return (
    <LangContext.Provider value={lang}>
    <div data-screen-label={view} data-route={routeSlug || undefined} data-lang={lang} onClick={onRootClick}>
      <Header view={view} lang={lang} onNav={onNav} onSwitchLang={onSwitchLang} />
      <main>
        <Suspense fallback={<Fallback />}>
        {view === 'home' && (
          <>
            <Hero onBook={() => onNav('routes')} />
            <Reveal><PopularRoutes onSelectRoute={onSelectRoute} onNav={onNav} /></Reveal>
            <Reveal><WhyUs /></Reveal>
            <Reveal><HowItWorks /></Reveal>
            <Reveal><Testimonial /></Reveal>
            <Reveal><FAQ /></Reveal>
            <Reveal><CTABanner onNav={onNav} /></Reveal>
          </>
        )}
        {view === 'routes'    && <RoutesPage   onNav={onNav} onSelectRoute={onSelectRoute} />}
        {view === 'price'     && <PricesPage   onNav={onNav} onSelectRoute={onSelectRoute} />}
        {view === 'contacts'  && <ContactsPage onNav={onNav} />}
        {view === 'drivers'   && <DriversPage  onNav={onNav} />}
        {view === 'route'     && <RoutePage slug={routeSlug} onNav={onNav} onSelectRoute={onSelectRoute} />}
        {view === 'intercity' && <IntercityRoute slug={routeSlug} onNav={onNav} />}
        {view === 'news'      && <NewsList onOpenPost={onOpenPost} onNav={onNav} />}
        {view === 'news-post' && <NewsPost slug={postSlug} onNav={onNav} />}
        {view === 'notfound'  && <NotFound />}
        </Suspense>
      </main>
      <Footer onNav={onNav} onSelectRoute={onSelectRoute} />
    </div>
    </LangContext.Provider>
  );
}

function NotFound() {
  const lang = useLang();
  const t = lang === 'uk'
    ? { h: 'Сторінку не знайдено', p: 'Можливо, посилання застаріле. Поверніться на головну або до списку маршрутів.', btn: 'На головну' }
    : { h: 'Страница не найдена', p: 'Возможно, ссылка устарела. Вернитесь на главную или к списку маршрутов.', btn: 'На главную' };
  return (
    <section style={{ padding: '96px 24px', textAlign: 'center', background: '#fff' }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🧭</div>
      <h1 style={{ fontFamily: "'Onest',sans-serif", fontSize: 30, color: 'var(--t2-ink)', margin: '0 0 8px' }}>
        {t.h}
      </h1>
      <p style={{ color: 'var(--t2-ink-3)', margin: '0 0 24px' }}>
        {t.p}
      </p>
      <a href={localizePath('/', lang)} style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 12, background: 'var(--t2-red)', color: '#fff', textDecoration: 'none', fontFamily: "'Inter',system-ui", fontWeight: 700 }}>
        {t.btn}
      </a>
    </section>
  );
}
