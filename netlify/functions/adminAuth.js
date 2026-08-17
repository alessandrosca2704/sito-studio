import crypto from 'node:crypto';
import { clearSessionCookie, createSessionCookie, hasValidSession, isSameOrigin, json, sessionConfigured } from './lib/adminSession.js';

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const clientKey = (event) => String(event.headers?.['x-nf-client-connection-ip'] || event.headers?.['x-forwarded-for'] || 'unknown').split(',')[0].trim();

function isLimited(key) {
  const recent = (attempts.get(key) || []).filter((time) => Date.now() - time < WINDOW_MS);
  attempts.set(key, recent);
  return recent.length >= MAX_ATTEMPTS;
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function handler(event) {
  if (event.httpMethod === 'GET') {
    const authenticated = hasValidSession(event);
    return json(200, { authenticated });
  }
  if (event.httpMethod === 'DELETE') {
    if (!isSameOrigin(event)) return json(403, { error: 'Forbidden' });
    return json(200, { ok: true }, { 'set-cookie': clearSessionCookie() });
  }
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' }, { allow: 'GET, POST, DELETE' });
  if (!isSameOrigin(event)) return json(403, { error: 'Forbidden' });

  const expected = String(process.env.ADMIN_PASSWORD || '').trim();
  if (!expected || !sessionConfigured()) return json(503, { error: 'Server not configured' });
  const key = clientKey(event);
  if (isLimited(key)) return json(429, { error: 'Too many attempts' }, { 'retry-after': '900' });

  let provided = '';
  try {
    if (Buffer.byteLength(event.body || '', 'utf8') > 2048) return json(413, { error: 'Payload too large' });
    provided = String(JSON.parse(event.body || '{}').password || '').trim();
  } catch { return json(400, { error: 'Invalid payload' }); }

  if (!provided || !safeEqual(provided, expected)) {
    attempts.set(key, [...(attempts.get(key) || []), Date.now()]);
    return json(401, { error: 'Invalid credentials' });
  }
  attempts.delete(key);
  return json(200, { ok: true }, { 'set-cookie': createSessionCookie() });
}
