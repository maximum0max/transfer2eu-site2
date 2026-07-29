import React from 'react'
import BookingForm from './BookingForm.jsx'
import CTABanner from './CTABanner.jsx'
import Reveal from './Reveal.jsx'
import { BRAND, findRoute, POPULAR, ROUTE_GROUPS, ROUTE_IMAGES, waLink } from './BrandData.jsx'
import { getRouteGuide, GUIDE_CREDITS } from './RouteGuide.data.jsx'
import { pathOf } from './router.jsx'
// RoutePage v3 — immersive/visual layout. Sections:
// 1) Photo-bg hero with floating stat strip
// 2) Two-column band: trip details on left + BookingForm on right
// 3) Trip breakdown — what happens during the trip (4-step horizontal flow)
// 4) Vehicle tiers — Standard / Comfort / Minivan
// 5) "Что вас ждёт в [город]" destination teaser card
// 6) Other popular routes
// 7) CTABanner

function RoutePage({ slug, onNav, onSelectRoute }) {
  const r = findRoute(slug);
  const guide = r ? getRouteGuide(r.slug) : null;

  if (!r) {
    return (
      <>
        <section style={{ padding: '64px 24px', textAlign: 'center', background: '#fff' }}>
          <h1 style={{ fontFamily: "'Onest',sans-serif", fontSize: 32, color: 'var(--t2-ink)' }}>Маршрут не найден</h1>
          <button onClick={() => onNav('routes')} style={{ marginTop: 16, padding: '12px 24px', borderRadius: 12, background: 'var(--t2-red)', color: '#fff', border: 0, fontFamily: "'Inter',system-ui", fontWeight: 700, cursor: 'pointer' }}>
            Все маршруты
          </button>
        </section>
        <CTABanner onNav={onNav} />
      </>
    );
  }

  return (
    <>
      <RouteHero r={r} />
      <RouteDetailsBand r={r} onNav={onNav} guide={guide} />
      <Reveal><TripBreakdown r={r} /></Reveal>
      <Reveal><VehicleTiers basePrice={r.price} /></Reveal>
      <Reveal><DestinationTeaser r={r} /></Reveal>
      {guide && <Reveal><RouteGuide guide={guide} /></Reveal>}
      <Reveal><OtherRoutes currentSlug={r.slug} onSelectRoute={onSelectRoute} /></Reveal>
      <Reveal><CTABanner onNav={onNav} /></Reveal>
    </>
  );
}

