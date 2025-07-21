import { vi } from 'vitest';
import { mockGames } from './lobby.mockData';

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