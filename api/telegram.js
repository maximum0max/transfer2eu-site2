// Telegram webhook for the Transfer2EU price bot (@Apartikibot).
//
// Flow (in Russian): /start → greeting + inline keyboard of popular routes and a
// prompt to type any city → on a button or a typed city, replies with the fixed
// price from the site's own data (api/routes.json, regenerated on every build by
// scripts/prerender.mjs) + a "book in WhatsApp" button. Each price request also
// pings the owner (TELEGRAM_CHAT_ID) as a lead.
//
// Register the webhook once by opening /api/telegram-setup after deploy.

import ROUTES from './routes.data.js';
import { createHash } from 'node:crypto';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER = process.env.TELEGRAM_CHAT_ID;
const SITE = 'https://www.transfer2eu.com';

const webhookSecret = () => (TOKEN ? createHash('sha256').update(TOKEN).digest('hex').slice(0, 40) : '');

async function tg(method, body) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json().catch(() => ({}));
}

const POPULAR = ['Benidorm', 'Torrevieja', 'Calpe', 'Alicante', 'Denia', 'Valencia', 'Murcia', 'Cartagena'];

// Pricing rule: 1€ per km rounded UP to the nearest 5, minimum 30€ (short trips
// up to ~15 km). The site prices already follow 1€/km-rounded-to-5, so they are
// the reference — we just enforce the 30€ floor and keep everything on a 5€ step.
const quote = (p) => Math.max(30, Math.ceil((Number(p) || 0) / 5) * 5);

function popularKeyboard() {
  const btns = POPULAR
    .map((c) => ROUTES.find((r) => r.city === c))
    .filter(Boolean)
    .map((r) => ({ text: `${r.ru} — ${quote(r.price)}€`, callback_data: `r:${r.slug}` }));
  const rows = [];
  for (let i = 0; i < btns.length; i += 2) rows.push(btns.slice(i, i + 2));
  rows.push([{ text: '📋 Все направления и цены', url: `${SITE}/price` }]);
  return { inline_keyboard: rows };
}

const norm = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9]/g, '');

function matchRoute(text) {
  const q = norm(text);
  if (!q || q.length < 2) return null;
  return (
    ROUTES.find((r) => norm(r.ru) === q || norm(r.city) === q) ||
    ROUTES.find((r) => norm(r.ru).startsWith(q) || norm(r.city).startsWith(q)) ||
    (q.length >= 3 ? ROUTES.find((r) => norm(r.ru).includes(q) || norm(r.city).includes(q)) : null) ||
    // city name embedded in a longer message (e.g. "Бенидорм 12.08 14:30")
    ROUTES.find((r) => norm(r.ru).length >= 4 && q.includes(norm(r.ru))) ||
    ROUTES.find((r) => norm(r.city).length >= 4 && q.includes(norm(r.city))) ||
    null
  );
}

const GREETING =
  'Здравствуйте! 👋 Я бот Transfer2EU.\n\n' +
  'Подскажу цену на трансфер из аэропорта Аликанте (ALC). ' +
  'Куда планируете поездку? Выберите направление ниже или напишите название города 👇';

const THANKS =
  'Спасибо за информацию! 🙌\n' +
  'Мы уже занимаемся поиском свободного водителя.\n\n' +
  'Водитель будет назначен и напишет вам за день до поездки!\n\n' +
  'Ожидайте сообщение от водителя!\n\n' +
  'Спасибо за вашу заявочку!';

const whoOf = (msg) =>
  [msg.from && msg.from.first_name, msg.from && msg.from.username && '@' + msg.from.username]
    .filter(Boolean).join(' ') || 'гость';

function priceText(r) {
  return (
    `🚕 Аликанте (ALC) → *${r.ru}*\n` +
    `💶 Фиксированная цена: *${quote(r.price)}€* за автомобиль (седан, до 4 пассажиров)\n` +
    `🕐 ~${r.time} мин в пути\n\n` +
    '✅ Включено: платные дороги, детское кресло, работаем 24/7.\n' +
    '👨‍✈️ Русскоязычный водитель.\n\n' +
    'Чтобы забронировать — напишите:\n' +
    '✅ *Дату*\n' +
    '✅ *Время*\n' +
    '✅ *Номер рейса*\n' +
    '✅ *Телефон* (WhatsApp / Telegram)\n' +
    'либо нажмите кнопку ниже 👇'
  );
}

