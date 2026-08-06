import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'
import { NEWS_POSTS, newsField } from './News.data.jsx'
import { POPULAR, cityName } from './BrandData.jsx'
import { pathOf } from './router.jsx'
import { useT, useLang } from './i18n.jsx'

// Bilingual: RU default + UK UI strings via useT(); the post's own fields
// (title, excerpt, body) come through newsField() so UK posts render their
// parallel *_uk copy, falling back to Russian when a translation is missing.
const STR = {
  ru: {
    not_found_eyebrow: '📰 Полезное',
    not_found_title: 'Материал не найден',
    not_found_sub: 'Попробуйте выбрать материал из списка.',
    back: '← Все материалы',
    post_eyebrow: '📰 Материал',
    body_soon: 'Полная версия материала готовится.',
    cta_title: 'Планируете поездку по Costa Blanca?',
    cta_sub: 'Закажите трансфер из аэропорта Аликанте (ALC) с фиксированной ценой за автомобиль и русскоязычным водителем.',
    all_routes: '🚖 Все маршруты трансфера',
    prices: '💶 Цены на трансфер',
    alicante_to: 'Аликанте →',
    contacts: '📞 Контакты 24/7',
    also_read: 'Читайте также',
  },
  uk: {
    not_found_eyebrow: '📰 Корисне',
    not_found_title: 'Матеріал не знайдено',
    not_found_sub: 'Спробуйте вибрати матеріал зі списку.',
    back: '← Усі матеріали',
    post_eyebrow: '📰 Матеріал',
    body_soon: 'Повна версія матеріалу готується.',
    cta_title: 'Плануєте поїздку по Costa Blanca?',
    cta_sub: 'Замовте трансфер з аеропорту Аліканте (ALC) з фіксованою ціною за автомобіль та україномовним водієм.',
    all_routes: '🚖 Усі маршрути трансферу',
    prices: '💶 Ціни на трансфер',
    alicante_to: 'Аліканте →',
    contacts: '📞 Контакти 24/7',
    also_read: 'Читайте також',
  },
};

