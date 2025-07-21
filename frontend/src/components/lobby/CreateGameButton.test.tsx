import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateGameButton } from './CreateGameButton';

describe('CreateGameButton', () => {
  it('renders with correct text', () => {
    render(<CreateGameButton onClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'Create Game' });
    expect(button).toBeInTheDocument();
  });

  it('shows primary variant by default', () => {
    render(<CreateGameButton onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary');
  });

  it('can be disabled', () => {
    render(<CreateGameButton onClick={() => {}} disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<CreateGameButton onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<CreateGameButton onClick={handleClick} disabled />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state when isLoading is true', () => {
    render(<CreateGameButton onClick={() => {}} isLoading />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    // Optionally check for loading indicator
  });

  it('accepts custom className', () => {
    render(<CreateGameButton onClick={() => {}} className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('accepts size prop', () => {
    render(<CreateGameButton onClick={() => {}} size="large" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('large');
  });
});