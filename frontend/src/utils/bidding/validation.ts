import { DominoSuit } from '@/types/texas42';
import { ExtendedBiddingState, BiddingValidationError, BidValidationResult } from './types';

/**
 * Validates a bid attempt
 */
export function validateBid(
  amount: number,
  trump: DominoSuit,
  biddingState: ExtendedBiddingState,
  playerId: string
): BidValidationResult {
  // Check if bidding is complete
  if (biddingState.isComplete) {
    return {
      isValid: false,
      error: BiddingValidationError.BIDDING_COMPLETE,
      message: 'Bidding has already ended'
    };
  }

  // Check if it's the player's turn to bid
  if (biddingState.currentBidder !== playerId) {
    return {
      isValid: false,
      error: BiddingValidationError.NOT_CURRENT_BIDDER,
      message: 'It is not your turn to bid'
    };
  }

  // Validate bid amount range
  if (!isValidBidAmount(amount)) {
    if (amount < 30) {
      return {
        isValid: false,
        error: BiddingValidationError.BID_TOO_LOW,
        message: 'Bid must be at least 30'
      };
    } else {
      return {
        isValid: false,
        error: BiddingValidationError.BID_TOO_HIGH,
        message: 'Bid cannot exceed 42'
      };
    }
  }

  // Validate trump suit
  if (!isValidTrumpSuit(trump)) {
    return {
      isValid: false,
      error: BiddingValidationError.INVALID_TRUMP_SUIT,
      message: 'Invalid trump suit selected'
    };
  }

  // Check if bid is higher than current highest bid
  const minimumBid = getMinimumBid(biddingState);
  if (amount < minimumBid) {
    return {
      isValid: false,
      error: BiddingValidationError.BID_NOT_HIGHER,
      message: `Bid must be at least ${minimumBid}`
    };
  }

  return {
    isValid: true
  };
}

/**
 * Checks if a bid amount is within valid range (30-42)
 */
export function isValidBidAmount(amount: number): boolean {
  return amount >= 30 && amount <= 42;
}

/**
 * Checks if a trump suit is valid
 */
export function isValidTrumpSuit(trump: DominoSuit): boolean {
  const validSuits: DominoSuit[] = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  return validSuits.includes(trump);
}

/**
 * Gets the minimum valid bid amount
 */
export function getMinimumBid(biddingState: ExtendedBiddingState): number {
  if (!biddingState.highestBid) {
    return 30; // Minimum starting bid
  }
  return biddingState.highestBid.amount + 1;
}

/**
 * Checks if a player can currently bid
 */
export function canPlayerBid(playerId: string, biddingState: ExtendedBiddingState): boolean {
  return !biddingState.isComplete && biddingState.currentBidder === playerId;
}

/**
 * Gets a human-readable error message for a validation error
 */
export function getValidationErrorMessage(error: BiddingValidationError): string {
  switch (error) {
    case BiddingValidationError.BID_TOO_LOW:
      return 'Bid must be at least 30';
    case BiddingValidationError.BID_TOO_HIGH:
      return 'Bid cannot exceed 42';
    case BiddingValidationError.BID_NOT_HIGHER:
      return 'Bid must be higher than the current highest bid';
    case BiddingValidationError.NOT_CURRENT_BIDDER:
      return 'It is not your turn to bid';
    case BiddingValidationError.INVALID_TRUMP_SUIT:
      return 'Please select a valid trump suit';
    case BiddingValidationError.BIDDING_COMPLETE:
      return 'Bidding has already ended';
    default:
      return 'Invalid bid';
  }
}