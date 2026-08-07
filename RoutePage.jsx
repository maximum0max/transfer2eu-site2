import React from 'react'
import BookingForm from './BookingForm.jsx'
import CTABanner from './CTABanner.jsx'
import Reveal from './Reveal.jsx'
import { BRAND, findRoute, POPULAR, ROUTE_GROUPS, ROUTE_IMAGES, waLink, tgLink, cityName, groupLabel } from './BrandData.jsx'
import { getRouteGuide, GUIDE_CREDITS } from './RouteGuide.data.jsx'
import { getRouteArticle } from './RouteArticles.data.jsx'
import SeoArticle from './SeoArticle.jsx'
import GoogleReviews from './GoogleReviews.jsx'
import TelegramIcon from './TelegramIcon.jsx'
import { pathOf } from './router.jsx'
import { useT, useLang } from './i18n.jsx'
// RoutePage v3 — immersive/visual layout. Sections:
// 1) Photo-bg hero with floating stat strip
// 2) Two-column band: trip details on left + BookingForm on right
// 3) Trip breakdown — what happens during the trip (4-step horizontal flow)
// 4) Vehicle tiers — Standard / Comfort / Minivan
// 5) "Что вас ждёт в [город]" destination teaser card
// 6) Other popular routes
// 7) CTABanner

