import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../ScoreDisplay';

describe('ScoreDisplay - Game Complete State', () => {
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