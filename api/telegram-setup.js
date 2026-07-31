// One-time helper to register the Telegram webhook. Open once after deploy:
//   https://www.transfer2eu.com/api/telegram-setup
// It uses TELEGRAM_BOT_TOKEN from the Vercel env, derives the same secret the
// webhook verifies, and points Telegram at /api/telegram. Harmless to call
// again — it only ever points the webhook at our own endpoint.

import { createHash } from 'node:crypto';

export default async function handler(req, res) {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!TOKEN) return res.status(200).json({ ok: false, error: 'TELEGRAM_BOT_TOKEN not set' });

  const secret = createHash('sha256').update(TOKEN).digest('hex').slice(0, 40);
  const url = 'https://www.transfer2eu.com/api/telegram';

  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      secret_token: secret,
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: true,
    }),
  });
  const setWebhook = await r.json().catch(() => ({}));

  const info = await (await fetch(`https://api.telegram.org/bot${TOKEN}/getWebhookInfo`)).json().catch(() => ({}));
  return res.status(200).json({ url, setWebhook, webhookInfo: info.result || info });
}
