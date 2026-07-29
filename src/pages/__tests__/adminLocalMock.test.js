import { getLocalMockPassword, isLocalMockModeEnabled } from '../../adminTestMode';

describe('local admin mock mode', () => {
  it('enables mock mode on localhost development', () => {
    expect(isLocalMockModeEnabled({ hostname: 'localhost', env: { NODE_ENV: 'development' } })).toBe(true);
    expect(isLocalMockModeEnabled({ hostname: '127.0.0.1', env: { NODE_ENV: 'development' } })).toBe(true);
  });

  it('uses the configured mock password when mock mode is enabled', () => {
    expect(getLocalMockPassword({ REACT_APP_MOCK_ADMIN_PASSWORD: 'demo' })).toBe('demo');
    expect(getLocalMockPassword({ REACT_APP_ADMIN_PASSWORD: 'secret' })).toBe('secret');
  });
});
