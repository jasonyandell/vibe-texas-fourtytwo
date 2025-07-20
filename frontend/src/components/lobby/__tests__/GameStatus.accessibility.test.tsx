import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStatus } from '../GameStatus';

describe('GameStatus - Accessibility', () => {
  it('provides proper semantic structure', () => {
    render(<GameStatus status="waiting" playerCount={2} maxPlayers={4} />);
    
    // Status should be in a badge/button-like element
    const statusBadge = screen.getByText('Waiting for Players');
    expect(statusBadge.closest('[class*="badge"]')).toBeInTheDocument();
  });

  it('includes icons with proper attributes', () => {
    render(<GameStatus status="waiting" />);
    
    const badge = screen.getByText('Waiting for Players').closest('[class*="badge"]');
    const icon = badge?.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('stroke', 'currentColor');
    expect(icon).toHaveAttribute('fill', 'none');
  });

  it('provides meaningful progress information', () => {
    render(<GameStatus status="waiting" playerCount={2} maxPlayers={4} />);
    
    const progressText = screen.getByText('2/4 players');
    expect(progressText).toBeInTheDocument();
  });

  it('provides meaningful game progress information', () => {
    render(<GameStatus status="playing" currentHand={3} totalHands={7} />);
    
    const progressText = screen.getByText('Hand 3 of 7');
    expect(progressText).toBeInTheDocument();
  });
});