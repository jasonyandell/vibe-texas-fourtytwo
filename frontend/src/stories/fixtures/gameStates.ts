/**
 * Game state fixtures for Storybook stories
 */

import { GameState, createEmptyGameState, createCompatibleBid, createEmptyBiddingState } from '@texas42/shared-types';
import { exampleHands, countDominoes } from './dominoes';
import { mockPlayers } from './players';

// Basic game states
export const emptyGameState = createEmptyGameState('story-game-123');

export const waitingForPlayersState: GameState = {
  ...emptyGameState,
  players: mockPlayers.slice(0, 2), // Only 2 players joined
};

export const readyToStartState: GameState = {
  ...emptyGameState,
  players: mockPlayers,
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
  biddingState: createEmptyBiddingState(),
};

export const biddingInProgressState: GameState = {
  ...biddingStartState,
  currentPlayer: 'player-4',
  currentBid: createCompatibleBid('player-3', 31, 'fives'),
  biddingState: {
    bidHistory: [
      createCompatibleBid('player-1', 30, 'threes'),
      createCompatibleBid('player-2', 0), // Pass
      createCompatibleBid('player-3', 31, 'fives'),
      createCompatibleBid('player-1', 0), // Pass
    ],
    biddingComplete: false,
    passCount: 2,
    minimumBid: 32,
    forcedBidActive: false
  },
};

export const biddingCompleteState: GameState = {
  ...biddingInProgressState,
  phase: 'playing',
  currentPlayer: 'player-3', // Winner of bid leads
  trump: 'fives',
  biddingState: createEmptyBiddingState(),
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
  partnerships: {
    northSouth: {
      players: ['player-1', 'player-3'],
      currentHandScore: 0,
      totalGameScore: 0,
      marks: 0,
      tricksWon: 0,
      isBiddingTeam: false
    },
    eastWest: {
      players: ['player-2', 'player-4'],
      currentHandScore: 0,
      totalGameScore: 0,
      marks: 0,
      tricksWon: 0,
      isBiddingTeam: false
    }
  },
  handNumber: 1,
};

export const trickInProgressState: GameState = {
  ...playingStartState,
  currentPlayer: 'player-4',
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
    pointValue: 10, // 6-4 is worth 10
    countDominoes: [countDominoes.sixFour],
    trickNumber: 1,
    isComplete: true,
  },
  partnerships: {
    northSouth: {
      players: ['player-1', 'player-3'],
      currentHandScore: 0,
      totalGameScore: 0,
      marks: 0,
      tricksWon: 0,
      isBiddingTeam: false
    },
    eastWest: {
      players: ['player-2', 'player-4'],
      currentHandScore: 10,
      totalGameScore: 10,
      marks: 0,
      tricksWon: 1,
      isBiddingTeam: false
    }
  },
  handNumber: 1,
};

// End game states
export const handCompleteState: GameState = {
  ...emptyGameState,
  players: mockPlayers.map(player => ({ ...player, hand: [] })), // All dominoes played
  phase: 'scoring',
  partnerships: {
    northSouth: {
      players: ['player-1', 'player-3'],
      currentHandScore: 15,
      totalGameScore: 115,
      marks: 0,
      tricksWon: 0,
      isBiddingTeam: false
    },
    eastWest: {
      players: ['player-2', 'player-4'],
      currentHandScore: 20,
      totalGameScore: 145,
      marks: 0,
      tricksWon: 0,
      isBiddingTeam: false
    }
  },
  handNumber: 7,
  scoringState: {
    trickPoints: 0,
    countDominoes: [],
    bonusPoints: 0,
    penaltyPoints: 0,
    roundComplete: true,
    handScore: {
      handNumber: 7,
      countPoints: 20,
      trickPoints: 0,
      totalPoints: 20,
      biddingTeam: 'eastWest',
      winningBid: createCompatibleBid('player-2', 32, 'fives'),
      bidFulfilled: false,
      marksAwarded: 0,
      opposingMarksAwarded: 1
    }
  }
};

export const gameOverState: GameState = {
  ...emptyGameState,
  players: mockPlayers,
  phase: 'finished',
  partnerships: {
    northSouth: {
      players: ['player-1', 'player-3'],
      currentHandScore: 0,
      totalGameScore: 250,
      marks: 0,
      tricksWon: 0,
      isBiddingTeam: false
    },
    eastWest: {
      players: ['player-2', 'player-4'],
      currentHandScore: 0,
      totalGameScore: 185,
      marks: 0,
      tricksWon: 0,
      isBiddingTeam: false
    }
  },
  gameScore: { northSouth: 1, eastWest: 0 },
  handNumber: 12,
};

// Special states
export const disconnectedPlayerState: GameState = {
  ...playingStartState,
  players: mockPlayers.map((player, index) => ({
    ...player,
    isConnected: index !== 2, // South player disconnected
  })),
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