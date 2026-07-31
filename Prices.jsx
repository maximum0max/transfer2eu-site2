import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import BookingForm from './BookingForm.jsx'
import SeoArticle from './SeoArticle.jsx'
import Reveal from './Reveal.jsx'
import { ROUTE_GROUPS, ALL_ROUTES } from './BrandData.jsx'
import { PRICES_SEO } from './Seo.data.jsx'
// Prices v5 — compacted. The destinations list is now a dense, searchable
// price grid (was a full-width table); vehicle tiers + included/excluded are
// tighter; a price-FAQ and a verbatim SEO article were added below.
// Sections:
// 1) PageHero
// 2) Booking form (the 2-step flow)
// 3) Vehicle tiers (3 cards w/ relative pricing)
// 4) Compact searchable price grid (region tabs + search input)
// 5) Included vs Not included comparison
// 6) Group / round-trip discount banner
// 7) Price FAQ (new — answers the "how is the price formed" questions)
// 8) SEO article (verbatim original copy, collapsible)
// 9) CTABanner

function PricesPage({ onNav, onSelectRoute }) {
  return (
    <>
      <PageHero
        eyebrow="💰 Прозрачные цены"
        title="Цены на трансфер из ALC"
        subtitle="Фиксированная стоимость за автомобиль (седан). Минивэн для группы — отдельный тариф. 40+ направлений, никаких скрытых доплат." />

      <BookingSection />
      <Reveal><VehicleTiers /></Reveal>
      <Reveal><PriceGrid onSelectRoute={onSelectRoute} /></Reveal>
      <Reveal><IncludedVsNot /></Reveal>
      <Reveal><DiscountBand onNav={onNav} /></Reveal>
      <Reveal><PriceFAQ /></Reveal>
      <Reveal><SeoArticle {...PRICES_SEO} /></Reveal>
      <Reveal><CTABanner onNav={onNav} /></Reveal>
    </>
  );
}

/* ============ Booking section ============ */
function BookingSection() {
  const wrap = { padding: '40px 32px 8px', background: '#fff' };
  const inner = { maxWidth: 560, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 20 };
  const eyebrow = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, color: 'var(--t2-red)', letterSpacing: '.14em', textTransform: 'uppercase', background: 'var(--t2-red-soft)', marginBottom: 10 };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '6px 0 6px' };
  const sub = { fontSize: 14, color: 'var(--t2-ink-3)', margin: 0 };
  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <span style={eyebrow}>⚡ Заказ за 2 минуты</span>
          <h2 style={h2}>Узнайте цену и забронируйте</h2>
          <p style={sub}>Выберите маршрут — увидите фиксированную стоимость сразу.</p>
        </div>
        <BookingForm />
      </div>
    </section>
  );
}

