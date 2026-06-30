import React from 'react'
import { waLink } from './BrandData.jsx'
import { pathOf } from './router.jsx'
// Header v2 — thin red accent line + clean white nav. Logo with mini icon,
// nav as bare links (no pill background until hover/active), green WA CTA.
// Mobile: hamburger collapses nav into a dropdown sheet.

const NAV_ITEMS = [
  { id: 'home',     label: 'Главная' },
  { id: 'routes',   label: 'Маршруты' },
  { id: 'price',    label: 'Цены' },
  { id: 'news',     label: 'Новости' },
  { id: 'drivers',  label: 'Водителям' },
  { id: 'contacts', label: 'Контакты' },
];

function Header({ onNav, view }) {
  const [open, setOpen] = React.useState(false);

  const wrap = {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(14px)',
    borderBottom: '1px solid var(--t2-line)',
  };
  const stripe = { height: 3, background: 'linear-gradient(90deg, var(--t2-red) 0%, #c01928 100%)' };
  const row = { maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 24 };

  // Logo
  const logo = { display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', textDecoration: 'none' };
  const logoMark = {
    width: 36, height: 36, borderRadius: 12,
    background: 'linear-gradient(135deg, var(--t2-red) 0%, #c01928 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 14,
    letterSpacing: '-.02em', boxShadow: '0 6px 14px rgba(238,46,61,.30)',
  };
  const wordmark = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--t2-ink)', letterSpacing: '-.02em', lineHeight: 1 };
  const wordmarkSub = { fontFamily: "'Inter',system-ui", fontSize: 10, fontWeight: 600, color: 'var(--t2-ink-3)', letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 3 };

  // Nav
  const navWrap = { display: 'flex', alignItems: 'center', gap: 28, marginLeft: 'auto' };
  const navLink = (active) => ({
    fontFamily: "'Inter',system-ui", fontSize: 14, fontWeight: active ? 700 : 500,
    color: active ? 'var(--t2-red)' : 'var(--t2-ink-2)',
    cursor: 'pointer', textDecoration: 'none', position: 'relative',
    padding: '20px 0',
  });
  const navUnderline = (active) => ({
    position: 'absolute', left: 0, right: 0, bottom: -1, height: 2,
    background: active ? 'var(--t2-red)' : 'transparent',
    transition: 'background 180ms',
  });

  const waBtn = { padding: '10px 18px', borderRadius: 12, background: '#25d366', color: '#fff', fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 6px 14px rgba(34,197,94,.25)' };

  // Mobile burger
  const burger = { display: 'none', background: 'transparent', border: 0, cursor: 'pointer', padding: 8, color: 'var(--t2-ink)' };
  const burgerLine = { display: 'block', width: 22, height: 2, background: 'currentColor', margin: '5px 0', borderRadius: 2, transition: 'all 200ms' };

  // Mobile sheet
  const sheet = {
    position: 'absolute', top: '100%', left: 0, right: 0,
    background: '#fff', borderBottom: '1px solid var(--t2-line)', boxShadow: 'var(--t2-sh-3)',
    padding: '12px 24px 20px',
  };
  const sheetLink = (active) => ({
    display: 'block', padding: '12px 0', fontFamily: "'Inter',system-ui",
    fontSize: 16, fontWeight: active ? 700 : 500,
    color: active ? 'var(--t2-red)' : 'var(--t2-ink)',
    textDecoration: 'none', borderBottom: '1px solid var(--t2-line)',
  });

  return (
    <header style={wrap}>
      <div style={stripe} />
      <div style={row}>
        <a href="/" onClick={() => { onNav('home'); setOpen(false); }} style={logo}>
          <div style={logoMark}>T2</div>
          <div>
            <div style={wordmark}>Transfer2EU</div>
            <div style={wordmarkSub}>Alicante · 24/7</div>
          </div>
        </a>

        <nav style={navWrap} className="t2-nav-desktop">
          {NAV_ITEMS.map(it => {
            const active = view === it.id
              || (it.id === 'routes' && view === 'route')
              || (it.id === 'news' && view === 'news-post');
            return (
              <a key={it.id} href={pathOf(it.id)} onClick={() => onNav(it.id)} style={navLink(active)}>
                {it.label}
                <span style={navUnderline(active)} />
              </a>
            );
          })}
          <a href={waLink()} target="_blank" rel="noopener noreferrer" style={waBtn}>
            📲 WhatsApp
          </a>
        </nav>

        <button onClick={() => setOpen(o => !o)} style={burger} className="t2-burger" aria-label="Меню">
          <span style={burgerLine} />
          <span style={burgerLine} />
          <span style={burgerLine} />
        </button>
      </div>

      {open && (
        <div style={sheet}>
          {NAV_ITEMS.map(it => {
            const active = view === it.id
              || (it.id === 'routes' && view === 'route')
              || (it.id === 'news' && view === 'news-post');
            return (
              <a key={it.id} href={pathOf(it.id)} onClick={() => { onNav(it.id); setOpen(false); }} style={sheetLink(active)}>
                {it.label}
              </a>
            );
          })}
          <a href={waLink()} target="_blank" rel="noopener noreferrer"
             style={{ ...waBtn, marginTop: 16, width: '100%', justifyContent: 'center' }}>
            📲 Написать в WhatsApp
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .t2-nav-desktop { display: none !important; }
          .t2-burger { display: block !important; margin-left: auto; }
        }
      `}</style>
    </header>
  );
}

export default Header;