function orderKeyboard(r) {
  const wa = `https://wa.me/34651011911?text=${encodeURIComponent(`Здравствуйте! Хочу заказать трансфер Аликанте → ${r.ru} (${quote(r.price)}€).`)}`;
  return {
    inline_keyboard: [
      [{ text: '📝 Забронировать в Telegram', callback_data: `book:${r.slug}` }],
      [{ text: '💬 Забронировать в WhatsApp', url: wa }],
      [{ text: '🌐 Страница маршрута', url: `${SITE}/${r.slug}` }],
      [{ text: '🔁 Другой маршрут', callback_data: 'menu' }],
    ],
  };
}

// force_reply prompt after "Забронировать". The route ru sits after "→" so we
// can recover it from reply_to_message.text (no external state store needed).
function bookingPrompt(r) {
  return (
    `🧾 Бронирование: Аликанте (ALC) → ${r.ru} (${quote(r.price)}€)\n\n` +
    'Ответьте на это сообщение и укажите одной строкой:\n' +
    '✅ *Дату*\n✅ *Время*\n✅ *Номер рейса*\n✅ *Телефон* (WhatsApp / Telegram)\n✅ *Пассажиров*\n✅ *Багаж*\n\n' +
    'Например: 12.08.2026, 14:30, FR2643, +34 600 000 000, 2, 2'
  );
}

// Recover the route from a booking-prompt text (the part after "→").
function routeFromPrompt(promptText) {
  const after = String(promptText || '').split('→')[1] || '';
  return ROUTES.find((r) => after.includes(r.ru)) || null;
}

// Extract booking fields by content (not by position), so free-form messages
// like "26.08 в 16:05 рейс FR257, +34654027901, 3 пассажира, 4 чемодана" parse
// correctly regardless of order or extra words.
function parseBooking(raw) {
  let t = ' ' + String(raw || '').replace(/\s+/g, ' ') + ' ';
  const cut = (s) => { if (s) t = t.replace(s, ' '); };

  // Phone: a run with 9+ digits; peel trailing space-separated 1–2 digit groups
  // (those belong to passengers/luggage, not the number).
  let phone = '';
  const pm = t.match(/\+?\d[\d\s()\-]{7,}\d/);
  if (pm) {
    let ph = pm[0].trim();
    let m2;
    while ((m2 = ph.match(/^(.*\d)\s+\d{1,2}$/)) && m2[1].replace(/\D/g, '').length >= 9) ph = m2[1].trim();
    if (ph.replace(/\D/g, '').length >= 9) { phone = ph.replace(/\s{2,}/g, ' '); cut(ph); }
  }

  // Flight: "рейс <code>" or a standalone code (FR257, VY1234, W6 2345, U2 1234).
  let flight = '';
  let fm = t.match(/рейс[а-яё]*\s*[:№-]?\s*([A-Za-z]{1,3}\d?\s?\d{1,4}[A-Za-z]?)/i);
  if (!fm) fm = t.match(/\b([A-Za-z]{2}\s?\d{2,4}[A-Za-z]?)\b/);
  if (fm) { flight = fm[1].toUpperCase().replace(/\s+/g, ''); cut(fm[0]); }
  else cut((t.match(/рейс[а-яё]*/i) || [])[0]);

  // Date: dd.mm(.yyyy) / dd/mm / dd-mm.
  let date = '';
  const dm = t.match(/\b(\d{1,2}[.\/-]\d{1,2}(?:[.\/-]\d{2,4})?)\b/);
  if (dm) { date = dm[1]; cut(dm[0]); }

  // Time: HH:MM / HH.MM, or "в HH".
  let time = '';
  let tm = t.match(/\b(\d{1,2}[:.]\d{2})\b/);
  if (!tm) tm = t.match(/\bв\s*(\d{1,2})\b/i);
  if (tm) { time = tm[1].replace('.', ':'); cut(tm[0]); }

  // Passengers / luggage by keyword.
  let pax = '';
  const paxm = t.match(/(\d{1,2})\s*(?:пассажир|пасс|человек|чел|взросл|гост|pax)/i)
    || t.match(/(?:пассажир|пасс|человек|чел|pax)\D{0,6}(\d{1,2})/i);
  if (paxm) { pax = paxm[1]; cut(paxm[0]); }
  let lug = '';
  const lm = t.match(/(\d{1,2})\s*(?:чемодан|багаж|сумк|мест|вализ|luggage|bag)/i)
    || t.match(/(?:чемодан|багаж|сумк)\D{0,6}(\d{1,2})/i);
  if (lm) { lug = lm[1]; cut(lm[0]); }

  // Leftover bare 1–2 digit numbers → passengers, then luggage.
  const left = t.match(/\b\d{1,2}\b/g) || [];
  if (!pax && left.length) pax = left.shift();
  if (!lug && left.length) lug = left.shift();

  return { date, time, flight, phone, pax, lug };
}

