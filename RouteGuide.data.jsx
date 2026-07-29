// Per-route "city guide" content — beaches, restaurants and photo spots plus a
// Google Maps directions embed. Keyed by route slug so it renders ONLY on the
// pages that have an entry (currently the airport → Alicante city page), not on
// every route. Rendered by RoutePage.jsx (<RouteGuide> + the map in the booking
// band) and mirrored into the prerendered HTML by scripts/prerender.mjs.
//
// Photos are self-hosted in public/assets/guide/<key>.jpg (fetched from Wikimedia
// Commons by scripts/fetch-guide-photos.mjs); credits.json carries author/licence.

import GUIDE_CREDITS from './GuidePhotos.data.json';

const img = (key) => '/assets/guide/' + key + '.jpg';

export { GUIDE_CREDITS };

export const ROUTE_GUIDES = {
  'taxi-aeroport-alicante': {
    mapSrc: 'https://maps.google.com/maps?saddr=Aeropuerto+de+Alicante-Elche+ALC&daddr=Explanada+de+Espa%C3%B1a+Alicante&hl=ru&output=embed',
    mapTitle: 'Маршрут от аэропорта Аликанте (ALC) до центра города на карте',
    mapNote: 'Расстояние от аэропорта Аликанте-Эльче (ALC) до центра — около 11 км, дорога ~15 минут по трассе A-70/A-77.',

    beachesIntro: 'В радиусе 30 км от центра Аликанте — десятки пляжей: от городского Постигет до диких бухт и заповедного острова Табарка.',
    beaches: [
      { key: 'postiguet', name: 'Playa del Postiguet', dist: '0,5 км', text: 'Городской пляж у подножия замка Санта-Барбара — золотой песок в самом центре города.' },
      { key: 'albufereta', name: 'Playa de la Albufereta', dist: '4 км', text: 'Небольшая уютная бухта с тихой водой, удобна для семей с детьми.' },
      { key: 'san-juan', name: 'Playa de San Juan', dist: '8 км', text: 'Самый большой и популярный пляж Аликанте — 3 км широкого золотого песка, набережная, бары.' },
      { key: 'cantalar', name: 'Cala Cantalar (Cabo de las Huertas)', dist: '10 км', text: 'Дикие скалистые бухты с прозрачной водой — любимое место для снорклинга.' },
      { key: 'muchavista', name: 'Playa de Muchavista (El Campello)', dist: '11 км', text: 'Длинная песчаная полоса к северу, тянется несколько километров вдоль променада.' },
      { key: 'arenales', name: 'Playa de los Arenales del Sol', dist: '14 км', text: 'Широкий пляж с природными дюнами южнее аэропорта.' },
      { key: 'carabassi', name: 'Playa del Carabassí (Gran Alacant)', dist: '17 км', text: 'Дюны и сосны, охраняемая природная зона — один из самых живописных пляжей.' },
      { key: 'santa-pola', name: 'Gran Playa, Santa Pola', dist: '20 км', text: 'Мелкий пологий вход и спокойное море — идеально для отдыха с детьми.' },
      { key: 'tabarca', name: 'Isla de Tabarca', dist: 'паром из порта', text: 'Морской заповедник с кристальной водой — паром отходит из порта Аликанте и Санта-Полы.' },
    ],

    foodIntro: 'Аликанте славится рисовыми блюдами (arroces), свежими морепродуктами и тапас. Вот проверенные адреса для туристов (на фото — местная кухня).',
    food: [
      { key: 'nou-manolin', name: 'Nou Manolín', type: 'Рисы и тапас', text: 'Классика аликантийской кухни: arroz a banda, тапас-бар на первом этаже.' },
      { key: 'sento', name: 'Cervecería Sento', type: 'Тапас', text: 'Легендарные монтадитос и тапас — крошечное место с очередью, но оно того стоит.' },
      { key: 'darsena', name: 'Restaurante Dársena', type: 'Паэлья', text: 'Более 150 видов риса с панорамой марины — знаковый адрес для паэльи.' },
      { key: 'portal', name: 'El Portal Taberna & Wines', type: 'Тапас и вино', text: 'Стильный бар в центре: тапас, устрицы, коктейли, большая винная карта.' },
      { key: 'ereta', name: 'La Ereta', type: 'Высокая кухня', text: 'Ресторан у замка с панорамой города — современная кухня и закатные виды.' },
      { key: 'mercado', name: 'Mercado Central', type: 'Рынок', text: 'Гастро-прилавки: свежие морепродукты, хамон, сыры — попробуйте всё на месте.' },
    ],

    photoIntro: 'Лучшие точки для фото и селфи в Аликанте — от панорам с замка до цветных улочек старого города.',
    photoSpots: [
      { key: 'castillo', name: 'Замок Санта-Барбара', text: 'Панорама города, порта и Средиземного моря с горы Бенакантиль — must-have кадр.' },
      { key: 'explanada', name: 'Explanada de España', text: 'Волнистая мраморная набережная с пальмами — 6,6 млн плиток создают гипнотический узор.' },
      { key: 'santa-cruz', name: 'Баррио Санта-Крус', text: 'Цветные домики, цветы и узкие улочки старого города — самый фотогеничный квартал.' },
      { key: 'postiguet', name: 'Пляж Постигет с замком', text: 'Кадр с пальмами, песком и замком на скале на фоне — открытка Аликанте.' },
      { key: 'puerto', name: 'Порт и марина на закате', text: 'Яхты, отражения и золотой свет — идеальное время для съёмки после захода солнца.' },
      { key: 'canalejas', name: 'Парк Каналехас', text: 'Вековые фикусы с огромными воздушными корнями — атмосферная зелёная локация в центре.' },
    ],
  },
};

// ---- Batch 1: top Costa Blanca resorts ----

