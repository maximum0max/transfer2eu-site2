// Vercel serverless function — sends a Telegram notification to the site owner
// whenever a booking form is submitted. Configured via two environment
// variables (set them in the Vercel dashboard → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN  — token from @BotFather, e.g. 123456:ABC-DEF...
//   TELEGRAM_CHAT_ID    — the owner's chat id (numeric) the bot sends to
//
// The form POSTs a JSON body with the booking fields; we format a readable
// message and forward it to the Telegram Bot API. Failures are swallowed so a
// notification outage never breaks the customer's booking flow.

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // Not configured yet — don't error the client, just report it.
    return res.status(200).json({ ok: false, error: 'Telegram not configured' });
  }

  // Vercel parses JSON bodies automatically; guard in case it's a string.
  let d = req.body;
  if (typeof d === 'string') {
    try { d = JSON.parse(d); } catch { d = {}; }
  }
  d = d || {};

  // Two accepted shapes:
  //  1) Generic:  { title, fields: [ [label, value] | {label, value} ] }
  //  2) Legacy transfer-booking shape (route/price/name/...).
  let title, rows;
  if (Array.isArray(d.fields)) {
    title = d.title || 'Новая заявка с сайта transfer2eu.com';
    rows = d.fields
      .map((f) => (Array.isArray(f) ? f : [f && f.label, f && f.value]))
      .filter(([, v]) => v != null && String(v).trim() !== '');
  } else {
    title = '🔔 Новая заявка с сайта transfer2eu.com';
    rows = [
      ['🚗 Маршрут', d.route],
      ['💶 Стоимость', d.price],
      ['👤 Имя', d.name],
      ['📞 Телефон', d.phone],
      ['📧 Email', d.email],
      ['📅 Дата', d.date],
      [`🕐 ${d.timeLabel || 'Время'}`, d.time],
      ['✈️ Рейс', d.flight],
      ['👥 Пассажиров', d.passengers],
      ['🧳 Багаж', d.luggage],
      ['📝 Примечания', d.notes],
    ].filter(([, v]) => v != null && String(v).trim() !== '');
  }

  const text =
    `<b>${esc(title)}</b>\n\n` +
    rows.map(([k, v]) => `${esc(k)}: <b>${esc(v)}</b>`).join('\n');

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const tg = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok || !tg.ok) {
      return res.status(200).json({ ok: false, error: tg.description || 'Telegram API error' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e && e.message || e) });
  }
}
