/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from './Contact';

describe('Contact', () => {
  it('renders form and submits successfully', async () => {
    render(<Contact />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Concern\/Message/i), {
      target: { value: 'This is a test message.' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    // Wait for confirmation message
    await waitFor(() => {
      expect(
        screen.getByText(/Thank you for your message!/i)
      ).toBeInTheDocument();
    });

    // Optional: Check the follow-up text
    expect(
      screen.getByText(/Your inquiry has been submitted successfully/i)
    ).toBeInTheDocument();
  });
});
