import { Domino, GameState, Bid, DominoSuit, Player, Trick } from '@texas42/shared-types'

/**
 * Game validation utilities for Texas 42
 * Server-side validation for all game actions
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

export function getDominoSuit(domino: Domino, trump?: DominoSuit): DominoSuit {
  // Handle trump suits
  if (trump === 'doubles' && domino.high === domino.low) {
    return 'doubles';
  }
  
  if (trump && trump !== 'doubles') {
    const trumpValue = getTrumpValue(trump);
    if (domino.high === trumpValue || domino.low === trumpValue) {
      return trump;
    }
  }
  
  // Default suit is the higher value
  if (domino.high === domino.low) {
    return 'doubles';
  }
  
  switch (domino.high) {
    case 0: return 'blanks';
    case 1: return 'ones';
    case 2: return 'twos';
    case 3: return 'threes';
    case 4: return 'fours';
    case 5: return 'fives';
    case 6: return 'sixes';
    default: return 'blanks';
  }
}

function getTrumpValue(trump: DominoSuit): number {
  switch (trump) {
    case 'blanks': return 0;
    case 'ones': return 1;
    case 'twos': return 2;
    case 'threes': return 3;
    case 'fours': return 4;
    case 'fives': return 5;
    case 'sixes': return 6;
    default: return -1;
  }
}

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
