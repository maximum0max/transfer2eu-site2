import React from 'react'
import { LANGS, UI, FIELDS, COUNTRIES } from './Anketa.data.jsx'
// Standalone, unlisted guest-registration page (rebuilt from the old Google
// Form) — no site header/footer, no Google iframe. Fields render natively in
// RU / EN / ES; submissions POST to a Google Apps Script web app bound to the
// owner's Google Sheet.
//
// SETUP: paste the Apps Script web-app URL (its /exec address) into ENDPOINT.
// Until then the form validates and previews but submission is disabled.
const ENDPOINT = ''; // e.g. 'https://script.google.com/macros/s/AKfy.../exec'

const blank = () => FIELDS.reduce((o, f) => { o[f.key] = ''; return o; }, {});

export default function Anketa() {
  const { useState } = React;
  const [lang, setLang] = useState(() => {
    const q = new URLSearchParams(window.location.search).get('lang');
    return UI[q] ? q : 'ru';
  });
  const [form, setForm] = useState(blank);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [showErr, setShowErr] = useState(false);

  const t = UI[lang];
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const missing = FIELDS.filter((f) => f.required && !String(form[f.key]).trim());

  const chooseLang = (l) => {
    setLang(l);
    const u = new URL(window.location.href);
    u.searchParams.set('lang', l);
    window.history.replaceState({}, '', u);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (missing.length) { setShowErr(true); return; }
    if (!ENDPOINT) { setStatus('error'); return; }
    setStatus('sending');
    try {
      const body = new URLSearchParams({ lang, ...form });
      await fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body });
      setStatus('done');
    } catch (_) {
      setStatus('error');
    }
  };

  /* ---------------- styles ---------------- */
  const page = { minHeight: '100vh', background: 'var(--t2-bg-2, #f4f5f7)', fontFamily: "'Inter',system-ui", color: 'var(--t2-ink, #0F1216)' };
  const bar = { position: 'sticky', top: 0, zIndex: 5, display: 'flex', justifyContent: 'center', gap: 8, padding: '10px 12px', background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--t2-line, #e6e8ec)' };
  const langBtn = (active) => ({ padding: '8px 18px', borderRadius: 999, cursor: 'pointer', fontWeight: 700, fontSize: 14, border: '1px solid ' + (active ? 'var(--t2-red, #ee2e3d)' : 'var(--t2-line, #e6e8ec)'), background: active ? 'var(--t2-red, #ee2e3d)' : '#fff', color: active ? '#fff' : 'var(--t2-ink-2, #3a4149)', transition: 'all .15s' });
  const shell = { maxWidth: 640, margin: '0 auto', padding: '28px 20px 64px' };
  const card = { background: '#fff', borderRadius: 18, border: '1px solid var(--t2-line, #e6e8ec)', boxShadow: '0 10px 30px rgba(11,30,51,.06)', padding: '26px 24px' };
  const label = { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2-ink, #0F1216)', marginBottom: 7 };
  const req = { color: 'var(--t2-red, #ee2e3d)' };
  const opt = { color: 'var(--t2-ink-3, #8a929c)', fontWeight: 400 };
  const field = { width: '100%', fontSize: 16, padding: '11px 13px', borderRadius: 11, border: '1px solid var(--t2-line, #e6e8ec)', background: '#fff', color: 'var(--t2-ink, #0F1216)', outline: 'none', boxSizing: 'border-box' };
  const fieldErr = { ...field, borderColor: 'var(--t2-red, #ee2e3d)' };
  const radioRow = { display: 'flex', flexWrap: 'wrap', gap: 8 };
  const radioBtn = (active) => ({ padding: '9px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, border: '1px solid ' + (active ? 'var(--t2-red, #ee2e3d)' : 'var(--t2-line, #e6e8ec)'), background: active ? 'var(--t2-red, #ee2e3d)' : '#fff', color: active ? '#fff' : 'var(--t2-ink-2, #3a4149)' });
  const submitBtn = { width: '100%', padding: '15px', marginTop: 8, borderRadius: 13, border: 0, fontWeight: 700, fontSize: 15, color: '#fff', background: 'linear-gradient(135deg, #22c55e, #16a34a)', cursor: 'pointer', boxShadow: '0 12px 26px rgba(34,197,94,.28)' };

  /* ---------------- done screen ---------------- */
  if (status === 'done') {
    return (
      <div style={page}>
        <div style={bar}>{LANGS.map((l) => <button key={l.code} type="button" onClick={() => chooseLang(l.code)} style={langBtn(lang === l.code)}>{l.label}</button>)}</div>
        <div style={shell}>
          <div style={{ ...card, textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>✅</div>
            <h1 style={{ fontSize: 22, margin: '0 0 8px' }}>{t.success}</h1>
            <p style={{ color: 'var(--t2-ink-3, #8a929c)', margin: '0 0 20px' }}>{t.successSub}</p>
            <button type="button" onClick={() => { setForm(blank()); setStatus('idle'); setShowErr(false); window.scrollTo(0, 0); }}
              style={{ padding: '11px 22px', borderRadius: 11, border: '1px solid var(--t2-line, #e6e8ec)', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              {t.again}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- form ---------------- */
  return (
    <div style={page}>
      <div style={bar}>{LANGS.map((l) => <button key={l.code} type="button" onClick={() => chooseLang(l.code)} style={langBtn(lang === l.code)}>{l.label}</button>)}</div>
      <div style={shell}>
        <h1 style={{ fontSize: 21, lineHeight: 1.3, margin: '0 0 8px' }}>{t.title}</h1>
        <p style={{ fontSize: 14, color: 'var(--t2-ink-3, #8a929c)', margin: '0 0 20px' }}>{t.desc}</p>

        <form style={card} onSubmit={submit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {FIELDS.map((f) => {
              const invalid = showErr && f.required && !String(form[f.key]).trim();
              return (
                <div key={f.key}>
                  <label style={label} htmlFor={f.key}>
                    {f.label[lang]} {f.required ? <span style={req}>*</span> : <span style={opt}>{t.optional}</span>}
                  </label>

                  {(f.type === 'text' || f.type === 'date') && (
                    <input id={f.key} type={f.type === 'date' ? 'date' : 'text'}
                      value={form[f.key]} onChange={(e) => set(f.key, e.target.value)}
                      style={invalid ? fieldErr : field} />
                  )}

                  {f.type === 'country' && (
                    <select id={f.key} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} style={invalid ? fieldErr : field}>
                      <option value="">{t.choose}</option>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}

                  {f.type === 'radio' && (
                    <div style={radioRow}>
                      {f.options.map((o) => (
                        <button key={o.value} type="button" onClick={() => set(f.key, o.value)} style={radioBtn(form[f.key] === o.value)}>
                          {o.label[lang]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showErr && missing.length > 0 && (
            <p style={{ color: 'var(--t2-red, #ee2e3d)', fontSize: 13, marginTop: 16, marginBottom: 0 }}>{t.required}</p>
          )}
          {status === 'error' && (
            <p style={{ color: 'var(--t2-red, #ee2e3d)', fontSize: 13, marginTop: 16, marginBottom: 0 }}>{t.error}</p>
          )}

          <button type="submit" disabled={status === 'sending'} style={{ ...submitBtn, opacity: status === 'sending' ? .7 : 1 }}>
            {status === 'sending' ? t.sending : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
