import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LobbyList } from '../LobbyList';
import { LobbyGame } from '@/types/texas42';

describe('LobbyList', () => {
  const mockGames: LobbyGame[] = [
    {
      id: 'game-1',
      name: 'Test Game 1',
      playerCount: 2,
      maxPlayers: 4,
      status: 'waiting',
      createdAt: '2024-01-01T12:00:00Z'
    },
    {
      id: 'game-2',
      name: 'Test Game 2',
      playerCount: 4,
      maxPlayers: 4,
      status: 'playing',
      createdAt: '2024-01-01T13:00:00Z'
    },
    {
      id: 'game-3',
      name: 'Test Game 3',
      playerCount: 4,
      maxPlayers: 4,
      status: 'finished',
      createdAt: '2024-01-01T14:00:00Z'
    }
  ];

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      render(<LobbyList games={[]} loading={true} />);
      
      expect(screen.getByText('Loading games...')).toBeInTheDocument();
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });

    it('shows loading message with proper accessibility', () => {
      render(<LobbyList games={[]} loading={true} />);
      
      const loadingMessage = screen.getByText('Loading games...');
      expect(loadingMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('does not show games when loading', () => {
      render(<LobbyList games={mockGames} loading={true} />);
      
      expect(screen.queryByText('Test Game 1')).not.toBeInTheDocument();
      expect(screen.getByText('Loading games...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    const mockError = new Error('Failed to load games');

    it('shows error message when error is provided', () => {
      render(<LobbyList games={[]} error={mockError} />);
      
      expect(screen.getByText('Unable to load games')).toBeInTheDocument();
      expect(screen.getByText('Failed to load games')).toBeInTheDocument();
      expect(screen.getByText('Please try refreshing the page.')).toBeInTheDocument();
    });

    it('does not show games when error is present', () => {
      render(<LobbyList games={mockGames} error={mockError} />);
      
      expect(screen.queryByText('Test Game 1')).not.toBeInTheDocument();
      expect(screen.getByText('Unable to load games')).toBeInTheDocument();
    });

    it('prioritizes error over loading state', () => {
      render(<LobbyList games={[]} loading={true} error={mockError} />);
      
      expect(screen.getByText('Unable to load games')).toBeInTheDocument();
      expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no games are available', () => {
      render(<LobbyList games={[]} />);
      
      expect(screen.getByText('No games available')).toBeInTheDocument();
      expect(screen.getByText(/There are currently no active games/)).toBeInTheDocument();
    });

    it('shows empty state with create game prompt', () => {
      render(<LobbyList games={[]} />);
      
      expect(screen.getByText('Create a new game to get started!')).toBeInTheDocument();
    });

    it('does not show empty state when loading', () => {
      render(<LobbyList games={[]} loading={true} />);
      
      expect(screen.queryByText('No games available')).not.toBeInTheDocument();
    });

    it('does not show empty state when error is present', () => {
      const mockError = new Error('Test error');
      render(<LobbyList games={[]} error={mockError} />);
      
      expect(screen.queryByText('No games available')).not.toBeInTheDocument();
    });
  });

  describe('Games Display', () => {
    it('renders all games when available', () => {
      render(<LobbyList games={mockGames} />);
      
      expect(screen.getByText('Test Game 1')).toBeInTheDocument();
      expect(screen.getByText('Test Game 2')).toBeInTheDocument();
      expect(screen.getByText('Test Game 3')).toBeInTheDocument();
    });

    it('renders games in a grid layout', () => {
      render(<LobbyList games={mockGames} />);
      
      const gameGrid = screen.getByText('Test Game 1').closest('.gameGrid');
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
  });

  describe('State Transitions', () => {
    it('transitions from loading to games display', () => {
      const { rerender } = render(<LobbyList games={[]} loading={true} />);
      
      expect(screen.getByText('Loading games...')).toBeInTheDocument();
      
      rerender(<LobbyList games={mockGames} loading={false} />);
      
      expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
      expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    });

    it('transitions from loading to empty state', () => {
      const { rerender } = render(<LobbyList games={[]} loading={true} />);
      
      expect(screen.getByText('Loading games...')).toBeInTheDocument();
      
      rerender(<LobbyList games={[]} loading={false} />);
      
      expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
      expect(screen.getByText('No games available')).toBeInTheDocument();
    });

    it('transitions from loading to error state', () => {
      const mockError = new Error('Load failed');
      const { rerender } = render(<LobbyList games={[]} loading={true} />);
      
      expect(screen.getByText('Loading games...')).toBeInTheDocument();
      
      rerender(<LobbyList games={[]} loading={false} error={mockError} />);
      
      expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
      expect(screen.getByText('Unable to load games')).toBeInTheDocument();
    });

    it('transitions from error to games display', () => {
      const mockError = new Error('Load failed');
      const { rerender } = render(<LobbyList games={[]} error={mockError} />);
      
      expect(screen.getByText('Unable to load games')).toBeInTheDocument();
      
      rerender(<LobbyList games={mockGames} error={null} />);
      
      expect(screen.queryByText('Unable to load games')).not.toBeInTheDocument();
      expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('handles undefined loading prop', () => {
      render(<LobbyList games={mockGames} />);
      
      expect(screen.queryByText('Loading games...')).not.toBeInTheDocument();
      expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    });

    it('handles undefined error prop', () => {
      render(<LobbyList games={mockGames} />);
      
      expect(screen.queryByText('Unable to load games')).not.toBeInTheDocument();
      expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    });

    it('handles null error prop', () => {
      render(<LobbyList games={mockGames} error={null} />);
      
      expect(screen.queryByText('Unable to load games')).not.toBeInTheDocument();
      expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    });

    it('handles empty games array', () => {
      render(<LobbyList games={[]} />);
      
      expect(screen.getByText('No games available')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Structure', () => {
    it('applies correct CSS classes to container', () => {
      render(<LobbyList games={mockGames} />);
      
      const container = screen.getByText('Test Game 1').closest('.lobbyList');
      expect(container).toBeInTheDocument();
    });

    it('applies correct CSS classes to game grid', () => {
      render(<LobbyList games={mockGames} />);
      
      const gameGrid = screen.getByText('Test Game 1').closest('.gameGrid');
      expect(gameGrid).toBeInTheDocument();
    });

    it('applies correct CSS classes to error state', () => {
      const mockError = new Error('Test error');
      render(<LobbyList games={[]} error={mockError} />);
      
      const errorState = screen.getByText('Unable to load games').closest('.errorState');
      expect(errorState).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders large number of games efficiently', () => {
      const manyGames = Array.from({ length: 50 }, (_, i) => ({
        id: `game-${i}`,
        name: `Game ${i}`,
        playerCount: 2,
        maxPlayers: 4,
        status: 'waiting' as const,
        createdAt: '2024-01-01T12:00:00Z'
      }));

      const startTime = performance.now();
      render(<LobbyList games={manyGames} />);
      const endTime = performance.now();

      // Should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
      
      // Verify first and last games are rendered
      expect(screen.getByText('Game 0')).toBeInTheDocument();
      expect(screen.getByText('Game 49')).toBeInTheDocument();
    });

    it('handles rapid state changes without errors', () => {
      const { rerender } = render(<LobbyList games={[]} loading={true} />);
      
      // Rapid state changes
      rerender(<LobbyList games={mockGames} loading={false} />);
      rerender(<LobbyList games={[]} loading={true} />);
      rerender(<LobbyList games={mockGames} loading={false} />);
      
      expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper semantic structure', () => {
      render(<LobbyList games={mockGames} />);
      
      // Games should be in a list-like structure
      const gameGrid = screen.getByText('Test Game 1').closest('.gameGrid');
      expect(gameGrid).toBeInTheDocument();
    });

    it('provides accessible loading state', () => {
      render(<LobbyList games={[]} loading={true} />);
      
      const loadingMessage = screen.getByText('Loading games...');
      expect(loadingMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('provides accessible error state', () => {
      const mockError = new Error('Test error');
      render(<LobbyList games={[]} error={mockError} />);
      
      const errorHeading = screen.getByRole('heading', { name: 'Unable to load games' });
      expect(errorHeading).toBeInTheDocument();
    });

    it('provides accessible empty state', () => {
      render(<LobbyList games={[]} />);
      
      const emptyHeading = screen.getByRole('heading', { name: 'No games available' });
      expect(emptyHeading).toBeInTheDocument();
    });
  });
});