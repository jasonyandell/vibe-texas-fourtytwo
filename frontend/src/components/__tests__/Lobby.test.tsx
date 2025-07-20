import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Lobby } from '../Lobby';
import { LobbyStateProvider } from '@/contexts/LobbyStateContext';
import { LobbyGame } from '@/types/texas42';

// Mock games data
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
    createdAt: '2024-01-02T12:00:00Z'
  },
  {
    id: 'game-3',
    name: 'Test Game 3',
    playerCount: 0,
    maxPlayers: 4,
    status: 'waiting',
    createdAt: '2024-01-03T12:00:00Z'
  },
  {
    id: 'game-4',
    name: 'Completed Game',
    playerCount: 4,
    maxPlayers: 4,
    status: 'finished',
    createdAt: '2024-01-04T12:00:00Z'
  }
];

// Mock functions
const mockAddGame = vi.fn();
const mockClearError = vi.fn();
const mockGetAvailableGames = vi.fn().mockImplementation((status) => {
  if (!status) return mockGames;
  return mockGames.filter(game => game.status === status);
});
const mockGetJoinableGames = vi.fn().mockImplementation(() => {
  return mockGames.filter(game => game.status === 'waiting' && game.playerCount < game.maxPlayers);
});
const mockGetSortedGames = vi.fn().mockImplementation((sortBy) => {
  const games = [...mockGames];
  switch (sortBy) {
    case 'newest':
      return games.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return games.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'playerCount':
      return games.sort((a, b) => b.playerCount - a.playerCount);
    case 'name':
      return games.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return games;
  }
});

// Create a mock hook implementation that can be modified for specific tests
let mockHookState = {
  lobbyState: {
    availableGames: mockGames,
    connectedPlayers: 42
  },
  isLoading: false,
  error: null,
  getAvailableGames: mockGetAvailableGames,
  getJoinableGames: mockGetJoinableGames,
  getSortedGames: mockGetSortedGames,
  addGame: mockAddGame,
  clearError: mockClearError
};

// Mock the hooks
vi.mock('@/hooks/useLobbyState', () => ({
  useLobbyState: vi.fn().mockImplementation(() => mockHookState)
}));

// Mock the LobbyList component
vi.mock('../lobby/LobbyList', () => ({
  LobbyList: vi.fn(({ games, loading, error }) => (
    <div data-testid="lobby-list">
      <div data-testid="games-count">{games.length}</div>
      {loading && <div data-testid="loading-indicator">Loading...</div>}
      {error && <div data-testid="error-message">{error.message}</div>}
    </div>
  ))
}));

// Mock the CreateGameModal component
vi.mock('../lobby/CreateGameModal', () => ({
  CreateGameModal: vi.fn(({ onCreateGame, onClose }) => (
    <div data-testid="create-game-modal">
      <button 
        data-testid="create-game-button" 
        onClick={() => onCreateGame('New Test Game')}
      >
        Create
      </button>
      <button 
        data-testid="close-modal-button" 
        onClick={onClose}
      >
        Close
      </button>
    </div>
  ))
}));

