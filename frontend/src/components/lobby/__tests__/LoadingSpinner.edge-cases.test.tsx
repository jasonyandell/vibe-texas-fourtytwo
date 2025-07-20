import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

export describe('LoadingSpinner - Error Handling & Performance', () => {
  describe('Error Handling', () => {
    it('handles undefined props gracefully', () => {
      expect(() => {
        render(<LoadingSpinner size={undefined} message={undefined} />);
      }).not.toThrow();
    });

    it('handles null message gracefully', () => {
      expect(() => {
        // @ts-expect-error Testing null message
        render(<LoadingSpinner message={null} />);
      }).not.toThrow();
    });

    it('renders without crashing with minimal props', () => {
      expect(() => {
        render(<LoadingSpinner />);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('renders quickly with default props', () => {
      const startTime = performance.now();
      render(<LoadingSpinner />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('handles multiple rapid renders', () => {
      const { rerender } = render(<LoadingSpinner />);
      
      for (let i = 0; i < 10; i++) {
        rerender(<LoadingSpinner message={`Loading ${i}...`} size={i % 2 === 0 ? 'small' : 'large'} />);
      }
      
      expect(screen.getByText('Loading 9...')).toBeInTheDocument();
    });
  });
});