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