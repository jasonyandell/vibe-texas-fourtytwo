import { Bid, GameState } from '@texas42/shared-types'

/**
 * Bid validation utilities for Texas 42
 * Server-side validation for bidding actions
 */

export function validateBid(bid: Bid, gameState: GameState): { valid: boolean; error?: string } {
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