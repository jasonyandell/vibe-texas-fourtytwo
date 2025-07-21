import { LobbyGame } from '@/types/texas42';

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

export const createManyGames = (count: number): LobbyGame[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `game-${i}`,
    name: `Game ${i}`,
    playerCount: 2,
    maxPlayers: 4,
    status: 'waiting' as const,
    createdAt: '2024-01-01T12:00:00Z'
  }));
};