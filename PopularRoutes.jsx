import React from 'react'
import { POPULAR, waLink, tgLink } from './BrandData.jsx'
import TelegramIcon from './TelegramIcon.jsx'
import { pathOf } from './router.jsx'
// PopularRoutes v3 — photo cards. Each card: 4:3 photo with dark gradient
// overlay + city name + emoji badge + time pill, then a clean white body
// with the price row, "what's included" micro-line, and a primary CTA.
// SEO-friendly: descriptive alt text on every photo, semantic <article>,
// keyword-rich H3 headings ("Трансфер Аликанте → Бенидорм").

function PopularRoutes({ onSelectRoute, onNav }) {
  const list = POPULAR || [];

  const wrap = { padding: '88px 32px 96px', background: '#fff', position: 'relative', overflow: 'hidden' };
  const inner = { maxWidth: 1280, margin: '0 auto', position: 'relative' };
  const top = { textAlign: 'center', marginBottom: 44 };
  const eyebrow = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', background: 'var(--t2-red-soft)', color: 'var(--t2-red)', marginBottom: 14 };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '0 0 10px' };
  const lede = { fontSize: 15, color: 'var(--t2-ink-3)', maxWidth: 520, margin: '0 auto' };

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 22,
  };

  return (
    <section style={wrap} aria-labelledby="popular-routes-heading">
      <div style={inner}>
        <div style={top}>
          <span style={eyebrow}>Популярные маршруты</span>
          <h2 id="popular-routes-heading" style={h2}>Самые востребованные направления</h2>
          <p style={lede}>Фиксированная цена за автомобиль (седан), без доплат. Цена не меняется от пробок и времени суток. Минивэн для группы — отдельный тариф.</p>
        </div>

        <div style={grid}>
          {list.map(r => <RouteCard key={r.slug} r={r} onSelectRoute={onSelectRoute} />)}
        </div>

        <BottomCTA onNav={onNav} />
      </div>
    </section>
  );
}

