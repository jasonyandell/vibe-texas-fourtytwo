/**
 * Texas 42 Game Types
 * Defines the core types for the authentic Texas 42 domino game
 */

// Domino representation
export interface Domino {
  high: number;        // 0-6
  low: number;         // 0-6
  id: string;          // unique identifier
  pointValue: number;  // 0, 5, or 10 points
  isCountDomino: boolean; // true for scoring dominoes
}

// Player positions in Texas 42 (partnerships: North-South, East-West)
export type PlayerPosition = 'north' | 'east' | 'south' | 'west';

// Game phases
export type GamePhase = 'bidding' | 'playing' | 'scoring' | 'finished';

// Bid information
export interface Bid {
  playerId: string;
  amount: number;  // 30-42 or pass (0)
  trump?: DominoSuit;
}

// Domino suits for trump
export type DominoSuit = 'blanks' | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes' | 'doubles';

// Player information
export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  hand: Domino[];
  isConnected: boolean;
  isReady: boolean;
}

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

// Bidding state
export interface BiddingState {
  currentBidder?: string;
  currentBid?: Bid;
  bidHistory: Bid[];
  biddingComplete: boolean;
  passCount: number;
  minimumBid: number;
}

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

// Player state (alias for Player interface for story compliance)
export type PlayerState = Player;

// Domino state (alias for Domino interface for story compliance)
export type DominoState = Domino;

// Trick state (alias for Trick interface for story compliance)
export type TrickState = Trick;

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

// Game actions
export type GameAction = 
  | { type: 'JOIN_GAME'; playerId: string; playerName: string }
  | { type: 'LEAVE_GAME'; playerId: string }
  | { type: 'READY_PLAYER'; playerId: string }
  | { type: 'START_GAME' }
  | { type: 'PLACE_BID'; playerId: string; bid: Bid }
  | { type: 'PLAY_DOMINO'; playerId: string; domino: Domino }
  | { type: 'RESET_GAME' };

// Lobby game interface
export interface LobbyGame {
  id: string;
  name: string;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: string;
}

// Lobby state
export interface LobbyState {
  availableGames: LobbyGame[];
  connectedPlayers: number;
}

// API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  gameId?: string;
  playerId?: string;
  data?: unknown;
  timestamp: string;
}

// Type Guards and Validation Functions

/**
 * Validates if a value is a valid domino
 */
export function isValidDomino(value: unknown): value is Domino {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { id, high, low, pointValue, isCountDomino } = obj;

  // Check required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (typeof high !== 'number' || typeof low !== 'number') return false;
  if (typeof pointValue !== 'number' || typeof isCountDomino !== 'boolean') return false;

  // Check value ranges (0-6 for double-six dominoes)
  if (high < 0 || high > 6 || low < 0 || low > 6) return false;

  // Check domino convention: high >= low
  if (low > high) return false;

  // Check point value is valid (0, 5, or 10)
  if (![0, 5, 10].includes(pointValue)) return false;

  // Check consistency between pointValue and isCountDomino
  if ((pointValue > 0) !== isCountDomino) return false;

  return true;
}

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
  if (!hand.every(domino => isValidDomino(domino))) return false;

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

// Factory Functions

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
 * Creates an empty lobby state with default values
 */
export function createEmptyLobbyState(): LobbyState {
  return {
    availableGames: [],
    connectedPlayers: 0
  };
}

/**
 * Creates an empty bidding state with default values
 */
export function createEmptyBiddingState(): BiddingState {
  return {
    bidHistory: [],
    biddingComplete: false,
    passCount: 0,
    minimumBid: 30
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

// ============================================================================
// Domino Factory Functions
// ============================================================================

/**
 * Calculate the point value of a domino according to Texas 42 rules
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns Point value: 0, 5, or 10
 */
export function calculateDominoPointValue(high: number, low: number): number {
  const total = high + low;
  if (total === 5) return 5;   // 5-0, 4-1, 3-2
  if (total === 10) return 10; // 6-4, 5-5
  return 0;                    // All other dominoes
}

/**
 * Check if a domino is a count domino (has point value > 0)
 * @param domino The domino to check
 * @returns True if the domino has points
 */
export function isCountDomino(domino: Domino): boolean {
  return calculateDominoPointValue(domino.high, domino.low) > 0;
}

/**
 * Create a single domino with point values
 * @param high The high value (0-6)
 * @param low The low value (0-6)
 * @returns A complete domino with point values
 */
export function createDomino(high: number, low: number): Domino {
  const pointValue = calculateDominoPointValue(high, low);
  const isCountDomino = pointValue > 0;

  return {
    high,
    low,
    id: `${high}-${low}`,
    pointValue,
    isCountDomino
  };
}

/**
 * Create a full domino set with validation
 * @returns Object containing all 28 dominoes and validation info
 */
export function createFullDominoSet(): { dominoes: Domino[], totalPoints: number, isValid: boolean } {
  const dominoes: Domino[] = [];

  // Generate all 28 domino combinations
  for (let high = 0; high <= 6; high++) {
    for (let low = 0; low <= high; low++) {
      dominoes.push(createDomino(high, low));
    }
  }

  const totalPoints = dominoes.reduce((sum, d) => sum + d.pointValue, 0);
  const isValid = totalPoints === 35;

  return {
    dominoes,
    totalPoints,
    isValid
  };
}
