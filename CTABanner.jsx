import React from 'react'
import { BRAND, waLink } from './BrandData.jsx'
// CTA banner v2 — diagonal split: deep red panel left with action, ink panel
// right with phone. Replaces the dark stars band.

function CTABanner({ onNav }) {
  const wrap = { padding: '32px', background: '#fff' };
  const card = {
    position: 'relative', overflow: 'hidden',
    maxWidth: 1280, margin: '0 auto', borderRadius: 28,
    background: 'var(--t2-deep)',
    display: 'grid', gridTemplateColumns: '1.2fr 1fr',
    minHeight: 320,
    boxShadow: '0 30px 80px rgba(11,30,51,.25)',
  };

  // Left red panel
  const left = {
    position: 'relative', padding: '56px 56px 56px 56px',
    background: 'linear-gradient(135deg, var(--t2-red) 0%, #c01928 100%)',
    color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
  };
  const leftBlob = { position: 'absolute', top: -120, left: -120, width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,.08)', filter: 'blur(20px)', pointerEvents: 'none' };
  const tag = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.32)', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', alignSelf: 'flex-start', marginBottom: 18, position: 'relative', zIndex: 1 };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-.02em', color: '#fff', margin: '0 0 14px', lineHeight: 1.05, position: 'relative', zIndex: 1 };
  const sub = { fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,.88)', maxWidth: 420, margin: '0 0 24px', position: 'relative', zIndex: 1 };
  const waBtn = { background: '#fff', color: 'var(--t2-red)', fontFamily: "'Inter',system-ui", fontWeight: 800, fontSize: 15, padding: '14px 26px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, alignSelf: 'flex-start', boxShadow: '0 14px 28px rgba(0,0,0,.25)', position: 'relative', zIndex: 1 };

  // Right deep panel
  const right = {
    padding: '56px 48px',
    color: '#fff',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    position: 'relative',
  };
  const rightBlob = { position: 'absolute', bottom: -120, right: -120, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(238,46,61,.18), transparent 70%)', pointerEvents: 'none' };
  const phoneEyebrow = { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.55)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 12 };
  const phone = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: '-.01em', fontVariantNumeric: 'tabular-nums', color: '#fff', textDecoration: 'none', display: 'block', marginBottom: 18, position: 'relative', zIndex: 1 };
  const phoneSub = { fontSize: 14, color: 'rgba(255,255,255,.65)', marginBottom: 24, position: 'relative', zIndex: 1 };
  const hours = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, position: 'relative', zIndex: 1 };
  const hourCell = { padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.10)' };
  const hourLabel = { fontSize: 10, color: 'rgba(255,255,255,.55)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 };
  const hourValue = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', fontVariantNumeric: 'tabular-nums' };

  return (
    <section style={wrap}>
      <div style={card} className="t2-cta-card">
        <div style={left} className="t2-cta-left">
          <div style={leftBlob} />
          <span style={tag}>📲 Готовы ехать</span>
          <h2 style={h2}>Закажите трансфер<br/>прямо сейчас</h2>
          <p style={sub}>Ответ в WhatsApp за 15 минут. Цена фиксированная, оплата по факту приезда.</p>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" style={waBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.86L0 24l6.316-1.508A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.372l-.36-.214-3.727.89.916-3.622-.235-.372A9.818 9.818 0 1112 21.818z"/>
            </svg>
            Написать в WhatsApp
          </a>
        </div>

        <div style={right} className="t2-cta-right">
          <div style={rightBlob} />
          <div style={phoneEyebrow}>Или позвоните</div>
          <a href={'tel:' + BRAND.tel} style={phone}>{BRAND.phone}</a>
          <div style={phoneSub}>Бесплатный звонок из Испании. Говорим по-русски.</div>
          <div style={hours}>
            <div style={hourCell}>
              <div style={hourLabel}>Чат</div>
              <div style={hourValue}>24 / 7</div>
            </div>
            <div style={hourCell}>
              <div style={hourLabel}>Звонок</div>
              <div style={hourValue}>08:00 — 23:00</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .t2-cta-card { grid-template-columns: 1fr !important; }
          .t2-cta-left { clip-path: none !important; padding: 40px 32px !important; }
          .t2-cta-right { padding: 40px 32px !important; }
        }
      `}</style>
    </section>
  );
}

export default CTABanner;
