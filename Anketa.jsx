import React from 'react'
// Standalone, unlisted page that embeds the Google Form full-screen with a
// Russian / English chooser at the top — no site header or footer. It is not
// linked anywhere and is marked noindex (see seo.jsx), so only people who get
// the /anketa (or /#registro) link reach it.
//
// A Google Form's QUESTIONS cannot be auto-translated: the `hl` param only
// switches Google's own interface (Submit / Next / "required" labels). If you
// create a separate English-language form, set FORM_IDS.en to its id (from its
// edit URL docs.google.com/forms/d/<THIS_ID>/edit) and the EN button will load
// it instead — no other change needed.
const FORM_IDS = {
  ru: '1evibPRhpRyV626byAl4EIgCHZI0mK1E0TxLhxcJA_dw',
  en: '1evibPRhpRyV626byAl4EIgCHZI0mK1E0TxLhxcJA_dw',
};

const srcFor = (lang) =>
  `https://docs.google.com/forms/d/${FORM_IDS[lang]}/viewform?embedded=true&hl=${lang}`;

export default function Anketa() {
  const { useState } = React;
  const [lang, setLang] = useState(
    () => (new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'ru'),
  );

  const choose = (l) => {
    setLang(l);
    const u = new URL(window.location.href); // keep the choice in the URL (shareable)
    u.searchParams.set('lang', l);
    window.history.replaceState({}, '', u);
  };

  const bar = {
    flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '10px 12px', background: '#fff', borderBottom: '1px solid var(--t2-line)',
  };
  const btn = (active) => ({
    padding: '8px 20px', borderRadius: 999, cursor: 'pointer',
    fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 14,
    border: '1px solid ' + (active ? 'var(--t2-red)' : 'var(--t2-line)'),
    background: active ? 'var(--t2-red)' : '#fff',
    color: active ? '#fff' : 'var(--t2-ink-2)',
    transition: 'all .15s',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={bar}>
        <button type="button" onClick={() => choose('ru')} style={btn(lang === 'ru')}>Русский</button>
        <button type="button" onClick={() => choose('en')} style={btn(lang === 'en')}>English</button>
      </div>
      <iframe
        key={lang}                 /* remount so the form reloads in the chosen language */
        title="Анкета"
        src={srcFor(lang)}
        loading="eager"
        style={{ flex: 1, width: '100%', border: 0, background: '#fff' }}
      >
        {lang === 'en' ? 'Loading form…' : 'Загрузка формы…'}
      </iframe>
    </div>
  );
}
