import { Domino, GameState, Bid } from '@/types/texas42';
import { getDominoSuit } from './dominoUtils';

/**
 * Frontend validation for domino plays
 * This provides immediate feedback before backend submission
 */
export function canPlayDomino(domino: Domino, gameState: GameState, playerId: string): { valid: boolean; error?: string } {
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
    const dominoSuit = getDominoSuit(domino);

    // Must follow suit if possible (unless playing trump)
    if (leadSuit && dominoSuit !== leadSuit) {
      // Check if player has non-trump dominoes of the lead suit
      const canFollowSuit = player.hand.some(d => {
        const dSuit = getDominoSuit(d);
        return dSuit === leadSuit && dSuit !== gameState.trump;
      });

      // If can follow suit with non-trump, must do so (unless playing trump)
      if (canFollowSuit && dominoSuit !== gameState.trump) {
        return { valid: false, error: 'Must follow suit if possible' };
      }
    }
  }

  return { valid: true };
}

/**
 * Frontend validation for bids
 * This provides immediate feedback before backend submission
 */
export function canBid(bid: Bid, gameState: GameState): { valid: boolean; error?: string } {
  // Check if it's the player's turn to bid
  if (gameState.currentPlayer !== bid.playerId) {
    return { valid: false, error: 'Not your turn to bid' };
  }

  // Check bid amount
  if (bid.amount !== 0 && (bid.amount < 30 || bid.amount > 42)) {
    return { valid: false, error: 'Bid must be between 30-42 or 0 (pass)' };
  }

  // Check if bid is higher than current bid
  if (gameState.currentBid && bid.amount !== 0 && bid.amount <= gameState.currentBid.amount) {
    return { valid: false, error: 'Bid must be higher than current bid' };
  }

  // Check trump selection for non-pass bids
  if (bid.amount > 0 && !bid.trump) {
    return { valid: false, error: 'Must select trump suit for non-pass bids' };
  }

  return { valid: true };
}

/**
 * Get valid dominoes that a player can play
 */
export function getValidDominoes(gameState: GameState, playerId: string): Domino[] {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player || gameState.currentPlayer !== playerId) {
    return [];
  }

  // If no current trick or it's empty, can play any domino
  if (!gameState.currentTrick || gameState.currentTrick.dominoes.length === 0) {
    return player.hand;
  }

  const leadSuit = gameState.currentTrick.leadSuit;
  if (!leadSuit) {
    return player.hand;
  }

  // Find dominoes that follow suit
  const followSuitDominoes = player.hand.filter(d => getDominoSuit(d) === leadSuit);

  // If can follow suit, must follow suit
  if (followSuitDominoes.length > 0) {
    return followSuitDominoes;
  }

  // If can't follow suit, can play any domino
  return player.hand;
}