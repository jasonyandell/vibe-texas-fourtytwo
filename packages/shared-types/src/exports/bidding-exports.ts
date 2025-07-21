/**
 * Bidding System Types and Utilities Export Module
 * Centralizes all bidding-related exports
 */

// Type exports
export type {
  SpecialContractType,
  Bid,
  SpecialContract,
  BidValidationResult
} from '../bidding';

// Utility exports
export {
  BiddingValidationError,
  createPassBid,
  createRegularBid,
  createMarkBid,
  createSpecialContractBid,
  getSpecialContractAmount,
  convertBidToMarks,
  convertMarksToBid,
  validateBid,
  validateSpecialContract,
  isPassBid,
  isMarkBid,
  getMinimumBidAmount,
  BIDDING_CONSTANTS
} from '../bidding';

// Bidding state exports
export type {
  BiddingState
} from '../bidding-state';

export {
  createEmptyBiddingState
} from '../bidding-state';