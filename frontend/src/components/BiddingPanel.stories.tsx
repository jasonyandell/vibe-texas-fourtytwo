import type { Meta, StoryObj } from '@storybook/react';
import { BiddingPanel } from './BiddingPanel';
import { useState } from 'react';
import { DominoSuit, Bid } from '@/types/texas42';

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
  title: 'Game/BiddingPanel',
  component: BiddingPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isCurrentPlayer: {
      control: { type: 'boolean' },
      description: 'Whether it is the current player\'s turn to bid',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the panel should be disabled',
    },
    minimumBid: {
      control: { type: 'number', min: 30, max: 42 },
      description: 'The minimum allowed bid amount',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', minWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BiddingPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state - player's turn to bid with no current bid
 */
export const Default: Story = {
  args: {
    currentBid: null,
    currentBidder: 'player-1',
    isCurrentPlayer: true,
    minimumBid: 30,
    onBid: (amount, trump) => console.log('Bid placed:', amount, trump),
    onPass: () => console.log('Player passed'),
  },
};

/**
 * Not the player's turn - controls should be disabled
 */
export const NotPlayerTurn: Story = {
  args: {
    currentBid: createBid('player-2', 31, 'fives'),
    currentBidder: 'player-2',
    isCurrentPlayer: false,
    minimumBid: 32,
    onBid: (amount, trump) => console.log('Bid placed:', amount, trump),
    onPass: () => console.log('Player passed'),
  },
};

/**
 * Minimum bid scenario - player must bid at least 30
 */
export const MinimumBid: Story = {
  args: {
    currentBid: null,
    currentBidder: 'player-1',
    isCurrentPlayer: true,
    minimumBid: 30,
    onBid: (amount, trump) => console.log('Bid placed:', amount, trump),
    onPass: () => console.log('Player passed'),
  },
};

/**
 * Maximum bid scenario - approaching 42
 */
export const MaximumBid: Story = {
  args: {
    currentBid: createBid('player-3', 41, 'sixes'),
    currentBidder: 'player-1',
    isCurrentPlayer: true,
    minimumBid: 42,
    onBid: (amount, trump) => console.log('Bid placed:', amount, trump),
    onPass: () => console.log('Player passed'),
  },
};

/**
 * With current bid - player must bid higher
 */
export const WithCurrentBid: Story = {
  args: {
    currentBid: createBid('player-2', 33, 'threes'),
    currentBidder: 'player-1',
    isCurrentPlayer: true,
    minimumBid: 34,
    onBid: (amount, trump) => console.log('Bid placed:', amount, trump),
    onPass: () => console.log('Player passed'),
  },
};

/**
 * Interactive bidding panel with state management
 */
export const WithTrumpSelection: Story = {
  args: {
    currentBid: null,
    currentBidder: 'player-1',
    isCurrentPlayer: true,
    minimumBid: 30,
    onBid: () => {},
    onPass: () => {},
  },
  render: function BiddingPanelWithState(_args) {
    const [currentBid, setCurrentBid] = useState<Bid | null>(null);
    const [bidHistory, setBidHistory] = useState<string[]>([]);
    
    const handleBid = (amount: number, trump: DominoSuit) => {
      const newBid = createBid('player-1', amount, trump);
      setCurrentBid(newBid);
      setBidHistory([...bidHistory, `Player bid ${amount} with ${trump} as trump`]);
    };
    
    const handlePass = () => {
      setBidHistory([...bidHistory, 'Player passed']);
    };
    
    return (
      <div>
        <BiddingPanel
          currentBid={currentBid}
          currentBidder="player-1"
          isCurrentPlayer={true}
          minimumBid={currentBid ? currentBid.amount + 1 : 30}
          onBid={handleBid}
          onPass={handlePass}
        />
        <div style={{ marginTop: '20px', fontSize: '14px' }}>
          <h4>Bid History:</h4>
          {bidHistory.length === 0 ? (
            <p>No bids yet</p>
          ) : (
            <ul>
              {bidHistory.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
};

/**
 * Disabled state - all controls disabled
 */
export const Disabled: Story = {
  args: {
    currentBid: createBid('player-2', 35, 'doubles'),
    currentBidder: 'player-1',
    isCurrentPlayer: true,
    minimumBid: 36,
    disabled: true,
    onBid: (amount, trump) => console.log('Bid placed:', amount, trump),
    onPass: () => console.log('Player passed'),
  },
};