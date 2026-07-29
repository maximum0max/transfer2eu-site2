import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import { NEWS_POSTS } from './News.data.jsx'
import { POPULAR } from './BrandData.jsx'
import { pathOf } from './router.jsx'

function NewsPost({ slug, onNav }) {
  const posts = (NEWS_POSTS || []);
  const post = posts.find(p => p.slug === slug);

  // Onward internal links so no article is a dead end: the next 3 posts (cyclic
  // — every post links forward, forming a crawlable chain) + 4 popular routes.
  const idx = posts.findIndex(p => p.slug === slug);
  const related = [];
  for (let k = 1; related.length < 3 && k < posts.length; k++) {
    const p = posts[(idx + k) % posts.length];
    if (p && p.slug !== slug) related.push(p);
  }
  const routeLinks = (POPULAR || []).slice(0, 4);

  const wrap = { background: '#fff' };
  const inner = { maxWidth: 760, margin: '0 auto', padding: '64px 24px' };
  const meta = { fontSize: 13, color: 'var(--t2-ink-3)', marginBottom: 18, fontVariantNumeric: 'tabular-nums' };
  const lede = { fontFamily: "'Inter',system-ui", fontSize: 18, lineHeight: 1.6, color: 'var(--t2-ink-2)', margin: '0 0 28px' };
  const p  = { fontFamily: "'Inter',system-ui", fontSize: 17, lineHeight: 1.7, color: 'var(--t2-ink-2)', margin: '0 0 16px' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--t2-ink)', margin: '32px 0 12px', letterSpacing: '-.01em' };
  const h3 = { fontFamily: "'Onest',sans-serif", fontSize: 19, fontWeight: 700, color: 'var(--t2-ink)', margin: '24px 0 10px' };
  const ul = { fontFamily: "'Inter',system-ui", fontSize: 17, lineHeight: 1.7, color: 'var(--t2-ink-2)', margin: '0 0 16px', paddingLeft: 22 };
  const back = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--t2-red)', cursor: 'pointer', background: 'transparent', border: 0, padding: 0, marginBottom: 16, textDecoration: 'none' };
  const pill = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 999, background: '#fff', border: '1px solid var(--t2-line)', color: 'var(--t2-ink-2)', textDecoration: 'none', fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 13.5 };
  const relCard = { display: 'block', padding: '16px 18px', borderRadius: 14, background: '#fff', border: '1px solid var(--t2-line)', textDecoration: 'none', boxShadow: 'var(--t2-sh-1)' };
  const heroImg = { width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 18, display: 'block', margin: '0 0 24px', background: 'var(--t2-bg-2)', boxShadow: 'var(--t2-sh-2)' };
  const DEFAULT_IMG = '/assets/og-image.jpg';

  if (!post) {
    return (
      <>
        <PageHero eyebrow="📰 Полезное" title="Материал не найден" subtitle="Попробуйте выбрать материал из списка." />
        <div style={inner}>
          <button style={back} onClick={() => onNav('news')}>← Все материалы</button>
        </div>
        <CTABanner onNav={onNav} />
      </>
    );
  }

  const renderBlock = (b, i) => {
    switch (b.type) {
      case 'h2': return <h2 key={i} style={h2}>{b.text}</h2>;
      case 'h3': return <h3 key={i} style={h3}>{b.text}</h3>;
      case 'p':  return <p  key={i} style={p}>{b.text}</p>;
      case 'ul': return <ul key={i} style={ul}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: 6 }}>{it}</li>)}</ul>;
      default:   return null;
    }
  };

  return (
    <>
      <PageHero eyebrow={post.date || '📰 Материал'} title={post.title} subtitle={post.excerpt} />
      <div style={wrap}>
        <div style={inner}>
          <a style={back} href={pathOf('news')}>← Все материалы</a>
          <img src={post.image || DEFAULT_IMG} alt={post.title} style={heroImg} fetchPriority="high" />
          {post.body
            ? post.body.map(renderBlock)
            : <div style={{ ...p, color: 'var(--t2-ink-3)', fontStyle: 'italic' }}>Полная версия материала готовится.</div>}

          {/* Contextual internal links — services & popular routes */}
          <div style={{ marginTop: 44, padding: '24px 26px', borderRadius: 16, background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)' }}>
            <div style={{ fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--t2-ink)', margin: '0 0 6px' }}>
              Планируете поездку по Costa Blanca?
            </div>
            <p style={{ fontSize: 14, color: 'var(--t2-ink-3)', margin: '0 0 16px', lineHeight: 1.55 }}>
              Закажите трансфер из аэропорта Аликанте (ALC) с фиксированной ценой за автомобиль и русскоязычным водителем.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <a href={pathOf('routes')} style={pill}>🚖 Все маршруты трансфера</a>
              <a href={pathOf('price')} style={pill}>💶 Цены на трансфер</a>
              {routeLinks.map(r => (
                <a key={r.slug} href={pathOf('route', r.slug)} style={pill}>📍 Аликанте → {r.ru} · {r.price}€</a>
              ))}
              <a href={pathOf('contacts')} style={pill}>📞 Контакты 24/7</a>
            </div>
          </div>

          {/* Related posts — onward links so the article isn't a dead end */}
          {related.length > 0 && (
            <div style={{ marginTop: 44 }}>
              <h2 style={h2}>Читайте также</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {related.map(rp => (
                  <a key={rp.slug} href={pathOf('news-post', rp.slug)} style={relCard}>
                    <div style={{ fontSize: 12, color: 'var(--t2-ink-3)', marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>{rp.date}</div>
                    <div style={{ fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--t2-ink)', lineHeight: 1.35 }}>{rp.title}</div>
                    {rp.excerpt && <div style={{ fontSize: 13, color: 'var(--t2-ink-2)', marginTop: 6, lineHeight: 1.5 }}>{rp.excerpt}</div>}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <CTABanner onNav={onNav} />
    </>
  );
}

export default NewsPost;
