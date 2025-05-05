/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { BrowserRouter } from 'react-router-dom';

// Mock useUser
vi.mock('../context/UserContext', () => ({
  useUser: () => ({
    isLoggedIn: false,
    userName: '',
    userRole: '',
    logout: vi.fn(),
    isAdmin: vi.fn(() => false),
  }),
}));

describe('Navbar', () => {
  it('renders Login button when user is not logged in', () => {
    const openLoginModal = vi.fn();

    render(
      <BrowserRouter>
        <Navbar openLoginModal={openLoginModal} />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    expect(openLoginModal).toHaveBeenCalled();
  });
});
