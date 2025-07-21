import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner - Component Composition', () => {
  it('renders spinner and message together', () => {
    render(<LoadingSpinner message="Loading data..." />);
    
    expect(document.querySelector('[class*="spinner"]')).toBeInTheDocument();
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('maintains proper element hierarchy', () => {
    render(<LoadingSpinner />);
    
    const container = document.querySelector('[class*="loadingContainer"]');
    const spinner = container?.querySelector('[class*="spinner"]');
    const message = container?.querySelector('[class*="loadingMessage"]');
    
    expect(container).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });

  it('renders spinner inner within spinner', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('[class*="spinner"]');
    const spinnerInner = spinner?.querySelector('[class*="spinnerInner"]');
    
    expect(spinnerInner).toBeInTheDocument();
  });

  it('handles both size and message props', () => {
    render(<LoadingSpinner size="large" message="Loading large dataset..." />);
    
    const spinner = document.querySelector('[class*="spinner"][class*="large"]');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Loading large dataset...')).toBeInTheDocument();
  });
});