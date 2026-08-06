import React from 'react'
import { useT } from './i18n.jsx'
// FAQ v2 — 2-column card grid, all questions visible (no accordion).
// Each card has a category emoji + Q + A. Replaces the +/- accordion.

const STR = {
  ru: {
    eyebrow: 'Частые вопросы', h2: 'Что ещё спрашивают',
    lede: 'Не нашли ответ? Напишите в WhatsApp — подскажем.',
    faqs: [
      { emoji: '💳', q: 'Как происходит оплата?',        a: 'Картой онлайн при бронировании или наличными водителю в начале поездки. Цена не меняется.' },
      { emoji: '✈',  q: 'Что если рейс задерживается?',   a: 'Водитель отслеживает рейс по номеру. Бесплатное ожидание — до 90 минут от времени посадки.' },
      { emoji: '👶', q: 'Можно ли с детьми?',             a: 'Да. Детское кресло — бесплатная опция, укажите возраст и вес ребёнка при заказе.' },
      { emoji: '🧳', q: 'Сколько багажа можно взять?',    a: '1 чемодан + 1 ручная кладь на пассажира. Больше — добавьте «доп. багаж» в заявке.' },
      { emoji: '🚫', q: 'Можно ли отменить бронь?',       a: 'Бесплатная отмена за 24 часа. Позже — удерживается 50%, в день поездки — 100%.' },
      { emoji: '🚐', q: 'Сколько пассажиров помещается?', a: 'Указанные цены — за седан, до 4 пассажиров. Для компании 5–8 человек подаём минивэн: это отдельный тариф, цену уточним в WhatsApp.' },
    ],
  },
  uk: {
    eyebrow: 'Часті запитання', h2: 'Що ще запитують',
    lede: 'Не знайшли відповідь? Напишіть у WhatsApp — підкажемо.',
    faqs: [
      { emoji: '💳', q: 'Як відбувається оплата?',        a: 'Карткою онлайн при бронюванні або готівкою водієві на початку поїздки. Ціна не змінюється.' },
      { emoji: '✈',  q: 'Що якщо рейс затримується?',     a: 'Водій відстежує рейс за номером. Безкоштовне очікування — до 90 хвилин від часу посадки.' },
      { emoji: '👶', q: 'Чи можна з дітьми?',             a: 'Так. Дитяче крісло — безкоштовна опція, вкажіть вік і вагу дитини при замовленні.' },
      { emoji: '🧳', q: 'Скільки багажу можна взяти?',    a: '1 валіза + 1 ручна поклажа на пасажира. Більше — додайте «дод. багаж» у заявці.' },
      { emoji: '🚫', q: 'Чи можна скасувати бронювання?', a: 'Безкоштовне скасування за 24 години. Пізніше — утримується 50%, у день поїздки — 100%.' },
      { emoji: '🚐', q: 'Скільки пасажирів вміщується?',  a: 'Вказані ціни — за седан, до 4 пасажирів. Для компанії 5–8 осіб подаємо мінівен: це окремий тариф, ціну уточнимо у WhatsApp.' },
    ],
  },
};

function FAQ() {
  const t = useT(STR);
  const FAQS = t.faqs;
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
          <div style={eyebrow}>{t.eyebrow}</div>
          <h2 style={h2}>{t.h2}</h2>
          <p style={lede}>{t.lede}</p>
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
