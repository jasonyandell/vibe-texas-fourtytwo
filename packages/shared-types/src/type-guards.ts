/**
 * Type Guards and Validation Functions
 * Runtime type validation for Texas 42 game types
 */

import { isValidDomino as isValidDominoBase } from './dominoes';
import { DominoSuit } from './trump';
import { Bid } from './bidding';
import { 
  Player, 
  GameState, 
  LobbyState, 
  BiddingState, 
  ScoringState, 
  Trick,
  PlayerPosition,
  GamePhase,
  createEmptyGameState,
  createEmptyLobbyState,
  createEmptyBiddingState,
  createEmptyScoringState
} from './game-state';

// Re-export domino validation and creation
export { isValidDomino, createDomino } from './dominoes';

/**
 * Validates if a value is a valid player
 */
export function isValidPlayer(value: unknown): value is Player {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { id, name, position, hand, isConnected, isReady } = obj;

  // Check required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (typeof name !== 'string' || name.length === 0) return false;
  if (!validatePlayerPosition(position)) return false;
  if (!Array.isArray(hand)) return false;
  if (typeof isConnected !== 'boolean') return false;
  if (typeof isReady !== 'boolean') return false;

  // Validate all dominoes in hand
  if (!hand.every(domino => isValidDominoBase(domino))) return false;

  return true;
}

/**
 * Validates if a value is a valid bid
 */
export function isValidBid(value: unknown): value is Bid {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { playerId, amount, trump } = obj;

  // Check required fields
  if (typeof playerId !== 'string' || playerId.length === 0) return false;
  if (typeof amount !== 'number') return false;

  // Pass bid (amount = 0)
  if (amount === 0) {
    // Pass bids should not have trump
    return trump === undefined;
  }

  // Regular bid validation
  if (amount < 30 || amount > 42) return false;

  // Non-pass bids must have trump
  if (!trump || !validateDominoSuit(trump)) return false;

  return true;
}

/**
 * Validates if a value is a valid trick
 */
export function isValidTrick(value: unknown): value is Trick {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { id, dominoes, winner, leadSuit } = obj;

  // Check required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (!Array.isArray(dominoes)) return false;

  // Check dominoes count (1-4 for Texas 42)
  if (dominoes.length === 0 || dominoes.length > 4) return false;

  // Validate each domino play
  for (const play of dominoes) {
    if (!play || typeof play !== 'object') return false;
    const playObj = play as Record<string, unknown>;
    if (!isValidDominoBase(playObj.domino)) return false;
    if (typeof playObj.playerId !== 'string' || playObj.playerId.length === 0) return false;
    if (!validatePlayerPosition(playObj.position)) return false;
  }

  // Optional fields validation
  if (winner !== undefined && (typeof winner !== 'string' || winner.length === 0)) return false;
  if (leadSuit !== undefined && !validateDominoSuit(leadSuit)) return false;

  return true;
}

/**
 * Validates if a value is a valid bidding state
 */
export function isValidBiddingState(value: unknown): value is BiddingState {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { bidHistory, biddingComplete, passCount, minimumBid, currentBidder, currentBid } = obj;

  // Check required fields
  if (!Array.isArray(bidHistory)) return false;
  if (typeof biddingComplete !== 'boolean') return false;
  if (typeof passCount !== 'number' || passCount < 0) return false;
  if (typeof minimumBid !== 'number' || minimumBid < 30) return false;

  // Validate bid history
  if (!bidHistory.every((bid: unknown) => isValidBid(bid))) return false;

  // Optional fields
  if (currentBidder !== undefined && typeof currentBidder !== 'string') return false;
  if (currentBid !== undefined && !isValidBid(currentBid)) return false;

  return true;
}

/**
 * Validates if a value is a valid scoring state
 */
export function isValidScoringState(value: unknown): value is ScoringState {
  if (!value || typeof value !== 'object') return false;

  const { trickPoints, countDominoes, bonusPoints, penaltyPoints, roundComplete, currentTrickWinner } = value as Record<string, unknown>;

  // Check required fields
  if (typeof trickPoints !== 'number' || trickPoints < 0) return false;
  if (!Array.isArray(countDominoes)) return false;
  if (typeof bonusPoints !== 'number') return false;
  if (typeof penaltyPoints !== 'number') return false;
  if (typeof roundComplete !== 'boolean') return false;

  // Validate count dominoes
  if (!countDominoes.every((domino: unknown) => isValidDominoBase(domino))) return false;

  // Optional fields
  if (currentTrickWinner !== undefined && typeof currentTrickWinner !== 'string') return false;

  return true;
}

/**
 * Validates if a value is a valid game state
 */
export function isValidGameState(value: unknown): value is GameState {
  // This is a simplified validation - the actual GameState in shared types
  // has a different structure than the frontend version
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { id, phase, players, dealer } = obj;

  // Check basic required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (!validateGamePhase(phase)) return false;
  if (!Array.isArray(players)) return false;
  if (typeof dealer !== 'string' || dealer.length === 0) return false;

  // Validate players (must be exactly 4 for Texas 42)
  if (players.length !== 4) return false;
  if (!players.every(player => isValidPlayer(player))) return false;

  // Check for unique positions (no duplicates)
  const positions = players.map((p: any) => p.position);
  const uniquePositions = new Set(positions);
  if (uniquePositions.size !== 4) return false;

  // Check that dealer is one of the player IDs
  const playerIds = players.map((p: any) => p.id);
  if (!playerIds.includes(dealer)) return false;

  return true;
}

/**
 * Validates if a value is a valid lobby state
 */
export function isValidLobbyState(value: unknown): value is LobbyState {
  if (!value || typeof value !== 'object') return false;

  const { availableGames, connectedPlayers } = value as Record<string, unknown>;

  // Check required fields
  if (!Array.isArray(availableGames)) return false;
  if (typeof connectedPlayers !== 'number' || connectedPlayers < 0) return false;

  // Validate each game in the lobby
  for (const game of availableGames) {
    if (!game || typeof game !== 'object') return false;

    const gameObj = game as Record<string, unknown>;
    const { id, name, playerCount, maxPlayers, status, createdAt } = gameObj;

    if (typeof id !== 'string' || id.length === 0) return false;
    if (typeof name !== 'string' || name.length === 0) return false;
    if (typeof playerCount !== 'number' || playerCount < 0) return false;
    if (typeof maxPlayers !== 'number' || maxPlayers < 1) return false;
    if (playerCount > maxPlayers) return false;
    if (!['waiting', 'playing', 'finished'].includes(status as string)) return false;
    if (typeof createdAt !== 'string') return false;
  }

  return true;
}

/**
 * Validates player position enum
 */
export function validatePlayerPosition(value: unknown): value is PlayerPosition {
  return typeof value === 'string' && ['north', 'east', 'south', 'west'].includes(value);
}

/**
 * Validates game phase enum
 */
export function validateGamePhase(value: unknown): value is GamePhase {
  return typeof value === 'string' && ['bidding', 'playing', 'scoring', 'finished'].includes(value);
}

/**
 * Validates domino suit enum
 */
export function validateDominoSuit(value: unknown): value is DominoSuit {
  return typeof value === 'string' &&
    ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'doubles'].includes(value);
}

// Re-export factory functions
export { createEmptyGameState, createEmptyLobbyState, createEmptyBiddingState, createEmptyScoringState };
