// Single source of truth for routes, brand constants, and CTA message text.
// Pattern adopted from the alicante-transfers project (CLAUDE.md "Data Layer").
// Phone/email/wa intentionally kept to the existing transfer2eu numbers per
// site owner — do not swap to the alicante-transfers number.

// Author + licence for each route photo, written by scripts/fetch-route-photos.mjs.
import ROUTE_PHOTO_CREDITS from './RoutePhotos.data.json';
// Ukrainian city names per route slug (RU names live inline as `ru`).
import UK_CITIES from './cities.uk.json';

// Localized city name for a route: Ukrainian when lang==='uk' and we have one,
// otherwise the Russian name (also the fallback for any missing entry).
export const cityName = (route, lang) =>
  (lang === 'uk' && route && UK_CITIES[route.slug]) || (route && route.ru) || '';

export const BRAND = {
  name:      'Transfer2EU',
  domain:    'transfer2eu.com',
  phone:     '+34 651 011 911',
  phoneRaw:  '34651011911',
  tel:       '+34651011911',
  email:     'transfers2eu@gmail.com',
  wa:        'https://wa.me/34651011911',
  telegramBot: 'Apartikibot',
  copy:      '© 2026 Transfer2EU',
};

// Telegram deep link to the interactive price bot. Opens the bot and triggers
// its /start flow (greeting → asks the route → replies with the price). The
// bot logic lives in api/telegram.js.
export const tgLink = () => 'https://t.me/' + BRAND.telegramBot + '?start=transfer';

export const TRUST = [
  { icon: '⭐', text: '5 лет на рынке' },
  { icon: '🚗', text: '3 000+ поездок' },
  { icon: '💬', text: 'Русскоязычный водитель' },
  { icon: '💳', text: 'Фиксированная цена' },
];

