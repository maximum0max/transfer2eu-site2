import React from 'react'
// PageHero v2 — light minimal hero for sub-pages. Replaces the dark mini-Hero.
// Thin red top stripe + soft cream background + big tracking-tight title.

function PageHero({ eyebrow, title, subtitle, children }) {
  const wrap = {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(180deg, #fff 0%, var(--t2-bg-2) 100%)',
    padding: '64px 24px 56px',
    borderTop: '4px solid var(--t2-red)',
  };
  const blob = { position: 'absolute', top: -120, right: -160, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(238,46,61,.10), transparent 65%)', pointerEvents: 'none' };
  const inner = { position: 'relative', maxWidth: 1100, margin: '0 auto', textAlign: 'center', zIndex: 2 };
  const eyebrowStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999,
    background: '#fff', border: '1px solid var(--t2-line)', boxShadow: 'var(--t2-sh-1)',
    fontSize: 12, fontWeight: 600, color: 'var(--t2-ink-2)',
    marginBottom: 18,
  };
  const titleStyle = {
    fontFamily: "'Onest',sans-serif", fontWeight: 800,
    fontSize: 'clamp(32px, 4.5vw, 52px)', letterSpacing: '-.02em',
    lineHeight: 1.05, margin: '0 0 16px', color: 'var(--t2-ink)',
  };
  const subtitleStyle = {
    fontSize: 16, lineHeight: 1.55, color: 'var(--t2-ink-2)',
    maxWidth: 640, margin: '0 auto',
  };

  return (
    <section style={wrap}>
      <div style={blob} />
      <div style={inner}>
        {eyebrow && <div style={eyebrowStyle}>{eyebrow}</div>}
        <h1 style={titleStyle}>{title}</h1>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        {children && <div style={{ marginTop: 28 }}>{children}</div>}
      </div>
    </section>
  );
}

export default PageHero;
