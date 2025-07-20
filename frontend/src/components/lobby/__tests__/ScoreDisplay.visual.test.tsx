import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../ScoreDisplay';

describe('ScoreDisplay - Visual Indicators', () => {
  const mockScores = {
    northSouth: 3,
    eastWest: 2
  };

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