// All Russian UI strings live here, co-located, with a Ukrainian twin picked by
// useT() from the URL-derived language. Route DATA (city names, guide/article
// bodies) stays in its own modules — cityName()/getRouteArticle() localize it.
const STR = {
  ru: {
    not_found: 'Маршрут не найден',
    all_routes: 'Все маршруты',
    alicante: 'Аликанте',
    min: 'мин',
    photo: 'Фото',
    per_car: 'За автомобиль',
    transfer_alicante_dash: 'Трансфер Аликанте —',

    // hero
    min_enroute: 'мин в пути',
    fixed_price_sedan: 'фиксированная цена за автомобиль (седан)',
    stat_enroute: 'В пути',
    stat_passengers_num: 'до 4',
    stat_passengers: 'Пассажиров',
    stat_dispatch: 'Подача',

    // details band
    route_on_map: 'Маршрут на карте',
    road_from_alc: (city) => `Дорога из аэропорта ALC в ${city}`,
    map_title: (city) => `Маршрут от аэропорта Аликанте (ALC) до ${city} на карте`,
    map_note: (city, time, price) => `Аэропорт Аликанте (ALC) → ${city} — примерно ${time} минут в пути. Фиксированная цена ${price}€ за автомобиль.`,
    order_wa: 'Заказать в WhatsApp',
    order_tg: 'Заказать в Telegram',
    wa_msg: (city) => `Здравствуйте! Хочу заказать трансфер из аэропорта Аликанте (ALC) в ${city}.`,
    tg_msg: 'Здравствуйте! Хочу заказать трансфер.',

    // trip breakdown
    tb_eyebrow: 'Как проходит трансфер',
    tb_h2: (city) => `Из ALC в ${city} — шаг за шагом`,
    step1_t: 'Прилёт в ALC',
    step1_x: 'Водитель отслеживает рейс. Ждёт у выхода с именной табличкой.',
    step2_t: 'Багаж в машину',
    step2_x: 'Помогаем с чемоданами, идём к парковке через 5 минут.',
    step3_t: 'Дорога',
    step3_x: 'Платные дороги уже оплачены. Wi-Fi и вода — есть.',
    step4_t: 'Прибытие в',
    step4_x: 'Дверь в дверь — отель, апартаменты или ресторан.',

    // vehicle tiers
    vt_eyebrow: 'Класс автомобиля',
    vt_h2: 'Выберите комфорт под свою компанию',
    vt_lede: 'Все три класса с русскоязычным водителем и фиксированной ценой.',
    vt_popular: 'Популярный',
    tiers: [
      { name: 'Стандарт', cap: 'до 4 пассажиров', luggage: '3 чемодана', features: ['Кондиционер', 'Wi-Fi', 'Бутылка воды', 'Детское кресло'] },
      { name: 'Комфорт',  cap: 'до 4 пассажиров', luggage: '4 чемодана', features: ['Премиум-салон', 'Кожа', 'Wi-Fi', 'Climate control', 'Детское кресло'] },
      { name: 'Минивэн',  cap: 'до 8 пассажиров', luggage: '8 чемоданов', features: ['Большой багажник', 'Wi-Fi', 'Климат-зона', 'Кресла для детей'] },
    ],

    // destination teaser
    dt_eyebrow: 'Что вас ждёт',
    dt_what_to_see: 'что посмотреть',
    dt_body: 'Мы знаем побережье как свои пять пальцев. Подскажем, куда сходить вечером, где поесть и какие места не пропустить.',
    dt_minutes_from_alc: 'минут от ALC',
    highlights: {
      'Бенидорм': [
        { icon: '🏖', title: 'Levante и Poniente', text: 'Два пляжа с золотым песком и набережной 3 км.' },
        { icon: '🎢', title: 'Terra Mítica',         text: 'Тематический парк на 30 аттракционов.' },
        { icon: '🌃', title: 'Ночная жизнь',         text: 'Старый город — бары, тапас, live-музыка.' },
      ],
      'Кальпе': [
        { icon: '⛰',  title: 'Penyal d\'Ifac',     text: 'Скала-символ Средиземноморья, высота 332 м.' },
        { icon: '🐟', title: 'Рыбный рынок',        text: 'Самый аутентичный аукцион улова на побережье.' },
        { icon: '🛶', title: 'Снорклинг',           text: 'Прозрачная вода вокруг бухты Calalga.' },
      ],
      'Торревьеха': [
        { icon: '🦩', title: 'Розовое озеро',       text: 'Соляное озеро с фламинго — фото-локация номер 1.' },
        { icon: '🏝', title: 'Длинная пляжная коса', text: 'Кесада, Ла-Мата, Ла-Сения в радиусе 15 минут.' },
        { icon: '🛒', title: 'Воскресный маркет',   text: 'Огромный рынок на 1000+ прилавков.' },
      ],
      'Дения': [
        { icon: '🏰', title: 'Замок XII века',       text: 'Главная достопримечательность над городом.' },
        { icon: '⛵', title: 'Марина',                text: 'Один из лучших яхт-портов на Costa Blanca.' },
        { icon: '🌳', title: 'Парк Montgó',          text: 'Заповедник с панорамами на 360°.' },
      ],
      'Мурсия': [
        { icon: '⛪', title: 'Кафедральный собор',   text: 'Барокко XVIII века в самом центре.' },
        { icon: '🌹', title: 'Площадь Кардинала',    text: 'Главная площадь со старинными фасадами.' },
        { icon: '🍴', title: 'Гастрономия',          text: 'Овощи Региона + морепродукты — лучшее меню юга.' },
      ],
      'Валенсия': [
        { icon: '🏛', title: 'Город искусств и наук', text: 'Футуристический комплекс Калатравы.' },
        { icon: '🥘', title: 'Родина паэльи',         text: 'Лучшее блюдо Испании — здесь и сейчас.' },
        { icon: '🌳', title: 'Парк Турии',            text: 'Реку превратили в зелёный парк — 9 км пешком.' },
      ],
    },
    highlightsDefault: [
      { icon: '🏖', title: 'Море и пляжи',      text: 'Чистые пляжи Costa Blanca с золотым песком.' },
      { icon: '🍽',  title: 'Гастрономия',       text: 'Свежие морепродукты и местная кухня.' },
      { icon: '🌅', title: 'Виды на закат',     text: 'Лучшие точки для фото на побережье.' },
    ],

    // other routes
    or_eyebrow: 'Другие направления',
    or_transfer_by_region: 'Трансфер по региону',
    or_popular_from_alc: 'Популярные маршруты из ALC',
    or_transfer_arrow: 'Трансфер Аликанте →',
    min_from_alc: 'мин от ALC',
    or_all_dirs: 'Все 40+ направлений',
    or_prices: 'Цены на трансфер',
    or_useful: 'Полезное о Costa Blanca',

    // route guide
    rg_guide_by: 'Гид по',
    rg_h2: 'Пляжи, еда и лучшие фото-локации',
    rg_sub: (city) => `Пока водитель везёт вас из аэропорта — вот всё самое интересное в ${city} и вокруг.`,
    rg_beaches: (city) => `Пляжи ${city} и рядом`,
    rg_food: (city) => `Где поесть в ${city} — рекомендации`,
    rg_photo: (city) => `Что посмотреть и лучшие фото в ${city}`,
    rg_credits: 'Авторы фотографий (Wikimedia Commons)',
  },
  uk: {
    not_found: 'Маршрут не знайдено',
    all_routes: 'Усі маршрути',
    alicante: 'Аліканте',
    min: 'хв',
    photo: 'Фото',
    per_car: 'За автомобіль',
    transfer_alicante_dash: 'Трансфер Аліканте —',

    // hero
    min_enroute: 'хв у дорозі',
    fixed_price_sedan: 'фіксована ціна за автомобіль (седан)',
    stat_enroute: 'У дорозі',
    stat_passengers_num: 'до 4',
    stat_passengers: 'Пасажирів',
    stat_dispatch: 'Подача',

    // details band
    route_on_map: 'Маршрут на карті',
    road_from_alc: (city) => `Дорога з аеропорту ALC в ${city}`,
    map_title: (city) => `Маршрут від аеропорту Аліканте (ALC) до ${city} на карті`,
    map_note: (city, time, price) => `Аеропорт Аліканте (ALC) → ${city} — приблизно ${time} хвилин у дорозі. Фіксована ціна ${price}€ за автомобіль.`,
    order_wa: 'Замовити у WhatsApp',
    order_tg: 'Замовити у Telegram',
    wa_msg: (city) => `Вітаю! Хочу замовити трансфер з аеропорту Аліканте (ALC) в ${city}.`,
    tg_msg: 'Вітаю! Хочу замовити трансфер.',

    // trip breakdown
    tb_eyebrow: 'Як проходить трансфер',
    tb_h2: (city) => `З ALC в ${city} — крок за кроком`,
    step1_t: 'Приліт в ALC',
    step1_x: 'Водій відстежує рейс. Чекає біля виходу з іменною табличкою.',
    step2_t: 'Багаж у машину',
    step2_x: 'Допомагаємо з валізами, йдемо до парковки за 5 хвилин.',
    step3_t: 'Дорога',
    step3_x: 'Платні дороги вже оплачені. Wi-Fi і вода — є.',
    step4_t: 'Прибуття в',
    step4_x: 'Двері в двері — готель, апартаменти чи ресторан.',

    // vehicle tiers
    vt_eyebrow: 'Клас автомобіля',
    vt_h2: 'Оберіть комфорт під свою компанію',
    vt_lede: 'Усі три класи з україномовним водієм і фіксованою ціною.',
    vt_popular: 'Популярний',
    tiers: [
      { name: 'Стандарт', cap: 'до 4 пасажирів', luggage: '3 валізи', features: ['Кондиціонер', 'Wi-Fi', 'Пляшка води', 'Дитяче крісло'] },
      { name: 'Комфорт',  cap: 'до 4 пасажирів', luggage: '4 валізи', features: ['Преміум-салон', 'Шкіра', 'Wi-Fi', 'Climate control', 'Дитяче крісло'] },
      { name: 'Мінівен',  cap: 'до 8 пасажирів', luggage: '8 валіз', features: ['Великий багажник', 'Wi-Fi', 'Клімат-зона', 'Крісла для дітей'] },
    ],

    // destination teaser
    dt_eyebrow: 'Що на вас чекає',
    dt_what_to_see: 'що подивитися',
    dt_body: 'Ми знаємо узбережжя як свої п’ять пальців. Підкажемо, куди піти ввечері, де поїсти і які місця не пропустити.',
    dt_minutes_from_alc: 'хвилин від ALC',
    highlights: {
      'Бенидорм': [
        { icon: '🏖', title: 'Levante і Poniente', text: 'Два пляжі із золотим піском і набережною 3 км.' },
        { icon: '🎢', title: 'Terra Mítica',         text: 'Тематичний парк на 30 атракціонів.' },
        { icon: '🌃', title: 'Нічне життя',          text: 'Старе місто — бари, тапас, live-музика.' },
      ],
      'Кальпе': [
        { icon: '⛰',  title: 'Penyal d\'Ifac',     text: 'Скеля-символ Середземномор’я, висота 332 м.' },
        { icon: '🐟', title: 'Рибний ринок',        text: 'Найавтентичніший аукціон улову на узбережжі.' },
        { icon: '🛶', title: 'Снорклінг',           text: 'Прозора вода навколо бухти Calalga.' },
      ],
      'Торревьеха': [
        { icon: '🦩', title: 'Рожеве озеро',        text: 'Солоне озеро з фламінго — фото-локація номер 1.' },
        { icon: '🏝', title: 'Довга піщана коса',   text: 'Кесада, Ла-Мата, Ла-Сенія в радіусі 15 хвилин.' },
        { icon: '🛒', title: 'Недільний маркет',    text: 'Величезний ринок на 1000+ прилавків.' },
      ],
      'Дения': [
        { icon: '🏰', title: 'Замок XII століття',   text: 'Головна визначна пам’ятка над містом.' },
        { icon: '⛵', title: 'Марина',                text: 'Один із найкращих яхт-портів на Costa Blanca.' },
        { icon: '🌳', title: 'Парк Montgó',          text: 'Заповідник із панорамами на 360°.' },
      ],
      'Мурсия': [
        { icon: '⛪', title: 'Кафедральний собор',   text: 'Бароко XVIII століття в самому центрі.' },
        { icon: '🌹', title: 'Площа Кардинала',      text: 'Головна площа зі старовинними фасадами.' },
        { icon: '🍴', title: 'Гастрономія',          text: 'Овочі Регіону + морепродукти — найкраще меню півдня.' },
      ],
      'Валенсия': [
        { icon: '🏛', title: 'Місто мистецтв і наук', text: 'Футуристичний комплекс Калатрави.' },
        { icon: '🥘', title: 'Батьківщина паельї',    text: 'Найкраща страва Іспанії — тут і зараз.' },
        { icon: '🌳', title: 'Парк Турії',            text: 'Річку перетворили на зелений парк — 9 км пішки.' },
      ],
    },
    highlightsDefault: [
      { icon: '🏖', title: 'Море і пляжі',      text: 'Чисті пляжі Costa Blanca із золотим піском.' },
      { icon: '🍽',  title: 'Гастрономія',       text: 'Свіжі морепродукти та місцева кухня.' },
      { icon: '🌅', title: 'Краєвиди на захід сонця', text: 'Найкращі точки для фото на узбережжі.' },
    ],

    // other routes
    or_eyebrow: 'Інші напрямки',
    or_transfer_by_region: 'Трансфер по регіону',
    or_popular_from_alc: 'Популярні маршрути з ALC',
    or_transfer_arrow: 'Трансфер Аліканте →',
    min_from_alc: 'хв від ALC',
    or_all_dirs: 'Усі 40+ напрямків',
    or_prices: 'Ціни на трансфер',
    or_useful: 'Корисне про Costa Blanca',

    // route guide
    rg_guide_by: 'Гід по',
    rg_h2: 'Пляжі, їжа та найкращі фото-локації',
    rg_sub: (city) => `Поки водій везе вас з аеропорту — ось усе найцікавіше в ${city} і навколо.`,
    rg_beaches: (city) => `Пляжі ${city} і поряд`,
    rg_food: (city) => `Де поїсти в ${city} — рекомендації`,
    rg_photo: (city) => `Що подивитися та найкращі фото в ${city}`,
    rg_credits: 'Автори фотографій (Wikimedia Commons)',
  },
};