function NewsPost({ slug, onNav }) {
  const t = useT(STR);
  const lang = useLang();
  const posts = (NEWS_POSTS || []);
  const post = posts.find(p => p.slug === slug);

  // Onward internal links so no article is a dead end: the next 3 posts (cyclic
  // — every post links forward, forming a crawlable chain) + 4 popular routes.
  const idx = posts.findIndex(p => p.slug === slug);
  const related = [];
  for (let k = 1; related.length < 3 && k < posts.length; k++) {
    const p = posts[(idx + k) % posts.length];
    if (p && p.slug !== slug) related.push(p);
  }
  const routeLinks = (POPULAR || []).slice(0, 4);

  const wrap = { background: '#fff' };
  const inner = { maxWidth: 760, margin: '0 auto', padding: '64px 24px' };
  const meta = { fontSize: 13, color: 'var(--t2-ink-3)', marginBottom: 18, fontVariantNumeric: 'tabular-nums' };
  const lede = { fontFamily: "'Inter',system-ui", fontSize: 18, lineHeight: 1.6, color: 'var(--t2-ink-2)', margin: '0 0 28px' };
  const p  = { fontFamily: "'Inter',system-ui", fontSize: 17, lineHeight: 1.7, color: 'var(--t2-ink-2)', margin: '0 0 16px' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--t2-ink)', margin: '32px 0 12px', letterSpacing: '-.01em' };
  const h3 = { fontFamily: "'Onest',sans-serif", fontSize: 19, fontWeight: 700, color: 'var(--t2-ink)', margin: '24px 0 10px' };
  const ul = { fontFamily: "'Inter',system-ui", fontSize: 17, lineHeight: 1.7, color: 'var(--t2-ink-2)', margin: '0 0 16px', paddingLeft: 22 };
  const back = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--t2-red)', cursor: 'pointer', background: 'transparent', border: 0, padding: 0, marginBottom: 16, textDecoration: 'none' };
  const pill = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 999, background: '#fff', border: '1px solid var(--t2-line)', color: 'var(--t2-ink-2)', textDecoration: 'none', fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 13.5 };
  const relCard = { display: 'block', padding: '16px 18px', borderRadius: 14, background: '#fff', border: '1px solid var(--t2-line)', textDecoration: 'none', boxShadow: 'var(--t2-sh-1)' };
  const heroImg = { width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 18, display: 'block', margin: '0 0 24px', background: 'var(--t2-bg-2)', boxShadow: 'var(--t2-sh-2)' };
  const DEFAULT_IMG = '/assets/og-image.jpg';

  if (!post) {
    return (
      <>
        <PageHero eyebrow={t.not_found_eyebrow} title={t.not_found_title} subtitle={t.not_found_sub} />
        <div style={inner}>
          <button style={back} onClick={() => onNav('news')}>{t.back}</button>
        </div>
        <CTABanner onNav={onNav} />
      </>
    );
  }

  const renderBlock = (b, i) => {
    switch (b.type) {
      case 'h2': return <h2 key={i} style={h2}>{b.text}</h2>;
      case 'h3': return <h3 key={i} style={h3}>{b.text}</h3>;
      case 'p':  return <p  key={i} style={p}>{b.text}</p>;
      case 'ul': return <ul key={i} style={ul}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: 6 }}>{it}</li>)}</ul>;
      default:   return null;
    }
  };

  const body = newsField(post, 'body', lang);

  return (
    <>
      <PageHero eyebrow={post.date || t.post_eyebrow} title={newsField(post, 'title', lang)} subtitle={newsField(post, 'excerpt', lang)} />
      <div style={wrap}>
        <div style={inner}>
          <a style={back} href={pathOf('news', null, lang)}>{t.back}</a>
          <img src={post.image || DEFAULT_IMG} alt={newsField(post, 'title', lang)} style={heroImg} fetchPriority="high" />
          {body
            ? body.map(renderBlock)
            : <div style={{ ...p, color: 'var(--t2-ink-3)', fontStyle: 'italic' }}>{t.body_soon}</div>}

          {/* Contextual internal links — services & popular routes */}
          <div style={{ marginTop: 44, padding: '24px 26px', borderRadius: 16, background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)' }}>
            <div style={{ fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--t2-ink)', margin: '0 0 6px' }}>
              {t.cta_title}
            </div>
            <p style={{ fontSize: 14, color: 'var(--t2-ink-3)', margin: '0 0 16px', lineHeight: 1.55 }}>
              {t.cta_sub}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <a href={pathOf('routes', null, lang)} style={pill}>{t.all_routes}</a>
              <a href={pathOf('price', null, lang)} style={pill}>{t.prices}</a>
              {routeLinks.map(r => (
                <a key={r.slug} href={pathOf('route', r.slug, lang)} style={pill}>📍 {t.alicante_to} {cityName(r, lang)} · {r.price}€</a>
              ))}
              <a href={pathOf('contacts', null, lang)} style={pill}>{t.contacts}</a>
            </div>
          </div>

          {/* Related posts — onward links so the article isn't a dead end */}
          {related.length > 0 && (
            <div style={{ marginTop: 44 }}>
              <h2 style={h2}>{t.also_read}</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {related.map(rp => {
                  const rHeading = newsField(rp, 'title', lang);
                  const rEx = newsField(rp, 'excerpt', lang);
                  return (
                    <a key={rp.slug} href={pathOf('news-post', rp.slug, lang)} style={relCard}>
                      <div style={{ fontSize: 12, color: 'var(--t2-ink-3)', marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>{rp.date}</div>
                      <div style={{ fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--t2-ink)', lineHeight: 1.35 }}>{rHeading}</div>
                      {rEx && <div style={{ fontSize: 13, color: 'var(--t2-ink-2)', marginTop: 6, lineHeight: 1.5 }}>{rEx}</div>}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <CTABanner onNav={onNav} />
    </>
  );
}

export default NewsPost;
