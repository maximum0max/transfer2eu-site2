/* global React */
// Static legal pages (privacy, terms, etc.). Each page is loaded from
// `window.LEGAL_PAGES` keyed by slug, and contains a verbatim block array
// copied from transfer2eu.com.
function Legal({ slug, onBack }) {
  const pages = (window.LEGAL_PAGES || {});
  const page = pages[slug];

  const wrap = { maxWidth: 760, margin: '0 auto', padding: '64px 32px 96px' };
  const back = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--t2-ink-3)', cursor: 'pointer', textDecoration: 'none', marginBottom: 24, background: 'transparent', border: 0, padding: 0 };
  const h1 = { fontFamily: "'Onest',sans-serif", fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--t2-ink)', margin: '0 0 32px', lineHeight: 1.15 };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--t2-ink)', margin: '36px 0 12px', letterSpacing: '-0.01em' };
  const h3 = { fontFamily: "'Onest',sans-serif", fontSize: 19, fontWeight: 700, color: 'var(--t2-ink)', margin: '24px 0 10px' };
  const p  = { fontFamily: "'Inter',system-ui", fontSize: 16, lineHeight: 1.65, color: 'var(--t2-ink-2)', margin: '0 0 16px' };
  const ul = { fontFamily: "'Inter',system-ui", fontSize: 16, lineHeight: 1.65, color: 'var(--t2-ink-2)', margin: '0 0 16px', paddingLeft: 22 };

  if (!page) {
    return (
      <main style={wrap}>
        <button style={back} onClick={onBack}>← Назад</button>
        <h1 style={h1}>Страница не найдена</h1>
      </main>
    );
  }

  const render = (b, i) => {
    switch (b.type) {
      case 'h2': return <h2 key={i} style={h2}>{b.text}</h2>;
      case 'h3': return <h3 key={i} style={h3}>{b.text}</h3>;
      case 'p':  return <p  key={i} style={p}>{b.text}</p>;
      case 'ul': return <ul key={i} style={ul}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: 6 }}>{it}</li>)}</ul>;
      case 'ol': return <ol key={i} style={ul}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: 6 }}>{it}</li>)}</ol>;
      default:   return null;
    }
  };

  return (
    <main style={wrap}>
      <button style={back} onClick={onBack}>← Назад</button>
      <h1 style={h1}>{page.title}</h1>
      {(page.body || []).map(render)}
    </main>
  );
}

window.Legal = Legal;