/* ============ 1. Photo-bg hero ============ */
function RouteHero({ r }) {
  // No overflow:hidden here — the stat card below deliberately hangs 36px past
  // the section (marginBottom: -36), and clipping the section cut the card's
  // labels off. Only the photo layer needs clipping, so it does its own.
  const wrap = {
    position: 'relative', minHeight: 460,
    background: r.gradient || 'linear-gradient(135deg, var(--t2-deep), #0b1e33)',
    color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    paddingTop: 80,
  };
  const photo = { position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' };
  const photoImg = { width: '100%', height: '100%', objectFit: 'cover' };
  const overlay = {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(11,30,51,.55) 0%, rgba(11,30,51,.30) 40%, rgba(11,30,51,.85) 100%)',
  };

  const content = { position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '32px 32px 0', width: '100%' };
  const eyebrow = {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
    borderRadius: 999, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,.30)', fontSize: 12, fontWeight: 600, color: '#fff',
    marginBottom: 16,
  };
  const h1 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-.025em', lineHeight: 1.02, color: '#fff', margin: '0 0 12px', textShadow: '0 2px 16px rgba(0,0,0,.4)' };
  const sub = { fontSize: 17, lineHeight: 1.5, color: 'rgba(255,255,255,.86)', maxWidth: 560, margin: '0 0 28px' };

  // Floating stat strip
  const statStrip = {
    position: 'relative', maxWidth: 1280, margin: '0 auto', width: '100%',
    padding: '0 32px', marginTop: 16, marginBottom: -36, zIndex: 3,
  };
  const statCard = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 0,
    background: '#fff', borderRadius: 18, padding: '8px',
    boxShadow: '0 30px 80px rgba(11,30,51,.25)',
    border: '1px solid var(--t2-line)',
  };
  const statCell = { padding: '18px 22px', borderRight: '1px solid var(--t2-line)', textAlign: 'center' };
  const statCellLast = { ...statCell, borderRight: 0 };
  const statNum = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 28, lineHeight: 1, color: 'var(--t2-ink)', fontVariantNumeric: 'tabular-nums' };
  const statNumRed = { ...statNum, color: 'var(--t2-red)' };
  const statLabel = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 6, letterSpacing: '.06em', textTransform: 'uppercase' };

  // Most route photos come from Wikimedia Commons under CC BY / CC BY-SA, where
  // crediting the author is a condition of use, not a courtesy. Kept small and
  // low-contrast in the corner so it reads as a photo credit and not as copy.
  // Top-right: the bottom of the hero is where the stat card overhangs, and a
  // credit placed there would sit behind it.
  const creditLink = {
    position: 'absolute', right: 12, top: 12, zIndex: 4,
    fontSize: 10, lineHeight: 1.3, color: 'rgba(255,255,255,.55)',
    textDecoration: 'none', maxWidth: '46%', textAlign: 'right',
  };

  return (
    <section style={wrap}>
      <div style={photo}>
        {r.img && (
          <img
            src={r.img}
            alt={r.alt || ''}
            style={photoImg}
            fetchPriority="high"
            width="1600"
            height="900"
          />
        )}
      </div>
      <div style={overlay} />
      {/* Sibling of the overlay, not a child of the photo: the overlay is
          painted after the photo layer and would otherwise dim and swallow it. */}
      {r.credit && (
        <a
          style={creditLink}
          href={r.credit.source}
          target="_blank"
          rel="noopener nofollow"
          title={`${r.credit.file} — ${r.credit.author}, ${r.credit.licence}`}
        >
          Фото: {r.credit.author} / {r.credit.licence}
        </a>
      )}
      <div style={content}>
        <span style={eyebrow}>{r.emoji} Аликанте ALC → {r.ru}</span>
        <h1 style={h1}>Трансфер Аликанте — {r.ru}</h1>
        <p style={sub}>от <b>{r.price}€</b> · {r.time} мин в пути · фиксированная цена за автомобиль (седан)</p>
      </div>
      <div style={statStrip} className="t2-stat-strip">
        <div style={statCard}>
          <div style={statCell}><div style={statNumRed}>{r.price}€</div><div style={statLabel}>За автомобиль</div></div>
          <div style={statCell}><div style={statNum}>{r.time} мин</div><div style={statLabel}>В пути</div></div>
          <div style={statCell}><div style={statNum}>до 4</div><div style={statLabel}>Пассажиров</div></div>
          <div style={statCellLast}><div style={statNum}>24/7</div><div style={statLabel}>Подача</div></div>
        </div>
      </div>
    </section>
  );
}

