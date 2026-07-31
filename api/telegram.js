// Telegram webhook for the Transfer2EU price bot (@Apartikibot).
//
// Flow (in Russian): /start → greeting + inline keyboard of popular routes and a
// prompt to type any city → on a button or a typed city, replies with the fixed
// price from the site's own data (api/routes.json, regenerated on every build by
// scripts/prerender.mjs) + a "book in WhatsApp" button. Each price request also
// pings the owner (TELEGRAM_CHAT_ID) as a lead.
//
// Register the webhook once by opening /api/telegram-setup after deploy.

import ROUTES from './routes.json';
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

function popularKeyboard() {
  const btns = POPULAR
    .map((c) => ROUTES.find((r) => r.city === c))
    .filter(Boolean)
    .map((r) => ({ text: `${r.ru} — ${r.price}€`, callback_data: `r:${r.slug}` }));
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
    null
  );
}

const GREETING =
  'Здравствуйте! 👋 Я бот Transfer2EU.\n\n' +
  'Подскажу цену на трансфер из аэропорта Аликанте (ALC). ' +
  'Куда планируете поездку? Выберите направление ниже или напишите название города 👇';

function priceText(r) {
  return (
    `🚕 Аликанте (ALC) → *${r.ru}*\n` +
    `💶 Фиксированная цена: *${r.price}€* за автомобиль (седан, до 4 пассажиров)\n` +
    `🕐 ~${r.time} мин в пути\n\n` +
    '✅ Включено: платные дороги, детское кресло, встреча с табличкой, работаем 24/7.\n' +
    '👨‍✈️ Русскоязычный водитель.\n\n' +
    `Чтобы забронировать — напишите дату, время и номер рейса, либо нажмите кнопку ниже.`
  );
}

function orderKeyboard(r) {
  const wa = `https://wa.me/34651011911?text=${encodeURIComponent(`Здравствуйте! Хочу заказать трансфер Аликанте → ${r.ru} (${r.price}€).`)}`;
  return {
    inline_keyboard: [
      [{ text: '✅ Забронировать в WhatsApp', url: wa }],
      [{ text: '🌐 Страница маршрута', url: `${SITE}/${r.slug}` }],
      [{ text: '🔁 Другой маршрут', callback_data: 'menu' }],
    ],
  };
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

      const r = matchRoute(text);
      if (r) {
        await sendPrice(chatId, r);
        if (OWNER) {
          const who = [msg.from && msg.from.first_name, msg.from && msg.from.username && '@' + msg.from.username]
            .filter(Boolean).join(' ');
          tg('sendMessage', { chat_id: OWNER, text: `🔔 Запрос цены в боте: ${who || 'гость'} → ${r.ru} (${r.price}€)` }).catch(() => {});
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