function RoutePage({ slug, onNav, onSelectRoute }) {
  const lang = useLang();
  const t = useT(STR);
  const r = findRoute(slug);
  const guide = r ? getRouteGuide(r.slug, lang) : null;
  const article = r ? getRouteArticle(r.slug, lang) : null;

  if (!r) {
    return (
      <>
        <section style={{ padding: '64px 24px', textAlign: 'center', background: '#fff' }}>
          <h1 style={{ fontFamily: "'Onest',sans-serif", fontSize: 32, color: 'var(--t2-ink)' }}>{t.not_found}</h1>
          <button onClick={() => onNav('routes')} style={{ marginTop: 16, padding: '12px 24px', borderRadius: 12, background: 'var(--t2-red)', color: '#fff', border: 0, fontFamily: "'Inter',system-ui", fontWeight: 700, cursor: 'pointer' }}>
            {t.all_routes}
          </button>
        </section>
        <CTABanner onNav={onNav} />
      </>
    );
  }

  return (
    <>
      <RouteHero r={r} />
      <RouteDetailsBand r={r} onNav={onNav} guide={guide} />
      <Reveal><TripBreakdown r={r} /></Reveal>
      <Reveal><VehicleTiers basePrice={r.price} /></Reveal>
      <Reveal><DestinationTeaser r={r} /></Reveal>
      {guide && <Reveal><RouteGuide guide={guide} cityRu={cityName(r, lang)} /></Reveal>}
      {article && <Reveal><SeoArticle {...article} /></Reveal>}
      <Reveal><OtherRoutes currentSlug={r.slug} onSelectRoute={onSelectRoute} /></Reveal>
      {/* Real Google reviews as social proof right before the final CTA —
          currently only on the Gran Alacant page (pilot). */}
      {r.slug === 'gran-alacant' && <Reveal><GoogleReviews /></Reveal>}
      <Reveal><CTABanner onNav={onNav} /></Reveal>
    </>
  );
}

