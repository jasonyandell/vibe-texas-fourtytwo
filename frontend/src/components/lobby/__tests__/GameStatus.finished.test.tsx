import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStatus } from '../GameStatus';

describe('GameStatus - Finished Status', () => {
  it('displays finished status correctly', () => {
    render(<GameStatus status="finished" />);
    
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('uses secondary badge variant for finished status', () => {
    render(<GameStatus status="finished" />);
    
    const badge = screen.getByText('Completed').closest('[class*="badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('secondary');
  });

  it('shows finished icon', () => {
    render(<GameStatus status="finished" />);
    
    const badge = screen.getByText('Completed').closest('[class*="badge"]');
    const icon = badge?.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.querySelector('polyline')).toBeInTheDocument();
  });

  it('does not show progress information for finished games', () => {
    render(<GameStatus status="finished" playerCount={4} currentHand={7} totalHands={7} />);
    
    expect(screen.queryByText(/players/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Hand/)).not.toBeInTheDocument();
  });

  describe('Unknown Status', () => {
    it('handles unknown status gracefully', () => {
      // @ts-expect-error Testing unknown status
      render(<GameStatus status="unknown" />);
      
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('uses default badge variant for unknown status', () => {
      // @ts-expect-error Testing unknown status
      render(<GameStatus status="unknown" />);
      
      const badge = screen.getByText('Unknown').closest('[class*="badge"]');
      expect(badge).toBeInTheDocument();
      // Badge should have default variant (no variant class)
      expect(badge).not.toHaveClass('warning');
      expect(badge).not.toHaveClass('success');
      expect(badge).not.toHaveClass('secondary');
    });

    it('does not show icon for unknown status', () => {
      // @ts-expect-error Testing unknown status
      render(<GameStatus status="unknown" />);
      
      const badge = screen.getByText('Unknown').closest('[class*="badge"]');
      const icon = badge?.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });
  });
});