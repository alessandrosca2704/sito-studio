export function getTimeoutMs() {
  const def = 30 * 60 * 1000; // 30 minutes
  const mins = Number(process.env.REACT_APP_ADMIN_TIMEOUT_MIN);
  return mins > 0 ? mins * 60 * 1000 : def;
}

export function isAuthed() {
  try {
    const authed = localStorage.getItem('admin_authed') === '1';
    if (!authed) return false;
    const exp = Number(localStorage.getItem('admin_expires_at') || '0');
    const now = Date.now();
    if (!exp || now > exp) {
      logout();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function loginWithPassword(pw) {
  try {
    const res = await fetch('/.netlify/functions/adminAuth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    const ok = res.ok;
    if (ok) {
      try {
        localStorage.setItem('admin_authed', '1');
        localStorage.setItem('admin_expires_at', String(Date.now() + getTimeoutMs()));
      } catch {}
    }
    return ok;
  } catch {
    return false;
  }
}

export function refreshExpiry() {
  try {
    if (localStorage.getItem('admin_authed') === '1') {
      localStorage.setItem('admin_expires_at', String(Date.now() + getTimeoutMs()));
    }
  } catch {}
}

export function logout() {
  try {
    localStorage.removeItem('admin_authed');
    localStorage.removeItem('admin_expires_at');
  } catch {}
}