export const ROUTE_GROUPS = [
  {
    label: 'Близкие направления', emoji: '📍',
    routes: [
      { slug: 'taxi-aeroport-alicante',     city: 'Alicante',       ru: 'Аликанте',     price: 25, emoji: '🏙', time: 15 },
      { slug: 'gran-alacant',               city: 'Gran Alacant',   ru: 'Гран Алакант', price: 25, emoji: '🏖', time: 10 },
      { slug: 'san-juan-playa',             city: 'San Juan Playa', ru: 'Сан-Хуан',     price: 25, emoji: '🏖', time: 20 },
      { slug: 'santa-pola',                 city: 'Santa Pola',     ru: 'Санта-Пола',   price: 25, emoji: '⛵', time: 20 },
      { slug: 'la-marina',                  city: 'La Marina',      ru: 'Ла-Марина',    price: 35, emoji: '🌴', time: 25 },
      { slug: 'los-balcones',               city: 'Los Balcones',   ru: 'Лос-Балконес', price: 40, emoji: '🏡', time: 30 },
      { slug: 'el-campello',                city: 'El Campello',    ru: 'Эль-Кампельо', price: 45, emoji: '🌊', time: 30 },
    ],
  },
  {
    label: 'Коста-Бланка', emoji: '🌊',
    routes: [
      { slug: 'villajoyosa',                city: 'Villajoyosa', ru: 'Вильяхойоса', price: 45, emoji: '🌊', time: 40 },
      { slug: 'la-nucia',                   city: 'La Nucia',    ru: 'Ла-Нусия',    price: 45, emoji: '🏡', time: 45 },
      { slug: 'finestrat',                  city: 'Finestrat',   ru: 'Финестрат',   price: 60, emoji: '🏔', time: 45 },
      { slug: 'taksi-alikante-benidorm',    city: 'Benidorm',    ru: 'Бенидорм',    price: 60, emoji: '🏖', time: 50 },
      { slug: 'taksi-iz-alikante-v-kalpe',  city: 'Calpe',       ru: 'Кальпе',      price: 80, emoji: '⛰', time: 60 },
      { slug: 'albir',                      city: 'Albir',       ru: 'Альбир',      price: 65, emoji: '🌅', time: 60 },
      { slug: 'altea',                      city: 'Altea',       ru: 'Альтеа',      price: 65, emoji: '⛵', time: 65 },
    ],
  },
  {
    label: 'Южное побережье', emoji: '☀️',
    routes: [
      { slug: 'playa-flamenca',             city: 'Playa Flamenca', ru: 'Пляя-Фламенка', price: 50, emoji: '🏖', time: 40 },
      { slug: 'quesada',                    city: 'Quesada',        ru: 'Кесада',         price: 45, emoji: '🌿', time: 45 },
      { slug: 'guardamar',                  city: 'Guardamar',      ru: 'Гуардамар',      price: 45, emoji: '🌊', time: 35 },
      { slug: 'la-zenia',                   city: 'La Zenia',       ru: 'Ла-Сения',       price: 55, emoji: '🌴', time: 45 },
      { slug: 'punta-prima',                city: 'Punta Prima',    ru: 'Пунта-Прима',    price: 55, emoji: '🏖', time: 50 },
      { slug: 'transfer-alicante-torrevieja', city: 'Torrevieja',   ru: 'Торревьеха',     price: 60, emoji: '🦩', time: 55 },
      { slug: 'cabo-roig',                  city: 'Cabo Roig',      ru: 'Кабо-Ройг',      price: 60, emoji: '⛵', time: 50 },
      { slug: 'campoverde',                 city: 'Campoverde',     ru: 'Камповерде',     price: 65, emoji: '🌿', time: 55 },
    ],
  },
  {
    label: 'Мурсия и юг', emoji: '🌹',
    routes: [
      { slug: 'orihuela',                   city: 'Orihuela',              ru: 'Ориуэла',              price: 60,  emoji: '🏛', time: 50  },
      { slug: 'mil-palmeras',               city: 'Mil Palmeras',          ru: 'Миль-Пальмерас',       price: 60,  emoji: '🌴', time: 55  },
      { slug: 'pilar-de-la-horadada',       city: 'Pilar de la Horadada',  ru: 'Пилар-де-ла-Орадада',  price: 70,  emoji: '🌊', time: 60  },
      { slug: 'san-pedro',                  city: 'San Pedro del Pinatar', ru: 'Сан-Педро',            price: 70,  emoji: '⛵', time: 70  },
      { slug: 'taxi-alicante-murcia',       city: 'Murcia',                ru: 'Мурсия',                price: 75,  emoji: '🌹', time: 75  },
      { slug: 'san-javier',                 city: 'San Javier',            ru: 'Сан-Хавьер',            price: 75,  emoji: '✈',  time: 75  },
      { slug: 'los-alcazares',              city: 'Los Alcazares',         ru: 'Лос-Алькасарес',        price: 90,  emoji: '🌊', time: 85  },
      { slug: 'cartagena',                  city: 'Cartagena',             ru: 'Картахена',             price: 110, emoji: '⚓', time: 95  },
      { slug: 'taksi-alikante-la-manga',    city: 'La Manga',              ru: 'Ла-Манга',              price: 125, emoji: '🌴', time: 110 },
    ],
  },
  {
    label: 'Север', emoji: '🏔',
    routes: [
      { slug: 'alcoy',                      city: 'Alcoy',   ru: 'Алькой',  price: 65,  emoji: '🏔', time: 55  },
      { slug: 'moraira',                    city: 'Moraira', ru: 'Морайра', price: 80,  emoji: '⛰',  time: 75  },
      { slug: 'denia',                      city: 'Denia',   ru: 'Дения',   price: 90,  emoji: '⛵', time: 85  },
      { slug: 'javea',                      city: 'Javea',   ru: 'Хавеа',   price: 90,  emoji: '🌊', time: 90  },
      { slug: 'oliva',                      city: 'Oliva',   ru: 'Олива',   price: 95,  emoji: '🌿', time: 95  },
      { slug: 'gandia',                     city: 'Gandia',  ru: 'Гандия',  price: 115, emoji: '🏖', time: 105 },
    ],
  },
  {
    label: 'Крупные города', emoji: '🏙',
    routes: [
      { slug: 'taxi-alicante-valencia',     city: 'Valencia',  ru: 'Валенсия',  price: 150, emoji: '🏛', time: 90  },
      { slug: 'madrid',                     city: 'Madrid',    ru: 'Мадрид',    price: 290, emoji: '👑', time: 240 },
      { slug: 'barcelona',                  city: 'Barcelona', ru: 'Барселона', price: 310, emoji: '🎨', time: 300 },
      { slug: 'malaga',                     city: 'Malaga',    ru: 'Малага',    price: 310, emoji: '☀️', time: 290 },
    ],
  },
];

