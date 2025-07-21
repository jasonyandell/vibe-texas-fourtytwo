import { createEmptyGameState } from '@texas42/shared-types'
import type { GameState } from '@texas42/shared-types'

export function createTestGameState(): GameState {
  const mockGameState = createEmptyGameState('game-123');
  // Add test-specific data
  mockGameState.phase = 'playing';
  mockGameState.players = [
    { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ];
  mockGameState.dealer = 'p1';
  mockGameState.partnerships.northSouth.currentHandScore = 15;
  mockGameState.partnerships.eastWest.currentHandScore = 23;
  mockGameState.gameScore = { northSouth: 1, eastWest: 2 };
  
  return mockGameState;
}

export function createSerializedState(gameState: GameState) {
  return {
    version: 2,
    gameId: gameState.id,
    phase: gameState.phase,
    players: gameState.players,
    dealer: gameState.dealer,
    scores: {
      northSouth: gameState.partnerships.northSouth.currentHandScore,
      eastWest: gameState.partnerships.eastWest.currentHandScore
    },
    gameScore: gameState.gameScore
  };
}