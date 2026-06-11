import React from 'react'
import { waLink } from './BrandData.jsx'
// How it works v2 — vertical timeline with center spine and alternating
// left/right step cards. Replaces the row-of-cards layout.

const STEPS = [
  { n: '01', icon: '💬', title: 'Напишите в WhatsApp',   text: 'Укажите дату, время вылета, маршрут и количество пассажиров.' },
  { n: '02', icon: '✅', title: 'Получите подтверждение', text: 'Подтвердим заявку и пришлём данные водителя за сутки.' },
  { n: '03', icon: '🙋', title: 'Водитель встречает вас', text: 'Водитель с именной табличкой ждёт в зале прилётов.' },
  { n: '04', icon: '🏨', title: 'Комфортная поездка',     text: 'Чистое авто, климат-контроль, помощь с чемоданами.' },
];

function HowItWorks() {
  const wrap = { padding: '96px 32px 88px', background: '#fff', position: 'relative', overflow: 'hidden' };
  const inner = { maxWidth: 980, margin: '0 auto', position: 'relative' };

  const head = { textAlign: 'center', marginBottom: 56 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 8px', lineHeight: 1.1 };
  const lede = { fontSize: 15, color: 'var(--t2-ink-3)', margin: 0 };

  // Vertical spine
  const spineWrap = { position: 'relative', padding: '0 0 12px' };
  const spine = { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, var(--t2-red-soft) 0%, var(--t2-red) 50%, var(--t2-red-soft) 100%)', transform: 'translateX(-50%)', borderRadius: 999 };

  const row = (side) => ({
    display: 'grid', gridTemplateColumns: '1fr 56px 1fr', alignItems: 'center',
    marginBottom: 28, position: 'relative',
  });
  const dotWrap = { display: 'flex', justifyContent: 'center', alignItems: 'center' };
  const dot = (n) => ({
    width: 48, height: 48, borderRadius: '50%',
    background: '#fff', border: '3px solid var(--t2-red)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 14, color: 'var(--t2-red)',
    fontVariantNumeric: 'tabular-nums', position: 'relative', zIndex: 2,
    boxShadow: '0 8px 20px rgba(238,46,61,.25)',
  });

  const card = {
    background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)', borderRadius: 18,
    padding: '20px 24px', position: 'relative',
  };
  const cardLeft = { ...card, gridColumn: '1' };
  const cardRight = { ...card, gridColumn: '3' };
  const cardEmpty = { gridColumn: '1' };

  const stepEmoji = { fontSize: 26, marginBottom: 8 };
  const stepTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--t2-ink)', margin: '0 0 6px' };
  const stepText = { fontSize: 14, lineHeight: 1.55, color: 'var(--t2-ink-3)', margin: 0 };

  // CTA below timeline
  const cta = { textAlign: 'center', marginTop: 32 };
  const waBtn = { background: '#25d366', color: '#fff', fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 24px rgba(34,197,94,.25)' };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>Просто и быстро</div>
          <h2 style={h2}>Как заказать трансфер</h2>
          <p style={lede}>Четыре шага. От первого сообщения до встречи у выхода из аэропорта.</p>
        </div>

        <div style={spineWrap} className="t2-timeline">
          <div style={spine} className="t2-spine" />
          {STEPS.map((s, i) => (
            <div key={i} style={row()} className="t2-step">
              {i % 2 === 0 ? (
                <>
                  <div style={cardLeft} className="t2-card t2-left">
                    <div style={stepEmoji}>{s.icon}</div>
                    <h3 style={stepTitle}>{s.title}</h3>
                    <p style={stepText}>{s.text}</p>
                  </div>
                  <div style={dotWrap}><div style={dot()}>{s.n}</div></div>
                  <div style={cardEmpty} />
                </>
              ) : (
                <>
                  <div style={cardEmpty} />
                  <div style={dotWrap}><div style={dot()}>{s.n}</div></div>
                  <div style={cardRight} className="t2-card t2-right">
                    <div style={stepEmoji}>{s.icon}</div>
                    <h3 style={stepTitle}>{s.title}</h3>
                    <p style={stepText}>{s.text}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div style={cta}>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" style={waBtn}>
            📲 Написать в WhatsApp
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .t2-timeline .t2-spine { left: 24px !important; transform: none !important; }
          .t2-step { grid-template-columns: 48px 1fr !important; gap: 16px; }
          .t2-step > :first-child { grid-column: 2 !important; }
          .t2-step > :nth-child(2) { grid-column: 1 !important; justify-content: flex-start !important; }
          .t2-step > :nth-child(3) { display: none !important; }
          .t2-step .t2-right { grid-column: 2 !important; }
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;
