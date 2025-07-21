import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../ScoreDisplay';

describe('ScoreDisplay - Progress Bars', () => {
  const mockScores = {
    northSouth: 3,
    eastWest: 2
  };

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