import { vi } from 'vitest';
import { LobbyGame } from '@/types/texas42';

export const mockGame: LobbyGame = {
  id: 'test-game-1',
  name: 'Test Game',
  playerCount: 2,
  maxPlayers: 4,
  status: 'waiting',
  createdAt: '2024-01-01T12:00:00Z'
};

export const createMockHandlers = () => ({
  onJoinGame: vi.fn(),
  onLeaveGame: vi.fn(),
  onSpectateGame: vi.fn(),
  onMarkReady: vi.fn()
});

export const gameVariants = {
  full: { ...mockGame, playerCount: 4 },
  playing: { ...mockGame, status: 'playing' as const },
  finished: { ...mockGame, status: 'finished' as const },
  fullWaiting: { ...mockGame, playerCount: 4, status: 'waiting' as const }
};