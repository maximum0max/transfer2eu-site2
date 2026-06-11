import React from 'react'
// FAQ v2 — 2-column card grid, all questions visible (no accordion).
// Each card has a category emoji + Q + A. Replaces the +/- accordion.

const FAQS = [
  { emoji: '💳', q: 'Как происходит оплата?',         a: 'Картой онлайн при бронировании или наличными водителю в начале поездки. Цена не меняется.' },
  { emoji: '✈',  q: 'Что если рейс задерживается?',    a: 'Водитель отслеживает рейс по номеру. Бесплатное ожидание — до 90 минут от времени посадки.' },
  { emoji: '👶', q: 'Можно ли с детьми?',              a: 'Да. Детское кресло — бесплатная опция, укажите возраст и вес ребёнка при заказе.' },
  { emoji: '🧳', q: 'Сколько багажа можно взять?',     a: '1 чемодан + 1 ручная кладь на пассажира. Больше — добавьте «доп. багаж» в заявке.' },
  { emoji: '🚫', q: 'Можно ли отменить бронь?',        a: 'Бесплатная отмена за 24 часа. Позже — удерживается 50%, в день поездки — 100%.' },
  { emoji: '🚐', q: 'Сколько пассажиров помещается?',  a: 'Указанные цены — за седан, до 4 пассажиров. Для компании 5–8 человек подаём минивэн: это отдельный тариф, цену уточним в WhatsApp.' },
];

function FAQ() {
  const wrap = { padding: '88px 32px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1100, margin: '0 auto' };

  const head = { textAlign: 'center', marginBottom: 40 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 6px', lineHeight: 1.1 };
  const lede = { fontSize: 15, color: 'var(--t2-ink-3)', margin: 0 };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 };
  const card = {
    background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 18, padding: '22px 24px',
    display: 'flex', gap: 16, alignItems: 'flex-start',
  };
  const emojiBox = {
    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--t2-red-soft)', fontSize: 22,
  };
  const qText = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--t2-ink)', margin: '0 0 6px', letterSpacing: '-.005em' };
  const aText = { fontSize: 13, lineHeight: 1.55, color: 'var(--t2-ink-3)', margin: 0 };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>Частые вопросы</div>
          <h2 style={h2}>Что ещё спрашивают</h2>
          <p style={lede}>Не нашли ответ? Напишите в WhatsApp — подскажем.</p>
        </div>

        <div style={grid}>
          {FAQS.map((f, i) => (
            <div key={i} style={card}>
              <div style={emojiBox}>{f.emoji}</div>
              <div>
                <h3 style={qText}>{f.q}</h3>
                <p style={aText}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
