import type { Meta, StoryObj } from '@storybook/react';
import { GameBoard } from './GameBoard';
import { GameState, createEmptyGameState, Player } from '@texas42/shared-types';
import { createDomino } from '@/types/domino';

const meta = {
  title: 'Game/GameBoard',
  component: GameBoard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GameBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create a complete player set
const createPlayers = (names: string[] = ['Alice', 'Bob', 'Charlie', 'Diana']): Player[] => {
  const positions = ['north', 'east', 'south', 'west'] as const;
  return names.map((name, index) => ({
    id: `player-${index + 1}`,
    name,
    position: positions[index],
    hand: [],
    isConnected: true,
    isReady: true,
  }));
};

// Helper to create a game state with players
const createGameStateWithPlayers = (overrides?: Partial<GameState>): GameState => {
  const state = createEmptyGameState('test-game-123');
  state.players = createPlayers();
  state.dealer = 'player-1';
  state.currentPlayer = 'player-2';
  state.createdAt = new Date().toISOString();
  state.updatedAt = new Date().toISOString();
  
  return { ...state, ...overrides };
};

/**
 * Default empty board state - no game loaded yet
 */
export const Default: Story = {
  args: {
    gameState: undefined,
  },
};

/**
 * Active game with all players connected and in bidding phase
 */
export const ActiveGame: Story = {
  args: {
    gameState: createGameStateWithPlayers({
      phase: 'bidding',
      currentBid: { playerId: 'player-1', amount: 30, trump: 'threes', isSpecialContract: false, timestamp: new Date().toISOString() },
      biddingState: {
        currentBidder: 'player-3',
        minimumBid: 31,
        bidHistory: [
          { playerId: 'player-1', amount: 30, trump: 'threes', isSpecialContract: false, timestamp: new Date().toISOString() },
        ],
        consecutivePasses: 1
      },
    }),
    currentPlayerId: 'player-3',
  },
};

/**
 * Game with trick in progress showing dominoes on the board
 */
export const TrickInProgress: Story = {
  args: {
    gameState: (() => {
      const state = createGameStateWithPlayers({
        phase: 'playing',
        currentPlayer: 'player-3',
      });
      
      // Add dominoes to current trick
      state.currentTrick = {
        id: 'trick-1',
        dominoes: [
          { domino: createDomino(4, 2), playerId: 'player-1', position: 'north', playOrder: 0, timestamp: new Date().toISOString() },
          { domino: createDomino(4, 5), playerId: 'player-2', position: 'east', playOrder: 1, timestamp: new Date().toISOString() },
        ],
        pointValue: 0,
        countDominoes: [],
        wonBy: null,
        leadDomino: createDomino(4, 2)
      };
      
      // Give players hands with some dominoes
      state.players = state.players.map((player, index) => ({
        ...player,
        hand: [
          createDomino(6, index),
          createDomino(5, index),
          createDomino(3, index),
          createDomino(2, index),
          createDomino(1, index),
        ],
      }));
      
      return state;
    })(),
    currentPlayerId: 'player-3',
    onDominoPlay: (dominoId) => console.log('Playing domino:', dominoId),
  },
};

/**
 * Completed game showing final scores
 */
export const GameComplete: Story = {
  args: {
    gameState: createGameStateWithPlayers({
      phase: 'finished',
      scores: {
        northSouth: 250,
        eastWest: 185,
      },
      winner: 'northSouth',
      completedTricks: 7,
    }),
    currentPlayerId: 'player-1',
  },
};

/**
 * Waiting for players to join (incomplete game)
 */
export const WaitingForPlayers: Story = {
  args: {
    gameState: (() => {
      const state = createEmptyGameState('test-game-123');
      state.players = [
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
          isReady: false,
        },
      ];
      return state;
    })(),
    currentPlayerId: 'player-1',
  },
};

/**
 * Spectator mode - viewing game without being a player
 */
export const SpectatorMode: Story = {
  args: {
    gameState: createGameStateWithPlayers({
      phase: 'playing',
      currentPlayer: 'player-2',
    }),
    isSpectatorMode: true,
  },
};

/**
 * Player disconnected state
 */
export const PlayerDisconnected: Story = {
  args: {
    gameState: (() => {
      const state = createGameStateWithPlayers({
        phase: 'playing',
        currentPlayer: 'player-2',
      });
      
      // Disconnect one player
      state.players[3] = { ...state.players[3], isConnected: false };
      
      return state;
    })(),
    currentPlayerId: 'player-1',
  },
};

/**
 * Bidding phase with multiple bids
 */
export const BiddingPhase: Story = {
  args: {
    gameState: createGameStateWithPlayers({
      phase: 'bidding',
      currentPlayer: 'player-3',
      currentBid: { playerId: 'player-2', amount: 31, trump: 'fives', isSpecialContract: false, timestamp: new Date().toISOString() },
      biddingState: {
        currentBidder: 'player-3',
        minimumBid: 32,
        bidHistory: [
          { playerId: 'player-1', amount: 30, trump: 'threes', isSpecialContract: false, timestamp: new Date().toISOString() },
          { playerId: 'player-2', amount: 31, trump: 'fives', isSpecialContract: false, timestamp: new Date().toISOString() },
        ],
        consecutivePasses: 0
      },
    }),
    currentPlayerId: 'player-3',
  },
};

/**
 * Full trick with winner highlighted
 */
export const CompletedTrick: Story = {
  args: {
    gameState: (() => {
      const state = createGameStateWithPlayers({
        phase: 'playing',
        currentPlayer: 'player-1', // Next trick about to start
      });
      
      // Show completed trick
      state.currentTrick = {
        id: 'trick-1',
        dominoes: [
          { domino: createDomino(6, 2), playerId: 'player-1', position: 'north', playOrder: 0, timestamp: new Date().toISOString() },
          { domino: createDomino(6, 4), playerId: 'player-2', position: 'east', playOrder: 1, timestamp: new Date().toISOString() }, // count domino
          { domino: createDomino(6, 6), playerId: 'player-3', position: 'south', playOrder: 2, timestamp: new Date().toISOString() }, // winner
          { domino: createDomino(6, 1), playerId: 'player-4', position: 'west', playOrder: 3, timestamp: new Date().toISOString() },
        ],
        pointValue: 5,
        countDominoes: [createDomino(6, 4)],
        wonBy: 'player-3',
        leadDomino: createDomino(6, 2)
      };
      
      return state;
    })(),
    currentPlayerId: 'player-1',
  },
};

/**
 * Mobile-responsive view
 */
export const MobileView: Story = {
  args: {
    gameState: createGameStateWithPlayers({
      phase: 'playing',
      currentPlayer: 'player-3',
    }),
    currentPlayerId: 'player-3',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};