/**
 * Game State Types
 * Core game state types and validation for Texas 42
 */

import type { Domino, DominoSuit } from './domino';
import type { Player, PlayerPosition } from './player';
import type { Bid, BiddingState } from './bidding';
import type { Trick } from './trick';
import type { PartnershipState } from './partnership';
import type { ScoringState } from './scoring';
import { isValidDomino, validateDominoSuit } from './domino';
import { isValidPlayer } from './player';
import { isValidBid, isValidBiddingState } from './bidding';
import { isValidTrick } from './trick';
import { isValidPartnershipState } from './partnership';
import { isValidScoringState } from './scoring';

// Game phases
export type GamePhase = 'bidding' | 'playing' | 'scoring' | 'finished';

// Re-export types for backward compatibility
export type { Trick } from './trick';
export type { PartnershipState } from './partnership';
export type { ScoringState } from './scoring';

// Game state
export interface GameState {
  id: string;
  phase: GamePhase;
  players: Player[];
  currentPlayer?: string;
  dealer: string;
  bidder?: string;
  currentBid?: Bid;
  trump?: DominoSuit;
  tricks: Trick[];
  currentTrick?: Trick;
  scores: {
    northSouth: number;
    eastWest: number;
  };
  gameScore: {
    northSouth: number;
    eastWest: number;
  };
  boneyard: Domino[];
  biddingState?: BiddingState;
  scoringState?: ScoringState;
  partnershipState?: PartnershipState;
  createdAt: string;
  updatedAt: string;
}

// Re-export validation functions for backward compatibility
export { isValidTrick } from './trick';
export { isValidPartnershipState } from './partnership';
export { isValidScoringState, createEmptyScoringState } from './scoring';
export { createEmptyPartnershipState } from './partnership';

/**
 * Validates if a value is a valid game state
 */
export function isValidGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false;

  const {
    id, phase, players, currentPlayer, dealer, bidder, currentBid, trump,
    tricks, currentTrick, scores, gameScore, boneyard, biddingState, scoringState,
    partnershipState, createdAt, updatedAt
  } = value as Record<string, unknown>;

  // Check required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (!validateGamePhase(phase)) return false;
  if (!Array.isArray(players)) return false;
  if (typeof dealer !== 'string' || dealer.length === 0) return false;
  if (!Array.isArray(tricks)) return false;
  if (!Array.isArray(boneyard)) return false;
  if (typeof createdAt !== 'string') return false;
  if (typeof updatedAt !== 'string') return false;

  // Validate players (must be exactly 4 for Texas 42)
  if (players.length !== 4) return false;
  if (!players.every(player => isValidPlayer(player))) return false;

  // Check for unique positions
  const positions = players.map(p => p.position);
  const uniquePositions = new Set(positions);
  if (uniquePositions.size !== 4) return false;

  // Check that all required positions are present
  const requiredPositions: PlayerPosition[] = ['north', 'east', 'south', 'west'];
  if (!requiredPositions.every(pos => positions.includes(pos))) return false;

  // Validate dealer exists in players
  if (!players.some(p => p.id === dealer)) return false;

  // Validate optional fields
  if (currentPlayer !== undefined && !players.some(p => p.id === currentPlayer)) return false;
  if (bidder !== undefined && !players.some(p => p.id === bidder)) return false;
  if (currentBid !== undefined && !isValidBid(currentBid)) return false;
  if (trump !== undefined && !validateDominoSuit(trump)) return false;
  if (currentTrick !== undefined && !isValidTrick(currentTrick)) return false;

  // Validate tricks
  if (!tricks.every(trick => isValidTrick(trick))) return false;

  // Validate scores
  if (!scores || typeof scores !== 'object') return false;
  const scoresObj = scores as Record<string, unknown>;
  if (typeof scoresObj.northSouth !== 'number' || typeof scoresObj.eastWest !== 'number') return false;
  if (!gameScore || typeof gameScore !== 'object') return false;
  const gameScoreObj = gameScore as Record<string, unknown>;
  if (typeof gameScoreObj.northSouth !== 'number' || typeof gameScoreObj.eastWest !== 'number') return false;

  // Validate boneyard
  if (!boneyard.every(domino => isValidDomino(domino))) return false;

  // Validate optional state objects
  if (biddingState !== undefined && !isValidBiddingState(biddingState)) return false;
  if (scoringState !== undefined && !isValidScoringState(scoringState)) return false;
  if (partnershipState !== undefined && !isValidPartnershipState(partnershipState)) return false;

  return true;
}

/**
 * Validates game phase enum
 */
export function validateGamePhase(value: unknown): value is GamePhase {
  return typeof value === 'string' && ['bidding', 'playing', 'scoring', 'finished'].includes(value);
}

/**
 * Creates an empty game state with default values
 */
export function createEmptyGameState(gameId: string): GameState {
  const now = new Date().toISOString();

  return {
    id: gameId,
    phase: 'bidding',
    players: [],
    dealer: '',
    tricks: [],
    scores: { northSouth: 0, eastWest: 0 },
    gameScore: { northSouth: 0, eastWest: 0 },
    boneyard: [],
    createdAt: now,
    updatedAt: now
  };
}

