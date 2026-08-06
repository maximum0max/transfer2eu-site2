import React from 'react'
import { useT } from './i18n.jsx'
// Right-rail sidebar shown on Home + all sub-pages. Three blocks:
//   - "Погода в Аликанте" — booked.net embed (rendered statically; the live
//     site embeds a live booked.net widget)
//   - "Последние Новости" — latest 6 posts from window.NEWS_POSTS
//   - "Свежие комментарии" — verbatim list from the live site
//
// Bilingual: chrome strings (widget titles, weekday labels, the "к записи"
// connector) live in the co-located STR bundle (RU default + UK), picked by
// useT(). Post titles and comment authors are data and stay as-is.

const STR = {
  ru: {
    weather_title: 'Погода в Аликанте',
    place: 'Аликанте',
    date_line: 'Пятница, 20 Сентябрь',
    week_forecast: 'Прогноз на неделю',
    days: ['Сб', 'Вс', 'Пн', 'Вт', 'Ср', 'Чт'],
    news_title: 'Последние Новости',
    news_loading: 'Раздел загружается.',
    comments_title: 'Свежие комментарии',
    comment_connector: 'к записи',
  },
  uk: {
    weather_title: 'Погода в Аліканте',
    place: 'Аліканте',
    date_line: "П'ятниця, 20 вересня",
    week_forecast: 'Прогноз на тиждень',
    days: ['Сб', 'Нд', 'Пн', 'Вт', 'Ср', 'Чт'],
    news_title: 'Останні Новини',
    news_loading: 'Розділ завантажується.',
    comments_title: 'Свіжі коментарі',
    comment_connector: 'до запису',
  },
};

const COMMENTS = [
  { author: 'Мария',   postSlug: 'otkrit-sezon-gribov',                                   postTitle: 'Открыт сезон ГРИБОВ!' },
  { author: 'Роман',   postSlug: 'otkrit-sezon-gribov',                                   postTitle: 'Открыт сезон ГРИБОВ!' },
  { author: 'Татьяна', postSlug: 'espana-strana-sporta',                                  postTitle: 'Испания — страна Спорта!' },
  { author: 'Сергей',  postSlug: 'espana-strana-sporta',                                  postTitle: 'Испания — страна Спорта!' },
  { author: 'Татьяна', postSlug: 'oktoberfest-v-ispanii-ili-fiesta-de-la-cerveza-de-calpe', postTitle: 'Октоберфест в Испании или "Fiesta de la Cerveza" de Calpe' },
];

window.SIDEBAR_COMMENTS = COMMENTS;

function WeatherWidget() {
  const t = useT(STR);
  const box = {
    background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 12,
    padding: 16, fontFamily: "'Inter',system-ui",
  };
  const title = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--t2-ink)', marginBottom: 12 };
  const big = { fontSize: 36, fontWeight: 700, color: 'var(--t2-ink)', display: 'flex', alignItems: 'baseline', gap: 4, fontVariantNumeric: 'tabular-nums' };
  const sub = { fontSize: 13, color: 'var(--t2-ink-3)', marginTop: 4, fontVariantNumeric: 'tabular-nums' };
  const place = { fontSize: 14, color: 'var(--t2-ink-2)', marginTop: 8 };
  const week = { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--t2-line)' };
  const day = { textAlign: 'center', fontSize: 11, color: 'var(--t2-ink-3)', fontVariantNumeric: 'tabular-nums' };
  const dayLabel = { fontWeight: 600, color: 'var(--t2-ink-2)' };
  const week_temps = [
    { hi: '+25°', lo: '+20°' },
    { hi: '+26°', lo: '+21°' },
    { hi: '+24°', lo: '+20°' },
    { hi: '+29°', lo: '+20°' },
    { hi: '+29°', lo: '+21°' },
    { hi: '+25°', lo: '+19°' },
  ];
  return (
    <div style={box}>
      <div style={title}>{t.weather_title}</div>
      <a href="https://www.booked.net/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--t2-ink-3)', textDecoration: 'none' }}>booked.net</a>
      <div style={big}>+25 <span style={{ fontSize: 18, marginLeft: 2 }}>°C</span></div>
      <div style={sub}>H: +25° &nbsp; L: +20°</div>
      <div style={place}>{t.place}</div>
      <div style={{ ...sub, marginTop: 2 }}>{t.date_line}</div>
      <div style={{ ...title, marginTop: 16, marginBottom: 8, fontSize: 13 }}>{t.week_forecast}</div>
      <div style={week}>
        {week_temps.map((w, i) => (
          <div key={i} style={day}>
            <div style={dayLabel}>{t.days[i]}</div>
            <div>{w.hi}</div>
            <div style={{ color: 'var(--t2-ink-3)' }}>{w.lo}</div>
          </div>
        ))}
      </div>
      <a href="https://nochi.com/weather/alicante-578" target="_blank" rel="noopener noreferrer"
         style={{ display: 'block', marginTop: 12, fontSize: 11, color: 'var(--t2-red)', textDecoration: 'none' }}>
        nochi.com/weather/alicante-578
      </a>
    </div>
  );
}