ROUTE_GUIDES['taksi-alikante-benidorm'] = {
  beachesIntro: 'Бенидорм — два больших городских пляжа и уютные бухты между скалами.',
  beaches: [
    { key: 'ben-levante', name: 'Playa de Levante', dist: 'центр', text: 'Главный пляж — 2 км золотого песка, оживлённая набережная, бары и рестораны.' },
    { key: 'ben-poniente', name: 'Playa de Poniente', dist: '1 км', text: 'Более спокойный и длинный пляж с современным променадом — для семей.' },
    { key: 'ben-malpas', name: 'Cala del Mal Pas', dist: 'у старого города', text: 'Небольшая уютная бухта между двумя пляжами, у подножия старого города.' },
    { key: 'ben-tioximo', name: 'Cala Tío Ximo', dist: '3 км', text: 'Тихая галечная бухта с прозрачной водой — отличное место для снорклинга.' },
  ],
  foodIntro: 'От паэльи на набережной до тапас в старом городе (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Паэлья и арросы у моря', type: 'Рис', text: 'Рестораны на набережной Levante — паэлья, arroz a banda, фидеуа.' },
    { key: 'sento', name: 'Тапас в старом городе', type: 'Тапас', text: 'Узкие улочки Casco Antiguo — десятки тапас-баров и таверн.' },
    { key: 'nou-manolin', name: 'Свежие морепродукты', type: 'Море', text: 'Дневной улов: креветки, кальмары и рыба на гриле.' },
  ],
  photoIntro: 'Лучшие видовые точки Бенидорма — от «балкона» на мысу до небоскрёбного силуэта.',
  photoSpots: [
    { key: 'ben-balcon', name: 'Balcón del Mediterráneo', text: 'Смотровая площадка-«балкон» на мысу старого города — панорама обоих пляжей и моря.' },
    { key: 'ben-church', name: 'Iglesia de San Jaime', text: 'Церковь с сине-белым изразцовым куполом над старым городом — символ Бенидорма.' },
    { key: 'ben-skyline', name: 'Небоскрёбный силуэт', text: 'Знаменитый силуэт высоток — особенно эффектно с пляжа и смотровых на закате.' },
    { key: 'ben-oldtown', name: 'Старый город и виды', text: 'Цветные домики, лестницы и панорамы залива — самый атмосферный район для фото.' },
  ],
};

ROUTE_GUIDES['taksi-iz-alikante-v-kalpe'] = {
  beachesIntro: 'Пляжи Кальпе — вокруг знаменитой скалы Пеньон-де-Ифач.',
  beaches: [
    { key: 'cal-fossa', name: 'Playa de la Fossa (Levante)', dist: 'центр', text: 'Главный песчаный пляж прямо под скалой Пеньон-де-Ифач.' },
    { key: 'cal-arenal', name: 'Playa del Arenal-Bol', dist: 'у старого города', text: 'Пляж рядом с историческим центром, набережная с кафе и ресторанами.' },
    { key: 'cal-raco', name: 'Cala del Racó', dist: 'у порта', text: 'Небольшая бухта у порта под самой скалой — прозрачная вода, снорклинг.' },
  ],
  foodIntro: 'Кальпе — это порт со свежей рыбой и местные рисовые блюда.',
  food: [
    { key: 'darsena', name: 'Рыба и морепродукты в порту', type: 'Море', text: 'Дневной улов прямо с рыбного аукциона (lonja) — рестораны у порта.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Местные рисовые блюда — arroz del senyoret, фидеуа.' },
    { key: 'portal', name: 'Кафе и тапас в старом городе', type: 'Тапас', text: 'Разноцветные улочки Casco Antiguo с барами и террасами.' },
  ],
  photoIntro: 'Скала Ифач, соляные озёра с фламинго и старый город — топ-локации для фото.',
  photoSpots: [
    { key: 'cal-penon', name: 'Peñón de Ifach', text: 'Скала-символ 332 м — природный парк, подъём на вершину с панорамой побережья.' },
    { key: 'cal-salinas', name: 'Salinas de Calpe', text: 'Соляные озёра с фламинго и зеркальным отражением скалы — топ для фото.' },
    { key: 'cal-oldtown', name: 'Casco Antiguo', text: 'Старый город с муралами, цветами и узкими улочками.' },
    { key: 'cal-banos', name: 'Baños de la Reina', text: 'Римские купальни и рыбные садки у самого моря — история и живописные кадры.' },
  ],
};

ROUTE_GUIDES['altea'] = {
  beachesIntro: 'Пляжи Альтеа — галечные, с прозрачной водой вдоль пальмовой набережной.',
  beaches: [
    { key: 'alt-roda', name: 'Playa de la Roda', dist: 'центр', text: 'Главный галечный пляж вдоль пальмовой набережной в центре.' },
    { key: 'alt-olla', name: "Playa de l'Olla", dist: '2 км', text: 'Живописный пляж с бухточками к северу от города.' },
    { key: 'alt-cap', name: 'Cap Negret', dist: '3 км', text: 'Пляж с тёмной галькой вулканического происхождения.' },
    { key: 'alt-mascarat', name: 'Playa del Mascarat', dist: '4 км', text: 'Уединённые галечные бухты между скалами.' },
  ],
  foodIntro: 'Средиземноморская кухня и тапас в белоснежном старом городе.',
  food: [
    { key: 'sento', name: 'Тапас в старом городе', type: 'Тапас', text: 'Белые улочки с ресторанчиками и террасами.' },
    { key: 'darsena', name: 'Рыба и морепродукты', type: 'Море', text: 'Свежая рыба и арросы на набережной.' },
    { key: 'portal', name: 'Кафе и арт-галереи', type: 'Кафе', text: 'Атмосферные кафе в артистичном квартале.' },
  ],
  photoIntro: 'Церковь с голубыми куполами и старый город — визитная карточка Альтеа.',
  photoSpots: [
    { key: 'alt-church', name: 'Iglesia del Consuelo', text: 'Церковь с сине-белыми изразцовыми куполами — визитная карточка Альтеа.' },
    { key: 'alt-oldtown', name: 'Старый город', text: 'Мощёные улочки, белые дома и цветы — один из красивейших городков побережья.' },
    { key: 'alt-plaza', name: 'Plaza de la Iglesia', text: 'Смотровая площадь у церкви с панорамой моря.' },
    { key: 'alt-paseo', name: 'Вид с моря и набережная', text: 'Силуэт города с куполами и променад — эффектные кадры на закате.' },
  ],
};

