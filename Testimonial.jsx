import React from 'react'
// Testimonial v2 — 3-card review grid with avatar + name + route badge.
// Replaces the single centered quote.

const REVIEWS = [
  {
    init: 'АН', name: 'Анна Н.',  trip: 'ALC → Бенидорм',
    bg: 'linear-gradient(135deg,#c9a980,#7a5a3a)',
    text: 'С двумя детьми и горой багажа. Водитель встретил с табличкой, детские кресла стояли. Без пробок и языкового барьера.',
    rating: 5,
  },
  {
    init: 'ОК', name: 'Олег К.',   trip: 'ALC → Кальпе',
    bg: 'linear-gradient(135deg,#7c3aed,#4338ca)',
    text: 'Заказывал по WhatsApp за час до посадки. Подача вовремя, цена ровно как сказали. В этом году повторю.',
    rating: 5,
  },
  {
    init: 'МС', name: 'Мария С.',  trip: 'ALC → Торревьеха',
    bg: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
    text: 'Прилёт задержали на час, водитель ждал спокойно. Дочка уснула в кресле — приехали как в такси к дому. Спасибо!',
    rating: 5,
  },
];

function Testimonial() {
  const wrap = { padding: '88px 32px', background: '#fff' };
  const inner = { maxWidth: 1200, margin: '0 auto' };

  const head = { textAlign: 'center', marginBottom: 40 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 6px', lineHeight: 1.1 };
  const lede = { fontSize: 15, color: 'var(--t2-ink-3)', margin: 0 };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginTop: 32 };
  const card = {
    background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)', borderRadius: 20,
    padding: '24px 26px', position: 'relative', display: 'flex', flexDirection: 'column', gap: 16,
  };
  const quoteMark = {
    position: 'absolute', top: 16, right: 22, fontFamily: 'Georgia, serif', fontSize: 56, lineHeight: .8,
    color: 'var(--t2-red-soft)', userSelect: 'none', pointerEvents: 'none',
  };
  const stars = { display: 'inline-flex', gap: 2, color: '#f59e0b', fontSize: 14 };
  const quote = { fontFamily: "'Inter',system-ui", fontSize: 15, lineHeight: 1.55, color: 'var(--t2-ink)', margin: 0, flex: 1 };

  const meta = { display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: '1px solid var(--t2-line)' };
  const av = (bg) => ({ width: 38, height: 38, borderRadius: '50%', background: bg, color: '#fff', fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });
  const metaName = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--t2-ink)' };
  const metaTrip = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 2, fontFamily: "'Inter',system-ui" };
  const tripBadge = { display: 'inline-flex', padding: '3px 9px', borderRadius: 999, background: 'var(--t2-red-soft)', color: 'var(--t2-red)', fontSize: 10, fontWeight: 700, letterSpacing: '.04em', marginLeft: 'auto', flexShrink: 0 };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>Отзывы пассажиров</div>
          <h2 style={h2}>Что говорят гости Costa Blanca</h2>
          <p style={lede}>4.9 / 5 средняя оценка · 2 800+ туристов</p>
        </div>

        <div style={grid}>
          {REVIEWS.map((r, i) => (
            <article key={i} style={card}>
              <span style={quoteMark}>“</span>
              <div style={stars}>{'★'.repeat(r.rating)}</div>
              <p style={quote}>{r.text}</p>
              <div style={meta}>
                <div style={av(r.bg)}>{r.init}</div>
                <div>
                  <div style={metaName}>{r.name}</div>
                  <div style={metaTrip}>{r.trip}</div>
                </div>
                <span style={tripBadge}>ALC</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
