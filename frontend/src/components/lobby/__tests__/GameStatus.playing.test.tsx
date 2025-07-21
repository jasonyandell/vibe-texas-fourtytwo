import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStatus } from '../GameStatus';

describe('GameStatus - Playing Status', () => {
  it('displays playing status correctly', () => {
    render(<GameStatus status="playing" />);
    
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('shows game progress for playing games', () => {
    render(<GameStatus status="playing" currentHand={3} totalHands={7} />);
    
    expect(screen.getByText('Hand 3 of 7')).toBeInTheDocument();
  });

  it('shows progress bar for playing games with hands', () => {
    render(<GameStatus status="playing" currentHand={3} totalHands={7} />);
    
    const progressText = screen.getByText('Hand 3 of 7');
    const progressContainer = progressText.parentElement;
    const progressBar = progressContainer?.querySelector('div[class*="progressBar"]');
    expect(progressBar).toBeInTheDocument();
    
    const progressFill = progressBar?.querySelector('div[class*="progressFill"]');
    expect(progressFill).toBeInTheDocument();
    expect(progressFill).toHaveStyle({ width: `${(3/7) * 100}%` });
  });

  it('uses success badge variant for playing status', () => {
    render(<GameStatus status="playing" />);
    
    const badge = screen.getByText('In Progress').closest('[class*="badge"]');
    expect(badge).toBeInTheDocument();
    // Check for success variant class from Badge component
    expect(badge).toHaveClass('success');
  });

  it('shows playing icon', () => {
    render(<GameStatus status="playing" />);
    
    // Look for the SVG icon within the badge
    const badge = screen.getByText('In Progress').closest('[class*="badge"]');
    const icon = badge?.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.querySelector('polygon')).toBeInTheDocument();
  });

  it('does not show player progress for playing games', () => {
    render(<GameStatus status="playing" playerCount={4} maxPlayers={4} />);
    
    expect(screen.queryByText('4/4 players')).not.toBeInTheDocument();
  });

  it('handles missing hand information gracefully', () => {
    render(<GameStatus status="playing" />);
    
    expect(screen.queryByText(/Hand/)).not.toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('only shows game progress when both currentHand and totalHands are provided', () => {
    render(<GameStatus status="playing" currentHand={3} />);
    
    expect(screen.queryByText(/Hand/)).not.toBeInTheDocument();
  });

  it('does not show player progress for playing status', () => {
    render(<GameStatus status="playing" playerCount={2} maxPlayers={4} />);
    
    expect(screen.queryByText('2/4 players')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to game progress', () => {
    render(<GameStatus status="playing" currentHand={3} totalHands={7} />);
    
    const gameProgress = screen.getByText('Hand 3 of 7').closest('div');
    expect(gameProgress).toBeInTheDocument();
    expect(gameProgress?.className).toMatch(/gameProgress/);
  });

  it('handles edge case of zero total hands', () => {
    render(<GameStatus status="playing" currentHand={0} totalHands={0} />);
    
    // Should not crash and should not show progress
    expect(screen.queryByText(/Hand/)).not.toBeInTheDocument();
  });
});