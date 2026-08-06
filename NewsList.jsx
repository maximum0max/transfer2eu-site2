import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import { NEWS_POSTS, newsField } from './News.data.jsx'
import { POPULAR, cityName } from './BrandData.jsx'
import { pathOf } from './router.jsx'
import { useT, useLang } from './i18n.jsx'
// News list — marketing-style layout. Currently empty state; renders posts
// from window.NEWS_POSTS when populated.
//
// Bilingual: RU default + UK UI strings picked by useT(); post fields (title,
// excerpt) come through newsField() so UK posts show their parallel *_uk copy.
const STR = {
  ru: {
    eyebrow: '📰 Полезное',
    title: 'Новости и гайды',
    subtitle: 'Жизнь в Испании, маршруты Costa Blanca, советы для туристов и эмигрантов.',
    empty: 'Раздел временно пустой — материалы скоро появятся.',
    services: 'Наши услуги:',
    all_routes: '🚖 Все маршруты трансфера',
    prices: '💶 Цены',
    alicante_to: 'Аликанте →',
    contacts: '📞 Контакты',
  },
  uk: {
    eyebrow: '📰 Корисне',
    title: 'Новини та гайди',
    subtitle: 'Життя в Іспанії, маршрути Costa Blanca, поради для туристів та емігрантів.',
    empty: 'Розділ тимчасово порожній — матеріали скоро з’являться.',
    services: 'Наші послуги:',
    all_routes: '🚖 Усі маршрути трансферу',
    prices: '💶 Ціни',
    alicante_to: 'Аліканте →',
    contacts: '📞 Контакти',
  },
};

function NewsList({ onOpenPost, onNav }) {
  const t = useT(STR);
  const lang = useLang();
  const posts = (NEWS_POSTS || []);

  const wrap = { background: '#fff' };
  const inner = { maxWidth: 1100, margin: '0 auto', padding: '64px 24px' };
  const empty = { textAlign: 'center', padding: '40px 0', color: 'var(--t2-ink-3)', fontSize: 16 };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 };
  const card = { background: 'var(--t2-bg)', border: '1px solid var(--t2-line)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', textDecoration: 'none', display: 'flex', flexDirection: 'column', boxShadow: 'var(--t2-sh-1)', transition: 'all 220ms cubic-bezier(.2,.7,.2,1)' };
  const cardImg = { width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block', background: 'var(--t2-bg-2)' };
  const cardBody = { padding: '16px 20px' };
  const DEFAULT_IMG = '/assets/og-image.jpg';
  const lift = e => { e.currentTarget.style.boxShadow = 'var(--t2-sh-3)'; e.currentTarget.style.transform = 'translateY(-2px)'; };
  const drop = e => { e.currentTarget.style.boxShadow = 'var(--t2-sh-1)'; e.currentTarget.style.transform = 'translateY(0)'; };
  const meta = { fontSize: 12, color: 'var(--t2-ink-3)', marginBottom: 8, fontVariantNumeric: 'tabular-nums' };
  const title = { fontFamily: "'Onest',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--t2-ink)', margin: '0 0 8px', letterSpacing: '-.01em', lineHeight: 1.3 };
  const excerpt = { fontSize: 13, lineHeight: 1.55, color: 'var(--t2-ink-2)', margin: 0 };
  const pill = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 999, background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)', color: 'var(--t2-ink-2)', textDecoration: 'none', fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 13.5 };

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle} />

      <div style={wrap}>
        <div style={inner}>
          {posts.length === 0 ? (
            <div style={empty}>{t.empty}</div>
          ) : (
            <div style={grid}>
              {posts.map(p => {
                const heading = newsField(p, 'title', lang);
                const ex = newsField(p, 'excerpt', lang);
                return (
                  <a key={p.slug} style={card} href={pathOf('news-post', p.slug, lang)}
                     onClick={() => onOpenPost(p.slug)}
                     onMouseEnter={lift} onMouseLeave={drop}>
                    <img src={p.image || DEFAULT_IMG} alt={heading} loading="lazy" decoding="async" style={cardImg} />
                    <div style={cardBody}>
                      <div style={meta}>{p.date}</div>
                      <h2 style={title}>{heading}</h2>
                      {ex && <p style={excerpt}>{ex}</p>}
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {/* Cross-links to service pages — keeps the news hub connected to the
              money pages and passes crawl equity to the routes/prices. */}
          <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--t2-line)', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2-ink-3)', marginRight: 4 }}>{t.services}</span>
            <a href={pathOf('routes', null, lang)} style={pill}>{t.all_routes}</a>
            <a href={pathOf('price', null, lang)} style={pill}>{t.prices}</a>
            {(POPULAR || []).slice(0, 4).map(r => (
              <a key={r.slug} href={pathOf('route', r.slug, lang)} style={pill}>{t.alicante_to} {cityName(r, lang)}</a>
            ))}
            <a href={pathOf('contacts', null, lang)} style={pill}>{t.contacts}</a>
          </div>
        </div>
      </div>

      <CTABanner onNav={onNav} />
    </>
  );
}

export default NewsList;
