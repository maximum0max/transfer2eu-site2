import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import { BRAND, waLink } from './BrandData.jsx'
import { useT } from './i18n.jsx'
// Bilingual (RU default + UK): visible strings live in the co-located STR
// bundle picked by useT(). Phone numbers, e-mail and brand names are never
// translated.

const STR = {
  ru: {
    eyebrow: '📲 На связи',
    title: 'Свяжитесь с нами',
    subtitle: 'Ответим в WhatsApp за 15 минут. Подскажем цену, подберём авто, забронируем поездку.',
    hours_title: 'Время приема заявок',
    phone: 'Телефон',
    open_chat: 'Открыть чат',
    call: 'Позвонить',
    write: 'Написать письмо',
    day_week: 'Пн – Пт',
    day_weekend: 'Сб – Вс',
    urgent: 'Срочный заказ',
    urgent_time: '24/7 в WhatsApp',
  },
  uk: {
    eyebrow: '📲 На зв\'язку',
    title: 'Зв\'яжіться з нами',
    subtitle: 'Відповімо у WhatsApp за 15 хвилин. Підкажемо ціну, підберемо авто, забронюємо поїздку.',
    hours_title: 'Час прийому заявок',
    phone: 'Телефон',
    open_chat: 'Відкрити чат',
    call: 'Зателефонувати',
    write: 'Написати листа',
    day_week: 'Пн – Пт',
    day_weekend: 'Сб – Нд',
    urgent: 'Термінове замовлення',
    urgent_time: '24/7 у WhatsApp',
  },
};

function ContactsPage({ onNav }) {
  const t = useT(STR);

  const CHANNELS = [
    { icon: '📲', title: 'WhatsApp',  value: '+34 651 011 911', href: () => waLink(), label: t.open_chat, color: '#25d366' },
    { icon: '📞', title: t.phone,     value: '+34 651 011 911', href: () => 'tel:' + BRAND.tel, label: t.call, color: 'var(--t2-red)' },
    { icon: '📩', title: 'E-mail',    value: 'transfers2eu@gmail.com', href: () => 'mailto:' + BRAND.email, label: t.write, color: 'var(--t2-deep)' },
  ];

  const HOURS = [
    { day: t.day_week, time: '08:00 – 23:00' },
    { day: t.day_weekend, time: '08:00 – 23:00' },
    { day: t.urgent, time: t.urgent_time },
  ];

  const wrap = { background: '#fff' };
  const inner = { maxWidth: 1100, margin: '0 auto', padding: '64px 24px' };
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 };
  const card = { background: 'var(--t2-bg)', border: '1px solid var(--t2-line)', borderRadius: 18, padding: '28px 26px', boxShadow: 'var(--t2-sh-1)', display: 'flex', flexDirection: 'column' };
  const cardIcon = { fontSize: 36, marginBottom: 14 };
  const cardTitle = { fontFamily: "'Onest',sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--t2-ink-3)', letterSpacing: '.05em', textTransform: 'uppercase', margin: '0 0 6px' };
  const cardValue = { fontFamily: "'Onest',sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--t2-ink)', margin: '0 0 18px', fontVariantNumeric: 'tabular-nums' };
  const cardBtn = (color) => ({
    marginTop: 'auto', alignSelf: 'flex-start',
    padding: '10px 18px', borderRadius: 999, background: color, color: '#fff',
    fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 13,
    textDecoration: 'none', cursor: 'pointer',
  });

  const block = { background: 'var(--t2-bg-2)', padding: '56px 32px' };
  const blockInner = { maxWidth: 800, margin: '0 auto' };
  const blockH2 = { fontFamily: "'Onest',sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--t2-ink)', textAlign: 'center', margin: '0 0 24px', letterSpacing: '-.01em' };
  const hoursBox = { background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 16, overflow: 'hidden' };
  const hourRow = { display: 'flex', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid var(--t2-line)', fontFamily: "'Inter',system-ui", fontSize: 14, fontVariantNumeric: 'tabular-nums' };
  const hourDay = { color: 'var(--t2-ink)', fontWeight: 500 };
  const hourTime = { color: 'var(--t2-red)', fontWeight: 700 };

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle} />

      <div style={wrap}>
        <div style={inner}>
          <div style={grid}>
            {CHANNELS.map((c, i) => (
              <div key={i} style={card}>
                <div style={cardIcon}>{c.icon}</div>
                <div style={cardTitle}>{c.title}</div>
                <div style={cardValue}>{c.value}</div>
                <a href={c.href()} target={c.title === 'WhatsApp' ? '_blank' : undefined} rel="noopener noreferrer" style={cardBtn(c.color)}>
                  {c.label} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={block}>
        <div style={blockInner}>
          <h2 style={blockH2}>{t.hours_title}</h2>
          <div style={hoursBox}>
            {HOURS.map((h, i) => (
              <div key={i} style={{ ...hourRow, ...(i === HOURS.length - 1 ? { borderBottom: 0 } : null) }}>
                <span style={hourDay}>{h.day}</span>
                <span style={hourTime}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CTABanner onNav={onNav} />
    </>
  );
}

export default ContactsPage;
