/* global React */
const { useState } = React;

function Icon({ name, size = 20, stroke = 1.6, color = 'currentColor', style = {} }) {
  // Lucide loaded globally; render as <i data-lucide> and let lucide.createIcons() replace it.
  // For dynamic React renders, we use a key-based <i> + an effect.
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const i = document.createElement('i');
      i.setAttribute('data-lucide', name);
      ref.current.appendChild(i);
      window.lucide.createIcons({ attrs: { 'stroke-width': stroke, width: size, height: size } });
      const svg = ref.current.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('stroke-width', stroke);
        svg.style.color = color;
      }
    }
  }, [name, size, stroke, color]);
  return <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }} />;
}

window.Icon = Icon;
