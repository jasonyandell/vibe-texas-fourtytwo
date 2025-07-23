import type { Meta, StoryObj } from '@storybook/react';
import { BiddingHistory } from './BiddingHistory';
import { mockPlayers } from '@/stories/fixtures/players';
import { Bid, DominoSuit } from '@/types/texas42';

// Helper function to create valid Bid objects
const createBid = (
  playerId: string, 
  amount: number, 
  trump?: DominoSuit
): Bid => ({
  playerId,
  amount,
  trump
});

const meta = {
  title: 'Game/BiddingHistory',
  component: BiddingHistory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', minWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BiddingHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Empty history - no bids yet
 */
export const EmptyHistory: Story = {
  args: {
    bidHistory: [],
    players: mockPlayers,
  },
};

/**
 * Single bid in the history
 */
export const SingleBid: Story = {
  args: {
    bidHistory: [
      createBid('player-1', 30, 'fives')
    ],
    players: mockPlayers,
  },
};

/**
 * Multiple bids showing progression
 */
export const MultipleBids: Story = {
  args: {
    bidHistory: [
      createBid('player-1', 30, 'fives'),
      createBid('player-2', 31, 'sixes'),
      createBid('player-3', 33, 'doubles'),
      createBid('player-4', 35, 'blanks'),
    ],
    players: mockPlayers,
  },
};

/**
 * History with passes
 */
export const WithPasses: Story = {
  args: {
    bidHistory: [
      createBid('player-1', 30, 'threes'),
      createBid('player-2', 0), // Pass
      createBid('player-3', 31, 'fours'),
      createBid('player-4', 0), // Pass
      createBid('player-1', 32, 'threes'),
    ],
    players: mockPlayers,
  },
};

/**
 * All players pass - no winner
 */
export const AllPlayersPass: Story = {
  args: {
    bidHistory: [
      createBid('player-1', 0),
      createBid('player-2', 0),
      createBid('player-3', 0),
      createBid('player-4', 0),
    ],
    players: mockPlayers,
  },
};

/**
 * High bid scenario - approaching 42
 */
export const HighBidding: Story = {
  args: {
    bidHistory: [
      createBid('player-1', 35, 'sixes'),
      createBid('player-2', 36, 'doubles'),
      createBid('player-3', 0), // Pass
      createBid('player-4', 40, 'blanks'),
      createBid('player-1', 41, 'sixes'),
      createBid('player-2', 42, 'doubles'),
    ],
    players: mockPlayers,
  },
};

/**
 * Long bidding sequence
 */
export const LongBiddingWar: Story = {
  args: {
    bidHistory: [
      createBid('player-1', 30, 'ones'),
      createBid('player-2', 31, 'twos'),
      createBid('player-3', 32, 'threes'),
      createBid('player-4', 33, 'fours'),
      createBid('player-1', 34, 'ones'),
      createBid('player-2', 35, 'twos'),
      createBid('player-3', 0), // Pass
      createBid('player-4', 36, 'fours'),
      createBid('player-1', 37, 'ones'),
      createBid('player-2', 0), // Pass
      createBid('player-4', 38, 'fours'),
      createBid('player-1', 39, 'ones'),
    ],
    players: mockPlayers,
  },
};

import { useState } from 'react';

/**
 * Interactive bidding history that updates
 */
export const InteractiveBidding: Story = {
  args: {
    bidHistory: [],
    players: mockPlayers,
  },
  render: function BiddingHistoryWithUpdates(args) {
    const [bidHistory, setBidHistory] = useState<Bid[]>([]);
    
    const addBid = (playerId: string, amount: number, trump?: DominoSuit) => {
      setBidHistory(prev => [...prev, createBid(playerId, amount, trump)]);
    };
    
    const clearHistory = () => setBidHistory([]);
    
    return (
      <div>
        <BiddingHistory
          bidHistory={bidHistory}
          players={args.players}
        />
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => addBid('player-1', 30, 'fives')}>
            Alice bids 30 (Fives)
          </button>
          <button onClick={() => addBid('player-2', 31, 'sixes')}>
            Bob bids 31 (Sixes)
          </button>
          <button onClick={() => addBid('player-3', 0)}>
            Charlie passes
          </button>
          <button onClick={() => addBid('player-4', 35, 'doubles')}>
            Diana bids 35 (Doubles)
          </button>
          <button onClick={clearHistory} style={{ marginLeft: 'auto' }}>
            Clear History
          </button>
        </div>
      </div>
    );
  },
};