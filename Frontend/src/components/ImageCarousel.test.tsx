/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import ImageCarousel from './ImageCarousel';

describe('ImageCarousel', () => {
  it('renders the first image initially', () => {
    render(<ImageCarousel />);
    expect(screen.getByAltText(/Road infrastructure project/i)).toBeInTheDocument();
  });

  it('navigates to the next image when next button is clicked', () => {
    render(<ImageCarousel />);
    const nextButton = screen.getByRole('button', { name: /next slide/i });
    fireEvent.click(nextButton);
    expect(screen.getByAltText(/Road condition monitoring/i)).toBeInTheDocument();
  });

  it('navigates to the previous image when previous button is clicked', () => {
    render(<ImageCarousel />);
    const prevButton = screen.getByRole('button', { name: /previous slide/i });
    fireEvent.click(prevButton);
    expect(screen.getByAltText(/Unauthorized construction detection/i)).toBeInTheDocument();
  });
});
