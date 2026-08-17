import crypto from 'node:crypto';

const COOKIE_NAME = '__Host-studio_admin';
const MAX_AGE_SECONDS = 30 * 60;

const secret = () => process.env.ADMIN_SESSION_SECRET || '';
const encode = (value) => Buffer.from(value).toString('base64url');
const sign = (payload) => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

export const sessionConfigured = () => secret().length >= 32;

export function createSessionCookie() {
  const payload = encode(JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000 }));
  return `${COOKIE_NAME}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE_SECONDS}`;
}

export const clearSessionCookie = () =>
  `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export function hasValidSession(event) {
  if (!sessionConfigured()) return false;
  const cookies = String(event.headers?.cookie || event.headers?.Cookie || '').split(';').map((part) => part.trim());
  const raw = cookies.find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (!raw) return false;
  const [payload, suppliedSignature] = raw.split('.');
  if (!payload || !suppliedSignature) return false;
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(sign(payload));
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}

export function isSameOrigin(event) {
  const origin = event.headers?.origin || event.headers?.Origin;
  const host = event.headers?.['x-forwarded-host'] || event.headers?.host || event.headers?.Host;
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

export function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extraHeaders },
    body: JSON.stringify(body)
  };
}
