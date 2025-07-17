import { describe, it, expect } from 'vitest';
import {
  validateBid,
  isValidBidAmount,
  isValidTrumpSuit,
  getMinimumBid,
  canPlayerBid,
  shouldEndBidding,
  getNextBidder,
  BiddingValidationError,
  ExtendedBiddingState
} from '../biddingValidation';
import { DominoSuit, Player } from '@/types/texas42';

describe('Bidding Validation', () => {
  const players: Player[] = [
    { id: 'player1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'player2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'player3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'player4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ];

  const baseBiddingState: ExtendedBiddingState = {
    currentBidder: 'player1',
    currentBid: undefined,
    bidHistory: [],
    biddingComplete: false,
    passCount: 0,
    minimumBid: 30,
    bids: [],
    passes: [],
    highestBid: null,
    isComplete: false,
    winner: null
  };

  describe('validateBid', () => {
    it('validates a valid first bid', () => {
      const result = validateBid(30, 'sixes', baseBiddingState, 'player1');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects bid below minimum (30)', () => {
      const result = validateBid(25, 'sixes', baseBiddingState, 'player1');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(BiddingValidationError.BID_TOO_LOW);
    });

    it('rejects bid above maximum (42)', () => {
      const result = validateBid(45, 'sixes', baseBiddingState, 'player1');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(BiddingValidationError.BID_TOO_HIGH);
    });

    it('rejects bid not higher than current highest bid', () => {
      const stateWithBid: ExtendedBiddingState = {
        ...baseBiddingState,
        bids: [{ playerId: 'player2', amount: 35, trump: 'fives' }],
        bidHistory: [{ playerId: 'player2', amount: 35, trump: 'fives' }],
        highestBid: { playerId: 'player2', amount: 35, trump: 'fives' },
        currentBidder: 'player3'
      };

      const result = validateBid(35, 'sixes', stateWithBid, 'player3');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(BiddingValidationError.BID_NOT_HIGHER);
    });

    it('accepts bid higher than current highest bid', () => {
      const stateWithBid: ExtendedBiddingState = {
        ...baseBiddingState,
        bids: [{ playerId: 'player2', amount: 35, trump: 'fives' }],
        bidHistory: [{ playerId: 'player2', amount: 35, trump: 'fives' }],
        highestBid: { playerId: 'player2', amount: 35, trump: 'fives' },
        currentBidder: 'player3'
      };

      const result = validateBid(36, 'sixes', stateWithBid, 'player3');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects bid from wrong player', () => {
      const result = validateBid(30, 'sixes', baseBiddingState, 'player2');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(BiddingValidationError.NOT_CURRENT_BIDDER);
    });

    it('rejects bid with invalid trump suit', () => {
      const result = validateBid(30, 'invalid' as DominoSuit, baseBiddingState, 'player1');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(BiddingValidationError.INVALID_TRUMP_SUIT);
    });

    it('rejects bid when bidding is complete', () => {
      const completeBiddingState: ExtendedBiddingState = {
        ...baseBiddingState,
        isComplete: true,
        biddingComplete: true,
        winner: 'player1'
      };

      const result = validateBid(30, 'sixes', completeBiddingState, 'player1');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(BiddingValidationError.BIDDING_COMPLETE);
    });
  });

  describe('isValidBidAmount', () => {
    it('returns true for valid amounts (30-42)', () => {
      expect(isValidBidAmount(30)).toBe(true);
      expect(isValidBidAmount(35)).toBe(true);
      expect(isValidBidAmount(42)).toBe(true);
    });

    it('returns false for invalid amounts', () => {
      expect(isValidBidAmount(29)).toBe(false);
      expect(isValidBidAmount(43)).toBe(false);
      expect(isValidBidAmount(0)).toBe(false);
      expect(isValidBidAmount(-5)).toBe(false);
    });
  });

  describe('isValidTrumpSuit', () => {
    it('returns true for valid trump suits', () => {
      const validSuits: DominoSuit[] = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
      validSuits.forEach(suit => {
        expect(isValidTrumpSuit(suit)).toBe(true);
      });
    });

    it('returns false for invalid trump suits', () => {
      expect(isValidTrumpSuit('invalid' as DominoSuit)).toBe(false);
      expect(isValidTrumpSuit('' as DominoSuit)).toBe(false);
    });
  });

  describe('getMinimumBid', () => {
    it('returns 30 for first bid', () => {
      expect(getMinimumBid(baseBiddingState)).toBe(30);
    });

    it('returns highest bid + 1 when there are existing bids', () => {
      const stateWithBid: ExtendedBiddingState = {
        ...baseBiddingState,
        bids: [{ playerId: 'player2', amount: 35, trump: 'fives' }],
        bidHistory: [{ playerId: 'player2', amount: 35, trump: 'fives' }],
        highestBid: { playerId: 'player2', amount: 35, trump: 'fives' }
      };

      expect(getMinimumBid(stateWithBid)).toBe(36);
    });
  });

  describe('canPlayerBid', () => {
    it('returns true when player is current bidder', () => {
      expect(canPlayerBid('player1', baseBiddingState)).toBe(true);
    });

    it('returns false when player is not current bidder', () => {
      expect(canPlayerBid('player2', baseBiddingState)).toBe(false);
    });

    it('returns false when bidding is complete', () => {
      const completeBiddingState: ExtendedBiddingState = {
        ...baseBiddingState,
        isComplete: true,
        biddingComplete: true
      };

      expect(canPlayerBid('player1', completeBiddingState)).toBe(false);
    });
  });

  describe('shouldEndBidding', () => {
    it('returns false when no bids have been made', () => {
      expect(shouldEndBidding(baseBiddingState, players)).toBe(false);
    });

    it('returns false when not all players have had a chance to bid', () => {
      const stateWithOneBid: ExtendedBiddingState = {
        ...baseBiddingState,
        bids: [{ playerId: 'player1', amount: 30, trump: 'sixes' }],
        bidHistory: [{ playerId: 'player1', amount: 30, trump: 'sixes' }],
        highestBid: { playerId: 'player1', amount: 30, trump: 'sixes' },
        passes: ['player2'],
        currentBidder: 'player3'
      };

      expect(shouldEndBidding(stateWithOneBid, players)).toBe(false);
    });

    it('returns true when all players except one have passed', () => {
      const stateWithAllPassed: ExtendedBiddingState = {
        ...baseBiddingState,
        bids: [{ playerId: 'player1', amount: 30, trump: 'sixes' }],
        bidHistory: [{ playerId: 'player1', amount: 30, trump: 'sixes' }],
        highestBid: { playerId: 'player1', amount: 30, trump: 'sixes' },
        passes: ['player2', 'player3', 'player4'],
        currentBidder: 'player1'
      };

      expect(shouldEndBidding(stateWithAllPassed, players)).toBe(true);
    });

    it('returns true when all players have passed (no winner)', () => {
      const stateWithAllPassed: ExtendedBiddingState = {
        ...baseBiddingState,
        passes: ['player1', 'player2', 'player3', 'player4'],
        currentBidder: 'player1'
      };

      expect(shouldEndBidding(stateWithAllPassed, players)).toBe(true);
    });
  });

  describe('getNextBidder', () => {
    it('returns next player in turn order', () => {
      expect(getNextBidder('player1', players)).toBe('player2');
      expect(getNextBidder('player2', players)).toBe('player3');
      expect(getNextBidder('player3', players)).toBe('player4');
      expect(getNextBidder('player4', players)).toBe('player1');
    });

    it('handles invalid current bidder', () => {
      expect(getNextBidder('invalid', players)).toBe('player1');
    });

    it('handles empty players array', () => {
      expect(getNextBidder('player1', [])).toBe('player1');
    });
  });
});