export const ALL_ROUTES = ROUTE_GROUPS.flatMap(g => g.routes);

// Ukrainian versions of the shared UI strings. Components read these through the
// getters below so BrandData stays the single source of truth for both languages.
const TRUST_UK = ['5 років на ринку', '3 000+ поїздок', 'Україномовний водій', 'Фіксована ціна'];
export const getTrust = (lang) =>
  lang === 'uk' ? TRUST.map((t, i) => ({ icon: t.icon, text: TRUST_UK[i] || t.text })) : TRUST;

const GROUP_LABELS_UK = {
  'Близкие направления': 'Близькі напрямки',
  'Коста-Бланка': 'Коста-Бланка',
  'Южное побережье': 'Південне узбережжя',
  'Мурсия и юг': 'Мурсія і південь',
  'Север': 'Північ',
  'Крупные города': 'Великі міста',
};
export const groupLabel = (g, lang) =>
  (lang === 'uk' && GROUP_LABELS_UK[g.label]) || g.label;

// Image + gradient fallback per destination — used by PopularRoutes cards and
// route hero banners. The gradient renders behind the <img> so the card still
// looks intentional while the photo loads.
//
// The photos are SELF-HOSTED (public/assets/routes/<slug>.jpg), sourced from
// Wikimedia Commons by scripts/fetch-route-photos.mjs. They used to be hotlinked
// from Unsplash, and half of those URLs had since 404'd — a hotlink is a photo a
// stranger can delete. Only 6 of the 41 routes had one at all; now every route
// does. RoutePhotos.data.json carries the author/licence for each, which the
// hero renders: most are CC BY-SA and attribution is a condition of use.
const GRADIENTS = [
  'linear-gradient(135deg,#0ea5e9 0%,#0369a1 60%,#0c4a6e 100%)',
  'linear-gradient(135deg,#fb7185 0%,#e11d48 60%,#9f1239 100%)',
  'linear-gradient(135deg,#64748b 0%,#1e3a8a 60%,#0c4a6e 100%)',
  'linear-gradient(135deg,#fbbf24 0%,#d97706 60%,#92400e 100%)',
  'linear-gradient(135deg,#34d399 0%,#059669 60%,#064e3b 100%)',
  'linear-gradient(135deg,#7c3aed 0%,#4338ca 60%,#1e1b4b 100%)',
];

export const ROUTE_IMAGES = Object.fromEntries(ALL_ROUTES.map((r, i) => [r.slug, {
  img: `/assets/routes/${r.slug}.jpg`,
  alt: `${r.ru} — трансфер из аэропорта Аликанте`,
  gradient: GRADIENTS[i % GRADIENTS.length],
  credit: ROUTE_PHOTO_CREDITS[r.slug] || null,
}]));

// Featured 6 routes on the home grid (alicante-transfers `popular` list).
export const POPULAR = ['Benidorm', 'Torrevieja', 'Calpe', 'Denia', 'Murcia', 'Valencia']
  .map(name => {
    const r = ALL_ROUTES.find(x => x.city === name);
    if (!r) return null;
    const meta = ROUTE_IMAGES[r.slug];
    return meta ? { ...r, ...meta } : r;
  })
  .filter(Boolean);

export const findRoute = (slug) => {
  const r = ALL_ROUTES.find(x => x.slug === slug);
  if (!r) return null;
  const meta = ROUTE_IMAGES[r.slug];
  // ...meta, not a hand-picked subset: it used to drop everything but img/alt/
  // gradient, which silently swallowed the photo credit the licence requires.
  return meta ? { ...r, ...meta } : r;
};

export const waLink = (msg) =>
  BRAND.wa + '?text=' + encodeURIComponent(msg || 'Здравствуйте! Хочу заказать трансфер из аэропорта Аликанте.');

export const routeWaLink = (r) =>
  waLink(`Здравствуйте! Хочу заказать трансфер Аликанте → ${r.ru} за ${r.price}€`);
