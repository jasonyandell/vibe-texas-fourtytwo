import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BiddingHistory } from '../BiddingHistory';
import { Bid, Player } from '@/types/texas42';

describe('BiddingHistory', () => {
  const mockPlayers: Player[] = [
    { id: 'player-1', name: 'Alice', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'player-2', name: 'Bob', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'player-3', name: 'Charlie', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'player-4', name: 'Diana', position: 'west', hand: [], isConnected: true, isReady: true }
  ];

  const defaultProps = {
    bidHistory: [],
    players: mockPlayers
  };

  describe('Empty State', () => {
    it('renders empty state when no bids', () => {
      render(<BiddingHistory {...defaultProps} />);
      
      expect(screen.getByTestId('bidding-history')).toBeInTheDocument();
      expect(screen.getByText('Bidding History')).toBeInTheDocument();
      expect(screen.getByText('No bids yet')).toBeInTheDocument();
    });
  });

  describe('Bid Display', () => {
    it('displays bid history with player names and amounts', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 30, trump: 'sixes' },
        { playerId: 'player-2', amount: 0 }, // Pass
        { playerId: 'player-3', amount: 35, trump: 'doubles' }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('Sixes')).toBeInTheDocument();
      
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Pass')).toBeInTheDocument();
      
      expect(screen.getByText('Charlie')).toBeInTheDocument();
      expect(screen.getByText('35')).toBeInTheDocument();
      expect(screen.getByText('Doubles')).toBeInTheDocument();
    });

    it('shows bid count in header', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 30, trump: 'sixes' },
        { playerId: 'player-2', amount: 0 }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      expect(screen.getByText('2 bids')).toBeInTheDocument();
    });

    it('shows singular bid count for single bid', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 30, trump: 'sixes' }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      expect(screen.getByText('1 bid')).toBeInTheDocument();
    });

    it('displays bid order numbers', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 30, trump: 'sixes' },
        { playerId: 'player-2', amount: 35, trump: 'doubles' }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
    });
  });

  describe('Bid Summary', () => {
    it('shows highest bid summary', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 30, trump: 'sixes' },
        { playerId: 'player-2', amount: 0 }, // Pass
        { playerId: 'player-3', amount: 35, trump: 'doubles' }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      expect(screen.getByText(/High bid: 35 \(Doubles\) by Charlie/)).toBeInTheDocument();
    });

    it('shows all players passed when no valid bids', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 0 },
        { playerId: 'player-2', amount: 0 }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      expect(screen.getByText('All players passed')).toBeInTheDocument();
    });
  });

  describe('Bid Type Styling', () => {
    it('applies correct CSS classes for different bid types', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 30, trump: 'sixes' }, // Normal bid
        { playerId: 'player-2', amount: 0 }, // Pass
        { playerId: 'player-3', amount: 42, trump: 'doubles' } // High bid
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);

      const bidItems = screen.getAllByTestId(/bid-item-/);
      // Check that the CSS module classes are applied (they will have hashed names)
      expect(bidItems[0].className).toMatch(/normalBid/);
      expect(bidItems[1].className).toMatch(/passBid/);
      expect(bidItems[2].className).toMatch(/highBid/);
    });
  });

  describe('Player Name Handling', () => {
    it('handles unknown player IDs gracefully', () => {
      const bidHistory: Bid[] = [
        { playerId: 'unknown-player', amount: 30, trump: 'sixes' }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      expect(screen.getByText('Unknown Player')).toBeInTheDocument();
    });
  });

  describe('Trump Suit Formatting', () => {
    it('capitalizes trump suit names', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 30, trump: 'sixes' }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      expect(screen.getByText('Sixes')).toBeInTheDocument();
    });

    it('does not show trump suit for passes', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 0 }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      const bidItem = screen.getByTestId('bid-item-0');
      expect(bidItem).not.toHaveTextContent('trump');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 30, trump: 'sixes' }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      expect(screen.getByRole('list', { name: 'Bidding history' })).toBeInTheDocument();
      expect(screen.getByRole('listitem')).toBeInTheDocument();
    });

    it('provides proper test IDs for testing', () => {
      const bidHistory: Bid[] = [
        { playerId: 'player-1', amount: 30, trump: 'sixes' },
        { playerId: 'player-2', amount: 35, trump: 'doubles' }
      ];

      render(<BiddingHistory {...defaultProps} bidHistory={bidHistory} />);
      
      expect(screen.getByTestId('bidding-history')).toBeInTheDocument();
      expect(screen.getByTestId('bid-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('bid-item-1')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<BiddingHistory {...defaultProps} className="custom-class" />);
      
      const component = screen.getByTestId('bidding-history');
      expect(component).toHaveClass('custom-class');
    });
  });
});
