import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

export describe('LoadingSpinner - CSS Classes and Structure', () => {
  it('applies correct CSS classes to container', () => {
    render(<LoadingSpinner />);
    
    const container = document.querySelector('[class*="loadingContainer"]');
    expect(container).toBeInTheDocument();
  });

  it('applies correct CSS classes to spinner', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('[class*="spinner"]');
    expect(spinner).toBeInTheDocument();
    expect(spinner?.className).toMatch(/spinner/);
  });

  it('applies correct CSS classes to spinner inner', () => {
    render(<LoadingSpinner />);
    
    const spinnerInner = document.querySelector('[class*="spinnerInner"]');
    expect(spinnerInner).toBeInTheDocument();
    expect(spinnerInner?.className).toMatch(/spinnerInner/);
  });

  it('applies correct CSS classes to loading message', () => {
    render(<LoadingSpinner />);
    
    const message = screen.getByText('Loading games...');
    expect(message.className).toMatch(/loadingMessage/);
  });

  it('combines size class with base spinner class', () => {
    render(<LoadingSpinner size="large" />);
    
    const spinner = document.querySelector('[class*="spinner"][class*="large"]');
    expect(spinner).toBeInTheDocument();
    expect(spinner?.className).toMatch(/spinner/);
    expect(spinner?.className).toMatch(/large/);
  });

  it('provides visual loading indication', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('[class*="spinner"]');
    const spinnerInner = document.querySelector('[class*="spinnerInner"]');
    
    expect(spinner).toBeInTheDocument();
    expect(spinnerInner).toBeInTheDocument();
  });
});