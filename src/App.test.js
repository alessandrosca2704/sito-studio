import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

jest.mock('react-xmas-tree/react', () => () => null, { virtual: true });

test('renders the studio application', () => {
  render(<HelmetProvider><MemoryRouter><App /></MemoryRouter></HelmetProvider>);
  expect(screen.getAllByText(/studio scarimbolo/i).length).toBeGreaterThan(0);
});