function RouteCard({ r, onSelectRoute }) {
  const [hover, setHover] = React.useState(false);
  const [imgOk, setImgOk] = React.useState(true);

  const card = {
    background: '#fff', borderRadius: 20, overflow: 'hidden',
    border: '1px solid var(--t2-line)',
    boxShadow: hover ? '0 24px 60px rgba(11,30,51,.18), 0 8px 20px rgba(11,30,51,.10)' : '0 4px 14px rgba(11,30,51,.06)',
    transform: hover ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'all 280ms cubic-bezier(.2,.7,.2,1)',
    cursor: 'pointer', display: 'flex', flexDirection: 'column',
    position: 'relative', textDecoration: 'none', color: 'inherit',
  };

  const photoBox = {
    position: 'relative', aspectRatio: '4 / 3',
    background: r.gradient || 'linear-gradient(135deg,#1a3556,#0b1e33)',
    overflow: 'hidden',
  };
  const photoImg = {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
    transform: hover ? 'scale(1.06)' : 'scale(1)',
    transition: 'transform 600ms cubic-bezier(.2,.7,.2,1)',
  };
  const photoVignette = {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(11,30,51,0) 35%, rgba(11,30,51,.12) 60%, rgba(11,30,51,.78) 100%)',
    pointerEvents: 'none',
  };

  // Top-left emoji badge
  const emojiBadge = {
    position: 'absolute', top: 14, left: 14,
    width: 44, height: 44, borderRadius: 14,
    background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, boxShadow: '0 6px 14px rgba(11,30,51,.18)',
  };
  // Top-right time pill
  const timePill = {
    position: 'absolute', top: 18, right: 14,
    padding: '5px 12px', borderRadius: 999,
    background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)',
    fontSize: 11, fontWeight: 700, color: 'var(--t2-ink)',
    fontVariantNumeric: 'tabular-nums',
    boxShadow: '0 4px 10px rgba(11,30,51,.15)',
  };
  // City name over photo (bottom-left)
  const cityOverlay = {
    position: 'absolute', left: 22, right: 22, bottom: 18, zIndex: 1,
  };
  const cityName = {
    fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: '-.02em',
    color: '#fff', margin: '0 0 4px', lineHeight: 1.1,
    textShadow: '0 2px 12px rgba(0,0,0,.4)',
  };
  const subLabel = {
    fontFamily: "'Inter',system-ui", fontSize: 12, color: 'rgba(255,255,255,.86)',
    letterSpacing: '.04em', textShadow: '0 1px 6px rgba(0,0,0,.4)',
  };

  // Body underneath photo
  const body = { padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 };
  const incRow = {
    display: 'flex', gap: 14, fontSize: 11, color: 'var(--t2-ink-3)',
    paddingBottom: 12, borderBottom: '1px solid var(--t2-line)',
  };
  const incItem = { display: 'inline-flex', alignItems: 'center', gap: 4 };

  const priceRow = { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 };
  const priceLabel = { fontSize: 11, color: 'var(--t2-ink-3)', letterSpacing: '.06em', textTransform: 'uppercase' };
  const priceVal = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 32, color: 'var(--t2-ink)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 };
  const priceAccent = { color: 'var(--t2-red)' };

  const btn = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', padding: '12px 20px', borderRadius: 12,
    background: hover ? 'linear-gradient(135deg, var(--t2-red), #c01928)' : 'var(--t2-ink)',
    color: '#fff', fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 14,
    border: 0, cursor: 'pointer', transition: 'background 220ms',
  };

  // Keyword-rich H3 + alt text for SEO
  const headingText = `Трансфер Аликанте ALC → ${r.ru}`;
  const altText = r.alt || `Трансфер из аэропорта Аликанте в ${r.ru}`;

  return (
    <a
      href={pathOf('route', r.slug)}
      style={card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onSelectRoute(r.slug)}
      aria-label={`${headingText} ${r.price}€`}
    >
      <h3 style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        {headingText}
      </h3>

      <div style={photoBox}>
        {imgOk && r.img && (
          <img src={r.img} alt={altText} loading="lazy" decoding="async"
               style={photoImg}
               onError={() => setImgOk(false)} />
        )}
        <div style={photoVignette} />
        <div style={emojiBadge}>{r.emoji}</div>
        <div style={timePill}>🕐 {r.time} мин</div>
        <div style={cityOverlay}>
          <div style={cityName}>{r.ru}</div>
          <div style={subLabel}>из Аликанте ALC · фиксированная цена</div>
        </div>
      </div>

      <div style={body}>
        <div style={incRow}>
          <span style={incItem}>🅿 Платные дороги</span>
          <span style={incItem}>👶 Кресло</span>
          <span style={incItem}>💬 По-русски</span>
        </div>
        <div style={priceRow}>
          <div>
            <div style={priceLabel}>Фикс-цена</div>
            <div style={priceVal}><span style={priceAccent}>{r.price}</span>€</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t2-ink-3)', textAlign: 'right', lineHeight: 1.3 }}>
            за<br/>автомобиль
          </div>
        </div>
        <span style={btn}>
          Выбрать маршрут
          <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
        </span>
      </div>
    </a>
  );
}

function BottomCTA({ onNav }) {
  const wrap = {
    marginTop: 44, padding: '24px 28px', borderRadius: 18,
    background: 'linear-gradient(135deg, var(--t2-bg-2), #fff)',
    border: '1px solid var(--t2-line)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 20, flexWrap: 'wrap',
  };
  const text = {};
  const title = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--t2-ink)' };
  const sub = { fontSize: 13, color: 'var(--t2-ink-3)', marginTop: 4 };
  const btns = { display: 'flex', gap: 10, flexShrink: 0 };
  const waBtn = { background: '#25d366', color: '#fff', fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 18px rgba(34,197,94,.25)' };
  const altBtn = { background: '#fff', color: 'var(--t2-ink)', fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 14, padding: '11px 20px', borderRadius: 12, textDecoration: 'none', border: '1px solid var(--t2-line)', cursor: 'pointer' };
  return (
    <div style={wrap}>
      <div style={text}>
        <div style={title}>Не нашли свой маршрут?</div>
        <div style={sub}>Обслуживаем 40+ направлений Costa Blanca, Мурсии, Валенсии. Уточните цену в WhatsApp.</div>
      </div>
      <div style={btns}>
        <a href={waLink('Здравствуйте! Хочу узнать цену трансфера.')}
           target="_blank" rel="noopener noreferrer" style={waBtn}>
          📲 WhatsApp
        </a>
        <a href={tgLink('Здравствуйте! Хочу заказать трансфер.')}
           target="_blank" rel="noopener noreferrer" style={{ ...waBtn, background: '#229ED9', boxShadow: 'none' }}>
          <TelegramIcon size={16} /> Telegram
        </a>
        <a href={pathOf('routes')} onClick={() => onNav && onNav('routes')} style={altBtn}>Все 40+ маршрутов →</a>
      </div>
    </div>
  );
}

export default PopularRoutes;
