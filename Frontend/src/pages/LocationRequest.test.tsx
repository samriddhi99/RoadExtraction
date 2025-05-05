/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationRequest from './LocationRequest';


describe('LocationRequest Component', () => {
  it('renders the form title and subtitle', () => {
    render(<LocationRequest />);
    expect(screen.getByText(/Request New Location Access/i)).toBeInTheDocument();
    expect(screen.getByText(/Fill out this form/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submission', async () => {
    render(<LocationRequest />);

    const submitButton = screen.getByRole('button', { name: /submit request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Department is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Designation is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select at least one location/i)).toBeInTheDocument();
      expect(screen.getByText(/Justification is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Supervisor's information is required/i)).toBeInTheDocument();
      expect(screen.getByText(/You must agree to the Terms and Conditions/i)).toBeInTheDocument();
      expect(screen.getByText(/You must agree to the Data Confidentiality Agreement/i)).toBeInTheDocument();
    });
  });

  it('submits the form successfully when valid', async () => {
    render(<LocationRequest />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Department\/Organization Name/i), { target: { value: 'Transport Dept' } });
    fireEvent.change(screen.getByLabelText(/Designation\/Job Title/i), { target: { value: 'Officer' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter requested locations/i),{ target: { value: 'Hyderabad, Secunderabad' } });
    fireEvent.change(screen.getByLabelText(/Justification for Access Request/i), { target: { value: 'Urgent monitoring needed' } });
    fireEvent.change(screen.getByLabelText(/Supervisor's Approval/i), { target: { value: 'Mr. Smith - 9876543210' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /I agree to the Terms and Conditions/i }));
    fireEvent.click(screen.getByRole('checkbox', {name:/I acknowledge the Data Confidentiality Agreement/i}));

    fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));
  });
});
