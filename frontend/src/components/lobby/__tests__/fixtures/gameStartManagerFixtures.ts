import { vi } from 'vitest';
import { Player, GameState } from '@/types/texas42';

export const mockPlayers: (Player | null)[] = [
  {
    id: 'player-1',
    name: 'Alice',
    position: 'north',
    hand: [],
    isConnected: true,
    isReady: true
  },
  {
    id: 'player-2',
    name: 'Bob',
    position: 'east',
    hand: [],
    isConnected: true,
    isReady: false
  },
  {
    id: 'player-3',
    name: 'Carol',
    position: 'south',
    hand: [],
    isConnected: true,
    isReady: true
  },
  null // Empty slot
];

export const mockFullReadyPlayers: (Player | null)[] = [
  {
    id: 'player-1',
    name: 'Alice',
    position: 'north',
    hand: [],
    isConnected: true,
    isReady: true
  },
  {
    id: 'player-2',
    name: 'Bob',
    position: 'east',
    hand: [],
    isConnected: true,
    isReady: true
  },
  {
    id: 'player-3',
    name: 'Carol',
    position: 'south',
    hand: [],
    isConnected: true,
    isReady: true
  },
  {
    id: 'player-4',
    name: 'Dave',
    position: 'west',
    hand: [],
    isConnected: true,
    isReady: true
  }
];

export const mockGameState: GameState = {
  id: 'test-game',
  phase: 'playing',
  players: mockFullReadyPlayers.filter(p => p !== null),
  currentPlayer: 'player-1',
  trump: 'doubles',
  currentTrick: undefined,
  scores: { northSouth: 0, eastWest: 0 },
  gameScore: { northSouth: 0, eastWest: 0 },
  dealer: 'player-1',
  tricks: [],
  boneyard: [],
  createdAt: '2024-01-01T12:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z'
};

export const mockHandlers = {
  onStartGame: vi.fn(),
  onGameStarted: vi.fn(),
  onError: vi.fn()
};