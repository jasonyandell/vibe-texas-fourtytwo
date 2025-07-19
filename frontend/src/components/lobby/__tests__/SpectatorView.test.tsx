import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpectatorView, SpectatorInfo } from '../SpectatorView';
import { GameState, Player } from '@/types/texas42';

// Mock the child components
vi.mock('@/components/DominoHand', () => ({
  DominoHand: ({ dominoes, faceUp, playable }: any) => (
    <div data-testid="domino-hand" data-face-up={faceUp} data-playable={playable}>
      {dominoes.length} dominoes
    </div>
  )
}));

vi.mock('@/components/GameBoard', () => ({
  GameBoard: ({ gameState, spectatorMode }: any) => (
    <div data-testid="game-board" data-spectator-mode={spectatorMode}>
      Game Board for {gameState.id}
    </div>
  )
}));

describe('SpectatorView', () => {
  const mockGameState: GameState = {
    id: 'test-game-1',
    phase: 'playing',
    currentPlayer: 'player-1',
    players: [
      {
        id: 'player-1',
        name: 'Alice',
        position: 'north',
        hand: [{ high: 6, low: 6 }, { high: 5, low: 4 }],
        isConnected: true,
        isReady: true
      },
      {
        id: 'player-2',
        name: 'Bob',
        position: 'east',
        hand: [{ high: 3, low: 2 }, { high: 1, low: 0 }],
        isConnected: true,
        isReady: true
      },
      {
        id: 'player-3',
        name: 'Carol',
        position: 'south',
        hand: [{ high: 4, low: 3 }],
        isConnected: false,
        isReady: true
      },
      {
        id: 'player-4',
        name: 'Dave',
        position: 'west',
        hand: [{ high: 2, low: 1 }, { high: 6, low: 5 }, { high: 4, low: 4 }],
        isConnected: true,
        isReady: true
      }
    ],
    trump: 'doubles',
    currentTrick: [],
    score: { northSouth: 3, eastWest: 2 },
    bids: [],
    dealer: 'player-1'
  };

  const mockSpectators: SpectatorInfo[] = [
    {
      id: 'spectator-1',
      name: 'Spectator One',
      joinedAt: '2024-01-01T12:00:00Z'
    },
    {
      id: 'spectator-2',
      name: 'Spectator Two',
      joinedAt: '2024-01-01T12:05:00Z'
    }
  ];

  const mockHandlers = {
    onLeaveSpectating: vi.fn(),
    onJoinAsPlayer: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders spectator view with game information', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      expect(screen.getByText('Spectating: test-game-1')).toBeInTheDocument();
      expect(screen.getByText('Phase: playing')).toBeInTheDocument();
      expect(screen.getByText('Current: Alice')).toBeInTheDocument();
    });

    it('renders all player hands', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Carol')).toBeInTheDocument();
      expect(screen.getByText('Dave')).toBeInTheDocument();
    });

    it('shows player connection status', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      expect(screen.getByText('Connected')).toBeInTheDocument();
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });

    it('displays hand counts for each player', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      expect(screen.getByText('2 dominoes')).toBeInTheDocument(); // Alice
      expect(screen.getByText('1 dominoes')).toBeInTheDocument(); // Carol
      expect(screen.getByText('3 dominoes')).toBeInTheDocument(); // Dave
    });
  });

  describe('Game Board Display', () => {
    it('shows game board when game is playing', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.getByText('Game Board for test-game-1')).toBeInTheDocument();
    });

    it('passes spectator mode to game board', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toHaveAttribute('data-spectator-mode', 'true');
    });

    it('does not show game board for non-playing phases', () => {
      const waitingGameState = { ...mockGameState, phase: 'waiting' as const };
      render(<SpectatorView gameState={waitingGameState} spectators={mockSpectators} />);
      
      expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
    });
  });

  describe('Player Hand Display', () => {
    it('shows all hands face-up by default', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const dominoHands = screen.getAllByTestId('domino-hand');
      dominoHands.forEach(hand => {
        expect(hand).toHaveAttribute('data-face-up', 'true');
        expect(hand).toHaveAttribute('data-playable', 'false');
      });
    });

    it('allows toggling show all hands', async () => {
      const user = userEvent.setup();
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const showAllHandsCheckbox = screen.getByLabelText('Show All Hands');
      expect(showAllHandsCheckbox).toBeChecked();
      
      await user.click(showAllHandsCheckbox);
      expect(showAllHandsCheckbox).not.toBeChecked();
    });

    it('hides hands when show all hands is disabled', async () => {
      const user = userEvent.setup();
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const showAllHandsCheckbox = screen.getByLabelText('Show All Hands');
      await user.click(showAllHandsCheckbox);
      
      expect(screen.queryByText('Player Hands')).not.toBeInTheDocument();
    });

    it('allows selecting individual players to focus on', async () => {
      const user = userEvent.setup();
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const playerSelect = screen.getByLabelText('Focus on Player:');
      await user.selectOptions(playerSelect, 'player-1');
      
      expect(screen.getByText('Focused Player')).toBeInTheDocument();
    });

    it('shows focused player section when player is selected', async () => {
      const user = userEvent.setup();
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const playerSelect = screen.getByLabelText('Focus on Player:');
      await user.selectOptions(playerSelect, 'player-2');
      
      expect(screen.getByText('Focused Player')).toBeInTheDocument();
    });
  });

  describe('Player Selection', () => {
    it('allows clicking on player hands to select them', async () => {
      const user = userEvent.setup();
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const aliceHand = screen.getByText('Alice').closest('.playerHandContainer');
      await user.click(aliceHand!);
      
      expect(aliceHand).toHaveClass('selected');
    });

    it('deselects player when clicked again', async () => {
      const user = userEvent.setup();
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const aliceHand = screen.getByText('Alice').closest('.playerHandContainer');
      await user.click(aliceHand!);
      expect(aliceHand).toHaveClass('selected');
      
      await user.click(aliceHand!);
      expect(aliceHand).not.toHaveClass('selected');
    });

    it('shows player select dropdown with all players', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const playerSelect = screen.getByLabelText('Focus on Player:');
      expect(playerSelect).toBeInTheDocument();
      
      expect(screen.getByText('Alice (north)')).toBeInTheDocument();
      expect(screen.getByText('Bob (east)')).toBeInTheDocument();
      expect(screen.getByText('Carol (south)')).toBeInTheDocument();
      expect(screen.getByText('Dave (west)')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('shows join as player button when game has space', () => {
      const gameWithSpace = {
        ...mockGameState,
        players: mockGameState.players.slice(0, 3) // Only 3 players
      };
      
      render(
        <SpectatorView 
          gameState={gameWithSpace} 
          spectators={mockSpectators} 
          {...mockHandlers}
        />
      );
      
      expect(screen.getByRole('button', { name: 'Join as Player' })).toBeInTheDocument();
    });

    it('hides join as player button when game is full', () => {
      render(
        <SpectatorView 
          gameState={mockGameState} 
          spectators={mockSpectators} 
          {...mockHandlers}
        />
      );
      
      expect(screen.queryByRole('button', { name: 'Join as Player' })).not.toBeInTheDocument();
    });

    it('shows stop spectating button when handler is provided', () => {
      render(
        <SpectatorView 
          gameState={mockGameState} 
          spectators={mockSpectators} 
          {...mockHandlers}
        />
      );
      
      expect(screen.getByRole('button', { name: 'Stop Spectating' })).toBeInTheDocument();
    });

    it('calls onJoinAsPlayer when join button is clicked', async () => {
      const user = userEvent.setup();
      const gameWithSpace = {
        ...mockGameState,
        players: mockGameState.players.slice(0, 3)
      };
      
      render(
        <SpectatorView 
          gameState={gameWithSpace} 
          spectators={mockSpectators} 
          {...mockHandlers}
        />
      );
      
      const joinButton = screen.getByRole('button', { name: 'Join as Player' });
      await user.click(joinButton);
      
      expect(mockHandlers.onJoinAsPlayer).toHaveBeenCalled();
    });

    it('calls onLeaveSpectating when stop button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <SpectatorView 
          gameState={mockGameState} 
          spectators={mockSpectators} 
          {...mockHandlers}
        />
      );
      
      const stopButton = screen.getByRole('button', { name: 'Stop Spectating' });
      await user.click(stopButton);
      
      expect(mockHandlers.onLeaveSpectating).toHaveBeenCalled();
    });
  });

  describe('Spectator List', () => {
    it('shows spectator list by default', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      expect(screen.getByText('Spectators (2)')).toBeInTheDocument();
      expect(screen.getByText('Spectator One')).toBeInTheDocument();
      expect(screen.getByText('Spectator Two')).toBeInTheDocument();
    });

    it('hides spectator list when showSpectatorList is false', () => {
      render(
        <SpectatorView 
          gameState={mockGameState} 
          spectators={mockSpectators} 
          showSpectatorList={false}
        />
      );
      
      expect(screen.queryByText('Spectators (2)')).not.toBeInTheDocument();
    });

    it('shows current spectator with "You" badge', () => {
      render(
        <SpectatorView 
          gameState={mockGameState} 
          spectators={mockSpectators} 
          currentSpectatorId="spectator-1"
        />
      );
      
      expect(screen.getByText('You')).toBeInTheDocument();
    });

    it('shows join times for spectators', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      // Should show formatted join times
      expect(screen.getByText(/Joined/)).toBeInTheDocument();
    });

    it('shows empty message when no spectators', () => {
      render(<SpectatorView gameState={mockGameState} spectators={[]} />);
      
      expect(screen.getByText('No other spectators')).toBeInTheDocument();
    });
  });

  describe('Badge Variants', () => {
    it('shows correct badge variants for connection status', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const connectedBadges = screen.getAllByText('Connected');
      const disconnectedBadges = screen.getAllByText('Disconnected');
      
      connectedBadges.forEach(badge => {
        expect(badge.closest('.badge')).toHaveClass('success');
      });
      
      disconnectedBadges.forEach(badge => {
        expect(badge.closest('.badge')).toHaveClass('danger');
      });
    });

    it('shows correct badge variants for game phase', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const phaseBadge = screen.getByText('Phase: playing');
      expect(phaseBadge.closest('.badge')).toHaveClass('primary');
    });

    it('shows correct badge variants for current player', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const currentPlayerBadge = screen.getByText('Current: Alice');
      expect(currentPlayerBadge.closest('.badge')).toHaveClass('secondary');
    });
  });

  describe('View Controls', () => {
    it('renders view controls section', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      expect(screen.getByLabelText('Show All Hands')).toBeInTheDocument();
      expect(screen.getByLabelText('Focus on Player:')).toBeInTheDocument();
    });

    it('has show all hands checkbox checked by default', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const checkbox = screen.getByLabelText('Show All Hands');
      expect(checkbox).toBeChecked();
    });

    it('has all players option selected by default in dropdown', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const select = screen.getByLabelText('Focus on Player:') as HTMLSelectElement;
      expect(select.value).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('handles missing handlers gracefully', () => {
      expect(() => {
        render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      }).not.toThrow();
    });

    it('handles empty players array', () => {
      const emptyGameState = { ...mockGameState, players: [] };
      
      expect(() => {
        render(<SpectatorView gameState={emptyGameState} spectators={mockSpectators} />);
      }).not.toThrow();
    });

    it('handles missing current player', () => {
      const gameStateWithoutCurrentPlayer = { ...mockGameState, currentPlayer: undefined };
      
      expect(() => {
        render(<SpectatorView gameState={gameStateWithoutCurrentPlayer} spectators={mockSpectators} />);
      }).not.toThrow();
    });

    it('handles invalid spectator ID', () => {
      render(
        <SpectatorView 
          gameState={mockGameState} 
          spectators={mockSpectators} 
          currentSpectatorId="invalid-id"
        />
      );
      
      expect(screen.queryByText('You')).not.toBeInTheDocument();
    });
  });

  describe('CSS Classes and Structure', () => {
    it('applies correct CSS classes to main container', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const container = screen.getByText('Spectating: test-game-1').closest('.spectatorView');
      expect(container).toBeInTheDocument();
    });

    it('applies position classes to player hands', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const aliceHand = screen.getByText('Alice').closest('.playerHandContainer');
      expect(aliceHand).toHaveClass('north');
    });

    it('applies selected class to clicked player hands', async () => {
      const user = userEvent.setup();
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const aliceHand = screen.getByText('Alice').closest('.playerHandContainer');
      await user.click(aliceHand!);
      
      expect(aliceHand).toHaveClass('selected');
    });
  });

  describe('Accessibility', () => {
    it('provides proper heading structure', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      expect(screen.getByRole('heading', { name: 'Spectating: test-game-1' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Player Hands' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Spectators (2)' })).toBeInTheDocument();
    });

    it('provides accessible form controls', () => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
      
      const checkbox = screen.getByLabelText('Show All Hands');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
      
      const select = screen.getByLabelText('Focus on Player:');
      expect(select).toHaveAttribute('id', 'player-select');
    });

    it('provides accessible buttons', () => {
      render(
        <SpectatorView 
          gameState={mockGameState} 
          spectators={mockSpectators} 
          {...mockHandlers}
        />
      );
      
      const stopButton = screen.getByRole('button', { name: 'Stop Spectating' });
      expect(stopButton).toBeInTheDocument();
    });
  });
});