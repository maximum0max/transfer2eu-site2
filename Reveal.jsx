import React from 'react'
// Reveal — fade-up-on-scroll wrapper. An IntersectionObserver flips `.is-in`
// the first time the element enters the viewport, then stops observing (the
// reveal is one-way). `delay` staggers siblings. Motion + the reduced-motion
// guard live in colors_and_type.css under the MOTION section.

function Reveal({ children, delay = 0, as: Tag = 'div', style, className = '', ...rest }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // SSR / very old browsers — just show it.
    if (typeof IntersectionObserver === 'undefined') { setShown(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { setShown(true); io.unobserve(e.target); }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`t2-reveal ${shown ? 'is-in' : ''} ${className}`.trim()}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
