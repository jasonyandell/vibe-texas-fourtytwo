import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStatus } from '../GameStatus';

describe('GameStatus - Progress Calculations', () => {
  it('calculates player progress correctly', () => {
    render(<GameStatus status="waiting" playerCount={1} maxPlayers={4} />);
    
    const progressText = screen.getByText('1/4 players');
    const progressContainer = progressText.parentElement;
    const progressBar = progressContainer?.querySelector('div[class*="progressBar"]');
    const progressFill = progressBar?.querySelector('div[class*="progressFill"]');
    expect(progressFill).toHaveStyle({ width: '25%' });
  });

  it('calculates hand progress correctly', () => {
    render(<GameStatus status="playing" currentHand={5} totalHands={10} />);
    
    const progressText = screen.getByText('Hand 5 of 10');
    const progressContainer = progressText.parentElement;
    const progressBar = progressContainer?.querySelector('div[class*="progressBar"]');
    const progressFill = progressBar?.querySelector('div[class*="progressFill"]');
    expect(progressFill).toHaveStyle({ width: '50%' });
  });

  it('handles full player progress', () => {
    render(<GameStatus status="waiting" playerCount={4} maxPlayers={4} />);
    
    const progressText = screen.getByText('4/4 players');
    const progressContainer = progressText.parentElement;
    const progressBar = progressContainer?.querySelector('div[class*="progressBar"]');
    const progressFill = progressBar?.querySelector('div[class*="progressFill"]');
    expect(progressFill).toHaveStyle({ width: '100%' });
  });

  it('handles zero progress', () => {
    render(<GameStatus status="waiting" playerCount={0} maxPlayers={4} />);
    
    const progressText = screen.getByText('0/4 players');
    const progressContainer = progressText.parentElement;
    const progressBar = progressContainer?.querySelector('div[class*="progressBar"]');
    const progressFill = progressBar?.querySelector('div[class*="progressFill"]');
    expect(progressFill).toHaveStyle({ width: '0%' });
  });

  describe('CSS Classes and Structure', () => {
    it('applies correct CSS classes to main container', () => {
      render(<GameStatus status="waiting" />);
      
      const container = screen.getByText('Waiting for Players').closest('div')?.parentElement;
      expect(container).toBeInTheDocument();
    });

    it('applies correct CSS classes to status badge', () => {
      render(<GameStatus status="waiting" />);
      
      const badge = screen.getByText('Waiting for Players').closest('[class*="badge"]');
      expect(badge).toBeInTheDocument();
    });

    it('applies correct CSS classes to progress elements', () => {
      render(<GameStatus status="waiting" playerCount={2} maxPlayers={4} />);
      
      const progressText = screen.getByText('2/4 players');
      expect(progressText.className).toMatch(/progressText/);
      
      const progressContainer = progressText.parentElement;
      const progressBar = progressContainer?.querySelector('div[class*="progressBar"]');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar?.className).toMatch(/progressBar/);
      
      const progressFill = progressBar?.querySelector('div[class*="progressFill"]');
      expect(progressFill).toBeInTheDocument();
      expect(progressFill?.className).toMatch(/progressFill/);
    });
  });
});