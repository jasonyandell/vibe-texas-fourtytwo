import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

export describe('LoadingSpinner - Accessibility', () => {
  it('has proper ARIA attributes on spinner', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('[class*="spinner"]');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('has proper ARIA live region on message', () => {
    render(<LoadingSpinner />);
    
    const message = screen.getByText('Loading games...');
    expect(message).toHaveAttribute('aria-live', 'polite');
  });

  it('provides accessible loading announcement', () => {
    render(<LoadingSpinner message="Loading user data..." />);
    
    const message = screen.getByText('Loading user data...');
    expect(message).toHaveAttribute('aria-live', 'polite');
  });

  it('maintains accessibility with different sizes', () => {
    render(<LoadingSpinner size="small" message="Loading..." />);
    
    const spinner = document.querySelector('[class*="spinner"]');
    const message = screen.getByText('Loading...');
    
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(message).toHaveAttribute('aria-live', 'polite');
  });
});