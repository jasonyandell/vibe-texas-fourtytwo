import { BiddingState } from '@texas42/shared-types';
import { ExtendedBiddingState } from '@/utils/biddingValidation';

/**
 * Convert the existing BiddingState to ExtendedBiddingState for validation
 */
export function convertToExtendedBiddingState(
  biddingState: BiddingState | undefined,
  currentBidder?: string
): ExtendedBiddingState {
  if (!biddingState) {
    return {
      currentBidder,
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
  }

  // Find the highest bid from bidHistory
  const highestBid = biddingState.bidHistory.length > 0 
    ? biddingState.bidHistory.reduce((highest, bid) => 
        bid.amount > (highest?.amount || 0) ? bid : highest
      )
    : null;

  // Calculate passes from passCount (simplified approach)
  const passes: string[] = [];
  for (let i = 0; i < biddingState.passCount; i++) {
    passes.push(`pass_${i}`); // Placeholder - in real implementation, track actual player IDs
  }

  return {
    currentBidder: biddingState.currentBidder || currentBidder,
    currentBid: biddingState.currentBid,
    bidHistory: biddingState.bidHistory,
    biddingComplete: biddingState.biddingComplete,
    passCount: biddingState.passCount,
    minimumBid: biddingState.minimumBid,
    bids: biddingState.bidHistory, // Use bidHistory as bids
    passes,
    highestBid,
    isComplete: biddingState.biddingComplete,
    winner: highestBid?.playerId || null
  };
}