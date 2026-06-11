// Single source of truth for routes, brand constants, and CTA message text.
// Pattern adopted from the alicante-transfers project (CLAUDE.md "Data Layer").
// Phone/email/wa intentionally kept to the existing transfer2eu numbers per
// site owner — do not swap to the alicante-transfers number.

export const BRAND = {
  name:      'Transfer2EU',
  domain:    'transfer2eu.com',
  phone:     '+34 651 011 911',
  phoneRaw:  '34651011911',
  tel:       '+34651011911',
  email:     'transfers2eu@gmail.com',
  wa:        'https://wa.me/34651011911',
  copy:      '© 2026 Transfer2EU',
};

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
      { slug: 'finestrat',                  city: 'Finestrat',   ru: 'Финестрат',   price: 50, emoji: '🏔', time: 45 },
      { slug: 'taksi-alikante-benidorm',    city: 'Benidorm',    ru: 'Бенидорм',    price: 50, emoji: '🏖', time: 50 },
      { slug: 'taksi-iz-alikante-v-kalpe',  city: 'Calpe',       ru: 'Кальпе',      price: 60, emoji: '⛰', time: 60 },
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

// Image + gradient fallback per destination — used by PopularRoutes cards
// and route hero banners. The gradient renders behind the <img> so the card
// still looks intentional if the photo 404s.
export const ROUTE_IMAGES = {
  'taksi-alikante-benidorm':       { img: 'https://images.unsplash.com/photo-1599283226915-ef8d2c5a5e15?w=1200&q=75&auto=format&fit=crop', alt: 'Высотные башни Бенидорма и пляж',         gradient: 'linear-gradient(135deg,#0ea5e9 0%,#0369a1 60%,#0c4a6e 100%)' },
  'transfer-alicante-torrevieja':  { img: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=1200&q=75&auto=format&fit=crop', alt: 'Прибрежная набережная Торревьехи',         gradient: 'linear-gradient(135deg,#fb7185 0%,#e11d48 60%,#9f1239 100%)' },
  'taksi-iz-alikante-v-kalpe':     { img: 'https://images.unsplash.com/photo-1583087253076-5d1315860eb7?w=1200&q=75&auto=format&fit=crop', alt: 'Скала Пеньон-де-Ифач и пляж Кальпе',       gradient: 'linear-gradient(135deg,#64748b 0%,#1e3a8a 60%,#0c4a6e 100%)' },
  'denia':                         { img: 'https://images.unsplash.com/photo-1568849676085-51415703900f?w=1200&q=75&auto=format&fit=crop', alt: 'Гавань Дении и средиземноморский яхт-порт', gradient: 'linear-gradient(135deg,#fbbf24 0%,#d97706 60%,#92400e 100%)' },
  'taxi-alicante-murcia':          { img: 'https://images.unsplash.com/photo-1583265627959-fb7042f5133b?w=1200&q=75&auto=format&fit=crop', alt: 'Кафедральный собор Мурсии',                gradient: 'linear-gradient(135deg,#f472b6 0%,#be185d 60%,#831843 100%)' },
  'taxi-alicante-valencia':        { img: 'https://images.unsplash.com/photo-1599581456350-a5c5be71b40f?w=1200&q=75&auto=format&fit=crop', alt: 'Город искусств и наук в Валенсии',         gradient: 'linear-gradient(135deg,#7c3aed 0%,#4338ca 60%,#1e1b4b 100%)' },
};

// Featured 6 routes on the home grid (alicante-transfers `popular` list).
export const POPULAR = ['Benidorm', 'Torrevieja', 'Calpe', 'Denia', 'Murcia', 'Valencia']
  .map(name => {
    const r = ALL_ROUTES.find(x => x.city === name);
    if (!r) return null;
    const meta = ROUTE_IMAGES[r.slug];
    return meta ? { ...r, img: meta.img, alt: meta.alt, gradient: meta.gradient } : r;
  })
  .filter(Boolean);

export const findRoute = (slug) => {
  const r = ALL_ROUTES.find(x => x.slug === slug);
  if (!r) return null;
  const meta = ROUTE_IMAGES[r.slug];
  return meta ? { ...r, img: meta.img, alt: meta.alt, gradient: meta.gradient } : r;
};

export const waLink = (msg) =>
  BRAND.wa + '?text=' + encodeURIComponent(msg || 'Здравствуйте! Хочу заказать трансфер из аэропорта Аликанте.');

export const routeWaLink = (r) =>
  waLink(`Здравствуйте! Хочу заказать трансфер Аликанте → ${r.ru} за ${r.price}€`);