ROUTE_GUIDES['denia'] = {
  beachesIntro: 'Дения — песчаные пляжи на севере и скалистые бухты Лас-Ротас на юге.',
  beaches: [
    { key: 'den-marines', name: 'Les Marines', dist: 'север', text: 'Длинная песчаная полоса с чередой пляжей к северу от города.' },
    { key: 'den-rotes', name: 'Les Rotes', dist: 'юг', text: 'Скалистые бухты с кристальной водой — снорклинг и дайвинг.' },
    { key: 'den-marineta', name: 'Marineta Cassiana', dist: 'центр', text: 'Городской песчаный пляж с пологим входом, удобен для детей.' },
  ],
  foodIntro: 'Дения — город гастрономии ЮНЕСКО: знаменитая красная креветка и арросы.',
  food: [
    { key: 'nou-manolin', name: 'Красная креветка Дении', type: 'Гастрономия', text: 'Знаменитая gamba roja — Дения входит в сеть гастрономических городов ЮНЕСКО.' },
    { key: 'darsena', name: 'Арросы и морепродукты', type: 'Рис', text: 'Рисовые блюда и свежая рыба в порту.' },
    { key: 'sento', name: 'Тапас в квартале Baix la Mar', type: 'Тапас', text: 'Рыбацкий квартал с барами и террасами.' },
  ],
  photoIntro: 'Замок над городом, порт и морская пещера Cova Tallada — лучшие кадры Дении.',
  photoSpots: [
    { key: 'den-castillo', name: 'Castillo de Denia', text: 'Замок над городом с панорамой порта и залива.' },
    { key: 'den-puerto', name: 'Порт и марина', text: 'Оживлённый порт с паромами на Ибицу, ресторанами и яхтами.' },
    { key: 'den-montgo', name: 'Природный парк Монтго', text: 'Гора-символ (753 м) между Денией и Хавеа — тропы и панорамы.' },
    { key: 'den-covatallada', name: 'Cova Tallada', text: 'Морская пещера у Лас-Ротас с бирюзовой водой — к ней ведёт живописная тропа.' },
  ],
};

// ---- Batch 2: more Costa Blanca resorts ----

ROUTE_GUIDES['javea'] = {
  beachesIntro: 'Хавеа — песчаный Аренал и знаменитые бухты с кристальной водой.',
  beaches: [
    { key: 'jav-arenal', name: 'Playa del Arenal', dist: 'центр', text: 'Главный песчаный пляж с оживлённой набережной, барами и ресторанами.' },
    { key: 'jav-granadella', name: 'Cala Granadella', dist: '6 км', text: 'Одна из красивейших бухт Испании в сосновом обрамлении — снорклинг и дайвинг.' },
    { key: 'jav-portitxol', name: 'Cala del Portitxol (La Barraca)', dist: '4 км', text: 'Галечная бухта с прозрачной водой и белыми рыбацкими домиками.' },
  ],
  foodIntro: 'Свежая рыба в порту и рисовые блюда (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Арросы и морепродукты', type: 'Рис', text: 'Рисовые блюда и рыба на набережной и в порту La Grava.' },
    { key: 'sento', name: 'Тапас в старом городе', type: 'Тапас', text: 'Атмосферные бары в историческом центре Хавеа.' },
    { key: 'nou-manolin', name: 'Рыбные рестораны у Granadella', type: 'Море', text: 'Обед с видом на бирюзовую бухту.' },
  ],
  photoIntro: 'Мысы с маяками и церковь-крепость — лучшие виды Хавеа.',
  photoSpots: [
    { key: 'jav-cabonao', name: 'Cabo de la Nao', text: 'Мыс с обрывами и панорамой Средиземного моря — знаковая смотровая.' },
    { key: 'jav-faro', name: 'Faro del Cabo de San Antonio', text: 'Маяк-смотровая над мариной и побережьем.' },
    { key: 'jav-church', name: 'Iglesia de San Bartolomé', text: 'Церковь-крепость XIV века в старом городе.' },
  ],
};

ROUTE_GUIDES['transfer-alicante-torrevieja'] = {
  beachesIntro: 'Торревьеха — городские пляжи и природный парк Ла-Мата.',
  beaches: [
    { key: 'tor-cura', name: 'Playa del Cura', dist: 'центр', text: 'Центральный городской пляж с золотым песком и набережной.' },
    { key: 'tor-locos', name: 'Playa de los Locos', dist: '1 км', text: 'Популярный пляж со скалистыми бухтами по краям.' },
    { key: 'tor-lamata', name: 'Playa de La Mata', dist: '3 км', text: 'Длинный пляж у природного парка Ла-Мата.' },
  ],
  foodIntro: 'Морепродукты, арросы и тапас у моря.',
  food: [
    { key: 'darsena', name: 'Морепродукты в порту', type: 'Море', text: 'Свежая рыба и дары моря у марины.' },
    { key: 'sento', name: 'Тапас и кафе', type: 'Тапас', text: 'Бары и террасы вдоль набережной.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Местные рисовые блюда.' },
  ],
  photoIntro: 'Розовое озеро с фламинго — фото-локация №1 Торревьехи.',
  photoSpots: [
    { key: 'tor-laguna', name: 'Розовое озеро (Laguna Rosa)', text: 'Солёное озеро с фламинго и розовой водой — самая известная фото-локация.' },
    { key: 'tor-paseo', name: 'Paseo Juan Aparicio', text: 'Набережная со скульптурами и видом на порт.' },
    { key: 'tor-puerto', name: 'Порт и Dique de Levante', text: 'Марина и прогулка по молу с видом на город.' },
  ],
};

