/* global React, Icon, Sidebar, Breadcrumb, PageShell */
// Home page. All text is copied verbatim from transfer2eu.com — no paraphrasing,
// no invented copy. The four-keyword "tabs" widgets are reproduced as they
// appear on the source page.

function QuickLinksPanel({ onNav }) {
  const panel = {
    background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)',
    borderRadius: 16, padding: '24px 28px', margin: '24px 0',
  };
  const heading = { fontFamily: "'Onest',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--t2-ink)', margin: '0 0 12px' };
  const list = { listStyle: 'none', margin: 0, padding: 0 };
  const item = { fontFamily: "'Inter',system-ui", fontSize: 16, color: 'var(--t2-red)', padding: '4px 0', cursor: 'pointer', textDecoration: 'none', display: 'block' };
  return (
    <div style={panel}>
      <div style={heading}>Страницы с полезной информацией:</div>
      <ul style={list}>
        <li><a style={item} onClick={() => onNav && onNav('routes')}>🚖 популярные маршруты</a></li>
        <li><a style={item} onClick={() => onNav && onNav('price')}>💲 наши актуальные цены</a></li>
        <li><a style={item} onClick={() => onNav && onNav('contacts')}>📲 наши контакты</a></li>
      </ul>
    </div>
  );
}

function CalloutCards({ onNav }) {
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '20px 0' };
  const card = {
    background: 'var(--t2-bg)', border: '1px solid var(--t2-line)', borderRadius: 16,
    padding: '20px 24px', boxShadow: 'var(--t2-sh-1)', cursor: 'pointer',
    transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
  };
  const lift = e => { e.currentTarget.style.boxShadow = 'var(--t2-sh-3)'; e.currentTarget.style.transform = 'translateY(-2px)'; };
  const drop = e => { e.currentTarget.style.boxShadow = 'var(--t2-sh-1)'; e.currentTarget.style.transform = 'translateY(0)'; };
  const link = { fontFamily: "'Onest',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--t2-red)', margin: '0 0 6px' };
  const desc = { fontFamily: "'Inter',system-ui", fontSize: 14, lineHeight: 1.55, color: 'var(--t2-ink-2)', margin: 0 };
  return (
    <div style={grid}>
      <a style={card} onClick={() => onNav && onNav('routes')} onMouseEnter={lift} onMouseLeave={drop}>
        <div style={link}>Маршруты 👈</div>
        <p style={desc}>здесь мы разместили популярные направления на Испанском побережье <b>Costa Blanca</b></p>
      </a>
      <a style={card} onClick={() => onNav && onNav('price')} onMouseEnter={lift} onMouseLeave={drop}>
        <div style={link}>Наши цены 👈</div>
        <p style={desc}>здесь расписаны цены на популярные маршруты из Аликанте.</p>
      </a>
    </div>
  );
}

function TagPagerWidget({ tabs }) {
  const wrap = { borderTop: '1px solid var(--t2-line)', padding: '16px 0 0', margin: '20px 0 8px' };
  const row = { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 };
  const tab = { fontFamily: "'Inter',system-ui", fontSize: 12, fontWeight: 500, color: 'var(--t2-ink-2)', background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)', borderRadius: 999, padding: '4px 10px' };
  const pager = { display: 'flex', gap: 6, alignItems: 'center', fontFamily: "'Inter',system-ui", fontSize: 12, color: 'var(--t2-ink-3)', fontVariantNumeric: 'tabular-nums' };
  const dot = { width: 22, height: 22, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--t2-line)', background: 'var(--t2-bg)', color: 'var(--t2-ink-2)' };
  return (
    <div style={wrap}>
      <div style={row}>{tabs.map((t, i) => <span key={i} style={tab}>{t}</span>)}</div>
      <div style={pager}>
        {tabs.map((_, i) => <span key={i} style={{ ...dot, ...(i === 0 ? { background: 'var(--t2-red)', color: '#fff', borderColor: 'var(--t2-red)' } : null) }}>{i + 1}</span>)}
        <span style={{ marginLeft: 12 }}>Previous</span>
        <span>Next</span>
      </div>
    </div>
  );
}

