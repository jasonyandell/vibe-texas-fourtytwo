import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCard } from '../GameCard';
import { mockGame, gameVariants } from './GameCard.test.fixtures';

describe('GameCard - Rendering', () => {
  describe('Basic Rendering', () => {
    it('renders game information correctly', () => {
      render(<GameCard game={mockGame} />);
      
      expect(screen.getByText('Test Game')).toBeInTheDocument();
      expect(screen.getByText('2/4 players')).toBeInTheDocument();
      expect(screen.getByText(/Created/)).toBeInTheDocument();
    });

    it('displays game status badge', () => {
      render(<GameCard game={mockGame} />);
      
      // GameStatus component should render the status
      expect(screen.getByTestId('game-status')).toBeInTheDocument();
    });

    it('renders player slots component', () => {
      render(<GameCard game={mockGame} />);
      
      expect(screen.getByTestId('player-slots')).toBeInTheDocument();
    });
  });

  describe('Game Status Display', () => {
    it('shows score display for playing games', () => {
      render(<GameCard game={gameVariants.playing} />);
      
      expect(screen.getByTestId('score-display')).toBeInTheDocument();
    });

    it('hides score display for waiting games', () => {
      render(<GameCard game={mockGame} />);
      
      expect(screen.queryByTestId('score-display')).not.toBeInTheDocument();
    });

    it('shows finished badge for completed games', () => {
      render(<GameCard game={gameVariants.finished} />);
      
      expect(screen.getByText('Game Completed')).toBeInTheDocument();
    });
  });
});