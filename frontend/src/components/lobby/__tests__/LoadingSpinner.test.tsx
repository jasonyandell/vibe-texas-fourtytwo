import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('Basic Rendering', () => {
    it('renders loading spinner with default message', () => {
      render(<LoadingSpinner />);
      
      expect(screen.getByText('Loading games...')).toBeInTheDocument();
    });

    it('renders spinner element', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('renders spinner inner element', () => {
      render(<LoadingSpinner />);
      
      const spinnerInner = document.querySelector('.spinnerInner');
      expect(spinnerInner).toBeInTheDocument();
    });

    it('has proper container structure', () => {
      render(<LoadingSpinner />);
      
      const container = screen.getByText('Loading games...').closest('.loadingContainer');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Custom Messages', () => {
    it('displays custom message when provided', () => {
      render(<LoadingSpinner message="Loading players..." />);
      
      expect(screen.getByText('Loading players...')).toBeInTheDocument();
      expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
    });

    it('handles empty message', () => {
      render(<LoadingSpinner message="" />);
      
      const messageElement = document.querySelector('.loadingMessage');
      expect(messageElement).toHaveTextContent('');
    });

    it('handles long messages', () => {
      const longMessage = 'Loading a very long message that might wrap to multiple lines in the interface';
      render(<LoadingSpinner message={longMessage} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters in messages', () => {
      const specialMessage = 'Loading... 50% complete! @#$%^&*()';
      render(<LoadingSpinner message={specialMessage} />);
      
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies small size class', () => {
      render(<LoadingSpinner size="small" />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toHaveClass('small');
    });

    it('applies medium size class by default', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toHaveClass('medium');
    });

    it('applies medium size class when explicitly set', () => {
      render(<LoadingSpinner size="medium" />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toHaveClass('medium');
    });

    it('applies large size class', () => {
      render(<LoadingSpinner size="large" />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toHaveClass('large');
    });

    it('handles invalid size gracefully', () => {
      // @ts-expect-error Testing invalid size
      render(<LoadingSpinner size="invalid" />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toHaveClass('invalid');
    });
  });

  describe('CSS Classes and Structure', () => {
    it('applies correct CSS classes to container', () => {
      render(<LoadingSpinner />);
      
      const container = document.querySelector('.loadingContainer');
      expect(container).toBeInTheDocument();
    });

    it('applies correct CSS classes to spinner', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('spinner');
    });

    it('applies correct CSS classes to spinner inner', () => {
      render(<LoadingSpinner />);
      
      const spinnerInner = document.querySelector('.spinnerInner');
      expect(spinnerInner).toBeInTheDocument();
      expect(spinnerInner).toHaveClass('spinnerInner');
    });

    it('applies correct CSS classes to loading message', () => {
      render(<LoadingSpinner />);
      
      const message = screen.getByText('Loading games...');
      expect(message).toHaveClass('loadingMessage');
    });

    it('combines size class with base spinner class', () => {
      render(<LoadingSpinner size="large" />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toHaveClass('spinner');
      expect(spinner).toHaveClass('large');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on spinner', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.spinner');
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
      
      const spinner = document.querySelector('.spinner');
      const message = screen.getByText('Loading...');
      
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
      expect(message).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Default Props', () => {
    it('uses medium size by default', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toHaveClass('medium');
    });

    it('uses default message when not provided', () => {
      render(<LoadingSpinner />);
      
      expect(screen.getByText('Loading games...')).toBeInTheDocument();
    });

    it('can override default message', () => {
      render(<LoadingSpinner message="Custom loading message" />);
      
      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
      expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
    });

    it('can override default size', () => {
      render(<LoadingSpinner size="large" />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toHaveClass('large');
      expect(spinner).not.toHaveClass('medium');
    });
  });

  describe('Component Composition', () => {
    it('renders spinner and message together', () => {
      render(<LoadingSpinner message="Loading data..." />);
      
      expect(document.querySelector('.spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('maintains proper element hierarchy', () => {
      render(<LoadingSpinner />);
      
      const container = document.querySelector('.loadingContainer');
      const spinner = container?.querySelector('.spinner');
      const message = container?.querySelector('.loadingMessage');
      
      expect(container).toBeInTheDocument();
      expect(spinner).toBeInTheDocument();
      expect(message).toBeInTheDocument();
    });

    it('renders spinner inner within spinner', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.spinner');
      const spinnerInner = spinner?.querySelector('.spinnerInner');
      
      expect(spinnerInner).toBeInTheDocument();
    });
  });

  describe('Props Combinations', () => {
    it('handles both size and message props', () => {
      render(<LoadingSpinner size="large" message="Loading large dataset..." />);
      
      const spinner = document.querySelector('.spinner');
      expect(spinner).toHaveClass('large');
      expect(screen.getByText('Loading large dataset...')).toBeInTheDocument();
    });

    it('handles all size variants with custom messages', () => {
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
      
      sizes.forEach(size => {
        const { unmount } = render(<LoadingSpinner size={size} message={`Loading ${size}...`} />);
        
        const spinner = document.querySelector('.spinner');
        expect(spinner).toHaveClass(size);
        expect(screen.getByText(`Loading ${size}...`)).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('Visual States', () => {
    it('provides visual loading indication', () => {
      render(<LoadingSpinner />);
      
      const spinner = document.querySelector('.spinner');
      const spinnerInner = document.querySelector('.spinnerInner');
      
      expect(spinner).toBeInTheDocument();
      expect(spinnerInner).toBeInTheDocument();
    });

    it('maintains consistent visual structure across sizes', () => {
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
      
      sizes.forEach(size => {
        const { unmount } = render(<LoadingSpinner size={size} />);
        
        expect(document.querySelector('.spinner')).toBeInTheDocument();
        expect(document.querySelector('.spinnerInner')).toBeInTheDocument();
        expect(document.querySelector('.loadingMessage')).toBeInTheDocument();
        
        unmount();
      });
    });
  });

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