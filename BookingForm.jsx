import React from 'react'
import { ALL_ROUTES, waLink } from './BrandData.jsx'
// BookingForm v6 — the alicante-transfers 2-step booking flow, rebuilt with a
// new "header-band" design: a navy gradient header carries the title + step
// dots, the origin is a segmented control, and the live price is a gradient
// strip. Logic ported faithfully (3-mode origin, searchable destination,
// passenger/luggage grids, notes → WhatsApp).
//
// Props:
//   initialSlug      — pre-select a destination (RoutePage)
//   lockDestination  — start on Step 2 with the destination fixed

function BookingForm({ initialSlug = '', lockDestination = false }) {
  const { useState, useRef, useEffect } = React;
  const all = ALL_ROUTES || [];

  // Synthetic "Airport" destination — used when the origin is a city
  const airportDestination = { slug: '__airport__', city: 'Airport', ru: 'Аэропорт Аликанте (ALC)', price: 25, emoji: '✈️', time: 15 };

  const [fromMode, setFromMode] = useState('airport'); // 'airport' | 'city' | 'other'
  const [fromCity, setFromCity] = useState(null);
  const [fromQuery, setFromQuery] = useState('');
  const [fromOpen, setFromOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', email: '', flight: '', date: '', time: '', passengers: '2', luggage: '2', notes: '' });
  const [done, setDone] = useState(false);

  const dropRef = useRef(null);
  const fromDropRef = useRef(null);
  const inputRef = useRef(null);
  const fromInputRef = useRef(null);
  const touchStartY = useRef(0);

  // Pre-select destination from props (RoutePage)
  useEffect(() => {
    if (!initialSlug) return;
    const r = all.find(x => x.slug === initialSlug);
    if (r) {
      setFromMode('airport');
      setSelected(r);
      setQuery(r.ru);
      setOpen(false);
      if (lockDestination) setStep(2);
    }
  }, [initialSlug, lockDestination]);

  // Close dropdowns on outside click
  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
      if (fromDropRef.current && !fromDropRef.current.contains(e.target)) setFromOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* ---------------- derived data ---------------- */
  const destinations = fromMode === 'city'
    ? [airportDestination, ...all.filter(r => r.city !== 'Alicante')]
    : fromMode === 'other'
      ? [airportDestination, ...all.filter(r => r.city !== (fromCity && fromCity.city))]
      : all;

  const filtered = query.length >= 1
    ? destinations.filter(r =>
        r.ru.toLowerCase().includes(query.toLowerCase()) ||
        r.city.toLowerCase().includes(query.toLowerCase()))
    : destinations;

  const fromCandidates = all.filter(r => r.city !== 'Alicante');
  const fromFiltered = fromQuery.length >= 1
    ? fromCandidates.filter(r =>
        r.ru.toLowerCase().includes(fromQuery.toLowerCase()) ||
        r.city.toLowerCase().includes(fromQuery.toLowerCase()))
    : fromCandidates;

  const select = (r) => { setSelected(r); setQuery(r.ru); setOpen(false); };
  const selectFrom = (r) => {
    setFromCity(r); setFromQuery(r.ru); setFromOpen(false);
    setSelected(null); setQuery('');
  };
  const reset = () => {
    setSelected(null); setQuery(''); setStep(1);
    setTimeout(() => { if (inputRef.current) inputRef.current.focus(); setOpen(true); }, 50);
  };
  const switchFromMode = (mode) => {
    setFromMode(mode);
    setSelected(null); setQuery('');
    setFromCity(null); setFromQuery('');
    setFromOpen(false); setStep(1);
  };
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Flight number is required whenever the trip touches the airport (the
  // overwhelming majority of bookings); optional for pure city↔city rides.
  const airportInvolved = fromMode === 'airport' || (!!selected && selected.city === 'Airport');
  const formValid = !!(form.name.trim() && form.phone.trim() && form.date && form.time
    && (!airportInvolved || form.flight.trim()));

  const fromLabel = fromMode === 'airport'
    ? 'Аэропорт Аликанте (ALC)'
    : fromMode === 'city' ? 'Город Аликанте' : (fromCity ? fromCity.ru : '');
  const toLabel = selected ? (selected.city === 'Airport' ? 'Аэропорт Аликанте (ALC)' : selected.ru) : '';
  const timeLabel = fromMode === 'airport'
    ? 'Время прилёта'
    : (selected && selected.city === 'Airport') ? 'Время отправления' : 'Время';

  const buildWaUrl = () => {
    const lines = [
      'Здравствуйте! Хочу забронировать трансфер.',
      '',
      `🚗 Маршрут: ${fromLabel} → ${toLabel}`,
      fromMode === 'other' ? '💶 Стоимость: уточним в чате' : `💶 Стоимость: ${selected.price}€`,
      '',
      `👤 Имя: ${form.name}`,
      `📞 Телефон: ${form.phone}`,
      form.email ? `📧 Email: ${form.email}` : null,
      `📅 Дата: ${form.date}`,
      `🕐 ${timeLabel}: ${form.time}`,
      form.flight ? `✈️ Номер рейса: ${form.flight}` : null,
      `👥 Пассажиров: ${form.passengers}`,
      `🧳 Багаж: ${form.luggage}`,
      form.notes ? `📝 Примечания: ${form.notes}` : null,
    ].filter(Boolean).join('\n');
    return waLink(lines);
  };

  // Structured payload for the owner-notification endpoint (Telegram).
  const buildPayload = () => ({
    route: `${fromLabel} → ${toLabel}`,
    price: fromMode === 'other' ? 'уточним в чате' : `${selected.price}€`,
    name: form.name,
    phone: form.phone,
    email: form.email,
    date: form.date,
    time: form.time,
    timeLabel,
    flight: form.flight,
    passengers: form.passengers,
    luggage: form.luggage,
    notes: form.notes,
  });

  // Fire-and-forget: notify the owner the moment the form is submitted, so a
  // lead is captured even if the customer never sends the pre-filled WhatsApp
  // message. keepalive lets it finish while the WhatsApp tab opens. Any failure
  // is ignored — it must never block the customer's booking flow.
  const notifyOwner = () => {
    try {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
        keepalive: true,
      }).catch(() => {});
    } catch { /* noop */ }
  };

  /* ---------------- styles ---------------- */
  const card = {
    background: '#fff', borderRadius: 22, overflow: 'hidden',
    border: '1px solid var(--t2-line)',
    boxShadow: '0 28px 70px rgba(11,30,51,.14), 0 6px 18px rgba(11,30,51,.06)',
  };
  const headBand = {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, var(--t2-deep) 0%, #0b1e33 100%)',
    padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
  };
  const headGlow = { position: 'absolute', top: -70, right: -30, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(238,46,61,.40), transparent 70%)', pointerEvents: 'none' };
  const headTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '-.01em', position: 'relative', zIndex: 1 };
  const headSub = { fontSize: 11, color: 'rgba(255,255,255,.6)', marginTop: 2, position: 'relative', zIndex: 1 };
  const stepDots = { display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 };
  const stepDot = (active, complete) => ({
    width: 28, height: 28, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 12,
    background: (active || complete) ? 'var(--t2-red)' : 'rgba(255,255,255,.10)',
    color: (active || complete) ? '#fff' : 'rgba(255,255,255,.5)',
    border: active ? '2px solid #fff' : '2px solid transparent',
    transition: 'all .2s',
  });
  const stepLine = (complete) => ({ width: 16, height: 2, borderRadius: 999, background: complete ? 'var(--t2-red)' : 'rgba(255,255,255,.15)' });

  const body = { padding: '22px 24px' };
  const label = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--t2-ink-3)', marginBottom: 7 };
  const field = {
    width: '100%', fontSize: 16, fontFamily: "'Inter',system-ui",
    padding: '12px 14px', borderRadius: 12, border: '1px solid var(--t2-line)',
    background: '#fff', color: 'var(--t2-ink)', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color .15s, box-shadow .15s',
  };
  const seg = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, background: 'var(--t2-bg-2)', borderRadius: 13, padding: 4 };
  const segBtn = (active) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    padding: '9px 4px', borderRadius: 10, cursor: 'pointer', border: 0,
    background: active ? '#fff' : 'transparent',
    boxShadow: active ? '0 2px 6px rgba(11,30,51,.10)' : 'none',
    transition: 'all .15s',
  });
  const segLabel = (active) => ({ fontSize: 11, fontWeight: 700, color: active ? 'var(--t2-ink)' : 'var(--t2-ink-3)' });
  const segSub = (active) => ({ fontSize: 9, color: 'var(--t2-ink-3)', opacity: active ? 1 : .65 });

  const dropdown = {
    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
    borderRadius: 16, overflowY: 'auto', zIndex: 50,
    background: '#fff', border: '1px solid var(--t2-line)',
    boxShadow: '0 28px 60px rgba(11,30,51,.24)',
    maxHeight: 'min(420px, 64vh)', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain',
    transformOrigin: 'top center',
  };
  const dropItem = {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '15px 16px', cursor: 'pointer', background: 'transparent',
    border: 'none', borderBottom: '1px solid var(--t2-line)', minHeight: 58,
    fontFamily: "'Inter',system-ui", transition: 'background .14s',
  };
  const gridBtn = (active) => ({
    padding: '11px 0', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer',
    fontFamily: "'Inter',system-ui", transition: 'all .15s',
    background: active ? 'var(--t2-red)' : 'var(--t2-bg-2)',
    color: active ? '#fff' : 'var(--t2-ink-2)',
    border: '1px solid ' + (active ? 'var(--t2-red)' : 'var(--t2-line)'),
  });
  const hint = { fontSize: 11, marginTop: 6, color: 'var(--t2-ink-3)' };
  const primaryBtn = (enabled) => ({
    width: '100%', padding: '15px', borderRadius: 14, marginTop: 16,
    fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 15, border: 0,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: enabled ? 'var(--t2-ink)' : 'var(--t2-bg-2)',
    color: enabled ? '#fff' : 'var(--t2-ink-3)',
    cursor: enabled ? 'pointer' : 'not-allowed',
  });

  /* ---------------- done state ---------------- */
  if (done) {
    return (
      <div className="t2-booking">
        <div style={card}>
          <div style={headBand}><div style={headGlow} /><div style={headTitle}>Готово</div></div>
          <div style={{ ...body, textAlign: 'center', padding: '36px 28px' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 21, color: 'var(--t2-ink)', margin: '0 0 8px' }}>
              Заявка отправлена в WhatsApp
            </h3>
            <p style={{ fontSize: 14, color: 'var(--t2-ink-3)', margin: '0 0 20px' }}>
              Мы открыли чат с заполненными данными. Нажмите «Отправить» — ответим за 15 минут.
            </p>
            <button onClick={() => { setDone(false); setStep(1); }}
              style={{ padding: '12px 24px', borderRadius: 12, background: 'var(--t2-ink)', color: '#fff', fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 14, border: 0, cursor: 'pointer' }}>
              Заказать ещё одну поездку
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- shared header band ---------------- */
  const Header = () => (
    <div style={headBand}>
      <div style={headGlow} />
      <div>
        <div style={headTitle}>Бронирование трансфера</div>
        <div style={headSub}>{step === 1 ? 'Шаг 1 — выберите маршрут' : 'Шаг 2 — ваши контакты'}</div>
      </div>
      <div style={stepDots}>
        <div style={stepDot(step === 1, step > 1)}>{step > 1 ? '✓' : '1'}</div>
        <div style={stepLine(step > 1)} />
        <div style={stepDot(step === 2, false)}>2</div>
      </div>
    </div>
  );

  /* ════════════════ STEP 1 ════════════════ */
  if (step === 1) {
    const ready = !!selected && (fromMode !== 'other' || !!fromCity);
    const notReadyLabel = !selected
      ? (fromMode === 'other' && !fromCity ? 'Выберите город отправления' : 'Выберите город назначения')
      : null;
    return (
      <div className="t2-booking">
        <div style={card}>
          <Header />
          <div style={body}>
            <label style={label}>Откуда</label>
            <div style={seg}>
              {[
                { m: 'airport', icon: '✈️', t: 'Аэропорт', s: 'ALC' },
                { m: 'city',    icon: '🏙', t: 'Город',    s: 'Аликанте' },
                { m: 'other',   icon: '📍', t: 'Другой',   s: 'город' },
              ].map(o => (
                <button key={o.m} type="button" onClick={() => switchFromMode(o.m)} style={segBtn(fromMode === o.m)}>
                  <span style={{ fontSize: 16 }}>{o.icon}</span>
                  <span style={segLabel(fromMode === o.m)}>{o.t}</span>
                  <span style={segSub(fromMode === o.m)}>{o.s}</span>
                </button>
              ))}
            </div>

            {fromMode === 'other' && (
              <div style={{ marginTop: 12, position: 'relative' }} ref={fromDropRef}>
                <input
                  ref={fromInputRef}
                  type="text" inputMode="search"
                  value={fromQuery}
                  onChange={e => { setFromQuery(e.target.value); setFromOpen(true); if (fromCity) setFromCity(null); }}
                  onFocus={() => setFromOpen(true)}
                  placeholder="Введите город отправления..."
                  style={field}
                />
                {fromOpen && fromFiltered.length > 0 && (
                  <div style={dropdown} className="t2-anim-drop">
                    {fromFiltered.map((r, i) => (
                      <button key={r.slug} type="button"
                        onMouseDown={() => selectFrom(r)}
                        onTouchStart={e => { touchStartY.current = e.touches[0].clientY; }}
                        onTouchEnd={e => { if (Math.abs(e.changedTouches[0].clientY - touchStartY.current) < 8) { e.preventDefault(); selectFrom(r); } }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--t2-red-soft)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        style={{ ...dropItem, justifyContent: 'flex-start', gap: 11, color: 'var(--t2-ink)', animation: 't2-fade-up .26s var(--t2-ease-out) both', animationDelay: `${Math.min(i, 8) * 26}ms` }}>
                        <span style={{ fontSize: 18 }}>{r.emoji}</span>
                        <span style={{ fontSize: 15, fontWeight: 500 }}>{r.ru}</span>
                      </button>
                    ))}
                  </div>
                )}
                <p style={hint}>Цена для городов вне списка обсуждается в чате</p>
              </div>
            )}

            <div style={{ marginTop: 16, marginBottom: 4, position: 'relative' }} ref={dropRef}>
              <label style={label}>Куда</label>
              <input
                ref={inputRef}
                type="text" inputMode="search"
                value={query}
                onChange={e => { setQuery(e.target.value); setOpen(true); if (selected) setSelected(null); }}
                onFocus={() => setOpen(true)}
                placeholder="Введите город..."
                style={field}
              />
              {open && filtered.length > 0 && (
                <div style={dropdown} className="t2-anim-drop">
                  {filtered.map((r, i) => (
                    <button key={r.slug} type="button"
                      onMouseDown={() => select(r)}
                      onTouchStart={e => { touchStartY.current = e.touches[0].clientY; }}
                      onTouchEnd={e => { if (Math.abs(e.changedTouches[0].clientY - touchStartY.current) < 8) { e.preventDefault(); select(r); } }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--t2-red-soft)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      style={{ ...dropItem, color: 'var(--t2-ink)', animation: 't2-fade-up .26s var(--t2-ease-out) both', animationDelay: `${Math.min(i, 8) * 26}ms` }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <span style={{ fontSize: 18 }}>{r.emoji}</span>
                        <span style={{ fontSize: 15, fontWeight: 500 }}>{r.ru}</span>
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--t2-red)', flexShrink: 0, marginLeft: 8 }}>{r.price}€</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selected && fromMode !== 'other' && (
              <div className="t2-anim-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 18px', borderRadius: 14, marginTop: 16, background: 'linear-gradient(135deg, var(--t2-red), #c01928)', color: '#fff', boxShadow: '0 14px 30px rgba(238,46,61,.25)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', opacity: .8 }}>Стоимость трансфера</div>
                  <div style={{ fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 13, marginTop: 2 }}>
                    {fromMode === 'airport' ? 'Аликанте ALC' : 'Город Аликанте'} → {toLabel}
                  </div>
                </div>
                <div style={{ fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 34, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {selected.price}<span style={{ fontSize: 20 }}>€</span>
                </div>
              </div>
            )}

            {selected && fromMode === 'other' && fromCity && (
              <div className="t2-anim-pop" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, marginTop: 16, background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, background: 'var(--t2-red-soft)' }}>💬</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--t2-red)' }}>Цена по запросу</div>
                  <div style={{ fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--t2-ink)', marginTop: 2 }}>{fromCity.ru} → {toLabel}</div>
                </div>
              </div>
            )}

            <button type="button" disabled={!ready} onClick={() => setStep(2)} style={primaryBtn(ready)}>
              {ready ? <>Перейти к бронированию <span>→</span></> : notReadyLabel}
            </button>
          </div>
        </div>
        <TrustRow />
      </div>
    );
  }

  /* ════════════════ STEP 2 ════════════════ */
  const onSubmit = (e) => {
    if (!formValid) { e.preventDefault(); return; }
    notifyOwner();
    setDone(true);
  };

  return (
    <div className="t2-booking">
      <div style={card}>
        <Header />
        <div style={body} className="t2-anim-fade">
          <div className="t2-anim-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '11px 14px', borderRadius: 12, background: 'var(--t2-red-soft)', border: '1px solid var(--t2-red)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ fontSize: 18 }}>{selected ? selected.emoji : '🚖'}</span>
              <span style={{ fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--t2-ink)' }}>
                {fromMode === 'airport' ? 'ALC' : fromMode === 'city' ? 'Аликанте' : (fromCity ? fromCity.ru : '')} → {toLabel}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 8 }}>
              {fromMode === 'other'
                ? <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--t2-red)' }}>по запросу</span>
                : <span style={{ fontFamily: "'Onest',sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--t2-red)' }}>{selected.price}€</span>}
              {!lockDestination && (
                <button type="button" onClick={() => setStep(1)}
                  style={{ fontSize: 12, padding: '5px 10px', borderRadius: 8, border: '1px solid var(--t2-line)', background: '#fff', cursor: 'pointer', fontWeight: 600, color: 'var(--t2-ink-2)' }}>
                  ← Назад
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={label}>Имя <span style={{ color: 'var(--t2-red)' }}>*</span></label>
              <input type="text" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Иван Петров" autoComplete="name" style={field} />
            </div>
            <div>
              <label style={label}>Телефон <span style={{ color: 'var(--t2-red)' }}>*</span></label>
              <input type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+34 000 00 00 00" autoComplete="tel" inputMode="tel" style={field} />
            </div>
            <div>
              <label style={label}>Email <span style={{ color: 'var(--t2-ink-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(необязательно)</span></label>
              <input type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="example@gmail.com" autoComplete="email" inputMode="email" style={field} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={label}>Дата <span style={{ color: 'var(--t2-red)' }}>*</span></label>
                <input type="date" value={form.date} onChange={e => setField('date', e.target.value)} min={new Date().toISOString().split('T')[0]} style={field} />
              </div>
              <div>
                <label style={label}>{timeLabel} <span style={{ color: 'var(--t2-red)' }}>*</span></label>
                <input type="time" value={form.time} onChange={e => setField('time', e.target.value)} style={field} />
              </div>
            </div>
            <div>
              <label style={label}>
                Номер рейса {airportInvolved
                  ? <span style={{ color: 'var(--t2-red)' }}>*</span>
                  : <span style={{ color: 'var(--t2-ink-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(необязательно)</span>}
              </label>
              <input type="text" value={form.flight} onChange={e => setField('flight', e.target.value)}
                placeholder="напр. FR2643" autoComplete="off"
                style={{ ...field, textTransform: 'uppercase' }} />
              <p style={hint}>Отслеживаем рейс — встретим, даже если он задержан</p>
            </div>
            <div>
              <label style={label}>Пассажиров</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {['1','2','3','4','5','6','7','8'].map(n => (
                  <button key={n} type="button" onClick={() => setField('passengers', n)} style={gridBtn(form.passengers === n)}>{n}</button>
                ))}
              </div>
              <p style={hint}>5–8 чел. → минивэн (отдельный тариф) · детские кресла бесплатно</p>
            </div>
            <div>
              <label style={label}>Багаж <span style={{ color: 'var(--t2-ink-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(чемоданов)</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {['0','1','2','3','4','5','6','7+'].map(n => (
                  <button key={n} type="button" onClick={() => setField('luggage', n)} style={gridBtn(form.luggage === n)}>{n}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={label}>Примечания</label>
              <textarea value={form.notes} onChange={e => setField('notes', e.target.value)}
                placeholder="Детское кресло, адрес отеля, доп. остановки..." rows={3}
                style={{ ...field, resize: 'none', lineHeight: 1.6 }} />
            </div>
          </div>

          <p style={{ fontSize: 11, margin: '12px 0 14px', color: 'var(--t2-ink-3)' }}>
            <span style={{ color: 'var(--t2-red)' }}>*</span> Обязательные поля
          </p>

          <a
            href={formValid ? buildWaUrl() : '#'}
            target={formValid ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={onSubmit}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '15px', borderRadius: 14, textDecoration: 'none',
              fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 15,
              background: formValid ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'var(--t2-bg-2)',
              color: formValid ? '#fff' : 'var(--t2-ink-3)',
              boxShadow: formValid ? '0 14px 28px rgba(34,197,94,.30)' : 'none',
              cursor: formValid ? 'pointer' : 'not-allowed',
              border: formValid ? 'none' : '1px solid var(--t2-line)',
            }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.86L0 24l6.316-1.508A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.372l-.36-.214-3.727.89.916-3.622-.235-.372A9.818 9.818 0 1112 21.818z"/>
            </svg>
            <span>{formValid
              ? `Отправить в WhatsApp${fromMode !== 'other' ? ` — ${selected.price}€` : ''}`
              : 'Заполните обязательные поля'}</span>
          </a>
        </div>
      </div>
      <TrustRow />
    </div>
  );
}

function TrustRow() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 14 }}>
      {['✅ Без предоплаты', '🌙 Ночью та же цена', '👶 Детское кресло', '⏱ Ответ 15 мин'].map((t, i) => (
        <span key={i} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 999, fontWeight: 600, background: '#fff', color: 'var(--t2-ink-2)', border: '1px solid var(--t2-line)', boxShadow: 'var(--t2-sh-1)' }}>
          {t}
        </span>
      ))}
    </div>
  );
}

export default BookingForm;
