/**
 * Game state fixtures for Storybook stories
 */

import { GameState, createEmptyGameState } from '@texas42/shared-types';
import { exampleHands, countDominoes } from './dominoes';
import { mockPlayers } from './players';

// Basic game states
export const emptyGameState = createEmptyGameState('story-game-123');

export const waitingForPlayersState: GameState = {
  ...emptyGameState,
  players: mockPlayers.slice(0, 2), // Only 2 players joined
  phase: 'waiting',
};

export const readyToStartState: GameState = {
  ...emptyGameState,
  players: mockPlayers,
  phase: 'ready',
};

// Bidding phase states
export const biddingStartState: GameState = {
  ...emptyGameState,
  players: mockPlayers.map((player, index) => ({
    ...player,
    hand: Object.values(exampleHands)[index % 3].slice(0, 7),
  })),
  phase: 'bidding',
  dealer: 'player-1',
  currentPlayer: 'player-2',
  biddingState: {
    minimumBid: 30,
    currentBid: null,
    passes: [],
    bidHistory: [],
  },
};

export const biddingInProgressState: GameState = {
  ...biddingStartState,
  currentPlayer: 'player-4',
  currentBid: { playerId: 'player-3', amount: 31, trump: 'fives' },
  biddingState: {
    minimumBid: 32,
    currentBid: { playerId: 'player-3', amount: 31, trump: 'fives' },
    passes: ['player-1'],
    bidHistory: [
      { playerId: 'player-1', amount: 30, trump: 'threes' },
      { playerId: 'player-2', amount: 0 }, // Pass
      { playerId: 'player-3', amount: 31, trump: 'fives' },
      { playerId: 'player-1', amount: 0 }, // Pass
    ],
  },
};

export const biddingCompleteState: GameState = {
  ...biddingInProgressState,
  phase: 'playing',
  currentPlayer: 'player-3', // Winner of bid leads
  trump: 'fives',
  bidWinner: 'player-3',
  contractAmount: 31,
  biddingState: undefined,
};

// Playing phase states
export const playingStartState: GameState = {
  ...emptyGameState,
  players: mockPlayers.map((player, index) => ({
    ...player,
    hand: Object.values(exampleHands)[index % 3].slice(0, 7),
  })),
  phase: 'playing',
  dealer: 'player-1',
  currentPlayer: 'player-2',
  trump: 'sixes',
  bidWinner: 'player-2',
  contractAmount: 30,
  scores: {
    northSouth: 0,
    eastWest: 0,
  },
  tricks: {
    northSouth: [],
    eastWest: [],
  },
  completedTricks: 0,
};

export const trickInProgressState: GameState = {
  ...playingStartState,
  currentPlayer: 'player-4',
  leadSuit: 'fours',
  currentTrick: {
    id: 'trick-1',
    dominoes: [
      {
        domino: countDominoes.fourOne,
        playerId: 'player-2',
        position: 'east',
        playOrder: 0,
        timestamp: new Date().toISOString(),
      },
      {
        domino: exampleHands.balancedHand[5], // 4-2
        playerId: 'player-3',
        position: 'south',
        playOrder: 1,
        timestamp: new Date().toISOString(),
      },
    ],
    pointValue: 5, // 4-1 is worth 5
    countDominoes: [countDominoes.fourOne],
    trickNumber: 1,
    isComplete: false,
  },
};

export const trickCompleteState: GameState = {
  ...playingStartState,
  currentPlayer: 'player-4', // Winner leads next
  currentTrick: {
    id: 'trick-1',
    dominoes: [
      {
        domino: countDominoes.sixFour,
        playerId: 'player-1',
        position: 'north',
        playOrder: 0,
        timestamp: new Date().toISOString(),
      },
      {
        domino: exampleHands.strongHand[4], // 6-3
        playerId: 'player-2',
        position: 'east',
        playOrder: 1,
        timestamp: new Date().toISOString(),
      },
      {
        domino: exampleHands.balancedHand[3], // 6-2
        playerId: 'player-3',
        position: 'south',
        playOrder: 2,
        timestamp: new Date().toISOString(),
      },
      {
        domino: exampleHands.strongHand[0], // 6-6
        playerId: 'player-4',
        position: 'west',
        playOrder: 3,
        timestamp: new Date().toISOString(),
      },
    ],
    winner: 'player-4',
    pointValue: 10, // 6-4 is worth 10
    countDominoes: [countDominoes.sixFour],
    trickNumber: 1,
    isComplete: true,
  },
  scores: {
    northSouth: 0,
    eastWest: 10, // West won 10 points
  },
  tricks: {
    northSouth: [],
    eastWest: ['trick-1'],
  },
  completedTricks: 1,
};

// End game states
export const handCompleteState: GameState = {
  ...emptyGameState,
  players: mockPlayers.map(player => ({ ...player, hand: [] })), // All dominoes played
  phase: 'handComplete',
  scores: {
    northSouth: 15,
    eastWest: 20,
  },
  handScores: {
    northSouth: 15,
    eastWest: 20,
  },
  totalScores: {
    northSouth: 115,
    eastWest: 145,
  },
  completedTricks: 7,
  bidWinner: 'player-2',
  contractAmount: 32,
  contractMet: false, // East-West bid 32 but only got 20
};

export const gameOverState: GameState = {
  ...emptyGameState,
  players: mockPlayers,
  phase: 'gameOver',
  scores: {
    northSouth: 250,
    eastWest: 185,
  },
  totalScores: {
    northSouth: 250,
    eastWest: 185,
  },
  winner: 'northSouth',
  completedHands: 12,
};

// Special states
export const disconnectedPlayerState: GameState = {
  ...playingStartState,
  players: mockPlayers.map((player, index) => ({
    ...player,
    isConnected: index !== 2, // South player disconnected
  })),
  isPaused: true,
  pausedAt: new Date().toISOString(),
  pauseReason: 'Player disconnected',
};

export const spectatorModeState: GameState = {
  ...trickInProgressState,
  // Spectator mode is determined by viewer not being in players list
};

// Helper to create custom game states
export function createCustomGameState(overrides: Partial<GameState>): GameState {
  return {
    ...emptyGameState,
    players: mockPlayers,
    ...overrides,
  };
}