// Mock the Button component
vi.mock('@/components/ui', () => ({
  Button: vi.fn(({ children, onClick, disabled, variant, size }) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      data-testid={`button-${variant || 'default'}${size ? `-${size}` : ''}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  ))
}));

// Helper function to render the component with context
const renderLobby = () => {
  return render(
    <LobbyStateProvider>
      <Lobby />
    </LobbyStateProvider>
  );
};

describe('Lobby', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock state before each test
    mockHookState = {
      lobbyState: {
        availableGames: mockGames,
        connectedPlayers: 42
      },
      isLoading: false,
      error: null,
      getAvailableGames: mockGetAvailableGames,
      getJoinableGames: mockGetJoinableGames,
      getSortedGames: mockGetSortedGames,
      addGame: mockAddGame,
      clearError: mockClearError
    };
  });

  describe('Basic Rendering', () => {
    it('renders the lobby header with title', () => {
      renderLobby();
      
      expect(screen.getByText('Texas 42 Lobby')).toBeInTheDocument();
    });

    it('displays the number of connected players', () => {
      renderLobby();
      
      expect(screen.getByText('42 players online')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      renderLobby();
      
      expect(screen.getByText('Create New Game')).toBeInTheDocument();
      expect(screen.getByText('Join Random Game')).toBeInTheDocument();
    });

    it('renders filter and sort controls', () => {
      renderLobby();
      
      expect(screen.getByLabelText('Filter by status:')).toBeInTheDocument();
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
    });

    it('passes the correct props to LobbyList', () => {
      renderLobby();
      
      const gamesCount = screen.getByTestId('games-count');
      expect(gamesCount.textContent).toBe('4'); // All 4 mock games
    });
  });

  describe('Create Game Functionality', () => {
    it('shows create game modal when button is clicked', async () => {
      renderLobby();
      
      const createButton = screen.getByText('Create New Game');
      await userEvent.click(createButton);
      
      expect(screen.getByTestId('create-game-modal')).toBeInTheDocument();
    });

    it('hides create game modal when close button is clicked', async () => {
      renderLobby();
      
      // Open modal
      const createButton = screen.getByText('Create New Game');
      await userEvent.click(createButton);
      
      // Close modal
      const closeButton = screen.getByTestId('close-modal-button');
      await userEvent.click(closeButton);
      
      expect(screen.queryByTestId('create-game-modal')).not.toBeInTheDocument();
    });

    it('creates a new game when form is submitted', async () => {
      renderLobby();
      
      // Open modal
      const createButton = screen.getByText('Create New Game');
      await userEvent.click(createButton);
      
      // Submit form
      const submitButton = screen.getByTestId('create-game-button');
      await userEvent.click(submitButton);
      
      // Check if addGame was called with correct parameters
      expect(mockAddGame).toHaveBeenCalledTimes(1);
      expect(mockAddGame).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Test Game',
        status: 'waiting',
        playerCount: 0,
        maxPlayers: 4
      }));
      
      // Modal should be closed after submission
      expect(screen.queryByTestId('create-game-modal')).not.toBeInTheDocument();
    });
  });

  describe('Join Random Game Functionality', () => {
    it('enables join random game button when joinable games exist', () => {
      renderLobby();
      
      const joinRandomButton = screen.getByText('Join Random Game');
      expect(joinRandomButton).not.toBeDisabled();
    });

    it('disables join random game button when no joinable games exist', async () => {
      // Override the mock for this test
      mockGetJoinableGames.mockReturnValueOnce([]);
      
      renderLobby();
      
      const joinRandomButton = screen.getByText('Join Random Game');
      expect(joinRandomButton).toBeDisabled();
    });

    it('calls console.log when join random game is clicked', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      
      renderLobby();
      
      const joinRandomButton = screen.getByText('Join Random Game');
      await userEvent.click(joinRandomButton);
      
      expect(consoleSpy).toHaveBeenCalledWith('Joining random game:', expect.any(Object));
      
      consoleSpy.mockRestore();
    });
  });

  describe('Filtering and Sorting', () => {
    it('filters games by status', async () => {
      renderLobby();
      
      // Initially shows all games
      expect(screen.getByTestId('games-count').textContent).toBe('4');
      
      // Change filter to 'waiting'
      const filterSelect = screen.getByLabelText('Filter by status:');
      await userEvent.selectOptions(filterSelect, 'waiting');
      
      // Should now show only waiting games (2 of them)
      expect(screen.getByTestId('games-count').textContent).toBe('2');
      
      // Change filter to 'playing'
      await userEvent.selectOptions(filterSelect, 'playing');
      
      // Should now show only playing games (1 of them)
      expect(screen.getByTestId('games-count').textContent).toBe('1');
      
      // Change filter to 'finished'
      await userEvent.selectOptions(filterSelect, 'finished');
      
      // Should now show only finished games (1 of them)
      expect(screen.getByTestId('games-count').textContent).toBe('1');
    });

    it('sorts games by different criteria', async () => {
      renderLobby();
      
      // Default sort is 'newest'
      expect(mockGetSortedGames).toHaveBeenCalledWith('newest');
      
      // Change sort to 'oldest'
      const sortSelect = screen.getByLabelText('Sort by:');
      await userEvent.selectOptions(sortSelect, 'oldest');
      
      expect(mockGetSortedGames).toHaveBeenCalledWith('oldest');
      
      // Change sort to 'playerCount'
      await userEvent.selectOptions(sortSelect, 'playerCount');
      
      expect(mockGetSortedGames).toHaveBeenCalledWith('playerCount');
      
      // Change sort to 'name'
      await userEvent.selectOptions(sortSelect, 'name');
      
      expect(mockGetSortedGames).toHaveBeenCalledWith('name');
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error exists', () => {
      // Override the mock for this test
      mockHookState = {
        ...mockHookState,
        error: new Error('Test error message')
      };
      
      renderLobby();
      
      expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
      
      // Click dismiss button
      const dismissButton = screen.getByText('Dismiss');
      fireEvent.click(dismissButton);
      
      expect(mockClearError).toHaveBeenCalledTimes(1);
    });

    it('does not display error message when no error exists', () => {
      renderLobby();
      
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('disables create game button when loading', () => {
      // Override the mock for this test
      mockHookState = {
        ...mockHookState,
        isLoading: true
      };
      
      renderLobby();
      
      const createButton = screen.getByText('Create New Game');
      expect(createButton).toBeDisabled();
    });

    it('passes loading state to LobbyList', () => {
      // Override the mock for this test
      mockHookState = {
        ...mockHookState,
        isLoading: true
      };
      
      renderLobby();
      
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for form controls', () => {
      renderLobby();
      
      expect(screen.getByLabelText('Filter by status:')).toHaveAttribute('id', 'status-filter');
      expect(screen.getByLabelText('Sort by:')).toHaveAttribute('id', 'sort-select');
    });

    it('has semantic structure with headings', () => {
      renderLobby();
      
      expect(screen.getByRole('heading', { name: 'Texas 42 Lobby' })).toBeInTheDocument();
    });

    it('has proper button labels', () => {
      renderLobby();
      
      const createButton = screen.getByText('Create New Game');
      const joinRandomButton = screen.getByText('Join Random Game');
      
      expect(createButton).toBeInTheDocument();
      expect(joinRandomButton).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('applies gamesSection CSS class to games container', () => {
      renderLobby();
      
      // Find the element containing "Available Games" heading
      const heading = screen.getByText('Available Games');
      const gamesSection = heading.parentElement;
      
      // Check that the parent element exists and has the appropriate class
      expect(gamesSection).toBeInTheDocument();
      expect(gamesSection?.className).toMatch(/gamesSection/);
    });
  });
});