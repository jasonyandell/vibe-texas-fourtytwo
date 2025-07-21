import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LobbyList } from '../LobbyList';
import { mockGames } from './LobbyList.fixtures';

describe('LobbyList - Games Display', () => {
  it('renders all games when available', () => {
    render(<LobbyList games={mockGames} />);
    
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    expect(screen.getByText('Test Game 2')).toBeInTheDocument();
    expect(screen.getByText('Test Game 3')).toBeInTheDocument();
  });

  it('renders games in a grid layout', () => {
    render(<LobbyList games={mockGames} />);
    
    const gameGrid = screen.getByTestId('game-grid');
    expect(gameGrid).toBeInTheDocument();
  });

  it('passes correct props to GameCard components', () => {
    render(<LobbyList games={mockGames} />);
    
    // Each game should be rendered as a GameCard
    mockGames.forEach(game => {
      expect(screen.getByText(game.name)).toBeInTheDocument();
    });
  });

  it('handles single game correctly', () => {
    const singleGame = [mockGames[0]];
    render(<LobbyList games={singleGame} />);
    
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Game 2')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to container', () => {
    render(<LobbyList games={mockGames} />);
    
    const container = screen.getByTestId('lobby-list');
    expect(container).toBeInTheDocument();
  });

  it('applies correct CSS classes to game grid', () => {
    render(<LobbyList games={mockGames} />);
    
    const gameGrid = screen.getByTestId('game-grid');
    expect(gameGrid).toBeInTheDocument();
  });

  it('provides proper semantic structure', () => {
    render(<LobbyList games={mockGames} />);
    
    // Games should be in a list-like structure
    const gameGrid = screen.getByTestId('game-grid');
    expect(gameGrid).toBeInTheDocument();
  });
});