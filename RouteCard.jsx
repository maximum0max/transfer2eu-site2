/* global React, Button, Icon */
function RouteCard({ from, to, duration, vehicle, price, badge, gradient, img, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid var(--t2-line)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: hover ? 'var(--t2-sh-3)' : 'var(--t2-sh-1)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
      }}>
      <div style={{ aspectRatio: '16/10', position: 'relative', background: gradient || 'linear-gradient(160deg, #3a4a66, #0b1e33)', overflow: 'hidden' }}>
        {img && <img src={img} alt={to} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hover ? 'scale(1.04)' : 'scale(1)', transition: 'transform 360ms cubic-bezier(.2,.7,.2,1)' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(11,30,51,.55) 100%)', pointerEvents: 'none' }} />
        {badge && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,.95)', padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'var(--t2-red)' }}>{badge}</span>
        )}
        <span style={{ position: 'absolute', bottom: 10, left: 14, color: '#fff', fontSize: 12, fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,.4)', fontVariantNumeric: 'tabular-nums' }}>{duration}</span>
      </div>
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <div style={{ fontFamily: "'Onest','Inter',sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--t2-ink)', letterSpacing: '-.01em' }}>{from} → {to}</div>
          <div style={{ fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--t2-ink)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>от {price} €</div>
        </div>
        <div style={{ display: 'flex', gap: 16, color: 'var(--t2-ink-3)', fontSize: 13 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={14} color="var(--t2-ink-3)" />{duration}</span>
        </div>
        <Button variant="primaryDark" size="sm" style={{ alignSelf: 'flex-start', marginTop: 4, background: '#000' }}>Забронировать</Button>
      </div>
    </div>
  );
}

window.RouteCard = RouteCard;
