import { GameState, Player, Trick, DominoSuit } from '@texas42/shared-types'

/**
 * Game state utilities for Texas 42
 * Utilities for managing game state transitions and calculations
 */

export function isGameComplete(gameState: GameState): boolean {
  return gameState.gameScore.northSouth >= 250 || gameState.gameScore.eastWest >= 250;
}

export function getNextPlayer(currentPlayerId: string, players: Player[]): string {
  const currentIndex = players.findIndex(p => p.id === currentPlayerId);
  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex].id;
}

export function calculateTrickWinner(trick: Trick, _trump?: DominoSuit): string {
  if (trick.dominoes.length === 0) {
    throw new Error('Cannot calculate winner of empty trick');
  }

  // TODO: Implement proper trick winner calculation based on Texas 42 rules
  // This is a placeholder implementation
  return trick.dominoes[0].playerId;
}