function WhatsAppCTA() {
  const box = {
    background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)', borderRadius: 16,
    padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
    margin: '20px 0',
  };
  const btn = {
    background: '#25d366', color: '#fff', fontFamily: "'Inter',system-ui", fontWeight: 600, fontSize: 15,
    padding: '12px 20px', borderRadius: 999, textDecoration: 'none',
    display: 'inline-flex', alignItems: 'center', gap: 8,
  };
  const text = { fontFamily: "'Inter',system-ui", fontSize: 14, color: 'var(--t2-ink-2)', margin: 0, flex: 1, minWidth: 200 };
  const phone = { display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Inter',system-ui", fontSize: 15, fontWeight: 600, color: 'var(--t2-ink)', textDecoration: 'none', fontVariantNumeric: 'tabular-nums' };
  return (
    <div style={box}>
      <a href="tel:+34651011911" style={phone}>Позвоните нам: +34-651-011-911</a>
      <a href="https://wa.me/34651011911?text=Здравствуйте,%20мне%20нужен%20трансфер%20с%20" target="_blank" rel="noopener noreferrer" style={btn}>
        📲 Напишите нам на whatsApp
      </a>
      <p style={text}>Мы стараемся отвечать на WhatsApp в течении 3-5 минут с 8:00 до 23:00.</p>
    </div>
  );
}

