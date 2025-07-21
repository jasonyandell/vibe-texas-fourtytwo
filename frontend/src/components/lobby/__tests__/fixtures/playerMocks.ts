import { Player } from '@/types/texas42';

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

export const mockPartialPlayers: (Player | null)[] = [
  mockFullReadyPlayers[0],
  mockFullReadyPlayers[1],
  null,
  null
];

export const mockUnreadyPlayers: (Player | null)[] = [
  { ...mockFullReadyPlayers[0]!, isReady: false },
  { ...mockFullReadyPlayers[1]!, isReady: false },
  { ...mockFullReadyPlayers[2]!, isReady: false },
  { ...mockFullReadyPlayers[3]!, isReady: false }
];

export const mockDisconnectedPlayers: (Player | null)[] = [
  { ...mockFullReadyPlayers[0]!, isConnected: false },
  mockFullReadyPlayers[1],
  mockFullReadyPlayers[2],
  mockFullReadyPlayers[3]
];