ROUTE_GUIDES['villajoyosa'] = {
  beachesIntro: 'Вильяхойоса — песчаные пляжи у знаменитых разноцветных домов.',
  beaches: [
    { key: 'vil-centro', name: 'Playa Centro', dist: 'центр', text: 'Городской пляж прямо у разноцветных фасадов рыбацкого квартала.' },
    { key: 'vil-paradis', name: 'Playa del Paraíso', dist: '2 км', text: 'Широкий песчаный пляж с чистой водой.' },
  ],
  foodIntro: 'Морепродукты и знаменитый шоколад Valor (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Свежие морепродукты', type: 'Море', text: 'Дневной улов в рыбацком порту.' },
    { key: 'sento', name: 'Тапас в старом городе', type: 'Тапас', text: 'Бары среди разноцветных улочек.' },
    { key: 'nou-manolin', name: 'Арросы у моря', type: 'Рис', text: 'Рисовые блюда на набережной.' },
  ],
  photoIntro: 'Разноцветные дома у моря — визитная карточка Вильяхойосы.',
  photoSpots: [
    { key: 'vil-centro', name: 'Разноцветные дома', text: 'Знаменитые крашеные фасады рыбацкого квартала у самого моря — открытка города.' },
    { key: 'vil-iglesia', name: 'Iglesia-fortaleza de la Asunción', text: 'Церковь-крепость XVI века в историческом центре.' },
    { key: 'vil-puerto', name: 'Порт и марина', text: 'Рыбацкий порт с лодками и морскими видами.' },
  ],
};

ROUTE_GUIDES['el-campello'] = {
  beachesIntro: 'Эль-Кампельо — длинный песчаный Мучависта и уютные бухты.',
  beaches: [
    { key: 'muchavista', name: 'Playa Muchavista', dist: 'центр', text: 'Длинный песчаный пляж с многокилометровым променадом.' },
    { key: 'cam-carrermar', name: 'Playa del Carrer la Mar', dist: 'центр', text: 'Городской пляж у порта и набережной.' },
  ],
  foodIntro: 'Рыбацкий посёлок с лучшими морепродуктами (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Свежая рыба из порта', type: 'Море', text: 'Дневной улов прямо с аукциона.' },
    { key: 'sento', name: 'Тапас у моря', type: 'Тапас', text: 'Бары и террасы на набережной.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда местной кухни.' },
  ],
  photoIntro: 'Древняя башня и археологический памятник у моря.',
  photoSpots: [
    { key: 'cam-illeta', name: 'Illeta dels Banyets', text: 'Археологический памятник на мысу у моря — иберийское и римское наследие.' },
    { key: 'cam-torre', name: 'Torre de la Illeta', text: 'Сторожевая башня XVI века — символ Эль-Кампельо.' },
    { key: 'cam-puerto', name: 'Порт и марина', text: 'Живописный порт, особенно вечером.' },
  ],
};

ROUTE_GUIDES['albir'] = {
  beachesIntro: 'Альбир — белый галечный пляж у природного парка Серра-Гелада.',
  beaches: [
    { key: 'alb-playa', name: 'Playa del Albir', dist: 'центр', text: 'Белый галечный пляж с прозрачной водой и длинной набережной.' },
  ],
  foodIntro: 'Средиземноморская кухня и кафе вдоль набережной (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Рыба и морепродукты', type: 'Море', text: 'Свежие дары моря у пляжа.' },
    { key: 'sento', name: 'Тапас и кафе', type: 'Тапас', text: 'Бары и террасы на променаде.' },
    { key: 'portal', name: 'Международная кухня', type: 'Кафе', text: 'Разнообразие ресторанов на любой вкус.' },
  ],
  photoIntro: 'Маяк Альбир в конце живописной тропы — must-see локация.',
  photoSpots: [
    { key: 'alb-faro', name: 'Faro del Albir', text: 'Маяк в конце живописной тропы в парке Серра-Гелада — панорама залива.' },
    { key: 'alb-serra', name: 'Природный парк Серра-Гелада', text: 'Тропа вдоль обрывов с панорамами моря и Бенидорма.' },
    { key: 'alb-villa', name: 'Римская вилла Альбир', text: 'Археологический памятник с мозаиками римской эпохи.' },
  ],
};

ROUTE_GUIDES['moraira'] = {
  beachesIntro: 'Морайра — песчаный пляж у замка и защищённая бухта Портет.',
  beaches: [
    { key: 'mor-ampolla', name: "Playa de l'Ampolla", dist: 'центр', text: 'Главный песчаный пляж у крепости, с пологим входом.' },
    { key: 'mor-portet', name: 'Cala del Portet', dist: '1,5 км', text: 'Защищённая бухта с бирюзовой водой — снорклинг.' },
  ],
  foodIntro: 'Изысканные рестораны и морепродукты у марины (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты у марины', type: 'Море', text: 'Свежая рыба с видом на порт.' },
    { key: 'sento', name: 'Тапас в центре', type: 'Тапас', text: 'Бары и террасы у набережной.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда местной кухни.' },
  ],
  photoIntro: 'Замок на пляже и башня Кап-д’Ор — лучшие кадры Морайры.',
  photoSpots: [
    { key: 'mor-castillo', name: 'Castillo de Moraira', text: 'Крепость XVIII века прямо на пляже — символ города.' },
    { key: 'mor-capdor', name: "Torre del Cap d'Or", text: 'Сторожевая башня на мысу — трекинг с панорамными видами.' },
  ],
};

ROUTE_GUIDES['guardamar'] = {
  beachesIntro: 'Гуардамар — километры песка среди сосен и дюн.',
  beaches: [
    { key: 'gua-centro', name: 'Playa de Guardamar', dist: 'центр', text: 'Широкий песчаный пляж у соснового парка и дюн.' },
  ],
  foodIntro: 'Рыба из порта и рисовые блюда (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Свежая рыба', type: 'Море', text: 'Дневной улов из порта Гуардамара.' },
    { key: 'sento', name: 'Тапас у моря', type: 'Тапас', text: 'Бары и террасы в центре.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда местной кухни.' },
  ],
  photoIntro: 'Дюны, сосновый парк и средневековая рабита.',
  photoSpots: [
    { key: 'gua-dunas', name: 'Дюны и Рабита Калифаль', text: 'Сосновый парк с дюнами и средневековой мусульманской рабитой (X в.).' },
    { key: 'gua-castillo', name: 'Замок Гуардамар', text: 'Руины крепости на холме с панорамой побережья и устья реки Сегура.' },
  ],
};

