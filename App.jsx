import React, { useState, useEffect } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Hero from './Hero.jsx'
import PopularRoutes from './PopularRoutes.jsx'
import WhyUs from './WhyUs.jsx'
import HowItWorks from './HowItWorks.jsx'
import Testimonial from './Testimonial.jsx'
import FAQ from './FAQ.jsx'
import CTABanner from './CTABanner.jsx'
import RoutesPage from './Routes.jsx'
import PricesPage from './Prices.jsx'
import ContactsPage from './Contacts.jsx'
import DriversPage from './Drivers.jsx'
import RoutePage from './RoutePage.jsx'
import IntercityRoute from './IntercityRoute.jsx'
import NewsList from './NewsList.jsx'
import NewsPost from './NewsPost.jsx'
import Anketa from './Anketa.jsx'
import Reveal from './Reveal.jsx'
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
  useEffect(() => { applyHead(getSeo(view, routeSlug, postSlug, lang)); }, [view, routeSlug, postSlug, lang]);

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

  // Unlisted form page: render only the embedded form — no header/footer/chrome.
  if (view === 'anketa') return <Anketa />;

  return (
    <LangContext.Provider value={lang}>
    <div data-screen-label={view} data-route={routeSlug || undefined} data-lang={lang} onClick={onRootClick}>
      <Header view={view} lang={lang} onNav={onNav} onSwitchLang={onSwitchLang} />
      <main>
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
