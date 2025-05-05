/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import About from './About';
import { BrowserRouter } from 'react-router-dom';

describe('About Page', () => {
  it('renders key content correctly', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    // Headings
    expect(screen.getByText(/About Our Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/How Our Platform Works/i)).toBeInTheDocument();
    expect(screen.getByText(/Our Mission/i)).toBeInTheDocument();
    expect(screen.getByText(/Key Features/i)).toBeInTheDocument();

    // Features
    expect(screen.getByText('Real-Time Alerts')).toBeInTheDocument(); // exact match
    expect(screen.getByText('Automated Change Detection')).toBeInTheDocument();
    expect(screen.getByText('Temporal Image Comparison')).toBeInTheDocument();
    expect(screen.getByText('User-Friendly Visualization')).toBeInTheDocument();

    // Mission description (check partial text)
    expect(
      screen.getByText(/improving road infrastructure management through technology/i)
    ).toBeInTheDocument();

    // CTA button
    expect(screen.getByRole('link', { name: /Contact Us/i })).toBeInTheDocument();
  });
});
