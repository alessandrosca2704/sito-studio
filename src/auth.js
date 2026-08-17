import { getLocalMockPassword, shouldUseMockAdminAuth } from './adminTestMode';

export async function isAuthed() {
  if (shouldUseMockAdminAuth()) return sessionStorage.getItem('mock_admin_authed') === '1';
  try {
    const response = await fetch('/.netlify/functions/adminAuth', { method: 'GET', credentials: 'same-origin', cache: 'no-store' });
    if (!response.ok) return false;
    const data = await response.json();
    return data.authenticated === true;
  } catch { return false; }
}

export async function loginWithPassword(password) {
  if (shouldUseMockAdminAuth()) {
    const ok = Boolean(getLocalMockPassword() && password === getLocalMockPassword());
    if (ok) sessionStorage.setItem('mock_admin_authed', '1');
    return ok;
  }
  try {
    const response = await fetch('/.netlify/functions/adminAuth', {
      method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return response.ok;
  } catch { return false; }
}

export async function logout() {
  sessionStorage.removeItem('mock_admin_authed');
  if (shouldUseMockAdminAuth()) return;
  try { await fetch('/.netlify/functions/adminAuth', { method: 'DELETE', credentials: 'same-origin' }); } catch {}
}
