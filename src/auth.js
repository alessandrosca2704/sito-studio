export function isAuthed() {
  try { return localStorage.getItem('admin_authed') === '1'; } catch { return false; }
}

export function loginWithPassword(pw) {
  const expected = process.env.REACT_APP_ADMIN_PASSWORD || 'changeme';
  if (pw === expected) {
    try { localStorage.setItem('admin_authed', '1'); } catch {}
    return true;
  }
  return false;
}

export function logout() {
  try { localStorage.removeItem('admin_authed'); } catch {}
}

