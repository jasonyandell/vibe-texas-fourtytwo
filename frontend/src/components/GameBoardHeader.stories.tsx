import type { Meta, StoryObj } from '@storybook/react';
import { GameBoardHeader } from './GameBoardHeader';
import { createEmptyGameState } from '@texas42/shared-types';
import { mockPlayers } from '@/stories/fixtures/players';
import { createCompatibleBid } from '@texas42/shared-types';

// Helper to create Partnership objects
const createPartnership = (
  players: [string, string],
  currentHandScore: number,
  tricksWon: number
) => ({
  players,
  currentHandScore,
  tricksWon,
  marks: 0,
  totalGameScore: 0,
  isBiddingTeam: false
});

const meta = {
  title: 'Game/GameBoardHeader',
  component: GameBoardHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', minWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GameBoardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state - bidding phase
 */
export const Default: Story = {
  args: {
    gameId: 'game-123',
    gameState: {
      ...createEmptyGameState('game-123'),
      phase: 'bidding',
      players: mockPlayers,
    },
  },
};

/**
 * Bidding phase with current bid
 */
export const BiddingPhase: Story = {
  args: {
    gameId: 'game-456',
    gameState: {
      ...createEmptyGameState('game-456'),
      phase: 'bidding',
      players: mockPlayers,
      currentBid: createCompatibleBid('player-2', 31, 'sixes'),
      dealer: 'player-1',
      currentPlayer: 'player-3',
    },
  },
};

/**
 * Playing phase with trump selected
 */
export const PlayingPhase: Story = {
  args: {
    gameId: 'game-789',
    gameState: {
      ...createEmptyGameState('game-789'),
      phase: 'playing',
      players: mockPlayers,
      currentBid: createCompatibleBid('player-3', 35, 'doubles'),
      trump: 'doubles',
      dealer: 'player-1',
      currentPlayer: 'player-2',
      partnerships: {
        northSouth: createPartnership(['player-1', 'player-3'], 15, 3),
        eastWest: createPartnership(['player-2', 'player-4'], 10, 2),
      },
      gameScore: { northSouth: 125, eastWest: 95 },
    },
  },
};

/**
 * Mid-game with scores
 */
export const WithScores: Story = {
  args: {
    gameId: 'game-scores',
    gameState: {
      ...createEmptyGameState('game-scores'),
      phase: 'playing',
      players: mockPlayers,
      handNumber: 5,
      partnerships: {
        northSouth: createPartnership(['player-1', 'player-3'], 25, 5),
        eastWest: createPartnership(['player-2', 'player-4'], 15, 2),
      },
      gameScore: { northSouth: 210, eastWest: 185 },
      currentBid: createCompatibleBid('player-1', 40, 'blanks'),
      trump: 'blanks',
    },
  },
};

/**
 * Near game completion
 */
export const NearGameEnd: Story = {
  args: {
    gameId: 'game-ending',
    gameState: {
      ...createEmptyGameState('game-ending'),
      phase: 'playing',
      players: mockPlayers,
      handNumber: 8,
      partnerships: {
        northSouth: createPartnership(['player-1', 'player-3'], 30, 6),
        eastWest: createPartnership(['player-2', 'player-4'], 12, 1),
      },
      gameScore: { northSouth: 245, eastWest: 220 },
      currentBid: createCompatibleBid('player-4', 42, 'fives'),
      trump: 'fives',
    },
  },
};

/**
 * Game complete state
 */
export const GameComplete: Story = {
  args: {
    gameId: 'game-complete',
    gameState: {
      ...createEmptyGameState('game-complete'),
      phase: 'finished',
      players: mockPlayers,
      handNumber: 9,
      partnerships: {
        northSouth: createPartnership(['player-1', 'player-3'], 35, 7),
        eastWest: createPartnership(['player-2', 'player-4'], 7, 0),
      },
      gameScore: { northSouth: 265, eastWest: 220 },
      gameComplete: true,
      winner: 'northSouth',
    },
  },
};

/**
 * Special contract - Nel-O
 */
export const SpecialContract: Story = {
  args: {
    gameId: 'game-special',
    gameState: {
      ...createEmptyGameState('game-special'),
      phase: 'playing',
      players: mockPlayers,
      specialContract: {
        type: 'nello',
        bidder: 'player-2',
        partner: 'player-4',
        requirements: ['Must take zero tricks'],
        scoringRules: ['42 points if successful', 'Opponents get 42 points if failed'],
        partnerParticipates: false
      },
      partnerships: {
        northSouth: createPartnership(['player-1', 'player-3'], 0, 0),
        eastWest: createPartnership(['player-2', 'player-4'], 10, 2),
      },
      gameScore: { northSouth: 180, eastWest: 160 },
    },
  },
};

/**
 * Disconnected player warning
 */
export const DisconnectedPlayer: Story = {
  args: {
    gameId: 'game-disconnect',
    gameState: {
      ...createEmptyGameState('game-disconnect'),
      phase: 'playing',
      players: mockPlayers.map((player, index) => ({
        ...player,
        isConnected: index !== 2, // Player 3 disconnected
      })),
      partnerships: {
        northSouth: createPartnership(['player-1', 'player-3'], 20, 4),
        eastWest: createPartnership(['player-2', 'player-4'], 15, 3),
      },
      gameScore: { northSouth: 150, eastWest: 140 },
      currentBid: createCompatibleBid('player-1', 35, 'threes'),
      trump: 'threes',
    },
  },
};