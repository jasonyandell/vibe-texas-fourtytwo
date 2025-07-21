import { GameState, Player, createEmptyGameState } from '@texas42/shared-types'

export const mockPlayers: Player[] = [
  {
    id: 'player-1',
    name: 'North Player',
    position: 'north',
    hand: [],
    isConnected: true,
    isReady: true
  },
  {
    id: 'player-2',
    name: 'East Player',
    position: 'east',
    hand: [],
    isConnected: true,
    isReady: true
  },
  {
    id: 'player-3',
    name: 'South Player',
    position: 'south',
    hand: [],
    isConnected: true,
    isReady: true
  },
  {
    id: 'player-4',
    name: 'West Player',
    position: 'west',
    hand: [],
    isConnected: true,
    isReady: true
  }
]

export const mockGameState: GameState = (() => {
  const state = createEmptyGameState('test-game-123');
  state.phase = 'playing';
  state.players = mockPlayers;
  state.dealer = 'player-1';
  state.createdAt = '2024-01-01T00:00:00Z';
  state.updatedAt = '2024-01-01T00:00:00Z';
  return state;
})()