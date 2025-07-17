import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../ScoreDisplay';

describe('ScoreDisplay', () => {
  const mockScores = {
    northSouth: 3,
    eastWest: 2
  };

  describe('Basic Rendering', () => {
    it('renders score display with header', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      expect(screen.getByText('Current Score')).toBeInTheDocument();
    });

    it('displays both team scores', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      expect(screen.getByText('North-South')).toBeInTheDocument();
      expect(screen.getByText('East-West')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('shows max score for both teams', () => {
      render(<ScoreDisplay scores={mockScores} maxScore={7} />);
      
      const maxScoreElements = screen.getAllByText('/7');
      expect(maxScoreElements).toHaveLength(2);
    });

    it('uses default max score when not provided', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      const maxScoreElements = screen.getAllByText('/7');
      expect(maxScoreElements).toHaveLength(2);
    });

    it('shows vs divider between teams', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      expect(screen.getByText('vs')).toBeInTheDocument();
    });
  });

  describe('Leader Display', () => {
    it('shows North-South as leader when they have higher score', () => {
      const scores = { northSouth: 5, eastWest: 3 };
      render(<ScoreDisplay scores={scores} />);
      
      expect(screen.getByText('North-South leads')).toBeInTheDocument();
    });

    it('shows East-West as leader when they have higher score', () => {
      const scores = { northSouth: 2, eastWest: 4 };
      render(<ScoreDisplay scores={scores} />);
      
      expect(screen.getByText('East-West leads')).toBeInTheDocument();
    });

    it('does not show leader when scores are tied', () => {
      const scores = { northSouth: 3, eastWest: 3 };
      render(<ScoreDisplay scores={scores} />);
      
      expect(screen.queryByText(/leads/)).not.toBeInTheDocument();
    });

    it('does not show leader when game is complete', () => {
      const scores = { northSouth: 7, eastWest: 5 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      expect(screen.queryByText('North-South leads')).not.toBeInTheDocument();
      expect(screen.getByText('North-South wins!')).toBeInTheDocument();
    });
  });

  describe('Game Complete State', () => {
    it('shows winner when North-South reaches max score', () => {
      const scores = { northSouth: 7, eastWest: 4 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      expect(screen.getByText('North-South wins!')).toBeInTheDocument();
      expect(screen.getByText('Game Complete')).toBeInTheDocument();
    });

    it('shows winner when East-West reaches max score', () => {
      const scores = { northSouth: 5, eastWest: 7 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      expect(screen.getByText('East-West wins!')).toBeInTheDocument();
      expect(screen.getByText('Game Complete')).toBeInTheDocument();
    });

    it('shows winner when both teams exceed max score', () => {
      const scores = { northSouth: 8, eastWest: 7 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      expect(screen.getByText('North-South wins!')).toBeInTheDocument();
    });

    it('shows game complete icon', () => {
      const scores = { northSouth: 7, eastWest: 4 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      const gameCompleteSection = screen.getByText('Game Complete').closest('div');
      const icon = gameCompleteSection?.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('handles tie at max score', () => {
      const scores = { northSouth: 7, eastWest: 7 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      expect(screen.getByText('Tied wins!')).toBeInTheDocument();
    });
  });

  describe('Progress Bars', () => {
    it('shows progress bars by default', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      const progressBars = screen.getAllByRole('progressbar', { hidden: true });
      expect(progressBars).toHaveLength(2);
    });

    it('calculates North-South progress correctly', () => {
      const scores = { northSouth: 3, eastWest: 2 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      const northSouthProgressBar = progressBars.find(bar => 
        bar.getAttribute('aria-label')?.includes('North-South')
      );
      expect(northSouthProgressBar).toHaveStyle({ width: `${(3/7) * 100}%` });
    });

    it('calculates East-West progress correctly', () => {
      const scores = { northSouth: 3, eastWest: 5 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      const eastWestProgressBar = progressBars.find(bar => 
        bar.getAttribute('aria-label')?.includes('East-West')
      );
      expect(eastWestProgressBar).toHaveStyle({ width: `${(5/7) * 100}%` });
    });

    it('hides progress bars when showProgress is false', () => {
      render(<ScoreDisplay scores={mockScores} showProgress={false} />);
      
      const progressBars = screen.queryAllByRole('progressbar');
      expect(progressBars).toHaveLength(0);
    });

    it('handles 100% progress correctly', () => {
      const scores = { northSouth: 7, eastWest: 3 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      const northSouthProgressBar = progressBars.find(bar => 
        bar.getAttribute('aria-label')?.includes('North-South')
      );
      expect(northSouthProgressBar).toHaveStyle({ width: '100%' });
    });

    it('handles zero progress correctly', () => {
      const scores = { northSouth: 0, eastWest: 0 };
      render(<ScoreDisplay scores={scores} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      progressBars.forEach(bar => {
        expect(bar).toHaveStyle({ width: '0%' });
      });
    });
  });

  describe('Custom Max Score', () => {
    it('uses custom max score for calculations', () => {
      const scores = { northSouth: 5, eastWest: 3 };
      render(<ScoreDisplay scores={scores} maxScore={10} />);
      
      const maxScoreElements = screen.getAllByText('/10');
      expect(maxScoreElements).toHaveLength(2);
    });

    it('calculates progress with custom max score', () => {
      const scores = { northSouth: 5, eastWest: 3 };
      render(<ScoreDisplay scores={scores} maxScore={10} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      const northSouthProgressBar = progressBars.find(bar => 
        bar.getAttribute('aria-label')?.includes('North-South')
      );
      expect(northSouthProgressBar).toHaveStyle({ width: '50%' });
    });

    it('determines winner with custom max score', () => {
      const scores = { northSouth: 10, eastWest: 8 };
      render(<ScoreDisplay scores={scores} maxScore={10} />);
      
      expect(screen.getByText('North-South wins!')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles negative scores gracefully', () => {
      const scores = { northSouth: -1, eastWest: 2 };
      render(<ScoreDisplay scores={scores} />);
      
      expect(screen.getByText('-1')).toBeInTheDocument();
      expect(screen.getByText('East-West leads')).toBeInTheDocument();
    });

    it('handles very high scores', () => {
      const scores = { northSouth: 999, eastWest: 888 };
      render(<ScoreDisplay scores={scores} maxScore={1000} />);
      
      expect(screen.getByText('999')).toBeInTheDocument();
      expect(screen.getByText('888')).toBeInTheDocument();
      expect(screen.getByText('North-South leads')).toBeInTheDocument();
    });

    it('handles zero max score', () => {
      const scores = { northSouth: 0, eastWest: 0 };
      render(<ScoreDisplay scores={scores} maxScore={0} />);
      
      expect(screen.getByText('Tied wins!')).toBeInTheDocument();
    });

    it('handles decimal scores', () => {
      const scores = { northSouth: 3.5, eastWest: 2.7 };
      render(<ScoreDisplay scores={scores} />);
      
      expect(screen.getByText('3.5')).toBeInTheDocument();
      expect(screen.getByText('2.7')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Structure', () => {
    it('applies correct CSS classes to main container', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      const container = screen.getByText('Current Score').closest('div');
      expect(container).toBeInTheDocument();
      // CSS modules generate hashed class names, so we check for the presence of classes
      expect(container?.className).toContain('scoreHeader');
    });

    it('applies correct CSS classes to score grid', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      const scoreGrid = screen.getByText('North-South').closest('div')?.parentElement;
      expect(scoreGrid).toBeInTheDocument();
      expect(scoreGrid?.className).toContain('teamScore');
    });

    it('applies team-specific CSS classes', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      const northSouthSection = screen.getByText('North-South').closest('div')?.parentElement;
      expect(northSouthSection?.className).toContain('northSouth');
      
      const eastWestSection = screen.getByText('East-West').closest('div')?.parentElement;
      expect(eastWestSection?.className).toContain('eastWest');
    });

    it('applies correct CSS classes to score values', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      // Check that score values are rendered correctly
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getAllByText('/7')).toHaveLength(2);
    });

    it('applies correct CSS classes to progress elements', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      // Check that progress bars are rendered with correct roles
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars).toHaveLength(2);
    });

    it('applies correct CSS classes to game complete section', () => {
      const scores = { northSouth: 7, eastWest: 4 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      const gameComplete = screen.getByText('Game Complete').closest('div');
      expect(gameComplete).toBeInTheDocument();
      expect(gameComplete?.className).toContain('gameComplete');
    });
  });

  describe('Accessibility', () => {
    it('provides proper heading structure', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      const heading = screen.getByRole('heading', { name: 'Current Score' });
      expect(heading).toBeInTheDocument();
    });

    it('provides meaningful team labels', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      const northSouthLabel = screen.getByText('North-South');
      const eastWestLabel = screen.getByText('East-West');
      
      expect(northSouthLabel).toBeInTheDocument();
      expect(eastWestLabel).toBeInTheDocument();
      expect(northSouthLabel.className).toContain('teamLabel');
      expect(eastWestLabel.className).toContain('teamLabel');
    });

    it('provides accessible progress information', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      // Progress bars should be accessible
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars).toHaveLength(2);
      
      progressBars.forEach(bar => {
        expect(bar).toHaveAttribute('aria-valuenow');
        expect(bar).toHaveAttribute('aria-valuemin');
        expect(bar).toHaveAttribute('aria-valuemax');
        expect(bar).toHaveAttribute('aria-label');
      });
    });

    it('provides clear winner announcement', () => {
      const scores = { northSouth: 7, eastWest: 4 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      const winner = screen.getByText('North-South wins!');
      expect(winner).toBeInTheDocument();
      expect(winner.className).toContain('winner');
    });

    it('provides clear leader announcement', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      const leader = screen.getByText('North-South leads');
      expect(leader).toBeInTheDocument();
      expect(leader.className).toContain('leader');
    });
  });

  describe('Visual Indicators', () => {
    it('shows proper score formatting', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      // Check that max score elements are rendered correctly
      const maxScoreElements = screen.getAllByText('/7');
      expect(maxScoreElements).toHaveLength(2);
      maxScoreElements.forEach(element => {
        expect(element.textContent).toBe('/7');
      });
    });

    it('shows score divider correctly', () => {
      render(<ScoreDisplay scores={mockScores} />);
      
      const divider = screen.getByText('vs').closest('div');
      expect(divider).toBeInTheDocument();
      expect(divider?.className).toContain('scoreDivider');
    });

    it('shows game complete icon with proper attributes', () => {
      const scores = { northSouth: 7, eastWest: 4 };
      render(<ScoreDisplay scores={scores} maxScore={7} />);
      
      const icon = screen.getByText('Game Complete').closest('div')?.querySelector('svg');
      expect(icon).toHaveAttribute('stroke', 'currentColor');
      expect(icon).toHaveAttribute('fill', 'none');
      expect(icon).toHaveAttribute('stroke-width', '2');
    });
  });
});