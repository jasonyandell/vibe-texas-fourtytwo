import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../ScoreDisplay';

describe('ScoreDisplay - Accessibility', () => {
  const mockScores = {
    northSouth: 3,
    eastWest: 2
  };

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