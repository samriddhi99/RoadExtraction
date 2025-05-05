/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import LoginModal from './LoginModal';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { UserProvider } from '../context/UserContext';

// Wrap with router + context
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <UserProvider>{ui}</UserProvider>
    </BrowserRouter>
  );
};

describe('LoginModal', () => {
  const onCloseMock = vi.fn();

  it('renders when open', async () => {
    renderWithProviders(<LoginModal isOpen={true} onClose={onCloseMock} />);
    expect(
      screen.getByRole('heading', { name: /login/i })
    ).toBeInTheDocument();
  });
  
  it('does not render when closed', () => {
    const { queryByText } = renderWithProviders(<LoginModal isOpen={false} onClose={onCloseMock} />);
    expect(queryByText(/login/i)).not.toBeInTheDocument();
  });

  it('shows error for invalid user email', () => {
    renderWithProviders(<LoginModal isOpen={true} onClose={onCloseMock} />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/user accounts must use/i)).toBeInTheDocument();
  });

  it('shows error for invalid admin email', () => {
    renderWithProviders(<LoginModal isOpen={true} onClose={onCloseMock} />);
    fireEvent.change(screen.getByLabelText(/login as/i), { target: { value: 'Admin' } });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'admin@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/admin accounts must use/i)).toBeInTheDocument();
  });

  // it('calls onClose after successful login', () => {
  //   renderWithProviders(<LoginModal isOpen={true} onClose={onCloseMock} />);
  //   fireEvent.change(screen.getByLabelText(/email address/i), {
  //     target: { value: 'john@roadmonitor.in' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/password/i), {
  //     target: { value: 'testpass' },
  //   });
  //   fireEvent.click(screen.getByRole('button', { name: /login/i }));
  //   // onClose should be called after successful submission
  //   expect(onCloseMock).toHaveBeenCalled();
  // });
});
