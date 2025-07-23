import type { Meta, StoryObj } from '@storybook/react';
import { GameBoardCenter } from './GameBoardCenter';
import { GameState, createEmptyGameState } from '@texas42/shared-types';
import { Player } from '@/types/player';
import { createDomino } from '@/types/domino';

const meta = {
  title: 'Game/GameBoardCenter',
  component: GameBoardCenter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ 
        width: '600px',
        minHeight: '400px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GameBoardCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create players
const createPlayers = (): Player[] => [
  {
    id: 'player-1',
    name: 'Alice',
    position: 'north',
    hand: [],
    isConnected: true,
    isReady: true,
  },
  {
    id: 'player-2',
    name: 'Bob',
    position: 'east',
    hand: [],
    isConnected: true,
    isReady: true,
  },
  {
    id: 'player-3',
    name: 'Charlie',
    position: 'south',
    hand: [],
    isConnected: true,
    isReady: true,
  },
  {
    id: 'player-4',
    name: 'Diana',
    position: 'west',
    hand: [],
    isConnected: true,
    isReady: true,
  },
];

// Helper to create a game state
const createGameState = (overrides?: Partial<GameState>): GameState => {
  const state = createEmptyGameState('test-game-123');
  state.players = createPlayers();
  state.dealer = 'player-1';
  state.currentPlayer = 'player-2';
  
  return { ...state, ...overrides };
};

/**
 * Empty trick - waiting for first play
 */
export const EmptyTrick: Story = {
  args: {
    gameState: createGameState({
      phase: 'playing',
      currentPlayer: 'player-1',
      currentTrick: {
        id: 'trick-1',
        dominoes: [],
        pointValue: 0,
        countDominoes: [],
        trickNumber: 1,
        isComplete: false,
      },
    }),
    currentPlayerId: 'player-3',
    onBid: (amount, trump) => console.log('Bid:', amount, trump),
    onPass: () => console.log('Pass'),
  },
};

/**
 * Partial trick with 1-3 dominoes played
 */
export const PartialTrick: Story = {
  args: {
    gameState: createGameState({
      phase: 'playing',
      currentPlayer: 'player-3',
      leadSuit: 'fours',
      currentTrick: {
        id: 'trick-1',
        dominoes: [
          {
            domino: createDomino(4, 2),
            playerId: 'player-1',
            position: 'north',
            playOrder: 0,
            timestamp: new Date().toISOString(),
          },
          {
            domino: createDomino(4, 5),
            playerId: 'player-2',
            position: 'east',
            playOrder: 1,
            timestamp: new Date().toISOString(),
          },
        ],
        pointValue: 0,
        countDominoes: [],
        trickNumber: 1,
        isComplete: false,
      },
    }),
    currentPlayerId: 'player-3',
    onBid: (amount, trump) => console.log('Bid:', amount, trump),
    onPass: () => console.log('Pass'),
  },
};

/**
 * Complete trick with all 4 dominoes
 */
export const CompleteTrick: Story = {
  args: {
    gameState: createGameState({
      phase: 'playing',
      currentPlayer: 'player-3', // Winner, will lead next trick
      leadSuit: 'sixes',
      currentTrick: {
        id: 'trick-1',
        dominoes: [
          {
            domino: createDomino(6, 2),
            playerId: 'player-1',
            position: 'north',
            playOrder: 0,
            timestamp: new Date().toISOString(),
          },
          {
            domino: createDomino(6, 4), // Count domino!
            playerId: 'player-2',
            position: 'east',
            playOrder: 1,
            timestamp: new Date().toISOString(),
          },
          {
            domino: createDomino(6, 6), // Double six wins
            playerId: 'player-3',
            position: 'south',
            playOrder: 2,
            timestamp: new Date().toISOString(),
          },
          {
            domino: createDomino(6, 1),
            playerId: 'player-4',
            position: 'west',
            playOrder: 3,
            timestamp: new Date().toISOString(),
          },
        ],
        winner: 'player-3',
        pointValue: 10, // 6-4 is worth 10
        countDominoes: [createDomino(6, 4)],
        trickNumber: 3,
        isComplete: true,
      },
    }),
    currentPlayerId: 'player-1',
    onBid: (amount, trump) => console.log('Bid:', amount, trump),
    onPass: () => console.log('Pass'),
  },
};

/**
 * Trick with winning domino highlighted
 * Shows a trick with multiple count dominoes
 */
export const WinningDomino: Story = {
  args: {
    gameState: createGameState({
      phase: 'playing',
      currentPlayer: 'player-2',
      leadSuit: 'fives',
      currentTrick: {
        id: 'trick-4',
        dominoes: [
          {
            domino: createDomino(5, 0), // Count domino - 5 points
            playerId: 'player-1',
            position: 'north',
            playOrder: 0,
            timestamp: new Date().toISOString(),
          },
          {
            domino: createDomino(5, 5), // Double five trumps - 10 points!
            playerId: 'player-2',
            position: 'east',
            playOrder: 1,
            timestamp: new Date().toISOString(),
          },
          {
            domino: createDomino(5, 3),
            playerId: 'player-3',
            position: 'south',
            playOrder: 2,
            timestamp: new Date().toISOString(),
          },
          {
            domino: createDomino(5, 2),
            playerId: 'player-4',
            position: 'west',
            playOrder: 3,
            timestamp: new Date().toISOString(),
          },
        ],
        winner: 'player-2',
        pointValue: 15, // 5-0 (5) + 5-5 (10) = 15 points!
        countDominoes: [createDomino(5, 0), createDomino(5, 5)],
        trickNumber: 4,
        isComplete: true,
      },
    }),
    currentPlayerId: 'player-2',
    onBid: (amount, trump) => console.log('Bid:', amount, trump),
    onPass: () => console.log('Pass'),
  },
};

/**
 * Bidding phase - shows bidding panel instead of trick
 */
export const BiddingPhase: Story = {
  args: {
    gameState: createGameState({
      phase: 'bidding',
      currentPlayer: 'player-3',
      currentBid: { playerId: 'player-2', amount: 31, trump: 'fives' },
      biddingState: {
        minimumBid: 32,
        currentBid: { playerId: 'player-2', amount: 31, trump: 'fives' },
        passes: ['player-1'],
        bidHistory: [
          { playerId: 'player-1', amount: 30, trump: 'threes' },
          { playerId: 'player-2', amount: 31, trump: 'fives' },
          { playerId: 'player-1', amount: 0 }, // Pass
        ],
      },
    }),
    currentPlayerId: 'player-3',
    onBid: (amount, trump) => console.log('Bid:', amount, trump),
    onPass: () => console.log('Pass'),
  },
};

/**
 * Interactive bidding - current player can bid
 */
export const InteractiveBidding: Story = {
  args: {
    gameState: createGameState({
      phase: 'bidding',
      currentPlayer: 'player-1',
      currentBid: { playerId: 'player-4', amount: 30, trump: 'ones' },
      biddingState: {
        minimumBid: 31,
        currentBid: { playerId: 'player-4', amount: 30, trump: 'ones' },
        passes: [],
        bidHistory: [
          { playerId: 'player-4', amount: 30, trump: 'ones' },
        ],
      },
    }),
    currentPlayerId: 'player-1', // Current player can interact
    onBid: (amount, trump) => alert(`You bid ${amount} with ${trump} as trump!`),
    onPass: () => alert('You passed!'),
  },
};

/**
 * Trump play scenario
 */
export const TrumpPlay: Story = {
  args: {
    gameState: createGameState({
      phase: 'playing',
      currentPlayer: 'player-4',
      leadSuit: 'threes',
      trump: 'sixes', // Sixes are trump
      currentTrick: {
        id: 'trick-5',
        dominoes: [
          {
            domino: createDomino(3, 2), // Count domino led
            playerId: 'player-1',
            position: 'north',
            playOrder: 0,
            timestamp: new Date().toISOString(),
          },
          {
            domino: createDomino(3, 1),
            playerId: 'player-2',
            position: 'east',
            playOrder: 1,
            timestamp: new Date().toISOString(),
          },
          {
            domino: createDomino(6, 0), // Trump played!
            playerId: 'player-3',
            position: 'south',
            playOrder: 2,
            timestamp: new Date().toISOString(),
          },
        ],
        pointValue: 5, // 3-2 is worth 5
        countDominoes: [createDomino(3, 2)],
        trickNumber: 5,
        isComplete: false,
      },
    }),
    currentPlayerId: 'player-4',
    onBid: (amount, trump) => console.log('Bid:', amount, trump),
    onPass: () => console.log('Pass'),
  },
};