/* ============ Vehicle tiers (compact rows — pure data, no photos) ============ */
function VehicleTiers() {
  const TIERS = [
    { name: 'Стандарт',  icon: '🚗', mult: '+0€',  cap: 'до 4', luggage: '3 чемодана', car: 'Skoda Octavia' },
    { name: 'Комфорт',   icon: '🚘', mult: '+15€', cap: 'до 4', luggage: '4 чемодана', car: 'Mercedes E-class', hot: true },
    { name: 'Минивэн',   icon: '🚐', mult: '+30€', cap: 'до 8', luggage: '8 чемоданов', car: 'Mercedes V-class' },
  ];
  const wrap = { padding: '48px 32px 28px', background: '#fff' };
  const inner = { maxWidth: 1100, margin: '0 auto' };
  const head = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 16 };
  const eyebrow = { fontSize: 11, fontWeight: 800, color: 'var(--t2-red)', letterSpacing: '.14em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: '-.01em', color: 'var(--t2-ink)', margin: '6px 0 0' };
  const note = { fontSize: 12, color: 'var(--t2-ink-3)' };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 };
  const card = (hot) => ({
    background: hot ? 'linear-gradient(135deg, var(--t2-ink), #1e293b)' : 'var(--t2-bg-2)',
    color: hot ? '#fff' : 'var(--t2-ink)',
    border: '1px solid ' + (hot ? 'var(--t2-ink)' : 'var(--t2-line)'),
    borderRadius: 16, padding: '16px 18px',
    display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 12,
  });
  const iconBox = (hot) => ({ fontSize: 24, width: 42, height: 42, borderRadius: 11, background: hot ? 'rgba(255,255,255,.10)' : '#fff', border: '1px solid ' + (hot ? 'rgba(255,255,255,.15)' : 'var(--t2-line)'), display: 'flex', alignItems: 'center', justifyContent: 'center' });
  const tierName = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 15 };
  const tierMeta = (hot) => ({ fontSize: 11, marginTop: 2, color: hot ? 'rgba(255,255,255,.60)' : 'var(--t2-ink-3)' });
  const tierMult = (hot) => ({ fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 20, fontVariantNumeric: 'tabular-nums', color: hot ? '#fff' : 'var(--t2-red)' });
  const tierMultLbl = (hot) => ({ fontSize: 10, textAlign: 'right', marginTop: 2, color: hot ? 'rgba(255,255,255,.60)' : 'var(--t2-ink-3)', letterSpacing: '.04em', textTransform: 'uppercase' });

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div>
            <div style={eyebrow}>Класс автомобиля</div>
            <h2 style={h2}>3 класса под любую компанию</h2>
          </div>
          <div style={note}>Цена ниже — стандартная. Доплата за класс — единоразовая.</div>
        </div>
        <div style={grid}>
          {TIERS.map((t, i) => (
            <div key={i} style={card(t.hot)}>
              <div style={iconBox(t.hot)}>{t.icon}</div>
              <div>
                <div style={tierName}>{t.name}</div>
                <div style={tierMeta(t.hot)}>{t.car} · 👥 {t.cap} · 🧳 {t.luggage}</div>
              </div>
              <div>
                <div style={tierMult(t.hot)}>{t.mult}</div>
                <div style={tierMultLbl(t.hot)}>к базе</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Compact searchable price grid ============ */
function PriceGrid({ onSelectRoute }) {
  const groups = ROUTE_GROUPS || [];
  const [activeRegion, setActiveRegion] = React.useState('all');
  const [q, setQ] = React.useState('');

  const all = (ALL_ROUTES || []);
  const norm = (s) => (s || '').toLowerCase();
  const visible = all.filter(r => {
    const inRegion = activeRegion === 'all' || groups.find(g => g.label === activeRegion)?.routes.includes(r);
    const inSearch = !q || norm(r.ru).includes(norm(q)) || norm(r.city).includes(norm(q));
    return inRegion && inSearch;
  });

  // Cheapest + priciest of the currently visible set — quick scan helper.
  const prices = visible.map(r => r.price);
  const minP = prices.length ? Math.min(...prices) : 0;
  const maxP = prices.length ? Math.max(...prices) : 0;

  const wrap = { padding: '56px 32px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1100, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 22 };
  const eyebrow = { fontSize: 11, fontWeight: 800, color: 'var(--t2-red)', letterSpacing: '.14em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 3.2vw, 32px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '6px 0 6px' };
  const sub = { fontSize: 14, color: 'var(--t2-ink-3)' };

  const controls = { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 };
  const searchWrap = { position: 'relative', flex: '1 1 260px', minWidth: 220 };
  const searchInput = { width: '100%', padding: '10px 14px 10px 38px', borderRadius: 12, border: '1px solid var(--t2-line)', fontSize: 14, fontFamily: "'Inter',system-ui", outline: 'none', background: '#fff' };
  const searchIcon = { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'var(--t2-ink-3)' };

  const tabs = { display: 'flex', gap: 6, flexWrap: 'wrap' };
  const tab = (active) => ({
    padding: '7px 13px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
    border: '1px solid ' + (active ? 'var(--t2-ink)' : 'var(--t2-line)'),
    background: active ? 'var(--t2-ink)' : '#fff',
    color: active ? '#fff' : 'var(--t2-ink-2)',
    transition: 'all 180ms', whiteSpace: 'nowrap',
  });

  // The dense price grid — replaces the old full-width table.
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(232px, 1fr))', gap: 8 };
  const cell = {
    display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 10,
    padding: '10px 12px', background: '#fff', border: '1px solid var(--t2-line)',
    borderRadius: 12, cursor: 'pointer', transition: 'all 160ms',
    fontFamily: "'Inter',system-ui",
  };
  const cellEmoji = { fontSize: 19, lineHeight: 1 };
  const cellRu = { fontWeight: 700, fontSize: 14, color: 'var(--t2-ink)', lineHeight: 1.2 };
  const cellMeta = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 1 };
  const cellPrice = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--t2-red)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
  const empty = { gridColumn: '1 / -1', padding: '40px 24px', textAlign: 'center', color: 'var(--t2-ink-3)', fontSize: 14, background: '#fff', borderRadius: 14, border: '1px solid var(--t2-line)' };

  const footRow = { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 12, color: 'var(--t2-ink-3)', marginTop: 14 };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>Все направления</div>
          <h2 style={h2}>40+ маршрутов — найдите свой</h2>
          <p style={sub}>Цена за стандартное авто (седан). Класс «Комфорт» +15€, «Минивэн» +30€.</p>
        </div>

        <div style={controls}>
          <div style={searchWrap}>
            <span style={searchIcon}>🔍</span>
            <input style={searchInput} type="text" placeholder="Поиск города… (Бенидорм, Calpe, Дения)"
                   value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div style={tabs}>
            <span style={tab(activeRegion === 'all')} onClick={() => setActiveRegion('all')}>Все</span>
            {groups.map(g => (
              <span key={g.label} style={tab(activeRegion === g.label)} onClick={() => setActiveRegion(g.label)}>
                {g.emoji} {g.label}
              </span>
            ))}
          </div>
        </div>

        <div style={grid}>
          {visible.length === 0 && <div style={empty}>Ничего не найдено по запросу «{q}». Попробуйте другой город.</div>}
          {visible.map((r) => (
            <div key={r.slug} style={cell}
                 onClick={() => onSelectRoute(r.slug)}
                 onKeyDown={(e) => { if (e.key === 'Enter') onSelectRoute(r.slug); }}
                 tabIndex={0} role="link"
                 aria-label={`Трансфер Аликанте → ${r.ru} ${r.price}€`}
                 onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--t2-red)'; e.currentTarget.style.background = 'var(--t2-red-soft)'; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--t2-line)'; e.currentTarget.style.background = '#fff'; }}>
              <span style={cellEmoji}>{r.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <div style={cellRu}>{r.ru}</div>
                <div style={cellMeta}>{r.city} · {r.time} мин</div>
              </div>
              <div style={cellPrice}>{r.price}€</div>
            </div>
          ))}
        </div>

        <div style={footRow}>
          <span>Показано {visible.length} из {all.length} направлений</span>
          {visible.length > 0 && <span>Цены в выборке: от {minP}€ до {maxP}€</span>}
        </div>
      </div>
    </section>
  );
}

