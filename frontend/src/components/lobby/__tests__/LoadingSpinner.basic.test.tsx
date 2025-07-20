import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

export describe('LoadingSpinner - Basic Rendering', () => {
  it('renders loading spinner with default message', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading games...')).toBeInTheDocument();
  });

  it('renders spinner element', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('[class*="spinner"][class*="medium"]');
    expect(spinner).toBeInTheDocument();
  });

  it('renders spinner inner element', () => {
    render(<LoadingSpinner />);
    
    const spinnerInner = document.querySelector('[class*="spinnerInner"]');
    expect(spinnerInner).toBeInTheDocument();
  });

  it('has proper container structure', () => {
    render(<LoadingSpinner />);
    
    const container = screen.getByText('Loading games...').closest('div');
    expect(container).toBeInTheDocument();
    expect(container?.className).toMatch(/loadingContainer/);
  });

  it('uses medium size by default', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('[class*="spinner"][class*="medium"]');
    expect(spinner).toBeInTheDocument();
  });

  it('uses default message when not provided', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading games...')).toBeInTheDocument();
  });
});