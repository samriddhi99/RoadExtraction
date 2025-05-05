/// <reference types="vitest" />
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

import Home from './Home';

vi.mock('../context/UserContext', () => ({
  useUser: () => ({
    isLoggedIn: true,
  }),
}));

describe('Home Component (Logged-in)', () => {
  afterEach(cleanup);

  it('renders welcome text and recent alert title', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome to Road Atlas!/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Alerts/i)).toBeInTheDocument();
    expect(screen.getByText(/Road Damage Detected/i)).toBeInTheDocument();
    expect(screen.getByText(/Accessible Locations/i)).toBeInTheDocument();
    expect(screen.getByText(/Hyderabad Region/i)).toBeInTheDocument();
  });

  it('shows alert details on click', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Road Damage Detected/i));
    expect(screen.getByText(/Coverage Area Coordinates/i)).toBeInTheDocument();
    expect(screen.getByText(/Sensor Details/i)).toBeInTheDocument();
  });
});

describe('Home Component (Guest)', () => {
  beforeEach(() => {
    vi.resetModules(); 
    vi.doMock('../context/UserContext', () => ({
      useUser: () => ({
        isLoggedIn: false,
      }),
    }));
  });

  afterEach(() => {
    vi.resetModules(); 
  });

  it('renders guest carousel and CTA', async () => {
    const { default: GuestHome } = await import('./Home'); 

    render(
      <BrowserRouter>
        <GuestHome />
      </BrowserRouter>
    );

    expect(screen.getByText(/Our Monitoring in Action/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready to Get Started/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Register Now/i })).toBeInTheDocument();
  });
});
