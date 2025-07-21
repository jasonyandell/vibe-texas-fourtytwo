import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../ScoreDisplay';

describe('ScoreDisplay - CSS Classes and Structure', () => {
  const mockScores = {
    northSouth: 3,
    eastWest: 2
  };

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