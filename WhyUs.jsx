import React from 'react'
// Why us v2 — bento grid: 4 cards of different sizes, one big "story" card
// stretching across two columns + two rows, three small feature cards filling
// the rest. Replaces the old 2-col stats + 4 cards layout.

function WhyUs() {
  const wrap = { padding: '88px 32px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1200, margin: '0 auto' };

  const head = { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36 };
  const headLeft = { maxWidth: 600 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 0', lineHeight: 1.1 };
  const lede = { fontSize: 15, color: 'var(--t2-ink-3)', maxWidth: 360, margin: 0 };

  // Bento grid: 4 cols × 2 rows
  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: '180px 180px',
    gap: 16,
  };
  // Card 1 — big story card, 2x2
  const big = {
    gridColumn: 'span 2', gridRow: 'span 2',
    background: 'linear-gradient(135deg, var(--t2-deep) 0%, #0b1e33 70%)', color: '#fff',
    borderRadius: 24, padding: '32px 36px', position: 'relative', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
  };
  const bigGloss = { position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(238,46,61,.25), transparent 70%)' };
  const bigEyebrow = { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.55)', letterSpacing: '.14em', textTransform: 'uppercase' };
  const bigTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(22px, 2.4vw, 28px)', letterSpacing: '-.01em', color: '#fff', margin: '8px 0 12px', lineHeight: 1.15 };
  const bigText = { fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,.78)' };
  const bigStats = { display: 'flex', gap: 28, marginTop: 20, position: 'relative', zIndex: 1 };
  const bigStatNum = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 32, color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1, background: 'linear-gradient(135deg,#fff,#fef5f5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
  const bigStatLabel = { fontSize: 11, color: 'rgba(255,255,255,.55)', marginTop: 6, letterSpacing: '.04em' };

  // Small cards
  const small = {
    background: '#fff', borderRadius: 20, padding: '20px 22px',
    border: '1px solid var(--t2-line)',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    overflow: 'hidden', position: 'relative',
  };
  const smallEmoji = { fontSize: 32, lineHeight: 1 };
  const smallTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--t2-ink)', margin: '12px 0 4px', letterSpacing: '-.005em' };
  const smallText = { fontSize: 12, lineHeight: 1.5, color: 'var(--t2-ink-3)', margin: 0 };

  // Red highlight small card
  const redCard = { ...small, background: 'linear-gradient(135deg, var(--t2-red), #c01928)', border: 'none', color: '#fff' };
  const redTitle = { ...smallTitle, color: '#fff' };
  const redText = { ...smallText, color: 'rgba(255,255,255,.85)' };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={headLeft}>
            <div style={eyebrow}>Почему мы</div>
            <h2 style={h2}>Поездка без сюрпризов в цене</h2>
          </div>
          <p style={lede}>Аликанте, Бенидорм, Кальпе, Торревьеха, Валенсия и 40+ адресов Costa Blanca.</p>
        </div>

        <div style={grid} className="t2-bento">
          <div style={big}>
            <div style={bigGloss} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={bigEyebrow}>Наша история</div>
              <h3 style={bigTitle}>В Costa Blanca с 2021. Каждая поездка — фикс-цена и встреча с табличкой.</h3>
              <p style={bigText}>Запустили сервис из аэропорта Аликанте, сегодня закрываем 40+ направлений по Испании. Растём только на «сарафане» — поэтому каждая поездка важна.</p>
            </div>
            <div style={bigStats}>
              <div><div style={bigStatNum}>5</div><div style={bigStatLabel}>лет</div></div>
              <div><div style={bigStatNum}>3 000+</div><div style={bigStatLabel}>поездок</div></div>
              <div><div style={bigStatNum}>4.9 ★</div><div style={bigStatLabel}>рейтинг</div></div>
            </div>
          </div>

          <div style={small}>
            <div style={smallEmoji}>💳</div>
            <div>
              <h3 style={smallTitle}>Цена не меняется</h3>
              <p style={smallText}>Фиксируется при бронировании. Платные дороги — включены.</p>
            </div>
          </div>

          <div style={redCard}>
            <div style={smallEmoji}>🛡</div>
            <div>
              <h3 style={redTitle}>Лицензированные авто</h3>
              <p style={redText}>EU-лицензия и страховка пассажиров на каждой поездке.</p>
            </div>
          </div>

          <div style={small}>
            <div style={smallEmoji}>✈</div>
            <div>
              <h3 style={smallTitle}>Следим за рейсом</h3>
              <p style={smallText}>Рейс задержали — ждём бесплатно, без лимита по времени.</p>
            </div>
          </div>

          <div style={small}>
            <div style={smallEmoji}>💬</div>
            <div>
              <h3 style={smallTitle}>Поддержка по-русски</h3>
              <p style={smallText}>WhatsApp 8:00–23:00, ответ за 3–5 минут.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t2-bento { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
          .t2-bento > :first-child { grid-column: span 2 !important; grid-row: auto !important; min-height: 280px; }
        }
        @media (max-width: 560px) {
          .t2-bento { grid-template-columns: 1fr !important; }
          .t2-bento > :first-child { grid-column: auto !important; }
        }
      `}</style>
    </section>
  );
}

export default WhyUs;
