import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import { NEWS_POSTS } from './News.data.jsx'
// News list — marketing-style layout. Currently empty state; renders posts
// from window.NEWS_POSTS when populated.

function NewsList({ onOpenPost, onNav }) {
  const posts = (NEWS_POSTS || []);

  const wrap = { background: '#fff' };
  const inner = { maxWidth: 1100, margin: '0 auto', padding: '64px 24px' };
  const empty = { textAlign: 'center', padding: '40px 0', color: 'var(--t2-ink-3)', fontSize: 16 };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 };
  const card = { background: 'var(--t2-bg)', border: '1px solid var(--t2-line)', borderRadius: 14, padding: '20px 22px', cursor: 'pointer', textDecoration: 'none', display: 'block', boxShadow: 'var(--t2-sh-1)', transition: 'all 220ms cubic-bezier(.2,.7,.2,1)' };
  const lift = e => { e.currentTarget.style.boxShadow = 'var(--t2-sh-3)'; e.currentTarget.style.transform = 'translateY(-2px)'; };
  const drop = e => { e.currentTarget.style.boxShadow = 'var(--t2-sh-1)'; e.currentTarget.style.transform = 'translateY(0)'; };
  const meta = { fontSize: 12, color: 'var(--t2-ink-3)', marginBottom: 8, fontVariantNumeric: 'tabular-nums' };
  const title = { fontFamily: "'Onest',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--t2-ink)', margin: '0 0 8px', letterSpacing: '-.01em', lineHeight: 1.3 };
  const excerpt = { fontSize: 13, lineHeight: 1.55, color: 'var(--t2-ink-2)', margin: 0 };

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
                <a key={p.slug} style={card}
                   onClick={() => onOpenPost(p.slug)}
                   onMouseEnter={lift} onMouseLeave={drop}>
                  <div style={meta}>{p.date}</div>
                  <h2 style={title}>{p.title}</h2>
                  {p.excerpt && <p style={excerpt}>{p.excerpt}</p>}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <CTABanner onNav={onNav} />
    </>
  );
}

export default NewsList;
