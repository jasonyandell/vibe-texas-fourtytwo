import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStatus } from '../GameStatus';

describe('GameStatus - Waiting Status', () => {
  it('displays waiting status correctly', () => {
    render(<GameStatus status="waiting" playerCount={2} maxPlayers={4} />);
    
    expect(screen.getByText('Waiting for Players')).toBeInTheDocument();
  });

  it('shows player progress for waiting games', () => {
    render(<GameStatus status="waiting" playerCount={2} maxPlayers={4} />);
    
    expect(screen.getByText('2/4 players')).toBeInTheDocument();
  });

  it('shows progress bar for waiting games', () => {
    render(<GameStatus status="waiting" playerCount={2} maxPlayers={4} />);
    
    const progressText = screen.getByText('2/4 players');
    const progressContainer = progressText.parentElement;
    const progressBar = progressContainer?.querySelector('div[class*="progressBar"]');
    expect(progressBar).toBeInTheDocument();
    
    const progressFill = progressBar?.querySelector('div[class*="progressFill"]');
    expect(progressFill).toBeInTheDocument();
    expect(progressFill).toHaveStyle({ width: '50%' });
  });

  it('uses warning badge variant for waiting status', () => {
    render(<GameStatus status="waiting" />);
    
    const badge = screen.getByText('Waiting for Players').closest('[class*="badge"]');
    expect(badge).toBeInTheDocument();
    // Check for warning variant class from Badge component
    expect(badge).toHaveClass('warning');
  });

  it('shows waiting icon', () => {
    render(<GameStatus status="waiting" />);
    
    // Look for the SVG icon within the badge
    const badge = screen.getByText('Waiting for Players').closest('[class*="badge"]');
    const icon = badge?.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('uses default player count when not provided', () => {
    render(<GameStatus status="waiting" />);
    
    expect(screen.getByText('0/4 players')).toBeInTheDocument();
  });

  it('uses default max players when not provided', () => {
    render(<GameStatus status="waiting" playerCount={2} />);
    
    expect(screen.getByText('2/4 players')).toBeInTheDocument();
  });

  it('shows player progress for waiting status', () => {
    render(<GameStatus status="waiting" playerCount={3} maxPlayers={4} />);
    
    expect(screen.getByText('3/4 players')).toBeInTheDocument();
    expect(screen.getByText('Waiting for Players')).toBeInTheDocument();
  });

  it('applies correct CSS classes to player progress', () => {
    render(<GameStatus status="waiting" playerCount={2} maxPlayers={4} />);
    
    const playerProgress = screen.getByText('2/4 players').closest('div');
    expect(playerProgress).toBeInTheDocument();
    expect(playerProgress?.className).toMatch(/playerProgress/);
  });
});