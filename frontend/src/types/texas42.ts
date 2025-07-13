/**
 * Texas 42 Game Types
 * Defines the core types for the authentic Texas 42 domino game
 */

// Domino representation
export interface Domino {
  high: number;  // 0-6
  low: number;   // 0-6
  id: string;    // unique identifier
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

// Lobby state
export interface LobbyState {
  availableGames: Array<{
    id: string;
    name: string;
    playerCount: number;
    maxPlayers: number;
    status: 'waiting' | 'playing' | 'finished';
    createdAt: string;
  }>;
  connectedPlayers: number;
}

// API responses
export interface ApiResponse<T = any> {
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
  data?: any;
  timestamp: string;
}