/* ============ 2. Two-column band: details + BookingForm ============ */
function RouteDetailsBand({ r, onNav, guide }) {
  const wrap = { padding: '72px 32px 64px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1280, margin: '0 auto' };
  const grid = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: 48, alignItems: 'start' };

  const mapWrap = { position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--t2-line)', boxShadow: 'var(--t2-sh-2)', background: 'var(--t2-bg-2)' };
  const mapNote = { fontSize: 13, color: 'var(--t2-ink-3)', margin: '12px 0 20px' };

  // Identical style for both contact buttons (WhatsApp + phone), sized 5% smaller
  // than the previous WhatsApp button (fontSize 14→13.3, padding 11×20→10.5×19).
  const contactBtn = {
    background: '#25d366', color: '#fff', border: '1px solid #25d366',
    fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 13.3,
    padding: '10.5px 19px', borderRadius: 12, textDecoration: 'none',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    boxShadow: 'var(--t2-sh-1)', width: 194, maxWidth: '100%', boxSizing: 'border-box',
  };

  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 16px', lineHeight: 1.1 };
  const body = { fontSize: 15, lineHeight: 1.6, color: 'var(--t2-ink-2)', margin: '0 0 24px' };

  const facts = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 };
  const fact = { background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' };
  const factEmoji = { fontSize: 22 };
  const factText = {};
  const factTitle = { fontFamily: "'Onest',sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--t2-ink)' };
  const factSub = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 2 };

  const phoneRow = { display: 'flex', gap: 10, flexWrap: 'wrap' };
  const phoneBtn = { background: '#fff', color: 'var(--t2-ink)', fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 14, padding: '11px 20px', borderRadius: 12, textDecoration: 'none', border: '1px solid var(--t2-line)', boxShadow: 'var(--t2-sh-1)' };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={grid} className="t2-route-grid">
          {guide && guide.mapSrc ? (
          <div style={{ paddingTop: 24 }}>
            <div style={eyebrow}>Маршрут на карте</div>
            <h2 style={h2}>Дорога из аэропорта ALC в центр Аликанте</h2>
            <div style={mapWrap}>
              <iframe title={guide.mapTitle} src={guide.mapSrc} width="100%" height="100%"
                style={{ border: 0, display: 'block' }} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
            </div>
            {guide.mapNote && <p style={{ ...mapNote, textAlign: 'center' }}>{guide.mapNote}</p>}
            <div style={{ ...phoneRow, justifyContent: 'center' }}>
              <a href={waLink('Здравствуйте! Хочу заказать трансфер из аэропорта Аликанте в центр города.')}
                 target="_blank" rel="noopener noreferrer" style={contactBtn}>
                📲 Написать в WhatsApp
              </a>
              <a href={'tel:' + BRAND.tel} style={{ ...contactBtn, background: '#cbd5e1', color: 'var(--t2-ink)', border: '1px solid #b3c0cf' }}>📞 {BRAND.phone}</a>
            </div>
          </div>
          ) : (
          <div style={{ paddingTop: 24 }}>
            <div style={eyebrow}>Маршрут</div>
            <h2 style={h2}>Прямой трансфер из ALC в {r.ru}</h2>
            <p style={body}>
              Бронируйте онлайн или в WhatsApp. Цена не меняется от времени суток, пробок или языка
              водителя. Платные дороги, детское кресло и встреча у выхода — включены.
            </p>

            <div style={facts}>
              <div style={fact}>
                <span style={factEmoji}>📍</span>
                <div style={factText}><div style={factTitle}>Точка подачи</div><div style={factSub}>Зал прилёта, выход с табличкой</div></div>
              </div>
              <div style={fact}>
                <span style={factEmoji}>⏱</span>
                <div style={factText}><div style={factTitle}>Ожидание</div><div style={factSub}>до 90 минут бесплатно</div></div>
              </div>
              <div style={fact}>
                <span style={factEmoji}>🅿</span>
                <div style={factText}><div style={factTitle}>Платные дороги</div><div style={factSub}>включены в цену</div></div>
              </div>
              <div style={fact}>
                <span style={factEmoji}>💳</span>
                <div style={factText}><div style={factTitle}>Оплата</div><div style={factSub}>картой или наличными</div></div>
              </div>
            </div>

            <div style={phoneRow}>
              <a href={'tel:' + BRAND.tel} style={phoneBtn}>📞 {BRAND.phone}</a>
              <a onClick={() => onNav('price')} style={{ ...phoneBtn, cursor: 'pointer' }}>Сравнить цены →</a>
            </div>
          </div>
          )}

          <div id="booking">
            <BookingForm initialSlug={r.slug} lockDestination />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t2-route-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 700px) {
          .t2-stat-strip { padding: 0 16px !important; }
          .t2-stat-strip > div { grid-template-columns: 1fr 1fr !important; }
          .t2-stat-strip > div > div { border-right: 0 !important; border-bottom: 1px solid var(--t2-line); padding: 14px !important; }
        }
      `}</style>
    </section>
  );
}

/* ============ 3. Trip breakdown — what happens during the trip ============ */
function TripBreakdown({ r }) {
  const STEPS = [
    { icon: '🛬', title: 'Прилёт в ALC',          text: 'Водитель отслеживает рейс. Ждёт у выхода с именной табличкой.' },
    { icon: '🧳', title: 'Багаж в машину',        text: 'Помогаем с чемоданами, идём к парковке через 5 минут.' },
    { icon: '🛣',  title: `Дорога ${r.time} мин`, text: 'Платные дороги уже оплачены. Wi-Fi и вода — есть.' },
    { icon: '🏨', title: `Прибытие в ${r.ru}`,    text: 'Дверь в дверь — отель, апартаменты или ресторан.' },
  ];

  const wrap = { padding: '88px 32px', background: '#fff' };
  const inner = { maxWidth: 1280, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 40 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 38px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 0', lineHeight: 1.1 };

  const flow = {
    position: 'relative', display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24,
  };
  const stepWrap = { position: 'relative' };
  const stepCard = { background: 'var(--t2-bg-2)', borderRadius: 18, padding: '24px 22px', height: '100%', position: 'relative', overflow: 'hidden' };
  const stepNum = { position: 'absolute', top: 14, right: 18, fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 56, color: 'var(--t2-line)', lineHeight: 1, opacity: .7 };
  const stepIconBox = { width: 52, height: 52, borderRadius: 14, background: '#fff', border: '1px solid var(--t2-line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 14, boxShadow: 'var(--t2-sh-1)' };
  const stepTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--t2-ink)', margin: '0 0 6px' };
  const stepText = { fontSize: 13, lineHeight: 1.55, color: 'var(--t2-ink-3)', margin: 0 };
  const arrow = {
    position: 'absolute', top: '50%', right: -12, width: 24, height: 24,
    transform: 'translateY(-50%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--t2-red)', fontSize: 22, fontWeight: 800,
  };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>Как проходит трансфер</div>
          <h2 style={h2}>Из ALC в {r.ru} — шаг за шагом</h2>
        </div>
        <div style={flow}>
          {STEPS.map((s, i) => (
            <div key={i} style={stepWrap}>
              <div style={stepCard}>
                <span style={stepNum}>0{i + 1}</span>
                <div style={stepIconBox}>{s.icon}</div>
                <h3 style={stepTitle}>{s.title}</h3>
                <p style={stepText}>{s.text}</p>
              </div>
              {i < STEPS.length - 1 && <div style={arrow} className="t2-flow-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 1100px) { .t2-flow-arrow { display: none !important; } }
      `}</style>
    </section>
  );
}

