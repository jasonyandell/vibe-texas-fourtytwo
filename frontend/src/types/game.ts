/**
 * Game State Types
 * Core game state types and validation for Texas 42
 */

import type { Domino, DominoSuit } from './domino';
import type { Player, PlayerPosition } from './player';
import type { Bid, BiddingState } from './bidding';
import { isValidDomino, validateDominoSuit } from './domino';
import { isValidPlayer, validatePlayerPosition } from './player';
import { isValidBid, isValidBiddingState } from './bidding';

// Game phases
export type GamePhase = 'bidding' | 'playing' | 'scoring' | 'finished';

// Game trick
export interface Trick {
  id: string;
  dominoes: Array<{
    domino: Domino;
    playerId: string;
    position: PlayerPosition;
  }>;
  winner?: string;
  leadSuit?: DominoSuit;
}

// Trick state (alias for Trick interface for story compliance)
export type TrickState = Trick;

// Partnership state for Texas 42 (North-South vs East-West)
export interface PartnershipState {
  northSouth: {
    players: [string, string]; // [north player id, south player id]
    score: number;
    gameScore: number;
    tricksWon: number;
    currentBid?: Bid;
  };
  eastWest: {
    players: [string, string]; // [east player id, west player id]
    score: number;
    gameScore: number;
    tricksWon: number;
    currentBid?: Bid;
  };
}

// Scoring state
export interface ScoringState {
  currentTrickWinner?: string;
  trickPoints: number;
  countDominoes: Domino[];
  bonusPoints: number;
  penaltyPoints: number;
  roundComplete: boolean;
}

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
    if (!isValidDomino(playObj.domino)) return false;
    if (typeof playObj.playerId !== 'string' || playObj.playerId.length === 0) return false;
    if (!validatePlayerPosition(playObj.position)) return false;
  }

  // Optional fields validation
  if (winner !== undefined && (typeof winner !== 'string' || winner.length === 0)) return false;
  if (leadSuit !== undefined && !validateDominoSuit(leadSuit)) return false;

  return true;
}

/**
 * Validates if a value is a valid partnership state
 */
export function isValidPartnershipState(value: unknown): value is PartnershipState {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { northSouth, eastWest } = obj;

  // Check both partnerships exist
  if (!northSouth || !eastWest) return false;

  // Validate each partnership
  for (const partnership of [northSouth, eastWest]) {
    if (typeof partnership !== 'object') return false;

    const partnershipObj = partnership as Record<string, unknown>;
    const { players, score, gameScore, tricksWon } = partnershipObj;

    // Check required fields
    if (!Array.isArray(players) || players.length !== 2) return false;
    if (!players.every(p => typeof p === 'string' && p.length > 0)) return false;
    if (typeof score !== 'number' || score < 0) return false;
    if (typeof gameScore !== 'number' || gameScore < 0) return false;
    if (typeof tricksWon !== 'number' || tricksWon < 0) return false;

    // Optional bid validation
    if (partnershipObj.currentBid !== undefined && !isValidBid(partnershipObj.currentBid)) return false;
  }

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
  if (!countDominoes.every((domino: unknown) => isValidDomino(domino))) return false;

  // Optional fields
  if (currentTrickWinner !== undefined && typeof currentTrickWinner !== 'string') return false;

  return true;
}

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

/**
 * Creates an empty scoring state with default values
 */
export function createEmptyScoringState(): ScoringState {
  return {
    trickPoints: 0,
    countDominoes: [],
    bonusPoints: 0,
    penaltyPoints: 0,
    roundComplete: false
  };
}

/**
 * Creates an empty partnership state with default values
 */
export function createEmptyPartnershipState(players: Player[]): PartnershipState {
  // Find players by position
  const northPlayer = players.find(p => p.position === 'north')?.id || '';
  const southPlayer = players.find(p => p.position === 'south')?.id || '';
  const eastPlayer = players.find(p => p.position === 'east')?.id || '';
  const westPlayer = players.find(p => p.position === 'west')?.id || '';

  return {
    northSouth: {
      players: [northPlayer, southPlayer],
      score: 0,
      gameScore: 0,
      tricksWon: 0
    },
    eastWest: {
      players: [eastPlayer, westPlayer],
      score: 0,
      gameScore: 0,
      tricksWon: 0
    }
  };
}