ROUTE_GUIDES['santa-pola'] = {
  beachesIntro: 'Санта-Пола — мелкие семейные пляжи и виды на остров Табарка.',
  beaches: [
    { key: 'sap-granplaya', name: 'Playa de Levante (Gran Playa)', dist: 'центр', text: 'Широкий песчаный пляж с пологим входом — удобен для детей.' },
    { key: 'sap-tamarit', name: 'Playa del Tamarit', dist: '4 км', text: 'Пляж у соляных озёр с видом на остров Табарка.' },
  ],
  foodIntro: 'Рыбацкий порт с лучшими морепродуктами (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты из порта', type: 'Море', text: 'Свежий улов прямо с рыбного аукциона.' },
    { key: 'sento', name: 'Тапас у порта', type: 'Тапас', text: 'Бары и террасы у марины.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда с морепродуктами.' },
  ],
  photoIntro: 'Крепость в центре, маяк на мысу и солёные озёра с фламинго.',
  photoSpots: [
    { key: 'sap-castillo', name: 'Castillo-Fortaleza', text: 'Крепость XVI века в самом центре города.' },
    { key: 'sap-salinas', name: 'Салинас (природный парк)', text: 'Солёные озёра с фламинго — заповедник у города.' },
    { key: 'sap-faro', name: 'Маяк и смотровая Кабо-де-Санта-Пола', text: 'Маяк на мысу с панорамой моря и острова Табарка.' },
  ],
};

// ---- Batch 3: south coast, Mar Menor, inland ----

ROUTE_GUIDES['orihuela'] = {
  beachesIntro: 'Ориуэла Коста — золотые пляжи и бухты, а сам город — жемчужина барокко.',
  beaches: [
    { key: 'ori-zenia', name: 'Playa de La Zenia', dist: 'Ориуэла Коста', text: 'Популярный песчаный пляж рядом с торговым центром Zenia Boulevard.' },
    { key: 'ori-campoamor', name: 'Playa de Campoamor', dist: 'Ориуэла Коста', text: 'Широкий пляж с дюнами и сосновой рощей в Дехеса-де-Кампоамор.' },
  ],
  foodIntro: 'Средиземноморская кухня побережья и арросы (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты на побережье', type: 'Море', text: 'Свежая рыба у пляжей Ориуэла Коста.' },
    { key: 'sento', name: 'Тапас в центре', type: 'Тапас', text: 'Бары в историческом центре Ориуэлы.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда местной кухни.' },
  ],
  photoIntro: 'Готический собор, монастырь-университет и пальмовая роща.',
  photoSpots: [
    { key: 'ori-catedral', name: 'Catedral de Orihuela', text: 'Готический собор XIV века в самом сердце старого города.' },
    { key: 'ori-santodomingo', name: 'Colegio de Santo Domingo', text: 'Бывший монастырь-университет с ренессансными дворами.' },
    { key: 'ori-palmeral', name: 'Palmeral de Orihuela', text: 'Вторая по величине пальмовая роща Европы после Эльче.' },
  ],
};

ROUTE_GUIDES['cartagena'] = {
  beachesIntro: 'Картахена — города с 3000-летней историей и дикие пляжи Кальбланке рядом.',
  beaches: [
    { key: 'car-cortina', name: 'Cala Cortina', dist: 'у города', text: 'Уютная городская бухта с прозрачной водой в двух шагах от центра.' },
    { key: 'car-calblanque', name: 'Calblanque', dist: '20 км', text: 'Дикие пляжи и дюны в природном парке — одно из красивейших мест побережья.' },
  ],
  foodIntro: 'Морепродукты, caldero (рисовое блюдо Мар-Менора) и тапас (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты в порту', type: 'Море', text: 'Свежий улов у оживлённой набережной.' },
    { key: 'nou-manolin', name: 'Caldero и арросы', type: 'Рис', text: 'Знаменитое рисовое блюдо региона Мар-Менор.' },
    { key: 'sento', name: 'Тапас на Calle Mayor', type: 'Тапас', text: 'Бары и террасы на главной пешеходной улице.' },
  ],
  photoIntro: 'Римский театр, порт и модернистская архитектура — must-see Картахены.',
  photoSpots: [
    { key: 'car-teatro', name: 'Teatro Romano', text: 'Отреставрированный римский театр I века до н. э. — символ города.' },
    { key: 'car-puerto', name: 'Порт и набережная', text: 'Живописная гавань с военно-морской историей и подводным музеем ARQVA.' },
    { key: 'car-castillo', name: 'Castillo de la Concepción', text: 'Замок на холме с панорамой города и порта (подъём на лифте).' },
    { key: 'car-modernista', name: 'Модернистская архитектура', text: 'Роскошные фасады начала XX века — дворец Агирре и Calle Mayor.' },
  ],
};

ROUTE_GUIDES['san-pedro'] = {
  beachesIntro: 'Сан-Педро-дель-Пинатар — тёплое мелкое Мар-Менор и природный парк Салинас.',
  beaches: [
    { key: 'spp-villananitos', name: 'Playa de Villananitos', dist: 'центр', text: 'Мелкий тёплый пляж Мар-Менора с пологим входом — идеально для детей.' },
    { key: 'spp-puntica', name: 'Playa de la Puntica (Lo Pagán)', dist: 'центр', text: 'Городской пляж у канала с видом на лагуну.' },
  ],
  foodIntro: 'Рыба Мар-Менора и caldero (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Рыба Мар-Менора', type: 'Море', text: 'Свежий улов из лагуны и моря.' },
    { key: 'nou-manolin', name: 'Caldero и арросы', type: 'Рис', text: 'Традиционное рисовое блюдо на рыбном бульоне.' },
    { key: 'sento', name: 'Тапас в Lo Pagán', type: 'Тапас', text: 'Бары и террасы у порта.' },
  ],
  photoIntro: 'Соляные озёра с фламинго, лечебные грязи и старинные мельницы.',
  photoSpots: [
    { key: 'spp-salinas', name: 'Салинас и лечебные грязи', text: 'Природный парк с фламинго и знаменитыми грязевыми ваннами (baños de lodo).' },
    { key: 'spp-molino', name: 'Molino de Quintín', text: 'Старинная соляная мельница среди озёр — открыточный кадр.' },
  ],
};

