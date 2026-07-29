export function isLocalMockModeEnabled(location = window.location, env = process.env) {
  if (!location) return false;
  const effectiveEnv = location.env || env || {};
  const hostname = (location.hostname || '').toLowerCase();
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
  const isDev = (effectiveEnv.NODE_ENV || '').toLowerCase() === 'development';
  return isLocalHost && isDev;
}

export function getLocalMockPassword(env = process.env) {
  const effectiveEnv = env || {};
  return effectiveEnv.REACT_APP_MOCK_ADMIN_PASSWORD || effectiveEnv.REACT_APP_ADMIN_PASSWORD || '';
}

export function shouldUseMockAdminAuth(location = window.location, env = process.env) {
  return isLocalMockModeEnabled(location, env) && Boolean(getLocalMockPassword(env));
}