/* ============ 1. Photo-bg hero ============ */
function RouteHero({ r }) {
  const t = useT(STR);
  const lang = useLang();
  // No overflow:hidden here — the stat card below deliberately hangs 36px past
  // the section (marginBottom: -36), and clipping the section cut the card's
  // labels off. Only the photo layer needs clipping, so it does its own.
  const wrap = {
    position: 'relative', minHeight: 460,
    background: r.gradient || 'linear-gradient(135deg, var(--t2-deep), #0b1e33)',
    color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    paddingTop: 80,
  };
  const photo = { position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' };
  const photoImg = { width: '100%', height: '100%', objectFit: 'cover' };
  const overlay = {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(11,30,51,.55) 0%, rgba(11,30,51,.30) 40%, rgba(11,30,51,.85) 100%)',
  };

  const content = { position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '32px 32px 0', width: '100%' };
  const eyebrow = {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
    borderRadius: 999, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,.30)', fontSize: 12, fontWeight: 600, color: '#fff',
    marginBottom: 16,
  };
  const h1 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-.025em', lineHeight: 1.02, color: '#fff', margin: '0 0 12px', textShadow: '0 2px 16px rgba(0,0,0,.4)' };
  const sub = { fontSize: 17, lineHeight: 1.5, color: 'rgba(255,255,255,.86)', maxWidth: 560, margin: '0 0 28px' };

  // Floating stat strip
  const statStrip = {
    position: 'relative', maxWidth: 1280, margin: '0 auto', width: '100%',
    padding: '0 32px', marginTop: 16, marginBottom: -36, zIndex: 3,
  };
  const statCard = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 0,
    background: '#fff', borderRadius: 18, padding: '8px',
    boxShadow: '0 30px 80px rgba(11,30,51,.25)',
    border: '1px solid var(--t2-line)',
  };
  const statCell = { padding: '18px 22px', borderRight: '1px solid var(--t2-line)', textAlign: 'center' };
  const statCellLast = { ...statCell, borderRight: 0 };
  const statNum = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 28, lineHeight: 1, color: 'var(--t2-ink)', fontVariantNumeric: 'tabular-nums' };
  const statNumRed = { ...statNum, color: 'var(--t2-red)' };
  const statLabel = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 6, letterSpacing: '.06em', textTransform: 'uppercase' };

  // Most route photos come from Wikimedia Commons under CC BY / CC BY-SA, where
  // crediting the author is a condition of use, not a courtesy. Kept small and
  // low-contrast in the corner so it reads as a photo credit and not as copy.
  // Top-right: the bottom of the hero is where the stat card overhangs, and a
  // credit placed there would sit behind it.
  const creditLink = {
    position: 'absolute', right: 12, top: 12, zIndex: 4,
    fontSize: 10, lineHeight: 1.3, color: 'rgba(255,255,255,.55)',
    textDecoration: 'none', maxWidth: '46%', textAlign: 'right',
  };

  return (
    <section style={wrap}>
      <div style={photo}>
        {r.img && (
          <img
            src={r.img}
            alt={r.alt || ''}
            style={photoImg}
            fetchPriority="high"
            width="1600"
            height="900"
          />
        )}
      </div>
      <div style={overlay} />
      {/* Sibling of the overlay, not a child of the photo: the overlay is
          painted after the photo layer and would otherwise dim and swallow it. */}
      {r.credit && (
        <a
          style={creditLink}
          href={r.credit.source}
          target="_blank"
          rel="noopener nofollow"
          title={`${r.credit.file} — ${r.credit.author}, ${r.credit.licence}`}
        >
          {t.photo}: {r.credit.author} / {r.credit.licence}
        </a>
      )}
      <div style={content}>
        <span style={eyebrow}>{r.emoji} {t.alicante} ALC → {cityName(r, lang)}</span>
        <h1 style={h1}>{t.transfer_alicante_dash} {cityName(r, lang)}</h1>
        <p style={sub}><b>{r.price}€</b> · {r.time} {t.min_enroute} · {t.fixed_price_sedan}</p>
      </div>
      <div style={statStrip} className="t2-stat-strip">
        <div style={statCard}>
          <div style={statCell}><div style={statNumRed}>{r.price}€</div><div style={statLabel}>{t.per_car}</div></div>
          <div style={statCell}><div style={statNum}>{r.time} {t.min}</div><div style={statLabel}>{t.stat_enroute}</div></div>
          <div style={statCell}><div style={statNum}>{t.stat_passengers_num}</div><div style={statLabel}>{t.stat_passengers}</div></div>
          <div style={statCellLast}><div style={statNum}>24/7</div><div style={statLabel}>{t.stat_dispatch}</div></div>
        </div>
      </div>
    </section>
  );
}