ROUTE_GUIDES['finestrat'] = {
  beachesIntro: 'Финестрат — уютная бухта у моря и белая горная деревня.',
  beaches: [
    { key: 'fin-cala', name: 'Cala de Finestrat', dist: 'побережье', text: 'Небольшая уютная бухта с песком и галькой, рядом с Бенидормом.' },
  ],
  foodIntro: 'Средиземноморская кухня и тапас в горной деревне (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Рыба и морепродукты', type: 'Море', text: 'Свежие дары моря у бухты.' },
    { key: 'sento', name: 'Тапас в деревне', type: 'Тапас', text: 'Ресторанчики в старом горном селе.' },
    { key: 'portal', name: 'Кафе с видом на горы', type: 'Кафе', text: 'Террасы с панорамой Пуч-Кампана.' },
  ],
  photoIntro: 'Гора Пуч-Кампана и белая деревня на скале — эффектные кадры.',
  photoSpots: [
    { key: 'fin-puigcampana', name: 'Puig Campana', text: 'Вторая по высоте вершина провинции (1406 м) с легендарной «выемкой».' },
    { key: 'fin-plaza', name: 'Старое село и церковь', text: 'Белые домики на скале, церковь Сан-Бартоломе и смотровая площадь.' },
  ],
};

ROUTE_GUIDES['taksi-alikante-la-manga'] = {
  beachesIntro: 'Ла-Манга — узкая коса между тёплым Мар-Менором и Средиземным морем.',
  beaches: [
    { key: 'man-marmenor', name: 'Пляжи Мар-Менора', dist: 'коса', text: 'Тёплая мелкая лагуна с солёной водой — спокойно и безопасно для детей.' },
    { key: 'man-mediterraneo', name: 'Средиземноморская сторона', dist: 'коса', text: 'Открытое море с видом на остров Исла-Гроса.' },
  ],
  foodIntro: 'Морепродукты двух морей и арросы (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты', type: 'Море', text: 'Рыба и дары моря с обеих сторон косы.' },
    { key: 'nou-manolin', name: 'Caldero и арросы', type: 'Рис', text: 'Рисовые блюда региона Мар-Менор.' },
    { key: 'sento', name: 'Тапас у моря', type: 'Тапас', text: 'Бары и террасы вдоль косы.' },
  ],
  photoIntro: 'Маяк Кабо-де-Палос и дайвинг у островов Ормигас.',
  photoSpots: [
    { key: 'man-cabopalos', name: 'Faro de Cabo de Palos', text: 'Маяк на мысу с панорамой моря — рядом лучший дайвинг у Islas Hormigas.' },
  ],
};

ROUTE_GUIDES['los-alcazares'] = {
  beachesIntro: 'Лос-Алькасарес — спокойные тёплые пляжи Мар-Менора.',
  beaches: [
    { key: 'lal-playa', name: 'Playa del Espejo', dist: 'центр', text: 'Мелкий тёплый пляж лагуны с пологим входом и променадом.' },
  ],
  foodIntro: 'Рыба Мар-Менора и caldero (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Рыба Мар-Менора', type: 'Море', text: 'Свежий улов из лагуны.' },
    { key: 'nou-manolin', name: 'Caldero и арросы', type: 'Рис', text: 'Традиционное рисовое блюдо.' },
    { key: 'sento', name: 'Тапас на набережной', type: 'Тапас', text: 'Бары и террасы у моря.' },
  ],
  photoIntro: 'Историческая башня и курортная набережная.',
  photoSpots: [
    { key: 'lal-torre', name: 'Torre del Rame', text: 'Историческая башня — напоминание о прошлом городка-курорта с бальнеологией.' },
  ],
};

ROUTE_GUIDES['gandia'] = {
  beachesIntro: 'Гандия — один из лучших песчаных пляжей побережья Валенсии.',
  beaches: [
    { key: 'gan-playa', name: 'Playa de Gandía', dist: '4 км', text: 'Широкий песчаный пляж с длинным променадом и голубым флагом.' },
  ],
  foodIntro: 'Родина фидеуа и рисовых блюд (на фото — местная кухня).',
  food: [
    { key: 'nou-manolin', name: 'Фидеуа и арросы', type: 'Рис', text: 'Фидеуа родом из Гандии — паэлья на лапше вместо риса.' },
    { key: 'darsena', name: 'Морепродукты у пляжа', type: 'Море', text: 'Свежая рыба на набережной Playa Nord.' },
    { key: 'sento', name: 'Тапас в старом городе', type: 'Тапас', text: 'Бары в историческом центре.' },
  ],
  photoIntro: 'Дворец Борджиа и старый город — историческое сердце Гандии.',
  photoSpots: [
    { key: 'gan-palacio', name: 'Palacio Ducal de los Borja', text: 'Готико-ренессансный дворец семьи Борджиа — главная достопримечательность.' },
    { key: 'gan-colegiata', name: 'Colegiata de Santa María', text: 'Величественная готическая коллегиата в центре старого города.' },
  ],
};

ROUTE_GUIDES['alcoy'] = {
  foodIntro: 'Горная кухня, «бахо» и знаменитый кофе-ликёр (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Местная кухня', type: 'Кухня', text: 'Сытные горные блюда — пути с нутом, борреты.' },
    { key: 'sento', name: 'Тапас и кафе', type: 'Тапас', text: 'Бары в модернистском центре Алькоя.' },
    { key: 'portal', name: 'Кафе и кондитерские', type: 'Кафе', text: 'Знаменитые сладости и кофе-ликёр «Café-Licor».' },
  ],
  photoIntro: 'Модернистская архитектура, мосты и горы — Алькой без пляжей, но с характером.',
  photoSpots: [
    { key: 'alc-modernista', name: 'Модернистская архитектура', text: 'Círculo Industrial и роскошные фасады начала XX века.' },
    { key: 'alc-puente', name: 'Puente de San Jorge', text: 'Знаменитый мост в стиле ар-деко над оврагом — символ города.' },
    { key: 'alc-fontroja', name: 'Природа и горы', text: 'Природный парк Фонт-Роха и горное окружение Алькоя.' },
  ],
};

// ---- Batch 4: Orihuela Costa, San Juan, Gran Alacant, Murcia, Valencia ----

