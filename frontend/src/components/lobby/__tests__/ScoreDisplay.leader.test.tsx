import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../ScoreDisplay';

describe('ScoreDisplay - Leader Display', () => {
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