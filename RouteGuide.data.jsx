// Per-route "city guide" content — beaches, restaurants and photo spots plus a
// Google Maps directions embed. Keyed by route slug so it renders ONLY on the
// pages that have an entry (currently the airport → Alicante city page), not on
// every route. Rendered by RoutePage.jsx (<RouteGuide>) and mirrored into the
// prerendered HTML by scripts/prerender.mjs for SEO / no-JS crawlers.
//
// The map uses the keyless Google Maps embed (saddr/daddr + output=embed), so no
// API key or billing is required.

export const ROUTE_GUIDES = {
  'taxi-aeroport-alicante': {
    mapSrc: 'https://maps.google.com/maps?saddr=Aeropuerto+de+Alicante-Elche+ALC&daddr=Explanada+de+Espa%C3%B1a+Alicante&hl=ru&output=embed',
    mapTitle: 'Маршрут от аэропорта Аликанте (ALC) до центра города на карте',
    mapNote: 'Расстояние от аэропорта Аликанте-Эльче (ALC) до центра города — около 11 км, дорога занимает ~15 минут по трассе A-70/A-77.',

    beachesIntro: 'В радиусе 30 км от центра Аликанте — десятки пляжей: от городского Постигет до диких бухт и заповедного острова Табарка.',
    beaches: [
      { name: 'Playa del Postiguet', dist: '0,5 км', text: 'Городской пляж у подножия замка Санта-Барбара — золотой песок в самом центре города.' },
      { name: 'Playa de la Albufereta', dist: '4 км', text: 'Небольшая уютная бухта с тихой водой, удобна для семей с детьми.' },
      { name: 'Playa de San Juan', dist: '8 км', text: 'Самый большой и популярный пляж Аликанте — 3 км широкого золотого песка, набережная, бары.' },
      { name: 'Cala Cantalar (Cabo de las Huertas)', dist: '10 км', text: 'Дикие скалистые бухты с прозрачной водой — любимое место для снорклинга.' },
      { name: 'Playa de Muchavista (El Campello)', dist: '11 км', text: 'Длинная песчаная полоса к северу, тянется несколько километров вдоль променада.' },
      { name: 'Playa de los Arenales del Sol', dist: '14 км', text: 'Широкий пляж с природными дюнами южнее аэропорта.' },
      { name: 'Playa del Carabassí (Gran Alacant)', dist: '17 км', text: 'Дюны и сосны, охраняемая природная зона — один из самых живописных пляжей.' },
      { name: 'Gran Playa, Santa Pola', dist: '20 км', text: 'Мелкий пологий вход и спокойное море — идеально для отдыха с детьми.' },
      { name: 'Isla de Tabarca', dist: 'паром из порта', text: 'Морской заповедник с кристальной водой — паром отходит из порта Аликанте и Санта-Полы.' },
    ],

    foodIntro: 'Аликанте славится рисовыми блюдами (arroces), свежими морепродуктами и тапас. Вот проверенные адреса для туристов.',
    food: [
      { name: 'Nou Manolín', type: 'Рисы и тапас', text: 'Классика аликантийской кухни: arroz a banda, тапас-бар на первом этаже.' },
      { name: 'Cervecería Sento', type: 'Тапас', text: 'Легендарные монтадитос и тапас — крошечное место с очередью, но оно того стоит.' },
      { name: 'Restaurante Dársena', type: 'Паэлья', text: 'Более 150 видов риса с панорамой марины — знаковый адрес для паэльи.' },
      { name: 'El Portal Taberna & Wines', type: 'Тапас и вино', text: 'Стильный бар в центре: тапас, устрицы, коктейли, большая винная карта.' },
      { name: 'La Ereta', type: 'Высокая кухня', text: 'Ресторан у замка с панорамой города — современная кухня и закатные виды.' },
      { name: 'Mercado Central', type: 'Рынок', text: 'Гастро-прилавки: свежие морепродукты, хамон, сыры — попробуйте всё на месте.' },
    ],

    photoIntro: 'Лучшие точки для фото и селфи в Аликанте — от панорам с замка до цветных улочек старого города.',
    photoSpots: [
      { name: 'Замок Санта-Барбара', text: 'Панорама города, порта и Средиземного моря с горы Бенакантиль — must-have кадр.' },
      { name: 'Explanada de España', text: 'Волнистая мраморная набережная с пальмами — 6,6 млн плиток создают гипнотический узор.' },
      { name: 'Баррио Санта-Крус', text: 'Цветные домики, цветы и узкие улочки старого города — самый фотогеничный квартал.' },
      { name: 'Пляж Постигет с замком', text: 'Кадр с пальмами, песком и замком на скале на фоне — открытка Аликанте.' },
      { name: 'Порт и марина на закате', text: 'Яхты, отражения и золотой свет — идеальное время для съёмки после захода солнца.' },
      { name: 'Парк Каналехас', text: 'Вековые фикусы с огромными воздушными корнями — атмосферная зелёная локация в центре.' },
    ],
  },
};

export const getRouteGuide = (slug) => ROUTE_GUIDES[slug] || null;