/* ============ Included vs Not included comparison ============ */
function IncludedVsNot() {
  const INCLUDED = [
    'Платные дороги (автобаны)',
    'Парковка в аэропорту',
    'Детское кресло или бустер',
    'Багаж без ограничений',
    'Бесплатное ожидание до 90 минут',
    'Wi-Fi и бутылка воды',
    'Русскоязычный водитель',
    'Встреча с табличкой у выхода',
  ];
  const NOT = [
    'Чаевые водителю',
    'Дополнительные остановки в пути',
    'Тур по городу или гид',
    'Билеты в музеи и парки',
  ];

  const wrap = { padding: '56px 32px', background: '#fff' };
  const inner = { maxWidth: 1000, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 24 };
  const eyebrow = { fontSize: 11, fontWeight: 800, color: 'var(--t2-red)', letterSpacing: '.14em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '6px 0 0' };

  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
  const col = (variant) => ({
    background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)', borderRadius: 18,
    padding: 20, position: 'relative', overflow: 'hidden',
    borderTop: variant === 'plus' ? '4px solid #16a34a' : '4px solid #94a3b8',
  });
  const colHead = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 };
  const colBadge = (variant) => ({
    width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: variant === 'plus' ? '#dcfce7' : '#f1f5f9', color: variant === 'plus' ? '#15803d' : '#64748b',
    fontSize: 16, fontWeight: 800,
  });
  const colTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 16, color: 'var(--t2-ink)' };
  const colSub = { fontSize: 11, color: 'var(--t2-ink-3)' };
  const list = { listStyle: 'none', padding: 0, margin: 0 };
  const li = (variant) => ({
    padding: '8px 0', borderTop: '1px solid var(--t2-line)', display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 13.5, color: variant === 'plus' ? 'var(--t2-ink-2)' : 'var(--t2-ink-3)',
    textDecoration: variant === 'plus' ? 'none' : 'line-through',
  });
  const liIcon = (variant) => ({ width: 17, height: 17, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, background: variant === 'plus' ? '#16a34a' : '#cbd5e1', color: '#fff', flexShrink: 0 });

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>Что входит в цену</div>
          <h2 style={h2}>Прозрачно: что включено, что нет</h2>
        </div>
        <div style={grid} className="t2-incl-grid">
          <div style={col('plus')}>
            <div style={colHead}>
              <div style={colBadge('plus')}>✓</div>
              <div>
                <div style={colTitle}>Входит в цену</div>
                <div style={colSub}>Никаких доплат на месте</div>
              </div>
            </div>
            <ul style={list}>
              {INCLUDED.map((s, i) => <li key={i} style={li('plus')}><span style={liIcon('plus')}>✓</span>{s}</li>)}
            </ul>
          </div>
          <div style={col('minus')}>
            <div style={colHead}>
              <div style={colBadge('minus')}>—</div>
              <div>
                <div style={colTitle}>Не входит</div>
                <div style={colSub}>На усмотрение пассажира</div>
              </div>
            </div>
            <ul style={list}>
              {NOT.map((s, i) => <li key={i} style={li('minus')}><span style={liIcon('minus')}>—</span>{s}</li>)}
            </ul>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 700px) { .t2-incl-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

/* ============ Group / round-trip discount banner ============ */
function DiscountBand({ onNav }) {
  const wrap = { padding: '8px 32px 32px', background: '#fff' };
  const card = {
    position: 'relative', overflow: 'hidden',
    maxWidth: 1000, margin: '0 auto', borderRadius: 20,
    background: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
    border: '1px solid #f59e0b',
    padding: '24px 28px',
    display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 20,
  };
  const iconBox = { fontSize: 40 };
  const title = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 20, color: '#78350f', margin: 0, letterSpacing: '-.01em' };
  const sub = { fontSize: 13.5, color: '#92400e', marginTop: 4, lineHeight: 1.5 };
  const btn = { padding: '11px 20px', borderRadius: 12, background: '#78350f', color: '#fff', fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 14, textDecoration: 'none', border: 0, cursor: 'pointer', whiteSpace: 'nowrap' };

  return (
    <section style={wrap}>
      <div style={card} className="t2-disc-card">
        <div style={iconBox}>💸</div>
        <div>
          <h3 style={title}>Скидка 5% на туда-обратно</h3>
          <p style={sub}>При бронировании поездки в обе стороны (или 2+ трансферов сразу) — мы автоматически снимаем 5% от итоговой суммы.</p>
        </div>
        <a onClick={() => onNav && onNav('routes')} style={btn}>Узнать подробнее →</a>
      </div>
      <style>{`@media (max-width: 720px) { .t2-disc-card { grid-template-columns: 1fr !important; text-align: left; } }`}</style>
    </section>
  );
}

