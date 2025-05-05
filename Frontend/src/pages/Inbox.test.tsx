/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Inbox from './Inbox';


describe('Inbox Component', () => {
    it('marks alert as read on click (unread dot disappears)', () => {
      const { } = render(<Inbox />); 
  
      const alertButton = screen.getByText(/New Road Damage Detected/i).closest('button');
      expect(alertButton).toBeInTheDocument();
  
      const unreadDot = alertButton?.querySelector('.bg-forest-green.rounded-full');
      expect(unreadDot).toBeInTheDocument();
  
      fireEvent.click(screen.getByText(/New Road Damage Detected/i));
  
      const unreadDotAfter = alertButton?.querySelector('.bg-forest-green.rounded-full');
      expect(unreadDotAfter).not.toBeInTheDocument();
    });
  });

  it('renders alert titles', () => {
    render(<Inbox />);

    expect(screen.getByText(/New Road Damage Detected/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Report Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Maintenance Complete/i)).toBeInTheDocument();
  });

  it('shows alert details when clicked', () => {
    render(<Inbox />);

    fireEvent.click(screen.getByText(/New Road Damage Detected/i));

    expect(screen.getByText(/AI system has detected significant road damage/i)).toBeInTheDocument();
    expect(screen.getByText(/Received on 2024-03-15/i)).toBeInTheDocument();
  });

  it('marks alert as read on click (unread dot disappears)', () => {
    const { } = render(<Inbox />);

    const alertButton = screen.getByText(/New Road Damage Detected/i).closest('button');
    expect(alertButton).toBeInTheDocument();
  
    const unreadDot = alertButton?.querySelector('.bg-forest-green.rounded-full');
    expect(unreadDot).toBeInTheDocument();
  
    fireEvent.click(screen.getByText(/New Road Damage Detected/i));
  
    const unreadDotAfter = alertButton?.querySelector('.bg-forest-green.rounded-full');
    expect(unreadDotAfter).not.toBeInTheDocument();
  });
  
