/* global React */
// Shared 2-column layout: main content (left/wide) + sidebar (right/narrow).
// Used by Routes/Prices/Contacts/Drivers/News pages and by the article body
// of the Home page. Also exports a Breadcrumb helper since every page has one.

function Breadcrumb({ onNav, trail }) {
  // trail = [{ label: 'Главная', view: 'home' }, { label: 'Маршруты' }]
  const wrap = { fontSize: 13, color: 'var(--t2-ink-3)', marginBottom: 12, fontFamily: "'Inter',system-ui" };
  const a = { color: 'var(--t2-red)', textDecoration: 'none', cursor: 'pointer' };
  return (
    <div style={wrap}>
      <span>Вы здесь: </span>
      {trail.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span> / </span>}
          {t.view ? <a style={a} onClick={() => onNav(t.view)}>{t.label}</a> : <span>{t.label}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function PageShell({ children, sidebar }) {
  const wrap = { maxWidth: 1280, margin: '0 auto', padding: '32px 24px 64px' };
  const grid = {
    display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px',
    gap: 32, alignItems: 'start',
  };
  const main = { minWidth: 0 };
  return (
    <main style={wrap}>
      <div style={grid}>
        <div style={main}>{children}</div>
        <div>{sidebar}</div>
      </div>
    </main>
  );
}

window.Breadcrumb = Breadcrumb;
window.PageShell  = PageShell;
