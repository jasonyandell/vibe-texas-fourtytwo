import { GameState } from '@texas42/shared-types';
import { SpectatorInfo } from '../SpectatorView';
import { createMockGameState } from './SpectatorView.test-utils';

export const mockGameStateWithPlayerHands: GameState = createMockGameState({
  id: 'test-game-1',
  phase: 'playing',
  currentPlayer: 'player-1',
  players: [
    {
      id: 'player-1',
      name: 'Alice',
      position: 'north',
      hand: [
        { high: 6, low: 6, id: 'dom-66', pointValue: 10, isCountDomino: true },
        { high: 5, low: 4, id: 'dom-54', pointValue: 0, isCountDomino: false }
      ],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-2',
      name: 'Bob',
      position: 'east',
      hand: [
        { high: 3, low: 2, id: 'dom-32', pointValue: 5, isCountDomino: true },
        { high: 1, low: 0, id: 'dom-10', pointValue: 0, isCountDomino: false }
      ],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-3',
      name: 'Carol',
      position: 'south',
      hand: [{ high: 4, low: 3, id: 'dom-43', pointValue: 0, isCountDomino: false }],
      isConnected: false,
      isReady: true
    },
    {
      id: 'player-4',
      name: 'Dave',
      position: 'west',
      hand: [
        { high: 2, low: 1, id: 'dom-21', pointValue: 0, isCountDomino: false },
        { high: 6, low: 5, id: 'dom-65', pointValue: 5, isCountDomino: true },
        { high: 4, low: 4, id: 'dom-44', pointValue: 0, isCountDomino: false }
      ],
      isConnected: true,
      isReady: true
    }
  ]
});

export const mockSpectators: SpectatorInfo[] = [
  {
    id: 'spectator-1',
    name: 'Spectator One',
    joinedAt: '2024-01-01T12:00:00Z'
  }
];