ROUTE_GUIDES['la-nucia'] = {
  foodIntro: 'Средиземноморская и горная кухня в спокойном городке у Бенидорма (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Средиземноморская кухня', type: 'Кухня', text: 'Рестораны с местными продуктами и арросами.' },
    { key: 'sento', name: 'Тапас в центре', type: 'Тапас', text: 'Уютные бары в тихом городке.' },
    { key: 'portal', name: 'Кафе и террасы', type: 'Кафе', text: 'Спокойный отдых вдали от суеты побережья.' },
  ],
  photoIntro: 'Спортивный город и природные уголки Ла-Нусии.',
  photoSpots: [
    { key: 'lan-captivador', name: 'Природная зона Каптивадор', text: 'Живописные тропы и виды в окрестностях городка.' },
    { key: 'lan-deportiva', name: 'Ciutat Esportiva Camilo Cano', text: 'Один из лучших спортивных комплексов Испании — тренировочная база команд.' },
  ],
};

ROUTE_GUIDES['la-zenia'] = {
  beachesIntro: 'Ла-Зения — золотые пляжи и бухты Ориуэла Коста рядом с крупным ТЦ.',
  beaches: [
    { key: 'ori-zenia', name: 'Playa de La Zenia', dist: 'центр', text: 'Популярный песчаный пляж с голубым флагом.' },
    { key: 'zen-cala', name: 'Cala Bosque (Cala Capitán)', dist: '1 км', text: 'Уютная бухта с прозрачной водой и небольшой мариной.' },
  ],
  foodIntro: 'Морепродукты и международная кухня побережья (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты у моря', type: 'Море', text: 'Свежая рыба у пляжей и марины.' },
    { key: 'sento', name: 'Тапас и кафе', type: 'Тапас', text: 'Бары на набережной и у бухт.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда местной кухни.' },
  ],
  photoIntro: 'Прибрежная тропа и крупнейший на побережье торговый центр.',
  photoSpots: [
    { key: 'zen-boulevard', name: 'Zenia Boulevard', text: 'Крупнейший торговый центр провинции Аликанте — шопинг и рестораны.' },
  ],
};

ROUTE_GUIDES['playa-flamenca'] = {
  beachesIntro: 'Пляя-Фламенка — песчаные пляжи и скалистые бухты Ориуэла Коста.',
  beaches: [
    { key: 'fla-playa', name: 'Playa Flamenca', dist: 'центр', text: 'Песчаные участки и скалистые бухты с прозрачной водой.' },
    { key: 'fla-cala', name: 'Cala Estaca / Cala Mosca', dist: '1 км', text: 'Небольшие уютные бухты вдоль прибрежной тропы.' },
  ],
  foodIntro: 'Морепродукты и знаменитый субботний рынок (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты у моря', type: 'Море', text: 'Свежая рыба у пляжей.' },
    { key: 'sento', name: 'Тапас на набережной', type: 'Тапас', text: 'Бары и террасы у моря.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда местной кухни.' },
  ],
};

ROUTE_GUIDES['punta-prima'] = {
  beachesIntro: 'Пунта-Прима — песчаный пляж и прибрежная тропа на юге Торревьехи.',
  beaches: [
    { key: 'pun-playa', name: 'Playa de Punta Prima', dist: 'центр', text: 'Песчаный пляж с пологим входом и прибрежным променадом.' },
  ],
  foodIntro: 'Морепродукты и арросы у моря (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты', type: 'Море', text: 'Свежая рыба у побережья.' },
    { key: 'sento', name: 'Тапас и кафе', type: 'Тапас', text: 'Бары на набережной.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда местной кухни.' },
  ],
  photoIntro: 'Историческая сторожевая башня на прибрежной тропе.',
  photoSpots: [
    { key: 'pun-torre', name: 'Torre del Moro', text: 'Старинная сторожевая башня на живописной прибрежной тропе к Торревьехе.' },
  ],
};

ROUTE_GUIDES['cabo-roig'] = {
  beachesIntro: 'Кабо-Ройг — скалистые обрывы, бухты и марина.',
  beaches: [
    { key: 'cab-playa', name: 'Playa de Cabo Roig', dist: 'центр', text: 'Песчаный пляж у скал и марины с прозрачной водой.' },
    { key: 'cab-cala', name: 'Cala Capitán', dist: '1 км', text: 'Живописная бухта на прибрежной тропе.' },
  ],
  foodIntro: 'Рестораны у марины со свежими морепродуктами (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты у марины', type: 'Море', text: 'Свежая рыба с видом на порт.' },
    { key: 'sento', name: 'Тапас и кафе', type: 'Тапас', text: 'Бары у пляжа и марины.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда местной кухни.' },
  ],
  photoIntro: 'Сторожевая башня на обрыве — символ Кабо-Ройг.',
  photoSpots: [
    { key: 'cab-torre', name: 'Torre de Cabo Roig', text: 'Историческая башня на скалистом мысу с панорамой побережья.' },
  ],
};

ROUTE_GUIDES['pilar-de-la-horadada'] = {
  beachesIntro: 'Пилар-де-ла-Орадада — самый южный курорт провинции с золотыми пляжами.',
  beaches: [
    { key: 'pil-higuericas', name: 'Playa de las Higuericas', dist: 'побережье', text: 'Широкий песчаный пляж с голубым флагом.' },
    { key: 'pil-milpalmeras', name: 'Playa de Mil Palmeras', dist: 'побережье', text: 'Семейный пляж с мелким песком и пологим входом.' },
  ],
  foodIntro: 'Морепродукты и арросы у моря (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты', type: 'Море', text: 'Свежая рыба из местного порта.' },
    { key: 'sento', name: 'Тапас и кафе', type: 'Тапас', text: 'Бары на набережной.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда местной кухни.' },
  ],
  photoIntro: 'Сторожевая башня Торре-де-ла-Орадада на берегу.',
  photoSpots: [
    { key: 'pil-torre', name: 'Torre de la Horadada', text: 'Историческая сторожевая башня XVI века у моря — символ городка.' },
  ],
};

