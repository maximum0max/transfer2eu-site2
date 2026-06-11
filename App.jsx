import React, { useState, useEffect } from 'react'
import { findRoute } from './BrandData.jsx'
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
import NewsList from './NewsList.jsx'
import NewsPost from './NewsPost.jsx'
import Reveal from './Reveal.jsx'

// Per-view document.title — improves UX and is read by some AI crawlers.
const TITLES = {
  'home':      'Трансфер из аэропорта Аликанте (ALC) от 25€ · Transfer2EU',
  'routes':    'Маршруты трансфера из Аликанте — 40+ направлений · Transfer2EU',
  'price':     'Цены на трансфер из аэропорта Аликанте — фикс-цена · Transfer2EU',
  'contacts':  'Контакты Transfer2EU — WhatsApp, телефон, e-mail',
  'drivers':   'Водителям — присоединяйтесь к команде · Transfer2EU',
  'route':     'Трансфер Аликанте · Transfer2EU',
  'news':      'Полезное — новости и гайды · Transfer2EU',
  'news-post': 'Материал · Transfer2EU',
};

export default function App() {
  const [view, setView]           = useState('home');
  const [routeSlug, setRouteSlug] = useState(null);
  const [postSlug, setPostSlug]   = useState(null);

  useEffect(() => {
    let title = TITLES[view] || TITLES.home;
    if (view === 'route') {
      const r = findRoute(routeSlug);
      if (r) title = `Трансфер Аликанте → ${r.ru} от ${r.price}€ · Transfer2EU`;
    }
    document.title = title;
  }, [view, routeSlug]);

  const onNav = (v) => { setView(v); window.scrollTo(0, 0); };
  const onSelectRoute = (slug) => { setRouteSlug(slug); setView('route'); window.scrollTo(0, 0); };
  const onOpenPost    = (slug) => { setPostSlug(slug); setView('news-post'); window.scrollTo(0, 0); };

  return (
    <div data-screen-label={view}>
      <Header view={view} onNav={onNav} />
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
        {view === 'news'      && <NewsList onOpenPost={onOpenPost} onNav={onNav} />}
        {view === 'news-post' && <NewsPost slug={postSlug} onNav={onNav} />}
      </main>
      <Footer onNav={onNav} onSelectRoute={onSelectRoute} />
    </div>
  );
}
