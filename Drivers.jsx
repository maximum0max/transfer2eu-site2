import React from 'react'
import PageHero from './PageHero.jsx'
import CTABanner from './CTABanner.jsx'

const REQUIREMENTS = [
  { icon: '🕐', title: 'Пунктуальность',     text: 'Подача за 10 минут до согласованного времени. Опоздание — недопустимо.' },
  { icon: '👔', title: 'Опрятный вид',       text: 'Чистая одежда, аккуратный внешний вид. Без домашнего стиля.' },
  { icon: '🚗', title: 'Чистый автомобиль',  text: 'Салон без посторонних запахов. ТО и страховка действительны.' },
  { icon: '🚭', title: 'Без курения',        text: 'В салоне и за 30 мин до подачи. Парфюм — нейтральный.' },
  { icon: '👶', title: 'Кресло для ребёнка', text: 'Возможность установить детское кресло — обязательна.' },
];

const BENEFITS = [
  { icon: '📈', title: 'Стабильный поток заказов', text: 'Бронирования из аэропорта Аликанте 24/7 — пиковая нагрузка летом.' },
  { icon: '💸', title: 'Прозрачные выплаты',       text: 'Расчёт еженедельно, без удержаний за «комиссию платформы».' },
  { icon: '🤝', title: 'Поддержка диспетчера',     text: 'Свяжемся при задержке рейса или изменении заказа.' },
];

function DriversPage({ onNav }) {
  const [submitted, setSubmitted] = React.useState(false);
  const onSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  const sectionWhite = { background: '#fff' };
  const sectionTinted = { background: 'var(--t2-bg-2)' };
  const inner = { maxWidth: 1100, margin: '0 auto', padding: '64px 24px' };

  const formWrap = { background: 'var(--t2-bg-2)', border: '1px solid var(--t2-line)', borderRadius: 18, padding: '32px', boxShadow: 'var(--t2-sh-1)' };
  const formTitle = { fontFamily: "'Onest',sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--t2-ink)', margin: '0 0 8px', letterSpacing: '-.01em' };
  const formSub = { fontSize: 14, color: 'var(--t2-ink-3)', margin: '0 0 24px' };
  const fieldRow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 };
  const field = { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 };
  const fieldLabel = { fontSize: 12, fontWeight: 600, color: 'var(--t2-ink-3)', letterSpacing: '.04em', textTransform: 'uppercase' };
  const fieldInput = { fontFamily: "'Inter',system-ui", fontSize: 15, padding: '11px 14px', borderRadius: 10, border: '1px solid var(--t2-line)', background: '#fff', color: 'var(--t2-ink)', outline: 'none' };
  const submitBtn = { background: 'var(--t2-red)', color: '#fff', fontFamily: "'Inter',system-ui", fontWeight: 700, fontSize: 15, padding: '13px 30px', borderRadius: 12, border: 0, cursor: 'pointer', marginTop: 8 };

  const grid3 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 };
  const blockH2 = { fontFamily: "'Onest',sans-serif", fontSize: 30, fontWeight: 800, color: 'var(--t2-ink)', textAlign: 'center', letterSpacing: '-.02em', margin: '0 0 12px' };
  const blockSub = { fontSize: 15, color: 'var(--t2-ink-3)', textAlign: 'center', maxWidth: 600, margin: '0 auto 32px' };
  const card = { background: '#fff', border: '1px solid var(--t2-line)', borderRadius: 16, padding: '22px 24px' };
  const cardIcon = { fontSize: 30, marginBottom: 12 };
  const cardTitle = { fontFamily: "'Onest',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--t2-ink)', margin: '0 0 8px' };
  const cardText = { fontSize: 13, lineHeight: 1.55, color: 'var(--t2-ink-3)', margin: 0 };

  return (
    <>
      <PageHero
        eyebrow="👨‍✈️ Для водителей"
        title="Присоединяйтесь к команде"
        subtitle="Заполните анкету ниже — диспетчер свяжется в течение дня. Работа с заказами из аэропорта Аликанте круглый год." />

      <div style={sectionWhite}>
        <div style={inner}>
          <form style={formWrap} onSubmit={onSubmit}>
            <div style={formTitle}>Анкета водителя</div>
            <div style={formSub}>Минимум 30 секунд — заполняйте только обязательные поля.</div>
            {!submitted ? (
              <>
                <div style={fieldRow}>
                  <div style={field}><label style={fieldLabel}>Имя</label>          <input style={fieldInput} type="text" required /></div>
                  <div style={field}><label style={fieldLabel}>Телефон</label>      <input style={fieldInput} type="tel" required placeholder="+34 ..." /></div>
                  <div style={field}><label style={fieldLabel}>E-mail</label>       <input style={fieldInput} type="email" required /></div>
                  <div style={field}><label style={fieldLabel}>Марка авто</label>   <input style={fieldInput} type="text" required placeholder="Mercedes V-class" /></div>
                  <div style={field}><label style={fieldLabel}>Год выпуска</label>  <input style={fieldInput} type="number" required min="2010" placeholder="2018" /></div>
                  <div style={field}><label style={fieldLabel}>Регион проживания</label><input style={fieldInput} type="text" required placeholder="Аликанте, Бенидорм…" /></div>
                </div>
                <button type="submit" style={submitBtn}>Отправить анкету</button>
              </>
            ) : (
              <div style={{ padding: '24px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                <div style={formTitle}>Анкета отправлена</div>
                <div style={formSub}>Диспетчер свяжется в течение дня. Спасибо!</div>
              </div>
            )}
          </form>
        </div>
      </div>

      <div style={sectionTinted}>
        <div style={inner}>
          <h2 style={blockH2}>Что мы ждём от водителя</h2>
          <div style={grid3}>
            {REQUIREMENTS.map((r, i) => (
              <div key={i} style={card}>
                <div style={cardIcon}>{r.icon}</div>
                <h3 style={cardTitle}>{r.title}</h3>
                <p style={cardText}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={sectionWhite}>
        <div style={inner}>
          <h2 style={blockH2}>Что получаете взамен</h2>
          <p style={blockSub}>Сотрудничаем с водителями, которые ценят прозрачность, дисциплину и заботу о пассажирах.</p>
          <div style={grid3}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ ...card, background: 'var(--t2-bg-2)' }}>
                <div style={cardIcon}>{b.icon}</div>
                <h3 style={cardTitle}>{b.title}</h3>
                <p style={cardText}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CTABanner onNav={onNav} />
    </>
  );
}

export default DriversPage;