// Build the structured trip request sent to the owner.
function ownerBooking(r, text, msg) {
  const f = parseBooking(text);
  return (
    '🆕 НОВАЯ ЗАЯВКА НА ТРАНСФЕР\n' +
    `🛫 Маршрут: Аликанте (ALC) → ${r ? r.ru : '—'}${r ? ` — ${quote(r.price)}€` : ''}\n` +
    `📅 Дата: ${f.date || '—'}\n` +
    `🕐 Время: ${f.time || '—'}\n` +
    `✈️ Рейс: ${f.flight || '—'}\n` +
    `📞 Телефон: ${f.phone || '—'}\n` +
    `👥 Пассажиров: ${f.pax || '—'}\n` +
    `🧳 Багаж: ${f.lug || '—'}\n` +
    `👤 Клиент: ${whoOf(msg)}\n\n` +
    `📝 Сообщение клиента: ${String(text || '').trim()}`
  );
}

async function sendPrice(chatId, r) {
  await tg('sendMessage', {
    chat_id: chatId,
    text: priceText(r),
    parse_mode: 'Markdown',
    reply_markup: orderKeyboard(r),
    disable_web_page_preview: true,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });
  if (!TOKEN) return res.status(200).json({ ok: false, error: 'no token' });
  if (req.headers['x-telegram-bot-api-secret-token'] !== webhookSecret()) {
    return res.status(401).json({ ok: false });
  }

  let u = req.body;
  if (typeof u === 'string') { try { u = JSON.parse(u); } catch { u = {}; } }
  u = u || {};

  try {
    if (u.callback_query) {
      const cq = u.callback_query;
      const chatId = cq.message && cq.message.chat && cq.message.chat.id;
      await tg('answerCallbackQuery', { callback_query_id: cq.id });
      if (cq.data === 'menu') {
        await tg('sendMessage', { chat_id: chatId, text: GREETING, reply_markup: popularKeyboard() });
      } else if (cq.data && cq.data.startsWith('r:')) {
        const r = ROUTES.find((x) => x.slug === cq.data.slice(2));
        if (r) await sendPrice(chatId, r);
      } else if (cq.data && cq.data.startsWith('book:')) {
        const r = ROUTES.find((x) => x.slug === cq.data.slice(5));
        if (r) {
          await tg('sendMessage', {
            chat_id: chatId,
            text: bookingPrompt(r),
            parse_mode: 'Markdown',
            reply_markup: { force_reply: true, input_field_placeholder: '12.08.2026, 14:30, FR2643, 2, 2' },
          });
        }
      }
      return res.status(200).json({ ok: true });
    }

    const msg = u.message || u.edited_message;
    if (msg && msg.chat) {
      const chatId = msg.chat.id;
      const text = (msg.text || '').trim();

      if (/^\/(start|menu|help)/i.test(text)) {
        await tg('sendMessage', { chat_id: chatId, text: GREETING, reply_markup: popularKeyboard() });
        return res.status(200).json({ ok: true });
      }

      // Reply to a booking prompt → send the owner a structured trip request.
      const rt = msg.reply_to_message;
      if (rt && /Бронирование:/.test(rt.text || '')) {
        const br = routeFromPrompt(rt.text);
        if (OWNER) await tg('sendMessage', { chat_id: OWNER, text: ownerBooking(br, text, msg) });
        await tg('sendMessage', { chat_id: chatId, text: THANKS });
        return res.status(200).json({ ok: true });
      }

      const r = matchRoute(text);
      if (r) {
        await sendPrice(chatId, r);
        if (OWNER) {
          tg('sendMessage', { chat_id: OWNER, text: `🔔 Запрос цены в боте: ${whoOf(msg)} → ${r.ru} (${quote(r.price)}€)` }).catch(() => {});
        }
      } else if (/\d/.test(text)) {
        // Not a city but contains numbers — booking details typed without the
        // button. Thank + forward a structured lead (route unknown here).
        await tg('sendMessage', { chat_id: chatId, text: THANKS });
        if (OWNER) {
          tg('sendMessage', { chat_id: OWNER, text: ownerBooking(null, text, msg) }).catch(() => {});
        }
      } else {
        await tg('sendMessage', {
          chat_id: chatId,
          text: 'Не нашёл такой город 🤔\nВыберите направление из списка ниже или напишите название иначе.',
          reply_markup: popularKeyboard(),
        });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String((e && e.message) || e) });
  }
}