/* ============ 2. Two-column band: details + BookingForm ============ */
function RouteDetailsBand({ r, onNav, guide }) {
  const t = useT(STR);
  const lang = useLang();
  const wrap = { padding: '72px 32px 64px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1280, margin: '0 auto' };
  const grid = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: 48, alignItems: 'start' };

  const mapWrap = { position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--t2-line)', boxShadow: 'var(--t2-sh-2)', background: 'var(--t2-bg-2)' };
  const mapNote = { fontSize: 13, color: 'var(--t2-ink-3)', margin: '12px 0 20px' };

  // Identical style for both contact buttons (WhatsApp + phone), sized 5% smaller
  // than the previous WhatsApp button (fontSize 14→13.3, padding 11×20→10.5×19).
  const contactBtn = {
    background: '#25d366', color: '#fff', border: '1px solid #25d366',
    fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 13.3,
    padding: '10.5px 19px', borderRadius: 12, textDecoration: 'none',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    whiteSpace: 'nowrap',
    boxShadow: 'var(--t2-sh-1)', width: 204, maxWidth: '100%', boxSizing: 'border-box',
  };

  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 16px', lineHeight: 1.1 };
  const body = { fontSize: 15, lineHeight: 1.6, color: 'var(--t2-ink-2)', margin: '0 0 24px' };

  const facts = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 };
  const fact = { background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' };
  const factEmoji = { fontSize: 22 };
  const factText = {};
  const factTitle = { fontFamily: "'Onest',sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--t2-ink)' };
  const factSub = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 2 };

  const phoneRow = { display: 'flex', gap: 10, flexWrap: 'wrap' };

  // Route map is generic: origin = Alicante airport, destination = this city.
  // A guide entry (RouteGuide.data.jsx) can override the src/title/note.
  const gMap = guide || {};
  const mapSrc = gMap.mapSrc
    || `https://maps.google.com/maps?saddr=${encodeURIComponent('Aeropuerto de Alicante-Elche ALC')}&daddr=${encodeURIComponent(r.city + ', España')}&hl=ru&output=embed`;
  const mapTitle = gMap.mapTitle || t.map_title(cityName(r, lang));
  const mapNoteText = gMap.mapNote
    || t.map_note(cityName(r, lang), r.time, r.price);

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={grid} className="t2-route-grid">
          <div style={{ paddingTop: 24 }}>
            <div style={eyebrow}>{t.route_on_map}</div>
            <h2 style={h2}>{t.road_from_alc(cityName(r, lang))}</h2>
            <div style={mapWrap}>
              <iframe title={mapTitle} src={mapSrc} width="100%" height="100%"
                style={{ border: 0, display: 'block' }} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
            </div>
            <p style={{ ...mapNote, textAlign: 'center' }}>{mapNoteText}</p>
            <div style={{ ...phoneRow, justifyContent: 'center' }}>
              <a href={waLink(t.wa_msg(cityName(r, lang)))}
                 target="_blank" rel="noopener noreferrer" style={contactBtn}>
                📲 {t.order_wa}
              </a>
              <a href={tgLink(t.tg_msg)}
                 target="_blank" rel="noopener noreferrer"
                 style={{ ...contactBtn, background: '#229ED9', border: '1px solid #229ED9' }}>
                <TelegramIcon /> {t.order_tg}
              </a>
              <a href={'tel:' + BRAND.tel} style={{ ...contactBtn, background: '#cbd5e1', color: 'var(--t2-ink)', border: '1px solid #b3c0cf' }}>📞 {BRAND.phone}</a>
            </div>
          </div>

          <div id="booking">
            <BookingForm initialSlug={r.slug} lockDestination />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t2-route-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 700px) {
          .t2-stat-strip { padding: 0 16px !important; }
          .t2-stat-strip > div { grid-template-columns: 1fr 1fr !important; }
          .t2-stat-strip > div > div { border-right: 0 !important; border-bottom: 1px solid var(--t2-line); padding: 14px !important; }
        }
      `}</style>
    </section>
  );
}

/* ============ 3. Trip breakdown — what happens during the trip ============ */
function TripBreakdown({ r }) {
  const t = useT(STR);
  const lang = useLang();
  const STEPS = [
    { icon: '🛬', title: t.step1_t, text: t.step1_x },
    { icon: '🧳', title: t.step2_t, text: t.step2_x },
    { icon: '🛣',  title: `${t.step3_t} ${r.time} ${t.min}`, text: t.step3_x },
    { icon: '🏨', title: `${t.step4_t} ${cityName(r, lang)}`, text: t.step4_x },
  ];

  const wrap = { padding: '88px 32px', background: '#fff' };
  const inner = { maxWidth: 1280, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 40 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 38px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 0', lineHeight: 1.1 };

  const flow = {
    position: 'relative', display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24,
  };
  const stepWrap = { position: 'relative' };
  const stepCard = { background: 'var(--t2-bg-2)', borderRadius: 18, padding: '24px 22px', height: '100%', position: 'relative', overflow: 'hidden' };
  const stepNum = { position: 'absolute', top: 14, right: 18, fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 56, color: 'var(--t2-line)', lineHeight: 1, opacity: .7 };
  const stepIconBox = { width: 52, height: 52, borderRadius: 14, background: '#fff', border: '1px solid var(--t2-line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 14, boxShadow: 'var(--t2-sh-1)' };
  const stepTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--t2-ink)', margin: '0 0 6px' };
  const stepText = { fontSize: 13, lineHeight: 1.55, color: 'var(--t2-ink-3)', margin: 0 };
  const arrow = {
    position: 'absolute', top: '50%', right: -12, width: 24, height: 24,
    transform: 'translateY(-50%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--t2-red)', fontSize: 22, fontWeight: 800,
  };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>{t.tb_eyebrow}</div>
          <h2 style={h2}>{t.tb_h2(cityName(r, lang))}</h2>
        </div>
        <div style={flow}>
          {STEPS.map((s, i) => (
            <div key={i} style={stepWrap}>
              <div style={stepCard}>
                <span style={stepNum}>0{i + 1}</span>
                <div style={stepIconBox}>{s.icon}</div>
                <h3 style={stepTitle}>{s.title}</h3>
                <p style={stepText}>{s.text}</p>
              </div>
              {i < STEPS.length - 1 && <div style={arrow} className="t2-flow-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 1100px) { .t2-flow-arrow { display: none !important; } }
      `}</style>
    </section>
  );
}