function LatestNews({ onOpenPost }) {
  const t = useT(STR);
  const posts = (window.NEWS_POSTS || []).slice(0, 6);
  const box = { background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 12, padding: 16, marginTop: 20 };
  const title = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--t2-ink)', marginBottom: 12 };
  const row = { display: 'flex', gap: 10, padding: '8px 0', borderTop: '1px solid var(--t2-line)', cursor: 'pointer', textDecoration: 'none' };
  const thumb = { width: 56, height: 56, borderRadius: 6, background: 'var(--t2-bg-2)', flex: '0 0 56px', objectFit: 'cover' };
  const text = { display: 'flex', flexDirection: 'column', justifyContent: 'center' };
  const heading = { fontSize: 13, lineHeight: 1.35, color: 'var(--t2-ink)', margin: 0, fontFamily: "'Inter',system-ui", fontWeight: 500 };
  const date = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 4, fontVariantNumeric: 'tabular-nums' };
  if (!posts.length) {
    return (
      <div style={box}>
        <div style={title}>{t.news_title}</div>
        <div style={{ fontSize: 13, color: 'var(--t2-ink-3)' }}>{t.news_loading}</div>
      </div>
    );
  }
  return (
    <div style={box}>
      <div style={title}>{t.news_title}</div>
      {posts.map(p => (
        <a key={p.slug} style={row} onClick={() => onOpenPost && onOpenPost(p.slug)}>
          {p.cover ? <img src={p.cover} alt="" style={thumb} /> : <div style={thumb} />}
          <div style={text}>
            <div style={heading}>{p.title}</div>
            {p.date && <div style={date}>{p.date}</div>}
          </div>
        </a>
      ))}
    </div>
  );
}

function RecentComments({ onOpenPost }) {
  const t = useT(STR);
  const box = { background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 12, padding: 16, marginTop: 20 };
  const title = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--t2-ink)', marginBottom: 12 };
  const item = { fontSize: 13, lineHeight: 1.5, color: 'var(--t2-ink-2)', padding: '6px 0', borderTop: '1px solid var(--t2-line)' };
  const link = { color: 'var(--t2-red)', textDecoration: 'none', cursor: 'pointer' };
  return (
    <div style={box}>
      <div style={title}>{t.comments_title}</div>
      {COMMENTS.map((c, i) => (
        <div key={i} style={item}>
          {c.author} {t.comment_connector} <a style={link} onClick={() => onOpenPost && onOpenPost(c.postSlug)}>{c.postTitle}</a>
        </div>
      ))}
    </div>
  );
}

function Sidebar({ onOpenPost }) {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column' }}>
      <WeatherWidget />
      <LatestNews onOpenPost={onOpenPost} />
      <RecentComments onOpenPost={onOpenPost} />
    </aside>
  );
}

window.Sidebar = Sidebar;
