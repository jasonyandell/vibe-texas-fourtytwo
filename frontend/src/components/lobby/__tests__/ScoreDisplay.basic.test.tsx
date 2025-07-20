import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../ScoreDisplay';

describe('ScoreDisplay - Basic Rendering', () => {
  const mockScores = {
    northSouth: 3,
    eastWest: 2
  };

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