import { Domino, GameState } from '@texas42/shared-types'
import { getDominoSuit } from './suitUtils'

/**
 * Play validation utilities for Texas 42
 * Server-side validation for domino plays
 */

export function validateDominoPlay(domino: Domino, gameState: GameState, playerId: string): { valid: boolean; error?: string } {
  // Check if it's the player's turn
  if (gameState.currentPlayer !== playerId) {
    return { valid: false, error: 'Not your turn to play' };
  }
  
  // Check if player has the domino
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) {
    return { valid: false, error: 'Player not found' };
  }
  
  const hasDomino = player.hand.some(d => d.id === domino.id);
  if (!hasDomino) {
    return { valid: false, error: 'You do not have this domino' };
  }
  
  // Check if domino can be played (follow suit rules)
  if (gameState.currentTrick && gameState.currentTrick.dominoes.length > 0) {
    const leadSuit = gameState.currentTrick.leadSuit;
    const dominoSuit = getDominoSuit(domino, gameState.trump);
    
    // Must follow suit if possible
    if (leadSuit && dominoSuit !== leadSuit && dominoSuit !== gameState.trump) {
      const canFollowSuit = player.hand.some(d => getDominoSuit(d, gameState.trump) === leadSuit);
      if (canFollowSuit) {
        return { valid: false, error: 'Must follow suit if possible' };
      }
    }
  }
  
  return { valid: true };
}