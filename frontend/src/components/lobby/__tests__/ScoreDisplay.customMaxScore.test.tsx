import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../ScoreDisplay';

describe('ScoreDisplay - Custom Max Score', () => {
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