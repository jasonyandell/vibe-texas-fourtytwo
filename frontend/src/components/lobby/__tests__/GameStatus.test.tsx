import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStatus } from '../GameStatus';

describe('GameStatus', () => {
  describe('Waiting Status', () => {
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
  });

  describe('Playing Status', () => {
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
  });

  describe('Finished Status', () => {
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

  describe('Default Props', () => {
    it('uses default player count when not provided', () => {
      render(<GameStatus status="waiting" />);
      
      expect(screen.getByText('0/4 players')).toBeInTheDocument();
    });

    it('uses default max players when not provided', () => {
      render(<GameStatus status="waiting" playerCount={2} />);
      
      expect(screen.getByText('2/4 players')).toBeInTheDocument();
    });

    it('handles missing hand information gracefully', () => {
      render(<GameStatus status="playing" />);
      
      expect(screen.queryByText(/Hand/)).not.toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });

  describe('Progress Calculations', () => {
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

    it('handles edge case of zero total hands', () => {
      render(<GameStatus status="playing" currentHand={0} totalHands={0} />);
      
      // Should not crash and should not show progress
      expect(screen.queryByText(/Hand/)).not.toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('only shows game progress when both currentHand and totalHands are provided', () => {
      render(<GameStatus status="playing" currentHand={3} />);
      
      expect(screen.queryByText(/Hand/)).not.toBeInTheDocument();
    });

    it('only shows player progress for waiting status', () => {
      render(<GameStatus status="playing" playerCount={2} maxPlayers={4} />);
      
      expect(screen.queryByText('2/4 players')).not.toBeInTheDocument();
    });

    it('shows both progress types when appropriate', () => {
      render(<GameStatus status="waiting" playerCount={3} maxPlayers={4} />);
      
      expect(screen.getByText('3/4 players')).toBeInTheDocument();
      expect(screen.getByText('Waiting for Players')).toBeInTheDocument();
    });
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

    it('applies correct CSS classes to game progress', () => {
      render(<GameStatus status="playing" currentHand={3} totalHands={7} />);
      
      const gameProgress = screen.getByText('Hand 3 of 7').closest('div');
      expect(gameProgress).toBeInTheDocument();
      expect(gameProgress?.className).toMatch(/gameProgress/);
    });

    it('applies correct CSS classes to player progress', () => {
      render(<GameStatus status="waiting" playerCount={2} maxPlayers={4} />);
      
      const playerProgress = screen.getByText('2/4 players').closest('div');
      expect(playerProgress).toBeInTheDocument();
      expect(playerProgress?.className).toMatch(/playerProgress/);
    });
  });

  describe('Accessibility', () => {
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
});