import { GameState, Player, BiddingState } from '@texas42/shared-types';

// Mock game state for testing
export const createMockGameState = (overrides: Partial<GameState> = {}): GameState => ({
  id: 'test-game-1',
  phase: 'bidding',
  players: [
    { id: 'player1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'player2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'player3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'player4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ],
  currentPlayer: 'player1',
  biddingState: {
    bidHistory: [],
    currentBid: undefined,
    biddingComplete: false,
    passCount: 0,
    minimumBid: 30,
    forcedBidActive: false
  },
  partnerships: {
    northSouth: {
      players: ['player1', 'player3'],
      currentHandScore: 0,
      marks: 0,
      totalGameScore: 0,
      tricksWon: 0,
      isBiddingTeam: false
    },
    eastWest: {
      players: ['player2', 'player4'],
      currentHandScore: 0,
      marks: 0,
      totalGameScore: 0,
      tricksWon: 0,
      isBiddingTeam: false
    }
  },
  handNumber: 1,
  tricks: [],
  boneyard: [],
  scoringState: {
    trickPoints: 0,
    countDominoes: [],
    bonusPoints: 0,
    penaltyPoints: 0,
    roundComplete: false
  },
  handScores: [],
  marks: { northSouth: 0, eastWest: 0 },
  gameScore: { northSouth: 0, eastWest: 0 },
  marksToWin: 7,
  gameComplete: false,
  dealer: 'player1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isValid: true,
  validationErrors: [],
  ...overrides
});

// Mock player data
export const createMockPlayer = (overrides: Partial<Player> = {}): Player => ({
  id: 'test-player',
  name: 'Test Player',
  position: 'north',
  hand: [],
  isConnected: true,
  isReady: false,
  ...overrides
});

// Mock bidding state
export const createMockBiddingState = (overrides: Partial<BiddingState> = {}): BiddingState => ({
  bidHistory: [],
  currentBid: undefined,
  biddingComplete: false,
  passCount: 0,
  minimumBid: 30,
  forcedBidActive: false,
  ...overrides
});
