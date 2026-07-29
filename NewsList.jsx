import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import { NEWS_POSTS } from './News.data.jsx'
import { POPULAR } from './BrandData.jsx'
import { pathOf } from './router.jsx'
// News list — marketing-style layout. Currently empty state; renders posts
// from window.NEWS_POSTS when populated.

function NewsList({ onOpenPost, onNav }) {
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
        eyebrow="📰 Полезное"
        title="Новости и гайды"
        subtitle="Жизнь в Испании, маршруты Costa Blanca, советы для туристов и эмигрантов." />

      <div style={wrap}>
        <div style={inner}>
          {posts.length === 0 ? (
            <div style={empty}>Раздел временно пустой — материалы скоро появятся.</div>
          ) : (
            <div style={grid}>
              {posts.map(p => (
                <a key={p.slug} style={card} href={pathOf('news-post', p.slug)}
                   onClick={() => onOpenPost(p.slug)}
                   onMouseEnter={lift} onMouseLeave={drop}>
                  <img src={p.image || DEFAULT_IMG} alt={p.title} loading="lazy" decoding="async" style={cardImg} />
                  <div style={cardBody}>
                    <div style={meta}>{p.date}</div>
                    <h2 style={title}>{p.title}</h2>
                    {p.excerpt && <p style={excerpt}>{p.excerpt}</p>}
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Cross-links to service pages — keeps the news hub connected to the
              money pages and passes crawl equity to the routes/prices. */}
          <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--t2-line)', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2-ink-3)', marginRight: 4 }}>Наши услуги:</span>
            <a href={pathOf('routes')} style={pill}>🚖 Все маршруты трансфера</a>
            <a href={pathOf('price')} style={pill}>💶 Цены</a>
            {(POPULAR || []).slice(0, 4).map(r => (
              <a key={r.slug} href={pathOf('route', r.slug)} style={pill}>Аликанте → {r.ru}</a>
            ))}
            <a href={pathOf('contacts')} style={pill}>📞 Контакты</a>
          </div>
        </div>
      </div>

      <CTABanner onNav={onNav} />
    </>
  );
}

export default NewsList;
