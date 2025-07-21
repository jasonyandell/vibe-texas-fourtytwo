import { Bid, createCompatibleBid, createCompatibleBiddingState } from '@texas42/shared-types';
import { ExtendedBiddingState } from '@/utils/biddingValidation';

export function convertBidHistory(bidHistory: ExtendedBiddingState['bidHistory']): Bid[] {
  return bidHistory.map(oldBid =>
    createCompatibleBid(oldBid.playerId, oldBid.amount, oldBid.trump)
  );
}

export function convertCurrentBid(currentBid: ExtendedBiddingState['currentBid']): Bid | undefined {
  if (!currentBid) return undefined;
  return createCompatibleBid(currentBid.playerId, currentBid.amount, currentBid.trump);
}

export function convertHighestBid(highestBid: ExtendedBiddingState['highestBid']): Bid | undefined {
  if (!highestBid) return undefined;
  return createCompatibleBid(highestBid.playerId, highestBid.amount, highestBid.trump);
}

export function createStandardBiddingState(
  updatedBiddingState: ExtendedBiddingState,
  biddingState: ExtendedBiddingState,
  newBid?: Bid,
  isPass?: boolean
) {
  const convertedBidHistory = convertBidHistory(biddingState.bidHistory);
  
  if (isPass) {
    return createCompatibleBiddingState({
      currentBidder: updatedBiddingState.currentBidder,
      currentBid: convertCurrentBid(biddingState.currentBid),
      bidHistory: convertedBidHistory,
      biddingComplete: updatedBiddingState.isComplete,
      passCount: biddingState.passCount + 1,
      minimumBid: biddingState.minimumBid
    });
  }
  
  return createCompatibleBiddingState({
    currentBidder: updatedBiddingState.currentBidder,
    currentBid: newBid,
    bidHistory: [...convertedBidHistory, newBid!],
    biddingComplete: updatedBiddingState.isComplete,
    passCount: biddingState.passCount,
    minimumBid: updatedBiddingState.isComplete ? biddingState.minimumBid : newBid!.amount + 1
  });
}