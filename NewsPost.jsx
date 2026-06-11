import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import { NEWS_POSTS } from './News.data.jsx'

function NewsPost({ slug, onNav }) {
  const posts = (NEWS_POSTS || []);
  const post = posts.find(p => p.slug === slug);

  const wrap = { background: '#fff' };
  const inner = { maxWidth: 760, margin: '0 auto', padding: '64px 24px' };
  const meta = { fontSize: 13, color: 'var(--t2-ink-3)', marginBottom: 18, fontVariantNumeric: 'tabular-nums' };
  const lede = { fontFamily: "'Inter',system-ui", fontSize: 18, lineHeight: 1.6, color: 'var(--t2-ink-2)', margin: '0 0 28px' };
  const p  = { fontFamily: "'Inter',system-ui", fontSize: 17, lineHeight: 1.7, color: 'var(--t2-ink-2)', margin: '0 0 16px' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--t2-ink)', margin: '32px 0 12px', letterSpacing: '-.01em' };
  const h3 = { fontFamily: "'Onest',sans-serif", fontSize: 19, fontWeight: 700, color: 'var(--t2-ink)', margin: '24px 0 10px' };
  const ul = { fontFamily: "'Inter',system-ui", fontSize: 17, lineHeight: 1.7, color: 'var(--t2-ink-2)', margin: '0 0 16px', paddingLeft: 22 };
  const back = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--t2-red)', cursor: 'pointer', background: 'transparent', border: 0, padding: 0, marginBottom: 16 };

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
          <button style={back} onClick={() => onNav('news')}>← Все материалы</button>
          {post.body
            ? post.body.map(renderBlock)
            : <div style={{ ...p, color: 'var(--t2-ink-3)', fontStyle: 'italic' }}>Полная версия материала готовится.</div>}
        </div>
      </div>
      <CTABanner onNav={onNav} />
    </>
  );
}

export default NewsPost;
