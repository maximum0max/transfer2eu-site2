import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import BookingForm from './BookingForm.jsx'
import SeoArticle from './SeoArticle.jsx'
import Reveal from './Reveal.jsx'
import { ROUTE_GROUPS, ALL_ROUTES } from './BrandData.jsx'
import { ROUTES_SEO } from './Seo.data.jsx'
// Routes page v4 — two-step booking form at the top, then a redesigned
// destinations catalog with "boarding-pass" style cards grouped by region,
// followed by a verbatim SEO article (collapsible) for search engines.

function RoutesPage({ onNav, onSelectRoute }) {
  return (
    <>
      <PageHero
        eyebrow="🚖 Маршруты"
        title="Куда вас отвезти?"
        subtitle="Выберите направление — увидите финальную цену сразу. Без скрытых доплат, цена за автомобиль (седан). Минивэн для группы — отдельный тариф." />

      <BookingBand />
      <DestinationsCatalog onSelectRoute={onSelectRoute} />
      <Reveal><SeoArticle {...ROUTES_SEO} /></Reveal>
      <Reveal><CTABanner onNav={onNav} /></Reveal>
    </>
  );
}

/* ============ Booking band at top of page ============ */
function BookingBand() {
  const wrap = { padding: '40px 32px 56px', background: 'linear-gradient(180deg, var(--t2-bg-2) 0%, #fff 100%)' };
  const inner = { maxWidth: 880, margin: '0 auto' };
  return (
    <section style={wrap}>
      <div style={inner}>
        <BookingForm />
      </div>
    </section>
  );
}