ROUTE_GUIDES['san-juan-playa'] = {
  beachesIntro: 'Сан-Хуан — самый большой и популярный пляж Аликанте.',
  beaches: [
    { key: 'san-juan', name: 'Playa de San Juan', dist: 'центр', text: 'Три километра широкого золотого песка, набережная, бары и рестораны.' },
    { key: 'muchavista', name: 'Playa de Muchavista', dist: '2 км', text: 'Продолжение пляжной линии к северу, вдоль променада Эль-Кампельо.' },
  ],
  foodIntro: 'Пляжные рестораны и арросы у моря (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Паэлья и морепродукты', type: 'Рис', text: 'Рестораны прямо у пляжа — паэлья и свежая рыба.' },
    { key: 'sento', name: 'Тапас и чирингито', type: 'Тапас', text: 'Пляжные бары и террасы вдоль набережной.' },
    { key: 'nou-manolin', name: 'Свежие морепродукты', type: 'Море', text: 'Дневной улов местной кухни.' },
  ],
  photoIntro: 'Дикие бухты мыса Кабо-де-лас-Уэртас рядом.',
  photoSpots: [
    { key: 'cantalar', name: 'Cabo de las Huertas', text: 'Скалистые бухты с прозрачной водой между Сан-Хуаном и городом — снорклинг.' },
  ],
};

ROUTE_GUIDES['gran-alacant'] = {
  beachesIntro: 'Гран-Алакант — пляж Карабасси с песчаными дюнами.',
  beaches: [
    { key: 'carabassi', name: 'Playa del Carabassí', dist: 'центр', text: 'Широкий пляж с природными дюнами и сосновой зоной.' },
  ],
  foodIntro: 'Рыба и арросы рядом с Санта-Полой (на фото — местная кухня).',
  food: [
    { key: 'darsena', name: 'Морепродукты', type: 'Море', text: 'Свежая рыба из порта Санта-Полы поблизости.' },
    { key: 'sento', name: 'Тапас и кафе', type: 'Тапас', text: 'Бары и террасы городка.' },
    { key: 'nou-manolin', name: 'Арросы и паэлья', type: 'Рис', text: 'Рисовые блюда местной кухни.' },
  ],
  photoIntro: 'Охраняемые дюны Карабасси — уникальный природный ландшафт.',
  photoSpots: [
    { key: 'gra-dunas', name: 'Дюны Карабасси', text: 'Охраняемая природная зона с песчаными дюнами и соснами.' },
  ],
};

ROUTE_GUIDES['taxi-alicante-murcia'] = {
  foodIntro: 'Мурсия — «уэрта Европы»: овощи, зарангольо, маринера и рисовые блюда (на фото — местная кухня).',
  food: [
    { key: 'mercado', name: 'Рынок Verónicas', type: 'Рынок', text: 'Свежие овощи «уэрты», морепродукты и местные деликатесы.' },
    { key: 'sento', name: 'Тапас на Plaza de las Flores', type: 'Тапас', text: 'Знаменитая площадь с барами — маринера и монтадитос.' },
    { key: 'nou-manolin', name: 'Арросы и уэрта', type: 'Кухня', text: 'Овощные блюда и рисы Региона Мурсия.' },
  ],
  photoIntro: 'Барочный собор, казино и площади старого города.',
  photoSpots: [
    { key: 'mur-catedral', name: 'Catedral de Murcia', text: 'Собор с роскошным барочным фасадом и колокольней 90 м.' },
    { key: 'mur-belluga', name: 'Plaza Cardenal Belluga', text: 'Главная площадь перед собором с дворцом епископа.' },
    { key: 'mur-casino', name: 'Real Casino de Murcia', text: 'Роскошное здание XIX века с восточным патио и бальным залом.' },
    { key: 'mur-flores', name: 'Plaza de las Flores', text: 'Живописная площадь с цветами и тапас-барами в центре.' },
    { key: 'mur-segura', name: 'Puente Viejo и река Сегура', text: 'Старинный мост и набережная Малекон.' },
  ],
};

ROUTE_GUIDES['taxi-alicante-valencia'] = {
  beachesIntro: 'Валенсия — большой город с широким городским пляжем Мальварроса.',
  beaches: [
    { key: 'val-malvarrosa', name: 'Playa de la Malvarrosa', dist: 'город', text: 'Широкий городской пляж с длинным променадом и ресторанами паэльи.' },
  ],
  foodIntro: 'Валенсия — родина паэльи и орчаты (на фото — местная кухня).',
  food: [
    { key: 'nou-manolin', name: 'Паэлья валенсиана', type: 'Рис', text: 'Настоящая паэлья родом отсюда — с курицей, кроликом и фасолью.' },
    { key: 'darsena', name: 'Морепродукты у моря', type: 'Море', text: 'Рестораны паэльи и рыбы на набережной Мальварросы.' },
    { key: 'sento', name: 'Тапас и орчата', type: 'Тапас', text: 'Бары старого города и знаменитая орчата с фартонами.' },
  ],
  photoIntro: 'Город искусств, собор, Шёлковая биржа и сады Турия.',
  photoSpots: [
    { key: 'val-ciudad', name: 'Ciudad de las Artes y las Ciencias', text: 'Футуристический комплекс Сантьяго Калатравы — визитная карточка Валенсии.' },
    { key: 'val-catedral', name: 'Кафедральный собор и Мигелете', text: 'Собор с башней Эль-Мигелете и Святым Граалем внутри.' },
    { key: 'val-lonja', name: 'Lonja de la Seda', text: 'Готическая Шёлковая биржа — объект Всемирного наследия ЮНЕСКО.' },
    { key: 'val-virgen', name: 'Plaza de la Virgen', text: 'Историческая площадь с фонтаном Турия и базиликой.' },
    { key: 'val-turia', name: 'Сады Турия', text: 'Бывшее русло реки — 9 км зелёного парка через весь город.' },
    { key: 'val-mercado', name: 'Mercado Central', text: 'Модернистский рынок — один из крупнейших в Европе.' },
  ],
};

// Attach resolved image paths to every guide item.
for (const g of Object.values(ROUTE_GUIDES)) {
  for (const list of [g.beaches, g.food, g.photoSpots]) {
    if (!list) continue;
    for (const item of list) item.img = img(item.key);
  }
}

export const getRouteGuide = (slug) => ROUTE_GUIDES[slug] || null;
