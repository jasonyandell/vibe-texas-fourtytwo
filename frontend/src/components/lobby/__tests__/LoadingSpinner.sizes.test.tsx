import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner - Size Variants', () => {
  it('applies small size class', () => {
    render(<LoadingSpinner size="small" />);
    
    const spinner = document.querySelector('[class*="spinner"][class*="small"]');
    expect(spinner).toBeInTheDocument();
  });

  it('applies medium size class by default', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('[class*="spinner"][class*="medium"]');
    expect(spinner).toBeInTheDocument();
  });

  it('applies medium size class when explicitly set', () => {
    render(<LoadingSpinner size="medium" />);
    
    const spinner = document.querySelector('[class*="spinner"][class*="medium"]');
    expect(spinner).toBeInTheDocument();
  });

  it('applies large size class', () => {
    render(<LoadingSpinner size="large" />);
    
    const spinner = document.querySelector('[class*="spinner"][class*="large"]');
    expect(spinner).toBeInTheDocument();
  });

  it('handles invalid size gracefully', () => {
    // @ts-expect-error Testing invalid size
    render(<LoadingSpinner size="invalid" />);
    
    // The spinner should still render, just without the invalid size class
    const spinner = document.querySelector('[class*="spinner"]');
    expect(spinner).toBeInTheDocument();
    // The invalid class won't be applied since it doesn't exist in CSS modules
    expect(spinner?.className).toMatch(/spinner/);
  });

  it('can override default size', () => {
    render(<LoadingSpinner size="large" />);
    
    const spinner = document.querySelector('[class*="spinner"][class*="large"]');
    expect(spinner).toBeInTheDocument();
    const mediumSpinner = document.querySelector('[class*="spinner"][class*="medium"]');
    expect(mediumSpinner).not.toBeInTheDocument();
  });

  it('handles all size variants with custom messages', () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    
    sizes.forEach(size => {
      const { unmount } = render(<LoadingSpinner size={size} message={`Loading ${size}...`} />);
      
      const spinner = document.querySelector(`[class*="spinner"][class*="${size}"]`);
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText(`Loading ${size}...`)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('maintains consistent visual structure across sizes', () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    
    sizes.forEach(size => {
      const { unmount } = render(<LoadingSpinner size={size} />);
      
      expect(document.querySelector('[class*="spinner"]')).toBeInTheDocument();
      expect(document.querySelector('[class*="spinnerInner"]')).toBeInTheDocument();
      expect(document.querySelector('[class*="loadingMessage"]')).toBeInTheDocument();
      
      unmount();
    });
  });
});