function Home({ onNav, onOpenPost }) {
  const h1 = { fontFamily: "'Onest',sans-serif", fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--t2-ink)', margin: '0 0 12px' };
  const intro = { fontFamily: "'Inter',system-ui", fontSize: 16, lineHeight: 1.55, color: 'var(--t2-ink-2)', margin: '0 0 16px' };
  const p = { fontFamily: "'Inter',system-ui", fontSize: 16, lineHeight: 1.65, color: 'var(--t2-ink-2)', margin: '0 0 16px' };
  const h2 = { fontFamily: "'Onest',sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--t2-ink)', margin: '40px 0 16px' };
  const beachItem = { ...p, margin: '0 0 12px' };

  return (
    <PageShell sidebar={<Sidebar onOpenPost={onOpenPost} />}>
      <Breadcrumb onNav={onNav} trail={[{ label: 'Главная', view: 'home' }]} />
      <h1 style={h1}>Такси Аликанте</h1>

      <p style={intro}>
        🚖 <b>Для заказа</b> <b>трансфера в Аликанте заполните заявку</b> 📋. <b>А лучше сразу напишите нам на whatsApp!</b>
      </p>

      <WhatsAppCTA />

      <QuickLinksPanel onNav={onNav} />

      <p style={p}>
        <a onClick={() => onNav('routes')} style={{ color: 'var(--t2-red)', cursor: 'pointer', fontWeight: 700 }}>Маршруты</a> 👈 здесь мы разместили популярные направления на Испанском побережье <b>Costa Blanca</b>
      </p>
      <p style={p}>
        <a onClick={() => onNav('price')} style={{ color: 'var(--t2-red)', cursor: 'pointer', fontWeight: 700 }}>Наши цены</a> 👈 здесь расписаны цены на популярные маршруты из Аликанте.
      </p>

      <CalloutCards onNav={onNav} />

      <p style={p}>
        В центральной части средиземноморья, на побережье Испании расположился прекрасный город-курорт Аликанте. Воздух здесь в городе так и манит морскими запахами! Когда-то город был очень популярным и важным морским узлом на Испанском побережье и оставался таким на протяжении нескольких столетий.
      </p>

      <h2 style={h2}>✅ Как заказать такси Аликанте аэропорт</h2>
      <p style={p}>
        Основными воздушными воротами в Аликанте является аэропорт Эльче. Именно сюда сразу попадают все прибывшие гости города. Такси в аэропорту Аликанте очень много. Здесь есть и белые авто с эмблемами разных компаний такси и чёрные автомобили — в основном индивидуальные перевозчики. Стоимость такси в Аликанте из аэропорта равна примерно 20-25 евро, в зависимости в какую точку города Вам надо доехать. Относительно дешево, как для европейского курорта. Заказать такси в Аликанте можно ещё до прибытия! Достаточно просто оставить <a onClick={() => onNav('routes')} style={{ color: 'var(--t2-red)', cursor: 'pointer' }}>онлайн заявку</a> на нашем сайте и наш опытный водитель будет ожидать Вас прямо при выходе из зоны получения багажа.
      </p>
      <p style={p}>
        После приезда в город и поселения, нет ничего лучше, как пешая прогулка по уникальной и красивейшей «Эспланаде», вдоль морской припортовой набережной. Она выложена в четыре ряда, шлифованным мрамором красного, черного и кремового цветов, имитирующего волны на Средиземном море.
      </p>
      <p style={p}>
        Многие важные персоны говорили прекрасные слова об Аликанте. Писатель Хуан Гила-Альберт: «Аликанте непрерывно смотрит на Средиземное море». Поэт Габриэль Миро также писал: «Мой город полностью пронизан Средиземным морем».
      </p>
      <p style={p}>
        В городе Аликанте находится огромный и многокорпусный университет. Сюда приезжают учиться студенты с разных уголков земного шара. Город славиться также различными техническими колледжами. Круглый год здесь проводятся огромное количество курсов испанского языка для туристов и гостей города.
      </p>
      <p style={p}>
        Мерия города Аликанте предлагает и организовует много интересных культурных развлекательных мероприятий. Такие заведения как «Casa de la cultura» или (культурный центр), он имеет большую библиотеку с историческим архивом. Она рассказывает местным жителям и посетителям города о всех массовых культурных событиях, экспозициях, конференциях и фильмах. «The Teatro Principal» или (Главный Театр) относительно новое неоклассическое здание девятнадцатого века, в театре круглый год проводится много спектаклей и выступают разные артисты. «Lonja del Pescado» или Выставочный центр и расположен он там где, раньше был центральный рыбный рынок. Здесь постоянно проводятся художественные выставки и много интересных культурных массовых мероприятий в течении года. В сентябре каждый год здесь собрание «Аликанте а Escena» или Национального театра. Здесь также периодически проходит европейский Международный фестиваль художественной музыки. Зимой, в декабре в городе проходит удивительный красочный фестиваль больших рукодельных кукол.
      </p>
      <p style={p}>
        Для всех желающих любителей абстрактного и современного искусства рекомендуется посетить выставку «Eusebio Sempere» в старом здании «Casa de la Asegurada», где можно найти лучшие произведения искуства. Её подарил городу Аликанте местный скульптор и художник.
      </p>
      <p style={p}>
        Любители и почитатели современной и народной музыки вечерами могут посещать концерты, которые проводятся на эспланаде («Paseo de la Explanada») во второй половине дня. Летом такие прекрасные концерты проводятся по воскресным утрам.
      </p>
      <TagPagerWidget tabs={[
        'такси в аэропорту аликанте',
        'такси аликанте онлайн',
        'такси в аликанте',
        'стоимость такси в аликанте',
      ]} />

      <h2 style={h2}>✅ 🔅Пляжи города</h2>
      <p style={p}>
        Мягкий средиземноморский климат сделал город Аликанте идеальным местом для пляжной жизни почти целый год, и здесь есть много прекрасных пляжей на любой вкус и цвет:
      </p>
      <p style={beachItem}>
        📍 🔅<b>«La Playa de San Juan»</b> — это длинный пляж, растянутый на 7 километров, вдоль моря с прекрасным золотым песком. Вдоль пляжа проходит дорога для автомобилей и проезжает трамвайчик, позволяющий вам остановиться где угодно, сюда Вас доставит очень быстро русское такси Аликанте;
      </p>
      <p style={beachItem}>
        📍 🔅<b>«La Albufereta»,</b> уютный, тихий, песчаный участок, закрытый мысом <b>«Serra-Grosa»</b>, для поездки на который можно также заказать русское такси в Аликанте и доехать практически за 10-15 минут с любой точки города.
      </p>
      <p style={beachItem}>
        📍 🔅<b>«El-Postiget»</b> центральный городской пляж. Находится почти в самом центре города. Над «Постигетом» высочит гора «Бенакантиль», рядом с пляжем расположен порт <b>«Лос-Саладарес»</b>.
      </p>
      <p style={beachItem}>
        📍 🔅Песчаные пляжи в Аликанте не заканчиваются; но если вам нравиться каменный берег с кристальной и чистенькой водичкой то Вам надо брать такси в Аликанте и за каких то 5 евро вы доедете в <b>«Cabo de las Huertas»</b> , где найдете бухты: <b>«Los Cantarales», «El Saladara», «Los Judios и Palmera».</b>
      </p>
      <TagPagerWidget tabs={[
        'трансфер аликанте аэропорт',
        'трансфер аликанте.рф',
        'трансфер в аликанте',
        'трансфер в аэропорт аликанте',
      ]} />

      <h2 style={h2}>✅ 🏊‍♂️Спорт</h2>
      <p style={p}>
        Панорамный Аликантийский вид на город и море открывается с горы в центре города «Castillo de Santa Barbara», она возвышается на высоту в 170 метров над уровнем моря и пляжем. «Castillo de Santa Barbara» стоит на верхушке горы. Наверх можно забраться по дороге серпантином или подняться лифтом с пляжа «El-Postiget». Аликанте славиться широким спектром видов спорта. Здесь много футбольных полей, волейбольных, площадок для игры в баскетбол или теннис. Есть здесь места для 🎯 стрельбы с лука, несколько школы верховой езды, 🏊‍♂️ очень много бассейнов и различных спортивных залов. Если же вы увлекаетесь 🧗‍♀️ альпинизмом, то вам обязательно на гору Маигмо (1296 м) это вызов, который вам понравится. Следуя по дороге к Касталье, вы можете подняться по тропе, которая приведет вас почти к вершине. Тем не менее, энергичные могут подняться пешком и приятно отдохнуть на Балкон-де-Аликанте, откуда открывается великолепная панорама на вершину Касталья и равнину, на фоне голубого Средиземного моря.
      </p>
      <p style={p}>В часе езды от города есть несколько полей для игры в гольф 🏌️‍♀️.</p>
      <p style={p}>Недалеко, в городе Мучамэль находится местный аэропорт для частных спортивных сверхлегких самолетов.</p>
      <TagPagerWidget tabs={[
        'трансфер из аликанте',
        'трансфер испания аликанте',
        'такси аликанте торревьеха',
      ]} />

      <h2 style={h2}>✅ Экскурсии</h2>
      <p style={beachItem}>
        📌 Если есть желание поплавать то Вам на остров Табарка. Плыть туда примерно 20 минут на лодке. На острове живут 70 человек. Прогулка займет несколько часов и вернуться можно только в 16:30 тем же корабликом.
      </p>
      <p style={beachItem}>
        📌 Хихона находится всего в 26 километрах от города Аликанте. Там находится место рождения Туррона, липкого миндаля, очень популярного в Испании и подаваемого на Рождественские праздники.
      </p>
      <p style={beachItem}>
        📌 Рядом находятся пещеры Canelobre, а недалеко от города Аликанте, в Эльче, вы можете увидеть самый старый в Европе пальмовый лес.
      </p>
      <p style={beachItem}>
        📌 Во время поездки в Эльче вы можете прогуляться по субтропической среде среди 200 300 летних пальм. Их завезли сюда специально для выращивания ещё 300 лет назад.
      </p>

      <QuickLinksPanel onNav={onNav} />
    </PageShell>
  );
}

window.Home = Home;
