import React from 'react'
import { BRAND, POPULAR, waLink } from './BrandData.jsx'
import { pathOf } from './router.jsx'
// Footer v2 — light 3-column layout: brand on the left, nav columns in the
// middle, contact card on the right. Replaces the dark SEO-link footer.

function Footer({ onNav, onSelectRoute }) {
  const popular = (POPULAR || []).slice(0, 5);

  const wrap = { background: 'var(--t2-bg-2)', borderTop: '1px solid var(--t2-line)' };
  const inner = { maxWidth: 1280, margin: '0 auto', padding: '64px 32px 32px' };
  const grid = { display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.3fr', gap: 48, marginBottom: 48 };

  // Brand column
  const logo = { display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' };
  const logoMark = { width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, var(--t2-red) 0%, #c01928 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: '-.02em' };
  const wordmark = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--t2-ink)', letterSpacing: '-.02em', lineHeight: 1 };
  const wordmarkSub = { fontFamily: "'Inter',system-ui", fontSize: 10, fontWeight: 600, color: 'var(--t2-ink-3)', letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 3 };
  const tagline = { fontSize: 13, lineHeight: 1.55, color: 'var(--t2-ink-3)', margin: '18px 0 0', maxWidth: 280 };

  // Column generic
  const colTitle = { fontFamily: "'Onest',sans-serif", fontSize: 12, fontWeight: 800, color: 'var(--t2-ink)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 14 };
  const colLink = { display: 'block', padding: '5px 0', fontSize: 14, color: 'var(--t2-ink-2)', textDecoration: 'none', cursor: 'pointer', fontFamily: "'Inter',system-ui" };
  const colRouteLink = { ...colLink, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 };
  const routeAmount = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--t2-red)', fontVariantNumeric: 'tabular-nums' };

  // Contact card
  const contactCard = {
    background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 18, padding: '22px 24px',
    boxShadow: 'var(--t2-sh-1)',
  };
  const contactTitle = { ...colTitle, marginBottom: 14 };
  const contactRow = { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--t2-line)' };
  const contactRowLast = { ...contactRow, borderBottom: 0 };
  const contactIcon = { width: 32, height: 32, borderRadius: 10, background: 'var(--t2-red-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 };
  const contactLabel = { fontSize: 11, color: 'var(--t2-ink-3)', letterSpacing: '.04em', textTransform: 'uppercase' };
  const contactValue = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--t2-ink)', textDecoration: 'none', fontVariantNumeric: 'tabular-nums', display: 'block', marginTop: 2 };

  // Bottom bar
  const bottom = {
    paddingTop: 24, borderTop: '1px solid var(--t2-line)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: 16, fontSize: 12, color: 'var(--t2-ink-3)',
  };
  const bottomLinks = { display: 'flex', gap: 16, flexWrap: 'wrap' };
  const bottomLink = { color: 'var(--t2-ink-3)', textDecoration: 'none', cursor: 'pointer' };

  return (
    <footer style={wrap}>
      <div style={inner}>
        <div style={grid} className="t2-footer-grid">
          <div>
            <a href="/" onClick={() => onNav('home')} style={logo}>
              <div style={logoMark}>T2</div>
              <div>
                <div style={wordmark}>Transfer2EU</div>
                <div style={wordmarkSub}>Alicante · 24/7</div>
              </div>
            </a>
            <p style={tagline}>Частный трансфер из аэропорта Аликанте по 40+ направлениям Costa Blanca, Мурсии и Валенсии. Фиксированная цена, русскоязычный водитель.</p>
          </div>

          <div>
            <div style={colTitle}>Сайт</div>
            <a style={colLink} href={pathOf('home')} onClick={() => onNav('home')}>Главная</a>
            <a style={colLink} href={pathOf('routes')} onClick={() => onNav('routes')}>Маршруты</a>
            <a style={colLink} href={pathOf('price')} onClick={() => onNav('price')}>Цены</a>
            <a style={colLink} href={pathOf('drivers')} onClick={() => onNav('drivers')}>Водителям</a>
            <a style={colLink} href={pathOf('contacts')} onClick={() => onNav('contacts')}>Контакты</a>
          </div>

          <div>
            <div style={colTitle}>Популярные маршруты</div>
            {popular.map(r => (
              <a key={r.slug} style={colRouteLink} href={pathOf('route', r.slug)} onClick={() => onSelectRoute && onSelectRoute(r.slug)}>
                <span>Аликанте → {r.ru}</span>
                <span style={routeAmount}>{r.price}€</span>
              </a>
            ))}
          </div>

          <div style={contactCard}>
            <div style={contactTitle}>Связь 24/7</div>
            <a href={'tel:' + BRAND.tel} style={{ ...contactRow, textDecoration: 'none' }}>
              <div style={contactIcon}>📞</div>
              <div style={{ flex: 1 }}>
                <div style={contactLabel}>Телефон</div>
                <span style={contactValue}>{BRAND.phone}</span>
              </div>
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" style={{ ...contactRow, textDecoration: 'none' }}>
              <div style={contactIcon}>📲</div>
              <div style={{ flex: 1 }}>
                <div style={contactLabel}>WhatsApp</div>
                <span style={contactValue}>{BRAND.phone}</span>
              </div>
            </a>
            <a href={'mailto:' + BRAND.email} style={{ ...contactRowLast, textDecoration: 'none' }}>
              <div style={contactIcon}>📩</div>
              <div style={{ flex: 1 }}>
                <div style={contactLabel}>E-mail</div>
                <span style={{ ...contactValue, fontSize: 12 }}>{BRAND.email}</span>
              </div>
            </a>
          </div>
        </div>

        <div style={bottom}>
          <div>{BRAND.copy || '© 2026 Transfer2EU'}</div>
          <div style={bottomLinks}>
            <a style={bottomLink} href={pathOf('contacts')} onClick={() => onNav('contacts')}>Контакты</a>
            <a style={bottomLink} href={pathOf('drivers')} onClick={() => onNav('drivers')}>Партнёрам</a>
            <a style={bottomLink} href={pathOf('routes')} onClick={() => onNav('routes')}>Все направления</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t2-footer-grid { grid-template-columns: 1fr 1fr !important; }
          .t2-footer-grid > :last-child { grid-column: span 2; }
        }
        @media (max-width: 560px) {
          .t2-footer-grid { grid-template-columns: 1fr !important; }
          .t2-footer-grid > :last-child { grid-column: auto; }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
