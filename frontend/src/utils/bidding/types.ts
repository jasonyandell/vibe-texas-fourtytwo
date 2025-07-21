import { Bid } from '@/types/texas42';

// Extended bidding state for validation (matches the existing interface but with additional fields)
export interface ExtendedBiddingState {
  currentBidder?: string;
  currentBid?: Bid;
  bidHistory: Bid[];
  biddingComplete: boolean;
  passCount: number;
  minimumBid: number;
  // Additional fields for validation
  bids: Bid[];
  passes: string[];
  highestBid: Bid | null;
  isComplete: boolean;
  winner: string | null;
}

export enum BiddingValidationError {
  BID_TOO_LOW = 'BID_TOO_LOW',
  BID_TOO_HIGH = 'BID_TOO_HIGH',
  BID_NOT_HIGHER = 'BID_NOT_HIGHER',
  NOT_CURRENT_BIDDER = 'NOT_CURRENT_BIDDER',
  INVALID_TRUMP_SUIT = 'INVALID_TRUMP_SUIT',
  BIDDING_COMPLETE = 'BIDDING_COMPLETE'
}

export interface BidValidationResult {
  isValid: boolean;
  error?: BiddingValidationError;
  message?: string;
}