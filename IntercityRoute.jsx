import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import { findIntercity } from './Intercity.data.jsx'
import { BRAND, POPULAR, waLink, cityName } from './BrandData.jsx'
import { pathOf } from './router.jsx'
import { useT, useLang } from './i18n.jsx'
// Standalone page for a non-airport (intercity) transfer, e.g. Valencia →
// Benidorm. Kept separate from RoutePage.jsx so the Alicante-airport catalog
// stays clean, while this URL is still a real, indexable, internally-linked page.

const STR = {
  ru: {
    nf_eyebrow: '🚖 Трансфер', nf_title: 'Маршрут не найден', nf_sub: 'Попробуйте выбрать направление из каталога.', all_routes: '← Все маршруты',
    ic: 'Междугородний трансфер', fix: 'Фикс-цена за автомобиль',
    order_wa: '📲 Заказать в WhatsApp', see_also: 'Смотрите также',
    all_routes2: '🚖 Все маршруты трансфера', prices: '💶 Цены', contacts: '📞 Контакты 24/7',
    alc: 'Аликанте →', hh: 'ч', mm: 'мин',
    wa_msg: (from, to, p) => `Здравствуйте! Хочу заказать такси ${from} → ${to} (${p}€).`,
  },
  uk: {
    nf_eyebrow: '🚖 Трансфер', nf_title: 'Маршрут не знайдено', nf_sub: 'Спробуйте обрати напрямок із каталогу.', all_routes: '← Усі маршрути',
    ic: 'Міжміський трансфер', fix: 'Фікс-ціна за автомобіль',
    order_wa: '📲 Замовити у WhatsApp', see_also: 'Дивіться також',
    all_routes2: '🚖 Усі маршрути трансферу', prices: '💶 Ціни', contacts: '📞 Контакти 24/7',
    alc: 'Аліканте →', hh: 'год', mm: 'хв',
    wa_msg: (from, to, p) => `Вітаю! Хочу замовити таксі ${from} → ${to} (${p}€).`,
  },
};

function IntercityRoute({ slug, onNav }) {
  const r = findIntercity(slug);
  const t = useT(STR);
  const lang = useLang();

  const wrap = { background: '#fff' };
  const inner = { maxWidth: 820, margin: '0 auto', padding: '56px 24px' };
  const p  = { fontFamily: "'Inter',system-ui", fontSize: 17, lineHeight: 1.7, color: 'var(--t2-ink-2)', margin: '0 0 16px' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--t2-ink)', margin: '32px 0 12px', letterSpacing: '-.01em' };
  const ul = { fontFamily: "'Inter',system-ui", fontSize: 17, lineHeight: 1.7, color: 'var(--t2-ink-2)', margin: '0 0 16px', paddingLeft: 22 };
  const pill = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 999, background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)', color: 'var(--t2-ink-2)', textDecoration: 'none', fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 13.5 };

  if (!r) {
    return (
      <>
        <PageHero eyebrow={t.nf_eyebrow} title={t.nf_title} subtitle={t.nf_sub} />
        <div style={inner}><a style={pill} href={pathOf('routes', null, lang)}>{t.all_routes}</a></div>
        <CTABanner onNav={onNav} />
      </>
    );
  }

  const renderBlock = (b, i) => {
    switch (b.type) {
      case 'h2': return <h2 key={i} style={h2}>{b.text}</h2>;
      case 'p':  return <p  key={i} style={p}>{b.text}</p>;
      case 'ul': return <ul key={i} style={ul}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: 6 }}>{it}</li>)}</ul>;
      default:   return null;
    }
  };

  const icFrom = (lang === 'uk' && r.from_uk) || r.from;
  const icTo = (lang === 'uk' && r.to_uk) || r.to;
  const waMsg = t.wa_msg(icFrom, icTo, r.price);

  // Booking CTA card
  const ctaCard = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', margin: '8px 0 8px', padding: '22px 24px', borderRadius: 18, background: 'linear-gradient(135deg, var(--t2-deep), #0b1e33)', color: '#fff' };
  const priceBig = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 40, lineHeight: 1, fontVariantNumeric: 'tabular-nums' };
  const waBtn = { background: '#25d366', color: '#fff', fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 15, padding: '13px 22px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 22px rgba(34,197,94,.30)' };
  const phoneBtn = { background: 'rgba(255,255,255,.14)', color: '#fff', fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 15, padding: '13px 22px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 };

  const routeLinks = (POPULAR || []).filter(x => (r.relatedCities || []).includes(x.city));

  return (
    <>
      <PageHero eyebrow={`${r.emoji} ${t.ic}`} title={(lang === 'uk' && r.h1_uk) || r.h1} subtitle={(lang === 'uk' && r.intro_uk) || r.intro} />
      <div style={wrap}>
        <div style={inner}>
          <div style={ctaCard}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', opacity: .7 }}>{t.fix}</div>
              <div style={priceBig}>{r.price}€</div>
              <div style={{ fontSize: 13, opacity: .8, marginTop: 4 }}>{icFrom} → {icTo} · ~{Math.floor(r.time / 60)} {t.hh} {r.time % 60} {t.mm} · {r.distance} км</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href={waLink(waMsg)} target="_blank" rel="noopener noreferrer" style={waBtn}>{t.order_wa}</a>
              <a href={'tel:' + BRAND.tel} style={phoneBtn}>📞 {BRAND.phone}</a>
            </div>
          </div>

          {((lang === 'uk' && r.body_uk) || r.body).map(renderBlock)}

          {/* Internal links — related airport routes + service hubs */}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--t2-line)' }}>
            <div style={{ fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--t2-ink)', margin: '0 0 12px' }}>
              {t.see_also}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <a href={pathOf('routes', null, lang)} style={pill}>{t.all_routes2}</a>
              <a href={pathOf('price', null, lang)} style={pill}>{t.prices}</a>
              {routeLinks.map(x => (
                <a key={x.slug} href={pathOf('route', x.slug, lang)} style={pill}>📍 {t.alc} {cityName(x, lang)} · {x.price}€</a>
              ))}
              <a href={pathOf('contacts', null, lang)} style={pill}>{t.contacts}</a>
            </div>
          </div>
        </div>
      </div>
      <CTABanner onNav={onNav} />
    </>
  );
}

export default IntercityRoute;
