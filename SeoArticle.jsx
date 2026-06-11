import React from 'react'
// SeoArticle — compact, collapsible SEO body for the Routes / Prices catalog
// pages. The full text is always rendered in the DOM (crawlers + AI engines
// read it); the collapse only clips it visually so the page stays compact.
// Content shape matches RouteData / News.data: typed blocks h2 / h3 / p / ul.

function SeoArticle({ eyebrow, title, blocks, intro = 2 }) {
  const [open, setOpen] = React.useState(false);

  // How many leading blocks stay visible while collapsed.
  const cutoff = Math.max(intro, 0);
  const collapsible = blocks.length > cutoff;

  const wrap = { padding: '64px 32px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 820, margin: '0 auto' };
  const head = { marginBottom: 20 };
  const eyebrowStyle = { fontSize: 11, fontWeight: 800, color: 'var(--t2-red)', letterSpacing: '.14em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(22px, 2.8vw, 30px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 0', lineHeight: 1.15 };

  const body = {
    position: 'relative',
    maxHeight: open || !collapsible ? 'none' : 280,
    overflow: 'hidden',
  };
  const fade = {
    display: open || !collapsible ? 'none' : 'block',
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 120,
    background: 'linear-gradient(180deg, rgba(246,247,249,0) 0%, var(--t2-bg-2) 86%)',
    pointerEvents: 'none',
  };

  const blockH3 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--t2-ink)', margin: '22px 0 8px', letterSpacing: '-.01em' };
  const blockH2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--t2-ink)', margin: '24px 0 10px', letterSpacing: '-.01em' };
  const blockP = { fontFamily: "'Inter',system-ui", fontSize: 14.5, lineHeight: 1.7, color: 'var(--t2-ink-2)', margin: '0 0 12px' };
  const blockUl = { fontFamily: "'Inter',system-ui", fontSize: 14.5, lineHeight: 1.7, color: 'var(--t2-ink-2)', margin: '0 0 12px', paddingLeft: 20 };

  const renderBlock = (b, i) => {
    switch (b.type) {
      case 'h2': return <h2 key={i} style={blockH2}>{b.text}</h2>;
      case 'h3': return <h3 key={i} style={blockH3}>{b.text}</h3>;
      case 'p':  return <p  key={i} style={blockP}>{b.text}</p>;
      case 'ul': return <ul key={i} style={blockUl}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: 5 }}>{it}</li>)}</ul>;
      default:   return null;
    }
  };

  const toggle = {
    marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '10px 18px', borderRadius: 999,
    background: '#fff', border: '1px solid var(--t2-line)',
    fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 13, color: 'var(--t2-ink-2)',
    cursor: 'pointer', boxShadow: 'var(--t2-sh-1)',
  };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrowStyle}>{eyebrow}</div>
          <h2 style={h2}>{title}</h2>
        </div>
        <div style={body}>
          {blocks.map(renderBlock)}
          <div style={fade} />
        </div>
        {collapsible && (
          <button style={toggle} onClick={() => setOpen(o => !o)} aria-expanded={open}>
            {open ? 'Свернуть' : 'Читать далее'}
            <span style={{ fontSize: 11 }}>{open ? '▲' : '▼'}</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default SeoArticle;