/* ============ 4. Vehicle tiers ============ */
function VehicleTiers({ basePrice }) {
  const TIERS = [
    {
      key: 'standard', name: 'Стандарт', icon: '🚗',
      car: 'Skoda Octavia / Seat Leon', cap: 'до 4 пассажиров',
      luggage: '3 чемодана', delta: 0,
      features: ['Кондиционер', 'Wi-Fi', 'Бутылка воды', 'Детское кресло'],
      bg: '#fff', highlight: false,
    },
    {
      key: 'comfort', name: 'Комфорт', icon: '🚘',
      car: 'Mercedes E-class', cap: 'до 4 пассажиров',
      luggage: '4 чемодана', delta: 15,
      features: ['Премиум-салон', 'Кожа', 'Wi-Fi', 'Climate control', 'Детское кресло'],
      bg: '#fff', highlight: true,
    },
    {
      key: 'minivan', name: 'Минивэн', icon: '🚐',
      car: 'Mercedes V-class / VW Caravelle', cap: 'до 8 пассажиров',
      luggage: '8 чемоданов', delta: 30,
      features: ['Большой багажник', 'Wi-Fi', 'Климат-зона', 'Кресла для детей'],
      bg: '#fff', highlight: false,
    },
  ];

  const wrap = { padding: '88px 32px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1280, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 36 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 38px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 6px', lineHeight: 1.1 };
  const lede = { fontSize: 15, color: 'var(--t2-ink-3)', margin: 0 };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 };
  const card = (h) => ({
    background: '#fff', border: '1px solid ' + (h ? 'var(--t2-red)' : 'var(--t2-line)'),
    borderRadius: 20, padding: '28px 26px',
    position: 'relative',
    boxShadow: h ? '0 24px 60px rgba(238,46,61,.18)' : 'var(--t2-sh-1)',
    transform: h ? 'translateY(-8px)' : 'translateY(0)',
  });
  const ribbon = { position: 'absolute', top: -12, right: 20, padding: '5px 12px', borderRadius: 999, background: 'var(--t2-red)', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' };
  const carEmoji = { fontSize: 44, marginBottom: 14 };
  const tierName = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--t2-ink)', margin: '0 0 4px', letterSpacing: '-.01em' };
  const tierCar = { fontSize: 13, color: 'var(--t2-ink-3)', marginBottom: 18 };
  const tierPrice = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 36, color: 'var(--t2-ink)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 };
  const tierPriceLabel = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 4, marginBottom: 16, letterSpacing: '.06em', textTransform: 'uppercase' };
  const features = { listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid var(--t2-line)', paddingTop: 16 };
  const feat = { padding: '6px 0', fontSize: 13, color: 'var(--t2-ink-2)', display: 'flex', alignItems: 'center', gap: 8 };
  const meta = { display: 'flex', gap: 16, fontSize: 11, color: 'var(--t2-ink-3)', marginBottom: 14 };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>Класс автомобиля</div>
          <h2 style={h2}>Выберите комфорт под свою компанию</h2>
          <p style={lede}>Все три класса с русскоязычным водителем и фиксированной ценой.</p>
        </div>
        <div style={grid}>
          {TIERS.map(t => (
            <div key={t.key} style={card(t.highlight)}>
              {t.highlight && <span style={ribbon}>Популярный</span>}
              <div style={carEmoji}>{t.icon}</div>
              <h3 style={tierName}>{t.name}</h3>
              <div style={tierCar}>{t.car}</div>
              <div style={meta}>
                <span>👥 {t.cap}</span>
                <span>🧳 {t.luggage}</span>
              </div>
              <div style={tierPrice}>{basePrice + t.delta}€</div>
              <div style={tierPriceLabel}>За автомобиль</div>
              <ul style={features}>
                {t.features.map((f, i) => (
                  <li key={i} style={feat}>
                    <span style={{ color: 'var(--t2-red)', fontWeight: 800 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ 5. Destination teaser ============ */
function DestinationTeaser({ r }) {
  const wrap = { padding: '88px 32px', background: '#fff' };
  const inner = { maxWidth: 1200, margin: '0 auto' };
  const split = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' };

  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 38px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 16px', lineHeight: 1.1 };
  const body = { fontSize: 16, lineHeight: 1.6, color: 'var(--t2-ink-2)', margin: '0 0 20px' };
  const bullets = { listStyle: 'none', padding: 0, margin: 0 };
  const bullet = { display: 'flex', gap: 12, padding: '10px 0', borderTop: '1px solid var(--t2-line)' };
  const bIcon = { fontSize: 22, flexShrink: 0 };
  const bTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--t2-ink)' };
  const bText = { fontSize: 13, color: 'var(--t2-ink-3)', marginTop: 2 };

  const photoCard = { position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '4 / 5', boxShadow: '0 30px 60px rgba(11,30,51,.18)', background: r.gradient };
  const photoImg = { width: '100%', height: '100%', objectFit: 'cover' };
  const photoTag = { position: 'absolute', bottom: 18, left: 18, right: 18, padding: '14px 18px', borderRadius: 16, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 12 };
  const photoTagEmoji = { fontSize: 24 };
  const photoTagText = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--t2-ink)' };
  const photoTagSub = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 2 };

  // Per-destination teasers; defaults work for any city.
  const HIGHLIGHTS = {
    Бенидорм: [
      { icon: '🏖', title: 'Levante и Poniente', text: 'Два пляжа с золотым песком и набережной 3 км.' },
      { icon: '🎢', title: 'Terra Mítica',         text: 'Тематический парк на 30 аттракционов.' },
      { icon: '🌃', title: 'Ночная жизнь',         text: 'Старый город — бары, тапас, live-музыка.' },
    ],
    Кальпе: [
      { icon: '⛰',  title: 'Penyal d\'Ifac',     text: 'Скала-символ Средиземноморья, высота 332 м.' },
      { icon: '🐟', title: 'Рыбный рынок',        text: 'Самый аутентичный аукцион улова на побережье.' },
      { icon: '🛶', title: 'Снорклинг',           text: 'Прозрачная вода вокруг бухты Calalga.' },
    ],
    Торревьеха: [
      { icon: '🦩', title: 'Розовое озеро',       text: 'Соляное озеро с фламинго — фото-локация номер 1.' },
      { icon: '🏝', title: 'Длинная пляжная коса', text: 'Кесада, Ла-Мата, Ла-Сения в радиусе 15 минут.' },
      { icon: '🛒', title: 'Воскресный маркет',   text: 'Огромный рынок на 1000+ прилавков.' },
    ],
    Дения: [
      { icon: '🏰', title: 'Замок XII века',       text: 'Главная достопримечательность над городом.' },
      { icon: '⛵', title: 'Марина',                text: 'Один из лучших яхт-портов на Costa Blanca.' },
      { icon: '🌳', title: 'Парк Montgó',          text: 'Заповедник с панорамами на 360°.' },
    ],
    Мурсия: [
      { icon: '⛪', title: 'Кафедральный собор',   text: 'Барокко XVIII века в самом центре.' },
      { icon: '🌹', title: 'Площадь Кардинала',    text: 'Главная площадь со старинными фасадами.' },
      { icon: '🍴', title: 'Гастрономия',          text: 'Овощи Региона + морепродукты — лучшее меню юга.' },
    ],
    Валенсия: [
      { icon: '🏛', title: 'Город искусств и наук', text: 'Футуристический комплекс Калатравы.' },
      { icon: '🥘', title: 'Родина паэльи',         text: 'Лучшее блюдо Испании — здесь и сейчас.' },
      { icon: '🌳', title: 'Парк Турии',            text: 'Реку превратили в зелёный парк — 9 км пешком.' },
    ],
  };
  const items = HIGHLIGHTS[r.ru] || [
    { icon: '🏖', title: 'Море и пляжи',      text: 'Чистые пляжи Costa Blanca с золотым песком.' },
    { icon: '🍽',  title: 'Гастрономия',       text: 'Свежие морепродукты и местная кухня.' },
    { icon: '🌅', title: 'Виды на закат',     text: 'Лучшие точки для фото на побережье.' },
  ];

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={split} className="t2-dest-split">
          <div>
            <div style={eyebrow}>Что вас ждёт</div>
            <h2 style={h2}>{r.ru} — что посмотреть</h2>
            <p style={body}>Мы знаем побережье как свои пять пальцев. Подскажем, куда сходить вечером, где поесть и какие места не пропустить.</p>
            <ul style={bullets}>
              {items.map((it, i) => (
                <li key={i} style={bullet}>
                  <span style={bIcon}>{it.icon}</span>
                  <div>
                    <div style={bTitle}>{it.title}</div>
                    <div style={bText}>{it.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={photoCard}>
              {r.img && <img src={r.img} alt={r.alt || r.ru} style={photoImg} />}
              <div style={photoTag}>
                <span style={photoTagEmoji}>{r.emoji}</span>
                <div>
                  <div style={photoTagText}>{r.ru}, Costa Blanca</div>
                  <div style={photoTagSub}>~{r.time} минут от ALC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .t2-dest-split { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ============ 6. Other routes ============ */
function OtherRoutes({ currentSlug, onSelectRoute }) {
  // Topical clustering for SEO: show routes in the SAME region first (a tight
  // internal-link neighbourhood), then fill with site-wide popular routes.
  // Every card is a real <a href> so search engines crawl the whole route graph.
  const group = (ROUTE_GROUPS || []).find(g => g.routes.some(x => x.slug === currentSlug));
  const siblings = group ? group.routes.filter(x => x.slug !== currentSlug) : [];
  const seen = new Set([currentSlug]);
  const related = [];
  for (const r of [...siblings, ...(POPULAR || [])]) {
    if (seen.has(r.slug)) continue;
    seen.add(r.slug);
    const meta = ROUTE_IMAGES[r.slug];
    related.push(meta ? { ...r, ...meta } : r);
    if (related.length >= 6) break;
  }
  if (!related.length) return null;

  const regionLabel = group ? group.label : null;

  const wrap = { padding: '64px 32px 88px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1280, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 32 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 3vw, 32px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 0', lineHeight: 1.1 };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 };
  const card = { background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--t2-line)', cursor: 'pointer', transition: 'all 220ms', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', textDecoration: 'none', color: 'inherit' };
  const thumb = { width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: 'var(--t2-bg-2)' };
  const thumbImg = { width: '100%', height: '100%', objectFit: 'cover' };
  const cText = { flex: 1, minWidth: 0 };
  const cName = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--t2-ink)' };
  const cTime = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 2 };
  const cPrice = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 16, color: 'var(--t2-red)', fontVariantNumeric: 'tabular-nums' };

  const linkRow = { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 28 };
  const pill = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 999, background: '#fff', border: '1px solid var(--t2-line)', color: 'var(--t2-ink-2)', textDecoration: 'none', fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 14 };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>Другие направления</div>
          <h2 style={h2}>{regionLabel ? `Трансфер по региону «${regionLabel}»` : 'Популярные маршруты из ALC'}</h2>
        </div>
        <div style={grid}>
          {related.map(r => (
            <a key={r.slug} style={card} href={pathOf('route', r.slug)}
               onClick={() => onSelectRoute(r.slug)}
               aria-label={`Трансфер Аликанте → ${r.ru} от ${r.price}€`}
               onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--t2-red)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--t2-sh-2)'; }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--t2-line)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={thumb}>{r.img && <img src={r.img} alt={`Трансфер Аликанте — ${r.ru}`} loading="lazy" style={thumbImg} />}</div>
              <div style={cText}>
                <div style={cName}>{r.emoji} Аликанте → {r.ru}</div>
                <div style={cTime}>{r.time} мин от ALC</div>
              </div>
              <div style={cPrice}>{r.price}€</div>
            </a>
          ))}
        </div>
        <div style={linkRow}>
          <a style={pill} href={pathOf('routes')}>📍 Все 40+ направлений</a>
          <a style={pill} href={pathOf('price')}>💶 Цены на трансфер</a>
          <a style={pill} href={pathOf('news')}>📰 Полезное о Costa Blanca</a>
        </div>
      </div>
    </section>
  );
}

/* ============ 5b. City guide — beaches, food, photo spots (with photos) ====== */
function RouteGuide({ guide }) {
  const wrap = { padding: '88px 32px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1100, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 28 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(26px, 3.2vw, 36px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 6px', lineHeight: 1.1 };
  const sub = { fontSize: 15, color: 'var(--t2-ink-3)', maxWidth: 640, margin: '0 auto' };

  const secTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 24, color: 'var(--t2-ink)', margin: '48px 0 4px', display: 'flex', alignItems: 'center', gap: 10 };
  const secSub = { fontSize: 14, color: 'var(--t2-ink-3)', margin: '0 0 18px', maxWidth: 720 };
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 };
  const card = { background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--t2-sh-1)', display: 'flex', flexDirection: 'column' };
  const cardImg = { width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', display: 'block', background: 'var(--t2-bg-2)' };
  const cardBody = { padding: '14px 16px' };
  const cardTop = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 6 };
  const cName = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--t2-ink)' };
  const cBadge = { fontSize: 11, fontWeight: 700, color: 'var(--t2-red)', background: 'var(--t2-red-soft)', padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 };
  const cText = { fontSize: 13.5, lineHeight: 1.55, color: 'var(--t2-ink-2)' };

  const Section = ({ icon, title, sub: s, items, badgeKey }) => (
    <>
      <h3 style={secTitle}>{icon} {title}</h3>
      {s && <p style={secSub}>{s}</p>}
      <div style={grid}>
        {items.map((it, i) => (
          <div key={i} style={card}>
            {it.img && <img src={it.img} alt={it.name} loading="lazy" decoding="async" style={cardImg} />}
            <div style={cardBody}>
              <div style={cardTop}>
                <span style={cName}>{it.name}</span>
                {badgeKey && it[badgeKey] && <span style={cBadge}>{it[badgeKey]}</span>}
              </div>
              <div style={cText}>{it.text}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Photo attribution (CC BY-SA / CC BY require it) — one compact, collapsible list.
  const seen = new Set();
  const creditList = [];
  for (const it of [...guide.beaches, ...guide.food, ...guide.photoSpots]) {
    const c = GUIDE_CREDITS[it.key];
    if (c && !seen.has(it.key)) { seen.add(it.key); creditList.push({ ...c, place: it.name }); }
  }

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>Гид по Аликанте</div>
          <h2 style={h2}>Пляжи, еда и лучшие фото-локации</h2>
          <p style={sub}>Пока водитель везёт вас из аэропорта — вот всё самое интересное в центре Аликанте и вокруг.</p>
        </div>

        <Section icon="🏖" title="Пляжи в радиусе 30 км" sub={guide.beachesIntro} items={guide.beaches} badgeKey="dist" />
        <Section icon="🍽" title="Где поесть — рекомендации для туристов" sub={guide.foodIntro} items={guide.food} badgeKey="type" />
        <Section icon="📸" title="Лучшие места для фото и селфи" sub={guide.photoIntro} items={guide.photoSpots} />

        {creditList.length > 0 && (
          <details style={{ marginTop: 40, fontSize: 12, color: 'var(--t2-ink-3)' }}>
            <summary style={{ cursor: 'pointer' }}>Авторы фотографий (Wikimedia Commons)</summary>
            <ul style={{ margin: '10px 0 0', paddingLeft: 18, lineHeight: 1.7 }}>
              {creditList.map((c, i) => (
                <li key={i}>
                  {c.place} — {c.source
                    ? <a href={c.source} target="_blank" rel="noopener nofollow" style={{ color: 'var(--t2-ink-2)' }}>{c.author}</a>
                    : c.author}{c.license ? ` (${c.license})` : ''}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </section>
  );
}

export default RoutePage;
