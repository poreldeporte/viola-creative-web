/* Contact form handler.
 *
 * Deliberately dependency-free: it calls Resend's REST API with fetch rather
 * than pulling in an SDK, so the repo keeps its promise of no package.json,
 * no lockfile and no build step. Node 24 on Vercel has fetch built in.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const FROM = 'Viola Creative site <leads@violacreative.com>';
const TO = 'hello@violacreative.com';
// Direct copy, so leads land somewhere reachable even while hello@ depends on
// Cloudflare Email Routing being up.
const CC = ['franco.viola@live.com'];

// Fluid Compute reuses instances, so this throttles a noisy source for as long
// as the instance lives. It is a speed bump, not a guarantee — the honeypot and
// the dwell-time check do the real work.
const RATE = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 3;

function rateLimited(ip) {
  const now = Date.now();
  const hits = (RATE.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  RATE.set(ip, hits);
  if (RATE.size > 5000) RATE.clear(); // bound memory
  return hits.length > RATE_MAX;
}

const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
const escape = (s) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body || typeof body !== 'object') body = {};

  // Honeypot: a real person never fills a field they cannot see. Answer 200 so
  // a bot cannot distinguish a rejection from a success and retune.
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  // Anything submitted under 2s after the form rendered is not a human typing.
  const elapsed = Number(body.elapsed);
  if (Number.isFinite(elapsed) && elapsed < 2000) return res.status(200).json({ ok: true });

  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  const company = clean(body.company, 200);
  const timeline = clean(body.stack, 200);
  const brief = clean(body.brief, 5000);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Add your name and a valid email so we can reply.' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'That went through already — give it a minute.' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('lead: RESEND_API_KEY is not set');
    return res.status(503).json({ ok: false, error: 'mail_unconfigured' });
  }

  const rows = [
    ['Name', name], ['Email', email], ['Company', company || '—'],
    ['Timeline', timeline || '—'],
  ];
  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#15130E">
  <p style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.12em;color:#BE2D18;margin:0 0 16px">NEW PROJECT ENQUIRY</p>
  <table style="border-collapse:collapse;margin-bottom:18px">${rows.map(([k, v]) =>
    `<tr><td style="padding:4px 18px 4px 0;color:#6E675B">${k}</td><td style="padding:4px 0"><strong>${escape(v)}</strong></td></tr>`).join('')}</table>
  <p style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.12em;color:#BE2D18;margin:0 0 8px">WHAT THEY'RE BUILDING</p>
  <p style="margin:0;white-space:pre-wrap">${escape(brief) || '<em style="color:#6E675B">(left blank)</em>'}</p>
</div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nWhat they're building:\n${brief || '(left blank)'}`;

  try {
    const r = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        cc: CC,
        reply_to: email,
        subject: `Project enquiry — ${company || name}`,
        html,
        text,
      }),
    });
    if (!r.ok) {
      console.error('lead: resend rejected', r.status, await r.text().catch(() => ''));
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }
  } catch (e) {
    console.error('lead: resend unreachable', e && e.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }

  return res.status(200).json({ ok: true });
};
