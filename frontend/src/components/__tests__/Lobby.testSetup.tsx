import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { LobbyStateProvider } from '@/contexts/LobbyStateContext';
import { LobbyGame } from '@/types/texas42';

// Mock games data
export const mockGames: LobbyGame[] = [
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
export const mockAddGame = vi.fn();
export const mockClearError = vi.fn();
export const mockGetAvailableGames = vi.fn().mockImplementation((status) => {
  if (!status) return mockGames;
  return mockGames.filter(game => game.status === status);
});
export const mockGetJoinableGames = vi.fn().mockImplementation(() => {
  return mockGames.filter(game => game.status === 'waiting' && game.playerCount < game.maxPlayers);
});
export const mockGetSortedGames = vi.fn().mockImplementation((sortBy) => {
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
export let mockHookState = {
  lobbyState: {
    availableGames: mockGames,
    connectedPlayers: 42
  },
  isLoading: false,
  error: null as Error | null,
  getAvailableGames: mockGetAvailableGames,
  getJoinableGames: mockGetJoinableGames,
  getSortedGames: mockGetSortedGames,
  addGame: mockAddGame,
  clearError: mockClearError
};

export const resetMockHookState = () => {
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
};

// Mock the hooks
vi.mock('@/hooks/useLobbyState', () => ({
  useLobbyState: vi.fn().mockImplementation(() => mockHookState)
}));

// Mock the LobbyList component
vi.mock('../lobby/LobbyList', () => ({
  LobbyList: vi.fn(({ games, loading, error }: { games: LobbyGame[]; loading: boolean; error: Error | null }) => (
    <div data-testid="lobby-list">
      <div data-testid="games-count">{games.length}</div>
      {loading && <div data-testid="loading-indicator">Loading...</div>}
      {error && <div data-testid="error-message">{error.message}</div>}
    </div>
  ))
}));

// Mock the CreateGameModal component
vi.mock('../lobby/CreateGameModal', () => ({
  CreateGameModal: vi.fn(({ onCreateGame, onClose }: { onCreateGame: (name: string) => void; onClose: () => void }) => (
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
  Button: vi.fn(({ children, onClick, disabled, variant, size }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    disabled?: boolean; 
    variant?: string; 
    size?: string 
  }) => (
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
export const renderLobby = () => {
  const { Lobby } = require('../Lobby');
  return render(
    <LobbyStateProvider>
      <Lobby />
    </LobbyStateProvider>
  );
};