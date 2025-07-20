import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

export describe('LoadingSpinner - Custom Messages', () => {
  it('displays custom message when provided', () => {
    render(<LoadingSpinner message="Loading players..." />);
    
    expect(screen.getByText('Loading players...')).toBeInTheDocument();
    expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
  });

  it('handles empty message', () => {
    render(<LoadingSpinner message="" />);
    
    const messageElement = document.querySelector('[class*="loadingMessage"]');
    expect(messageElement).toBeInTheDocument();
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

  it('can override default message', () => {
    render(<LoadingSpinner message="Custom loading message" />);
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
  });
});