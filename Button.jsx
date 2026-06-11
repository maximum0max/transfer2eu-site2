/* global React */
/**
 * Button — Transfer2EU "HoverButton"
 * Glassmorphism CTA with pointer-tracked glow circles.
 *
 * One visual style only. Use the `size` prop ("sm" | "md" | "lg") to scale.
 * Designed for dark / photographic backgrounds — the glass needs contrast to read.
 *
 * Props:
 *   - children
 *   - size: "sm" | "md" | "lg" (default "md")
 *   - icon, iconRight: Lucide icon name (uses window.Icon)
 *   - onClick, type, style, ...rest
 */
function Button({ children, size = 'md', icon, iconRight, onClick, type = 'button', style = {}, ...rest }) {
  const btnRef = React.useRef(null);
  const listeningRef = React.useRef(false);
  const lastAddedRef = React.useRef(0);

  const sizes = {
    sm: { padding: '8px 22px',  fontSize: 14, borderRadius: 20 },
    md: { padding: '12px 32px', fontSize: 16, borderRadius: 24 },
    lg: { padding: '14px 38px', fontSize: 17, borderRadius: 28 },
  };

  const base = {
    position: 'relative',
    isolation: 'isolate',
    color: '#ffffff',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 500,
    lineHeight: '24px',
    background: 'rgba(43,55,80,.10)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: 0,
    cursor: 'pointer',
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    ['--circle-start']: '#a0d9f8',
    ['--circle-end']:   '#3a5bbf',
  };

  const handlePointerEnter = () => { listeningRef.current = true; };
  const handlePointerLeave = () => { listeningRef.current = false; };
  const handlePointerMove = (e) => {
    if (!listeningRef.current || !btnRef.current) return;
    const now = Date.now();
    if (now - lastAddedRef.current <= 100) return;
    lastAddedRef.current = now;

    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPos = (x / rect.width) * 100;

    const glow = document.createElement('div');
    glow.style.cssText =
      'position:absolute;width:12px;height:12px;transform:translate(-50%,-50%);'+
      'border-radius:50%;filter:blur(16px);pointer-events:none;z-index:0;opacity:0;'+
      'transition:opacity 300ms;';
    glow.style.left = x + 'px';
    glow.style.top  = y + 'px';
    glow.style.background =
      `linear-gradient(to right, var(--circle-start) ${xPos}%, var(--circle-end) ${xPos}%)`;
    btnRef.current.appendChild(glow);

    setTimeout(() => { glow.style.opacity = '.75'; }, 0);
    setTimeout(() => {
      glow.style.transitionDuration = '1200ms';
      glow.style.opacity = '0';
    }, 1000);
    setTimeout(() => { glow.remove(); }, 2200);
  };

  return (
    <button
      ref={btnRef}
      type={type}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className="t2-hb"
      style={{ ...base, ...sizes[size], ...style }}
      {...rest}
    >
      {icon && <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex' }}><Icon name={icon} size={16} color="#fff" /></span>}
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
      {iconRight && <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex' }}><Icon name={iconRight} size={16} color="#fff" /></span>}
    </button>
  );
}

// Inject the inset glass-ring pseudo + active scale once.
if (typeof document !== 'undefined' && !document.getElementById('t2-hb-style')) {
  const s = document.createElement('style');
  s.id = 't2-hb-style';
  s.textContent = `
    .t2-hb::before{
      content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:1;
      box-shadow:
        inset 0 0 0 1px rgba(170,202,255,.20),
        inset 0 0 16px 0 rgba(170,202,255,.10),
        inset 0 -3px 12px 0 rgba(170,202,255,.15),
        0 1px 3px 0 rgba(0,0,0,.50),
        0 4px 12px 0 rgba(0,0,0,.45);
      mix-blend-mode:multiply;transition:transform 300ms;
    }
    .t2-hb:active::before{transform:scale(.975)}
  `;
  document.head.appendChild(s);
}

window.Button = Button;
