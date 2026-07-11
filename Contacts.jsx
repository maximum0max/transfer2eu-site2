import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import { BRAND, waLink } from './BrandData.jsx'

const CHANNELS = [
  { icon: '📲', title: 'WhatsApp',  value: '+34 651 011 911', href: () => waLink(), label: 'Открыть чат',     color: '#25d366' },
  { icon: '📞', title: 'Телефон',   value: '+34 651 011 911', href: () => 'tel:' + BRAND.tel, label: 'Позвонить',    color: 'var(--t2-red)' },
  { icon: '📩', title: 'E-mail',    value: 'transfers2eu@gmail.com', href: () => 'mailto:' + BRAND.email, label: 'Написать письмо', color: 'var(--t2-deep)' },
];

const HOURS = [
  { day: 'Пн – Пт', time: '08:00 – 23:00' },
  { day: 'Сб – Вс', time: '08:00 – 23:00' },
  { day: 'Срочный заказ', time: '24/7 в WhatsApp' },
];

function ContactsPage({ onNav }) {
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
        eyebrow="📲 На связи"
        title="Свяжитесь с нами"
        subtitle="Ответим в WhatsApp за 15 минут. Подскажем цену, подберём авто, забронируем поездку." />

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
          <h2 style={blockH2}>Время приема заявок</h2>
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