/* ============ 4. Vehicle tiers ============ */
function VehicleTiers({ basePrice }) {
  const t = useT(STR);
  // Structural fields stay here; localized name/cap/luggage/features come from STR.
  const TIER_META = [
    { key: 'standard', icon: '🚗', car: 'Skoda Octavia / Seat Leon', delta: 0,  bg: '#fff', highlight: false },
    { key: 'comfort',  icon: '🚘', car: 'Mercedes E-class',          delta: 15, bg: '#fff', highlight: true },
    { key: 'minivan',  icon: '🚐', car: 'Mercedes V-class / VW Caravelle', delta: 30, bg: '#fff', highlight: false },
  ];
  const TIERS = TIER_META.map((m, i) => ({ ...m, ...t.tiers[i] }));

  const wrap = { padding: '88px 32px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1280, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 36 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 38px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 6px', lineHeight: 1.1 };
  const lede = { fontSize: 15, color: 'var(--t2-ink-3)', margin: 0 };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 };
  const card = (h) => ({
    background: '#fff', border: '1px solid ' + (h ? 'var(--t2-red)' : 'var(--t2-line)'),
    borderRadius: 20, padding: '28px 26px',
    position: 'relative',
    boxShadow: h ? '0 24px 60px rgba(238,46,61,.18)' : 'var(--t2-sh-1)',
    transform: h ? 'translateY(-8px)' : 'translateY(0)',
  });
  const ribbon = { position: 'absolute', top: -12, right: 20, padding: '5px 12px', borderRadius: 999, background: 'var(--t2-red)', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' };
  const carEmoji = { fontSize: 44, marginBottom: 14 };
  const tierName = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--t2-ink)', margin: '0 0 4px', letterSpacing: '-.01em' };
  const tierCar = { fontSize: 13, color: 'var(--t2-ink-3)', marginBottom: 18 };
  const tierPrice = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 36, color: 'var(--t2-ink)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 };
  const tierPriceLabel = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 4, marginBottom: 16, letterSpacing: '.06em', textTransform: 'uppercase' };
  const features = { listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid var(--t2-line)', paddingTop: 16 };
  const feat = { padding: '6px 0', fontSize: 13, color: 'var(--t2-ink-2)', display: 'flex', alignItems: 'center', gap: 8 };
  const meta = { display: 'flex', gap: 16, fontSize: 11, color: 'var(--t2-ink-3)', marginBottom: 14 };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>{t.vt_eyebrow}</div>
          <h2 style={h2}>{t.vt_h2}</h2>
          <p style={lede}>{t.vt_lede}</p>
        </div>
        <div style={grid}>
          {TIERS.map(tier => (
            <div key={tier.key} style={card(tier.highlight)}>
              {tier.highlight && <span style={ribbon}>{t.vt_popular}</span>}
              <div style={carEmoji}>{tier.icon}</div>
              <h3 style={tierName}>{tier.name}</h3>
              <div style={tierCar}>{tier.car}</div>
              <div style={meta}>
                <span>👥 {tier.cap}</span>
                <span>🧳 {tier.luggage}</span>
              </div>
              <div style={tierPrice}>{basePrice + tier.delta}€</div>
              <div style={tierPriceLabel}>{t.per_car}</div>
              <ul style={features}>
                {tier.features.map((f, i) => (
                  <li key={i} style={feat}>
                    <span style={{ color: 'var(--t2-red)', fontWeight: 800 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ 5. Destination teaser ============ */
function DestinationTeaser({ r }) {
  const t = useT(STR);
  const lang = useLang();
  const wrap = { padding: '88px 32px', background: '#fff' };
  const inner = { maxWidth: 1200, margin: '0 auto' };
  const split = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' };

  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 38px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 16px', lineHeight: 1.1 };
  const body = { fontSize: 16, lineHeight: 1.6, color: 'var(--t2-ink-2)', margin: '0 0 20px' };
  const bullets = { listStyle: 'none', padding: 0, margin: 0 };
  const bullet = { display: 'flex', gap: 12, padding: '10px 0', borderTop: '1px solid var(--t2-line)' };
  const bIcon = { fontSize: 22, flexShrink: 0 };
  const bTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--t2-ink)' };
  const bText = { fontSize: 13, color: 'var(--t2-ink-3)', marginTop: 2 };

  const photoCard = { position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '4 / 5', boxShadow: '0 30px 60px rgba(11,30,51,.18)', background: r.gradient };
  const photoImg = { width: '100%', height: '100%', objectFit: 'cover' };
  const photoTag = { position: 'absolute', bottom: 18, left: 18, right: 18, padding: '14px 18px', borderRadius: 16, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 12 };
  const photoTagEmoji = { fontSize: 24 };
  const photoTagText = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--t2-ink)' };
  const photoTagSub = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 2 };

  // Per-destination teasers (localized, keyed by the Russian city name); the
  // default set works for any other city.
  const items = t.highlights[r.ru] || t.highlightsDefault;

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={split} className="t2-dest-split">
          <div>
            <div style={eyebrow}>{t.dt_eyebrow}</div>
            <h2 style={h2}>{cityName(r, lang)} — {t.dt_what_to_see}</h2>
            <p style={body}>{t.dt_body}</p>
            <ul style={bullets}>
              {items.map((it, i) => (
                <li key={i} style={bullet}>
                  <span style={bIcon}>{it.icon}</span>
                  <div>
                    <div style={bTitle}>{it.title}</div>
                    <div style={bText}>{it.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={photoCard}>
              {r.img && <img src={r.img} alt={r.alt || cityName(r, lang)} style={photoImg} />}
              <div style={photoTag}>
                <span style={photoTagEmoji}>{r.emoji}</span>
                <div>
                  <div style={photoTagText}>{cityName(r, lang)}, Costa Blanca</div>
                  <div style={photoTagSub}>~{r.time} {t.dt_minutes_from_alc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .t2-dest-split { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ============ 6. Other routes ============ */
function OtherRoutes({ currentSlug, onSelectRoute }) {
  const t = useT(STR);
  const lang = useLang();
  // Topical clustering for SEO: show routes in the SAME region first (a tight
  // internal-link neighbourhood), then fill with site-wide popular routes.
  // Every card is a real <a href> so search engines crawl the whole route graph.
  const group = (ROUTE_GROUPS || []).find(g => g.routes.some(x => x.slug === currentSlug));
  const siblings = group ? group.routes.filter(x => x.slug !== currentSlug) : [];
  const seen = new Set([currentSlug]);
  const related = [];
  for (const r of [...siblings, ...(POPULAR || [])]) {
    if (seen.has(r.slug)) continue;
    seen.add(r.slug);
    const meta = ROUTE_IMAGES[r.slug];
    related.push(meta ? { ...r, ...meta } : r);
    if (related.length >= 6) break;
  }
  if (!related.length) return null;

  const regionLabel = group ? groupLabel(group, lang) : null;

  const wrap = { padding: '64px 32px 88px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1280, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 32 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 3vw, 32px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 0', lineHeight: 1.1 };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 };
  const card = { background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--t2-line)', cursor: 'pointer', transition: 'all 220ms', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', textDecoration: 'none', color: 'inherit' };
  const thumb = { width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: 'var(--t2-bg-2)' };
  const thumbImg = { width: '100%', height: '100%', objectFit: 'cover' };
  const cText = { flex: 1, minWidth: 0 };
  const cName = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--t2-ink)' };
  const cTime = { fontSize: 11, color: 'var(--t2-ink-3)', marginTop: 2 };
  const cPrice = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 16, color: 'var(--t2-red)', fontVariantNumeric: 'tabular-nums' };

  const linkRow = { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 28 };
  const pill = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 999, background: '#fff', border: '1px solid var(--t2-line)', color: 'var(--t2-ink-2)', textDecoration: 'none', fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 14 };

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>{t.or_eyebrow}</div>
          <h2 style={h2}>{regionLabel ? `${t.or_transfer_by_region} «${regionLabel}»` : t.or_popular_from_alc}</h2>
        </div>
        <div style={grid}>
          {related.map(r => (
            <a key={r.slug} style={card} href={pathOf('route', r.slug, lang)}
               onClick={() => onSelectRoute(r.slug)}
               aria-label={`${t.or_transfer_arrow} ${cityName(r, lang)} ${r.price}€`}
               onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--t2-red)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--t2-sh-2)'; }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--t2-line)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={thumb}>{r.img && <img src={r.img} alt={`${t.transfer_alicante_dash} ${cityName(r, lang)}`} loading="lazy" style={thumbImg} />}</div>
              <div style={cText}>
                <div style={cName}>{r.emoji} {t.alicante} → {cityName(r, lang)}</div>
                <div style={cTime}>{r.time} {t.min_from_alc}</div>
              </div>
              <div style={cPrice}>{r.price}€</div>
            </a>
          ))}
        </div>
        <div style={linkRow}>
          <a style={pill} href={pathOf('routes', null, lang)}>📍 {t.or_all_dirs}</a>
          <a style={pill} href={pathOf('price', null, lang)}>💶 {t.or_prices}</a>
          <a style={pill} href={pathOf('news', null, lang)}>📰 {t.or_useful}</a>
        </div>
      </div>
    </section>
  );
}

/* ============ 5b. City guide — beaches, food, photo spots (with photos) ====== */
function RouteGuide({ guide, cityRu = 'Аликанте' }) {
  const t = useT(STR);
  const wrap = { padding: '88px 32px', background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1100, margin: '0 auto' };
  const head = { textAlign: 'center', marginBottom: 28 };
  const eyebrow = { fontSize: 12, fontWeight: 700, color: 'var(--t2-red)', letterSpacing: '.12em', textTransform: 'uppercase' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 'clamp(26px, 3.2vw, 36px)', letterSpacing: '-.02em', color: 'var(--t2-ink)', margin: '8px 0 6px', lineHeight: 1.1 };
  const sub = { fontSize: 15, color: 'var(--t2-ink-3)', maxWidth: 640, margin: '0 auto' };

  const secTitle = { fontFamily: "'Onest',sans-serif", fontWeight: 800, fontSize: 24, color: 'var(--t2-ink)', margin: '48px 0 4px', display: 'flex', alignItems: 'center', gap: 10 };
  const secSub = { fontSize: 14, color: 'var(--t2-ink-3)', margin: '0 0 18px', maxWidth: 720 };
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 };
  const card = { background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--t2-sh-1)', display: 'flex', flexDirection: 'column' };
  const cardImg = { width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', display: 'block', background: 'var(--t2-bg-2)' };
  const cardBody = { padding: '14px 16px' };
  const cardTop = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 6 };
  const cName = { fontFamily: "'Onest',sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--t2-ink)' };
  const cBadge = { fontSize: 11, fontWeight: 700, color: 'var(--t2-red)', background: 'var(--t2-red-soft)', padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 };
  const cText = { fontSize: 13.5, lineHeight: 1.55, color: 'var(--t2-ink-2)' };

  const Section = ({ icon, title, sub: s, items, badgeKey }) => (
    <>
      <h3 style={secTitle}>{icon} {title}</h3>
      {s && <p style={secSub}>{s}</p>}
      <div style={grid}>
        {items.map((it, i) => (
          <div key={i} style={card}>
            {it.img && <img src={it.img} alt={it.name} loading="lazy" decoding="async" style={cardImg} />}
            <div style={cardBody}>
              <div style={cardTop}>
                <span style={cName}>{it.name}</span>
                {badgeKey && it[badgeKey] && <span style={cBadge}>{it[badgeKey]}</span>}
              </div>
              <div style={cText}>{it.text}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Photo attribution (CC BY-SA / CC BY require it) — one compact, collapsible list.
  const seen = new Set();
  const creditList = [];
  for (const it of [...(guide.beaches || []), ...(guide.food || []), ...(guide.photoSpots || [])]) {
    const c = GUIDE_CREDITS[it.key];
    if (c && !seen.has(it.key)) { seen.add(it.key); creditList.push({ ...c, place: it.name }); }
  }

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <div style={eyebrow}>{t.rg_guide_by} {cityRu}</div>
          <h2 style={h2}>{t.rg_h2}</h2>
          <p style={sub}>{t.rg_sub(cityRu)}</p>
        </div>

        {guide.beaches && guide.beaches.length > 0 &&
          <Section icon="🏖" title={t.rg_beaches(cityRu)} sub={guide.beachesIntro} items={guide.beaches} badgeKey="dist" />}
        {guide.food && guide.food.length > 0 &&
          <Section icon="🍽" title={t.rg_food(cityRu)} sub={guide.foodIntro} items={guide.food} badgeKey="type" />}
        {guide.photoSpots && guide.photoSpots.length > 0 &&
          <Section icon="📸" title={t.rg_photo(cityRu)} sub={guide.photoIntro} items={guide.photoSpots} />}

        {creditList.length > 0 && (
          <details style={{ marginTop: 40, fontSize: 12, color: 'var(--t2-ink-3)' }}>
            <summary style={{ cursor: 'pointer' }}>{t.rg_credits}</summary>
            <ul style={{ margin: '10px 0 0', paddingLeft: 18, lineHeight: 1.7 }}>
              {creditList.map((c, i) => (
                <li key={i}>
                  {c.place} — {c.source
                    ? <a href={c.source} target="_blank" rel="noopener nofollow" style={{ color: 'var(--t2-ink-2)' }}>{c.author}</a>
                    : c.author}{c.license ? ` (${c.license})` : ''}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </section>
  );
}

export default RoutePage;
