import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../ScoreDisplay';

describe('ScoreDisplay - Edge Cases', () => {
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