/* ============ Price FAQ (new section) ============ */
function PriceFAQ() {
  const QA = [
    { q: 'Цена окончательная?', a: 'Да. Стоимость фиксированная за автомобиль и не зависит от пробок, времени суток или счётчика километров. Что увидели при заказе — то и платите.' },
    { q: 'За что цена — за человека или за машину?', a: 'За автомобиль целиком. Указанные цены — за седан до 4 пассажиров. Едете компанией 5–8 человек — это минивэн, отдельный тариф.' },
    { q: 'Платные дороги и кресло — отдельно?', a: 'Нет. Автобаны, парковка в аэропорту и детское кресло уже включены в цену. Доплат на месте нет.' },
    { q: 'Как оплатить?', a: 'Картой онлайн при бронировании или наличными водителю в начале поездки — на ваш выбор.' },
    { q: 'Есть ли скидки?', a: 'При заказе двух и более поездок (например, туда-обратно) действует скидка 5% от итоговой суммы.' },
    { q: 'Можно узнать цену заранее?', a: 'Да — выберите маршрут в форме выше или напишите в WhatsApp. Оператор подтвердит точную стоимость до отеля за пару минут.' },
  ];

  const wrap = { padding: '56px 32px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1000, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 24 };
  const eyebrow = { fontSize: 11, fontWeight: 800, color: 'var(--t2-red)', letterSpacing: '.14em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '6px 0 0' };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 };
  const card = { background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 14, padding: '16px 18px' };
  const qText = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 14.5, color: 'var(--t2-ink)', margin: '0 0 6px', display: 'flex', gap: 8, alignItems: 'baseline' };
  const qMark = { color: 'var(--t2-red)', fontWeight: 800 };
  const aText = { fontSize: 13, lineHeight: 1.6, color: 'var(--t2-ink-3)', margin: 0 };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>Частые вопросы о цене</div>
          <h2 style={h2}>Из чего складывается стоимость</h2>
        </div>
        <div style={grid}>
          {QA.map((it, i) => (
            <div key={i} style={card}>
              <h3 style={qText}><span style={qMark}>?</span>{it.q}</h3>
              <p style={aText}>{it.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricesPage;