/* ============ Destinations catalog — ticket-style cards ============ */
function DestinationsCatalog({ onSelectRoute }) {
  const groups = ROUTE_GROUPS || [];
  const allCount = (ALL_ROUTES || []).length;

  const wrap = { padding: '40px 32px 80px', background: '#fff' };
  const inner = { maxWidth: 1280, margin: '0 auto' };

  const head = { textAlign: 'center', marginBottom: 36 };
  const eyebrow = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, color: 'var(--t2-red)', letterSpacing: '.14em', textTransform: 'uppercase', background: 'var(--t2-red-soft)', marginBottom: 10 };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '6px 0 6px' };
  const sub = { fontSize: 14, color: 'var(--t2-ink-3)' };

  // Per-region accent color
  const regionAccents = {
    'Близкие направления':  { from: '#ef4444', to: '#b91c1c' },
    'Коста-Бланка':         { from: '#0ea5e9', to: '#0369a1' },
    'Южное побережье':      { from: '#f59e0b', to: '#b45309' },
    'Мурсия и юг':          { from: '#ec4899', to: '#9d174d' },
    'Север':                { from: '#10b981', to: '#047857' },
    'Крупные города':       { from: '#7c3aed', to: '#4338ca' },
  };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <span style={eyebrow}>📍 Каталог направлений</span>
          <h2 style={h2}>{allCount} городов в формате «трансфер от двери до двери»</h2>
          <p style={sub}>Сгруппированы по региону. Кликните по карточке — увидите детали и забронируете.</p>
        </div>

        {groups.map((g, gi) => (
          <Reveal key={gi} delay={(gi % 2) * 90}>
            <RegionBlock group={g} accent={regionAccents[g.label] || { from: '#64748b', to: '#334155' }} onSelectRoute={onSelectRoute} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function RegionBlock({ group, accent, onSelectRoute }) {
  const block = { marginBottom: 48 };
  const header = { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, paddingBottom: 12, borderBottom: '2px solid var(--t2-line)' };
  const dotEmoji = {
    width: 44, height: 44, borderRadius: 12,
    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, color: '#fff', boxShadow: `0 8px 18px ${accent.from}40`,
  };
  const label = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--t2-ink)', letterSpacing: '-.01em' };
  const count = { marginLeft: 'auto', fontSize: 12, color: 'var(--t2-ink-3)', fontVariantNumeric: 'tabular-nums' };
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 };

  return (
    <div style={block}>
      <div style={header}>
        <div style={dotEmoji}>{group.emoji}</div>
        <div style={label}>{group.label}</div>
        <div style={count}>{group.routes.length} направлений</div>
      </div>
      <div style={grid}>
        {group.routes.map(r => <TicketCard key={r.slug} r={r} accent={accent} onSelectRoute={onSelectRoute} />)}
      </div>
    </div>
  );
}

/* ============ Boarding-pass style card ============ */
function TicketCard({ r, accent, onSelectRoute }) {
  const [hover, setHover] = React.useState(false);

  const card = {
    position: 'relative',
    background: '#fff', borderRadius: 16, overflow: 'hidden',
    border: '1px solid var(--t2-line)',
    boxShadow: hover ? '0 20px 40px rgba(11,30,51,.12)' : '0 2px 8px rgba(11,30,51,.04)',
    transform: hover ? 'translateY(-3px)' : 'translateY(0)',
    transition: 'all 240ms cubic-bezier(.2,.7,.2,1)',
    cursor: 'pointer', display: 'flex', flexDirection: 'column',
  };
  const accentStripe = {
    height: 4, background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
  };

  const head = { padding: '14px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 };
  const emojiBox = { fontSize: 24, lineHeight: 1 };
  const priceTag = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--t2-red)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 };

  // The visual "route line"
  const route = { padding: '14px 18px 12px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 10 };
  const airport = {};
  const airportCode = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--t2-ink)', letterSpacing: '-.01em', lineHeight: 1.1 };
  const airportLabel = { fontSize: 10, color: 'var(--t2-ink-3)', marginTop: 2, letterSpacing: '.04em', textTransform: 'uppercase' };

  const lineWrap = { position: 'relative', height: 22, display: 'flex', alignItems: 'center' };
  const line = { position: 'absolute', left: 0, right: 0, top: '50%', height: 0, borderTop: '2px dashed var(--t2-line)' };
  const plane = {
    position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
    width: 26, height: 26, borderRadius: '50%',
    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff',
    boxShadow: `0 4px 10px ${accent.from}40`,
  };

  const dest = { textAlign: 'right' };
  const destName = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--t2-ink)', letterSpacing: '-.01em', lineHeight: 1.1 };
  const destLabel = { fontSize: 10, color: 'var(--t2-ink-3)', marginTop: 2, letterSpacing: '.04em', textTransform: 'uppercase' };

  // Perforation row (dashed boarding-pass divider)
  const perfRow = {
    position: 'relative', height: 14, margin: '4px 0',
    background: 'var(--t2-bg-2)',
    borderTop: '1px dashed var(--t2-line)', borderBottom: '1px dashed var(--t2-line)',
  };
  const notch = (side) => ({
    position: 'absolute', top: '50%', [side]: -7, transform: 'translateY(-50%)',
    width: 14, height: 14, borderRadius: '50%', background: '#fff',
    border: '1px solid var(--t2-line)',
  });

  const stats = { padding: '10px 18px 14px', display: 'flex', gap: 16, fontSize: 12, color: 'var(--t2-ink-3)' };
  const stat = { display: 'inline-flex', alignItems: 'center', gap: 5 };

  const cta = {
    margin: '0 18px 16px', padding: '10px 14px', borderRadius: 10,
    background: hover ? `linear-gradient(135deg, ${accent.from}, ${accent.to})` : 'var(--t2-bg-2)',
    color: hover ? '#fff' : 'var(--t2-ink-2)',
    fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 13,
    border: 0, cursor: 'pointer', transition: 'all 220ms',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
  };

  return (
    <article
      style={card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onSelectRoute(r.slug)}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelectRoute(r.slug); }}
      tabIndex={0}
      role="link"
      aria-label={`Трансфер Аликанте → ${r.ru} от ${r.price}€`}
    >
      <div style={accentStripe} />

      <div style={head}>
        <div style={emojiBox}>{r.emoji}</div>
        <div style={priceTag}>{r.price}€</div>
      </div>

      <div style={route}>
        <div style={airport}>
          <div style={airportCode}>ALC</div>
          <div style={airportLabel}>Аликанте</div>
        </div>
        <div style={lineWrap}>
          <div style={line} />
          <div style={plane}>✈</div>
        </div>
        <div style={dest}>
          <div style={destName}>{r.ru}</div>
          <div style={airportLabel}>{r.city}</div>
        </div>
      </div>

      <div style={perfRow}>
        <span style={notch('left')} />
        <span style={notch('right')} />
      </div>

      <div style={stats}>
        <span style={stat}>🕐 {r.time} мин</span>
        <span style={stat}>🚗 Седан</span>
      </div>

      <button style={cta} onClick={(e) => { e.stopPropagation(); onSelectRoute(r.slug); }}>
        Выбрать маршрут
        <span style={{ fontSize: 14 }}>→</span>
      </button>
    </article>
  );
}

export default RoutesPage;
