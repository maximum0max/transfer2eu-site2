import React from 'react'
import { useT } from './i18n.jsx'
// GoogleReviews — real reviews pulled from the business's Google Maps listing
// («Трансфер Аликанте Такси онлайн», 4.6★ / 9 отзывов). Texts are faithful
// translations of the reviewers' original words; the negative 1★ review is
// intentionally left out of the display block. No aggregateRating schema is
// emitted: Google's quality guidelines forbid self-served rating markup.
//
// Rendered at the bottom of the Gran Alacant route page (social proof right
// before the final CTA). Reusable — add the component anywhere else if needed.

const MAPS_URL = 'https://maps.google.com/?cid=0x418e6d8899704b6b';

const STR = {
  ru: {
    eyebrow: 'Отзывы Google',
    h2: 'Что говорят пассажиры о нас',
    lede: 'Оценка 4.6 из 5 на Google — на основе 9 отзывов.',
    google: 'Google',
    review_badge: 'Отзыв Google',
    view_all: 'Все отзывы на Google Maps →',
    reviews: [
      { name: 'Tadas Valusaitis', when: '2 года назад', rating: 5, bg: 'linear-gradient(135deg,#4285F4,#1a56c7)',
        text: 'Быстрый трансфер, хорошие и вежливые водители, очень хорошая связь, разумные цены. Очень рекомендую.' },
      { name: 'Borys Kezlia', when: '3 года назад', rating: 5, bg: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
        text: 'Всё работает очень хорошо. Есть даже украиноязычные водители. 👍' },
      { name: 'Lena Swetschnikar', when: '3 года назад', rating: 5, bg: 'linear-gradient(135deg,#c9a980,#7a5a3a)',
        text: 'Большое спасибо за чёткую организацию трансфера. Очень организованно и пунктуально — рекомендую всем!' },
      { name: 'Sergey', when: '2 года назад', rating: 5, bg: 'linear-gradient(135deg,#22c55e,#15803d)',
        text: 'Всё было супер.' },
    ],
  },
  uk: {
    eyebrow: 'Відгуки Google',
    h2: 'Що кажуть пасажири про нас',
    lede: 'Оцінка 4.6 з 5 на Google — на основі 9 відгуків.',
    google: 'Google',
    review_badge: 'Відгук Google',
    view_all: 'Усі відгуки на Google Maps →',
    reviews: [
      { name: 'Tadas Valusaitis', when: '2 роки тому', rating: 5, bg: 'linear-gradient(135deg,#4285F4,#1a56c7)',
        text: 'Швидкий трансфер, хороші й ввічливі водії, дуже хороший звʼязок, розумні ціни. Дуже рекомендую.' },
      { name: 'Borys Kezlia', when: '3 роки тому', rating: 5, bg: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
        text: 'Усе працює дуже добре. Є навіть україномовні водії. 👍' },
      { name: 'Lena Swetschnikar', when: '3 роки тому', rating: 5, bg: 'linear-gradient(135deg,#c9a980,#7a5a3a)',
        text: 'Велике дякую за чітку організацію трансферу. Дуже організовано й пунктуально — рекомендую всім!' },
      { name: 'Sergey', when: '2 роки тому', rating: 5, bg: 'linear-gradient(135deg,#22c55e,#15803d)',
        text: 'Усе було супер.' },
    ],
  },
};

// Official four-colour Google "G" mark (public asset).
function GoogleG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function GoogleReviews() {
  const t = useT(STR);
  const wrap = { padding: '88px 32px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1200, margin: '0 auto' };

  const head = { textAlign: 'center', marginBottom: 40 };
  const eyebrow = { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '10px 0 6px', lineHeight: 1.1 };
  const lede = { fontSize: 15, color: 'var(--t2-ink-3)', margin: 0 };

  // Compact rating strip: Google G + 4.6★ + count + link
  const ratingStrip = {
    display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
    marginTop: 18, padding: '10px 18px', background: '#fff', border: '1px solid var(--t2-line)',
    borderRadius: 999, boxShadow: 'var(--t2-sh-1)', fontSize: 14, color: 'var(--t2-ink-2)',
  };
  const ratingStars = { display: 'inline-flex', gap: 2, color: '#f59e0b', fontSize: 15 };
  const viewAll = { color: 'var(--t2-red)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginTop: 28 };
  const card = {
    background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 20,
    padding: '24px 26px', position: 'relative', display: 'flex', flexDirection: 'column', gap: 14,
    boxShadow: 'var(--t2-sh-1)',
  };
  const stars = { display: 'inline-flex', gap: 2, color: '#f59e0b', fontSize: 14 };
  const quote = { fontFamily: "'Inter',system-ui", fontSize: 15, lineHeight: 1.55, color: 'var(--t2-ink)', margin: 0, flex: 1 };
  const meta = { display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: '1px solid var(--t2-line)' };
  const av = (bg) => ({ width: 38, height: 38, borderRadius: '50%', background: bg, color: '#fff', fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });
  const metaName = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--t2-ink)' };
  const metaWhen = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 2, fontFamily: "'Inter',system-ui" };
  const googleBadge = {
    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 999,
    background: 'var(--t2-bg-2)', color: 'var(--t2-ink-3)', fontSize: 10, fontWeight: 600,
    letterSpacing: '.03em', marginLeft: 'auto', flexShrink: 0, fontFamily: "'Inter',system-ui",
  };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}><GoogleG size={16} /> {t.eyebrow}</div>
          <h2 style={h2}>{t.h2}</h2>
          <p style={lede}>{t.lede}</p>
          <div style={ratingStrip}>
            <GoogleG size={18} />
            <b style={{ color: 'var(--t2-ink)', fontFamily: "'Onest',sans-serif", fontSize: 15 }}>4.6</b>
            <span style={ratingStars}>{'★'.repeat(5)}</span>
            <span style={{ color: 'var(--t2-ink-3)' }}>· 9</span>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" style={viewAll}>{t.view_all}</a>
          </div>
        </div>

        <div style={grid}>
          {t.reviews.map((r, i) => (
            <article key={i} style={card}>
              <div style={stars}>{'★'.repeat(r.rating)}</div>
              <p style={quote}>{r.text}</p>
              <div style={meta}>
                <div style={av(r.bg)}>{r.name.charAt(0)}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={metaName}>{r.name}</div>
                  <div style={metaWhen}>{r.when}</div>
                </div>
                <span style={googleBadge}><GoogleG size={11} /> {t.review_badge}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GoogleReviews;
