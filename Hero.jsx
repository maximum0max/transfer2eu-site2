import React from 'react'
import BookingForm from './BookingForm.jsx'
import { getTrust, BRAND } from './BrandData.jsx'
import { useT, useLang } from './i18n.jsx'
// Hero v4 — two-column: headline + subheadline + trust badges on the LEFT,
// the 2-step BookingForm on the RIGHT. Stacks on mobile.

const STR = {
  ru: {
    status: 'Доступен сейчас · Работаем 24/7',
    h1a: 'Трансфер из аэропорта Аликанте по ',
    sub: 'Частный автомобиль с русскоязычным водителем. Встречаем с табличкой, цена не меняется, оплата по факту приезда.',
  },
  uk: {
    status: 'Доступний зараз · Працюємо 24/7',
    h1a: 'Трансфер з аеропорту Аліканте по ',
    sub: 'Приватний автомобіль з україномовним водієм. Зустрічаємо з табличкою, ціна не змінюється, оплата за фактом приїзду.',
  },
};

function Hero({ onBook }) {
  const lang = useLang();
  const t = useT(STR);
  const trust = getTrust(lang);
  const wrap = {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(160deg, #fff 0%, #fef5f5 50%, #fff 100%)',
    paddingTop: 64, paddingBottom: 80,
  };
  const blob1 = { position: 'absolute', top: -120, right: -120, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(238,46,61,.18), transparent 60%)', filter: 'blur(20px)', pointerEvents: 'none' };
  const blob2 = { position: 'absolute', bottom: -220, left: -160, width: 540, height: 540, borderRadius: '50%', background: 'radial-gradient(circle, rgba(11,30,51,.10), transparent 65%)', filter: 'blur(20px)', pointerEvents: 'none' };

  const inner = { position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '0 32px', zIndex: 2 };
  const grid = { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,520px)', gap: 56, alignItems: 'center' };

  // Left column
  const chip = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: '#fff', border: '1px solid var(--t2-line)', boxShadow: 'var(--t2-sh-1)', fontSize: 12, fontWeight: 600, color: 'var(--t2-ink-2)' };
  const dot = { width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulseDot 1.8s ease-in-out infinite' };
  const h1 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 4.4vw, 58px)', lineHeight: 1.05, letterSpacing: '-.025em', color: 'var(--t2-ink)', margin: '20px 0 16px' };
  const accent = { background: 'linear-gradient(135deg, var(--t2-red) 0%, #c01928 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
  const p = { fontSize: 17, lineHeight: 1.55, color: 'var(--t2-ink-2)', maxWidth: 480, margin: '0 0 24px' };

  const ctaRow = { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 };
  const phoneBtn = { background: '#fff', color: 'var(--t2-ink)', fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 14, padding: '12px 22px', borderRadius: 12, textDecoration: 'none', border: '1px solid var(--t2-line)', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: 'var(--t2-sh-1)' };

  const trustRow = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, maxWidth: 440 };
  const trustBadge = { display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid var(--t2-line)', boxShadow: 'var(--t2-sh-1)', borderRadius: 12, padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--t2-ink-2)' };

  return (
    <section style={wrap}>
      <div style={blob1} className="t2-float" /><div style={blob2} className="t2-float-slow" />
      <div style={inner}>
        <div style={grid} className="t2-hero-grid">
          {/* LEFT — headline + subheadline */}
          <div>
            <span style={chip} className="t2-anim-up"><span style={dot} />{t.status}</span>
            <h1 style={{ ...h1, animationDelay: '.07s' }} className="t2-anim-up">
              {t.h1a}<span style={accent}>Costa Blanca</span>
            </h1>
            <p style={{ ...p, animationDelay: '.14s' }} className="t2-anim-up">
              {t.sub}
            </p>

            <div style={{ ...ctaRow, animationDelay: '.2s' }} className="t2-anim-up">
              <a href={'tel:' + BRAND.tel} style={phoneBtn}>📞 {BRAND.phone}</a>
            </div>

            <div style={{ ...trustRow, animationDelay: '.26s' }} className="t2-anim-up">
              {(trust || []).map((item, i) => (
                <div key={i} style={trustBadge}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — booking form */}
          <div style={{ animationDelay: '.16s' }} className="t2-anim-up">
            <BookingForm />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.3); opacity: .55 } }
        @media (max-width: 920px) {
          .t2-hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
