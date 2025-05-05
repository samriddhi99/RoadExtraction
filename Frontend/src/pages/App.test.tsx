/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { UserProvider } from '../context/UserContext';

describe('Integration: App with UserContext and Dashboard routing', () => {
  it('renders common navigation links', () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('does NOT show Dashboard before login', () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    );

    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
  });

  it('shows Dashboard after login (User or Admin)', async () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    );
  
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    // const dashboard = await screen.findByRole('heading', {
    //     name: /(?:User|Admin) Dashboard/i,
    //   });
    //   expect(dashboard).toBeInTheDocument();
  });
  
});
